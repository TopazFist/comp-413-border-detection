
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

def process_image(file_path):
    original_im = image(file_path)
    resulting_image = get_border(original_im, True)
    save_image(resulting_image, "ISIC-images/Result_Images_Square", os.path.basename(file_path))


def main():
    result = []

    image_directory = "ISIC-images/New_Images"
    filenames = os.listdir(image_directory)
    file_paths = [os.path.join(image_directory, filename) for filename in filenames]
    # random.shuffle(filenames)  # Shuffle the list of filenames
    pictures = 0

    # start_time = time.time()


    max_threads = 8
    # Adjust max_treads according to the number of cpus
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
        futures = [executor.submit(process_image, file_path) for file_path in file_paths]
        concurrent.futures.wait(futures)


    # for filename in filenames:
    #     if filename.endswith(".JPG"):  # Check if file is an image
    #         image_path = os.path.join(image_directory, filename)
    #         original_im = image(image_path)

    #         mask = get_border(original_im)

    #         resulting_image = convert_image_mask(original_im, mask)

    #         save_image(resulting_image, "ISIC-images/Result_Images", filename)

    #         # result.append((original_im, mask))

    # end_time = time.time()
    # elapsed_time = end_time - start_time
    # print("Elapsed time:", elapsed_time, "seconds")

        # if pictures == 9:
        #     break
        # else:
        #     pictures += 1

    # visual_results(result)        
    


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


if __name__ == '__main__':
    main()