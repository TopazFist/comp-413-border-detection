# Image Segmentation Evaluation

This repository contains scripts for detecting skin lesions in images and evaluating the segmentation results using Jaccard similarity and Dice similarity.

## Contents

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Usage](#usage)
4. [Scripts](#scripts)
5. [Evaluation Metrics](#evaluation-metrics)
6. [Results](#results)
7. [Dataset](#dataset)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

This repository contains three main scripts:

1. `border_detection.py`: Contains functions for detecting borders in images and generating binary masks.
2. `run.py`: Runs image processing on a batch of images in parallel.
3. `evaluation.py`: Evaluates the segmentation results using Jaccard similarity and Dice similarity.

## Requirements

- Python 3.x
- NumPy
- OpenCV (cv2)
- Matplotlib
- scikit-image
- PIL
- concurrent.futures
- os
- statistics

## Usage

1. Clone the repository:

    ```bash
    git clone https://github.com/TopazFist/comp-413-border-detection.git
    ```

2. Navigate to the repository:

    ```bash
    cd border_detection
    ```

3. Run the evaluation script:

    ```bash
    python evaluation.py
    ```

## Scripts

### 1. `border_detection.py`

This script contains functions for detecting borders in images and generating binary masks.

- `get_border(original_im, llm_mode)`: Retrieves the border of the input image.
- `get_edges(mask)`: Retrieves the edges of the input mask.
- `is_coordinate_in_mask(mask, coord)`: Checks if the given coordinate is within the mask.
- `euclidean_distance(coord1, coord2)`: Computes the Euclidean distance between two coordinates.
- `color_difference(pixel1, pixel2)`: Computes the absolute difference between two pixel values.
- `expand_mask(mask, input_image, radius, threshold)`: Expands the given mask based on color similarity.
- `fill_holes(mask)`: Fills holes in the given mask.
- `overlay_mask_on_image(mask, original_image, alpha)`: Overlays the given mask on the original image.
- `crop_to_square(mask)`: Crops the input mask to a square region.

### 2. `run.py`

This script acts as a wrapper to run `border_detection.py` on an image or a set of images.

- `process_image(file_path, destination_path, llm_mode)`: Processes the image located at the specified file path and saves the resulting image.
- `main()`: Main function to process images in parallel.
- `save_image(image_array, directory, filename, llm_mode)`: Saves the given image array as a JPG image in the specified directory.
- `visual_results(out)`: Visualizes the results by displaying original images overlaid with their corresponding masks.

### 3. `evalutation.py`

This script is used to evaluate segmentation results using Jaccard similarity and Dice similarity.

- `jaccard(image1, image2)`: Calculates the Jaccard similarity between two binary images.
- `dice(image1, image2)`: Calculates the Dice similarity between two binary images.
- `main()`: Main function to evaluate segmentation results.

## Evaluation Metrics

- **Jaccard index**: Also known as Intersection over Union (IoU), measures the similarity between two sets by calculating the ratio of the intersection to the union of the sets.
    ```python
    jaccard_index = (intersection) / (union)
    ```

- **Dice coefficient**: Measures the similarity between two sets by calculating the ratio of twice the intersection to the sum of the sizes of the two sets.
    ```python
    dice_coefficient = (2.0 * intersection) / (size_set1 + size_set2)
    ```

## Results

The evaluation script generates Jaccard similarity and Dice similarity for the segmentation results.

## Dataset

The dataset used for testing is from the [ISIC Image Archive](https://www.isic-archive.com/). This dataset contains images related to skin lesions and corresponding ground truth masks.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
