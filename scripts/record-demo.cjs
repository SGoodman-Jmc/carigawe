const { chromium } = require('../../econcurve/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const BASE = 'http://127.0.0.1:5199';
const ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(ROOT, 'demo');
const RAW_DIR = path.join(DEMO_DIR, 'raw');
const SAMPLE_FILE = path.join(DEMO_DIR, 'assets', 'checklist-perawatan-line2.pdf');
const FFMPEG = 'C:/Users/USER/AppData/Local/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe';
const VIEW = { width: 540, height: 960 };

fs.mkdirSync(RAW_DIR, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fmt = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

(async () => {
  let browser;
  let context;
  let page;
  let video;
  let pageCreatedWall = 0;
  let actionStartWall = 0;
  const consoleErrors = [];

  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
    });

    context = await browser.newContext({
      viewport: VIEW,
      screen: VIEW,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      locale: 'id-ID',
      timezoneId: 'Asia/Jakarta',
      recordVideo: { dir: RAW_DIR, size: VIEW },
    });

    page = await context.newPage();
    video = page.video();
    pageCreatedWall = Date.now();

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto(`${BASE}/#login`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        'html{scroll-behavior:auto !important;scrollbar-width:none}body{scroll-behavior:auto !important;scrollbar-width:none}::-webkit-scrollbar{width:0;height:0}',
    });
    await injectCursor(page);
    await sleep(350);

    const t0 = Date.now();
    actionStartWall = t0;
    const at = async (second) => {
      const target = t0 + second * 1000;
      const remaining = target - Date.now();
      if (remaining > 0) await page.waitForTimeout(remaining);
      else if (remaining < -450) {
        console.log(`  ! late at ${fmt(second)} by ${Math.round(-remaining)}ms`);
      }
    };
    const mark = async (second, label) => {
      await at(second);
      console.log(`${fmt(second)}  ${label}`);
    };

    // ------------------------------------------------------------------
    // SCENE 1 — LOGIN / REGISTRATION  (00:00–00:15)
    // ------------------------------------------------------------------
    await mark(0, 'Scene 1 · splash/login');
    await page.waitForTimeout(1800);

    await mark(2.1, 'scroll to auth card');
    await scrollToSelector(page, '#auth-card', 66, 900);
    await page.waitForTimeout(1000);

    await mark(4.0, 'show login form');
    await page.waitForTimeout(1000);

    await mark(5.2, 'type NIK');
    await typeInto(page.locator('#auth-identifier'), '1907281058210003', 55);

    await mark(6.8, 'type password');
    await typeInto(page.locator('#auth-password'), 'carigawe2026', 55);

    await mark(8.3, 'show password');
    await clickLocator(page.getByRole('button', { name: 'Tampilkan kata sandi' }));
    await page.waitForTimeout(900);

    await mark(9.8, 'move to CTA');
    await moveToLocator(page, page.getByRole('button', { name: /Masuk ke CariGawe/ }));
    await page.waitForTimeout(500);

    await mark(11.0, 'submit login');
    await clickLocator(page.getByRole('button', { name: /Masuk ke CariGawe/ }));

    await mark(12.6, 'youth portal entered');
    await page.waitForTimeout(1600);
    await at(15);

    // ------------------------------------------------------------------
    // SCENE 2 — YOUTH PORTAL  (00:15–00:50)
    // ------------------------------------------------------------------
    await mark(15, 'Scene 2 · youth portal');
    await page.waitForTimeout(2500);

    await mark(17.6, 'show vacancy filters');
    await scrollToSelector(page, '#job-search', 150, 850);
    await page.waitForTimeout(1200);

    await mark(19.8, 'filter Muara Enim');
    await clickLocator(page.getByRole('button', { name: 'Muara Enim', exact: true }));
    await page.waitForTimeout(1300);

    await mark(22.8, 'open PT Bukit Asam vacancy');
    await clickLocator(page.getByRole('button', { name: 'Lihat detail' }).first());
    await page.waitForTimeout(2200);

    await mark(25.6, 'close vacancy detail');
    await clickLocator(page.getByRole('button', { name: 'Tutup', exact: true }));
    await page.waitForTimeout(500);

    await mark(26.3, 'show training hub');
    await scrollToSelector(page, '#hub-pelatihan', 130, 900);
    await page.waitForTimeout(900);

    await mark(28.3, 'show project workspace');
    await scrollToText(page, 'Ruang kerja proyek', 165, 700);
    await page.waitForTimeout(800);

    await mark(29.9, 'attach project file');
    await page.locator('input[type=file]').setInputFiles(SAMPLE_FILE);
    await page.waitForTimeout(1200);

    await mark(31.3, 'submit project to mentor');
    await clickLocator(page.getByRole('button', { name: 'Kirim ke Mentor' }));
    await page.waitForTimeout(1200);

    await mark(32.7, 'scroll to mentor chat');
    await scrollToSelector(page, '[aria-label="Pesan untuk mentor"]', 240, 600);
    await page.waitForTimeout(400);

    await mark(33.8, 'send mentor message');
    await typeInto(
      page.getByLabel('Pesan untuk mentor'),
      'Laporan Line 2 sudah saya perbarui, Pak.',
      16,
      false,
    );
    await page.waitForTimeout(120);
    await clickVisible(page.getByRole('button', { name: 'Kirim pesan' }));
    await page.waitForTimeout(1600);

    await mark(37.0, 'show BPJS career tracker');
    await scrollToSelector(page, '#pelacak-karier', 130, 900);
    await page.waitForTimeout(1600);

    await mark(39.6, 'scroll BPJS timeline');
    await scrollBy(page, 430, 850);
    await page.waitForTimeout(2300);

    await mark(43.0, 'show BPJS milestones');
    await scrollBy(page, 260, 800);
    await page.waitForTimeout(2600);
    await at(50);

    // ------------------------------------------------------------------
    // SCENE 3 — COMPANY PORTAL  (00:50–01:25)
    // ------------------------------------------------------------------
    await mark(50, 'Scene 3 · company portal');
    await clickLocator(
      page.locator('header button[aria-label*="Portal Perusahaan"]:visible').first(),
    );
    await page.waitForTimeout(1700);

    await mark(53.0, 'open new vacancy form');
    await clickLocator(page.getByRole('button', { name: /Buat Lowongan Baru/ }));
    await page.waitForTimeout(1200);

    await mark(55.4, 'show form');
    await page.waitForTimeout(900);

    await mark(56.6, 'scroll to target jenjang');
    await scrollToText(page, 'Target sasaran', 150, 750);
    await page.waitForTimeout(600);

    await mark(58.0, 'select Lulusan S1');
    await clickLocator(page.getByRole('button', { name: 'Lulusan S1' }));
    await page.waitForTimeout(1200);

    await mark(60.0, 'scroll to Syllabus Matcher');
    await scrollToText(page, 'Syllabus Matcher', 145, 850);
    await page.waitForTimeout(600);

    await mark(61.8, 'select digitalization module');
    await clickLocator(
      page.getByRole('button', { name: /Digitalisasi Proses Manufaktur/ }).first(),
    );
    await page.waitForTimeout(1300);

    await mark(64.0, 'show vacancy preview');
    await scrollToText(page, 'Pratinjau lowongan', 140, 850);
    await page.waitForTimeout(2200);

    await mark(67.0, 'submit for Dinas verification');
    await clickLocator(page.getByRole('button', { name: /Ajukan Verifikasi ke Dinas/ }));
    await page.waitForTimeout(2300);

    await mark(70.0, 'switch to participant evaluation');
    await clickLocator(
      page.getByRole('button', { name: /Evaluasi Peserta & Proyek Nyata/ }),
    );
    await page.waitForTimeout(900);

    await mark(71.4, 'show evaluation cards');
    await scrollToSelector(page, '#company-evaluate', 138, 800);
    await page.waitForTimeout(1200);

    await mark(73.2, 'recommend Bima');
    await clickLocator(
      page.getByRole('switch', { name: 'Rekomendasikan Bima Pratama' }),
    );
    await page.waitForTimeout(1600);

    await mark(76.2, 'switch to retention reporting');
    await clickLocator(page.getByRole('button', { name: /Pelaporan Retensi Satu Pintu/ }));
    await page.waitForTimeout(800);

    await mark(77.6, 'show retention summary');
    await scrollToSelector(page, '#company-retention', 138, 850);
    await page.waitForTimeout(1400);

    await mark(80.0, 'show retention table');
    await scrollToText(page, 'Tabel Retensi & Insentif', 155, 700);
    await page.waitForTimeout(1200);
    await scrollContainerTo(page, '#company-retention-table-scroll', 330, 800);
    await page.waitForTimeout(2200);
    await at(85);

    // ------------------------------------------------------------------
    // SCENE 4 — LABOR OFFICE / ADMIN  (01:25–02:00)
    // ------------------------------------------------------------------
    await mark(85, 'Scene 4 · admin Disnakertrans');
    await clickLocator(
      page.locator('header button[aria-label*="Portal Admin Dinas"]:visible').first(),
    );
    await page.waitForTimeout(1800);

    await mark(88.0, 'show admin KPI');
    await scrollToSelector(page, '#admin-kpi', 150, 700);
    await page.waitForTimeout(1600);

    await mark(91.2, 'show verification queue');
    await scrollToSelector(page, '#admin-queue', 130, 900);
    await page.waitForTimeout(1300);

    await mark(93.2, 'approve first vacancy');
    await clickLocator(page.getByRole('button', { name: 'Setujui Lowongan' }).first());
    await page.waitForTimeout(1700);

    await mark(96.2, 'show BPJS and incentive engine');
    await scrollToSelector(page, '#admin-incentives', 130, 900);
    await page.waitForTimeout(1500);

    await mark(98.5, 'scroll incentive table');
    await scrollContainerTo(page, '#admin-incentive-table-scroll', 640, 900);
    await page.waitForTimeout(1600);

    await mark(101.2, 'open APBD disbursement');
    await clickLocator(
      page.getByRole('button', { name: /Cairkan Insentif Retensi APBD/ }).first(),
    );
    await page.waitForTimeout(1800);

    await mark(104.0, 'confirm APBD disbursement');
    await clickLocator(page.getByRole('button', { name: /Konfirmasi Pencairan/ }));
    await page.waitForTimeout(2300);

    await mark(107.2, 'show MagangHub API monitor');
    await scrollToSelector(page, '#admin-api', 130, 900);
    await page.waitForTimeout(1300);

    await mark(109.2, 'sync MagangHub API');
    await clickLocator(page.getByRole('button', { name: /Sinkronkan sekarang/ }));
    await page.waitForTimeout(2100);

    await mark(113, 'admin end state');
    await page.waitForTimeout(2500);

    await mark(116.2, 'outro');
    await showOutro(page);
    await page.waitForTimeout(800);
    await at(120);

    console.log(`\nconsole errors: ${consoleErrors.length ? consoleErrors.join(' | ') : 'none'}`);
    console.log(`action timeline offset from page creation: ${((t0 - pageCreatedWall) / 1000).toFixed(2)}s`);
  } catch (error) {
    console.error('\nRECORDING ERROR:', error);
    if (page) {
      await page
        .screenshot({ path: path.join(DEMO_DIR, 'record-error.png'), fullPage: false })
        .catch(() => {});
    }
    process.exitCode = 1;
  } finally {
    if (context) await context.close().catch(() => {});
    let rawPath = '';
    if (video) {
      rawPath = await video.path().catch(() => '');
    }
    if (rawPath && fs.existsSync(rawPath)) {
      const dest = path.join(DEMO_DIR, 'carigawe-demo-raw.webm');
      fs.copyFileSync(rawPath, dest);
      console.log(`raw video: ${dest}`);
      const offset = Math.max(0, (actionStartWall - pageCreatedWall) / 1000);
      console.log(`estimated video trim offset: ${offset.toFixed(2)}s`);
      const final = path.join(DEMO_DIR, 'carigawe-demo-2menit.webm');
      const result = spawnSync(
        FFMPEG,
        [
          '-y',
          '-ss',
          offset.toFixed(2),
          '-t',
          '120',
          '-i',
          dest,
          '-c:v',
          'libvpx-vp9',
          '-b:v',
          '2400k',
          '-an',
          final,
        ],
        { encoding: 'utf8' },
      );
      if (result.status === 0) {
        console.log(`final video: ${final}`);
      } else {
        console.error('ffmpeg failed:', result.stderr?.slice(-1200));
      }
    }
    if (browser) await browser.close().catch(() => {});
  }
})();

