# 二手鞋資訊轉換平台
for Windows OS.

## Environment


## Usage
### clone the repo
```
git clone https://github.com/VivianChan1998/Old-shoes.git
```
### install dev dependencies

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
  pip install requests matplotlib pillow
  ```

### register the Azure portal and set up your own computer vision resource(https://portal.azure.com/)

### set the key and the endpoint in the CLI
  ```
  setx COMPUTER_VISION_KEY "your-key"
  setx COMPUTER_VISION_ENDPOINT "your-endpoint"
  ```

### reopen the CLI

### in the project directory, type the following command and execute
  ```
  python3 main.py
  ```


## Folders



## Libraries
