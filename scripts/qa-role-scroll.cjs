const { chromium } = require('../../econcurve/node_modules/playwright-core');

const BASE = 'http://127.0.0.1:5199';

async function state(page, label) {
  const value = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    hash: window.location.hash,
    title: document.title,
  }));
  console.log(label, value);
  return value;
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto(`${BASE}/#company`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(250);
  await state(page, 'before company -> youth:');

  await page.getByRole('button', { name: /Portal Peserta/ }).click();
  await page.waitForTimeout(450);
  const youth = await state(page, 'after company -> youth:');

  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(250);
  await state(page, 'before youth -> admin:');

  await page.getByRole('button', { name: /Portal Admin/ }).click();
  await page.waitForTimeout(450);
  const admin = await state(page, 'after youth -> admin:');

  await page.evaluate(() => window.scrollTo(0, 2600));
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: /Portal Perusahaan/ }).click();
  await page.waitForTimeout(450);
  const company = await state(page, 'after admin -> company:');

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(`${BASE}/#company`, { waitUntil: 'networkidle' });
  await mobile.evaluate(() => window.scrollTo(0, 2000));
  await mobile.waitForTimeout(250);
  await state(mobile, 'mobile before company -> admin:');
  await mobile.getByRole('button', { name: /Portal Admin/ }).click();
  await mobile.waitForTimeout(450);
  const mobileAdmin = await state(mobile, 'mobile after company -> admin:');

  const pass =
    youth.y === 0 &&
    admin.y === 0 &&
    company.y === 0 &&
    mobileAdmin.y === 0 &&
    errors.length === 0;
  console.log('\nRESULT', pass ? 'PASS' : 'FAIL', { errors });
  await browser.close();
  if (!pass) process.exitCode = 1;
})();
