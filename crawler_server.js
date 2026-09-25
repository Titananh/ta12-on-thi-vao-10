const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const DATA_DIR = path.join(__dirname, 'data');
const TOPICS_DIR = path.join(DATA_DIR, 'topics');
const QUESTIONS_DIR = path.join(DATA_DIR, 'questions');

// Ensure directories exist
[DATA_DIR, TOPICS_DIR, QUESTIONS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const server = http.createServer((req, res) => {
  // Enable CORS for TA12 origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (url.pathname === '/save-taxonomy') {
          fs.writeFileSync(path.join(DATA_DIR, 'taxonomy.json'), JSON.stringify(data, null, 2), 'utf8');
          console.log('[Server] Saved taxonomy.json successfully.');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, message: 'Taxonomy saved' }));
        }

        if (url.pathname === '/save-topic') {
          const { topicId, topicData } = data;
          if (!topicId) throw new Error('Missing topicId');
          fs.writeFileSync(path.join(TOPICS_DIR, `${topicId}.json`), JSON.stringify(topicData, null, 2), 'utf8');
          console.log(`[Server] Saved topic ${topicId}: ${topicData.topicName || ''}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, topicId }));
        }

        if (url.pathname === '/save-questions') {
          const { topicId, questions } = data;
          if (!topicId) throw new Error('Missing topicId');
          const filePath = path.join(QUESTIONS_DIR, `${topicId}.json`);
          let existing = [];
          if (fs.existsSync(filePath)) {
            try { existing = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch (e) {}
          }
          // Merge unique by questionId
          const map = new Map();
          existing.forEach(q => map.set(q.id, q));
          questions.forEach(q => map.set(q.id, q));
          const merged = Array.from(map.values());
          fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
          console.log(`[Server] Saved ${merged.length} questions for topic ${topicId}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, count: merged.length }));
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
      } catch (err) {
        console.error('[Server Error]', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (url.pathname === '/status') {
    const topicFiles = fs.existsSync(TOPICS_DIR) ? fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.json')) : [];
    const questionFiles = fs.existsSync(QUESTIONS_DIR) ? fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json')) : [];
    let totalQuestions = 0;
    questionFiles.forEach(f => {
      try {
        const arr = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, f), 'utf8'));
        totalQuestions += arr.length;
      } catch(e) {}
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      topicsCount: topicFiles.length,
      questionsTopicsCount: questionFiles.length,
      totalQuestions,
      hasTaxonomy: fs.existsSync(path.join(DATA_DIR, 'taxonomy.json'))
    }));
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Crawler receiver server running.');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Crawler receiver server listening at http://127.0.0.1:${PORT}`);
});
