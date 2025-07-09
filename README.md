# 🛒 E-commerce Price Comparison Tool

This is a **Node.js**-based web scraping project that compares product prices between **Amazon** and **Flipkart** in real-time. It uses **Puppeteer** to extract live product prices, helping users find the best deals instantly.

> 📌 **Project Type:** Backend Web Scraping Tool  
> 🌐 **Live Preview:** *Coming Soon*  
> 🧑‍💻 Developed by: [Rishabh Bhatt](https://github.com/Rish-4)

---

## 📌 Features

- 🔎 Search for a product by name
- 📦 Compare prices from Amazon and Flipkart
- ⚡ Fast scraping using headless Chromium
- 📄 Clean console output with product titles and pricing
- 💡 Scalable architecture for adding more platforms (e.g., Zepto, Blinkit)

---

## 🧰 Tech Stack

| Layer       | Technologies Used                        |
|-------------|-------------------------------------------|
| Language    | JavaScript (Node.js)                      |
| Framework   | Express.js                                |
| Scraping    | Puppeteer                                 |
| Others      | Cheerio (for HTML parsing), Git & GitHub  |

---

## 🗂️ Project Structure

```bash
E-commerce-price-comparison-tool/
├── amazon.js          # Amazon scraping logic
├── flipkart.js        # Flipkart scraping logic
├── server.js          # Express server that handles routes
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
