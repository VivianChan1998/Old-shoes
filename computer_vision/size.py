######### This file is for finding out the brand and the size of the shoes. #################
import os
from os.path import basename
import sys
import json
import requests
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import numpy as np
import logging
import cv2
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
	        break

	cam.release()
	cv2.destroyAllWindows()


########## To-Do ##########
### optimization ### warping ###
### the shot-raw-img is needed to be warpped
### or the coin and shoes will be in inaccurate scales
# def img_warping():


def img_transfer_json(endpoint):
	img_counter = 0
	# # Set the COMPUTER_SUBSCRIPTION_KEY & COMPUTER_VISION_ENDPOINT
	# if 'COMPUTER_VISION_SUBSCRIPTION_KEY' in os.environ:
	#     subscription_key = os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY']
	# else:
	#     print("\nSet the COMPUTER_VISION_SUBSCRIPTION_KEY environment variable.\n**Restart your shell or IDE for changes to take effect.**")
	#     sys.exit()

	# if 'COMPUTER_VISION_ENDPOINT' in os.environ:
	#     endpoint = os.environ['COMPUTER_VISION_ENDPOINT']
	# else:
	#     print("\nSet the COMPUTER_VISION_ENDPOINT environment variable.\n**Restart your shell or IDE for changes to take effect.**")
	#     sys.exit()

	analyze_url = endpoint + "vision/v3.0/analyze"

	while True:
		try: # if there are still images remained to be analyzed
			# Set image_path
			image_dir = config_own.SHOT_CV2_DIR
			image_name = "opencv_frameshot_{}.jpg".format(img_counter)
			image_path = image_dir + image_name
			# image_path = sys.argv[1] ###################################

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
			# print(analysis)

			# split the image name to rename the JSON file
			base = os.path.basename(image_path)
			file_name = os.path.splitext(base)[0]

			# # write into the JSON file
			# JSON_dir = config_own.JSON_DIR
			# with open( JSON_dir + file_name + '.json', 'w', encoding='utf-8') as f:
			#     json.dump(analysis, f, ensure_ascii=False, indent=4)

			k = cv2.waitKey(1)
			img_counter += 1

			# return value: coin's width & object's width
			return analysis


		except FileNotFoundError: # if there is no img remained to be analyzed
			break
		
		if k%256 == 27:
			break

# to scale the main_obj size by a NT$10 coin
# NT$10 coin's diameter = 26mm
def scaling(input_json):
	ruler = input_json["objects"][0]["rectangle"]["w"]
	main_obj = input_json["objects"][1]["rectangle"]["w"]

	main_obj_scale = (main_obj/ruler)*26
	return main_obj_scale


######### TO-DO ##########
### 台灣/歐/美/日 各式尺寸轉換 ###
### 男女不一樣, 所以要先判斷是男鞋還是女鞋 ###
def scaling_type_transform(obj_scale):
	specification = {
		"jp": 22, "tw": 66, "usa": 5, "uk": 3, "eur": 34
	}
	# if gender == women: ##### if the input is women's shoes 
	if obj_scale <= 22:
		specification = { "jp": 22, "tw": 66, "usa": 5, "uk": 3, "eur": 34}
	elif 22 <= obj_scale <= 22.5:
		specification = { "jp": 22.5, "tw": 67, "usa": 5.5, "uk": 3.5, "eur": 35}
	elif 22.5 <= obj_scale <= 23:
		specification = { "jp": 23, "tw": 68, "usa": 6, "uk": 4, "eur": 36}
	elif 23 <= obj_scale <= 23.5:
		specification = { "jp": 23.5, "tw": 69, "usa": 6.5, "uk": 4.5, "eur": 37}
	elif 23.5 <= obj_scale <= 24:
		specification = { "jp": 24, "tw": 70, "usa": 7, "uk": 5, "eur": 38}
	elif 24 <= obj_scale <= 24.5:
		specification = { "jp": 24.5, "tw": 71, "usa": 7.5, "uk": 5.5, "eur": 39}
	elif 24.5 <= obj_scale <= 25:
		specification = { "jp": 25, "tw": 72, "usa": 8, "uk": 6, "eur": 40}
	elif 25 <= obj_scale <= 25.5:
		specification = { "jp": 25.5, "tw": 73, "usa": 8.5, "uk": 6.5, "eur": 41}
	elif 25.5 <= obj_scale <= 26:
		specification = { "jp": 26, "tw": 74, "usa": 9, "uk": 7, "eur": 41}
	elif 26 <= obj_scale <= 26.5:
		specification = { "jp": 26.5, "tw": 75, "usa": 9.5, "uk": 7.5, "eur": 42}
	elif 26.5 <= obj_scale <= 27:
		specification = { "jp": 27, "tw": 76, "usa": 10, "uk": 8, "eur": 43}
	elif 27 <= obj_scale <= 27.5:
		specification = { "jp": 27.5, "tw": 78, "usa": 10.5, "uk": 8.5, "eur": 44}
	elif 27.5 <= obj_scale <= 28:
		specification = { "jp": 28, "tw": 79, "usa": 11, "uk": 9, "eur": 44}
	elif 28 <= obj_scale <= 28.5:
		specification = { "jp": 28.5, "tw": 80, "usa": 11.5, "uk": 9.5, "eur": 45}
	elif 28.5 <= obj_scale <= 29:
		specification = { "jp": 29, "tw": 81, "usa": 12, "uk": 10, "eur": 45}
	elif 29 <= obj_scale <= 29.5:
		specification = { "jp": 29.5, "tw": 82, "usa": 12.5, "uk": 10.5, "eur": 46}
	elif 29.5 <= obj_scale <= 30:
		specification = { "jp": 30, "tw": 66, "usa": 13, "uk": 11, "eur": 46}
	return specification



if __name__ == "__main__":

	try:
		# load the needed keys
		subscription_key = sys.argv[1] #####################################
		endpoint = sys.argv[2] #####################################

		shot_cv2() # take pics #####################################################
		input_json = img_transfer_json(endpoint)
		obj_scale = scaling(input_json) # scaling
		print( "{}".format(obj_scale))
		specification = scaling_type_transform(obj_scale) # transform the specification
		print( "|| JP: %d cm || TW: %d || USA: %d || UK: %d || Eur: %d ||" % (specification["jp"], specification["tw"], specification["usa"], specification["uk"], specification["eur"]) )



	except:
		logging.exception("Message")