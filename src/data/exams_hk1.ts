// AUTO-GENERATED: TRỌN BỘ 3 ĐỀ KIỂM TRA HỌC KÌ 1 — 6 UNIT ĐẦU TIẾNG ANH 9 GLOBAL SUCCESS
// Phục vụ học sinh làm bài trực tuyến trên Vercel không cần đăng nhập phức tạp

export interface ExamOption {
  id: string;
  content: string;
}

export interface ExamQuestion {
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
}

export interface HK1Exam {
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
}

export const HK1_EXAMS: HK1Exam[] = [
  {
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
      {
        "id": 1,
        "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
        "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
        "content": "A. pass<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; B. want<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; C. look<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; D. stopp<u>ed</u>",
        "options": [
          {
            "id": "A",
            "content": "passed"
          },
          {
            "id": "B",
            "content": "wanted"
          },
          {
            "id": "C",
            "content": "looked"
          },
          {
            "id": "D",
            "content": "stopped"
          }
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
          {
            "id": "A",
            "content": "crafts"
          },
          {
            "id": "B",
            "content": "pots"
          },
          {
            "id": "C",
            "content": "helpers"
          },
          {
            "id": "D",
            "content": "laughs"
          }
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
          {
            "id": "A",
            "content": "metro"
          },
          {
            "id": "B",
            "content": "balance"
          },
          {
            "id": "C",
            "content": "preserve"
          },
          {
            "id": "D",
            "content": "village"
          }
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
          {
            "id": "A",
            "content": "nutritious"
          },
          {
            "id": "B",
            "content": "difficult"
          },
          {
            "id": "C",
            "content": "memory"
          },
          {
            "id": "D",
            "content": "fascinate"
          }
        ],
        "correctAnswer": "A",
        "explanation": "'Nutritious' có đuôi -ious, trọng âm rơi vào âm tiết liền trước nó: /njuːˈtrɪʃəs/ (âm tiết 2). Các từ còn lại trọng âm rơi vào âm tiết 1: difficult /ˈdɪfɪkəlt/, memory /ˈmeməri/, fascinate /ˈfæsɪneɪt/.",
        "translation": "nutritious (âm 2); difficult, memory, fascinate (âm 1).",
        "unitTopic": "Stress: Trọng âm từ 3 âm tiết"
      },
      {
        "id": 5,
        "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
        "content": "Could you please tell me ______ to buy authentic Bat Trang pottery in Hanoi?",
        "options": [
          {
            "id": "A",
            "content": "where"
          },
          {
            "id": "B",
            "content": "why"
          },
          {
            "id": "C",
            "content": "which"
          },
          {
            "id": "D",
            "content": "what to"
          }
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
          {
            "id": "A",
            "content": "passed down"
          },
          {
            "id": "B",
            "content": "turned down"
          },
          {
            "id": "C",
            "content": "carried out"
          },
          {
            "id": "D",
            "content": "given up"
          }
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
          {
            "id": "A",
            "content": "more modern / less"
          },
          {
            "id": "B",
            "content": "more modern / fewer"
          },
          {
            "id": "C",
            "content": "more modernly / lesser"
          },
          {
            "id": "D",
            "content": "modern / little"
          }
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
          {
            "id": "A",
            "content": "cut down on"
          },
          {
            "id": "B",
            "content": "run out of"
          },
          {
            "id": "C",
            "content": "look back on"
          },
          {
            "id": "D",
            "content": "get on with"
          }
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
          {
            "id": "A",
            "content": "should"
          },
          {
            "id": "B",
            "content": "will should"
          },
          {
            "id": "C",
            "content": "should to"
          },
          {
            "id": "D",
            "content": "would"
          }
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
          {
            "id": "A",
            "content": "give up"
          },
          {
            "id": "B",
            "content": "put on"
          },
          {
            "id": "C",
            "content": "look into"
          },
          {
            "id": "D",
            "content": "bring back"
          }
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
          {
            "id": "A",
            "content": "lived"
          },
          {
            "id": "B",
            "content": "live"
          },
          {
            "id": "C",
            "content": "will live"
          },
          {
            "id": "D",
            "content": "have lived"
          }
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
          {
            "id": "A",
            "content": "was telling / went"
          },
          {
            "id": "B",
            "content": "told / was going"
          },
          {
            "id": "C",
            "content": "was telling / was going"
          },
          {
            "id": "D",
            "content": "told / went"
          }
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
          {
            "id": "A",
            "content": "used to walk"
          },
          {
            "id": "B",
            "content": "were used to walk"
          },
          {
            "id": "C",
            "content": "are used to walking"
          },
          {
            "id": "D",
            "content": "use to walking"
          }
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
          {
            "id": "A",
            "content": "has organized / since"
          },
          {
            "id": "B",
            "content": "organized / for"
          },
          {
            "id": "C",
            "content": "have organized / since"
          },
          {
            "id": "D",
            "content": "had organized / in"
          }
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
          {
            "id": "A",
            "content": "pick up"
          },
          {
            "id": "B",
            "content": "give up"
          },
          {
            "id": "C",
            "content": "cut down"
          },
          {
            "id": "D",
            "content": "look after"
          }
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
          {
            "id": "A",
            "content": "has gone to"
          },
          {
            "id": "B",
            "content": "has been to"
          },
          {
            "id": "C",
            "content": "went to"
          },
          {
            "id": "D",
            "content": "was at"
          }
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
          {
            "id": "A",
            "content": "eating"
          },
          {
            "id": "B",
            "content": "to eat"
          },
          {
            "id": "C",
            "content": "eat"
          },
          {
            "id": "D",
            "content": "to eating"
          }
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
          {
            "id": "A",
            "content": "to buy"
          },
          {
            "id": "B",
            "content": "buying"
          },
          {
            "id": "C",
            "content": "buy"
          },
          {
            "id": "D",
            "content": "for buying"
          }
        ],
        "correctAnswer": "A",
        "explanation": "'Stop to V' = dừng hành động đang làm lại ĐỂ thực hiện hành động khác (dừng xe để mua hoa). 'Stop V-ing' = dừng hẳn một thói quen.",
        "translation": "Trên đường đi làm về, bố tôi đã dừng lại để mua vài bông hoa tươi nhân ngày sinh nhật của mẹ tôi.",
        "unitTopic": "Unit 6: Stop to-V vs Stop V-ing"
      },
      {
        "id": 19,
        "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
        "content": "Tourist: \"Excuse me, could you tell me how to get to the ceramic workshop?\"<br>Local villager: \"______\"",
        "options": [
          {
            "id": "A",
            "content": "Go straight ahead for two blocks, and it's on your right."
          },
          {
            "id": "B",
            "content": "No, you don't have to buy ceramics here."
          },
          {
            "id": "C",
            "content": "I wish you had arrived earlier yesterday."
          },
          {
            "id": "D",
            "content": "You are welcome. Have a nice flight!"
          }
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
          {
            "id": "A",
            "content": "If you feel overwhelmed, you should break your revision into smaller sessions."
          },
          {
            "id": "B",
            "content": "You must not study anything until next week."
          },
          {
            "id": "C",
            "content": "I wish you had taken the exam two years ago."
          },
          {
            "id": "D",
            "content": "You will fail the exam if you take a rest."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Hồi đáp khuyên bảo tâm lý mang tính xây dựng và chuẩn ngữ pháp câu điều kiện loại 1 với 'should'.",
        "translation": "Lan: 'Em cảm thấy rất căng thẳng và mệt mỏi khi chuẩn bị cho kỳ thi sắp tới.' - Chuyên viên: 'Nếu em cảm thấy quá tải, em nên chia nhỏ các buổi ôn tập ra.'",
        "unitTopic": "Social Communication: Health advice"
      },
      {
        "id": 21,
        "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
        "readingText": "Bat Trang is a renowned traditional pottery village situated on the outskirts of Hanoi. For centuries, its skilled (21)______ have been creating delicate ceramic products that are admired both domestically and internationally. To ensure that these priceless techniques are not forgotten, master artisans continue to (22)______ their craft to the younger generation. Today, many young Vietnamese are eager to visit the village to take part in hands-on workshops where they learn (23)______ to mould clay and paint pottery plates. The village has also modernized its infrastructure, making it a very (24)______ destination for weekend family trips. Visitors always look forward (25)______ experiencing the unique blend of ancient heritage and lively modern tourism here.",
        "content": "Chọn từ thích hợp cho chỗ trống (21):",
        "options": [
          {
            "id": "A",
            "content": "artisans"
          },
          {
            "id": "B",
            "content": "counselors"
          },
          {
            "id": "C",
            "content": "commuters"
          },
          {
            "id": "D",
            "content": "officers"
          }
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
          {
            "id": "A",
            "content": "pass down"
          },
          {
            "id": "B",
            "content": "cut down"
          },
          {
            "id": "C",
            "content": "run out"
          },
          {
            "id": "D",
            "content": "give up"
          }
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
          {
            "id": "A",
            "content": "how"
          },
          {
            "id": "B",
            "content": "why"
          },
          {
            "id": "C",
            "content": "what to"
          },
          {
            "id": "D",
            "content": "when to moulding"
          }
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
          {
            "id": "A",
            "content": "liveable"
          },
          {
            "id": "B",
            "content": "attractive"
          },
          {
            "id": "C",
            "content": "illiterate"
          },
          {
            "id": "D",
            "content": "crowdedly"
          }
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
          {
            "id": "A",
            "content": "to"
          },
          {
            "id": "B",
            "content": "for"
          },
          {
            "id": "C",
            "content": "with"
          },
          {
            "id": "D",
            "content": "at"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc cố định: 'look forward to + V-ing' (trông mong, háo hức điều gì).",
        "translation": "look forward to experiencing (háo hức được trải nghiệm).",
        "unitTopic": "Cloze Test: Look forward to Unit 1"
      },
      {
        "id": 26,
        "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
        "readingText": "In traditional Vietnamese society decades ago, the extended family was the core structure of domestic life. Three or sometimes even four generations lived under one roof: great-grandparents, grandparents, parents, and children. In such households, younger members learned to respect seniority and listen carefully to the wisdom of their elders. Daily chores like cooking, farming, and childcare were shared cooperatively among family members. Whenever conflicts arose, grandparents served as patient mediators, helping to maintain household harmony.<br><br>However, as Vietnam underwent rapid industrialization and urbanization over recent decades, family models have transformed remarkably. Today, nuclear families consisting only of parents and their children have become the prevailing pattern in big cities. Modern apartments and demanding career paths often leave little room for multi-generational living. Young urban couples enjoy greater independence and flexibility in making decisions for their children's education. Furthermore, modern appliances such as washing machines, vacuum cleaners, and food delivery apps have significantly reduced household burdens.<br><br>Nonetheless, nuclear family life brings new challenges. Many elderly grandparents in the countryside feel lonely, while working parents in cities struggle to balance demanding work schedules with quality time for their children. To bridge this generational gap, many urban families now maintain regular weekend reunions, celebrating birthdays and traditional holidays together so that sacred family values remain cherished.",
        "content": "What is the main topic of the passage?",
        "options": [
          {
            "id": "A",
            "content": "The transformation from extended to nuclear families in Vietnam"
          },
          {
            "id": "B",
            "content": "The daily chores in traditional rural households"
          },
          {
            "id": "C",
            "content": "How modern electrical appliances help Vietnamese mothers"
          },
          {
            "id": "D",
            "content": "The problems of building high-rise apartments in big cities"
          }
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
          {
            "id": "A",
            "content": "Grandparents"
          },
          {
            "id": "B",
            "content": "School counselors"
          },
          {
            "id": "C",
            "content": "Community helpers"
          },
          {
            "id": "D",
            "content": "Children"
          }
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
          {
            "id": "A",
            "content": "most common and widespread"
          },
          {
            "id": "B",
            "content": "extremely ancient"
          },
          {
            "id": "C",
            "content": "barefoot and poor"
          },
          {
            "id": "D",
            "content": "complicated"
          }
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
          {
            "id": "A",
            "content": "Young couples have greater independence in making educational decisions."
          },
          {
            "id": "B",
            "content": "Modern household conveniences save time on daily chores."
          },
          {
            "id": "C",
            "content": "Grandparents refuse to live with their grandchildren."
          },
          {
            "id": "D",
            "content": "Demanding careers and modern apartments suit smaller families."
          }
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
          {
            "id": "A",
            "content": "By organizing regular weekend reunions and holiday get-togethers"
          },
          {
            "id": "B",
            "content": "By sending children to study abroad"
          },
          {
            "id": "C",
            "content": "By stopping all online communication"
          },
          {
            "id": "D",
            "content": "By moving back to the countryside permanently"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Đoạn cuối nêu rõ: 'To bridge this generational gap, many urban families now maintain regular weekend reunions, celebrating birthdays and traditional holidays together...'",
        "translation": "Nhiều gia đình duy trì các buổi đoàn tụ cuối tuần đều đặn và cùng tổ chức các ngày lễ truyền thống.",
        "unitTopic": "Reading Comprehension: Inference Unit 6"
      },
      {
        "id": 31,
        "part": "PHẦN VI: TÌM LỖI SAI",
        "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
        "content": "The young apprentice <u>didn't know</u> (A) how to shape the clay, but the master artisan <u>refused</u> (B) to explain <u>why to do</u> (C) it <u>carefully</u> (D).",
        "options": [
          {
            "id": "A",
            "content": "didn't know"
          },
          {
            "id": "B",
            "content": "refused"
          },
          {
            "id": "C",
            "content": "why to do"
          },
          {
            "id": "D",
            "content": "carefully"
          }
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
          {
            "id": "A",
            "content": "The most crowded"
          },
          {
            "id": "B",
            "content": "the harder"
          },
          {
            "id": "C",
            "content": "to find"
          },
          {
            "id": "D",
            "content": "affordable"
          }
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
          {
            "id": "A",
            "content": "will maintain"
          },
          {
            "id": "B",
            "content": "well-balanced"
          },
          {
            "id": "C",
            "content": "can improve"
          },
          {
            "id": "D",
            "content": "health"
          }
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
          {
            "id": "A",
            "content": "is"
          },
          {
            "id": "B",
            "content": "to help"
          },
          {
            "id": "C",
            "content": "right now"
          },
          {
            "id": "D",
            "content": "the examination"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Trong câu ước ở hiện tại (dấu hiệu 'right now'), động từ 'to be' phải lùi thì về giả định 'were' (hoặc 'was') cho tất cả các ngôi.",
        "translation": "Sửa 'is' thành 'were'.",
        "unitTopic": "Unit 4: Wish for present trap"
      },
      {
        "id": 35,
        "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
        "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
        "content": "Can you show me where I can buy authentic handicraft souvenirs in this village?",
        "options": [
          {
            "id": "A",
            "content": "Can you show me where to buy authentic handicraft souvenirs in this village?"
          },
          {
            "id": "B",
            "content": "Can you show me where buying authentic handicraft souvenirs in this village?"
          },
          {
            "id": "C",
            "content": "Can you show me why to buy authentic handicraft souvenirs in this village?"
          },
          {
            "id": "D",
            "content": "Can you show me where can I buy authentic handicraft souvenirs in this village?"
          }
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
          {
            "id": "A",
            "content": "The faster life in the big city becomes, the more stressed people feel."
          },
          {
            "id": "B",
            "content": "The more fast life in the big city becomes, the stressed people feel."
          },
          {
            "id": "C",
            "content": "The faster life becomes, the people feel more stressed."
          },
          {
            "id": "D",
            "content": "The most fast life in the big city becomes, the most stressed people feel."
          }
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
          {
            "id": "A",
            "content": "Unless you get at least eight hours of sleep every night, you cannot concentrate on your revision."
          },
          {
            "id": "B",
            "content": "Unless you don't get at least eight hours of sleep, you cannot concentrate on your revision."
          },
          {
            "id": "C",
            "content": "If you get at least eight hours of sleep every night, you cannot concentrate on your revision."
          },
          {
            "id": "D",
            "content": "Unless you get enough sleep, you can concentrate on your revision."
          }
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
          {
            "id": "A",
            "content": "My father used to walk barefoot to school when he was a boy."
          },
          {
            "id": "B",
            "content": "My father is used to walking barefoot to school when he was a boy."
          },
          {
            "id": "C",
            "content": "My father used to walking barefoot to school when he was a boy."
          },
          {
            "id": "D",
            "content": "My father didn't use to walk barefoot to school anymore."
          }
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
          {
            "id": "A",
            "content": "We have not gone on an eco-tour to Cuc Phuong National Park for two years."
          },
          {
            "id": "B",
            "content": "We have gone on an eco-tour to Cuc Phuong National Park since two years ago."
          },
          {
            "id": "C",
            "content": "We didn't go on an eco-tour to Cuc Phuong National Park for two years ago."
          },
          {
            "id": "D",
            "content": "It is two years when we last went on an eco-tour to Cuc Phuong."
          }
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
          {
            "id": "A",
            "content": "Vietnamese people spent decades adapting to the fast-paced modern lifestyle."
          },
          {
            "id": "B",
            "content": "Vietnamese people spent decades to adapt to the fast-paced modern lifestyle."
          },
          {
            "id": "C",
            "content": "Vietnamese people spent decades to adapting the fast-paced modern lifestyle."
          },
          {
            "id": "D",
            "content": "It spent Vietnamese people decades adapting to modern lifestyle."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Chuyển đổi: It takes/took + O + time + to V ➔ S + spend/spent + time + V-ing.",
        "translation": "Người Việt Nam đã dành nhiều thập kỷ để thích nghi với lối sống hiện đại hối hả.",
        "unitTopic": "Unit 6: Spend time V-ing transformation"
      }
    ]
  },
  {
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
      {
        "id": 1,
        "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
        "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
        "content": "A. b<u>a</u>lance &nbsp;&nbsp;&nbsp;&nbsp; B. h<u>a</u>ndicraft &nbsp;&nbsp;&nbsp;&nbsp; C. <u>a</u>rtisan &nbsp;&nbsp;&nbsp;&nbsp; D. f<u>a</u>scinate",
        "options": [
          {
            "id": "A",
            "content": "balance"
          },
          {
            "id": "B",
            "content": "handicraft"
          },
          {
            "id": "C",
            "content": "artisan"
          },
          {
            "id": "D",
            "content": "fascinate"
          }
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
          {
            "id": "A",
            "content": "preserve"
          },
          {
            "id": "B",
            "content": "metro"
          },
          {
            "id": "C",
            "content": "memorable"
          },
          {
            "id": "D",
            "content": "breadth"
          }
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
          {
            "id": "A",
            "content": "congestion"
          },
          {
            "id": "B",
            "content": "counselor"
          },
          {
            "id": "C",
            "content": "seniority"
          },
          {
            "id": "D",
            "content": "convenience"
          }
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
          {
            "id": "A",
            "content": "illiterate"
          },
          {
            "id": "B",
            "content": "cosmopolitan"
          },
          {
            "id": "C",
            "content": "affordable"
          },
          {
            "id": "D",
            "content": "community"
          }
        ],
        "correctAnswer": "B",
        "explanation": "'Cosmopolitan' /ˌkɒzməˈpɒlɪtən/ có trọng âm chính rơi vào âm tiết thứ 3. Các từ còn lại có trọng âm rơi vào âm tiết thứ 2: illiterate /ɪˈlɪtərət/, affordable /əˈfɔːdəbl/, community /kəˈmjuːnəti/.",
        "translation": "cosmopolitan (âm 3); illiterate, affordable, community (âm 2).",
        "unitTopic": "Stress: Trọng âm từ 4 âm tiết"
      },
      {
        "id": 5,
        "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
        "content": "The backpackers debated ______ or not to hire a local guide before trekking into the misty mountain forest.",
        "options": [
          {
            "id": "A",
            "content": "whether"
          },
          {
            "id": "B",
            "content": "if"
          },
          {
            "id": "C",
            "content": "why to"
          },
          {
            "id": "D",
            "content": "what"
          }
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
          {
            "id": "A",
            "content": "handed down"
          },
          {
            "id": "B",
            "content": "turned down"
          },
          {
            "id": "C",
            "content": "run out"
          },
          {
            "id": "D",
            "content": "brought up"
          }
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
          {
            "id": "A",
            "content": "more / fewer"
          },
          {
            "id": "B",
            "content": "most / less"
          },
          {
            "id": "C",
            "content": "more / less"
          },
          {
            "id": "D",
            "content": "more / lesser"
          }
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
          {
            "id": "A",
            "content": "ran out of"
          },
          {
            "id": "B",
            "content": "cut down on"
          },
          {
            "id": "C",
            "content": "looked back on"
          },
          {
            "id": "D",
            "content": "got on with"
          }
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
          {
            "id": "A",
            "content": "take / may"
          },
          {
            "id": "B",
            "content": "don't take / will"
          },
          {
            "id": "C",
            "content": "took / could"
          },
          {
            "id": "D",
            "content": "takes / can"
          }
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
          {
            "id": "A",
            "content": "cope with"
          },
          {
            "id": "B",
            "content": "give in"
          },
          {
            "id": "C",
            "content": "stay up"
          },
          {
            "id": "D",
            "content": "pass down"
          }
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
          {
            "id": "A",
            "content": "had preserved / would preserve"
          },
          {
            "id": "B",
            "content": "preserved"
          },
          {
            "id": "C",
            "content": "preserve"
          },
          {
            "id": "D",
            "content": "will preserve"
          }
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
          {
            "id": "A",
            "content": "were you doing"
          },
          {
            "id": "B",
            "content": "did you do"
          },
          {
            "id": "C",
            "content": "are you doing"
          },
          {
            "id": "D",
            "content": "had you done"
          }
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
          {
            "id": "A",
            "content": "living"
          },
          {
            "id": "B",
            "content": "live"
          },
          {
            "id": "C",
            "content": "lived"
          },
          {
            "id": "D",
            "content": "be living"
          }
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
          {
            "id": "A",
            "content": "has ever taken part"
          },
          {
            "id": "B",
            "content": "ever took part"
          },
          {
            "id": "C",
            "content": "was taking part"
          },
          {
            "id": "D",
            "content": "had ever taken part"
          }
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
          {
            "id": "A",
            "content": "has been to"
          },
          {
            "id": "B",
            "content": "has gone to"
          },
          {
            "id": "C",
            "content": "went to"
          },
          {
            "id": "D",
            "content": "is going to"
          }
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
          {
            "id": "A",
            "content": "since"
          },
          {
            "id": "B",
            "content": "for"
          },
          {
            "id": "C",
            "content": "when"
          },
          {
            "id": "D",
            "content": "until"
          }
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
          {
            "id": "A",
            "content": "relying"
          },
          {
            "id": "B",
            "content": "to rely"
          },
          {
            "id": "C",
            "content": "rely"
          },
          {
            "id": "D",
            "content": "to relying"
          }
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
          {
            "id": "A",
            "content": "to switch"
          },
          {
            "id": "B",
            "content": "switching"
          },
          {
            "id": "C",
            "content": "switch"
          },
          {
            "id": "D",
            "content": "to switching"
          }
        ],
        "correctAnswer": "A",
        "explanation": "'Remember to V' = nhớ phải làm bổn phận, nhiệm vụ trong tương lai. 'Remember V-ing' = nhớ đã làm gì trong quá khứ.",
        "translation": "Trước khi khóa cửa câu lạc bộ khoa học, xin hãy nhớ tắt tất cả các mạch điện công suất cao.",
        "unitTopic": "Unit 6: Remember to-V vs Remember V-ing"
      },
      {
        "id": 19,
        "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
        "content": "Mark: \"I feel like I'm running out of time to review all 12 units before the entrance exam!\"<br>Teacher: \"______\"",
        "options": [
          {
            "id": "A",
            "content": "Don't panic. If you prioritize the core grammar formulas first, you can manage your time effectively."
          },
          {
            "id": "B",
            "content": "You must give up studying English immediately."
          },
          {
            "id": "C",
            "content": "I wish you didn't have to take the exam."
          },
          {
            "id": "D",
            "content": "It is true that time runs faster than a train."
          }
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
          {
            "id": "A",
            "content": "Yes, every single piece is handcrafted by our master artisans right in this village."
          },
          {
            "id": "B",
            "content": "No, you cannot touch them because they are very cheap."
          },
          {
            "id": "C",
            "content": "I wish they were not made of clay."
          },
          {
            "id": "D",
            "content": "You should cut down on looking at them."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Câu trả lời lịch sự và tự hào của chủ xưởng gốm về sản phẩm thủ công địa phương.",
        "translation": "Du khách: 'Những chiếc bát gốm vẽ tay này trông thật tráng lệ! Có phải nghệ nhân địa phương làm ra không?' - Chủ xưởng: 'Vâng, từng sản phẩm đều được làm thủ công bởi các nghệ nhân bậc thầy ngay tại làng này.'",
        "unitTopic": "Social Communication: Craft appreciation"
      },
      {
        "id": 21,
        "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
        "readingText": "Urbanization has brought remarkable transformations to major Vietnamese cities like Hanoi and Ho Chi Minh City. As populations expand rapidly, local governments are investing heavily in modern public infrastructure to relieve chronic traffic (21)______. The completion of elevated skytrains and underground metro lines has provided commuters with a clean, fast, and (22)______ alternative to private motorbikes. In addition, more green parks and pedestrian zones have been created to make city life more (23)______ for young families. Environmental campaigns also encourage citizens to (24)______ on single-use plastics and save electricity. Furthermore, municipal authorities are organizing regular community workshops where residents learn (25)______ to sort household waste effectively. These joint efforts ensure that economic growth goes hand in hand with environmental preservation.",
        "content": "Chọn từ thích hợp cho chỗ trống (21):",
        "options": [
          {
            "id": "A",
            "content": "congestion"
          },
          {
            "id": "B",
            "content": "lifestyle"
          },
          {
            "id": "C",
            "content": "counselor"
          },
          {
            "id": "D",
            "content": "seniority"
          }
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
          {
            "id": "A",
            "content": "affordable"
          },
          {
            "id": "B",
            "content": "illiterate"
          },
          {
            "id": "C",
            "content": "barefoot"
          },
          {
            "id": "D",
            "content": "stressful"
          }
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
          {
            "id": "A",
            "content": "liveable"
          },
          {
            "id": "B",
            "content": "livelihood"
          },
          {
            "id": "C",
            "content": "living"
          },
          {
            "id": "D",
            "content": "live"
          }
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
          {
            "id": "A",
            "content": "cut down"
          },
          {
            "id": "B",
            "content": "run out"
          },
          {
            "id": "C",
            "content": "pass down"
          },
          {
            "id": "D",
            "content": "give up"
          }
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
          {
            "id": "A",
            "content": "how"
          },
          {
            "id": "B",
            "content": "why"
          },
          {
            "id": "C",
            "content": "which"
          },
          {
            "id": "D",
            "content": "where to sorting"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc: 'learn how to sort' = học cách phân loại rác thải gia đình.",
        "translation": "learn how to sort household waste (học cách phân loại rác thải).",
        "unitTopic": "Cloze Test: Unit 1"
      },
      {
        "id": 26,
        "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
        "readingText": "Adolescence is a transformative period marked by rapid physical, cognitive, and emotional development. However, modern teenagers face unprecedented pressures that previous generations rarely encountered. Heavy academic workloads, intense entrance exam competition, and round-the-clock connectivity on social media platforms can trigger chronic anxiety and sleep deprivation. Many ninth graders admit to staying up late past midnight, sacrificing essential rest to cram for tests or scroll through smartphone feeds.<br><br>Psychological researchers emphasize that sustained mental well-being requires a holistic approach to daily life. First and foremost, teenagers need a well-balanced diet rich in leafy vegetables, lean proteins, and omega-3 fatty acids, which fuel brain functioning and stabilize emotional moods. Second, regular physical activity is an extraordinarily potent stress reliever. Engaging in moderate sports such as swimming, basketball, or jogging for 45 minutes triggers the release of endorphins—natural hormones that uplift spirits and improve memory retention.<br><br>Equally crucial is open emotional communication. Instead of bottling up anxiety, teens should be encouraged to confide in trustworthy adults, whether they are empathetic parents, dedicated teachers, or professional school counselors. Schools that establish psychological counseling offices have reported significant reductions in student distress. Ultimately, academic excellence should never be pursued at the expense of a child's mental and physical health. Learning how to cope with stress early in life equips young people with resilience that will serve them well into adulthood.",
        "content": "What is the primary purpose of the passage?",
        "options": [
          {
            "id": "A",
            "content": "To examine causes of teenage stress and suggest holistic healthy living solutions"
          },
          {
            "id": "B",
            "content": "To criticize schools for assigning too much homework to students"
          },
          {
            "id": "C",
            "content": "To explain the history of entrance examinations in secondary schools"
          },
          {
            "id": "D",
            "content": "To advise teenagers to stop using smartphones permanently"
          }
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
          {
            "id": "A",
            "content": "Heavy academic workloads and round-the-clock social media connectivity"
          },
          {
            "id": "B",
            "content": "Lack of nutritious food in school canteens"
          },
          {
            "id": "C",
            "content": "Having to walk barefoot to school every morning"
          },
          {
            "id": "D",
            "content": "Disagreements over extended family traditions"
          }
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
          {
            "id": "A",
            "content": "powerful and effective"
          },
          {
            "id": "B",
            "content": "ancient and traditional"
          },
          {
            "id": "C",
            "content": "dangerous and harmful"
          },
          {
            "id": "D",
            "content": "expensive"
          }
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
          {
            "id": "A",
            "content": "Triggering the release of endorphins that uplift mood and improve memory"
          },
          {
            "id": "B",
            "content": "Allowing students to skip nutritious meals"
          },
          {
            "id": "C",
            "content": "Helping students become professional athletes"
          },
          {
            "id": "D",
            "content": "Reducing the need for sleep to only four hours per night"
          }
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
          {
            "id": "A",
            "content": "Learning stress management early provides valuable resilience for later life."
          },
          {
            "id": "B",
            "content": "High exam marks are always more important than mental health."
          },
          {
            "id": "C",
            "content": "School counselors should assign grades to students."
          },
          {
            "id": "D",
            "content": "Parents should never discuss exam scores with their children."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Câu kết đoạn cuối khẳng định: 'Learning how to cope with stress early in life equips young people with resilience that will serve them well into adulthood.'",
        "translation": "Học cách quản lý căng thẳng sớm giúp trang bị sự kiên cường quý giá cho cuộc sống sau này.",
        "unitTopic": "Reading Comprehension: Inference Unit 3"
      },
      {
        "id": 31,
        "part": "PHẦN VI: TÌM LỖI SAI",
        "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
        "content": "The foreign tourist <u>wondered</u> (A) <u>why to hire</u> (B) a local guide when there was already a digital map <u>available</u> (C) on <u>his smartphone</u> (D).",
        "options": [
          {
            "id": "A",
            "content": "wondered"
          },
          {
            "id": "B",
            "content": "why to hire"
          },
          {
            "id": "C",
            "content": "available"
          },
          {
            "id": "D",
            "content": "his smartphone"
          }
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
          {
            "id": "A",
            "content": "rapidly"
          },
          {
            "id": "B",
            "content": "less"
          },
          {
            "id": "C",
            "content": "public parks"
          },
          {
            "id": "D",
            "content": "recreational activities"
          }
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
          {
            "id": "A",
            "content": "don't reduce"
          },
          {
            "id": "B",
            "content": "will suffer"
          },
          {
            "id": "C",
            "content": "chronic headaches"
          },
          {
            "id": "D",
            "content": "eye fatigue"
          }
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
          {
            "id": "A",
            "content": "distinctly"
          },
          {
            "id": "B",
            "content": "to lock"
          },
          {
            "id": "C",
            "content": "before leaving"
          },
          {
            "id": "D",
            "content": "house"
          }
        ],
        "correctAnswer": "B",
        "explanation": "Nhớ ĐÃ LÀM việc gì trong quá khứ ➔ dùng 'remember V-ing' (remembered locking). 'Remember to V' là nhớ PHẢI làm bổn phận.",
        "translation": "Sửa 'to lock' thành 'locking'.",
        "unitTopic": "Unit 6: Remember to V vs Remember V-ing"
      },
      {
        "id": 35,
        "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
        "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
        "content": "They didn't know who they should consult for professional mental health advice.",
        "options": [
          {
            "id": "A",
            "content": "They didn't know who to consult for professional mental health advice."
          },
          {
            "id": "B",
            "content": "They didn't know who consulting for professional mental health advice."
          },
          {
            "id": "C",
            "content": "They didn't know who should consult for professional mental health advice."
          },
          {
            "id": "D",
            "content": "They didn't know why to consult for professional mental health advice."
          }
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
          {
            "id": "A",
            "content": "The more polluted the city air is, the harder it is for elderly residents to breathe."
          },
          {
            "id": "B",
            "content": "The polluted the city air is, the harder it is for elderly residents to breathe."
          },
          {
            "id": "C",
            "content": "The more polluted is the city air, the harder it is for elderly residents to breathe."
          },
          {
            "id": "D",
            "content": "The most polluted the city air is, the most hard it is for elderly residents to breathe."
          }
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
          {
            "id": "A",
            "content": "Unless you cut down on excessive screen time, you will suffer from chronic eye strain."
          },
          {
            "id": "B",
            "content": "Unless you don't cut down on excessive screen time, you will suffer from chronic eye strain."
          },
          {
            "id": "C",
            "content": "Unless you cut down on screen time, you won't suffer from eye strain."
          },
          {
            "id": "D",
            "content": "If you cut down on excessive screen time, you will suffer from chronic eye strain."
          }
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
          {
            "id": "A",
            "content": "My sister used to play traditional folk games like tug of war with village children."
          },
          {
            "id": "B",
            "content": "My sister is used to playing traditional folk games like tug of war with village children."
          },
          {
            "id": "C",
            "content": "My sister used to playing traditional folk games like tug of war with village children."
          },
          {
            "id": "D",
            "content": "My sister didn't use to play traditional folk games anymore."
          }
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
          {
            "id": "A",
            "content": "The artisan has carved traditional wooden masks for five years."
          },
          {
            "id": "B",
            "content": "The artisan carved traditional wooden masks since five years."
          },
          {
            "id": "C",
            "content": "The artisan has been carving traditional wooden masks since five years ago."
          },
          {
            "id": "D",
            "content": "It is five years when the artisan started carving traditional wooden masks."
          }
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
          {
            "id": "A",
            "content": "The foreign exchange students spent two weeks getting on with their local host family."
          },
          {
            "id": "B",
            "content": "The foreign exchange students spent two weeks to get on with their local host family."
          },
          {
            "id": "C",
            "content": "The foreign exchange students took two weeks getting on with their local host family."
          },
          {
            "id": "D",
            "content": "It spent two weeks for the foreign exchange students to get on with their host family."
          }
        ],
        "correctAnswer": "A",
        "explanation": "It took + O + time + to V ➔ S + spent + time + V-ing.",
        "translation": "Các du học sinh trao đổi đã mất hai tuần để hòa hợp với gia đình người bản xứ.",
        "unitTopic": "Unit 6: Spend time V-ing transformation"
      }
    ]
  },
  {
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
      {
        "id": 1,
        "part": "PHẦN I: NGỮ ÂM & TRỌNG ÂM",
        "instruction": "Chọn từ có phần gạch chân phát âm khác với các từ còn lại.",
        "content": "A. breath<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; B. broaden<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; C. moderniz<u>ed</u> &nbsp;&nbsp;&nbsp;&nbsp; D. act<u>ed</u>",
        "options": [
          {
            "id": "A",
            "content": "breathed"
          },
          {
            "id": "B",
            "content": "broadened"
          },
          {
            "id": "C",
            "content": "modernized"
          },
          {
            "id": "D",
            "content": "acted"
          }
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
          {
            "id": "A",
            "content": "villages"
          },
          {
            "id": "B",
            "content": "devices"
          },
          {
            "id": "C",
            "content": "branches"
          },
          {
            "id": "D",
            "content": "techniques"
          }
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
          {
            "id": "A",
            "content": "extend"
          },
          {
            "id": "B",
            "content": "broaden"
          },
          {
            "id": "C",
            "content": "modern"
          },
          {
            "id": "D",
            "content": "healthy"
          }
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
          {
            "id": "A",
            "content": "experience"
          },
          {
            "id": "B",
            "content": "generation"
          },
          {
            "id": "C",
            "content": "community"
          },
          {
            "id": "D",
            "content": "traditional"
          }
        ],
        "correctAnswer": "B",
        "explanation": "'Generation' /ˌdʒenəˈreɪʃn/ có đuôi -tion, trọng âm rơi vào âm tiết thứ 3. Các từ còn lại có trọng âm rơi vào âm tiết thứ 2: experience /ɪkˈspɪəriəns/, community /kəˈmjuːnəti/, traditional /trəˈdɪʃənl/.",
        "translation": "generation (âm 3); experience, community, traditional (âm 2).",
        "unitTopic": "Stress: Trọng âm từ 4 âm tiết"
      },
      {
        "id": 5,
        "part": "PHẦN II: NGỮ PHÁP & TỪ VỰNG",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành câu.",
        "content": "The foreign visitor inquired at the reception desk ______ to register for the pottery sculpting workshop.",
        "options": [
          {
            "id": "A",
            "content": "how"
          },
          {
            "id": "B",
            "content": "why"
          },
          {
            "id": "C",
            "content": "which"
          },
          {
            "id": "D",
            "content": "what to registering"
          }
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
          {
            "id": "A",
            "content": "turned down"
          },
          {
            "id": "B",
            "content": "passed down"
          },
          {
            "id": "C",
            "content": "run out"
          },
          {
            "id": "D",
            "content": "given in"
          }
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
          {
            "id": "A",
            "content": "more / better"
          },
          {
            "id": "B",
            "content": "most / good"
          },
          {
            "id": "C",
            "content": "more / more well"
          },
          {
            "id": "D",
            "content": "much / better"
          }
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
          {
            "id": "A",
            "content": "liveable"
          },
          {
            "id": "B",
            "content": "livelihood"
          },
          {
            "id": "C",
            "content": "lively"
          },
          {
            "id": "D",
            "content": "alive"
          }
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
          {
            "id": "A",
            "content": "shouldn't"
          },
          {
            "id": "B",
            "content": "must"
          },
          {
            "id": "C",
            "content": "won't should"
          },
          {
            "id": "D",
            "content": "might to"
          }
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
          {
            "id": "A",
            "content": "well-balanced"
          },
          {
            "id": "B",
            "content": "barefoot"
          },
          {
            "id": "C",
            "content": "illiterate"
          },
          {
            "id": "D",
            "content": "bustling"
          }
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
          {
            "id": "A",
            "content": "showed"
          },
          {
            "id": "B",
            "content": "show"
          },
          {
            "id": "C",
            "content": "will show"
          },
          {
            "id": "D",
            "content": "have shown"
          }
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
          {
            "id": "A",
            "content": "were playing"
          },
          {
            "id": "B",
            "content": "played"
          },
          {
            "id": "C",
            "content": "are playing"
          },
          {
            "id": "D",
            "content": "had played"
          }
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
          {
            "id": "A",
            "content": "used to act out"
          },
          {
            "id": "B",
            "content": "were acting out"
          },
          {
            "id": "C",
            "content": "got used to act out"
          },
          {
            "id": "D",
            "content": "use to act out"
          }
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
          {
            "id": "A",
            "content": "has taken part"
          },
          {
            "id": "B",
            "content": "took part"
          },
          {
            "id": "C",
            "content": "have taken part"
          },
          {
            "id": "D",
            "content": "had taken part"
          }
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
          {
            "id": "A",
            "content": "has gone to"
          },
          {
            "id": "B",
            "content": "has been to"
          },
          {
            "id": "C",
            "content": "went"
          },
          {
            "id": "D",
            "content": "was going to"
          }
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
          {
            "id": "A",
            "content": "picked up"
          },
          {
            "id": "B",
            "content": "gave up"
          },
          {
            "id": "C",
            "content": "cut down"
          },
          {
            "id": "D",
            "content": "looked after"
          }
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
          {
            "id": "A",
            "content": "to live"
          },
          {
            "id": "B",
            "content": "live"
          },
          {
            "id": "C",
            "content": "lived"
          },
          {
            "id": "D",
            "content": "to living"
          }
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
          {
            "id": "A",
            "content": "turning"
          },
          {
            "id": "B",
            "content": "to turn"
          },
          {
            "id": "C",
            "content": "turn"
          },
          {
            "id": "D",
            "content": "to turning"
          }
        ],
        "correctAnswer": "A",
        "explanation": "'Remember V-ing' = nhớ đã làm hành động gì trong quá khứ. Ngữ cảnh: Tôi nhớ rõ ràng là ĐÃ tắt bếp trước khi rời đi.",
        "translation": "Tôi nhớ rất rõ là mình đã tắt bếp từ trước khi chúng tôi rời đi tham gia lễ rước đèn trung thu.",
        "unitTopic": "Unit 6: Remember V-ing"
      },
      {
        "id": 19,
        "part": "PHẦN III: GIAO TIẾP XÃ HỘI",
        "instruction": "Chọn phương án đúng nhất A, B, C hoặc D để hoàn thành cuộc hội thoại.",
        "content": "Student: \"Excuse me, sir. May I give you a hand with those heavy ceramic boxes?\"<br>Artisan: \"______\"",
        "options": [
          {
            "id": "A",
            "content": "That is extremely kind of you, young man. Thank you so much!"
          },
          {
            "id": "B",
            "content": "No, you must not touch my boxes."
          },
          {
            "id": "C",
            "content": "I wish you had arrived two days ago."
          },
          {
            "id": "D",
            "content": "You will be penalized if you carry them."
          }
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
          {
            "id": "A",
            "content": "Thank you! Our weavers spend days perfecting every single thread by hand."
          },
          {
            "id": "B",
            "content": "You should not look at it too long."
          },
          {
            "id": "C",
            "content": "I wish it were made of paper."
          },
          {
            "id": "D",
            "content": "You have to run out of money to buy it."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Hồi đáp lịch thiệp và tự hào của thợ dệt khi nhận được lời khen ngợi từ khách du lịch.",
        "translation": "Du khách: 'Tôi thực sự bị cuốn hút bởi những hoa văn tinh xảo trên chiếc khăn lụa này!' - Thợ dệt: 'Cảm ơn quý khách! Những người thợ dệt của chúng tôi phải dành nhiều ngày để hoàn thiện thủ công từng sợi chỉ.'",
        "unitTopic": "Social Communication: Compliments"
      },
      {
        "id": 21,
        "part": "PHẦN IV: ĐỌC HIỂU ĐIỀN TỪ (CLOZE TEST)",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi chỗ trống.",
        "readingText": "Experiential learning through educational field trips has become a cornerstone of contemporary secondary education in Vietnam. Rather than remaining confined to traditional classroom lectures, students now have opportunities to visit historical relics and craft villages across the nation. These hands-on excursions (21)______ students' cultural awareness and provide authentic practical knowledge. In traditional handicraft communities, teenagers witness master artisans (22)______ down intricate embroidery and sculpting techniques. Students also participate directly in creative workshops, learning (23)______ to produce simple souvenirs using raw clay and bamboo. Educators believe that taking part in such collaborative activities helps adolescents develop teamwork, patience, and mutual respect. Moreover, interacting directly with community helpers teaches youngsters to value the honest labour of ordinary workers. When students return from these (24)______ journeys, they frequently demonstrate improved enthusiasm for learning and look forward (25)______ contributing positively to society.",
        "content": "Chọn từ thích hợp cho chỗ trống (21):",
        "options": [
          {
            "id": "A",
            "content": "broaden"
          },
          {
            "id": "B",
            "content": "deteriorate"
          },
          {
            "id": "C",
            "content": "modernize"
          },
          {
            "id": "D",
            "content": "give up"
          }
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
          {
            "id": "A",
            "content": "passing"
          },
          {
            "id": "B",
            "content": "cutting"
          },
          {
            "id": "C",
            "content": "running"
          },
          {
            "id": "D",
            "content": "giving"
          }
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
          {
            "id": "A",
            "content": "how"
          },
          {
            "id": "B",
            "content": "why"
          },
          {
            "id": "C",
            "content": "which"
          },
          {
            "id": "D",
            "content": "where to producing"
          }
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
          {
            "id": "A",
            "content": "memorable"
          },
          {
            "id": "B",
            "content": "illiterate"
          },
          {
            "id": "C",
            "content": "barefoot"
          },
          {
            "id": "D",
            "content": "stressful"
          }
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
          {
            "id": "A",
            "content": "to"
          },
          {
            "id": "B",
            "content": "for"
          },
          {
            "id": "C",
            "content": "with"
          },
          {
            "id": "D",
            "content": "at"
          }
        ],
        "correctAnswer": "A",
        "explanation": "'Look forward to + V-ing' (trông mong, hướng tới việc cống hiến tích cực cho xã hội).",
        "translation": "look forward to contributing (hướng tới việc đóng góp tích cực cho xã hội).",
        "unitTopic": "Cloze Test: Unit 1"
      },
      {
        "id": 26,
        "part": "PHẦN V: ĐỌC HIỂU VĂN BẢN",
        "instruction": "Đọc đoạn văn sau và chọn phương án đúng nhất A, B, C hoặc D cho mỗi câu hỏi.",
        "readingText": "Throughout Vietnam's long history, traditional craft villages have played an indispensable role in shaping national identity and supporting rural livelihoods. From the renowned ceramic kilns of Bat Trang and Van Phuc silk weaving workshops to Dong Ho folk painting communities, these heritage hubs have preserved ancient manufacturing techniques passed down through countless generations.<br><br>In the past, craft knowledge was closely guarded within extended families. Young apprentices learned by observing master artisans for years, developing tactile sensitivity and artistic mastery without formal textbooks. Each finished handicraft reflected not merely functional utility, but also spiritual beliefs, seasonal folklore, and cultural harmony. During festival seasons, whole villages buzzed with communal activity, celebrating patron saints who originally introduced the crafts.<br><br>In contemporary times, however, handicraft villages face severe headwinds from mass industrial production and rapid consumer culture. Inexpensive plastic and factory-manufactured goods often undercut handmade products in price. Furthermore, younger generations often migrate to bustling urban metropolises seeking higher-paying tech careers, leading to an acute shortage of skilled successor artisans.<br><br>To counter these vulnerabilities, forward-thinking craft communities are innovating boldly. Many have embraced eco-tourism and cultural experiential programs, welcoming hundreds of foreign and domestic visitors daily. Others collaborate with contemporary designers and utilize social media platforms to market high-end artisanal products globally. By bridging ancient wisdom with modern entrepreneurship, Vietnam's traditional villages are ensuring that their cultural soul thrives in the modern era.",
        "content": "What is the primary subject discussed in the passage?",
        "options": [
          {
            "id": "A",
            "content": "The heritage, current challenges, and revitalization of Vietnamese traditional craft villages"
          },
          {
            "id": "B",
            "content": "The step-by-step process of painting folk pictures in Dong Ho"
          },
          {
            "id": "C",
            "content": "Why young Vietnamese people prefer living in high-rise apartments"
          },
          {
            "id": "D",
            "content": "The economic impact of plastic manufacturing in big cities"
          }
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
          {
            "id": "A",
            "content": "By observing master artisans patiently over years without formal textbooks"
          },
          {
            "id": "B",
            "content": "By studying online video tutorials on the internet"
          },
          {
            "id": "C",
            "content": "By attending foreign vocational universities abroad"
          },
          {
            "id": "D",
            "content": "By reading ancient technical textbooks in libraries"
          }
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
          {
            "id": "A",
            "content": "offer goods at a lower price than competitors"
          },
          {
            "id": "B",
            "content": "destroy historical monuments completely"
          },
          {
            "id": "C",
            "content": "improve product quality significantly"
          },
          {
            "id": "D",
            "content": "refuse to sell goods to tourists"
          }
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
          {
            "id": "A",
            "content": "Youths frequently migrate to cities to seek higher-paying modern careers."
          },
          {
            "id": "B",
            "content": "Master artisans refuse to teach anyone outside their nuclear family."
          },
          {
            "id": "C",
            "content": "Craft materials have completely run out across the nation."
          },
          {
            "id": "D",
            "content": "The government has banned traditional handicraft workshops."
          }
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
          {
            "id": "A",
            "content": "By combining eco-tourism, modern design, and social media marketing"
          },
          {
            "id": "B",
            "content": "By closing all workshops to foreign tourists"
          },
          {
            "id": "C",
            "content": "By replacing all handmade ceramics with plastic products"
          },
          {
            "id": "D",
            "content": "By moving all workshops into high-rise city apartments"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Đoạn cuối nêu rõ: 'Many have embraced eco-tourism and cultural experiential programs... Others collaborate with contemporary designers and utilize social media platforms...'",
        "translation": "Bằng cách kết hợp du lịch sinh thái, thiết kế hiện đại và tiếp thị trên mạng xã hội.",
        "unitTopic": "Reading Comprehension: Solution Unit 1"
      },
      {
        "id": 31,
        "part": "PHẦN VI: TÌM LỖI SAI",
        "instruction": "Chọn chữ cái A, B, C hoặc D tương ứng với phần bị gạch chân cần sửa lại.",
        "content": "The village elder <u>explained</u> (A) to the tourists <u>how to mould</u> (B) the clay, but he <u>refused</u> (C) to show <u>why to preserve</u> (D) the ancient furnace.",
        "options": [
          {
            "id": "A",
            "content": "explained"
          },
          {
            "id": "B",
            "content": "how to mould"
          },
          {
            "id": "C",
            "content": "refused"
          },
          {
            "id": "D",
            "content": "why to preserve"
          }
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
          {
            "id": "A",
            "content": "modernly"
          },
          {
            "id": "B",
            "content": "better"
          },
          {
            "id": "C",
            "content": "quality of life"
          },
          {
            "id": "D",
            "content": "enjoy"
          }
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
          {
            "id": "A",
            "content": "will exercise"
          },
          {
            "id": "B",
            "content": "regularly"
          },
          {
            "id": "C",
            "content": "can cope"
          },
          {
            "id": "D",
            "content": "exam stress"
          }
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
          {
            "id": "A",
            "content": "is"
          },
          {
            "id": "B",
            "content": "closer to"
          },
          {
            "id": "C",
            "content": "could play"
          },
          {
            "id": "D",
            "content": "after class"
          }
        ],
        "correctAnswer": "A",
        "explanation": "Trong câu ước ở hiện tại, động từ 'to be' phải lùi thì về giả định 'were' (hoặc 'was').",
        "translation": "Sửa 'is' thành 'were'.",
        "unitTopic": "Unit 4: Wish trap"
      },
      {
        "id": 35,
        "part": "PHẦN VII: VIẾT LẠI CÂU TƯƠNG ĐƯƠNG",
        "instruction": "Chọn câu viết lại có nghĩa tương đương với câu ban đầu.",
        "content": "\"Could you tell me how I can register for the pottery course?\" Mark asked.",
        "options": [
          {
            "id": "A",
            "content": "Mark asked how to register for the pottery course."
          },
          {
            "id": "B",
            "content": "Mark asked how registering for the pottery course."
          },
          {
            "id": "C",
            "content": "Mark asked why to register for the pottery course."
          },
          {
            "id": "D",
            "content": "Mark asked how can he register for the pottery course."
          }
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
          {
            "id": "A",
            "content": "The more mock tests students practice, the higher entrance exam scores they will achieve."
          },
          {
            "id": "B",
            "content": "The more mock tests students practice, the more high entrance exam scores they will achieve."
          },
          {
            "id": "C",
            "content": "The most mock tests students practice, the highest entrance exam scores they will achieve."
          },
          {
            "id": "D",
            "content": "The more students practice mock tests, the higher exam scores will they achieve."
          }
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
          {
            "id": "A",
            "content": "Unless you eat nutritious meals, you will not stay fit during the exam preparation."
          },
          {
            "id": "B",
            "content": "Unless you don't eat nutritious meals, you will stay fit during the exam preparation."
          },
          {
            "id": "C",
            "content": "If you eat nutritious meals, you will not stay fit during the exam preparation."
          },
          {
            "id": "D",
            "content": "Unless you eat nutritious meals, you will stay fit during the exam preparation."
          }
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
          {
            "id": "A",
            "content": "My brother used to play traditional folk games with village children."
          },
          {
            "id": "B",
            "content": "My brother is used to playing traditional folk games with village children."
          },
          {
            "id": "C",
            "content": "My brother was used to play traditional folk games with village children."
          },
          {
            "id": "D",
            "content": "My brother used to playing traditional folk games with village children."
          }
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
          {
            "id": "A",
            "content": "We have not visited our grandparents' ancestral village for four years."
          },
          {
            "id": "B",
            "content": "We have visited our grandparents' ancestral village since four years."
          },
          {
            "id": "C",
            "content": "We didn't visit our grandparents' ancestral village for four years ago."
          },
          {
            "id": "D",
            "content": "It was four years since we have visited our grandparents' ancestral village."
          }
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
          {
            "id": "A",
            "content": "The youth volunteer team spent a whole week cleaning up the polluted village river."
          },
          {
            "id": "B",
            "content": "The youth volunteer team spent a whole week to clean up the polluted village river."
          },
          {
            "id": "C",
            "content": "The youth volunteer team took a whole week cleaning up the polluted village river."
          },
          {
            "id": "D",
            "content": "It spent the youth volunteer team a whole week cleaning up the polluted village river."
          }
        ],
        "correctAnswer": "A",
        "explanation": "It took + O + time + to V ➔ S + spent + time + V-ing.",
        "translation": "Đội thanh niên tình nguyện đã dành cả một tuần để dọn sạch dòng sông làng bị ô nhiễm.",
        "unitTopic": "Unit 6: Spend time V-ing transformation"
      }
    ]
  }
];
