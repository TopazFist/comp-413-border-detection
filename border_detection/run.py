
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
    # random.shuffle(filenames)  # Shuffle the list of filenames
    pictures = 0
    for filename in filenames:
        if filename.endswith(".JPG"):  # Check if file is an image
            image_path = os.path.join(image_directory, filename)
            original_im = image(image_path)

            mask = get_border(original_im)

            resulting_image = convert_image_mask(original_im, mask)

            save_image(resulting_image, "ISIC-images/Result_Images", filename)

            # result.append((original_im, mask))

        # if pictures == 9:
        #     break
        # else:
        #     pictures += 1

    # visual_results(result)        
    
def convert_image_mask(image, mask):
    # Create a new image initialized with zeros
    masked_image = np.zeros_like(image)
    
    # Apply the mask to the image
    masked_image[mask == 1] = image[mask == 1]
    
    return masked_image

def save_image(image_array, directory, filename):
    # Ensure the directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    # Convert the image array to PIL image
    image = Image.fromarray(image_array.astype('uint8'))
    
    # Save the image as JPG
    image.save(os.path.join(directory, "_" + filename))
    print("Image saved successfully.")

def visual_results(out):
    alpha = 0.2  # Adjust transparency here

    for im, mask in out:
        plt.figure()
        plt.imshow(im)
        plt.imshow(mask, cmap='Reds', alpha=alpha)
        plt.axis(False)
        plt.show()


main()