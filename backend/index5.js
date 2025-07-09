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
      'div._2kHMtA div._30jeq3',
      'div._2kHMtA > div > div > div._30jeq3',

      // Discounted price
      'div._3I9_wc',

      // Fashion / ladies purse / apparel
      'div._1xHGtK div._30jeq3',
      'div._2B099V div._30jeq3',
      'div._3O0U0u > div > div > div._30jeq3',
      'div._3e_WkJ > div._30jeq3',
      'div._16Jk6d',
      'div._3LU4EM',
      'div._1xHGtK > div > div > div._30jeq3',
      'div._2nQDXZ > div._30jeq3',
      'div._3tbKJL > div > div > div._30jeq3',

      // Grocery / health
      'div._2nQDXZ > div._30jeq3',
      'div._2xACxY > div > div > div > div._30jeq3',

      // Health & Beauty
      'div._1O_CcH > div > div > div._30jeq3',
      'div._3a3qyb > div._30jeq3',

      // Furniture
      'div._3ZJShS > div._30jeq3',

      // Books
      'div._4rR01T + div > div > div > div._30jeq3',
      'div._2kHMtA div._30jeq3',

      // Toys
      'div._25b18c > div._30jeq3',

      // Deep fallback generic classes
      'div._30jeq3 span',
      'div._2B099V span._30jeq3',
      'span._30jeq3',
      'div > span._30jeq3',
      'div > div > span._30jeq3',
      'div > div > div > span._30jeq3'
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
