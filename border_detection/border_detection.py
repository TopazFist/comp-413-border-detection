from skimage.morphology import flood

import cv2
import numpy as np
import scipy
import random
import matplotlib.pyplot as plt

from point_selector import choose_pixel, tolerance_picker, histogram_calculator

import os
from PIL import Image

def downsample(image):
    width, height = image.shape[1], image.shape[0]
    return cv2.resize(image, (width // 2, height // 2))


def upsample(image, shape):
    width, height = shape[1], shape[0]
    return cv2.resize(image, (width, height))


def get_border(original_im, llm_mode):
    grey_im = cv2.cvtColor(original_im, cv2.COLOR_BGR2GRAY)
    im = downsample(grey_im)
    histogram = histogram_calculator(im)
    y, x = choose_pixel(im, histogram)
    tolerance = tolerance_picker(im, y, x, histogram)

    t_1 = tolerance / 3.25

    mask = flood(im, (y, x), tolerance=t_1).astype(int).astype(np.uint8)
    mask = fill_holes(mask)

    upsampled_mask = upsample(mask, (original_im.shape[0], original_im.shape[1]))
    
    temp = np.copy(upsampled_mask)
    
    # t_2 = np.log(1+(np.e**tolerance))
    # t_2 = np.e**(-(tolerance**2))
    # print(tolerance)
    t_2 = tolerance/2.25

    upsampled_and_expanded_mask = expand_mask(temp, grey_im, 1, t_2)
 
    upsampled_and_expanded_mask = fill_holes(upsampled_and_expanded_mask)
    if llm_mode:
        square_result = overlay_mask_on_image(upsampled_and_expanded_mask, original_im)
        return square_result
    else:
        return upsampled_and_expanded_mask


def get_edges(mask):
    # Define the edge detection kernels
    kernel_x = np.array([[-1, 1]])
    kernel_y = np.array([[-1], [1]])

    # Convolve the mask with the kernels
    edges_x = scipy.ndimage.convolve(mask, kernel_x, mode='reflect')
    edges_y = scipy.ndimage.convolve(mask, kernel_y, mode='reflect')

    edges = np.sqrt(edges_x**2 + edges_y**2)

    return np.argwhere(edges > 0)


def is_coordinate_in_mask(mask, coord):
    rows, cols = mask.shape
    row, col = coord
    if 0 <= row < rows and 0 <= col < cols:
        return mask[row, col] == 1
    return False


def euclidean_distance(coord1, coord2):
    y1, x1 = coord1
    y2, x2 = coord2
    distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return distance


def color_difference(pixel1, pixel2):
    return abs(pixel1 - pixel2)


def expand_mask(mask, input_image, radius, threshold):
    converged = False

    iterations = 0
    
    while not converged and iterations < 30:
        iterations += 1
        # print(iterations)
        mask_pixels = np.where(mask == 1)
        average_color = np.mean(input_image[mask_pixels])
        converged = True  # Assume convergence unless proven otherwise

        visited_pixels = get_edges(mask).tolist() # Get edge pixels of the current mask
        while visited_pixels:
            # Randomly select an edge pixel
            p = random.choice(visited_pixels)
            visited_pixels.remove(p)  # Remove the selected pixel
            
            # Remove edge pixels within the radius of the selected pixel
            for q in list(visited_pixels):
                if euclidean_distance(p, q) <= radius:
                    visited_pixels.remove(q)
            x, y = p
            for i in range(max(0, x - radius), min(input_image.shape[0], x + radius + 1)):
                for j in range(max(0, y - radius), min(input_image.shape[1], y + radius + 1)):
                    # Check if the distance from (i, j) to p is within the radius
                    if euclidean_distance(p, (i, j)) <= radius:
                        if mask[i, j] != 1:
                            # Calculate color difference between the pixel and its neighbors
                            color_diff = color_difference(input_image[i, j], average_color)
                            if color_diff <= threshold:

                                mask[i, j] = 1  # Add the pixel to the mask
                                converged = False
        
        # iterate over each pixel R from p in the input_image
    return mask


def fill_holes(mask):
    rows = len(mask)
    cols = len(mask[0])
    
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    x_range = [cols, 0]
    y_range = [rows, 0]

    for y in range(rows):
        for x in range(cols):
            if mask [y][x] == 1:
                if x > x_range[1]:
                    x_range[1] = x
                if x < x_range[0]:
                    x_range[0] = x

                if y > y_range[1]:
                    y_range[1] = y
                if y < y_range[0]:
                    y_range[0] = y

    # Find holes and fill them
    for y in range(y_range[0], y_range[1] + 1):
        for x in range(x_range[0], x_range[1] + 1):
            if mask[y][x] == 0:

                fill = True
                for direction in directions:
                    j = y
                    i = x

                    temporary = False
                    while (j < y_range[1] and i < x_range[1] and j >= y_range[0] and i >= x_range[0]):
                        if mask[j][i] == 1:
                            temporary = True
                            break
                        
                        j += direction[0]
                        i += direction[1]

                    fill = fill and temporary

                if fill:
                    mask[y][x] = 1
    return mask



def overlay_mask_on_image(mask, original_image):
    x_range, y_range = crop_to_square(mask)
    cropped_image = original_image[y_range[0]:y_range[1]+1, x_range[0]:x_range[1]+1]
    cropped_mask = mask[y_range[0]:y_range[1]+1, x_range[0]:x_range[1]+1]

    # Create a new image initialized with zeros
    masked_image = np.zeros_like(cropped_image)
    
    # Apply the mask to the image
    masked_image[cropped_mask == 1] = cropped_image[cropped_mask == 1]
    
    return masked_image



def crop_to_square(mask):
    rows = len(mask)
    cols = len(mask[0])

    x_range = [cols, 0]
    y_range = [rows, 0]

    for y in range(rows):
        for x in range(cols):
            if mask[y][x] == 1:
                if x > x_range[1]:
                    x_range[1] = x
                if x < x_range[0]:
                    x_range[0] = x

                if y > y_range[1]:
                    y_range[1] = y
                if y < y_range[0]:
                    y_range[0] = y

    size = max(y_range[1] - y_range[0], x_range[1] - x_range[0]) + 1
    center_x = (x_range[1] + x_range[0]) // 2
    center_y = (y_range[1] + y_range[0]) // 2
    half_size = size // 2

    new_x_range = [max(center_x - half_size - 5, 0), min(center_x + half_size + 5, cols - 1)]
    new_y_range = [max(center_y - half_size - 5, 0), min(center_y + half_size + 5, rows - 1)]

    return new_x_range, new_y_range




# def image(image_path):
#     image = Image.open(image_path)
#     image = np.array(image)
#     return image

# def process_image(file_path):
#     original_im = image(file_path)
#     mask = get_border(original_im)

#     resulting_image = convert_image_mask(original_im, mask)
#     save_image(resulting_image, "ISIC-images/Result_Images_Square", os.path.basename(file_path))


# def save_image(image_array, directory, filename):
#     # Ensure the directory exists
#     if not os.path.exists(directory):
#         os.makedirs(directory)
    
#     # Convert the image array to PIL image
#     image = Image.fromarray(image_array.astype('uint8'))
    
#     # Save the image as JPG
#     image.save(os.path.join(directory, "_" + filename))
#     print("Image saved successfully.")


# process_image("ISIC-images/New_Images/ISIC_1144433.JPG")