const puppeteer = require('puppeteer-core');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const AUTH_SECRET = 'ta12_grade10_english_prep_auth_secret_2026_super_secure_key';

function signSessionToken(userId) {
  const ts = Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

const delay = ms => new Promise(r => setTimeout(r, ms));
const ARTIFACTS_DIR = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const token = signSessionToken('usr_superadmin_dot71714');
  await page.setCookie({
    name: 'ta12_session',
    value: token,
    url: 'http://localhost:3000',
    path: '/',
    httpOnly: true,
  });

  console.log('--- 1. Testing Homepage (/?tab=luyen-de) ---');
  await page.goto('http://localhost:3000/?tab=luyen-de', { waitUntil: 'networkidle2' });
  await delay(1000);

  const homeChecks = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasProButton = text.includes('Mua gói PRO');
    const hasRanking = text.includes('Bảng xếp hạng');
    const proBadges = Array.from(document.querySelectorAll('span')).filter(s => s.innerText.trim() === 'PRO' || s.innerText.trim() === 'Free');
    return {
      hasProButton,
      hasRanking,
      proBadgesCount: proBadges.length
    };
  });
  console.log('Homepage checks:', homeChecks);
  if (homeChecks.hasProButton) throw new Error('FAIL: "Mua gói PRO" found on homepage!');
  if (homeChecks.hasRanking) throw new Error('FAIL: "Bảng xếp hạng" found on homepage!');
  if (homeChecks.proBadgesCount > 0) throw new Error(`FAIL: Found ${homeChecks.proBadgesCount} PRO/Free badges!`);

  const homeScreenshot = path.join(ARTIFACTS_DIR, 'homepage_clean_no_pro_no_ranking.png');
  await page.screenshot({ path: homeScreenshot });
  console.log('Saved screenshot:', homeScreenshot);

  console.log('\n--- 2. Testing Exam Intro (/exam/14532/intro) ---');
  await page.goto('http://localhost:3000/exam/14532/intro', { waitUntil: 'networkidle2' });
  await delay(1000);

  const introChecks = await page.evaluate(() => {
    const badges = Array.from(document.querySelectorAll('span')).filter(s => s.innerText.trim() === 'PRO' || s.innerText.trim() === 'FREE');
    return {
      proBadgesCount: badges.length
    };
  });
  console.log('Intro checks:', introChecks);
  if (introChecks.proBadgesCount > 0) throw new Error(`FAIL: Found ${introChecks.proBadgesCount} PRO/FREE badges on intro!`);

  const introScreenshot = path.join(ARTIFACTS_DIR, 'exam_intro_clean_no_pro.png');
  await page.screenshot({ path: introScreenshot });
  console.log('Saved screenshot:', introScreenshot);

  console.log('\n--- 3. Testing Exam Runner FillBlank (/exam/14532) ---');
  await page.goto('http://localhost:3000/exam/14532', { waitUntil: 'networkidle2' });
  await delay(1200);

  // Jump to question 26-30
  const jumpSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[title^="Câu"]'));
    const b = btns.find(btn => btn.innerText.includes('26') || btn.getAttribute('title').includes('26'));
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  console.log('Jumped to question 26:', jumpSuccess);
  await delay(800);

  // Inspect select elements and labels
  const qElements = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const labels = Array.from(document.querySelectorAll('.fillblank-option label'));
    return {
      selectCount: selects.length,
      labelCount: labels.length,
      labelsStyles: labels.map(l => {
        const style = window.getComputedStyle(l);
        return {
          text: l.innerText,
          bgColor: style.backgroundColor,
          color: style.color,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight
        };
      }),
      selectsInfo: selects.map((s, idx) => ({
        index: idx,
        name: s.getAttribute('name'),
        indexAttr: s.getAttribute('index'),
        options: Array.from(s.options).map(o => o.value),
        appearance: window.getComputedStyle(s).appearance || window.getComputedStyle(s).webkitAppearance
      }))
    };
  });
  console.log('Question 26 Elements:', JSON.stringify(qElements, null, 2));

  // Select answers for all 5 blanks
  const answers = ['make', '15-hour', 'each', 'in', 'activities'];
  for (let i = 0; i < answers.length; i++) {
    const selectSelector = `select[index="${i}"]`;
    await page.select(selectSelector, answers[i]);
    console.log(`Selected blank ${i}: "${answers[i]}"`);
    await delay(200);
  }

  // Verify answers in DOM and Palette status
  const verification = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const values = selects.map(s => s.value);
    
    // Check palette pill for 26-30
    const btns = Array.from(document.querySelectorAll('button[title^="Câu"]'));
    const pill = btns.find(btn => btn.innerText.includes('26') || btn.getAttribute('title').includes('26'));
    const isEmerald = pill ? pill.className.includes('bg-[#5fbd18]') || pill.className.includes('bg-emerald-600') : false;
    
    return {
      values,
      isEmerald,
      pillClass: pill ? pill.className : ''
    };
  });
  console.log('Verification result after filling blanks:', verification);
  if (!verification.isEmerald) throw new Error('FAIL: Palette pill for 26-30 did not turn green!');

  const examScreenshot = path.join(ARTIFACTS_DIR, 'exam_14532_q26_filled_palette_green.png');
  await page.screenshot({ path: examScreenshot });
  console.log('Saved screenshot:', examScreenshot);

  console.log('\n--- 4. Testing Dark Mode Visuals ---');
  // Toggle dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await delay(500);

  const darkScreenshot = path.join(ARTIFACTS_DIR, 'exam_14532_q26_dark_mode.png');
  await page.screenshot({ path: darkScreenshot });
  console.log('Saved dark mode screenshot:', darkScreenshot);

  await browser.close();
  console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
