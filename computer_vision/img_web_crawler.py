import requests
import urllib.request
from bs4 import BeautifulSoup
import os
import time
import config_own

url = 'https://www.ebay.com/str/usedshoesandmore/Mens-Shoes/_i.html?_storecat=828750519'
photolimit = 30

headers = {'User-Agent': 'Mozilla/5.0'}
response = requests.get(url,headers = headers) #使用header避免訪問受到限制
soup = BeautifulSoup(response.content, 'html.parser')
items = soup.find_all('img')

img_storage_dir = config_own.IMG_CRAWLER

for index , item in enumerate (items):
    if (item and index < photolimit ):
        html = requests.get(item.get('src')) # use 'get' to get photo link path , requests = send request
        img_name = img_storage_dir + str(index + 1) + '.jpg'

        with open(img_name,'wb') as file: #以byte的形式將圖片數據寫入
            file.write(html.content)
            file.flush()

        file.close() #close file
        print('第 %d 張' % (index + 1))
        time.sleep(1)

print('Done')


# import requests
# import urllib.request
# import config_own

# def getHtml(url):
# 	page = urllib.request.urlopen(url)
# 	html = page.read()
# 	return html

# html = getHtml("https://www.ebay.com/str/usedshoesandmore/Mens-Shoes/_i.html?_storecat=828750519")
# html = html.decode('UTF-8')

# # get image link
# def getImg(html):
# # use formal expression to express the img
# 	reg = r'src="([.*\S]*\.jpg)" pic_ext="jpeg"'
# 	imgre=re.compile(reg)
# 	imglist=re.findall(imgre,html)
# 	return imglist

# imgList=getImg(html)
# imgCount=0

# # store to local, create a directory before storage begin
# img_storage_dir = config_own.IMG_CRAWLER
# for imgPath in imgList:
# 	f=open( img_storage_dir + str(imgCount)+".jpg",'wb')
# 	f.write((urllib.request.urlopen(imgPath)).read())
# 	f.close()
# 	imgCount+=1
# 	print("Finish crawling.")