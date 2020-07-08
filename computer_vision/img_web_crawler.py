import requests
import urllib.request
from bs4 import BeautifulSoup
import os
import time
import config_own
import re
import string

# def fun(match):
# ...  img_tag = match.group()
# ...  src = match.group(1)
# ...  full_src = "https://rakuma.rakuten.com.tw/"src
# ...  new_img_tag = img_tag.replace(src, full_src)
# ...  return new_img_tag


def web_crawling(url, file_amount, log_file):
    photolimit = 100

    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url,headers = headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    items = soup.find_all('img')
    print(items)
    items_str = str(items)
    log_file.write(items_str) # write into the log file
    log_file.write('-----------------------------------------------\n')

    img_storage_dir = config_own.IMG_CRAWLER
    #rex = r'<img.*?data-src="(.*?)">'
    # # # 找找看是否有相對路徑
    # result = re.findall(rex, html)
    # re.sub(rex, fun, html)

    for index , item in enumerate (soup.find_all('img')): # 抓取所有有<img> tag的東西

        if (item and index < photolimit ):
		    # if there is no "data-src"
            if item.get('data-src') == None:
                if item.get('src') == 'https://ir.ebaystatic.com/rs/v/fxxj3ttftm5ltcqnto1o4baovyl.png':
                    continue
                if item.get('src') == 'https://i.ebayimg.com/thumbs/images/g/JrEAAOSwo-RZuDJn/s-l1200.png':
                    continue
                if item.get('src') == 'https://i.ebayimg.com/thumbs/images/g/c3MAAOSwi8VZVP3E/s-l150.jpg':
                    continue
                else:
                    img_url_origin = item.get('src')
                    char = '1600.jpg'
                    img_url_origin = img_url_origin[:58] + char
                    html = requests.get(img_url_origin)
                    print(img_url_origin) 
                    log_file.write(img_url_origin) # write into the log file
                    log_file.write('\n')
                    # html = requests.get(item.get('src'))
                    # print(item.get('src'))
                    # log_file.write(item.get('src')) # write into the log file
                    # log_file.write('\n')

    		# if there is "data-src"
            else:
                img_url_origin = item.get('data-src')
                char = '1600.jpg'
                img_url_origin = img_url_origin[:58] + char
                html = requests.get(img_url_origin)
                print(img_url_origin) 
                log_file.write(img_url_origin) # write into the log file
                log_file.write('\n')

            img_name = img_storage_dir + str(file_amount) + '_' + str(index + 1) + '.jpg'

            with open(img_name,'wb') as file: #write in the img by "byte"
                file.write(html.content)
                file.flush()

            file.close() #close file

            print('%d_%d.jpg processing...' % (file_amount, index + 1))
            log_file.write('%d_%d.jpg processing...\n' % (file_amount, index + 1))
            time.sleep(1)

    log_file.write('=====================================================\n')
    print('Done')

if __name__ == "__main__":
    img_crawler_url_path = config_own.IMG_CRAWLER_URL

	# open a txt file to record the log info
    log_file_dir = config_own.LOG_FILE
    log_file = open(log_file_dir + 'log_file.txt', 'w', encoding="utf-8")

    file_amount = 1
    # import the url file and split lines
    with open(img_crawler_url_path) as url_file:
        for line in url_file:
            url = line.rstrip() # set up the crawed url
            web_crawling(url,file_amount,log_file)
            file_amount+=1
    
    log_file.close()