# LMPH WEB SCRAPING EXAM USING JS

## General Requirements:
The requirement is to scrape the contents of the Job page of Legalmatch PH, https://legalmatch.ph, for the following information
- Job positions/roles
- General description of the role/position
- Apply link
- Job details information
  - responsibilities
  - requirements
  - raw paragraph of relevant entire details page
  
The requirement is to code the scraper using JS. As much as possible, unless otherwise
demonstrated/proven impractical or semi-impossible for the exam duration, the scraping
tool should run on command line and headless.
The scraped-off information should be in XLS format.


## Prerequisites:

1. Clone the repo:
```
git clone https://github.com/ryanvalmoria/lm-scraping.git
```

2. Make sure you have NodeJS installed in your computer
```
sudo apt install nodejs
sudo apt install npm
```

3. Install the Puppeteer library
```
npm install puppeteer
```

4. Install the XLSX library
```
npm install xlsx
```

5. Download packages
```
npm install
```


## Running the script:
To run the web scraping script in terminal or command line:
```
node app.js
```
In the root directory, you can find the scraped data in:
```
lmphjobs.xlsx
```

Sample result:
![image](https://github.com/ryanvalmoria/lm-scraping/assets/149349681/b7ef815c-55c2-46d5-ba54-37814cbad79a)

