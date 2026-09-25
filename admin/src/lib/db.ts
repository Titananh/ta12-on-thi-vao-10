import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at: string | null;
  last_login_at: string;
}

export interface PreWhitelistEntry {
  id: number;
  email: string;
  created_at: string;
  notes: string | null;
}

export interface UserProgress {
  user_id: string;
  exam_scores: string;
  topic_practice_history: string;
  section_progress: string;
  study_progress: string;
  streak_flame: number;
  diamonds: number;
  updated_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __ta12_admin_db: DatabaseType | undefined;
}

export function getDatabase(): DatabaseType {
  if (global.__ta12_admin_db) {
    return global.__ta12_admin_db;
  }

  const candidatePaths = [
    process.env.TA12_DB_PATH,
    path.resolve(process.cwd(), '..', 'data', 'ta12_users.sqlite'),
    path.resolve(process.cwd(), 'data', 'ta12_users.sqlite'),
    path.resolve('/Users/anh/Documents/Tiếng anh thi vào 10/data/ta12_users.sqlite'),
    path.resolve('/Users/anh/Documents/Tiếng anh thi vào 10/data/ta12_users.sqlite'),
  ].filter(Boolean) as string[];

  let dbPath = candidatePaths[1] || candidatePaths[0];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      dbPath = p;
      break;
    }
  }

  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Critical PRAGMAs for concurrent WAL access
  db.pragma('journal_mode = WAL;');
  db.pragma('synchronous = NORMAL;');
  db.pragma('busy_timeout = 5000;');
  db.pragma('foreign_keys = ON;');

  initSchema(db);

  if (process.env.NODE_ENV !== 'production') {
    global.__ta12_admin_db = db;
  }

  return db;
}

export const getDb = getDatabase;

function initSchema(db: DatabaseType) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name TEXT NOT NULL,
      avatar_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      approved_at TEXT,
      last_login_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pre_whitelist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      user_id TEXT PRIMARY KEY,
      exam_scores TEXT NOT NULL DEFAULT '{}',
      topic_practice_history TEXT NOT NULL DEFAULT '{}',
      section_progress TEXT NOT NULL DEFAULT '{}',
      study_progress TEXT NOT NULL DEFAULT '{}',
      streak_flame INTEGER NOT NULL DEFAULT 0,
      diamonds INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    CREATE INDEX IF NOT EXISTS idx_pre_whitelist_email ON pre_whitelist(email);
  `);

  // Ensure default demo accounts exist
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get('usr_dotuan_demo');
  if (!existingUser) {
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, created_at, approved_at, last_login_at)
      VALUES ('usr_dotuan_demo', 'mock_google_dotuan', 'dotuan.student@ta12.edu.vn', 'Đỗ Tuấn', '/images/avatar_default.png', 'approved', datetime('now'), datetime('now'), datetime('now'))
    `).run();

    db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, streak_flame, diamonds)
      VALUES ('usr_dotuan_demo', 3, 50)
    `).run();
  }

  const existingPending = db.prepare('SELECT id FROM users WHERE id = ?').get('usr_pending_demo');
  if (!existingPending) {
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, created_at, last_login_at)
      VALUES ('usr_pending_demo', 'mock_google_pending', 'pending.student@ta12.edu.vn', 'Nguyễn Văn An', NULL, 'pending', datetime('now'), datetime('now'))
    `).run();
  }

  const existingWhitelist = db.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get('vip.student@ta12.edu.vn');
  if (!existingWhitelist) {
    db.prepare(`
      INSERT INTO pre_whitelist (email, notes)
      VALUES ('vip.student@ta12.edu.vn', 'Học sinh lớp chọn 10A1 - Tự động duyệt ngay')
    `).run();
  }
}
