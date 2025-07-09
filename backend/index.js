const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const patang = require('patang');


const app = express();
const PORT = 3000;

app.use(cors());

app.get('/compare', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Product name required' });

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
const flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

// AMAZON
await page.goto(amazonUrl, { waitUntil: 'domcontentloaded' });
await new Promise(resolve => setTimeout(resolve, 3000));

const amazonDom = await page.content();
const amazonData = await patang.pageEvaluator.evaluateProductDetails(amazonDom, 'amazon');

// FLIPKART
await page.goto(flipkartUrl, { waitUntil: 'domcontentloaded' });
await page.keyboard.press('Escape').catch(() => {});
await new Promise(resolve => setTimeout(resolve, 3000));

const flipkartDom = await page.content();
const flipkartData = await patang.pageEvaluator.evaluateProductDetails(flipkartDom, 'flipkart');


    await browser.close();

    res.json({
      product: query,
  amazon: {
    price: amazonData.price || "Not Found",
    title: amazonData.title || "Not Found",
    link: amazonUrl
  },
  flipkart: {
    price: flipkartData.price || "Not Found",
    title: flipkartData.title || "Not Found",
    link: flipkartUrl
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
