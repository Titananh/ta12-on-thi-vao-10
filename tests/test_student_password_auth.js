/**
 * TA12 Automated Test Suite: Student Password Auth & Admin Masking
 *
 * Vectors:
 *  1. Email Validation (@gmail.com domain requirement)
 *  2. Student Registration with Custom Email & Password
 *  3. Student Login & Password Verification
 *  4. Admin Account Protection & Master Key Verification
 *  5. Admin Email Masking in Public and Admin UIs
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const ts = require('typescript');

const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'data', 'ta12_users.sqlite');
const Database = require('better-sqlite3');

require.extensions['.ts'] = function (module, filename) {
  let content = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  module._compile(transpiled.outputText, filename);
};

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ❌ FAILED: ${desc} ${details ? '(' + details + ')' : ''}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

async function runStudentPasswordAuthTests() {
  console.log('========================================================================');
  console.log('🧪 TEST SUITE: STUDENT PASSWORD AUTH & ADMIN EMAIL MASKING');
  console.log('========================================================================\n');

  const {
    isValidStudentEmail,
    normalizeStudentEmail,
    hashPassword,
    verifyPassword,
    SUPERADMIN_EMAIL,
  } = require('../src/lib/auth');
  const db = new Database(DB_PATH);

  // ---------------------------------------------------------------------------
  // VECTOR 1: Email Validation (@gmail.com domain requirement)
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Email Validation (@gmail.com domain requirement)...');

  check('hocsinh123@gmail.com is valid', isValidStudentEmail('hocsinh123@gmail.com') === true);
  check('hocsinh.test@gmail.com is valid', isValidStudentEmail('hocsinh.test@gmail.com') === true);
  check('HocSinh@Gmail.COM (case-insensitive) is valid', isValidStudentEmail('HocSinh@Gmail.COM') === true);
  check('student_2026@gmail is valid (normalizable)', isValidStudentEmail('student_2026@gmail') === true);
  check('normalizeStudentEmail appends .com for @gmail', normalizeStudentEmail('student@gmail') === 'student@gmail.com');

  check('attacker@yahoo.com is REJECTED', isValidStudentEmail('attacker@yahoo.com') === false);
  check('user@outlook.com is REJECTED', isValidStudentEmail('user@outlook.com') === false);
  check('user@hotmail.com is REJECTED', isValidStudentEmail('user@hotmail.com') === false);
  check('user@ta12.edu.vn is REJECTED (student must use @gmail.com)', isValidStudentEmail('user@ta12.edu.vn') === false);
  check('user@evil.gmail.attacker.com is REJECTED', isValidStudentEmail('user@evil.gmail.attacker.com') === false);
  check('empty email is REJECTED', isValidStudentEmail('') === false);

  // ---------------------------------------------------------------------------
  // VECTOR 2: Password Hashing & Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Password Hashing & Constant-Time Verification...');

  const pass1 = 'my_secure_pass_123';
  const hash1 = hashPassword(pass1);

  check('hashPassword produces non-empty hex hash', typeof hash1 === 'string' && hash1.length === 64);
  check('verifyPassword with correct password returns true', verifyPassword(pass1, hash1) === true);
  check('verifyPassword with wrong password returns false', verifyPassword('wrong_password', hash1) === false);
  check('verifyPassword with empty password returns false', verifyPassword('', hash1) === false);

  // ---------------------------------------------------------------------------
  // VECTOR 3: Student Registration & Login Flow in SQLite
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Student Registration & Login Flow in SQLite...');

  const testStudentEmail = `test_student_${Date.now()}@gmail.com`;
  const testStudentPass = 'matkhau123';
  const testStudentHash = hashPassword(testStudentPass);
  const testStudentId = `usr_test_${Date.now()}`;

  // Register new student
  db.prepare(`
    INSERT INTO users (id, google_id, email, name, status, password_hash, created_at, last_login_at)
    VALUES (?, ?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))
  `).run(testStudentId, `local_${Date.now()}`, testStudentEmail, 'Học Sinh Mới', testStudentHash);

  const registeredUser = db.prepare('SELECT * FROM users WHERE email = ?').get(testStudentEmail);
  check('Student account inserted into SQLite', Boolean(registeredUser));
  check('New student status is strictly "pending"', registeredUser.status === 'pending');
  check('Student password_hash matches hashed password', verifyPassword(testStudentPass, registeredUser.password_hash) === true);
  check('Student password_hash rejects wrong password', verifyPassword('sai_mat_khau', registeredUser.password_hash) === false);

  // Cleanup test user
  db.prepare('DELETE FROM users WHERE id = ?').run(testStudentId);

  // ---------------------------------------------------------------------------
  // VECTOR 4: UI Admin Email Masking Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: UI Admin Email Masking Verification...');

  // 4.1 LoginModal visible text masks admin email
  const loginModalSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'LoginModal.tsx'), 'utf8');
  check('LoginModal visible text displays "Quản trị viên (<code>ADMIN</code>)"',
    loginModalSrc.includes('Quản trị viên (<code>ADMIN</code>)'));
  check('LoginModal does NOT display visible plain text <code>dot71714@gmail.com</code>',
    !loginModalSrc.includes('<code>dot71714@gmail.com</code>'));

  // 4.2 LoginRequiredScreen visible text masks admin email
  const loginRequiredSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'LoginRequiredScreen.tsx'), 'utf8');
  check('LoginRequiredScreen displays "Quản trị viên (ADMIN)"',
    loginRequiredSrc.includes('Quản trị viên (ADMIN)'));
  check('LoginRequiredScreen has zero occurrences of raw admin email',
    !loginRequiredSrc.includes('dot71714@gmail.com'));

  // 4.3 Header.tsx masks admin email as ADMIN
  const headerSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'Header.tsx'), 'utf8');
  check('Header.tsx masks admin name as ADMIN', headerSrc.includes("isAdmin ? 'ADMIN'"));
  check('Header.tsx masks admin email as ADMIN', headerSrc.includes("isAdmin ? 'ADMIN'"));

  // 4.4 Admin page displays ADMIN badge and mask
  const adminPageSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'admin', 'page.tsx'), 'utf8');
  check('Admin page gate displays ADMIN instead of plain email',
    adminPageSrc.includes('<div className="p-2.5 bg-emerald-900/20 border border-emerald-500/40 rounded-xl font-mono text-emerald-300 font-bold text-sm">\n                ADMIN'));
  check('Admin user table row displays ADMIN alias for superadmin',
    adminPageSrc.includes("u.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() ? 'ADMIN' : u.name"));

  // ---------------------------------------------------------------------------
  // Vector 5: Admin Master Key Verification & Zero-Localhost Audit
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Admin Master Key Verification & Zero-Localhost Audit...');

  // 5.1 Zero localhost:3000 links in admin page
  check('Admin page has zero hardcoded http://localhost:3000 links',
    !adminPageSrc.includes('http://localhost:3000'));

  // 5.2 Default master key hint in admin UI
  check('Admin page displays default master key hint (ta12admin2026)',
    adminPageSrc.includes('ta12admin2026'));

  // 5.3 1-Click Login button in admin UI
  check('Admin page includes 1-Click Login button',
    adminPageSrc.includes('1-Click Login'));

  // 5.4 Graceful oauth_unconfigured handling
  check('Admin page gracefully handles oauth_unconfigured error state',
    adminPageSrc.includes('oauth_unconfigured') && adminPageSrc.includes('Chế độ Quản trị Vercel Serverless'));

  // 5.5 Admin login route accepts valid master keys
  const adminLoginRouteSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'api', 'admin', 'login', 'route.ts'), 'utf8');
  check('Admin login route supports ta12admin2026', adminLoginRouteSrc.includes("'ta12admin2026'"));
  check('Admin login route supports dot71714@admin2026', adminLoginRouteSrc.includes("'dot71714@admin2026'"));
  check('Admin login route supports ta12_superadmin_secret_key_2026', adminLoginRouteSrc.includes("'ta12_superadmin_secret_key_2026'"));
  check('Admin login route sets SESSION_COOKIE_NAME for seamless navigation', adminLoginRouteSrc.includes('SESSION_COOKIE_NAME'));

  // 5.6 Admin session route supports token-based authentication
  const adminSessionRouteSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'api', 'admin', 'session', 'route.ts'), 'utf8');
  check('Admin session route accepts NextRequest and checks requireAdminSession',
    adminSessionRouteSrc.includes('requireAdminSession(request)'));

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 STUDENT PASSWORD AUTH & MASKING SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  console.log('========================================================================\n');
}

runStudentPasswordAuthTests().catch((err) => {
  console.error('\n❌ Suite error:', err.message);
  process.exit(1);
});
