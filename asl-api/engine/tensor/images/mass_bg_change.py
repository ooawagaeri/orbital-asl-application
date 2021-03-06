"""
mass_bg_change.py
Used to change the background of directories of images with directories of backgrounds.
"""

import os
import PIL
import numpy as np
import cv2
import random
from PIL import Image
from tqdm import tqdm
from engine.tensor.images.bg_change import BgChanger


# Read path
input_path = '../../../../../Datasets/images/prep'
bg_path = '../../../../../Datasets/images/all_bgs/all'
# Write path
output_path = '../../../../../Datasets/images/rng_background'


def random_crop(image, crop_height, crop_width):
    """
    Randomly crops given image into target dimension.
    Parameters:
        image (numpy.ndarray): Background image
        crop_height (int): Height of crop dimension
        crop_width (int): Width of crop dimension
    Returns:
        crop (cv2.Mat): Cropped background image
    """
    # End of x-axis
    max_x = image.shape[1] - crop_width
    # End of y-axis
    max_y = image.shape[0] - crop_height

    # In case image is smaller than crop dimension
    if max_x < crop_width:
        max_x = image.shape[1]
    if max_y < crop_width:
        max_y = image.shape[0]

    # Front of x-axis
    x = np.random.randint(0, max_x)
    # Front of y-axis
    y = np.random.randint(0, max_y)

    # Get cropped image
    crop = image[y: y + crop_height, x: x + crop_width]

    return crop


# Referral temperature list, in kelvin
kelvin_temperature_table = {
    1000: (255, 56, 0),
    1500: (255, 109, 0),
    2000: (255, 137, 18),
    2500: (255, 161, 72),
    3000: (255, 180, 107),
    3500: (255, 196, 137),
    4000: (255, 209, 163),
    4500: (255, 219, 186),
    5000: (255, 228, 206),
    5500: (255, 236, 224),
    6000: (255, 243, 239),
    6500: (255, 249, 253),
    7000: (245, 243, 255),
    7500: (235, 238, 255),
    8000: (227, 233, 255),
    8500: (220, 229, 255),
    9000: (214, 225, 255),
    9500: (208, 222, 255),
    10000: (204, 219, 255)}


def convert_temp(image, chosen_temp):
    """
    Changes the colour temperature of given image.
    Parameters:
        image (cv2.Mat): Target image
        chosen_temp (int): Temperature number
    Returns:
        (cv2.Mat): Cropped background image
    """
    # CV2 to PIL Image
    temp_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    temp_image = Image.fromarray(temp_image)

    # Retrieve RBG values of temperature
    r, g, b = kelvin_temperature_table[chosen_temp]
    matrix = (r / 255.0, 0.0, 0.0, 0.0,
              0.0, g / 255.0, 0.0, 0.0,
              0.0, 0.0, b / 255.0, 0.0)

    # Apply new temperature and convert to numpy/cv2 matrix
    return np.array(temp_image.convert('RGB', matrix))

# Initialize Background changer
changer = BgChanger()

# Limit of maximum images changed
max_images = 1000

# Retrieve directories
change_from = os.listdir(input_path)

# Iterate through input_path directories
for index, sub_path in tqdm(enumerate(change_from), total=len(change_from)):
    # Create subdirectories in output path
    os.makedirs(f"{output_path}/{sub_path}", exist_ok=True)

    # Starting name
    start_number = 5000
    # Track number of images
    count = 0

    # Iterate through input_path sub-directories
    for file in os.listdir(f"{input_path}/{sub_path}"):
        # Stop when limit is reached
        if count == max_images:
            break

        # Path of target file
        path = os.path.join(input_path, sub_path, file)

        # Read target image
        img = cv2.imread(path)
        # img = cv2.flip(img, 1)

        # Randomly read a background image
        bg_img = PIL.Image.open(f"{bg_path}/{random.choice(os.listdir(bg_path))}")
        frame = np.asarray(bg_img)

        # Randomly crop part of background
        random_bg_crop = random_crop(frame, 400, 400)

        # Change target image temperature
        temp = convert_temp(img, 7500)

        # Change background of target image
        new_img = changer.run(temp, random_bg_crop)

        # Save image
        cv2.imwrite(f"{output_path}/{sub_path}/{sub_path}{start_number}.jpg", new_img)

        start_number += 1
        count += 1
