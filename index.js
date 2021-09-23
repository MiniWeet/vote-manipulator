
const puppeteer = require('puppeteer');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const config = require('./config.json');

Sentry.init({
  dsn: config.sentryDSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

async function theClappening() {
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--incognito', // We want to clear cookies each time
      '--disable-gpu', // Docker don't use no GPU
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto(config.pollURL); 
  await page.click(config.pollUser); // Clicks the element (ex. #PDI_answer50277275)
  const [button] = await page.$x("//div[@class='css-votebutton-outer pds-votebutton-outer']/a[contains(., 'Vote')]"); // Finds the vote button and... well... clicks
  if (button) {
    await button.click();
  };
  await page.waitForNavigation();  
  await browser.close();
  console.log(config.statusNotification); // Basically a meme
  console.log(config.sleepNotification); // Basically another meme
  })();
};

setInterval(theClappening, 20000); // Waiting 20 seconds to prevent rate limiting