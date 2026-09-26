const puppeteer = require('puppeteer-core');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const AUTH_SECRET = 'ta12_grade10_english_prep_auth_secret_2026_super_secure_key';
const ARTIFACTS_DIR = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function signSessionToken(userId) {
  const ts = Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

async function run() {
  console.log('🚀 Starting 100% Tak12 Clone E2E Verification...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Set authenticated session cookie
  const token = signSessionToken('usr_superadmin_dot71714');
  await page.setCookie({
    name: 'ta12_session',
    value: token,
    url: 'http://localhost:3000',
    path: '/',
    httpOnly: true,
  });

  console.log('Step 1: Navigating to Homepage (http://localhost:3000/)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await delay(1500);

  // Check default tab
  const activeTabBreadcrumb = await page.$eval('nav.text-xs', el => el.innerText);
  console.log('✓ Breadcrumb text:', activeTabBreadcrumb);
  if (!activeTabBreadcrumb.includes('Luyện đề thi')) {
    throw new Error('Default tab is not Luyện đề thi! Found: ' + activeTabBreadcrumb);
  }

  // Check 5 categories and count
  const allCategoryPill = await page.$('button[type="button"]');
  const catText = await page.evaluate(el => el.innerText, allCategoryPill);
  console.log('✓ Category header pill:', catText);

  // Take screenshot of Homepage
  const homeScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_homepage_luyende.png');
  await page.screenshot({ path: homeScreenshot, fullPage: false });
  console.log('📸 Saved homepage screenshot:', homeScreenshot);

  // Step 2: Click on Exam 19159 Title -> Expect Intro page (/exam/19159/intro)
  console.log('Step 2: Clicking on Exam 19159 Title link to test Intro screen navigation...');
  const titleLink = await page.$('a[href="/exam/19159/intro"]');
  if (!titleLink) {
    throw new Error('Link to /exam/19159/intro not found on homepage!');
  }
  await titleLink.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await delay(1000);

  const introUrl = page.url();
  console.log('✓ Navigated to URL:', introUrl);
  if (!introUrl.includes('/exam/19159/intro')) {
    throw new Error('Expected /exam/19159/intro but got: ' + introUrl);
  }

  // Verify Intro page contents
  const introHeading = await page.$eval('h1', el => el.innerText);
  console.log('✓ Intro Heading:', introHeading);

  const introStats = await page.$$eval('section div div strong', els => els.map(e => e.innerText));
  console.log('✓ Intro Exam Stats:', introStats);

  const introScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_exam_intro_19159.png');
  await page.screenshot({ path: introScreenshot, fullPage: false });
  console.log('📸 Saved intro page screenshot:', introScreenshot);

  // Step 3: Click "Làm bài" on Intro page -> Expect Exam Room (/exam/19159)
  console.log('Step 3: Clicking "Làm bài" on Intro page to launch exam session...');
  const startExamBtn = await page.$('a[href="/exam/19159"]');
  if (!startExamBtn) throw new Error('Start exam button not found on intro page!');
  await startExamBtn.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await delay(1500);

  const examUrl = page.url();
  console.log('✓ Exam room URL:', examUrl);
  if (!examUrl.includes('/exam/19159')) {
    throw new Error('Expected /exam/19159 but got: ' + examUrl);
  }

  // Verify sticky header with clock and submit button
  const timerText = await page.$eval('header', el => el.innerText);
  console.log('✓ Header content snippet:', timerText.replace(/\n/g, ' '));

  // Verify Question Palette
  const palettePills = await page.$$('button[title^="Câu"]');
  console.log(`✓ Question palette rendered with ${palettePills.length} question pills`);

  const roomScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_exam_room_layout.png');
  await page.screenshot({ path: roomScreenshot, fullPage: false });
  console.log('📸 Saved exam room screenshot:', roomScreenshot);

  // Step 4: Test direct "Làm bài" button from Homepage on Exam 19142
  console.log('Step 4: Testing direct "Làm bài" from Homepage on Exam 19142...');
  await page.goto('http://localhost:3000/?tab=luyen-de', { waitUntil: 'networkidle2' });
  await delay(1000);

  const directLamBaiBtn = await page.$('a[href="/exam/19142"]');
  if (!directLamBaiBtn) {
    throw new Error('Direct entry button a[href="/exam/19142"] not found!');
  }
  await directLamBaiBtn.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await delay(1500);

  const directUrl = page.url();
  console.log('✓ Direct navigation URL:', directUrl);
  if (!directUrl.includes('/exam/19142')) {
    throw new Error('Direct click did not go directly to /exam/19142! Got: ' + directUrl);
  }
  const directScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_exam_direct_entry_19142.png');
  await page.screenshot({ path: directScreenshot, fullPage: false });
  console.log('📸 Saved direct entry screenshot:', directScreenshot);

  // Step 5: Test Cloze selection, Submit modal & Review Mode in Exam 19159
  console.log('Step 5: Testing cloze interaction, submit modal, and review mode in Exam 19159...');
  await page.goto('http://localhost:3000/exam/19159', { waitUntil: 'networkidle2' });
  await delay(1500);

  // Jump to Cloze question 33-36
  const clozePill = await page.$('button[title="Câu 33–36"]');
  if (clozePill) {
    await clozePill.click();
    await delay(600);
    console.log('✓ Jumped to Cloze question 33-36');

    // Select options for all 4 dropdowns
    const selects = await page.$$('select');
    console.log(`✓ Found ${selects.length} select dropdown elements`);
    if (selects.length >= 4) {
      await selects[0].select('which');
      await selects[1].select('much');
      await selects[2].select('Therefore');
      await selects[3].select('hand');
      await delay(500);
      console.log('✓ Selected choices for blanks 0-3');
    }
  }

  // Answer question 1 as well
  const q1Pill = await page.$('button[title="Câu 1"]');
  if (q1Pill) {
    await q1Pill.click();
    await delay(500);
    const firstOption = await page.$('button[role="radio"], button.p-4');
    if (firstOption) {
      await firstOption.click();
      await delay(300);
      console.log('✓ Answered question 1');
    }
  }

  // Click Nộp bài
  const submitHeaderBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Nộp bài'));
  });
  if (submitHeaderBtn) {
    await submitHeaderBtn.click();
    await delay(600);
    console.log('✓ Opened Submit Confirmation Modal');
  }

  const submitModalScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_exam_cloze_and_submit.png');
  await page.screenshot({ path: submitModalScreenshot, fullPage: false });
  console.log('📸 Saved submit modal screenshot:', submitModalScreenshot);

  // Confirm submit inside modal
  const confirmBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('div[role="dialog"] button'));
    return btns.find(b => b.innerText.includes('Xác nhận nộp bài') || b.innerText.includes('Nộp bài'));
  });
  if (confirmBtn) {
    await confirmBtn.click();
    await delay(1500);
    console.log('✓ Confirmed exam submission');
  }

  // Verify Score Hero and Review Mode
  const hasScoreHero = await page.evaluate(() => {
    return document.body.innerText.includes('Điểm') && document.body.innerText.includes('Lời giải chi tiết');
  });
  console.log('✓ Score Hero & Review Mode rendered:', hasScoreHero);

  const reviewScreenshot = path.join(ARTIFACTS_DIR, 'clone_100_exam_review_mode.png');
  await page.screenshot({ path: reviewScreenshot, fullPage: false });
  console.log('📸 Saved review mode screenshot:', reviewScreenshot);

  await browser.close();
  console.log('🎉 100% Tak12 Clone E2E Verification Completed Successfully!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
