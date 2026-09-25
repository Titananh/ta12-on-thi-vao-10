const fs = require('fs');
const path = require('path');
const https = require('https');

const t = require('../data/related_topics.json');
const UPLOAD_ROOT = path.join(__dirname, '..', 'public');

function decodeEntities(encodedString) {
  const translate_re = /&(nbsp|amp|quot|lt|gt|acirc|eacute|agrave|aacute|atilde|ocirc|oacute|ograve|otilde|ecirc|egrave|eacute|utilde|uacute|ugrave|iacute|igrave);/g;
  const translate = {
    "nbsp": " ",
    "amp": "&",
    "quot": "\"",
    "lt": "<",
    "gt": ">",
    "acirc": "â",
    "eacute": "é",
    "agrave": "à",
    "aacute": "á",
    "atilde": "ã",
    "ocirc": "ô",
    "oacute": "ó",
    "ograve": "ò",
    "otilde": "õ",
    "ecirc": "ê",
    "egrave": "è",
    "utilde": "ũ",
    "uacute": "ú",
    "ugrave": "ù",
    "iacute": "í",
    "igrave": "ì"
  };
  return encodedString.replace(translate_re, function(match, entity) {
    return translate[entity] || match;
  });
}

const rawUrls = new Set();
for (const k in t) {
  const item = t[k];
  if (item && item.listQuestionTopicDetail) {
    for (const d of item.listQuestionTopicDetail) {
      if (d && d.detail) {
        const matches = d.detail.match(/<img[^>]+src=["\x27]([^"\x27]+)["\x27]/gi);
        if (matches) {
          matches.forEach(m => {
            const src = m.match(/src=["\x27]([^"\x27]+)["\x27]/i)[1];
            rawUrls.add(src);
          });
        }
      }
    }
  }
}

console.log(`Found ${rawUrls.size} unique image URLs to download.`);

async function download(rawSrc) {
  const cleanSrc = decodeEntities(rawSrc);
  const localPath = path.join(UPLOAD_ROOT, cleanSrc.startsWith('/') ? cleanSrc.slice(1) : cleanSrc);
  const localDir = path.dirname(localPath);
  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

  if (fs.existsSync(localPath) && fs.statSync(localPath).size > 500) {
    // already downloaded
    return;
  }

  // Construct valid URL with encodeURI
  const remotePath = encodeURI(cleanSrc.startsWith('/') ? cleanSrc : '/' + cleanSrc);
  const fullUrl = `https://tak12.com${remotePath}`;

  return new Promise((resolve) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[OK] Downloaded: ${cleanSrc}`);
          resolve();
        });
      } else {
        console.warn(`[WARN] HTTP ${res.statusCode} for ${fullUrl}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(`[ERR] ${err.message} for ${fullUrl}`);
      resolve();
    });
  });
}

(async () => {
  for (const src of rawUrls) {
    await download(src);
  }
  console.log('All image downloads finished!');
})();
