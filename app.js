const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

async function getPageData(url,page) {
    await page.goto(url);

    
    try {
        await page.waitForSelector(".jobs-single__head");
    } catch (e) {
        console.log('Failed to load this page: ' + url);
        return null;
    }

    const jobTitle = await page.$eval(".jobs-single__head h1", h1 => h1.textContent);
    const jobDesc = await page.$eval(".jobs-single__content p", p => p.textContent);
    const rawDetails = await page.$eval(".jobs-single__content", div => div.innerHTML.trim());
    let responsibilities = '';
    let requirements = '';

    const allULs = await page.evaluate(() => {
        const div = document.querySelector('.jobs-single__content');
        const ulList = div.querySelectorAll('ul');
        const ulArray = Array.from(ulList).map(ul=>ul.outerHTML);
        return ulArray;
    });

    //if length is 2, meaning the structure is is 1 ul for responsibilities and 1 ul for requirements
    if (allULs.length == 2) {
        responsibilities = allULs[0];
        requirements = allULs[1];
    }

    return {
        jobTitle: jobTitle,
        jobDesc: jobDesc,
        jobLink: url,
        responsibilities: responsibilities,
        requirements: requirements,
        rawDetails: rawDetails
    }
    
}


async function getLinks() {
    const browser = await puppeteer.launch({headless:'new'});
    const page = await browser.newPage();
    url  = 'https://legalmatch.ph/jobs/';
    await page.goto(url);

    await page.waitForSelector('.avail_post_list_ul');
    const links = await page.$$eval('.avail_post_list_ul li .row .jobs-button .apply-btn-', allLinks => {
        return allLinks.map(link => link.href);
    });
   
    return links;
}


async function main() {
    //first, get all the links
    const allLinks = await getLinks();
    console.log(allLinks);
   
    const browser = await puppeteer.launch({headless:'new'});
    const page = await browser.newPage();
    const scrapedData = [];

    for(let link of allLinks) {
        console.log("Opened link: " + link);
        const data = await getPageData(link,page);
        if (data) {
            scrapedData.push(data);
        }
    }
    // console.log("Scraped Data is: ");
    // console.log(scrapedData);
    

    //write to excel file the scraped data
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrapedData);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,'lmphjobs.xlsx');

    console.log("---END---");
    await browser.close();
}

main();