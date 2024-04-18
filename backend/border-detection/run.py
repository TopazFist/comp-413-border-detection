from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import random
import os
from border_detection import get_border
import concurrent.futures
import time
import json


def image(image_path):
    """
    Loads an image from the given file path and converts it to a numpy array.

    Args:
        image_path (str): Path to the image file.

    Returns:
        numpy.ndarray: Image as a numpy array.
    """
    image = Image.open(image_path)
    image = np.array(image)
    return image

def process_image(file_path, destination_path, llm_mode):
    """
    Processes the image located at the specified file path and saves the resulting image.

    Args:
        file_path (str): Path to the input image file.
        destination_path (str): Directory where the resulting image will be saved.
        llm_mode (bool): Flag indicating whether to use llm_mode.
    """
    original_im = image(file_path)
    resulting_image = get_border(original_im, llm_mode)
    save_image(resulting_image, destination_path, os.path.basename(file_path), llm_mode=llm_mode)

def main(filepath, id):
    
    """
    Main function to process images in parallel.
    """

    result = []

    # image_directory = "ISIC-images/New_Images"
    # filenames = os.listdir(image_directory)
    # file_paths = [os.path.join(image_directory, filename) for filename in filenames]

    file_paths = [filepath]

    max_threads = 1

    # result_directory = "ISIC-images/Result_Images_Square"

    filename = filepath.split("/")[-1]
    result_directory = "image-uploads/" + id + "/borderDetection/" 
    # print(result_directory)

    # Adjust max_treads according to the number of cpus
    # with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
    #     futures = [executor.submit(process_image, file_path, result_directory , False) for file_path in file_paths]
    #     concurrent.futures.wait(futures)
    process_image(filepath, result_directory, True)

def save_image(image_array, directory, filename, llm_mode):
    """
    Saves the given image array as a JPG image in the specified directory.

    Args:
        image_array (numpy.ndarray): Image array to be saved.
        directory (str): Directory where the image will be saved.
        filename (str): Name of the file.
        llm_mode (bool): Flag indicating whether to use llm_mode.
    """
    # Ensure the directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    image_array.savefig(os.path.join(directory, "_" + filename))

    # print("Image saved successfully.")

def visual_results(out):
    """
    Visualizes the results by displaying original images overlaid with their corresponding masks.

    Args:
        out (list): List of tuples containing original images and their masks.
    """
    alpha = 0.2  # Adjust transparency here

    for im, mask in out:
        plt.figure()
        plt.imshow(im)
        plt.imshow(mask, cmap='Reds', alpha=alpha)
        plt.axis(False)
        plt.show()

while True:
    input_path = input()
    if os.path.exists(input_path):
        # print(json.dumps({"id": path.split("/")[1]}))
        filename = input_path.split("/")[-1]
        path = "image-uploads/" + input_path.split("/")[1] + "/borderDetection/" + filename
        main(input_path, path.split("/")[1])
        print(json.dumps({"patientID":input_path.split("/")[1],"existingPath": "image-uploads/" + input_path.split("/")[1] + "/" + filename, "borderDetectionPath": path}))
    else:
        print("Path does not exist.")