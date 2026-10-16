import json
import re
import html
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

# Color palette
COLOR_PRIMARY = RGBColor(28, 88, 31)      # #1C581F Dark Forest Green
COLOR_ACCENT = RGBColor(39, 174, 96)      # #27AE60 Brand Green
COLOR_NAVY = RGBColor(27, 54, 93)         # #1B365D Deep Navy
COLOR_DARK = RGBColor(44, 62, 80)         # #2C3E50 Body Text Dark
COLOR_MUTED = RGBColor(100, 116, 139)     # #64748B Muted Slate
COLOR_KEY = RGBColor(185, 28, 28)         # #B91C1C Red highlight
COLOR_LIGHT_BG = "F4FBF5"                # Very light green tint
COLOR_BORDER = "CBD5E1"                  # Slate border

HEX_PRIMARY = "1C581F"
HEX_ACCENT = "27AE60"
HEX_NAVY = "1B365D"
HEX_LIGHT_GRAY = "F8FAFC"
HEX_LIGHT_GREEN = "EBF7EE"

def set_cell_background(cell, fill_hex):
    """Set the background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set cell internal margins (in dxa: 20 dxa = 1 pt)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="CCCCCC", sz="4", val="single"):
    """Apply borders to all cells in a table."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_callout_border(cell, border_color="1C581F", border_sz="24"):
    """Style a callout cell with a thick left border and none on other sides."""
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="single" w:sz="{border_sz}" w:space="0" w:color="{border_color}"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def add_formatted_text(paragraph, text, default_bold=False, default_italic=False, default_color=None, default_size=11):
    """Parse inline HTML tags like <b>, <i>, <u>, <br>, &nbsp; into Word runs."""
    if not text:
        return
    text = html.unescape(text)
    tokens = re.split(r'(<[^>]+>)', text)
    bold = default_bold
    italic = default_italic
    underline = False

    for token in tokens:
        if not token:
            continue
        t_low = token.lower()
        if t_low in ('<b>', '<strong>'):
            bold = True
        elif t_low in ('</b>', '</strong>'):
            bold = False
        elif t_low in ('<i>', '<em>'):
            italic = True
        elif t_low in ('</i>', '</em>'):
            italic = False
        elif t_low == '<u>':
            underline = True
        elif t_low == '</u>':
            underline = False
        elif t_low in ('<br>', '<br/>', '<br />'):
            paragraph.add_run('\n')
        elif t_low in ('<p>', '</p>'):
            paragraph.add_run('\n')
        elif token.startswith('<') and token.endswith('>'):
            continue  # Skip other unknown HTML tags
        else:
            run = paragraph.add_run(token)
            run.bold = bold
            run.italic = italic
            run.underline = underline
            run.font.name = "Times New Roman"
            run.font.size = Pt(default_size)
            if default_color:
                run.font.color.rgb = default_color

