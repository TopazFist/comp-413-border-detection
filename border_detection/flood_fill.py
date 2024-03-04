from skimage.morphology import flood_fill, flood

import cv2
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import os
import scipy
import random

from point_selector import choose_pixel

def downsample(image):
    width, height = image.shape[1], image.shape[0]
    return cv2.resize(image, (width // 2, height // 2))

def upsample(image, shape):
    width, height = shape[1], shape[0]
    return cv2.resize(image, (width, height))

def image(image_path):
    image = Image.open(image_path)
    image = np.array(image)

    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def main():
    result = []

    image_directory = "ISIC-images/"
    filenames = os.listdir(image_directory)
    random.shuffle(filenames)  # Shuffle the list of filenames
    pictures = 0
    for filename in filenames:
        if filename.endswith(".JPG"):  # Check if file is an image
            image_path = os.path.join(image_directory, filename)
            original_im = image(image_path)
            original_im = downsample(original_im)
            im = downsample(original_im)

            y, x = choose_pixel(im)

            # need to change tolerance based on difference in color, and make it custom
            # for each image
            mask = flood(im, (y, x), tolerance=30).astype(int).astype(np.uint8)
            mask = fill_holes(mask)

            upsampled_mask = upsample(mask, (original_im.shape[0], original_im.shape[1]))
            
            temp = np.copy(upsampled_mask)

            upsampled_and_expanded_mask = expand_mask(temp, original_im, 5, 8)
            # expanded_mask = expand_mask(mask, im, 5, 13)

            result.append((original_im, upsampled_mask, upsampled_and_expanded_mask))
            # result.append((im, mask , expanded_mask))

        if pictures == 0:
            break
        else:
            pictures += 1

    visual_results(result)        
    

def visual_results(out):
    alpha = 0.2  # Adjust transparency here

    for im, mask, expanded in out:
        print(np.sum(mask), np.sum(expanded))

        fig, axes = plt.subplots(1, 2)

        # Plot original image with initial mask overlay
        axes[0].imshow(im, cmap='gray')
        axes[0].imshow(mask, cmap='coolwarm', alpha=alpha)

        # Plot original image with expanded mask overlay
        axes[1].imshow(im, cmap='gray')
        axes[1].imshow(expanded, cmap='coolwarm', alpha=alpha)
        plt.show()

def visualize_border(edges, image_shape):
    # Create a new mask initialized with zeros
    border_mask = np.zeros(image_shape, dtype=np.uint8)
    
    # Set the border pixels to 1
    for edge_pixel in edges:
        border_mask[edge_pixel[0], edge_pixel[1]] = 1
        
    return border_mask

# def get_edges(mask):    
#     # Ensure mask is of type uint8
#     mask = mask.astype(int)
#     mask = mask.astype(np.uint8)

#     print(mask)

#     # Apply Canny edge detector
#     edges = cv2.Canny(mask, 0, 1)  # Adjust thresholds as needed

#     # Find coordinates of edge pixels
#     return np.argwhere(edges > 0)


def get_edges(mask):
    # Define the edge detection kernels
    kernel_x = np.array([[-1, 1]])
    kernel_y = np.array([[-1], [1]])

    # Convolve the mask with the kernels
    edges_x = scipy.ndimage.convolve(mask, kernel_x, mode='reflect')
    edges_y = scipy.ndimage.convolve(mask, kernel_y, mode='reflect')

    edges = np.sqrt(edges_x**2 + edges_y**2)

    # plt.figure()
    # plt.imshow(edges, cmap='gray') 
    # plt.show()
    # Find coordinates of edge pixels
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
    # Assuming pixel values are in the range [0, 255]
    # print(pixel1, pixel2, abs(pixel1 - pixel2))
    return abs(pixel1 - pixel2)

def expand_mask(mask, input_image, radius, threshold):
    converged = False

    iterations = 0
    
    while not converged and iterations < 25:
        iterations += 1
        mask_pixels = np.where(mask == 1)
        average_color = np.mean(input_image[mask_pixels])
        converged = True  # Assume convergence unless proven otherwise

        visited_pixels = get_edges(mask).tolist() # Get edge pixels of the current mask

        # print(visited_pixels)
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

                                # print(input_image[i, j], color_diff)
                                mask[i, j] = 1  # Add the pixel to the mask
                                converged = False
        

        # iterate over each pixel R from p in the input_image


    return mask

# def expand_mask(mask, image, radius, threshold):
#     while True:
#         changed = False
#         visited_pixels = mask.get_edges()  # Get edge pixels of the current mask
#         for p in visited_pixels:
#             for q in image.get_pixels_within_radius(p, radius):
#                 if q not in mask:  # Check if q is not already in the mask
#                     distance = calculate_distance(q, p)
#                     if distance <= threshold:
#                         mask.add_pixel(q)
#                         changed = True
#         if not changed:
#             break  # Mask didn't change, terminate loop
#     return mask


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



# def fill_holes(mask):
#     rows = len(mask)
#     cols = len(mask[0])
    
#     directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
#     x_range = [cols, 0]
#     y_range = [rows, 0]

#     for y in range(rows):
#         for x in range(cols):
#             if mask[y][x] == 1:
#                 if x > x_range[1]:
#                     x_range[1] = x
#                 if x < x_range[0]:
#                     x_range[0] = x

#                 if y > y_range[1]:
#                     y_range[1] = y
#                 if y < y_range[0]:
#                     y_range[0] = y

#     for y in range(y_range[0], y_range[1] + 1):
#         for x in range(x_range[0], x_range[1] + 1):
#             if mask[y][x] == 0:
#                 fill = True
#                 points_to_fill = set()
#                 for direction in directions:
#                     j = y
#                     i = x

#                     temporary = False
#                     points_visited = set()
#                     while (j < y_range[1] and i < x_range[1] and j > y_range[0] and i > x_range[0]):
#                         if mask[j][i] == 1:
#                             temporary = True
#                             break
                        
#                         points_visited.add((j, i))
#                         j += direction[0]
#                         i += direction[1]

#                     fill = fill and temporary
#                     if temporary:
#                         points_to_fill.update(points_visited)

#                 if fill:
#                     for point in points_to_fill:
#                         mask[point[0]][point[1]] = 1
#     return mask







main()