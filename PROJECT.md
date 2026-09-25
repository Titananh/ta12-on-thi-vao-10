# Project: TA12 Grade 10 English Preparation Platform

## Architecture
- **Framework**: Next.js 14.2 (App Router) + React 18 + TypeScript + Tailwind CSS.
- **Strict Scope Boundary**: Exclusively bounded to the official course "Ôn thi vào 10 môn Anh - HN" (Exam ID = 9). Zero extraneous data from other grades, subjects, or regions.
- **Data Layer (100% Offline)**:
  - `data/exams/`: Catalog of 138 real exams across 5 categories (1097, 1263, 170, 1489, 1687) and complete bundles (`data/exams/bundles/<examId>.json`).
  - `data/sections/`: 10 standardized question banks for "Luyện từng phần" (`pronunciation.json`, `stress.json`, `error_id.json`, `guided_cloze.json`, `reading.json`, etc.).
  - `data/theories/` & `data/questions/`: 152 study modules for "Học ôn" (76 vocab sets, 76 grammar sets) + 38 core syllabus modules for "Luyện chủ điểm".
  - `public/images/`: Offline image assets (infographic rule cards, exam signboards, illustrations).
- **Interactive Routing & Modes**:
  - Main Dashboard (`/`): Dynamic tab switching between 4 core modes (`hoc-on`, `luyen-de`, `luyen-phan`, `luyen-chudiem`).
  - Exam Room (`/exam/[examId]`): Authentic exam simulation with monotonic countdown timer (40/50/60m), 1..N question palette with 4-state indicators, passage-linked rendering, bookmarking, submit modal, score breakdown, and review mode with Tak12 vocabulary lookup tables (IPA) and option-by-option justifications.
  - Drill Engine (`/practice/[topicId]`): Practice runner with instant feedback, 1-retry mechanism, theory modal, and speech synthesis.
