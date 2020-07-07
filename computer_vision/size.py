import os
from os.path import basename
import sys
import json
import requests
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import cv2
import numpy as np
import config_own


def shot_cv2():
	# set the img storage path
	img_path = config_own.SHOT_CV2_DIR

	# cpature image by cv2
	cam = cv2.VideoCapture(1)
	cv2.namedWindow("image capture")
	img_counter = 0
	while True:
	    ret, frame = cam.read()
	    if not ret:
	        print("failed to grab frame")
	        break
	    cv2.imshow("image capture", frame)

	    k = cv2.waitKey(1)
	    if k%256 == 27:
	        # ESC pressed
	        print("Escape hit, closing...")
	        break
	    elif k%256 == 32:
	        # SPACE pressed
	        img_name = "opencv_frameshot_{}.jpg".format(img_counter)
	        cv2.imwrite( img_path + img_name, frame)
	        print("{} written!".format(img_name))
	        img_counter += 1
	cam.release()
	cv2.destroyAllWindows()

########## To-Do ##########
### optimization ### warping ###
### the shot-raw-img is needed to be warpped
### or the coin and shoes will be in inaccurate scales
# def img_warping():


def img_transfer_json():
	img_counter = 0
	# Set the COMPUTER_SUBSCRIPTION_KEY & COMPUTER_VISION_ENDPOINT
	if 'COMPUTER_VISION_SUBSCRIPTION_KEY' in os.environ:
	    subscription_key = os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY']
	else:
	    print("\nSet the COMPUTER_VISION_SUBSCRIPTION_KEY environment variable.\n**Restart your shell or IDE for changes to take effect.**")
	    sys.exit()

	if 'COMPUTER_VISION_ENDPOINT' in os.environ:
	    endpoint = os.environ['COMPUTER_VISION_ENDPOINT']
	else:
	    print("\nSet the COMPUTER_VISION_ENDPOINT environment variable.\n**Restart your shell or IDE for changes to take effect.**")
	    sys.exit()

	analyze_url = endpoint + "vision/v3.0/analyze"

	while True:
		try: # if there are still images remained to be analyzed
			# Set image_path
			image_dir = config_own.SHOT_CV2_DIR
			image_name = "opencv_frameshot_{}.jpg".format(img_counter)
			image_path = image_dir + image_name

			# Read the image into a byte array
			image_data = open(image_path, "rb").read()
			headers = {'Ocp-Apim-Subscription-Key': subscription_key,
			           'Content-Type': 'application/octet-stream'}
			params = {'visualFeatures': 'Brands,Objects'}
			response = requests.post(
			    analyze_url, headers=headers, params=params, data=image_data)
			response.raise_for_status()

			# Description of the image
			analysis = response.json() # the JSON return value of the image
			print(analysis) 

			# split the image name to rename the JSON file
			base = os.path.basename(image_path)
			file_name = os.path.splitext(base)[0]

			# write into the JSON file
			JSON_dir = config_own.JSON_DIR
			with open( JSON_dir + file_name + '.json', 'w', encoding='utf-8') as f:
			    json.dump(analysis, f, ensure_ascii=False, indent=4)

			k = cv2.waitKey(1)
			img_counter += 1	

		except FileNotFoundError: # if there is no img remained to be analyzed
			break
		
		if k%256 == 27:
			break

if __name__ == "__main__":
	shot_cv2()
	img_transfer_json()