async function injectCursor(page) {
  await page.addStyleTag({
    content: `
      #__demo_cursor {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        width: 24px;
        height: 28px;
        pointer-events: none;
        opacity: 0;
        filter: drop-shadow(0 2px 3px rgba(15, 23, 42, .35));
        transition: transform .38s cubic-bezier(.2, .8, .2, 1), opacity .3s ease;
        will-change: transform;
      }
      #__demo_cursor.is-visible { opacity: 1; }
      #__demo_click_ring {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483646;
        width: 34px;
        height: 34px;
        margin-left: -17px;
        margin-top: -17px;
        border: 2px solid rgba(5, 150, 105, .75);
        border-radius: 999px;
        background: rgba(5, 150, 105, .16);
        pointer-events: none;
        opacity: 0;
        transform: scale(.35);
      }
      #__demo_click_ring.is-clicking {
        animation: __demo_click .48s ease-out forwards;
      }
      @keyframes __demo_click {
        0% { opacity: .85; transform: scale(.35); }
        100% { opacity: 0; transform: scale(1.35); }
      }
      #__demo_outro {
        position: fixed;
        inset: 0;
        z-index: 2147483600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        background: radial-gradient(circle at 80% 10%, rgba(5, 150, 105, .22), transparent 36%), #14275d;
        color: white;
        opacity: 0;
        transition: opacity .7s ease;
        pointer-events: none;
        font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
        overflow: hidden;
      }
      #__demo_outro.is-visible { opacity: 1; }
      #__demo_outro .outro-grid {
        position: absolute;
        inset: 0;
        opacity: .3;
        background-image: radial-gradient(rgba(255,255,255,.25) .7px, transparent .7px);
        background-size: 18px 18px;
      }
      #__demo_outro .outro-glow {
        position: absolute;
        width: 340px;
        height: 340px;
        border-radius: 999px;
        background: rgba(52, 211, 153, .16);
        filter: blur(60px);
        right: -80px;
        top: -80px;
      }
    `,
  });

  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.id = '__demo_cursor';
    cursor.innerHTML = `
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3.5 19.5 13.2l-7.1 1.3-3.2 8.2L4 3.5Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.55" stroke-linejoin="round"/>
      </svg>`;
    document.body.appendChild(cursor);

    const ring = document.createElement('div');
    ring.id = '__demo_click_ring';
    document.body.appendChild(ring);

    window.__moveDemoCursor = (x, y) => {
      window.__demoCursorPos = { x, y };
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.__clickDemoCursor = () => {
      const position = window.__demoCursorPos ?? { x: 0, y: 0 };
      ring.style.left = `${position.x}px`;
      ring.style.top = `${position.y}px`;
      ring.classList.remove('is-clicking');
      void ring.offsetWidth;
      ring.classList.add('is-clicking');
    };
    window.__hideDemoCursor = () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    };
    window.__moveDemoCursor(270, 180);
  });

  await page.waitForTimeout(400);
  await page.evaluate(() => {
    document.getElementById('__demo_cursor')?.classList.add('is-visible');
  });
}

