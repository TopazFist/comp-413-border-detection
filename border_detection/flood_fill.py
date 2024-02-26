from skimage.morphology import flood_fill, flood

import cv2
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import os

def downsample(image):
    width, height = image.shape[1], image.shape[0]
    return cv2.resize(image, (width // 2, height // 2))

def image(image_path):
    image = Image.open(image_path)
    image = np.array(image)

    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def choose_pixel(image):
    pass

def main():
    result = []

    image_directory = "ISIC-images/"

    for filename in os.listdir(image_directory):
        if filename.endswith(".JPG"):  # Check if file is an image
            image_path = os.path.join(image_directory, filename)

            im = image(image_path)
            im = downsample(im)

            # x, y = choose_pixel(im)

            y, x = im.shape[0] // 2, im.shape[1] // 2

            # mask = flood_fill(im, (y, x), 255, tolerance=35)
            mask = flood(im, (y, x), tolerance=35)
            
            alpha = 0.5  # Adjust transparency here

            result.append((im, mask))

    for im, mask in result:
        plt.figure()
        plt.imshow(im, cmap='gray')
        plt.imshow(mask, cmap='gray', alpha=alpha) 
        plt.show()



main()