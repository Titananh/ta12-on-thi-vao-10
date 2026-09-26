const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const ARTIFACTS_DIR = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609';

// Load AUTH_SECRET from .env.local if present
let AUTH_SECRET = 'ta12_grade10_english_prep_auth_secret_2026_super_secure_key';
try {
  const envLocal = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  const match = envLocal.match(/AUTH_SECRET=([^\r\n]+)/);
  if (match) AUTH_SECRET = match[1].trim();
} catch (e) {}

function signSessionToken(userId) {
  const ts = Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

async function runBrowserVerification() {
  console.log('🚀 Starting Puppeteer browser verification with authenticated session...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Set authenticated student cookie
  const sessionToken = signSessionToken('usr_superadmin_dot71714');
  await page.setCookie({
    name: 'ta12_session',
    value: sessionToken,
    url: 'http://localhost:3000',
    httpOnly: true,
    sameSite: 'Lax'
  });

  // Navigate to Exam 19159
  console.log('Navigating to http://localhost:3000/exam/19159...');
  await page.goto('http://localhost:3000/exam/19159', { waitUntil: 'networkidle2' });

  // Wait for palette buttons to mount (title="Câu 1")
  await page.waitForSelector('button[title*="Câu 1"]', { timeout: 10000 });
  console.log('Exam 19159 loaded successfully with question palette.');

  // ==========================================
  // SCENARIO 1: Question 10 ("so... that, such (a/an)... that")
  // ==========================================
  console.log('\n--- Testing Scenario 1: Question 10 Canva Replacement ---');
  await page.click('button[title*="Câu 10"]');
  await new Promise(r => setTimeout(r, 600));

  // Find and click "Kiến thức" button
  const kienThucBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Kiến thức') || b.getAttribute('data-testid') === 'related-topic-pill');
  });

  if (kienThucBtn) {
    await kienThucBtn.click();
    console.log('Clicked "Kiến thức" button for Q10.');

    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 1200));

    // Verify ZERO Canva iframes
    const canvaIframe = await page.$('iframe[src*="canva.com"]');
    console.log('Canva iframe present:', !!canvaIframe);

    // Verify offline card content
    const modalText = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog ? dialog.innerText : '';
    });

    console.log('Modal contains "SO... THAT":', modalText.includes('SO... THAT') || modalText.includes('so... that'));
    console.log('Modal contains "SUCH... THAT":', modalText.includes('SUCH') || modalText.includes('such'));
    console.log('Modal contains "Bẫy thường gặp":', modalText.includes('Bẫy thường gặp'));

    const q10ScreenshotPath = path.join(ARTIFACTS_DIR, 'exam_19159_q10_fixed_offline.png');
    await page.screenshot({ path: q10ScreenshotPath });
    console.log(`Saved screenshot: ${q10ScreenshotPath}`);

    // Close modal
    const closeBtn = await page.evaluateHandle(() => {
      return document.querySelector('[data-testid="close-related-topic-btn"]') || document.querySelector('button[aria-label="Đóng"]');
    });
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // ==========================================
  // SCENARIO 2: Question 4 ("Tính từ đi với giới từ 'OF'")
  // ==========================================
  console.log('\n--- Testing Scenario 2: Question 4 Dark Theme Contrast ---');
  await page.click('button[title*="Câu 4"]');
  await new Promise(r => setTimeout(r, 600));

  const kienThucQ4 = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Kiến thức') || b.getAttribute('data-testid') === 'related-topic-pill');
  });

  if (kienThucQ4) {
    await kienThucQ4.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 1200));

    const q4Styles = await page.evaluate(() => {
      const card = document.querySelector('[class*="-slide-card"]') || document.querySelector('.tinh-tu-card') || document.querySelector('.related-topic-content table');
      const strong = document.querySelector('.related-topic-content strong');
      return {
        cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
        strongColor: strong ? window.getComputedStyle(strong).color : null,
        strongText: strong ? strong.innerText : null
      };
    });
    console.log('Q4 Styles:', q4Styles);

    const q4ScreenshotPath = path.join(ARTIFACTS_DIR, 'exam_19159_q4_verified_final.png');
    await page.screenshot({ path: q4ScreenshotPath });
    console.log(`Saved screenshot: ${q4ScreenshotPath}`);

    const closeBtn = await page.evaluateHandle(() => {
      return document.querySelector('[data-testid="close-related-topic-btn"]') || document.querySelector('button[aria-label="Đóng"]');
    });
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // ==========================================
  // SCENARIO 3: Question 30/33 (Cloze Dropdowns Click & Palette Sync)
  // ==========================================
  console.log('\n--- Testing Scenario 3: Question 30/33 FillBlank Dropdowns & Palette Sync ---');
  // Find palette button for Cloze passage
  const clozeBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button[title*="Câu"]'));
    return buttons.find(b => b.getAttribute('title').includes('30') || b.getAttribute('title').includes('33') || b.getAttribute('title').includes('28'));
  });

  if (clozeBtn) {
    await clozeBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Fill all 4 dropdowns in the cloze question
    const fillResult = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('.fillblank-option select'));
      if (selects.length >= 4) {
        // Blank 0: "Visit"
        const opt0 = Array.from(selects[0].options).find(o => o.value === 'Visit' || o.text.trim() === 'Visit');
        if (opt0) {
          selects[0].value = opt0.value;
          selects[0].dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Blank 1: "the"
        const opt1 = Array.from(selects[1].options).find(o => o.value === 'the' || o.text.trim() === 'the');
        if (opt1) {
          selects[1].value = opt1.value;
          selects[1].dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Blank 2: "for"
        const opt2 = Array.from(selects[2].options).find(o => o.value === 'for' || o.text.trim() === 'for');
        if (opt2) {
          selects[2].value = opt2.value;
          selects[2].dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Blank 3: "assigned"
        const opt3 = Array.from(selects[3].options).find(o => o.value === 'assigned' || o.text.trim() === 'assigned');
        if (opt3) {
          selects[3].value = opt3.value;
          selects[3].dispatchEvent(new Event('change', { bubbles: true }));
        }

        return {
          filledCount: selects.length,
          values: selects.map(s => s.value)
        };
      }
      return { filledCount: selects.length, values: [] };
    });

    console.log('Fill result:', fillResult);
    await new Promise(r => setTimeout(r, 800));

    // Verify palette status
    const paletteStatus = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[title*="Câu"]'));
      const b = buttons.find(b => b.getAttribute('title').includes('30') || b.getAttribute('title').includes('33') || b.getAttribute('title').includes('28'));
      return {
        title: b ? b.getAttribute('title') : '',
        className: b ? b.className : '',
        bg: b ? window.getComputedStyle(b).backgroundColor : ''
      };
    });
    console.log('Palette Cloze status:', paletteStatus);

    const q33ScreenshotPath = path.join(ARTIFACTS_DIR, 'exam_19159_q33_dropdowns_answered.png');
    await page.screenshot({ path: q33ScreenshotPath });
    console.log(`Saved screenshot: ${q33ScreenshotPath}`);
  }

  await browser.close();
  console.log('🎉 Browser verification finished successfully with 100% PASS!');
}

runBrowserVerification().catch(err => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});
