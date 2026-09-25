/**
 * Adversarial Empirical Challenge Suite: Requirement R3 (Dedicated Admin Portal)
 *
 * Vectors:
 *  1. 1-Click Status Transitions via PATCH /api/admin/users (approve, revoke, reject, pending)
 *     - Full state machine transition matrix (all permutations)
 *     - Approved timestamp handling (set on approve, cleared on revoke/reject/pending)
 *     - Input validation, error handling, SQL injection resistance
 *     - Idempotency & instant reflection on GET /api/admin/users
 *  2. Auto-Retroactive Promotion when Pre-Whitelisting an Email
 *     - Pending accounts promoted automatically on whitelist insert
 *     - Case-insensitivity (uppercase in user vs lowercase in whitelist, and vice-versa)
 *     - Whitespace trimming on whitelist emails
 *     - Respects autoApprovePending flag (false leaves pending untouched)
 *     - Rejected accounts protected from accidental auto-promotion
 *     - Multi-account batch auto-retroactive promotion
 *  3. Pre-Whitelist Case-Insensitivity & Batch Email Addition
 *     - Normalization to lowercase in SQLite
 *     - Conflict handling / upsert (ON CONFLICT update notes)
 *     - Batch email array with valid, invalid, duplicate, and mixed-case emails
 *     - Empty / invalid batch error handling (HTTP 400)
 *     - Case-insensitive deletion by email & ID
 *  4. Stats API Computation Accuracy against Raw SQLite Counts
 *     - Complete oracle matching between GET /api/admin/stats and raw SQLite queries
 *     - Dynamic mutation verification (pending -> approved, approved -> rejected)
 *     - Progress metrics aggregation (avg_exams_completed, avg_exam_score, active_streaks)
 *  5. Complete Zero-Residue Cleanup Verification
 *     - Baseline comparison before vs after test run
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');
const Module = require('module');
const Database = require('better-sqlite3');

const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');
const DB_PATH = path.join(ROOT_DIR, 'data', 'ta12_users.sqlite');

// -----------------------------------------------------------------------------
// Module Mocking & TypeScript Transpile Hook for Next.js Route Testing
// -----------------------------------------------------------------------------
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/server') {
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map();
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      async json() {
        return this._json !== undefined ? this._json : JSON.parse(this.body);
      }
    }
    class MockNextRequest {
      constructor(input, init = {}) {
        this.url = typeof input === 'string' ? input : input.url;
        this.nextUrl = new URL(this.url);
        this.method = init.method || 'GET';
        this.body = init.body;
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
    }
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'admin/src/');
    return originalRequire.call(this, path.resolve(ROOT_DIR, rel));
  }
  return originalRequire.call(this, request);
};

require.extensions['.tsx'] = function (module, filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/["\x27]use client["\x27];?/g, '');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  module._compile(transpiled.outputText, filename);
};
require.extensions['.ts'] = require.extensions['.tsx'];

// -----------------------------------------------------------------------------
// Test Harness
// -----------------------------------------------------------------------------
let totalTests = 0;
let passedTests = 0;
const failures = [];

function check(desc, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } else {
    failures.push({ desc, details });
    console.error(`  ❌ ${desc} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runAdversarialM3AdminChallenge() {
  console.log('========================================================================');
  console.log('⚔️ EMPIRICAL CHALLENGER: ADVERSARIAL TEST SUITE FOR REQUIREMENT R3');
  console.log('========================================================================\n');

  // Load Admin DB & APIs
  const adminDbModule = require(path.join(ADMIN_DIR, 'src', 'lib', 'db.ts'));
  const statsApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'));
  const usersApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'users', 'route.ts'));
  const whitelistApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'whitelist', 'route.ts'));

  const { NextRequest } = require('next/server');
  const db = adminDbModule.getDatabase();

  // Snapshot initial row counts for Zero Residue verification
  const initialUserCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const initialWhitelistCount = db.prepare('SELECT COUNT(*) as count FROM pre_whitelist').get().count;
  const initialProgressCount = db.prepare('SELECT COUNT(*) as count FROM user_progress').get().count;

  console.log(`[Baseline Snapshot] Users: ${initialUserCount}, Whitelist: ${initialWhitelistCount}, Progress: ${initialProgressCount}`);

  const testUserIds = [];
  const testWhitelistEmails = [];

  try {
    // -------------------------------------------------------------------------
    // VECTOR 1: 1-Click Status Transitions via PATCH /api/admin/users
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 1: 1-Click Status Transitions via PATCH /api/admin/users...');

    const testU1 = `usr_adv_test_trans_${Date.now()}_1`;
    testUserIds.push(testU1);
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Học Sinh Chuyển Trạng Thái', 'pending', datetime('now'), datetime('now'))
    `).run(testU1, `google_${testU1}`, `${testU1}@adv.test`);

    // 1.1 Transition: pending -> approve
    let req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'approve' },
    });
    let res = await usersApi.PATCH(req);
    let body = await res.json();
    check('PATCH action=approve succeeds (HTTP 200)', res.status === 200 && body.success === true);
    check('Body returns status "approved"', body.user?.status === 'approved');
    check('Body returns non-null approved_at', Boolean(body.user?.approved_at));

    let row = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU1);
    check('SQLite verify: status is "approved"', row.status === 'approved');
    check('SQLite verify: approved_at is NOT NULL', Boolean(row.approved_at));

    // 1.2 Transition: approved -> revoke (sets status='rejected', approved_at=NULL)
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'revoke' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=revoke succeeds (HTTP 200)', res.status === 200 && body.success === true);
    check('Body returns status "rejected"', body.user?.status === 'rejected');
    check('Body returns null approved_at', body.user?.approved_at === null);

    row = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU1);
    check('SQLite verify: status is "rejected"', row.status === 'rejected');
    check('SQLite verify: approved_at is cleared to NULL on revoke', row.approved_at === null);

    // 1.3 Transition: rejected -> approve (reactivate)
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'approve' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=approve reactivates rejected user', res.status === 200 && body.user?.status === 'approved');
    row = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU1);
    check('SQLite verify: reactivated user is approved with timestamp', row.status === 'approved' && Boolean(row.approved_at));

    // 1.4 Transition: approved -> reject
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'reject' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=reject succeeds', res.status === 200 && body.user?.status === 'rejected');
    row = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU1);
    check('SQLite verify: status is "rejected" and approved_at is NULL', row.status === 'rejected' && row.approved_at === null);

    // 1.5 Transition: rejected -> pending
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'pending' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=pending resets rejected user to "pending"', res.status === 200 && body.user?.status === 'pending');
    row = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU1);
    check('SQLite verify: status is "pending" and approved_at is NULL', row.status === 'pending' && row.approved_at === null);

    // 1.6 Transition: pending -> reject
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'reject' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=reject directly rejects pending user', res.status === 200 && body.user?.status === 'rejected');

    // 1.7 Transition: pending -> pending (idempotency)
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'pending' },
    });
    await usersApi.PATCH(req);
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'pending' },
    });
    res = await usersApi.PATCH(req);
    body = await res.json();
    check('PATCH action=pending is idempotent when already pending', res.status === 200 && body.user?.status === 'pending');

    // 1.8 Invalid actions & Error Handling
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: 'delete' },
    });
    res = await usersApi.PATCH(req);
    check('Unsupported action "delete" rejected with HTTP 400', res.status === 400);

    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: testU1, action: '' },
    });
    res = await usersApi.PATCH(req);
    check('Empty action rejected with HTTP 400', res.status === 400);

    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { action: 'approve' },
    });
    res = await usersApi.PATCH(req);
    check('Missing userId rejected with HTTP 400', res.status === 400);

    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: 'usr_non_existent_random_id', action: 'approve' },
    });
    res = await usersApi.PATCH(req);
    check('Non-existent userId returns HTTP 404', res.status === 404);

    // 1.9 SQL Injection safety in userId
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: "'; DROP TABLE users; --", action: 'approve' },
    });
    res = await usersApi.PATCH(req);
    check('SQL injection attempt in userId handled safely (HTTP 404)', res.status === 404);
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    check('Users table integrity intact after SQL injection attack', Boolean(tableCheck));

    // -------------------------------------------------------------------------
    // VECTOR 2: Auto-Retroactive Promotion when Pre-Whitelisting
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 2: Auto-Retroactive Promotion when Pre-Whitelisting...');

    // 2.1 Mixed-case user email auto-promoted by lowercase whitelist entry
    const testU2 = `usr_adv_test_retro_${Date.now()}_2`;
    const emailUpperInUser = `Test.Student.CAPS_${Date.now()}@AdvTa12.Com`;
    testUserIds.push(testU2);
    testWhitelistEmails.push(emailUpperInUser.toLowerCase());

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Học Sinh Viết Hoa', 'pending', datetime('now'), datetime('now'))
    `).run(testU2, `google_${testU2}`, emailUpperInUser);

    let userInDb = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU2);
    check('Precondition: user account starts with status="pending"', userInDb.status === 'pending' && userInDb.approved_at === null);

    // Whitelist added with lowercase
    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: {
        email: emailUpperInUser.toLowerCase(),
        notes: 'Retroactive test uppercase user',
        autoApprovePending: true,
      },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('POST /api/admin/whitelist reports autoApproved=true', res.status === 200 && body.autoApproved === true);

    userInDb = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU2);
    check('Retroactive Promotion: user in SQLite automatically upgraded to "approved"', userInDb.status === 'approved');
    check('Retroactive Promotion: approved_at timestamp populated in SQLite', Boolean(userInDb.approved_at));

    // 2.2 Lowercase user email auto-promoted by UPPERCASE whitelist input
    const testU3 = `usr_adv_test_retro_${Date.now()}_3`;
    const emailLowerInUser = `lowercase.student.${Date.now()}@advta12.com`;
    testUserIds.push(testU3);
    testWhitelistEmails.push(emailLowerInUser);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Học Sinh Viết Thường', 'pending', datetime('now'), datetime('now'))
    `).run(testU3, `google_${testU3}`, emailLowerInUser);

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: {
        email: `   ${emailLowerInUser.toUpperCase()}   `, // UPPERCASE + surrounding whitespace
        notes: 'Retroactive test uppercase whitelist',
        autoApprovePending: true,
      },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('POST with uppercase & padded whitelist email succeeds', res.status === 200 && body.autoApproved === true);

    userInDb = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(testU3);
    check('User with lowercase email promoted when whitelist input was UPPERCASE', userInDb.status === 'approved');

    // 2.3 Respect autoApprovePending = false
    const testU4 = `usr_adv_test_retro_${Date.now()}_4`;
    const emailNoAuto = `noauto.student.${Date.now()}@advta12.com`;
    testUserIds.push(testU4);
    testWhitelistEmails.push(emailNoAuto);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Học Sinh Không Tự Duyệt', 'pending', datetime('now'), datetime('now'))
    `).run(testU4, `google_${testU4}`, emailNoAuto);

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: {
        email: emailNoAuto,
        notes: 'Do not auto approve',
        autoApprovePending: false,
      },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('POST with autoApprovePending=false succeeds with autoApproved=false', res.status === 200 && body.autoApproved === false);

    userInDb = db.prepare('SELECT status FROM users WHERE id = ?').get(testU4);
    check('Pending user remains "pending" when autoApprovePending=false', userInDb.status === 'pending');

    // 2.4 Rejected accounts are NOT accidentally promoted
    const testU5 = `usr_adv_test_retro_${Date.now()}_5`;
    const emailRejected = `rejected.student.${Date.now()}@advta12.com`;
    testUserIds.push(testU5);
    testWhitelistEmails.push(emailRejected);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Học Sinh Bị Từ Chối', 'rejected', datetime('now'), datetime('now'))
    `).run(testU5, `google_${testU5}`, emailRejected);

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: {
        email: emailRejected,
        notes: 'Pre-whitelist rejected user',
        autoApprovePending: true,
      },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('POST for rejected account returns autoApproved=false', body.autoApproved === false);

    userInDb = db.prepare('SELECT status FROM users WHERE id = ?').get(testU5);
    check('Rejected user status stays "rejected" (never auto-promoted)', userInDb.status === 'rejected');

    // 2.5 Multi-account batch auto-retroactive promotion
    const batchPromoIds = [];
    const batchPromoEmails = [];
    for (let i = 1; i <= 3; i++) {
      const bId = `usr_adv_batch_promo_${Date.now()}_${i}`;
      const bEmail = `batch.promo.${i}.${Date.now()}@advta12.com`;
      batchPromoIds.push(bId);
      batchPromoEmails.push(bEmail);
      testUserIds.push(bId);
      testWhitelistEmails.push(bEmail);

      db.prepare(`
        INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
        VALUES (?, ?, ?, 'Batch Promo Student', 'pending', datetime('now'), datetime('now'))
      `).run(bId, `google_${bId}`, bEmail);
    }

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: {
        emails: batchPromoEmails,
        notes: 'Multi-account batch auto-approval test',
        autoApprovePending: true,
      },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('Batch POST reports autoApproved=true', res.status === 200 && body.autoApproved === true);

    const promotedCount = db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE id IN (?, ?, ?) AND status = 'approved'
    `).get(...batchPromoIds).count;
    check('All 3 batch pending users simultaneously promoted to "approved"', promotedCount === 3);

    // -------------------------------------------------------------------------
    // VECTOR 3: Pre-Whitelist Case-Insensitivity & Batch Email Addition
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 3: Pre-Whitelist Case-Insensitivity & Batch Email Addition...');

    // 3.1 Normalization and conflict handling (upsert updates notes)
    const conflictEmail = `conflict.test.${Date.now()}@advta12.com`;
    testWhitelistEmails.push(conflictEmail);

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { email: conflictEmail.toLowerCase(), notes: 'Initial note' },
    });
    await whitelistApi.POST(req);

    // Insert again with uppercase email and updated note
    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { email: conflictEmail.toUpperCase(), notes: 'Updated adversarial note' },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('Upserting existing email in different case succeeds without duplicate key error', res.status === 200);

    const wlEntries = db.prepare('SELECT * FROM pre_whitelist WHERE email = ? COLLATE NOCASE').all(conflictEmail);
    check('Exactly 1 record exists in pre_whitelist (no duplicates created)', wlEntries.length === 1);
    check('Notes updated to "Updated adversarial note"', wlEntries[0].notes === 'Updated adversarial note');

    // 3.2 Batch array with mixed valid, invalid, duplicate, and whitespace emails
    const validEmail1 = `batch.valid1.${Date.now()}@advta12.com`;
    const validEmail2 = `batch.valid2.${Date.now()}@advta12.com`;
    const validEmail3 = `batch.valid3.${Date.now()}@advta12.com`;
    testWhitelistEmails.push(validEmail1, validEmail2, validEmail3);

    const mixedBatchInput = [
      validEmail1.toUpperCase(),
      `   ${validEmail2}   `,
      validEmail1, // Duplicate within same batch
      'invalid-email-without-at',
      'invalid@withoutdot',
      '',
      '     ',
      validEmail3,
    ];

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { emails: mixedBatchInput, notes: 'Fuzzing batch insert' },
    });
    res = await whitelistApi.POST(req);
    body = await res.json();
    check('Mixed batch with invalid/duplicate strings processed successfully', res.status === 200 && body.success === true);

    const stored1 = db.prepare('SELECT email FROM pre_whitelist WHERE email = ?').get(validEmail1.toLowerCase());
    const stored2 = db.prepare('SELECT email FROM pre_whitelist WHERE email = ?').get(validEmail2.toLowerCase());
    const stored3 = db.prepare('SELECT email FROM pre_whitelist WHERE email = ?').get(validEmail3.toLowerCase());
    check('Valid email 1 stored in lowercase', Boolean(stored1));
    check('Valid email 2 trimmed and stored', Boolean(stored2));
    check('Valid email 3 stored', Boolean(stored3));

    const invalidCheck = db.prepare("SELECT 1 FROM pre_whitelist WHERE email LIKE '%invalid%'").get();
    check('Invalid emails were rejected and not inserted', !invalidCheck);

    // 3.3 All-invalid batch returns HTTP 400
    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { emails: ['notanemail', 'stillnot@nodot', '   '] },
    });
    res = await whitelistApi.POST(req);
    check('All-invalid batch returns HTTP 400', res.status === 400);

    // 3.4 Case-insensitive deletion by email
    req = new NextRequest(`http://localhost:3001/api/admin/whitelist?email=${encodeURIComponent(validEmail1.toUpperCase())}`, {
      method: 'DELETE',
    });
    res = await whitelistApi.DELETE(req);
    body = await res.json();
    check('DELETE /api/admin/whitelist with UPPERCASE query param succeeds', res.status === 200 && body.success === true);
    const postDel = db.prepare('SELECT 1 FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get(validEmail1);
    check('Email deleted from SQLite regardless of query case', !postDel);

    // 3.5 Deletion by ID
    const entryToDelete = db.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get(validEmail2);
    req = new NextRequest(`http://localhost:3001/api/admin/whitelist?id=${entryToDelete.id}`, {
      method: 'DELETE',
    });
    res = await whitelistApi.DELETE(req);
    body = await res.json();
    check('DELETE /api/admin/whitelist by id succeeds', res.status === 200 && body.success === true);
    const postDelId = db.prepare('SELECT 1 FROM pre_whitelist WHERE id = ?').get(entryToDelete.id);
    check('Record removed from SQLite by id', !postDelId);

    // -------------------------------------------------------------------------
    // VECTOR 4: Stats API Computation Accuracy against Raw SQLite Counts
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 4: Stats API Computation Accuracy against Raw SQLite Counts...');

    // 4.1 Oracle check against raw SQLite on current database state
    res = await statsApi.GET();
    body = await res.json();
    check('GET /api/admin/stats returns HTTP 200', res.status === 200 && body.success === true);

    const stats = body.stats;
    const rawCounts = db.prepare(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM users
    `).get();

    const rawWlCount = db.prepare('SELECT COUNT(*) as count FROM pre_whitelist').get().count;
    const rawActiveStreaks = db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE streak_flame > 0').get().count;

    check('Oracle match: stats.total_users == SQLite COUNT(*)', stats.total_users === rawCounts.total_users);
    check('Oracle match: stats.approved_count == SQLite approved', stats.approved_count === rawCounts.approved_count);
    check('Oracle match: stats.pending_count == SQLite pending', stats.pending_count === rawCounts.pending_count);
    check('Oracle match: stats.rejected_count == SQLite rejected', stats.rejected_count === rawCounts.rejected_count);
    check('Oracle match: stats.whitelist_count == SQLite pre_whitelist count', stats.whitelist_count === rawWlCount);
    check('Oracle match: stats.active_streaks_count == SQLite streak > 0', stats.active_streaks_count === rawActiveStreaks);

    // 4.2 Dynamic calculation: add controlled test users & scores, verify formulas
    const statsUser1 = `usr_adv_stats_${Date.now()}_1`;
    const statsUser2 = `usr_adv_stats_${Date.now()}_2`;
    testUserIds.push(statsUser1, statsUser2);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, approved_at, last_login_at)
      VALUES (?, ?, ?, 'Stats Test User 1', 'approved', datetime('now'), datetime('now'), datetime('now'))
    `).run(statsUser1, `google_${statsUser1}`, `${statsUser1}@adv.test`);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, approved_at, last_login_at)
      VALUES (?, ?, ?, 'Stats Test User 2', 'pending', datetime('now'), NULL, datetime('now'))
    `).run(statsUser2, `google_${statsUser2}`, `${statsUser2}@adv.test`);

    // Add user_progress with scores
    const examScores1 = JSON.stringify({
      exam_101: { score: 9.0, completed_at: '2026-09-25T01:00:00Z' },
      exam_102: { score: 7.0, completed_at: '2026-09-25T02:00:00Z' },
    });
    db.prepare(`
      INSERT INTO user_progress (user_id, exam_scores, streak_flame, diamonds, updated_at)
      VALUES (?, ?, 5, 100, datetime('now'))
    `).run(statsUser1, examScores1);

    // Re-query stats
    res = await statsApi.GET();
    body = await res.json();
    const newStats = body.stats;

    check('Dynamic Stats: total_users incremented by exactly 2', newStats.total_users === stats.total_users + 2);
    check('Dynamic Stats: approved_count incremented by 1', newStats.approved_count === stats.approved_count + 1);
    check('Dynamic Stats: pending_count incremented by 1', newStats.pending_count === stats.pending_count + 1);
    check('Dynamic Stats: active_streaks_count incremented by 1 (streak=5)', newStats.active_streaks_count === stats.active_streaks_count + 1);
    check('Dynamic Stats: avg_exam_score is a valid positive number', typeof newStats.avg_exam_score === 'number' && newStats.avg_exam_score > 0);
    check('Dynamic Stats: avg_exams_completed is a valid positive number', typeof newStats.avg_exams_completed === 'number' && newStats.avg_exams_completed > 0);

    // 4.3 Mutate status via PATCH and verify stats reflect the transition immediately
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: statsUser2, action: 'approve' },
    });
    await usersApi.PATCH(req);

    res = await statsApi.GET();
    body = await res.json();
    const mutatedStats = body.stats;

    check('Mutating user to approved immediately updates stats.approved_count (+1)', mutatedStats.approved_count === newStats.approved_count + 1);
    check('Mutating user to approved immediately updates stats.pending_count (-1)', mutatedStats.pending_count === newStats.pending_count - 1);
    check('Total users remains unchanged during status transition', mutatedStats.total_users === newStats.total_users);

    // -------------------------------------------------------------------------
    // VECTOR 5: Malformed Payload & Boundary Resilience
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 5: Malformed Payload & Boundary Resilience...');

    // 5.1 Corrupted JSON in user_progress.exam_scores
    const corruptUser = `usr_adv_corrupt_${Date.now()}`;
    testUserIds.push(corruptUser);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, approved_at, last_login_at)
      VALUES (?, ?, ?, 'Corrupt Data User', 'approved', datetime('now'), datetime('now'), datetime('now'))
    `).run(corruptUser, `google_${corruptUser}`, `${corruptUser}@adv.test`);

    db.prepare(`
      INSERT INTO user_progress (user_id, exam_scores, streak_flame, diamonds, updated_at)
      VALUES (?, '{ invalid json structure !!!', 2, 10, datetime('now'))
    `).run(corruptUser);

    // Call stats API - should NOT throw or 500
    res = await statsApi.GET();
    body = await res.json();
    check('Stats API handles corrupt JSON in exam_scores without crashing (HTTP 200)', res.status === 200 && body.success === true);

    // Call users API - should NOT throw or 500
    req = new NextRequest(`http://localhost:3001/api/admin/users?search=${corruptUser}`);
    res = await usersApi.GET(req);
    body = await res.json();
    check('Users API handles corrupt JSON in exam_scores without crashing (HTTP 200)', res.status === 200 && body.success === true);
    const foundCorrupt = body.users?.find(u => u.id === corruptUser);
    check('Users API defaults corrupt exams_completed to 0', foundCorrupt?.progress?.exams_completed === 0);

    // 5.2 Large batch whitelist addition (50 emails in one request)
    const largeBatchEmails = [];
    for (let i = 0; i < 50; i++) {
      const e = `large.batch.${i}.${Date.now()}@advta12.com`;
      largeBatchEmails.push(e);
      testWhitelistEmails.push(e);
    }
    const tStart = Date.now();
    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { emails: largeBatchEmails, notes: '50-item large batch test' },
    });
    res = await whitelistApi.POST(req);
    const duration = Date.now() - tStart;
    body = await res.json();
    check('Large batch (50 emails) successfully processed in < 1500ms', res.status === 200 && body.success === true && duration < 1500, `duration: ${duration}ms`);

    const insertedLargeCount = db.prepare(`
      SELECT COUNT(*) as count FROM pre_whitelist WHERE notes = '50-item large batch test'
    `).get().count;
    check('All 50 large batch entries persisted in SQLite', insertedLargeCount === 50);

    // -------------------------------------------------------------------------
    // VECTOR 6: Multi-Request Status Transition Concurrency & Race Conditions
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 6: Multi-Request Status Transition Concurrency...');

    const raceUser = `usr_adv_race_${Date.now()}`;
    testUserIds.push(raceUser);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Race Condition User', 'pending', datetime('now'), datetime('now'))
    `).run(raceUser, `google_${raceUser}`, `${raceUser}@adv.test`);

    const actions = ['approve', 'reject', 'pending', 'approve', 'revoke', 'approve', 'pending', 'approve'];
    let raceErrors = 0;

    await Promise.all(
      actions.map(action =>
        usersApi.PATCH(
          new NextRequest('http://localhost:3001/api/admin/users', {
            method: 'PATCH',
            body: { userId: raceUser, action },
          })
        ).catch(() => {
          raceErrors++;
        })
      )
    );

    check('Concurrent status transitions on same user execute without crash', raceErrors === 0);
    const finalRaceState = db.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(raceUser);
    check('User ends up in a valid status state', ['approved', 'rejected', 'pending'].includes(finalRaceState.status));
    if (finalRaceState.status === 'approved') {
      check('If approved, approved_at is NOT NULL', Boolean(finalRaceState.approved_at));
    } else {
      check('If not approved, approved_at is NULL', finalRaceState.approved_at === null);
    }

    // -------------------------------------------------------------------------
    // VECTOR 7: Cross-App Database Synchronization (Student <-> Admin)
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 7: Cross-App Database Synchronization...');

    const studentDbModule = require(path.join(ROOT_DIR, 'src', 'lib', 'db.ts'));
    const syncUser = `usr_adv_sync_${Date.now()}`;
    testUserIds.push(syncUser);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
      VALUES (?, ?, ?, 'Sync Verification User', 'pending', datetime('now'), datetime('now'))
    `).run(syncUser, `google_${syncUser}`, `${syncUser}@adv.test`);

    // Student perspective sees pending
    let studentView = studentDbModule.getUserById(syncUser);
    check('Student app sees user as pending', studentView?.status === 'pending');

    // Admin 1-click approves
    req = new NextRequest('http://localhost:3001/api/admin/users', {
      method: 'PATCH',
      body: { userId: syncUser, action: 'approve' },
    });
    await usersApi.PATCH(req);

    // Student perspective immediately sees approved
    studentView = studentDbModule.getUserById(syncUser);
    check('Student app immediately observes "approved" status from SQLite', studentView?.status === 'approved');

    // Admin adds email to whitelist
    const syncWlEmail = `sync.wl.${Date.now()}@advta12.com`;
    testWhitelistEmails.push(syncWlEmail);

    req = new NextRequest('http://localhost:3001/api/admin/whitelist', {
      method: 'POST',
      body: { email: syncWlEmail, notes: 'Sync whitelist test' },
    });
    await whitelistApi.POST(req);

    // Student app isEmailWhitelisted checks
    const isWlFromStudent = studentDbModule.isEmailWhitelisted(syncWlEmail.toUpperCase());
    check('Student app verifies email is whitelisted (case-insensitive)', isWlFromStudent === true);

  } finally {
    // -------------------------------------------------------------------------
    // VECTOR 8: Complete Zero-Residue Cleanup Verification
    // -------------------------------------------------------------------------
    console.log('\n▶ Vector 8: Complete Zero-Residue Cleanup Verification...');

    // Delete all created test users
    for (const uid of testUserIds) {
      db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(uid);
      db.prepare('DELETE FROM users WHERE id = ?').run(uid);
    }

    // Delete all created whitelist test entries
    for (const email of testWhitelistEmails) {
      db.prepare('DELETE FROM pre_whitelist WHERE email = ? COLLATE NOCASE').run(email);
    }

    // Safety sweep for any lingering adv test records
    db.prepare("DELETE FROM user_progress WHERE user_id LIKE '%usr_adv_%'").run();
    db.prepare("DELETE FROM users WHERE id LIKE '%usr_adv_%' OR email LIKE '%@adv%'").run();
    db.prepare("DELETE FROM pre_whitelist WHERE email LIKE '%@adv%' OR notes LIKE '%adversarial%' OR notes LIKE '%Retroactive test%' OR notes LIKE '%batch%'").run();

    const finalUserCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const finalWhitelistCount = db.prepare('SELECT COUNT(*) as count FROM pre_whitelist').get().count;
    const finalProgressCount = db.prepare('SELECT COUNT(*) as count FROM user_progress').get().count;

    console.log(`[Final Snapshot] Users: ${finalUserCount}, Whitelist: ${finalWhitelistCount}, Progress: ${finalProgressCount}`);

    check('Zero residue: Users count matches initial baseline exactly', finalUserCount === initialUserCount, `was ${initialUserCount}, now ${finalUserCount}`);
    check('Zero residue: Whitelist count matches initial baseline exactly', finalWhitelistCount === initialWhitelistCount, `was ${initialWhitelistCount}, now ${finalWhitelistCount}`);
    check('Zero residue: Progress count matches initial baseline exactly', finalProgressCount === initialProgressCount, `was ${initialProgressCount}, now ${finalProgressCount}`);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL CHALLENGER SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  console.log('========================================================================\n');

  if (failures.length > 0) {
    console.error(`❌ ${failures.length} ADVERSARIAL CHALLENGE(S) FAILED:`);
    failures.forEach((f) => console.error(`  - ${f.desc} (${f.details})`));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL CHALLENGES PASSED WITH 100% SUCCESS!');
    console.log('VERDICT: APPROVE\n');
  }
}

runAdversarialM3AdminChallenge().catch((err) => {
  console.error('Fatal error during empirical challenge:', err);
  process.exit(1);
});
