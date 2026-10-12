import json
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
sys.path.append(SCRIPT_DIR)

TS_OUTPUT_FILE = os.path.join(PROJECT_DIR, "src", "data", "exams_hk1.ts")
BO_DIR = os.path.join(PROJECT_DIR, "BO_TAI_LIEU_ON_THI_VAO_10")
HTML_OUTPUT_FILE = os.path.join(BO_DIR, "03_bo_3_de_kiem_tra_6_unit_dau.html")
PDF_OUTPUT_FILE = os.path.join(BO_DIR, "03_BO_3_DE_KIEM_TRA_6_UNIT_DAU_GLOBAL_SUCCESS_9.pdf")

from build_full_3_exams import EXAM_1
from generate_all_3_exams import EXAM_2

EXAM_3 = {
    "id": "de-3",
    "code": "HK1-03",
    "title": "ĐỀ SỐ 3: KIỂM TRA HỌC KÌ 1 — MÔ PHỎNG ĐỀ THI VÀO 10",
    "subtitle": "Chương trình Tiếng Anh 9 Global Success • Chuẩn Ma Trận Đề Tuyển Sinh Vào 10",
    "description": "Mô phỏng 100% đề thi tuyển sinh vào lớp 10 chính thức của Sở Giáo Dục: bao phủ toàn diện 6 Unit đầu với ma trận chuẩn hóa 40 câu trắc nghiệm khách quan, đọc hiểu sâu về trải nghiệm giáo dục và bảo tồn di sản, bộ câu phân hóa điểm 9.0 - 10.0.",
    "durationMinutes": 60,
    "totalQuestions": 40,
    "difficulty": "Mô phỏng thi vào 10",
    "badgeColor": "red",
    "questions": [
        # PHẦN I: PHONETICS (1-4)
        {
            "id": 1,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. breath<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; B. broaden<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; C. moderniz<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; D. act<u>ed</u>",
            "options": [
                {"id": "A", "content": "breathed"},
                {"id": "B", "content": "broadened"},
                {"id": "C", "content": "modernized"},
                {"id": "D", "content": "acted"}
            ],
            "correctAnswer": "D",
            "explanation": "Đuôi '-ed' trong 'acted' phát âm là /ɪd/ (sau âm /t/). Trong các từ còn lại phát âm là /d/ (sau các phụ âm hữu thanh /ð/, /n/, /z/).",
            "translation": "acted đọc là /ɪd/, các từ còn lại đọc là /d/.",
            "unitTopic": "Phonetics: Phát âm đuôi -ed"
        },
        {
            "id": 2,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
            "content": "A. villag<u>es</u> &nbsp;&nbsp;&nbsp;&nbsp; B. devic<u>es</u> &nbsp;&nbsp;&nbsp;&nbsp; C. branch<u>es</u> &nbsp;&nbsp;&nbsp;&nbsp; D. techniqu<u>es</u>",
            "options": [
                {"id": "A", "content": "villages"},
                {"id": "B", "content": "devices"},
                {"id": "C", "content": "branches"},
                {"id": "D", "content": "techniques"}
            ],
            "correctAnswer": "D",
            "explanation": "Đuôi '-es' trong 'techniques' phát âm là /s/ vì âm cuối là /k/ (khi thêm s phát âm là /tekˈniːks/). Trong các từ còn lại phát âm là /ɪz/: villages /ˈvɪlɪdʒɪz/, devices /dɪˈvaɪsɪz/, branches /ˈbrɑːntʃɪz/.",
            "translation": "techniques đọc là /s/, các từ còn lại đọc là /ɪz/.",
            "unitTopic": "Phonetics: Phát âm đuôi -s/-es"
        },
        {
            "id": 3,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. extend &nbsp;&nbsp;&nbsp;&nbsp; B. broaden &nbsp;&nbsp;&nbsp;&nbsp; C. modern &nbsp;&nbsp;&nbsp;&nbsp; D. healthy",
            "options": [
                {"id": "A", "content": "extend"},
                {"id": "B", "content": "broaden"},
                {"id": "C", "content": "modern"},
                {"id": "D", "content": "healthy"}
            ],
            "correctAnswer": "A",
            "explanation": "'Extend' là động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 2 /ɪkˈstend/. Các từ còn lại có trọng âm rơi vào âm tiết thứ 1: broaden /ˈbrɔːdn/, modern /ˈmɒdn/, healthy /ˈhelθi/.",
            "translation": "extend (âm 2); broaden, modern, healthy (âm 1).",
            "unitTopic": "Stress: Trọng âm từ 2 âm tiết"
        },
        {
            "id": 4,
            "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
            "instruction": "Chọn từ có trọng âm chính rơi vào vị trí khác với các từ còn lại.",
            "content": "A. experience &nbsp;&nbsp;&nbsp;&nbsp; B. generation &nbsp;&nbsp;&nbsp;&nbsp; C. community &nbsp;&nbsp;&nbsp;&nbsp; D. traditional",
            "options": [
                {"id": "A", "content": "experience"},
                {"id": "B", "content": "generation"},
                {"id": "C", "content": "community"},
                {"id": "D", "content": "traditional"}
            ],
            "correctAnswer": "B",
            "explanation": "'Generation' /ˌdʒenəˈreɪʃn/ có đuôi -tion, trọng âm rơi vào âm tiết thứ 3. Các từ còn lại có trọng âm rơi vào âm tiết thứ 2: experience /ɪkˈspɪəriəns/, community /kəˈmjuːnəti/, traditional /trəˈdɪʃənl/.",
            "translation": "generation (âm 3); experience, community, traditional (âm 2).",
            "unitTopic": "Stress: Trọng âm từ 4 âm tiết"
        },

        # PHẦN II: NGỮ PHÁP & TỪ VỰNG (5-18)
        {
            "id": 5,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The foreign visitor inquired at the reception desk ______ to register for the pottery sculpting workshop.",
            "options": [
                {"id": "A", "content": "how"},
                {"id": "B", "content": "why"},
                {"id": "C", "content": "which"},
                {"id": "D", "content": "what to registering"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: Wh-word + to V_bare: 'how to register' (cách thức đăng ký).",
            "translation": "Du khách nước ngoài đã hỏi tại quầy lễ tân cách thức đăng ký tham gia xưởng nặn gốm.",
            "unitTopic": "Unit 1: How + to V"
        },
        {
            "id": 6,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Because the applicant lacked hands-on practical skills, his job application was ______ by the firm.",
            "options": [
                {"id": "A", "content": "turned down"},
                {"id": "B", "content": "passed down"},
                {"id": "C", "content": "run out"},
                {"id": "D", "content": "given in"}
            ],
            "correctAnswer": "A",
            "explanation": "'Turn down' = từ chối (đơn xin việc, lời mời). 'Pass down' = truyền lại.",
            "translation": "Vì ứng viên thiếu kỹ năng thực hành thực tế, đơn xin việc của anh ấy đã bị công ty từ chối.",
            "unitTopic": "Unit 1: Phrasal verb 'turn down'"
        },
        {
            "id": 7,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "The ______ information students research about specialized high schools, the ______ their exam choice will be.",
            "options": [
                {"id": "A", "content": "more / better"},
                {"id": "B", "content": "most / good"},
                {"id": "C", "content": "more / more well"},
                {"id": "D", "content": "much / better"}
            ],
            "correctAnswer": "A",
            "explanation": "So sánh kép: The + comp + S1 + V1, the + comp + S2 + V2. 'Good' chuyển thành 'better'.",
            "translation": "Học sinh càng tìm hiểu nhiều thông tin về các trường THPT chuyên thì sự lựa chọn thi cử của các em càng tốt hơn.",
            "unitTopic": "Unit 2: Double comparative with good ➔ better"
        },
        {
            "id": 8,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Thanks to its clean coastal environment and green public transport, Da Nang is consistently voted one of the most ______ cities in Asia.",
            "options": [
                {"id": "A", "content": "liveable"},
                {"id": "B", "content": "livelihood"},
                {"id": "C", "content": "lively"},
                {"id": "D", "content": "alive"}
            ],
            "correctAnswer": "A",
            "explanation": "Liveable (tính từ) = đáng sống. Livelihood (kế sinh nhai), lively (sống động).",
            "translation": "Nhờ môi trường ven biển trong sạch và giao thông công cộng xanh, Đà Nẵng liên tục được bình chọn là một trong những thành phố đáng sống nhất châu Á.",
            "unitTopic": "Unit 2: Vocabulary 'liveable'"
        },
        {
            "id": 9,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "If you experience severe anxiety before the important entrance exam, you ______ hesitate to contact your teacher.",
            "options": [
                {"id": "A", "content": "shouldn't"},
                {"id": "B", "content": "must"},
                {"id": "C", "content": "won't should"},
                {"id": "D", "content": "might to"}
            ],
            "correctAnswer": "A",
            "explanation": "Câu điều kiện loại 1 với lời khuyên: 'shouldn't hesitate' (không nên do dự, đừng ngại liên hệ).",
            "translation": "Nếu em trải qua cảm giác lo âu nghiêm trọng trước kỳ thi tuyển sinh quan trọng, em không nên do dự liên hệ với giáo viên của mình.",
            "unitTopic": "Unit 3: Modals in Conditionals"
        },
        {
            "id": 10,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "A ______ diet packed with fresh vegetables, proteins, and essential minerals is vital for teenage development.",
            "options": [
                {"id": "A", "content": "well-balanced"},
                {"id": "B", "content": "barefoot"},
                {"id": "C", "content": "illiterate"},
                {"id": "D", "content": "bustling"}
            ],
            "correctAnswer": "A",
            "explanation": "'Well-balanced diet' = chế độ ăn uống cân bằng, đầy đủ dinh dưỡng.",
            "translation": "Một chế độ ăn uống cân bằng chứa nhiều rau tươi, chất đạm và khoáng chất thiết yếu là rất quan trọng cho sự phát triển của thanh thiếu niên.",
            "unitTopic": "Unit 3: Collocation 'well-balanced diet'"
        },
        {
            "id": 11,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Many master craftsmen wish their children ______ more interest in preserving the village's historic heritage.",
            "options": [
                {"id": "A", "content": "showed"},
                {"id": "B", "content": "show"},
                {"id": "C", "content": "will show"},
                {"id": "D", "content": "have shown"}
            ],
            "correctAnswer": "A",
            "explanation": "Câu ước muốn trái với thực tế hiện tại: S + wish + S + V2/ed (showed).",
            "translation": "Nhiều nghệ nhân bậc thầy ước rằng con cái họ thể hiện nhiều sự quan tâm hơn trong việc gìn giữ di sản lịch sử của ngôi làng.",
            "unitTopic": "Unit 4: Wish for present"
        },
        {
            "id": 12,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "While the students ______ tug of war in the school yard, it suddenly began to rain heavily.",
            "options": [
                {"id": "A", "content": "were playing"},
                {"id": "B", "content": "played"},
                {"id": "C", "content": "are playing"},
                {"id": "D", "content": "had played"}
            ],
            "correctAnswer": "A",
            "explanation": "Sau While diễn tả hành động đang diễn ra kéo dài trong quá khứ ➔ Quá khứ tiếp diễn (were playing).",
            "translation": "Trong khi học sinh đang chơi trò kéo co ở sân trường thì trời đột nhiên đổ mưa to.",
            "unitTopic": "Unit 4: Past continuous with While"
        },
        {
            "id": 13,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Before television became ubiquitous, village elders ______ folk legends around the bonfire every winter evening.",
            "options": [
                {"id": "A", "content": "used to act out"},
                {"id": "B", "content": "were acting out"},
                {"id": "C", "content": "got used to act out"},
                {"id": "D", "content": "use to act out"}
            ],
            "correctAnswer": "A",
            "explanation": "'Used to act out' = đã từng diễn lại các tích truyện dân gian (thói quen trong quá khứ).",
            "translation": "Trước khi truyền hình trở nên phổ biến ở khắp nơi, các cụ cao niên trong làng thường đóng kịch diễn lại các truyền thuyết dân gian quanh đống lửa vào mỗi tối mùa đông.",
            "unitTopic": "Unit 4: Used to + act out"
        },
        {
            "id": 14,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Our class ______ in three major youth volunteer projects since the school year started.",
            "options": [
                {"id": "A", "content": "has taken part"},
                {"id": "B", "content": "took part"},
                {"id": "C", "content": "have taken part"},
                {"id": "D", "content": "had taken part"}
            ],
            "correctAnswer": "A",
            "explanation": "Thì Hiện tại hoàn thành với 'since'. Chủ ngữ 'Our class' là danh từ tập hợp số ít ➔ 'has taken part'.",
            "translation": "Lớp chúng tôi đã tham gia vào ba dự án tình nguyện thanh niên lớn kể từ khi năm học bắt đầu.",
            "unitTopic": "Unit 5: Present Perfect with since"
        },
        {
            "id": 15,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Huy isn't at home right now; he ______ the youth club to practice folk dancing and won't be back until 6 PM.",
            "options": [
                {"id": "A", "content": "has gone to"},
                {"id": "B", "content": "has been to"},
                {"id": "C", "content": "went"},
                {"id": "D", "content": "was going to"}
            ],
            "correctAnswer": "A",
            "explanation": "'Has gone to' = đã đi đến đó và hiện CHƯA VỀ (ngữ cảnh: 'won't be back until 6 PM').",
            "translation": "Huy không có ở nhà lúc này; cậu ấy đã đến câu lạc bộ thanh niên để tập múa dân gian và sẽ không về trước 6 giờ tối.",
            "unitTopic": "Unit 5: Have gone to"
        },
        {
            "id": 16,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Mai was astonished by how effortlessly her cousin ______ colloquial expressions during his short study abroad trip.",
            "options": [
                {"id": "A", "content": "picked up"},
                {"id": "B", "content": "gave up"},
                {"id": "C", "content": "cut down"},
                {"id": "D", "content": "looked after"}
            ],
            "correctAnswer": "A",
            "explanation": "'Pick up' = tiếp thu tự nhiên, học lỏm ngôn ngữ.",
            "translation": "Mai đã rất kinh ngạc trước việc anh họ của cô ấy học lỏm các cách diễn đạt thông tục một cách dễ dàng như thế nào trong chuyến du học ngắn ngày.",
            "unitTopic": "Unit 5: Phrasal verb 'pick up'"
        },
        {
            "id": 17,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "Young couples in fast-growing cities usually prefer ______ in nuclear apartments for privacy and convenience.",
            "options": [
                {"id": "A", "content": "to live"},
                {"id": "B", "content": "live"},
                {"id": "C", "content": "lived"},
                {"id": "D", "content": "to living"}
            ],
            "correctAnswer": "A",
            "explanation": "Cấu trúc: 'prefer to V' hoặc 'prefer V-ing'. Phương án A (to live) là chuẩn xác nhất.",
            "translation": "Các cặp vợ chồng trẻ ở các thành phố đang phát triển nhanh thường thích sống trong các căn hộ hạt nhân để có sự riêng tư và tiện lợi.",
            "unitTopic": "Unit 6: Verb forms"
        },
        {
            "id": 18,
            "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
            "content": "I distinctly remember ______ off the induction cooker before we left for the mid-autumn lantern parade.",
            "options": [
                {"id": "A", "content": "turning"},
                {"id": "B", "content": "to turn"},
                {"id": "C", "content": "turn"},
                {"id": "D", "content": "to turning"}
            ],
            "correctAnswer": "A",
            "explanation": "'Remember V-ing' = nhớ đã làm hành động gì trong quá khứ. Ngữ cảnh: Tôi nhớ rõ ràng là ĐÃ tắt bếp trước khi rời đi.",
            "translation": "Tôi nhớ rất rõ là mình đã tắt bếp từ trước khi chúng tôi rời đi tham gia lễ rước đèn trung thu.",
            "unitTopic": "Unit 6: Remember V-ing"
        },

        # PHẦN III: GIAO TIẾP XÃ HỘI (19-20)
        {
            "id": 19,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Student: \"Excuse me, sir. May I give you a hand with those heavy ceramic boxes?\"<br>Artisan: \"______\"",
            "options": [
                {"id": "A", "content": "That is extremely kind of you, young man. Thank you so much!"},
                {"id": "B", "content": "No, you must not touch my boxes."},
                {"id": "C", "content": "I wish you had arrived two days ago."},
                {"id": "D", "content": "You will be penalized if you carry them."}
            ],
            "correctAnswer": "A",
            "explanation": "Lời cảm ơn lịch sự và nồng hậu đáp lại lời đề nghị giúp đỡ của học sinh: 'That is extremely kind of you...'.",
            "translation": "Học sinh: 'Xin lỗi chú ạ. Cháu có thể giúp chú một tay khiêng những thùng đồ gốm nặng này được không ạ?' - Nghệ nhân: 'Cháu thật tốt bụng quá, cảm ơn cháu rất nhiều!'",
            "unitTopic": "Social Communication: Offering help"
        },
        {
            "id": 20,
            "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
            "content": "Tourist: \"I'm truly fascinated by the delicate patterns on this silk scarf!\"<br>Weaver: \"______\"",
            "options": [
                {"id": "A", "content": "Thank you! Our weavers spend days perfecting every single thread by hand."},
                {"id": "B", "content": "You should not look at it too long."},
                {"id": "C", "content": "I wish it were made of paper."},
                {"id": "D", "content": "You have to run out of money to buy it."}
            ],
            "correctAnswer": "A",
            "explanation": "Hồi đáp lịch thiệp và tự hào của thợ dệt khi nhận được lời khen ngợi từ khách du lịch.",
            "translation": "Du khách: 'Tôi thực sự bị cuốn hút bởi những hoa văn tinh xảo trên chiếc khăn lụa này!' - Thợ dệt: 'Cảm ơn quý khách! Những người thợ dệt của chúng tôi phải dành nhiều ngày để hoàn thiện thủ công từng sợi chỉ.'",
            "unitTopic": "Social Communication: Compliments"
        },

        # PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST) (21-25)
        {
            "id": 21,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
            "readingText": "Experiential learning through educational field trips has become a cornerstone of contemporary secondary education in Vietnam. Rather than remaining confined to traditional classroom lectures, students now have opportunities to visit historical relics and craft villages across the nation. These hands-on excursions (21)______ students' cultural awareness and provide authentic practical knowledge. In traditional handicraft communities, teenagers witness master artisans (22)______ down intricate embroidery and sculpting techniques. Students also participate directly in creative workshops, learning (23)______ to produce simple souvenirs using raw clay and bamboo. Educators believe that taking part in such collaborative activities helps adolescents develop teamwork, patience, and mutual respect. Moreover, interacting directly with community helpers teaches youngsters to value the honest labour of ordinary workers. When students return from these (24)______ journeys, they frequently demonstrate improved enthusiasm for learning and look forward (25)______ contributing positively to society.",
            "content": "Chọn từ thích hợp cho chỗ trống (21):",
            "options": [
                {"id": "A", "content": "broaden"},
                {"id": "B", "content": "deteriorate"},
                {"id": "C", "content": "modernize"},
                {"id": "D", "content": "give up"}
            ],
            "correctAnswer": "A",
            "explanation": "'Broaden cultural awareness' = mở rộng nhận thức văn hóa.",
            "translation": "broaden students' cultural awareness (mở rộng nhận thức văn hóa của học sinh).",
            "unitTopic": "Cloze Test: Unit 5"
        },
        {
            "id": 22,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (22):",
            "content": "Chọn từ thích hợp cho chỗ trống (22):",
            "options": [
                {"id": "A", "content": "passing"},
                {"id": "B", "content": "cutting"},
                {"id": "C", "content": "running"},
                {"id": "D", "content": "giving"}
            ],
            "correctAnswer": "A",
            "explanation": "'Witness artisans passing down...' (Cấu trúc witness + O + V-ing/V_bare: chứng kiến nghệ nhân truyền lại nghề).",
            "translation": "passing down intricate techniques (truyền lại các kỹ thuật tinh xảo).",
            "unitTopic": "Cloze Test: Unit 1"
        },
        {
            "id": 23,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (23):",
            "content": "Chọn từ thích hợp cho chỗ trống (23):",
            "options": [
                {"id": "A", "content": "how"},
                {"id": "B", "content": "why"},
                {"id": "C", "content": "which"},
                {"id": "D", "content": "where to producing"}
            ],
            "correctAnswer": "A",
            "explanation": "'Learning how to produce...' (học cách sản xuất đồ lưu niệm).",
            "translation": "learning how to produce simple souvenirs (học cách làm quà lưu niệm đơn giản).",
            "unitTopic": "Cloze Test: Unit 1"
        },
        {
            "id": 24,
            "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
            "instruction": "Chọn từ thích hợp cho chỗ trống (24):",
            "content": "Chọn từ thích hợp cho chỗ trống (24):",
            "options": [
                {"id": "A", "content": "memorable"},
                {"id": "B", "content": "illiterate"},
                {"id": "C", "content": "barefoot"},
                {"id": "D", "content": "stressful"}
            ],
            "correctAnswer": "A",
            "explanation": "'Memorable journeys' = những chuyến đi đáng nhớ, không thể nào quên.",
            "translation": "memorable journeys (những hành trình đáng nhớ).",
            "unitTopic": "Cloze Test: Unit 5"
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
            "explanation": "'Look forward to + V-ing' (trông mong, hướng tới việc cống hiến tích cực cho xã hội).",
            "translation": "look forward to contributing (hướng tới việc đóng góp tích cực cho xã hội).",
            "unitTopic": "Cloze Test: Unit 1"
        },

        # PHẦN V: ĐỌC HIỂU VĂN BẢN (26-30)
        {
            "id": 26,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
            "readingText": "Throughout Vietnam's long history, traditional craft villages have played an indispensable role in shaping national identity and supporting rural livelihoods. From the renowned ceramic kilns of Bat Trang and Van Phuc silk weaving workshops to Dong Ho folk painting communities, these heritage hubs have preserved ancient manufacturing techniques passed down through countless generations.<br><br>In the past, craft knowledge was closely guarded within extended families. Young apprentices learned by observing master artisans for years, developing tactile sensitivity and artistic mastery without formal textbooks. Each finished handicraft reflected not merely functional utility, but also spiritual beliefs, seasonal folklore, and cultural harmony. During festival seasons, whole villages buzzed with communal activity, celebrating patron saints who originally introduced the crafts.<br><br>In contemporary times, however, handicraft villages face severe headwinds from mass industrial production and rapid consumer culture. Inexpensive plastic and factory-manufactured goods often undercut handmade products in price. Furthermore, younger generations often migrate to bustling urban metropolises seeking higher-paying tech careers, leading to an acute shortage of skilled successor artisans.<br><br>To counter these vulnerabilities, forward-thinking craft communities are innovating boldly. Many have embraced eco-tourism and cultural experiential programs, welcoming hundreds of foreign and domestic visitors daily. Others collaborate with contemporary designers and utilize social media platforms to market high-end artisanal products globally. By bridging ancient wisdom with modern entrepreneurship, Vietnam's traditional villages are ensuring that their cultural soul thrives in the modern era.",
            "content": "What is the primary subject discussed in the passage?",
            "options": [
                {"id": "A", "content": "The heritage, current challenges, and revitalization of Vietnamese traditional craft villages"},
                {"id": "B", "content": "The step-by-step process of painting folk pictures in Dong Ho"},
                {"id": "C", "content": "Why young Vietnamese people prefer living in high-rise apartments"},
                {"id": "D", "content": "The economic impact of plastic manufacturing in big cities"}
            ],
            "correctAnswer": "A",
            "explanation": "Chủ đề bao quát: Di sản truyền thống, những thách thức hiện nay và các giải pháp hồi sinh làng nghề thủ công tại Việt Nam.",
            "translation": "Chủ đề chính: Di sản, thách thức và sự hồi sinh của các làng nghề truyền thống Việt Nam.",
            "unitTopic": "Reading Comprehension: Main Idea Unit 1"
        },
        {
            "id": 27,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "In the past, how did young apprentices primarily master traditional craft skills?",
            "options": [
                {"id": "A", "content": "By observing master artisans patiently over years without formal textbooks"},
                {"id": "B", "content": "By studying online video tutorials on the internet"},
                {"id": "C", "content": "By attending foreign vocational universities abroad"},
                {"id": "D", "content": "By reading ancient technical textbooks in libraries"}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn 2 nêu rõ: 'Young apprentices learned by observing master artisans for years, developing tactile sensitivity and artistic mastery without formal textbooks.'",
            "translation": "Bằng cách kiên nhẫn quan sát các nghệ nhân bậc thầy trong nhiều năm mà không cần sách giáo khoa chính quy.",
            "unitTopic": "Reading Comprehension: Detail Unit 1"
        },
        {
            "id": 28,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "The word \"undercut\" in paragraph 3 is closest in meaning to ______.",
            "options": [
                {"id": "A", "content": "offer goods at a lower price than competitors"},
                {"id": "B", "content": "destroy historical monuments completely"},
                {"id": "C", "content": "improve product quality significantly"},
                {"id": "D", "content": "refuse to sell goods to tourists"}
            ],
            "correctAnswer": "A",
            "explanation": "'Undercut' trong thương mại có nghĩa là bán phá giá / bán rẻ hơn đối thủ để cạnh tranh.",
            "translation": "undercut = bán với giá thấp hơn đối thủ cạnh tranh.",
            "unitTopic": "Reading Comprehension: Vocabulary in context"
        },
        {
            "id": 29,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "According to paragraph 3, why is there a shortage of successor artisans today?",
            "options": [
                {"id": "A", "content": "Youths frequently migrate to cities to seek higher-paying modern careers."},
                {"id": "B", "content": "Master artisans refuse to teach anyone outside their nuclear family."},
                {"id": "C", "content": "Craft materials have completely run out across the nation."},
                {"id": "D", "content": "The government has banned traditional handicraft workshops."}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn 3 nêu: 'younger generations often migrate to bustling urban metropolises seeking higher-paying tech careers, leading to an acute shortage of skilled successor artisans.'",
            "translation": "Giới trẻ thường di cư ra các đô thị để tìm kiếm công việc công nghệ có thu nhập cao hơn.",
            "unitTopic": "Reading Comprehension: Cause and Effect Unit 1"
        },
        {
            "id": 30,
            "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
            "instruction": "Chọn phương án đúng nhất A, B, C hoặc D theo nội dung bài đọc.",
            "content": "How are modern craft villages innovatively ensuring their future survival?",
            "options": [
                {"id": "A", "content": "By combining eco-tourism, modern design, and social media marketing"},
                {"id": "B", "content": "By closing all workshops to foreign tourists"},
                {"id": "C", "content": "By replacing all handmade ceramics with plastic products"},
                {"id": "D", "content": "By moving all workshops into high-rise city apartments"}
            ],
            "correctAnswer": "A",
            "explanation": "Đoạn cuối nêu rõ: 'Many have embraced eco-tourism and cultural experiential programs... Others collaborate with contemporary designers and utilize social media platforms...'",
            "translation": "Bằng cách kết hợp du lịch sinh thái, thiết kế hiện đại và tiếp thị trên mạng xã hội.",
            "unitTopic": "Reading Comprehension: Solution Unit 1"
        },

        # PHẦN VI: TÌM LỖI SAI (31-34)
        {
            "id": 31,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "The village elder <u>explained</u> (A) to the tourists <u>how to mould</u> (B) the clay, but he <u>refused</u> (C) to show <u>why to preserve</u> (D) the ancient furnace.",
            "options": [
                {"id": "A", "content": "explained"},
                {"id": "B", "content": "how to mould"},
                {"id": "C", "content": "refused"},
                {"id": "D", "content": "why to preserve"}
            ],
            "correctAnswer": "D",
            "explanation": "'Why' không bao giờ đi với 'to V'. Sửa thành mệnh đề đầy đủ: 'why they should preserve' hoặc 'why they had to preserve'.",
            "translation": "Sửa 'why to preserve' thành 'why they should preserve'.",
            "unitTopic": "Unit 1: Trap of why + to V"
        },
        {
            "id": 32,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "The more <u>modernly</u> (A) the public transport network is, the <u>better</u> (B) <u>quality of life</u> (C) city dwellers can <u>enjoy</u> (D).",
            "options": [
                {"id": "A", "content": "modernly"},
                {"id": "B", "content": "better"},
                {"id": "C", "content": "quality of life"},
                {"id": "D", "content": "enjoy"}
            ],
            "correctAnswer": "A",
            "explanation": "Sau động từ 'to be' (is), ta phải dùng tính từ (modern ➔ The more modern), không được dùng trạng từ (modernly).",
            "translation": "Sửa 'modernly' thành 'modern'.",
            "unitTopic": "Unit 2: Adjective vs Adverb in Double Comparative"
        },
        {
            "id": 33,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "If you <u>will exercise</u> (A) <u>regularly</u> (B) and eat nutritious food, you <u>can cope</u> (C) with <u>exam stress</u> (D) much better.",
            "options": [
                {"id": "A", "content": "will exercise"},
                {"id": "B", "content": "regularly"},
                {"id": "C", "content": "can cope"},
                {"id": "D", "content": "exam stress"}
            ],
            "correctAnswer": "A",
            "explanation": "Mệnh đề If loại 1 chia thì Hiện tại đơn (exercise), cấm dùng 'will exercise'.",
            "translation": "Sửa 'will exercise' thành 'exercise'.",
            "unitTopic": "Unit 3: If clause trap"
        },
        {
            "id": 34,
            "part": "PHẦN VI: TÌM LỖI SAI",
            "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
            "content": "I wish our school <u>is</u> (A) situated <u>closer to</u> (B) a large public park so that we <u>could play</u> (C) outdoors <u>after class</u> (D).",
            "options": [
                {"id": "A", "content": "is"},
                {"id": "B", "content": "closer to"},
                {"id": "C", "content": "could play"},
                {"id": "D", "content": "after class"}
            ],
            "correctAnswer": "A",
            "explanation": "Trong câu ước ở hiện tại, động từ 'to be' phải lùi thì về giả định 'were' (hoặc 'was').",
            "translation": "Sửa 'is' thành 'were'.",
            "unitTopic": "Unit 4: Wish trap"
        },

        # PHẦN VII: VIẾT LẠI CÂU (35-40)
        {
            "id": 35,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "\"Could you tell me how I can register for the pottery course?\" Mark asked.",
            "options": [
                {"id": "A", "content": "Mark asked how to register for the pottery course."},
                {"id": "B", "content": "Mark asked how registering for the pottery course."},
                {"id": "C", "content": "Mark asked why to register for the pottery course."},
                {"id": "D", "content": "Mark asked how can he register for the pottery course."}
            ],
            "correctAnswer": "A",
            "explanation": "Rút gọn câu gián tiếp chứa từ để hỏi: Wh-word + to V_bare ➔ 'how to register'.",
            "translation": "Mark đã hỏi cách thức đăng ký khóa học làm gốm.",
            "unitTopic": "Unit 1: How to V transformation"
        },
        {
            "id": 36,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "If students practice more mock tests, they will achieve higher entrance exam scores.",
            "options": [
                {"id": "A", "content": "The more mock tests students practice, the higher entrance exam scores they will achieve."},
                {"id": "B", "content": "The more mock tests students practice, the more high entrance exam scores they will achieve."},
                {"id": "C", "content": "The most mock tests students practice, the highest entrance exam scores they will achieve."},
                {"id": "D", "content": "The more students practice mock tests, the higher exam scores will they achieve."}
            ],
            "correctAnswer": "A",
            "explanation": "Công thức So sánh kép: The + comp + S1 + V1, the + comp + S2 + V2. Giữ trật tự S + V.",
            "translation": "Học sinh càng luyện tập nhiều đề thi thử thì điểm thi tuyển sinh đạt được càng cao.",
            "unitTopic": "Unit 2: Double comparative transformation"
        },
        {
            "id": 37,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "You must eat nutritious meals, or you will not stay fit during the exam preparation.",
            "options": [
                {"id": "A", "content": "Unless you eat nutritious meals, you will not stay fit during the exam preparation."},
                {"id": "B", "content": "Unless you don't eat nutritious meals, you will stay fit during the exam preparation."},
                {"id": "C", "content": "If you eat nutritious meals, you will not stay fit during the exam preparation."},
                {"id": "D", "content": "Unless you eat nutritious meals, you will stay fit during the exam preparation."}
            ],
            "correctAnswer": "A",
            "explanation": "Unless = If... not. Mệnh đề sau Unless luôn ở dạng khẳng định 'Unless you eat nutritious meals...'.",
            "translation": "Trừ khi bạn ăn các bữa ăn bổ dưỡng, nếu không bạn sẽ không duy trì được thể lực tốt trong quá trình ôn thi.",
            "unitTopic": "Unit 3: Unless transformation"
        },
        {
            "id": 38,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "My brother does not play traditional folk games with village children anymore.",
            "options": [
                {"id": "A", "content": "My brother used to play traditional folk games with village children."},
                {"id": "B", "content": "My brother is used to playing traditional folk games with village children."},
                {"id": "C", "content": "My brother was used to play traditional folk games with village children."},
                {"id": "D", "content": "My brother used to playing traditional folk games with village children."}
            ],
            "correctAnswer": "A",
            "explanation": "S + does not + V + anymore ➔ S + used to + V_bare (đã từng làm gì trong quá khứ).",
            "translation": "Anh trai tôi đã từng chơi các trò chơi dân gian truyền thống cùng trẻ con trong làng.",
            "unitTopic": "Unit 4: Used to transformation"
        },
        {
            "id": 39,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "We last visited our grandparents' ancestral village four years ago.",
            "options": [
                {"id": "A", "content": "We have not visited our grandparents' ancestral village for four years."},
                {"id": "B", "content": "We have visited our grandparents' ancestral village since four years."},
                {"id": "C", "content": "We didn't visit our grandparents' ancestral village for four years ago."},
                {"id": "D", "content": "It was four years since we have visited our grandparents' ancestral village."}
            ],
            "correctAnswer": "A",
            "explanation": "S + last + V2 + ... ago ➔ S + have/has not + V3 + for + [khoảng thời gian].",
            "translation": "Chúng tôi đã không về thăm ngôi làng tổ tiên của ông bà suốt bốn năm nay rồi.",
            "unitTopic": "Unit 5: Present Perfect transformation"
        },
        {
            "id": 40,
            "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
            "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
            "content": "It took the youth volunteer team a whole week to clean up the polluted village river.",
            "options": [
                {"id": "A", "content": "The youth volunteer team spent a whole week cleaning up the polluted village river."},
                {"id": "B", "content": "The youth volunteer team spent a whole week to clean up the polluted village river."},
                {"id": "C", "content": "The youth volunteer team took a whole week cleaning up the polluted village river."},
                {"id": "D", "content": "It spent the youth volunteer team a whole week cleaning up the polluted village river."}
            ],
            "correctAnswer": "A",
            "explanation": "It took + O + time + to V ➔ S + spent + time + V-ing.",
            "translation": "Đội thanh niên tình nguyện đã dành cả một tuần để dọn sạch dòng sông làng bị ô nhiễm.",
            "unitTopic": "Unit 6: Spend time V-ing transformation"
        }
    ]
}

ALL_EXAMS = [EXAM_1, EXAM_2, EXAM_3]

# 1. Output TypeScript file for Next.js web app
TS_CONTENT = f"""// AUTO-GENERATED: TRỌN BỘ 3 ĐỀ KIỂM TRA HỌC KÌ 1 — 6 UNIT ĐẦU TIẾNG ANH 9 GLOBAL SUCCESS
// Phục vụ học sinh làm bài trực tuyến trên Vercel không cần đăng nhập phức tạp

export interface ExamOption {{
  id: string;
  content: string;
}}

export interface ExamQuestion {{
  id: number;
  part: string;
  instruction?: string;
  readingText?: string;
  content: string;
  options: ExamOption[];
  correctAnswer: string;
  explanation: string;
  translation?: string;
  unitTopic?: string;
}}

export interface HK1Exam {{
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: "Cơ bản - Trọng tâm" | "Nâng cao - Phân hóa" | "Mô phỏng thi vào 10";
  badgeColor: string;
  questions: ExamQuestion[];
}}

export const HK1_EXAMS: HK1Exam[] = {json.dumps(ALL_EXAMS, ensure_ascii=False, indent=2)};
"""

with open(TS_OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(TS_CONTENT)

print(f"TypeScript exams module generated at: {TS_OUTPUT_FILE} ({os.path.getsize(TS_OUTPUT_FILE)} bytes)")

# 2. Output HTML & PDF for printing
HTML_HEAD = """<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>BỘ 3 ĐỀ KIỂM TRA HỌC KÌ 1 (6 UNIT ĐẦU) — TIẾNG ANH 9 GLOBAL SUCCESS</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  @page {
    size: A4;
    margin: 12mm 10mm 12mm 10mm;
    @bottom-center {
      content: "Bộ 3 Đề Kiểm Tra 6 Unit Đầu — Tiếng Anh 9 Global Success | Trang " counter(page);
      font-family: 'Open Sans', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
  }
  body { font-family: 'Open Sans', sans-serif; color: #1e293b; line-height: 1.45; font-size: 8.5pt; margin: 0; padding: 0; }
  .page-break { page-break-before: always; }
  .cover {
    height: 97vh; display: flex; flex-direction: column; justify-content: space-between; text-align: center;
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%); color: #ffffff;
    border-radius: 12px; padding: 40px 25px; box-sizing: border-box;
  }
  .exam-header {
    border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 12px;
  }
  .exam-title { font-family: 'Montserrat', sans-serif; font-size: 13pt; font-weight: 800; color: #1e3a8a; margin: 0; }
  .exam-sub { font-size: 9pt; color: #475569; font-weight: 600; margin-top: 3px; }
  .exam-meta { display: flex; gap: 15px; margin-top: 5px; font-size: 8pt; color: #0284c7; font-weight: 700; }
  .part-banner {
    background: #f1f5f9; border-left: 4px solid #2563eb; padding: 4px 10px; font-weight: 700;
    color: #1e3a8a; margin: 10px 0 6px 0; font-size: 8.5pt;
  }
  .q-item { margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dotted #cbd5e1; }
  .q-prompt { font-weight: 600; color: #0f172a; margin-bottom: 3px; }
  .q-options { margin-left: 10px; font-size: 8pt; color: #334155; }
  .q-ans { background: #f0fdf4; border-left: 3px solid #10b981; padding: 4px 8px; font-size: 7.8pt; margin-top: 3px; border-radius: 0 4px 4px 0; }
  .reading-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 8pt; line-height: 1.5; margin-bottom: 8px; font-style: italic; }
</style>
</head>
<body>
<div class="cover">
  <div>
    <span style="display:inline-block; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4); padding:6px 18px; border-radius:20px; font-size:10pt; font-weight:700; text-transform:uppercase;">Bộ Đề Kiểm Tra & Đánh Giá Năng Lực Học Sinh</span>
    <h1 style="font-family:'Montserrat',sans-serif; font-size:25pt; font-weight:800; line-height:1.2; margin:20px 0 10px 0; color:#fef08a;">TRỌN BỘ 3 ĐỀ KIỂM TRA<br>6 UNIT ĐẦU TIẾNG ANH 9 GLOBAL SUCCESS</h1>
    <p style="font-size:12pt; color:#f8fafc;">Bao Phủ Toàn Bộ Kiến Thức Học Kì 1 (Unit 1 - 6) • 120 Câu Hỏi Có Đáp Án & Lời Giải Chi Tiết</p>
  </div>
  <div style="background:rgba(255,255,255,0.15); border-radius:10px; padding:20px; max-width:600px; margin:0 auto; text-align:left;">
    <p style="margin:5px 0;">📝 <b>Đề 1 (HK1-01):</b> Cơ bản & Trọng tâm chuẩn chương trình (40 câu / 60 phút)</p>
    <p style="margin:5px 0;">📝 <b>Đề 2 (HK1-02):</b> Nâng cao & Phân hóa bẫy đề thi điểm 8-9-10 (40 câu / 60 phút)</p>
    <p style="margin:5px 0;">📝 <b>Đề 3 (HK1-03):</b> Mô phỏng 100% đề thi tuyển sinh vào lớp 10 Sở GD&ĐT (40 câu / 60 phút)</p>
  </div>
  <div style="font-size:8.5pt; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.3); padding-top:10px;">
    Biên soạn theo chương trình GDPT 2018 Tiếng Anh 9 Global Success • Dành cho Giáo viên & Học sinh ôn thi vào 10
  </div>
</div>
"""

HTML_BODY = ""
for exam in ALL_EXAMS:
    HTML_BODY += f"""
<div class="page-break"></div>
<div class="exam-header">
  <h2 class="exam-title">{exam['title']} (MÃ ĐỀ: {exam['code']})</h2>
  <div class="exam-sub">{exam['subtitle']}</div>
  <div class="exam-meta">
    <span>⏱️ Thời gian: {exam['durationMinutes']} phút</span>
    <span>📝 Số lượng: {exam['totalQuestions']} câu trắc nghiệm</span>
    <span>🎯 Mức độ: {exam['difficulty']}</span>
  </div>
</div>
"""
    current_part = ""
    for q in exam['questions']:
        if q['part'] != current_part:
            current_part = q['part']
            HTML_BODY += f"<div class='part-banner'>{current_part}</div>"
            if q.get('instruction'):
                HTML_BODY += f"<div style='font-style:italic; font-size:7.8pt; color:#475569; margin-bottom:5px;'>👉 {q['instruction']}</div>"

        if q.get('readingText'):
            HTML_BODY += f"<div class='reading-box'><b>Văn bản đọc hiểu:</b><br>{q['readingText']}</div>"

        opts_str = " &nbsp;&nbsp;|&nbsp;&nbsp; ".join([f"<b>{o['id']}.</b> {o['content']}" for o in q['options']])
        HTML_BODY += f"""
<div class="q-item">
  <div class="q-prompt"><b>Câu {q['id']}:</b> {q['content']}</div>
  <div class="q-options">{opts_str}</div>
  <div class="q-ans">
    <b style="color:#047857;">Đáp án: {q['correctAnswer']}</b> &nbsp;|&nbsp; <b>Phân tích:</b> {q['explanation']}
  </div>
</div>
"""

HTML_FOOTER = """
</body>
</html>
"""

FULL_HTML = HTML_HEAD + HTML_BODY + HTML_FOOTER

with open(HTML_OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(FULL_HTML)

print(f"HTML Exam Suite generated at: {HTML_OUTPUT_FILE} ({len(FULL_HTML)} bytes)")

# Compile to PDF
chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cmd = [
    chrome_bin,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_OUTPUT_FILE}",
    HTML_OUTPUT_FILE
]
print("Compiling PDF for 3 Exams with Google Chrome...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"SUCCESS: PDF generated at: {PDF_OUTPUT_FILE} ({os.path.getsize(PDF_OUTPUT_FILE)} bytes)")
else:
    print(f"Chrome PDF Error: {res.stderr}")
