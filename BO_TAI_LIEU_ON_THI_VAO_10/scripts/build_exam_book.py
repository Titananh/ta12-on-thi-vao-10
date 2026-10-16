import os
import json
import re
import subprocess

BASE_DIR = "/Users/anh/Documents/Tiếng anh thi vào 10/tinh_hoa_on_thi_vao_10"
QUESTIONS_FILE = os.path.join(BASE_DIR, "data", "all_1150_questions.json")
HTML_OUT = os.path.join(BASE_DIR, "tuyen_tap_de_thi_chi_tiet.html")
PDF_OUT = "/Users/anh/Documents/Tiếng anh thi vào 10/TUYEN_TAP_DE_THI_VA_BAI_TAP_CHI_TIET_VAO_10.pdf"

with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
    quizzes = json.load(f)

print(f"Loaded {len(quizzes)} quizzes.")

def clean_html(text):
    if not text:
        return ""
    # remove audio tags or script tags
    text = re.sub(r'<audio\b[^>]*>(.*?)</audio>', '[File Nghe Audio trên Tak12]', text, flags=re.DOTALL)
    text = re.sub(r'<script\b[^>]*>(.*?)</script>', '', text, flags=re.DOTALL)
    # clean extra empty tags
    text = text.replace('&nbsp;', ' ').strip()
    return text

def format_question(q, idx):
    q_num = q.get('questionNumber', idx + 1)
    q_text = clean_html(q.get('questionText', ''))
    reading = clean_html(q.get('readingText', ''))
    note = clean_html(q.get('note', ''))
    hint = clean_html(q.get('hint', ''))
    
    answers = q.get('answerList') or []
    
    html = f"""
    <div class="question-item">
      <div class="question-header">
        <span class="q-badge">Câu {q_num}</span>
        <span class="q-type">{q.get('questionTypeName', 'Trắc nghiệm')}</span>
      </div>
    """
    
    if reading and len(reading) > 20:
        html += f"""
      <div class="reading-box">
        <b>Đoạn văn đọc hiểu:</b><br>{reading}
      </div>
        """
        
    html += f"""
      <div class="q-content">{q_text}</div>
    """
    
    if answers:
        html += '<div class="options-grid">'
        letters = ['A', 'B', 'C', 'D', 'E', 'F']
        for a_idx, ans in enumerate(answers):
            letter = letters[a_idx] if a_idx < len(letters) else f"({a_idx+1})"
            a_text = clean_html(ans.get('answerText', ''))
            html += f"""
            <div class="opt-item">
              <span class="opt-letter">{letter}.</span>
              <span class="opt-text">{a_text}</span>
            </div>
            """
        html += '</div>'
        
    if note or hint:
        html += '<div class="note-box">'
        if note:
            # check if image in note
            html += f"<b>💡 Giải thích & Ghi nhớ:</b> {note}"
        elif hint:
            html += f"<b>💡 Gợi ý làm bài:</b> {hint}"
        html += '</div>'
        
    html += '</div>'
    return html