- **Audio & TTS**: Browser-native HTML5 Web Speech API (`window.speechSynthesis`, `en-US`), 100% offline, zero network dependencies.
- **Client Storage**: `localStorage` (`ta12_progress`, `ta12_exam_results`, `ta12_section_progress`, `ta12_study_progress`, `ta12_user_stats`).
- **Brand Identity**: TA12 (dark forest green `#1c581f`, emerald green `#27ae60`, lime `#83c224`). 100% pure TA12, zero legacy "K".

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Brand Identity & Header | Persistent sticky header with SVG brand logo "TA12", streak flame, diamonds counter, and student profile | M2 | Survey |
| F02 | 4 Core Navigation Cards | Large interactive cards for HỌC ÔN, LUYỆN ĐỀ THI, LUYỆN TỪNG PHẦN, LUYỆN CHỦ ĐIỂM | M2 | Survey |
| F03 | Tab 1: HỌC ÔN View | Vocabulary (Cat 44) & Grammar (Cat 240) study sets with theory, vocabulary lookup table with IPA, and practice test | M2 | Survey |
| F04 | Tab 1: Offline Vocabulary Explorer | Interactive table displaying Word, Part of Speech, IPA pronunciation, Web Speech TTS, and Vietnamese definitions | M2 | Survey |
| F05 | Tab 2: LUYỆN ĐỀ THI Catalog | Filterable catalog of official exams (2019-2026), Chuyên, GD units, and new curriculum exams with metadata and personal bests | M2 | Survey |
| F06 | Tab 2: Exam Room Simulation | Dedicated fullscreen exam room at `/exam/[examId]` with countdown timer (40/50/60m) and auto-submit at 00:00 | M2 | Survey |
| F07 | Tab 2: Question Palette 1..N | Interactive grid tracking Answered (Green), Unanswered (White), Marked Uncertain (Amber flag), Answered + Uncertain | M2 | Survey |
| F08 | Tab 2: Unsure Bookmark Toggle | "Đánh dấu chưa chắc chắn" toggle per question, reflected immediately on question palette | M2 | Survey |
| F09 | Tab 2: Submit Confirmation Modal | Dialog summarizing answered vs unanswered questions with warning callout if unanswered > 0 | M2 | Survey |
| F10 | Tab 2: Exam Score & Evaluation | Score on 10.0 scale, total correct, accuracy %, time taken, and pedagogical assessment badge | M2 | Survey |
| F11 | Tab 2: Detailed Review Mode | Question-by-question review showing user choice vs correct choice, Tak12 explanation, IPA vocab table, and option feedbacks | M2 | Survey |
| F12 | Tab 3: LUYỆN TỪNG PHẦN View | 8-10 standardized Hanoi Grade 10 question type cards (Phonetics, Stress, Error ID, Cloze, Reading, Transformation...) | M2 | Survey |
| F13 | Tab 3: Section Practice Launcher | Modal configuring targeted question count (10/20/30) and launching focused section drills | M2 | Survey |
| F14 | Tab 4: LUYỆN CHỦ ĐIỂM View | 5-skill taxonomy directory (Phonetics, Vocabulary, Grammar, Reading, Speaking), topic search, and score progress bars | M2 | Survey |
| F15 | Tab 4: Custom Session Modal | "+ Tạo phiên ôn luyện" modal configuring multi-skill mixed sessions with custom count (10/20/30/40) | M2 | Survey |
| F16 | Drill Engine & Instant Feedback | `/practice/[topicId]` interactive runner with instant check, 1-retry mechanism, and "Xem đáp án" | M2 | Survey |
| F17 | Data: Ingestion Crawler Script | Resilient batch crawler extracting Exam ID = 9 data from Tak12 public API with rate-limiting, retry, and checkpointing | M1 | Survey |
| F18 | Data: Official Exams 2019-2026 | Category 1097 official & sample exams complete with questions, choices, answers, and explanations | M1 | Survey |
| F19 | Data: Specialized & GD Mock Exams | Categories 1687, 1489, 1263, 170 exams enriched via CheckGuestAnswer | M1 | Survey |
| F20 | Data: Vocabulary & Grammar Sets | Categories 44 & 240 study modules with theories, vocabulary tables with IPA, and practice quizzes | M1 | Survey |
| F21 | Data: Question Sections (Dạng bài) | Classified questions indexed into 10 canonical Hanoi Grade 10 sections | M1 | Survey |
| F22 | Data: Offline Images | Downloaded and locally re-hosted image assets in `public/images/` (infographic rule cards, diagrams) | M1 | Survey |
| F23 | LocalStorage Persistence | Standardized keys (`ta12_progress`, `ta12_exam_results`, `ta12_section_progress`, `ta12_study_progress`) | M2 | Survey |
| F24 | E2E Automated Test Expansion | Automated test suite validating all 4 modes, exam flow, timer, palette, submit, vocabulary tables, and offline health | M3 | Dual Track |
| F25 | Adversarial Hardening & Audit | White-box adversarial testing, boundary stress tests, and forensic integrity verification | M4 | Dual Track |
| F26 | Git & GitHub Private Repository | Configure .gitignore, commit 552 JSONs & assets, create private repo `ta12-on-thi-vao-10` on Titananh via `gh` CLI | M_GIT | User Req R1 |
| F27 | SQLite Engine & Database Schema | `better-sqlite3` in WAL mode at `data/ta12_users.sqlite` with `users`, `pre_whitelist`, `user_progress` | M_AUTH_DB | User Req R2 |
| F28 | Google OAuth & Mock Fallback Handler | OAuth endpoints (`/api/auth/*`), real Google OAuth support + dev/test persona toggle | M_AUTH_DB | User Req R2 |
| F29 | Access Guard & Approval Screen | Block pending users with auto-polling ApprovalWaitingScreen; unlock full course for approved users | M_AUTH_DB | User Req R2 |
| F30 | Header Student Profile Integration | Display Avatar, Name, Email, Status Badge while strictly preserving asserted test strings | M_AUTH_DB | User Req R2 |
| F31 | Learning Progress Two-Way Sync | Debounced synchronization between client localStorage and SQLite `user_progress` table | M_AUTH_DB | User Req R2 |
| F32 | Dedicated Admin Portal Architecture | Standalone Next.js 14 App Router project in `admin/` on port 3001 with shared SQLite access | M_ADMIN | User Req R3 |
| F33 | Admin Dashboard & 1-Click Actions | Metric cards, user table with 1-click Approve/Revoke, live search/filtering | M_ADMIN | User Req R3 |
| F34 | Pre-whitelist Management | Admin input for allowed emails with auto-retroactive approval of pending accounts | M_ADMIN | User Req R3 |
| F35 | Dual Build & Integration Test Suite | `npm run build:all`, test suite validating dual app builds, OAuth flows, and SQLite synchronization | M_VERIF | User Req R3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Data Ingestion Pipeline & Local Repository | Build & run crawler script for Course Exam ID = 9 (Tak12 API): download official exams 2019-2026, Chuyên, GD, new curriculum, study sets 44/240, extract answers & rich explanations via CheckGuestAnswer, download offline images to `public/images/`, assemble `data/exams/`, `data/sections/`, `data/theories/`, `data/questions/` | none | DONE |
| M2 | Full 4-Mode Web UI/UX & Exam Engine Implementation | Implement 4 active navigation modes on dashboard (`HocOnView`, `LuyenDeView`, `LuyenPhanView`, `TopicList`), dedicated Exam Room route `/exam/[examId]` with countdown timer (40/50/60m), 1..N question palette, bookmark unsure toggle, submit modal, score breakdown, Tak12 review drawer with IPA vocab tables, LocalStorage persistence | M1 | DONE |
| M_GIT | Git & GitHub Private Repository (R1) | Configure `.gitignore`, initialize git, commit all project files, 552 JSONs, assets, create private repo `ta12-on-thi-vao-10` on `Titananh` via `gh`, push `main` | none | IN_PROGRESS |
| M_AUTH_DB | Google OAuth & SQLite Progress Sync (R2) | Install `better-sqlite3`, initialize `data/ta12_users.sqlite`, OAuth handlers, Access Guard, Header profile integration, and progress sync | M_GIT | PLANNED |
| M_ADMIN | Dedicated Admin Web Portal (R3) | Standalone Next.js 14 app in `admin/` on port 3001, shared SQLite, Dashboard stats, 1-click Approve/Revoke, Pre-whitelist | M_AUTH_DB | PLANNED |
| M_VERIF | Dual-App Build & Full E2E Verification | Ensure `npm run build:all` passes 100%, run full master test suite + admin tests, challenger tests, forensic audit | M_ADMIN | PLANNED |

