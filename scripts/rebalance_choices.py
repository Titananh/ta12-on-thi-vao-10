#!/usr/bin/env python3
"""
Choice Rebalancer Utility for Grade 10 English Question Bank.
Eliminates positional bias (~76% Choice A) by uniformly distributing
the correct answer across positions A (0), B (1), C (2), D (3) at ~25% each
across all 38 topics, while preserving all content, HTML formatting, and IDs.
"""

import json
import os
import random
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUESTIONS_DIR = os.path.join(PROJECT_ROOT, "data", "questions")

TARGET_TOPICS = {
    "Phonetics": [68, 69, 70, 72, 29, 30],
    "Grammar": [126, 127, 128, 130, 134, 140, 168, 551, 160, 106, 150, 116],
    "Vocabulary": [91, 95, 96, 35, 1659, 1645, 36],
    "Reading": [81, 82],
    "Speaking": [78, 79, 80]
}

ALIASES = [26, 27, 28, 307, 301, 141, 523, 73]


def get_topic_target_positions(topic_id, short_pos):
    """
    Generate a balanced sequence of 15 positions for a topic.
    For 15 questions: 3 questions at short_pos, 4 questions at each of the other 3 positions.
    Total = 3 + 4 + 4 + 4 = 15.
    Shuffled deterministically using topic_id as seed.
    Special preservation: Topic 82 questions 82_3 (index 2) and 82_13 (index 12)
    keep position 0 (A) because their explanations explicitly reference "phương án A".
    """
    pos_list = []
    for p in range(4):
        count = 3 if p == short_pos else 4
        pos_list.extend([p] * count)

    rng = random.Random(topic_id * 1000 + 42)
    rng.shuffle(pos_list)

    if topic_id == 82:
        # Ensure index 2 and index 12 are position 0
        for fixed_idx in [2, 12]:
            if pos_list[fixed_idx] != 0:
                # Find an index k not in {2, 12} where pos_list[k] == 0 and swap
                candidates = [k for k in range(len(pos_list)) if k not in (2, 12) and pos_list[k] == 0]
                if candidates:
                    swap_idx = candidates[0]
                    pos_list[fixed_idx], pos_list[swap_idx] = pos_list[swap_idx], pos_list[fixed_idx]

    return pos_list


def rebalance_all():
    primary_topic_ids = []
    for skill, topics in TARGET_TOPICS.items():
        primary_topic_ids.extend(topics)

    all_topics = [(tid, "primary", idx % 4) for idx, tid in enumerate(primary_topic_ids)]
    all_topics.extend([(aid, "alias", idx % 4) for idx, aid in enumerate(ALIASES)])

    print(f"Rebalancing choices across {len(all_topics)} topics...")

    global_stats = {0: 0, 1: 0, 2: 0, 3: 0}
    primary_stats = {0: 0, 1: 0, 2: 0, 3: 0}
    alias_stats = {0: 0, 1: 0, 2: 0, 3: 0}
    total_rebalanced_questions = 0

    for topic_id, kind, short_pos in all_topics:
        file_path = os.path.join(QUESTIONS_DIR, f"{topic_id}.json")
        if not os.path.isfile(file_path):
            print(f"ERROR: Missing file {file_path}", file=sys.stderr)
            sys.exit(1)

        with open(file_path, "r", encoding="utf-8") as f:
            questions = json.load(f)

        if not isinstance(questions, list) or len(questions) != 15:
            print(f"ERROR: Topic {topic_id} has unexpected question count: {len(questions)}", file=sys.stderr)
            sys.exit(1)

        target_positions = get_topic_target_positions(topic_id, short_pos)

        for q_idx, q in enumerate(questions):
            choices = q.get("choices", [])
            correct_id = q.get("correctChoiceId")

            if len(choices) != 4:
                print(f"ERROR: {q['id']} does not have 4 choices", file=sys.stderr)
                sys.exit(1)

            # Locate current index of correct choice
            current_idx = None
            for idx, c in enumerate(choices):
                if c.get("id") == correct_id:
                    current_idx = idx
                    break

            if current_idx is None:
                print(f"ERROR: {q['id']} correctChoiceId '{correct_id}' not found among choices", file=sys.stderr)
                sys.exit(1)

            target_idx = target_positions[q_idx]

            # Permute choices so correctChoiceId is at target_idx
            if current_idx != target_idx:
                correct_choice = choices.pop(current_idx)
                choices.insert(target_idx, correct_choice)
                q["choices"] = choices

            # Safety assertion
            assert q["choices"][target_idx]["id"] == correct_id, f"Integrity error in {q['id']}"
            assert len(q["choices"]) == 4, f"Choice count error in {q['id']}"

            global_stats[target_idx] += 1
            if kind == "primary":
                primary_stats[target_idx] += 1
            else:
                alias_stats[target_idx] += 1

            total_rebalanced_questions += 1

        # Write back neatly formatted JSON
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
            f.write("\n")

    print(f"Successfully rebalanced {total_rebalanced_questions} questions across {len(all_topics)} files.")
    print("\n--- Distribution Summary ---")
    letters = ["A", "B", "C", "D"]
    print("Global Distribution (570 questions):")
    for p in range(4):
        cnt = global_stats[p]
        pct = (cnt / total_rebalanced_questions) * 100
        print(f"  Position {p} ({letters[p]}): {cnt} ({pct:.2f}%)")

    primary_total = sum(primary_stats.values())
    print(f"\nPrimary Topics Distribution ({primary_total} questions):")
    for p in range(4):
        cnt = primary_stats[p]
        pct = (cnt / primary_total) * 100
        print(f"  Position {p} ({letters[p]}): {cnt} ({pct:.2f}%)")

    alias_total = sum(alias_stats.values())
    print(f"\nAlias Topics Distribution ({alias_total} questions):")
    for p in range(4):
        cnt = alias_stats[p]
        pct = (cnt / alias_total) * 100
        print(f"  Position {p} ({letters[p]}): {cnt} ({pct:.2f}%)")


if __name__ == "__main__":
    rebalance_all()
