from PIL import Image
import os
import config_own

list = os.listdir(config_own.BEFORE_RESIZE_DIR)
print(list)

for image in list:
    id_tag = image.find(".")
    name=image[0:id_tag]
    print(name)

    im=Image.open( config_own.BEFORE_RESIZE_DIR + image )
    out = im.resize((128, 128))
    #out.show()
    out.save( config_own.AFTER_RESIZE_DIR + name + ".jpg")