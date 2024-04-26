import matplotlib.pyplot as plt
import cv2
from scipy.signal import argrelextrema
import numpy as np
import math
import random
import os
from PIL import Image

def histogram_creater(image):
    """
    Creates and plots the histogram of the input image.

    Args:
        image (str): Path to the input image file.
    """
    img = cv2.imread(image, cv2.COLOR_BGR2GRAY)
    assert img is not None, "file could not be read, check with os.path.exists()"
    histg = cv2.calcHist([img],[0],None,[256],[0,256])  
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
    histg = cv2.calcHist([image],[0],None,[256],[0,256])
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
    CUTOFF = 95
    histg2 = histg[:CUTOFF]

    max_val = float("-inf")
    color_val = -1
    for i in range(len(histg2)):
        if histg[i] > max_val:
            max_val = max(max_val, histg[i])
            color_val = i

    img_x, img_y = 0, 0
    dist = float("inf")
    w1 = 0.6
    w2 = 0.4

    max_diag = (math.sqrt(((image.shape[0]-(image.shape[0]//2))**2) + ((image.shape[1]-(image.shape[1]//2))**2)))

    hyper_max_val = float("inf")
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):

            normalized_color = (np.abs(color_val - image[i,j]))/255
            normalized_dist = (math.sqrt(((i-(image.shape[0]//2))**2) + ((j-(image.shape[1]//2))**2)))/max_diag

            if normalized_color*w1 + normalized_dist*w2 < hyper_max_val:
                hyper_max_val = normalized_color*w1 + normalized_dist*w2
                img_x, img_y = i, j
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
    CUTOFF = 95
    histg3 = histg[CUTOFF:]

    max_background = image[img_y,img_x]

    max_high_tone = float("-inf")
    max_foreground = -1
    for i in range(len(histg3)):
        if histg3[i] > max_high_tone:
            max_high_tone = max(max_high_tone, histg3[i])
            max_foreground = i

    return (CUTOFF+max_foreground) - max_background

def test():
    """
    Function to test the histogram functions.
    """
    image_directory = "ISIC-images/"
    filenames = os.listdir(image_directory)
    random.shuffle(filenames)  # Shuffle the list of filenames
    pictures = 0
    for filename in filenames:
        if filename.endswith(".JPG"):
            image_path = os.path.join(image_directory, filename)
            image = Image.open(image_path)
            image = np.array(image)

            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)