const { chromium } = require('../../econcurve/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, isMobile: true, hasTouch: true });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  const log = (label, ms) => console.log(`${label}: ${Math.round(ms)}ms`);

  await page.goto('http://127.0.0.1:5199/#company', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Buat Lowongan Baru/ }).click();
  await page.waitForTimeout(1200);
  const s1 = page.getByRole('button', { name: 'Lulusan S1' });
  console.log('S1 before:', await s1.getAttribute('aria-pressed'));
  let t = Date.now();
  await s1.scrollIntoViewIfNeeded();
  log('S1 scrollIntoView', Date.now() - t);
  t = Date.now();
  await s1.click();
  log('S1 click', Date.now() - t);
  await page.waitForTimeout(400);
  console.log('S1 after:', await s1.getAttribute('aria-pressed'));
  await page.screenshot({ path: 'screenshots/qa-s1-after.png' });

  await page.goto('http://127.0.0.1:5199/#youth', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const chat = page.getByLabel('Pesan untuk mentor');
  t = Date.now();
  await chat.scrollIntoViewIfNeeded();
  log('chat scrollIntoView', Date.now() - t);
  t = Date.now();
  await chat.click();
  log('chat click', Date.now() - t);
  t = Date.now();
  await chat.pressSequentially('Laporan Line 2 sudah saya perbarui, Pak.', { delay: 28 });
  log('chat type', Date.now() - t);
  t = Date.now();
  await page.getByRole('button', { name: 'Kirim pesan' }).click();
  log('chat send', Date.now() - t);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/qa-chat-after.png' });

  await browser.close();
})();
