
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import random
import os
from border_detection import get_border
import concurrent.futures
import time

def image(image_path):
    image = Image.open(image_path)
    image = np.array(image)
    return image

def process_image(file_path, destination_path, llm_mode):
    original_im = image(file_path)
    resulting_image = get_border(original_im, llm_mode)
    save_image(resulting_image, destination_path, os.path.basename(file_path), llm_mode=llm_mode)


def main():
    result = []

    image_directory = "ISIC-images/New_Images"
    filenames = os.listdir(image_directory)
    file_paths = [os.path.join(image_directory, filename) for filename in filenames]

    max_threads = 8

    result_directory = "ISIC-images/Result_Images_Square"
    # Adjust max_treads according to the number of cpus
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
        futures = [executor.submit(process_image, file_path, result_directory , True) for file_path in file_paths]
        concurrent.futures.wait(futures)
      


def save_image(image_array, directory, filename, llm_mode):
    # Ensure the directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    if not llm_mode:
        this_thing = Image.fromarray((image_array * 255).astype('uint8'))
    else:
        this_thing = Image.fromarray((image_array).astype('uint8'))

    # Convert the image array to PIL image
    # Save the image as JPG
    this_thing.save(os.path.join(directory, "_" + filename))
    print("Image saved successfully.")

def visual_results(out):
    alpha = 0.2  # Adjust transparency here

    for im, mask in out:
        plt.figure()
        plt.imshow(im)
        plt.imshow(mask, cmap='Reds', alpha=alpha)
        plt.axis(False)
        plt.show()


if __name__ == '__main__':
    main()