import cv2
import numpy as np
import pytest
from border_detection import (
    downsample,
    upsample,
    get_border,
    get_edges,
    is_coordinate_in_mask,
    euclidean_distance,
    color_difference,
    expand_mask,
    fill_holes,
    overlay_mask_on_image,
    crop_to_square,
)

@pytest.fixture
def test_image():
    return cv2.imread("test_image.jpg")

@pytest.fixture
def test_gray_image(test_image):
    return cv2.cvtColor(test_image, cv2.COLOR_BGR2GRAY)

def test_downsample(test_image):
    downsampled_image = downsample(test_image)
    assert downsampled_image.shape[0] == test_image.shape[0] // 2
    assert downsampled_image.shape[1] == test_image.shape[1] // 2

def test_upsample(test_gray_image):
    shape = (test_gray_image.shape[0]*2, test_gray_image.shape[1]*2)
    upsampled_image = upsample(test_gray_image, shape)
    assert upsampled_image.shape[0] == shape[0]
    assert upsampled_image.shape[1] == shape[1]

def test_get_border(test_image):
    border_image = get_border(test_image, llm_mode=False)
    assert border_image.shape == (test_image.shape[0], test_image.shape[1])

def test_get_edges(test_gray_image):
    mask = np.zeros_like(test_gray_image)
    mask[10:20, 10:20] = 1
    edges = get_edges(mask)
    assert len(edges) >= 36

def test_is_coordinate_in_mask(test_gray_image):
    mask = np.zeros_like(test_gray_image)
    mask[10:20, 10:20] = 1
    assert is_coordinate_in_mask(mask, (15, 15))
    assert not is_coordinate_in_mask(mask, (25, 25))

def test_euclidean_distance():
    dist = euclidean_distance((0, 0), (3, 4))
    assert dist == 5.0

def test_color_difference():
    diff = color_difference(10, 20)
    assert diff == 10

def test_expand_mask(test_gray_image):
    mask = np.zeros_like(test_gray_image)
    mask[10:20, 10:20] = 1
    expanded_mask = expand_mask(mask, test_gray_image, radius=3, threshold=10)
    assert np.sum(expanded_mask) >= 100

def test_fill_holes(test_gray_image):
    mask = np.zeros_like(test_gray_image)
    mask[10:20, 10:20] = 1
    mask[15:25, 15:25] = 0
    filled_mask = fill_holes(mask)
    assert np.sum(filled_mask[15:20, 15:20]) == 0

def test_overlay_mask_on_image(test_gray_image, test_image):
    mask = np.zeros_like(test_gray_image)
    mask[10:20, 10:20] = 1
    overlayed_image = overlay_mask_on_image(mask, test_image)
    ax = overlayed_image.axes[0]
    assert ax.get_images()[0].get_array().shape == test_image.shape
