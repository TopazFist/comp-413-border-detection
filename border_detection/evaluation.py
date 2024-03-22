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
    testing_inputs = "ISIC-images/ISBI2016_ISIC_Part1_Test_Data"
    algorithm_output = "ISIC-testing-output"

    filenames = os.listdir(testing_inputs)
    file_paths = [os.path.join(testing_inputs, filename) for filename in filenames]
    file_paths = file_paths[:40]

    max_threads = 8
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_threads) as executor:
        futures = [executor.submit(process_image, file_path, algorithm_output, False) for file_path in file_paths]
        concurrent.futures.wait(futures)
    

    filenames_testing_output_files = os.listdir(algorithm_output)
    output_filepaths = [os.path.join(algorithm_output, filename) for filename in filenames_testing_output_files]
    print(output_filepaths)

    for output_file_path in output_filepaths:

        image_name = output_file_path.split("/")[-1][1:]
        image_with_extension = image_name.split(".")
        image_with_extension[1] = "png"
        image_with_extension[0] += "_Segmentation"
        ground_truth_image_name = ".".join(image_with_extension)
        ground_truth_path = ground_truth_folder + "/" + ground_truth_image_name

        total_jaccard = 0
        total_items = 0
        total_dice = 0

        if os.path.exists(ground_truth_path):
            testing_image = cv2.imread(output_file_path, cv2.IMREAD_GRAYSCALE)
            print(testing_image)
            segmentation_image = cv2.imread(ground_truth_path, cv2.IMREAD_GRAYSCALE)
            print(segmentation_image)
            jaccard_score = jaccard(testing_image, segmentation_image)
            dice_score = dice(testing_image, segmentation_image)
            total_jaccard += jaccard_score
            total_dice += dice_score
            total_items += 1
            print(f"Found corresponding segmentation file for {output_file_path}: {ground_truth_path}")
            print("Jaccard Score for images: ", jaccard_score)
            print("Dice Score for images: ", dice_score)

        else:
            print(f"No corresponding segmentation file found for {output_file_path}")

    print("Dice Score: ", total_dice/total_items)
    print("Jaccard Score: ", total_jaccard/total_items)
    
if __name__ == '__main__':
    main()
#jaccard + Dice