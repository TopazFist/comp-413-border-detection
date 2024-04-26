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
# Remove last two layers to obtain feature map
mod = nn.Sequential(*list(model.children())[:-2])

# Get weights of fully connected layer
params = list(model.fc.parameters())
weight = np.squeeze(params[0].cpu().data.numpy())

# Set model and its feature extraction part to evaluation mode
model.eval()
mod.eval()

def _load_image(imgpath):
    """
    Load and preprocess an image.

    Args:
        imgpath (str): Path to the image file.

    Returns:
        torch.Tensor: Preprocessed image tensor.
    """
    # Load image
    image = Image.open(imgpath).convert('RGB')

    # Crop image to a square
    min_dim = min(image.width, image.height)
    image = image.crop(((image.width - min_dim)//2, (image.height - min_dim)//2, min_dim + (image.width - min_dim)//2, min_dim + (image.height - min_dim)//2))

    # Apply transformation pipeline
    image = transform(image)
    return image

def _return_CAM(feature_conv, weight):
    """
    Generate Class Activation Maps (CAM) for the given feature map and weight.

    Args:
        feature_conv (numpy.ndarray): Feature map.
        weight (numpy.ndarray): Weight of the fully connected layer.

    Returns:
        list: List of CAMs.
    """
    # Define size for upsampling
    size_upsample = (256, 256)

    # Get dimensions of feature map
    nc, h, w = feature_conv.shape

    # Store CAMs
    output = []
    for idx in [0,1]:
        beforeDot =  feature_conv.reshape((nc, h*w))
        cam = np.matmul(weight[idx], beforeDot)
        cam = cam.reshape(h, w)

        # Normalize CAM
        cam = cam - np.min(cam)
        cam_img = cam / np.max(cam)

        # Convert normalized CAM to uint8
        cam_img = np.uint8(255 * cam_img)

        # Resize CAM to match the input image size
        output.append(cv2.resize(cam_img, size_upsample))
    return output

def generate_heatmap(imgpath: os.PathLike, outpath: os.PathLike, malignant: bool = False):
    """
    Generate and save a heatmap overlaid on the original image.

    Args:
        imgpath (str): Path to the input image file.
        outpath (str): Path to save the heatmap.
        malignant (bool): Flag indicating if the image is malignant (default is False).
    """
    # Load and preprocess image
    image = _load_image(imgpath)

    # Extract features from image
    features_blobs = mod(image.unsqueeze(0))
    features_blobs1 = features_blobs.cpu().detach().numpy()

    # Generate Class Activation Maps (CAM)
    CAMs = _return_CAM(features_blobs1, weight)[int(malignant)]

    # Display image and overlay CAM
    fig, ax = plt.subplots( nrows=1, ncols=1 )
    ax.imshow(image.transpose(2,0).transpose(0,1))
    ax.imshow(skimage.transform.resize(CAMs, (224,224)), alpha=0.4, cmap='jet')
    
    # Adjust figure settings
    ax.axis('off')  # Turn off axis
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)  # Remove white space around the image
    
    # Save plot as an image
    fig.savefig(outpath, bbox_inches='tight', pad_inches=0)

def malignant_prob(imgpath: os.PathLike):
    """
    Predict the probability of malignancy for an input image.

    Args:
        imgpath (str): Path to the input image file.

    Returns:
        float: Probability of malignancy.
    """
    # Load and preprocess image
    image = _load_image(imgpath)

    # Make predictions using model
    pred = model(image.unsqueeze(0))

    # Compute probability of malignancy
    return pred.softmax(dim=1).detach().numpy()[0][1]

# Continuously process images
while True:
    # Get user input for path to image
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

        # Print processed information in JSON format
        print(json.dumps({"id": path.split("/")[1], "path": path, "malignant_prob": float(malignant_prob(path)), "heatmap_path": heatmap_filepath}))
        
        # Generate and save heatmap
        generate_heatmap(path, heatmap_filepath, prob > 0.5)
    else:
        print("Path does not exist.")
    