import matplotlib.pyplot as plt
import cv2
from scipy.signal import argrelextrema
import numpy as np
import math
import random
import os
from PIL import Image


def histogram_creater(image):
    img = cv2.imread(image, cv2.COLOR_BGR2GRAY)
    assert img is not None, "file could not be read, check with os.path.exists()"
    histg = cv2.calcHist([img],[0],None,[256],[0,256])  
    print(histg)
    plt.plot(histg)
    plt.show()


def choose_pixel(image):
    # img = cv2.imread(image)
    # image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    histg = cv2.calcHist([image],[0],None,[256],[0,256])

    # plt.plot(histg)
    # plt.imshow(histg)
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
            # print(image[i,j])

            if normalized_color*w1 + normalized_dist*w2 < hyper_max_val:
                hyper_max_val = normalized_color*w1 + normalized_dist*w2
                img_x, img_y = i, j
    return img_x, img_y


def tolerance_picker(image, img_y, img_x):
    # img = cv2.imread(image)
    # image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    histg = cv2.calcHist([image],[0],None,[256],[0,256])
    CUTOFF = 95
    # histg2 = histg[:CUTOFF]
    histg3 = histg[CUTOFF:]

    # max_low_tone = float("-inf")
    # max_background = -1
    # for i in range(len(histg2)):
    #     if histg2[i] > max_low_tone:
    #         max_low_tone = max(max_low_tone, histg2[i])
    #         max_background = i

    max_background = image[img_y,img_x]

    max_high_tone = float("-inf")
    max_foreground = -1
    for i in range(len(histg3)):
        if histg3[i] > max_high_tone:
            max_high_tone = max(max_high_tone, histg3[i])
            max_foreground = i

    # plt.plot(histg, color='black')
    # plt.axvline(x=max_background, color='r', linestyle='--', label='Background Peak')
    # plt.axvline(x=CUTOFF + max_foreground, color='g', linestyle='--', label='Foreground Peak')
    # plt.legend()
    # plt.gca().invert_yaxis()
    # plt.show()

    # print(max_foreground - max_background)
    return (CUTOFF+max_foreground) - max_background

def test():
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
    
# c, d = choose_pixel("ISIC-images/ISIC_5648033.JPG")
# # print(c,d)
# histogram_creater("ISIC-images/ISIC_5648033.JPG")
# print(tolerance_picker("ISIC-images/ISIC_5648033.JPG"))

