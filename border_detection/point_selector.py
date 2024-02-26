import matplotlib.pyplot as plt
import cv2
from scipy.signal import argrelextrema
import numpy as np


def histogram_creater(image):
    img = cv2.imread(image, cv2.COLOR_BGR2GRAY)
    assert img is not None, "file could not be read, check with os.path.exists()"
    histg = cv2.calcHist([img],[0],None,[256],[0,256])  
    print(histg)
    plt.plot(histg)
    plt.show()


def choose_pixel(image):
    # img = cv2.imread(image)
    # bw_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # bw_image = cv2.imread(image, cv2.COLOR_BGR2GRAY)

    histg = cv2.calcHist([image],[0],None,[256],[0,256])
    # res = []

    # for i in range(len(histg)):
    #     res.append((i, int(histg[i])))
    # print(histg)

    # print([argrelextrema(histg, np.greater)[0]])
    # print("Hi")
    # print(argrelextrema(histg, np.greater))

    max_val = float("-inf")
    color_val = -1
    for i in range(len(histg)):
        if histg[i] > max_val:
            max_val = max(max_val, histg[i])
            color_val = i
    # print(color_val, max_val)
            
    

    img_x, img_y = 0, 0


    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            print(image[i,j])
            if int((image[i,j][0] + image[i,j][1] + image[i,j][2])) == color_val:
                img_x, img_y = i, j
                return img_x, img_y
    return img_x, img_y

c, d = choose_pixel("ISIC_5341087.JPG")
print(c,d)
# histogram_creater("ISIC_5341087.JPG")