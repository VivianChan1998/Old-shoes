import sys
from PIL import Image
img = Image.open(sys.argv[1])
img.show()
print('hello')
print(sys.argv[1])