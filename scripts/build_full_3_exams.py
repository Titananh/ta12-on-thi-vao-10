import json
import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
TS_OUTPUT_FILE = os.path.join(PROJECT_DIR, "src", "data", "exams_hk1.ts")
BO_DIR = os.path.join(PROJECT_DIR, "BO_TAI_LIEU_ON_THI_VAO_10")
HTML_OUTPUT_FILE = os.path.join(BO_DIR, "03_bo_3_de_kiem_tra_6_unit_dau.html")
PDF_OUTPUT_FILE = os.path.join(BO_DIR, "03_BO_3_DE_KIEM_TRA_6_UNIT_DAU_GLOBAL_SUCCESS_9.pdf")

EXAM_1 = {
    "id": "de-1",
    "code": "HK1-01",
    "title": "ĐỀ SỐ 1: KIỂM TRA HỌC KÌ 1 — 6 UNIT ĐẦU",
    "subtitle": "Chương trình Tiếng Anh 9 Global Success • Mức độ Cơ bản & Trọng tâm",
    "description": "Bao phủ toàn diện kiến thức cốt lõi từ Unit 1 đến Unit 6: Wh- + to V, So sánh kép, Câu điều kiện loại 1, Quá khứ tiếp diễn, Câu ước Wish, Hiện tại hoàn thành, Dạng động từ to-V / V-ing, Từ vựng & Cụm động từ đời sống.",
    "durationMinutes": 60,
    "totalQuestions": 40,
    "difficulty": "Cơ bản - Trọng tâm",
    "badgeColor": "emerald",
    "questions": [
        # PHẦN I: PHONETICS (1-4)
        {
            "id": 1,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. pass<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; B. want<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; C. look<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; D. stopp<u>ed</u>",
            "options": [
                {"id": "A", "content": "passed"},
                {"id": "B", "content": "wanted"},
                {"id": "C", "content": "looked"},
                {"id": "D", "content": "stopped"}
            ],
            "correctAnswer": "B",
            "explanation": "Đuôi '-ed' trong 'wanted' phát âm là /ɪd/ (sau âm /t/). Trong các từ còn lại phát âm là /t/ vì tận cùng là âm vô thanh (/s/, /k/, /p/).",
            "translation": "Quy tắc đuôi -ed: 'wanted' đọc là /ˈwɒntɪd/, các từ còn lại đọc là /pɑːst/, /lʊkt/, /stɒpt/.",
            "unitTopic": "Phonetics: Phát âm đuôi -ed"
        },
        {
            "id": 2,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. craft<u>s</u> &nbsp;&nbsp;&nbsp;&nbsp; B. pot<u>s</u> &nbsp;&nbsp;&nbsp;&nbsp; C. helper<u>s</u> &nbsp;&nbsp;&nbsp;&nbsp; D. laugh<u>s</u>",
            "options": [
                {"id": "A", "content": "crafts"},
                {"id": "B", "content": "pots"},
                {"id": "C", "content": "helpers"},
                {"id": "D", "content": "laughs"}
            ],
            "correctAnswer": "C",
            "explanation": "Đuôi '-s' trong 'helpers' phát âm là /z/ (sau nguyên âm /ə/). Trong các từ còn lại phát âm là /s/ vì tận cùng là các âm vô thanh /t/, /f/.",
            "translation": "crafts /krɑːfts/, pots /pɒts/, laughs /lɑːfs/, helpers /ˈhelpəz/.",
            "unitTopic": "Phonetics: Phát âm đuôi -s/-es"
        },
        {
            "id": 3,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. metro &nbsp;&nbsp;&nbsp;&nbsp; B. balance &nbsp;&nbsp;&nbsp;&nbsp; C. preserve &nbsp;&nbsp;&nbsp;&nbsp; D. village",
            "options": [
                {"id": "A", "content": "metro"},
                {"id": "B", "content": "balance"},
                {"id": "C", "content": "preserve"},
                {"id": "D", "content": "village"}
            ],
            "correctAnswer": "C",
            "explanation": "'Preserve' là động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 2 /prɪˈzɜːv/. Các từ còn lại là danh từ 2 âm tiết có trọng âm rơi vào âm tiết 1: metro /ˈmetrəʊ/, balance /ˈbæləns/, village /ˈvɪlɪdʒ/.",
            "translation": "preserve (âm 2); metro, balance, village (âm 1).",
            "unitTopic": "Stress: Trọng âm từ 2 âm tiết"
        },
        {
            "id": 4,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. nutritious &nbsp;&nbsp;&nbsp;&nbsp; B. difficult &nbsp;&nbsp;&nbsp;&nbsp; C. memory &nbsp;&nbsp;&nbsp;&nbsp; D. fascinate",
            "options": [
                {"id": "A", "content": "nutritious"},
                {"id": "B", "content": "difficult"},
                {"id": "C", "content": "memory"},
                {"id": "D", "content": "fascinate"}
            ],
            "correctAnswer": "A",
            "explanation": "'Nutritious' có đuôi -ious, trọng âm rơi vào âm tiết liền trước nó: /njuːˈtrɪʃəs/ (âm tiết 2). Các từ còn lại trọng âm rơi vào âm tiết 1: difficult /ˈdɪfɪkəlt/, memory /ˈmeməri/, fascinate /ˈfæsɪneɪt/.",
            "translation": "nutritious (âm 2); difficult, memory, fascinate (âm 1).",
            "unitTopic": "Stress: Trọng âm từ 3 âm tiết"
        },

        # PHẦN II: NGỮ PHÁP & TỪ VỰNG (5-18)
        {
            "id": 5,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Could you please tell me ______ to buy authentic Bat Trang pottery in Hanoi?",
            "options": [
                {"id": "A", "content": "where"},
                {"id": "B", "content": "why"},
                {"id": "C", "content": "which"},
                {"id": "D", "content": "what to"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: Wh-word + to V_bare chỉ nơi chốn: 'where to buy' (mua ở đâu). Từ 'why' tuyệt đối không kết hợp với to-V.",
            "translation": "Bạn có thể chỉ cho tôi biết mua đồ gốm Bát Tràng chính gốc ở đâu tại Hà Nội không?",
            "unitTopic": "Unit 1: Question words before to-infinitives"
        },
        {
            "id": 6,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The intricate embroidery techniques have been ______ from generation to generation in this traditional village.",
            "options": [
                {"id": "A", "content": "passed down"},
                {"id": "B", "content": "turned down"},
                {"id": "C", "content": "carried out"},
                {"id": "D", "content": "given up"}
            ],
            "correctAnswer": "A",
            "explanation": "'Pass down' = truyền lại qua các thế hệ. 'Turn down' = từ chối; 'Carry out' = tiến hành; 'Give up' = từ bỏ.",
            "translation": "Những kỹ thuật thêu tinh xảo đã được lưu truyền từ thế hệ này sang thế hệ khác ở ngôi làng truyền thống này.",
            "unitTopic": "Unit 1: Phrasal verbs 1"
        },
        {
            "id": 7,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The ______ the underground metro system becomes, the ______ traffic congestion city residents will experience.",
            "options": [
                {"id": "A", "content": "more modern / less"},
                {"id": "B", "content": "more modern / fewer"},
                {"id": "C", "content": "more modernly / lesser"},
                {"id": "D", "content": "modern / little"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc so sánh kép: The + comp + S1 + V1, the + comp + S2 + V2. 'Traffic congestion' là danh từ không đếm được ➔ dùng 'less' (fewer chỉ dùng cho danh từ đếm được số nhiều).",
            "translation": "Hệ thống tàu điện ngầm càng hiện đại thì cư dân thành phố càng gặp ít tắc nghẽn giao thông hơn.",
            "unitTopic": "Unit 2: Double comparatives"
        },
        {
            "id": 8,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Because the living cost is increasing rapidly, urban families must ______ unnecessary expenses.",
            "options": [
                {"id": "A", "content": "cut down on"},
                {"id": "B", "content": "run out of"},
                {"id": "C", "content": "look back on"},
                {"id": "D", "content": "get on with"}
            ],
            "correctAnswer": "A",
            "explanation": "'Cut down on' = cắt giảm (chi tiêu, lượng tiêu thụ). 'Run out of' = cạn kiệt; 'Look back on' = nhìn lại quá khứ; 'Get on with' = hòa hợp với ai.",
            "translation": "Vì chi phí sinh hoạt đang tăng nhanh chóng, các gia đình thành thị phải cắt giảm các khoản chi tiêu không cần thiết.",
            "unitTopic": "Unit 2: Phrasal verbs 2"
        },
        {
            "id": 9,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "If adolescents feel overwhelmed by peer pressure and exam stress, they ______ consult a school counselor.",
            "options": [
                {"id": "A", "content": "should"},
                {"id": "B", "content": "will should"},
                {"id": "C", "content": "should to"},
                {"id": "D", "content": "would"}
            ],
            "correctAnswer": "A",
            "explanation": "Câu điều kiện loại 1 với động từ khuyết thiếu: If + S + V(hiện tại đơn), S + can/must/should + V_bare (đưa ra lời khuyên).",
            "translation": "Nếu thanh thiếu niên cảm thấy quá tải vì áp lực bạn bè và thi cử, các em nên tham khảo ý kiến của chuyên viên tư vấn học đường.",
            "unitTopic": "Unit 3: Modals in Conditionals Type 1"
        },
        {
            "id": 10,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "It takes immense willpower for teens to ______ unhealthy habits like staying up late playing video games.",
            "options": [
                {"id": "A", "content": "give up"},
                {"id": "B", "content": "put on"},
                {"id": "C", "content": "look into"},
                {"id": "D", "content": "bring back"}
            ],
            "correctAnswer": "A",
            "explanation": "'Give up' = từ bỏ (thói quen xấu). 'Put on' = mặc vào/tăng cân; 'Look into' = điều tra; 'Bring back' = gợi lại kỷ niệm.",
            "translation": "Cần một ý chí to lớn để thanh thiếu niên từ bỏ các thói quen không lành mạnh như thức khuya chơi trò chơi điện tử.",
            "unitTopic": "Unit 3: Phrasal verbs & Healthy habits"
        },
        {
            "id": 11,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "I wish my grandparents ______ in our modern apartment with us right now instead of living alone in the countryside.",
            "options": [
                {"id": "A", "content": "lived"},
                {"id": "B", "content": "live"},
                {"id": "C", "content": "will live"},
                {"id": "D", "content": "have lived"}
            ],
            "correctAnswer": "A",
            "explanation": "Câu ước muốn trái ngược với hiện tại (dấu hiệu 'right now'): S + wish + S + V2/ed ➔ dùng 'lived'.",
            "translation": "Tôi ước ông bà tôi đang sống trong căn hộ hiện đại cùng chúng tôi lúc này thay vì sống một mình ở vùng nông thôn.",
            "unitTopic": "Unit 4: Wish for the present"
        },
        {
            "id": 12,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "While the elderly artisan ______ a traditional folktale, the electricity suddenly ______ off.",
            "options": [
                {"id": "A", "content": "was telling / went"},
                {"id": "B", "content": "told / was going"},
                {"id": "C", "content": "was telling / was going"},
                {"id": "D", "content": "told / went"}
            ],
            "correctAnswer": "A",
            "explanation": "Hành động dài đang diễn ra dùng Quá khứ tiếp diễn (was telling), hành động ngắn bất ngờ xen vào dùng Quá khứ đơn (went).",
            "translation": "Trong khi người nghệ nhân cao tuổi đang kể một câu chuyện dân gian truyền thống, điện đột nhiên bị tắt.",
            "unitTopic": "Unit 4: Past Continuous with While"
        },
        {
            "id": 13,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Fifty years ago, children in rural areas ______ barefoot along muddy village paths to reach school.",
            "options": [
                {"id": "A", "content": "used to walk"},
                {"id": "B", "content": "were used to walk"},
                {"id": "C", "content": "are used to walking"},
                {"id": "D", "content": "use to walking"}
            ],
            "correctAnswer": "A",
            "explanation": "'Used to + V_bare' diễn tả thói quen đã từng xảy ra thường xuyên trong quá khứ và nay không còn nữa.",
            "translation": "Năm mươi năm trước, trẻ em ở các vùng nông thôn thường đi chân đất dọc theo những con đường làng lầy lội để tới trường.",
            "unitTopic": "Unit 4: Used to + V_bare"
        },
        {
            "id": 14,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Our secondary school's volunteer club ______ three charity field trips ______ the beginning of this semester.",
            "options": [
                {"id": "A", "content": "has organized / since"},
                {"id": "B", "content": "organized / for"},
                {"id": "C", "content": "have organized / since"},
                {"id": "D", "content": "had organized / in"}
            ],
            "correctAnswer": "A",
            "explanation": "'Volunteer club' là chủ ngữ số ít ➔ has organized. 'The beginning of this semester' là một mốc thời gian xác định ➔ dùng 'since'.",
            "translation": "Câu lạc bộ tình nguyện của trường chúng tôi đã tổ chức ba chuyến đi thực tế từ thiện kể từ đầu học kỳ này.",
            "unitTopic": "Unit 5: Present Perfect with since"
        },
        {
            "id": 15,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "During her summer homestay in Sydney, Mai managed to ______ quite a lot of natural Australian idioms.",
            "options": [
                {"id": "A", "content": "pick up"},
                {"id": "B", "content": "give up"},
                {"id": "C", "content": "cut down"},
                {"id": "D", "content": "look after"}
            ],
            "correctAnswer": "A",
            "explanation": "'Pick up' = học lỏm được, tiếp thu ngôn ngữ một cách tự nhiên trong giao tiếp đời thường.",
            "translation": "Trong chuyến ở cùng người bản xứ tại Sydney vào mùa hè, Mai đã học lỏm được khá nhiều thành ngữ tự nhiên của người Úc.",
            "unitTopic": "Unit 5: Phrasal verb 'pick up'"
        },
        {
            "id": 16,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Where is Nam? - He ______ the public library to borrow history books; he will be back home in an hour.",
            "options": [
                {"id": "A", "content": "has gone to"},
                {"id": "B", "content": "has been to"},
                {"id": "C", "content": "went to"},
                {"id": "D", "content": "was at"}
            ],
            "correctAnswer": "A",
            "explanation": "'Has gone to' = đã đi đến đó và hiện CHƯA VỀ (ngữ cảnh: 'he will be back in an hour'). 'Has been to' = đã đi và đã trở về rồi.",
            "translation": "Nam đang ở đâu thế? - Cậu ấy đã đến thư viện công cộng để mượn sách lịch sử; cậu ấy sẽ về nhà trong một giờ nữa.",
            "unitTopic": "Unit 5: Have been to vs Have gone to"
        },
        {
            "id": 17,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "To maintain high energy and prevent obesity, young students should avoid ______ too much sugary food.",
            "options": [
                {"id": "A", "content": "eating"},
                {"id": "B", "content": "to eat"},
                {"id": "C", "content": "eat"},
                {"id": "D", "content": "to eating"}
            ],
            "correctAnswer": "A",
            "explanation": "Động từ 'avoid' (tránh) luôn đi kèm với danh động từ V-ing: avoid + V-ing.",
            "translation": "Để duy trì năng lượng cao và ngăn ngừa béo phì, học sinh nên tránh ăn quá nhiều đồ ngọt.",
            "unitTopic": "Unit 6: Verbs followed by V-ing"
        },
        {
            "id": 18,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "On his way home from work, my father stopped ______ some fresh flowers for my mother's birthday.",
            "options": [
                {"id": "A", "content": "to buy"},
                {"id": "B", "content": "buying"},
                {"id": "C", "content": "buy"},
                {"id": "D", "content": "for buying"}
            ],
            "correctAnswer": "A",
            "explanation": "'Stop to V' = dừng hành động đang làm lại ĐỂ thực hiện hành động khác (dừng xe để mua hoa). 'Stop V-ing' = dừng hẳn một thói quen.",
            "translation": "Trên đường đi làm về, bố tôi đã dừng lại để mua vài bông hoa tươi nhân ngày sinh nhật của mẹ tôi.",
            "unitTopic": "Unit 6: Stop to-V vs Stop V-ing"
        },

        # PHẦN III: GIAO TIẾP XÃ HỘI (19-20)
        {
            "id": 19,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Tourist: \"Excuse me, could you tell me how to get to the ceramic workshop?\"<br>Local villager: \"______\"",
            "options": [
                {"id": "A", "content": "Go straight ahead for two blocks, and it's on your right."},
                {"id": "B", "content": "No, you don't have to buy ceramics here."},
                {"id": "C", "content": "I wish you had arrived earlier yesterday."},
                {"id": "D", "content": "You are welcome. Have a nice flight!"}
            ],
            "correctAnswer": "A",
            "explanation": "Câu hỏi đường 'could you tell me how to get to...' được trả lời bằng chỉ dẫn đường đi: 'Go straight ahead...'.",
            "translation": "Du khách: 'Xin lỗi, bạn có thể chỉ cho tôi đường tới xưởng gốm được không?' - Người dân: 'Đi thẳng hai dãy nhà nữa, nó ở bên tay phải bạn.'",
            "unitTopic": "Social Communication: Asking directions"
        },
        {
            "id": 20,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Lan: \"I've been feeling so stressed and tired preparing for this upcoming exam.\"<br>Counselor: \"______\"",
            "options": [
                {"id": "A", "content": "If you feel overwhelmed, you should break your revision into smaller sessions."},
                {"id": "B", "content": "You must not study anything until next week."},
                {"id": "C", "content": "I wish you had taken the exam two years ago."},
                {"id": "D", "content": "You will fail the exam if you take a rest."}
            ],
            "correctAnswer": "A",
            "explanation": "Hồi đáp khuyên bảo tâm lý mang tính xây dựng và chuẩn ngữ pháp câu điều kiện loại 1 với 'should'.",
            "translation": "Lan: 'Em cảm thấy rất căng thẳng và mệt mỏi khi chuẩn bị cho kỳ thi sắp tới.' - Chuyên viên: 'Nếu em cảm thấy quá tải, em nên chia nhỏ các buổi ôn tập ra.'",
            "unitTopic": "Social Communication: Health advice"
        },

        # PHẦN IV: ĐIỀN TỪ ĐOẠN VĂN - CLOZE TEST (21-25)
        {
            "id": 21,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
            "readingText": "Bat Trang is a renowned traditional pottery village situated on the outskirts of Hanoi. For centuries, its skilled (21)______ have been creating delicate ceramic products that are admired both domestically and internationally. To ensure that these priceless techniques are not forgotten, master artisans continue to (22)______ their craft to the younger generation. Today, many young Vietnamese are eager to visit the village to take part in hands-on workshops where they learn (23)______ to mould clay and paint pottery plates. The village has also modernized its infrastructure, making it a very (24)______ destination for weekend family trips. Visitors always look forward (25)______ experiencing the unique blend of ancient heritage and lively modern tourism here.",
            "content": "Chọn từ thích hợp cho chỗ trống (21):",
            "options": [
                {"id": "A", "content": "artisans"},
                {"id": "B", "content": "counselors"},
                {"id": "C", "content": "commuters"},
                {"id": "D", "content": "officers"}
            ],
            "correctAnswer": "A",
            "explanation": "'Artisans' = các nghệ nhân, thợ thủ công làm đồ gốm. Các từ khác không phù hợp ngữ cảnh làng gốm.",
            "translation": "artisans (nghệ nhân thủ công làng nghề).",
            "unitTopic": "Cloze Test: Vocabulary Unit 1"
        },
        {
            "id": 22,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (22):",
            "content": "Chọn từ thích hợp cho chỗ trống (22):",
            "options": [
                {"id": "A", "content": "pass down"},
                {"id": "B", "content": "cut down"},
                {"id": "C", "content": "run out"},
                {"id": "D", "content": "give up"}
            ],
            "correctAnswer": "A",
            "explanation": "'Pass down' = truyền lại kỹ thuật cho thế hệ sau. 'Cut down' = cắt giảm; 'Run out' = cạn kiệt; 'Give up' = từ bỏ.",
            "translation": "pass down their craft (truyền nghề của mình lại cho thế hệ trẻ).",
            "unitTopic": "Cloze Test: Phrasal verbs Unit 1"
        },
        {
            "id": 23,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (23):",
            "content": "Chọn từ thích hợp cho chỗ trống (23):",
            "options": [
                {"id": "A", "content": "how"},
                {"id": "B", "content": "why"},
                {"id": "C", "content": "what to"},
                {"id": "D", "content": "when to moulding"}
            ],
            "correctAnswer": "A",
            "explanation": "'Learn how to mould clay' = học cách nhào nặn đất sét. 'How + to V' chỉ phương pháp, kỹ năng.",
            "translation": "learn how to mould clay (học cách nhào nặn đất sét).",
            "unitTopic": "Cloze Test: Wh- + to V Unit 1"
        },
        {
            "id": 24,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (24):",
            "content": "Chọn từ thích hợp cho chỗ trống (24):",
            "options": [
                {"id": "A", "content": "liveable"},
                {"id": "B", "content": "attractive"},
                {"id": "C", "content": "illiterate"},
                {"id": "D", "content": "crowdedly"}
            ],
            "correctAnswer": "B",
            "explanation": "Đứng trước danh từ 'destination' cần tính từ thích hợp 'an attractive destination' (một điểm đến hấp dẫn).",
            "translation": "an attractive destination (một điểm đến hấp dẫn).",
            "unitTopic": "Cloze Test: Vocabulary Unit 2"
        },
        {
            "id": 25,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (25):",
            "content": "Chọn từ thích hợp cho chỗ trống (25):",
            "options": [
                {"id": "A", "content": "to"},
                {"id": "B", "content": "for"},
                {"id": "C", "content": "with"},
                {"id": "D", "content": "at"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc cố định: 'look forward to + V-ing' (trông mong, háo hức điều gì).",
            "translation": "look forward to experiencing (háo hức được trải nghiệm).",
            "unitTopic": "Cloze Test: Look forward to Unit 1"
        },

        # PHẦN V: ĐỌC HIỂU VĂN BẢN (26-30)
        {
            "id": 26,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
            "readingText": "In traditional Vietnamese society decades ago, the extended family was the core structure of domestic life. Three or sometimes even four generations lived under one roof: great-grandparents, grandparents, parents, and children. In such households, younger members learned to respect seniority and listen carefully to the wisdom of their elders. Daily chores like cooking, farming, and childcare were shared cooperatively among family members. Whenever conflicts arose, grandparents served as patient mediators, helping to maintain household harmony.<br><br>However, as Vietnam underwent rapid industrialization and urbanization over recent decades, family models have transformed remarkably. Today, nuclear families consisting only of parents and their children have become the prevailing pattern in big cities. Modern apartments and demanding career paths often leave little room for multi-generational living. Young urban couples enjoy greater independence and flexibility in making decisions for their children's education. Furthermore, modern appliances such as washing machines, vacuum cleaners, and food delivery apps have significantly reduced household burdens.<br><br>Nonetheless, nuclear family life brings new challenges. Many elderly grandparents in the countryside feel lonely, while working parents in cities struggle to balance demanding work schedules with quality time for their children. To bridge this generational gap, many urban families now maintain regular weekend reunions, celebrating birthdays and traditional holidays together so that sacred family values remain cherished.",
            "content": "What is the main topic of the passage?",
            "options": [
                {"id": "A", "content": "The transformation from extended to nuclear families in Vietnam"},
                {"id": "B", "content": "The daily chores in traditional rural households"},
                {"id": "C", "content": "How modern electrical appliances help Vietnamese mothers"},
                {"id": "D", "content": "The problems of building high-rise apartments in big cities"}
            ],
            "correctAnswer": "A",
            "explanation": "Ý chính của toàn bài là sự chuyển đổi từ mô hình gia đình đa thế hệ sang gia đình hạt nhân tại Việt Nam cùng những thuận lợi và thách thức của nó.",
            "translation": "Chủ đề chính: Sự biến chuyển từ gia đình đa thế hệ sang gia đình hạt nhân ở Việt Nam.",
            "unitTopic": "Reading Comprehension: Main Idea Unit 6"
        },
        {
            "id": 27,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "In traditional extended households, who primarily acted as mediators when conflicts arose?",
            "options": [
                {"id": "A", "content": "Grandparents"},
                {"id": "B", "content": "School counselors"},
                {"id": "C", "content": "Community helpers"},
                {"id": "D", "content": "Children"}
            ],
            "correctAnswer": "A",
            "explanation": "Trong đoạn 1 nêu rõ: 'Whenever conflicts arose, grandparents served as patient mediators, helping to maintain household harmony.'",
            "translation": "Bất cứ khi nào mâu thuẫn nảy sinh, ông bà đóng vai trò là những người hòa giải kiên nhẫn.",
            "unitTopic": "Reading Comprehension: Detail Unit 6"
        },
        {
            "id": 28,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "The word \"prevailing\" in paragraph 2 is closest in meaning to ______.",
            "options": [
                {"id": "A", "content": "most common and widespread"},
                {"id": "B", "content": "extremely ancient"},
                {"id": "C", "content": "barefoot and poor"},
                {"id": "D", "content": "complicated"}
            ],
            "correctAnswer": "A",
            "explanation": "'Prevailing' = phổ biến nhất, thịnh hành nhất (= most common and widespread).",
            "translation": "Từ 'prevailing' đồng nghĩa với 'phổ biến, lan rộng nhất'.",
            "unitTopic": "Reading Comprehension: Vocabulary in context"
        },
        {
            "id": 29,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "Which of the following is NOT mentioned as a reason why nuclear families are preferred today?",
            "options": [
                {"id": "A", "content": "Young couples have greater independence in making educational decisions."},
                {"id": "B", "content": "Modern household conveniences save time on daily chores."},
                {"id": "C", "content": "Grandparents refuse to live with their grandchildren."},
                {"id": "D", "content": "Demanding careers and modern apartments suit smaller families."}
            ],
            "correctAnswer": "C",
            "explanation": "Bài đọc không hề nói ông bà từ chối sống cùng con cháu (đáp án C). Các yếu tố A, B, D đều được nhắc đến trong đoạn 2.",
            "translation": "Chi tiết C không được đề cập trong bài.",
            "unitTopic": "Reading Comprehension: Negative factual"
        },
        {
            "id": 30,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "How do many urban families bridge the generational gap today?",
            "options": [
                {"id": "A", "content": "By organizing regular weekend reunions and holiday get-togethers"},
                {"id": "B", "content": "By sending children to study abroad"},
                {"id": "C", "content": "By stopping all online communication"},
                {"id": "D", "content": "By moving back to the countryside permanently"}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn cuối nêu rõ: 'To bridge this generational gap, many urban families now maintain regular weekend reunions, celebrating birthdays and traditional holidays together...'",
            "translation": "Nhiều gia đình duy trì các buổi đoàn tụ cuối tuần đều đặn và cùng tổ chức các ngày lễ truyền thống.",
            "unitTopic": "Reading Comprehension: Inference Unit 6"
        },

        # PHẦN VI: TÌM LỖI SAI (31-34)
        {
            "id": 31,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "The young apprentice <u>didn't know</u> (A) how to shape the clay, but the master artisan <u>refused</u> (B) to explain <u>why to do</u> (C) it <u>carefully</u> (D).",
            "options": [
                {"id": "A", "content": "didn't know"},
                {"id": "B", "content": "refused"},
                {"id": "C", "content": "why to do"},
                {"id": "D", "content": "carefully"}
            ],
            "correctAnswer": "C",
            "explanation": "Quy tắc vàng: 'Why' không bao giờ kết hợp với 'to V'. Phải sửa thành mệnh đề đầy đủ: 'why he should do it'.",
            "translation": "Bẫy đề thi: Cấm dùng 'why to do' ➔ sửa thành 'why he had to do it'.",
            "unitTopic": "Unit 1: Trap of Wh- + to V"
        },
        {
            "id": 32,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "<u>The most crowded</u> (A) the inner city district gets, <u>the harder</u> (B) it becomes for residents <u>to find</u> (C) <u>affordable</u> (D) accommodation.",
            "options": [
                {"id": "A", "content": "The most crowded"},
                {"id": "B", "content": "the harder"},
                {"id": "C", "content": "to find"},
                {"id": "D", "content": "affordable"}
            ],
            "correctAnswer": "A",
            "explanation": "Trong cấu trúc so sánh kép (Double comparative), bắt buộc dùng cấp so sánh hơn (comparative: The more crowded), không dùng so sánh nhất (The most crowded).",
            "translation": "Sửa 'The most crowded' thành 'The more crowded'.",
            "unitTopic": "Unit 2: Double comparative trap"
        },
        {
            "id": 33,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "If students <u>will maintain</u> (A) a <u>well-balanced</u> (B) diet and exercise daily, they <u>can improve</u> (C) both mental and physical <u>health</u> (D).",
            "options": [
                {"id": "A", "content": "will maintain"},
                {"id": "B", "content": "well-balanced"},
                {"id": "C", "content": "can improve"},
                {"id": "D", "content": "health"}
            ],
            "correctAnswer": "A",
            "explanation": "Trong mệnh đề If của câu điều kiện loại 1, động từ phải chia ở thì Hiện tại đơn (maintain), tuyệt đối không dùng 'will'.",
            "translation": "Sửa 'will maintain' thành 'maintain'.",
            "unitTopic": "Unit 3: If clause Type 1 trap"
        },
        {
            "id": 34,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "I wish my elder brother <u>is</u> (A) here <u>to help</u> (B) me with my English revision <u>right now</u> (C) before <u>the examination</u> (D).",
            "options": [
                {"id": "A", "content": "is"},
                {"id": "B", "content": "to help"},
                {"id": "C", "content": "right now"},
                {"id": "D", "content": "the examination"}
            ],
            "correctAnswer": "A",
            "explanation": "Trong câu ước ở hiện tại (dấu hiệu 'right now'), động từ 'to be' phải lùi thì về giả định 'were' (hoặc 'was') cho tất cả các ngôi.",
            "translation": "Sửa 'is' thành 'were'.",
            "unitTopic": "Unit 4: Wish for present trap"
        },

        # PHẦN VII: VIẾT LẠI CÂU (35-40)
        {
            "id": 35,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "Can you show me where I can buy authentic handicraft souvenirs in this village?",
            "options": [
                {"id": "A", "content": "Can you show me where to buy authentic handicraft souvenirs in this village?"},
                {"id": "B", "content": "Can you show me where buying authentic handicraft souvenirs in this village?"},
                {"id": "C", "content": "Can you show me why to buy authentic handicraft souvenirs in this village?"},
                {"id": "D", "content": "Can you show me where can I buy authentic handicraft souvenirs in this village?"}
            ],
            "correctAnswer": "A",
            "explanation": "Rút gọn mệnh đề danh từ 'where I can buy' thành 'where to buy'.",
            "translation": "Bạn có thể chỉ cho tôi biết mua đồ lưu niệm thủ công chính gốc ở đâu không?",
            "unitTopic": "Unit 1: Wh- + to V transformation"
        },
        {
            "id": 36,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "As life in the big city becomes faster, people feel more stressed.",
            "options": [
                {"id": "A", "content": "The faster life in the big city becomes, the more stressed people feel."},
                {"id": "B", "content": "The more fast life in the big city becomes, the stressed people feel."},
                {"id": "C", "content": "The faster life becomes, the people feel more stressed."},
                {"id": "D", "content": "The most fast life in the big city becomes, the most stressed people feel."}
            ],
            "correctAnswer": "A",
            "explanation": "Công thức so sánh kép: As S1 + V1 + comp, S2 + V2 + comp ➔ The faster..., the more stressed...",
            "translation": "Cuộc sống ở thành phố càng nhanh thì người ta càng cảm thấy căng thẳng hơn.",
            "unitTopic": "Unit 2: Double comparative transformation"
        },
        {
            "id": 37,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "You must get at least eight hours of sleep every night, or you cannot concentrate on your revision.",
            "options": [
                {"id": "A", "content": "Unless you get at least eight hours of sleep every night, you cannot concentrate on your revision."},
                {"id": "B", "content": "Unless you don't get at least eight hours of sleep, you cannot concentrate on your revision."},
                {"id": "C", "content": "If you get at least eight hours of sleep every night, you cannot concentrate on your revision."},
                {"id": "D", "content": "Unless you get enough sleep, you can concentrate on your revision."}
            ],
            "correctAnswer": "A",
            "explanation": "Unless = If... not. Mệnh đề sau Unless luôn ở dạng khẳng định: 'Unless you get...'. Đáp án B sai vì phủ định hai lần.",
            "translation": "Trừ khi bạn ngủ đủ 8 tiếng mỗi đêm, nếu không bạn không thể tập trung ôn bài.",
            "unitTopic": "Unit 3: Unless transformation"
        },
        {
            "id": 38,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "My father walked barefoot to school when he was a boy, but he doesn't do that anymore.",
            "options": [
                {"id": "A", "content": "My father used to walk barefoot to school when he was a boy."},
                {"id": "B", "content": "My father is used to walking barefoot to school when he was a boy."},
                {"id": "C", "content": "My father used to walking barefoot to school when he was a boy."},
                {"id": "D", "content": "My father didn't use to walk barefoot to school anymore."}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc 'used to + V_bare' diễn tả hành động từng làm thường xuyên trong quá khứ và nay không còn nữa.",
            "translation": "Bố tôi đã từng đi chân đất đến trường khi còn là một cậu bé.",
            "unitTopic": "Unit 4: Used to transformation"
        },
        {
            "id": 39,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "The last time we went on an eco-tour to Cuc Phuong National Park was two years ago.",
            "options": [
                {"id": "A", "content": "We have not gone on an eco-tour to Cuc Phuong National Park for two years."},
                {"id": "B", "content": "We have gone on an eco-tour to Cuc Phuong National Park since two years ago."},
                {"id": "C", "content": "We didn't go on an eco-tour to Cuc Phuong National Park for two years ago."},
                {"id": "D", "content": "It is two years when we last went on an eco-tour to Cuc Phuong."}
            ],
            "correctAnswer": "A",
            "explanation": "Biến đổi câu kinh điển: S + last + V2 + ... ago ➔ S + have/has not + V3 + for + [khoảng thời gian].",
            "translation": "Chúng tôi đã không đi tour sinh thái tới Vườn quốc gia Cúc Phương trong hai năm nay rồi.",
            "unitTopic": "Unit 5: Present Perfect transformation"
        },
        {
            "id": 40,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "It took Vietnamese people decades to adapt to the fast-paced modern lifestyle.",
            "options": [
                {"id": "A", "content": "Vietnamese people spent decades adapting to the fast-paced modern lifestyle."},
                {"id": "B", "content": "Vietnamese people spent decades to adapt to the fast-paced modern lifestyle."},
                {"id": "C", "content": "Vietnamese people spent decades to adapting the fast-paced modern lifestyle."},
                {"id": "D", "content": "It spent Vietnamese people decades adapting to modern lifestyle."}
            ],
            "correctAnswer": "A",
            "explanation": "Chuyển đổi: It takes/took + O + time + to V ➔ S + spend/spent + time + V-ing.",
            "translation": "Người Việt Nam đã dành nhiều thập kỷ để thích nghi với lối sống hiện đại hối hả.",
            "unitTopic": "Unit 6: Spend time V-ing transformation"
        }
    ]
}

print("Exam 1 built successfully (40 questions).")
