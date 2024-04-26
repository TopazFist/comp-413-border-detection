import os
import json
import numpy as np
import matplotlib.pyplot as plt
from border_detection import get_border
from PIL import Image

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

    Args:
        filepath (str): Path to the input image file.
        id (str): Unique identifier for the image.
    """
    # Define directory to store result
    result_directory = "image-uploads/" + id + "/borderDetection/"
    # Process image with border detection enabled
    process_image(filepath, result_directory, True)

def save_image(image_array, directory, filename):
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

def visual_results(out):
    """
    Visualizes the results by displaying original images overlaid with their corresponding masks.

    Args:
        out (list): List of tuples containing original images and their masks.
    """
    # Adjust transparency here
    alpha = 0.2

    for im, mask in out:
        # Display original image
        plt.figure()
        plt.imshow(im)

        # Overlay mask on original image with transparency
        plt.imshow(mask, cmap='Reds', alpha=alpha)
        plt.axis(False)
        plt.show()

# Handle user input for processing additional images
while True:
    # Prompt user to enter a file path
    input_path = input()
    if os.path.exists(input_path):
        # Extract filename from path
        filename = input_path.split("/")[-1]
        # Construct destination path for border detection results
        path = "image-uploads/" + input_path.split("/")[1] + "/borderDetection/" + filename
        # Process input image
        main(input_path, path.split("/")[1])
        # Print processed information in JSON format
        print(json.dumps({"patientID": input_path.split("/")[1], "existingPath": "image-uploads/" + input_path.split("/")[1] + "/" + filename, "borderDetectionPath": path}))
    else:
        print("Path does not exist.")
