import requests
import urllib.request
from bs4 import BeautifulSoup
import os
import time
import config_own
import re

# def fun(match):
# ...  img_tag = match.group()
# ...  src = match.group(1)
# ...  full_src = "https://rakuma.rakuten.com.tw/"src
# ...  new_img_tag = img_tag.replace(src, full_src)
# ...  return new_img_tag

# set up the crawed url
url = 'https://www.ebay.com/str/usedshoesandmore/Mens-Shoes/_i.html?_pgn=3&_storecat=828750519'
photolimit = 100

# open a txt file to record the log info
log_file_dir = config_own.LOG_FILE
log_file = open(log_file_dir + 'log_file.txt', 'w')

headers = {'User-Agent': 'Mozilla/5.0'}
response = requests.get(url,headers = headers)
soup = BeautifulSoup(response.content, 'html.parser')
items = soup.find_all('img')
print(items)
items_str = str(items)
log_file.write(items_str) # write into the log file

img_storage_dir = config_own.IMG_CRAWLER
#rex = r'<img.*?data-src="(.*?)">'
# # # 找找看是否有相對路徑
# result = re.findall(rex, html)
# re.sub(rex, fun, html)

for index , item in enumerate (soup.find_all('img')): # 抓取所有有<img> tag的東西

    if (item and index < photolimit ):
		# if there is no "data-src"
        if item.get('data-src') == None:
            html = requests.get(item.get('src'))
            print(item.get('src'))
			#items_get_str = str(item.get('src'))
            log_file.write(item.get('src')) # write into the log file

		# if there is "src"
        else:
            html = requests.get(item.get('data-src')) # use 'get' to get photo link path , requests = send request
            print(item.get('data-src')) 
            log_file.write(item.get('data-src')) # write into the log file


        img_name = img_storage_dir + str(index + 1) + '.jpg'

        with open(img_name,'wb') as file: #write in the img by "byte"
            file.write(html.content)
            file.flush()

        file.close() #close file

        print('%d.jpg processing...' % (index + 1))
        log_file.write('%d.jpg processing...' % (index + 1))
        time.sleep(1)

log_file.close()
print('Done')