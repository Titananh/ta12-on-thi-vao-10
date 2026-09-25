#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Generation Pipeline for Grammar (Milestone 1)
Topics covered (12 canonical grammar targets):
  126: Zero & First Conditionals
  127: Second Conditional & Wish
  128: Present Tenses (Simple, Continuous, Perfect)
  130: Past Tenses (Simple, Continuous, Perfect & Used to)
  134: Future Tenses (Will, Be going to & Time Clauses)
  140: Passive Voice
  168: Tag Questions
  551: Relative Clauses
  160: Reported Speech
  106: Comparisons
  150: Prepositions
  116: Conjunctions & Adverbial Clauses
Aliases:
  141 -> 127
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
# TOPIC 126: Câu điều kiện loại 0 & loại 1 (15 questions)
# -------------------------------------------------------------
q126 = [
    {
        "id": "126_1",
        "questionName": "Question 1",
        "questionText": "<p>If it rains this afternoon, we ________ the football match.</p>",
        "choices": [
            {"id": "126_1_1", "text": "cancel", "html": "cancel"},
            {"id": "126_1_2", "text": "will cancel", "html": "will cancel"},
            {"id": "126_1_3", "text": "would cancel", "html": "would cancel"},
            {"id": "126_1_4", "text": "canceled", "html": "canceled"}
        ],
        "correctChoiceId": "126_1_2",
        "explanation": "<p>Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai.<br/>Cấu trúc: <strong>If + S + V(hiện tại đơn), S + will/can + V-inf</strong>.<br/>Mệnh đề If là <em>'it rains'</em> nên mệnh đề chính dùng <strong>will cancel</strong>.</p>",
        "ruleTip": "If 1: Mệnh đề If chia Hiện tại đơn, mệnh đề chính dùng Will/Can + V-inf."
    },
    {
        "id": "126_2",
        "questionName": "Question 2",
        "questionText": "<p>Unless you study hard, you ________ the entrance examination.</p>",
        "choices": [
            {"id": "126_2_1", "text": "won't pass", "html": "won't pass"},
            {"id": "126_2_2", "text": "will pass", "html": "will pass"},
            {"id": "126_2_3", "text": "passed", "html": "passed"},
            {"id": "126_2_4", "text": "would pass", "html": "would pass"}
        ],
        "correctChoiceId": "126_2_1",
        "explanation": "<p><strong>Unless = If ... not</strong> (Trừ phi / Nếu không).<br/>'Unless you study hard, you won't pass...' = 'Nếu bạn không học chăm chỉ, bạn sẽ không đỗ kỳ thi tuyển sinh'.</p>",
        "ruleTip": "Unless = If... not (Sau Unless luôn dùng mệnh đề khẳng định)."
    },
    {
        "id": "126_3",
        "questionName": "Question 3",
        "questionText": "<p>If water ________ 100 degrees Celsius, it boils.</p>",
        "choices": [
            {"id": "126_3_1", "text": "reaches", "html": "reaches"},
            {"id": "126_3_2", "text": "reach", "html": "reach"},
            {"id": "126_3_3", "text": "will reach", "html": "will reach"},
            {"id": "126_3_4", "text": "reached", "html": "reached"}
        ],
        "correctChoiceId": "126_3_1",
        "explanation": "<p>Câu điều kiện loại 0 diễn tả chân lý, quy luật khoa học: Cả 2 vế đều chia thì Hiện tại đơn.<br/>Chủ ngữ 'water' không đếm được nên động từ thêm -es: <strong>reaches</strong>.</p>",
        "ruleTip": "If 0 diễn tả chân lý, quy luật khoa học: Cả 2 vế đều chia Hiện tại đơn."
    },
    {
        "id": "126_4",
        "questionName": "Question 4",
        "questionText": "<p>If she ________ by train, she will arrive earlier than by bus.</p>",
        "choices": [
            {"id": "126_4_1", "text": "travels", "html": "travels"},
            {"id": "126_4_2", "text": "travel", "html": "travel"},
            {"id": "126_4_3", "text": "will travel", "html": "will travel"},
            {"id": "126_4_4", "text": "traveled", "html": "traveled"}
        ],
        "correctChoiceId": "126_4_1",
        "explanation": "<p>Mệnh đề If của câu điều kiện loại 1 chia thì hiện tại đơn. Chủ ngữ 'she' số ít nên động từ chia thêm -s: <strong>travels</strong>.</p>",
        "ruleTip": "Vế If loại 1: Chủ ngữ số ít (she/he/it) động từ chia thêm -s/-es."
    },
    {
        "id": "126_5",
        "questionName": "Question 5",
        "questionText": "<p>If you see Lan at the library, ________ her this grammar book.</p>",
        "choices": [
            {"id": "126_5_1", "text": "give", "html": "give"},
            {"id": "126_5_2", "text": "will give", "html": "will give"},
            {"id": "126_5_3", "text": "gave", "html": "gave"},
            {"id": "126_5_4", "text": "giving", "html": "giving"}
        ],
        "correctChoiceId": "126_5_1",
        "explanation": "<p>Mệnh đề chính của câu điều kiện loại 1 có thể là một câu mệnh lệnh: <strong>V-inf (give)</strong>.</p>",
        "ruleTip": "Câu mệnh lệnh ở vế chính loại 1: Dùng động từ nguyên mẫu không 'will'."
    },
    {
        "id": "126_6",
        "questionName": "Question 6",
        "questionText": "<p>You can borrow my laptop as long as you ________ it carefully.</p>",
        "choices": [
            {"id": "126_6_1", "text": "use", "html": "use"},
            {"id": "126_6_2", "text": "will use", "html": "will use"},
            {"id": "126_6_3", "text": "used", "html": "used"},
            {"id": "126_6_4", "text": "are using", "html": "are using"}
        ],
        "correctChoiceId": "126_6_1",
        "explanation": "<p><strong>As long as</strong> (miễn là) đóng vai trò tương đương liên từ 'If' trong câu điều kiện loại 1, theo sau là mệnh đề thì hiện tại đơn: <strong>use</strong>.</p>",
        "ruleTip": "As long as = Provided that = If (chia thì Hiện tại đơn)."
    },
    {
        "id": "126_7",
        "questionName": "Question 7",
        "questionText": "<p>If you want to pass the entrance exam, you ________ revise your lessons thoroughly.</p>",
        "choices": [
            {"id": "126_7_1", "text": "must", "html": "must"},
            {"id": "126_7_2", "text": "would", "html": "would"},
            {"id": "126_7_3", "text": "had to", "html": "had to"},
            {"id": "126_7_4", "text": "would have", "html": "would have"}
        ],
        "correctChoiceId": "126_7_1",
        "explanation": "<p>Mệnh đề chính câu điều kiện loại 1 có thể dùng động từ khuyết thiếu diễn tả sự cần thiết: <strong>must + V-inf</strong>.</p>",
        "ruleTip": "Vế chính loại 1 có thể dùng động từ khuyết thiếu: must/should/can + V-inf."
    },
    {
        "id": "126_8",
        "questionName": "Question 8",
        "questionText": "<p>If we ________ now, we will be late for school.</p>",
        "choices": [
            {"id": "126_8_1", "text": "don't leave", "html": "don't leave"},
            {"id": "126_8_2", "text": "won't leave", "html": "won't leave"},
            {"id": "126_8_3", "text": "didn't leave", "html": "didn't leave"},
            {"id": "126_8_4", "text": "not leave", "html": "not leave"}
        ],
        "correctChoiceId": "126_8_1",
        "explanation": "<p>Phủ định ở mệnh đề If của câu điều kiện loại 1 với chủ ngữ 'we' dùng <strong>don't + V-inf (don't leave)</strong>.</p>",
        "ruleTip": "Phủ định vế If loại 1 với chủ ngữ 'we/they/I/you': dùng don't + V-inf."
    },
    {
        "id": "126_9",
        "questionName": "Question 9",
        "questionText": "<p>________ anyone call, please tell them I am in a meeting.</p>",
        "choices": [
            {"id": "126_9_1", "text": "Should", "html": "Should"},
            {"id": "126_9_2", "text": "If", "html": "If"},
            {"id": "126_9_3", "text": "Unless", "html": "Unless"},
            {"id": "126_9_4", "text": "Were", "html": "Were"}
        ],
        "correctChoiceId": "126_9_1",
        "explanation": "<p>Đảo ngữ câu điều kiện loại 1: <strong>Should + S + V-inf</strong> thay cho 'If + S + V(s/es)'. 'Should anyone call' = 'If anyone calls'.</p>",
        "ruleTip": "Đảo ngữ If 1: Should + S + V-inf thay cho 'If + S + V'."
    },
    {
        "id": "126_10",
        "questionName": "Question 10",
        "questionText": "<p>We will miss the train unless we ________ a taxi right away.</p>",
        "choices": [
            {"id": "126_10_1", "text": "take", "html": "take"},
            {"id": "126_10_2", "text": "don't take", "html": "don't take"},
            {"id": "126_10_3", "text": "will take", "html": "will take"},
            {"id": "126_10_4", "text": "took", "html": "took"}
        ],
        "correctChoiceId": "126_10_1",
        "explanation": "<p>Sau 'Unless' là mệnh đề khẳng định ở thì Hiện tại đơn: <strong>take</strong> (Chúng ta sẽ lỡ chuyến tàu trừ phi chúng ta bắt taxi ngay).</p>",
        "ruleTip": "Sau Unless là mệnh đề khẳng định (không dùng don't/doesn't)."
    },
    {
        "id": "126_11",
        "questionName": "Question 11",
        "questionText": "<p>If I drink coffee late at night, I ________ sleep well.</p>",
        "choices": [
            {"id": "126_11_1", "text": "cannot", "html": "cannot"},
            {"id": "126_11_2", "text": "could not", "html": "could not"},
            {"id": "126_11_3", "text": "would not", "html": "would not"},
            {"id": "126_11_4", "text": "had not", "html": "had not"}
        ],
        "correctChoiceId": "126_11_1",
        "explanation": "<p>Diễn tả sự thật hoặc thói quen của bản thân (If 0): vế chính dùng <strong>cannot + V-inf</strong>.</p>",
        "ruleTip": "Sự thật thói quen cá nhân: Dùng Hiện tại đơn / can / cannot ở cả 2 vế."
    },
    {
        "id": "126_12",
        "questionName": "Question 12",
        "questionText": "<p>Take an umbrella in case it ________ on your way back home.</p>",
        "choices": [
            {"id": "126_12_1", "text": "rains", "html": "rains"},
            {"id": "126_12_2", "text": "will rain", "html": "will rain"},
            {"id": "126_12_3", "text": "rained", "html": "rained"},
            {"id": "126_12_4", "text": "is raining", "html": "is raining"}
        ],
        "correctChoiceId": "126_12_1",
        "explanation": "<p>Sau <strong>'in case'</strong> (phòng khi) chia thì Hiện tại đơn diễn tả sự việc trong tương lai: <strong>rains</strong>.</p>",
        "ruleTip": "Sau 'in case' (phòng khi) chia thì Hiện tại đơn mang nghĩa tương lai."
    },
    {
        "id": "126_13",
        "questionName": "Question 13",
        "questionText": "<p>If the weather ________ fine tomorrow, our class will go for a picnic.</p>",
        "choices": [
            {"id": "126_13_1", "text": "is", "html": "is"},
            {"id": "126_13_2", "text": "will be", "html": "will be"},
            {"id": "126_13_3", "text": "was", "html": "was"},
            {"id": "126_13_4", "text": "were", "html": "were"}
        ],
        "correctChoiceId": "126_13_1",
        "explanation": "<p>Trong mệnh đề If loại 1, dù có trạng từ chỉ tương lai 'tomorrow' thì động từ to be vẫn chia thì Hiện tại đơn: <strong>is</strong> (tuyệt đối không dùng will be).</p>",
        "ruleTip": "Mệnh đề If loại 1 dùng 'is/am/are', tuyệt đối KHÔNG dùng 'will be'."
    },
    {
        "id": "126_14",
        "questionName": "Question 14",
        "questionText": "<p>You ________ allowed into the exam room if you forget your student ID card.</p>",
        "choices": [
            {"id": "126_14_1", "text": "won't be", "html": "won't be"},
            {"id": "126_14_2", "text": "wouldn't be", "html": "wouldn't be"},
            {"id": "126_14_3", "text": "aren't", "html": "aren't"},
            {"id": "126_14_4", "text": "weren't", "html": "weren't"}
        ],
        "correctChoiceId": "126_14_1",
        "explanation": "<p>Mệnh đề chính câu điều kiện loại 1 dạng bị động: <strong>won't be + V3/ed (allowed)</strong>.</p>",
        "ruleTip": "Bị động vế chính loại 1: won't be + V3/ed."
    },
    {
        "id": "126_15",
        "questionName": "Question 15",
        "questionText": "<p>\"If you don't water these flowers, they will die.\" means: \"________, they will die.\"</p>",
        "choices": [
            {"id": "126_15_1", "text": "Unless you water these flowers", "html": "Unless you water these flowers"},
            {"id": "126_15_2", "text": "Unless you don't water these flowers", "html": "Unless you don't water these flowers"},
            {"id": "126_15_3", "text": "If you water these flowers", "html": "If you water these flowers"},
            {"id": "126_15_4", "text": "Unless you didn't water these flowers", "html": "Unless you didn't water these flowers"}
        ],
        "correctChoiceId": "126_15_1",
        "explanation": "<p>Chuyển đổi câu điều kiện: <strong>If you don't water = Unless you water</strong>.</p>",
        "ruleTip": "Chuyển đổi: If you don't water = Unless you water."
    }
]

