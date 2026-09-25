# E2E Test Infra: TA12 Grade 10 English Preparation Platform

## Test Philosophy
- **Opaque-box, requirement-driven**: Test cases are derived from `ORIGINAL_REQUEST.md` and user-facing specifications, not internal implementation mechanics.
- **Methodology**: Systematic 4-Tier test design (Category-Partition, Boundary Value Analysis, Pairwise Combinatorial, and Real-World Workload Testing).
- **Offline Autonomy**: Tests must verify that the platform runs 100% offline without external network calls.

## Feature Inventory & Test Mapping
| # | Feature | Requirement Source | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|-------------------|:------:|:------:|:------:|:------:|
| 1 | Navigation & TA12 Header | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 2 | 4 Big Action Cards | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 3 | Skill Filter Pills | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 4 | Topic Directory (2-column) | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 5 | Practice Session Creator Modal | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 6 | Interactive Quiz Engine | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 7 | Instant Feedback Check ("Kiểm tra ngay") | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 8 | 1-Retry Mechanism ("01 lượt làm lại") | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 9 | Explanation Drawer & Rule Tips | ORIGINAL_REQUEST §R1, §R2 | 5 | 5 | ✓ | ✓ |
| 10 | Browser Native Pronunciation Audio | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 11 | Score Summary & Trophy Screen | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 12 | Data Repository (5 Skills Coverage) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 13 | Secure Local API (`/api/questions`) | Acceptance Criteria | 5 | 5 | ✓ | ✓ |
| 14 | Next.js Buildability & Lint Cleanliness | Acceptance Criteria | 5 | 5 | ✓ | ✓ |
| 15 | TA12 Brand Consistency (Zero "K") | Acceptance Criteria | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Runner**: Node.js automated test runner `tests/run_e2e_tests.js`.
- **Invocation**: `node tests/run_e2e_tests.js` (or `npm test`).
- **Pass/Fail Semantics**: All test assertions must pass; script exits with code 0 on complete pass, non-zero on any failure.
- **Reporting**: Structured test summary output displaying test counts, status per tier, and assertion metrics.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Target Behavior |
|---|----------|--------------------|-----------------|
| 1 | Standard Topic Drill | F05, F06, F08, F10-F17, F20, F21 | Student opens Phonetics Topic 68, selects choices, verifies instant feedback, sees explanation, completes quiz, sees trophy screen. |
| 2 | Retry and Remediation Drill | F12, F14, F15, F16, F17 | Student makes mistake on attempt 1, receives retry warning, changes answer, gets it right, views rule tip. |
| 3 | Multi-Skill Custom Session | F07, F09, F10-F17, F20 | Student opens modal, selects Grammar + Vocabulary, sets 20 questions, completes blended session. |
| 4 | Offline Grammar & Reading Prep | F08, F11, F12, F17, F18, F22 | Student studies complex conditional sentence or reading comprehension with zero network connectivity. |
| 5 | Mobile Responsive Navigation | F01, F04, F05, F06, F08 | Student navigates on smartphone screen; elements collapse cleanly, touch targets >= 48px. |

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥5 test cases per feature (≥75 test cases across 15 features).
- **Tier 2 (Boundary & Corner Cases)**: ≥5 test cases per feature (≥75 boundary test cases).
- **Tier 3 (Cross-Feature Combinations)**: ≥15 pairwise interaction test cases.
- **Tier 4 (Real-World Application Scenarios)**: ≥5 end-to-end user journey tests.
- **Total Minimum Threshold**: ≥170 test cases.
