const { chromium } = require('../../econcurve/node_modules/playwright-core');

const BASE = 'http://127.0.0.1:5199';
const OUT = 'screenshots';

async function inspect(page, label) {
  const result = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const tiny = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const style = getComputedStyle(el);
        const text = el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE ? el.textContent.trim() : '';
        return text && parseFloat(style.fontSize) < 9.5 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .slice(0, 15)
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent.trim().slice(0, 60),
        size: getComputedStyle(el).fontSize,
      }));
    return {
      title: document.title,
      overflow,
      height: document.documentElement.scrollHeight,
      tiny,
      dialogOpen: Boolean(document.querySelector('[role="dialog"]')),
      logo: Boolean(document.querySelector('svg[aria-label="Logo CariGawe"]')),
      buttons: [...document.querySelectorAll('[role="dialog"] button')]
        .map((b) => b.textContent.trim().replace(/\s+/g, ' '))
        .filter(Boolean),
    };
  });
  console.log(`\n[${label}]`, JSON.stringify(result, null, 2));
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  desktop.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  desktop.on('pageerror', (err) => errors.push(err.message));

  // Portal first, then open the login panel from the header.
  await desktop.goto(`${BASE}/#company`, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: `${OUT}/00-auth-portal-desktop.png` });
  await desktop.getByRole('button', { name: 'Masuk', exact: true }).click();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: `${OUT}/00-auth-panel-desktop.png` });
  await inspect(desktop, 'desktop panel opened from header');

  const dialog = desktop.getByRole('dialog');
  await dialog.getByRole('button', { name: /Perusahaan/ }).click();
  await inspect(desktop, 'desktop company role');
  await dialog.getByRole('button', { name: 'Daftar Baru' }).click();
  await desktop.waitForTimeout(300);
  await inspect(desktop, 'desktop register company');
  await desktop.screenshot({ path: `${OUT}/00-auth-panel-register-desktop.png` });

  await dialog.getByRole('button', { name: /Pemuda/ }).click();
  await dialog.getByRole('button', { name: 'Masuk', exact: true }).click();
  await desktop.locator('#auth-identifier').fill('1907281058210003');
  await desktop.locator('#auth-password').fill('carigawe2026');
  await dialog.getByRole('button', { name: 'Tampilkan kata sandi' }).click();
  const pwType = await desktop.locator('#auth-password').getAttribute('type');
  await desktop.screenshot({ path: `${OUT}/00-auth-panel-filled-desktop.png` });
  await dialog.getByRole('button', { name: /Masuk ke CariGawe/ }).click();
  await desktop.waitForTimeout(1600);
  const urlAfter = desktop.url();
  const toastText = await desktop.locator('.fixed').allTextContents();
  await desktop.screenshot({ path: `${OUT}/00-auth-after-login-desktop.png` });
  console.log('\nauth result', {
    pwType,
    urlAfter,
    dialogOpen: await desktop.locator('[role="dialog"]').count(),
    toastText: toastText.join(' | ').slice(0, 220),
  });

  // Deep link #daftar + Escape close.
  await desktop.goto(`${BASE}/#daftar`, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(400);
  console.log('\ndeep link register dialog:', await desktop.locator('[role="dialog"]').count());
  await desktop.screenshot({ path: `${OUT}/00-auth-panel-deeplink-desktop.png` });
  await desktop.keyboard.press('Escape');
  await desktop.waitForTimeout(300);
  console.log('after escape:', {
    dialogOpen: await desktop.locator('[role="dialog"]').count(),
    url: desktop.url(),
  });

  const tablet = await browser.newPage({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
  await tablet.goto(`${BASE}/#company`, { waitUntil: 'networkidle' });
  await tablet.waitForTimeout(500);
  await tablet.screenshot({ path: `${OUT}/00-auth-portal-tablet.png` });
  await tablet.getByRole('button', { name: 'Masuk', exact: true }).click();
  await tablet.waitForTimeout(500);
  await tablet.screenshot({ path: `${OUT}/00-auth-panel-tablet.png` });
  await inspect(tablet, 'tablet 1024x768 panel');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await mobile.goto(`${BASE}/#company`, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: `${OUT}/00-auth-portal-mobile.png` });
  await mobile.getByRole('button', { name: 'Masuk ke CariGawe' }).click();
  await mobile.waitForTimeout(400);
  console.log('\nmobile header -> panel:', await mobile.locator('[role="dialog"]').count());
  await mobile.keyboard.press('Escape');
  await mobile.waitForTimeout(250);

  await mobile.goto(`${BASE}/#login`, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(600);
  await mobile.screenshot({ path: `${OUT}/00-auth-panel-mobile.png` });
  await inspect(mobile, 'mobile panel');
  await mobile.getByRole('button', { name: 'Daftar Baru' }).click();
  await mobile.waitForTimeout(300);
  await mobile.screenshot({ path: `${OUT}/00-auth-panel-register-mobile.png` });
  const scrollBox = mobile.locator('[role="dialog"] .overflow-y-auto').first();
  await scrollBox.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
  await mobile.waitForTimeout(300);
  await mobile.screenshot({ path: `${OUT}/00-auth-panel-register-mobile-bottom.png` });
  await inspect(mobile, 'mobile register');

  console.log('\nconsole errors:', errors);
  await browser.close();
})();
