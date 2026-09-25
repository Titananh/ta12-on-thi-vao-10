import json
import os

source_file = '/Users/anh/.gemini/antigravity/brain/dbb0041a-d118-49df-b096-b28edfdaf609/.system_generated/steps/125/output.txt'
target_file = '/Users/anh/Documents/Tiếng anh thi vào 10/data/taxonomy.json'

os.makedirs(os.path.dirname(target_file), exist_ok=True)

with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '```json\n'
start_idx = content.find(start_marker)
if start_idx != -1:
    json_str = content[start_idx + len(start_marker):]
    end_idx = json_str.rfind('\n```')
    if end_idx != -1:
        json_str = json_str[:end_idx]
    
    data = json.loads(json_str)
    with open(target_file, 'w', encoding='utf-8') as out:
        json.dump(data, out, ensure_ascii=False, indent=2)
    
    skills = data.get('skills', [])
    total_topics = 0
    total_questions = 0
    for s in skills:
        for cat in s.get('topicCategories', []):
            for t in cat.get('topics', []):
                total_topics += 1
                total_questions += t.get('totalQuestions', 0)
                
    print(f"Successfully saved taxonomy.json! Total skills: {len(skills)}, Total categories/topics: {total_topics}, Total questions in exam 9: {total_questions}")
else:
    print("Could not find json marker in source file")
