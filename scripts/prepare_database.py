import json
import os

BASE_DIR = '/Users/anh/Documents/Tiếng anh thi vào 10'
DATA_DIR = os.path.join(BASE_DIR, 'data')
QUESTIONS_DIR = os.path.join(DATA_DIR, 'questions')
THEORIES_DIR = os.path.join(DATA_DIR, 'theories')

os.makedirs(QUESTIONS_DIR, exist_ok=True)
os.makedirs(THEORIES_DIR, exist_ok=True)

# 1. Topic 68: Đuôi "ed"
q68 = [
  {
    "id": "16124",
    "questionName": "Question 1",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "16124_1", "text": "happened", "html": "happen<u>ed</u>" },
      { "id": "16124_2", "text": "mixed", "html": "mix<u>ed</u>" },
      { "id": "16124_3", "text": "listened", "html": "listen<u>ed</u>" },
      { "id": "16124_4", "text": "lived", "html": "liv<u>ed</u>" }
    ],
    "correctChoiceId": "16124_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"mixed\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>mixed</strong> (v.) /mɪkst/</li><li><strong>happened</strong> (v.) /ˈhæpənd/</li><li><strong>listened</strong> (v.) /ˈlɪsnd/</li><li><strong>lived</strong> (v.) /lɪvd/</li></ul>",
    "ruleTip": "Đuôi '-ed' đi sau các âm vô thanh (/s/, /p/, /k/, /f/, /ʃ/, /tʃ/) được phát âm là /t/."
  },
  {
    "id": "17950",
    "questionName": "Question 2",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "17950_1", "text": "passed", "html": "pass<u>ed</u>" },
      { "id": "17950_2", "text": "opened", "html": "open<u>ed</u>" },
      { "id": "17950_3", "text": "washed", "html": "wash<u>ed</u>" },
      { "id": "17950_4", "text": "worked", "html": "work<u>ed</u>" }
    ],
    "correctChoiceId": "17950_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"opened\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>opened</strong> (v.) /ˈəʊpənd/</li><li><strong>passed</strong> (v.) /pɑːst/</li><li><strong>washed</strong> (v.) /wɒʃt/</li><li><strong>worked</strong> (v.) /wɜːkt/</li></ul>",
    "ruleTip": "Đuôi '-ed' đi sau các âm hữu thanh còn lại (như /n/) được phát âm là /d/."
  },
  {
    "id": "4294",
    "questionName": "Question 3",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "4294_1", "text": "dressed", "html": "dress<u>ed</u>" },
      { "id": "4294_2", "text": "dropped", "html": "dropp<u>ed</u>" },
      { "id": "4294_3", "text": "matched", "html": "match<u>ed</u>" },
      { "id": "4294_4", "text": "joined", "html": "join<u>ed</u>" }
    ],
    "correctChoiceId": "4294_4",
    "explanation": "<p>Phần gạch chân trong <strong>\"joined\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>joined</strong> (v.) /dʒɔɪnd/</li><li><strong>dressed</strong> (v.) /drest/</li><li><strong>dropped</strong> (v.) /drɒpt/</li><li><strong>matched</strong> (v.) /mætʃt/</li></ul>"
  },
  {
    "id": "4136",
    "questionName": "Question 4",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "4136_1", "text": "played", "html": "play<u>ed</u>" },
      { "id": "4136_2", "text": "planned", "html": "plann<u>ed</u>" },
      { "id": "4136_3", "text": "cooked", "html": "cook<u>ed</u>" },
      { "id": "4136_4", "text": "lived", "html": "liv<u>ed</u>" }
    ],
    "correctChoiceId": "4136_3",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"cooked\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>cooked</strong> (v.) /kʊkt/</li><li><strong>played</strong> (v.) /pleɪd/</li><li><strong>planned</strong> (v.) /plænd/</li><li><strong>lived</strong> (v.) /lɪvd/</li></ul>"
  },
  {
    "id": "4642",
    "questionName": "Question 5",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "4642_1", "text": "watched", "html": "watch<u>ed</u>" },
      { "id": "4642_2", "text": "cleaned", "html": "clean<u>ed</u>" },
      { "id": "4642_3", "text": "missed", "html": "miss<u>ed</u>" },
      { "id": "4642_4", "text": "talked", "html": "talk<u>ed</u>" }
    ],
    "correctChoiceId": "4642_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"cleaned\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>cleaned</strong> (v.) /kliːnd/</li><li><strong>watched</strong> (v.) /wɒtʃt/</li><li><strong>missed</strong> (v.) /mɪst/</li><li><strong>talked</strong> (v.) /tɔːkt/</li></ul>"
  },
  {
    "id": "5119",
    "questionName": "Question 6",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "5119_1", "text": "toured", "html": "tour<u>ed</u>" },
      { "id": "5119_2", "text": "jumped", "html": "jump<u>ed</u>" },
      { "id": "5119_3", "text": "solved", "html": "solv<u>ed</u>" },
      { "id": "5119_4", "text": "rained", "html": "rain<u>ed</u>" }
    ],
    "correctChoiceId": "5119_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"jumped\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>jumped</strong> (v.) /dʒʌmpt/</li><li><strong>toured</strong> (v.) /tʊəd/</li><li><strong>solved</strong> (v.) /sɒlvd/</li><li><strong>rained</strong> (v.) /reɪnd/</li></ul>"
  },
  {
    "id": "5059",
    "questionName": "Question 7",
    "questionText": "<p><strong>Choose the word whose underlined part differs from the other three in pronunciation.</strong></p>",
    "choices": [
      { "id": "5059_1", "text": "talked", "html": "talk<u>ed</u>" },
      { "id": "5059_2", "text": "naked", "html": "nak<u>ed</u>" },
      { "id": "5059_3", "text": "liked", "html": "lik<u>ed</u>" },
      { "id": "5059_4", "text": "asked", "html": "ask<u>ed</u>" }
    ],
    "correctChoiceId": "5059_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"naked\"</strong> được phát âm là <strong>/ɪd/</strong> (trường hợp đặc biệt tính từ đuôi -ed), trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>naked</strong> (adj.) /ˈneɪkɪd/</li><li><strong>talked</strong> (v.) /tɔːkt/</li><li><strong>liked</strong> (v.) /laɪkt/</li><li><strong>asked</strong> (v.) /ɑːskt/</li></ul>"
  },
  {
    "id": "5439",
    "questionName": "Question 8",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "5439_1", "text": "explained", "html": "explain<u>ed</u>" },
      { "id": "5439_2", "text": "disappointed", "html": "disappoint<u>ed</u>" },
      { "id": "5439_3", "text": "prepared", "html": "prepar<u>ed</u>" },
      { "id": "5439_4", "text": "interviewed", "html": "interview<u>ed</u>" }
    ],
    "correctChoiceId": "5439_2",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"disappointed\"</strong> được phát âm là <strong>/ɪd/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>disappointed</strong> (v.) /ˌdɪsəˈpɔɪntɪd/ (kết thúc bằng âm /t/)</li><li><strong>explained</strong> (v.) /ɪkˈspleɪnd/</li><li><strong>prepared</strong> (v.) /prɪˈpeəd/</li><li><strong>interviewed</strong> (v.) /ˈɪntəvjuːd/</li></ul>"
  },
  {
    "id": "5436",
    "questionName": "Question 9",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "5436_1", "text": "arrived", "html": "arriv<u>ed</u>" },
      { "id": "5436_2", "text": "enjoyed", "html": "enjoy<u>ed</u>" },
      { "id": "5436_3", "text": "improved", "html": "improv<u>ed</u>" },
      { "id": "5436_4", "text": "suggested", "html": "suggest<u>ed</u>" }
    ],
    "correctChoiceId": "5436_4",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"suggested\"</strong> được phát âm là <strong>/ɪd/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>suggested</strong> (v.) /səˈdʒestɪd/</li><li><strong>arrived</strong> (v.) /əˈraɪvd/</li><li><strong>enjoyed</strong> (v.) /ɪnˈdʒɔɪd/</li><li><strong>improved</strong> (v.) /ɪmˈpruːvd/</li></ul>"
  },
  {
    "id": "5487",
    "questionName": "Question 10",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "5487_1", "text": "appeared", "html": "appear<u>ed</u>" },
      { "id": "5487_2", "text": "climbed", "html": "climb<u>ed</u>" },
      { "id": "5487_3", "text": "coughed", "html": "cough<u>ed</u>" },
      { "id": "5487_4", "text": "loved", "html": "lov<u>ed</u>" }
    ],
    "correctChoiceId": "5487_3",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"coughed\"</strong> được phát âm là <strong>/t/</strong> (vì 'gh' đọc là âm /f/ vô thanh), trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>coughed</strong> (v.) /kɒft/</li><li><strong>appeared</strong> (v.) /əˈpɪəd/</li><li><strong>climbed</strong> (v.) /klaɪmd/</li><li><strong>loved</strong> (v.) /lʌvd/</li></ul>"
  }
]

