import os
import re
import json
import time
import urllib.request
import urllib.parse

BASE_DIR = "/Users/anh/Documents/Tiếng anh thi vào 10/tinh_hoa_on_thi_vao_10"
SLIDES_DIR = os.path.join(BASE_DIR, "slides")
DATA_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(SLIDES_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def safe_download_image(img_url, filename_prefix="img"):
    if not img_url:
        return None
    full_url = img_url
    if img_url.startswith('//'):
        full_url = 'https:' + img_url
    elif img_url.startswith('/'):
        full_url = 'https://tak12.com' + urllib.parse.quote(img_url)
    elif not img_url.startswith('http'):
        full_url = 'https://tak12.com/' + urllib.parse.quote(img_url)
    
    clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', os.path.basename(img_url.split('?')[0]))
    if not clean_name or len(clean_name) < 4:
        clean_name = f"{filename_prefix}_{int(time.time()*1000)}.png"
    target_path = os.path.join(SLIDES_DIR, clean_name)
    
    if os.path.exists(target_path) and os.path.getsize(target_path) > 100:
        return clean_name

    try:
        req = urllib.request.Request(full_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            if len(content) > 100:
                with open(target_path, 'wb') as f:
                    f.write(content)
                print(f"  [DOWNLOADED IMAGE] {clean_name} ({len(content)} bytes)")
                return clean_name
    except Exception as e:
        # try data.tak12.com fallback
        if 'tak12.com' in full_url:
            alt_url = full_url.replace('tak12.com', 'data.tak12.com')
            try:
                req = urllib.request.Request(alt_url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    content = resp.read()
                    if len(content) > 100:
                        with open(target_path, 'wb') as f:
                            f.write(content)
                        print(f"  [DOWNLOADED IMAGE via data.tak12.com] {clean_name}")
                        return clean_name
            except Exception:
                pass
        print(f"  [ERR IMAGE] {img_url}: {e}")
    return None

def fetch_quiz_data(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"  [ERR FETCH QUIZ] {url}: {e}")
        return None, []
    
    m_quiz = re.search(r'window\.quiz\s*=\s*(\{.*?\});\s*(?:window\.|\n|<)', html, re.DOTALL)
    m_q = re.search(r'window\.questions\s*=\s*(\[.*?\]);\s*(?:window\.|\n|<)', html, re.DOTALL)
    
    quiz_obj = {}
    questions = []
    
    if m_quiz:
        try:
            d = json.loads(m_quiz.group(1))
            quiz_obj = d.get('quiz', {})
            if not questions and 'questions' in d:
                questions = d.get('questions', [])
        except Exception:
            pass
            
    if m_q and not questions:
        try:
            questions = json.loads(m_q.group(1))
        except Exception:
            pass
            
    return quiz_obj, questions

def fetch_related_topic(qid):
    api_url = f"https://data.tak12.com/api/services/app/quizPublic/getRelatedTopicOfQuestion?questionId={qid}"
    req = urllib.request.Request(api_url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('result', {}).get('listQuestionTopicDetail', [])
    except Exception as e:
        return []

def main():
    with open('/tmp/all_tasks.txt', 'r', encoding='utf-8') as f:
        tasks = [line.strip().split(' | ') for line in f if line.strip()]
    
    print(f"Loaded {len(tasks)} tasks.")
    
    knowledge_base = {
        'tasks': [],
        'units': {},
        'grammar_slides': [],
        'traps_and_notes': [],
        'youtube_videos': [],
        'vocabulary_units': []
    }
    
    seen_images = set()
    seen_related_topics = set()
    
    for idx, item in enumerate(tasks):
        stt = item[0]
        unit = item[1] if len(item) > 1 else ''
        title = item[2] if len(item) > 2 else ''
        link = item[3] if len(item) > 3 else ''
        
        task_data = {
            'stt': stt,
            'unit': unit,
            'title': title,
            'link': link,
            'type': 'other',
            'details': {}
        }
        
        print(f"\nProcessing [{stt}] {unit} - {title}...")
        
        if 'youtube.com' in link:
            task_data['type'] = 'youtube'
            task_data['details'] = {'video_url': link}
            knowledge_base['youtube_videos'].append({
                'stt': stt,
                'unit': unit,
                'title': title,
                'url': link
            })
            print(f"  -> Added Youtube Video: {title}")
            
        elif 'blog.azvocab.ai' in link:
            task_data['type'] = 'vocab'
            task_data['details'] = {'blog_url': link}
            print(f"  -> AzVocab Link for {unit}")
            
        elif 'tak12.com' in link:
            if '/q/' in link:
                task_data['type'] = 'tak12_quiz'
                quiz_obj, questions = fetch_quiz_data(link)
                task_data['details'] = {
                    'quiz_id': quiz_obj.get('id'),
                    'name': quiz_obj.get('quizName', title),
                    'question_count': len(questions),
                    'questions_sample': []
                }
                print(f"  -> Tak12 Quiz parsed: {len(questions)} questions")
                
                # Extract images and related topics from questions
                for q_idx, q in enumerate(questions):
                    note = q.get('note', '') or ''
                    hint = q.get('hint', '') or ''
                    q_id = q.get('id')
                    
                    # Search images in note
                    imgs = re.findall(r'<img\b[^>]*src=[\"\']([^\"\']+)[\"\']', note)
                    for img in imgs:
                        if img not in seen_images:
                            seen_images.add(img)
                            saved = safe_download_image(img, f"slide_{stt}_{q_idx}")
                            if saved:
                                knowledge_base['grammar_slides'].append({
                                    'unit': unit,
                                    'title': title,
                                    'image': saved,
                                    'orig_src': img
                                })
                                
                    # If showRelatedTopicDetail is true, fetch it
                    if q.get('showRelatedTopicDetail') and q_id:
                        topics = fetch_related_topic(q_id)
                        for top in topics:
                            t_name = top.get('name') or ''
                            t_detail = top.get('detail') or ''
                            if t_name and t_name not in seen_related_topics:
                                seen_related_topics.add(t_name)
                                print(f"    * Topic detail found: {t_name}")
                                # extract images from topic detail
                                t_imgs = re.findall(r'<img\b[^>]*src=[\"\']([^\"\']+)[\"\']', t_detail)
                                saved_t_imgs = []
                                for ti in t_imgs:
                                    sim = safe_download_image(ti, f"topic_{t_name[:10]}")
                                    if sim:
                                        saved_t_imgs.append(sim)
                                # extract youtube from topic detail
                                t_yts = re.findall(r'src=[\"\']([^\"\']*youtube\.com[^\"]*)[\"\']', t_detail)
                                
                                knowledge_base['traps_and_notes'].append({
                                    'unit': unit,
                                    'name': t_name,
                                    'detail_html': t_detail,
                                    'images': saved_t_imgs,
                                    'youtube': t_yts
                                })
                                
                    # Keep important questions for practice bank
                    if q_idx < 5:
                        q_text = q.get('questionText') or ''
                        raw_answers = q.get('answerList') or []
                        answers = [a.get('answerText', '') for a in raw_answers if isinstance(a, dict)]
                        task_data['details']['questions_sample'].append({
                            'id': q_id,
                            'number': q.get('questionNumber'),
                            'text': q_text,
                            'answers': answers,
                            'note': note,
                            'hint': hint
                        })
                        
            elif '/t/' in link:
                task_data['type'] = 'tak12_chuyende'
                print(f"  -> Tak12 Chuyen de topic")
                # Also try to fetch any embedded canva or description
                try:
                    req = urllib.request.Request(link.split('?')[0], headers=HEADERS)
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        c_html = resp.read().decode('utf-8', errors='ignore')
                    canva = re.findall(r'https?://(?:www\.)?canva\.com/design/[^\s\"\'<>]+', c_html)
                    task_data['details']['canva'] = canva
                except Exception:
                    pass
                    
        knowledge_base['tasks'].append(task_data)
        time.sleep(0.3)
        
    out_file = os.path.join(DATA_DIR, "knowledge_base.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
        
    print(f"\n==========================================")
    print(f"CRAWL COMPLETE!")
    print(f"Total tasks: {len(knowledge_base['tasks'])}")
    print(f"Total unique grammar slides downloaded: {len(knowledge_base['grammar_slides'])}")
    print(f"Total related topics extracted: {len(knowledge_base['traps_and_notes'])}")
    print(f"Total YouTube videos recorded: {len(knowledge_base['youtube_videos'])}")
    print(f"Data saved to: {out_file}")

if __name__ == '__main__':
    main()
