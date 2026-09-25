const fs = require('fs');
const path = require('path');

const THEORIES_DIR = path.join(__dirname, '..', 'data', 'theories');
const SECTIONS_DIR = path.join(THEORIES_DIR, 'sections');

if (!fs.existsSync(SECTIONS_DIR)) {
  fs.mkdirSync(SECTIONS_DIR, { recursive: true });
}

const sectionTheories = {
  sign_notices: {
    topicName: "Biển báo & Thông báo (Sign / Notice)",
    englishName: "Signs and Notices Reading",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Dạng bài <strong>Biển báo & Thông báo (Signs & Notices)</strong> kiểm tra khả năng đọc hiểu nhanh các biển báo công cộng, thông báo ngắn trong trường học, bảo tàng, bệnh viện, cửa hàng hoặc các nhãn mác hàng ngày.</p>
        
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">1. Chiến thuật 4 bước làm bài tối ưu:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Bước 1 - Xác định ngữ cảnh & nơi xuất hiện:</strong> Biển báo xuất hiện ở đâu? (Bảo tàng, trường học, thư viện, nhà ga, bể bơi...).</li>
          <li><strong>Bước 2 - Phân tích từ khóa trọng tâm (Keywords):</strong> Chú ý các động từ chỉ lệnh, cấm đoán hoặc cho phép (<em>must, must not, allow, permit, prohibit, require, open from...</em>).</li>
          <li><strong>Bước 3 - Đối chiếu kỹ các phương án:</strong> Tìm phương án diễn đạt lại (Paraphrase) chính xác ý nghĩa thông báo mà không suy diễn quá mức.</li>
          <li><strong>Bước 4 - Loại trừ bẫy thông tin:</strong> Cảnh giác với các từ mang tính tuyệt đối (<em>always, never, only, all</em>) hoặc sai lệch mốc thời gian/độ tuổi.</li>
        </ul>

        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">2. Các cụm từ & cấu trúc bắt buộc ghi nhớ:</h4>
        <div class="overflow-x-auto my-2">
          <table class="w-full text-left border-collapse text-xs sm:text-sm border border-slate-200">
            <thead>
              <tr class="bg-emerald-50 text-emerald-900 font-bold border-b border-slate-200">
                <th class="p-2 border-r border-slate-200">Từ / Cụm từ trên biển báo</th>
                <th class="p-2 border-r border-slate-200">Ý nghĩa diễn đạt lại (Paraphrase)</th>
                <th class="p-2">Ví dụ thực tế</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td class="p-2 font-mono font-semibold text-emerald-700 border-r border-slate-200">Children must be with an adult</td>
                <td class="p-2 border-r border-slate-200">Children can visit if accompanied by parents/adults</td>
                <td class="p-2">Trẻ em được vào nếu có người lớn đi kèm</td>
              </tr>
              <tr>
                <td class="p-2 font-mono font-semibold text-emerald-700 border-r border-slate-200">Open from 12:00</td>
                <td class="p-2 border-r border-slate-200">Opens in the afternoon / Not open in the morning</td>
                <td class="p-2">Mở cửa từ trưa trở đi (buổi sáng đóng cửa)</td>
              </tr>
              <tr>
                <td class="p-2 font-mono font-semibold text-emerald-700 border-r border-slate-200">No entry / Staff only</td>
                <td class="p-2 border-r border-slate-200">Visitors/Public are not permitted to enter</td>
                <td class="p-2">Chỉ nhân viên mới được phép vào</td>
              </tr>
              <tr>
                <td class="p-2 font-mono font-semibold text-emerald-700 border-r border-slate-200">Out of order</td>
                <td class="p-2 border-r border-slate-200">Not working / Broken / Under maintenance</td>
                <td class="p-2">Thiết bị hỏng, đang bảo trì</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    rules: [
      { sound: "Sign", rule: "Xác định người nhận thông tin và hành vi được phép hoặc bị cấm", formula: "Must / Must not + V-bare = Required / Prohibited", examples: "Children must be accompanied by adults" },
      { sound: "Notice", rule: "Chú ý hiện tượng Paraphrase (diễn đạt khác cùng nghĩa)", formula: "Open from 12 = Closed in the morning", examples: "Out of order = Not functioning" }
    ]
  },

  pronunciation: {
    topicName: "Ngữ âm - Phát âm (Pronunciation)",
    englishName: "Pronunciation Rules",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Phần thi phát âm vào 10 thường tập trung vào 3 nhóm câu hỏi then chốt: <strong>Đuôi "-ed"</strong>, <strong>Đuôi "-s/-es"</strong>, và <strong>Nguyên âm/Phụ âm</strong>.</p>
        
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">1. Quy tắc phát âm đuôi "-ed":</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>/ɪd/:</strong> Khi âm tận cùng là <strong>/t/, /d/</strong> (Mẹo: <em>tiền đô</em>).<br><span class="text-xs text-slate-500 italic">VD: wanted, decided, needed, waited.</span></li>
          <li><strong>/t/:</strong> Khi âm tận cùng là các âm vô thanh: <strong>/p/, /k/, /f/, /s/, /ʃ/, /tʃ/</strong> (Mẹo: <em>Chính Phủ Phát Sách Không Cho</em>).<br><span class="text-xs text-slate-500 italic">VD: stopped, looked, laughed, washed, watched.</span></li>
          <li><strong>/d/:</strong> Các trường hợp còn lại (nguyên âm và phụ âm hữu thanh).<br><span class="text-xs text-slate-500 italic">VD: played, cleaned, loved, opened.</span></li>
        </ul>

        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">2. Quy tắc phát âm đuôi "-s / -es":</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>/s/:</strong> Tận cùng là âm vô thanh: <strong>/p/, /k/, /f/, /t/, /θ/</strong> (Mẹo: <em>Thời Phong Kiến Phương Tây</em>).<br><span class="text-xs text-slate-500 italic">VD: stops, books, laughs, cats, months.</span></li>
          <li><strong>/ɪz/:</strong> Tận cùng là âm xuýt: <strong>/s/, /z/, /ʃ/, /tʃ/, /ʒ/, /dʒ/</strong> (Mẹo: <em>Sóng Gió Chẳng Sợ Gió Dông</em>: s, x, z, ch, sh, ce, ge).<br><span class="text-xs text-slate-500 italic">VD: misses, watches, washes, changes, boxes.</span></li>
          <li><strong>/z/:</strong> Các âm hữu thanh và nguyên âm còn lại.<br><span class="text-xs text-slate-500 italic">VD: plays, pens, rooms, dogs.</span></li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "/ɪd/", rule: "Đuôi -ed phát âm là /ɪd/ khi tận cùng là /t/ hoặc /d/", examples: "wanted, needed, decided" },
      { sound: "/t/", rule: "Đuôi -ed phát âm là /t/ khi tận cùng là /p, k, f, s, ʃ, tʃ/", examples: "looked, watched, stopped, washed" },
      { sound: "/s/", rule: "Đuôi -s/-es phát âm là /s/ với /p, k, f, t, θ/", examples: "books, cats, maps, months" },
      { sound: "/ɪz/", rule: "Đuôi -s/-es phát âm là /ɪz/ với âm gió /s, z, ʃ, tʃ, dʒ/", examples: "watches, boxes, classes, pages" }
    ]
  },

  stress: {
    topicName: "Trọng âm từ (Word Stress)",
    englishName: "Stress Rules",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Quy tắc đánh trọng âm từ 2 và 3 âm tiết thi vào lớp 10 Hà Nội:</p>
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">1. Từ 2 âm tiết:</h4>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li><strong>Danh từ & Tính từ:</strong> Thường nhấn trọng âm ở <strong>âm tiết 1</strong>.<br><span class="text-xs text-slate-500 italic">VD: 'student, 'table, 'happy, 'clever, 'famous.</span></li>
          <li><strong>Động từ:</strong> Thường nhấn trọng âm ở <strong>âm tiết 2</strong>.<br><span class="text-xs text-slate-500 italic">VD: re'lax, de'cide, re'ceive, for'get, a'gree.</span></li>
          <li><em>Ngoại lệ:</em> ma'chine (N-2), 'visit (V-1), 'listen (V-1), 'happen (V-1).</li>
        </ul>

        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">2. Hậu tố nhận trọng âm hoặc dịch chuyển trọng âm:</h4>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>Trọng âm rơi vào <strong>âm tiết ngay trước</strong> các đuôi: <em>-tion, -sion, -ic, -ical, -ity, -logy</em>.<br><span class="text-xs text-slate-500 italic">VD: pol'lution, de'cision, scien'tific, his'torical, a'bility.</span></li>
          <li>Trọng âm rơi vào <strong>chính đuôi</strong>: <em>-ee, -eer, -ese, -ique</em>.<br><span class="text-xs text-slate-500 italic">VD: emplo'yee, volun'teer, Vietna'mese, u'nique.</span></li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "2 âm tiết", rule: "Danh từ & Tính từ 2 âm tiết trọng âm 1; Động từ 2 âm tiết trọng âm 2", examples: "'teacher, 'happy vs en'joy, a'gree" },
      { sound: "Hậu tố", rule: "Trọng âm rơi vào âm tiết đứng trước -tion, -sion, -ic, -ity", examples: "infor'mation, e'lectric, possi'bility" }
    ]
  },

  guided_cloze: {
    topicName: "Điền từ vào đoạn văn (Guided Cloze)",
    englishName: "Guided Cloze Test",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Dạng bài điền từ vào bài đọc (Cloze Test) kiểm tra tổng hợp từ loại, liên từ, từ nối, đại từ quan hệ và giới từ.</p>
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">Chiến lược giải:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Xác định từ loại cần điền:</strong> Nhìn trước và sau chỗ trống (Danh từ, Tính từ, Trạng từ, Động từ V-ing hay to-V).</li>
          <li><strong>Đại từ quan hệ:</strong> Who (người làm S/O), Whom (người làm O), Which (vật), Whose (sở hữu + N), Where (nơi chốn), When (thời gian).</li>
          <li><strong>Liên từ chỉ quan hệ:</strong> Although/Even though (+ mệnh đề), In spite of/Despite (+ Ving/N), Because/Since (+ mệnh đề), Because of (+ Ving/N), However, Therefore.</li>
          <li><strong>Cụm từ cố định (Collocations):</strong> pay attention to, take part in, look forward to + Ving.</li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "Ngữ pháp", rule: "Phân tích trước và sau ô trống để nhận diện cấu trúc ngữ pháp bắt buộc", examples: "look forward to + Ving, prefer A to B" },
      { sound: "Liên từ", rule: "Phân biệt mệnh đề (S + V) và cụm danh từ (Noun/V-ing)", examples: "Although S + V vs In spite of + Noun/V-ing" }
    ]
  },

  reading_comprehension: {
    topicName: "Đọc hiểu văn bản (Reading Comprehension)",
    englishName: "Reading Comprehension",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Dạng bài đọc hiểu 5-7 câu hỏi về một chủ đề quen thuộc (Môi trường, Giáo dục, Công nghệ, Đô thị hóa, Văn hóa).</p>
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">Các dạng câu hỏi thường gặp:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Ý chính / Tiêu đề (Main idea / Title):</strong> Đọc câu đầu tiên và câu cuối cùng của từng đoạn văn, tổng hợp ý bao quát nhất (tránh ý quá hẹp hoặc quá rộng).</li>
          <li><strong>Thông tin chi tiết (Factual questions):</strong> Gạch chân từ khóa câu hỏi, dò vị trí xuất hiện trong bài đọc (Scanning).</li>
          <li><strong>Đại từ thay thế (Reference):</strong> "It", "They", "These" thay cho từ nào? Đọc lại câu văn ngay trước đại từ đó.</li>
          <li><strong>Từ đồng nghĩa trong ngữ cảnh (Vocabulary in context):</strong> Đoán nghĩa dựa vào mệnh đề xung quanh hoặc sắc thái tích cực / tiêu cực.</li>
          <li><strong>Câu hỏi NOT / EXCEPT:</strong> Tìm 3 phương án có xuất hiện trong bài để loại trừ.</li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "Skimming", rule: "Đọc lướt tiêu đề, câu chủ đề đoạn 1 và đoạn cuối để nắm ý chính", examples: "What is the main topic of the passage?" },
      { sound: "Scanning", rule: "Dò tìm từ khóa (tên riêng, số liệu, thuật ngữ) để trả lời chi tiết", examples: "According to paragraph 2, ..." }
    ]
  },

  error_identification: {
    topicName: "Tìm lỗi sai (Error Identification)",
    englishName: "Error Identification",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Bài tập tìm phần gạch chân có lỗi sai ngữ pháp hoặc dùng từ (A, B, C, D).</p>
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">Các điểm ngữ pháp thường bị cài bẫy lỗi sai:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Hòa hợp Chủ ngữ - Động từ (Subject-Verb Agreement):</strong> Chủ ngữ số ít đi với động từ số ít; chủ ngữ có <em>as well as, along with, together with</em> chia theo chủ ngữ đầu tiên.</li>
          <li><strong>Cấu trúc song song (Parallel Structure):</strong> Các từ nối bởi <em>and, but, or</em> phải cùng dạng ngữ pháp (V-ing and V-ing, adj and adj).</li>
          <li><strong>Dùng sai từ loại hoặc từ dễ gây nhầm lẫn:</strong> <em>affect (V) vs effect (N)</em>, <em>economic vs economical</em>, <em>hard vs hardly</em>.</li>
          <li><strong>Câu điều kiện, câu ước, câu bị động:</strong> Sai dạng chia động từ theo thì.</li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "S-V Agreement", rule: "Xác định rõ chủ ngữ chính để chia động từ số ít hay số nhiều", examples: "The number of students IS increasing (NOT are)" },
      { sound: "Parallel", rule: "Cấu trúc đồng đẳng qua 'and/or' phải cùng từ loại và thì", examples: "She likes singing, dancing and reading (NOT to read)" }
    ]
  },

  sentence_transformation: {
    topicName: "Viết lại câu đồng nghĩa (Sentence Transformation)",
    englishName: "Sentence Transformation",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Chọn câu có nghĩa gần nhất với câu gốc, đòi hỏi nắm vững các cặp biến đổi ngữ pháp kinh điển:</p>
        <div class="overflow-x-auto my-2">
          <table class="w-full text-left border-collapse text-xs sm:text-sm border border-slate-200">
            <thead>
              <tr class="bg-emerald-50 text-emerald-900 font-bold border-b border-slate-200">
                <th class="p-2 border-r border-slate-200">Cấu trúc câu gốc</th>
                <th class="p-2">Cấu trúc chuyển đổi tương đương</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td class="p-2 font-mono border-r border-slate-200">S + last + V-ed + ... ago</td>
                <td class="p-2 font-mono text-emerald-700">S + have/has not + V3/ed + for...</td>
              </tr>
              <tr>
                <td class="p-2 font-mono border-r border-slate-200">So + adj + that / Such + N + that</td>
                <td class="p-2 font-mono text-emerald-700">Too + adj (for sb) to V / Adj + enough to V</td>
              </tr>
              <tr>
                <td class="p-2 font-mono border-r border-slate-200">If ... not (Câu điều kiện)</td>
                <td class="p-2 font-mono text-emerald-700">Unless + Mệnh đề khẳng định</td>
              </tr>
              <tr>
                <td class="p-2 font-mono border-r border-slate-200">Because + S + V</td>
                <td class="p-2 font-mono text-emerald-700">Because of / Due to + Noun / V-ing</td>
              </tr>
              <tr>
                <td class="p-2 font-mono border-r border-slate-200">"Why don't we / Let's..."</td>
                <td class="p-2 font-mono text-emerald-700">S + suggested + V-ing / that S + (should) V</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    rules: [
      { sound: "Hiện tại hoàn thành", rule: "Chuyển từ quá khứ đơn (last did... ago) sang HTHT phủ định (haven't done... for)", examples: "I last saw him 2 years ago = I haven't seen him for 2 years" },
      { sound: "Unless", rule: "Unless mang nghĩa phủ định (If not), mệnh đề sau Unless không chia phủ định", examples: "Unless you study hard, you will fail = If you don't study hard..." }
    ]
  },

  sentence_combination: {
    topicName: "Kết hợp câu (Sentence Combination)",
    englishName: "Sentence Combination",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Kết hợp hai câu đơn thành một câu phức hoặc câu ghép hợp lý về ngữ nghĩa và ngữ pháp:</p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Mệnh đề quan hệ (Relative Clauses):</strong> Thay thế danh từ lặp lại bằng đại từ quan hệ (who, which, whose). Chú ý dấu phẩy trong mệnh đề quan hệ không xác định.</li>
          <li><strong>Câu điều kiện loại 2 & loại 3:</strong> Giả định trái với hiện tại (Loại 2: If + V2/ed, S + would V) hoặc trái với quá khứ (Loại 3: If + had V3, S + would have V3).</li>
          <li><strong>Đảo ngữ điều kiện / So sánh kép:</strong> The more... the more...</li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "Mệnh đề quan hệ", rule: "Nối 2 câu có chung thành phần chỉ người/vật bằng đại từ quan hệ", examples: "The boy is my brother. You met him yesterday. -> The boy whom you met..." },
      { sound: "Điều kiện trái thực tế", rule: "Tình huống ở hiện tại dùng If loại 2; tình huống ở quá khứ dùng If loại 3", examples: "I don't have money, so I can't buy it -> If I had money, I could buy it." }
    ]
  },

  communicative_functions: {
    topicName: "Chức năng giao tiếp (Communicative Functions)",
    englishName: "Communicative Responses",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Các tình huống giao tiếp đời sống hàng ngày: Lời cảm ơn, xin lỗi, khen ngợi, mời mọc, xin phép, đồng ý/không đồng ý.</p>
        <div class="overflow-x-auto my-2">
          <table class="w-full text-left border-collapse text-xs sm:text-sm border border-slate-200">
            <thead>
              <tr class="bg-emerald-50 text-emerald-900 font-bold border-b border-slate-200">
                <th class="p-2 border-r border-slate-200">Tình huống giao tiếp</th>
                <th class="p-2">Cách đáp lại lịch sự & chuẩn xác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td class="p-2 font-semibold text-emerald-800 border-r border-slate-200">Khen ngợi ("You look great today!", "Well done!")</td>
                <td class="p-2">"Thank you! / It's very kind of you to say so." (Cảm ơn, không khiêm tốn phủ nhận như tiếng Việt)</td>
              </tr>
              <tr>
                <td class="p-2 font-semibold text-emerald-800 border-r border-slate-200">Lời mời ("Would you like to...?")</td>
                <td class="p-2">"Yes, I'd love to." / "I'd love to, but I'm busy."</td>
              </tr>
              <tr>
                <td class="p-2 font-semibold text-emerald-800 border-r border-slate-200">Lời cảm ơn ("Thank you so much!")</td>
                <td class="p-2">"You're welcome! / Not at all. / Don't mention it. / My pleasure."</td>
              </tr>
              <tr>
                <td class="p-2 font-semibold text-emerald-800 border-r border-slate-200">Đồng ý ý kiến ("I think that...")</td>
                <td class="p-2">"I totally agree with you. / Exactly! / You can say that again."</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    rules: [
      { sound: "Khen ngợi", rule: "Khi nhận lời khen ngợi hoặc chúc mừng, luôn đáp lại bằng lời cảm ơn lịch sự", examples: "It's nice of you to say so / Thank you" },
      { sound: "Đồng thuận", rule: "Diễn đạt đồng tình: 'I couldn't agree with you more' mang nghĩa 'Hoàn toàn đồng ý'", examples: "You can say that again / I totally agree" }
    ]
  },

  grammar_vocab_cloze: {
    topicName: "Ngữ pháp & Từ vựng tổng hợp (Grammar & Vocabulary)",
    englishName: "Grammar and Vocabulary Synthesis",
    detail: `
      <div class="theory-section space-y-4">
        <p class="font-medium text-slate-800">Dạng bài trắc nghiệm kiến thức ngữ pháp và vốn từ vựng trọng điểm tuyển sinh vào lớp 10 Hà Nội.</p>
        <h4 class="text-base font-bold text-emerald-800 border-b border-emerald-100 pb-1 mt-3">Trọng tâm kiến thức:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
          <li><strong>Các thì của động từ:</strong> Hiện tại đơn, HT tiếp diễn, HT hoàn thành (since/for), Quá khứ đơn, QK tiếp diễn (when/while), Tương lai đơn (will) & Tương lai gần (be going to).</li>
          <li><strong>Mạo từ (A / An / The / Zero article):</strong> Mạo từ bất định với danh từ đếm được số ít chưa xác định; The với vật duy nhất hoặc đã đề cập trước đó.</li>
          <li><strong>Cụm động từ (Phrasal Verbs):</strong> turn on/off, give up, look after, look for, run out of, carry out.</li>
          <li><strong>Tính từ tận cùng -ed / -ing:</strong> -ing chỉ tính chất của sự vật/hiện tượng; -ed chỉ cảm xúc, tâm trạng của con người.</li>
        </ul>
      </div>
    `,
    rules: [
      { sound: "Thì động từ", rule: "Nhận biết qua các trạng từ chỉ thời gian: since/for (HTHT), yesterday (QK đơn)", examples: "She has lived here since 2015" },
      { sound: "-ed vs -ing", rule: "Tính từ đuôi -ed chỉ cảm xúc (bored, interested); -ing chỉ bản chất (boring, interesting)", examples: "The movie is interesting, so I am interested in it." }
    ]
  }
};

for (const [secId, theory] of Object.entries(sectionTheories)) {
  const filePath = path.join(SECTIONS_DIR, `${secId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(theory, null, 2));
  // also write to top level data/theories/ for direct lookup
  fs.writeFileSync(path.join(THEORIES_DIR, `${secId}.json`), JSON.stringify(theory, null, 2));
}

console.log('Successfully generated authentic theories for all 10 sections!');