with open(os.path.join(QUESTIONS_DIR, '68.json'), 'w', encoding='utf-8') as f:
    json.dump(q68, f, ensure_ascii=False, indent=2)

theory68 = {
  "topicId": 68,
  "topicName": "Đuôi \"ed\"",
  "englishName": "\"ed\" ending",
  "infographicImage": "/images/theories/duoi-ed.png",
  "rules": [
    {
      "sound": "/ɪd/",
      "rule": "Phát âm là /ɪd/ khi động từ có âm kết thúc là /t/ hoặc /d/.",
      "examples": "wanted /ˈwɒntɪd/, needed /ˈniːdɪd/, decided /dɪˈsaɪdɪd/, invited /ɪnˈvaɪtɪd/"
    },
    {
      "sound": "/t/",
      "rule": "Phát âm là /t/ khi động từ có âm kết thúc là các âm vô thanh: /p/, /k/, /f/, /s/, /ʃ/ (sh), /tʃ/ (ch).",
      "examples": "stopped /stɒpt/, looked /lʊkt/, laughed /lɑːft/, washed /wɒʃt/, watched /wɒtʃt/, missed /mɪst/"
    },
    {
      "sound": "/d/",
      "rule": "Phát âm là /d/ khi động từ kết thúc bằng các âm hữu thanh còn lại (các nguyên âm và phụ âm hữu thanh).",
      "examples": "played /pleɪd/, cleaned /kliːnd/, lived /lɪvd/, opened /ˈəʊpənd/"
    },
    {
      "sound": "Đặc biệt",
      "rule": "Một số tính từ có tận cùng là '-ed' luôn được phát âm là /ɪd/ bất kể âm tận cùng.",
      "examples": "naked /ˈneɪkɪd/, wicked /ˈwɪkɪd/, crooked /ˈkrʊkɪd/, learned /ˈlɜːnɪd/, blessed /ˈblesɪd/"
    }
  ]
}
with open(os.path.join(THEORIES_DIR, '68.json'), 'w', encoding='utf-8') as f:
    json.dump(theory68, f, ensure_ascii=False, indent=2)


