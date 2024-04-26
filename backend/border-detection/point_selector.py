import cv2
import math
import random
import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

def histogram_creater(image):
    """
    Creates and plots the histogram of the input image.

    Args:
        image (str): Path to the input image file.
    """
    # Read image from given file path
    img = cv2.imread(image, cv2.COLOR_BGR2GRAY)
    # Ensure image is successfully loaded
    assert img is not None, "file could not be read, check with os.path.exists()"
    # Calculate histogram of grayscale image
    histg = cv2.calcHist([img], [0], None, [256], [0, 256])
    # Plot histogram
    plt.plot(histg)
    plt.show()

def histogram_calculator(image):
    """
    Calculates the histogram of the input image.

    Args:
        image (numpy.ndarray): Input image.

    Returns:
        numpy.ndarray: Histogram of the input image.
    """
    histg = cv2.calcHist([image], [0], None, [256], [0, 256])
    return histg

def choose_pixel(image, histg):
    """
    Chooses a pixel from the image based on a combination of color and distance.

    Args:
        image (numpy.ndarray): Input image.
        histg (numpy.ndarray): Histogram of the input image.

    Returns:
        tuple: Coordinates of the chosen pixel (x, y).
    """
    # Trim histogram to cutoff value
    CUTOFF = 95
    histg2 = histg[:CUTOFF]

    # Find color value with maximum count in trimmed histogram
    max_val = float("-inf")
    color_val = -1
    for i in range(len(histg2)):
        if histg[i] > max_val:
            max_val = max(max_val, histg[i])
            color_val = i

    img_x, img_y = 0, 0
    # Define weights for color and distance
    w1 = 0.6
    w2 = 0.4

    # Calculate maximum diagonal distance in image
    max_diag = (math.sqrt(((image.shape[0] - (image.shape[0] // 2))**2) + ((image.shape[1] - (image.shape[1] // 2))**2)))

    hyper_max_val = float("inf")

    # Iterate through all pixels in image
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            # Calculate normalized color and distance values
            normalized_color = (np.abs(color_val - image[i,j])) / 255
            normalized_dist = (math.sqrt(((i - (image.shape[0] // 2))**2) + ((j - (image.shape[1] // 2))**2))) / max_diag

            # Calculate a hyper value based on weighted sum of normalized color and distance
            if normalized_color * w1 + normalized_dist * w2 < hyper_max_val:
                hyper_max_val = normalized_color*w1 + normalized_dist*w2
                img_x, img_y = i, j
    
    # Return coordinates of chosen pixel
    return img_x, img_y

def tolerance_picker(image, img_y, img_x, histg):
    """
    Picks the tolerance for border detection based on the histogram of the input image.

    Args:
        image (numpy.ndarray): Input image.
        img_y (int): y-coordinate of the chosen pixel.
        img_x (int): x-coordinate of the chosen pixel.
        histg (numpy.ndarray): Histogram of the input image.

    Returns:
        int: Picked tolerance value.
    """
    # Trim histogram to cutoff value
    CUTOFF = 95
    histg3 = histg[CUTOFF:]

    # Get color value of chosen pixel
    max_background = image[img_y, img_x]

    # Find maximum high tone and corresponding foreground color value in trimmed histogram
    max_high_tone = float("-inf")
    max_foreground = -1
    for i in range(len(histg3)):
        if histg3[i] > max_high_tone:
            max_high_tone = max(max_high_tone, histg3[i])
            max_foreground = i

    # Calculate and return picked tolerance value
    return (CUTOFF + max_foreground) - max_background

def test():
    """
    Function to test the histogram functions.
    """
    image_directory = "ISIC-images/"
    # Get list of filenames in image directory
    filenames = os.listdir(image_directory)

    # Shuffle list of filenames
    random.shuffle(filenames)
    for filename in filenames:
        # Check if filename ends with ".JPG"
        if filename.endswith(".JPG"):
            # Construct full image path
            image_path = os.path.join(image_directory, filename)
            image = Image.open(image_path)
            # Convert PIL image to a NumPy array
            image = np.array(image)
            # Convert image to grayscale using OpenCV
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
