
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import random
import os
from border_detection import get_border

def image(image_path):
    image = Image.open(image_path)
    image = np.array(image)

    return image


def main():
    result = []

    image_directory = "ISIC-images/New_Images"
    filenames = os.listdir(image_directory)
    random.shuffle(filenames)  # Shuffle the list of filenames
    pictures = 0
    for filename in filenames:
        if filename.endswith(".JPG"):  # Check if file is an image
            image_path = os.path.join(image_directory, filename)
            original_im = image(image_path)

            mask = get_border(original_im)
            result.append((original_im, mask))

        if pictures == 4:
            break
        else:
            pictures += 1

    visual_results(result)        
    

def visual_results(out):
    alpha = 0.2  # Adjust transparency here

    for im, mask in out:
        plt.figure()
        plt.imshow(im)
        plt.imshow(mask, cmap='Reds', alpha=alpha)
        plt.axis(False)
        plt.show()


main()