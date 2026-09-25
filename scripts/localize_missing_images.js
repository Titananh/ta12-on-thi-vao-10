/**
 * scripts/localize_missing_images.js
 *
 * Exclusively localizes remaining unlocalized /Upload/ Quiz image assets
 * across data/exams/, data/sections/, data/questions/ (subdirs), and data/theories/ (subdirs)
 * for Course Exam ID = 9 ("Ôn thi vào 10 môn Anh - HN").
 *
 * Core syllabus files data/questions/*.json (38 files) and data/theories/*.json (38 files)
 * are strictly preserved and untouched.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const EXAMS_IMG_DIR = path.join(ROOT_DIR, 'public', 'images', 'exams');

// Ensure image directory exists
if (!fs.existsSync(EXAMS_IMG_DIR)) {
  fs.mkdirSync(EXAMS_IMG_DIR, { recursive: true });
}

// Decode HTML entities
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&ocirc;/gi, 'ô').replace(/&Ocirc;/gi, 'Ô')
    .replace(/&acirc;/gi, 'â').replace(/&Acirc;/gi, 'Â')
    .replace(/&ecirc;/gi, 'ê').replace(/&Ecirc;/gi, 'Ê')
    .replace(/&aacute;/gi, 'á').replace(/&Aacute;/gi, 'Á')
    .replace(/&agrave;/gi, 'à').replace(/&Agrave;/gi, 'À')
    .replace(/&eacute;/gi, 'é').replace(/&Eacute;/gi, 'É')
    .replace(/&egrave;/gi, 'è').replace(/&Egrave;/gi, 'È')
    .replace(/&iacute;/gi, 'í').replace(/&Iacute;/gi, 'Í')
    .replace(/&igrave;/gi, 'ì').replace(/&Igrave;/gi, 'Ì')
    .replace(/&oacute;/gi, 'ó').replace(/&Oacute;/gi, 'Ó')
    .replace(/&ograve;/gi, 'ò').replace(/&Ograve;/gi, 'Ò')
    .replace(/&uacute;/gi, 'ú').replace(/&Uacute;/gi, 'Ú')
    .replace(/&ugrave;/gi, 'ù').replace(/&Ugrave;/gi, 'Ù')
    .replace(/&yacute;/gi, 'ý').replace(/&Yacute;/gi, 'Ý')
    .replace(/&atilde;/gi, 'ã').replace(/&otilde;/gi, 'õ')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Generate local filename and path
function getLocalPathInfo(rawPath) {
  const decodedPath = decodeHtmlEntities(rawPath);
  const ext = path.extname(decodedPath).toLowerCase() || '.png';
  const cleanBase = path.basename(decodedPath, ext)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);
  const hash = crypto.createHash('md5').update(decodedPath).digest('hex').substring(0, 8);
  const fileName = `${cleanBase}_${hash}${ext}`;
  const destFile = path.join(EXAMS_IMG_DIR, fileName);
  const localUrl = `/images/exams/${fileName}`;
  return { decodedPath, fileName, destFile, localUrl };
}

// Download image with retry and alternate URL handling (e.g. TA12 <-> TAK12)
async function downloadAsset(rawPath, destFile) {
  if (fs.existsSync(destFile)) {
    const stat = fs.statSync(destFile);
    if (stat.size > 0) return true;
  }

  const decoded = decodeHtmlEntities(rawPath);
  const candidates = [decoded];
  if (decoded.includes('TA12')) {
    candidates.push(decoded.replace(/TA12/g, 'TAK12'));
  }
  if (decoded.includes('TAK12')) {
    candidates.push(decoded.replace(/TAK12/g, 'TA12'));
  }

  for (const cand of candidates) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const url = 'https://tak12.com' + encodeURI(cand);
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        });

        if (res.ok) {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('image') || ct.includes('octet-stream')) {
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length > 0) {
              fs.writeFileSync(destFile, buf);
              return true;
            }
          }
        }
      } catch (err) {
        if (attempt === 3) break;
        await sleep(500 * attempt);
      }
    }
  }

  return false;
}

// Check if a file should be protected from modification
function isProtectedCoreFile(filePath) {
  const rel = path.relative(DATA_DIR, filePath);
  // Root questions/*.json and theories/*.json are the 38 core syllabus files
  const parts = rel.split(path.sep);
  if (parts.length === 2 && (parts[0] === 'questions' || parts[0] === 'theories')) {
    return true;
  }
  return false;
}

// Collect all json files in data/
function getJsonFiles(dir) {
  let results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getJsonFiles(full));
    } else if (item.name.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  console.log('=== TA12 MILESTONE 1: LOCALIZING MISSING IMAGE ASSETS ===');
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Target images directory: ${EXAMS_IMG_DIR}`);

  const allJsonFiles = getJsonFiles(DATA_DIR);
  console.log(`Found ${allJsonFiles.length} JSON files in ${DATA_DIR}.`);

  // Step 1: Scan for unlocalized /Upload/ references
  const urlToLocalMap = new Map();
  const fileOccurrences = new Map(); // filePath -> array of { rawPath, localUrl }
  const regex = /(src\s*=\s*["'])(https?:\/\/(?:data\.)?tak12\.com)?(\/Upload\/[^"'\r\n<>]+)(["'])/gi;

  let totalFoundReferences = 0;

  for (const filePath of allJsonFiles) {
    if (isProtectedCoreFile(filePath)) {
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('/Upload/')) continue;

    const parsed = JSON.parse(content);
    const occurrencesInFile = [];

    function findInObj(obj) {
      if (!obj) return;
      if (typeof obj === 'string') {
        let m;
        const re = new RegExp(regex.source, 'gi');
        while ((m = re.exec(obj)) !== null) {
          const rawPath = m[3];
          occurrencesInFile.push(rawPath);
          if (!urlToLocalMap.has(rawPath)) {
            const info = getLocalPathInfo(rawPath);
            urlToLocalMap.set(rawPath, info);
          }
        }
      } else if (Array.isArray(obj)) {
        for (const it of obj) findInObj(it);
      } else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) findInObj(obj[k]);
      }
    }

    findInObj(parsed);

    if (occurrencesInFile.length > 0) {
      fileOccurrences.set(filePath, occurrencesInFile);
      totalFoundReferences += occurrencesInFile.length;
    }
  }

  console.log(`\n▶ Scan complete:`);
  console.log(`  - Total unlocalized references found: ${totalFoundReferences}`);
  console.log(`  - Distinct remote image assets: ${urlToLocalMap.size}`);
  console.log(`  - Affected JSON files: ${fileOccurrences.size}`);

  // Step 2: Download each distinct image asset
  console.log('\n▶ Downloading distinct image assets to public/images/exams/...');
  let downloadedCount = 0;
  let skippedExisting = 0;
  let failedCount = 0;
  const failedList = [];

  const distinctAssets = Array.from(urlToLocalMap.values());
  for (let i = 0; i < distinctAssets.length; i++) {
    const item = distinctAssets[i];
    const exists = fs.existsSync(item.destFile) && fs.statSync(item.destFile).size > 0;
    if (exists) {
      skippedExisting++;
    } else {
      const ok = await downloadAsset(item.decodedPath, item.destFile);
      if (ok) {
        downloadedCount++;
      } else {
        failedCount++;
        failedList.push(item);
      }
    }

    if ((i + 1) % 50 === 0 || i === distinctAssets.length - 1) {
      console.log(`  Progress: ${i + 1}/${distinctAssets.length} (Downloaded: ${downloadedCount}, Existing: ${skippedExisting}, Failed: ${failedCount})`);
    }
  }

  if (failedCount > 0) {
    console.error(`❌ ERROR: Failed to download ${failedCount} assets!`, failedList);
    process.exit(1);
  }
  console.log(`✓ All ${distinctAssets.length} distinct assets secured on disk.`);

  // Step 3: Rewrite occurrences in all affected JSON files
  console.log('\n▶ Rewriting image URLs in affected JSON files...');
  let rewrittenFilesCount = 0;

  for (const [filePath, occurrences] of fileOccurrences.entries()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);

    function replaceInObj(obj) {
      if (!obj) return obj;
      if (typeof obj === 'string') {
        const re = new RegExp(regex.source, 'gi');
        return obj.replace(re, (match, p1, p2, rawPath, p4) => {
          const info = urlToLocalMap.get(rawPath);
          if (info && info.localUrl) {
            return `${p1}${info.localUrl}${p4}`;
          }
          return match;
        });
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          obj[i] = replaceInObj(obj[i]);
        }
      } else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          obj[k] = replaceInObj(obj[k]);
        }
      }
      return obj;
    }

    replaceInObj(parsed);

    // Save with identical formatting (JSON.stringify null, 2)
    const newContent = JSON.stringify(parsed, null, 2);
    fs.writeFileSync(filePath, newContent, 'utf8');
    rewrittenFilesCount++;
  }
  console.log(`✓ Successfully rewritten ${rewrittenFilesCount} JSON files.`);

  // Step 4: Verification of zero remaining unlocalized images
  console.log('\n▶ Verifying that all /Upload/ references across entire data/ directory are eliminated...');
  let remainingUploads = 0;
  const remainingDetails = [];

  for (const filePath of allJsonFiles) {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (raw.includes('/Upload/')) {
      const re = new RegExp(regex.source, 'gi');
      let m;
      while ((m = re.exec(raw)) !== null) {
        remainingUploads++;
        remainingDetails.push({ file: path.relative(ROOT_DIR, filePath), match: m[0] });
      }
    }
  }

  if (remainingUploads > 0) {
    console.error(`❌ AUDIT FAILED: Still found ${remainingUploads} unlocalized /Upload/ occurrences!`);
    console.error(remainingDetails.slice(0, 10));
    process.exit(1);
  }
  console.log(`✓ 100% CLEAN: Exactly 0 unlocalized /Upload/ occurrences remain across all ${allJsonFiles.length} JSON files!`);

  // Step 5: Verify all referenced images exist on disk with size > 0
  console.log('\n▶ Verifying all referenced local images exist on disk with size > 0...');
  let checkedLocalImages = 0;
  for (const item of distinctAssets) {
    if (!fs.existsSync(item.destFile)) {
      console.error(`❌ MISSING FILE: ${item.destFile}`);
      process.exit(1);
    }
    const stat = fs.statSync(item.destFile);
    if (stat.size === 0) {
      console.error(`❌ ZERO SIZE FILE: ${item.destFile}`);
      process.exit(1);
    }
    checkedLocalImages++;
  }
  console.log(`✓ Verified ${checkedLocalImages} local image files on disk (all > 0 bytes).`);

  console.log('\n🎉 ALL MISSING IMAGES SUCCESSFULLY LOCALIZED AND VERIFIED!');
}

main().catch(err => {
  console.error('Fatal error during localization:', err);
  process.exit(1);
});