def build_word_document():
    # Load JSON data exported earlier
    json_path = '/tmp/exams_hk1.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        exams = json.load(f)

    doc = docx.Document()

    # Configure A4 page and standard 2cm margins
    sections = doc.sections
    for s in sections:
        s.page_width = Inches(8.27)    # 210 mm
        s.page_height = Inches(11.69)  # 297 mm
        s.top_margin = Inches(0.75)    # ~1.9 cm
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    # Base style setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = COLOR_DARK
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # =========================================================================
    # COVER / MASTER TITLE SECTION
    # =========================================================================
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_header.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO — TÀI LIỆU ÔN THI TUYỂN SINH VÀO LỚP 10 THPT\n")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(10)
    r_sub.bold = True
    r_sub.font.color.rgb = COLOR_MUTED

    r_title = p_header.add_run("BỘ 3 ĐỀ KIỂM TRA HỌC KỲ 1 — TIẾNG ANH 9 GLOBAL SUCCESS\n")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(17)
    r_title.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY

    r_desc = p_header.add_run("TRỌNG TÂM KIẾN THỨC 6 UNIT ĐẦU (UNIT 1 — UNIT 6) · CHUẨN MA TRẬN ĐỀ THI VÀO 10\n"
                              "Thời gian làm bài: 60 phút / đề · Quy mô: 40 câu trắc nghiệm khách quan\n"
                              "Bao gồm: Đề thi chuẩn hóa + Bảng ma trận đáp án + Lời giải ngữ pháp chi tiết & Dịch nghĩa")
    r_desc.font.name = "Times New Roman"
    r_desc.font.size = Pt(10.5)
    r_desc.italic = True
    r_desc.font.color.rgb = COLOR_DARK
    p_header.paragraph_format.space_after = Pt(12)

    # Divider bar
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_after = Pt(14)
    run_line = p_line.add_run("―" * 46)
    run_line.font.color.rgb = COLOR_ACCENT
    p_line.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # MASTER ANSWER KEY SHEET (BẢNG TỔNG HỢP ĐÁP ÁN CẢ 3 ĐỀ)
    # =========================================================================
    p_master_head = doc.add_paragraph()
    r_mh = p_master_head.add_run("⭐ BẢNG TỔNG HỢP ĐÁP ÁN NHANH CẢ 3 ĐỀ THI (40 CÂU)")
    r_mh.font.name = "Times New Roman"
    r_mh.font.size = Pt(12)
    r_mh.bold = True
    r_mh.font.color.rgb = COLOR_PRIMARY
    p_master_head.paragraph_format.space_after = Pt(6)

    # We will build a compact table with 4 columns: Câu, Đề 1, Đề 2, Đề 3,
    # or 2 sets of (Câu, Đề 1, Đề 2, Đề 3) side-by-side (8 columns) to fit in 20 rows!
    master_table = doc.add_table(rows=21, cols=8)
    master_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(master_table, color="B0C4DE", sz="4")

    # Header Row
    headers = ["Câu", "Đề 1", "Đề 2", "Đề 3", "Câu", "Đề 1", "Đề 2", "Đề 3"]
    for col_idx, h_text in enumerate(headers):
        cell = master_table.cell(0, col_idx)
        cell.text = h_text
        set_cell_background(cell, HEX_PRIMARY)
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            run.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    # Fill data for 40 questions (1-20 on left, 21-40 on right)
    for i in range(1, 21):
        # Left half (Q1 to Q20)
        row_cells = master_table.rows[i].cells
        # Col 0: Câu
        row_cells[0].text = str(i)
        # Col 1, 2, 3: Đề 1, Đề 2, Đề 3
        row_cells[1].text = exams[0]['questions'][i - 1]['correctAnswer']
        row_cells[2].text = exams[1]['questions'][i - 1]['correctAnswer']
        row_cells[3].text = exams[2]['questions'][i - 1]['correctAnswer']

        # Right half (Q21 to Q40)
        q_right = i + 20
        row_cells[4].text = str(q_right)
        row_cells[5].text = exams[0]['questions'][q_right - 1]['correctAnswer']
        row_cells[6].text = exams[1]['questions'][q_right - 1]['correctAnswer']
        row_cells[7].text = exams[2]['questions'][q_right - 1]['correctAnswer']

        # Styling each cell in the row
        bg_color = HEX_LIGHT_GRAY if i % 2 == 1 else "FFFFFF"
        for col_idx in range(8):
            cell = row_cells[col_idx]
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(9.5)
                if col_idx in (0, 4):
                    run.bold = True
                    run.font.color.rgb = COLOR_PRIMARY
                else:
                    run.bold = True
                    run.font.color.rgb = COLOR_KEY

    p_note = doc.add_paragraph()
    r_nt = p_note.add_run("* Thang điểm: Mỗi câu trả lời đúng được 0.25 điểm. Tổng điểm bài thi = 10.0 điểm.")
    r_nt.font.size = Pt(9.5)
    r_nt.italic = True
    r_nt.font.color.rgb = COLOR_MUTED
    p_note.paragraph_format.space_before = Pt(6)
    p_note.paragraph_format.space_after = Pt(16)

    # =========================================================================
    # PROCESS EACH EXAM (ĐỀ 1, ĐỀ 2, ĐỀ 3)
    # =========================================================================
    for exam_idx, exam in enumerate(exams):
        doc.add_page_break()

        # ---------------------------------------------------------------------
        # EXAM HEADER
        # ---------------------------------------------------------------------
        table_top = doc.add_table(rows=1, cols=2)
        table_top.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell_l, cell_r = table_top.rows[0].cells
        
        # Left header
        p_l = cell_l.paragraphs[0]
        r1 = p_l.add_run("SỞ GIÁO DỤC VÀ ĐÀO TẠO\n")
        r1.bold = True
        r1.font.size = Pt(10)
        r2 = p_l.add_run("TRƯỜNG THCS & THPT CLC\n")
        r2.bold = True
        r2.font.size = Pt(10)
        r3 = p_l.add_run("MÃ ĐỀ THI: " + exam['code'])
        r3.bold = True
        r3.font.color.rgb = COLOR_PRIMARY
        r3.font.size = Pt(10.5)
        p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT

        # Right header
        p_r = cell_r.paragraphs[0]
        r4 = p_r.add_run("KỲ KIỂM TRA HỌC KỲ 1 — TIẾNG ANH 9\n")
        r4.bold = True
        r4.font.size = Pt(10.5)
        r5 = p_r.add_run("NĂM HỌC 2026 – 2027\n")
        r5.font.size = Pt(10)
        r6 = p_r.add_run("Thời gian làm bài: 60 phút (Không kể phát đề)\n")
        r6.font.size = Pt(9.5)
        r6.italic = True
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT

        p_ex_title = doc.add_paragraph()
        p_ex_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_ex_title.paragraph_format.space_before = Pt(8)
        p_ex_title.paragraph_format.space_after = Pt(2)
        r_t = p_ex_title.add_run(exam['title'].upper() + "\n")
        r_t.bold = True
        r_t.font.size = Pt(13)
        r_t.font.color.rgb = COLOR_PRIMARY

        r_sub = p_ex_title.add_run(f"({exam['description']})")
        r_sub.font.size = Pt(9.5)
        r_sub.italic = True
        r_sub.font.color.rgb = COLOR_MUTED

        p_stu_info = doc.add_paragraph()
        p_stu_info.paragraph_format.space_after = Pt(12)
        r_si = p_stu_info.add_run("Họ và tên thí sinh: .................................................................... Số báo danh / Lớp: ........................")
        r_si.font.size = Pt(10)
        r_si.italic = True

        # ---------------------------------------------------------------------
        # QUESTIONS SECTION
        # ---------------------------------------------------------------------
        current_part = ""

        for q in exam['questions']:
            q_id = q['id']

            # Part header
            if q.get('part') and q['part'] != current_part:
                current_part = q['part']
                p_part = doc.add_paragraph()
                p_part.paragraph_format.space_before = Pt(12)
                p_part.paragraph_format.space_after = Pt(3)
                r_p = p_part.add_run(f"✦ {current_part.upper()}")
                r_p.bold = True
                r_p.font.size = Pt(11)
                r_p.font.color.rgb = COLOR_PRIMARY

                if q.get('instruction'):
                    p_inst = doc.add_paragraph()
                    p_inst.paragraph_format.space_after = Pt(6)
                    r_ins = p_inst.add_run(f"Hướng dẫn: {q['instruction']}")
                    r_ins.font.size = Pt(10)
                    r_ins.italic = True
                    r_ins.font.color.rgb = COLOR_MUTED
            
            # Reading Text Box (for Q21 and Q26)
            if q.get('readingText'):
                p_box = doc.add_paragraph()
                p_box.paragraph_format.space_before = Pt(6)
                p_box.paragraph_format.space_after = Pt(6)

                tbl_box = doc.add_table(rows=1, cols=1)
                tbl_box.alignment = WD_TABLE_ALIGNMENT.CENTER
                cell_box = tbl_box.cell(0, 0)
                set_cell_background(cell_box, HEX_LIGHT_GRAY)
                set_callout_border(cell_box, border_color=HEX_PRIMARY, border_sz="20")
                set_cell_margins(cell_box, top=140, bottom=140, left=180, right=180)

                p_in_box = cell_box.paragraphs[0]
                p_in_box.paragraph_format.space_after = Pt(2)
                p_in_box.paragraph_format.line_spacing = 1.2
                r_box_title = p_in_box.add_run("📖 ĐOẠN VĂN ĐỌC:\n")
                r_box_title.bold = True
                r_box_title.font.size = Pt(10)
                r_box_title.font.color.rgb = COLOR_PRIMARY

                add_formatted_text(p_in_box, q['readingText'], default_size=10, default_italic=True)

            # Question Prompt
            p_q = doc.add_paragraph()
            p_q.paragraph_format.space_before = Pt(4)
            p_q.paragraph_format.space_after = Pt(2)
            p_q.paragraph_format.line_spacing = 1.15

            r_qnum = p_q.add_run(f"Câu {q_id}. ")
            r_qnum.bold = True
            r_qnum.font.size = Pt(11)
            r_qnum.font.color.rgb = COLOR_PRIMARY

            # Add question stem content
            add_formatted_text(p_q, q['content'], default_size=11)

            # If Q1-Q4, options are already part of content, so we do not print options table
            if q_id <= 4 and ('A.' in q['content'] and 'B.' in q['content']):
                continue

            # Options formatting (Q5 to Q40)
            opts = q.get('options', [])
            if opts:
                max_len = max(len(opt['content']) for opt in opts)

                if max_len <= 15:
                    # Single row table with 4 columns
                    tbl_opt = doc.add_table(rows=1, cols=4)
                    tbl_opt.alignment = WD_TABLE_ALIGNMENT.CENTER
                    for idx, opt in enumerate(opts):
                        c = tbl_opt.cell(0, idx)
                        p_c = c.paragraphs[0]
                        p_c.paragraph_format.space_after = Pt(2)
                        p_c.paragraph_format.space_before = Pt(1)
                        r_lbl = p_c.add_run(f"{opt['id']}. ")
                        r_lbl.bold = True
                        r_lbl.font.size = Pt(10.5)
                        add_formatted_text(p_c, opt['content'], default_size=10.5)
                elif max_len <= 38:
                    # 2 rows x 2 columns table
                    tbl_opt = doc.add_table(rows=2, cols=2)
                    tbl_opt.alignment = WD_TABLE_ALIGNMENT.CENTER
                    for idx, opt in enumerate(opts):
                        row_idx = idx // 2
                        col_idx = idx % 2
                        c = tbl_opt.cell(row_idx, col_idx)
                        p_c = c.paragraphs[0]
                        p_c.paragraph_format.space_after = Pt(2)
                        p_c.paragraph_format.space_before = Pt(1)
                        r_lbl = p_c.add_run(f"{opt['id']}. ")
                        r_lbl.bold = True
                        r_lbl.font.size = Pt(10.5)
                        add_formatted_text(p_c, opt['content'], default_size=10.5)
                else:
                    # 4 separate rows (vertical)
                    for opt in opts:
                        p_opt = doc.add_paragraph()
                        p_opt.paragraph_format.left_indent = Inches(0.2)
                        p_opt.paragraph_format.space_before = Pt(1)
                        p_opt.paragraph_format.space_after = Pt(1)
                        r_lbl = p_opt.add_run(f"{opt['id']}. ")
                        r_lbl.bold = True
                        r_lbl.font.size = Pt(10.5)
                        add_formatted_text(p_opt, opt['content'], default_size=10.5)

        # ---------------------------------------------------------------------
        # DETAILED ANSWER KEY & EXPLANATIONS SECTION
        # ---------------------------------------------------------------------
        doc.add_page_break()

        p_sol_head = doc.add_paragraph()
        p_sol_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sol_head.paragraph_format.space_before = Pt(10)
        p_sol_head.paragraph_format.space_after = Pt(4)
        r_sh1 = p_sol_head.add_run(f"ĐÁP ÁN & LỜI GIẢI CHI TIẾT — {exam['code']}\n")
        r_sh1.bold = True
        r_sh1.font.size = Pt(14)
        r_sh1.font.color.rgb = COLOR_PRIMARY

        r_sh2 = p_sol_head.add_run(f"{exam['title'].upper()}\n")
        r_sh2.bold = True
        r_sh2.font.size = Pt(11)
        r_sh2.font.color.rgb = COLOR_NAVY

        # Exam Quick Key Table (4 rows x 10 cols)
        p_tbl_lbl = doc.add_paragraph()
        p_tbl_lbl.paragraph_format.space_before = Pt(6)
        p_tbl_lbl.paragraph_format.space_after = Pt(4)
        r_tl = p_tbl_lbl.add_run("BẢNG ĐÁP ÁN NHANH (MÃ ĐỀ: " + exam['code'] + ")")
        r_tl.bold = True
        r_tl.font.size = Pt(10.5)
        r_tl.font.color.rgb = COLOR_PRIMARY

        table_key = doc.add_table(rows=8, cols=10)
        table_key.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table_key, color="B0C4DE", sz="4")

        # 4 blocks of 10 questions: (1-10), (11-20), (21-30), (31-40)
        for block_idx in range(4):
            row_q = table_key.rows[block_idx * 2]
            row_a = table_key.rows[block_idx * 2 + 1]

            for c_idx in range(10):
                q_num = block_idx * 10 + c_idx + 1
                q_ans = exam['questions'][q_num - 1]['correctAnswer']

                # Question number row
                cell_q = row_q.cells[c_idx]
                cell_q.text = str(q_num)
                set_cell_background(cell_q, HEX_LIGHT_GRAY)
                set_cell_margins(cell_q, top=40, bottom=40, left=40, right=40)
                p_q = cell_q.paragraphs[0]
                p_q.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_q.runs[0].font.name = "Times New Roman"
                p_q.runs[0].font.size = Pt(9)
                p_q.runs[0].bold = True

                # Answer row
                cell_a = row_a.cells[c_idx]
                cell_a.text = q_ans
                set_cell_background(cell_a, HEX_LIGHT_GREEN)
                set_cell_margins(cell_a, top=40, bottom=40, left=40, right=40)
                p_a = cell_a.paragraphs[0]
                p_a.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_a.runs[0].font.name = "Times New Roman"
                p_a.runs[0].font.size = Pt(10)
                p_a.runs[0].bold = True
                p_a.runs[0].font.color.rgb = COLOR_KEY

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(8)
        p_spacer.paragraph_format.space_after = Pt(4)
        r_sp = p_spacer.add_run("HƯỚNG DẪN GIẢI CHI TIẾT TỪNG CÂU & DỊCH NGHĨA:")
        r_sp.bold = True
        r_sp.font.size = Pt(11)
        r_sp.font.color.rgb = COLOR_PRIMARY

        # Detailed Question Explanations
        for q in exam['questions']:
            q_id = q['id']
            ans = q['correctAnswer']
            topic = q.get('unitTopic', 'Ngữ pháp & Từ vựng')
            explanation = q.get('explanation', '')
            translation = q.get('translation', '')

            p_item = doc.add_paragraph()
            p_item.paragraph_format.space_before = Pt(5)
            p_item.paragraph_format.space_after = Pt(2)
            p_item.paragraph_format.line_spacing = 1.15

            # Heading: Câu X: Đáp án [Y] — [Topic]
            r_c = p_item.add_run(f"Câu {q_id}: Đáp án ")
            r_c.bold = True
            r_c.font.size = Pt(10.5)

            r_ans = p_item.add_run(f"[{ans}]")
            r_ans.bold = True
            r_ans.font.size = Pt(11)
            r_ans.font.color.rgb = COLOR_KEY

            r_tp = p_item.add_run(f"  ―  {topic}")
            r_tp.font.size = Pt(10)
            r_tp.font.color.rgb = COLOR_MUTED
            r_tp.italic = True

            # Explanation
            p_exp = doc.add_paragraph()
            p_exp.paragraph_format.left_indent = Inches(0.2)
            p_exp.paragraph_format.space_before = Pt(1)
            p_exp.paragraph_format.space_after = Pt(2)
            p_exp.paragraph_format.line_spacing = 1.15

            r_exp_lbl = p_exp.add_run("💡 Phân tích: ")
            r_exp_lbl.bold = True
            r_exp_lbl.font.size = Pt(10)
            r_exp_lbl.font.color.rgb = COLOR_PRIMARY

            add_formatted_text(p_exp, explanation, default_size=10)

            # Translation
            if translation:
                p_trans = doc.add_paragraph()
                p_trans.paragraph_format.left_indent = Inches(0.2)
                p_trans.paragraph_format.space_before = Pt(1)
                p_trans.paragraph_format.space_after = Pt(6)
                p_trans.paragraph_format.line_spacing = 1.15

                r_tr_lbl = p_trans.add_run("🌐 Dịch nghĩa: ")
                r_tr_lbl.bold = True
                r_tr_lbl.font.size = Pt(9.5)
                r_tr_lbl.font.color.rgb = COLOR_NAVY

                add_formatted_text(p_trans, translation, default_size=9.5, default_italic=True)

    # Save documents
    os.makedirs('BO_TAI_LIEU_ON_THI_VAO_10', exist_ok=True)
    out_path_1 = 'BO_TAI_LIEU_ON_THI_VAO_10/03_BO_3_DE_KIEM_TRA_6_UNIT_DAU_GLOBAL_SUCCESS_9.docx'
    out_path_2 = 'BO_3_DE_KIEM_TRA_6_UNIT_DAU_TIENG_ANH_9.docx'

    doc.save(out_path_1)
    doc.save(out_path_2)

    print(f"Successfully generated Word documents:")
    print(f"1. {out_path_1} ({os.path.getsize(out_path_1) / 1024:.1f} KB)")
    print(f"2. {out_path_2} ({os.path.getsize(out_path_2) / 1024:.1f} KB)")

if __name__ == '__main__':
    build_word_document()
