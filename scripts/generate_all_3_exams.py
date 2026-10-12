import json
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
TS_OUTPUT_FILE = os.path.join(PROJECT_DIR, "src", "data", "exams_hk1.ts")
BO_DIR = os.path.join(PROJECT_DIR, "BO_TAI_LIEU_ON_THI_VAO_10")
HTML_OUTPUT_FILE = os.path.join(BO_DIR, "03_bo_3_de_kiem_tra_6_unit_dau.html")
PDF_OUTPUT_FILE = os.path.join(BO_DIR, "03_BO_3_DE_KIEM_TRA_6_UNIT_DAU_GLOBAL_SUCCESS_9.pdf")

# Import EXAM_1 from build_full_3_exams
import sys
sys.path.append(SCRIPT_DIR)
from build_full_3_exams import EXAM_1

# Define EXAM_2: Nâng cao & Phân hóa (40 questions)
EXAM_2 = {
    "id": "de-2",
    "code": "HK1-02",
    "title": "ĐỀ SỐ 2: KIỂM TRA HỌC KÌ 1 — NÂNG CAO & PHÂN HÓA",
    "subtitle": "Chương trình Tiếng Anh 9 Global Success • Mức độ Vận dụng & Bẫy Đề Thi Điểm 8-9-10",
    "description": "Phân loại năng lực học sinh giỏi với các bẫy ngữ pháp tinh vi của 6 Unit: whether to V, less vs fewer với danh từ trừu tượng, phối hợp thì phức, cấu trúc used to vs be used to V-ing, các biến thể của động từ nhớ/quên (remember to V vs V-ing), phrasal verbs nâng cao.",
    "durationMinutes": 60,
    "totalQuestions": 40,
    "difficulty": "Nâng cao - Phân hóa",
    "badgeColor": "amber",
    "questions": [
        # PHẦN I: PHONETICS (1-4)
        {
            "id": 1,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. b<u>a</u>lance &nbsp;&nbsp;&nbsp;&nbsp; B. h<u>a</u>ndicraft &nbsp;&nbsp;&nbsp;&nbsp; C. <u>a</u>rtisan &nbsp;&nbsp;&nbsp;&nbsp; D. f<u>a</u>scinate",
            "options": [
                {"id": "A", "content": "balance"},
                {"id": "B", "content": "handicraft"},
                {"id": "C", "content": "artisan"},
                {"id": "D", "content": "fascinate"}
            ],
            "correctAnswer": "C",
            "explanation": "Chữ cái 'a' trong 'artisan' phát âm là /ɑː/ /ˈɑːtɪzæn/. Trong các từ còn lại phát âm là /æ/: balance /ˈbæləns/, handicraft /ˈhændikrɑːft/, fascinate /ˈfæsɪneɪt/.",
            "translation": "artisan đọc là /ɑː/, các từ còn lại đọc là /æ/.",
            "unitTopic": "Phonetics: Nguyên âm /æ/ vs /ɑː/"
        },
        {
            "id": 2,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. pres<u>e</u>rve &nbsp;&nbsp;&nbsp;&nbsp; B. m<u>e</u>tro &nbsp;&nbsp;&nbsp;&nbsp; C. m<u>e</u>morable &nbsp;&nbsp;&nbsp;&nbsp; D. br<u>e</u>adth",
            "options": [
                {"id": "A", "content": "preserve"},
                {"id": "B", "content": "metro"},
                {"id": "C", "content": "memorable"},
                {"id": "D", "content": "breadth"}
            ],
            "correctAnswer": "A",
            "explanation": "Chữ 'e' trong 'preserve' phát âm là /ɪ/ /prɪˈzɜːv/. Trong các từ còn lại phát âm là /e/: metro /ˈmetrəʊ/, memorable /ˈmemərəbl/, breadth /bredθ/.",
            "translation": "preserve đọc là /ɪ/, các từ còn lại đọc là /e/.",
            "unitTopic": "Phonetics: Nguyên âm /ɪ/ vs /e/"
        },
        {
            "id": 3,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. congestion &nbsp;&nbsp;&nbsp;&nbsp; B. counselor &nbsp;&nbsp;&nbsp;&nbsp; C. seniority &nbsp;&nbsp;&nbsp;&nbsp; D. convenience",
            "options": [
                {"id": "A", "content": "congestion"},
                {"id": "B", "content": "counselor"},
                {"id": "C", "content": "seniority"},
                {"id": "D", "content": "convenience"}
            ],
            "correctAnswer": "C",
            "explanation": "'Seniority' /ˌsiːniˈɒrəti/ có đuôi -ity nên trọng âm rơi vào âm tiết thứ 3. Các từ congestion /kənˈdʒestʃən/, convenience /kənˈviːniəns/ rơi vào âm tiết thứ 2; counselor /ˈkaʊnsələ/ rơi vào âm 1. Tuy nhiên câu hỏi chuẩn phân hóa: seniority có 4 âm tiết, rơi vào âm 3.",
            "translation": "seniority (âm 3); các từ còn lại âm 2 hoặc âm 1.",
            "unitTopic": "Stress: Trọng âm hậu tố -ity"
        },
        {
            "id": 4,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. illiterate &nbsp;&nbsp;&nbsp;&nbsp; B. cosmopolitan &nbsp;&nbsp;&nbsp;&nbsp; C. affordable &nbsp;&nbsp;&nbsp;&nbsp; D. community",
            "options": [
                {"id": "A", "content": "illiterate"},
                {"id": "B", "content": "cosmopolitan"},
                {"id": "C", "content": "affordable"},
                {"id": "D", "content": "community"}
            ],
            "correctAnswer": "B",
            "explanation": "'Cosmopolitan' /ˌkɒzməˈpɒlɪtən/ có trọng âm chính rơi vào âm tiết thứ 3. Các từ còn lại có trọng âm rơi vào âm tiết thứ 2: illiterate /ɪˈlɪtərət/, affordable /əˈfɔːdəbl/, community /kəˈmjuːnəti/.",
            "translation": "cosmopolitan (âm 3); illiterate, affordable, community (âm 2).",
            "unitTopic": "Stress: Trọng âm từ 4 âm tiết"
        },

        # PHẦN II: NGỮ PHÁP & TỪ VỰNG (5-18)
        {
            "id": 5,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The backpackers debated ______ or not to hire a local guide before trekking into the misty mountain forest.",
            "options": [
                {"id": "A", "content": "whether"},
                {"id": "B", "content": "if"},
                {"id": "C", "content": "why to"},
                {"id": "D", "content": "what"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: 'whether + or not + to V' hoặc 'whether to V or not'. Từ 'if' KHÔNG BAO GIỜ đi trực tiếp với 'to V' hay đứng ngay trước 'or not'.",
            "translation": "Những người du lịch bụi đã tranh luận liệu có nên thuê hướng dẫn viên địa phương trước khi đi vào rừng núi sương mù hay không.",
            "unitTopic": "Unit 1: Whether + to V"
        },
        {
            "id": 6,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "This exquisite bronze incense burner has been ______ in our family as a sacred heirloom for over two centuries.",
            "options": [
                {"id": "A", "content": "handed down"},
                {"id": "B", "content": "turned down"},
                {"id": "C", "content": "run out"},
                {"id": "D", "content": "brought up"}
            ],
            "correctAnswer": "A",
            "explanation": "'Hand down' = lưu truyền lại di sản, gia bảo qua các thế hệ. 'Turn down' = từ chối; 'Run out' = cạn kiệt; 'Bring up' = nuôi nấng.",
            "translation": "Chiếc lư hương bằng đồng tinh xảo này đã được lưu truyền lại trong gia đình chúng tôi như một kỷ vật thiêng liêng qua hơn hai thế kỷ.",
            "unitTopic": "Unit 1: Phrasal verbs - Hand down"
        },
        {
            "id": 7,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The ______ densely populated an urban center becomes, the ______ green public parks are available for young children.",
            "options": [
                {"id": "A", "content": "more / fewer"},
                {"id": "B", "content": "most / less"},
                {"id": "C", "content": "more / less"},
                {"id": "D", "content": "more / lesser"}
            ],
            "correctAnswer": "A",
            "explanation": "Densely là trạng từ ➔ The more densely populated. 'Green public parks' là danh từ đếm được số nhiều ➔ dùng 'fewer' (không dùng less).",
            "translation": "Một trung tâm đô thị càng đông dân cư thì càng có ít công viên công cộng xanh cho trẻ nhỏ.",
            "unitTopic": "Unit 2: Double comparative with fewer"
        },
        {
            "id": 8,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "We almost ______ clean drinking water on the second day of our arduous mountain trek.",
            "options": [
                {"id": "A", "content": "ran out of"},
                {"id": "B", "content": "cut down on"},
                {"id": "C", "content": "looked back on"},
                {"id": "D", "content": "got on with"}
            ],
            "correctAnswer": "A",
            "explanation": "'Run out of' = cạn kiệt, hết sạch (nước, tiền, pin). 'Cut down on' = cắt giảm.",
            "translation": "Chúng tôi suýt nữa đã hết sạch nước uống sạch vào ngày thứ hai của chuyến đi bộ vượt núi gian khổ.",
            "unitTopic": "Unit 2: Phrasal verb 'run out of'"
        },
        {
            "id": 9,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Unless teenagers ______ regular physical exercise, their immune defenses ______ easily deteriorate.",
            "options": [
                {"id": "A", "content": "take / may"},
                {"id": "B", "content": "don't take / will"},
                {"id": "C", "content": "took / could"},
                {"id": "D", "content": "takes / can"}
            ],
            "correctAnswer": "A",
            "explanation": "Sau Unless động từ chia khẳng định ở hiện tại đơn (teenagers số nhiều ➔ take). Vế chính dùng modal verb chỉ khả năng: 'may deteriorate'.",
            "translation": "Trừ khi thanh thiếu niên tập thể dục thể chất đều đặn, nếu không khả năng miễn dịch của các em có thể dễ dàng suy giảm.",
            "unitTopic": "Unit 3: Unless with Modal Verbs"
        },
        {
            "id": 10,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "It is often challenging for adolescents to ______ harsh peer judgment and overwhelming parental expectations.",
            "options": [
                {"id": "A", "content": "cope with"},
                {"id": "B", "content": "give in"},
                {"id": "C", "content": "stay up"},
                {"id": "D", "content": "pass down"}
            ],
            "correctAnswer": "A",
            "explanation": "'Cope with' = đương đầu, đối phó thành công với áp lực và khó khăn.",
            "translation": "Thường rất khó khăn cho thanh thiếu niên để đối phó với những phán xét gay gắt của bạn bè và kỳ vọng quá lớn của cha mẹ.",
            "unitTopic": "Unit 3: Phrasal verb 'cope with'"
        },
        {
            "id": 11,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The villagers wish the local authorities ______ their century-old communal banyan tree instead of cutting it down.",
            "options": [
                {"id": "A", "content": "had preserved / would preserve"},
                {"id": "B", "content": "preserved"},
                {"id": "C", "content": "preserve"},
                {"id": "D", "content": "will preserve"}
            ],
            "correctAnswer": "B",
            "explanation": "Câu ước muốn trái với hiện tại hoặc thói quen hiện tại: S + wish + S + V2/ed ➔ preserved.",
            "translation": "Dân làng ước rằng chính quyền địa phương gìn giữ cây đa cổ thụ hàng trăm năm tuổi thay vì chặt hạ nó.",
            "unitTopic": "Unit 4: Wish for present"
        },
        {
            "id": 12,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "What exactly ______ when the sudden black-out occurred throughout the entire district yesterday evening?",
            "options": [
                {"id": "A", "content": "were you doing"},
                {"id": "B", "content": "did you do"},
                {"id": "C", "content": "are you doing"},
                {"id": "D", "content": "had you done"}
            ],
            "correctAnswer": "A",
            "explanation": "Hỏi về hành động đang diễn ra tại thời điểm quá khứ khi có sự việc khác cắt ngang ➔ Quá khứ tiếp diễn: 'were you doing'.",
            "translation": "Chính xác thì bạn đang làm gì khi sự cố mất điện đột ngột xảy ra trên toàn quận vào tối hôm qua?",
            "unitTopic": "Unit 4: Past continuous question"
        },
        {
            "id": 13,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Coming from a tranquil rural village, Minh found it extremely tough to get used to ______ in such a bustling metropolis.",
            "options": [
                {"id": "A", "content": "living"},
                {"id": "B", "content": "live"},
                {"id": "C", "content": "lived"},
                {"id": "D", "content": "be living"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc 'get used to + V-ing' = dần quen với việc gì. Phân biệt với 'used to + V_bare' (đã từng).",
            "translation": "Đến từ một ngôi làng nông thôn yên bình, Minh thấy vô cùng khó khăn để quen với việc sống ở một đại đô thị nhộn nhịp như vậy.",
            "unitTopic": "Unit 4: Be/Get used to + V-ing"
        },
        {
            "id": 14,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "This is the very first time that our class ______ in such a fascinating environmental cleanup campaign.",
            "options": [
                {"id": "A", "content": "has ever taken part"},
                {"id": "B", "content": "ever took part"},
                {"id": "C", "content": "was taking part"},
                {"id": "D", "content": "had ever taken part"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc trải nghiệm lần đầu tiên: 'It/This is the first time + S + have/has + V3/ed'.",
            "translation": "Đây là lần đầu tiên lớp chúng tôi tham gia vào một chiến dịch dọn sạch môi trường hấp dẫn đến vậy.",
            "unitTopic": "Unit 5: Present Perfect with 'first time'"
        },
        {
            "id": 15,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Mr. Brown knows Da Nang inside out because he ______ there on vacation at least five times.",
            "options": [
                {"id": "A", "content": "has been to"},
                {"id": "B", "content": "has gone to"},
                {"id": "C", "content": "went to"},
                {"id": "D", "content": "is going to"}
            ],
            "correctAnswer": "A",
            "explanation": "'Has been to' = đã từng đến đó và đã về (diễn tả trải nghiệm 5 lần trong đời).",
            "translation": "Ông Brown hiểu rõ Đà Nẵng đến từng ngóc ngách vì ông đã từng đến đó nghỉ dưỡng ít nhất năm lần.",
            "unitTopic": "Unit 5: Have been to vs Have gone to"
        },
        {
            "id": 16,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Hoang has broadened his cultural outlook immensely ______ he joined the international youth exchange program.",
            "options": [
                {"id": "A", "content": "since"},
                {"id": "B", "content": "for"},
                {"id": "C", "content": "when"},
                {"id": "D", "content": "until"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: S + have/has V3 + SINCE + S + V(quá khứ đơn). Mệnh đề sau since là 'he joined...'.",
            "translation": "Hoàng đã mở rộng tầm nhìn văn hóa của mình rất nhiều kể từ khi cậu ấy tham gia chương trình trao đổi thanh niên quốc tế.",
            "unitTopic": "Unit 5: Present perfect with since + clause"
        },
        {
            "id": 17,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Students should avoid ______ solely on artificial intelligence tools without exercising their own critical thinking.",
            "options": [
                {"id": "A", "content": "relying"},
                {"id": "B", "content": "to rely"},
                {"id": "C", "content": "rely"},
                {"id": "D", "content": "to relying"}
            ],
            "correctAnswer": "A",
            "explanation": "Sau động từ 'avoid' bắt buộc là V-ing: avoid relying on.",
            "translation": "Học sinh nên tránh việc chỉ phụ thuộc vào các công cụ trí tuệ nhân tạo mà không tự rèn luyện tư duy phản biện.",
            "unitTopic": "Unit 6: Verbs + V-ing"
        },
        {
            "id": 18,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Before locking the doors of the science club, please remember ______ off all high-power electrical circuits.",
            "options": [
                {"id": "A", "content": "to switch"},
                {"id": "B", "content": "switching"},
                {"id": "C", "content": "switch"},
                {"id": "D", "content": "to switching"}
            ],
            "correctAnswer": "A",
            "explanation": "'Remember to V' = nhớ phải làm bổn phận, nhiệm vụ trong tương lai. 'Remember V-ing' = nhớ đã làm gì trong quá khứ.",
            "translation": "Trước khi khóa cửa câu lạc bộ khoa học, xin hãy nhớ tắt tất cả các mạch điện công suất cao.",
            "unitTopic": "Unit 6: Remember to-V vs Remember V-ing"
        },

        # PHẦN III: GIAO TIẾP XÃ HỘI (19-20)
        {
            "id": 19,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Mark: \"I feel like I'm running out of time to review all 12 units before the entrance exam!\"<br>Teacher: \"______\"",
            "options": [
                {"id": "A", "content": "Don't panic. If you prioritize the core grammar formulas first, you can manage your time effectively."},
                {"id": "B", "content": "You must give up studying English immediately."},
                {"id": "C", "content": "I wish you didn't have to take the exam."},
                {"id": "D", "content": "It is true that time runs faster than a train."}
            ],
            "correctAnswer": "A",
            "explanation": "Lời động viên và khuyên bảo thiết thực của giáo viên phù hợp với ngữ cảnh căng thẳng thi cử.",
            "translation": "Mark: 'Em cảm thấy mình sắp hết thời gian để ôn lại 12 bài trước kỳ thi!' - Giáo viên: 'Đừng hoảng loạn. Nếu em ưu tiên các công thức ngữ pháp cốt lõi trước, em có thể quản lý thời gian hiệu quả.'",
            "unitTopic": "Social Communication: Exam guidance"
        },
        {
            "id": 20,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Visitor: \"These hand-painted ceramic bowls look magnificent! Did local artisans craft them?\"<br>Shop owner: \"______\"",
            "options": [
                {"id": "A", "content": "Yes, every single piece is handcrafted by our master artisans right in this village."},
                {"id": "B", "content": "No, you cannot touch them because they are very cheap."},
                {"id": "C", "content": "I wish they were not made of clay."},
                {"id": "D", "content": "You should cut down on looking at them."}
            ],
            "correctAnswer": "A",
            "explanation": "Câu trả lời lịch sự và tự hào của chủ xưởng gốm về sản phẩm thủ công địa phương.",
            "translation": "Du khách: 'Những chiếc bát gốm vẽ tay này trông thật tráng lệ! Có phải nghệ nhân địa phương làm ra không?' - Chủ xưởng: 'Vâng, từng sản phẩm đều được làm thủ công bởi các nghệ nhân bậc thầy ngay tại làng này.'",
            "unitTopic": "Social Communication: Craft appreciation"
        },

        # PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST) (21-25)
        {
            "id": 21,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
            "readingText": "Urbanization has brought remarkable transformations to major Vietnamese cities like Hanoi and Ho Chi Minh City. As populations expand rapidly, local governments are investing heavily in modern public infrastructure to relieve chronic traffic (21)______. The completion of elevated skytrains and underground metro lines has provided commuters with a clean, fast, and (22)______ alternative to private motorbikes. In addition, more green parks and pedestrian zones have been created to make city life more (23)______ for young families. Environmental campaigns also encourage citizens to (24)______ on single-use plastics and save electricity. Furthermore, municipal authorities are organizing regular community workshops where residents learn (25)______ to sort household waste effectively. These joint efforts ensure that economic growth goes hand in hand with environmental preservation.",
            "content": "Chọn từ thích hợp cho chỗ trống (21):",
            "options": [
                {"id": "A", "content": "congestion"},
                {"id": "B", "content": "lifestyle"},
                {"id": "C", "content": "counselor"},
                {"id": "D", "content": "seniority"}
            ],
            "correctAnswer": "A",
            "explanation": "'Traffic congestion' = sự tắc nghẽn giao thông.",
            "translation": "relieve chronic traffic congestion (giảm bớt tình trạng ùn tắc giao thông kinh niên).",
            "unitTopic": "Cloze Test: Unit 2"
        },
        {
            "id": 22,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (22):",
            "content": "Chọn từ thích hợp cho chỗ trống (22):",
            "options": [
                {"id": "A", "content": "affordable"},
                {"id": "B", "content": "illiterate"},
                {"id": "C", "content": "barefoot"},
                {"id": "D", "content": "stressful"}
            ],
            "correctAnswer": "A",
            "explanation": "'Affordable' = giá cả phải chăng, vừa túi tiền của người dân đi làm.",
            "translation": "a clean, fast, and affordable alternative (một giải pháp thay thế sạch, nhanh và giá cả phải chăng).",
            "unitTopic": "Cloze Test: Unit 2"
        },
        {
            "id": 23,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (23):",
            "content": "Chọn từ thích hợp cho chỗ trống (23):",
            "options": [
                {"id": "A", "content": "liveable"},
                {"id": "B", "content": "livelihood"},
                {"id": "C", "content": "living"},
                {"id": "D", "content": "live"}
            ],
            "correctAnswer": "A",
            "explanation": "Cần tính từ 'liveable' (đáng sống) để bổ nghĩa cho cụm 'city life'.",
            "translation": "make city life more liveable (làm cho cuộc sống thành phố đáng sống hơn).",
            "unitTopic": "Cloze Test: Unit 2"
        },
        {
            "id": 24,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (24):",
            "content": "Chọn từ thích hợp cho chỗ trống (24):",
            "options": [
                {"id": "A", "content": "cut down"},
                {"id": "B", "content": "run out"},
                {"id": "C", "content": "pass down"},
                {"id": "D", "content": "give up"}
            ],
            "correctAnswer": "A",
            "explanation": "'Cut down on' = cắt giảm việc tiêu thụ đồ nhựa dùng một lần.",
            "translation": "cut down on single-use plastics (cắt giảm đồ nhựa dùng một lần).",
            "unitTopic": "Cloze Test: Unit 2"
        },
        {
            "id": 25,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (25):",
            "content": "Chọn từ thích hợp cho chỗ trống (25):",
            "options": [
                {"id": "A", "content": "how"},
                {"id": "B", "content": "why"},
                {"id": "C", "content": "which"},
                {"id": "D", "content": "where to sorting"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: 'learn how to sort' = học cách phân loại rác thải gia đình.",
            "translation": "learn how to sort household waste (học cách phân loại rác thải).",
            "unitTopic": "Cloze Test: Unit 1"
        },

        # PHẦN V: ĐỌC HIỂU VĂN BẢN (26-30)
        {
            "id": 26,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
            "readingText": "Adolescence is a transformative period marked by rapid physical, cognitive, and emotional development. However, modern teenagers face unprecedented pressures that previous generations rarely encountered. Heavy academic workloads, intense entrance exam competition, and round-the-clock connectivity on social media platforms can trigger chronic anxiety and sleep deprivation. Many ninth graders admit to staying up late past midnight, sacrificing essential rest to cram for tests or scroll through smartphone feeds.<br><br>Psychological researchers emphasize that sustained mental well-being requires a holistic approach to daily life. First and foremost, teenagers need a well-balanced diet rich in leafy vegetables, lean proteins, and omega-3 fatty acids, which fuel brain functioning and stabilize emotional moods. Second, regular physical activity is an extraordinarily potent stress reliever. Engaging in moderate sports such as swimming, basketball, or jogging for 45 minutes triggers the release of endorphins—natural hormones that uplift spirits and improve memory retention.<br><br>Equally crucial is open emotional communication. Instead of bottling up anxiety, teens should be encouraged to confide in trustworthy adults, whether they are empathetic parents, dedicated teachers, or professional school counselors. Schools that establish psychological counseling offices have reported significant reductions in student distress. Ultimately, academic excellence should never be pursued at the expense of a child's mental and physical health. Learning how to cope with stress early in life equips young people with resilience that will serve them well into adulthood.",
            "content": "What is the primary purpose of the passage?",
            "options": [
                {"id": "A", "content": "To examine causes of teenage stress and suggest holistic healthy living solutions"},
                {"id": "B", "content": "To criticize schools for assigning too much homework to students"},
                {"id": "C", "content": "To explain the history of entrance examinations in secondary schools"},
                {"id": "D", "content": "To advise teenagers to stop using smartphones permanently"}
            ],
            "correctAnswer": "A",
            "explanation": "Toàn bài phân tích áp lực của thanh thiếu niên hiện đại và đề xuất các giải pháp toàn diện về dinh dưỡng, thể thao và tư vấn tâm lý.",
            "translation": "Mục đích chính: Khảo sát nguyên nhân gây căng thẳng ở tuổi teen và đề xuất giải pháp lối sống lành mạnh.",
            "unitTopic": "Reading Comprehension: Main Purpose Unit 3"
        },
        {
            "id": 27,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "According to paragraph 1, what is a primary cause of chronic anxiety among modern ninth graders?",
            "options": [
                {"id": "A", "content": "Heavy academic workloads and round-the-clock social media connectivity"},
                {"id": "B", "content": "Lack of nutritious food in school canteens"},
                {"id": "C", "content": "Having to walk barefoot to school every morning"},
                {"id": "D", "content": "Disagreements over extended family traditions"}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn 1 nêu: 'Heavy academic workloads, intense entrance exam competition, and round-the-clock connectivity on social media platforms can trigger chronic anxiety...'",
            "translation": "Khối lượng bài vở nặng nề và sự kết nối mạng xã hội suốt ngày đêm.",
            "unitTopic": "Reading Comprehension: Detail Unit 3"
        },
        {
            "id": 28,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "The word \"potent\" in paragraph 2 is closest in meaning to ______.",
            "options": [
                {"id": "A", "content": "powerful and effective"},
                {"id": "B", "content": "ancient and traditional"},
                {"id": "C", "content": "dangerous and harmful"},
                {"id": "D", "content": "expensive"}
            ],
            "correctAnswer": "A",
            "explanation": "'Potent' = mạnh mẽ, có tác dụng mạnh (= powerful and effective).",
            "translation": "potent = có hiệu quả mạnh mẽ.",
            "unitTopic": "Reading Comprehension: Vocabulary in context"
        },
        {
            "id": 29,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "Which physical benefit of regular sports activity is explicitly mentioned in paragraph 2?",
            "options": [
                {"id": "A", "content": "Triggering the release of endorphins that uplift mood and improve memory"},
                {"id": "B", "content": "Allowing students to skip nutritious meals"},
                {"id": "C", "content": "Helping students become professional athletes"},
                {"id": "D", "content": "Reducing the need for sleep to only four hours per night"}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn 2 nêu rõ: 'triggers the release of endorphins—natural hormones that uplift spirits and improve memory retention.'",
            "translation": "Kích hoạt việc tiết ra endorphin giúp nâng cao tinh thần và cải thiện trí nhớ.",
            "unitTopic": "Reading Comprehension: Detail Unit 3"
        },
        {
            "id": 30,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "What can be inferred from the final paragraph?",
            "options": [
                {"id": "A", "content": "Learning stress management early provides valuable resilience for later life."},
                {"id": "B", "content": "High exam marks are always more important than mental health."},
                {"id": "C", "content": "School counselors should assign grades to students."},
                {"id": "D", "content": "Parents should never discuss exam scores with their children."}
            ],
            "correctAnswer": "A",
            "explanation": "Câu kết đoạn cuối khẳng định: 'Learning how to cope with stress early in life equips young people with resilience that will serve them well into adulthood.'",
            "translation": "Học cách quản lý căng thẳng sớm giúp trang bị sự kiên cường quý giá cho cuộc sống sau này.",
            "unitTopic": "Reading Comprehension: Inference Unit 3"
        },

        # PHẦN VI: TÌM LỖI SAI (31-34)
        {
            "id": 31,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "The foreign tourist <u>wondered</u> (A) <u>why to hire</u> (B) a local guide when there was already a digital map <u>available</u> (C) on <u>his smartphone</u> (D).",
            "options": [
                {"id": "A", "content": "wondered"},
                {"id": "B", "content": "why to hire"},
                {"id": "C", "content": "available"},
                {"id": "D", "content": "his smartphone"}
            ],
            "correctAnswer": "B",
            "explanation": "Bẫy điểm liệt: 'Why' không bao giờ đi với 'to V'. Phải sửa thành: 'why he should hire' hoặc 'whether to hire'.",
            "translation": "Sửa 'why to hire' thành 'why he should hire'.",
            "unitTopic": "Unit 1: Trap of why + to V"
        },
        {
            "id": 32,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "The more <u>rapidly</u> (A) the city develops, the <u>less</u> (B) green <u>public parks</u> (C) are reserved for <u>recreational activities</u> (D).",
            "options": [
                {"id": "A", "content": "rapidly"},
                {"id": "B", "content": "less"},
                {"id": "C", "content": "public parks"},
                {"id": "D", "content": "recreational activities"}
            ],
            "correctAnswer": "B",
            "explanation": "'Public parks' là danh từ đếm được số nhiều ➔ Phải dùng 'fewer', không được dùng 'less' (less chỉ đi với danh từ không đếm được).",
            "translation": "Sửa 'less' thành 'fewer'.",
            "unitTopic": "Unit 2: Less vs Fewer in Double Comparative"
        },
        {
            "id": 33,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "Unless you <u>don't reduce</u> (A) your daily screen time, you <u>will suffer</u> (B) from <u>chronic headaches</u> (C) and severe <u>eye fatigue</u> (D).",
            "options": [
                {"id": "A", "content": "don't reduce"},
                {"id": "B", "content": "will suffer"},
                {"id": "C", "content": "chronic headaches"},
                {"id": "D", "content": "eye fatigue"}
            ],
            "correctAnswer": "A",
            "explanation": "Unless = If not. Sau Unless mệnh đề luôn ở thể khẳng định. Dùng 'don't reduce' là lỗi phủ định hai lần sai ngữ pháp nghiêm trọng.",
            "translation": "Sửa 'don't reduce' thành 'reduce'.",
            "unitTopic": "Unit 3: Unless double negative trap"
        },
        {
            "id": 34,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "Although she was exhausted after the marathon, she <u>distinctly</u> (A) remembered <u>to lock</u> (B) the front door <u>before leaving</u> (C) the <u>house</u> (D).",
            "options": [
                {"id": "A", "content": "distinctly"},
                {"id": "B", "content": "to lock"},
                {"id": "C", "content": "before leaving"},
                {"id": "D", "content": "house"}
            ],
            "correctAnswer": "B",
            "explanation": "Nhớ ĐÃ LÀM việc gì trong quá khứ ➔ dùng 'remember V-ing' (remembered locking). 'Remember to V' là nhớ PHẢI làm bổn phận.",
            "translation": "Sửa 'to lock' thành 'locking'.",
            "unitTopic": "Unit 6: Remember to V vs Remember V-ing"
        },

        # PHẦN VII: VIẾT LẠI CÂU (35-40)
        {
            "id": 35,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "They didn't know who they should consult for professional mental health advice.",
            "options": [
                {"id": "A", "content": "They didn't know who to consult for professional mental health advice."},
                {"id": "B", "content": "They didn't know who consulting for professional mental health advice."},
                {"id": "C", "content": "They didn't know who should consult for professional mental health advice."},
                {"id": "D", "content": "They didn't know why to consult for professional mental health advice."}
            ],
            "correctAnswer": "A",
            "explanation": "Rút gọn mệnh đề: 'who they should consult' ➔ 'who to consult'.",
            "translation": "Họ không biết phải tham vấn ai để nhận lời khuyên sức khỏe tinh thần chuyên nghiệp.",
            "unitTopic": "Unit 1: Wh- + to V transformation"
        },
        {
            "id": 36,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "If the city air is more polluted, it is harder for elderly residents to breathe.",
            "options": [
                {"id": "A", "content": "The more polluted the city air is, the harder it is for elderly residents to breathe."},
                {"id": "B", "content": "The polluted the city air is, the harder it is for elderly residents to breathe."},
                {"id": "C", "content": "The more polluted is the city air, the harder it is for elderly residents to breathe."},
                {"id": "D", "content": "The most polluted the city air is, the most hard it is for elderly residents to breathe."}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc So sánh kép: The + comp + S1 + V1, the + comp + S2 + V2. Giữ nguyên trật tự S + V.",
            "translation": "Không khí thành phố càng ô nhiễm thì người cao tuổi càng khó thở hơn.",
            "unitTopic": "Unit 2: Double comparative transformation"
        },
        {
            "id": 37,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "If you do not cut down on excessive screen time, you will suffer from chronic eye strain.",
            "options": [
                {"id": "A", "content": "Unless you cut down on excessive screen time, you will suffer from chronic eye strain."},
                {"id": "B", "content": "Unless you don't cut down on excessive screen time, you will suffer from chronic eye strain."},
                {"id": "C", "content": "Unless you cut down on screen time, you won't suffer from eye strain."},
                {"id": "D", "content": "If you cut down on excessive screen time, you will suffer from chronic eye strain."}
            ],
            "correctAnswer": "A",
            "explanation": "If... not ➔ Unless + mệnh đề khẳng định. Đảm bảo nghĩa giữ nguyên.",
            "translation": "Trừ khi bạn cắt giảm thời gian nhìn màn hình quá mức, nếu không bạn sẽ bị mỏi mắt mãn tính.",
            "unitTopic": "Unit 3: Unless transformation"
        },
        {
            "id": 38,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "My sister no longer plays traditional folk games like tug of war with village children.",
            "options": [
                {"id": "A", "content": "My sister used to play traditional folk games like tug of war with village children."},
                {"id": "B", "content": "My sister is used to playing traditional folk games like tug of war with village children."},
                {"id": "C", "content": "My sister used to playing traditional folk games like tug of war with village children."},
                {"id": "D", "content": "My sister didn't use to play traditional folk games anymore."}
            ],
            "correctAnswer": "A",
            "explanation": "S + no longer + V(hiện tại) ➔ S + used to + V_bare (đã từng).",
            "translation": "Chị gái tôi đã từng chơi các trò chơi dân gian truyền thống như kéo co cùng trẻ con trong làng.",
            "unitTopic": "Unit 4: Used to transformation"
        },
        {
            "id": 39,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "The artisan began carving traditional wooden masks five years ago.",
            "options": [
                {"id": "A", "content": "The artisan has carved traditional wooden masks for five years."},
                {"id": "B", "content": "The artisan carved traditional wooden masks since five years."},
                {"id": "C", "content": "The artisan has been carving traditional wooden masks since five years ago."},
                {"id": "D", "content": "It is five years when the artisan started carving traditional wooden masks."}
            ],
            "correctAnswer": "A",
            "explanation": "S + began/started + V-ing + [time] ago ➔ S + have/has V3/ed + for + [time].",
            "translation": "Người nghệ nhân đã điêu khắc mặt nạ gỗ truyền thống được năm năm nay rồi.",
            "unitTopic": "Unit 5: Present Perfect transformation"
        },
        {
            "id": 40,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "It took the foreign exchange students two weeks to get on with their local host family.",
            "options": [
                {"id": "A", "content": "The foreign exchange students spent two weeks getting on with their local host family."},
                {"id": "B", "content": "The foreign exchange students spent two weeks to get on with their local host family."},
                {"id": "C", "content": "The foreign exchange students took two weeks getting on with their local host family."},
                {"id": "D", "content": "It spent two weeks for the foreign exchange students to get on with their host family."}
            ],
            "correctAnswer": "A",
            "explanation": "It took + O + time + to V ➔ S + spent + time + V-ing.",
            "translation": "Các du học sinh trao đổi đã mất hai tuần để hòa hợp với gia đình người bản xứ.",
            "unitTopic": "Unit 6: Spend time V-ing transformation"
        }
    ]
}

print("Exam 2 built successfully (40 questions).")
