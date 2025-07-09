const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/compare', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Product name required' });

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // AMAZON
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const amazonPrice = await page.$eval('span.a-price-whole', el => el.innerText).catch(() => 'Not Found');

    // FLIPKART
    await page.goto(`https://www.flipkart.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Escape').catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: 'flipkart_debug.png', fullPage: true });

    let flipkartPrice = 'Not Found';
    const selectors = [
      // Electronics
      'div._30jeq3',
      'div._1_WHN1',
      'div.Nx9bqj._4b5DiR',

      // Fashion (shirts, shoes, etc.)
      'div._3I9_wc',  // discounted price
      'div._2B099V > div > div > div > div:nth-child(1)',
      'div._16Jk6d',  // common for many listings

      // Toys
      'div._25b18c > div._30jeq3',
      'div._4rR01T + div > div > div > div:nth-child(1)',

      // Health & personal care
      'div._3e_WkJ > div._30jeq3',  // nested price for creams, lotions
      'div._1AtVbE > div._30jeq3',  // many variants

      // Grocery
      'div._1_WHN1',
      'div._2B099V > div > div > div > div:nth-child(2) > div > div > div',

      // Books
      'div._4rR01T + div > div > div > div._30jeq3',

      // Home & furniture
      'div._2B099V > div > div > div > div._30jeq3',

      // Extra generic
      'div._3tbKJL > div > div > div._30jeq3',
      'div._2kHMtA > div > div > div._30jeq3'
    ];

    for (let selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        flipkartPrice = await page.$eval(selector, el => el.innerText);
        break;
      } catch (e) {
        continue;
      }
    }

    await browser.close();

    res.json({
      product: query,
      amazon: {
        price: amazonPrice,
        link: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
      },
      flipkart: {
        price: flipkartPrice,
        link: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
      }
    });

  } catch (err) {
    console.error("Scraping Error:", err);
    res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
