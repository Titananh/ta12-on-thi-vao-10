const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/ta12_users.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL;');

// 1. Delete all junk stress-test accounts
const deletedUsers = db.prepare("DELETE FROM users WHERE email LIKE 'student_%@gmail.com'").run();
const deletedWhitelist = db.prepare("DELETE FROM pre_whitelist WHERE email LIKE 'student_%@gmail.com'").run();
console.log(`🧹 Cleaned up ${deletedUsers.changes} junk test users and ${deletedWhitelist.changes} junk whitelist rows.`);

// 2. Ensure Superadmin user dot71714@gmail.com exists
const superadmin = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get('dot71714@gmail.com');
const realTopicProgress = JSON.stringify({ '68': 3, '535': 10, '257': 10 });
const realExamScores = JSON.stringify({
  '1097_2024': {
    examId: 1097,
    examTitle: 'Đề thi chính thức vào 10 môn Anh - Sở GD&ĐT Hà Nội (2024)',
    score: 9.25,
    correctCount: 37,
    totalQuestions: 40,
    completedAt: Date.now() - 86400000
  },
  '1097_2023': {
    examId: 1096,
    examTitle: 'Đề thi chính thức vào 10 môn Anh - Sở GD&ĐT Hà Nội (2023)',
    score: 8.75,
    correctCount: 35,
    totalQuestions: 40,
    completedAt: Date.now() - 172800000
  }
});

if (!superadmin) {
  db.prepare(`
    INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, 'approved', datetime('now'), datetime('now'), datetime('now'))
  `).run('usr_superadmin_dot71714', 'google_dot71714', 'dot71714@gmail.com', 'Đỗ Tuấn (Superadmin)', null);

  db.prepare(`
    INSERT OR REPLACE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
    VALUES (?, ?, ?, '{}', '{}', 1, 50, datetime('now'))
  `).run('usr_superadmin_dot71714', realExamScores, realTopicProgress);
  console.log('✅ Created Superadmin user dot71714@gmail.com with real progress!');
} else {
  db.prepare(`
    UPDATE user_progress SET topic_practice_history = ?, exam_scores = ?, streak_flame = 1, diamonds = 50 WHERE user_id = ?
  `).run(realTopicProgress, realExamScores, superadmin.id);
  console.log('✅ Updated Superadmin user progress!');
}

// 3. Update usr_dotuan_demo with real progress as well
db.prepare(`
  UPDATE user_progress SET topic_practice_history = ?, exam_scores = ?, streak_flame = 1, diamonds = 50 WHERE user_id = 'usr_dotuan_demo'
`).run(realTopicProgress, realExamScores);

// 4. Ensure Superadmin is in pre_whitelist
const whitelistEntry = db.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get('dot71714@gmail.com');
if (!whitelistEntry) {
  db.prepare(`
    INSERT INTO pre_whitelist (email, notes, created_at)
    VALUES (?, ?, datetime('now'))
  `).run('dot71714@gmail.com', 'Quản trị viên tối cao & Học viên ưu tiên');
  console.log('✅ Added dot71714@gmail.com to pre_whitelist');
}

// 5. Display current database status
const allUsers = db.prepare('SELECT id, email, name, status, approved_at FROM users').all();
const allWhitelist = db.prepare('SELECT id, email, notes FROM pre_whitelist').all();
console.log('\n📊 CURRENT USERS IN DATABASE:');
console.table(allUsers);
console.log('\n📋 CURRENT PRE-WHITELIST:');
console.table(allWhitelist);
