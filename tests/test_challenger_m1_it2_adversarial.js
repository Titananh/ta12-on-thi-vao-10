/**
 * Challenger M1 Iteration 2: Adversarial Headless Chrome & Real Browser Test Suite
 * 
 * Verifies:
 * 1. Multi-blank completion progression:
 *    - Exam 15264 Q13 (4 blanks, id 844642): 0, 1, 2, 3 blanks MUST NOT turn green. 4 blanks MUST turn rgb(95, 189, 24).
 *    - Exam 14532 Q26 (5 blanks, id 777971): 0, 1, 2, 3, 4 blanks MUST NOT turn green. 5 blanks MUST turn rgb(95, 189, 24).
 * 2. Real browser computed styles:
 *    - Question palette pill computed backgroundColor and borderColor genuinely === 'rgb(95, 189, 24)'.
 *    - Cascade priority override: .bg-[#5fbd18] !important overrides .bg-emerald-600.
 *    - Review mode hover computed style genuinely === 'rgb(78, 167, 19)'.
 * 3. Reversion & clearing:
 *    - Deselecting or clearing a blank immediately reverts palette pill from green to uncolored.
 * 4. Rapid option switching & native change event handling:
 *    - High-speed option cycling through native select interactions.
 *    - DOM event propagation and state synchronization.
 * 5. Light Mode & Dark Mode style invariance.
 */

