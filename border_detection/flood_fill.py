# segmentation.flood_fill(image, seed_point, new_value, *, footprint=None, connectivity=None, tolerance=None, in_place=False)[source]#


from skimage.morphology import flood_fill

import cv2
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np


def downsample(image):
    result = []

    width, height = image.shape[1], image.shape[0]
    cv2.resize(image, (width // 2, height // 2))

    return result




image_path = 'test_images/data.JPG'
image = Image.open(image_path)
image = np.array(image) # Convert to a numpy array
im = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
im = im.astype(np.float32) / 255


plt.figure()
plt.imshow(im)
plt.show()

out = flood_fill(im, (220, 370), 1, tolerance=0.1)

plt.figure()
plt.imshow(out)
plt.show()


# laplacian pyramid - loss less
# don't 