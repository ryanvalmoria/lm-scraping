const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

async function getPageData(url) {
    const browser = await puppeteer.launch({headless:'new'});
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(".jobs-single__head");
    const jobTitle = await page.$eval(".jobs-single__head h1", h1 => h1.textContent);
    const jobDesc = await page.$eval(".jobs-single__content p", p => p.textContent);
    const rawDetails = await page.$eval(".jobs-single__content", div => div.innerHTML.trim());
    const responsibilities = await page.$eval("div.jobs-single__content > ul", div => div.innerHTML);
    const requirements = await page.$eval("div.jobs-single__content > ul", div => div.innerHTML);


    return {
        jobTitle: jobTitle,
        jobDesc: jobDesc,
        jobLink: url,
        responsibilities: responsibilities,
        requirements: requirements,
        rawDetails: rawDetails
    }
    await browser.close();
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
   
    const scrapedData = [];

    for(let link of allLinks) {
        console.log("Link passed is: " + link);
        const data = await getPageData(link);
        scrapedData.push(data);
    }
    // console.log("Scraped Data is: ");
    // console.log(scrapedData);
    
    //write to excel file the scraped data
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrapedData);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,'lmphjobs.xlsx');

    console.log("---END---");
}

main();