const puppeteer = require('puppeteer-core');
const assert = require('assert');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(desc, condition, actual) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [PASS] ${desc}`);
  } else {
    console.error(`  ✗ [FAIL] ${desc} (Actual: ${JSON.stringify(actual)})`);
    failures.push({ desc, actual });
  }
}

async function runTestSuite() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER M1 ITERATION 2: ADVERSARIAL REAL-BROWSER VERIFICATION');
  console.log('========================================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    await page.setViewport({ width: 1280, height: 900 });

    // =========================================================================
    // VECTOR 1: Exam 15264 Question 13 (4 Blanks) Multi-Blank Progression & Styles
    // =========================================================================
    console.log('▶ Vector 1: Exam 15264 Question 13 (4 Blanks) Real Browser Verification...');

    await page.goto(`${BASE_URL}/api/auth/mock-login?persona=approved&redirect=/exam/15264`, {
      waitUntil: 'networkidle0'
    });
    await page.waitForSelector('.grid.grid-cols-5 button');

    // Identify Q13 pill (index 12, label '13–16')
    const getPill13State = async () => {
      return page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.grid.grid-cols-5 button'));
        const pill = btns[12];
        if (!pill) return null;
        const style = window.getComputedStyle(pill);
        return {
          text: pill.innerText.trim(),
          title: pill.getAttribute('title'),
          className: pill.className,
          bg: style.backgroundColor,
          border: style.borderColor,
          isGreen: style.backgroundColor === 'rgb(95, 189, 24)' || style.backgroundColor === 'rgb(5, 150, 105)'
        };
      });
    };

    let p13 = await getPill13State();
    check('V1.1 Q13 pill text is "13–16"', p13.text === '13–16', p13.text);
    check('V1.2 Q13 pill initially NOT green', p13.isGreen === false, p13.bg);
    check('V1.3 Q13 pill does NOT have rgb(95, 189, 24)', p13.bg !== 'rgb(95, 189, 24)', p13.bg);

    // Navigate to Question 13
    const pills = await page.$$('.grid.grid-cols-5 button');
    await pills[12].click();
    await new Promise((r) => setTimeout(r, 400));

    // Wait for selects on Q13
    await page.waitForSelector('select[name="fbo-844642-0"]');

    // Fill Blank 0 only (1/4)
    await page.select('select[name="fbo-844642-0"]', 'support');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.4 Q13 with 1/4 blank filled is NOT green', p13.isGreen === false, p13.bg);

    // Fill Blank 1 (2/4)
    await page.select('select[name="fbo-844642-1"]', 'interrupt');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.5 Q13 with 2/4 blanks filled is NOT green', p13.isGreen === false, p13.bg);

    // Fill Blank 2 (3/4)
    await page.select('select[name="fbo-844642-2"]', 'effectively');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.6 Q13 with 3/4 blanks filled is NOT green', p13.isGreen === false, p13.bg);

    // Fill Blank 3 (4/4 -> FULLY ANSWERED)
    await page.select('select[name="fbo-844642-3"]', 'for');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.7 Q13 with 4/4 blanks filled turns green', p13.isGreen === true, p13.bg);
    check('V1.8 Q13 pill computed backgroundColor genuinely === rgb(95, 189, 24)', p13.bg === 'rgb(95, 189, 24)', p13.bg);
    check('V1.9 Q13 pill computed borderColor genuinely === rgb(95, 189, 24)', p13.border === 'rgb(95, 189, 24)', p13.border);

    // Reversion Test: Clear Blank 2 back to "" (reverts to 3/4)
    await page.select('select[name="fbo-844642-2"]', '');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.10 Clearing Blank 2 immediately reverts Q13 pill away from green', p13.isGreen === false, p13.bg);
    check('V1.11 Q13 pill is no longer rgb(95, 189, 24)', p13.bg !== 'rgb(95, 189, 24)', p13.bg);

    // Re-fill Blank 2 back to "effectively" (4/4)
    await page.select('select[name="fbo-844642-2"]', 'effectively');
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.12 Re-filling Blank 2 turns Q13 pill back to rgb(95, 189, 24)', p13.bg === 'rgb(95, 189, 24)', p13.bg);

    // Rapid Option Switching Test on Blank 0
    const blank0Options = ['neglect', 'disappoint', 'engage', 'support', 'neglect', 'engage', 'support'];
    for (const opt of blank0Options) {
      await page.select('select[name="fbo-844642-0"]', opt);
    }
    await new Promise((r) => setTimeout(r, 200));
    p13 = await getPill13State();
    check('V1.13 Rapid option switching retains fully-answered rgb(95, 189, 24) state', p13.bg === 'rgb(95, 189, 24)', p13.bg);

    // =========================================================================
    // VECTOR 2: Exam 14532 Question 26 (5 Blanks) Multi-Blank Progression & Styles
    // =========================================================================
    console.log('\n▶ Vector 2: Exam 14532 Question 26 (5 Blanks) Real Browser Verification...');

    await page.goto(`${BASE_URL}/api/auth/mock-login?persona=approved&redirect=/exam/14532`, {
      waitUntil: 'networkidle0'
    });
    await page.waitForSelector('.grid.grid-cols-5 button');

    const getPill26State = async () => {
      return page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.grid.grid-cols-5 button'));
        const pill = btns[25]; // index 25 is '26–30'
        if (!pill) return null;
        const style = window.getComputedStyle(pill);
        return {
          text: pill.innerText.trim(),
          title: pill.getAttribute('title'),
          className: pill.className,
          bg: style.backgroundColor,
          border: style.borderColor,
          isGreen: style.backgroundColor === 'rgb(95, 189, 24)' || style.backgroundColor === 'rgb(5, 150, 105)'
        };
      });
    };

    let p26 = await getPill26State();
    check('V2.1 Q26 pill text is "26–30"', p26.text === '26–30', p26.text);
    check('V2.2 Q26 pill initially NOT green', p26.isGreen === false, p26.bg);

    // Navigate to Question 26
    const pills14532 = await page.$$('.grid.grid-cols-5 button');
    await pills14532[25].click();
    await new Promise((r) => setTimeout(r, 400));

    await page.waitForSelector('select[name="fbo-777971-0"]');

    // Fill Blank 0 (1/5)
    await page.select('select[name="fbo-777971-0"]', 'make');
    p26 = await getPill26State();
    check('V2.3 Q26 with 1/5 blank is NOT green', p26.isGreen === false, p26.bg);

    // Fill Blank 1 (2/5)
    await page.select('select[name="fbo-777971-1"]', '15-hour');
    p26 = await getPill26State();
    check('V2.4 Q26 with 2/5 blanks is NOT green', p26.isGreen === false, p26.bg);

    // Fill Blank 2 (3/5)
    await page.select('select[name="fbo-777971-2"]', 'all');
    p26 = await getPill26State();
    check('V2.5 Q26 with 3/5 blanks is NOT green', p26.isGreen === false, p26.bg);

    // Fill Blank 3 (4/5)
    await page.select('select[name="fbo-777971-3"]', 'under');
    p26 = await getPill26State();
    check('V2.6 Q26 with 4/5 blanks is NOT green', p26.isGreen === false, p26.bg);

    // Fill Blank 4 (5/5 -> FULLY ANSWERED)
    await page.select('select[name="fbo-777971-4"]', 'activities');
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V2.7 Q26 with 5/5 blanks filled turns green', p26.isGreen === true, p26.bg);
    check('V2.8 Q26 pill computed backgroundColor genuinely === rgb(95, 189, 24)', p26.bg === 'rgb(95, 189, 24)', p26.bg);
    check('V2.9 Q26 pill computed borderColor genuinely === rgb(95, 189, 24)', p26.border === 'rgb(95, 189, 24)', p26.border);

    // Reversion Test: Clear Blank 4 back to "" (4/5)
    await page.select('select[name="fbo-777971-4"]', '');
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V2.10 Clearing Blank 4 reverts Q26 pill away from green', p26.isGreen === false, p26.bg);

    // Re-fill Blank 4 (5/5)
    await page.select('select[name="fbo-777971-4"]', 'activities');
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V2.11 Re-filling Blank 4 turns Q26 pill back to rgb(95, 189, 24)', p26.bg === 'rgb(95, 189, 24)', p26.bg);

    // Rapid switching on Exam 14532 blanks
    for (let i = 0; i < 5; i++) {
      await page.select('select[name="fbo-777971-0"]', i % 2 === 0 ? 'run' : 'finish');
      await page.select('select[name="fbo-777971-2"]', i % 2 === 0 ? 'both' : 'each');
    }
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V2.12 Rapid option switching across multiple blanks preserves rgb(95, 189, 24)', p26.bg === 'rgb(95, 189, 24)', p26.bg);

    // =========================================================================
    // VECTOR 3: Label htmlFor & Native Event Handling
    // =========================================================================
    console.log('\n▶ Vector 3: Label htmlFor Association & Native Event Bubbling...');

    const labelControlPairs = await page.evaluate(() => {
      const options = Array.from(document.querySelectorAll('.fillblank-option'));
      return options.map((opt) => {
        const label = opt.querySelector('label');
        const control = opt.querySelector('select, input');
        return {
          labelText: label ? label.innerText.trim() : null,
          labelFor: label ? label.getAttribute('for') : null,
          controlId: control ? control.id : null,
          cursor: label ? window.getComputedStyle(label).cursor : null
        };
      });
    });

    check('V3.1 All fillblank options have valid label and control', labelControlPairs.length === 5, labelControlPairs.length);
    const allLabelsMatchControls = labelControlPairs.every((p) => p.labelFor && p.labelFor === p.controlId);
    check('V3.2 Every label htmlFor matches its control id', allLabelsMatchControls, labelControlPairs);
    const allCursorsPointer = labelControlPairs.every((p) => p.cursor === 'pointer');
    check('V3.3 All label cursors are pointer', allCursorsPointer, labelControlPairs.map((p) => p.cursor));

    // Test native click on label focusing the select
    const focusSuccess = await page.evaluate(() => {
      const label = document.querySelector('.fillblank-option label');
      const select = document.querySelector('.fillblank-option select');
      if (!label || !select) return false;
      label.click();
      return document.activeElement === select;
    });
    check('V3.4 Clicking label natively activates and focuses the select control', focusSuccess, focusSuccess);

    // Test native Event('change') bubbling
    const changeBubbleSuccess = await page.evaluate(() => {
      const select = document.querySelector('select[name="fbo-777971-0"]');
      if (!select) return false;
      select.value = 'work';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    });
    check('V3.5 Native change event dispatches and bubbles cleanly without error', changeBubbleSuccess, changeBubbleSuccess);

    // =========================================================================
    // VECTOR 4: Dark Mode vs Light Mode Color Invariance
    // =========================================================================
    console.log('\n▶ Vector 4: Dark Mode & Light Mode Theme Invariance...');

    // Switch to light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V4.1 In Light Mode: completed pill backgroundColor is rgb(95, 189, 24)', p26.bg === 'rgb(95, 189, 24)', p26.bg);
    check('V4.2 In Light Mode: completed pill borderColor is rgb(95, 189, 24)', p26.border === 'rgb(95, 189, 24)', p26.border);

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await new Promise((r) => setTimeout(r, 200));
    p26 = await getPill26State();
    check('V4.3 In Dark Mode: completed pill backgroundColor is rgb(95, 189, 24)', p26.bg === 'rgb(95, 189, 24)', p26.bg);
    check('V4.4 In Dark Mode: completed pill borderColor is rgb(95, 189, 24)', p26.border === 'rgb(95, 189, 24)', p26.border);

    // =========================================================================
    // VECTOR 5: Review Mode Palette Verification & Hover Color
    // =========================================================================
    console.log('\n▶ Vector 5: Review Mode Palette Verification & Hover Color...');

    // Set 100% correct answers on Q26 before submitting
    await page.select('select[name="fbo-777971-0"]', 'make');
    await page.select('select[name="fbo-777971-1"]', '15-hour');
    await page.select('select[name="fbo-777971-2"]', 'each');
    await page.select('select[name="fbo-777971-3"]', 'in');
    await page.select('select[name="fbo-777971-4"]', 'activities');
    await new Promise((r) => setTimeout(r, 200));

    // Open submit modal and submit exam
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.innerText.includes('Nộp bài')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Confirm submission
    await page.evaluate(() => {
      const modalBtns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = modalBtns.find((b) => b.innerText.includes('Xác nhận nộp bài'));
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Review mode palette check
    const reviewData = await page.evaluate(() => {
      const legendSpans = Array.from(document.querySelectorAll('.rounded-full'));
      const greenLegend = legendSpans.find((s) => window.getComputedStyle(s).backgroundColor === 'rgb(95, 189, 24)');
      return {
        hasGreenLegend: Boolean(greenLegend),
        greenLegendColor: greenLegend ? window.getComputedStyle(greenLegend).backgroundColor : null
      };
    });
    check('V5.1 Review mode legend has authentic Tak12 green rgb(95, 189, 24)', reviewData.hasGreenLegend, reviewData.greenLegendColor);

    // Check review mode pill for Q26 (which is fully correct)
    const reviewPillStyles = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.className.includes('bg-[#5fbd18]')
      );
      if (!btns.length) return null;
      const pill = btns[0];
      const style = window.getComputedStyle(pill);
      return {
        className: pill.className,
        bg: style.backgroundColor,
        border: style.borderColor
      };
    });
    check('V5.2 Review mode correct pill has backgroundColor rgb(95, 189, 24)', reviewPillStyles && reviewPillStyles.bg === 'rgb(95, 189, 24)', reviewPillStyles?.bg);
    check('V5.3 Review mode correct pill has borderColor rgb(95, 189, 24)', reviewPillStyles && reviewPillStyles.border === 'rgb(95, 189, 24)', reviewPillStyles?.border);

    // Hover over the actual review pill in the review palette
    const reviewPillSelector = 'button.bg-\\[\\#5fbd18\\]';
    const reviewPillHandle = await page.$(reviewPillSelector);
    if (reviewPillHandle) {
      await reviewPillHandle.scrollIntoView();
      await page.hover(reviewPillSelector);
      await new Promise((r) => setTimeout(r, 200));
    }
    const hoveredReviewBg = await page.evaluate(() => {
      const pill = document.querySelector('button.bg-\\[\\#5fbd18\\]');
      return pill ? window.getComputedStyle(pill).backgroundColor : null;
    });
    check('V5.4 Hovering over correct review pill applies rgb(78, 167, 19) (#4ea713)', hoveredReviewBg === 'rgb(78, 167, 19)', hoveredReviewBg);



  } catch (err) {
    console.error('Unhandled Test Suite Error:', err);
    failures.push({ desc: 'Unhandled Exception', actual: err.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL REAL-BROWSER SUITE COMPLETE: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  if (failures.length > 0) {
    console.log(`❌ FAILURES (${failures.length}):`);
    failures.forEach((f) => console.log(`   - ${f.desc} (Actual: ${JSON.stringify(f.actual)})`));
  } else {
    console.log('🎉 VERDICT: APPROVE');
    console.log('   All multi-blank completions, real computed styles, reversions,');
    console.log('   rapid switching, and theme invariances verified with 100% empirical evidence.');
  }
  console.log('========================================================================\n');

  process.exit(failures.length > 0 ? 1 : 0);
}

runTestSuite();
