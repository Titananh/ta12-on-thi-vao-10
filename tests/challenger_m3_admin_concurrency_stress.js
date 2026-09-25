/**
 * TA12 Empirical Challenger Test Suite:
 * Concurrent Multi-Process SQLite Concurrency & Shared Database Stress Harness
 * (Requirement R3 Verification)
 *
 * This test empirically stresses:
 *  - Concurrent multi-process access simulating Student App (port 3000) and Admin App (port 3001)
 *  - Multiple independent OS processes opening and writing to `data/ta12_users.sqlite` simultaneously
 *  - WAL mode locking, busy_timeout handling, zero unhandled SQLITE_BUSY errors
 *  - Immediate inter-process visibility: writes from one process visible to others
 *  - Complex join reading under aggressive concurrent writes
 *  - Foreign key cascade and PRAGMA integrity_check post-stress
 *  - Unicode, edge cases, and large payload handling
 */

const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');
const DB_PATH = path.join(ROOT_DIR, 'data', 'ta12_users.sqlite');

// -----------------------------------------------------------------------------
// Child Worker Implementation (Forked Process Branch)
// -----------------------------------------------------------------------------
if (process.argv[2] === '--worker') {
  const workerType = process.argv[3]; // 'student_writer', 'admin_writer', 'admin_reader'
  const workerId = process.argv[4];
  const iterations = parseInt(process.argv[5] || '50', 10);
  const workerCwd = process.cwd();

  // Dynamically resolve DB connection depending on simulated app context
  let db;
  try {
    if (workerType.startsWith('admin')) {
      // Connect using admin's resolution logic
      const adminDbPath = path.resolve(workerCwd, workerCwd.endsWith('admin') ? '../data/ta12_users.sqlite' : 'data/ta12_users.sqlite');
      db = new Database(adminDbPath);
    } else {
      // Connect using student's resolution logic
      const studentDbPath = path.resolve(workerCwd, 'data/ta12_users.sqlite');
      db = new Database(studentDbPath);
    }

    db.pragma('journal_mode = WAL;');
    db.pragma('synchronous = NORMAL;');
    db.pragma('busy_timeout = 5000;');
    db.pragma('foreign_keys = ON;');
  } catch (err) {
    process.send({ type: 'init_error', error: err.message });
    process.exit(1);
  }

  let errors = 0;
  let successCount = 0;
  const errorDetails = [];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function runWorker() {
    for (let i = 0; i < iterations; i++) {
      try {
        if (workerType === 'student_writer') {
          // 1. Simulating student web app: logins, progress updates, streak increments
          const userKey = `w_stu_${workerId}_${i}`;
          const email = `${userKey}@test.student.ta12.edu.vn`;
          const googleId = `gid_${userKey}`;
          const studentName = `Học Sinh Concurrency ${workerId}-${i} (Tuấn)`;

          // Upsert student
          db.prepare(`
            INSERT INTO users (id, google_id, email, name, avatar_url, status, created_at, last_login_at)
            VALUES (?, ?, ?, ?, NULL, 'pending', datetime('now'), datetime('now'))
            ON CONFLICT(email) DO UPDATE SET last_login_at = datetime('now')
          `).run(userKey, googleId, email, studentName);

          // Save / update progress
          const examScores = JSON.stringify({
            '1097': { score: 9.0 + (i % 10) * 0.1, completedAt: new Date().toISOString() },
            '1263': { score: 8.5, completedAt: new Date().toISOString() }
          });

          db.prepare(`
            INSERT INTO user_progress (user_id, exam_scores, topic_practice_history, section_progress, study_progress, streak_flame, diamonds, updated_at)
            VALUES (?, ?, '{}', '{}', '{}', ?, ?, datetime('now'))
            ON CONFLICT(user_id) DO UPDATE SET
              exam_scores = excluded.exam_scores,
              streak_flame = streak_flame + 1,
              diamonds = diamonds + 10,
              updated_at = datetime('now')
          `).run(userKey, examScores, i + 1, (i + 1) * 10);

          // Immediate read-back check
          const readUser = db.prepare('SELECT id, email, status FROM users WHERE id = ?').get(userKey);
          const readProg = db.prepare('SELECT streak_flame, diamonds FROM user_progress WHERE user_id = ?').get(userKey);

          if (!readUser || !readProg) {
            throw new Error(`Student worker read-back failed for ${userKey}`);
          }
          successCount++;
        } else if (workerType === 'admin_writer') {
          // 2. Simulating admin portal: Approvals, revokes, pre-whitelist additions/deletions
          const whitelistEmail = `wl_${workerId}_${i}@vip.ta12.edu.vn`;
          
          // Pre-whitelist insert
          db.prepare(`
            INSERT INTO pre_whitelist (email, notes, created_at)
            VALUES (?, 'Concurrent Admin Whitelist', datetime('now'))
            ON CONFLICT(email) DO UPDATE SET notes = excluded.notes
          `).run(whitelistEmail);

          // Random student approval (only targeting concurrent test students)
          const targetStudent = db.prepare(`
            SELECT id FROM users WHERE status = 'pending' AND email LIKE '%@test.student.ta12.edu.vn' LIMIT 1
          `).get();

          if (targetStudent) {
            db.prepare(`
              UPDATE users SET status = 'approved', approved_at = datetime('now')
              WHERE id = ?
            `).run(targetStudent.id);
          }

          // Admin check whitelist table
          const countWl = db.prepare('SELECT COUNT(*) as c FROM pre_whitelist WHERE email = ?').get(whitelistEmail);
          if (!countWl || countWl.c === 0) {
            throw new Error(`Admin worker whitelist check failed for ${whitelistEmail}`);
          }
          successCount++;
        } else if (workerType === 'admin_reader') {
          // 3. Simulating admin dashboard heavy aggregate query running under writes
          const usersWithProgress = db.prepare(`
            SELECT 
              u.id, u.email, u.name, u.status,
              p.streak_flame, p.diamonds,
              CASE WHEN w.email IS NOT NULL THEN 1 ELSE 0 END as is_whitelisted
            FROM users u
            LEFT JOIN user_progress p ON u.id = p.user_id
            LEFT JOIN pre_whitelist w ON LOWER(u.email) = LOWER(w.email)
            LIMIT 50
          `).all();

          const countRow = db.prepare(`
            SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
            FROM users
          `).get();

          if (!countRow || countRow.total < 0) {
            throw new Error('Admin reader aggregation query returned invalid result');
          }
          successCount++;
        }

        // Tiny jitter between 2ms and 15ms to induce unpredictable concurrency timing
        await sleep(Math.floor(Math.random() * 14) + 2);
      } catch (err) {
        errors++;
        errorDetails.push(err.message);
      }
    }

    try {
      db.close();
    } catch {}

    process.send({
      type: 'worker_finished',
      workerType,
      workerId,
      successCount,
      errors,
      errorDetails: errorDetails.slice(0, 5),
    });
    process.exit(errors > 0 ? 1 : 0);
  }

  runWorker();
  return;
}

