from PIL import Image
import os
import config_own

list = os.listdir(config_own.BEFORE_RESIZE_DIR)
print(list)
file_amount = 1

for image in list:
    #id_tag = image.find("_")

    img_name = "3_{}.jpg".format(file_amount)

    im=Image.open( config_own.BEFORE_RESIZE_DIR + image )
    print(img_name)
    out = im.resize((128, 128))
    out.save( config_own.AFTER_RESIZE_DIR + img_name ) 

    file_amount+=1