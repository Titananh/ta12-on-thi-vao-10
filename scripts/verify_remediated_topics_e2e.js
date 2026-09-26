const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('--- 1. Authenticating Student Session ---');
  await page.goto('http://localhost:3000/api/auth/mock-login?email=student@qa.test&name=Senior%20QA%20Student&status=approved', { waitUntil: 'networkidle0' });

  // 1. Test Topic 116 (Thể cầu khiến: have/get sth done)
  console.log('--- 2. Testing Topic 116: Thể cầu khiến: have/get sth done ---');
  await page.goto('http://localhost:3000/practice/116', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cursor-pointer', { timeout: 10000 });
  const title116 = await page.$eval('.text-base.md\\:text-lg', el => el.innerText).catch(() => '');
  console.log('Topic 116 Title:', title116);
  const qText116 = await page.$eval('.font-normal.leading-relaxed', el => el.innerText).catch(() => '');
  console.log('Topic 116 Question 1:', qText116);

  // Click choice A ("cut")
  await page.evaluate(() => {
    const choices = Array.from(document.querySelectorAll('.cursor-pointer'));
    if (choices[0]) choices[0].click();
  });
  await new Promise(r => setTimeout(r, 400));
  // Click check button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Kiểm tra ngay'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_topic_116_causative_correct.png') });
  console.log('Saved screenshot sim_topic_116_causative_correct.png');

  // 2. Test Topic 70 (Danh từ thông dụng - Word form Nouns)
  console.log('--- 3. Testing Topic 70: Danh từ thông dụng ---');
  await page.goto('http://localhost:3000/practice/70', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cursor-pointer', { timeout: 10000 });
  const title70 = await page.$eval('.text-base.md\\:text-lg', el => el.innerText).catch(() => '');
  console.log('Topic 70 Title:', title70);
  const qText70 = await page.$eval('.font-normal.leading-relaxed', el => el.innerText).catch(() => '');
  console.log('Topic 70 Question 1:', qText70);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_topic_70_nouns.png') });

  // 3. Test Topic 72 (Tính từ thông dụng - Word form Adjectives)
  console.log('--- 4. Testing Topic 72: Tính từ thông dụng ---');
  await page.goto('http://localhost:3000/practice/72', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cursor-pointer', { timeout: 10000 });
  const title72 = await page.$eval('.text-base.md\\:text-lg', el => el.innerText).catch(() => '');
  console.log('Topic 72 Title:', title72);
  const qText72 = await page.$eval('.font-normal.leading-relaxed', el => el.innerText).catch(() => '');
  console.log('Topic 72 Question 1:', qText72);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_topic_72_adjectives.png') });

  // 4. Test Topic 160 (so... that, such... that)
  console.log('--- 5. Testing Topic 160: so... that, such (a/an)... that ---');
  await page.goto('http://localhost:3000/practice/160', { waitUntil: 'networkidle0' });
  await page.waitForSelector('select, .cursor-pointer', { timeout: 10000 });
  const title160 = await page.$eval('.text-base.md\\:text-lg', el => el.innerText).catch(() => '');
  console.log('Topic 160 Title:', title160);
  const qText160 = await page.$eval('.font-normal.leading-relaxed', el => el.innerText).catch(() => '');
  console.log('Topic 160 Question 1:', qText160);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_topic_160_so_that.png') });

  // 5. Test Topic 341 Question 3 (Table Dark Mode Contrast)
  console.log('--- 6. Testing Topic 341 Question 3: Dark Mode Contrast ---');
  await page.goto('http://localhost:3000/practice/341', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cursor-pointer', { timeout: 10000 });
  
  // Navigate to Question 3
  const navBtns = await page.$$('button');
  for (const btn of navBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.trim() === '3') {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_topic_341_q3_table_contrast.png') });
  console.log('Saved screenshot sim_topic_341_q3_table_contrast.png');

  // 6. Test Exam Runner
  console.log('--- 7. Testing Exam Runner: Exam 1097 ---');
  await page.goto('http://localhost:3000/exam/12379', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.exam-palette-btn, button', { timeout: 10000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sim_exam_runner_active.png') });
  console.log('Saved screenshot sim_exam_runner_active.png');

  console.log('=== ALL SIMULATION CHECKS COMPLETED SUCCESSFULLY ===');
  await browser.close();
})();
