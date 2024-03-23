# from skimage.morphology import flood
# import cv2
# import numpy as np
# import scipy
# import random
# import matplotlib.pyplot as plt
# from point_selector import choose_pixel, tolerance_picker, histogram_calculator
# import os
# from PIL import Image
# import concurrent.futures


# class Segmentation:
#     def __init__(self):
#         pass

#     @staticmethod
#     def _downsample(image):
#         """
#         Downsamples the input image by half in both width and height.

#         Args:
#             image (numpy.ndarray): Input image to be downsampled.

#         Returns:
#             numpy.ndarray: Downsampled image.
#         """
#         width, height = image.shape[1], image.shape[0]
#         return cv2.resize(image, (width // 2, height // 2))
    
#     @staticmethod
#     def _upsample(image, shape):
#         """
#         Upsamples the input image to the specified shape.

#         Args:
#             image (numpy.ndarray): Input image to be upsampled.
#             shape (tuple): Target shape (height, width) for the upsampled image.

#         Returns:
#             numpy.ndarray: Upsampled image.
#         """
#         width, height = shape[1], shape[0]
#         return cv2.resize(image, (width, height))

#     @staticmethod
#     def segment(original_im, llm, t_1 = 3.25, t_2 = 2.25, max_iter = 25):
#         """
#         Retrieves the border of the input image.

#         Args:
#             original_im (numpy.ndarray): Input image.

#         Returns:
#             numpy.ndarray: Image with the border.
#         """
#         grey_im = cv2.cvtColor(original_im, cv2.COLOR_BGR2GRAY)
#         im = Segmentation._downsample(grey_im)
#         histogram = histogram_calculator(im)
#         y, x = choose_pixel(im, histogram)
#         tolerance = tolerance_picker(im, y, x, histogram)
#         t_1 = tolerance / t_1
#         mask = flood(im, (y, x), tolerance=t_1).astype(int).astype(np.uint8)
#         x_range, y_range = Segmentation._find_ranges(mask)
#         mask = Segmentation._fill_holes(mask, x_range, y_range)

#         upsampled_mask = Segmentation._upsample(mask, (original_im.shape[0], original_im.shape[1]))
#         temp = np.copy(upsampled_mask)
#         t_2 = tolerance / t_2

#         upsampled_and_expanded_mask = Segmentation._expand_mask(temp, grey_im, 1, t_2, max_iter)
        
#         x_range, y_range = Segmentation._find_ranges(upsampled_and_expanded_mask)
#         upsampled_and_expanded_mask = Segmentation._fill_holes(upsampled_and_expanded_mask, x_range, y_range)
#         if llm:
#             new_x_range, new_y_range = Segmentation._crop_to_square(upsampled_and_expanded_mask, x_range, y_range)

#             square_result = Segmentation._overlay_mask_on_image(upsampled_and_expanded_mask, 
#                                                                 original_im, new_x_range, new_y_range)
#             return square_result
#         else:
#             return upsampled_and_expanded_mask

#     @staticmethod
#     def _get_edges(mask):
#         """
#         Retrieves the edges of the input mask.

#         Args:
#             mask (numpy.ndarray): Binary mask.

#         Returns:
#             numpy.ndarray: Array of edge coordinates.
#         """
#         kernel_x = np.array([[-1, 1]])
#         kernel_y = np.array([[-1], [1]])
#         edges_x = scipy.ndimage.convolve(mask, kernel_x, mode='reflect')
#         edges_y = scipy.ndimage.convolve(mask, kernel_y, mode='reflect')
#         edges = np.sqrt(edges_x ** 2 + edges_y ** 2)
#         return np.argwhere(edges > 0)
    
#     @staticmethod
#     def _is_coordinate_in_mask(mask, coord):
#         """
#         Checks if the given coordinate is within the mask.

#         Args:
#             mask (numpy.ndarray): Binary mask.
#             coord (tuple): Coordinate to check.