async function moveTo(page, x, y, settle = 430) {
  await page.evaluate(
    ({ x, y }) => {
      window.__moveDemoCursor?.(x, y);
    },
    { x, y },
  );
  await page.waitForTimeout(settle);
}

async function moveToLocator(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(70);
  let box = await locator.boundingBox();
  if (!box) return;
  if (box.y < 128) {
    await page.evaluate((delta) => window.scrollBy(0, delta), box.y - 178);
    await page.waitForTimeout(200);
    box = await locator.boundingBox();
  }
  if (!box) return;
  await moveTo(page, box.x + box.width / 2, box.y + box.height / 2);
}

async function clickLocator(locator, settle = 130) {
  const page = locator.page();
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(70);
  let box = await locator.boundingBox();
  if (!box) throw new Error(`No bounding box for ${locator}`);
  if (box.y < 128) {
    await page.evaluate((delta) => window.scrollBy(0, delta), box.y - 178);
    await page.waitForTimeout(200);
    box = await locator.boundingBox();
  }
  if (!box) throw new Error(`No bounding box after scroll for ${locator}`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await moveTo(page, x, y, 320);
  await page.mouse.click(x, y);
  await page.evaluate(() => window.__clickDemoCursor?.());
  await page.waitForTimeout(settle);
}

async function typeInto(locator, text, delay = 55) {
  await clickLocator(locator, 80);
  await locator.pressSequentially(text, { delay });
}

async function scrollTo(page, y, duration = 800) {
  await page.evaluate(
    async ({ y, duration }) => {
      const start = window.scrollY;
      const target = Math.max(0, y);
      const distance = target - start;
      const startTime = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          window.scrollTo(0, start + distance * eased);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },
    { y, duration },
  );
}

async function scrollToSelector(page, selector, offset = 140, duration = 800) {
  const top = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    return element.getBoundingClientRect().top + window.scrollY;
  }, selector);
  if (top === null) throw new Error(`Selector not found: ${selector}`);
  await scrollTo(page, top - offset, duration);
}

