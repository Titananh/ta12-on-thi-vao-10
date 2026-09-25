#!/usr/bin/env python3
"""
Comprehensive Data Verification Script for Milestone 1
Validates all 30 target topics + aliases across questions and theories.
"""
import json
import os
import re
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
QUESTIONS_DIR = os.path.join(DATA_DIR, "questions")
THEORIES_DIR = os.path.join(DATA_DIR, "theories")

TARGET_TOPICS = {
    "Phonetics": [68, 69, 70, 72, 29, 30],
    "Grammar": [126, 127, 128, 130, 134, 140, 168, 551, 160, 106, 150, 116],
    "Vocabulary": [91, 95, 96, 35, 1659, 1645, 36],
    "Reading": [81, 82],
    "Speaking": [78, 79, 80]
}

ALIASES = [26, 27, 28, 307, 301, 141, 523, 73]

def verify():
    errors = []
    warnings = []
    letters = ["A", "B", "C", "D"]
    
    all_target_ids = []
    for skill, topics in TARGET_TOPICS.items():
        all_target_ids.extend(topics)
        
    print(f"=== Milestone 1 Data Verification ===")
    print(f"Target topics count: {len(all_target_ids)}")
    print(f"Alias count: {len(ALIASES)}")
    print(f"Total topics to verify: {len(all_target_ids) + len(ALIASES)}\n")
    
    total_questions = 0
    total_theories = 0
    
    primary_pos_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    global_pos_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    topic_pos_counts = {}

    topics_to_check = [(t, "primary") for t in all_target_ids] + [(a, "alias") for a in ALIASES]
    
    for topic_id, kind in topics_to_check:
        topic_pos_counts[topic_id] = {0: 0, 1: 0, 2: 0, 3: 0}
        q_path = os.path.join(QUESTIONS_DIR, f"{topic_id}.json")
        t_path = os.path.join(THEORIES_DIR, f"{topic_id}.json")
        
        # 1. Verify Question File
        if not os.path.isfile(q_path):
            errors.append(f"Missing question file: {q_path}")
            continue
            
        try:
            with open(q_path, "r", encoding="utf-8") as f:
                q_data = json.load(f)
        except Exception as e:
            errors.append(f"Invalid JSON in {q_path}: {e}")
            continue
            
        if not isinstance(q_data, list):
            errors.append(f"Root of {q_path} is not a list")
            continue
            
        if len(q_data) < 15:
            errors.append(f"{q_path} has {len(q_data)} questions (expected >= 15)")
            
        if kind == "primary":
            total_questions += len(q_data)
            
        for idx, q in enumerate(q_data):
            prefix = f"{q_path}[{idx}] (ID: {q.get('id', 'unknown')})"
            
            # Required fields
            for field in ["id", "questionName", "questionText", "choices", "correctChoiceId", "explanation", "ruleTip"]:
                if field not in q:
                    errors.append(f"{prefix} missing field '{field}'")
                elif field != "choices" and not str(q[field]).strip():
                    errors.append(f"{prefix} field '{field}' is empty")
                    
            # Choices check
            choices = q.get("choices", [])
            if not isinstance(choices, list) or len(choices) != 4:
                errors.append(f"{prefix} choices count is {len(choices) if isinstance(choices, list) else 'not a list'} (expected exactly 4)")
            else:
                choice_ids = set()
                for c_idx, c in enumerate(choices):
                    c_prefix = f"{prefix} choice[{c_idx}]"
                    if not isinstance(c, dict):
                        errors.append(f"{c_prefix} is not an object")
                        continue
                    if "id" not in c or not str(c["id"]).strip():
                        errors.append(f"{c_prefix} missing or empty 'id'")
                    else:
                        choice_ids.add(c["id"])
                    if "text" not in c or not str(c["text"]).strip():
                        errors.append(f"{c_prefix} missing or empty 'text'")
                    if "html" not in c or not str(c["html"]).strip():
                        errors.append(f"{c_prefix} missing or empty 'html'")
                        
                correct_id = q.get("correctChoiceId")
                if correct_id not in choice_ids:
                    errors.append(f"{prefix} correctChoiceId '{correct_id}' not found in choice ids {choice_ids}")
                else:
                    # Track correct choice position and validate explanation letter alignment
                    for c_idx, c in enumerate(choices):
                        if c["id"] == correct_id:
                            global_pos_counts[c_idx] += 1
                            topic_pos_counts[topic_id][c_idx] += 1
                            if kind == "primary":
                                primary_pos_counts[c_idx] += 1

                            # Automated Letter Consistency Check
                            exp_text = q.get("explanation", "")
                            letter_re = re.compile(
                                r'(?:(?:phương án|đáp án|lựa chọn|câu)(?:\s+(?:đúng|chính xác|sai))?\s*(?:là\s+)?([A-D])\b|\b([A-D])\s+là\s+(?:phương án|đáp án)|\bchọn\s+([A-D])\b)',
                                re.IGNORECASE
                            )
                            for m in letter_re.findall(exp_text):
                                cited_letter = next(l for l in m if l).upper()
                                actual_letter = letters[c_idx]
                                if cited_letter != actual_letter:
                                    errors.append(
                                        f"{prefix} explanation letter mismatch: cites '{cited_letter}', "
                                        f"but correctChoiceId '{correct_id}' is at position '{actual_letter}' (index {c_idx})"
                                    )
                            break
                        
        # 2. Verify Theory File
        if not os.path.isfile(t_path):
            errors.append(f"Missing theory file: {t_path}")
            continue
            
        try:
            with open(t_path, "r", encoding="utf-8") as f:
                t_data = json.load(f)
        except Exception as e:
            errors.append(f"Invalid JSON in {t_path}: {e}")
            continue
            
        if not isinstance(t_data, dict):
            errors.append(f"Root of {t_path} is not an object")
            continue
            
        if "topicId" not in t_data or not t_data["topicId"]:
            errors.append(f"{t_path} missing or empty 'topicId'")
            
        rules = t_data.get("rules", [])
        if not isinstance(rules, list) or len(rules) == 0:
            errors.append(f"{t_path} 'rules' is empty or not a list")
        else:
            for r_idx, r in enumerate(rules):
                if not isinstance(r, dict):
                    errors.append(f"{t_path} rules[{r_idx}] is not an object")
                elif "rule" not in r or not r["rule"]:
                    errors.append(f"{t_path} rules[{r_idx}] missing or empty 'rule'")
                    
        if kind == "primary":
            total_theories += 1

    # 3. Distribution Validation Section
    print(f"--- Choice Distribution Validation ---")
    letters = ["A", "B", "C", "D"]

    # 3.1 Primary questions distribution
    print(f"Primary Questions Correct Choice Distribution ({total_questions} questions):")
    for p in range(4):
        cnt = primary_pos_counts[p]
        pct = (cnt / total_questions) * 100 if total_questions else 0
        print(f"  Position {p} ({letters[p]}): {cnt} ({pct:.2f}%)")
        if total_questions > 0 and (pct < 20.0 or pct > 30.0):
            errors.append(f"Primary questions position {p} ({letters[p]}) out of range [20%, 30%]: {pct:.2f}%")

    # 3.2 Global bank distribution
    global_total = sum(global_pos_counts.values())
    print(f"\nGlobal Bank Correct Choice Distribution ({global_total} questions):")
    for p in range(4):
        cnt = global_pos_counts[p]
        pct = (cnt / global_total) * 100 if global_total else 0
        print(f"  Position {p} ({letters[p]}): {cnt} ({pct:.2f}%)")
        if global_total > 0 and (pct < 20.0 or pct > 30.0):
            errors.append(f"Global questions position {p} ({letters[p]}) out of range [20%, 30%]: {pct:.2f}%")

    # 3.3 Individual topic diversification check
    max_topic_skew = 0.0
    skewed_topics = []
    for tid, counts in topic_pos_counts.items():
        t_total = sum(counts.values())
        if t_total == 0:
            continue
        max_c = max(counts.values())
        skew_pct = (max_c / t_total) * 100
        if skew_pct > max_topic_skew:
            max_topic_skew = skew_pct
        if skew_pct > 50.0:
            skewed_topics.append((tid, counts, skew_pct))
            errors.append(f"Topic {tid} has skewed distribution: max position {skew_pct:.1f}% (> 50.0%) counts: {counts}")
        if max_c == t_total:
            errors.append(f"Topic {tid} is monolithic (100% one choice): counts {counts}")

    print(f"\nPer-Topic Diversification:")
    print(f"  Max single-position concentration across all topics: {max_topic_skew:.2f}% (limit <= 50.0%)")
    print(f"  Topics exceeding 50% threshold: {len(skewed_topics)}")

    print(f"\n--- Verification Results ---")
    print(f"Total primary questions checked: {total_questions} across {len(all_target_ids)} topics")
    print(f"Total primary theories checked: {total_theories}")
    print(f"Total files checked: {(len(all_target_ids) + len(ALIASES)) * 2}")
    print(f"Total errors: {len(errors)}")
    print(f"Total warnings: {len(warnings)}")
    
    if errors:
        print("\nERRORS ENCOUNTERED:")
        for err in errors[:50]:
            print(f"  ❌ {err}")
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more errors")
        sys.exit(1)
    else:
        print("\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!")
        sys.exit(0)

if __name__ == "__main__":
    verify()
