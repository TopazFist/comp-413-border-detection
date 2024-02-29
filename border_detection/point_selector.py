import matplotlib.pyplot as plt
import cv2
from scipy.signal import argrelextrema
import numpy as np
import math

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
    histg2 = histg[:95]

    max_val = float("-inf")
    color_val = -1
    for i in range(len(histg2)):
        if histg[i] > max_val:
            max_val = max(max_val, histg[i])
            color_val = i
            

    img_x, img_y = 0, 0


    dist = float("inf")

    w1 = 0.85
    w2 = 0.15



    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            # print(image[i,j])
            if int(color_val) <= int(image[i,j]) and math.sqrt(((i-(image.shape[0]//2))**2) + ((j-(image.shape[1]//2))**2)) < dist:
                dist = math.sqrt(((i-image.shape[0])**2) + ((j-image.shape[1])**2))
                img_x, img_y = i, j
    print(img_x, img_y)
    return img_x, img_y

# c, d = choose_pixel("ISIC_5341087.JPG")
# print(c,d)
# histogram_creater("ISIC_5341087.JPG")