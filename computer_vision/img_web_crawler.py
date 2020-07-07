import re
import urllib.request

def getHtml(url):
	page = urllib.request.urlopen(url)
	html = page.read()
	return html
	html = getHtml("https://www.ebay.com/str/usedshoesandmore/Mens-Shoes/_i.html?_storecat=828750519")
	#html = html.decode('UTF-8')

# get image link
def getImg(html):
# use formal expression to express te img
	reg = r'src="([.*\S]*\.jpg)" pic_ext="jpeg"'
	imgre=re.compile(reg)
	imglist=re.findall(imgre,html)
	return imglist

imgList=getImg(html)
imgCount=0

# store to local, create a directory before storage begin
img_dir = 
for imgPath in imgList:
	f=open("../pic/"+str(imgCount)+".jpg",'wb')
	f.write((urllib.request.urlopen(imgPath)).read())
	f.close()
	imgCount+=1
	print("Finish crawling.")