# 二手鞋資訊轉換平台
Build with Windows OS and Azure.
![Architecture Workflow - with detail](https://user-images.githubusercontent.com/33646045/91403276-e3dcc180-e873-11ea-8646-83321ec11e57.png)

:signal_strength: [Introduction by Powerpoint](https://msseed9-my.sharepoint.com/:p:/g/personal/17-yvonne_hsiao_msseed_idv_tw/EUfuh_ZUXkZDm0cWxrKJEU4B3rYHyfW-gAc7EphmfDqTiw?e=UEqFON)

:cinema: [DEMO video](https://youtu.be/zY9YaBBk1hw)

## Files

### DIR //computer_vision//

#### /evaluate/
model training programs

#### /model/
trained-model

#### /img_web_crawler.py
for web crawling

#### /main.py
main program of the computer vision: to detect the brands of the input img

#### /size.py
take a picture by webcam and analysize the output image


## Libraries

## Usage (only for Computer Vision)
### 1. clone the repo
```
git clone https://github.com/VivianChan1998/Old-shoes.git
```
### 2. install dev dependencies

#### install and activate virtual environment (https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

##### install pip
  ```
  py -m pip --version
  ```
##### install virtual environment
  ```
  py -m pip install --user virtualenv
  ```
##### create virtual environment: in the folder of this project
  ```
  py -m venv env
  ```
##### activate the virtual environment that have been built
  ```
  .\env\Scripts\activate
  ```

#### install python packages
  ```
  pip install requests matplotlib pillow opencv-python
  ```

### 3. register the Azure portal and set up your own computer vision resource(https://portal.azure.com/)

### 4. in the project directory, type the following command and execute
  ```
  python3 main.py <your-cv-sunscription-key> <your-cv-endpoint>
  ```

### 5. Create two directories: "JSON_file" & "img" in the proper site of your computer

### 6. set up the "config_own.py" file

  ```
  # First create the "config_own.py" file in the "computer_vision" directory
  # and then set up the parameters: JSON_DIR, SHOT_CV2_DIR, IMG_PATH, IMG_DIR
  
  JSON_DIR = "your-own-path" # which stands for the path of the JSON directory
  SHOT_CV2_DIR = "your-own-path" # which stands for the path of the images that cv2 camera shoot
  IMG_PATH = "your-own-path" # which stands for the path of the to-be-analysized-image
  IMG_DIR = "your-own-path" # which stands for the path of the directory where the to-be-analysized-images store
  ```



