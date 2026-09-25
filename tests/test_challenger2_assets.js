const fs = require('fs');
const path = require('path');
const http = require('http');

function decodeHtmlEntities(value) {
  const namedEntities = { amp: '&', quot: '"', apos: "'", aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú' };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => namedEntities[name] || entity);
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      // Drain response data
      res.resume();
      resolve({ status: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ error: 'timeout' });
    });
  });
}

async function run() {
  console.log('================================================================');
  console.log('🔍 CHALLENGER 2: 100% EMPIRICAL ASSET INTEGRITY VERIFICATION');
  console.log('================================================================\n');

  const relTopicsPath = path.resolve(__dirname, '../data/related_topics.json');
  const relData = JSON.parse(fs.readFileSync(relTopicsPath, 'utf8'));

  const publicDir = path.resolve(__dirname, '../public');

  let totalReferences = 0;
  const uniqueSrcs = new Set();

  for (const k in relData) {
    const item = relData[k];
    if (!item.listQuestionTopicDetail) continue;
    for (const d of item.listQuestionTopicDetail) {
      if (!d.detail) continue;
      const matches = d.detail.match(/<img[^>]+src=["\x27]([^"\x27]+)["\x27]/gi);
      if (matches) {
        for (const m of matches) {
          totalReferences++;
          const rawSrc = m.match(/src=["\x27]([^"\x27]+)["\x27]/i)[1];
          uniqueSrcs.add(rawSrc);
        }
      }
    }
  }

  console.log(`▶ Total <img src> occurrences across all 7,785 questions: ${totalReferences}`);
  console.log(`▶ Total unique image URLs referenced: ${uniqueSrcs.size}`);

  let missingOnDisk = [];
  let zeroByteFiles = [];
  let existingOnDisk = [];

  for (const rawSrc of uniqueSrcs) {
    if (rawSrc.startsWith('/Upload/')) {
      const decodedRelPath = decodeHtmlEntities(rawSrc).slice(1);
      const fullDiskPath = path.join(publicDir, decodedRelPath);

      if (!fs.existsSync(fullDiskPath)) {
        missingOnDisk.push({ rawSrc, decodedRelPath, fullDiskPath });
      } else {
        const stats = fs.statSync(fullDiskPath);
        if (stats.size === 0) {
          zeroByteFiles.push({ rawSrc, fullDiskPath });
        } else {
          existingOnDisk.push({ rawSrc, fullDiskPath, size: stats.size });
        }
      }
    } else {
      console.warn(`Non-/Upload/ src found: ${rawSrc}`);
    }
  }

  console.log(`\n▶ Step 1: Disk Existence Verification:`);
  console.log(`  - Existing valid files on disk: ${existingOnDisk.length} / ${uniqueSrcs.size} (${((existingOnDisk.length / uniqueSrcs.size) * 100).toFixed(2)}%)`);
  console.log(`  - Missing files on disk: ${missingOnDisk.length}`);
  console.log(`  - Zero-byte empty files: ${zeroByteFiles.length}`);

  if (missingOnDisk.length > 0) {
    console.error('❌ FAILED: Missing assets on disk:');
    missingOnDisk.forEach(m => console.error(`  - Raw: "${m.rawSrc}"\n    Expected at: ${m.fullDiskPath}`));
  }
  if (zeroByteFiles.length > 0) {
    console.error('❌ FAILED: Zero-byte files:');
    zeroByteFiles.forEach(z => console.error(`  - ${z.fullDiskPath}`));
  }

  // Step 2: HTTP 200 Verification against local dev server
  console.log(`\n▶ Step 2: HTTP 200 Live Server Verification (http://localhost:3000):`);
  let http200Count = 0;
  let httpFailed = [];

  const uniqueSrcArray = Array.from(uniqueSrcs);
  const BATCH_SIZE = 10;

  for (let i = 0; i < uniqueSrcArray.length; i += BATCH_SIZE) {
    const batch = uniqueSrcArray.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (rawSrc) => {
      const decodedSrc = decodeHtmlEntities(rawSrc);
      const encodedUrl = 'http://localhost:3000' + encodeURI(decodedSrc);
      const res = await checkUrl(encodedUrl);
      if (res.status === 200) {
        http200Count++;
      } else {
        httpFailed.push({ rawSrc, encodedUrl, status: res.status, error: res.error });
      }
    });
    await Promise.all(promises);
    process.stdout.write(`\r  Verified ${Math.min(i + BATCH_SIZE, uniqueSrcArray.length)} / ${uniqueSrcArray.length} assets over HTTP...`);
  }
  console.log('\n');

  console.log(`  - HTTP 200 OK: ${http200Count} / ${uniqueSrcs.size} (${((http200Count / uniqueSrcs.size) * 100).toFixed(2)}%)`);
  console.log(`  - Non-200 responses: ${httpFailed.length}`);

  if (httpFailed.length > 0) {
    console.error('❌ FAILED: Assets returning non-200 over HTTP:');
    httpFailed.forEach(f => console.error(`  - URL: ${f.encodedUrl} -> Status: ${f.status || f.error}`));
  } else {
    console.log('  ✓ 100% of image references return HTTP 200 OK locally!');
  }

  // Step 3: Check theories in data/theories/sections/ and study units for any broken /Upload/ references
  console.log(`\n▶ Step 3: Scanning Section & Study Unit Theories for /Upload/ References...`);
  let sectionImages = 0;
  let sectionMissing = 0;
  const sectionsDir = path.resolve(__dirname, '../data/theories/sections');
  if (fs.existsSync(sectionsDir)) {
    for (const f of fs.readdirSync(sectionsDir).filter(x => x.endsWith('.json'))) {
      const secData = JSON.parse(fs.readFileSync(path.join(sectionsDir, f), 'utf8'));
      if (secData.detail) {
        const secMatches = secData.detail.match(/<img[^>]+src=["\x27]([^"\x27]+)["\x27]/gi);
        if (secMatches) {
          for (const sm of secMatches) {
            sectionImages++;
            const sSrc = sm.match(/src=["\x27]([^"\x27]+)["\x27]/i)[1];
            if (sSrc.startsWith('/Upload/')) {
              const diskF = path.join(publicDir, decodeHtmlEntities(sSrc).slice(1));
              if (!fs.existsSync(diskF)) {
                sectionMissing++;
                console.error(`Missing section image in ${f}: ${diskF}`);
              }
            }
          }
        }
      }
    }
  }
  console.log(`  - Section images verified: ${sectionImages} (Missing: ${sectionMissing})`);

  const passed = missingOnDisk.length === 0 && zeroByteFiles.length === 0 && httpFailed.length === 0 && sectionMissing === 0;
  console.log('\n================================================================');
  console.log(`VERDICT: ${passed ? '✅ 100% ASSETS VERIFIED EMPIRICALLY (PASS)' : '❌ ASSETS FAILED'}`);
  console.log('================================================================');

  process.exit(passed ? 0 : 1);
}

run().catch(err => {
  console.error('Fatal error in asset test:', err);
  process.exit(1);
});
