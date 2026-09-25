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
  password_hash?: string | null;
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
  exam_scores: string; // JSON
  topic_practice_history: string; // JSON
  section_progress: string; // JSON
  study_progress: string; // JSON
  streak_flame: number;
  diamonds: number;
  updated_at: string;
}

// Global declaration for singleton across hot-reloading in dev
declare global {
  // eslint-disable-next-line no-var
  var __ta12_db: DatabaseType | undefined;
}

function initDatabase(): DatabaseType {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  let dbDir = path.resolve(process.cwd(), 'data');
  let dbPath = path.join(dbDir, 'ta12_users.sqlite');

  if (isVercel) {
    const tmpPath = '/tmp/ta12_users.sqlite';
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(dbPath)) {
        try {
          fs.copyFileSync(dbPath, tmpPath);
        } catch {
          // fallback
        }
      }
    }
    dbPath = tmpPath;
  } else {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  const db = new Database(dbPath);

  // WAL mode and concurrency configuration
  db.pragma('journal_mode = WAL;');
  db.pragma('busy_timeout = 5000;');
  db.pragma('synchronous = NORMAL;');
  db.pragma('foreign_keys = ON;');

  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name TEXT NOT NULL,
      avatar_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      password_hash TEXT,
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

  // Migrate password_hash column if upgrading from earlier schema
  try {
    db.exec(`ALTER TABLE users ADD COLUMN password_hash TEXT;`);
  } catch {
    // Column already exists
  }

  // Seed default personas if not exists
  seedDefaultPersonas(db);

  return db;
}

function seedDefaultPersonas(db: DatabaseType) {
  // 1. Approved Student Persona: Đỗ Tuấn
  const doTuan = db.prepare('SELECT id FROM users WHERE id = ?').get('usr_dotuan_demo');
  if (!doTuan) {
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, 'approved', datetime('now'), datetime('now'), datetime('now'))
    `).run(
      'usr_dotuan_demo',
      'mock_google_dotuan',
      'dotuan.student@ta12.edu.vn',
      'Đỗ Tuấn',
      null
    );

    db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
      VALUES (?, '{}', '{}', '{}', '{}', 3, 50, datetime('now'))
    `).run('usr_dotuan_demo');
  }

  // 2. Pending Student Persona: Nguyễn Văn An
  const pendingAn = db.prepare('SELECT id FROM users WHERE id = ?').get('usr_pending_demo');
  if (!pendingAn) {
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NULL, datetime('now'), datetime('now'))
    `).run(
      'usr_pending_demo',
      'mock_google_pending',
      'pending.student@ta12.edu.vn',
      'Nguyễn Văn An',
      null
    );

    db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
      VALUES (?, '{}', '{}', '{}', '{}', 0, 0, datetime('now'))
    `).run('usr_pending_demo');
  }

  // 3. Pre-whitelist Entry: vip.student@ta12.edu.vn
  const vipEntry = db.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get('vip.student@ta12.edu.vn');
  if (!vipEntry) {
    db.prepare(`
      INSERT INTO pre_whitelist (email, notes, created_at)
      VALUES (?, ?, datetime('now'))
    `).run('vip.student@ta12.edu.vn', 'Học sinh lớp chọn - Tự động duyệt ngay khi đăng nhập');
  }

  // 4. Superadmin Pre-whitelist & Account: dot71714@gmail.com
  const adminEntry = db.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get('dot71714@gmail.com');
  if (!adminEntry) {
    db.prepare(`
      INSERT INTO pre_whitelist (email, notes, created_at)
      VALUES (?, ?, datetime('now'))
    `).run('dot71714@gmail.com', 'Superadmin - Tự động kích hoạt đặc quyền');
  }

  const adminUser = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get('dot71714@gmail.com');
  if (!adminUser) {
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, 'approved', datetime('now'), datetime('now'), datetime('now'))
    `).run('usr_admin_dot71714', 'mock_google_dot71714', 'dot71714@gmail.com', 'Admin Tuấn Anh', null);

    db.prepare(`
      INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
      VALUES (?, '{}', '{}', '{}', '{}', 10, 500, datetime('now'))
    `).run('usr_admin_dot71714');
  }
}

export function getDb(): DatabaseType {
  if (process.env.NODE_ENV === 'production') {
    if (!globalThis.__ta12_db) {
      globalThis.__ta12_db = initDatabase();
    }
    return globalThis.__ta12_db;
  } else {
    if (!globalThis.__ta12_db) {
      globalThis.__ta12_db = initDatabase();
    }
    return globalThis.__ta12_db;
  }
}

export const getDatabase = getDb;

// Helper methods
export function getUserById(id: string): User | undefined {
  const db = getDb();
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  if (!user && id && id.startsWith('usr_local_')) {
    try {
      const hex = id.slice(10);
      const email = Buffer.from(hex, 'hex').toString('utf8');
      if (email && email.includes('@')) {
        const whitelisted = isEmailWhitelisted(email);
        const status = whitelisted ? 'approved' : 'pending';
        const defaultName = email.split('@')[0];
        db.prepare(`
          INSERT OR IGNORE INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
          VALUES (?, ?, ?, ?, NULL, ?, ?, datetime('now'), datetime('now'))
        `).run(id, `local_${hex}`, email, defaultName, status, whitelisted ? new Date().toISOString() : null);

        db.prepare(`
          INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
          VALUES (?, '{}', '{}', '{}', '{}', 0, 0, datetime('now'))
        `).run(id);

        user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
      }
    } catch {
      // safe fallback
    }
  }
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email) as User | undefined;
}

export function getUserByGoogleId(googleId: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as User | undefined;
}

export function isEmailWhitelisted(email: string): boolean {
  const db = getDb();
  const hit = db.prepare('SELECT 1 FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get(email.trim());
  return Boolean(hit);
}

export function upsertGoogleUser(profile: {
  google_id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
}): { user: User; isNew: boolean } {
  const db = getDb();
  const normalizedEmail = profile.email.trim().toLowerCase();

  const existing = (db.prepare(
    'SELECT * FROM users WHERE google_id = ? OR email = ? COLLATE NOCASE'
  ).get(profile.google_id, normalizedEmail)) as User | undefined;

  const whitelisted = isEmailWhitelisted(normalizedEmail);

  if (existing) {
    // If existing user is already approved, maintain approved status.
    // If pending and newly whitelisted, update to approved!
    let newStatus = existing.status;
    let approvedAt = existing.approved_at;
    if (existing.status === 'pending' && whitelisted) {
      newStatus = 'approved';
      approvedAt = new Date().toISOString();
    }

    db.prepare(`
      UPDATE users SET
        name = ?,
        avatar_url = COALESCE(?, avatar_url),
        status = ?,
        approved_at = ?,
        last_login_at = datetime('now')
      WHERE id = ?
    `).run(profile.name, profile.avatar_url || null, newStatus, approvedAt, existing.id);

    const updated = getUserById(existing.id)!;
    return { user: updated, isNew: false };
  }

  // Create new user
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const status: 'approved' | 'pending' = whitelisted ? 'approved' : 'pending';
  const approvedAt = whitelisted ? new Date().toISOString() : null;

  db.prepare(`
    INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    newId,
    profile.google_id,
    normalizedEmail,
    profile.name,
    profile.avatar_url || null,
    status,
    approvedAt
  );

  // Initialize user_progress
  db.prepare(`
    INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
    VALUES (?, '{}', '{}', '{}', '{}', 0, 0, datetime('now'))
  `).run(newId);

  const newUser = getUserById(newId)!;
  return { user: newUser, isNew: true };
}

