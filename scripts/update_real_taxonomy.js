const fs = require('fs');
const path = require('path');

const inputPath = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609/.system_generated/steps/2513/output.txt';
const raw = fs.readFileSync(inputPath, 'utf8');

// The file format has lines like:
// Script ran on page and returned:
// ```json
// "..."
// ```
const startIdx = raw.indexOf('```json\n');
const endIdx = raw.lastIndexOf('\n```');

if (startIdx !== -1 && endIdx !== -1) {
  const jsonStr = raw.substring(startIdx + 8, endIdx).trim();
  const unquoted = JSON.parse(jsonStr);
  const data = typeof unquoted === 'string' ? JSON.parse(unquoted) : unquoted;

  fs.writeFileSync('data/taxonomy.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('✅ Updated data/taxonomy.json with real Tak12 data!');

  const scored = [];
  data.skills?.forEach(s => {
    s.topicCategories?.forEach(c => {
      c.topics?.forEach(t => {
        if (t.score > 0) scored.push({ id: t.id, name: t.topicName, score: t.score, total: t.totalQuestions });
      });
    });
  });
  console.log('Scored topics:', scored);
} else {
  console.error('Failed to locate JSON chunk');
}
