#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Generation Pipeline for Vocabulary and Reading (Milestone 1)
Topics covered:
  Vocabulary:
    91: Word Formation (Dùng đúng loại từ) [alias 523]
    95: Phrasal Verbs (Cụm động từ thông dụng) [alias 73]
    96: Collocations (Cụm từ cố định)
    35: Environment & Community Theme Bank (Tổng hợp Môi trường & Cộng đồng)
    1659: Going Green & Environmental Protection (Sống xanh & Bảo vệ môi trường)
    1645: Local Community & Crafts (Cộng đồng địa phương & Làng nghề)
    36: Synonyms & Antonyms (Từ đồng nghĩa & Trái nghĩa)
  Reading:
    81: Guided Cloze Tests (3 passages x 5 questions = 15 questions)
    82: Reading Comprehension (3 passages x 5 questions = 15 questions)
Aliases:
    523 -> 91
    73 -> 95
"""

import json
import os
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUESTIONS_DIR = os.path.join(BASE_DIR, 'data', 'questions')
THEORIES_DIR = os.path.join(BASE_DIR, 'data', 'theories')

os.makedirs(QUESTIONS_DIR, exist_ok=True)
os.makedirs(THEORIES_DIR, exist_ok=True)

# -------------------------------------------------------------
# TOPIC 91: Cấu tạo từ (Word Formation) (15 questions)
# -------------------------------------------------------------
q91 = [
    {
        "id": "91_1",
        "questionName": "Question 1",
        "questionText": "<p>The local government is trying to find a sustainable ________ to the severe air pollution problem.</p>",
        "choices": [
            {"id": "91_1_1", "text": "solution", "html": "solution"},
            {"id": "91_1_2", "text": "solve", "html": "solve"},
            {"id": "91_1_3", "text": "solvable", "html": "solvable"},
            {"id": "91_1_4", "text": "solving", "html": "solving"}
        ],
        "correctChoiceId": "91_1_1",
        "explanation": "<p>Đứng sau mạo từ \"a\" và tính từ \"sustainable\" (bền vững), vị trí này cần một <strong>danh từ</strong> số ít: <strong>solution</strong> (giải pháp).</p><ul><li><strong>solution</strong> (n): giải pháp</li><li><strong>solve</strong> (v): giải quyết</li><li><strong>solvable</strong> (adj): có thể giải quyết</li><li><strong>solving</strong> (gerund): việc giải quyết</li></ul>",
        "ruleTip": "Vị trí của Danh từ: Đứng sau tính từ (Adj + Noun) hoặc sau mạo từ (a/an/the + Adj + Noun)."
    },
    {
        "id": "91_2",
        "questionName": "Question 2",
        "questionText": "<p>Be ________ when crossing the busy crossroads during rush hour!</p>",
        "choices": [
            {"id": "91_2_1", "text": "careful", "html": "careful"},
            {"id": "91_2_2", "text": "care", "html": "care"},
            {"id": "91_2_3", "text": "carefully", "html": "carefully"},
            {"id": "91_2_4", "text": "careless", "html": "careless"}
        ],
        "correctChoiceId": "91_2_1",
        "explanation": "<p>Đứng sau động từ to be liên kết \"Be\", vị trí này cần một <strong>tính từ</strong> mang nghĩa tích cực: <strong>careful</strong> (cẩn thận).</p><ul><li><strong>careful</strong> (adj): cẩn thận</li><li><strong>care</strong> (n/v): chăm sóc</li><li><strong>carefully</strong> (adv): một cách cẩn thận</li><li><strong>careless</strong> (adj): bất cẩn</li></ul>",
        "ruleTip": "Sau động từ to be / linking verbs (look, feel, become) ta dùng Tính từ (Adj)."
    },
    {
        "id": "91_3",
        "questionName": "Question 3",
        "questionText": "<p>The students listened ________ to the teacher's instructions before starting the examination.</p>",
        "choices": [
            {"id": "91_3_1", "text": "attentively", "html": "attentively"},
            {"id": "91_3_2", "text": "attentive", "html": "attentive"},
            {"id": "91_3_3", "text": "attention", "html": "attention"},
            {"id": "91_3_4", "text": "attentiveness", "html": "attentiveness"}
        ],
        "correctChoiceId": "91_3_1",
        "explanation": "<p>Bổ nghĩa cho động từ thường \"listened\", vị trí này cần một <strong>trạng từ</strong> chỉ cách thức: <strong>attentively</strong> (một cách chăm chú).</p><ul><li><strong>attentively</strong> (adv): một cách chăm chú</li><li><strong>attentive</strong> (adj): chăm chú</li><li><strong>attention</strong> (n): sự chú ý</li></ul>",
        "ruleTip": "Bổ nghĩa cho động từ thường (V + Adv / Adv + V) ta dùng Trạng từ chỉ thể cách (Adj + -ly)."
    },
    {
        "id": "91_4",
        "questionName": "Question 4",
        "questionText": "<p>It is strictly forbidden and ________ to ride a motorbike without a helmet.</p>",
        "choices": [
            {"id": "91_4_1", "text": "unsafe", "html": "unsafe"},
            {"id": "91_4_2", "text": "safely", "html": "safely"},
            {"id": "91_4_3", "text": "safety", "html": "safety"},
            {"id": "91_4_4", "text": "safe", "html": "safe"}
        ],
        "correctChoiceId": "91_4_1",
        "explanation": "<p>Cấu trúc song hành với \"forbidden\" (bị cấm) nối bởi \"and\", đi sau \"It is\": cần <strong>tính từ</strong> mang nghĩa tiêu cực không an toàn: <strong>unsafe</strong>.</p>",
        "ruleTip": "Tiền tố 'un-' mang nghĩa phủ định (safe -> unsafe: không an toàn)."
    },
    {
        "id": "91_5",
        "questionName": "Question 5",
        "questionText": "<p>Passionate ________ are actively campaigning to protect the endangered Cat Ba langur.</p>",
        "choices": [
            {"id": "91_5_1", "text": "environmentalists", "html": "environmentalists"},
            {"id": "91_5_2", "text": "environmental", "html": "environmental"},
            {"id": "91_5_3", "text": "environment", "html": "environment"},
            {"id": "91_5_4", "text": "environmentally", "html": "environmentally"}
        ],
        "correctChoiceId": "91_5_1",
        "explanation": "<p>Làm chủ ngữ đi trước động từ số nhiều \"are campaigning\", sau tính từ \"Passionate\": cần <strong>danh từ chỉ người số nhiều</strong>: <strong>environmentalists</strong> (nhà bảo vệ môi trường).</p>",
        "ruleTip": "Hậu tố '-ist' tạo danh từ chỉ người (environment -> environmentalist)."
    },
    {
        "id": "91_6",
        "questionName": "Question 6",
        "questionText": "<p>Reading English books and news regularly will certainly ________ your vocabulary.</p>",
        "choices": [
            {"id": "91_6_1", "text": "enrich", "html": "enrich"},
            {"id": "91_6_2", "text": "rich", "html": "rich"},
            {"id": "91_6_3", "text": "richly", "html": "richly"},
            {"id": "91_6_4", "text": "richness", "html": "richness"}
        ],
        "correctChoiceId": "91_6_1",
        "explanation": "<p>Đứng sau trợ động từ khuyết thiếu \"will certainly\", vị trí này cần một <strong>động từ nguyên mẫu</strong>: <strong>enrich</strong> (làm giàu thêm, làm phong phú).</p>",
        "ruleTip": "Tiền tố 'en-' kết hợp với tính từ để tạo thành động từ (rich -> enrich, large -> enlarge)."
    },
    {
        "id": "91_7",
        "questionName": "Question 7",
        "questionText": "<p>Please put all ________ plastic bottles and cans into the green recycling bin.</p>",
        "choices": [
            {"id": "91_7_1", "text": "recyclable", "html": "recyclable"},
            {"id": "91_7_2", "text": "recycle", "html": "recycle"},
            {"id": "91_7_3", "text": "recycling", "html": "recycling"},
            {"id": "91_7_4", "text": "recycler", "html": "recycler"}
        ],
        "correctChoiceId": "91_7_1",
        "explanation": "<p>Đứng trước cụm danh từ \"plastic bottles and cans\": cần một <strong>tính từ</strong> mang nghĩa có thể tái chế: <strong>recyclable</strong>.</p>",
        "ruleTip": "Hậu tố '-able' tạo tính từ mang nghĩa 'có thể làm được' (recycle -> recyclable)."
    },
    {
        "id": "91_8",
        "questionName": "Question 8",
        "questionText": "<p>I strongly ________ with his opinion because his argument lacks scientific evidence.</p>",
        "choices": [
            {"id": "91_8_1", "text": "disagree", "html": "disagree"},
            {"id": "91_8_2", "text": "agree", "html": "agree"},
            {"id": "91_8_3", "text": "agreement", "html": "agreement"},
            {"id": "91_8_4", "text": "agreeable", "html": "agreeable"}
        ],
        "correctChoiceId": "91_8_1",
        "explanation": "<p>Ngữ cảnh vì lý lẽ thiếu bằng chứng khoa học nên chủ ngữ 'I' không đồng ý: cần <strong>động từ phủ định</strong>: <strong>disagree</strong>.</p>",
        "ruleTip": "Tiền tố 'dis-' mang nghĩa trái ngược, phủ định (agree -> disagree: không đồng ý)."
    },
    {
        "id": "91_9",
        "questionName": "Question 9",
        "questionText": "<p>There has been a remarkable ________ in his English test scores over the past three months.</p>",
        "choices": [
            {"id": "91_9_1", "text": "improvement", "html": "improvement"},
            {"id": "91_9_2", "text": "improve", "html": "improve"},
            {"id": "91_9_3", "text": "improving", "html": "improving"},
            {"id": "91_9_4", "text": "improvable", "html": "improvable"}
        ],
        "correctChoiceId": "91_9_1",
        "explanation": "<p>Đứng sau tính từ \"remarkable\" (đáng kể) và mạo từ \"a\": cần <strong>danh từ</strong>: <strong>improvement</strong> (sự tiến bộ).</p>",
        "ruleTip": "Hậu tố '-ment' tạo danh từ từ động từ (improve -> improvement, develop -> development)."
    },
    {
        "id": "91_10",
        "questionName": "Question 10",
        "questionText": "<p>She has always been deeply ________ in learning about Vietnamese traditional pottery.</p>",
        "choices": [
            {"id": "91_10_1", "text": "interested", "html": "interested"},
            {"id": "91_10_2", "text": "interesting", "html": "interesting"},
            {"id": "91_10_3", "text": "interest", "html": "interest"},
            {"id": "91_10_4", "text": "interestingly", "html": "interestingly"}
        ],
        "correctChoiceId": "91_10_1",
        "explanation": "<p>Cụm tính từ miêu tả cảm xúc con người: <strong>be interested in + V-ing</strong> (hứng thú với điều gì). Đuôi -ed diễn tả cảm xúc của người.</p>",
        "ruleTip": "Tính từ đuôi '-ed' diễn tả cảm xúc của con người (interested, bored); đuôi '-ing' diễn tả bản chất sự vật (interesting)."
    },
    {
        "id": "91_11",
        "questionName": "Question 11",
        "questionText": "<p>Learning a foreign language requires a great deal of ________ and continuous practice.</p>",
        "choices": [
            {"id": "91_11_1", "text": "patience", "html": "patience"},
            {"id": "91_11_2", "text": "patient", "html": "patient"},
            {"id": "91_11_3", "text": "patiently", "html": "patiently"},
            {"id": "91_11_4", "text": "impatient", "html": "impatient"}
        ],
        "correctChoiceId": "91_11_1",
        "explanation": "<p>Sau lượng từ \"a great deal of\" (nhiều): cần <strong>danh từ không đếm được</strong>: <strong>patience</strong> (sự kiên nhẫn).</p>",
        "ruleTip": "Hậu tố '-ence/-ance' tạo danh từ (patient -> patience, important -> importance)."
    },
    {
        "id": "91_12",
        "questionName": "Question 12",
        "questionText": "<p>Hanoi is a ________ developing metropolis with modern infrastructure and historic charm.</p>",
        "choices": [
            {"id": "91_12_1", "text": "rapidly", "html": "rapidly"},
            {"id": "91_12_2", "text": "rapid", "html": "rapid"},
            {"id": "91_12_3", "text": "rapidity", "html": "rapidity"},
            {"id": "91_12_4", "text": "rapids", "html": "rapids"}
        ],
        "correctChoiceId": "91_12_1",
        "explanation": "<p>Bổ nghĩa cho phân từ/tính từ \"developing\": cần <strong>trạng từ</strong>: <strong>rapidly</strong> (một cách nhanh chóng: rapidly developing = phát triển nhanh chóng).</p>",
        "ruleTip": "Trạng từ có thể đứng trước tính từ hoặc phân từ để bổ nghĩa (Adv + Adj / Adv + V-ing)."
    },
    {
        "id": "91_13",
        "questionName": "Question 13",
        "questionText": "<p>Throwing trash into public rivers is a ________ act that harms the living environment.</p>",
        "choices": [
            {"id": "91_13_1", "text": "thoughtless", "html": "thoughtless"},
            {"id": "91_13_2", "text": "thoughtful", "html": "thoughtful"},
            {"id": "91_13_3", "text": "thought", "html": "thought"},
            {"id": "91_13_4", "text": "thoughtlessly", "html": "thoughtlessly"}
        ],
        "correctChoiceId": "91_13_1",
        "explanation": "<p>Đứng trước danh từ \"act\" (hành vi), cần tính từ mang nghĩa thiếu suy nghĩ, vô ý thức: <strong>thoughtless</strong>.</p>",
        "ruleTip": "Hậu tố '-less' mang nghĩa không có, thiếu (thoughtless = thiếu suy nghĩ; helpless = bất lực)."
    },
    {
        "id": "91_14",
        "questionName": "Question 14",
        "questionText": "<p>The municipal council spent millions of dollars ________ historical landmarks in the Old Quarter.</p>",
        "choices": [
            {"id": "91_14_1", "text": "restoring", "html": "restoring"},
            {"id": "91_14_2", "text": "restore", "html": "restore"},
            {"id": "91_14_3", "text": "restoration", "html": "restoration"},
            {"id": "91_14_4", "text": "restored", "html": "restored"}
        ],
        "correctChoiceId": "91_14_1",
        "explanation": "<p>Cấu trúc: <strong>spend + time/money + V-ing (restoring)</strong> (dành thời gian/tiền bạc phục hồi các di tích).</p>",
        "ruleTip": "Cấu trúc: S + spend + time/money + V-ing (làm gì)."
    },
    {
        "id": "91_15",
        "questionName": "Question 15",
        "questionText": "<p>Jogging every morning greatly enhances your physical strength and general ________.</p>",
        "choices": [
            {"id": "91_15_1", "text": "fitness", "html": "fitness"},
            {"id": "91_15_2", "text": "fit", "html": "fit"},
            {"id": "91_15_3", "text": "fitter", "html": "fitter"},
            {"id": "91_15_4", "text": "fitting", "html": "fitting"}
        ],
        "correctChoiceId": "91_15_1",
        "explanation": "<p>Cấu trúc song hành với \"physical strength\" nối bởi \"and\", sau tính từ \"general\": cần <strong>danh từ</strong>: <strong>fitness</strong> (sự sung sức, sức khỏe thể chất).</p>",
        "ruleTip": "Hậu tố '-ness' tạo danh từ từ tính từ (fit -> fitness, happy -> happiness, dark -> darkness)."
    }
]

theory91 = {
    "topicId": 91,
    "topicName": "Cấu tạo từ (Word Formation)",
    "englishName": "Word Formation & Parts of Speech",
    "rules": [
        {
            "rule": "1. Vị trí và dấu hiệu của Danh từ (Nouns):",
            "formula": "S + V | V + O | a/an/the + Adj + N | Giới từ + N | Tính từ sở hữu + N",
            "examples": "decision, solution, improvement, environmentalist, fitness, patience."
        },
        {
            "rule": "2. Vị trí và dấu hiệu của Tính từ (Adjectives):",
            "formula": "Adj + N | S + be / linking verb (look, feel, seem, become) + Adj",
            "examples": "careful, unsafe, recyclable, traditional, energetic, famous."
        },
        {
            "rule": "3. Vị trí và dấu hiệu của Trạng từ (Adverbs):",
            "formula": "V + Adv | Adv + V | Adv + Adj | Đứng đầu/cuối câu ngăn bởi dấu phẩy",
            "examples": "attentively, rapidly, carefully, beautifully, fluently."
        },
        {
            "rule": "4. Các tiền tố phủ định quan trọng thi vào 10:",
            "formula": "un- (unsafe), dis- (disagree), im- (impossible), in- (inactive), ir- (irresponsible)",
            "examples": "safe -> unsafe, agree -> disagree, possible -> impossible, regular -> irregular."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 95: Cụm động từ thông dụng (Phrasal Verbs) (15 questions)
# -------------------------------------------------------------
q95 = [
    {
        "id": "95_1",
        "questionName": "Question 1",
        "questionText": "<p>My elder sister had to stay at home yesterday to ________ her sick baby brother.</p>",
        "choices": [
            {"id": "95_1_1", "text": "look after", "html": "look after"},
            {"id": "95_1_2", "text": "look for", "html": "look for"},
            {"id": "95_1_3", "text": "look at", "html": "look at"},
            {"id": "95_1_4", "text": "look up", "html": "look up"}
        ],
        "correctChoiceId": "95_1_1",
        "explanation": "<p><strong>look after</strong> = take care of (chăm sóc em nhỏ).<br/>look for: tìm kiếm; look at: nhìn; look up: tra cứu từ điển.</p>",
        "ruleTip": "'look after' = take care of (chăm sóc ai/cái gì); 'look for' = search for (tìm kiếm)."
    },
    {
        "id": "95_2",
        "questionName": "Question 2",
        "questionText": "<p>Remember to ________ all electrical appliances before leaving the classroom.</p>",
        "choices": [
            {"id": "95_2_1", "text": "turn off", "html": "turn off"},
            {"id": "95_2_2", "text": "turn on", "html": "turn on"},
            {"id": "95_2_3", "text": "turn down", "html": "turn down"},
            {"id": "95_2_4", "text": "turn up", "html": "turn up"}
        ],
        "correctChoiceId": "95_2_1",
        "explanation": "<p><strong>turn off</strong>: tắt thiết bị điện để tiết kiệm năng lượng.<br/>turn on: bật; turn down: vặn nhỏ / từ chối; turn up: vặn to / xuất hiện.</p>",
        "ruleTip": "Ghi nhớ cặp từ trái nghĩa: turn on (bật) >< turn off (tắt); turn up (vặn to) >< turn down (vặn nhỏ/từ chối)."
    },
    {
        "id": "95_3",
        "questionName": "Question 3",
        "questionText": "<p>He decided to ________ smoking because it severely affected his lungs.</p>",
        "choices": [
            {"id": "95_3_1", "text": "give up", "html": "give up"},
            {"id": "95_3_2", "text": "give in", "html": "give in"},
            {"id": "95_3_3", "text": "give away", "html": "give away"},
            {"id": "95_3_4", "text": "give out", "html": "give out"}
        ],
        "correctChoiceId": "95_3_1",
        "explanation": "<p><strong>give up</strong> + V-ing/N: từ bỏ một thói quen (hút thuốc).<br/>give in: đầu hàng; give away: cho tặng miễn phí.</p>",
        "ruleTip": "'give up + V-ing' = stop/quit (từ bỏ một thói quen)."
    },
    {
        "id": "95_4",
        "questionName": "Question 4",
        "questionText": "<p>Our school bus ________ on the highway this morning, causing many students to be late.</p>",
        "choices": [
            {"id": "95_4_1", "text": "broke down", "html": "broke down"},
            {"id": "95_4_2", "text": "broke out", "html": "broke out"},
            {"id": "95_4_3", "text": "broke into", "html": "broke into"},
            {"id": "95_4_4", "text": "broke off", "html": "broke off"}
        ],
        "correctChoiceId": "95_4_1",
        "explanation": "<p><strong>break down</strong>: (xe cộ, máy móc) bị hỏng hóc giữa đường.<br/>break out: bùng phát (dịch bệnh, chiến tranh); break into: đột nhập.</p>",
        "ruleTip": "'break down' = stop working (xe cộ, máy móc bị hỏng)."
    },
    {
        "id": "95_5",
        "questionName": "Question 5",
        "questionText": "<p>We have ________ fresh milk; could you please go to the supermarket and buy a carton?</p>",
        "choices": [
            {"id": "95_5_1", "text": "run out of", "html": "run out of"},
            {"id": "95_5_2", "text": "run into", "html": "run into"},
            {"id": "95_5_3", "text": "run away with", "html": "run away with"},
            {"id": "95_5_4", "text": "run over", "html": "run over"}
        ],
        "correctChoiceId": "95_5_1",
        "explanation": "<p><strong>run out of</strong>: cạn kiệt, hết sạch (sữa tươi).<br/>run into: tình cờ gặp ai.</p>",
        "ruleTip": "'run out of sth' = have no more left (dùng hết, cạn kiệt cái gì)."
    },
    {
        "id": "95_6",
        "questionName": "Question 6",
        "questionText": "<p>Due to the dense fog at Noi Bai Airport, the flight could not ________ on time.</p>",
        "choices": [
            {"id": "95_6_1", "text": "take off", "html": "take off"},
            {"id": "95_6_2", "text": "take on", "html": "take on"},
            {"id": "95_6_3", "text": "take after", "html": "take after"},
            {"id": "95_6_4", "text": "take in", "html": "take in"}
        ],
        "correctChoiceId": "95_6_1",
        "explanation": "<p><strong>take off</strong>: (máy bay) cất cánh; (quần áo) cởi ra.<br/>take after: giống ai trong gia đình.</p>",
        "ruleTip": "'take off': máy bay cất cánh (>< land); cởi quần áo, giày mũ."
    },
    {
        "id": "95_7",
        "questionName": "Question 7",
        "questionText": "<p>The sports tournament was ________ until next week because of the torrential rain.</p>",
        "choices": [
            {"id": "95_7_1", "text": "put off", "html": "put off"},
            {"id": "95_7_2", "text": "put on", "html": "put on"},
            {"id": "95_7_3", "text": "put out", "html": "put out"},
            {"id": "95_7_4", "text": "put up", "html": "put up"}
        ],
        "correctChoiceId": "95_7_1",
        "explanation": "<p><strong>put off</strong> = postpone / delay (hoãn lại sự kiện đến tuần sau).<br/>put on: mặc vào; put out: dập tắt đám cháy.</p>",
        "ruleTip": "'put off' = postpone (trì hoãn); 'put out' = extinguish (dập tắt lửa)."
    },
    {
        "id": "95_8",
        "questionName": "Question 8",
        "questionText": "<p>It took her nearly two weeks to completely ________ the serious flu.</p>",
        "choices": [
            {"id": "95_8_1", "text": "get over", "html": "get over"},
            {"id": "95_8_2", "text": "get on", "html": "get on"},
            {"id": "95_8_3", "text": "get through", "html": "get through"},
            {"id": "95_8_4", "text": "get off", "html": "get off"}
        ],
        "correctChoiceId": "95_8_1",
        "explanation": "<p><strong>get over</strong> = recover from (bình phục, vượt qua cơn ốm hoặc khó khăn).<br/>get on with: có quan hệ hòa thuận với ai.</p>",
        "ruleTip": "'get over' = recover from (vượt qua cú sốc, khỏi bệnh)."
    },
    {
        "id": "95_9",
        "questionName": "Question 9",
        "questionText": "<p>Even though she was tired, she ________ studying until she finished all 10 practice tests.</p>",
        "choices": [
            {"id": "95_9_1", "text": "went on", "html": "went on"},
            {"id": "95_9_2", "text": "went off", "html": "went off"},
            {"id": "95_9_3", "text": "went by", "html": "went by"},
            {"id": "95_9_4", "text": "went out", "html": "went out"}
        ],
        "correctChoiceId": "95_9_1",
        "explanation": "<p><strong>go on + V-ing</strong> = continue (tiếp tục làm gì).<br/>went off: (chuông báo) reo; (bom) nổ; (sữa) bị thiu.</p>",
        "ruleTip": "'go on + V-ing' = keep on = continue (tiếp tục làm gì)."
    },
    {
        "id": "95_10",
        "questionName": "Question 10",
        "questionText": "<p>Scientists are planning to ________ an experiment on solar energy efficiency.</p>",
        "choices": [
            {"id": "95_10_1", "text": "carry out", "html": "carry out"},
            {"id": "95_10_2", "text": "carry on", "html": "carry on"},
            {"id": "95_10_3", "text": "carry off", "html": "carry off"},
            {"id": "95_10_4", "text": "carry away", "html": "carry away"}
        ],
        "correctChoiceId": "95_10_1",
        "explanation": "<p><strong>carry out</strong> an experiment/research: tiến hành, thực hiện thí nghiệm hoặc dự án.</p>",
        "ruleTip": "'carry out' = conduct/execute (tiến hành nghiên cứu, thí nghiệm, kế hoạch)."
    },
    {
        "id": "95_11",
        "questionName": "Question 11",
        "questionText": "<p>If you don't know the exact meaning of this idiom, ________ it in the Oxford Dictionary.</p>",
        "choices": [
            {"id": "95_11_1", "text": "look up", "html": "look up"},
            {"id": "95_11_2", "text": "look for", "html": "look for"},
            {"id": "95_11_3", "text": "look after", "html": "look after"},
            {"id": "95_11_4", "text": "look into", "html": "look into"}
        ],
        "correctChoiceId": "95_11_1",
        "explanation": "<p><strong>look up</strong> a word/information: tra cứu từ ngữ hoặc thông tin trong từ điển/sách báo.</p>",
        "ruleTip": "'look up' = search in a dictionary/reference (tra cứu từ ngữ, thông tin)."
    },
    {
        "id": "95_12",
        "questionName": "Question 12",
        "questionText": "<p>Nam was ________ by his grandparents in the countryside after his parents moved abroad.</p>",
        "choices": [
            {"id": "95_12_1", "text": "brought up", "html": "brought up"},
            {"id": "95_12_2", "text": "grown up", "html": "grown up"},
            {"id": "95_12_3", "text": "taken up", "html": "taken up"},
            {"id": "95_12_4", "text": "looked up", "html": "looked up"}
        ],
        "correctChoiceId": "95_12_1",
        "explanation": "<p><strong>bring up</strong> = raise a child (nuôi nấng, dưỡng dục con cái). Ở dạng bị động là 'was brought up'.</p>",
        "ruleTip": "'bring up' = raise (nuôi nấng con cái); 'grow up' = trưởng thành (nội động từ)."
    },
    {
        "id": "95_13",
        "questionName": "Question 13",
        "questionText": "<p>I simply cannot ________ the deafening noise from the construction site next door anymore.</p>",
        "choices": [
            {"id": "95_13_1", "text": "put up with", "html": "put up with"},
            {"id": "95_13_2", "text": "catch up with", "html": "catch up with"},
            {"id": "95_13_3", "text": "keep up with", "html": "keep up with"},
            {"id": "95_13_4", "text": "come up with", "html": "come up with"}
        ],
        "correctChoiceId": "95_13_1",
        "explanation": "<p><strong>put up with</strong> = tolerate (chịu đựng điều phiền toái: tiếng ồn công trường).<br/>come up with: nảy ra ý tưởng; catch up with: theo kịp ai.</p>",
        "ruleTip": "'put up with' = tolerate (chịu đựng ai/cái gì); 'come up with' = invent/think of (nảy ra ý tưởng)."
    },
    {
        "id": "95_14",
        "questionName": "Question 14",
        "questionText": "<p>Everyone says that young Linda ________ her mother in both appearance and kind personality.</p>",
        "choices": [
            {"id": "95_14_1", "text": "takes after", "html": "takes after"},
            {"id": "95_14_2", "text": "looks for", "html": "looks for"},
            {"id": "95_14_3", "text": "takes off", "html": "takes off"},
            {"id": "95_14_4", "text": "looks after", "html": "looks after"}
        ],
        "correctChoiceId": "95_14_1",
        "explanation": "<p><strong>take after</strong> = resemble (giống bố mẹ hoặc người lớn trong gia đình về ngoại hình/tính cách).</p>",
        "ruleTip": "'take after sb' = resemble (giống ai trong gia đình)."
    },
    {
        "id": "95_15",
        "questionName": "Question 15",
        "questionText": "<p>All the students are really ________ meeting the foreign exchange teachers next Monday.</p>",
        "choices": [
            {"id": "95_15_1", "text": "looking forward to", "html": "looking forward to"},
            {"id": "95_15_2", "text": "looking down on", "html": "looking down on"},
            {"id": "95_15_3", "text": "getting along with", "html": "getting along with"},
            {"id": "95_15_4", "text": "keeping track of", "html": "keeping track of"}
        ],
        "correctChoiceId": "95_15_1",
        "explanation": "<p><strong>look forward to + V-ing</strong>: rất háo hức, mong chờ sự kiện sắp tới.</p>",
        "ruleTip": "'look forward to + V-ing': mong đợi, chờ đón điều gì với niềm vui."
    }
]

theory95 = {
    "topicId": 95,
    "topicName": "Cụm động từ thông dụng",
    "englishName": "Common Phrasal Verbs",
    "rules": [
        {
            "rule": "1. Nhóm động từ với LOOK:",
            "formula": "look after (chăm sóc), look for (tìm kiếm), look up (tra từ điển), look forward to (mong đợi)",
            "examples": "Please look after my dog. / I'm looking forward to the holiday."
        },
        {
            "rule": "2. Nhóm động từ với TURN:",
            "formula": "turn on (bật) >< turn off (tắt), turn up (vặn to / đến) >< turn down (vặn nhỏ / từ chối)",
            "examples": "Turn off the lights. / She turned down the job offer."
        },
        {
            "rule": "3. Nhóm động từ với TAKE và PUT:",
            "formula": "take off (cất cánh, cởi đồ), take after (giống ai) // put off (hoãn lại), put out (dập tắt lửa), put up with (chịu đựng)",
            "examples": "The plane took off on time. / We had to put off the match."
        },
        {
            "rule": "4. Nhóm động từ 3 thành phần thông dụng thi vào 10:",
            "formula": "run out of (hết sạch), come up with (nghĩ ra), keep up with (bắt kịp), put up with (chịu đựng)",
            "examples": "We ran out of petrol. / She came up with a great idea."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 96: Cụm từ cố định & Kết hợp từ (Collocations) (15 questions)
# -------------------------------------------------------------
q96 = [
    {
        "id": "96_1",
        "questionName": "Question 1",
        "questionText": "<p>Don't be disheartened if you ________ a mistake; the most important thing is to learn from it.</p>",
        "choices": [
            {"id": "96_1_1", "text": "make", "html": "make"},
            {"id": "96_1_2", "text": "do", "html": "do"},
            {"id": "96_1_3", "text": "take", "html": "take"},
            {"id": "96_1_4", "text": "have", "html": "have"}
        ],
        "correctChoiceId": "96_1_1",
        "explanation": "<p>Collocation bắt buộc với danh từ \"mistake\" là <strong>make a mistake</strong> (mắc lỗi, phạm sai lầm).</p>",
        "ruleTip": "Collocation cố định: 'make a mistake' = mắc lỗi; 'do homework/housework' = làm bài tập/việc nhà."
    },
    {
        "id": "96_2",
        "questionName": "Question 2",
        "questionText": "<p>Every Sunday morning, my sister and I help our parents ________ household chores.</p>",
        "choices": [
            {"id": "96_2_1", "text": "do", "html": "do"},
            {"id": "96_2_2", "text": "make", "html": "make"},
            {"id": "96_2_3", "text": "take", "html": "take"},
            {"id": "96_2_4", "text": "get", "html": "get"}
        ],
        "correctChoiceId": "96_2_1",
        "explanation": "<p>Collocation đi với \"household chores\" (việc nhà) là <strong>do chores</strong> (làm việc nhà).</p>",
        "ruleTip": "'do household chores' = làm việc nhà; 'do research' = nghiên cứu."
    },
    {
        "id": "96_3",
        "questionName": "Question 3",
        "questionText": "<p>Hundreds of Grade 9 students eagerly ________ part in the green marathon last Saturday.</p>",
        "choices": [
            {"id": "96_3_1", "text": "took", "html": "took"},
            {"id": "96_3_2", "text": "made", "html": "made"},
            {"id": "96_3_3", "text": "had", "html": "had"},
            {"id": "96_3_4", "text": "gave", "html": "gave"}
        ],
        "correctChoiceId": "96_3_1",
        "explanation": "<p>Cụm từ cố định: <strong>take part in</strong> = participate in (tham gia vào hoạt động gì).</p>",
        "ruleTip": "'take part in' = participate in (tham gia vào cái gì)."
    },
    {
        "id": "96_4",
        "questionName": "Question 4",
        "questionText": "<p>You must ________ close attention to the grammar formulas written on the blackboard.</p>",
        "choices": [
            {"id": "96_4_1", "text": "pay", "html": "pay"},
            {"id": "96_4_2", "text": "give", "html": "give"},
            {"id": "96_4_3", "text": "make", "html": "make"},
            {"id": "96_4_4", "text": "take", "html": "take"}
        ],
        "correctChoiceId": "96_4_1",
        "explanation": "<p>Collocation đi với \"attention to\" là <strong>pay attention to</strong> (chú ý lắng nghe/quan sát).</p>",
        "ruleTip": "'pay attention to' = chú ý, để tâm đến điều gì."
    },
    {
        "id": "96_5",
        "questionName": "Question 5",
        "questionText": "<p>If you ________ an effort, you will definitely achieve high scores in the entrance exam.</p>",
        "choices": [
            {"id": "96_5_1", "text": "make", "html": "make"},
            {"id": "96_5_2", "text": "do", "html": "do"},
            {"id": "96_5_3", "text": "take", "html": "take"},
            {"id": "96_5_4", "text": "create", "html": "create"}
        ],
        "correctChoiceId": "96_5_1",
        "explanation": "<p>Collocation đi với \"an effort\" là <strong>make an effort</strong> (nỗ lực, cố gắng hết mình).</p>",
        "ruleTip": "'make an effort' = try hard (nỗ lực, cố gắng)."
    },
    {
        "id": "96_6",
        "questionName": "Question 6",
        "questionText": "<p>Vietnamese people always take great ________ in their rich historical and cultural heritage.</p>",
        "choices": [
            {"id": "96_6_1", "text": "pride", "html": "pride"},
            {"id": "96_6_2", "text": "proud", "html": "proud"},
            {"id": "96_6_3", "text": "honor", "html": "honor"},
            {"id": "96_6_4", "text": "respect", "html": "respect"}
        ],
        "correctChoiceId": "96_6_1",
        "explanation": "<p>Cụm từ cố định: <strong>take pride in + N</strong> = be proud of (tự hào về cái gì). 'Pride' là danh từ.</p>",
        "ruleTip": "'take pride in' = be proud of (tự hào về điều gì)."
    },
    {
        "id": "96_7",
        "questionName": "Question 7",
        "questionText": "<p>Could you please ________ me a favor and carry this heavy parcel to the post office?</p>",
        "choices": [
            {"id": "96_7_1", "text": "do", "html": "do"},
            {"id": "96_7_2", "text": "make", "html": "make"},
            {"id": "96_7_3", "text": "give", "html": "give"},
            {"id": "96_7_4", "text": "take", "html": "take"}
        ],
        "correctChoiceId": "96_7_1",
        "explanation": "<p>Collocation nhờ vả giúp đỡ: <strong>do sb a favor</strong> (làm giúp ai một việc tốt/giúp đỡ một tay).</p>",
        "ruleTip": "'do sb a favor' = giúp đỡ ai một việc; 'do good/harm' = mang lại lợi/hại."
    },
    {
        "id": "96_8",
        "questionName": "Question 8",
        "questionText": "<p>The colorful traditional lantern suddenly ________ her eye as she walked along the night street.</p>",
        "choices": [
            {"id": "96_8_1", "text": "caught", "html": "caught"},
            {"id": "96_8_2", "text": "held", "html": "held"},
            {"id": "96_8_3", "text": "attracted", "html": "attracted"},
            {"id": "96_8_4", "text": "kept", "html": "kept"}
        ],
        "correctChoiceId": "96_8_1",
        "explanation": "<p>Thành ngữ: <strong>catch sb's eye</strong> (thu hút sự chú ý, ánh nhìn của ai). Quá khứ là <strong>caught</strong>.</p>",
        "ruleTip": "'catch sb's eye' = attract sb's attention (thu hút ánh nhìn/sự chú ý của ai)."
    },
    {
        "id": "96_9",
        "questionName": "Question 9",
        "questionText": "<p>Although they moved to different cities, they still manage to keep in ________ with each other.</p>",
        "choices": [
            {"id": "96_9_1", "text": "touch", "html": "touch"},
            {"id": "96_9_2", "text": "contact", "html": "contact"},
            {"id": "96_9_3", "text": "link", "html": "link"},
            {"id": "96_9_4", "text": "relation", "html": "relation"}
        ],
        "correctChoiceId": "96_9_1",
        "explanation": "<p>Cụm từ cố định: <strong>keep in touch with sb</strong> (giữ liên lạc thường xuyên với ai).</p>",
        "ruleTip": "'keep in touch with' = maintain contact (giữ liên lạc với ai; >< lose touch with)."
    },
    {
        "id": "96_10",
        "questionName": "Question 10",
        "questionText": "<p>You should take full ________ of online learning resources to prepare for the Grade 10 exam.</p>",
        "choices": [
            {"id": "96_10_1", "text": "advantage", "html": "advantage"},
            {"id": "96_10_2", "text": "opportunity", "html": "opportunity"},
            {"id": "96_10_3", "text": "benefit", "html": "benefit"},
            {"id": "96_10_4", "text": "profit", "html": "profit"}
        ],
        "correctChoiceId": "96_10_1",
        "explanation": "<p>Cụm từ cố định: <strong>take advantage of sth</strong> (tận dụng triệt để lợi thế của cái gì).</p>",
        "ruleTip": "'take advantage of' = make good use of (tận dụng lợi thế của điều gì)."
    },
    {
        "id": "96_11",
        "questionName": "Question 11",
        "questionText": "<p>It is difficult to ________ a firm decision about which specialized school to apply for.</p>",
        "choices": [
            {"id": "96_11_1", "text": "make", "html": "make"},
            {"id": "96_11_2", "text": "do", "html": "do"},
            {"id": "96_11_3", "text": "give", "html": "give"},
            {"id": "96_11_4", "text": "bring", "html": "bring"}
        ],
        "correctChoiceId": "96_11_1",
        "explanation": "<p>Collocation đi với \"decision\" là <strong>make a decision</strong> (đưa ra quyết định chọn lựa).</p>",
        "ruleTip": "'make a decision' = decide (đưa ra quyết định); 'make progress' = tiến bộ."
    },
    {
        "id": "96_12",
        "questionName": "Question 12",
        "questionText": "<p>Can you ________ me a hand with moving this heavy wooden table into the study room?</p>",
        "choices": [
            {"id": "96_12_1", "text": "give", "html": "give"},
            {"id": "96_12_2", "text": "lend", "html": "lend"},
            {"id": "96_12_3", "text": "make", "html": "make"},
            {"id": "96_12_4", "text": "do", "html": "do"}
        ],
        "correctChoiceId": "96_12_1",
        "explanation": "<p>Thành ngữ: <strong>give sb a hand</strong> = help sb (giúp ai một tay làm việc nặng).</p>",
        "ruleTip": "'give sb a hand' = help sb (giúp ai một tay)."
    },
    {
        "id": "96_13",
        "questionName": "Question 13",
        "questionText": "<p>The two best friends have a lot ________; they both love painting, swimming, and science.</p>",
        "choices": [
            {"id": "96_13_1", "text": "in common", "html": "in common"},
            {"id": "96_13_2", "text": "in general", "html": "in general"},
            {"id": "96_13_3", "text": "in private", "html": "in private"},
            {"id": "96_13_4", "text": "in public", "html": "in public"}
        ],
        "correctChoiceId": "96_13_1",
        "explanation": "<p>Cụm từ cố định: <strong>have sth in common</strong> (có điểm chung, có cùng sở thích/quan điểm).</p>",
        "ruleTip": "'have in common' = share similar interests or characteristics (có điểm chung)."
    },
    {
        "id": "96_14",
        "questionName": "Question 14",
        "questionText": "<p>________ living conditions and educational quality, Hanoi has improved remarkably.</p>",
        "choices": [
            {"id": "96_14_1", "text": "In terms of", "html": "In terms of"},
            {"id": "96_14_2", "text": "In spite of", "html": "In spite of"},
            {"id": "96_14_3", "text": "In addition to", "html": "In addition to"},
            {"id": "96_14_4", "text": "In front of", "html": "In front of"}
        ],
        "correctChoiceId": "96_14_1",
        "explanation": "<p>Cụm liên từ: <strong>in terms of</strong> (xét về mặt, liên quan đến khía cạnh nào đó: xét về điều kiện sống).</p>",
        "ruleTip": "'in terms of' = with regard to (xét về mặt, về phương diện nào đó)."
    },
    {
        "id": "96_15",
        "questionName": "Question 15",
        "questionText": "<p>Every small green habit can ________ a big difference to protecting our environment.</p>",
        "choices": [
            {"id": "96_15_1", "text": "make", "html": "make"},
            {"id": "96_15_2", "text": "do", "html": "do"},
            {"id": "96_15_3", "text": "create", "html": "create"},
            {"id": "96_15_4", "text": "bring", "html": "bring"}
        ],
        "correctChoiceId": "96_15_1",
        "explanation": "<p>Collocation đi với \"a difference\" là <strong>make a difference</strong> (tạo nên sự khác biệt, có tác động tích cực).</p>",
        "ruleTip": "'make a difference' = have an impact (tạo nên sự khác biệt/ảnh hưởng tích cực)."
    }
]

theory96 = {
    "topicId": 96,
    "topicName": "Cụm từ cố định & Kết hợp từ",
    "englishName": "Collocations & Fixed Expressions",
    "rules": [
        {
            "rule": "1. Phân biệt Collocations với MAKE và DO:",
            "formula": "MAKE: a mistake, an effort, a decision, a difference, friends, progress // DO: homework, housework/chores, research, a favor, good/harm",
            "examples": "Don't make mistakes. / She did me a great favor."
        },
        {
            "rule": "2. Cụm từ cố định với TAKE:",
            "formula": "take part in (tham gia), take pride in (tự hào), take advantage of (tận dụng), take care of (chăm sóc)",
            "examples": "Take part in sports. / Take advantage of good opportunities."
        },
        {
            "rule": "3. Cụm từ thông dụng với PAY, CATCH, KEEP, GIVE:",
            "formula": "pay attention to (chú ý), catch sb's eye (thu hút ánh nhìn), keep in touch with (giữ liên lạc), give sb a hand (giúp một tay)",
            "examples": "Pay attention to the lesson. / Can you give me a hand?"
        },
        {
            "rule": "4. Cụm giới từ cố định:",
            "formula": "have in common (có điểm chung), in terms of (xét về mặt), on behalf of (thay mặt cho)",
            "examples": "They have a lot in common. / In terms of cost, this is better."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 35: Từ vựng chủ điểm: Môi trường & Đô thị (15 questions)
# -------------------------------------------------------------
q35 = [
    {
        "id": "35_1",
        "questionName": "Question 1",
        "questionText": "<p>Wind turbines and solar panels generate clean and ________ energy for urban cities.</p>",
        "choices": [
            {"id": "35_1_1", "text": "renewable", "html": "renewable"},
            {"id": "35_1_2", "text": "exhaustible", "html": "exhaustible"},
            {"id": "35_1_3", "text": "polluted", "html": "polluted"},
            {"id": "35_1_4", "text": "harmful", "html": "harmful"}
        ],
        "correctChoiceId": "35_1_1",
        "explanation": "<p>Năng lượng sạch từ gió và mặt trời là năng lượng có thể tái tạo: <strong>renewable energy</strong>.</p>",
        "ruleTip": "'renewable energy' = năng lượng tái tạo (gió, mặt trời, thủy điện)."
    },
    {
        "id": "35_2",
        "questionName": "Question 2",
        "questionText": "<p>Rapid urban development has led to severe ________ in many historic metropolises.</p>",
        "choices": [
            {"id": "35_2_1", "text": "overcrowding", "html": "overcrowding"},
            {"id": "35_2_2", "text": "agriculture", "html": "agriculture"},
            {"id": "35_2_3", "text": "preservation", "html": "preservation"},
            {"id": "35_2_4", "text": "freshness", "html": "freshness"}
        ],
        "correctChoiceId": "35_2_1",
        "explanation": "<p>Đô thị hóa quá nhanh dẫn đến tình trạng quá tải dân số: <strong>overcrowding</strong> (sự đông đúc quá tải).</p>",
        "ruleTip": "'overcrowding' = tình trạng quá đông đúc ở các đại đô thị."
    },
    {
        "id": "35_3",
        "questionName": "Question 3",
        "questionText": "<p>Local people in Bat Trang village are skillful ________ who create delicate pottery.</p>",
        "choices": [
            {"id": "35_3_1", "text": "artisans", "html": "artisans"},
            {"id": "35_3_2", "text": "engineers", "html": "engineers"},
            {"id": "35_3_3", "text": "customers", "html": "customers"},
            {"id": "35_3_4", "text": "drivers", "html": "drivers"}
        ],
        "correctChoiceId": "35_3_1",
        "explanation": "<p>Người thợ thủ công lành nghề ở làng gốm Bát Tràng là <strong>artisans</strong> (nghệ nhân).</p>",
        "ruleTip": "'artisan' = thợ thủ công, nghệ nhân lành nghề tại làng nghề truyền thống."
    },
    {
        "id": "35_4",
        "questionName": "Question 4",
        "questionText": "<p>Using public transport such as the metro and electric bus helps reduce your carbon ________.</p>",
        "choices": [
            {"id": "35_4_1", "text": "footprint", "html": "footprint"},
            {"id": "35_4_2", "text": "handprint", "html": "handprint"},
            {"id": "35_4_3", "text": "path", "html": "path"},
            {"id": "35_4_4", "text": "emission", "html": "emission"}
        ],
        "correctChoiceId": "35_4_1",
        "explanation": "<p>Thuật ngữ môi trường: <strong>carbon footprint</strong> (dấu chân carbon / lượng khí thải carbon cá nhân).</p>",
        "ruleTip": "'carbon footprint' = dấu chân carbon (lượng phát thải CO2 của một cá nhân/tổ chức)."
    },
    {
        "id": "35_5",
        "questionName": "Question 5",
        "questionText": "<p>The ancient communal house in the center of the village serves as a gathering place for ________.</p>",
        "choices": [
            {"id": "35_5_1", "text": "residents", "html": "residents"},
            {"id": "35_5_2", "text": "strangers", "html": "strangers"},
            {"id": "35_5_3", "text": "foreigners", "html": "foreigners"},
            {"id": "35_5_4", "text": "intruders", "html": "intruders"}
        ],
        "correctChoiceId": "35_5_1",
        "explanation": "<p>Đình làng là nơi hội họp sinh hoạt cộng đồng của các cư dân địa phương: <strong>residents</strong>.</p>",
        "ruleTip": "'resident' = cư dân sinh sống tại một khu vực/cộng đồng."
    },
    {
        "id": "35_6",
        "questionName": "Question 6",
        "questionText": "<p>Illegal logging and ________ threaten the natural habitat of wild animals in the forest.</p>",
        "choices": [
            {"id": "35_6_1", "text": "deforestation", "html": "deforestation"},
            {"id": "35_6_2", "text": "afforestation", "html": "afforestation"},
            {"id": "35_6_3", "text": "conservation", "html": "conservation"},
            {"id": "35_6_4", "text": "cultivation", "html": "cultivation"}
        ],
        "correctChoiceId": "35_6_1",
        "explanation": "<p>Nạn chặt phá rừng bừa bãi: <strong>deforestation</strong> đe dọa môi trường sống của động vật.</p>",
        "ruleTip": "'deforestation' = nạn tàn phá rừng (>< afforestation: việc trồng rừng)."
    },
    {
        "id": "35_7",
        "questionName": "Question 7",
        "questionText": "<p>Plastic bags are non-________ and take hundreds of years to decompose in nature.</p>",
        "choices": [
            {"id": "35_7_1", "text": "biodegradable", "html": "biodegradable"},
            {"id": "35_7_2", "text": "renewable", "html": "renewable"},
            {"id": "35_7_3", "text": "polluted", "html": "polluted"},
            {"id": "35_7_4", "text": "disposable", "html": "disposable"}
        ],
        "correctChoiceId": "35_7_1",
        "explanation": "<p>Túi ni lông không tự phân hủy sinh học: <strong>non-biodegradable</strong>.</p>",
        "ruleTip": "'biodegradable' = có thể phân hủy sinh học; 'non-biodegradable' = khó phân hủy."
    },
    {
        "id": "35_8",
        "questionName": "Question 8",
        "questionText": "<p>Volunteers cleaned up the public park and planted flowers to ________ their neighborhood.</p>",
        "choices": [
            {"id": "35_8_1", "text": "beautify", "html": "beautify"},
            {"id": "35_8_2", "text": "pollute", "html": "pollute"},
            {"id": "35_8_3", "text": "destroy", "html": "destroy"},
            {"id": "35_8_4", "text": "damage", "html": "damage"}
        ],
        "correctChoiceId": "35_8_1",
        "explanation": "<p>Trồng hoa và dọn rác để làm đẹp khu dân cư: <strong>beautify</strong> (động từ làm đẹp).</p>",
        "ruleTip": "'beautify' = làm đẹp cảnh quan (beauty -> beautify)."
    },
    {
        "id": "35_9",
        "questionName": "Question 9",
        "questionText": "<p>Exhaust fumes from motorbikes and automobiles are the primary cause of urban ________.</p>",
        "choices": [
            {"id": "35_9_1", "text": "smog", "html": "smog"},
            {"id": "35_9_2", "text": "purity", "html": "purity"},
            {"id": "35_9_3", "text": "cleanliness", "html": "cleanliness"},
            {"id": "35_9_4", "text": "greenery", "html": "greenery"}
        ],
        "correctChoiceId": "35_9_1",
        "explanation": "<p>Khói bụi phương tiện gây ra hiện tượng khói mù độc hại ở đô thị: <strong>smog (khói bụi quang hóa)</strong>.</p>",
        "ruleTip": "'smog' = khói lẫn sương mù ô nhiễm ở các thành phố lớn."
    },
    {
        "id": "35_10",
        "questionName": "Question 10",
        "questionText": "<p>The traditional craft of weaving silk has been ________ down from generation to generation.</p>",
        "choices": [
            {"id": "35_10_1", "text": "passed", "html": "passed"},
            {"id": "35_10_2", "text": "brought", "html": "brought"},
            {"id": "35_10_3", "text": "taken", "html": "taken"},
            {"id": "35_10_4", "text": "turned", "html": "turned"}
        ],
        "correctChoiceId": "35_10_1",
        "explanation": "<p>Cụm từ lưu truyền nghề truyền thống: <strong>pass down from generation to generation</strong> (truyền qua nhiều thế hệ).</p>",
        "ruleTip": "'pass down' = lưu truyền lại cho thế hệ sau."
    },
    {
        "id": "35_11",
        "questionName": "Question 11",
        "questionText": "<p>Governments should impose heavy fines on factories that dump untreated toxic ________ into rivers.</p>",
        "choices": [
            {"id": "35_11_1", "text": "waste", "html": "waste"},
            {"id": "35_11_2", "text": "resources", "html": "resources"},
            {"id": "35_11_3", "text": "products", "html": "products"},
            {"id": "35_11_4", "text": "goods", "html": "goods"}
        ],
        "correctChoiceId": "35_11_1",
        "explanation": "<p>Xả rác thải độc hại chưa xử lý: <strong>toxic waste</strong> (chất thải độc hại).</p>",
        "ruleTip": "'toxic waste' = rác thải / chất thải độc hại công nghiệp."
    },
    {
        "id": "35_12",
        "questionName": "Question 12",
        "questionText": "<p>Preserving our cultural ________ helps young people understand and respect their national roots.</p>",
        "choices": [
            {"id": "35_12_1", "text": "heritage", "html": "heritage"},
            {"id": "35_12_2", "text": "pollution", "html": "pollution"},
            {"id": "35_12_3", "text": "litter", "html": "litter"},
            {"id": "35_12_4", "text": "waste", "html": "waste"}
        ],
        "correctChoiceId": "35_12_1",
        "explanation": "<p>Bảo tồn di sản văn hóa: <strong>cultural heritage</strong>.</p>",
        "ruleTip": "'cultural heritage' = di sản văn hóa dân tộc."
    },
    {
        "id": "35_13",
        "questionName": "Question 13",
        "questionText": "<p>Green living encourages residents to opt for eco-friendly and ________ consumer items.</p>",
        "choices": [
            {"id": "35_13_1", "text": "sustainable", "html": "sustainable"},
            {"id": "35_13_2", "text": "exhausted", "html": "exhausted"},
            {"id": "35_13_3", "text": "destructive", "html": "destructive"},
            {"id": "35_13_4", "text": "disposable", "html": "disposable"}
        ],
        "correctChoiceId": "35_13_1",
        "explanation": "<p>Lối sống xanh khuyến khích lựa chọn các sản phẩm bền vững: <strong>sustainable</strong>.</p>",
        "ruleTip": "'sustainable' = bền vững, thân thiện với môi trường dài hạn."
    },
    {
        "id": "35_14",
        "questionName": "Question 14",
        "questionText": "<p>High school students enthusiastically joined the community ________ to support elderly residents.</p>",
        "choices": [
            {"id": "35_14_1", "text": "service", "html": "service"},
            {"id": "35_14_2", "text": "business", "html": "business"},
            {"id": "35_14_3", "text": "industry", "html": "industry"},
            {"id": "35_14_4", "text": "competition", "html": "competition"}
        ],
        "correctChoiceId": "35_14_1",
        "explanation": "<p>Hoạt động công ích phục vụ cộng đồng: <strong>community service</strong>.</p>",
        "ruleTip": "'community service' = hoạt động phục vụ cộng đồng, công ích xã hội."
    },
    {
        "id": "35_15",
        "questionName": "Question 15",
        "questionText": "<p>Investing in solar panels helps homeowners significantly ________ on monthly electricity costs.</p>",
        "choices": [
            {"id": "35_15_1", "text": "cut down", "html": "cut down"},
            {"id": "35_15_2", "text": "run out", "html": "run out"},
            {"id": "35_15_3", "text": "put off", "html": "put off"},
            {"id": "35_15_4", "text": "give up", "html": "give up"}
        ],
        "correctChoiceId": "35_15_1",
        "explanation": "<p>Cụm từ cắt giảm chi phí: <strong>cut down on costs</strong> (tiết kiệm, cắt giảm chi phí).</p>",
        "ruleTip": "'cut down on sth' = reduce (cắt giảm tiêu thụ, chi phí)."
    }
]

theory35 = {
    "topicId": 35,
    "topicName": "Từ vựng: Môi trường & Cộng đồng",
    "englishName": "Topic Vocabulary: Environment & Community",
    "rules": [
        {
            "rule": "1. Từ vựng năng lượng xanh và môi trường:",
            "formula": "renewable energy, carbon footprint, deforestation, biodegradable, toxic waste, sustainable development",
            "examples": "Renewable energy is essential for sustainable urban growth."
        },
        {
            "rule": "2. Từ vựng cộng đồng và làng nghề truyền thống:",
            "formula": "artisan, traditional handicraft, pass down, community service, communal house, resident",
            "examples": "Local artisans pass down pottery techniques to the next generation."
        },
        {
            "rule": "3. Cụm từ hành động bảo vệ môi trường:",
            "formula": "cut down on electricity, recycle plastic, beautify neighborhoods, reduce carbon emissions",
            "examples": "We must cut down on single-use plastics to protect our oceans."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 1659: Sống xanh & Bảo vệ môi trường (15 questions)
# -------------------------------------------------------------
q1659 = [
    {
        "id": "1659_1",
        "questionName": "Question 1",
        "questionText": "<p>Solar and wind power are examples of ________ energy sources that do not emit harmful greenhouse gases.</p>",
        "choices": [
            {"id": "1659_1_1", "text": "renewable", "html": "renewable"},
            {"id": "1659_1_2", "text": "non-renewable", "html": "non-renewable"},
            {"id": "1659_1_3", "text": "exhaustible", "html": "exhaustible"},
            {"id": "1659_1_4", "text": "polluted", "html": "polluted"}
        ],
        "correctChoiceId": "1659_1_1",
        "explanation": "<p>Năng lượng mặt trời và gió là nguồn năng lượng tái tạo: <strong>renewable energy</strong>.</p>",
        "ruleTip": "'renewable energy' = năng lượng tái tạo (>< non-renewable / fossil fuels)."
    },
    {
        "id": "1659_2",
        "questionName": "Question 2",
        "questionText": "<p>Switching from private motorbikes to bicycles helps citizens reduce their carbon ________.</p>",
        "choices": [
            {"id": "1659_2_1", "text": "footprint", "html": "footprint"},
            {"id": "1659_2_2", "text": "fingerprint", "html": "fingerprint"},
            {"id": "1659_2_3", "text": "handprint", "html": "handprint"},
            {"id": "1659_2_4", "text": "blueprint", "html": "blueprint"}
        ],
        "correctChoiceId": "1659_2_1",
        "explanation": "<p>Thuật ngữ môi trường chính xác là <strong>carbon footprint</strong> (dấu chân carbon).</p>",
        "ruleTip": "'carbon footprint' = lượng phát thải khí nhà kính cá nhân."
    },
    {
        "id": "1659_3",
        "questionName": "Question 3",
        "questionText": "<p>Supermarkets should completely ban ________ plastic bags to protect our oceans from pollution.</p>",
        "choices": [
            {"id": "1659_3_1", "text": "single-use", "html": "single-use"},
            {"id": "1659_3_2", "text": "reusable", "html": "reusable"},
            {"id": "1659_3_3", "text": "sustainable", "html": "sustainable"},
            {"id": "1659_3_4", "text": "washable", "html": "washable"}
        ],
        "correctChoiceId": "1659_3_1",
        "explanation": "<p>Đồ nhựa dùng một lần gây ô nhiễm đại dương: <strong>single-use plastic</strong>.</p>",
        "ruleTip": "'single-use' = dùng một lần rồi vứt bỏ; 'reusable' = tái sử dụng nhiều lần."
    },
    {
        "id": "1659_4",
        "questionName": "Question 4",
        "questionText": "<p>Massive ________ in the Amazon rainforest has caused severe loss of global biodiversity.</p>",
        "choices": [
            {"id": "1659_4_1", "text": "deforestation", "html": "deforestation"},
            {"id": "1659_4_2", "text": "afforestation", "html": "afforestation"},
            {"id": "1659_4_3", "text": "plantation", "html": "plantation"},
            {"id": "1659_4_4", "text": "gardening", "html": "gardening"}
        ],
        "correctChoiceId": "1659_4_1",
        "explanation": "<p>Nạn phá rừng nhiệt đới quy mô lớn: <strong>deforestation</strong> làm suy giảm đa dạng sinh học.</p>",
        "ruleTip": "'deforestation' = sự tàn phá rừng diện rộng."
    },
    {
        "id": "1659_5",
        "questionName": "Question 5",
        "questionText": "<p>Excessive carbon dioxide in the atmosphere intensifies the greenhouse ________, warming the planet.</p>",
        "choices": [
            {"id": "1659_5_1", "text": "effect", "html": "effect"},
            {"id": "1659_5_2", "text": "affect", "html": "affect"},
            {"id": "1659_5_3", "text": "result", "html": "result"},
            {"id": "1659_5_4", "text": "consequence", "html": "consequence"}
        ],
        "correctChoiceId": "1659_5_1",
        "explanation": "<p>Thuật ngữ hiệu ứng nhà kính: <strong>greenhouse effect</strong> ('effect' là danh từ).</p>",
        "ruleTip": "'greenhouse effect' = hiệu ứng nhà kính (phân biệt effect danh từ vs affect động từ)."
    },
    {
        "id": "1659_6",
        "questionName": "Question 6",
        "questionText": "<p>Eco-friendly businesses are replacing polystyrene boxes with ________ food containers.</p>",
        "choices": [
            {"id": "1659_6_1", "text": "biodegradable", "html": "biodegradable"},
            {"id": "1659_6_2", "text": "toxic", "html": "toxic"},
            {"id": "1659_6_3", "text": "harmful", "html": "harmful"},
            {"id": "1659_6_4", "text": "permanent", "html": "permanent"}
        ],
        "correctChoiceId": "1659_6_1",
        "explanation": "<p>Hộp đựng thực phẩm tự phân hủy sinh học thân thiện với tự nhiên: <strong>biodegradable</strong>.</p>",
        "ruleTip": "'biodegradable' = có thể bị vi sinh vật phân hủy tự nhiên trong đất."
    },
    {
        "id": "1659_7",
        "questionName": "Question 7",
        "questionText": "<p>Hunting rare animals pushes many precious wildlife species to the verge of ________.</p>",
        "choices": [
            {"id": "1659_7_1", "text": "extinction", "html": "extinction"},
            {"id": "1659_7_2", "text": "survival", "html": "survival"},
            {"id": "1659_7_3", "text": "existence", "html": "existence"},
            {"id": "1659_7_4", "text": "production", "html": "production"}
        ],
        "correctChoiceId": "1659_7_1",
        "explanation": "<p>Cụm từ nguy cơ tuyệt chủng: <strong>on the verge of extinction</strong>.</p>",
        "ruleTip": "'on the verge of extinction' = đứng trên bờ vực tuyệt chủng."
    },
    {
        "id": "1659_8",
        "questionName": "Question 8",
        "questionText": "<p>Adopting an ________ lifestyle means minimizing waste, conserving water, and recycling materials.</p>",
        "choices": [
            {"id": "1659_8_1", "text": "eco-friendly", "html": "eco-friendly"},
            {"id": "1659_8_2", "text": "energy-consuming", "html": "energy-consuming"},
            {"id": "1659_8_3", "text": "industrialized", "html": "industrialized"},
            {"id": "1659_8_4", "text": "extravagant", "html": "extravagant"}
        ],
        "correctChoiceId": "1659_8_1",
        "explanation": "<p>Lối sống thân thiện với môi trường: <strong>eco-friendly lifestyle</strong>.</p>",
        "ruleTip": "'eco-friendly' = environmentally friendly (thân thiện với sinh thái, môi trường)."
    },
    {
        "id": "1659_9",
        "questionName": "Question 9",
        "questionText": "<p>Youth environmental clubs organize campaigns to ________ natural resources and protect wildlife.</p>",
        "choices": [
            {"id": "1659_9_1", "text": "conserve", "html": "conserve"},
            {"id": "1659_9_2", "text": "consume", "html": "consume"},
            {"id": "1659_9_3", "text": "destroy", "html": "destroy"},
            {"id": "1659_9_4", "text": "deplete", "html": "deplete"}
        ],
        "correctChoiceId": "1659_9_1",
        "explanation": "<p>Bảo tồn tài nguyên thiên nhiên: <strong>conserve natural resources</strong>.</p>",
        "ruleTip": "'conserve' = protect from harm/depletion (bảo tồn, giữ gìn)."
    },
    {
        "id": "1659_10",
        "questionName": "Question 10",
        "questionText": "<p>Installing rooftop ________ panels enables households to generate their own green electricity.</p>",
        "choices": [
            {"id": "1659_10_1", "text": "solar", "html": "solar"},
            {"id": "1659_10_2", "text": "lunar", "html": "lunar"},
            {"id": "1659_10_3", "text": "nuclear", "html": "nuclear"},
            {"id": "1659_10_4", "text": "coal", "html": "coal"}
        ],
        "correctChoiceId": "1659_10_1",
        "explanation": "<p>Pin năng lượng mặt trời lắp trên mái nhà: <strong>solar panels</strong>.</p>",
        "ruleTip": "'solar panels' = tấm pin quang điện năng lượng mặt trời."
    },
    {
        "id": "1659_11",
        "questionName": "Question 11",
        "questionText": "<p>During rush hour, air ________ levels in major metropolitan centers reach alarming peaks.</p>",
        "choices": [
            {"id": "1659_11_1", "text": "pollution", "html": "pollution"},
            {"id": "1659_11_2", "text": "pollutant", "html": "pollutant"},
            {"id": "1659_11_3", "text": "polluted", "html": "polluted"},
            {"id": "1659_11_4", "text": "polluting", "html": "polluting"}
        ],
        "correctChoiceId": "1659_11_1",
        "explanation": "<p>Cụm danh từ mức độ ô nhiễm không khí: <strong>air pollution levels</strong>.</p>",
        "ruleTip": "'air pollution' = ô nhiễm không khí; 'pollutant' = chất gây ô nhiễm."
    },
    {
        "id": "1659_12",
        "questionName": "Question 12",
        "questionText": "<p>Improper municipal solid waste ________ severely contaminates local groundwater supplies.</p>",
        "choices": [
            {"id": "1659_12_1", "text": "disposal", "html": "disposal"},
            {"id": "1659_12_2", "text": "storage", "html": "storage"},
            {"id": "1659_12_3", "text": "accumulation", "html": "accumulation"},
            {"id": "1659_12_4", "text": "collection", "html": "collection"}
        ],
        "correctChoiceId": "1659_12_1",
        "explanation": "<p>Việc xử lý rác thải rắn đô thị không đúng cách: <strong>waste disposal</strong>.</p>",
        "ruleTip": "'waste disposal' = việc xử lý, tiêu hủy chất thải."
    },
    {
        "id": "1659_13",
        "questionName": "Question 13",
        "questionText": "<p>Choosing energy-________ appliances helps families lower their monthly utility bills.</p>",
        "choices": [
            {"id": "1659_13_1", "text": "efficient", "html": "efficient"},
            {"id": "1659_13_2", "text": "effective", "html": "effective"},
            {"id": "1659_13_3", "text": "wasting", "html": "wasting"},
            {"id": "1659_13_4", "text": "demanding", "html": "demanding"}
        ],
        "correctChoiceId": "1659_13_1",
        "explanation": "<p>Thiết bị tiết kiệm năng lượng hiệu quả: <strong>energy-efficient appliances</strong>.</p>",
        "ruleTip": "'energy-efficient' = tiết kiệm năng lượng, hiệu suất cao."
    },
    {
        "id": "1659_14",
        "questionName": "Question 14",
        "questionText": "<p>Rising global temperatures have caused severe droughts, heatwaves, and ________ weather events.</p>",
        "choices": [
            {"id": "1659_14_1", "text": "extreme", "html": "extreme"},
            {"id": "1659_14_2", "text": "mild", "html": "mild"},
            {"id": "1659_14_3", "text": "pleasant", "html": "pleasant"},
            {"id": "1659_14_4", "text": "temperate", "html": "temperate"}
        ],
        "correctChoiceId": "1659_14_1",
        "explanation": "<p>Các hiện tượng thời tiết cực đoan do biến đổi khí hậu: <strong>extreme weather events</strong>.</p>",
        "ruleTip": "'extreme weather' = thời tiết cực đoan (bão lũ dữ dội, hạn hán khốc liệt)."
    },
    {
        "id": "1659_15",
        "questionName": "Question 15",
        "questionText": "<p>Large-scale tree-planting and ________ campaigns help absorb atmospheric carbon dioxide.</p>",
        "choices": [
            {"id": "1659_15_1", "text": "afforestation", "html": "afforestation"},
            {"id": "1659_15_2", "text": "deforestation", "html": "deforestation"},
            {"id": "1659_15_3", "text": "logging", "html": "logging"},
            {"id": "1659_15_4", "text": "clearance", "html": "clearance"}
        ],
        "correctChoiceId": "1659_15_1",
        "explanation": "<p>Chiến dịch trồng cây gây rừng phủ xanh đất trống: <strong>afforestation</strong> (sự gây rừng).</p>",
        "ruleTip": "'afforestation' = sự trồng rừng mới (>< deforestation: nạn phá rừng)."
    }
]

theory1659 = {
    "topicId": 1659,
    "topicName": "Sống xanh & Bảo vệ môi trường",
    "englishName": "Going Green & Environmental Protection",
    "rules": [
        {
            "rule": "1. Từ vựng nguyên nhân và tác hại môi trường:",
            "formula": "deforestation, greenhouse effect, carbon footprint, single-use plastics, toxic waste, air pollution",
            "examples": "Deforestation and fossil fuels accelerate global warming and climate change."
        },
        {
            "rule": "2. Từ vựng giải pháp lối sống xanh:",
            "formula": "renewable energy, solar panels, biodegradable packaging, energy-efficient appliances, afforestation",
            "examples": "Using biodegradable bags and solar panels helps reduce your ecological footprint."
        },
        {
            "rule": "3. Cụm từ bảo tồn động thực vật quý hiếm:",
            "formula": "on the verge of extinction, endangered species, natural habitat, wildlife conservation",
            "examples": "Many rare animals are on the verge of extinction due to illegal poaching."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 1645: Cộng đồng địa phương & Làng nghề (15 questions)
# -------------------------------------------------------------
q1645 = [
    {
        "id": "1645_1",
        "questionName": "Question 1",
        "questionText": "<p>Talented ________ in Van Phuc Silk Village have preserved the intricate weaving technique for centuries.</p>",
        "choices": [
            {"id": "1645_1_1", "text": "artisans", "html": "artisans"},
            {"id": "1645_1_2", "text": "assistants", "html": "assistants"},
            {"id": "1645_1_3", "text": "mechanics", "html": "mechanics"},
            {"id": "1645_1_4", "text": "tourists", "html": "tourists"}
        ],
        "correctChoiceId": "1645_1_1",
        "explanation": "<p>Nghệ nhân làng lụa Vạn Phúc: <strong>artisans (nghệ nhân dệt lụa)</strong>.</p>",
        "ruleTip": "'artisan' = thợ thủ công nghệ nhân tài hoa của làng nghề."
    },
    {
        "id": "1645_2",
        "questionName": "Question 2",
        "questionText": "<p>Visitors to Bat Trang ________ village can mold their own clay cups and ceramic vases.</p>",
        "choices": [
            {"id": "1645_2_1", "text": "pottery", "html": "pottery"},
            {"id": "1645_2_2", "text": "weaving", "html": "weaving"},
            {"id": "1645_2_3", "text": "carpentry", "html": "carpentry"},
            {"id": "1645_2_4", "text": "blacksmith", "html": "blacksmith"}
        ],
        "correctChoiceId": "1645_2_1",
        "explanation": "<p>Làng gốm Bát Tràng: <strong>pottery village</strong>.</p>",
        "ruleTip": "'pottery' = đồ gốm sứ; 'pottery village' = làng gốm."
    },
    {
        "id": "1645_3",
        "questionName": "Question 3",
        "questionText": "<p>In Northern Vietnamese villages, the communal ________ has always been the heart of community gatherings.</p>",
        "choices": [
            {"id": "1645_3_1", "text": "house", "html": "house"},
            {"id": "1645_3_2", "text": "palace", "html": "palace"},
            {"id": "1645_3_3", "text": "castle", "html": "castle"},
            {"id": "1645_3_4", "text": "tower", "html": "tower"}
        ],
        "correctChoiceId": "1645_3_1",
        "explanation": "<p>Đình làng ở Bắc Bộ: <strong>communal house</strong>.</p>",
        "ruleTip": "'communal house' = đình làng truyền thống nơi hội họp cộng đồng."
    },
    {
        "id": "1645_4",
        "questionName": "Question 4",
        "questionText": "<p>Participating in local community ________ teaches young students empathy and civic responsibility.</p>",
        "choices": [
            {"id": "1645_4_1", "text": "service", "html": "service"},
            {"id": "1645_4_2", "text": "business", "html": "business"},
            {"id": "1645_4_3", "text": "entertainment", "html": "entertainment"},
            {"id": "1645_4_4", "text": "conflict", "html": "conflict"}
        ],
        "correctChoiceId": "1645_4_1",
        "explanation": "<p>Hoạt động phục vụ cộng đồng: <strong>community service</strong>.</p>",
        "ruleTip": "'community service' = hoạt động phục vụ cộng đồng tình nguyện."
    },
    {
        "id": "1645_5",
        "questionName": "Question 5",
        "questionText": "<p>Our youth volunteer group visited a local ________ home to cook meals and talk with lonely senior citizens.</p>",
        "choices": [
            {"id": "1645_5_1", "text": "nursing", "html": "nursing"},
            {"id": "1645_5_2", "text": "kindergarten", "html": "kindergarten"},
            {"id": "1645_5_3", "text": "orphanage", "html": "orphanage"},
            {"id": "1645_5_4", "text": "factory", "html": "factory"}
        ],
        "correctChoiceId": "1645_5_1",
        "explanation": "<p>Viện dưỡng lão dành cho người cao tuổi: <strong>nursing home</strong>.</p>",
        "ruleTip": "'nursing home' = viện dưỡng lão (chăm sóc người già)."
    },
    {
        "id": "1645_6",
        "questionName": "Question 6",
        "questionText": "<p>Many families choose to relocate from the crowded inner city to green ________ areas for fresher air.</p>",
        "choices": [
            {"id": "1645_6_1", "text": "suburban", "html": "suburban"},
            {"id": "1645_6_2", "text": "industrial", "html": "industrial"},
            {"id": "1645_6_3", "text": "downtown", "html": "downtown"},
            {"id": "1645_6_4", "text": "desert", "html": "desert"}
        ],
        "correctChoiceId": "1645_6_1",
        "explanation": "<p>Vùng ngoại ô thoáng đãng: <strong>suburban areas</strong>.</p>",
        "ruleTip": "'suburban' = thuộc ngoại ô; 'urban' = thuộc đô thị; 'rural' = thuộc nông thôn."
    },
    {
        "id": "1645_7",
        "questionName": "Question 7",
        "questionText": "<p>Cultural ________ programs aim to safeguard ancient folk songs like Quan Ho and Cheo.</p>",
        "choices": [
            {"id": "1645_7_1", "text": "preservation", "html": "preservation"},
            {"id": "1645_7_2", "text": "destruction", "html": "destruction"},
            {"id": "1645_7_3", "text": "damage", "html": "damage"},
            {"id": "1645_7_4", "text": "omission", "html": "omission"}
        ],
        "correctChoiceId": "1645_7_1",
        "explanation": "<p>Chương trình bảo tồn văn hóa dân gian: <strong>cultural preservation</strong>.</p>",
        "ruleTip": "'preservation' = sự bảo tồn, gìn giữ di sản (preserve -> preservation)."
    },
    {
        "id": "1645_8",
        "questionName": "Question 8",
        "questionText": "<p>The residential group established a night ________ watch to maintain neighborhood security.</p>",
        "choices": [
            {"id": "1645_8_1", "text": "neighborhood", "html": "neighborhood"},
            {"id": "1645_8_2", "text": "stranger", "html": "stranger"},
            {"id": "1645_8_3", "text": "foreigner", "html": "foreigner"},
            {"id": "1645_8_4", "text": "tourist", "html": "tourist"}
        ],
        "correctChoiceId": "1645_8_1",
        "explanation": "<p>Tổ dân phố tự quản giữ an ninh: <strong>neighborhood watch</strong>.</p>",
        "ruleTip": "'neighborhood watch' = đội tự quản dân phòng khu phố."
    },
    {
        "id": "1645_9",
        "questionName": "Question 9",
        "questionText": "<p>The Temple of Literature is considered a prominent historical ________ in Hanoi.</p>",
        "choices": [
            {"id": "1645_9_1", "text": "site", "html": "site"},
            {"id": "1645_9_2", "text": "sight", "html": "sight"},
            {"id": "1645_9_3", "text": "cite", "html": "cite"},
            {"id": "1645_9_4", "text": "scene", "html": "scene"}
        ],
        "correctChoiceId": "1645_9_1",
        "explanation": "<p>Địa danh, di tích lịch sử nổi bật: <strong>historical site</strong> (Văn Miếu Quốc Tử Giám).</p>",
        "ruleTip": "'historical site' = di tích lịch sử; phân biệt site (địa điểm) vs sight (cảnh tượng)."
    },
    {
        "id": "1645_10",
        "questionName": "Question 10",
        "questionText": "<p>Conical hats made in Chuong Village are famous traditional Vietnamese ________.</p>",
        "choices": [
            {"id": "1645_10_1", "text": "handicrafts", "html": "handicrafts"},
            {"id": "1645_10_2", "text": "electronics", "html": "electronics"},
            {"id": "1645_10_3", "text": "machines", "html": "machines"},
            {"id": "1645_10_4", "text": "vehicles", "html": "vehicles"}
        ],
        "correctChoiceId": "1645_10_1",
        "explanation": "<p>Nón lá làng Chuông là sản phẩm thủ công mỹ nghệ: <strong>handicrafts</strong>.</p>",
        "ruleTip": "'handicrafts' = hàng thủ công mỹ nghệ làm bằng tay."
    },
    {
        "id": "1645_11",
        "questionName": "Question 11",
        "questionText": "<p>Traditional lacquerware skills have been ________ down from master craftspeople to apprentices.</p>",
        "choices": [
            {"id": "1645_11_1", "text": "passed", "html": "passed"},
            {"id": "1645_11_2", "text": "put", "html": "put"},
            {"id": "1645_11_3", "text": "cut", "html": "cut"},
            {"id": "1645_11_4", "text": "given", "html": "given"}
        ],
        "correctChoiceId": "1645_11_1",
        "explanation": "<p>Nghề sơn mài truyền thống được truyền lại: <strong>passed down</strong>.</p>",
        "ruleTip": "'pass down' = truyền lại từ thế hệ này sang thế hệ khác."
    },
    {
        "id": "1645_12",
        "questionName": "Question 12",
        "questionText": "<p>All the local ________ agreed to donate funds to clean up the shared community pond.</p>",
        "choices": [
            {"id": "1645_12_1", "text": "residents", "html": "residents"},
            {"id": "1645_12_2", "text": "guests", "html": "guests"},
            {"id": "1645_12_3", "text": "passers-by", "html": "passers-by"},
            {"id": "1645_12_4", "text": "travelers", "html": "travelers"}
        ],
        "correctChoiceId": "1645_12_1",
        "explanation": "<p>Cư dân địa phương đồng lòng quyên góp: <strong>residents</strong>.</p>",
        "ruleTip": "'local residents' = người dân địa phương sinh sống trong khu vực."
    },
    {
        "id": "1645_13",
        "questionName": "Question 13",
        "questionText": "<p>Ecotourism has provided an economic ________ to traditional craft villages near the capital.</p>",
        "choices": [
            {"id": "1645_13_1", "text": "boost", "html": "boost"},
            {"id": "1645_13_2", "text": "barrier", "html": "barrier"},
            {"id": "1645_13_3", "text": "loss", "html": "loss"},
            {"id": "1645_13_4", "text": "decline", "html": "decline"}
        ],
        "correctChoiceId": "1645_13_1",
        "explanation": "<p>Du lịch sinh thái mang lại sự thúc đẩy kinh tế: <strong>an economic boost</strong>.</p>",
        "ruleTip": "'an economic boost' = đòn bẩy, sự thúc đẩy tăng trưởng kinh tế."
    },
    {
        "id": "1645_14",
        "questionName": "Question 14",
        "questionText": "<p>Civic ________ requires every citizen to vote and comply with environmental hygiene laws.</p>",
        "choices": [
            {"id": "1645_14_1", "text": "responsibility", "html": "responsibility"},
            {"id": "1645_14_2", "text": "irresponsibility", "html": "irresponsibility"},
            {"id": "1645_14_3", "text": "neglect", "html": "neglect"},
            {"id": "1645_14_4", "text": "refusal", "html": "refusal"}
        ],
        "correctChoiceId": "1645_14_1",
        "explanation": "<p>Trách nhiệm công dân đối với xã hội: <strong>civic responsibility</strong>.</p>",
        "ruleTip": "'civic responsibility' = trách nhiệm công dân đối với cộng đồng."
    },
    {
        "id": "1645_15",
        "questionName": "Question 15",
        "questionText": "<p>Growing up in a close-knit village gives people a strong sense of ________ and identity.</p>",
        "choices": [
            {"id": "1645_15_1", "text": "belonging", "html": "belonging"},
            {"id": "1645_15_2", "text": "isolation", "html": "isolation"},
            {"id": "1645_15_3", "text": "loneliness", "html": "loneliness"},
            {"id": "1645_15_4", "text": "strangeness", "html": "strangeness"}
        ],
        "correctChoiceId": "1645_15_1",
        "explanation": "<p>Ý thức gắn kết thuộc về cộng đồng: <strong>a sense of belonging</strong>.</p>",
        "ruleTip": "'a sense of belonging' = cảm giác thân thuộc, gắn bó với cộng đồng quê hương."
    }
]

theory1645 = {
    "topicId": 1645,
    "topicName": "Cộng đồng địa phương & Làng nghề",
    "englishName": "Local Community & Traditional Crafts",
    "rules": [
        {
            "rule": "1. Từ vựng làng nghề và thủ công mỹ nghệ:",
            "formula": "artisan (nghệ nhân), pottery (gốm), lacquerware (sơn mài), conical hat (nón lá), pass down (lưu truyền)",
            "examples": "Artisans in traditional craft villages pass down skills through generations."
        },
        {
            "rule": "2. Từ vựng địa điểm và công trình cộng đồng:",
            "formula": "communal house (đình làng), nursing home (viện dưỡng lão), historical site (di tích lịch sử)",
            "examples": "The village communal house is a prominent historical site."
        },
        {
            "rule": "3. Cụm từ gắn kết và trách nhiệm cộng đồng:",
            "formula": "community service (hoạt động công ích), local residents (cư dân), civic responsibility, sense of belonging",
            "examples": "Volunteering builds civic responsibility and a deep sense of belonging."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 36: Từ đồng nghĩa & Trái nghĩa (Synonyms & Antonyms) (15 questions)
# -------------------------------------------------------------
q36 = [
    {
        "id": "36_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Regular physical exercise is <u>essential</u> for maintaining a sharp mind and good health.</p>",
        "choices": [
            {"id": "36_1_1", "text": "vital", "html": "vital"},
            {"id": "36_1_2", "text": "optional", "html": "optional"},
            {"id": "36_1_3", "text": "useless", "html": "useless"},
            {"id": "36_1_4", "text": "harmful", "html": "harmful"}
        ],
        "correctChoiceId": "36_1_1",
        "explanation": "<p><strong>essential</strong> = vô cùng quan trọng, thiết yếu = <strong>vital</strong>.<br/>optional: tự chọn; useless: vô ích; harmful: có hại.</p>",
        "ruleTip": "'essential' = 'vital' = 'crucial' = 'necessary' (thiết yếu, cực kỳ quan trọng)."
    },
    {
        "id": "36_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Wearing protective helmets when riding motorbikes is <u>compulsory</u> for all citizens in Vietnam.</p>",
        "choices": [
            {"id": "36_2_1", "text": "mandatory", "html": "mandatory"},
            {"id": "36_2_2", "text": "voluntary", "html": "voluntary"},
            {"id": "36_2_3", "text": "forbidden", "html": "forbidden"},
            {"id": "36_2_4", "text": "difficult", "html": "difficult"}
        ],
        "correctChoiceId": "36_2_1",
        "explanation": "<p><strong>compulsory</strong> = bắt buộc theo luật = <strong>mandatory</strong>.<br/>voluntary: tự nguyện; forbidden: bị cấm.</p>",
        "ruleTip": "'compulsory' = 'mandatory' = 'obligatory' (bắt buộc theo luật định)."
    },
    {
        "id": "36_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Local communities must work closely together to <u>conserve</u> their historical ancient pagodas.</p>",
        "choices": [
            {"id": "36_3_1", "text": "protect", "html": "protect"},
            {"id": "36_3_2", "text": "destroy", "html": "destroy"},
            {"id": "36_3_3", "text": "neglect", "html": "neglect"},
            {"id": "36_3_4", "text": "damage", "html": "damage"}
        ],
        "correctChoiceId": "36_3_1",
        "explanation": "<p><strong>conserve</strong> = bảo tồn, bảo vệ = <strong>protect</strong> / preserve.<br/>destroy: phá hủy; neglect: phớt lờ, bỏ bê.</p>",
        "ruleTip": "'conserve' = 'protect' = 'preserve' (bảo tồn, giữ gìn)."
    },
    {
        "id": "36_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>He grew up in a <u>wealthy</u> family with access to top international educational facilities.</p>",
        "choices": [
            {"id": "36_4_1", "text": "rich", "html": "rich"},
            {"id": "36_4_2", "text": "poor", "html": "poor"},
            {"id": "36_4_3", "text": "broke", "html": "broke"},
            {"id": "36_4_4", "text": "needy", "html": "needy"}
        ],
        "correctChoiceId": "36_4_1",
        "explanation": "<p><strong>wealthy</strong> = giàu có, thịnh vượng = <strong>rich</strong> / well-off.<br/>poor: nghèo; broke: cháy túi; needy: túng thiếu.</p>",
        "ruleTip": "'wealthy' = 'rich' = 'well-off' = 'prosperous' (giàu có, khá giả)."
    },
    {
        "id": "36_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Heavy flash floods caused catastrophic <u>damage</u> to the farmers' agricultural crops.</p>",
        "choices": [
            {"id": "36_5_1", "text": "harm", "html": "harm"},
            {"id": "36_5_2", "text": "benefit", "html": "benefit"},
            {"id": "36_5_3", "text": "assistance", "html": "assistance"},
            {"id": "36_5_4", "text": "profit", "html": "profit"}
        ],
        "correctChoiceId": "36_5_1",
        "explanation": "<p><strong>damage</strong> = thiệt hại, tổn hại = <strong>harm</strong> / destruction.<br/>benefit: lợi ích; assistance: sự giúp đỡ; profit: lợi nhuận.</p>",
        "ruleTip": "'damage' = 'harm' = 'destruction' (sự tàn phá, thiệt hại)."
    },
    {
        "id": "36_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Passing the entrance examination to specialized high schools is a <u>challenging</u> task.</p>",
        "choices": [
            {"id": "36_6_1", "text": "difficult", "html": "difficult"},
            {"id": "36_6_2", "text": "effortless", "html": "effortless"},
            {"id": "36_6_3", "text": "simple", "html": "simple"},
            {"id": "36_6_4", "text": "smooth", "html": "smooth"}
        ],
        "correctChoiceId": "36_6_1",
        "explanation": "<p><strong>challenging</strong> = đầy thách thức, khó khăn = <strong>difficult</strong> / demanding.<br/>effortless: dễ dàng không tốn sức; simple: đơn giản.</p>",
        "ruleTip": "'challenging' = 'difficult' = 'tough' (đầy thử thách, khó khăn)."
    },
    {
        "id": "36_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>Hoi An ancient town is <u>famous</u> worldwide for its lantern-lit streets and unique wooden architecture.</p>",
        "choices": [
            {"id": "36_7_1", "text": "well-known", "html": "well-known"},
            {"id": "36_7_2", "text": "unknown", "html": "unknown"},
            {"id": "36_7_3", "text": "mysterious", "html": "mysterious"},
            {"id": "36_7_4", "text": "ordinary", "html": "ordinary"}
        ],
        "correctChoiceId": "36_7_1",
        "explanation": "<p><strong>famous</strong> = nổi tiếng khắp nơi = <strong>well-known</strong> / renowned.<br/>unknown: vô danh; ordinary: bình thường.</p>",
        "ruleTip": "'famous' = 'well-known' = 'renowned' (nổi tiếng, được nhiều người biết đến)."
    },
    {
        "id": "36_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word CLOSEST in meaning to the underlined word.</strong></p><p>The school has launched a campaign to <u>reduce</u> single-use plastic waste in the cafeteria.</p>",
        "choices": [
            {"id": "36_8_1", "text": "cut down", "html": "cut down"},
            {"id": "36_8_2", "text": "increase", "html": "increase"},
            {"id": "36_8_3", "text": "multiply", "html": "multiply"},
            {"id": "36_8_4", "text": "expand", "html": "expand"}
        ],
        "correctChoiceId": "36_8_1",
        "explanation": "<p><strong>reduce</strong> = cắt giảm, giảm thiểu = <strong>cut down</strong> / decrease.<br/>increase: tăng; multiply: nhân lên; expand: mở rộng.</p>",
        "ruleTip": "'reduce' = 'cut down' = 'decrease' (cắt giảm, giảm bớt)."
    },
    {
        "id": "36_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>Many <u>ancient</u> houses and temples in the city center are being renovated with great care.</p>",
        "choices": [
            {"id": "36_9_1", "text": "modern", "html": "modern"},
            {"id": "36_9_2", "text": "historical", "html": "historical"},
            {"id": "36_9_3", "text": "aged", "html": "aged"},
            {"id": "36_9_4", "text": "traditional", "html": "traditional"}
        ],
        "correctChoiceId": "36_9_1",
        "explanation": "<p><strong>ancient</strong> = cổ kính, lâu đời; trái nghĩa là <strong>modern</strong> (hiện đại, mới mẻ).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'ancient' (cổ đại, cổ kính) >< 'modern' (hiện đại)."
    },
    {
        "id": "36_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>The river flowing through our town has become heavily <u>polluted</u> due to industrial discharge.</p>",
        "choices": [
            {"id": "36_10_1", "text": "clean", "html": "clean"},
            {"id": "36_10_2", "text": "contaminated", "html": "contaminated"},
            {"id": "36_10_3", "text": "dirty", "html": "dirty"},
            {"id": "36_10_4", "text": "toxic", "html": "toxic"}
        ],
        "correctChoiceId": "36_10_1",
        "explanation": "<p><strong>polluted</strong> = bị ô nhiễm; trái nghĩa là <strong>clean</strong> (sạch sẽ, trong lành).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'polluted' = 'contaminated' (ô nhiễm) >< 'clean' = 'pure' (trong sạch)."
    },
    {
        "id": "36_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>The price of organic vegetables has <u>increased</u> sharply over the past few weeks.</p>",
        "choices": [
            {"id": "36_11_1", "text": "decreased", "html": "decreased"},
            {"id": "36_11_2", "text": "risen", "html": "risen"},
            {"id": "36_11_3", "text": "climbed", "html": "climbed"},
            {"id": "36_11_4", "text": "grown", "html": "grown"}
        ],
        "correctChoiceId": "36_11_1",
        "explanation": "<p><strong>increased</strong> = tăng lên; trái nghĩa là <strong>decreased</strong> (giảm xuống).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'increase' = 'rise' (tăng) >< 'decrease' = 'drop' (giảm)."
    },
    {
        "id": "36_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>Mr. Nam is a <u>generous</u> benefactor who regularly donates books and scholarships to poor pupils.</p>",
        "choices": [
            {"id": "36_12_1", "text": "selfish", "html": "selfish"},
            {"id": "36_12_2", "text": "kind", "html": "kind"},
            {"id": "36_12_3", "text": "charitable", "html": "charitable"},
            {"id": "36_12_4", "text": "helpful", "html": "helpful"}
        ],
        "correctChoiceId": "36_12_1",
        "explanation": "<p><strong>generous</strong> = hào phóng, rộng lượng; trái nghĩa là <strong>selfish</strong> (ích kỷ, keo kiệt) / stingy.</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'generous' (hào phóng) >< 'selfish' = 'mean' (ích kỷ, hẹp hòi)."
    },
    {
        "id": "36_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>More and more young people are leaving <u>rural</u> villages to seek employment opportunities in Hanoi.</p>",
        "choices": [
            {"id": "36_13_1", "text": "urban", "html": "urban"},
            {"id": "36_13_2", "text": "peaceful", "html": "peaceful"},
            {"id": "36_13_3", "text": "agricultural", "html": "agricultural"},
            {"id": "36_13_4", "text": "provincial", "html": "provincial"}
        ],
        "correctChoiceId": "36_13_1",
        "explanation": "<p><strong>rural</strong> = thuộc nông thôn; trái nghĩa là <strong>urban</strong> (thuộc thành thị, đô thị).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'rural' (nông thôn) >< 'urban' (thành thị)."
    },
    {
        "id": "36_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>Our new teacher is very <u>strict</u> about homework deadlines and classroom discipline.</p>",
        "choices": [
            {"id": "36_14_1", "text": "lenient", "html": "lenient"},
            {"id": "36_14_2", "text": "harsh", "html": "harsh"},
            {"id": "36_14_3", "text": "firm", "html": "firm"},
            {"id": "36_14_4", "text": "severe", "html": "severe"}
        ],
        "correctChoiceId": "36_14_1",
        "explanation": "<p><strong>strict</strong> = nghiêm khắc; trái nghĩa là <strong>lenient</strong> (khoan dung, dễ tính).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'strict' = 'severe' (nghiêm khắc) >< 'lenient' (khoan dung, dễ dãi)."
    },
    {
        "id": "36_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Mark the letter A, B, C, or D to indicate the word OPPOSITE in meaning to the underlined word.</strong></p><p>They built a <u>temporary</u> wooden shelter while waiting for their new brick house to be constructed.</p>",
        "choices": [
            {"id": "36_15_1", "text": "permanent", "html": "permanent"},
            {"id": "36_15_2", "text": "short-term", "html": "short-term"},
            {"id": "36_15_3", "text": "brief", "html": "brief"},
            {"id": "36_15_4", "text": "momentary", "html": "momentary"}
        ],
        "correctChoiceId": "36_15_1",
        "explanation": "<p><strong>temporary</strong> = tạm thời; trái nghĩa là <strong>permanent</strong> (lâu dài, vĩnh viễn).</p>",
        "ruleTip": "Cặp từ trái nghĩa: 'temporary' (tạm thời) >< 'permanent' (vĩnh cửu, lâu dài)."
    }
]

theory36 = {
    "topicId": 36,
    "topicName": "Từ đồng nghĩa & Từ trái nghĩa",
    "englishName": "Synonyms and Antonyms",
    "rules": [
        {
            "rule": "1. Chiến lược làm bài Tìm từ Đồng nghĩa (CLOSEST in meaning):",
            "formula": "Xác định từ loại -> Dịch ngữ cảnh câu -> Thay thế từng phương án vào câu -> Chọn từ mang nghĩa tương đương nhất",
            "examples": "essential = vital, compulsory = mandatory, conserve = protect, wealthy = rich, reduce = cut down."
        },
        {
            "rule": "2. Chiến lược làm bài Tìm từ Trái nghĩa (OPPOSITE in meaning):",
            "formula": "ĐỌC KỸ ĐỀ (tránh bẫy chọn nhầm từ đồng nghĩa!) -> Xác định nghĩa từ gạch chân -> Chọn từ đối lập nghĩa hoàn toàn",
            "examples": "ancient >< modern, polluted >< clean, increase >< decrease, generous >< selfish, rural >< urban, strict >< lenient, temporary >< permanent."
        },
        {
            "rule": "3. Mẹo tránh bẫy đề thi tuyển sinh vào 10:",
            "formula": "Trong 4 phương án, người ra đề LUÔN cài sẵn 1 từ đồng nghĩa để bẫy học sinh làm bài trái nghĩa! Hãy khoanh tròn chữ OPPOSITE.",
            "examples": "Khi hỏi OPPOSITE của 'polluted', thấy 'contaminated' thì tuyệt đối KHÔNG chọn, phải chọn 'clean'."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 81: Guided Cloze Tests (15 questions = 3 passages x 5)
# -------------------------------------------------------------
passage81_1 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct word that best fits each of the numbered blanks.</p>'
    '<p>Plastic waste has become one of the most critical environmental threats facing our planet today. Millions of tons of plastic enter the oceans every year, polluting marine ecosystems and endangering wildlife. When marine creatures accidentally ingest plastic debris, they lose their natural <strong>(1) ________</strong> and often suffer fatal injuries. Furthermore, plastics break down into microscopic particles, <strong>(2) ________</strong> absorb dangerous chemicals and enter the human food chain through seafood. <strong>(3) ________</strong>, plastic takes hundreds of years to decompose, creating an enduring burden on future generations. In order to mitigate this ecological crisis, governments around the globe must <strong>(4) ________</strong> strict measures against single-use plastics and encourage recycling initiatives. Every citizen can make a substantial contribution by carrying reusable cloth bags and drinking bottles, <strong>(5) ________</strong> small personal choices collectively yield immense global changes.</p>'
    '</div>'
)

passage81_2 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct word that best fits each of the numbered blanks.</p>'
    '<p>Situated on the gentle bank of the Day River in Hanoi, Van Phuc Silk Village is <strong>(6) ________</strong> for its time-honored tradition of weaving exquisite silk fabrics. With a vibrant history spanning over a thousand years, this picturesque village attracts both domestic and international visitors <strong>(7) ________</strong> want to witness authentic craftsmanship. Artisans in the village still operate traditional wooden looms, producing smooth and colorful silk products that appeal to <strong>(8) ________</strong> selective customers. In recent years, local authorities have made earnest efforts to <strong>(9) ________</strong> this precious cultural heritage by establishing modern exhibitions and workshops. <strong>(10) ________</strong>, villagers have adopted eco-friendly natural dyes to protect the local environment, ensuring that the legacy of Hanoi silk remains vibrant for generations to come.</p>'
    '</div>'
)

passage81_3 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct word that best fits each of the numbered blanks.</p>'
    '<p>In recent years, more and more urban families have committed to adopting green living habits. By doing so, they not only protect the surrounding nature but also minimize their carbon <strong>(11) ________</strong> significantly. Instead of purchasing goods wrapped in layers of plastic packaging, conscious consumers opt for products made from bamboo, glass, and <strong>(12) ________</strong> biodegradable materials. Furthermore, young students <strong>(13) ________</strong> participate in school environmental campaigns are encouraged to turn off electronic devices when not in use. They also learn to <strong>(14) ________</strong> single-use items and walk or ride bicycles to school. <strong>(15) ________</strong> shifting to an eco-friendly lifestyle requires patience and discipline, the long-term benefits to public health and biodiversity are immeasurable.</p>'
    '</div>'
)

q81 = [
    # Passage 1 (81_1 to 81_5)
    {
        "id": "81_1",
        "questionName": "Question 1",
        "questionText": f"{passage81_1}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (1):</p>",
        "choices": [
            {"id": "81_1_1", "text": "habitats", "html": "habitats"},
            {"id": "81_1_2", "text": "houses", "html": "houses"},
            {"id": "81_1_3", "text": "accommodations", "html": "accommodations"},
            {"id": "81_1_4", "text": "residences", "html": "residences"}
        ],
        "correctChoiceId": "81_1_1",
        "explanation": "<p>Cụm từ chỉ môi trường sống tự nhiên của sinh vật biển là <strong>natural habitats</strong> (môi trường sống tự nhiên).<br/>Houses: nhà ở của người; accommodations: chỗ ở; residences: nơi cư trú.</p>",
        "ruleTip": "'natural habitat' = môi trường sống tự nhiên của động thực vật hoang dã."
    },
    {
        "id": "81_2",
        "questionName": "Question 2",
        "questionText": f"{passage81_1}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (2):</p>",
        "choices": [
            {"id": "81_2_1", "text": "which", "html": "which"},
            {"id": "81_2_2", "text": "who", "html": "who"},
            {"id": "81_2_3", "text": "whom", "html": "whom"},
            {"id": "81_2_4", "text": "whose", "html": "whose"}
        ],
        "correctChoiceId": "81_2_1",
        "explanation": "<p>Đại từ quan hệ đứng sau dấu phẩy bổ nghĩa cho danh từ chỉ vật 'microscopic particles' (các hạt vi nhựa): dùng <strong>which</strong>.</p>",
        "ruleTip": "Đại từ quan hệ bổ nghĩa cho danh từ chỉ vật sau dấu phẩy: dùng WHICH (không dùng that)."
    },
    {
        "id": "81_3",
        "questionName": "Question 3",
        "questionText": f"{passage81_1}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (3):</p>",
        "choices": [
            {"id": "81_3_1", "text": "Moreover", "html": "Moreover"},
            {"id": "81_3_2", "text": "However", "html": "However"},
            {"id": "81_3_3", "text": "Although", "html": "Although"},
            {"id": "81_3_4", "text": "Despite", "html": "Despite"}
        ],
        "correctChoiceId": "81_3_1",
        "explanation": "<p>Liên từ bổ sung thêm một ý tiêu cực về rác thải nhựa: <strong>Moreover,</strong> (Hơn thế nữa).<br/>However chỉ sự tương phản; Although/Despite chỉ sự nhượng bộ.</p>",
        "ruleTip": "'Moreover' / 'Furthermore' đứng đầu câu sau dấu chấm và trước dấu phẩy mang nghĩa 'Hơn thế nữa' để bổ sung thông tin."
    },
    {
        "id": "81_4",
        "questionName": "Question 4",
        "questionText": f"{passage81_1}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (4):</p>",
        "choices": [
            {"id": "81_4_1", "text": "take", "html": "take"},
            {"id": "81_4_2", "text": "make", "html": "make"},
            {"id": "81_4_3", "text": "do", "html": "do"},
            {"id": "81_4_4", "text": "give", "html": "give"}
        ],
        "correctChoiceId": "81_4_1",
        "explanation": "<p>Collocation thực hiện các biện pháp quyết liệt: <strong>take strict measures</strong>.</p>",
        "ruleTip": "'take measures' = thực hiện các biện pháp/chính sách hành động."
    },
    {
        "id": "81_5",
        "questionName": "Question 5",
        "questionText": f"{passage81_1}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (5):</p>",
        "choices": [
            {"id": "81_5_1", "text": "because", "html": "because"},
            {"id": "81_5_2", "text": "although", "html": "although"},
            {"id": "81_5_3", "text": "unless", "html": "unless"},
            {"id": "81_5_4", "text": "but", "html": "but"}
        ],
        "correctChoiceId": "81_5_1",
        "explanation": "<p>Mệnh đề sau giải thích lý do vì sao mọi công dân có thể đóng góp: <strong>because</strong> (bởi vì các lựa chọn cá nhân gom lại sẽ tạo nên sự thay đổi lớn).</p>",
        "ruleTip": "'because + mệnh đề' chỉ nguyên nhân lý do hợp lý."
    },

    # Passage 2 (81_6 to 81_10)
    {
        "id": "81_6",
        "questionName": "Question 6",
        "questionText": f"{passage81_2}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (6):</p>",
        "choices": [
            {"id": "81_6_1", "text": "famous", "html": "famous"},
            {"id": "81_6_2", "text": "proud", "html": "proud"},
            {"id": "81_6_3", "text": "interested", "html": "interested"},
            {"id": "81_6_4", "text": "fond", "html": "fond"}
        ],
        "correctChoiceId": "81_6_1",
        "explanation": "<p>Đi với giới từ \"for\" phía sau: <strong>famous for</strong> (nổi tiếng về điều gì). Proud đi với of, interested đi với in, fond đi với of.</p>",
        "ruleTip": "'be famous for' = nổi tiếng vì cái gì; 'proud of' = tự hào về cái gì."
    },
    {
        "id": "81_7",
        "questionName": "Question 7",
        "questionText": f"{passage81_2}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (7):</p>",
        "choices": [
            {"id": "81_7_1", "text": "who", "html": "who"},
            {"id": "81_7_2", "text": "which", "html": "which"},
            {"id": "81_7_3", "text": "whose", "html": "whose"},
            {"id": "81_7_4", "text": "where", "html": "where"}
        ],
        "correctChoiceId": "81_7_1",
        "explanation": "<p>Đại từ quan hệ bổ nghĩa cho danh từ chỉ người 'domestic and international visitors' làm chủ ngữ trước động từ 'want': dùng <strong>who</strong>.</p>",
        "ruleTip": "Đại từ quan hệ thay thế cho người làm chủ ngữ: dùng WHO."
    },
    {
        "id": "81_8",
        "questionName": "Question 8",
        "questionText": f"{passage81_2}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (8):</p>",
        "choices": [
            {"id": "81_8_1", "text": "many", "html": "many"},
            {"id": "81_8_2", "text": "much", "html": "much"},
            {"id": "81_8_3", "text": "little", "html": "little"},
            {"id": "81_8_4", "text": "every", "html": "every"}
        ],
        "correctChoiceId": "81_8_1",
        "explanation": "<p>'Customers' là danh từ đếm được số nhiều: dùng lượng từ <strong>many</strong> (nhiều khách hàng). 'Much/little' đi với danh từ không đếm được; 'every' đi với danh từ số ít.</p>",
        "ruleTip": "'many + danh từ đếm được số nhiều' (many customers); 'much + danh từ không đếm được'."
    },
    {
        "id": "81_9",
        "questionName": "Question 9",
        "questionText": f"{passage81_2}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (9):</p>",
        "choices": [
            {"id": "81_9_1", "text": "preserve", "html": "preserve"},
            {"id": "81_9_2", "text": "destroy", "html": "destroy"},
            {"id": "81_9_3", "text": "ignore", "html": "ignore"},
            {"id": "81_9_4", "text": "invent", "html": "invent"}
        ],
        "correctChoiceId": "81_9_1",
        "explanation": "<p>Chính quyền nỗ lực gìn giữ, bảo tồn di sản văn hóa: <strong>preserve this precious cultural heritage</strong>.<br/>destroy: phá hủy; ignore: phớt lờ; invent: phát minh.</p>",
        "ruleTip": "'preserve heritage' = bảo tồn di sản văn hóa."
    },
    {
        "id": "81_10",
        "questionName": "Question 10",
        "questionText": f"{passage81_2}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (10):</p>",
        "choices": [
            {"id": "81_10_1", "text": "In addition", "html": "In addition"},
            {"id": "81_10_2", "text": "However", "html": "However"},
            {"id": "81_10_3", "text": "Although", "html": "Although"},
            {"id": "81_10_4", "text": "Despite", "html": "Despite"}
        ],
        "correctChoiceId": "81_10_1",
        "explanation": "<p>Liên từ bổ sung thêm hành động tích cực của người dân làng nghề: <strong>In addition,</strong> (Ngoài ra / Thêm vào đó).</p>",
        "ruleTip": "'In addition,' = 'Besides,' (Thêm vào đó, ngoài ra) dùng để nối thêm ý bổ trợ."
    },

    # Passage 3 (81_11 to 81_15)
    {
        "id": "81_11",
        "questionName": "Question 11",
        "questionText": f"{passage81_3}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (11):</p>",
        "choices": [
            {"id": "81_11_1", "text": "footprint", "html": "footprint"},
            {"id": "81_11_2", "text": "handprint", "html": "handprint"},
            {"id": "81_11_3", "text": "fingerprint", "html": "fingerprint"},
            {"id": "81_11_4", "text": "shoe", "html": "shoe"}
        ],
        "correctChoiceId": "81_11_1",
        "explanation": "<p>Cụm từ chỉ lượng phát thải CO2 cá nhân là <strong>carbon footprint</strong> (dấu chân carbon).</p>",
        "ruleTip": "'carbon footprint' = mức phát thải carbon của cá nhân hoặc hộ gia đình."
    },
    {
        "id": "81_12",
        "questionName": "Question 12",
        "questionText": f"{passage81_3}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (12):</p>",
        "choices": [
            {"id": "81_12_1", "text": "other", "html": "other"},
            {"id": "81_12_2", "text": "another", "html": "another"},
            {"id": "81_12_3", "text": "others", "html": "others"},
            {"id": "81_12_4", "text": "the other", "html": "the other"}
        ],
        "correctChoiceId": "81_12_1",
        "explanation": "<p>Đứng trước danh từ số nhiều 'biodegradable materials': dùng <strong>other</strong> (other + N số nhiều). 'Another' chỉ đi với N số ít.</p>",
        "ruleTip": "'other + danh từ số nhiều' (các vật khác); 'another + danh từ số ít' (một cái khác)."
    },
    {
        "id": "81_13",
        "questionName": "Question 13",
        "questionText": f"{passage81_3}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (13):</p>",
        "choices": [
            {"id": "81_13_1", "text": "who", "html": "who"},
            {"id": "81_13_2", "text": "which", "html": "which"},
            {"id": "81_13_3", "text": "whose", "html": "whose"},
            {"id": "81_13_4", "text": "whom", "html": "whom"}
        ],
        "correctChoiceId": "81_13_1",
        "explanation": "<p>Bổ nghĩa cho 'young students' (danh từ chỉ người) làm chủ ngữ trước động từ 'participate': dùng <strong>who</strong>.</p>",
        "ruleTip": "Đại từ quan hệ bổ nghĩa cho danh từ chỉ người: dùng WHO."
    },
    {
        "id": "81_14",
        "questionName": "Question 14",
        "questionText": f"{passage81_3}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (14):</p>",
        "choices": [
            {"id": "81_14_1", "text": "cut down on", "html": "cut down on"},
            {"id": "81_14_2", "text": "run out of", "html": "run out of"},
            {"id": "81_14_3", "text": "look up to", "html": "look up to"},
            {"id": "81_14_4", "text": "get on with", "html": "get on with"}
        ],
        "correctChoiceId": "81_14_1",
        "explanation": "<p>Cắt giảm đồ nhựa dùng một lần: <strong>cut down on</strong> single-use items (cắt giảm tiêu thụ).<br/>run out of: hết sạch; look up to: ngưỡng mộ; get on with: hòa thuận.</p>",
        "ruleTip": "'cut down on' = reduce (cắt giảm bớt lượng tiêu thụ đồ nhựa)."
    },
    {
        "id": "81_15",
        "questionName": "Question 15",
        "questionText": f"{passage81_3}<p class=\"font-semibold text-slate-900\">Choose the best answer for blank (15):</p>",
        "choices": [
            {"id": "81_15_1", "text": "Although", "html": "Although"},
            {"id": "81_15_2", "text": "Because", "html": "Because"},
            {"id": "81_15_3", "text": "Unless", "html": "Unless"},
            {"id": "81_15_4", "text": "In case", "html": "In case"}
        ],
        "correctChoiceId": "81_15_1",
        "explanation": "<p>Liên từ chỉ sự nhượng bộ đứng đầu mệnh đề: <strong>Although</strong> (Mặc dù việc thay đổi thói quen đòi hỏi kỷ luật, lợi ích lâu dài là vô giá).</p>",
        "ruleTip": "'Although + S + V' diễn tả sự tương phản, nhượng bộ (Mặc dù... nhưng...)."
    }
]

theory81 = {
    "topicId": 81,
    "topicName": "Đọc điền từ vào đoạn văn (Cloze Test)",
    "englishName": "Guided Cloze Test with Passages",
    "rules": [
        {
            "rule": "1. Chiến lược 4 bước làm bài Cloze Test:",
            "formula": "Bước 1: Đọc lướt cả đoạn nắm chủ đề -> Bước 2: Xác định từ loại và cấu trúc quanh chỗ trống -> Bước 3: Loại trừ phương án sai ngữ pháp -> Bước 4: Đọc lại cả câu kiểm tra tính logic",
            "examples": "Xác định nhanh chỗ trống cần Liên từ, Đại từ quan hệ, Lượng từ hay Cụm động từ."
        },
        {
            "rule": "2. 5 dạng câu hỏi kinh điển trong bài điền từ thi vào 10:",
            "formula": "Dạng 1: Đại từ quan hệ (who, which, that, where) // Dạng 2: Liên từ nối (Although, Because, However, Moreover) // Dạng 3: Lượng từ (many, much, other, another) // Dạng 4: Cụm động từ (cut down on, take part in, look after) // Dạng 5: Từ vựng theo ngữ cảnh (habitat, preserve, sustainable)",
            "examples": "Nắm vững sự hòa hợp giữa lượng từ và danh từ đếm được/không đếm được."
        },
        {
            "rule": "3. Mẹo phân biệt Other vs Another:",
            "formula": "Another + N số ít // Other + N số nhiều // Others = Other + Noun (đứng một mình làm đại từ)",
            "examples": "another student, other students, some like tea while others prefer coffee."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 82: Reading Comprehension (15 questions = 3 passages x 5)
# -------------------------------------------------------------
passage82_1 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct answer to each of the questions.</p>'
    '<p>In modern Vietnam, the widespread adoption of digital technology is fundamentally transforming secondary education. E-learning platforms and interactive educational applications allow students to access high-quality lectures, practice exam questions, and receive instant pedagogical feedback anytime and anywhere. Rather than relying exclusively on traditional printed textbooks, teenagers can now explore vivid digital simulations, instructional videos, and comprehensive online question banks.</p>'
    '<p>One of the primary benefits of digital education is that it promotes personalized learning. Since every pupil possesses distinct learning speeds and strengths, intelligent software adapts quizzes to match individual needs. <strong>They</strong> can review challenging grammar points or phonetic rules repeatedly until they achieve mastery. Furthermore, online study groups enable students from remote mountainous provinces to interact with experienced educators in big cities, ensuring that learning opportunities are truly <strong><u>accessible</u></strong> to everyone.</p>'
    '<p>However, educators emphasize that technology cannot completely replace traditional schooling. Face-to-face interaction with teachers remains indispensable for cultivating communication skills, moral values, and teamwork. Therefore, the optimal path forward is blended learning, which combines online self-study with structured classroom guidance.</p>'
    '</div>'
)

passage82_2 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct answer to each of the questions.</p>'
    '<p>Hanoi’s Old Quarter, situated in the heart of the capital near the tranquil waters of Hoan Kiem Lake, is a captivating historical gem. Featuring an intricate network of narrow streets, <strong>it</strong> originated as a thriving commercial and craft hub during the Ly and Tran dynasties. Historically, the area was renowned as the \"36 Guild Streets,\" with each street named after the specific specialized commodity produced and sold there, such as Hang Bac for silver jewelry, Hang Gai for silk, and Hang Chieu for woven mats.</p>'
    '<p>Today, the Old Quarter remains a bustling center of commerce while retaining much of its historic architectural charm. Traditional \"tube houses\"—narrow buildings with long interior courtyards designed to optimize street frontage—still stand side by side with modern coffee shops and souvenir stores. Street food vendors fill the air with enticing aromas of pho, bun cha, and egg coffee, attracting both curious tourists and longtime residents.</p>'
    '<p>Nonetheless, urban preservationists face substantial obstacles. Due to dense population and rapid tourism growth, many historic structures suffer from physical deterioration. The local municipal government has initiated restoration projects to <strong><u>preserve</u></strong> heritage facades while improving drainage and pedestrian safety. Balancing economic progress with cultural preservation is paramount to keeping the Old Quarter’s distinctive spirit alive.</p>'
    '</div>'
)

passage82_3 = (
    '<div class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">'
    '<p class="font-bold text-slate-900 mb-2">Read the following passage and mark the letter A, B, C, or D to indicate the correct answer to each of the questions.</p>'
    '<p>As the international community faces the escalating consequences of global climate change, transition toward renewable energy has become an urgent imperative. Fossil fuels such as coal, oil, and natural gas have driven industrial progress for over a century, but their combustion releases tremendous volumes of carbon dioxide and other toxic greenhouse gases. In contrast, clean energy sources like solar radiation and wind currents are virtually infinite and <strong><u>abundant</u></strong> across diverse geographic regions.</p>'
    '<p>Solar energy systems harness sunlight directly through photovoltaic solar panels, transforming radiant light into clean electricity with zero emissions during operation. Vietnam possesses remarkable solar potential, particularly in the sunny central and southern provinces. In recent years, thousands of industrial factories and suburban households have installed rooftop solar arrays, significantly reducing their dependency on the national power grid and lowering utility expenses.</p>'
    '<p>Similarly, wind power has expanded exponentially. Gigantic wind turbines erected in coastal regions convert kinetic wind energy into electrical power without burning any fuel. Although the initial setup of wind farms and solar installations requires substantial capital investment, modern technology has steadily reduced manufacturing costs. Investing in <strong>them</strong> provides lasting ecological security and ensures clean power for upcoming generations.</p>'
    '</div>'
)

q82 = [
    # Passage 1 (82_1 to 82_5)
    {
        "id": "82_1",
        "questionName": "Question 1",
        "questionText": f"{passage82_1}<p class=\"font-semibold text-slate-900\">What is the main topic of the passage?</p>",
        "choices": [
            {"id": "82_1_1", "text": "The benefits and evolving role of digital learning in Vietnam.", "html": "The benefits and evolving role of digital learning in Vietnam."},
            {"id": "82_1_2", "text": "Why printed textbooks are completely useless nowadays.", "html": "Why printed textbooks are completely useless nowadays."},
            {"id": "82_1_3", "text": "The negative health consequences of using computers in schools.", "html": "The negative health consequences of using computers in schools."},
            {"id": "82_1_4", "text": "How teachers in big cities earn extra income through online classes.", "html": "How teachers in big cities earn extra income through online classes."}
        ],
        "correctChoiceId": "82_1_1",
        "explanation": "<p>Ý chính của toàn bài là: Những lợi ích và vai trò đang phát triển của việc học tập kỹ thuật số (E-learning) tại Việt Nam.</p>",
        "ruleTip": "Kỹ thuật Skimming: Đọc câu chủ đề ở đoạn 1 và đoạn kết để xác định Main Idea."
    },
    {
        "id": "82_2",
        "questionName": "Question 2",
        "questionText": f"{passage82_1}<p class=\"font-semibold text-slate-900\">According to paragraph 2, digital education promotes personalized learning because ________.</p>",
        "choices": [
            {"id": "82_2_1", "text": "intelligent software adapts quizzes to match individual students' needs", "html": "intelligent software adapts quizzes to match individual students' needs"},
            {"id": "82_2_2", "text": "it forces all students to finish exams at exactly the same speed", "html": "it forces all students to finish exams at exactly the same speed"},
            {"id": "82_2_3", "text": "it eliminates the need for any human teachers in the future", "html": "it eliminates the need for any human teachers in the future"},
            {"id": "82_2_4", "text": "it provides free laptops to every pupil in mountainous areas", "html": "it provides free laptops to every pupil in mountainous areas"}
        ],
        "correctChoiceId": "82_2_1",
        "explanation": "<p>Dẫn chứng trong đoạn 2: \"Since every pupil possesses distinct learning speeds and strengths, intelligent software adapts quizzes to match individual needs.\"</p>",
        "ruleTip": "Kỹ thuật Scanning: Định vị từ khóa 'personalized learning' trong đoạn 2 để tìm câu trả lời chi tiết."
    },
    {
        "id": "82_3",
        "questionName": "Question 3",
        "questionText": f"{passage82_1}<p class=\"font-semibold text-slate-900\">Which of the following is NOT true according to the passage?</p>",
        "choices": [
            {"id": "82_3_1", "text": "Technology can completely replace human teachers in cultivating moral values.", "html": "Technology can completely replace human teachers in cultivating moral values."},
            {"id": "82_3_2", "text": "Online platforms allow pupils to review grammar points repeatedly.", "html": "Online platforms allow pupils to review grammar points repeatedly."},
            {"id": "82_3_3", "text": "Students in remote areas can connect with experienced educators online.", "html": "Students in remote areas can connect with experienced educators online."},
            {"id": "82_3_4", "text": "Blended learning combines online study with classroom guidance.", "html": "Blended learning combines online study with classroom guidance."}
        ],
        "correctChoiceId": "82_3_1",
        "explanation": "<p>Đoạn 3 khẳng định: \"educators emphasize that technology cannot completely replace traditional schooling. Face-to-face interaction with teachers remains indispensable...\". Do đó phương án A là sai sự thật.</p>",
        "ruleTip": "Dạng bài NOT True / EXCEPT: Đối chiếu từng phương án với bài đọc để tìm nhận định sai hoặc trái ngược."
    },
    {
        "id": "82_4",
        "questionName": "Question 4",
        "questionText": f"{passage82_1}<p class=\"font-semibold text-slate-900\">The word <strong><u>accessible</u></strong> in paragraph 2 is closest in meaning to ________.</p>",
        "choices": [
            {"id": "82_4_1", "text": "available", "html": "available"},
            {"id": "82_4_2", "text": "expensive", "html": "expensive"},
            {"id": "82_4_3", "text": "complicated", "html": "complicated"},
            {"id": "82_4_4", "text": "restricted", "html": "restricted"}
        ],
        "correctChoiceId": "82_4_1",
        "explanation": "<p><strong>accessible</strong> = có thể tiếp cận được, luôn sẵn sàng cho mọi người = <strong>available</strong>.<br/>expensive: đắt đỏ; complicated: phức tạp; restricted: bị hạn chế.</p>",
        "ruleTip": "'accessible' = 'available' = 'reachable' (dễ tiếp cận, có sẵn)."
    },
    {
        "id": "82_5",
        "questionName": "Question 5",
        "questionText": f"{passage82_1}<p class=\"font-semibold text-slate-900\">The pronoun <strong>They</strong> in paragraph 2 refers to ________.</p>",
        "choices": [
            {"id": "82_5_1", "text": "pupils / students", "html": "pupils / students"},
            {"id": "82_5_2", "text": "traditional textbooks", "html": "traditional textbooks"},
            {"id": "82_5_3", "text": "learning speeds", "html": "learning speeds"},
            {"id": "82_5_4", "text": "intelligent software", "html": "intelligent software"}
        ],
        "correctChoiceId": "82_5_1",
        "explanation": "<p>Đọc câu liền trước trong đoạn 2: \"Since every pupil possesses distinct learning speeds and strengths, intelligent software adapts quizzes to match individual needs. <strong>They</strong> can review challenging grammar points...\". 'They' quy chiếu về <strong>pupils / students</strong>.</p>",
        "ruleTip": "Đại từ quy chiếu (Reference): Đọc câu văn ngay trước đại từ để xác định danh từ số nhiều được thay thế."
    },

    # Passage 2 (82_6 to 82_10)
    {
        "id": "82_6",
        "questionName": "Question 6",
        "questionText": f"{passage82_2}<p class=\"font-semibold text-slate-900\">What is the best title for the passage?</p>",
        "choices": [
            {"id": "82_6_1", "text": "Hanoi's Old Quarter: Balancing Historic Preservation and Modern Life", "html": "Hanoi's Old Quarter: Balancing Historic Preservation and Modern Life"},
            {"id": "82_6_2", "text": "The History of Silver Jewelry Trade in Ancient Vietnam", "html": "The History of Silver Jewelry Trade in Ancient Vietnam"},
            {"id": "82_6_3", "text": "Why Tourists Should Avoid Visiting Hanoi's Narrow Streets", "html": "Why Tourists Should Avoid Visiting Hanoi's Narrow Streets"},
            {"id": "82_6_4", "text": "The Architecture of Modern Skyscrapers in the Capital", "html": "The Architecture of Modern Skyscrapers in the Capital"}
        ],
        "correctChoiceId": "82_6_1",
        "explanation": "<p>Tiêu đề phù hợp và bao quát nhất toàn bài là: <strong>Phố cổ Hà Nội: Cân bằng giữa bảo tồn di sản lịch sử và cuộc sống hiện đại</strong>.</p>",
        "ruleTip": "Tiêu đề (Best Title) phải bao quát cả bài, không quá hẹp hoặc quá rộng."
    },
    {
        "id": "82_7",
        "questionName": "Question 7",
        "questionText": f"{passage82_2}<p class=\"font-semibold text-slate-900\">According to paragraph 1, how were the 36 guild streets originally named?</p>",
        "choices": [
            {"id": "82_7_1", "text": "After the specific specialized goods produced and traded there.", "html": "After the specific specialized goods produced and traded there."},
            {"id": "82_7_2", "text": "After the famous kings of the Ly and Tran dynasties.", "html": "After the famous kings of the Ly and Tran dynasties."},
            {"id": "82_7_3", "text": "After the names of foreign merchants who settled in Hanoi.", "html": "After the names of foreign merchants who settled in Hanoi."},
            {"id": "82_7_4", "text": "After the names of the 36 gates surrounding the ancient citadel.", "html": "After the names of the 36 gates surrounding the ancient citadel."}
        ],
        "correctChoiceId": "82_7_1",
        "explanation": "<p>Dẫn chứng trong đoạn 1: \"with each street named after the specific specialized commodity produced and sold there, such as Hang Bac for silver jewelry, Hang Gai for silk...\".</p>",
        "ruleTip": "Tìm thông tin trực tiếp: 'named after the specific specialized commodity'."
    },
    {
        "id": "82_8",
        "questionName": "Question 8",
        "questionText": f"{passage82_2}<p class=\"font-semibold text-slate-900\">All of the following are challenges facing the Old Quarter EXCEPT ________.</p>",
        "choices": [
            {"id": "82_8_1", "text": "a shortage of domestic and international visitors", "html": "a shortage of domestic and international visitors"},
            {"id": "82_8_2", "text": "physical deterioration of ancient buildings", "html": "physical deterioration of ancient buildings"},
            {"id": "82_8_3", "text": "dense population living in narrow spaces", "html": "dense population living in narrow spaces"},
            {"id": "82_8_4", "text": "the need to improve pedestrian safety and drainage", "html": "the need to improve pedestrian safety and drainage"}
        ],
        "correctChoiceId": "82_8_1",
        "explanation": "<p>Đoạn 2 & 3 nêu rằng lượng khách du lịch rất đông đảo (\"rapid tourism growth\"), chứ không hề bị thiếu khách du lịch (shortage). Do đó A là phương án đúng.</p>",
        "ruleTip": "Đọc kỹ chữ 'EXCEPT' để tìm chi tiết KHÔNG phải là khó khăn."
    },
    {
        "id": "82_9",
        "questionName": "Question 9",
        "questionText": f"{passage82_2}<p class=\"font-semibold text-slate-900\">The word <strong><u>preserve</u></strong> in paragraph 3 is closest in meaning to ________.</p>",
        "choices": [
            {"id": "82_9_1", "text": "protect", "html": "protect"},
            {"id": "82_9_2", "text": "demolish", "html": "demolish"},
            {"id": "82_9_3", "text": "expand", "html": "expand"},
            {"id": "82_9_4", "text": "sell", "html": "sell"}
        ],
        "correctChoiceId": "82_9_1",
        "explanation": "<p><strong>preserve</strong> = bảo tồn, gìn giữ = <strong>protect</strong> / conserve.<br/>demolish: phá dỡ; expand: mở rộng; sell: bán.</p>",
        "ruleTip": "'preserve' = 'protect' (bảo tồn, bảo vệ di sản)."
    },
    {
        "id": "82_10",
        "questionName": "Question 10",
        "questionText": f"{passage82_2}<p class=\"font-semibold text-slate-900\">The pronoun <strong>it</strong> in paragraph 1 refers to ________.</p>",
        "choices": [
            {"id": "82_10_1", "text": "Hanoi’s Old Quarter", "html": "Hanoi’s Old Quarter"},
            {"id": "82_10_2", "text": "Hoan Kiem Lake", "html": "Hoan Kiem Lake"},
            {"id": "82_10_3", "text": "tranquil water", "html": "tranquil water"},
            {"id": "82_10_4", "text": "silver jewelry", "html": "silver jewelry"}
        ],
        "correctChoiceId": "82_10_1",
        "explanation": "<p>Dẫn chứng trong đoạn 1: \"Hanoi’s Old Quarter, situated in the heart of the capital... Featuring an intricate network of narrow streets, <strong>it</strong> originated as a thriving commercial hub...\". 'It' quy chiếu về <strong>Hanoi's Old Quarter</strong>.</p>",
        "ruleTip": "Đại từ 'it' thay thế cho danh từ số ít chỉ địa danh được nhắc tới ở mệnh đề trước."
    },

    # Passage 3 (82_11 to 82_15)
    {
        "id": "82_11",
        "questionName": "Question 11",
        "questionText": f"{passage82_3}<p class=\"font-semibold text-slate-900\">What is the primary purpose of the author in this passage?</p>",
        "choices": [
            {"id": "82_11_1", "text": "To explain the benefits of solar and wind energy in fighting climate change.", "html": "To explain the benefits of solar and wind energy in fighting climate change."},
            {"id": "82_11_2", "text": "To encourage coal mining companies to expand production.", "html": "To encourage coal mining companies to expand production."},
            {"id": "82_11_3", "text": "To describe the negative economic impacts of installing solar panels.", "html": "To describe the negative economic impacts of installing solar panels."},
            {"id": "82_11_4", "text": "To argue that renewable energy cannot produce electricity.", "html": "To argue that renewable energy cannot produce electricity."}
        ],
        "correctChoiceId": "82_11_1",
        "explanation": "<p>Mục đích chính của tác giả: Giải thích lợi ích của năng lượng mặt trời và gió trong cuộc chiến chống biến đổi khí hậu.</p>",
        "ruleTip": "Mục đích của tác giả (Author's Purpose): Xem xét thái độ và thông điệp cốt lõi của bài viết."
    },
    {
        "id": "82_12",
        "questionName": "Question 12",
        "questionText": f"{passage82_3}<p class=\"font-semibold text-slate-900\">According to paragraph 2, how do solar panels generate electricity?</p>",
        "choices": [
            {"id": "82_12_1", "text": "By harnessing sunlight directly through photovoltaic cells without emissions.", "html": "By harnessing sunlight directly through photovoltaic cells without emissions."},
            {"id": "82_12_2", "text": "By burning coal in high-temperature industrial furnaces.", "html": "By burning coal in high-temperature industrial furnaces."},
            {"id": "82_12_3", "text": "By pumping groundwater up to giant coastal turbines.", "html": "By pumping groundwater up to giant coastal turbines."},
            {"id": "82_12_4", "text": "By consuming toxic chemical gases from factories.", "html": "By consuming toxic chemical gases from factories."}
        ],
        "correctChoiceId": "82_12_1",
        "explanation": "<p>Dẫn chứng trong đoạn 2: \"Solar energy systems harness sunlight directly through photovoltaic solar panels, transforming radiant light into clean electricity with zero emissions during operation.\"</p>",
        "ruleTip": "Scanning từ khóa 'photovoltaic' và 'sunlight' trong đoạn 2."
    },
    {
        "id": "82_13",
        "questionName": "Question 13",
        "questionText": f"{passage82_3}<p class=\"font-semibold text-slate-900\">Which of the following is NOT mentioned as an advantage of renewable energy?</p>",
        "choices": [
            {"id": "82_13_1", "text": "They produce greenhouse gas emissions during operation.", "html": "They produce greenhouse gas emissions during operation."},
            {"id": "82_13_2", "text": "They are virtually infinite and abundant in many geographic areas.", "html": "They are virtually infinite and abundant in many geographic areas."},
            {"id": "82_13_3", "text": "They help reduce reliance on the national electricity grid.", "html": "They help reduce reliance on the national electricity grid."},
            {"id": "82_13_4", "text": "They provide long-term ecological security for future generations.", "html": "They provide long-term ecological security for future generations."}
        ],
        "correctChoiceId": "82_13_1",
        "explanation": "<p>Bài đọc nêu rõ năng lượng tái tạo không phát thải khí nhà kính trong quá trình vận hành (\"zero emissions during operation\"). Do đó phương án A là sai sự thật và KHÔNG phải là ưu điểm được nói tới.</p>",
        "ruleTip": "Chú ý từ 'zero emissions' đối lập với 'produce greenhouse gas emissions'."
    },
    {
        "id": "82_14",
        "questionName": "Question 14",
        "questionText": f"{passage82_3}<p class=\"font-semibold text-slate-900\">The word <strong><u>abundant</u></strong> in paragraph 1 is closest in meaning to ________.</p>",
        "choices": [
            {"id": "82_14_1", "text": "plentiful", "html": "plentiful"},
            {"id": "82_14_2", "text": "scarce", "html": "scarce"},
            {"id": "82_14_3", "text": "limited", "html": "limited"},
            {"id": "82_14_4", "text": "expensive", "html": "expensive"}
        ],
        "correctChoiceId": "82_14_1",
        "explanation": "<p><strong>abundant</strong> = dồi dào, phong phú, nhiều = <strong>plentiful</strong>.<br/>scarce: khan hiếm; limited: có hạn; expensive: đắt đỏ.</p>",
        "ruleTip": "'abundant' = 'plentiful' = 'copious' (dồi dào, phong phú; >< scarce)."
    },
    {
        "id": "82_15",
        "questionName": "Question 15",
        "questionText": f"{passage82_3}<p class=\"font-semibold text-slate-900\">The pronoun <strong>them</strong> in paragraph 3 refers to ________.</p>",
        "choices": [
            {"id": "82_15_1", "text": "wind farms and solar installations", "html": "wind farms and solar installations"},
            {"id": "82_15_2", "text": "fossil fuels like coal and oil", "html": "fossil fuels like coal and oil"},
            {"id": "82_15_3", "text": "greenhouse gases", "html": "greenhouse gases"},
            {"id": "82_15_4", "text": "upcoming generations", "html": "upcoming generations"}
        ],
        "correctChoiceId": "82_15_1",
        "explanation": "<p>Đoạn 3 viết: \"Although the initial setup of wind farms and solar installations requires substantial capital investment... Investing in <strong>them</strong> provides lasting ecological security...\". 'Them' quy chiếu về <strong>wind farms and solar installations</strong>.</p>",
        "ruleTip": "Quy chiếu đại từ tân ngữ 'them': xem xét chủ ngữ/tân ngữ số nhiều ở câu liền trước."
    }
]

theory82 = {
    "topicId": 82,
    "topicName": "Đọc hiểu văn bản (Reading Comprehension)",
    "englishName": "Reading Comprehension with Passages",
    "rules": [
        {
            "rule": "1. 5 Dạng câu hỏi đọc hiểu trọng tâm thi vào 10:",
            "formula": "Dạng 1: Main Idea / Best Title (Đọc câu đầu/cuối các đoạn) // Dạng 2: Factual Detail (Scanning từ khóa trong bài) // Dạng 3: Negative / NOT True / EXCEPT (Đối chiếu 4 phương án) // Dạng 4: Contextual Vocabulary (Đoán nghĩa qua ngữ cảnh) // Dạng 5: Reference / Pronoun (Đọc câu văn liền trước)",
            "examples": "Nắm vững kỹ năng định vị từ khóa (keywords) để trả lời nhanh và chính xác."
        },
        {
            "rule": "2. Kỹ thuật Skimming & Scanning:",
            "formula": "Skimming: Đọc lướt 30-45 giây nắm bố cục và ý chính // Scanning: Dò tìm ngày tháng, con số, tên riêng, thuật ngữ kỹ thuật",
            "examples": "Không cần dịch từng từ; hãy dựa vào câu chứa từ khóa để tìm đáp án."
        },
        {
            "rule": "3. Mẹo xử lý câu hỏi từ vựng ngữ cảnh:",
            "formula": "Đọc câu chứa từ gạch chân và câu liền trước/sau -> Xác định sắc thái tích cực hay tiêu cực -> Thay thế 4 phương án vào chỗ gạch chân",
            "examples": "accessible = available, preserve = protect, abundant = plentiful."
        }
    ]
}

def save_data(topic_id, questions, theory):
    q_file = os.path.join(QUESTIONS_DIR, f"{topic_id}.json")
    t_file = os.path.join(THEORIES_DIR, f"{topic_id}.json")
    with open(q_file, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    with open(t_file, "w", encoding="utf-8") as f:
        json.dump(theory, f, ensure_ascii=False, indent=2)
    print(f"Generated Topic {topic_id}: {len(questions)} questions + theory")

def create_alias(source_id, alias_id):
    for dir_path in [QUESTIONS_DIR, THEORIES_DIR]:
        src = os.path.join(dir_path, f"{source_id}.json")
        dst = os.path.join(dir_path, f"{alias_id}.json")
        if os.path.exists(src):
            shutil.copyfile(src, dst)
    print(f"Created alias {alias_id} -> {source_id}")

def main():
    datasets = [
        (91, q91, theory91),
        (95, q95, theory95),
        (96, q96, theory96),
        (35, q35, theory35),
        (1659, q1659, theory1659),
        (1645, q1645, theory1645),
        (36, q36, theory36),
        (81, q81, theory81),
        (82, q82, theory82)
    ]
    for tid, qs, th in datasets:
        save_data(tid, qs, th)

    # Aliases for taxonomy synchronization
    create_alias(91, 523)
    create_alias(95, 73)
    print("All Vocabulary & Reading topics and aliases successfully generated!")

if __name__ == "__main__":
    main()