#         Returns:
#             bool: True if the coordinate is within the mask, False otherwise.
#         """
#         rows, cols = mask.shape
#         row, col = coord
#         if 0 <= row < rows and 0 <= col < cols:
#             return mask[row, col] == 1
#         return False
    
#     @staticmethod
#     def _euclidean_distance(coord1, coord2):
#         """
#         Computes the Euclidean distance between two coordinates.

#         Args:
#             coord1 (tuple): First coordinate (y, x).
#             coord2 (tuple): Second coordinate (y, x).

#         Returns:
#             float: Euclidean distance between the coordinates.
#         """
#         y1, x1 = coord1
#         y2, x2 = coord2
#         distance = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
#         return distance
    
#     @staticmethod
#     def _color_difference(pixel1, pixel2):
#         """
#         Computes the absolute difference between two pixel values.

#         Args:
#             pixel1 (int): First pixel value.
#             pixel2 (int): Second pixel value.

#         Returns:
#             int: Absolute difference between the pixel values.
#         """
#         return abs(pixel1 - pixel2)
    
#     @staticmethod
#     def _expand_mask(self, mask, input_image, radius, threshold, max_iter):
#         """
#         Expands the given mask based on color similarity.

#         Args:
#             mask (numpy.ndarray): Binary mask.
#             input_image (numpy.ndarray): Input image.
#             radius (int): Radius for expansion.
#             threshold (float): Color difference threshold for expansion.

#         Returns:
#             numpy.ndarray: Expanded mask.
#         """
#         converged = False
#         iterations = 0

#         while not converged and iterations < max_iter:
#             print(iterations)
#             iterations += 1
#             mask_pixels = np.where(mask == 1)
#             average_color = np.mean(input_image[mask_pixels])
#             converged = True
#             visited_pixels = Segmentation._get_edges(mask).tolist()
#             while visited_pixels:
#                 p = random.choice(visited_pixels)
#                 visited_pixels.remove(p)
#                 for q in list(visited_pixels):
#                     if Segmentation._euclidean_distance(p, q) <= radius:
#                         visited_pixels.remove(q)
#                 x, y = p
#                 for i in range(max(0, x - radius), min(input_image.shape[0], x + radius + 1)):
#                     for j in range(max(0, y - radius), min(input_image.shape[1], y + radius + 1)):
#                         if Segmentation._euclidean_distance(p, (i, j)) <= radius:
#                             if mask[i, j] != 1:
#                                 color_diff = Segmentation._color_difference(input_image[i, j], average_color)
#                                 if color_diff <= threshold:
#                                     mask[i, j] = 1
#                                     converged = False
#         return mask

#     @staticmethod
#     def _find_ranges(mask):
#         rows = len(mask)
#         cols = len(mask[0])
#         x_range = [cols, 0]
#         y_range = [rows, 0]
#         for y in range(rows):
#             for x in range(cols):
#                 if mask[y][x] == 1:
#                     if x > x_range[1]:
#                         x_range[1] = x
#                     if x < x_range[0]:
#                         x_range[0] = x
#                     if y > y_range[1]:
#                         y_range[1] = y
#                     if y < y_range[0]:
#                         y_range[0] = y

#         return x_range, y_range
    
#     @staticmethod
#     def _fill_holes(mask, x_range, y_range):
#         """
#         Fills holes in the given mask.

#         Args:
#             mask (numpy.ndarray): Binary mask.

#         Returns:
#             numpy.ndarray: Mask with filled holes.
#         """

#         directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

#         for y in range(y_range[0], y_range[1] + 1):
#             for x in range(x_range[0], x_range[1] + 1):
#                 if mask[y][x] == 0:
#                     fill = True
#                     for direction in directions:
#                         j = y
#                         i = x
#                         temporary = False
#                         while (j < y_range[1] and i < x_range[1] and j >= y_range[0] and i >= x_range[0]):
#                             if mask[j][i] == 1:
#                                 temporary = True
#                                 break
#                             j += direction[0]
#                             i += direction[1]
#                         fill = fill and temporary
#                     if fill:
#                         mask[y][x] = 1
#         return mask
    
