# load_model.py
import torch
import sys
import json
import os
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import numpy as np
import cv2
import torch.nn.functional as F
import torch.nn as nn
import matplotlib.pyplot as plt
import skimage
import time
import json

transform = transforms.Compose([transforms.Resize((224, 224)),
                                transforms.ToTensor()])
model_path = "classification/model.pth"
model_state_dict = torch.load(model_path, map_location=torch.device('cpu'))
model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 2)
model.load_state_dict(model_state_dict)
mod = nn.Sequential(*list(model.children())[:-2])
params = list(model.fc.parameters())
weight = np.squeeze(params[0].cpu().data.numpy())
model.eval()
mod.eval()

def _load_image(imgpath):
    image = Image.open(imgpath).convert('RGB')
    min_dim = min(image.width, image.height)
    image = image.crop(((image.width - min_dim)//2, (image.height - min_dim)//2, min_dim + (image.width - min_dim)//2, min_dim + (image.height - min_dim)//2))
    image = transform(image)
    return image

def _return_CAM(feature_conv, weight):
  # generate the class -activation maps upsample to 256x256
    size_upsample = (256, 256)
    bz, nc, h, w = feature_conv.shape
    output = []
    for idx in [0,1]:
        beforeDot =  feature_conv.reshape((nc, h*w))
        cam = np.matmul(weight[idx], beforeDot)
        cam = cam.reshape(h, w)
        cam = cam - np.min(cam)
        cam_img = cam / np.max(cam)
        cam_img = np.uint8(255 * cam_img)
        output.append(cv2.resize(cam_img, size_upsample))
    return output

def generate_heatmap(imgpath: os.PathLike, outpath: os.PathLike, malignant: bool = False):
    image = _load_image(imgpath)
    features_blobs = mod(image.unsqueeze(0))
    features_blobs1 = features_blobs.cpu().detach().numpy()
    CAMs = _return_CAM(features_blobs1, weight)[int(malignant)]
    fig, ax = plt.subplots( nrows=1, ncols=1 )
    ax.imshow(image.transpose(2,0).transpose(0,1))
    ax.imshow(skimage.transform.resize(CAMs, (224,224)), alpha=0.4, cmap='jet')
    # Adjust figure settings
    ax.axis('off')  # Turn off axis
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)  # Remove white space around the image
    fig.savefig(outpath, bbox_inches='tight', pad_inches=0)

def malignant_prob(imgpath: os.PathLike):
    image = _load_image(imgpath)
    pred = model(image.unsqueeze(0))
    return pred.softmax(dim=1).detach().numpy()[0][1]

# print("Model loaded successfully")
# path = "image-uploads/ianrundle/skull.png"
while True:
    path = input()
    if os.path.exists(path):
        prob = malignant_prob(path)
        heatmap_dir = "/".join(path.split("/")[:-1]) + "/heatmaps/"
        if not os.path.exists(heatmap_dir):
            os.mkdir(heatmap_dir)
        heatmap_filepath = heatmap_dir + ".".join(path.split("/")[-1].split(".")[:-1]) + ".jpg"
        print(json.dumps({"id": path.split("/")[1], "path": path, "malignant_prob": float(malignant_prob(path)), "heatmap_path": heatmap_filepath}))
        generate_heatmap(path, heatmap_filepath, prob > 0.5)
    else:
        print("Path does not exist.")
    