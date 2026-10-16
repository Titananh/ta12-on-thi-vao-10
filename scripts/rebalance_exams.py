import json
import random
import os

def rebalance_exams():
    with open('/tmp/exams_hk1.json', 'r', encoding='utf-8') as f:
        exams = json.load(f)

    # Deterministic seeds for natural realistic exam feeling
    seeds = [101, 202, 303]

    for exam_idx, exam in enumerate(exams):
        rng = random.Random(seeds[exam_idx])

        # Find fixed questions (Q1-4 and Q31-34)
        fixed_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        for q in exam['questions']:
            if q['id'] in [1, 2, 3, 4, 31, 32, 33, 34]:
                fixed_counts[q['correctAnswer']] += 1

        needed = {k: 10 - fixed_counts[k] for k in 'ABCD'}
        pool = []
        for k, v in needed.items():
            pool.extend([k] * v)
        rng.shuffle(pool)

        pool_idx = 0
        for q in exam['questions']:
            if q['id'] in [1, 2, 3, 4, 31, 32, 33, 34]:
                continue  # Keep original

            target_letter = pool[pool_idx]
            pool_idx += 1

            old_correct_letter = q['correctAnswer']
            old_options = q['options']

            # Find the correct option item
            correct_opt = None
            other_opts = []
            for opt in old_options:
                if opt['id'] == old_correct_letter:
                    correct_opt = opt
                else:
                    other_opts.append(opt)

            # Target index: 0 for A, 1 for B, 2 for C, 3 for D
            target_idx = 'ABCD'.index(target_letter)
            rng.shuffle(other_opts)

            new_options = []
            other_idx = 0
            for i in range(4):
                if i == target_idx:
                    new_options.append({
                        'id': 'ABCD'[i],
                        'content': correct_opt['content']
                    })
                else:
                    new_options.append({
                        'id': 'ABCD'[i],
                        'content': other_opts[other_idx]['content']
                    })
                    other_idx += 1

            q['options'] = new_options
            q['correctAnswer'] = target_letter

        # Verify final distribution
        final_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
        for q in exam['questions']:
            final_counts[q['correctAnswer']] += 1
        print(f"Exam {exam['code']} final key distribution:", final_counts)

    # Save to /tmp/exams_hk1.json
    with open('/tmp/exams_hk1.json', 'w', encoding='utf-8') as f:
        json.dump(exams, f, ensure_ascii=False, indent=2)

    # Export to TypeScript files
    ts_header = """export interface ExamOption {
  id: 'A' | 'B' | 'C' | 'D';
  content: string;
}

export interface ExamQuestion {
  id: number;
  part: string;
  instruction?: string;
  readingText?: string;
  content: string;
  options: ExamOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  translation?: string;
  unitTopic?: string;
}

export interface HK1Exam {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  totalQuestions?: number;
  durationMinutes: number;
  description: string;
  difficulty: string;
  questions: ExamQuestion[];
  [key: string]: any;
}

export const HK1_EXAMS: HK1Exam[] = """

    json_str = json.dumps(exams, ensure_ascii=False, indent=2)
    ts_content = ts_header + json_str + ";\n"

    with open('src/data/exams_hk1.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

    with open('portal-de-thi/src/data/exams_hk1.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print("Successfully updated src/data/exams_hk1.ts and portal-de-thi/src/data/exams_hk1.ts")

if __name__ == '__main__':
    rebalance_exams()