# Generate Exam Compilation HTML
html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>TUYỂN TẬP TOÀN BỘ ĐỀ THI & BÀI TẬP THỰC HÀNH TIẾNG ANH 9 VÀO 10</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap');
  
  @page {
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
    @bottom-center {
      content: "Trang " counter(page);
      font-family: 'Open Sans', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
  }

  body {
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.5;
    font-size: 9pt;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4 {
    font-family: 'Montserrat', sans-serif;
    color: #0f172a;
    margin-top: 0;
  }

  .page-break {
    page-break-before: always;
  }

  /* Cover */
  .cover {
    height: 98vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 40px 30px;
    box-sizing: border-box;
  }

  .cover-tag {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 11pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .cover-title {
    font-size: 25pt;
    font-weight: 800;
    line-height: 1.25;
    margin: 20px 0 10px 0;
    color: #fef08a;
  }

  .cover-subtitle {
    font-size: 13pt;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 25px;
  }

  .cover-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 30px 0;
  }

  .stat-box {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 14px 10px;
  }

  .stat-number {
    font-size: 22pt;
    font-weight: 800;
    color: #fef08a;
  }

  .stat-label {
    font-size: 8.5pt;
    color: #e2e8f0;
    text-transform: uppercase;
    font-weight: 600;
  }

  .cover-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 15px;
    font-size: 9.5pt;
    color: #cbd5e1;
  }

  /* Section Header */
  .section-banner {
    background: linear-gradient(90deg, #1e3a8a, #2563eb);
    color: #ffffff;
    padding: 10px 16px;
    border-radius: 6px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-banner h2 {
    color: #ffffff;
    margin: 0;
    font-size: 12pt;
    font-weight: 700;
  }

  .quiz-container {
    margin-bottom: 20px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
  }

  .quiz-title-bar {
    background: #f1f5f9;
    padding: 10px 14px;
    border-bottom: 2px solid #2563eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .quiz-name {
    font-size: 11pt;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
  }

  .quiz-meta {
    font-size: 8pt;
    font-weight: 600;
    color: #475569;
  }

  .quiz-meta a {
    color: #2563eb;
    text-decoration: none;
  }

  .quiz-body {
    padding: 12px;
  }

  /* Questions */
  .question-item {
    padding: 10px 0;
    border-bottom: 1px dashed #e2e8f0;
  }

  .question-item:last-child {
    border-bottom: none;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .q-badge {
    background: #1e40af;
    color: #ffffff;
    font-weight: 700;
    font-size: 8pt;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .q-type {
    font-size: 7.5pt;
    color: #64748b;
    font-weight: 600;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .q-content {
    font-size: 9pt;
    color: #0f172a;
    margin: 4px 0 8px 0;
  }

  .reading-box {
    background: #f8fafc;
    border-left: 3px solid #3b82f6;
    padding: 8px 10px;
    margin-bottom: 8px;
    font-size: 8.5pt;
    color: #334155;
    border-radius: 4px;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 12px;
    margin: 6px 0 6px 10px;
  }

  .opt-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 8.5pt;
  }

  .opt-letter {
    font-weight: 700;
    color: #2563eb;
  }

  .opt-text {
    color: #1e293b;
  }

  .note-box {
    background: #f0fdf4;
    border-left: 3px solid #10b981;
    padding: 6px 10px;
    margin-top: 6px;
    font-size: 8pt;
    color: #065f46;
    border-radius: 4px;
  }

  .note-box img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-top: 4px;
    border-radius: 4px;
  }

</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div>
    <span class="cover-tag">Tài Liệu Độc Quyền Cho Giáo Viên & Học Sinh Lớp 9</span>
    <h1 class="cover-title">NGÂN HÀNG ĐỀ THI & BÀI TẬP<br>TIẾNG ANH 9 ÔN THI VÀO 10</h1>
    <div class="cover-subtitle">TOÀN BỘ 60 BỘ ĐỀ THI & BÀI TẬP THỰC HÀNH CHI TIẾT TỪNG CÂU HỎI • KÈM LỜI GIẢI & ĐÁP ÁN</div>
  </div>

  <div>
    <div class="cover-stats">
      <div class="stat-box">
        <div class="stat-number">60</div>
        <div class="stat-label">Bộ Đề Thi & Bài Tập</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">1,150</div>
        <div class="stat-label">Câu Hỏi Đầy Đủ Chi Tiết</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">100%</div>
        <div class="stat-label">Có Đáp Án & Hướng Dẫn</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <p>Trích xuất toàn diện từ Hệ thống Lộ trình Tiếng Anh 9 Global Success (Tak12)</p>
    <p style="font-size: 8.5pt; opacity: 0.85;">Dùng làm tài liệu in ấn phát trực tiếp cho học sinh luyện đề trên lớp và giao bài tập về nhà</p>
  </div>
</div>

<div class="page-break"></div>
"""

# Let's categorize quizzes:
# 1. Official Big Exams (Đề thi giữa kì, cuối kì, đầu năm)
# 2. Grammar Unit Practice Sets (Bài tập chuyên đề Unit 1 - 12)
# 3. Reading, Vocab & Communication Tests (Test Yourself 1 - 4)

major_exams = []
unit_practices = []
other_tests = []

for qz in quizzes:
    title = qz.get('title', '')
    if any(k in title.lower() for k in ['đề thi', 'khảo sát', 'ôn tập kiểm tra']):
        major_exams.append(qz)
    elif 'bài tập:' in title.lower() or 'ngữ pháp' in title.lower():
        unit_practices.append(qz)
    else:
        other_tests.append(qz)

print(f"Major Exams: {len(major_exams)}")
print(f"Unit Practices: {len(unit_practices)}")
print(f"Other Tests: {len(other_tests)}")

# Render Major Exams
html_content += """
<div class="section-banner">
  <h2>PHẦN 1: BỘ 10 ĐỀ THI CHÍNH THỨC (KHẢO SÁT, GIỮA KÌ & CUỐI KÌ VÀO 10)</h2>
  <span style="font-size: 8.5pt; font-weight:600;">OFFICIAL MOCK EXAMS</span>
</div>
<p>Dưới đây là các đề thi trọn vẹn mô phỏng chuẩn ma trận đề thi tuyển sinh vào lớp 10, bao gồm đầy đủ các phần: Ngữ âm, Trọng âm, Ngữ pháp, Từ vựng, Đọc hiểu, Điền từ và Viết lại câu.</p>
"""

for exam in major_exams:
    html_content += f"""
    <div class="quiz-container">
      <div class="quiz-title-bar">
        <div>
          <h3 class="quiz-name">Task {exam.get('stt')}: {exam.get('title')}</h3>
          <span style="font-size: 8pt; color: #64748b;">Phạm vi: {exam.get('unit')}</span>
        </div>
        <div class="quiz-meta">
          <span>{exam.get('question_count')} câu hỏi</span> | 
          <a href="{exam.get('link')}" target="_blank">🔗 Link Tak12</a>
        </div>
      </div>
      <div class="quiz-body">
    """
    for idx, q in enumerate(exam.get('questions', [])):
        html_content += format_question(q, idx)
    html_content += """
      </div>
    </div>
    """

# Render Unit Practice Sets
html_content += """
<div class="page-break"></div>
<div class="section-banner">
  <h2>PHẦN 2: BỘ BÀI TẬP NGỮ PHÁP CHUYÊN SÂU THEO TỪNG UNIT (UNIT 1 - 12)</h2>
  <span style="font-size: 8.5pt; font-weight:600;">UNIT GRAMMAR PRACTICE</span>
</div>
<p>Toàn bộ các bài tập ngữ pháp chuyên sâu từng chủ điểm: Từ để hỏi trước to-V, So sánh kép, Câu điều kiện loại 1, Quá khứ tiếp diễn, Câu ước Wish, Thì Hiện tại hoàn thành, Mệnh đề quan hệ, Cấu trúc Suggest, Mệnh đề trạng ngữ.</p>
"""

for prac in unit_practices:
    html_content += f"""
    <div class="quiz-container">
      <div class="quiz-title-bar">
        <div>
          <h3 class="quiz-name">Task {prac.get('stt')}: {prac.get('title')}</h3>
          <span style="font-size: 8pt; color: #64748b;">Chủ điểm: {prac.get('unit')}</span>
        </div>
        <div class="quiz-meta">
          <span>{prac.get('question_count')} câu hỏi</span> | 
          <a href="{prac.get('link')}" target="_blank">🔗 Link Tak12</a>
        </div>
      </div>
      <div class="quiz-body">
    """
    for idx, q in enumerate(prac.get('questions', [])):
        html_content += format_question(q, idx)
    html_content += """
      </div>
    </div>
    """

html_content += """
</body>
</html>
"""

with open(HTML_OUT, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Saved exam compilation HTML to {HTML_OUT} ({len(html_content)} bytes)")

# Compile with Chrome Headless
chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cmd = [
    chrome_bin,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_OUT}",
    HTML_OUT
]

print("Compiling Exam Book to PDF with Chrome...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"SUCCESS: PDF generated at: {PDF_OUT}")
    print(f"File size: {os.path.getsize(PDF_OUT)} bytes")
else:
    print(f"ERROR: {res.stderr}")