async function scrollToText(page, text, offset = 140, duration = 800) {
  const locator = page.getByText(text, { exact: true }).first();
  const top = await locator.evaluate((element) => {
    return element.getBoundingClientRect().top + window.scrollY;
  });
  await scrollTo(page, top - offset, duration);
}

async function scrollBy(page, delta, duration = 700) {
  const current = await page.evaluate(() => window.scrollY);
  await scrollTo(page, current + delta, duration);
}

async function scrollContainerTo(page, selector, left, duration = 700) {
  await page.evaluate(
    async ({ selector, left, duration }) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Container not found: ${selector}`);
      const start = element.scrollLeft;
      const target = Math.min(element.scrollWidth - element.clientWidth, Math.max(0, left));
      const distance = target - start;
      const startTime = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          element.scrollLeft = start + distance * eased;
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },
    { selector, left, duration },
  );
}

async function showOutro(page) {
  await page.evaluate(() => {
    window.__hideDemoCursor?.();
    if (document.getElementById('__demo_outro')) return;
    const outro = document.createElement('div');
    outro.id = '__demo_outro';
    outro.innerHTML = `
      <div class="outro-grid"></div>
      <div class="outro-glow"></div>
      <div style="position:relative;max-width:420px;text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:22px">
          <span style="display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </span>
          <span style="font-size:34px;font-weight:800;letter-spacing:-1.4px">Cari<span style="color:#6ee7b7">Gawe</span></span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(252,211,77,.25);background:rgba(252,211,77,.08);color:#fde68a;border-radius:999px;padding:6px 12px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">
          Talent Hub Pemuda Sumatera Selatan
        </div>
        <h2 style="margin:18px 0 0;font-size:24px;line-height:1.2;font-weight:800;letter-spacing:-.8px">Satu akun, satu ekosistem karier.</h2>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.7;color:rgba(255,255,255,.55)">Login &amp; registrasi · Portal peserta · Portal perusahaan · Desk onboarding Dinas</p>
        <div style="width:44px;height:3px;background:#fcd34d;border-radius:999px;margin:26px auto 0"></div>
        <p style="margin:16px 0 0;font-size:10px;color:rgba(255,255,255,.35)">© 2026 CariGawe Sumsel · Prototipe demo platform</p>
      </div>`;
    document.body.appendChild(outro);
    requestAnimationFrame(() => outro.classList.add('is-visible'));
  });
}
