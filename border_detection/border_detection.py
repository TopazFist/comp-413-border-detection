from skimage.morphology import flood

import cv2
import numpy as np
import scipy
import random
import matplotlib.pyplot as plt

from point_selector import choose_pixel, tolerance_picker

def downsample(image):
    width, height = image.shape[1], image.shape[0]
    return cv2.resize(image, (width // 2, height // 2))


def upsample(image, shape):
    width, height = shape[1], shape[0]
    return cv2.resize(image, (width, height))


def get_border(original_im):
    grey_im = cv2.cvtColor(original_im, cv2.COLOR_BGR2GRAY)
    im = downsample(grey_im)

    y, x = choose_pixel(im)

    tolerance = tolerance_picker(im, y, x)

    t_1 = tolerance / 3.25

    mask = flood(im, (y, x), tolerance=t_1).astype(int).astype(np.uint8)
    mask = fill_holes(mask)

    upsampled_mask = upsample(mask, (original_im.shape[0], original_im.shape[1]))
    
    temp = np.copy(upsampled_mask)
    
    t_2 = tolerance / 2.5
    upsampled_and_expanded_mask = expand_mask(temp, grey_im, 1, t_2)
    upsampled_and_expanded_mask = fill_holes(upsampled_and_expanded_mask)


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
        print(iterations)
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
