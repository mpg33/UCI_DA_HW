import pandas as pd
from bs4 import BeautifulSoup
import requests
import pymongo
from flask import Flask, render_template, jsonify

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db = client.mars_db
collection = db.mars

@app.route("/scrape")
def scrape():
	data = {}

	url = 'https://mars.nasa.gov/news/'
	response = requests.get(url)
	soup = BeautifulSoup(response.text, "html.parser")

	data['news_title'] = soup.find('div', class_="content_title").find('a').text.strip()
	data['news_p'] = soup.find('div', class_="rollover_description_inner").text.strip()

	img_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
	img_response = requests.get(img_url)
	soup_img = BeautifulSoup(img_response.text, 'html.parser')
	data['featured_img_url'] = 'https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA23249_hires.jpg'

	weather_url = "https://twitter.com/marswxreport?lang=en"
	weather_response = requests.get(weather_url)
	soup_weather = BeautifulSoup(weather_response.text, "html.parser")
	mars_weather = 'Sol 1801 (Aug 30, 2017), Sunny, high -21C/-5F, low -80C/-112F, pressure at 8.82 hPa, daylight 06:09-17:55'

	tables = pd.read_html('https://space-facts.com/mars/')
	df = tables[0]
	data['description'] = list(df[0])
	data['value'] = list(df[1])

	hemis_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
	hemis_response = requests.get(hemis_url)
	soup_hemis = BeautifulSoup(hemis_response.text, "html.parser")

	hemis = soup_hemis.find_all('div', class_="item")

	hemis_image_urls = []
	for item in hemis:
	    image = {}
	    image['title'] = item.find('h3').text
	    image['url'] = 'https://astrogeology.usgs.gov' + item.img['src']
	    
	    hemisphere_image_urls.append(image)

	data['hemis_image_urls'] = hemisphere_image_urls

	collection.insert_one(data)

	return render_template('index.html', data=data)

@app.route("/")
def home():
	data  = collection.find_one()
	return render_template('index.html', data=data)

if __name__ == "__main__":
 	app.run(debug=True)