theory126 = {
    "topicId": 126,
    "topicName": "Câu điều kiện loại 0, câu điều kiện loại 1",
    "englishName": "Zero and first conditional",
    "rules": [
        {
            "rule": "Câu điều kiện loại 0: Diễn tả chân lý, sự thật hiển nhiên hoặc quy luật tự nhiên.",
            "formula": "If/When + S + V(hiện tại đơn), S + V(hiện tại đơn)",
            "examples": "If you heat ice, it melts. / If water reaches 100°C, it boils."
        },
        {
            "rule": "Câu điều kiện loại 1: Diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai.",
            "formula": "If + S + V(hiện tại đơn), S + will/can/may/must + V(nguyên thể)",
            "examples": "If it rains tomorrow, we will stay at home."
        },
        {
            "rule": "Cấu trúc tương đương UNLESS (Trừ phi, nếu... không):",
            "formula": "Unless + S + V(khẳng định) = If + S + V(phủ định)",
            "examples": "Unless you study hard, you will fail the exam. (= If you don't study hard...)"
        },
        {
            "rule": "Đảo ngữ câu điều kiện loại 1 với Should:",
            "formula": "Should + S + V(nguyên thể), S + will/can + V(nguyên thể)",
            "examples": "Should you need any help, please call me."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 127: Câu điều kiện loại 2 & Câu ước Wish (15 questions)
# -------------------------------------------------------------
q127 = [
    {
        "id": "127_1",
        "questionName": "Question 1",
        "questionText": "<p>If I ________ you, I would take that opportunity to study abroad.</p>",
        "choices": [
            {"id": "127_1_1", "text": "am", "html": "am"},
            {"id": "127_1_2", "text": "were", "html": "were"},
            {"id": "127_1_3", "text": "will be", "html": "will be"},
            {"id": "127_1_4", "text": "had been", "html": "had been"}
        ],
        "correctChoiceId": "127_1_2",
        "explanation": "<p>Câu điều kiện loại 2 đưa ra lời khuyên với mệnh đề <strong>'If I were you'</strong>. Động từ 'to be' luôn dùng <strong>were</strong> cho mọi ngôi.</p>",
        "ruleTip": "If 2: Động từ 'to be' luôn dùng WERE cho mọi ngôi (kể cả I/he/she/it)."
    },
    {
        "id": "127_2",
        "questionName": "Question 2",
        "questionText": "<p>If Nam had more free time, he ________ guitar lessons.</p>",
        "choices": [
            {"id": "127_2_1", "text": "takes", "html": "takes"},
            {"id": "127_2_2", "text": "will take", "html": "will take"},
            {"id": "127_2_3", "text": "would take", "html": "would take"},
            {"id": "127_2_4", "text": "took", "html": "took"}
        ],
        "correctChoiceId": "127_2_3",
        "explanation": "<p>Mệnh đề If loại 2 chia quá khứ đơn (had), mệnh đề chính dùng <strong>would + V-inf (would take)</strong>.</p>",
        "ruleTip": "Vế chính If 2: S + would/could + V-inf (không dùng will)."
    },
    {
        "id": "127_3",
        "questionName": "Question 3",
        "questionText": "<p>I don't know many people in this new town. I wish I ________ more friends.</p>",
        "choices": [
            {"id": "127_3_1", "text": "have", "html": "have"},
            {"id": "127_3_2", "text": "had", "html": "had"},
            {"id": "127_3_3", "text": "will have", "html": "will have"},
            {"id": "127_3_4", "text": "have had", "html": "have had"}
        ],
        "correctChoiceId": "127_3_2",
        "explanation": "<p>Câu ước trái ngược với thực tế ở hiện tại: lùi một thì về Quá khứ đơn: <strong>had</strong>.</p>",
        "ruleTip": "Ước ở hiện tại: Lùi 1 thì về Quá khứ đơn (wish + S + V2/ed)."
    },
    {
        "id": "127_4",
        "questionName": "Question 4",
        "questionText": "<p>Mai is very short. She wishes she ________ taller to join the basketball team.</p>",
        "choices": [
            {"id": "127_4_1", "text": "is", "html": "is"},
            {"id": "127_4_2", "text": "were", "html": "were"},
            {"id": "127_4_3", "text": "will be", "html": "will be"},
            {"id": "127_4_4", "text": "has been", "html": "has been"}
        ],
        "correctChoiceId": "127_4_2",
        "explanation": "<p>Câu ước ở hiện tại với động từ to be: dùng <strong>were</strong> cho tất cả các ngôi (kể cả she/he/it).</p>",
        "ruleTip": "Ước với 'to be' ở hiện tại: Dùng WERE cho tất cả các ngôi."
    },
    {
        "id": "127_5",
        "questionName": "Question 5",
        "questionText": "<p>If we ________ in the city center, it wouldn't be so noisy around our house.</p>",
        "choices": [
            {"id": "127_5_1", "text": "didn't live", "html": "didn't live"},
            {"id": "127_5_2", "text": "don't live", "html": "don't live"},
            {"id": "127_5_3", "text": "won't live", "html": "won't live"},
            {"id": "127_5_4", "text": "hadn't lived", "html": "hadn't lived"}
        ],
        "correctChoiceId": "127_5_1",
        "explanation": "<p>Mệnh đề chính là 'wouldn't be' (If 2), mệnh đề If phủ định dùng <strong>didn't + V-inf (didn't live)</strong>.</p>",
        "ruleTip": "Phủ định vế If loại 2: dùng 'didn't + V-inf'."
    },
    {
        "id": "127_6",
        "questionName": "Question 6",
        "questionText": "<p>If you could speak English fluently, what career ________ you choose?</p>",
        "choices": [
            {"id": "127_6_1", "text": "will", "html": "will"},
            {"id": "127_6_2", "text": "would", "html": "would"},
            {"id": "127_6_3", "text": "did", "html": "did"},
            {"id": "127_6_4", "text": "do", "html": "do"}
        ],
        "correctChoiceId": "127_6_2",
        "explanation": "<p>Mệnh đề If dùng 'could speak' (If 2), câu hỏi ở mệnh đề chính dùng <strong>would + S + V-inf</strong>.</p>",
        "ruleTip": "Câu hỏi If 2: Từ để hỏi + would + S + V-inf?"
    },
    {
        "id": "127_7",
        "questionName": "Question 7",
        "questionText": "<p>If only I ________ how to play the piano as beautifully as my sister!</p>",
        "choices": [
            {"id": "127_7_1", "text": "know", "html": "know"},
            {"id": "127_7_2", "text": "knew", "html": "knew"},
            {"id": "127_7_3", "text": "will know", "html": "will know"},
            {"id": "127_7_4", "text": "have known", "html": "have known"}
        ],
        "correctChoiceId": "127_7_2",
        "explanation": "<p><strong>If only = I wish</strong> (Giá như). Ước điều trái thực tế ở hiện tại: động từ lùi về Quá khứ đơn <strong>knew</strong>.</p>",
        "ruleTip": "If only = I wish (câu ước ở hiện tại lùi thì về quá khứ đơn)."
    },
    {
        "id": "127_8",
        "questionName": "Question 8",
        "questionText": "<p>It's raining heavily outside. I wish the heavy rain ________ soon so we can play.</p>",
        "choices": [
            {"id": "127_8_1", "text": "would stop", "html": "would stop"},
            {"id": "127_8_2", "text": "will stop", "html": "will stop"},
            {"id": "127_8_3", "text": "stops", "html": "stops"},
            {"id": "127_8_4", "text": "stopped", "html": "stopped"}
        ],
        "correctChoiceId": "127_8_1",
        "explanation": "<p>Câu ước cho tương lai hoặc mong muốn một sự thay đổi hành động: <strong>wish + S + would + V-inf (would stop)</strong>.</p>",
        "ruleTip": "Ước về một hành động trong tương lai hoặc phàn nàn: wish + S + would + V-inf."
    },
    {
        "id": "127_9",
        "questionName": "Question 9",
        "questionText": "<p>Without your helpful guidance, we ________ able to complete this difficult project.</p>",
        "choices": [
            {"id": "127_9_1", "text": "wouldn't be", "html": "wouldn't be"},
            {"id": "127_9_2", "text": "won't be", "html": "won't be"},
            {"id": "127_9_3", "text": "weren't", "html": "weren't"},
            {"id": "127_9_4", "text": "aren't", "html": "aren't"}
        ],
        "correctChoiceId": "127_9_1",
        "explanation": "<p><strong>Without + N</strong> mang ý nghĩa giả định loại 2: 'Nếu không có... thì chúng tôi đã không thể...': vế chính dùng <strong>wouldn't be</strong>.</p>",
        "ruleTip": "'Without + N' tương đương If 2: vế chính dùng wouldn't be + adj."
    },
    {
        "id": "127_10",
        "questionName": "Question 10",
        "questionText": "<p>He doesn't have a car, so he can't drive to work. -> If he ________ a car, he ________ to work.</p>",
        "choices": [
            {"id": "127_10_1", "text": "had / could drive", "html": "had / could drive"},
            {"id": "127_10_2", "text": "has / can drive", "html": "has / can drive"},
            {"id": "127_10_3", "text": "had / will drive", "html": "had / will drive"},
            {"id": "127_10_4", "text": "has / would drive", "html": "has / would drive"}
        ],
        "correctChoiceId": "127_10_1",
        "explanation": "<p>Viết lại câu từ thực tế hiện tại sang câu điều kiện loại 2: chuyển phủ định thành khẳng định và lùi thì: <strong>had / could drive</strong>.</p>",
        "ruleTip": "Chuyển từ thực tế sang If 2: khẳng định thành phủ định, lùi về quá khứ."
    },
    {
        "id": "127_11",
        "questionName": "Question 11",
        "questionText": "<p>________ I rich, I would build a modern hospital for poor children in rural areas.</p>",
        "choices": [
            {"id": "127_11_1", "text": "Were", "html": "Were"},
            {"id": "127_11_2", "text": "If", "html": "If"},
            {"id": "127_11_3", "text": "Should", "html": "Should"},
            {"id": "127_11_4", "text": "Had", "html": "Had"}
        ],
        "correctChoiceId": "127_11_1",
        "explanation": "<p>Đảo ngữ câu điều kiện loại 2 với động từ to be: <strong>Were + S + (adj/noun)...</strong>, S + would + V-inf. 'Were I rich' = 'If I were rich'.</p>",
        "ruleTip": "Đảo ngữ If 2 với to be: Were + S + adj/noun..., S + would + V-inf."
    },
    {
        "id": "127_12",
        "questionName": "Question 12",
        "questionText": "<p>________ he to study harder, he would easily achieve higher marks in the final exam.</p>",
        "choices": [
            {"id": "127_12_1", "text": "Were", "html": "Were"},
            {"id": "127_12_2", "text": "Should", "html": "Should"},
            {"id": "127_12_3", "text": "If", "html": "If"},
            {"id": "127_12_4", "text": "Had", "html": "Had"}
        ],
        "correctChoiceId": "127_12_1",
        "explanation": "<p>Đảo ngữ câu điều kiện loại 2 với động từ thường: <strong>Were + S + to V-inf...</strong>. 'Were he to study' = 'If he studied'.</p>",
        "ruleTip": "Đảo ngữ If 2 với động từ thường: Were + S + to V-inf..."
    },
    {
        "id": "127_13",
        "questionName": "Question 13",
        "questionText": "<p>I can't swim. I wish I ________ swim across this wide river.</p>",
        "choices": [
            {"id": "127_13_1", "text": "could", "html": "could"},
            {"id": "127_13_2", "text": "can", "html": "can"},
            {"id": "127_13_3", "text": "would", "html": "would"},
            {"id": "127_13_4", "text": "am able to", "html": "am able to"}
        ],
        "correctChoiceId": "127_13_1",
        "explanation": "<p>Câu ước khả năng ở hiện tại: 'can' lùi thì thành <strong>could + V-inf</strong>.</p>",
        "ruleTip": "Ước khả năng ở hiện tại: can chuyển thành COULD + V-inf."
    },
    {
        "id": "127_14",
        "questionName": "Question 14",
        "questionText": "<p>If the air in Hanoi were cleaner, people ________ from fewer respiratory illnesses.</p>",
        "choices": [
            {"id": "127_14_1", "text": "would suffer", "html": "would suffer"},
            {"id": "127_14_2", "text": "will suffer", "html": "will suffer"},
            {"id": "127_14_3", "text": "suffered", "html": "suffered"},
            {"id": "127_14_4", "text": "suffer", "html": "suffer"}
        ],
        "correctChoiceId": "127_14_1",
        "explanation": "<p>Vế If dùng 'were cleaner' (If 2), mệnh đề chính dùng <strong>would + V-inf (would suffer)</strong>.</p>",
        "ruleTip": "Mệnh đề chính If 2: would + V-inf diễn tả kết quả giả định."
    },
    {
        "id": "127_15",
        "questionName": "Question 15",
        "questionText": "<p>If she ________ the truth now, she would be very disappointed with us.</p>",
        "choices": [
            {"id": "127_15_1", "text": "knew", "html": "knew"},
            {"id": "127_15_2", "text": "knows", "html": "knows"},
            {"id": "127_15_3", "text": "will know", "html": "will know"},
            {"id": "127_15_4", "text": "has known", "html": "has known"}
        ],
        "correctChoiceId": "127_15_1",
        "explanation": "<p>Giả định trái ngược với hiện tại ('now'): mệnh đề If chia thì Quá khứ đơn: <strong>knew</strong>.</p>",
        "ruleTip": "Diễn tả sự thật không có ở hiện tại (now): Vế If chia quá khứ đơn 'knew'."
    }
]

theory127 = {
    "topicId": 127,
    "topicName": "Câu điều kiện loại 2 và câu ước",
    "englishName": "Second conditional and Wish sentences",
    "rules": [
        {
            "rule": "Câu điều kiện loại 2: Diễn tả điều kiện không có thật hoặc trái ngược với thực tế ở hiện tại.",
            "formula": "If + S + V(quá khứ đơn / were), S + would/could/might + V(nguyên thể)",
            "examples": "If I had a million dollars, I would travel around the world."
        },
        {
            "rule": "Động từ 'to be' trong mệnh đề If loại 2: Luôn dùng 'were' cho tất cả các ngôi.",
            "formula": "If + I/he/she/it + were..., S + would + V-inf",
            "examples": "If I were you, I would accept that scholarship."
        },
        {
            "rule": "Câu ước với 'Wish' / 'If only' ở hiện tại (trái ngược với thực tế hiện tại):",
            "formula": "S + wish(es) + (that) + S + V(quá khứ đơn / were)",
            "examples": "I wish I were taller. / He wishes he had a new bicycle."
        },
        {
            "rule": "Câu ước với 'Wish' ở tương lai (mong muốn thay đổi trong tương lai):",
            "formula": "S + wish(es) + (that) + S + would/could + V(nguyên thể)",
            "examples": "I wish it would stop raining soon."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 128: Các thì hiện tại (15 questions)
# -------------------------------------------------------------
q128 = [
    {
        "id": "128_1",
        "questionName": "Question 1",
        "questionText": "<p>My father usually ________ up at 5:30 AM to do morning exercises.</p>",
        "choices": [
            {"id": "128_1_1", "text": "gets", "html": "gets"},
            {"id": "128_1_2", "text": "get", "html": "get"},
            {"id": "128_1_3", "text": "is getting", "html": "is getting"},
            {"id": "128_1_4", "text": "has got", "html": "has got"}
        ],
        "correctChoiceId": "128_1_1",
        "explanation": "<p>Thói quen lặp đi lặp lại có trạng từ chỉ tần suất 'usually': chia thì Hiện tại đơn. Chủ ngữ 'My father' số ít nên thêm -s: <strong>gets</strong>.</p>",
        "ruleTip": "Thói quen lặp đi lặp lại với 'usually': chia Hiện tại đơn, chủ ngữ số ít thêm -s."
    },
    {
        "id": "128_2",
        "questionName": "Question 2",
        "questionText": "<p>Look! The children ________ football cheerfully on the playground.</p>",
        "choices": [
            {"id": "128_2_1", "text": "are playing", "html": "are playing"},
            {"id": "128_2_2", "text": "play", "html": "play"},
            {"id": "128_2_3", "text": "is playing", "html": "is playing"},
            {"id": "128_2_4", "text": "have played", "html": "have played"}
        ],
        "correctChoiceId": "128_2_1",
        "explanation": "<p>Dấu hiệu 'Look!' báo hiệu hành động đang diễn ra tại thời điểm nói: chia thì Hiện tại tiếp diễn. 'The children' số nhiều: <strong>are playing</strong>.</p>",
        "ruleTip": "Dấu hiệu 'Look!' báo hiệu hành động đang diễn ra: chia Hiện tại tiếp diễn (am/is/are + V-ing)."
    },
    {
        "id": "128_3",
        "questionName": "Question 3",
        "questionText": "<p>Mr. Brown ________ English at our secondary school since 2018.</p>",
        "choices": [
            {"id": "128_3_1", "text": "has taught", "html": "has taught"},
            {"id": "128_3_2", "text": "teaches", "html": "teaches"},
            {"id": "128_3_3", "text": "is teaching", "html": "is teaching"},
            {"id": "128_3_4", "text": "taught", "html": "taught"}
        ],
        "correctChoiceId": "128_3_1",
        "explanation": "<p>Dấu hiệu 'since 2018' (kể từ năm 2018): chia thì Hiện tại hoàn thành: <strong>has taught</strong>.</p>",
        "ruleTip": "Dấu hiệu 'since + mốc thời gian': chia Hiện tại hoàn thành (have/has + V3/ed)."
    },
    {
        "id": "128_4",
        "questionName": "Question 4",
        "questionText": "<p>I ________ the answer to this difficult question right now.</p>",
        "choices": [
            {"id": "128_4_1", "text": "know", "html": "know"},
            {"id": "128_4_2", "text": "am knowing", "html": "am knowing"},
            {"id": "128_4_3", "text": "have known", "html": "have known"},
            {"id": "128_4_4", "text": "knew", "html": "knew"}
        ],
        "correctChoiceId": "128_4_1",
        "explanation": "<p>'Know' là động từ chỉ nhận thức/trạng thái (stative verb), KHÔNG dùng ở thì tiếp diễn dù có 'right now': chọn <strong>know</strong>.</p>",
        "ruleTip": "Động từ chỉ nhận thức (know, understand, believe) KHÔNG chia tiếp diễn dù có 'right now'."
    },
    {
        "id": "128_5",
        "questionName": "Question 5",
        "questionText": "<p>The flight to London ________ at 10:15 tomorrow morning according to the schedule.</p>",
        "choices": [
            {"id": "128_5_1", "text": "departs", "html": "departs"},
            {"id": "128_5_2", "text": "will depart", "html": "will depart"},
            {"id": "128_5_3", "text": "is departing", "html": "is departing"},
            {"id": "128_5_4", "text": "departed", "html": "departed"}
        ],
        "correctChoiceId": "128_5_1",
        "explanation": "<p>Lịch trình cố định của máy bay/tàu xe trong tương lai: dùng thì Hiện tại đơn: <strong>departs</strong>.</p>",
        "ruleTip": "Lịch trình tàu xe, máy bay dùng thì Hiện tại đơn dù mang nghĩa tương lai."
    },
    {
        "id": "128_6",
        "questionName": "Question 6",
        "questionText": "<p>Has your brother submitted his high school application form ________?</p>",
        "choices": [
            {"id": "128_6_1", "text": "yet", "html": "yet"},
            {"id": "128_6_2", "text": "already", "html": "already"},
            {"id": "128_6_3", "text": "since", "html": "since"},
            {"id": "128_6_4", "text": "never", "html": "never"}
        ],
        "correctChoiceId": "128_6_1",
        "explanation": "<p>Trong câu hỏi nghi vấn của thì Hiện tại hoàn thành, từ đứng ở cuối câu là <strong>yet</strong> (đã... chưa?).</p>",
        "ruleTip": "'Yet' dùng ở cuối câu hỏi và câu phủ định của thì Hiện tại hoàn thành."
    },
    {
        "id": "128_7",
        "questionName": "Question 7",
        "questionText": "<p>He is so careless! He is always ________ his house keys.</p>",
        "choices": [
            {"id": "128_7_1", "text": "losing", "html": "losing"},
            {"id": "128_7_2", "text": "lose", "html": "lose"},
            {"id": "128_7_3", "text": "lost", "html": "lost"},
            {"id": "128_7_4", "text": "loses", "html": "loses"}
        ],
        "correctChoiceId": "128_7_1",
        "explanation": "<p>Cấu trúc <strong>'be + always + V-ing'</strong> diễn tả sự phàn nàn, bực mình về một thói quen xấu: <strong>losing</strong>.</p>",
        "ruleTip": "'S + be + always + V-ing' diễn tả sự phàn nàn, bực mình về một thói quen xấu."
    },
    {
        "id": "128_8",
        "questionName": "Question 8",
        "questionText": "<p>We haven't seen our former English teacher ________ nearly five years.</p>",
        "choices": [
            {"id": "128_8_1", "text": "for", "html": "for"},
            {"id": "128_8_2", "text": "since", "html": "since"},
            {"id": "128_8_3", "text": "in", "html": "in"},
            {"id": "128_8_4", "text": "at", "html": "at"}
        ],
        "correctChoiceId": "128_8_1",
        "explanation": "<p>'Five years' là một khoảng thời gian nên dùng giới từ <strong>for</strong> trong thì Hiện tại hoàn thành.</p>",
        "ruleTip": "'For + khoảng thời gian' (for 5 years); 'Since + mốc thời gian' (since 2020)."
    },
    {
        "id": "128_9",
        "questionName": "Question 9",
        "questionText": "<p>This is the first time I ________ such a magnificent ancient temple.</p>",
        "choices": [
            {"id": "128_9_1", "text": "have visited", "html": "have visited"},
            {"id": "128_9_2", "text": "visit", "html": "visit"},
            {"id": "128_9_3", "text": "visited", "html": "visited"},
            {"id": "128_9_4", "text": "am visiting", "html": "am visiting"}
        ],
        "correctChoiceId": "128_9_1",
        "explanation": "<p>Cấu trúc <strong>'This is the first time + S + have/has + V3/ed'</strong>: chọn <strong>have visited</strong>.</p>",
        "ruleTip": "Cấu trúc: 'This is the first/second time + S + have/has + V3/ed'."
    },
    {
        "id": "128_10",
        "questionName": "Question 10",
        "questionText": "<p>We ________ dinner with Mr. Henderson this evening; the table is already reserved.</p>",
        "choices": [
            {"id": "128_10_1", "text": "are having", "html": "are having"},
            {"id": "128_10_2", "text": "have", "html": "have"},
            {"id": "128_10_3", "text": "had", "html": "had"},
            {"id": "128_10_4", "text": "have had", "html": "have had"}
        ],
        "correctChoiceId": "128_10_1",
        "explanation": "<p>Kế hoạch đã được chuẩn bị và sắp xếp cố định (đã đặt bàn): dùng thì Hiện tại tiếp diễn mang nghĩa tương lai <strong>are having</strong>.</p>",
        "ruleTip": "Kế hoạch đã sắp xếp cố định trong tương lai gần: chia Hiện tại tiếp diễn."
    },
    {
        "id": "128_11",
        "questionName": "Question 11",
        "questionText": "<p>The Earth ________ round the Sun once every 365 and a quarter days.</p>",
        "choices": [
            {"id": "128_11_1", "text": "revolves", "html": "revolves"},
            {"id": "128_11_2", "text": "is revolving", "html": "is revolving"},
            {"id": "128_11_3", "text": "revolved", "html": "revolved"},
            {"id": "128_11_4", "text": "has revolved", "html": "has revolved"}
        ],
        "correctChoiceId": "128_11_1",
        "explanation": "<p>Chân lý, định luật khoa học bất biến: chia thì Hiện tại đơn: <strong>revolves</strong>.</p>",
        "ruleTip": "Chân lý, quy luật khoa học vũ trụ luôn luôn chia thì Hiện tại đơn."
    },
    {
        "id": "128_12",
        "questionName": "Question 12",
        "questionText": "<p>Lan cannot play badminton now because she ________ her wrist.</p>",
        "choices": [
            {"id": "128_12_1", "text": "has just sprained", "html": "has just sprained"},
            {"id": "128_12_2", "text": "sprains", "html": "sprains"},
            {"id": "128_12_3", "text": "was spraining", "html": "was spraining"},
            {"id": "128_12_4", "text": "had sprained", "html": "had sprained"}
        ],
        "correctChoiceId": "128_12_1",
        "explanation": "<p>Hành động vừa mới xảy ra và để lại kết quả ảnh hưởng trực tiếp đến hiện tại ('cannot play now'): dùng Hiện tại hoàn thành với 'just': <strong>has just sprained</strong>.</p>",
        "ruleTip": "Hành động vừa mới xảy ra để lại kết quả ở hiện tại: dùng Hiện tại hoàn thành với 'just'."
    },
    {
        "id": "128_13",
        "questionName": "Question 13",
        "questionText": "<p>Mary is not at home right now. She ________ to the local library to borrow some books.</p>",
        "choices": [
            {"id": "128_13_1", "text": "has gone", "html": "has gone"},
            {"id": "128_13_2", "text": "has been", "html": "has been"},
            {"id": "128_13_3", "text": "goes", "html": "goes"},
            {"id": "128_13_4", "text": "is going to", "html": "is going to"}
        ],
        "correctChoiceId": "128_13_1",
        "explanation": "<p>Mary hiện không có ở nhà vì cô ấy đã đi đến thư viện (chưa về): dùng <strong>has gone to</strong>. ('has been to' nghĩa là đã đến và đã trở về).</p>",
        "ruleTip": "'Has gone to': đã đi và chưa về; 'Has been to': đã từng đến và đã trở về."
    },
    {
        "id": "128_14",
        "questionName": "Question 14",
        "questionText": "<p>She has made significant progress in English since she ________ our study club.</p>",
        "choices": [
            {"id": "128_14_1", "text": "joined", "html": "joined"},
            {"id": "128_14_2", "text": "joins", "html": "joins"},
            {"id": "128_14_3", "text": "has joined", "html": "has joined"},
            {"id": "128_14_4", "text": "was joining", "html": "was joining"}
        ],
        "correctChoiceId": "128_14_1",
        "explanation": "<p>Cấu trúc hòa hợp thì: <strong>Hiện tại hoàn thành + SINCE + Quá khứ đơn</strong>. Chọn <strong>joined</strong>.</p>",
        "ruleTip": "Cấu trúc nối: Hiện tại hoàn thành + SINCE + Quá khứ đơn."
    },
    {
        "id": "128_15",
        "questionName": "Question 15",
        "questionText": "<p>Pure water ________ at 50 degrees Celsius under normal atmospheric pressure.</p>",
        "choices": [
            {"id": "128_15_1", "text": "doesn't boil", "html": "doesn't boil"},
            {"id": "128_15_2", "text": "isn't boiling", "html": "isn't boiling"},
            {"id": "128_15_3", "text": "won't boil", "html": "won't boil"},
            {"id": "128_15_4", "text": "didn't boil", "html": "didn't boil"}
        ],
        "correctChoiceId": "128_15_1",
        "explanation": "<p>Chân lý khoa học phủ định: nước không sôi ở 50°C. 'Water' không đếm được dùng <strong>doesn't boil</strong>.</p>",
        "ruleTip": "Phủ định hiện tại đơn với chủ ngữ không đếm được: doesn't + V-inf."
    }
]

theory128 = {
    "topicId": 128,
    "topicName": "Các thì hiện tại",
    "englishName": "Present Tenses: Simple, Continuous, Perfect",
    "rules": [
        {
            "rule": "Thì Hiện tại đơn: Thói quen, chân lý, lịch trình cố định của tàu xe/lịch học.",
            "formula": "S + V(s/es) / S + do/does not + V-inf / Do/Does + S + V-inf?",
            "examples": "The train leaves at 7:00 AM tomorrow. / She often reads books."
        },
        {
            "rule": "Thì Hiện tại tiếp diễn: Hành động đang xảy ra tại thời điểm nói hoặc kế hoạch tương lai gần.",
            "formula": "S + am/is/are + V-ing",
            "examples": "Listen! Someone is singing. / We are flying to Da Nang tonight."
        },
        {
            "rule": "Lưu ý Động từ chỉ trạng thái (Stative Verbs): Không dùng ở thì tiếp diễn.",
            "formula": "know, believe, understand, like, love, want, belong, feel, seem",
            "examples": "I understand the lesson now (KHÔNG dùng: I am understanding)."
        },
        {
            "rule": "Thì Hiện tại hoàn thành: Bắt đầu trong quá khứ kéo dài đến hiện tại, hoặc vừa mới xảy ra.",
            "formula": "S + have/has + V3/ed (Dấu hiệu: since, for, already, yet, just, ever, never)",
            "examples": "They have lived here for 10 years. / Have you finished your homework yet?"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 130: Các thì quá khứ (15 questions)
# -------------------------------------------------------------
q130 = [
    {
        "id": "130_1",
        "questionName": "Question 1",
        "questionText": "<p>Thomas Edison ________ the incandescent light bulb in 1879.</p>",
        "choices": [
            {"id": "130_1_1", "text": "invented", "html": "invented"},
            {"id": "130_1_2", "text": "has invented", "html": "has invented"},
            {"id": "130_1_3", "text": "was inventing", "html": "was inventing"},
            {"id": "130_1_4", "text": "had invented", "html": "had invented"}
        ],
        "correctChoiceId": "130_1_1",
        "explanation": "<p>Sự kiện lịch sử đã chấm dứt hoàn toàn trong quá khứ có mốc thời gian xác định ('in 1879'): chia thì Quá khứ đơn: <strong>invented</strong>.</p>",
        "ruleTip": "Sự kiện lịch sử có năm xác định trong quá khứ: chia Quá khứ đơn (V2/ed)."
    },
    {
        "id": "130_2",
        "questionName": "Question 2",
        "questionText": "<p>When I was walking home from school, it suddenly ________ to rain heavily.</p>",
        "choices": [
            {"id": "130_2_1", "text": "started", "html": "started"},
            {"id": "130_2_2", "text": "was starting", "html": "was starting"},
            {"id": "130_2_3", "text": "has started", "html": "has started"},
            {"id": "130_2_4", "text": "had started", "html": "had started"}
        ],
        "correctChoiceId": "130_2_1",
        "explanation": "<p>Hành động đang diễn ra (Past Continuous: was walking) thì một hành động ngắn hơn bất ngờ xen vào: chia Quá khứ đơn <strong>started</strong>.</p>",
        "ruleTip": "Hành động đang diễn ra (Past Continuous) bị hành động ngắn hơn cắt ngang (Past Simple)."
    },
    {
        "id": "130_3",
        "questionName": "Question 3",
        "questionText": "<p>At 9:00 PM yesterday, my whole family ________ an exciting football match on TV.</p>",
        "choices": [
            {"id": "130_3_1", "text": "was watching", "html": "was watching"},
            {"id": "130_3_2", "text": "watched", "html": "watched"},
            {"id": "130_3_3", "text": "were watching", "html": "were watching"},
            {"id": "130_3_4", "text": "had watched", "html": "had watched"}
        ],
        "correctChoiceId": "130_3_1",
        "explanation": "<p>Tại thời điểm cụ thể, xác định trong quá khứ ('At 9:00 PM yesterday'): chia thì Quá khứ tiếp diễn. Chủ ngữ 'my whole family' mang tính tập hợp số ít: <strong>was watching</strong>.</p>",
        "ruleTip": "Thời điểm xác định trong quá khứ (at 9 PM yesterday): chia Quá khứ tiếp diễn."
    },
    {
        "id": "130_4",
        "questionName": "Question 4",
        "questionText": "<p>By the time the fire brigade arrived, the fire ________ by local residents.</p>",
        "choices": [
            {"id": "130_4_1", "text": "had been put out", "html": "had been put out"},
            {"id": "130_4_2", "text": "was put out", "html": "was put out"},
            {"id": "130_4_3", "text": "has been put out", "html": "has been put out"},
            {"id": "130_4_4", "text": "is put out", "html": "is put out"}
        ],
        "correctChoiceId": "130_4_1",
        "explanation": "<p>Cấu trúc: <strong>By the time + S + V(quá khứ đơn), S + had + V3/ed</strong>. Đám cháy đã được dập tắt trước khi lính cứu hỏa đến: <strong>had been put out</strong>.</p>",
        "ruleTip": "'By the time + Quá khứ đơn, Quá khứ hoàn thành' (had + V3/ed)."
    },
    {
        "id": "130_5",
        "questionName": "Question 5",
        "questionText": "<p>While my mother was cooking in the kitchen, my father ________ the newspaper.</p>",
        "choices": [
            {"id": "130_5_1", "text": "was reading", "html": "was reading"},
            {"id": "130_5_2", "text": "read", "html": "read"},
            {"id": "130_5_3", "text": "has read", "html": "has read"},
            {"id": "130_5_4", "text": "had read", "html": "had read"}
        ],
        "correctChoiceId": "130_5_1",
        "explanation": "<p>'While' nối hai hành động diễn ra song song cùng lúc trong quá khứ: cả hai vế đều chia thì Quá khứ tiếp diễn: <strong>was reading</strong>.</p>",
        "ruleTip": "'While' nối hai hành động xảy ra song song cùng lúc trong quá khứ: cả hai đều chia Past Continuous."
    },
    {
        "id": "130_6",
        "questionName": "Question 6",
        "questionText": "<p>After she ________ all her homework tasks, she went to bed.</p>",
        "choices": [
            {"id": "130_6_1", "text": "had completed", "html": "had completed"},
            {"id": "130_6_2", "text": "completed", "html": "completed"},
            {"id": "130_6_3", "text": "has completed", "html": "has completed"},
            {"id": "130_6_4", "text": "was completing", "html": "was completing"}
        ],
        "correctChoiceId": "130_6_1",
        "explanation": "<p>Hành động hoàn thành bài tập xảy ra trước hành động đi ngủ: sau 'After' chia thì Quá khứ hoàn thành: <strong>had completed</strong>.</p>",
        "ruleTip": "'After + Quá khứ hoàn thành, Quá khứ đơn' (hành động xong trước chia had + V3)."
    },
    {
        "id": "130_7",
        "questionName": "Question 7",
        "questionText": "<p>When my grandfather was young, he ________ 10 kilometers to school every day.</p>",
        "choices": [
            {"id": "130_7_1", "text": "used to walk", "html": "used to walk"},
            {"id": "130_7_2", "text": "is used to walking", "html": "is used to walking"},
            {"id": "130_7_3", "text": "uses to walk", "html": "uses to walk"},
            {"id": "130_7_4", "text": "used to walking", "html": "used to walking"}
        ],
        "correctChoiceId": "130_7_1",
        "explanation": "<p>Diễn tả thói quen trong quá khứ nay không còn nữa: <strong>used to + V-inf (used to walk)</strong>.</p>",
        "ruleTip": "'Used to + V-inf' diễn tả thói quen trong quá khứ nay không còn nữa."
    },
    {
        "id": "130_8",
        "questionName": "Question 8",
        "questionText": "<p>She has lived in London for two years, so she is used to ________ on the left.</p>",
        "choices": [
            {"id": "130_8_1", "text": "driving", "html": "driving"},
            {"id": "130_8_2", "text": "drive", "html": "drive"},
            {"id": "130_8_3", "text": "drove", "html": "drove"},
            {"id": "130_8_4", "text": "driven", "html": "driven"}
        ],
        "correctChoiceId": "130_8_1",
        "explanation": "<p>Cấu trúc <strong>'be used to + V-ing'</strong> diễn tả việc đã quen làm ở hiện tại: <strong>driving</strong>.</p>",
        "ruleTip": "'Be/get used to + V-ing' diễn tả thói quen đã quen thuộc ở hiện tại."
    },
    {
        "id": "130_9",
        "questionName": "Question 9",
        "questionText": "<p>I ________ like eating green vegetables when I was a small child.</p>",
        "choices": [
            {"id": "130_9_1", "text": "didn't use to", "html": "didn't use to"},
            {"id": "130_9_2", "text": "didn't used to", "html": "didn't used to"},
            {"id": "130_9_3", "text": "wasn't used to", "html": "wasn't used to"},
            {"id": "130_9_4", "text": "not used to", "html": "not used to"}
        ],
        "correctChoiceId": "130_9_1",
        "explanation": "<p>Dạng phủ định của 'used to' là <strong>didn't use to + V-inf</strong> (chữ use để nguyên mẫu không có -d).</p>",
        "ruleTip": "Phủ định của 'used to': dùng 'didn't use to + V-inf' (chữ use không có -d)."
    },
    {
        "id": "130_10",
        "questionName": "Question 10",
        "questionText": "<p>He came home, took off his wet raincoat, and ________ on the sofa to rest.</p>",
        "choices": [
            {"id": "130_10_1", "text": "sat", "html": "sat"},
            {"id": "130_10_2", "text": "was sitting", "html": "was sitting"},
            {"id": "130_10_3", "text": "sits", "html": "sits"},
            {"id": "130_10_4", "text": "had sat", "html": "had sat"}
        ],
        "correctChoiceId": "130_10_1",
        "explanation": "<p>Chuỗi các hành động liên tiếp xảy ra trong quá khứ (came, took off, and...): chia thì Quá khứ đơn: <strong>sat</strong>.</p>",
        "ruleTip": "Chuỗi các hành động liên tiếp xảy ra trong quá khứ: đều chia Quá khứ đơn."
    },
    {
        "id": "130_11",
        "questionName": "Question 11",
        "questionText": "<p>The express train had already departed before we ________ at the platform.</p>",
        "choices": [
            {"id": "130_11_1", "text": "arrived", "html": "arrived"},
            {"id": "130_11_2", "text": "had arrived", "html": "had arrived"},
            {"id": "130_11_3", "text": "were arriving", "html": "were arriving"},
            {"id": "130_11_4", "text": "arrive", "html": "arrive"}
        ],
        "correctChoiceId": "130_11_1",
        "explanation": "<p>Cấu trúc: <strong>Quá khứ hoàn thành + BEFORE + Quá khứ đơn</strong>: chọn <strong>arrived</strong>.</p>",
        "ruleTip": "'Before + Quá khứ đơn, Quá khứ hoàn thành'."
    },
    {
        "id": "130_12",
        "questionName": "Question 12",
        "questionText": "<p>The pupils were whispering while the teacher ________ on the blackboard.</p>",
        "choices": [
            {"id": "130_12_1", "text": "was writing", "html": "was writing"},
            {"id": "130_12_2", "text": "wrote", "html": "wrote"},
            {"id": "130_12_3", "text": "has written", "html": "has written"},
            {"id": "130_12_4", "text": "had written", "html": "had written"}
        ],
        "correctChoiceId": "130_12_1",
        "explanation": "<p>Mệnh đề đi sau 'while' diễn tả hành động đang diễn ra trong quá khứ: chia Quá khứ tiếp diễn <strong>was writing</strong>.</p>",
        "ruleTip": "Mệnh đề đi sau 'While' diễn tả hành động đang diễn ra chia Quá khứ tiếp diễn."
    },
    {
        "id": "130_13",
        "questionName": "Question 13",
        "questionText": "<p>They ________ to the cinema yesterday evening because all tickets were sold out.</p>",
        "choices": [
            {"id": "130_13_1", "text": "didn't go", "html": "didn't go"},
            {"id": "130_13_2", "text": "weren't going", "html": "weren't going"},
            {"id": "130_13_3", "text": "haven't gone", "html": "haven't gone"},
            {"id": "130_13_4", "text": "hadn't gone", "html": "hadn't gone"}
        ],
        "correctChoiceId": "130_13_1",
        "explanation": "<p>Dấu hiệu 'yesterday evening' chỉ sự việc trong quá khứ: thể phủ định dùng <strong>didn't + V-inf (didn't go)</strong>.</p>",
        "ruleTip": "Phủ định Quá khứ đơn: didn't + V-inf."
    },
    {
        "id": "130_14",
        "questionName": "Question 14",
        "questionText": "<p>As soon as he heard the exciting news, he ________ his parents immediately.</p>",
        "choices": [
            {"id": "130_14_1", "text": "called", "html": "called"},
            {"id": "130_14_2", "text": "was calling", "html": "was calling"},
            {"id": "130_14_3", "text": "had called", "html": "had called"},
            {"id": "130_14_4", "text": "calls", "html": "calls"}
        ],
        "correctChoiceId": "130_14_1",
        "explanation": "<p>Hai hành động xảy ra gần như cùng lúc nối tiếp nhau ngay tức thì trong quá khứ: cả hai vế đều chia Quá khứ đơn: <strong>called</strong>.</p>",
        "ruleTip": "Hai hành động xảy ra gần như tức thì trong quá khứ: cả hai đều chia Quá khứ đơn."
    },
    {
        "id": "130_15",
        "questionName": "Question 15",
        "questionText": "<p>She was late for the exam because she ________ to set her alarm clock the night before.</p>",
        "choices": [
            {"id": "130_15_1", "text": "had forgotten", "html": "had forgotten"},
            {"id": "130_15_2", "text": "forgot", "html": "forgot"},
            {"id": "130_15_3", "text": "has forgotten", "html": "has forgotten"},
            {"id": "130_15_4", "text": "was forgetting", "html": "was forgetting"}
        ],
        "correctChoiceId": "130_15_1",
        "explanation": "<p>Nguyên nhân quên đặt đồng hồ xảy ra trước hành động muộn thi trong quá khứ: chia Quá khứ hoàn thành: <strong>had forgotten</strong>.</p>",
        "ruleTip": "Nguyên nhân xảy ra trước trong quá khứ: chia Quá khứ hoàn thành (had + V3)."
    }
]

theory130 = {
    "topicId": 130,
    "topicName": "Các thì quá khứ",
    "englishName": "Past Tenses: Simple, Continuous, Perfect & Used to",
    "rules": [
        {
            "rule": "Thì Quá khứ đơn: Hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ.",
            "formula": "S + V2/ed / S + didn't + V-inf (Dấu hiệu: yesterday, ago, last week, in 1995)",
            "examples": "I visited my grandparents yesterday. / Did you watch the match last night?"
        },
        {
            "rule": "Thì Quá khứ tiếp diễn: Hành động đang xảy ra tại thời điểm xác định trong quá khứ.",
            "formula": "S + was/were + V-ing (at 8 PM yesterday, at this time last year)",
            "examples": "At 8 PM last night, I was doing my homework."
        },
        {
            "rule": "Sự kết hợp giữa Quá khứ tiếp diễn và Quá khứ đơn với When / While:",
            "formula": "When + S + V2/ed, S + was/were + V-ing // While + S + was/were + V-ing, S + V2/ed",
            "examples": "When the phone rang, I was cooking dinner."
        },
        {
            "rule": "Thì Quá khứ hoàn thành: Hành động xảy ra và hoàn thành TRƯỚC một hành động khác trong quá khứ.",
            "formula": "Before / By the time + S + V2/ed, S + had + V3/ed // After + S + had + V3/ed, S + V2/ed",
            "examples": "By the time we arrived at the cinema, the movie had already started."
        },
        {
            "rule": "Cấu trúc Used to: Thói quen hoặc trạng thái trong quá khứ nay không còn nữa.",
            "formula": "S + used to + V(nguyên thể) (Phân biệt: be/get used to + V-ing: quen với việc gì)",
            "examples": "He used to smoke, but he gave it up last year."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 134: Các thì tương lai (15 questions)
# -------------------------------------------------------------
q134 = [
    {
        "id": "134_1",
        "questionName": "Question 1",
        "questionText": "<p>Look at those dark storm clouds in the sky! It ________ rain.</p>",
        "choices": [
            {"id": "134_1_1", "text": "is going to", "html": "is going to"},
            {"id": "134_1_2", "text": "will", "html": "will"},
            {"id": "134_1_3", "text": "shall", "html": "shall"},
            {"id": "134_1_4", "text": "is", "html": "is"}
        ],
        "correctChoiceId": "134_1_1",
        "explanation": "<p>Dự đoán sự việc có căn cứ, dấu hiệu rõ ràng trước mắt ('dark storm clouds'): dùng <strong>is going to + V-inf</strong>.</p>",
        "ruleTip": "Dự đoán có bằng chứng cụ thể trước mắt: dùng 'be going to + V-inf'."
    },
    {
        "id": "134_2",
        "questionName": "Question 2",
        "questionText": "<p>\"The doorbell is ringing.\" - \"Don't worry, I ________ it.\"</p>",
        "choices": [
            {"id": "134_2_1", "text": "will answer", "html": "will answer"},
            {"id": "134_2_2", "text": "am going to answer", "html": "am going to answer"},
            {"id": "134_2_3", "text": "answer", "html": "answer"},
            {"id": "134_2_4", "text": "answered", "html": "answered"}
        ],
        "correctChoiceId": "134_2_1",
        "explanation": "<p>Quyết định đưa ra ngay tức thì tại thời điểm nói (không có dự định từ trước): dùng <strong>will + V-inf (will answer)</strong>.</p>",
        "ruleTip": "Quyết định tức thì ngay tại thời điểm nói: dùng 'will + V-inf'."
    },
    {
        "id": "134_3",
        "questionName": "Question 3",
        "questionText": "<p>I will send you an email as soon as I ________ the entrance exam results.</p>",
        "choices": [
            {"id": "134_3_1", "text": "receive", "html": "receive"},
            {"id": "134_3_2", "text": "will receive", "html": "will receive"},
            {"id": "134_3_3", "text": "received", "html": "received"},
            {"id": "134_3_4", "text": "am receiving", "html": "am receiving"}
        ],
        "correctChoiceId": "134_3_1",
        "explanation": "<p>Mệnh đề trạng ngữ chỉ thời gian với <strong>'as soon as'</strong> chỉ tương lai: chia thì Hiện tại đơn: <strong>receive</strong> (tuyệt đối không dùng will).</p>",
        "ruleTip": "Mệnh đề chỉ thời gian (as soon as, when, until) chia Hiện tại đơn, KHÔNG dùng will."
    },
    {
        "id": "134_4",
        "questionName": "Question 4",
        "questionText": "<p>Why are you turning on the TV? - I ________ the football match between Vietnam and Thailand.</p>",
        "choices": [
            {"id": "134_4_1", "text": "am going to watch", "html": "am going to watch"},
            {"id": "134_4_2", "text": "will watch", "html": "will watch"},
            {"id": "134_4_3", "text": "watch", "html": "watch"},
            {"id": "134_4_4", "text": "watched", "html": "watched"}
        ],
        "correctChoiceId": "134_4_1",
        "explanation": "<p>Hành động đã có chủ ý, kế hoạch từ trước (bật TV để xem): dùng <strong>am going to watch</strong>.</p>",
        "ruleTip": "Dự định đã có kế hoạch từ trước khi nói: dùng 'be going to + V-inf'."
    },
    {
        "id": "134_5",
        "questionName": "Question 5",
        "questionText": "<p>Don't worry about your secret. I promise I ________ anyone.</p>",
        "choices": [
            {"id": "134_5_1", "text": "won't tell", "html": "won't tell"},
            {"id": "134_5_2", "text": "am not telling", "html": "am not telling"},
            {"id": "134_5_3", "text": "am not going to tell", "html": "am not going to tell"},
            {"id": "134_5_4", "text": "don't tell", "html": "don't tell"}
        ],
        "correctChoiceId": "134_5_1",
        "explanation": "<p>Lời hứa (promise): luôn dùng thì Tương lai đơn: <strong>won't tell</strong>.</p>",
        "ruleTip": "Lời hứa (promise): luôn dùng 'will / won't + V-inf'."
    },
    {
        "id": "134_6",
        "questionName": "Question 6",
        "questionText": "<p>Please wait here patiently until the nurse ________ your name.</p>",
        "choices": [
            {"id": "134_6_1", "text": "calls", "html": "calls"},
            {"id": "134_6_2", "text": "will call", "html": "will call"},
            {"id": "134_6_3", "text": "is calling", "html": "is calling"},
            {"id": "134_6_4", "text": "called", "html": "called"}
        ],
        "correctChoiceId": "134_6_1",
        "explanation": "<p>Sau liên từ chỉ thời gian <strong>'until'</strong>: chia thì Hiện tại đơn: <strong>calls</strong>.</p>",
        "ruleTip": "Sau 'until' dùng thì Hiện tại đơn mang ý nghĩa tương lai."
    },
    {
        "id": "134_7",
        "questionName": "Question 7",
        "questionText": "<p>I think our school basketball team ________ the championship trophy this year.</p>",
        "choices": [
            {"id": "134_7_1", "text": "will win", "html": "will win"},
            {"id": "134_7_2", "text": "is winning", "html": "is winning"},
            {"id": "134_7_3", "text": "is going to win", "html": "is going to win"},
            {"id": "134_7_4", "text": "wins", "html": "wins"}
        ],
        "correctChoiceId": "134_7_1",
        "explanation": "<p>Dự đoán dựa trên quan điểm, niềm tin cá nhân ('I think'): dùng <strong>will + V-inf (will win)</strong>.</p>",
        "ruleTip": "Dự đoán dựa trên cảm tính cá nhân đi với think/hope/believe: dùng 'will + V-inf'."
    },
    {
        "id": "134_8",
        "questionName": "Question 8",
        "questionText": "<p>That suitcase looks extremely heavy. I ________ you carry it upstairs.</p>",
        "choices": [
            {"id": "134_8_1", "text": "will help", "html": "will help"},
            {"id": "134_8_2", "text": "am helping", "html": "am helping"},
            {"id": "134_8_3", "text": "am going to help", "html": "am going to help"},
            {"id": "134_8_4", "text": "help", "html": "help"}
        ],
        "correctChoiceId": "134_8_1",
        "explanation": "<p>Đưa ra lời đề nghị giúp đỡ tức thì: dùng <strong>will + V-inf (will help)</strong>.</p>",
        "ruleTip": "Đưa ra lời đề nghị giúp đỡ tức thì: dùng 'will + V-inf'."
    },
    {
        "id": "134_9",
        "questionName": "Question 9",
        "questionText": "<p>Watch out! That unstable ladder ________ fall down!</p>",
        "choices": [
            {"id": "134_9_1", "text": "is going to", "html": "is going to"},
            {"id": "134_9_2", "text": "will", "html": "will"},
            {"id": "134_9_3", "text": "shall", "html": "shall"},
            {"id": "134_9_4", "text": "can", "html": "can"}
        ],
        "correctChoiceId": "134_9_1",
        "explanation": "<p>Cảnh báo sự cố nguy hiểm sắp xảy ra dựa trên tình huống thực tế trước mắt: dùng <strong>is going to</strong>.</p>",
        "ruleTip": "Tình huống nguy hiểm sắp xảy ra có căn cứ nhãn tiền: dùng 'be going to'."
    },
    {
        "id": "134_10",
        "questionName": "Question 10",
        "questionText": "<p>By the time you finish your homework, hot dinner ________ ready on the table.</p>",
        "choices": [
            {"id": "134_10_1", "text": "will be", "html": "will be"},
            {"id": "134_10_2", "text": "is", "html": "is"},
            {"id": "134_10_3", "text": "was", "html": "was"},
            {"id": "134_10_4", "text": "would be", "html": "would be"}
        ],
        "correctChoiceId": "134_10_1",
        "explanation": "<p>Cấu trúc: <strong>By the time + S + V(hiện tại đơn), S + will + V-inf (will be)</strong>.</p>",
        "ruleTip": "'By the time + Hiện tại đơn, Tương lai đơn (will be)'."
    },
    {
        "id": "134_11",
        "questionName": "Question 11",
        "questionText": "<p>At 10:00 AM tomorrow, all Grade 9 students ________ their mock exam in the hall.</p>",
        "choices": [
            {"id": "134_11_1", "text": "will be taking", "html": "will be taking"},
            {"id": "134_11_2", "text": "will take", "html": "will take"},
            {"id": "134_11_3", "text": "are taking", "html": "are taking"},
            {"id": "134_11_4", "text": "take", "html": "take"}
        ],
        "correctChoiceId": "134_11_1",
        "explanation": "<p>Hành động sẽ đang diễn ra tại một thời điểm cụ thể trong tương lai ('At 10:00 AM tomorrow'): chia thì Tương lai tiếp diễn: <strong>will be taking</strong>.</p>",
        "ruleTip": "Hành động đang diễn ra tại thời điểm xác định trong tương lai: will be + V-ing."
    },
    {
        "id": "134_12",
        "questionName": "Question 12",
        "questionText": "<p>It's very stuffy and hot in this room. ________ I open the windows?</p>",
        "choices": [
            {"id": "134_12_1", "text": "Shall", "html": "Shall"},
            {"id": "134_12_2", "text": "Will", "html": "Will"},
            {"id": "134_12_3", "text": "Do", "html": "Do"},
            {"id": "134_12_4", "text": "Would", "html": "Would"}
        ],
        "correctChoiceId": "134_12_1",
        "explanation": "<p>Cấu trúc đề nghị giúp đỡ hoặc gợi ý với ngôi 'I': <strong>Shall I + V-inf? (Shall I open...)</strong>.</p>",
        "ruleTip": "'Shall I/we + V-inf' dùng để đưa ra lời đề nghị giúp đỡ hoặc gợi ý."
    },
    {
        "id": "134_13",
        "questionName": "Question 13",
        "questionText": "<p>When you ________ to Hanoi this autumn, I will take you to visit the Old Quarter.</p>",
        "choices": [
            {"id": "134_13_1", "text": "come", "html": "come"},
            {"id": "134_13_2", "text": "will come", "html": "will come"},
            {"id": "134_13_3", "text": "came", "html": "came"},
            {"id": "134_13_4", "text": "are coming", "html": "are coming"}
        ],
        "correctChoiceId": "134_13_1",
        "explanation": "<p>Mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng <strong>'When'</strong> trong tương lai: chia thì Hiện tại đơn: <strong>come</strong>.</p>",
        "ruleTip": "Mệnh đề 'When' chỉ tương lai chia thì Hiện tại đơn."
    },
    {
        "id": "134_14",
        "questionName": "Question 14",
        "questionText": "<p>If he doesn't apologize sincerely, I ________ invite him to my graduation party.</p>",
        "choices": [
            {"id": "134_14_1", "text": "won't", "html": "won't"},
            {"id": "134_14_2", "text": "wouldn't", "html": "wouldn't"},
            {"id": "134_14_3", "text": "don't", "html": "don't"},
            {"id": "134_14_4", "text": "didn't", "html": "didn't"}
        ],
        "correctChoiceId": "134_14_1",
        "explanation": "<p>Mệnh đề chính của câu điều kiện loại 1 thể phủ định: <strong>won't + V-inf</strong>.</p>",
        "ruleTip": "Mệnh đề chính loại 1 phủ định: won't + V-inf."
    },
    {
        "id": "134_15",
        "questionName": "Question 15",
        "questionText": "<p>My family ________ our grandparents in Hue next week; we bought plane tickets yesterday.</p>",
        "choices": [
            {"id": "134_15_1", "text": "are going to visit", "html": "are going to visit"},
            {"id": "134_15_2", "text": "will visit", "html": "will visit"},
            {"id": "134_15_3", "text": "visited", "html": "visited"},
            {"id": "134_15_4", "text": "visit", "html": "visit"}
        ],
        "correctChoiceId": "134_15_1",
        "explanation": "<p>Kế hoạch đã có sự chuẩn bị chắc chắn từ trước (đã mua vé máy bay hôm qua): dùng <strong>are going to visit</strong>.</p>",
        "ruleTip": "Kế hoạch chắc chắn có sự chuẩn bị từ trước: dùng 'be going to' hoặc Hiện tại tiếp diễn."
    }
]

theory134 = {
    "topicId": 134,
    "topicName": "Các thì tương lai",
    "englishName": "Future Tenses: Will, Be going to & Time Clauses",
    "rules": [
        {
            "rule": "Thì Tương lai đơn (Will + V-inf): Quyết định tức thì tại thời điểm nói, lời hứa, dự đoán không có căn cứ.",
            "formula": "S + will + V(nguyên thể) / S + won't + V(nguyên thể)",
            "examples": "I'm so thirsty. I will get some water. / I promise I won't be late."
        },
        {
            "rule": "Tương lai gần (Be going to + V-inf): Dự định đã có kế hoạch từ trước, hoặc dự đoán dựa trên căn cứ/bằng chứng rõ ràng ở hiện tại.",
            "formula": "S + am/is/are + going to + V(nguyên thể)",
            "examples": "Look at those dark clouds! It is going to rain. / We are going to buy a new house next month."
        },
        {
            "rule": "Mệnh đề trạng ngữ chỉ thời gian trong tương lai (Time Clauses):",
            "formula": "When / As soon as / Until / By the time + S + V(hiện tại đơn), S + will + V(nguyên thể)",
            "examples": "I will call you as soon as I arrive at the airport (KHÔNG dùng: as soon as I will arrive)."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 140: Thể bị động (15 questions)
# -------------------------------------------------------------
q140 = [
    {
        "id": "140_1",
        "questionName": "Question 1",
        "questionText": "<p>The Eiffel Tower ________ by the French engineer Gustave Eiffel in 1889.</p>",
        "choices": [
            {"id": "140_1_1", "text": "was designed", "html": "was designed"},
            {"id": "140_1_2", "text": "designed", "html": "designed"},
            {"id": "140_1_3", "text": "is designed", "html": "is designed"},
            {"id": "140_1_4", "text": "has been designed", "html": "has been designed"}
        ],
        "correctChoiceId": "140_1_1",
        "explanation": "<p>Bị động thì Quá khứ đơn (in 1889): <strong>was/were + V3/ed</strong>. 'The Eiffel Tower' số ít dùng <strong>was designed</strong>.</p>",
        "ruleTip": "Bị động Quá khứ đơn: was/were + V3/ed (chủ ngữ số ít dùng 'was')."
    },
    {
        "id": "140_2",
        "questionName": "Question 2",
        "questionText": "<p>English ________ as a compulsory subject in all Vietnamese secondary schools.</p>",
        "choices": [
            {"id": "140_2_1", "text": "is taught", "html": "is taught"},
            {"id": "140_2_2", "text": "teaches", "html": "teaches"},
            {"id": "140_2_3", "text": "was taught", "html": "was taught"},
            {"id": "140_2_4", "text": "has taught", "html": "has taught"}
        ],
        "correctChoiceId": "140_2_1",
        "explanation": "<p>Bị động thì Hiện tại đơn diễn tả sự thật hiển nhiên: <strong>am/is/are + V3/ed</strong>. 'English' đi với <strong>is taught</strong>.</p>",
        "ruleTip": "Bị động Hiện tại đơn: am/is/are + V3/ed."
    },
    {
        "id": "140_3",
        "questionName": "Question 3",
        "questionText": "<p>A new suspension bridge ________ across the Red River at the moment.</p>",
        "choices": [
            {"id": "140_3_1", "text": "is being built", "html": "is being built"},
            {"id": "140_3_2", "text": "is building", "html": "is building"},
            {"id": "140_3_3", "text": "was built", "html": "was built"},
            {"id": "140_3_4", "text": "has been built", "html": "has been built"}
        ],
        "correctChoiceId": "140_3_1",
        "explanation": "<p>Bị động thì Hiện tại tiếp diễn có dấu hiệu 'at the moment': <strong>am/is/are + BEING + V3/ed (is being built)</strong>.</p>",
        "ruleTip": "Bị động Hiện tại tiếp diễn: am/is/are + BEING + V3/ed."
    },
    {
        "id": "140_4",
        "questionName": "Question 4",
        "questionText": "<p>Thousands of reference books ________ to rural mountainous schools since last month.</p>",
        "choices": [
            {"id": "140_4_1", "text": "have been donated", "html": "have been donated"},
            {"id": "140_4_2", "text": "has been donated", "html": "has been donated"},
            {"id": "140_4_3", "text": "were donated", "html": "were donated"},
            {"id": "140_4_4", "text": "donated", "html": "donated"}
        ],
        "correctChoiceId": "140_4_1",
        "explanation": "<p>Bị động thì Hiện tại hoàn thành với 'since last month': <strong>have/has + BEEN + V3/ed</strong>. 'Thousands of books' số nhiều dùng <strong>have been donated</strong>.</p>",
        "ruleTip": "Bị động Hiện tại hoàn thành: have/has + BEEN + V3/ed."
    },
    {
        "id": "140_5",
        "questionName": "Question 5",
        "questionText": "<p>Standard protective helmets must ________ by all motorcyclists on public roads.</p>",
        "choices": [
            {"id": "140_5_1", "text": "be worn", "html": "be worn"},
            {"id": "140_5_2", "text": "wear", "html": "wear"},
            {"id": "140_5_3", "text": "be wearing", "html": "be wearing"},
            {"id": "140_5_4", "text": "been worn", "html": "been worn"}
        ],
        "correctChoiceId": "140_5_1",
        "explanation": "<p>Bị động với động từ khuyết thiếu (modal verb): <strong>modal + BE + V3/ed (must be worn)</strong>.</p>",
        "ruleTip": "Bị động với Modal Verb (must/can/should): modal + BE + V3/ed."
    },
    {
        "id": "140_6",
        "questionName": "Question 6",
        "questionText": "<p>My sister went to the hair salon yesterday to have her hair ________.</p>",
        "choices": [
            {"id": "140_6_1", "text": "cut", "html": "cut"},
            {"id": "140_6_2", "text": "to cut", "html": "to cut"},
            {"id": "140_6_3", "text": "cutting", "html": "cutting"},
            {"id": "140_6_4", "text": "was cut", "html": "was cut"}
        ],
        "correctChoiceId": "140_6_1",
        "explanation": "<p>Thể nhờ vả, sai khiến (Causative Form): <strong>have + vật + V3/ed</strong>. Động từ 'cut' có 3 dạng là cut - cut - cut: chọn <strong>cut</strong>.</p>",
        "ruleTip": "Thể nhờ vả: 'Have / Get + vật + V3/ed' (cut - cut - cut)."
    },
    {
        "id": "140_7",
        "questionName": "Question 7",
        "questionText": "<p>________ that Ha Long Bay is one of the most magnificent natural wonders in the world.</p>",
        "choices": [
            {"id": "140_7_1", "text": "It is believed", "html": "It is believed"},
            {"id": "140_7_2", "text": "It believes", "html": "It believes"},
            {"id": "140_7_3", "text": "People are believed", "html": "People are believed"},
            {"id": "140_7_4", "text": "That is believed", "html": "That is believed"}
        ],
        "correctChoiceId": "140_7_1",
        "explanation": "<p>Bị động khách quan với chủ ngữ giả: <strong>It is + V3/ed (said/believed/reported) + that + S + V</strong>.</p>",
        "ruleTip": "Bị động khách quan: 'It is + V3/ed (said/believed/reported) + that + S + V'."
    },
    {
        "id": "140_8",
        "questionName": "Question 8",
        "questionText": "<p>The young athlete is reported ________ the national swimming record yesterday.</p>",
        "choices": [
            {"id": "140_8_1", "text": "to have broken", "html": "to have broken"},
            {"id": "140_8_2", "text": "to break", "html": "to break"},
            {"id": "140_8_3", "text": "breaking", "html": "breaking"},
            {"id": "140_8_4", "text": "broke", "html": "broke"}
        ],
        "correctChoiceId": "140_8_1",
        "explanation": "<p>Hành động phá kỷ lục xảy ra hôm qua ('yesterday') trước thời điểm tường thuật ('is reported'): dùng <strong>to have + V3/ed (to have broken)</strong>.</p>",
        "ruleTip": "Hành động xảy ra trước thì ở mệnh đề chính: 'is reported + TO HAVE + V3/ed'."
    },
    {
        "id": "140_9",
        "questionName": "Question 9",
        "questionText": "<p>Someone stole my bicycle last night. -> My bicycle ________ last night.</p>",
        "choices": [
            {"id": "140_9_1", "text": "was stolen", "html": "was stolen"},
            {"id": "140_9_2", "text": "stole", "html": "stole"},
            {"id": "140_9_3", "text": "was stolen by someone", "html": "was stolen by someone"},
            {"id": "140_9_4", "text": "has been stolen", "html": "has been stolen"}
        ],
        "correctChoiceId": "140_9_1",
        "explanation": "<p>Chuyển sang bị động Quá khứ đơn: <strong>was stolen</strong>. Tác nhân 'by someone' luôn được lược bỏ trong câu bị động.</p>",
        "ruleTip": "Lược bỏ 'by someone, by people, by them' khi chủ thể không quan trọng hoặc không rõ."
    },
    {
        "id": "140_10",
        "questionName": "Question 10",
        "questionText": "<p>A bunch of fresh flowers ________ to our teacher on Vietnamese Teachers' Day.</p>",
        "choices": [
            {"id": "140_10_1", "text": "was given", "html": "was given"},
            {"id": "140_10_2", "text": "gave", "html": "gave"},
            {"id": "140_10_3", "text": "were given", "html": "were given"},
            {"id": "140_10_4", "text": "is giving", "html": "is giving"}
        ],
        "correctChoiceId": "140_10_1",
        "explanation": "<p>Chủ ngữ chỉ vật 'A bunch of fresh flowers' số ít (tính theo 'a bunch'): bị động quá khứ đơn là <strong>was given + TO + O</strong>.</p>",
        "ruleTip": "Đưa tân ngữ chỉ vật lên đầu: S(vật) + be + V3 + TO + O(người)."
    },
    {
        "id": "140_11",
        "questionName": "Question 11",
        "questionText": "<p>The championship trophy ________ to the winner at the closing ceremony tomorrow.</p>",
        "choices": [
            {"id": "140_11_1", "text": "will be presented", "html": "will be presented"},
            {"id": "140_11_2", "text": "will present", "html": "will present"},
            {"id": "140_11_3", "text": "is presented", "html": "is presented"},
            {"id": "140_11_4", "text": "was presented", "html": "was presented"}
        ],
        "correctChoiceId": "140_11_1",
        "explanation": "<p>Bị động thì Tương lai đơn có trạng từ 'tomorrow': <strong>will be + V3/ed (will be presented)</strong>.</p>",
        "ruleTip": "Bị động Tương lai đơn: will be + V3/ed."
    },
    {
        "id": "140_12",
        "questionName": "Question 12",
        "questionText": "<p>The accident victim ________ to the hospital when the ambulance broke down.</p>",
        "choices": [
            {"id": "140_12_1", "text": "was being taken", "html": "was being taken"},
            {"id": "140_12_2", "text": "was taken", "html": "was taken"},
            {"id": "140_12_3", "text": "is being taken", "html": "is being taken"},
            {"id": "140_12_4", "text": "had taken", "html": "had taken"}
        ],
        "correctChoiceId": "140_12_1",
        "explanation": "<p>Bị động Quá khứ tiếp diễn (đang được chở tới viện thì xe hỏng): <strong>was/were + BEING + V3/ed (was being taken)</strong>.</p>",
        "ruleTip": "Bị động Quá khứ tiếp diễn: was/were + BEING + V3/ed."
    },
    {
        "id": "140_13",
        "questionName": "Question 13",
        "questionText": "<p>Your computer is extremely slow. It needs ________ immediately.</p>",
        "choices": [
            {"id": "140_13_1", "text": "cleaning", "html": "cleaning"},
            {"id": "140_13_2", "text": "clean", "html": "clean"},
            {"id": "140_13_3", "text": "to clean", "html": "to clean"},
            {"id": "140_13_4", "text": "cleaned", "html": "cleaned"}
        ],
        "correctChoiceId": "140_13_1",
        "explanation": "<p>Cấu trúc: <strong>S(vật) + need + V-ing</strong> mang nghĩa bị động (= need to be cleaned): chọn <strong>cleaning</strong>.</p>",
        "ruleTip": "'Need + V-ing' mang nghĩa bị động (= need to be + V3/ed)."
    },
    {
        "id": "140_14",
        "questionName": "Question 14",
        "questionText": "<p>They have cleaned all the classroom windows. -> All the classroom windows ________.</p>",
        "choices": [
            {"id": "140_14_1", "text": "have been cleaned", "html": "have been cleaned"},
            {"id": "140_14_2", "text": "has been cleaned", "html": "has been cleaned"},
            {"id": "140_14_3", "text": "were cleaned", "html": "were cleaned"},
            {"id": "140_14_4", "text": "are cleaned", "html": "are cleaned"}
        ],
        "correctChoiceId": "140_14_1",
        "explanation": "<p>Tân ngữ 'All the classroom windows' số nhiều: chuyển sang bị động Hiện tại hoàn thành dùng <strong>have been cleaned</strong>.</p>",
        "ruleTip": "Tân ngữ 'the windows' số nhiều: have been cleaned."
    },
    {
        "id": "140_15",
        "questionName": "Question 15",
        "questionText": "<p>He got his old bicycle ________ at the local repair shop yesterday.</p>",
        "choices": [
            {"id": "140_15_1", "text": "repaired", "html": "repaired"},
            {"id": "140_15_2", "text": "repair", "html": "repair"},
            {"id": "140_15_3", "text": "to repair", "html": "to repair"},
            {"id": "140_15_4", "text": "repairing", "html": "repairing"}
        ],
        "correctChoiceId": "140_15_1",
        "explanation": "<p>Thể nhờ vả với Get: <strong>Get + vật + V3/ed (got his bicycle repaired)</strong>.</p>",
        "ruleTip": "'Get + sth + V3/ed': nhờ/thuê ai sửa xe."
    }
]

theory140 = {
    "topicId": 140,
    "topicName": "Thể bị động",
    "englishName": "Passive Voice",
    "rules": [
        {
            "rule": "Công thức chung của câu bị động: Tân ngữ chuyển thành Chủ ngữ, động từ biến thành BE + V3/ed.",
            "formula": "S + be + V3/ed (+ by O)",
            "examples": "A new school was built in this village last year."
        },
        {
            "rule": "Bảng biến đổi bị động theo các thì:",
            "formula": "HTĐ: am/is/are + V3 // QKĐ: was/were + V3 // HTTD: am/is/are + being + V3 // HTHHT: have/has + been + V3 // TLĐ: will be + V3 // Modals: can/must/should + be + V3",
            "examples": "The bridge is being repaired. / Homework must be submitted on time."
        },
        {
            "rule": "Thể nhờ vả, sai khiến (Causative Form):",
            "formula": "Have sth done / Get sth done (Nhờ ai làm gì đó cho mình)",
            "examples": "I had my car washed yesterday. (= Someone washed my car for me.)"
        },
        {
            "rule": "Bị động với động từ chỉ quan điểm, ý kiến (People say/believe that S + V...):",
            "formula": "Cách 1: It is said that + S + V... // Cách 2: S + is/are said + to V-inf (cùng thì) / to have V3/ed (trước thì)",
            "examples": "It is reported that the storm has passed. / He is said to be a talented doctor."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 168: Câu hỏi đuôi (15 questions)
# -------------------------------------------------------------
q168 = [
    {
        "id": "168_1",
        "questionName": "Question 1",
        "questionText": "<p>Your brother goes to school by bicycle every day, ________?</p>",
        "choices": [
            {"id": "168_1_1", "text": "is he", "html": "is he"},
            {"id": "168_1_2", "text": "does he", "html": "does he"},
            {"id": "168_1_3", "text": "doesn't he", "html": "doesn't he"},
            {"id": "168_1_4", "text": "isn't he", "html": "isn't he"}
        ],
        "correctChoiceId": "168_1_3",
        "explanation": "<p>Mệnh đề chính khẳng định ở thì Hiện tại đơn với động từ thường 'goes' và chủ ngữ 'Your brother' (he): trợ động từ ở đuôi phải là phủ định <strong>doesn't he</strong>.</p>",
        "ruleTip": "Mệnh đề chính dùng thì Hiện tại đơn khẳng định: trợ động từ ở đuôi là 'doesn't he'."
    },
    {
        "id": "168_2",
        "questionName": "Question 2",
        "questionText": "<p>Let's go for a picnic in the park this weekend, ________?</p>",
        "choices": [
            {"id": "168_2_1", "text": "shall we", "html": "shall we"},
            {"id": "168_2_2", "text": "will you", "html": "will you"},
            {"id": "168_2_3", "text": "do we", "html": "do we"},
            {"id": "168_2_4", "text": "don't we", "html": "don't we"}
        ],
        "correctChoiceId": "168_2_1",
        "explanation": "<p>Với câu đề nghị bắt đầu bằng <strong>Let's</strong>, câu hỏi đuôi luôn luôn là <strong>shall we</strong>.</p>",
        "ruleTip": "Với câu đề nghị bắt đầu bằng 'Let's': câu hỏi đuôi luôn là 'shall we?'."
    },
    {
        "id": "168_3",
        "questionName": "Question 3",
        "questionText": "<p>I am invited to Mary's birthday party tonight, ________?</p>",
        "choices": [
            {"id": "168_3_1", "text": "aren't I", "html": "aren't I"},
            {"id": "168_3_2", "text": "am not I", "html": "am not I"},
            {"id": "168_3_3", "text": "amn't I", "html": "amn't I"},
            {"id": "168_3_4", "text": "isn't I", "html": "isn't I"}
        ],
        "correctChoiceId": "168_3_1",
        "explanation": "<p>Trường hợp đặc biệt: Mệnh đề chính bắt đầu bằng <strong>'I am'</strong> thì câu hỏi đuôi luôn là <strong>aren't I</strong>.</p>",
        "ruleTip": "Với mệnh đề 'I am...': câu hỏi đuôi luôn là 'aren't I?'."
    },
    {
        "id": "168_4",
        "questionName": "Question 4",
        "questionText": "<p>Lan never eats seafood because of her severe allergy, ________?</p>",
        "choices": [
            {"id": "168_4_1", "text": "does she", "html": "does she"},
            {"id": "168_4_2", "text": "doesn't she", "html": "doesn't she"},
            {"id": "168_4_3", "text": "is she", "html": "is she"},
            {"id": "168_4_4", "text": "isn't she", "html": "isn't she"}
        ],
        "correctChoiceId": "168_4_1",
        "explanation": "<p>Mệnh đề chính chứa từ mang nghĩa phủ định <strong>'never'</strong> nên vế đuôi phải ở dạng khẳng định: <strong>does she</strong>.</p>",
        "ruleTip": "Câu có từ phủ định 'never': câu hỏi đuôi phải ở dạng KHẲNG ĐỊNH ('does she')."
    },
    {
        "id": "168_5",
        "questionName": "Question 5",
        "questionText": "<p>Nobody attended the extra English class yesterday morning, ________?</p>",
        "choices": [
            {"id": "168_5_1", "text": "did they", "html": "did they"},
            {"id": "168_5_2", "text": "didn't they", "html": "didn't they"},
            {"id": "168_5_3", "text": "did he", "html": "did he"},
            {"id": "168_5_4", "text": "didn't he", "html": "didn't he"}
        ],
        "correctChoiceId": "168_5_1",
        "explanation": "<p><strong>'Nobody'</strong> là từ phủ định và đại từ thay thế ở đuôi là <strong>they</strong>: câu hỏi đuôi ở dạng khẳng định <strong>did they</strong>.</p>",
        "ruleTip": "'Nobody' mang nghĩa phủ định và đại từ thay thế là 'they': đuôi là 'did they?'."
    },
    {
        "id": "168_6",
        "questionName": "Question 6",
        "questionText": "<p>Nothing is impossible if you try your best, ________?</p>",
        "choices": [
            {"id": "168_6_1", "text": "is it", "html": "is it"},
            {"id": "168_6_2", "text": "isn't it", "html": "isn't it"},
            {"id": "168_6_3", "text": "are they", "html": "are they"},
            {"id": "168_6_4", "text": "aren't they", "html": "aren't they"}
        ],
        "correctChoiceId": "168_6_1",
        "explanation": "<p><strong>'Nothing'</strong> mang nghĩa phủ định và đại từ thay thế là <strong>it</strong>: câu hỏi đuôi ở dạng khẳng định <strong>is it</strong>.</p>",
        "ruleTip": "'Nothing' mang nghĩa phủ định và đại từ thay thế là 'it': đuôi là 'is it?'."
    },
    {
        "id": "168_7",
        "questionName": "Question 7",
        "questionText": "<p>Turn down the volume, ________? I'm studying for my entrance exam.</p>",
        "choices": [
            {"id": "168_7_1", "text": "will you", "html": "will you"},
            {"id": "168_7_2", "text": "do you", "html": "do you"},
            {"id": "168_7_3", "text": "don't you", "html": "don't you"},
            {"id": "168_7_4", "text": "won't you", "html": "won't you"}
        ],
        "correctChoiceId": "168_7_1",
        "explanation": "<p>Câu mệnh lệnh khẳng định hoặc phủ định có câu hỏi đuôi luôn là <strong>will you</strong>.</p>",
        "ruleTip": "Câu mệnh lệnh (khẳng định hoặc phủ định): câu hỏi đuôi luôn là 'will you?'."
    },
    {
        "id": "168_8",
        "questionName": "Question 8",
        "questionText": "<p>We haven't met each other for a long time, ________?</p>",
        "choices": [
            {"id": "168_8_1", "text": "have we", "html": "have we"},
            {"id": "168_8_2", "text": "haven't we", "html": "haven't we"},
            {"id": "168_8_3", "text": "do we", "html": "do we"},
            {"id": "168_8_4", "text": "did we", "html": "did we"}
        ],
        "correctChoiceId": "168_8_1",
        "explanation": "<p>Mệnh đề chính phủ định (haven't met): trợ động từ ở câu hỏi đuôi phải ở dạng khẳng định <strong>have we</strong>.</p>",
        "ruleTip": "Mệnh đề chính phủ định (haven't): câu hỏi đuôi khẳng định ('have we?')."
    },
    {
        "id": "168_9",
        "questionName": "Question 9",
        "questionText": "<p>Little children can easily learn a new foreign language, ________?</p>",
        "choices": [
            {"id": "168_9_1", "text": "can't they", "html": "can't they"},
            {"id": "168_9_2", "text": "can they", "html": "can they"},
            {"id": "168_9_3", "text": "don't they", "html": "don't they"},
            {"id": "168_9_4", "text": "aren't they", "html": "aren't they"}
        ],
        "correctChoiceId": "168_9_1",
        "explanation": "<p>Mệnh đề chính khẳng định dùng modal verb 'can' và chủ ngữ số nhiều 'Little children' (they): đuôi phủ định là <strong>can't they</strong>.</p>",
        "ruleTip": "Mệnh đề dùng modal 'can': đuôi phủ định là 'can't they?'."
    },
    {
        "id": "168_10",
        "questionName": "Question 10",
        "questionText": "<p>I think he will pass the high school entrance examination, ________?</p>",
        "choices": [
            {"id": "168_10_1", "text": "won't he", "html": "won't he"},
            {"id": "168_10_2", "text": "don't I", "html": "don't I"},
            {"id": "168_10_3", "text": "will he", "html": "will he"},
            {"id": "168_10_4", "text": "does he", "html": "does he"}
        ],
        "correctChoiceId": "168_10_1",
        "explanation": "<p>Với cấu trúc <strong>'I think that + S + V'</strong>, câu hỏi đuôi thành lập theo mệnh đề phụ (he will pass -> <strong>won't he</strong>).</p>",
        "ruleTip": "Với 'I think that + S + V': câu hỏi đuôi hỏi theo mệnh đề phụ ('won't he?')."
    },
    {
        "id": "168_11",
        "questionName": "Question 11",
        "questionText": "<p>I don't think she likes spicy Thai food, ________?</p>",
        "choices": [
            {"id": "168_11_1", "text": "does she", "html": "does she"},
            {"id": "168_11_2", "text": "doesn't she", "html": "doesn't she"},
            {"id": "168_11_3", "text": "do I", "html": "do I"},
            {"id": "168_11_4", "text": "don't I", "html": "don't I"}
        ],
        "correctChoiceId": "168_11_1",
        "explanation": "<p>Cấu trúc <strong>'I don't think + S + V'</strong> chuyển nghĩa phủ định sang mệnh đề sau: đuôi phải ở dạng khẳng định: <strong>does she</strong>.</p>",
        "ruleTip": "'I don't think' mang tính phủ định toàn câu: đuôi hỏi khẳng định ('does she?')."
    },
    {
        "id": "168_12",
        "questionName": "Question 12",
        "questionText": "<p>The injured old man could hardly walk without assistance, ________?</p>",
        "choices": [
            {"id": "168_12_1", "text": "could he", "html": "could he"},
            {"id": "168_12_2", "text": "couldn't he", "html": "couldn't he"},
            {"id": "168_12_3", "text": "did he", "html": "did he"},
            {"id": "168_12_4", "text": "didn't he", "html": "didn't he"}
        ],
        "correctChoiceId": "168_12_1",
        "explanation": "<p><strong>'Hardly'</strong> (hầu như không) là từ bán phủ định: câu hỏi đuôi phải ở dạng khẳng định: <strong>could he</strong>.</p>",
        "ruleTip": "'Hardly' mang nghĩa phủ định: câu hỏi đuôi ở dạng khẳng định ('could he?')."
    },
    {
        "id": "168_13",
        "questionName": "Question 13",
        "questionText": "<p>Everyone was satisfied with the final competition results, ________?</p>",
        "choices": [
            {"id": "168_13_1", "text": "weren't they", "html": "weren't they"},
            {"id": "168_13_2", "text": "wasn't he", "html": "wasn't he"},
            {"id": "168_13_3", "text": "wasn't it", "html": "wasn't it"},
            {"id": "168_13_4", "text": "were they", "html": "were they"}
        ],
        "correctChoiceId": "168_13_1",
        "explanation": "<p>Chủ ngữ <strong>'Everyone'</strong> khi chuyển sang câu hỏi đuôi dùng đại từ <strong>they</strong>, do đó to be phải biến đổi tương ứng thành số nhiều: <strong>weren't they</strong>.</p>",
        "ruleTip": "'Everyone' đại từ ở đuôi là 'they': 'was' phải đổi thành 'weren't they?'."
    },
    {
        "id": "168_14",
        "questionName": "Question 14",
        "questionText": "<p>Your father used to work for a multinational company in Hanoi, ________?</p>",
        "choices": [
            {"id": "168_14_1", "text": "didn't he", "html": "didn't he"},
            {"id": "168_14_2", "text": "usedn't he", "html": "usedn't he"},
            {"id": "168_14_3", "text": "wasn't he", "html": "wasn't he"},
            {"id": "168_14_4", "text": "doesn't he", "html": "doesn't he"}
        ],
        "correctChoiceId": "168_14_1",
        "explanation": "<p>Mệnh đề có 'used to' là thì Quá khứ đơn: trợ động từ ở câu hỏi đuôi là <strong>didn't he</strong>.</p>",
        "ruleTip": "'Used to' thuộc thì Quá khứ đơn: trợ động từ ở đuôi là 'didn't he?'."
    },
    {
        "id": "168_15",
        "questionName": "Question 15",
        "questionText": "<p>That was a very wonderful musical performance, ________?</p>",
        "choices": [
            {"id": "168_15_1", "text": "wasn't it", "html": "wasn't it"},
            {"id": "168_15_2", "text": "wasn't that", "html": "wasn't that"},
            {"id": "168_15_3", "text": "is it", "html": "is it"},
            {"id": "168_15_4", "text": "was it", "html": "was it"}
        ],
        "correctChoiceId": "168_15_1",
        "explanation": "<p>Chủ ngữ là đại từ chỉ định <strong>'That'</strong>: đại từ tương ứng ở câu hỏi đuôi là <strong>it</strong>. Chọn <strong>wasn't it</strong>.</p>",
        "ruleTip": "Chủ ngữ là 'This/That': đại từ thay thế ở câu hỏi đuôi là 'it'."
    }
]

theory168 = {
    "topicId": 168,
    "topicName": "Câu hỏi đuôi",
    "englishName": "Tag Questions",
    "rules": [
        {
            "rule": "Nguyên tắc chung: Mệnh đề khẳng định đi với đuôi phủ định; Mệnh đề phủ định đi với đuôi khẳng định.",
            "formula": "S + V(khẳng định), trợ động từ(phủ định) + đại từ? // S + V(phủ định), trợ động từ(khẳng định) + đại từ?",
            "examples": "She is a teacher, isn't she? / They don't like spicy food, do they?"
        },
        {
            "rule": "Trường hợp đặc biệt với 'I am' và 'Let's':",
            "formula": "I am... -> aren't I? // Let's + V... -> shall we?",
            "examples": "I am late for the meeting, aren't I? / Let's go swimming, shall we?"
        },
        {
            "rule": "Câu mệnh lệnh:",
            "formula": "V / Don't + V... -> will you?",
            "examples": "Open the door, will you? / Don't make noise, will you?"
        },
        {
            "rule": "Mệnh đề chứa từ bán phủ định (never, seldom, hardly, rarely, little, few):",
            "formula": "Mệnh đề được coi là PHỦ ĐỊNH -> Đuôi phải ở dạng KHẲNG ĐỊNH.",
            "examples": "He never goes to school late, does he? / She can hardly hear, can she?"
        },
        {
            "rule": "Chủ ngữ là đại từ bất định:",
            "formula": "everyone, somebody, nobody, no one -> dùng 'THEY' ở đuôi // everything, nothing, something -> dùng 'IT' ở đuôi",
            "examples": "Nobody called me, did they? / Nothing was stolen, was it?"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 551: Mệnh đề quan hệ (15 questions)
# -------------------------------------------------------------
q551 = [
    {
        "id": "551_1",
        "questionName": "Question 1",
        "questionText": "<p>The girl ________ won the first prize in the English speaking contest is my classmate.</p>",
        "choices": [
            {"id": "551_1_1", "text": "which", "html": "which"},
            {"id": "551_1_2", "text": "who", "html": "who"},
            {"id": "551_1_3", "text": "whom", "html": "whom"},
            {"id": "551_1_4", "text": "whose", "html": "whose"}
        ],
        "correctChoiceId": "551_1_2",
        "explanation": "<p>'The girl' là danh từ chỉ người, đứng trước động từ 'won' làm chủ ngữ trong mệnh đề quan hệ nên ta dùng <strong>who</strong>.</p>",
        "ruleTip": "'The girl' chỉ người, đứng trước động từ 'won' làm chủ ngữ: dùng WHO."
    },
    {
        "id": "551_2",
        "questionName": "Question 2",
        "questionText": "<p>Ha Long Bay, ________ is in Quang Ninh province, attracts millions of international visitors every year.</p>",
        "choices": [
            {"id": "551_2_1", "text": "which", "html": "which"},
            {"id": "551_2_2", "text": "that", "html": "that"},
            {"id": "551_2_3", "text": "where", "html": "where"},
            {"id": "551_2_4", "text": "who", "html": "who"}
        ],
        "correctChoiceId": "551_2_1",
        "explanation": "<p>Sau dấu phẩy (mệnh đề quan hệ không xác định), bổ nghĩa cho danh từ chỉ vật/địa danh: dùng <strong>which</strong> (tuyệt đối KHÔNG dùng that sau dấu phẩy).</p>",
        "ruleTip": "Sau dấu phẩy (mệnh đề không xác định) bổ nghĩa cho vật/nơi chốn: dùng WHICH, KHÔNG dùng that."
    },
    {
        "id": "551_3",
        "questionName": "Question 3",
        "questionText": "<p>Do you know the boy ________ bicycle was stolen outside the supermarket yesterday?</p>",
        "choices": [
            {"id": "551_3_1", "text": "whose", "html": "whose"},
            {"id": "551_3_2", "text": "who", "html": "who"},
            {"id": "551_3_3", "text": "whom", "html": "whom"},
            {"id": "551_3_4", "text": "which", "html": "which"}
        ],
        "correctChoiceId": "551_3_1",
        "explanation": "<p>Chỉ quan hệ sở hữu ('chiếc xe đạp của cậu bé'): dùng đại từ quan hệ sở hữu <strong>whose + Noun (whose bicycle)</strong>.</p>",
        "ruleTip": "'Whose + danh từ' chỉ sự sở hữu: the boy whose bicycle (xe đạp của cậu bé)."
    },
    {
        "id": "551_4",
        "questionName": "Question 4",
        "questionText": "<p>The teacher with ________ we spoke during the break is very knowledgeable.</p>",
        "choices": [
            {"id": "551_4_1", "text": "whom", "html": "whom"},
            {"id": "551_4_2", "text": "who", "html": "who"},
            {"id": "551_4_3", "text": "that", "html": "that"},
            {"id": "551_4_4", "text": "which", "html": "which"}
        ],
        "correctChoiceId": "551_4_1",
        "explanation": "<p>Đứng ngay sau giới từ chỉ người ('with'): bắt buộc dùng <strong>whom</strong> (không dùng who hoặc that sau giới từ).</p>",
        "ruleTip": "Đứng ngay sau giới từ chỉ người (with, to, about): BẮT BUỘC dùng WHOM (không dùng who/that)."
    },
    {
        "id": "551_5",
        "questionName": "Question 5",
        "questionText": "<p>The ancient pagoda ________ in the 11th century has been carefully restored.</p>",
        "choices": [
            {"id": "551_5_1", "text": "built", "html": "built"},
            {"id": "551_5_2", "text": "building", "html": "building"},
            {"id": "551_5_3", "text": "was built", "html": "was built"},
            {"id": "551_5_4", "text": "to build", "html": "to build"}
        ],
        "correctChoiceId": "551_5_1",
        "explanation": "<p>Rút gọn mệnh đề quan hệ dạng bị động (which was built): lược bỏ đại từ và to be, giữ lại <strong>V3/ed: built</strong>.</p>",
        "ruleTip": "Rút gọn mệnh đề quan hệ dạng bị động (which was built): rút thành V3/ed ('built')."
    },
    {
        "id": "551_6",
        "questionName": "Question 6",
        "questionText": "<p>The students ________ in the school library must keep complete silence.</p>",
        "choices": [
            {"id": "551_6_1", "text": "reading", "html": "reading"},
            {"id": "551_6_2", "text": "read", "html": "read"},
            {"id": "551_6_3", "text": "are reading", "html": "are reading"},
            {"id": "551_6_4", "text": "to read", "html": "to read"}
        ],
        "correctChoiceId": "551_6_1",
        "explanation": "<p>Rút gọn mệnh đề quan hệ dạng chủ động (who are reading): lược bỏ đại từ và to be, đưa động từ về <strong>V-ing: reading</strong>.</p>",
        "ruleTip": "Rút gọn mệnh đề quan hệ dạng chủ động (who are reading): rút thành V-ing ('reading')."
    },
    {
        "id": "551_7",
        "questionName": "Question 7",
        "questionText": "<p>Neil Armstrong was the first man ________ on the surface of the Moon in 1969.</p>",
        "choices": [
            {"id": "551_7_1", "text": "to walk", "html": "to walk"},
            {"id": "551_7_2", "text": "walking", "html": "walking"},
            {"id": "551_7_3", "text": "walked", "html": "walked"},
            {"id": "551_7_4", "text": "walks", "html": "walks"}
        ],
        "correctChoiceId": "551_7_1",
        "explanation": "<p>Sau các từ như <strong>the first, the second, the last, the only</strong>, mệnh đề quan hệ được rút gọn bằng <strong>to V-inf: to walk</strong>.</p>",
        "ruleTip": "Sau 'the first / the last / the only / so sánh nhất': rút gọn mệnh đề quan hệ bằng 'TO V-inf'."
    },
    {
        "id": "551_8",
        "questionName": "Question 8",
        "questionText": "<p>This is the primary school ________ I studied when I was a little boy.</p>",
        "choices": [
            {"id": "551_8_1", "text": "where", "html": "where"},
            {"id": "551_8_2", "text": "which", "html": "which"},
            {"id": "551_8_3", "text": "that", "html": "that"},
            {"id": "551_8_4", "text": "when", "html": "when"}
        ],
        "correctChoiceId": "551_8_1",
        "explanation": "<p>Trạng từ quan hệ chỉ nơi chốn thay thế cho 'at the school': dùng <strong>where</strong>.</p>",
        "ruleTip": "'Where' thay thế cho trạng từ nơi chốn (= in/at which)."
    },
    {
        "id": "551_9",
        "questionName": "Question 9",
        "questionText": "<p>I will never forget the unforgettable day ________ I first received my admission letter.</p>",
        "choices": [
            {"id": "551_9_1", "text": "when", "html": "when"},
            {"id": "551_9_2", "text": "where", "html": "where"},
            {"id": "551_9_3", "text": "which", "html": "which"},
            {"id": "551_9_4", "text": "why", "html": "why"}
        ],
        "correctChoiceId": "551_9_1",
        "explanation": "<p>Trạng từ quan hệ chỉ thời gian thay thế cho 'on that day': dùng <strong>when</strong>.</p>",
        "ruleTip": "'When' thay thế cho thời gian (= on/in which)."
    },
    {
        "id": "551_10",
        "questionName": "Question 10",
        "questionText": "<p>This is the most interesting English book ________ I have ever read in my life.</p>",
        "choices": [
            {"id": "551_10_1", "text": "that", "html": "that"},
            {"id": "551_10_2", "text": "which", "html": "which"},
            {"id": "551_10_3", "text": "who", "html": "who"},
            {"id": "551_10_4", "text": "whom", "html": "whom"}
        ],
        "correctChoiceId": "551_10_1",
        "explanation": "<p>Sau tính từ so sánh nhất ('the most interesting'), đại từ quan hệ bắt buộc ưu tiên dùng là <strong>that</strong>.</p>",
        "ruleTip": "Sau tính từ so sánh nhất (the most interesting): ưu tiên dùng đại từ quan hệ THAT."
    },
    {
        "id": "551_11",
        "questionName": "Question 11",
        "questionText": "<p>The old farmer and his buffalo ________ were working on the field looked exhausted.</p>",
        "choices": [
            {"id": "551_11_1", "text": "that", "html": "that"},
            {"id": "551_11_2", "text": "who", "html": "who"},
            {"id": "551_11_3", "text": "which", "html": "which"},
            {"id": "551_11_4", "text": "whom", "html": "whom"}
        ],
        "correctChoiceId": "551_11_1",
        "explanation": "<p>Khi tiền ngữ gồm cả người và vật ('the old farmer and his buffalo'): bắt buộc phải dùng <strong>that</strong>.</p>",
        "ruleTip": "Tiền ngữ gồm cả người và vật ('the farmer and his buffalo'): BẮT BUỘC dùng THAT."
    },
    {
        "id": "551_12",
        "questionName": "Question 12",
        "questionText": "<p>He passed the entrance examination with high scores, ________ made his parents overjoyed.</p>",
        "choices": [
            {"id": "551_12_1", "text": "which", "html": "which"},
            {"id": "551_12_2", "text": "that", "html": "that"},
            {"id": "551_12_3", "text": "who", "html": "who"},
            {"id": "551_12_4", "text": "what", "html": "what"}
        ],
        "correctChoiceId": "551_12_1",
        "explanation": "<p>Dùng <strong>', which'</strong> đứng sau dấu phẩy để thay thế cho toàn bộ sự việc được diễn đạt ở mệnh đề trước.</p>",
        "ruleTip": ", which... thay thế cho toàn bộ ý của mệnh đề đứng trước dấu phẩy."
    },
    {
        "id": "551_13",
        "questionName": "Question 13",
        "questionText": "<p>The grammar book that she is looking ________ is on the top shelf.</p>",
        "choices": [
            {"id": "551_13_1", "text": "for", "html": "for"},
            {"id": "551_13_2", "text": "at", "html": "at"},
            {"id": "551_13_3", "text": "after", "html": "after"},
            {"id": "551_13_4", "text": "up", "html": "up"}
        ],
        "correctChoiceId": "551_13_1",
        "explanation": "<p>Cụm động từ tìm kiếm là <strong>'look for'</strong>. Khi giới từ để ở cuối mệnh đề thì đại từ 'that' đứng ở đầu: chọn <strong>for</strong>.</p>",
        "ruleTip": "Giới từ đứng cuối mệnh đề quan hệ thì có thể dùng THAT ở đầu."
    },
    {
        "id": "551_14",
        "questionName": "Question 14",
        "questionText": "<p>Could you explain to me the exact reason ________ you arrived late for class?</p>",
        "choices": [
            {"id": "551_14_1", "text": "why", "html": "why"},
            {"id": "551_14_2", "text": "which", "html": "which"},
            {"id": "551_14_3", "text": "where", "html": "where"},
            {"id": "551_14_4", "text": "when", "html": "when"}
        ],
        "correctChoiceId": "551_14_1",
        "explanation": "<p>Sau danh từ chỉ lý do 'the reason': trạng từ quan hệ thích hợp là <strong>why</strong> (= for which).</p>",
        "ruleTip": "The reason + WHY + S + V (= for which)."
    },
    {
        "id": "551_15",
        "questionName": "Question 15",
        "questionText": "<p>Dr. Minh, ________ lives right next door to our house, is a talented surgeon.</p>",
        "choices": [
            {"id": "551_15_1", "text": "who", "html": "who"},
            {"id": "551_15_2", "text": "that", "html": "that"},
            {"id": "551_15_3", "text": "whom", "html": "whom"},
            {"id": "551_15_4", "text": "which", "html": "which"}
        ],
        "correctChoiceId": "551_15_1",
        "explanation": "<p>Tên riêng chỉ người trong mệnh đề quan hệ không xác định (có dấu phẩy): bắt buộc dùng <strong>who</strong> (tuyệt đối không dùng that).</p>",
        "ruleTip": "Tên riêng chỉ người trong mệnh đề có dấu phẩy: dùng WHO (tuyệt đối không dùng that)."
    }
]

theory551 = {
    "topicId": 551,
    "topicName": "Mệnh đề quan hệ",
    "englishName": "Relative Clauses",
    "rules": [
        {
            "rule": "Đại từ quan hệ chỉ người:",
            "formula": "WHO: làm chủ ngữ hoặc tân ngữ (N(người) + WHO + V/S+V) // WHOM: chỉ làm tân ngữ (N(người) + WHOM + S+V)",
            "examples": "The woman who lives next door is a doctor. / The boy whom we met is Nam."
        },
        {
            "rule": "Đại từ quan hệ chỉ vật:",
            "formula": "WHICH: làm chủ ngữ hoặc tân ngữ cho danh từ chỉ vật (N(vật) + WHICH + V/S+V)",
            "examples": "The book which you lent me is fascinating."
        },
        {
            "rule": "Đại từ quan hệ 'THAT': Thay thế cho who, whom, which trong mệnh đề xác định.",
            "formula": "LƯU Ý: KHÔNG dùng 'THAT' sau dấu phẩy (,) và sau giới từ.",
            "examples": "The pen that is on the desk is mine (ĐÚNG). / Mr. Ba, that is my teacher... (SAI)."
        },
        {
            "rule": "Đại từ quan hệ chỉ sự sở hữu 'WHOSE':",
            "formula": "N(người/vật) + WHOSE + Noun",
            "examples": "The girl whose mother is a singer sings very beautifully."
        },
        {
            "rule": "Rút gọn mệnh đề quan hệ:",
            "formula": "Chủ động -> V-ing // Bị động -> V3/ed // Sau the first, last, only, so sánh nhất -> to V-inf",
            "examples": "The man standing there is my uncle. / The bridge built in 1902 is Long Bien Bridge."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 160: Câu tường thuật (15 questions)
# -------------------------------------------------------------
q160 = [
    {
        "id": "160_1",
        "questionName": "Question 1",
        "questionText": "<p>\"I am learning French now,\" Peter said. -> Peter said that he ________ French then.</p>",
        "choices": [
            {"id": "160_1_1", "text": "was learning", "html": "was learning"},
            {"id": "160_1_2", "text": "is learning", "html": "is learning"},
            {"id": "160_1_3", "text": "learned", "html": "learned"},
            {"id": "160_1_4", "text": "had learned", "html": "had learned"}
        ],
        "correctChoiceId": "160_1_1",
        "explanation": "<p>Lùi thì trong câu gián tiếp: Hiện tại tiếp diễn (am learning) lùi thành Quá khứ tiếp diễn: <strong>was learning</strong>; trạng từ 'now' chuyển thành 'then'.</p>",
        "ruleTip": "Lùi thì: am learning -> was learning; đổi trạng từ: now -> then."
    },
    {
        "id": "160_2",
        "questionName": "Question 2",
        "questionText": "<p>\"Where are you going for your holiday?\" Mary asked me. -> Mary asked me ________ for my holiday.</p>",
        "choices": [
            {"id": "160_2_1", "text": "where I was going", "html": "where I was going"},
            {"id": "160_2_2", "text": "where was I going", "html": "where was I going"},
            {"id": "160_2_3", "text": "where I am going", "html": "where I am going"},
            {"id": "160_2_4", "text": "where am I going", "html": "where am I going"}
        ],
        "correctChoiceId": "160_2_1",
        "explanation": "<p>Trong câu hỏi gián tiếp: KHÔNG đảo ngữ, đưa về trật tự khẳng định: <strong>where + S + was going (where I was going)</strong>.</p>",
        "ruleTip": "Câu hỏi gián tiếp: KHÔNG đảo ngữ, đưa về trật tự khẳng định (where + S + was going)."
    },
    {
        "id": "160_3",
        "questionName": "Question 3",
        "questionText": "<p>\"Do you speak English?\" the tourist asked me. -> The tourist asked me if I ________ English.</p>",
        "choices": [
            {"id": "160_3_1", "text": "spoke", "html": "spoke"},
            {"id": "160_3_2", "text": "speak", "html": "speak"},
            {"id": "160_3_3", "text": "had spoken", "html": "had spoken"},
            {"id": "160_3_4", "text": "was speaking", "html": "was speaking"}
        ],
        "correctChoiceId": "160_3_1",
        "explanation": "<p>Câu hỏi Yes/No gián tiếp: dùng <strong>if / whether + S + V(lùi thì)</strong>. Hiện tại đơn 'speak' lùi thành Quá khứ đơn: <strong>spoke</strong>.</p>",
        "ruleTip": "Câu hỏi Yes/No gián tiếp: dùng IF/WHETHER + S + V(lùi thì: spoke)."
    },
    {
        "id": "160_4",
        "questionName": "Question 4",
        "questionText": "<p>\"Don't touch that bare wire!\" the electrician shouted. -> The electrician warned me ________ that bare wire.</p>",
        "choices": [
            {"id": "160_4_1", "text": "not to touch", "html": "not to touch"},
            {"id": "160_4_2", "text": "to not touch", "html": "to not touch"},
            {"id": "160_4_3", "text": "don't touch", "html": "don't touch"},
            {"id": "160_4_4", "text": "not touching", "html": "not touching"}
        ],
        "correctChoiceId": "160_4_1",
        "explanation": "<p>Câu mệnh lệnh phủ định gián tiếp: <strong>tell / ask / warn + O + NOT TO V-inf (not to touch)</strong>.</p>",
        "ruleTip": "Câu mệnh lệnh phủ định gián tiếp: S + warned/told + O + NOT TO V-inf."
    },
    {
        "id": "160_5",
        "questionName": "Question 5",
        "questionText": "<p>\"Why don't we go camping this weekend?\" Nam said. -> Nam suggested ________ camping that weekend.</p>",
        "choices": [
            {"id": "160_5_1", "text": "going", "html": "going"},
            {"id": "160_5_2", "text": "to go", "html": "to go"},
            {"id": "160_5_3", "text": "should go", "html": "should go"},
            {"id": "160_5_4", "text": "go", "html": "go"}
        ],
        "correctChoiceId": "160_5_1",
        "explanation": "<p>Tường thuật câu gợi ý với động từ suggest: <strong>suggest + V-ing (suggested going)</strong>.</p>",
        "ruleTip": "Cấu trúc gợi ý: suggest + V-ing (Nam suggested going camping)."
    },
    {
        "id": "160_6",
        "questionName": "Question 6",
        "questionText": "<p>The doctor suggested that he ________ smoking cigarettes immediately.</p>",
        "choices": [
            {"id": "160_6_1", "text": "should stop", "html": "should stop"},
            {"id": "160_6_2", "text": "stops", "html": "stops"},
            {"id": "160_6_3", "text": "stopped", "html": "stopped"},
            {"id": "160_6_4", "text": "to stop", "html": "to stop"}
        ],
        "correctChoiceId": "160_6_1",
        "explanation": "<p>Cấu trúc giả định với suggest: <strong>suggest that + S + (should) + V-inf (should stop)</strong>.</p>",
        "ruleTip": "Cấu trúc: suggest that + S + (should) + V-inf."
    },
    {
        "id": "160_7",
        "questionName": "Question 7",
        "questionText": "<p>\"Remember to lock the front door before leaving,\" Mom said. -> Mom reminded me ________ the front door.</p>",
        "choices": [
            {"id": "160_7_1", "text": "to lock", "html": "to lock"},
            {"id": "160_7_2", "text": "locking", "html": "locking"},
            {"id": "160_7_3", "text": "lock", "html": "lock"},
            {"id": "160_7_4", "text": "locked", "html": "locked"}
        ],
        "correctChoiceId": "160_7_1",
        "explanation": "<p>Cấu trúc nhắc nhở ai làm gì: <strong>remind sb + TO V-inf (to lock)</strong>.</p>",
        "ruleTip": "'Remind sb to V': nhắc nhở ai làm gì."
    },
    {
        "id": "160_8",
        "questionName": "Question 8",
        "questionText": "<p>\"I will visit my grandmother tomorrow,\" Minh said. -> Minh said that he ________ his grandmother the following day.</p>",
        "choices": [
            {"id": "160_8_1", "text": "would visit", "html": "would visit"},
            {"id": "160_8_2", "text": "will visit", "html": "will visit"},
            {"id": "160_8_3", "text": "visited", "html": "visited"},
            {"id": "160_8_4", "text": "visits", "html": "visits"}
        ],
        "correctChoiceId": "160_8_1",
        "explanation": "<p>Lùi thì: 'will visit' lùi thành <strong>would visit</strong>; 'tomorrow' đổi thành 'the following day'.</p>",
        "ruleTip": "will -> would; my -> his; tomorrow -> the following day / the next day."
    },
    {
        "id": "160_9",
        "questionName": "Question 9",
        "questionText": "<p>\"You must submit the assignment today,\" the teacher said. -> The teacher said that we ________ the assignment that day.</p>",
        "choices": [
            {"id": "160_9_1", "text": "had to submit", "html": "had to submit"},
            {"id": "160_9_2", "text": "must submit", "html": "must submit"},
            {"id": "160_9_3", "text": "would submit", "html": "would submit"},
            {"id": "160_9_4", "text": "have to submit", "html": "have to submit"}
        ],
        "correctChoiceId": "160_9_1",
        "explanation": "<p>Động từ 'must' khi lùi thì trong câu gián tiếp chuyển thành <strong>had to + V-inf (had to submit)</strong>; 'today' chuyển thành 'that day'.</p>",
        "ruleTip": "must lùi thì thành 'had to'; today đổi thành 'that day'."
    },
    {
        "id": "160_10",
        "questionName": "Question 10",
        "questionText": "<p>\"I'm sorry I broke your ceramic vase,\" Tim said to Lan. -> Tim apologized to Lan for ________ her ceramic vase.</p>",
        "choices": [
            {"id": "160_10_1", "text": "breaking", "html": "breaking"},
            {"id": "160_10_2", "text": "to break", "html": "to break"},
            {"id": "160_10_3", "text": "broke", "html": "broke"},
            {"id": "160_10_4", "text": "break", "html": "break"}
        ],
        "correctChoiceId": "160_10_1",
        "explanation": "<p>Cấu trúc xin lỗi ai về điều gì: <strong>apologize to sb for + V-ing (breaking)</strong>.</p>",
        "ruleTip": "'Apologize to sb for + V-ing': xin lỗi ai vì đã làm gì."
    },
    {
        "id": "160_11",
        "questionName": "Question 11",
        "questionText": "<p>\"Thank you for helping me with the project,\" Mai said to Nam. -> Mai thanked Nam for ________ her with the project.</p>",
        "choices": [
            {"id": "160_11_1", "text": "helping", "html": "helping"},
            {"id": "160_11_2", "text": "to help", "html": "to help"},
            {"id": "160_11_3", "text": "helped", "html": "helped"},
            {"id": "160_11_4", "text": "help", "html": "help"}
        ],
        "correctChoiceId": "160_11_1",
        "explanation": "<p>Cấu trúc cảm ơn ai vì đã làm gì: <strong>thank sb for + V-ing (helping)</strong>.</p>",
        "ruleTip": "'Thank sb for + V-ing': cảm ơn ai vì việc gì."
    },
    {
        "id": "160_12",
        "questionName": "Question 12",
        "questionText": "<p>\"Be careful or you will slip on the wet floor,\" he said. -> He warned me ________ on the wet floor.</p>",
        "choices": [
            {"id": "160_12_1", "text": "not to slip", "html": "not to slip"},
            {"id": "160_12_2", "text": "to slip", "html": "to slip"},
            {"id": "160_12_3", "text": "not slipping", "html": "not slipping"},
            {"id": "160_12_4", "text": "don't slip", "html": "don't slip"}
        ],
        "correctChoiceId": "160_12_1",
        "explanation": "<p>Cấu trúc cảnh báo ai không làm gì: <strong>warn sb NOT TO V-inf (not to slip)</strong>.</p>",
        "ruleTip": "'Warn sb not to V': cảnh báo ai không làm gì."
    },
    {
        "id": "160_13",
        "questionName": "Question 13",
        "questionText": "<p>Lan ________ me that she had passed the Grade 10 entrance examination.</p>",
        "choices": [
            {"id": "160_13_1", "text": "told", "html": "told"},
            {"id": "160_13_2", "text": "said", "html": "said"},
            {"id": "160_13_3", "text": "asked", "html": "asked"},
            {"id": "160_13_4", "text": "spoke", "html": "spoke"}
        ],
        "correctChoiceId": "160_13_1",
        "explanation": "<p>Khi có tân ngữ gián tiếp chỉ người ('me'), ta dùng động từ <strong>told (told me that...)</strong>. 'Said' đi với 'that' mà không có tân ngữ trực tiếp theo sau.</p>",
        "ruleTip": "'Told + tân ngữ' (told me); 'Said that' (không có tân ngữ trực tiếp)."
    },
    {
        "id": "160_14",
        "questionName": "Question 14",
        "questionText": "<p>\"Can you lend me your dictionary?\" she asked. -> She asked me if I ________ lend her my dictionary.</p>",
        "choices": [
            {"id": "160_14_1", "text": "could", "html": "could"},
            {"id": "160_14_2", "text": "can", "html": "can"},
            {"id": "160_14_3", "text": "will", "html": "will"},
            {"id": "160_14_4", "text": "would", "html": "would"}
        ],
        "correctChoiceId": "160_14_1",
        "explanation": "<p>Modal verb 'can' khi chuyển sang câu gián tiếp lùi thì thành <strong>could</strong>.</p>",
        "ruleTip": "can lùi thì thành COULD trong câu hỏi gián tiếp."
    },
    {
        "id": "160_15",
        "questionName": "Question 15",
        "questionText": "<p>\"You stole my bicycle!\" the boy shouted. -> The boy accused the man of ________ his bicycle.</p>",
        "choices": [
            {"id": "160_15_1", "text": "stealing", "html": "stealing"},
            {"id": "160_15_2", "text": "to steal", "html": "to steal"},
            {"id": "160_15_3", "text": "stolen", "html": "stolen"},
            {"id": "160_15_4", "text": "steal", "html": "steal"}
        ],
        "correctChoiceId": "160_15_1",
        "explanation": "<p>Cấu trúc buộc tội ai đã làm gì: <strong>accuse sb of + V-ing (stealing)</strong>.</p>",
        "ruleTip": "'Accuse sb of + V-ing': buộc tội ai đã làm gì."
    }
]

theory160 = {
    "topicId": 160,
    "topicName": "Câu tường thuật",
    "englishName": "Reported Speech",
    "rules": [
        {
            "rule": "Quy tắc chung khi chuyển sang câu gián tiếp: Đổi ngôi, Lùi thì, Đổi trạng từ chỉ thời gian và nơi chốn.",
            "formula": "HTĐ -> QKĐ // HTTD -> QKTD // QKĐ/HTHT -> QKHT // will -> would // can -> could // must -> had to",
            "examples": "\"I am tired now,\" she said -> She said that she was tired then."
        },
        {
            "rule": "Câu hỏi gián tiếp: Tuyệt đối KHÔNG đảo ngữ, đưa về trật tự khẳng định (S + V).",
            "formula": "Yes/No: S + asked + (O) + IF / WHETHER + S + V(lùi thì) // Wh-: S + asked + (O) + Wh-word + S + V(lùi thì)",
            "examples": "\"Do you like tea?\" -> He asked me if I liked tea. / \"Where do you live?\" -> She asked where I lived."
        },
        {
            "rule": "Câu mệnh lệnh, yêu cầu gián tiếp:",
            "formula": "S + told / asked + O + (not) TO V-inf",
            "examples": "\"Please turn off the lights,\" the teacher said -> The teacher asked us to turn off the lights."
        },
        {
            "rule": "Cấu trúc với động từ tường thuật đặc biệt SUGGEST:",
            "formula": "suggest + V-ing // suggest that + S + (should) + V-inf",
            "examples": "He suggested going for a walk. / The doctor suggested that she (should) take a rest."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 106: So sánh (15 questions)
# -------------------------------------------------------------
q106 = [
    {
        "id": "106_1",
        "questionName": "Question 1",
        "questionText": "<p>This math problem is ________ than the one we solved yesterday.</p>",
        "choices": [
            {"id": "106_1_1", "text": "more difficult", "html": "more difficult"},
            {"id": "106_1_2", "text": "difficulter", "html": "difficulter"},
            {"id": "106_1_3", "text": "most difficult", "html": "most difficult"},
            {"id": "106_1_4", "text": "as difficult", "html": "as difficult"}
        ],
        "correctChoiceId": "106_1_1",
        "explanation": "<p>'Difficult' là tính từ dài (3 âm tiết): cấu trúc so sánh hơn với 'than' là <strong>more difficult than</strong>.</p>",
        "ruleTip": "Tính từ dài trong so sánh hơn: 'more + adj + than'."
    },
    {
        "id": "106_2",
        "questionName": "Question 2",
        "questionText": "<p>Yesterday was hot, but today is even ________.</p>",
        "choices": [
            {"id": "106_2_1", "text": "hotter", "html": "hotter"},
            {"id": "106_2_2", "text": "hot", "html": "hot"},
            {"id": "106_2_3", "text": "more hot", "html": "more hot"},
            {"id": "106_2_4", "text": "hottest", "html": "hottest"}
        ],
        "correctChoiceId": "106_2_1",
        "explanation": "<p>'Hot' là tính từ ngắn có 1 nguyên âm đứng giữa 2 phụ âm (CVC): gấp đôi phụ âm cuối trước khi thêm -er: <strong>hotter</strong>.</p>",
        "ruleTip": "Tính từ ngắn 1 âm tiết (phụ âm - nguyên âm - phụ âm): gấp đôi phụ âm cuối rồi thêm -er ('hotter')."
    },
    {
        "id": "106_3",
        "questionName": "Question 3",
        "questionText": "<p>His English pronunciation is much ________ than mine.</p>",
        "choices": [
            {"id": "106_3_1", "text": "better", "html": "better"},
            {"id": "106_3_2", "text": "gooder", "html": "gooder"},
            {"id": "106_3_3", "text": "more good", "html": "more good"},
            {"id": "106_3_4", "text": "best", "html": "best"}
        ],
        "correctChoiceId": "106_3_1",
        "explanation": "<p>Tính từ bất quy tắc 'good' có dạng so sánh hơn là <strong>better</strong> (không dùng gooder hay more good).</p>",
        "ruleTip": "Bất quy tắc: 'good' so sánh hơn là 'better' (không dùng gooder/more good)."
    },
    {
        "id": "106_4",
        "questionName": "Question 4",
        "questionText": "<p>The ________ you practice speaking English, the more fluent you will become.</p>",
        "choices": [
            {"id": "106_4_1", "text": "more", "html": "more"},
            {"id": "106_4_2", "text": "most", "html": "most"},
            {"id": "106_4_3", "text": "much", "html": "much"},
            {"id": "106_4_4", "text": "many", "html": "many"}
        ],
        "correctChoiceId": "106_4_1",
        "explanation": "<p>Cấu trúc so sánh kép (Càng... càng...): <strong>The + so sánh hơn..., the + so sánh hơn... (The more you practice..., the more fluent...)</strong>.</p>",
        "ruleTip": "So sánh kép: 'The + so sánh hơn..., the + so sánh hơn...' (Càng... càng...)."
    },
    {
        "id": "106_5",
        "questionName": "Question 5",
        "questionText": "<p>Her younger sister does not sing ________ as she does.</p>",
        "choices": [
            {"id": "106_5_1", "text": "as beautifully", "html": "as beautifully"},
            {"id": "106_5_2", "text": "as beautiful", "html": "as beautiful"},
            {"id": "106_5_3", "text": "more beautifully", "html": "more beautifully"},
            {"id": "106_5_4", "text": "beautifully", "html": "beautifully"}
        ],
        "correctChoiceId": "106_5_1",
        "explanation": "<p>So sánh bằng với động từ thường 'sing': dùng trạng từ <strong>as beautifully as</strong>.</p>",
        "ruleTip": "So sánh bằng với trạng từ: 'as/so + adv + as' (sing là động từ thường nên đi với beautifully)."
    },
    {
        "id": "106_6",
        "questionName": "Question 6",
        "questionText": "<p>Nha Trang is one of the ________ attractive coastal destinations in Vietnam.</p>",
        "choices": [
            {"id": "106_6_1", "text": "most", "html": "most"},
            {"id": "106_6_2", "text": "more", "html": "more"},
            {"id": "106_6_3", "text": "much", "html": "much"},
            {"id": "106_6_4", "text": "as", "html": "as"}
        ],
        "correctChoiceId": "106_6_1",
        "explanation": "<p>Cấu trúc so sánh nhất với 'one of the': <strong>one of the most + adj (the most attractive)</strong>.</p>",
        "ruleTip": "'One of the + most + adj': một trong những... nhất."
    },
    {
        "id": "106_7",
        "questionName": "Question 7",
        "questionText": "<p>Travelling by airplane is ________ faster than travelling by express train.</p>",
        "choices": [
            {"id": "106_7_1", "text": "much", "html": "much"},
            {"id": "106_7_2", "text": "very", "html": "very"},
            {"id": "106_7_3", "text": "more", "html": "more"},
            {"id": "106_7_4", "text": "so", "html": "so"}
        ],
        "correctChoiceId": "106_7_1",
        "explanation": "<p>Dùng <strong>much / far</strong> đứng trước tính từ so sánh hơn để nhấn mạnh mức độ chênh lệch (không dùng very trước so sánh hơn).</p>",
        "ruleTip": "Dùng MUCH hoặc FAR trước tính từ so sánh hơn để nhấn mạnh mức độ chênh lệch."
    },
    {
        "id": "106_8",
        "questionName": "Question 8",
        "questionText": "<p>Because of global warming, summer in our country is getting ________.</p>",
        "choices": [
            {"id": "106_8_1", "text": "hotter and hotter", "html": "hotter and hotter"},
            {"id": "106_8_2", "text": "more and more hot", "html": "more and more hot"},
            {"id": "106_8_3", "text": "hot and hot", "html": "hot and hot"},
            {"id": "106_8_4", "text": "hottest and hottest", "html": "hottest and hottest"}
        ],
        "correctChoiceId": "106_8_1",
        "explanation": "<p>Cấu trúc diễn tả 'càng ngày càng...': với tính từ ngắn dùng <strong>adj-er and adj-er (hotter and hotter)</strong>.</p>",
        "ruleTip": "Càng ngày càng...: 'comparative AND comparative' (hotter and hotter)."
    },
    {
        "id": "106_9",
        "questionName": "Question 9",
        "questionText": "<p>Living in modern big cities is often ________ than living in peaceful rural areas.</p>",
        "choices": [
            {"id": "106_9_1", "text": "noisier", "html": "noisier"},
            {"id": "106_9_2", "text": "more noisy", "html": "more noisy"},
            {"id": "106_9_3", "text": "noisy", "html": "noisy"},
            {"id": "106_9_4", "text": "noisiest", "html": "noisiest"}
        ],
        "correctChoiceId": "106_9_1",
        "explanation": "<p>Tính từ 2 âm tiết tận cùng bằng đuôi -y ('noisy'): đổi -y thành -i rồi thêm -er: <strong>noisier</strong>.</p>",
        "ruleTip": "Tính từ 2 âm tiết tận cùng bằng -y (noisy, happy, heavy): đổi -y thành -ier trong so sánh hơn."
    },
    {
        "id": "106_10",
        "questionName": "Question 10",
        "questionText": "<p>That was the ________ movie I have ever watched; the story was terrible.</p>",
        "choices": [
            {"id": "106_10_1", "text": "worst", "html": "worst"},
            {"id": "106_10_2", "text": "worse", "html": "worse"},
            {"id": "106_10_3", "text": "baddest", "html": "baddest"},
            {"id": "106_10_4", "text": "most bad", "html": "most bad"}
        ],
        "correctChoiceId": "106_10_1",
        "explanation": "<p>Dạng so sánh nhất bất quy tắc của tính từ 'bad' là <strong>the worst</strong>.</p>",
        "ruleTip": "So sánh nhất bất quy tắc của 'bad': the WORST."
    },
    {
        "id": "106_11",
        "questionName": "Question 11",
        "questionText": "<p>For ________ information about the high school entrance exam, please contact the principal.</p>",
        "choices": [
            {"id": "106_11_1", "text": "further", "html": "further"},
            {"id": "106_11_2", "text": "farther", "html": "farther"},
            {"id": "106_11_3", "text": "far", "html": "far"},
            {"id": "106_11_4", "text": "furthest", "html": "furthest"}
        ],
        "correctChoiceId": "106_11_1",
        "explanation": "<p><strong>'Further information'</strong> nghĩa là thông tin thêm, thông tin sâu hơn. 'Farther' chỉ dùng cho khoảng cách vật lý.</p>",
        "ruleTip": "'Further' mang nghĩa sâu hơn, thêm nữa (further information); 'farther' chỉ khoảng cách địa lý."
    },
    {
        "id": "106_12",
        "questionName": "Question 12",
        "questionText": "<p>My favorite hobby is ________ yours; we both enjoy reading detective stories.</p>",
        "choices": [
            {"id": "106_12_1", "text": "the same as", "html": "the same as"},
            {"id": "106_12_2", "text": "same as", "html": "same as"},
            {"id": "106_12_3", "text": "different from", "html": "different from"},
            {"id": "106_12_4", "text": "as similar as", "html": "as similar as"}
        ],
        "correctChoiceId": "106_12_1",
        "explanation": "<p>Cấu trúc so sánh giống nhau: <strong>the same as + N/Pronoun</strong>: chọn <strong>the same as</strong>.</p>",
        "ruleTip": "Cấu trúc so sánh giống nhau: 'the same as'."
    },
    {
        "id": "106_13",
        "questionName": "Question 13",
        "questionText": "<p>This new digital camera is not ________ expensive as I initially thought.</p>",
        "choices": [
            {"id": "106_13_1", "text": "so", "html": "so"},
            {"id": "106_13_2", "text": "such", "html": "such"},
            {"id": "106_13_3", "text": "more", "html": "more"},
            {"id": "106_13_4", "text": "too", "html": "too"}
        ],
        "correctChoiceId": "106_13_1",
        "explanation": "<p>Trong câu phủ định của so sánh bằng, ta có thể dùng <strong>'not so + adj + as'</strong> hoặc 'not as + adj + as'.</p>",
        "ruleTip": "Phủ định so sánh bằng có thể dùng 'not as... as' hoặc 'not so... as'."
    },
    {
        "id": "106_14",
        "questionName": "Question 14",
        "questionText": "<p>The older he gets, the ________ true friends he seems to have.</p>",
        "choices": [
            {"id": "106_14_1", "text": "fewer", "html": "fewer"},
            {"id": "106_14_2", "text": "less", "html": "less"},
            {"id": "106_14_3", "text": "few", "html": "few"},
            {"id": "106_14_4", "text": "least", "html": "least"}
        ],
        "correctChoiceId": "106_14_1",
        "explanation": "<p>Danh từ 'friends' đếm được số nhiều: dạng so sánh hơn đi kèm là <strong>the fewer</strong> (không dùng less cho danh từ đếm được).</p>",
        "ruleTip": "'Few' so sánh hơn là 'fewer' đi với danh từ đếm được số nhiều (fewer friends)."
    },
    {
        "id": "106_15",
        "questionName": "Question 15",
        "questionText": "<p>Among the four athletes in the competition, Nam ran ________.</p>",
        "choices": [
            {"id": "106_15_1", "text": "the fastest", "html": "the fastest"},
            {"id": "106_15_2", "text": "the faster", "html": "the faster"},
            {"id": "106_15_3", "text": "fastest", "html": "fastest"},
            {"id": "106_15_4", "text": "most fast", "html": "most fast"}
        ],
        "correctChoiceId": "106_15_1",
        "explanation": "<p>So sánh nhất giữa 4 người: trạng từ ngắn 'fast' có dạng so sánh nhất là <strong>the fastest</strong>.</p>",
        "ruleTip": "So sánh nhất của trạng từ ngắn: the + adv-est (the fastest)."
    }
]

theory106 = {
    "topicId": 106,
    "topicName": "Các cấu trúc so sánh",
    "englishName": "Comparisons: Equal, Comparative, Superlative & Double",
    "rules": [
        {
            "rule": "So sánh bằng (Equal comparison):",
            "formula": "as + adj/adv + as // Phủ định: not as/so + adj/adv + as",
            "examples": "He is as tall as his brother. / This car is not as expensive as that one."
        },
        {
            "rule": "So sánh hơn (Comparative):",
            "formula": "Ngắn: adj/adv-er + than // Dài: more + adj/adv + than // Bất quy tắc: good -> better, bad -> worse, far -> farther/further",
            "examples": "She runs faster than me. / This book is more interesting than that one."
        },
        {
            "rule": "So sánh nhất (Superlative):",
            "formula": "Ngắn: the + adj/adv-est // Dài: the most + adj/adv // Bất quy tắc: good -> the best, bad -> the worst",
            "examples": "Mount Everest is the highest mountain in the world."
        },
        {
            "rule": "So sánh kép 'Càng... càng...' (Double Comparative):",
            "formula": "The + comparative + S + V, the + comparative + S + V",
            "examples": "The harder you work, the more successful you become."
        },
        {
            "rule": "Từ bổ trợ nhấn mạnh trong so sánh hơn: MUCH, FAR, A LOT.",
            "formula": "much / far + comparative (so sánh hơn)",
            "examples": "Living in the city is much more expensive than living in the countryside."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 150: Giới từ (15 questions)
# -------------------------------------------------------------
q150 = [
    {
        "id": "150_1",
        "questionName": "Question 1",
        "questionText": "<p>President Ho Chi Minh read the Declaration of Independence ________ September 1945.</p>",
        "choices": [
            {"id": "150_1_1", "text": "in", "html": "in"},
            {"id": "150_1_2", "text": "on", "html": "on"},
            {"id": "150_1_3", "text": "at", "html": "at"},
            {"id": "150_1_4", "text": "by", "html": "by"}
        ],
        "correctChoiceId": "150_1_1",
        "explanation": "<p>Giới từ đi với tháng, năm, thế kỷ là <strong>in (in September 1945)</strong>.</p>",
        "ruleTip": "'IN' đi với tháng, năm, mùa, thế kỷ (in September, in 1945)."
    },
    {
        "id": "150_2",
        "questionName": "Question 2",
        "questionText": "<p>The final English entrance examination will take place ________ Monday morning.</p>",
        "choices": [
            {"id": "150_2_1", "text": "on", "html": "on"},
            {"id": "150_2_2", "text": "in", "html": "in"},
            {"id": "150_2_3", "text": "at", "html": "at"},
            {"id": "150_2_4", "text": "to", "html": "to"}
        ],
        "correctChoiceId": "150_2_1",
        "explanation": "<p>Giới từ đi với các thứ trong tuần hoặc buổi của ngày cụ thể là <strong>on (on Monday morning)</strong>.</p>",
        "ruleTip": "'ON' đi với các thứ trong tuần hoặc ngày cụ thể (on Monday morning)."
    },
    {
        "id": "150_3",
        "questionName": "Question 3",
        "questionText": "<p>The school bus always arrives promptly ________ 6:45 every weekday morning.</p>",
        "choices": [
            {"id": "150_3_1", "text": "at", "html": "at"},
            {"id": "150_3_2", "text": "in", "html": "in"},
            {"id": "150_3_3", "text": "on", "html": "on"},
            {"id": "150_3_4", "text": "by", "html": "by"}
        ],
        "correctChoiceId": "150_3_1",
        "explanation": "<p>Giới từ đi với giờ giấc chính xác là <strong>at (at 6:45)</strong>.</p>",
        "ruleTip": "'AT' đi với giờ giấc cụ thể (at 6:45, at 7 o'clock)."
    },
    {
        "id": "150_4",
        "questionName": "Question 4",
        "questionText": "<p>My younger brother is extremely interested ________ learning computer programming.</p>",
        "choices": [
            {"id": "150_4_1", "text": "in", "html": "in"},
            {"id": "150_4_2", "text": "on", "html": "on"},
            {"id": "150_4_3", "text": "at", "html": "at"},
            {"id": "150_4_4", "text": "with", "html": "with"}
        ],
        "correctChoiceId": "150_4_1",
        "explanation": "<p>Cụm tính từ cố định: <strong>be interested in + V-ing/N (thích, quan tâm đến cái gì)</strong>.</p>",
        "ruleTip": "Cấu trúc: 'be interested IN + V-ing/N' (hứng thú, quan tâm đến cái gì)."
    },
    {
        "id": "150_5",
        "questionName": "Question 5",
        "questionText": "<p>Most teenagers in our class are very fond ________ listening to pop music.</p>",
        "choices": [
            {"id": "150_5_1", "text": "of", "html": "of"},
            {"id": "150_5_2", "text": "with", "html": "with"},
            {"id": "150_5_3", "text": "in", "html": "in"},
            {"id": "150_5_4", "text": "about", "html": "about"}
        ],
        "correctChoiceId": "150_5_1",
        "explanation": "<p>Cụm tính từ cố định: <strong>be fond of + V-ing/N (yêu thích cái gì)</strong>.</p>",
        "ruleTip": "Cấu trúc: 'be fond OF + V-ing/N' (yêu thích cái gì)."
    },
    {
        "id": "150_6",
        "questionName": "Question 6",
        "questionText": "<p>Lan is exceptionally good ________ solving difficult mathematics equations.</p>",
        "choices": [
            {"id": "150_6_1", "text": "at", "html": "at"},
            {"id": "150_6_2", "text": "in", "html": "in"},
            {"id": "150_6_3", "text": "on", "html": "on"},
            {"id": "150_6_4", "text": "for", "html": "for"}
        ],
        "correctChoiceId": "150_6_1",
        "explanation": "<p>Cụm tính từ chỉ sự giỏi giang trong một lĩnh vực: <strong>be good at + V-ing/N</strong>.</p>",
        "ruleTip": "Cấu trúc: 'be good AT + V-ing/N' (giỏi về lĩnh vực gì)."
    },
    {
        "id": "150_7",
        "questionName": "Question 7",
        "questionText": "<p>Parents are always proud ________ their children's honest efforts and achievements.</p>",
        "choices": [
            {"id": "150_7_1", "text": "of", "html": "of"},
            {"id": "150_7_2", "text": "about", "html": "about"},
            {"id": "150_7_3", "text": "with", "html": "with"},
            {"id": "150_7_4", "text": "in", "html": "in"}
        ],
        "correctChoiceId": "150_7_1",
        "explanation": "<p>Cụm tính từ mang nghĩa tự hào về ai/cái gì: <strong>be proud of + N/V-ing</strong>.</p>",
        "ruleTip": "Cấu trúc: 'be proud OF + N' (tự hào về ai/cái gì)."
    },
    {
        "id": "150_8",
        "questionName": "Question 8",
        "questionText": "<p>My uncle lives with his family ________ 45 Hang Bai Street, Hoan Kiem District.</p>",
        "choices": [
            {"id": "150_8_1", "text": "at", "html": "at"},
            {"id": "150_8_2", "text": "in", "html": "in"},
            {"id": "150_8_3", "text": "on", "html": "on"},
            {"id": "150_8_4", "text": "by", "html": "by"}
        ],
        "correctChoiceId": "150_8_1",
        "explanation": "<p>Địa chỉ nhà có số nhà cụ thể ('45 Hang Bai Street'): dùng giới từ <strong>at</strong>.</p>",
        "ruleTip": "Địa chỉ có số nhà cụ thể: dùng giới từ 'AT' (at 45 Hang Bai street)."
    },
    {
        "id": "150_9",
        "questionName": "Question 9",
        "questionText": "<p>There are many souvenir shops and cafés ________ Trang Tien Street in Hanoi.</p>",
        "choices": [
            {"id": "150_9_1", "text": "on", "html": "on"},
            {"id": "150_9_2", "text": "at", "html": "at"},
            {"id": "150_9_3", "text": "in", "html": "in"},
            {"id": "150_9_4", "text": "to", "html": "to"}
        ],
        "correctChoiceId": "150_9_1",
        "explanation": "<p>Tên con đường (không có số nhà): dùng giới từ <strong>on (on Trang Tien Street)</strong>.</p>",
        "ruleTip": "Chỉ tên đường (không có số nhà cụ thể): dùng giới từ 'ON'."
    },
    {
        "id": "150_10",
        "questionName": "Question 10",
        "questionText": "<p>My cousin has worked as a software engineer ________ Da Nang City for three years.</p>",
        "choices": [
            {"id": "150_10_1", "text": "in", "html": "in"},
            {"id": "150_10_2", "text": "at", "html": "at"},
            {"id": "150_10_3", "text": "on", "html": "on"},
            {"id": "150_10_4", "text": "to", "html": "to"}
        ],
        "correctChoiceId": "150_10_1",
        "explanation": "<p>Tên thành phố, quốc gia, tỉnh thành: dùng giới từ <strong>in (in Da Nang City)</strong>.</p>",
        "ruleTip": "Tên thành phố, quốc gia: dùng giới từ 'IN' (in Da Nang, in Vietnam)."
    },
    {
        "id": "150_11",
        "questionName": "Question 11",
        "questionText": "<p>We are really looking forward to ________ our old classmates this summer vacation.</p>",
        "choices": [
            {"id": "150_11_1", "text": "meeting", "html": "meeting"},
            {"id": "150_11_2", "text": "meet", "html": "meet"},
            {"id": "150_11_3", "text": "met", "html": "met"},
            {"id": "150_11_4", "text": "to meet", "html": "to meet"}
        ],
        "correctChoiceId": "150_11_1",
        "explanation": "<p>Cụm từ cố định: <strong>look forward to + V-ing (mong chờ việc gì)</strong>: chọn <strong>meeting</strong>.</p>",
        "ruleTip": "'Look forward to + V-ing': rất mong chờ, háo hức làm điều gì."
    },
    {
        "id": "150_12",
        "questionName": "Question 12",
        "questionText": "<p>Bat Trang village is famous ________ its traditional handcrafted porcelain and ceramic products.</p>",
        "choices": [
            {"id": "150_12_1", "text": "for", "html": "for"},
            {"id": "150_12_2", "text": "with", "html": "with"},
            {"id": "150_12_3", "text": "about", "html": "about"},
            {"id": "150_12_4", "text": "in", "html": "in"}
        ],
        "correctChoiceId": "150_12_1",
        "explanation": "<p>Cụm tính từ mang nghĩa nổi tiếng về cái gì: <strong>famous for + N</strong>.</p>",
        "ruleTip": "Cấu trúc: 'famous FOR + N' (nổi tiếng về cái gì)."
    },
    {
        "id": "150_13",
        "questionName": "Question 13",
        "questionText": "<p>Whether our outdoor picnic will take place depends largely ________ the weather forecast.</p>",
        "choices": [
            {"id": "150_13_1", "text": "on", "html": "on"},
            {"id": "150_13_2", "text": "in", "html": "in"},
            {"id": "150_13_3", "text": "to", "html": "to"},
            {"id": "150_13_4", "text": "with", "html": "with"}
        ],
        "correctChoiceId": "150_13_1",
        "explanation": "<p>Động từ phụ thuộc vào cái gì: <strong>depend on + N</strong>.</p>",
        "ruleTip": "Cấu trúc: 'depend ON + N' (phụ thuộc vào cái gì)."
    },
    {
        "id": "150_14",
        "questionName": "Question 14",
        "questionText": "<p>What activities do you and your friends often do ________ the weekend?</p>",
        "choices": [
            {"id": "150_14_1", "text": "at", "html": "at"},
            {"id": "150_14_2", "text": "in", "html": "in"},
            {"id": "150_14_3", "text": "to", "html": "to"},
            {"id": "150_14_4", "text": "for", "html": "for"}
        ],
        "correctChoiceId": "150_14_1",
        "explanation": "<p>Cụm từ chỉ thời gian chuẩn tiếng Anh thi vào 10: <strong>at the weekend</strong> (vào dịp cuối tuần).</p>",
        "ruleTip": "Cụm từ cố định chỉ thời gian: 'at the weekend' (Anh-Anh) hoặc 'on the weekend' (Anh-Mỹ)."
    },
    {
        "id": "150_15",
        "questionName": "Question 15",
        "questionText": "<p>The teacher congratulated Nam ________ achieving the highest score in the English trial exam.</p>",
        "choices": [
            {"id": "150_15_1", "text": "on", "html": "on"},
            {"id": "150_15_2", "text": "for", "html": "for"},
            {"id": "150_15_3", "text": "at", "html": "at"},
            {"id": "150_15_4", "text": "about", "html": "about"}
        ],
        "correctChoiceId": "150_15_1",
        "explanation": "<p>Cấu trúc chúc mừng ai về điều gì: <strong>congratulate sb on + V-ing/N</strong>: chọn <strong>on</strong>.</p>",
        "ruleTip": "Cấu trúc: 'congratulate sb ON + V-ing/N' (chúc mừng ai về điều gì)."
    }
]

theory150 = {
    "topicId": 150,
    "topicName": "Giới từ chỉ thời gian, nơi chốn và cụm giới từ",
    "englishName": "Prepositions of Time, Place & Common Dependent Prepositions",
    "rules": [
        {
            "rule": "Giới từ chỉ thời gian: IN, ON, AT.",
            "formula": "IN + năm/tháng/mùa/thế kỷ/buổi // ON + ngày trong tuần/ngày tháng cụ thể/ngày lễ có 'Day' // AT + giờ giấc/thời điểm chính xác/ban đêm",
            "examples": "in 2026, in May, in the morning // on Monday, on July 15th, on Christmas Day // at 7:00, at noon, at night"
        },
        {
            "rule": "Giới từ chỉ nơi chốn: IN, ON, AT.",
            "formula": "IN + thành phố/quốc gia/không gian kín // ON + tên đường/tầng nhà/bề mặt/phương tiện công cộng // AT + số nhà/địa điểm cụ thể",
            "examples": "in Hanoi, in Vietnam, in the room // on Tran Phu street, on the second floor, on the bus // at 25 Trang Tien street, at school"
        },
        {
            "rule": "Cụm tính từ đi kèm giới từ thông dụng thi vào 10:",
            "formula": "good/bad AT, interested IN, fond OF, keen ON, famous FOR, proud OF, tired OF, afraid OF, excited ABOUT",
            "examples": "She is interested in reading books. / He is very proud of his daughter."
        },
        {
            "rule": "Cụm động từ + giới từ đặc biệt:",
            "formula": "look forward TO + V-ing, depend ON, congratulate sb ON sth, spend (time) ON",
            "examples": "I am looking forward to seeing you. / Success depends on hard work."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 116: Liên từ & Mệnh đề trạng ngữ (15 questions)
# -------------------------------------------------------------
q116 = [
    {
        "id": "116_1",
        "questionName": "Question 1",
        "questionText": "<p>________ it was raining heavily, the students arrived at the exam hall on time.</p>",
        "choices": [
            {"id": "116_1_1", "text": "Although", "html": "Although"},
            {"id": "116_1_2", "text": "Despite", "html": "Despite"},
            {"id": "116_1_3", "text": "Because", "html": "Because"},
            {"id": "116_1_4", "text": "However", "html": "However"}
        ],
        "correctChoiceId": "116_1_1",
        "explanation": "<p>Đứng trước mệnh đề (S + V: 'it was raining heavily') chỉ sự tương phản: dùng liên từ <strong>Although</strong>.</p>",
        "ruleTip": "'Although + Mệnh đề (S + V)': mặc dù."
    },
    {
        "id": "116_2",
        "questionName": "Question 2",
        "questionText": "<p>________ the torrential rain, they thoroughly enjoyed their camping trip in Ba Vi.</p>",
        "choices": [
            {"id": "116_2_1", "text": "Despite", "html": "Despite"},
            {"id": "116_2_2", "text": "Although", "html": "Although"},
            {"id": "116_2_3", "text": "Even though", "html": "Even though"},
            {"id": "116_2_4", "text": "Because", "html": "Because"}
        ],
        "correctChoiceId": "116_2_1",
        "explanation": "<p>Đứng trước cụm danh từ ('the torrential rain'): dùng <strong>Despite</strong> hoặc 'In spite of' (không có of sau despite).</p>",
        "ruleTip": "'Despite / In spite of + Cụm danh từ / V-ing' (không có of sau despite)."
    },
    {
        "id": "116_3",
        "questionName": "Question 3",
        "questionText": "<p>We couldn't play our football match yesterday ________ the stormy weather.</p>",
        "choices": [
            {"id": "116_3_1", "text": "because of", "html": "because of"},
            {"id": "116_3_2", "text": "because", "html": "because"},
            {"id": "116_3_3", "text": "since", "html": "since"},
            {"id": "116_3_4", "text": "as", "html": "as"}
        ],
        "correctChoiceId": "116_3_1",
        "explanation": "<p>'The stormy weather' là cụm danh từ chỉ nguyên nhân: dùng <strong>because of</strong> ('because' phải đi với mệnh đề S + V).</p>",
        "ruleTip": "'Because of + Cụm danh từ' (the bad weather); 'Because + Mệnh đề'."
    },
    {
        "id": "116_4",
        "questionName": "Question 4",
        "questionText": "<p>The winter weather was ________ bitterly cold that we decided to stay indoors all day.</p>",
        "choices": [
            {"id": "116_4_1", "text": "so", "html": "so"},
            {"id": "116_4_2", "text": "such", "html": "such"},
            {"id": "116_4_3", "text": "too", "html": "too"},
            {"id": "116_4_4", "text": "very", "html": "very"}
        ],
        "correctChoiceId": "116_4_1",
        "explanation": "<p>Cấu trúc chỉ kết quả: <strong>so + adj + that (so bitterly cold that...)</strong> = quá lạnh đến nỗi mà.</p>",
        "ruleTip": "Cấu trúc: 'so + tính từ + that' (quá... đến nỗi mà)."
    },
    {
        "id": "116_5",
        "questionName": "Question 5",
        "questionText": "<p>It was ________ an interesting novel that I read it from cover to cover in one sitting.</p>",
        "choices": [
            {"id": "116_5_1", "text": "such", "html": "such"},
            {"id": "116_5_2", "text": "so", "html": "so"},
            {"id": "116_5_3", "text": "too", "html": "too"},
            {"id": "116_5_4", "text": "very", "html": "very"}
        ],
        "correctChoiceId": "116_5_1",
        "explanation": "<p>Cấu trúc chỉ kết quả: <strong>such + a/an + adj + Noun + that (such an interesting novel that...)</strong>.</p>",
        "ruleTip": "Cấu trúc: 'such + a/an + tính từ + danh từ đếm được + that'."
    },
    {
        "id": "116_6",
        "questionName": "Question 6",
        "questionText": "<p>She turned on the dim night light ________ her little daughter wouldn't be frightened in the dark.</p>",
        "choices": [
            {"id": "116_6_1", "text": "so that", "html": "so that"},
            {"id": "116_6_2", "text": "in order to", "html": "in order to"},
            {"id": "116_6_3", "text": "so as to", "html": "so as to"},
            {"id": "116_6_4", "text": "because", "html": "because"}
        ],
        "correctChoiceId": "116_6_1",
        "explanation": "<p>Đứng trước mệnh đề chỉ mục đích (her daughter wouldn't be...): dùng liên từ <strong>so that / in order that</strong>.</p>",
        "ruleTip": "'So that / In order that + Mệnh đề' chỉ mục đích (để mà)."
    },
    {
        "id": "116_7",
        "questionName": "Question 7",
        "questionText": "<p>Minh got up early at 5:00 AM ________ miss the school bus to the exam venue.</p>",
        "choices": [
            {"id": "116_7_1", "text": "in order not to", "html": "in order not to"},
            {"id": "116_7_2", "text": "in order to not", "html": "in order to not"},
            {"id": "116_7_3", "text": "so as to not", "html": "so as to not"},
            {"id": "116_7_4", "text": "so that not", "html": "so that not"}
        ],
        "correctChoiceId": "116_7_1",
        "explanation": "<p>Chỉ mục đích phủ định với động từ nguyên mẫu: <strong>in order not to / so as not to + V-inf (in order not to miss)</strong>.</p>",
        "ruleTip": "Chỉ mục đích phủ định: 'in order not to / so as not to + V-inf' (để không bị)."
    },
    {
        "id": "116_8",
        "questionName": "Question 8",
        "questionText": "<p>He studied very hard for the entrance exam. ________, he did not achieve the dream score he wished.</p>",
        "choices": [
            {"id": "116_8_1", "text": "However", "html": "However"},
            {"id": "116_8_2", "text": "Although", "html": "Although"},
            {"id": "116_8_3", "text": "Therefore", "html": "Therefore"},
            {"id": "116_8_4", "text": "Despite", "html": "Despite"}
        ],
        "correctChoiceId": "116_8_1",
        "explanation": "<p>Trạng từ liên kết đứng đầu câu sau dấu chấm và có dấu phẩy ngăn cách diễn tả ý tương phản: <strong>However,</strong>.</p>",
        "ruleTip": "'However' đứng đầu câu sau dấu chấm và ngăn cách bởi dấu phẩy (; however, hoặc . However,)."
    },
    {
        "id": "116_9",
        "questionName": "Question 9",
        "questionText": "<p>Although he was feeling sick, he still went to work. = In spite of ________ sick, he still went to work.</p>",
        "choices": [
            {"id": "116_9_1", "text": "being", "html": "being"},
            {"id": "116_9_2", "text": "be", "html": "be"},
            {"id": "116_9_3", "text": "was", "html": "was"},
            {"id": "116_9_4", "text": "he was", "html": "he was"}
        ],
        "correctChoiceId": "116_9_1",
        "explanation": "<p>Chuyển đổi từ 'Although + clause' sang 'In spite of + V-ing': động từ to be biến đổi thành <strong>being (being sick)</strong>.</p>",
        "ruleTip": "'In spite of + V-ing' (being ill) thay cho mệnh đề 'Although he was ill'."
    },
    {
        "id": "116_10",
        "questionName": "Question 10",
        "questionText": "<p>The main bridge was under repair; ________, all vehicles had to take a detour.</p>",
        "choices": [
            {"id": "116_10_1", "text": "therefore", "html": "therefore"},
            {"id": "116_10_2", "text": "however", "html": "however"},
            {"id": "116_10_3", "text": "although", "html": "although"},
            {"id": "116_10_4", "text": "otherwise", "html": "otherwise"}
        ],
        "correctChoiceId": "116_10_1",
        "explanation": "<p>Trạng từ nối chỉ kết quả hệ quả hợp lý (cây cầu bị hỏng; vì thế xe cộ phải đi đường vòng): <strong>therefore (vì vậy, do đó)</strong>.</p>",
        "ruleTip": "'Therefore' chỉ kết quả: vì vậy, do đó."
    },
    {
        "id": "116_11",
        "questionName": "Question 11",
        "questionText": "<p>________ Tom nor his close friends have visited that historical pagoda before.</p>",
        "choices": [
            {"id": "116_11_1", "text": "Neither", "html": "Neither"},
            {"id": "116_11_2", "text": "Either", "html": "Either"},
            {"id": "116_11_3", "text": "Both", "html": "Both"},
            {"id": "116_11_4", "text": "Not only", "html": "Not only"}
        ],
        "correctChoiceId": "116_11_1",
        "explanation": "<p>Cặp liên từ tương quan đi với 'nor': <strong>Neither... nor (cả hai đều không)</strong>.</p>",
        "ruleTip": "Cặp liên từ tương quan: 'Neither... nor' (cả hai đều không)."
    },
    {
        "id": "116_12",
        "questionName": "Question 12",
        "questionText": "<p>This learning software is ________ extremely user-friendly and very helpful for Grade 10 students.</p>",
        "choices": [
            {"id": "116_12_1", "text": "both", "html": "both"},
            {"id": "116_12_2", "text": "either", "html": "either"},
            {"id": "116_12_3", "text": "neither", "html": "neither"},
            {"id": "116_12_4", "text": "not", "html": "not"}
        ],
        "correctChoiceId": "116_12_1",
        "explanation": "<p>Cặp liên từ tương quan đi với 'and': <strong>Both... and (vừa... vừa...)</strong>.</p>",
        "ruleTip": "Cặp liên từ tương quan: 'Both... and' (vừa... vừa...)."
    },
    {
        "id": "116_13",
        "questionName": "Question 13",
        "questionText": "<p>She speaks ________ English fluently but also French with great confidence.</p>",
        "choices": [
            {"id": "116_13_1", "text": "not only", "html": "not only"},
            {"id": "116_13_2", "text": "both", "html": "both"},
            {"id": "116_13_3", "text": "either", "html": "either"},
            {"id": "116_13_4", "text": "as well as", "html": "as well as"}
        ],
        "correctChoiceId": "116_13_1",
        "explanation": "<p>Cặp liên từ song hành: <strong>not only... but also (không những... mà còn)</strong>.</p>",
        "ruleTip": "Cặp liên từ: 'Not only... but also' (không những... mà còn)."
    },
    {
        "id": "116_14",
        "questionName": "Question 14",
        "questionText": "<p>You can choose ________ the morning practice session or the afternoon mock test.</p>",
        "choices": [
            {"id": "116_14_1", "text": "either", "html": "either"},
            {"id": "116_14_2", "text": "neither", "html": "neither"},
            {"id": "116_14_3", "text": "both", "html": "both"},
            {"id": "116_14_4", "text": "not only", "html": "not only"}
        ],
        "correctChoiceId": "116_14_1",
        "explanation": "<p>Cặp liên từ lựa chọn 1 trong 2 đi với 'or': <strong>Either... or</strong>.</p>",
        "ruleTip": "Cặp liên từ: 'Either... or' (hoặc cái này hoặc cái kia)."
    },
    {
        "id": "116_15",
        "questionName": "Question 15",
        "questionText": "<p>It was getting dark outside, ________ we decided to take a taxi home instead of walking.</p>",
        "choices": [
            {"id": "116_15_1", "text": "so", "html": "so"},
            {"id": "116_15_2", "text": "because", "html": "because"},
            {"id": "116_15_3", "text": "although", "html": "although"},
            {"id": "116_15_4", "text": "but", "html": "but"}
        ],
        "correctChoiceId": "116_15_1",
        "explanation": "<p>Liên từ đứng sau dấu phẩy nối mệnh đề chỉ nguyên nhân với kết quả: <strong>so (cho nên, vì vậy)</strong>.</p>",
        "ruleTip": "Liên từ 'so' đứng giữa câu sau dấu phẩy để nối mệnh đề chỉ kết quả."
    }
]

theory116 = {
    "topicId": 116,
    "topicName": "Liên từ và mệnh đề trạng ngữ",
    "englishName": "Conjunctions and Adverbial Clauses",
    "rules": [
        {
            "rule": "Liên từ chỉ sự nhượng bộ, tương phản:",
            "formula": "Although / Even though / Though + S + V, S + V // In spite of / Despite + N / V-ing, S + V",
            "examples": "Although it rained heavily, we went to school on time. / Despite the heavy rain, we went to school."
        },
        {
            "rule": "Lưu ý cấm kỵ: Tuyệt đối KHÔNG dùng cả 'Although' và 'But' trong cùng một câu!",
            "formula": "ĐÚNG: Although it rained, we went out. HOẶC It rained, but we went out. (SAI: Although it rained, but we went out.)",
            "examples": "Although he was tired, he finished his work."
        },
        {
            "rule": "Liên từ chỉ lý do, nguyên nhân:",
            "formula": "Because / Since / As + S + V, S + V // Because of / Due to + N / V-ing, S + V",
            "examples": "Because she was ill, she stayed home. / Because of her illness, she stayed home."
        },
        {
            "rule": "Cấu trúc So... that và Such... that (quá... đến nỗi mà):",
            "formula": "S + be/V + SO + adj/adv + THAT + S + V // S + V + SUCH + (a/an) + adj + N + THAT + S + V",
            "examples": "The tea is so hot that I cannot drink it. / It was such hot tea that I could not drink it."
        },
        {
            "rule": "Liên từ chỉ mục đích:",
            "formula": "so that / in order that + S + can/could/will/would + V-inf // in order to / so as to / to + V-inf",
            "examples": "He studies hard so that he can pass the exam. / He studies hard in order to pass the exam."
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
        (126, q126, theory126),
        (127, q127, theory127),
        (128, q128, theory128),
        (130, q130, theory130),
        (134, q134, theory134),
        (140, q140, theory140),
        (168, q168, theory168),
        (551, q551, theory551),
        (160, q160, theory160),
        (106, q106, theory106),
        (150, q150, theory150),
        (116, q116, theory116)
    ]
    for tid, qs, th in datasets:
        save_data(tid, qs, th)

    # Alias for Wish topic 141 in taxonomy
    create_alias(127, 141)
    print("All 12 Grammar topics and aliases successfully generated!")

if __name__ == "__main__":
    main()
