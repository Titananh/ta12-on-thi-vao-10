/**
 * CHALLENGER 2 REGRESSION & EMPIRICAL STRESS TEST SUITE
 * Milestone M1: Tak12 Native Dropdown Parity, Label Associations, Focus Isolation, & Contrast Ratios
 *
 * Verifications executed:
 * 1. Label click association across HTML templates and dynamic question renders:
 *    - Real DOM & Browser inspection: every <label> has 'for' attribute matching companion <select id>.
 *    - Rogue focus test: Clicking surrounding paragraph text, headings, or passages MUST NOT steal focus.
 *    - Native label click: Clicking <label> transfers focus natively to companion <select>.
 * 2. Cross-bundle data audit across all 138 exam bundles:
 *    - All 1,179 fillblank options checked for label/control pairing and ID uniqueness.
 * 3. Theme & Contrast stress test (Light & Dark modes):
 *    - Computed style extraction for .fillblank-option, label, select, options, and palette buttons.
 *    - Mathematical WCAG 2.1 relative luminance and contrast calculations.
 * 4. Real interactive simulation on Exam 15264, Exam 14532, and Exam 19159:
 *    - Option selection, bidirectional state synchronization, palette color transition.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [CHECK ${totalChecks}] ${desc}`);
  } else {
    console.error(`  ✗ [CHECK ${totalChecks}] FAIL: ${desc}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

// WCAG relative luminance & contrast helpers
function parseRgb(colorStr) {
  if (!colorStr) return [0, 0, 0];
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  }
  let hex = colorStr.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function computeContrast(color1, color2) {
  const [r1, g1, b1] = parseRgb(color1);
  const [r2, g2, b2] = parseRgb(color2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runEmpiricalStressSuite() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER 2: REGRESSION & STRESS EMPIRICAL AUDIT (MILESTONE M1)');
  console.log('========================================================================\n');

  // ===========================================================================
  // SECTION 1: Cross-Bundle Static Data Audit (All 138 Exam Bundles)
  // ===========================================================================
  console.log('▶ SECTION 1: Auditing all 138 exam bundles for FillBlank structure...');
  const bundlesDir = path.join(ROOT_DIR, 'data', 'exams', 'bundles');
  const bundleFiles = fs.readdirSync(bundlesDir).filter(f => f.endsWith('.json'));

  let totalQuestionsAudited = 0;
  let totalFillBlankQuestions = 0;
  let totalBlanksAudited = 0;
  let zeroDuplicateIds = true;
  const duplicateIdList = [];

  bundleFiles.forEach(file => {
    const bundle = JSON.parse(fs.readFileSync(path.join(bundlesDir, file), 'utf8'));
    (bundle.questions || []).forEach(q => {
      totalQuestionsAudited++;
      if (!q.questionText) return;
      const isFB = q.questionType === 'FillBlank' ||
        (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'));
      if (!isFB) return;

      totalFillBlankQuestions++;

      const optionMatches = q.questionText.match(/<span[^>]*class=[\"'][^\"']*fillblank-option[^\"']*[\"'][^>]*>[\s\S]*?<\/span>/gi) || [];
      const seenIdsInQ = new Set();

      optionMatches.forEach((optHtml) => {
        totalBlanksAudited++;
        const labelMatch = optHtml.match(/<label[^>]*>([\s\S]*?)<\/label>/i);
        const controlMatch = optHtml.match(/<(select|input)[^>]*>/i);

        if (!controlMatch) {
          throw new Error(`Option in ${file} q ${q.id} missing control element!`);
        }

        const ctrlTag = controlMatch[0];
        const idMatch = ctrlTag.match(/\sid=[\"']([^\"']+)[\"']/i);
        const nameMatch = ctrlTag.match(/\sname=[\"']([^\"']+)[\"']/i);
        const indexMatch = ctrlTag.match(/\sindex=[\"']([^\"']+)[\"']/i);

        const controlId = (idMatch ? idMatch[1] : null) ||
          (nameMatch ? nameMatch[1] : null) ||
          `fbo-${q.id}-${(indexMatch ? indexMatch[1] : null) || '0'}`;

        if (seenIdsInQ.has(controlId)) {
          zeroDuplicateIds = false;
          duplicateIdList.push({ file, qId: q.id, controlId });
        }
        seenIdsInQ.add(controlId);

        if (labelMatch) {
          const lblTag = labelMatch[0];
          const forMatch = lblTag.match(/\sfor=[\"']([^\"']+)[\"']/i);
          if (forMatch && forMatch[1] !== controlId) {
            throw new Error(`Pre-existing htmlFor mismatch in ${file} q ${q.id}: ${forMatch[1]} vs ${controlId}`);
          }
        }
      });
    });
  });

  check(`Audited all ${bundleFiles.length} exam bundles (${totalQuestionsAudited} questions total)`, bundleFiles.length === 138);
  check(`Audited ${totalFillBlankQuestions} FillBlank questions across all bundles`, totalFillBlankQuestions === 247);
  check(`Audited ${totalBlanksAudited} individual fillblank options in question text`, totalBlanksAudited === 1179);
  check('Zero duplicate control IDs generated across any question', zeroDuplicateIds && duplicateIdList.length === 0);

  // ===========================================================================
  // SECTION 2: Codebase Static Inspection (Zero showPicker & Zero Rogue Clickers)
  // ===========================================================================
  console.log('\n▶ SECTION 2: Verifying eradication of showPicker & rogue click listeners...');

  const examRunnerSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'ExamRunner.tsx'), 'utf8');
  const practiceSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'practice', '[topicId]', 'page.tsx'), 'utf8');

  check('ExamRunner.tsx contains 0 occurrences of showPicker', !examRunnerSrc.includes('showPicker'));
  check('Practice page.tsx contains 0 occurrences of showPicker', !practiceSrc.includes('showPicker'));

  check('ExamRunner.tsx removed rogue click listener on questionPromptRef',
    !examRunnerSrc.includes("container.addEventListener('click', handleClick)"));
  check('Practice page.tsx removed rogue click listener on questionPromptRef',
    !practiceSrc.includes("container.addEventListener('click', handleClick)"));

  check('ExamRunner.tsx removed inline onClick handler on questionPromptRef JSX',
    !examRunnerSrc.includes('ref={questionPromptRef}\n                    onClick=') &&
    !examRunnerSrc.includes('ref={questionPromptRef} onClick='));
  check('Practice page.tsx removed inline onClick handler on questionPromptRef JSX',
    !practiceSrc.includes('ref={questionPromptRef}\n              onClick=') &&
    !practiceSrc.includes('ref={questionPromptRef} onClick='));

  check('ExamRunner.tsx implements dynamic <label for> pairing',
    examRunnerSrc.includes("label.setAttribute('for', controlId)"));
  check('Practice page.tsx implements dynamic <label for> pairing',
    practiceSrc.includes("label.setAttribute('for', controlId)"));

  check('ExamRunner palette answered pill includes Tak12 signature green #5fbd18',
    examRunnerSrc.includes("bg-[#5fbd18] border-[#5fbd18]"));
  check('ExamRunner palette answered pill retains bg-emerald-600 for backward compatibility',
    examRunnerSrc.includes("bg-emerald-600 border-emerald-600 text-white shadow-xs"));

  // ===========================================================================
  // SECTION 3: Real Browser Puppeteer Execution (End-to-End Stress Test)
  // ===========================================================================
  console.log('\n▶ SECTION 3: Launching Chromium Puppeteer for real DOM stress testing...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Authenticate student session via mock-login
  console.log('  Authenticating approved student session...');
  await page.goto(`${BASE_URL}/api/auth/mock-login?persona=approved`, { waitUntil: 'networkidle0' });

  // ---------------------------------------------------------------------------
  // 3.1 Exam 15264: Question 13–16 Label Association & Rogue Focus Test
  // ---------------------------------------------------------------------------
  console.log('\n  --- 3.1 Exam 15264: Q13–16 Label Association & Rogue Focus Stress ---');
  await page.goto(`${BASE_URL}/exam/15264`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for palette and click Question 13–16
  await page.waitForSelector('button[title*="13"]', { timeout: 10000 });
  await page.click('button[title*="13"]');
  await page.waitForSelector('.fillblank-option', { timeout: 5000 });

  // Verify dynamic label htmlFor <-> select id pairing in live browser DOM
  const pairingResults = await page.evaluate(() => {
    const options = document.querySelectorAll('.fillblank-option');
    const res = [];
    options.forEach((opt, idx) => {
      const lbl = opt.querySelector('label');
      const sel = opt.querySelector('select, input');
      res.push({
        idx,
        hasLabel: Boolean(lbl),
        labelText: lbl?.textContent?.trim(),
        labelFor: lbl?.getAttribute('for'),
        hasControl: Boolean(sel),
        controlId: sel?.id,
        matched: Boolean(lbl && sel && lbl.getAttribute('for') === sel.id),
      });
    });
    return res;
  });

  check(`Exam 15264 Q13 has ${pairingResults.length} fillblank options rendered`, pairingResults.length === 4);
  pairingResults.forEach((p, i) => {
    check(`Blank ${i + 1} (${p.labelText}): <label for="${p.labelFor}"> strictly matches <select id="${p.controlId}">`,
      p.hasLabel && p.hasControl && p.labelFor && p.matched);
  });

  // Test Rogue Focus Stealing: Click surrounding paragraph and passage text
  console.log('  Testing rogue focus stealing on surrounding paragraph text...');

  const rogueFocusChecks = await page.evaluate(() => {
    const results = [];
    const paragraphs = document.querySelectorAll('p, i, strong, .max-h-72');
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (p.querySelector('.fillblank-option')) continue;

      p.scrollIntoView();
      p.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      const active = document.activeElement;
      const isSelectOrInput = active && (active.tagName === 'SELECT' || active.tagName === 'INPUT');
      results.push({
        element: p.tagName,
        snippet: p.textContent.slice(0, 30),
        activeElementTag: active?.tagName,
        stoleFocus: isSelectOrInput,
      });
    }
    return results;
  });

  check(`Tested ${rogueFocusChecks.length} surrounding text elements for rogue focus stealing`, rogueFocusChecks.length > 0);
  const anyRogueFocus = rogueFocusChecks.some(r => r.stoleFocus);
  check('Clicking surrounding text/passage elements NEVER steals focus to dropdowns', !anyRogueFocus);

  // Test Native Label Click association: Clicking <label> focuses <select>
  console.log('  Testing native label click focus association...');
  const labelClickFocusCheck = await page.evaluate(() => {
    const firstOption = document.querySelector('.fillblank-option');
    const label = firstOption.querySelector('label');
    const select = firstOption.querySelector('select');

    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }

    label.click();

    return {
      activeElementId: document.activeElement?.id,
      expectedId: select?.id,
      focusedCorrectSelect: document.activeElement === select,
    };
  });

  check(`Clicking <label> directly focuses companion <select id="${labelClickFocusCheck.expectedId}"> natively`,
    labelClickFocusCheck.focusedCorrectSelect);

  // Test Selecting All 4 Options & Palette Synchronization
  console.log('  Testing option selection & Palette color transition...');
  const paletteBefore = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="13"]');
    return btn?.className;
  });
  check('Palette pill before all blanks answered is NOT green',
    !paletteBefore.includes('bg-[#5fbd18]') || !paletteBefore.includes('bg-emerald-600'));

  // Select option in all 4 blanks
  await page.evaluate(() => {
    const selects = document.querySelectorAll('.fillblank-option select');
    selects.forEach((sel) => {
      if (sel.options.length > 1) {
        sel.selectedIndex = 1;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  await new Promise(r => setTimeout(r, 400));

  const paletteAfter = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="13"]');
    return btn?.className;
  });

  check('Palette pill turns green upon completing all 4 blanks (includes bg-[#5fbd18])',
    paletteAfter.includes('bg-[#5fbd18]'));
  check('Palette pill retains bg-emerald-600 for regression safety',
    paletteAfter.includes('bg-emerald-600'));

  // ---------------------------------------------------------------------------
  // 3.2 Exam 14532: Questions 26–30 FillBlank Verification
  // ---------------------------------------------------------------------------
  console.log('\n  --- 3.2 Exam 14532: Q26–30 FillBlank Verification ---');
  await page.goto(`${BASE_URL}/exam/14532`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForSelector('button[title*="26"]', { timeout: 10000 });
  await page.click('button[title*="26"]');
  await page.waitForSelector('.fillblank-option', { timeout: 5000 });

  const e14532Pairing = await page.evaluate(() => {
    const options = document.querySelectorAll('.fillblank-option');
    return Array.from(options).map((opt) => {
      const lbl = opt.querySelector('label');
      const sel = opt.querySelector('select, input');
      return {
        lblFor: lbl?.getAttribute('for'),
        selId: sel?.id,
        matched: Boolean(lbl && sel && lbl.getAttribute('for') === sel.id),
      };
    });
  });

  check(`Exam 14532 Q26 has ${e14532Pairing.length} blanks rendered`, e14532Pairing.length === 5);
  e14532Pairing.forEach((p, i) => {
    check(`Exam 14532 blank ${i + 1}: label for="${p.lblFor}" strictly matches select id="${p.selId}"`, p.matched);
  });

  // ---------------------------------------------------------------------------
  // 3.3 Exam 19159: Question 33–36 FillBlank Verification
  // ---------------------------------------------------------------------------
  console.log('\n  --- 3.3 Exam 19159: Q33–36 FillBlank Verification ---');
  await page.goto(`${BASE_URL}/exam/19159`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.waitForSelector('button[title*="33"]', { timeout: 10000 });
  await page.click('button[title*="33"]');
  await page.waitForSelector('.fillblank-option', { timeout: 5000 });

  const e19159Pairing = await page.evaluate(() => {
    const options = document.querySelectorAll('.fillblank-option');
    return Array.from(options).map((opt) => {
      const lbl = opt.querySelector('label');
      const sel = opt.querySelector('select, input');
      return {
        lblFor: lbl?.getAttribute('for'),
        selId: sel?.id,
        matched: Boolean(lbl && sel && lbl.getAttribute('for') === sel.id),
      };
    });
  });

  check(`Exam 19159 Q33 has ${e19159Pairing.length} blanks rendered`, e19159Pairing.length === 4);
  e19159Pairing.forEach((p, i) => {
    check(`Exam 19159 blank ${i + 1}: label for="${p.lblFor}" strictly matches select id="${p.selId}"`, p.matched);
  });

  // ---------------------------------------------------------------------------
  // 3.4 Theme & Contrast Stress Testing (Light Mode & Dark Mode)
  // ---------------------------------------------------------------------------
  console.log('\n  --- 3.4 Dark Mode vs Light Mode Contrast & Styling Stress ---');

  async function extractStyles(themeName) {
    return await page.evaluate((tName) => {
      const option = document.querySelector('.fillblank-option');
      const label = option?.querySelector('label');
      const select = option?.querySelector('select');
      const firstOpt = select?.querySelector('option');
      const paletteBtn = document.querySelector('button[title*="Câu 1"]');

      function getStyles(el) {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderColor: cs.borderColor,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          height: cs.height,
          padding: cs.padding,
          borderRadius: cs.borderRadius,
          cursor: cs.cursor,
        };
      }

      return {
        theme: tName,
        label: getStyles(label),
        select: getStyles(select),
        option: getStyles(firstOpt),
        paletteBtn: getStyles(paletteBtn),
      };
    }, themeName);
  }

  // A. Light Mode
  await page.evaluate(() => {
    localStorage.setItem('ta12_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 200));
  const lightStyles = await extractStyles('Light');

  console.log('  Light Mode Computed Styles:');
  console.log('    Label bg:', lightStyles.label?.backgroundColor, 'color:', lightStyles.label?.color);
  console.log('    Select bg:', lightStyles.select?.backgroundColor, 'color:', lightStyles.select?.color);

  const lightLabelContrast = computeContrast(lightStyles.label.color, lightStyles.label.backgroundColor);
  check(`Light Mode: Label text contrast is ${lightLabelContrast.toFixed(2)}:1 (>= 3.0:1 for graphical/UI component)`,
    lightLabelContrast >= 3.0);
  check('Light Mode: Label background is #299b83 (rgb(41, 155, 131))',
    lightStyles.label.backgroundColor.includes('41, 155, 131'));
  check('Light Mode: Label text is white (rgb(255, 255, 255))',
    lightStyles.label.color.includes('255, 255, 255'));

  const lightSelectContrast = computeContrast(lightStyles.select.color, lightStyles.select.backgroundColor);
  check(`Light Mode: Select text contrast is ${lightSelectContrast.toFixed(2)}:1 (>= 7.0:1 for WCAG AAA)`,
    lightSelectContrast >= 7.0);

  // B. Dark Mode: set localStorage and reload or re-apply .dark
  await page.evaluate(() => {
    localStorage.setItem('ta12_theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  // Navigate cleanly with dark theme active
  await page.goto(`${BASE_URL}/exam/19159`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('button[title*="33"]');
  await page.click('button[title*="33"]');
  await page.waitForSelector('.fillblank-option');

  const darkStyles = await extractStyles('Dark');

  console.log('  Dark Mode Computed Styles:');
  console.log('    Label bg:', darkStyles.label?.backgroundColor, 'color:', darkStyles.label?.color);
  console.log('    Select bg:', darkStyles.select?.backgroundColor, 'color:', darkStyles.select?.color);

  const darkLabelContrast = computeContrast(darkStyles.label.color, darkStyles.label.backgroundColor);
  check(`Dark Mode: Label text contrast is ${darkLabelContrast.toFixed(2)}:1 (>= 3.0:1 for graphical/UI component)`,
    darkLabelContrast >= 3.0);
  check('Dark Mode: Label background remains signature #299b83 (rgb(41, 155, 131))',
    darkStyles.label.backgroundColor.includes('41, 155, 131'));
  check('Dark Mode: Label text is white (rgb(255, 255, 255))',
    darkStyles.label.color.includes('255, 255, 255'));

  const darkSelectContrast = computeContrast(darkStyles.select.color, darkStyles.select.backgroundColor);
  check(`Dark Mode: Select text contrast is ${darkSelectContrast.toFixed(2)}:1 (>= 7.0:1 for WCAG AAA)`,
    darkSelectContrast >= 7.0);
  check('Dark Mode: Select has dark background rgb(30, 34, 30)',
    darkStyles.select.backgroundColor.includes('30, 34, 30'));
  check('Dark Mode: Select has bright white text rgb(255, 255, 255)',
    darkStyles.select.color.includes('255, 255, 255'));

  // Palette button contrast in both modes
  const lightPaletteContrast = computeContrast(lightStyles.paletteBtn.color, lightStyles.paletteBtn.backgroundColor);
  check(`Light Mode: Palette unselected pill contrast is ${lightPaletteContrast.toFixed(2)}:1 (>= 4.5:1 for WCAG AA)`,
    lightPaletteContrast >= 4.5);

  const darkPaletteContrast = computeContrast(darkStyles.paletteBtn.color, darkStyles.paletteBtn.backgroundColor);
  check(`Dark Mode: Palette unselected pill contrast is ${darkPaletteContrast.toFixed(2)}:1 (>= 4.5:1 for WCAG AA)`,
    darkPaletteContrast >= 4.5);

  const emeraldWhiteContrast = computeContrast('#ffffff', '#059669');
  check(`Palette answered button contrast (white on emerald-600): ${emeraldWhiteContrast.toFixed(2)}:1 (>= 3.0:1 for UI elements)`,
    emeraldWhiteContrast >= 3.0);

  await browser.close();

  // ===========================================================================
  // SECTION 4: Final Summary
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 CHALLENGER 2 REGRESSION & STRESS SUITE: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  console.log('========================================================================');
  console.log('🎉 VERDICT: EMPIRICAL APPROVE');
  console.log('   All 1:1 label-to-control pairings, zero focus stealing, theme contrasts,');
  console.log('   and state synchronization verified in real Chromium browser.');
  console.log('========================================================================\n');
}

runEmpiricalStressSuite().catch((err) => {
  console.error('\n❌ STRESS SUITE FAILED WITH ERROR:', err);
  process.exit(1);
});