## Interface Contracts
### Exam Room API (`/api/exams`)
- **GET `/api/exams`**: Returns list of all available exams grouped by category with metadata (`id`, `title`, `year`, `categoryId`, `timeLimit`, `questionCount`, `description`).
- **GET `/api/exams?examId=[id]`**: Returns complete self-contained exam bundle (`questions`, `choices`, `passageText`, `explanation`, `vocabTable`, `answerFeedbacks`).

### Section Practice API (`/api/sections`)
- **GET `/api/sections`**: Returns list of 10 standardized question sections with question counts.
- **GET `/api/sections?sectionId=[id]&count=[N]`**: Returns random sample of questions for targeted drilling.

### Học Ôn API (`/api/study`)
- **GET `/api/study?type=vocab|grammar`**: Returns list of study units (76 vocab / 76 grammar).
- **GET `/api/study?moduleId=[id]`**: Returns theory content, interactive vocabulary table (word, POS, IPA, meaning, example), and practice quiz questions.

### Auth & User API (`/api/auth/*`)
- **GET `/api/auth/google`**: Redirects to Google OAuth consent screen (or mock login when unset).
- **GET `/api/auth/callback/google`**: Exchanges code for profile, checks pre-whitelist, upserts user, issues session cookie `ta12_session`.
- **POST `/api/auth/mock-login`**: Fast test persona switcher (`approved` | `pending` | `whitelisted`).
- **GET `/api/auth/session`**: Returns current session `{ user, progress }` or `{ user: null }`.
- **POST `/api/auth/logout`**: Clears `ta12_session` cookie.

### Progress Sync API (`/api/progress`)
- **GET `/api/progress`**: Retrieves current SQLite `user_progress` for authenticated user.
- **POST `/api/progress`**: Upserts exam scores, topic history, section progress, study progress, streak, and diamonds into SQLite.

### Admin Portal API (`admin/src/app/api/admin/*`)
- **GET `/api/admin/users`**: Filterable, searchable list of registered users with progress summary.
- **PATCH `/api/admin/users`**: 1-click update user status (`approve`, `revoke`, `reject`, `pending`).
- **GET `/api/admin/whitelist`**: List pre-whitelisted emails with linked registration status.
- **POST `/api/admin/whitelist`**: Add email to whitelist with optional auto-approval for existing pending accounts.
- **DELETE `/api/admin/whitelist`**: Remove email from whitelist.
- **GET `/api/admin/stats`**: Overall counts (approved, pending, rejected, whitelist) and student progress averages.

## Code Layout
- `data/exams/`: Offline exam catalog and bundles (`bundles/<examId>.json`).
- `data/sections/`: Offline question banks by question type (`<sectionId>.json`).
- `data/theories/`: Study theories and core taxonomy theories.
- `data/questions/`: Study questions and core taxonomy questions.
- `data/ta12_users.sqlite`: Shared SQLite database runtime (ignored in git).
- `public/images/`: Locally stored illustrations, diagram assets, and rule infographic cards.
- `src/lib/db.ts`: SQLite singleton connection and schema initialization for student app.
- `src/app/api/auth/`: Google OAuth and session management routes.
- `src/app/api/progress/`: User progress synchronization routes.
- `src/components/Header.tsx`: Student header with profile badge and theme toggles.
- `src/components/ApprovalWaitingScreen.tsx`: Access Guard screen for pending student accounts.
- `src/components/ProgressSyncProvider.tsx`: Two-way local <-> SQLite progress synchronizer.
- `admin/`: Dedicated Admin Web Portal (standalone Next.js 14 App Router project).
- `admin/src/lib/db.ts`: Shared SQLite connection for Admin Portal.
- `admin/src/app/page.tsx`: Admin dashboard with stats, user table, and whitelist management.
- `admin/src/app/api/admin/`: Admin backend APIs.
- `tests/`: Automated E2E verification suites and test runners.