#     @staticmethod
#     def _overlay_mask_on_image(mask, original_image, x_range, y_range):
#         """
#         Overlays the given mask on the original image.

#         Args:
#             mask (numpy.ndarray): Binary mask.
#             original_image (numpy.ndarray): Original input image.

#         Returns:
#             numpy.ndarray: Image with mask overlay.
#         """
#         cropped_image = original_image[y_range[0]:y_range[1] + 1, x_range[0]:x_range[1] + 1]
#         cropped_mask = mask[y_range[0]:y_range[1] + 1, x_range[0]:x_range[1] + 1]
#         masked_image = np.zeros_like(cropped_image)
#         masked_image[cropped_mask == 1] = cropped_image[cropped_mask == 1]
#         return masked_image

#     @staticmethod
#     def _crop_to_square(mask, x_range, y_range):
#         """
#         Crops the input mask to a square region.

#         Args:
#             mask (numpy.ndarray): Binary mask.

#         Returns:
#             tuple: New x-range and y-range for the cropped region.
#         """
#         rows = len(mask)
#         cols = len(mask[0])

#         size = max(y_range[1] - y_range[0], x_range[1] - x_range[0]) + 1
#         center_x = (x_range[1] + x_range[0]) // 2
#         center_y = (y_range[1] + y_range[0]) // 2
#         half_size = size // 2
#         new_x_range = [max(center_x - half_size - 5, 0), min(center_x + half_size + 5, cols - 1)]
#         new_y_range = [max(center_y - half_size - 5, 0), min(center_y + half_size + 5, rows - 1)]
#         return new_x_range, new_y_range
    


# class Parallel:
#     def __init__(self, llm, t_1 = 3.25, t_2 = 2.25, max_iter = 25):
#         self.llm = llm
#         self.t_1 = t_1
#         self.t_2 = t_2
#         self.max_iter = max_iter
    
#     def run(self, src_dir, dest_dir):
#         filenames = os.listdir(image_directory)
#         file_paths = [os.path.join(src_dir, filename) for filename in filenames]

#         max_threads = 8

#         result_directory = "ISIC-images/Result_Images_Square"
#         # Adjust max_treads according to the number of cpus
#         with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
#             futures = [executor.submit(process_image, file_path, result_directory , True) for file_path in file_paths]
#             concurrent.futures.wait(futures)


#     def process()




# seg = Segmentation(False, "ISIC-images/New_Images", "ISIC-images/Result_Images_Test")
# im = seg.load("ISIC_0876061.JPG")
# output = seg.segment(im)
# print(output)
# seg.save("ISIC_0876061.JPG", output)


#     def load(self, filename):
#         image_path = os.path.join(self.src_dir, filename)

#         image = Image.open(image_path)
#         image = np.array(image)
#         return image

#     def save(self, filename, image_array):
#         """
#         Saves the given image array as a JPG image in the specified directory.

#         Args:
#             image_array (numpy.ndarray): Image array to be saved.
#             directory (str): Directory where the image will be saved.
#             filename (str): Name of the file.
#             llm_mode (bool): Flag indicating whether to use llm_mode.
#         """
#         # Ensure the directory exists
#         if not os.path.exists(self.dest_dir):
#             os.makedirs(self.dest_dir)
        
#         if self.llm:
#             this_thing = Image.fromarray((image_array).astype('uint8'))
#         else:
#             this_thing = Image.fromarray((image_array * 255).astype('uint8'))

#         # Convert the image array to PIL image
#         # Save the image as JPG
#         this_thing.save(os.path.join(self.dest_dir, "_" + filename))
#         print("Image saved successfully.")


# image_directory = "ISIC-images/New_Images"
