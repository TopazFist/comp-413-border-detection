import matplotlib.pyplot as plt
import cv2
from scipy.signal import argrelextrema
import numpy as np


def histogram_creater(image):
    img = cv2.imread(image, cv2.IMREAD_GRAYSCALE)
    assert img is not None, "file could not be read, check with os.path.exists()"
    histg = cv2.calcHist([img],[0],None,[256],[0,256])  
    print(histg)
    plt.plot(histg)
    plt.show()


def choose_pixel(image):
    img = cv2.imread(image)
    histg = cv2.calcHist([img],[0],None,[256],[0,256])
    res = []

    for i in range(len(histg)):
        res.append((i, histg[i]))

    print(argrelextrema(res, np.greater))
    print(argrelextrema(res, np.greater))



choose_pixel("ISIC_5341087.JPG")