# takes 3 folders = one folder with images to create masks, one saved folder, one folder for ground truth, 
import os
from run import process_image
import concurrent.futures
import numpy as np
import cv2



def jaccard(image1, image2):
    intersection = np.logical_and(image1, image2)
    union = np.logical_or(image1, image2)

    jaccard_index = np.sum(intersection) / np.sum(union)
    
    return jaccard_index

def dice(image1, image2):
    intersection = np.sum(image1 & image2)
    dice_coefficient = (2.0 * intersection) / (np.sum(image1) + np.sum(image2))
    return dice_coefficient

def main():
    ground_truth_folder = "ISIC-images/ISBI2016_ISIC_Part1_Test_GroundTruth"
    testing_images_folder = "ISIC-images/ISBI2016_ISIC_Part1_Test_Data"
    filenames = os.listdir(testing_images_folder)
    file_paths = [os.path.join(testing_images_folder, filename) for filename in filenames]

    file_paths = file_paths[:10]
    print(file_paths)

    max_threads = 8
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
        futures = [executor.submit(process_image, file_path, "ISIC-testing-images/testing_data_ISIC", False) for file_path in file_paths]
        concurrent.futures.wait(futures)
    
    filenames_testing = os.listdir("ISIC-testing-images/testing_data_ISIC")
    file_paths_testing = [os.path.join(testing_images_folder, filename) for filename in filenames_testing]

    file_paths_testing = file_paths[:10]

    for base_file_path in file_paths_testing:
        base_filename = os.path.basename(base_file_path)
        segmentation_filename = base_filename.replace(".", "_Segmentation.")
        segmentation_file_path = os.path.join(ground_truth_folder, segmentation_filename)
        
        total_jaccard = 0
        total_items = 0
        total_dice = 0

        if os.path.exists(segmentation_file_path):
            testing_image = cv2.imread(base_file_path, cv2.IMREAD_GRAYSCALE)
            segmentation_image = cv2.imread(segmentation_file_path, cv2.IMREAD_GRAYSCALE)
            total_jaccard += jaccard(testing_image, segmentation_image)
            total_dice += dice(testing_image, segmentation_image)
            total_items += 1
            print(f"Found corresponding segmentation file for {base_filename}: {segmentation_filename}")
        else:
            print(f"No corresponding segmentation file found for {base_filename}")

    print("Dice Score: ", total_dice/total_items)
    print("Jaccard Score: ", total_jaccard/total_items)
    
if __name__ == '__main__':
    main()
#jaccard + Dice