# 2. Topic 69: Đuôi "s"/"es"
q69 = [
  {
    "id": "69_1",
    "questionName": "Question 1",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "69_1_1", "text": "books", "html": "book<u>s</u>" },
      { "id": "69_1_2", "text": "cats", "html": "cat<u>s</u>" },
      { "id": "69_1_3", "text": "dogs", "html": "dog<u>s</u>" },
      { "id": "69_1_4", "text": "maps", "html": "map<u>s</u>" }
    ],
    "correctChoiceId": "69_1_3",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"dogs\"</strong> được phát âm là <strong>/z/</strong>, trong các từ còn lại được phát âm là <strong>/s/</strong>.</p><ul><li><strong>dogs</strong> /dɒɡz/ (kết thúc bằng âm /g/ hữu thanh)</li><li><strong>books</strong> /bʊks/</li><li><strong>cats</strong> /kæts/</li><li><strong>maps</strong> /mæps/</li></ul>",
    "ruleTip": "Đuôi 's/es' sau âm vô thanh (/p/, /k/, /t/, /f/, /θ/) phát âm là /s/. Sau âm hữu thanh phát âm là /z/."
  },
  {
    "id": "69_2",
    "questionName": "Question 2",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "69_2_1", "text": "watches", "html": "watch<u>es</u>" },
      { "id": "69_2_2", "text": "boxes", "html": "box<u>es</u>" },
      { "id": "69_2_3", "text": "buses", "html": "bus<u>es</u>" },
      { "id": "69_2_4", "text": "apples", "html": "apple<u>s</u>" }
    ],
    "correctChoiceId": "69_2_4",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"apples\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>apples</strong> /ˈæplz/</li><li><strong>watches</strong> /ˈwɒtʃɪz/</li><li><strong>boxes</strong> /ˈbɒksɪz/</li><li><strong>buses</strong> /ˈbʌsɪz/</li></ul>"
  },
  {
    "id": "69_3",
    "questionName": "Question 3",
    "questionText": "<p><strong>Choose the word which has the underlined part pronounced differently from the others.</strong></p>",
    "choices": [
      { "id": "69_3_1", "text": "laughs", "html": "laugh<u>s</u>" },
      { "id": "69_3_2", "text": "days", "html": "day<u>s</u>" },
      { "id": "69_3_3", "text": "pens", "html": "pen<u>s</u>" },
      { "id": "69_3_4", "text": "rooms", "html": "room<u>s</u>" }
    ],
    "correctChoiceId": "69_3_1",
    "explanation": "<p>Phần gạch chân trong từ <strong>\"laughs\"</strong> được phát âm là <strong>/s/</strong> (vì 'gh' đọc là /f/ vô thanh), các từ còn lại phát âm là <strong>/z/</strong>.</p><ul><li><strong>laughs</strong> /lɑːfs/</li><li><strong>days</strong> /deɪz/</li><li><strong>pens</strong> /penz/</li><li><strong>rooms</strong> /ruːmz/</li></ul>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '69.json'), 'w', encoding='utf-8') as f:
    json.dump(q69, f, ensure_ascii=False, indent=2)

theory69 = {
  "topicId": 69,
  "topicName": "Đuôi \"s\"/\"es\"",
  "englishName": "\"s\"/\"es\" ending",
  "rules": [
    {
      "sound": "/ɪz/",
      "rule": "Phát âm là /ɪz/ khi từ tận cùng bằng các âm xuýt: /s/, /z/, /ʃ/, /tʃ/, /ʒ/, /dʒ/ (thường tận cùng là s, ss, ch, sh, x, z, ge, ce).",
      "examples": "kisses, watches, wishes, boxes, changes"
    },
    {
      "sound": "/s/",
      "rule": "Phát âm là /s/ khi từ tận cùng bằng các âm vô thanh: /p/, /k/, /f/, /t/, /θ/ (mẹo nhớ: Thời phong kiến phương Tây).",
      "examples": "stops, books, laughs, cats, months"
    },
    {
      "sound": "/z/",
      "rule": "Phát âm là /z/ khi từ tận cùng bằng các nguyên âm và phụ âm hữu thanh còn lại.",
      "examples": "plays, doors, bags, lives, windows"
    }
  ]
}
with open(os.path.join(THEORIES_DIR, '69.json'), 'w', encoding='utf-8') as f:
    json.dump(theory69, f, ensure_ascii=False, indent=2)


# 3. Topic 29: Từ có 2 âm tiết (Word Stress)
q29 = [
  {
    "id": "29_1",
    "questionName": "Question 1",
    "questionText": "<p><strong>Choose the word which has a different stress pattern from the others.</strong></p>",
    "choices": [
      { "id": "29_1_1", "text": "teacher", "html": "teacher" },
      { "id": "29_1_2", "text": "student", "html": "student" },
      { "id": "29_1_3", "text": "police", "html": "police" },
      { "id": "29_1_4", "text": "doctor", "html": "doctor" }
    ],
    "correctChoiceId": "29_1_3",
    "explanation": "<p>Trọng âm của từ <strong>\"police\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/pəˈliːs/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>police</strong> /pəˈliːs/ (âm tiết 2)</li><li><strong>teacher</strong> /ˈtiːtʃə(r)/ (âm tiết 1)</li><li><strong>student</strong> /ˈstjuːdnt/ (âm tiết 1)</li><li><strong>doctor</strong> /ˈdɒktə(r)/ (âm tiết 1)</li></ul>",
    "ruleTip": "Hầu hết danh từ 2 âm tiết có trọng âm rơi vào âm tiết 1. Riêng từ 'police' là ngoại lệ rơi vào âm tiết 2."
  },
  {
    "id": "29_2",
    "questionName": "Question 2",
    "questionText": "<p><strong>Choose the word which has a different stress pattern from the others.</strong></p>",
    "choices": [
      { "id": "29_2_1", "text": "decide", "html": "decide" },
      { "id": "29_2_2", "text": "agree", "html": "agree" },
      { "id": "29_2_3", "text": "listen", "html": "listen" },
      { "id": "29_2_4", "text": "enjoy", "html": "enjoy" }
    ],
    "correctChoiceId": "29_2_3",
    "explanation": "<p>Trọng âm của từ <strong>\"listen\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈlɪsn/), các từ còn lại là động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>listen</strong> /ˈlɪsn/ (âm tiết 1)</li><li><strong>decide</strong> /dɪˈsaɪd/ (âm tiết 2)</li><li><strong>agree</strong> /əˈɡriː/ (âm tiết 2)</li><li><strong>enjoy</strong> /ɪnˈdʒɔɪ/ (âm tiết 2)</li></ul>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '29.json'), 'w', encoding='utf-8') as f:
    json.dump(q29, f, ensure_ascii=False, indent=2)

theory29 = {
  "topicId": 29,
  "topicName": "Từ có 2 âm tiết",
  "englishName": "2-syllable words stress",
  "rules": [
    {
      "rule": "Quy tắc 1: Đa số danh từ và tính từ có 2 âm tiết thì trọng âm rơi vào âm tiết thứ 1.",
      "examples": "DANH TỪ: 'table, 'window, 'father, 'paper. TÍNH TỪ: 'happy, 'clever, 'busy, 'famous."
    },
    {
      "rule": "Quy tắc 2: Đa số động từ có 2 âm tiết thì trọng âm rơi vào âm tiết thứ 2.",
      "examples": "re'lax, de'cide, at'tract, be'gin, re'ceive, for'get."
    },
    {
      "rule": "Ngoại lệ quan trọng thi vào 10:",
      "examples": "Động từ nhấn âm 1: 'listen, 'visit, 'open, 'happen, 'borrow. Danh từ nhấn âm 2: po'lice, mis'take, a'dvice, ma'chine."
    }
  ]
}
with open(os.path.join(THEORIES_DIR, '29.json'), 'w', encoding='utf-8') as f:
    json.dump(theory29, f, ensure_ascii=False, indent=2)


# 4. Topic 126: Câu điều kiện loại 0, 1 (Zero and First Conditional)
q126 = [
  {
    "id": "126_1",
    "questionName": "Question 1",
    "questionText": "<p>If it rains this afternoon, we ________ the football match.</p>",
    "choices": [
      { "id": "126_1_1", "text": "cancel", "html": "cancel" },
      { "id": "126_1_2", "text": "will cancel", "html": "will cancel" },
      { "id": "126_1_3", "text": "would cancel", "html": "would cancel" },
      { "id": "126_1_4", "text": "canceled", "html": "canceled" }
    ],
    "correctChoiceId": "126_1_2",
    "explanation": "<p>Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai.<br/>Cấu trúc: <strong>If + S + V(hiện tại đơn), S + will + V-inf</strong>.<br/>Do đó đáp án chính xác là <strong>will cancel</strong>.</p>"
  },
  {
    "id": "126_2",
    "questionName": "Question 2",
    "questionText": "<p>Unless you study hard, you ________ the entrance examination.</p>",
    "choices": [
      { "id": "126_2_1", "text": "won't pass", "html": "won't pass" },
      { "id": "126_2_2", "text": "will pass", "html": "will pass" },
      { "id": "126_2_3", "text": "passed", "html": "passed" },
      { "id": "126_2_4", "text": "would pass", "html": "would pass" }
    ],
    "correctChoiceId": "126_2_1",
    "explanation": "<p><strong>Unless = If ... not</strong> (Trừ phi / Nếu không).<br/>'Unless you study hard, you won't pass...' = 'Nếu bạn không học chăm, bạn sẽ không đỗ kỳ thi tuyển sinh'.</p>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '126.json'), 'w', encoding='utf-8') as f:
    json.dump(q126, f, ensure_ascii=False, indent=2)

theory126 = {
  "topicId": 126,
  "topicName": "Câu điều kiện loại 0, 1",
  "englishName": "Zero and first conditional",
  "rules": [
    {
      "rule": "Câu điều kiện loại 0: Diễn tả chân lý, sự thật hiển nhiên.",
      "formula": "If + S + V(s/es), S + V(s/es)",
      "examples": "If you heat ice, it melts."
    },
    {
      "rule": "Câu điều kiện loại 1: Diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai.",
      "formula": "If + S + V(hiện tại đơn), S + will/can/may + V(nguyên mẫu)",
      "examples": "If she invites me, I will go to her party."
    },
    {
      "rule": "Lưu ý cấu trúc UNLESS:",
      "formula": "Unless = If ... not (Theo sau Unless luôn là mệnh đề khẳng định)",
      "examples": "Unless you hurry, you will be late. (= If you don't hurry...)"
    }
  ]
}
with open(os.path.join(THEORIES_DIR, '126.json'), 'w', encoding='utf-8') as f:
    json.dump(theory126, f, ensure_ascii=False, indent=2)


# 5. Topic 127: Câu điều kiện loại 2
q127 = [
  {
    "id": "127_1",
    "questionName": "Question 1",
    "questionText": "<p>If I ________ you, I would take that opportunity to study abroad.</p>",
    "choices": [
      { "id": "127_1_1", "text": "am", "html": "am" },
      { "id": "127_1_2", "text": "were", "html": "were" },
      { "id": "127_1_3", "text": "will be", "html": "will be" },
      { "id": "127_1_4", "text": "had been", "html": "had been" }
    ],
    "correctChoiceId": "127_1_2",
    "explanation": "<p>Câu điều kiện loại 2 diễn tả điều kiện trái ngược với thực tế ở hiện tại.<br/>Cấu trúc: <strong>If + S + V(quá khứ đơn), S + would/could + V-inf</strong>.<br/>Động từ 'to be' trong mệnh đề If của câu điều kiện loại 2 luôn dùng <strong>were</strong> cho tất cả các ngôi.</p>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '127.json'), 'w', encoding='utf-8') as f:
    json.dump(q127, f, ensure_ascii=False, indent=2)


# 6. Topic 168: Câu hỏi đuôi (Tag Questions)
q168 = [
  {
    "id": "168_1",
    "questionName": "Question 1",
    "questionText": "<p>Your brother goes to school by bicycle every day, ________?</p>",
    "choices": [
      { "id": "168_1_1", "text": "is he", "html": "is he" },
      { "id": "168_1_2", "text": "does he", "html": "does he" },
      { "id": "168_1_3", "text": "doesn't he", "html": "doesn't he" },
      { "id": "168_1_4", "text": "isn't he", "html": "isn't he" }
    ],
    "correctChoiceId": "168_1_3",
    "explanation": "<p>Mệnh đề chính dùng thì hiện tại đơn khẳng định với động từ thường 'goes' và chủ ngữ 'Your brother' (he).<br/>Phần đuôi phải là trợ động từ phủ định tương ứng: <strong>doesn't he</strong>.</p>"
  },
  {
    "id": "168_2",
    "questionName": "Question 2",
    "questionText": "<p>Let's go for a picnic this weekend, ________?</p>",
    "choices": [
      { "id": "168_2_1", "text": "shall we", "html": "shall we" },
      { "id": "168_2_2", "text": "will you", "html": "will you" },
      { "id": "168_2_3", "text": "do we", "html": "do we" },
      { "id": "168_2_4", "text": "don't we", "html": "don't we" }
    ],
    "correctChoiceId": "168_2_1",
    "explanation": "<p>Với câu đề nghị bắt đầu bằng <strong>Let's</strong>, câu hỏi đuôi luôn là <strong>shall we</strong>.</p>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '168.json'), 'w', encoding='utf-8') as f:
    json.dump(q168, f, ensure_ascii=False, indent=2)


# 7. Topic 551: Đại từ quan hệ (Relative Pronouns)
q551 = [
  {
    "id": "551_1",
    "questionName": "Question 1",
    "questionText": "<p>The girl ________ won the first prize in the English speaking contest is my classmate.</p>",
    "choices": [
      { "id": "551_1_1", "text": "which", "html": "which" },
      { "id": "551_1_2", "text": "who", "html": "who" },
      { "id": "551_1_3", "text": "whom", "html": "whom" },
      { "id": "551_1_4", "text": "whose", "html": "whose" }
    ],
    "correctChoiceId": "551_1_2",
    "explanation": "<p>'The girl' là danh từ chỉ người, đứng trước động từ 'won' làm chủ ngữ trong mệnh đề quan hệ nên ta dùng đại từ quan hệ <strong>who</strong>.</p>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '551.json'), 'w', encoding='utf-8') as f:
    json.dump(q551, f, ensure_ascii=False, indent=2)


# 8. Topic 78: Bày tỏ lời cảm ơn và xin lỗi (Speaking)
q78 = [
  {
    "id": "78_1",
    "questionName": "Question 1",
    "questionText": "<p><strong>Mark:</strong> \"Thank you very much for helping me with the project!\"<br/><strong>Linda:</strong> \"________\"</p>",
    "choices": [
      { "id": "78_1_1", "text": "You're welcome.", "html": "You're welcome." },
      { "id": "78_1_2", "text": "Yes, of course.", "html": "Yes, of course." },
      { "id": "78_1_3", "text": "Never mind me.", "html": "Never mind me." },
      { "id": "78_1_4", "text": "It's a pity.", "html": "It's a pity." }
    ],
    "correctChoiceId": "78_1_1",
    "explanation": "<p>Để đáp lại lời cảm ơn (\"Thank you very much...\"), câu trả lời lịch sự và tự nhiên nhất là <strong>\"You're welcome.\"</strong> (Không có chi/ Rất sẵn lòng giúp bạn).</p>"
  }
]
with open(os.path.join(QUESTIONS_DIR, '78.json'), 'w', encoding='utf-8') as f:
    json.dump(q78, f, ensure_ascii=False, indent=2)

print("Successfully prepared initial question database!")
