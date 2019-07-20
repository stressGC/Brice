"phantombuster command: nodejs";
"phantombuster package: 5";
"phantombuster flags: save-folder";
// "phantombuster dependencies: lib-MagicSeaWeed.js";

/* buster */
const Buster = require("phantombuster");
const buster = new Buster();

/* puppeteer */
const puppeteer = require('puppeteer');

/* helpers */
// const { scrapeSurfAreas } = require('lib-MagicSeaWeed');
const scrapeSurfAreas = (spotListSelector) => {
  const wrapper = document.querySelector(spotListSelector);
  const surfAreasWrapper = wrapper.children;
  const surfAreas = Array.from(surfAreasWrapper).map((e) => {
    const urlSplitted = e.href.split('/');
    const id = urlSplitted.pop() || urlSplitted.pop();
    return {
      url: e.href,
      name: e.title,
      id,
    };
  });
  return surfAreas;
};

/* constants */
const MSW_FRANCE_SURFSPOTS_URL= 'https://magicseaweed.com/France-Surf-Forecast/2/';
const MSW_AREA_LIST_SELECTOR = '.region-surf-areas section.list-group';
const MSW_SPOTS_LIST_SELECTOR = '.msw-js-spot-list';

const scrapeArea = async ({ url }, browser) => {
  const areaPage = await browser.newPage();
  await areaPage.goto(url);
  // await areaPage.screenshot({ path: `/areas/${name}.png` });
  const spotsInArea = await areaPage.evaluate((selector) => {
    const spotListCollection = document.querySelector(selector).getAttribute('data-collection');
    return JSON.parse(spotListCollection);
  }, MSW_SPOTS_LIST_SELECTOR);
  await areaPage.close();
  return spotsInArea;
};
  
const main = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  
  const page = await browser.newPage();
  await page.goto(MSW_FRANCE_SURFSPOTS_URL);
  await page.screenshot({ path: 'mainpage.png' });

  const surfAreas = await page.evaluate(scrapeSurfAreas, MSW_AREA_LIST_SELECTOR);

  const surfSpots = await Promise.all(surfAreas.map(async area => {
    const spotsInArea = await scrapeArea(area, browser);
    return {
      ...area,
      spots: spotsInArea,
    };
  }));

  await buster.setResultObject({ 
    areas: surfSpots,
  });  
  await browser.close();
  process.exit(0);
};

main();
  