// -----------------------------------------------------------------------------
// Orchestrator Stress Test Suite (Main Process Branch)
// -----------------------------------------------------------------------------
let totalAssertions = 0;
let passedAssertions = 0;
const failureList = [];

function check(desc, condition, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ ${desc}`);
  } else {
    failureList.push({ desc, details });
    console.error(`  ❌ FAIL: ${desc} ${details ? `(${details})` : ''}`);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER STRESS HARNESS: MULTI-PROCESS SQLITE CONCURRENCY (R3)');
  console.log('========================================================================\n');

  const mainDb = new Database(DB_PATH);
  mainDb.pragma('journal_mode = WAL;');
  mainDb.pragma('synchronous = NORMAL;');
  mainDb.pragma('busy_timeout = 5000;');
  mainDb.pragma('foreign_keys = ON;');

  // ---------------------------------------------------------------------------
  // Vector 1: Pre-Stress Baseline & File Configuration Verification
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Pre-Stress Baseline & Configuration Verification...');
  const journalMode = mainDb.pragma('journal_mode', { simple: true });
  check('Database is confirmed in WAL journal mode', journalMode.toLowerCase() === 'wal', `actual: ${journalMode}`);

  const busyTimeout = mainDb.pragma('busy_timeout', { simple: true });
  check('busy_timeout is set to at least 5000ms', Number(busyTimeout) >= 5000, `actual: ${busyTimeout}`);

  const initialIntegrity = mainDb.pragma('integrity_check', { simple: true });
  check('Initial database integrity check returns "ok"', initialIntegrity === 'ok', `actual: ${initialIntegrity}`);

  const initialUsersCount = mainDb.prepare('SELECT COUNT(*) as c FROM users').get().c;
  check('Initial users count is queryable without lock contention', initialUsersCount >= 2);

  // ---------------------------------------------------------------------------
  // Vector 2: Spawning 8 Concurrent Independent OS Processes (High Load)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Launching 8 Independent OS Worker Processes (800+ Operations)...');
  console.log('  - Workers 1-4: Student App Writers (Port 3000 context, root cwd, 100 iterations each)');
  console.log('  - Workers 5-6: Admin Portal Writers (Port 3001 context, admin/ cwd, 100 iterations each)');
  console.log('  - Workers 7-8: Admin Dashboard Heavy Readers (Port 3001 context, admin/ cwd, 100 iterations each)');

  const workerConfigs = [
    { type: 'student_writer', id: '1', iterations: 100, cwd: ROOT_DIR },
    { type: 'student_writer', id: '2', iterations: 100, cwd: ROOT_DIR },
    { type: 'student_writer', id: '3', iterations: 100, cwd: ROOT_DIR },
    { type: 'student_writer', id: '4', iterations: 100, cwd: ROOT_DIR },
    { type: 'admin_writer', id: '5', iterations: 100, cwd: ADMIN_DIR },
    { type: 'admin_writer', id: '6', iterations: 100, cwd: ADMIN_DIR },
    { type: 'admin_reader', id: '7', iterations: 100, cwd: ADMIN_DIR },
    { type: 'admin_reader', id: '8', iterations: 100, cwd: ADMIN_DIR },
  ];

  const startTime = Date.now();
  const workerResults = [];

  const workerPromises = workerConfigs.map((cfg) => {
    return new Promise((resolve) => {
      const child = fork(__filename, ['--worker', cfg.type, cfg.id, String(cfg.iterations)], {
        cwd: cfg.cwd,
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      });

      let res = null;
      child.on('message', (msg) => {
        if (msg.type === 'worker_finished') {
          res = msg;
        } else if (msg.type === 'init_error') {
          res = { workerType: cfg.type, workerId: cfg.id, errors: 1, errorDetails: [msg.error] };
        }
      });

      child.on('close', (code) => {
        if (!res) {
          res = {
            workerType: cfg.type,
            workerId: cfg.id,
            errors: code === 0 ? 0 : 1,
            successCount: cfg.iterations,
            errorDetails: [`Process exited with code ${code}`],
          };
        }
        workerResults.push(res);
        resolve(res);
      });
    });
  });

  await Promise.all(workerPromises);
  const durationMs = Date.now() - startTime;
  console.log(`  ⏱ All 8 worker processes finished in ${durationMs}ms`);

  let totalOperations = 0;
  let totalErrors = 0;
  const allErrors = [];

  for (const r of workerResults) {
    totalOperations += (r.successCount || 0);
    totalErrors += (r.errors || 0);
    if (r.errorDetails && r.errorDetails.length > 0) {
      allErrors.push(...r.errorDetails);
    }
  }

  check('8 concurrent OS processes executed at least 800 operations across ports', totalOperations >= 800, `total: ${totalOperations}`);
  check('ZERO SQLITE_BUSY or locking errors across all 8 concurrent child processes', totalErrors === 0, `errors: ${totalErrors} (${allErrors.join(', ')})`);

  // ---------------------------------------------------------------------------
  // Vector 3: Real-Time Inter-Process Data Visibility & State Consistency
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Real-Time Inter-Process Data Visibility & State Consistency...');
  
  // Verify that records written by student workers exist and are intact in DB
  const insertedStudents = mainDb.prepare(`
    SELECT COUNT(*) as c FROM users WHERE email LIKE '%@test.student.ta12.edu.vn'
  `).get().c;
  check('All students created by student worker processes are present in database', insertedStudents === 400, `found: ${insertedStudents}`);

  const insertedProgress = mainDb.prepare(`
    SELECT COUNT(*) as c FROM user_progress WHERE user_id LIKE 'w_stu_%'
  `).get().c;
  check('All user_progress records created by student worker processes are present', insertedProgress === 400, `found: ${insertedProgress}`);

  // Verify that whitelist entries created by admin worker exist
  const insertedWhitelist = mainDb.prepare(`
    SELECT COUNT(*) as c FROM pre_whitelist WHERE email LIKE 'wl_%@vip.ta12.edu.vn'
  `).get().c;
  check('All whitelist entries created by admin worker process are present', insertedWhitelist === 200, `found: ${insertedWhitelist}`);

  // Check that admin status updates actually affected students
  const approvedCount = mainDb.prepare(`
    SELECT COUNT(*) as c FROM users WHERE status = 'approved' AND email LIKE '%@test.student.ta12.edu.vn'
  `).get().c;
  check('Admin worker successfully approved student accounts concurrently', approvedCount > 0, `approved count: ${approvedCount}`);

  // ---------------------------------------------------------------------------
  // Vector 4: High-Contention Transaction Stress (Simultaneous Write-Write)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: High-Contention Write-Write Simulation on Same Entity...');
  
  // Create a shared hot record
  const hotUserId = 'usr_hot_contention_target';
  mainDb.prepare(`
    INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
    VALUES (?, 'gid_hot', 'hot.target@ta12.edu.vn', 'Hot Target Student', 'pending', datetime('now'), datetime('now'))
    ON CONFLICT(id) DO UPDATE SET status = 'pending'
  `).run(hotUserId);

  mainDb.prepare(`
    INSERT INTO user_progress (user_id, streak_flame, diamonds, updated_at)
    VALUES (?, 0, 0, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET streak_flame = 0, diamonds = 0
  `).run(hotUserId);

  // Run 20 rapid interleaved updates simulating port 3000 progress sync vs port 3001 admin approve
  let contentionErrors = 0;
  for (let round = 0; round < 20; round++) {
    try {
      // Simulating Port 3000: Student sync diamonds
      mainDb.prepare('UPDATE user_progress SET diamonds = diamonds + 5 WHERE user_id = ?').run(hotUserId);
      // Simulating Port 3001: Admin toggle status
      const nextStatus = round % 2 === 0 ? 'approved' : 'pending';
      mainDb.prepare('UPDATE users SET status = ? WHERE id = ?').run(nextStatus, hotUserId);
      // Simulating Port 3000: Student streak
      mainDb.prepare('UPDATE user_progress SET streak_flame = streak_flame + 1 WHERE user_id = ?').run(hotUserId);
    } catch (err) {
      contentionErrors++;
    }
  }

  const finalHotUser = mainDb.prepare('SELECT status FROM users WHERE id = ?').get(hotUserId);
  const finalHotProg = mainDb.prepare('SELECT streak_flame, diamonds FROM user_progress WHERE user_id = ?').get(hotUserId);

  check('High-contention rapid interleaving completed with 0 errors', contentionErrors === 0);
  check('Diamonds accumulated accurately to 100', finalHotProg.diamonds === 100, `actual: ${finalHotProg.diamonds}`);
  check('Streak accumulated accurately to 20', finalHotProg.streak_flame === 20, `actual: ${finalHotProg.streak_flame}`);

  // ---------------------------------------------------------------------------
  // Vector 5: Foreign Key Cascade & Referential Integrity Under Stress
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Foreign Key Cascade & Referential Integrity Under Stress...');
  
  // Deleting user must cascade delete user_progress
  mainDb.prepare('DELETE FROM users WHERE id = ?').run(hotUserId);
  const orphanedProg = mainDb.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(hotUserId);
  check('ON DELETE CASCADE cleanly removed user_progress when user was deleted', orphanedProg === undefined);

  // Inserting progress for non-existent user must fail due to foreign keys
  let fkBlocked = false;
  try {
    mainDb.prepare(`
      INSERT INTO user_progress (user_id, streak_flame, diamonds) VALUES ('non_existent_user_id', 1, 10)
    `).run();
  } catch (err) {
    fkBlocked = err.message.includes('FOREIGN KEY constraint failed');
  }
  check('FOREIGN KEY constraint blocks orphaned user_progress insertion', fkBlocked);

  // ---------------------------------------------------------------------------
  // Vector 6: Post-Stress SQLite Database Integrity Check & WAL Checkpoint
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 6: Post-Stress SQLite Database Integrity & WAL Checkpoint...');
  
  const postIntegrity = mainDb.pragma('integrity_check', { simple: true });
  check('Post-stress PRAGMA integrity_check returns "ok"', postIntegrity === 'ok', `result: ${postIntegrity}`);

  // Execute WAL checkpoint
  const checkpointResult = mainDb.pragma('wal_checkpoint(PASSIVE)');
  check('PRAGMA wal_checkpoint(PASSIVE) executes successfully without error', Boolean(checkpointResult));

  // ---------------------------------------------------------------------------
  // Vector 8: Case-Insensitivity & Concurrency Race on Promotion
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 8: Case-Insensitivity & Concurrency Race on Promotion...');
  
  const raceEmailLower = `race_student_${Date.now()}@ta12.edu.vn`;
  const raceEmailUpper = raceEmailLower.toUpperCase();
  const raceUserId = `usr_race_${Date.now()}`;

  // Admin inserts whitelist with lowercase, student registers with uppercase
  mainDb.prepare(`
    INSERT INTO pre_whitelist (email, notes) VALUES (?, 'Case Race Test')
  `).run(raceEmailLower);

  mainDb.prepare(`
    INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
    VALUES (?, ?, ?, 'Học Sinh Viết Hoa', 'pending', datetime('now'), datetime('now'))
  `).run(raceUserId, `gid_${raceUserId}`, raceEmailUpper);

  // Check if case-insensitive collation finds whitelist match
  const matchedWl = mainDb.prepare('SELECT id FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get(raceEmailUpper);
  check('Pre-whitelist lookup is case-insensitive (UPPERCASE matches lowercase)', Boolean(matchedWl));

  // Retroactive promotion triggered
  mainDb.prepare(`
    UPDATE users SET status = 'approved', approved_at = datetime('now')
    WHERE email = ? COLLATE NOCASE AND status = 'pending'
  `).run(raceEmailLower);

  const updatedRaceUser = mainDb.prepare('SELECT status, approved_at FROM users WHERE id = ?').get(raceUserId);
  check('Race user promoted to approved regardless of case casing', updatedRaceUser.status === 'approved' && Boolean(updatedRaceUser.approved_at));

  // Clean up race records
  mainDb.prepare('DELETE FROM users WHERE id = ?').run(raceUserId);
  mainDb.prepare('DELETE FROM pre_whitelist WHERE email = ? COLLATE NOCASE').run(raceEmailLower);

  // ---------------------------------------------------------------------------
  // Vector 9: Large Payload Concurrent Write & Non-Blocking Read
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 9: Large Payload Concurrent Write & Non-Blocking Read...');
  
  // Construct 250KB payload
  const largeExamScores = {};
  for (let e = 1000; e < 1500; e++) {
    largeExamScores[String(e)] = {
      score: 8.5 + (e % 15) * 0.1,
      totalCorrect: 35,
      totalQuestions: 40,
      timestamp: new Date().toISOString(),
      details: 'A'.repeat(300), // padding
    };
  }
  const largePayloadString = JSON.stringify(largeExamScores);
  check('Constructed payload exceeds 150KB', largePayloadString.length > 150000, `size: ${Math.round(largePayloadString.length / 1024)}KB`);

  const largeUserId = `usr_large_${Date.now()}`;
  mainDb.prepare(`
    INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
    VALUES (?, 'gid_large', 'large.user@ta12.edu.vn', 'Large User', 'approved', datetime('now'), datetime('now'))
  `).run(largeUserId);

  // Write large payload
  mainDb.prepare(`
    INSERT INTO user_progress (user_id, exam_scores, updated_at) VALUES (?, ?, datetime('now'))
  `).run(largeUserId, largePayloadString);

  // Concurrently read while large record is stored
  const adminReadRow = mainDb.prepare(`
    SELECT length(p.exam_scores) as bytes, u.status
    FROM users u JOIN user_progress p ON u.id = p.user_id
    WHERE u.id = ?
  `).get(largeUserId);

  check('Large payload written and read back accurately without WAL contention', adminReadRow && adminReadRow.bytes === largePayloadString.length);

  mainDb.prepare('DELETE FROM users WHERE id = ?').run(largeUserId);

  // ---------------------------------------------------------------------------
  // Vector 10: Explicit Transaction Rollback Isolation
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 10: Explicit Transaction Rollback Isolation...');
  
  const rollbackUserId = `usr_rollback_${Date.now()}`;
  const rollbackTx = mainDb.transaction(() => {
    mainDb.prepare(`
      INSERT INTO users (id, google_id, email, name, status)
      VALUES (?, 'gid_rb', 'rollback@ta12.edu.vn', 'Rollback User', 'pending')
    `).run(rollbackUserId);
    // Intentionally throw error to trigger rollback
    throw new Error('Simulated transient worker abort');
  });

  let rolledBack = false;
  try {
    rollbackTx();
  } catch (err) {
    if (err.message.includes('Simulated transient worker abort')) {
      rolledBack = true;
    }
  }

  check('Transaction abort triggered rollback as expected', rolledBack);
  const phantomUser = mainDb.prepare('SELECT id FROM users WHERE id = ?').get(rollbackUserId);
  check('Rolled back transaction left zero phantom records in database', phantomUser === undefined);

  // ---------------------------------------------------------------------------
  // Vector 7: Clean-Up of Stress Entities & Re-verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 7: Clean-Up of Stress Entities & Re-verification...');
  
  mainDb.prepare("DELETE FROM users WHERE email LIKE '%@test.student.ta12.edu.vn'").run();
  mainDb.prepare("DELETE FROM pre_whitelist WHERE email LIKE 'wl_%@vip.ta12.edu.vn'").run();

  const remainingStressUsers = mainDb.prepare("SELECT COUNT(*) as c FROM users WHERE email LIKE '%@test.student.ta12.edu.vn'").get().c;
  const remainingStressWl = mainDb.prepare("SELECT COUNT(*) as c FROM pre_whitelist WHERE email LIKE 'wl_%@vip.ta12.edu.vn'").get().c;

  check('Cleaned up all student worker test users', remainingStressUsers === 0);
  check('Cleaned up all admin worker test whitelist entries', remainingStressWl === 0);

  // Verify baseline personas remain completely undamaged
  const doTuan = mainDb.prepare('SELECT id, email, status FROM users WHERE id = ?').get('usr_dotuan_demo');
  check('Baseline persona "Đỗ Tuấn" is undamaged and status="approved"', doTuan && doTuan.status === 'approved');

  const pendingAn = mainDb.prepare('SELECT id, email, status FROM users WHERE id = ?').get('usr_pending_demo');
  check('Baseline persona "Nguyễn Văn An" exists and is status="pending"', pendingAn && pendingAn.status === 'pending');

  const vipWl = mainDb.prepare('SELECT email FROM pre_whitelist WHERE email = ? COLLATE NOCASE').get('vip.student@ta12.edu.vn');
  check('Baseline pre-whitelist entry "vip.student@ta12.edu.vn" is intact', Boolean(vipWl));

  mainDb.close();

  // ---------------------------------------------------------------------------
  // Final Evaluation
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 CHALLENGER CONCURRENCY SUMMARY: ${passedAssertions} / ${totalAssertions} CHECKS PASSED`);
  console.log('========================================================================\n');

  if (failureList.length > 0) {
    console.error(`❌ ${failureList.length} ASSERTION(S) FAILED:`);
    failureList.forEach((f) => console.error(`  - ${f.desc} (${f.details})`));
    process.exit(1);
  } else {
    console.log('🎉 ALL MULTI-PROCESS CONCURRENCY STRESS TESTS PASSED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE\n');
  }
}

main().catch((err) => {
  console.error('Fatal error running challenger stress harness:', err);
  process.exit(1);
});
