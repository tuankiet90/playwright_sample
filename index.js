const email = "binemonMP";
const password = "Binemon@2022";
const name = `BinemonMP`;
const { firefox } = require("playwright");
const link = "https://twitter.com/i/flow/login";

const waitMs = (msDuration) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, msDuration);
  });
};

const postTweet2 = async (text) => {
  try {

    const browser = await firefox.launch();
    const page = await browser.newPage();
    await page.goto(link);
    await waitMs(1000);
    console.log("input email...");
    await page.fill(".r-30o5oe", email);
    await waitMs(500);
    console.log("next.....");
    await page.locator('text="Next"').click();
    try {
      await waitMs(1000);
      console.log("input password");
      await page.locator("input >> nth=1").fill(password);
      await waitMs(500);
      console.log("Login");
      await page.locator('text="Log in"').click();
    } catch (error) {
      console.log("input username....");
      await waitMs(500);
      await page.fill(".r-30o5oe", name);
      await waitMs(500);
      await page.locator('text="Next"').click();
      await waitMs(1000);
      console.log("input password....");
      await page.locator("input >> nth=1").fill(password);
      await waitMs(500);
      console.log("Login");
      await page.locator('text="Log in"').click();
    }

    await waitMs(2000);
    console.log("fill text.....");
    await page.fill(".public-DraftStyleDefault-block", text);
    await waitMs(500);
    console.log("Tweet....");
    await page.screenshot({path:`1.png`})
    await page.locator('text="Tweet" >> nth=1').click();
    console.log("done....");

    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
};

async function start() {
  await postTweet2(`binemon_MP_3`);
}

start();
