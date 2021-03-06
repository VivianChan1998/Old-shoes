import os
from os.path import basename
import sys
import json
import requests
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
#from config import MY_PATH
# import config_own
import logging

def img_processing():
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
    
    subscription_key = sys.argv[2]
    endpoint = sys.argv[3]

    analyze_url = endpoint + "vision/v3.0/analyze"

    # Set image_path
    # image_path = config_own.IMG_PATH ###################################################################
    image_path = sys.argv[1]

    # Read the image into a byte array
    image_data = open(image_path, "rb").read()
    headers = {'Ocp-Apim-Subscription-Key': subscription_key,
               'Content-Type': 'application/octet-stream'}
    params = {'visualFeatures': 'Brands'}
    response = requests.post(
        analyze_url, headers=headers, params=params, data=image_data)
    response.raise_for_status()

    # Description of the image
    analysis = response.json() # the JSON return value of the image
    # print(analysis) ######## this is what frontend exactly need (??? #########
    capture = analysis["brands"][0]["name"]
    print(capture)

    # split the image name to rename the JSON file
    base = os.path.basename(image_path)
    file_name = os.path.splitext(base)[0]

    # # write into the JSON file
    # JSON_dir = config_own.JSON_DIR #####################################
    # with open( JSON_dir + file_name + '.json', 'w', encoding='utf-8') as f:
    #     json.dump(analysis, f, ensure_ascii=False, indent=4)


    # # set the show title on the image window
    # image_caption = analysis["brands"][0]["name"].capitalize()
    # #print(image_caption)
    # # Display the image and overlay it with the caption.
    # image = Image.open(BytesIO(image_data))
    # plt.imshow(image)
    # plt.axis("off")
    # _ = plt.title(image_caption, size="x-large", y=-0.1)
    # plt.show()

if __name__ == "__main__":
    try:
        img_processing()
    except:
        logging.exception("Message")