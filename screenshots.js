const puppeteer = require('puppeteer');
const path = require('path');

const screenshots = [
  { url: 'http://localhost:3000/login', name: 'login.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/dashboard', name: 'dashboard.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/products', name: 'products-list.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/invoices', name: 'invoices-list.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/invoices/pos', name: 'pos.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/purchases', name: 'purchases-list.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/purchases/new', name: 'purchase-create.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/reports', name: 'reports.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/settings', name: 'settings.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/warehouses', name: 'warehouses.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/suppliers', name: 'suppliers.png', width: 1280, height: 800 },
  { url: 'http://localhost:3000/customers', name: 'customers.png', width: 1280, height: 800 },
];

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotsDir = path.join(__dirname, 'screenshots');

  for (const screenshot of screenshots) {
    try {
      console.log(`Taking screenshot: ${screenshot.name}`);
      const page = await browser.newPage();
      await page.setViewport({ width: screenshot.width, height: screenshot.height });

      // Navigate to URL and wait for page load
      await page.goto(screenshot.url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait additional time for any dynamic content
      await page.waitForTimeout(2000);

      // Take screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, screenshot.name),
        fullPage: false
      });

      await page.close();
      console.log(`✓ Saved: ${screenshot.name}`);
    } catch (error) {
      console.error(`✗ Error taking ${screenshot.name}:`, error.message);
    }
  }

  await browser.close();
  console.log('\nAll screenshots completed!');
}

takeScreenshots().catch(console.error);