export function getUserProgress(userId: string): UserProgress | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(userId) as UserProgress | undefined;
}

export function saveUserProgress(
  userId: string,
  progress: {
    exam_scores?: string;
    topic_practice_history?: string;
    section_progress?: string;
    study_progress?: string;
    streak_flame?: number;
    diamonds?: number;
  }
): void {
  const db = getDb();
  const existing = getUserProgress(userId);

  if (existing) {
    db.prepare(`
      UPDATE user_progress SET
        exam_scores = COALESCE(?, exam_scores),
        topic_practice_history = COALESCE(?, topic_practice_history),
        section_progress = COALESCE(?, section_progress),
        study_progress = COALESCE(?, study_progress),
        streak_flame = COALESCE(?, streak_flame),
        diamonds = COALESCE(?, diamonds),
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      progress.exam_scores !== undefined ? progress.exam_scores : null,
      progress.topic_practice_history !== undefined ? progress.topic_practice_history : null,
      progress.section_progress !== undefined ? progress.section_progress : null,
      progress.study_progress !== undefined ? progress.study_progress : null,
      progress.streak_flame !== undefined ? progress.streak_flame : null,
      progress.diamonds !== undefined ? progress.diamonds : null,
      userId
    );
  } else {
    db.prepare(`
      INSERT INTO user_progress (
        user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      userId,
      progress.exam_scores || '{}',
      progress.topic_practice_history || '{}',
      progress.section_progress || '{}',
      progress.study_progress || '{}',
      progress.streak_flame || 0,
      progress.diamonds || 0
    );
  }
}

export function updateUserPassword(userId: string, passwordHash: string): void {
  const db = getDb();
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId);
}

export function updateLastLogin(userId: string): void {
  const db = getDb();
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(userId);
}

export function createPasswordUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}): { user: User; isNew: boolean } {
  const db = getDb();
  const normalizedEmail = data.email.trim().toLowerCase();
  const whitelisted = isEmailWhitelisted(normalizedEmail);
  const status: 'approved' | 'pending' = whitelisted ? 'approved' : 'pending';
  const approvedAt = whitelisted ? new Date().toISOString() : null;
  const hex = Buffer.from(normalizedEmail).toString('hex');
  const newId = `usr_local_${hex}`;
  const googleId = `local_${hex}`;

  const existing = (db.prepare('SELECT * FROM users WHERE id = ? OR email = ? COLLATE NOCASE').get(newId, normalizedEmail)) as User | undefined;
  if (existing) {
    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        password_hash = COALESCE(?, password_hash),
        last_login_at = datetime('now')
      WHERE id = ?
    `).run(data.name || null, data.passwordHash || null, existing.id);
    return { user: getUserById(existing.id)!, isNew: false };
  }

  db.prepare(`
    INSERT INTO users (id, google_id, email, name, avatar_url, status, password_hash, approved_at, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    newId,
    googleId,
    normalizedEmail,
    data.name,
    null,
    status,
    data.passwordHash,
    approvedAt
  );

  db.prepare(`
    INSERT OR IGNORE INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
    VALUES (?, '{}', '{}', '{}', '{}', 0, 0, datetime('now'))
  `).run(newId);

  const newUser = getUserById(newId)!;
  return { user: newUser, isNew: true };
}
