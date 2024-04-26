import pytest
from unittest.mock import patch
import os
os.chdir("..")
import sys
sys.path.append("classification")
import model

import matplotlib.pyplot as plt
import numpy as np
import random
import torch
from PIL import Image
import json

@pytest.fixture(scope='module')
def test_images():
    # Save 5 randomly dimensioned images for testing
    images = []
    for i in range(5):
        noise = np.random.rand(random.randint(100, 1000), random.randint(100, 1000), 3)
        plt.imshow(noise, cmap='gray')
        plt.axis('off')
        plt.savefig(f'noise_{i}.png', bbox_inches='tight', pad_inches=0) 
        images.append(f'noise_{i}.png')
    yield images
    # Teardown: delete the images
    for img in images:
        os.remove(img)
        if os.path.exists(f"heatmap_{img}"):
            os.remove(f"heatmap_{img}")

@pytest.fixture
def mock_generate_heatmap():
    # Mock generate_heatmap to avoid actual file generation
    with patch('model.generate_heatmap') as mock_gen_heatmap:
        yield mock_gen_heatmap

@pytest.fixture
def mock_os_path_exists():
    # Mock os.path.exists to always return True
    with patch('os.path.exists', return_value=True):
        yield

@pytest.fixture
def mock_get_id():
    # Mocking the model function to get patient id from a path
    with patch("model._get_id_from_path", return_value="id") as mock_get_id:
        yield mock_get_id

def test_load_image(test_images):
    # Testing that the image loader function works
    for image_path in test_images:
        result = model._load_image(image_path)
        print(result.shape)
        assert isinstance(result, torch.Tensor)
        assert result.shape[0] == 3
        assert result.shape[1] == 224
        assert result.shape[2] == 224

def test_CAM():
    # Testing that CAM heatmaps can be generated
    for _ in range(5):
        conv_features = np.random.random((512, 7, 7)) # Output of the ConvNet
        weights = np.random.random((2, 512))
        result = model._return_CAM(conv_features, weights)
        assert len(result) == 2 # there are two categories for CAMs, benign and malignant
        assert result[0].shape[0] == 224 and result[0].shape[1] == 224
        assert np.min(result[0]) >= 0
        assert np.max(result[0]) <= 255

def test_generate_heatmap(test_images):
    # Testing that CAM heatmaps can be saved
    for image_path in test_images:
        model.generate_heatmap(image_path, f"heatmap_{image_path}", malignant=False)
        image = Image.open(f"heatmap_{image_path}")
        image = np.array(image)
        # Verify that its a matplotlib saved heatmap
        assert image.shape[0] == 480
        assert image.shape[1] == 480
        assert image.shape[2] == 4

def test_predictions(test_images):
    # Testing that the model can make predictions
    for image_path in test_images:
        result = model.malignant_prob(image_path)
        assert result <= 1.0 and result >= 0.0

def test_process_image(test_images, monkeypatch, mock_generate_heatmap, mock_os_path_exists, mock_get_id, capsys):
    # Testing that the main loop of the model works
    for test_image in test_images:
        monkeypatch.setattr('builtins.input', lambda: test_image)
        model.process_image()
        # Capture stdout and check the printed JSON
        captured = capsys.readouterr()
        output_json = json.loads(captured.out.strip())
        heatmap_imagepath = "/heatmaps/" + ".".join(test_image.split(".")[:-1]) + ".jpg"

        # Assertions
        assert output_json["path"] == test_image
        assert output_json["heatmap_path"] == heatmap_imagepath
        assert output_json["malignant_prob"] <= 1 and output_json["malignant_prob"] >= 0

        mock_get_id.assert_called_with(output_json["path"])

        # Check if generate_heatmap is called with correct arguments
        mock_generate_heatmap.assert_called_with(
            test_image,
            heatmap_imagepath,
            output_json["malignant_prob"] > 0.5  # Assuming prob > 0.5 based on the mock_malignant_prob fixture
        )