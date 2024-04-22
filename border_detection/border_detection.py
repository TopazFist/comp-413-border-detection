from skimage.morphology import flood
import cv2
import numpy as np
import scipy
import random
import matplotlib.pyplot as plt
from point_selector import choose_pixel, tolerance_picker, histogram_calculator
import os
from PIL import Image
import time

def downsample(image):
    """
    Downsamples the input image by half in both width and height.

    Args:
        image (numpy.ndarray): Input image to be downsampled.

    Returns:
        numpy.ndarray: Downsampled image.
    """
    width, height = image.shape[1], image.shape[0]
    return cv2.resize(image, (width // 2, height // 2))

def upsample(image, shape):
    """
    Upsamples the input image to the specified shape.

    Args:
        image (numpy.ndarray): Input image to be upsampled.
        shape (tuple): Target shape (height, width) for the upsampled image.

    Returns:
        numpy.ndarray: Upsampled image.
    """
    width, height = shape[1], shape[0]
    return cv2.resize(image, (width, height))

def get_border(original_im, llm_mode):
    start_time = time.time()
    """
    Retrieves the border of the input image.

    Args:
        original_im (numpy.ndarray): Input image.
        llm_mode (bool): Flag indicating whether to use llm_mode.

    Returns:
        numpy.ndarray: Image with the border.
    """
    grey_im = cv2.cvtColor(original_im, cv2.COLOR_BGR2GRAY)
    # downsample /2
    im = downsample(grey_im)
    # # downsample /4
    # im_2 = downsample(im_1)
    # # downsample /8
    # im = downsample(im_2)

    histogram = histogram_calculator(im)
    y, x = choose_pixel(im, histogram)
    tolerance = tolerance_picker(im, y, x, histogram)
    t_1 = tolerance / 3.25
    mask = flood(im, (y, x), tolerance=t_1).astype(int).astype(np.uint8)
    mask = fill_holes(mask)
    # upsample /4
    upsampled_mask = upsample(mask, (original_im.shape[0], original_im.shape[1]))

    # upsampled_mask = upsample(mask, (original_im.shape[0], original_im.shape[1]))
    temp = np.copy(upsampled_mask)
    t_2 = tolerance / 2.25

    # expand mask on mid sampled image
    upsampled_and_expanded_mask = expand_mask(temp, grey_im, 1, t_2)
    upsampled_and_expanded_mask = fill_holes(upsampled_and_expanded_mask)

    # upsample 1
    # upsampled_and_expanded_mask = upsample(upsampled_and_expanded_mask, (original_im.shape[0], original_im.shape[1]))
    elapsed_time = time.time() - start_time
    print(elapsed_time)
    if llm_mode:
        square_result = overlay_mask_on_image(upsampled_and_expanded_mask, original_im)
        return square_result
    else:
        return upsampled_and_expanded_mask

def get_edges(mask):
    """
    Retrieves the edges of the input mask.

    Args:
        mask (numpy.ndarray): Binary mask.

    Returns:
        numpy.ndarray: Array of edge coordinates.
    """
    kernel_x = np.array([[-1, 1]])
    kernel_y = np.array([[-1], [1]])
    edges_x = scipy.ndimage.convolve(mask, kernel_x, mode='reflect')
    edges_y = scipy.ndimage.convolve(mask, kernel_y, mode='reflect')
    edges = np.sqrt(edges_x ** 2 + edges_y ** 2)
    return np.argwhere(edges > 0)

def is_coordinate_in_mask(mask, coord):
    """
    Checks if the given coordinate is within the mask.

    Args:
        mask (numpy.ndarray): Binary mask.
        coord (tuple): Coordinate to check.

    Returns:
        bool: True if the coordinate is within the mask, False otherwise.
    """
    rows, cols = mask.shape
    row, col = coord
    if 0 <= row < rows and 0 <= col < cols:
        return mask[row, col] == 1
    return False

def euclidean_distance(coord1, coord2):
    """
    Computes the Euclidean distance between two coordinates.

    Args:
        coord1 (tuple): First coordinate (y, x).
        coord2 (tuple): Second coordinate (y, x).

    Returns:
        float: Euclidean distance between the coordinates.
    """
    y1, x1 = coord1
    y2, x2 = coord2
    distance = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return distance

def color_difference(pixel1, pixel2):
    """
    Computes the absolute difference between two pixel values.

    Args:
        pixel1 (int): First pixel value.
        pixel2 (int): Second pixel value.

    Returns:
        int: Absolute difference between the pixel values.
    """
    return abs(pixel1 - pixel2)

def expand_mask(mask, input_image, radius, threshold):
    """
    Expands the given mask based on color similarity.

    Args:
        mask (numpy.ndarray): Binary mask.
        input_image (numpy.ndarray): Input image.
        radius (int): Radius for expansion.
        threshold (float): Color difference threshold for expansion.

    Returns:
        numpy.ndarray: Expanded mask.
    """
    converged = False
    iterations = 0
    while not converged and iterations < 15:
        iterations += 1
        mask_pixels = np.where(mask == 1)
        average_color = np.mean(input_image[mask_pixels])
        converged = True
        visited_pixels = get_edges(mask).tolist()
        while visited_pixels:
            p = random.choice(visited_pixels)
            visited_pixels.remove(p)
            for q in list(visited_pixels):
                if euclidean_distance(p, q) <= radius:
                    visited_pixels.remove(q)
            x, y = p
            for i in range(max(0, x - radius), min(input_image.shape[0], x + radius + 1)):
                for j in range(max(0, y - radius), min(input_image.shape[1], y + radius + 1)):
                    if euclidean_distance(p, (i, j)) <= radius:
                        if mask[i, j] != 1:
                            color_diff = color_difference(input_image[i, j], average_color)
                            if color_diff <= threshold:
                                mask[i, j] = 1
                                converged = False
    return mask

def fill_holes(mask):
    """
    Fills holes in the given mask.

    Args:
        mask (numpy.ndarray): Binary mask.

    Returns:
        numpy.ndarray: Mask with filled holes.
    """
    rows = len(mask)
    cols = len(mask[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
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

def overlay_mask_on_image(mask, original_image, alpha = 0.5):
    """
    Overlays the given mask on the original image.

    Args:
        mask (numpy.ndarray): Binary mask.
        original_image (numpy.ndarray): Original input image.

    Returns:
        numpy.ndarray: Image with mask overlay.
    """
    # fig, ax = plt.subplots()
    fig = plt.figure(figsize=(original_image.shape[1] / 100, original_image.shape[0] / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.imshow(original_image)
    ax.imshow(mask, cmap='Reds', alpha=alpha)
    ax.axis(False)
    
    return fig
    # x_range, y_range = crop_to_square(mask)
    # cropped_image = original_image[y_range[0]:y_range[1] + 1, x_range[0]:x_range[1] + 1]
    # cropped_mask = mask[y_range[0]:y_range[1] + 1, x_range[0]:x_range[1] + 1]
    # masked_image = np.zeros_like(cropped_image)
    # masked_image[cropped_mask == 1] = cropped_image[cropped_mask == 1]
    # return masked_image

def crop_to_square(mask):
    """
    Crops the input mask to a square region.

    Args:
        mask (numpy.ndarray): Binary mask.

    Returns:
        tuple: New x-range and y-range for the cropped region.
    """
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


