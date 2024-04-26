import torch
import json
import os
import cv2
import skimage
import json
import torchvision.transforms as transforms
import torchvision.models as models
import numpy as np
import torch.nn as nn
import matplotlib.pyplot as plt
from PIL import Image

# Define image transformation pipeline
transform = transforms.Compose([transforms.Resize((224, 224)),
                                transforms.ToTensor()])
# Path to trained model
model_path = "classification/model.pth"
# Load model state dictionary
model_state_dict = torch.load(model_path, map_location=torch.device('cpu'))
# Load ResNet18 model architecture
model = models.resnet18()
# Replace fully connected layer to match number of classes
model.fc = torch.nn.Linear(model.fc.in_features, 2)
# Load trained weights into model
model.load_state_dict(model_state_dict)

# Remove the pooling and fully connected layers
conv_model = nn.Sequential(*list(model.children())[:-2])

# Get weights of fully connected layer
params = list(model.fc.parameters())
weight = np.squeeze(params[0].cpu().data.numpy())

# Set model and shortened model into evaluation mode, disabling dropout layers or anything else used in training
model.eval()
conv_model.eval()

def _load_image(imgpath: os.PathLike) -> torch.Tensor:
    """
    Load and preprocess an image.

    Args:
        imgpath (os.PathLike): Path to the image file.

    Returns:
        torch.Tensor: Preprocessed image tensor.
    """
    # Load image
    image = Image.open(imgpath).convert('RGB')

    # Crop image to the center square
    min_dim = min(image.width, image.height)
    image = image.crop(((image.width - min_dim)//2, (image.height - min_dim)//2, min_dim + (image.width - min_dim)//2, min_dim + (image.height - min_dim)//2))

    # Apply resizing and tensor conversion
    image = transform(image)
    return image

def _return_CAM(conv_features: np.ndarray, fc_weights: np.ndarray):
    """
    Generate Class Activation Maps (CAM) for the given feature map and weight.

    Args:
        conv_features: (numpy.ndarray): Output of the convolutional layers for an image.
        fc_weights (numpy.ndarray): Weights of the fully connected layer.

    Returns:
        list: List of class activation maps, showing regional impact on the model's results.
    """

    # Get dimensions of feature map
    n_channels, h, w = conv_features.shape

    # Define storage for CAMs
    output = []

    # Calculate the CAM for each category
    for idx in [0,1]:
        reshaped_features =  conv_features.reshape((n_channels, h*w))
        cam = np.matmul(fc_weights[idx], reshaped_features)
        cam = cam.reshape(h, w)

        # Normalize CAM
        cam = cam - np.min(cam)
        cam = cam / np.max(cam)

        # Convert normalized CAM to uint8
        cam = np.uint8(255 * cam)

        # Resize CAM to match the input image size
        # Use default cv2 linear interpolation on the result for smoothness
        output.append(cv2.resize(cam, (224, 224)))
    return output

def generate_heatmap(imgpath: os.PathLike, outpath: os.PathLike, malignant: bool = False):
    """
    Generate and save a heatmap overlaid on the original image.

    Args:
        imgpath (os.PathLike): Path to the input image file.
        outpath (os.PathLike): Path to save the heatmap.
        malignant (bool): Flag indicating if the image is malignant (default is False).
    """
    # Load and preprocess image
    image = _load_image(imgpath)

    # Extract features after the convolutional layer
    conv_features = conv_model(image.unsqueeze(0))
    conv_features = conv_features.cpu().detach().numpy()

    # Generate Class Activation Maps (CAM)
    CAMs = _return_CAM(conv_features[0], weight)[int(malignant)]

    # Display image and overlay CAM
    fig, ax = plt.subplots( nrows=1, ncols=1 )
    ax.imshow(image.transpose(2,0).transpose(0,1))
    ax.imshow(CAMs, alpha=0.3, cmap='jet')
    
    # Adjust figure settings
    ax.axis('off')  # Turn off axis
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)  # Remove white space around the image
    
    # Save plot as an image
    fig.savefig(outpath, bbox_inches='tight', pad_inches=0)

def malignant_prob(imgpath: os.PathLike):
    """
    Predict the probability of malignancy for an input image.

    Args:
        imgpath (os.PathLike): Path to the input image file.

    Returns:
        float: Probability of malignancy.
    """
    # Load and preprocess image
    image = _load_image(imgpath)

    # Make predictions using model
    pred = model(image.unsqueeze(0))

    # Compute probability of malignancy
    return pred.softmax(dim=1).detach().numpy()[0][1]

def _get_id_from_path(path: str):
    """
    Gets the patient ID from the image path
    """
    return path.split("/")[1]

### MAIN LOOP ###
def process_image():
    # Wait for Express js to input a path through stdin
    path = input()
    if os.path.exists(path):
        # Compute probability of malignancy for input image
        prob = malignant_prob(path)

        # Define directory to save heatmap
        heatmap_dir = "/".join(path.split("/")[:-1]) + "/heatmaps/"

        # Create directory if it doesn't exist
        if not os.path.exists(heatmap_dir):
            os.mkdir(heatmap_dir)

        # Define file path for heatmap
        heatmap_filepath = heatmap_dir + ".".join(path.split("/")[-1].split(".")[:-1]) + ".jpg"

        # Print processed information in JSON format in stdout for Express JS to process
        print(json.dumps({"id": _get_id_from_path(path), "path": path, "malignant_prob": float(malignant_prob(path)), "heatmap_path": heatmap_filepath}))
        
        # Generate and save heatmap
        generate_heatmap(path, heatmap_filepath, prob > 0.5)
    else:
        print("Path does not exist.")

if __name__ == "__main__":
    while True:
        process_image()
        