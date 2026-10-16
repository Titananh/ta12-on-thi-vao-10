import os
import json
import re
import urllib.parse
import subprocess

# Script directory and base paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
DATA_FILE = os.path.join(BASE_DIR, "data", "knowledge_base.json")
SLIDES_DIR = os.path.join(BASE_DIR, "slides")
HTML_FILE = os.path.join(BASE_DIR, "01_cam_nang_tinh_hoa_on_thi_vao_10.html")
PDF_FILE = os.path.join(BASE_DIR, "01_CAM_NANG_TINH_HOA_ON_THI_VAO_10_GLOBAL_SUCCESS_9.pdf")

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    kb = json.load(f)

# Vocabulary curated for 12 units with real-world exam context examples & translations
UNIT_VOCAB = {
    "Unit 1: Local Community": [
        ("artisan", "/ˈɑːtɪzæn/", "n", "thợ thủ công làm đồ truyền thống",
         "The skilled artisan carved an exquisite wooden statue for the village temple.",
         "Người nghệ nhân lành nghề đã chạm khắc một bức tượng gỗ tinh xảo cho ngôi đền của làng."),
        ("handicraft", "/ˈhændikrɑːft/", "n", "sản phẩm thủ công",
         "Tourists enjoy buying local handicrafts such as embroidered scarves and bamboo baskets.",
         "Du khách rất thích mua các sản phẩm thủ công địa phương như khăn thêu và giỏ tre."),
        ("community helper", "/kəˈmjuːnəti ˈhelpə/", "n", "người phục vụ cộng đồng (công an, bác sĩ, lao công...)",
         "Police officers and firefighters are dedicated community helpers keeping our neighborhood safe.",
         "Cảnh sát và lính cứu hỏa là những người phục vụ cộng đồng tận tụy giữ an toàn cho khu phố."),
        ("pottery", "/ˈpɒtəri/", "n", "đồ gốm, nghề làm gốm",
         "Bat Trang is globally famous for its fine handmade pottery and ceramic products.",
         "Bát Tràng nổi tiếng toàn cầu về các sản phẩm đồ gốm và đồ sứ thủ công tinh xảo."),
        ("preserve", "/prɪˈzɜːv/", "v", "bảo tồn, gìn giữ",
         "The local government took strict measures to preserve ancient historical monuments.",
         "Chính quyền địa phương đã thực hiện các biện pháp nghiêm ngặt để bảo tồn các di tích lịch sử cổ kính."),
        ("pass down", "/pɑːs daʊn/", "phr v", "truyền lại (qua các thế hệ)",
         "These traditional weaving techniques have been passed down through generations.",
         "Những kỹ thuật dệt truyền thống này đã được truyền lại qua nhiều thế hệ."),
        ("look forward to", "/lʊk ˈfɔːwəd tuː/", "phr v", "trông mong, chờ đợi (+ V-ing)",
         "We are really looking forward to visiting the annual village festival this weekend.",
         "Chúng tôi rất trông chờ được tham quan lễ hội làng thường niên vào cuối tuần này."),
        ("hand down", "/hænd daʊn/", "phr v", "lưu truyền lại di sản",
         "This antique bronze tea set was handed down to my mother from my great-grandmother.",
         "Bộ ấm chén bằng đồng cổ này được cụ ngoại lưu truyền lại cho mẹ tôi.")
    ],
    "Unit 2: City Life": [
        ("congestion", "/kənˈdʒestʃən/", "n", "sự tắc nghẽn giao thông",
         "The newly built overpass helped alleviate severe traffic congestion during rush hours.",
         "Cây cầu vượt mới xây đã giúp giảm bớt tình trạng tắc nghẽn giao thông nghiêm trọng vào giờ cao điểm."),
        ("metro", "/ˈmetrəʊ/", "n", "tàu điện ngầm",
         "Commuting by underground metro is much faster and cheaper than taking private taxis.",
         "Đi lại bằng tàu điện ngầm nhanh và rẻ hơn nhiều so với đi taxi riêng."),
        ("bustling", "/ˈbʌslɪŋ/", "adj", "nhộn nhịp, hối hả",
         "Ben Thanh Market is always bustling with lively shoppers and vibrant food stalls.",
         "Chợ Bến Thành luôn nhộn nhịp người mua sắm sôi nổi và các quầy ẩm thực rực rỡ."),
        ("cosmopolitan", "/ˌkɒzməˈpɒlɪtən/", "adj", "quốc tế, đa văn hóa",
         "Ho Chi Minh City is a cosmopolitan metropolis attracting talents from all over the world.",
         "TP. Hồ Chí Minh là một đại đô thị quốc tế thu hút nhân tài từ khắp nơi trên thế giới."),
        ("affordable", "/əˈfɔːdəbl/", "adj", "giá cả phải chăng, vừa túi tiền",
         "Finding affordable accommodation in the city center is a major challenge for college students.",
         "Tìm chỗ ở giá cả phải chăng ở trung tâm thành phố là một thách thức lớn với sinh viên."),
        ("liveable", "/ˈlɪvəbl/", "adj", "đáng sống",
         "With green parks and clean beaches, Da Nang is voted the most liveable city in Vietnam.",
         "Với công viên xanh và bãi biển sạch, Đà Nẵng được bình chọn là thành phố đáng sống nhất Việt Nam."),
        ("run out of", "/rʌn aʊt əv/", "phr v", "cạn kiệt, hết sạch (tiền, xăng, thời gian)",
         "We almost ran out of petrol before finding a gas station on the highway.",
         "Chúng tôi suýt hết sạch xăng trước khi tìm thấy một trạm xăng trên đường cao tốc."),
        ("cut down on", "/kʌt daʊn ɒn/", "phr v", "cắt giảm (chi tiêu, lượng rác...)",
         "Urban residents should cut down on plastic consumption to protect the environment.",
         "Cư dân đô thị nên cắt giảm việc tiêu thụ đồ nhựa để bảo vệ môi trường.")
    ],
    "Unit 3: Healthy Living for Teens": [
        ("well-balanced", "/ˌwel ˈbælənst/", "adj", "cân bằng, hài hòa",
         "A well-balanced diet containing vegetables, proteins, and fruits boosts teen immunity.",
         "Chế độ ăn uống cân bằng gồm rau, đạm và hoa quả giúp tăng cường hệ miễn dịch cho thanh thiếu niên."),
        ("nutritious", "/njuːˈtrɪʃəs/", "adj", "bổ dưỡng, giàu dinh dưỡng",
         "Breakfast is the most essential meal, so make sure to choose nutritious food.",
         "Bữa sáng là bữa ăn quan trọng nhất, vì vậy hãy đảm bảo chọn thực phẩm bổ dưỡng."),
        ("counselor", "/ˈkaʊnsələ/", "n", "chuyên viên tư vấn tâm lý",
         "Whenever you feel overwhelmed with stress, consult your school psychological counselor.",
         "Bất cứ khi nào bạn cảm thấy quá tải vì căng thẳng, hãy tham khảo ý kiến chuyên viên tư vấn tâm lý học đường."),
        ("physical health", "/ˈfɪzɪkl helθ/", "n", "sức khỏe thể chất",
         "Engaging in regular sports like swimming and football improves physical health remarkably.",
         "Tham gia các môn thể thao đều đặn như bơi lội và bóng đá giúp cải thiện sức khỏe thể chất rõ rệt."),
        ("mental well-being", "/ˈmentl ˈwelbiːɪŋ/", "n", "sức khỏe tinh thần",
         "Practicing mindfulness and meditation every evening supports sound mental well-being.",
         "Thực hành chánh niệm và thiền mỗi tối hỗ trợ sức khỏe tinh thần lành mạnh."),
        ("stay up late", "/steɪ ʌp leɪt/", "phr", "thức khuya",
         "Students should avoid staying up late before exam days because sleep loss impairs memory.",
         "Học sinh nên tránh thức khuya trước ngày thi vì thiếu ngủ làm suy giảm trí nhớ."),
        ("cope with", "/kəʊp wɪð/", "phr v", "đối phó, vượt qua (áp lực, căng thẳng)",
         "Teens need to learn effective coping strategies to cope with peer pressure and exam stress.",
         "Thanh thiếu niên cần học các chiến lược ứng phó hiệu quả để đối phó với áp lực bạn bè và thi cử."),
        ("give up", "/ɡɪv ʌp/", "phr v", "từ bỏ (thói quen xấu)",
         "He decided to give up sugary soft drinks and junk food to maintain a healthy weight.",
         "Cậu ấy đã quyết định từ bỏ nước ngọt có đường và đồ ăn vặt để duy trì cân nặng khỏe mạnh.")
    ],
    "Unit 4: Remembering the Past": [
        ("barefoot", "/ˈbeəfʊt/", "adj, adv", "chân đất, đi chân không",
         "Decades ago, poor rural children often walked barefoot along muddy paths to school.",
         "Nhiều thập kỷ trước, trẻ em nghèo nông thôn thường đi chân đất dọc theo những con đường bùn đến trường."),
        ("illiterate", "/ɪˈlɪtərət/", "adj", "mù chữ, không biết đọc viết",
         "Adult literacy classes were launched to help illiterate villagers read and write.",
         "Các lớp xóa mù chữ cho người lớn đã được mở để giúp dân làng mù chữ biết đọc và viết."),
        ("tug of war", "/ˌtʌɡ əv ˈwɔː/", "n", "trò chơi kéo co",
         "Tug of war is an exciting traditional folk game played during spring harvest festivals.",
         "Kéo co là trò chơi dân gian truyền thống sôi nổi được chơi trong các lễ hội mùa xuân."),
        ("seniority", "/ˌsiːniˈɒrəti/", "n", "sự cao niên, thâm niên",
         "In traditional Vietnamese culture, people always respect seniority and listen to elders.",
         "Trong văn hóa truyền thống Việt Nam, mọi người luôn tôn trọng sự cao niên và lắng nghe người lớn tuổi."),
        ("generation gap", "/ˌdʒenəˈreɪʃn ɡæp/", "n", "khoảng cách thế hệ",
         "Open family discussions help bridge the generation gap between parents and teenagers.",
         "Những cuộc trò chuyện cởi mở trong gia đình giúp thu hẹp khoảng cách thế hệ giữa cha mẹ và con cái."),
        ("act out", "/ækt aʊt/", "phr v", "đóng kịch, diễn lại một câu chuyện",
         "The secondary school students loved acting out traditional fairy tales in English class.",
         "Học sinh cấp hai rất thích đóng kịch diễn lại các câu chuyện cổ tích truyền thống trong giờ tiếng Anh."),
        ("look back on", "/lʊk bæk ɒn/", "phr v", "nhìn lại (quá khứ, kỷ niệm)",
         "My grandfather smiled warmly as he looked back on his youth during the wartime.",
         "Ông tôi mỉm cười ấm áp khi nhìn lại thời tuổi trẻ của mình trong thời kỳ chiến tranh."),
        ("bring back", "/brɪŋ bæk/", "phr v", "gợi nhớ lại (ký ức xưa)",
         "Hearing that old folk song brought back fond memories of my peaceful childhood.",
         "Nghe bài dân ca xưa đó đã gợi nhớ lại những kỷ niệm đẹp đẽ về thời thơ ấu êm đềm của tôi.")
    ],
    "Unit 5: Our Experiences": [
        ("field trip", "/ˈfiːld trɪp/", "n", "chuyến đi thực tế",
         "Our class went on an unforgettable field trip to the National Museum of History.",
         "Lớp chúng tôi đã có một chuyến đi thực tế khó quên tới Bảo tàng Lịch sử Quốc gia."),
        ("fascinating", "/ˈfæsɪneɪtɪŋ/", "adj", "vô cùng hấp dẫn, lôi cuốn",
         "The documentary about deep ocean creatures was absolutely fascinating to watch.",
         "Bộ phim tài liệu về sinh vật dưới đáy đại dương sâu thẳm xem vô cùng hấp dẫn và lôi cuốn."),
        ("memorable", "/ˈmemərəbl/", "adj", "đáng nhớ, không thể nào quên",
         "Winning the first prize in the English speaking contest was a memorable milestone.",
         "Đoạt giải nhất cuộc thi hùng biện tiếng Anh là một cột mốc đáng nhớ."),
        ("broaden", "/ˈbrɔːdn/", "v", "mở rộng (kiến thức, tầm mắt)",
         "Traveling to different cultural regions helps broaden teenagers' minds and perspectives.",
         "Du lịch đến các vùng văn hóa khác nhau giúp mở rộng tâm trí và góc nhìn của thanh thiếu niên."),
        ("hands-on", "/ˌhændz ˈɒn/", "adj", "thực hành thực tế",
         "The science workshop provided hands-on experience in building mini solar robots.",
         "Xưởng thực hành khoa học đã mang lại trải nghiệm thực tế trong việc chế tạo rô-bốt năng lượng mặt trời mini."),
        ("take part in", "/teɪk pɑːt ɪn/", "phr v", "tham gia vào (= participate in)",
         "Over two hundred secondary students eagerly took part in the youth marathon.",
         "Hơn hai trăm học sinh cấp hai đã hào hứng tham gia vào giải chạy ma-ra-tông thanh niên."),
        ("pick up", "/pɪk ʌp/", "phr v", "học lỏm được (ngôn ngữ, kỹ năng mới)",
         "She picked up some practical French phrases while traveling in Paris for two weeks.",
         "Cô ấy đã học lỏm được vài cụm từ tiếng Pháp thông dụng khi đi du lịch Paris trong hai tuần."),
        ("get on with", "/ɡet ɒn wɪð/", "phr v", "hòa hợp với bạn bè, người khác",
         "Mai is very friendly, so she always gets on well with all her new classmates.",
         "Mai rất thân thiện nên bạn ấy luôn hòa hợp tốt với tất cả bạn cùng lớp mới.")
    ],
    "Unit 6: Vietnamese Lifestyle: Then and Now": [
        ("extended family", "/ɪkˈstendɪd ˈfæməli/", "n", "gia đình đa thế hệ",
         "Living in an extended family with three generations fosters strong mutual care and love.",
         "Sống trong gia đình đa thế hệ với ba thế hệ giúp nuôi dưỡng sự quan tâm và yêu thương gắn bó."),
        ("nuclear family", "/ˈnjuːkliə ˈfæməli/", "n", "gia đình hạt nhân (chỉ có bố mẹ và con)",
         "Modern urban couples often choose to live in a nuclear family for privacy and flexibility.",
         "Các cặp vợ chồng thành thị hiện đại thường chọn sống trong gia đình hạt nhân để có sự riêng tư."),
        ("lifestyle", "/ˈlaɪfstaɪl/", "n", "phong cách sống",
         "Adopting an active and eco-friendly lifestyle has become popular among young Vietnamese.",
         "Áp dụng lối sống năng động và thân thiện với môi trường đã trở nên phổ biến trong giới trẻ Việt Nam."),
        ("modernize", "/ˈmɒdənaɪz/", "v", "hiện đại hóa",
         "The local council invested heavily to modernize the public library with digital facilities.",
         "Hội đồng địa phương đã đầu tư mạnh mẽ để hiện đại hóa thư viện công cộng bằng tiện nghi số."),
        ("convenience", "/kənˈviːniəns/", "n", "sự tiện nghi, tiện lợi",
         "Online shopping and express delivery offer tremendous convenience for busy families.",
         "Mua sắm trực tuyến và giao hàng nhanh mang lại sự tiện lợi to lớn cho các gia đình bận rộn."),
        ("keep up with", "/kiːp ʌp wɪð/", "phr v", "bắt kịp với (xu hướng, thời đại)",
         "Older generations sometimes struggle to keep up with rapidly changing smartphone technologies.",
         "Các thế hệ lớn tuổi đôi khi gặp khó khăn để bắt kịp với công nghệ điện thoại thông minh đổi mới liên tục."),
        ("adapt to", "/əˈdæpt tuː/", "phr v", "thích nghi với (cuộc sống mới)",
         "It took my cousins a few months to adapt to the new school curriculum in Canada.",
         "Anh em họ tôi đã mất vài tháng để thích nghi với chương trình học mới ở Canada."),
        ("rely on", "/rɪˈlaɪ ɒn/", "phr v", "dựa dẫm, phụ thuộc vào",
         "Rather than relying entirely on private motorbikes, more commuters now rely on electric buses.",
         "Thay vì phụ thuộc hoàn toàn vào xe máy cá nhân, ngày càng nhiều người đi làm dựa vào xe buýt điện.")
    ],
    "Unit 7: Natural Wonders of the World": [
        ("magnificent", "/mæɡˈnɪfɪsnt/", "adj", "tráng lệ, lộng lẫy",
         "The magnificent stalactites inside Phong Nha Cave sparkle magically under illumination.",
         "Những khối thạch nhũ tráng lệ bên trong động Phong Nha lấp lánh kỳ ảo dưới ánh đèn rọi."),
        ("breathtaking", "/ˈbreθteɪkɪŋ/", "adj", "đẹp ngỡ ngàng, ngoạn mục",
         "From the mountain summit, the panoramic view of the limestone islands was breathtaking.",
         "Từ đỉnh núi, tầm nhìn toàn cảnh các đảo đá vôi đẹp ngoạn mục khiến ai cũng ngỡ ngàng."),
        ("stalagmite", "/ˈstæləɡmaɪt/", "n", "măng đá (mọc từ dưới sàn hang lên)",
         "Unlike stalactites hanging from the roof, a stalagmite grows upward from the cave floor.",
         "Khác với nhũ đá rủ từ trên trần, măng đá mọc hướng lên từ sàn hang động."),
        ("stalactite", "/ˈstæləktaɪt/", "n", "nhũ đá (rủ từ trần hang xuống)",
         "Mineral-rich water droplets take centuries to form a single hanging stalactite.",
         "Những giọt nước giàu khoáng chất mất hàng thế kỷ để tạo nên một khối nhũ đá treo duy nhất."),
        ("biodiversity", "/ˌbaɪəʊdaɪˈvɜːsəti/", "n", "đa dạng sinh học",
         "Cuc Phuong National Park boasts incredible biodiversity with thousands of rare wildlife species.",
         "Vườn quốc gia Cúc Phương tự hào có sự đa dạng sinh học đáng kinh ngạc với hàng ngàn loài quý hiếm."),
        ("scenic", "/ˈsiːnɪk/", "adj", "thuộc cảnh quan đẹp",
         "The scenic coastal route connecting Da Nang and Hue offers spectacular sea landscapes.",
         "Tuyến đường ven biển ngắm cảnh nối Đà Nẵng và Huế đem lại những cảnh quan biển ngoạn mục."),
        ("set off", "/set ɒf/", "phr v", "khởi hành chuyến đi",
         "The adventurous trekking team set off at dawn to climb Mount Fansipan.",
         "Đội đi bộ mạo hiểm đã khởi hành lúc bình minh để chinh phục đỉnh núi Fansipan."),
        ("take in", "/teɪk ɪn/", "phr v", "thưởng ngoạn, ngắm cảnh",
         "Visitors can spend hours taking in the peaceful and pristine scenery of Ba Be Lake.",
         "Du khách có thể dành hàng giờ thưởng ngoạn cảnh quan yên bình và nguyên sơ của hồ Ba Bể.")
    ],
    "Unit 8: Tourism": [
        ("destination", "/ˌdestɪˈneɪʃn/", "n", "điểm đến du lịch",
         "Phu Quoc Island is ranked as one of the premier beach holiday destinations in Southeast Asia.",
         "Đảo Phú Quốc được xếp hạng là một trong những điểm đến nghỉ dưỡng biển hàng đầu Đông Nam Á."),
        ("package holiday", "/ˈpækɪdʒ ˈhɒlədeɪ/", "n", "chuyến du lịch trọn gói",
         "Booking a package holiday saved our family both money and hotel planning effort.",
         "Đặt tour du lịch trọn gói đã giúp gia đình tôi tiết kiệm cả chi phí lẫn công sức tìm phòng."),
        ("eco-tourism", "/ˈiːkəʊˌtʊərɪzəm/", "n", "du lịch sinh thái",
         "Responsible eco-tourism protects delicate wildlife habitats while providing local income.",
         "Du lịch sinh thái có trách nhiệm bảo vệ môi trường sống hoang dã đồng thời đem lại thu nhập cho dân địa phương."),
        ("hospitality", "/ˌhɒspɪˈtæləti/", "n", "lòng hiếu khách",
         "Foreign travelers were deeply touched by the warm hospitality of the Vietnamese hosts.",
         "Khách du lịch quốc tế đã vô cùng xúc động trước lòng hiếu khách nồng hậu của các gia chủ Việt Nam."),
        ("itinerary", "/aɪˈtɪnərəri/", "n", "lịch trình chuyến đi",
         "Our detailed tour itinerary includes guided visits to ancient temples and floating markets.",
         "Lịch trình tour chi tiết của chúng tôi bao gồm các chuyến tham quan đền cổ và chợ nổi."),
        ("check in", "/tʃek ɪn/", "phr v", "làm thủ tục nhận phòng/sân bay",
         "Passengers must check in at least two hours before domestic flight departure.",
         "Hành khách phải làm thủ tục check-in ít nhất hai giờ trước giờ khởi hành chuyến bay nội địa."),
        ("check out", "/tʃek aʊt/", "phr v", "làm thủ tục trả phòng",
         "Remember to return your electronic key card when you check out of the resort.",
         "Hãy nhớ trả lại thẻ khóa điện tử khi bạn làm thủ tục trả phòng khu nghỉ dưỡng."),
        ("see off", "/siː ɒf/", "phr v", "tiễn ai đó lên đường",
         "A crowd of close friends gathered at Noi Bai Airport to see Minh off to his study abroad.",
         "Rất nhiều bạn bè thân thiết đã tập trung tại sân bay Nội Bài để tiễn Minh lên đường đi du học.")
    ],
    "Unit 9: World Englishes": [
        ("dialect", "/ˈdaɪəlekt/", "n", "tiếng địa phương, thổ ngữ",
         "Different regions in the UK speak distinctive dialects that sound quite unique.",
         "Các vùng khác nhau ở Vương quốc Anh nói những phương ngữ đặc trưng nghe rất độc đáo."),
        ("bilingual", "/ˌbaɪˈlɪŋɡwəl/", "adj", "nói được hai thứ tiếng",
         "Growing up with Vietnamese and British parents, Lan has been completely bilingual since childhood.",
         "Lớn lên cùng bố mẹ người Việt và người Anh, Lan đã hoàn toàn song ngữ từ thuở nhỏ."),
        ("native speaker", "/ˈneɪtɪv ˈspiːkə/", "n", "người bản xứ",
         "Practicing conversation with a native speaker builds natural pronunciation and confidence.",
         "Luyện hội thoại với người bản xứ giúp xây dựng khả năng phát âm tự nhiên và sự tự tin."),
        ("fluent", "/ˈfluːənt/", "adj", "thông thạo, lưu loát",
         "After practicing debate for three years, he became fully fluent in spoken English.",
         "Sau ba năm luyện tập tranh biện, cậu ấy đã trở nên hoàn toàn lưu loát trong tiếng Anh giao tiếp."),
        ("accent", "/ˈæksent/", "n", "chất giọng, ngữ điệu",
         "She has a charming Australian accent with distinct and clear vowel pronunciation.",
         "Cô ấy có chất giọng Úc rất duyên dáng với cách phát âm nguyên âm rõ ràng và đặc trưng."),
        ("imitate", "/ˈɪmɪteɪt/", "v", "bắt chước theo",
         "English learners can improve their intonation by imitating movie actors and news anchors.",
         "Người học tiếng Anh có thể cải thiện ngữ điệu bằng cách bắt chước theo diễn viên và phát thanh viên."),
        ("brush up on", "/brʌʃ ʌp ɒn/", "phr v", "ôn lại, trau dồi lại (tiếng Anh)",
         "I need to brush up on my English irregular verbs before sitting the grade 10 entrance exam.",
         "Tôi cần trau dồi lại các động từ bất quy tắc tiếng Anh trước khi bước vào kỳ thi tuyển sinh lớp 10."),
        ("pick up", "/pɪk ʌp/", "phr v", "học hỏi tự nhiên mà không cần học vẹt",
         "Children pick up second languages faster when immersed in daily communication.",
         "Trẻ em tiếp thu ngôn ngữ thứ hai nhanh hơn khi được đắm mình trong giao tiếp hàng ngày.")
    ],
    "Unit 10: Planet Earth": [
        ("flora and fauna", "/ˈflɔːrə ənd ˈfɔːnə/", "n phr", "hệ thực vật và động vật",
         "The national reserve is home to extraordinarily diverse flora and fauna.",
         "Khu bảo tồn quốc gia là nơi sinh sống của hệ thực vật và động vật đa dạng phi thường."),
        ("endangered species", "/ɪnˈdeɪndʒəd ˈspiːʃiːz/", "n", "các loài có nguy cơ tuyệt chủng",
         "The red-shanked douc langur is an endangered species strictly protected by national law.",
         "Voọc chà vá chân nâu là loài có nguy cơ tuyệt chủng được pháp luật quốc gia bảo vệ nghiêm ngặt."),
        ("habitat", "/ˈhæbɪtæt/", "n", "môi trường sống tự nhiên",
         "Unchecked deforestation destroys the natural habitat of wild birds and mammals.",
         "Nạn phá rừng không kiểm soát phá hủy môi trường sống tự nhiên của chim chóc và thú hoang."),
        ("ecosystem", "/ˈiːkəʊsɪstəm/", "n", "hệ sinh thái",
         "Every coral reef is a fragile marine ecosystem that requires careful conservation.",
         "Mỗi rạn san hô là một hệ sinh thái biển mong manh đòi hỏi sự bảo tồn cẩn trọng."),
        ("deforestation", "/diːˌfɒrɪˈsteɪʃn/", "n", "nạn phá rừng",
         "Illegal deforestation causes severe soil erosion and triggers dangerous summer landslides.",
         "Nạn phá rừng trái phép gây ra xói mòn đất nghiêm trọng và gây ra những vụ sạt lở nguy hiểm."),
        ("die out", "/daɪ aʊt/", "phr v", "tuyệt chủng, biến mất hoàn toàn",
         "Without immediate climate action, vulnerable polar animal species will eventually die out.",
         "Nếu không có hành động khí hậu tức thì, các loài động vật dễ tổn thương ở vùng cực sẽ tuyệt chủng."),
        ("cut down", "/kʌt daʊn/", "phr v", "chặt hạ cây cối",
         "Governments must strictly prohibit logging firms from cutting down old-growth trees in rainforests.",
         "Chính phủ phải nghiêm cấm các công ty khai thác gỗ chặt hạ cây cổ thụ trong rừng nhiệt đới."),
        ("wipe out", "/waɪp aʊt/", "phr v", "xóa sổ hoàn toàn",
         "A massive ocean tsunami could wipe out entire coastal fishing villages within minutes.",
         "Một trận sóng thần đại dương khổng lồ có thể xóa sổ toàn bộ làng chài ven biển trong vài phút.")
    ],
    "Unit 11: Electronic Devices": [
        ("artificial intelligence", "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", "n", "trí tuệ nhân tạo (AI)",
         "Artificial intelligence helps language learning apps personalize quizzes for each student.",
         "Trí tuệ nhân tạo giúp các ứng dụng học ngôn ngữ cá nhân hóa bài tập cho từng học sinh."),
        ("portable", "/ˈpɔːtəbl/", "adj", "nhỏ gọn, có thể mang đi",
         "Lightweight and portable tablets enable students to revise lessons anywhere on the go.",
         "Máy tính bảng nhẹ và dễ mang theo giúp học sinh ôn tập bài học ở mọi nơi khi di chuyển."),
        ("wireless", "/ˈwaɪələs/", "adj", "không dây",
         "Modern classrooms are equipped with high-speed wireless internet and interactive smart screens.",
         "Các lớp học hiện đại được trang bị internet không dây tốc độ cao và màn hình tương tác thông minh."),
        ("voice-recognition", "/ˈvɔɪs rekəɡnɪʃn/", "n", "công nghệ nhận diện giọng nói",
         "Voice-recognition software allows users to dictate homework without typing manually.",
         "Phần mềm nhận diện giọng nói cho phép người dùng đọc chính tả bài tập mà không cần gõ phím."),
        ("breakthrough", "/ˈbreɪkθruː/", "n", "bước đột phá công nghệ",
         "The invention of high-capacity solid-state batteries represents a major scientific breakthrough.",
         "Phát minh về pin thể rắn dung lượng cao đại diện cho một bước đột phá khoa học lớn."),
        ("plug in", "/plʌɡ ɪn/", "phr v", "cắm nguồn điện",
         "Please plug in the projector cord before the multimedia presentation starts.",
         "Vui lòng cắm dây nguồn máy chiếu trước khi buổi thuyết trình đa phương tiện bắt đầu."),
        ("switch off", "/swɪtʃ ɒf/", "phr v", "tắt thiết bị điện",
         "Remember to switch off your computer and air conditioner before leaving the classroom.",
         "Hãy nhớ tắt máy tính và điều hòa trước khi rời khỏi phòng học."),
        ("look up", "/lʊk ʌp/", "phr v", "tra cứu thông tin trực tuyến",
         "Instead of carrying thick paper books, students quickly look up new collocations on mobile dictionaries.",
         "Thay vì mang sách giấy dày, học sinh nhanh chóng tra cứu cụm từ mới trên từ điển điện thoại.")
    ],
    "Unit 12: Career Choices": [
        ("career path", "/kəˈrɪə pɑːθ/", "n", "con đường phát triển sự nghiệp",
         "Choosing the right career path requires understanding your true passions and personal strengths.",
         "Chọn đúng con đường sự nghiệp đòi hỏi bạn phải hiểu đam mê thực sự và thế mạnh cá nhân."),
        ("vocational", "/vəʊˈkeɪʃənl/", "adj", "thuộc về học nghề",
         "Vocational schools offer practical hands-on training in high-demand fields like IT and mechanics.",
         "Các trường học nghề cung cấp đào tạo thực hành trong các lĩnh vực có nhu cầu cao như CNTT và cơ khí."),
        ("qualification", "/ˌkwɒlɪfɪˈkeɪʃn/", "n", "bằng cấp, chứng chỉ nghề",
         "Having recognized English qualifications like IELTS certificates opens global job opportunities.",
         "Sở hữu các chứng chỉ tiếng Anh được công nhận như IELTS mở ra nhiều cơ hội việc làm toàn cầu."),
        ("job satisfaction", "/ˈdʒɒb sætɪsfækʃn/", "n", "sự thỏa mãn với công việc",
         "High income alone does not ensure job satisfaction without a supportive working environment.",
         "Thu nhập cao đơn thuần không đảm bảo sự thỏa mãn công việc nếu thiếu môi trường làm việc hỗ trợ."),
        ("hands-on experience", "/ˌhændz ɒn ɪkˈspɪəriəns/", "n", "kinh nghiệm thực tế",
         "Practical apprenticeships provide invaluable hands-on experience that textbooks cannot teach.",
         "Các kỳ thực tập học việc mang lại kinh nghiệm thực tế quý giá mà sách vở không thể dạy hết."),
        ("apply for", "/əˈplaɪ fə/", "phr v", "nộp đơn ứng tuyển công việc",
         "Graduates should craft an impressive resume when they apply for prestigious tech internships.",
         "Sinh viên tốt nghiệp nên chuẩn bị một hồ sơ ấn tượng khi nộp đơn ứng tuyển các kỳ thực tập công nghệ."),
        ("take over", "/teɪk ˈəʊvə/", "phr v", "tiếp quản công việc, vị trí",
         "After ten years of apprenticeship, Nam successfully took over the family carpentry business.",
         "Sau mười năm học nghề, Nam đã tiếp quản thành công xưởng mộc truyền thống của gia đình."),
        ("take up", "/teɪk ʌp/", "phr v", "bắt đầu một công việc / sở thích mới",
         "During high school, she decided to take up coding as a hobby and later became an engineer.",
         "Thời cấp ba, cô ấy đã quyết định bắt đầu học lập trình như một sở thích và sau này trở thành kỹ sư.")
    ]
}

# Unit Grammar Highlights, Traps & 5 Authentic Exam Practice Questions per Unit
UNIT_GRAMMAR = {
    "Unit 1: Local Community": {
        "title": "TỪ ĐỂ HỎI TRƯỚC TO-V & CỤM ĐỘNG TỪ (PHRASAL VERBS 1)",
        "know": "Cấu trúc: <b>Wh-word + to V_bare</b> (dùng với <i>who, what, where, when, how, whether</i>; <b>TUYỆT ĐỐI KHÔNG DÙNG VỚI 'WHY'</b>).<br>Cụm động từ: <b>Verb + Particle (Preposition/Adverb)</b> mang nghĩa hoàn toàn mới.",
        "notice": "Thường đứng sau các động từ tri giác / quyết định: <i>tell, know, decide, ask, wonder, explain, learn</i>.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. 'She didn't know <u>why to do</u> it' ➔ <b>SAI HOÀN TOÀN!</b> (Phải dùng mệnh đề: <i>why she should do it</i>).<br>2. Phân biệt: <i>pass down</i> (truyền cho thế hệ sau), <i>hand down</i> (để lại di sản), <i>turn down</i> (từ chối / hạ âm lượng), <i>look forward to + V-ing</i>.",
        "slides": ["FINAL_question_words_to_V.png", "wh_to_V.png", "C_acirc_u_h_i_v_i_t_____h_i_final_final.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm nhận biết (Wh- + to V)",
                "q": "Could you please tell me ______ to contact when an emergency occurs in the neighborhood?",
                "options": ["A. who", "B. what", "C. why", "D. which"],
                "ans": "A. who",
                "explain": "Cấu trúc 'tell me who to contact' (nói cho tôi biết phải liên hệ với ai). 'Who + to V' chỉ người làm đối tượng hành động.",
                "trap": "Tránh chọn 'why' vì 'why' KHÔNG BAO GIỜ kết hợp với 'to V'."
            },
            {
                "num": 2,
                "type": "Cụm động từ trong ngữ cảnh làng nghề",
                "q": "The traditional pottery craft in Bat Trang has been ______ from generation to generation for centuries.",
                "options": ["A. passed down", "B. turned down", "C. looked up", "D. taken care"],
                "ans": "A. passed down",
                "explain": "Pass down (truyền lại từ đời này sang đời khác). Turn down = từ chối; Look up = tra cứu; Take care = chăm sóc (đi với of).",
                "trap": "Đề hay bẫy giữa 'pass down' (truyền nghề/kiến thức) và 'turn down' (từ chối lời mời)."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "The young apprentice didn't know <u>how to shape</u> (A) the clay, but the artisan refused <u>to explain</u> (B) <u>why to do</u> (C) it <u>carefully</u> (D).",
                "options": ["A. how to shape", "B. to explain", "C. why to do", "D. carefully"],
                "ans": "C. why to do ➔ Sửa thành: 'why he should do / why to do it (SAI) ➔ why he had to do'",
                "explain": "Quy tắc ngữ pháp vàng: 'Why' không được đi với 'to V'. Phải dùng mệnh đề đầy đủ: 'why he should do it'.",
                "trap": "Học sinh thường quen miệng thấy Wh- + to V nên không để ý 'why' là trường hợp cấm kỵ duy nhất!"
            },
            {
                "num": 4,
                "type": "Viết lại câu tương đương (Sentence Transformation)",
                "q": "Can you show me where I can buy authentic handicraft souvenirs in this village? (Dùng: WHERE TO)<br>➔ <i>Can you show me ____________________________________________?</i>",
                "options": [],
                "ans": "Can you show me where to buy authentic handicraft souvenirs in this village?",
                "explain": "Rút gọn mệnh đề danh từ 'where I can buy' thành 'where to buy' khi chủ ngữ hai vế đồng nhất hoặc chỉ hành động chung.",
                "trap": "Sau 'where to' động từ phải ở dạng nguyên mẫu không chia ('buy', không thêm s hay ed)."
            },
            {
                "num": 5,
                "type": "Tình huống giao tiếp & Giới từ",
                "q": "Visitor: 'I'm really looking forward ______ the local artisans at work!' - Guide: 'Follow me, please!'",
                "options": ["A. to seeing", "B. to see", "C. seeing", "D. see"],
                "ans": "A. to seeing",
                "explain": "Cấu trúc cố định: 'look forward to + V-ing / Noun' (rất mong đợi điều gì). Trong đó 'to' là giới từ, bắt buộc đi với V-ing.",
                "trap": "Cực kỳ nhiều học sinh nhầm 'to' là to-infinitive nên vội vàng khoanh B (to see) ➔ Mất điểm oan!"
            }
        ]
    },
    "Unit 2: City Life": {
        "title": "SO SÁNH KÉP (DOUBLE COMPARATIVES) & CỤM ĐỘNG TỪ (2)",
        "know": "Công thức chuẩn: <b>The + Comparative + S1 + V1, the + Comparative + S2 + V2</b><br>• Tính từ/trạng từ ngắn: <i>The + adj/adv-er...</i><br>• Tính từ/trạng từ dài: <i>The more / The less + adj/adv...</i><br>• Danh từ: <i>The more / The fewer + Noun...</i>",
        "notice": "Dấu hiệu hai vế song song bắt đầu bằng <b>'The'</b> và có dấu phẩy ngăn cách. Ý nghĩa: Càng... thì càng...",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Quên mạo từ 'The' ở một trong hai vế.<br>2. Nhầm lẫn tính từ ngắn bất quy tắc: <i>good ➔ the better, bad ➔ the worse, far ➔ the farther/further, little ➔ the less</i>.<br>3. Đảo ngữ sai trật tự: Sau 'The + comparative' là <b>S + V bình thường</b>, KHÔNG đảo trợ động từ lên trước!",
        "slides": ["So_s_aacute_nh_k_eacute_p_final.png", "So_s_aacute_nh_k_eacute_p.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm so sánh kép kết hợp danh từ không đếm được",
                "q": "The ______ the metro system becomes, the ______ traffic congestion we will experience.",
                "options": ["A. more modern / less", "B. more modern / fewer", "C. more modernly / lesser", "D. modern / little"],
                "ans": "A. more modern / less",
                "explain": "Modern là tính từ dài ➔ the more modern. Traffic congestion là danh từ không đếm được ➔ ít hơn phải dùng 'the less' (fewer chỉ dùng cho danh từ đếm được số nhiều).",
                "trap": "Bẫy danh từ không đếm được: congestion, pollution, noise ➔ dùng 'less', KHÔNG dùng 'fewer'!"
            },
            {
                "num": 2,
                "type": "Cụm động từ đời sống đô thị",
                "q": "With consumer prices soaring, city dwellers must ______ on luxury spending and save money.",
                "options": ["A. cut down", "B. run out", "C. carry out", "D. look after"],
                "ans": "A. cut down (cut down on = cắt giảm)",
                "explain": "Cut down on = giảm bớt (chi tiêu, lượng tiêu thụ). Run out of = cạn kiệt; Carry out = tiến hành; Look after = chăm sóc.",
                "trap": "Cần chú ý giới từ đi kèm: cut down ON, run out OF."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "<u>The most crowded</u> (A) the urban district gets, <u>the more difficult</u> (B) it becomes <u>to find</u> (C) <u>affordable</u> (D) housing.",
                "options": ["A. The most crowded", "B. the more difficult", "C. to find", "D. affordable"],
                "ans": "A. The most crowded ➔ Sửa thành: 'The more crowded'",
                "explain": "Cấu trúc so sánh kép bắt buộc dùng cấp so sánh hơn (comparative: the more + adj), tuyệt đối không dùng so sánh nhất (the most).",
                "trap": "Đề thi hay cố tình viết 'The most...' để lừa học sinh không chú ý công thức."
            },
            {
                "num": 4,
                "type": "Viết lại câu dùng So sánh kép (Double Comparative)",
                "q": "As life in the big city becomes faster, people feel more stressed. (Dùng: THE FASTER)<br>➔ <i>The faster ____________________________________________.</i>",
                "options": [],
                "ans": "The faster life in the big city becomes, the more stressed people feel.",
                "explain": "Chuyển vế 1: As life becomes faster ➔ The faster life in the big city becomes. Vế 2: people feel more stressed ➔ the more stressed people feel.",
                "trap": "Giữ đúng trật tự: The + adj-er / more adj + S + V, không đảo trợ động từ."
            },
            {
                "num": 5,
                "type": "Từ loại (Word Form) chủ đề thành phố",
                "q": "With its efficient public transport and lush green parks, Da Nang is voted one of the most ______ cities in Asia.",
                "options": ["A. liveable", "B. livelihood", "C. liveliness", "D. living"],
                "ans": "A. liveable (adj: đáng sống)",
                "explain": "Sau 'the most' cần một tính từ dài mô tả đặc điểm thành phố ➔ liveable (đáng sống). Livelihood (kế sinh nhai - n), liveliness (sự sống động - n).",
                "trap": "Phân biệt kỹ đuôi tính từ -able (liveable: có thể sống tốt, đáng sống)."
            }
        ]
    },
    "Unit 3: Healthy Living for Teens": {
        "title": "ĐỘNG TỪ KHUYẾT THIẾU TRONG CÂU ĐIỀU KIỆN LOẠI 1",
        "know": "Công thức mở rộng: <b>If + S + V(hiện tại đơn), S + can / must / should / may / might + V_bare</b><br>Ý nghĩa sử dụng: Lời khuyên (<i>should</i>), Bắt buộc (<i>must</i>), Khả năng (<i>can, may</i>).",
        "notice": "Mệnh đề If luôn chia thì hiện tại đơn (chú ý chủ ngữ số ít thêm s/es). Mệnh đề chính dùng Modal Verb + V nguyên mẫu không 'to'.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Tuyệt đối KHÔNG dùng 'will' hay Modal Verb trong mệnh đề <b>If</b>!<br>2. Nhầm lẫn giữa 'Unless' và 'If... not': <b>Unless = If... not</b> (Sau Unless động từ luôn ở dạng khẳng định).<br>3. 'Must' (bắt buộc) vs 'Mustn't' (cấm tuyệt đối) vs 'Don't have to' (không cần thiết).",
        "slides": ["C_acirc_u__i_u_ki_n_lo_i_1.png", "Must__mustn"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Điều kiện loại 1 với Động từ khuyết thiếu",
                "q": "If teens ______ excessive stress before the entrance exam, they ______ talk to school counselors.",
                "options": ["A. experience / should", "B. will experience / should", "C. experienced / can", "D. experience / must to"],
                "ans": "A. experience / should",
                "explain": "Mệnh đề If chia hiện tại đơn (teens số nhiều ➔ experience). Vế chính đưa ra lời khuyên phù hợp dùng 'should + V_bare'.",
                "trap": "Vế If không bao giờ dùng 'will experience'. Đáp án D sai vì thừa 'to' sau modal verb 'must'."
            },
            {
                "num": 2,
                "type": "Cụm động từ về thói quen sinh hoạt",
                "q": "It takes immense willpower for adolescents to ______ unhealthy habits such as staying up late playing video games.",
                "options": ["A. give up", "B. put on", "C. look into", "D. take over"],
                "ans": "A. give up",
                "explain": "Give up = từ bỏ (thói quen xấu). Put on = mặc vào/tăng cân; Look into = điều tra; Take over = tiếp quản.",
                "trap": "Học sinh hay nhầm giữa 'give up' (từ bỏ) và 'give in' (nhượng bộ, đầu hàng)."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "If students <u>will maintain</u> (A) a <u>nutritious</u> (B) diet and exercise daily, they <u>can improve</u> (C) their physical <u>health</u> (D).",
                "options": ["A. will maintain", "B. nutritious", "C. can improve", "D. health"],
                "ans": "A. will maintain ➔ Sửa thành: 'maintain'",
                "explain": "Quy tắc bất di bất dịch: Trong mệnh đề If của câu điều kiện loại 1, động từ bắt buộc chia ở Hiện tại đơn, cấm dùng 'will'.",
                "trap": "Dù dịch nghĩa tiếng Việt là 'Nếu học sinh SẼ duy trì...' nhưng tiếng Anh tuyệt đối cấm 'will' trong if-clause!"
            },
            {
                "num": 4,
                "type": "Viết lại câu dùng Unless (If not)",
                "q": "You must get at least 8 hours of sleep every night, or you cannot concentrate on your revision. (Dùng: UNLESS)<br>➔ <i>Unless ____________________________________________.</i>",
                "options": [],
                "ans": "Unless you get at least 8 hours of sleep every night, you cannot concentrate on your revision.",
                "explain": "Unless = If you do not get... Khi dùng Unless, mệnh đề theo sau ở dạng khẳng định 'you get...'.",
                "trap": "Lỗi sai kinh điển: Viết 'Unless you don't get...' ➔ Phủ định 2 lần là sai hoàn toàn!"
            },
            {
                "num": 5,
                "type": "Tình huống giao tiếp tư vấn tâm lý",
                "q": "Tom: 'I've been feeling completely overwhelmed by my heavy revision schedule.' - Counselor: '______'",
                "options": [
                    "A. If you feel stressed, you should break your revision into smaller 25-minute sessions.",
                    "B. You must not study at all until next month.",
                    "C. I wish you had studied harder last semester.",
                    "D. You will be punished if you take a break."
                ],
                "ans": "A",
                "explain": "Lời khuyên hợp lý và đúng ngữ pháp câu điều kiện loại 1 với 'should': 'If you feel stressed, you should break...'.",
                "trap": "Cần đọc hiểu nghĩa tình huống xã hội để chọn câu hồi đáp nhân văn và chuẩn mực."
            }
        ]
    },
    "Unit 4: Remembering the Past": {
        "title": "THÌ QUÁ KHỨ TIẾP DIỄN & CÂU ƯỚC VỚI WISH (HIỆN TẠI)",
        "know": "1. Quá khứ tiếp diễn: <b>S + was/were + V-ing</b>. Kết hợp với Quá khứ đơn qua <i>When</i> và <i>While</i>.<br>2. Câu ước ở hiện tại: <b>S + wish(es) + S + V2/ed (were cho tất cả các ngôi)</b> hoặc <b>could + V_bare</b>.",
        "notice": "Thời điểm cụ thể trong quá khứ: <i>at 8 PM yesterday, this time last week</i>. Trục When (hành động ngắn cắt ngang) vs While (hành động dài đang xảy ra).",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Trong câu ước hiện tại, động từ 'to be' ưu tiên dùng <b>WERE</b> cho mọi chủ ngữ (kể cả I, he, she, it).<br>2. Sau wish ở hiện tại KHÔNG BAO GIỜ chia thì hiện tại đơn hay will!<br>3. Phân biệt: <i>used to + V</i> (từng làm trong quá khứ) vs <i>be/get used to + V-ing</i> (quen với việc gì).",
        "slides": ["Th_igrave__Qu_aacute__kh__ti_p_di_n.png", "I_wish__If_only_final-min.png", "FINAL_used_to.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Câu ước trái ngược với hiện tại",
                "q": "I wish my grandparents ______ in our modern city apartment with us right now instead of living alone in the countryside.",
                "options": ["A. lived", "B. live", "C. will live", "D. have lived"],
                "ans": "A. lived",
                "explain": "Dấu hiệu 'right now' chỉ hiện tại. Ước muốn trái ngược với hiện tại: S + wish + S + V2/ed ➔ chọn 'lived'.",
                "trap": "Thấy 'right now' học sinh hay vội chọn hiện tại đơn 'live' ➔ Sai vì câu ước luôn phải lùi thì!"
            },
            {
                "num": 2,
                "type": "Phối hợp thì Quá khứ tiếp diễn & Quá khứ đơn",
                "q": "While the elderly artisan ______ the folktale to the children, the electricity suddenly ______ off.",
                "options": ["A. was telling / went", "B. told / was going", "C. was telling / was going", "D. told / went"],
                "ans": "A. was telling / went",
                "explain": "Hành động dài đang diễn ra dùng Quá khứ tiếp diễn (was telling). Hành động ngắn bất ngờ chen ngang dùng Quá khứ đơn (went).",
                "trap": "Sau 'While' ưu tiên thì Quá khứ tiếp diễn; sau 'When' thường là hành động ngắn cắt ngang (Quá khứ đơn)."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "I wish my elder brother <u>is</u> (A) here <u>to help</u> (B) me solve this difficult math problem <u>right now</u> (C) before <u>the class</u> (D).",
                "options": ["A. is", "B. to help", "C. right now", "D. the class"],
                "ans": "A. is ➔ Sửa thành: 'were' (hoặc 'was')",
                "explain": "Trong câu ước ở hiện tại, động từ 'to be' phải lùi về quá khứ giả định 'were' cho tất cả các ngôi.",
                "trap": "Cực kỳ nhiều đề thi tuyển sinh vào 10 cho câu có 'wish ... is' để kiểm tra quy tắc lùi thì của học sinh."
            },
            {
                "num": 4,
                "type": "Viết lại câu với Used to",
                "q": "My father walked barefoot to school when he was a child, but he doesn't do that anymore. (Dùng: USED TO)<br>➔ <i>My father ____________________________________________.</i>",
                "options": [],
                "ans": "My father used to walk barefoot to school when he was a child.",
                "explain": "Cấu trúc: 'S + used to + V_bare' diễn tả thói quen hoặc hành động đã từng xảy ra thường xuyên trong quá khứ và nay đã chấm dứt.",
                "trap": "Sau 'used to' là động từ nguyên thể 'walk' (không thêm -ed)."
            },
            {
                "num": 5,
                "type": "Cụm động từ gợi nhớ ký ức",
                "q": "Looking ______ old black-and-white family photographs always brings back cherished childhood memories.",
                "options": ["A. back on", "B. forward to", "C. up to", "D. out of"],
                "ans": "A. back on",
                "explain": "Look back on = hồi tưởng lại, nhìn lại (quá khứ). Look forward to = trông chờ; Look up to = kính trọng; Run out of = hết sạch.",
                "trap": "Nhớ kỹ: Look back ON (nhìn lại quá khứ) khác Look forward TO (trông ngóng tương lai)."
            }
        ]
    },
    "Unit 5: Our Experiences": {
        "title": "THÌ HIỆN TẠI HOÀN THÀNH & TỪ NHẬN BIẾT ĐIỂM 10",
        "know": "Công thức: <b>S + have/has + V3/ed</b><br>• <b>Since + Mốc thời gian</b> (since 2020, since yesterday, since + S + V_past)<br>• <b>For + Khoảng thời gian</b> (for 3 years, for a long time)<br>• <i>Already, Just, Yet, Ever, Never</i>.",
        "notice": "Hành động bắt đầu trong quá khứ và còn tiếp diễn tới hiện tại, hoặc trải nghiệm: <i>It is the first time + S + have/has + V3</i>.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Phân biệt: <b>have been to</b> (đã đi và đã trở về) vs <b>have gone to</b> (đã đi và chưa về).<br>2. Biến đổi câu kinh điển: <i>S + last + V2 + ... ago ➔ S + have/has not + V3 + for...</i><br>3. Mệnh đề sau 'Since' bắt buộc chia <b>Quá khứ đơn (V2/ed)</b>!",
        "slides": ["Th_igrave__HTHT_t_ng_qu_aacute_t.png", "Th_igrave__Hi_n_t_i_Ho_agrave_n_th_agrave_nh_v_i_since__for.png", "Th_igrave__Hi_n_t_i_Ho_agrave_n_th_agrave_nh_v_i_yet__just__already.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Thì Hiện tại hoàn thành với Since/For",
                "q": "Our school's English club ______ three successful charity field trips ______ the beginning of this semester.",
                "options": ["A. has organized / since", "B. organized / for", "C. have organized / since", "D. had organized / in"],
                "ans": "A. has organized / since",
                "explain": "English club là chủ ngữ số ít ➔ has organized. 'The beginning of this semester' là một mốc thời gian xác định ➔ dùng 'since'.",
                "trap": "Tránh nhầm giữa 'since' (mốc thời gian) và 'for' (khoảng thời gian như 'for three months')."
            },
            {
                "num": 2,
                "type": "Cụm động từ học tập kỹ năng tự nhiên",
                "q": "Living with an English host family for two months helped Lan ______ a remarkably natural accent.",
                "options": ["A. pick up", "B. give up", "C. cut down", "D. look after"],
                "ans": "A. pick up",
                "explain": "Pick up = học lỏm, tiếp thu tự nhiên mà không cần qua trường lớp bài bản.",
                "trap": "Học sinh hay nghĩ 'pick up' chỉ có nghĩa là 'nhặt lên' hoặc 'đón ai bằng xe', quên mất nghĩa quan trọng 'học lỏm ngôn ngữ'."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "This is <u>the first time</u> (A) that our secondary class <u>has ever took</u> (B) part in <u>such an exciting</u> (C) community <u>project</u> (D).",
                "options": ["A. the first time", "B. has ever took", "C. such an exciting", "D. project"],
                "ans": "B. has ever took ➔ Sửa thành: 'has ever taken'",
                "explain": "Sau trợ động từ have/has trong thì Hiện tại hoàn thành, động từ phải ở dạng quá khứ phân từ V3 (take - took - taken).",
                "trap": "Học sinh hay nhầm lẫn giữa V2 (took) và V3 (taken) của các động từ bất quy tắc."
            },
            {
                "num": 4,
                "type": "Viết lại câu kinh điển (Quá khứ đơn ➔ Hiện tại hoàn thành)",
                "q": "The last time we went on an eco-tour to Cuc Phuong National Park was two years ago. (Dùng: FOR)<br>➔ <i>We have not ____________________________________________.</i>",
                "options": [],
                "ans": "We have not gone on an eco-tour to Cuc Phuong National Park for two years.",
                "explain": "Công thức chuyển đổi: S + last + V2 + ... ago ➔ S + have/has not + V3 + for + [khoảng thời gian].",
                "trap": "Không được giữ lại từ 'ago' hoặc 'last' trong câu viết lại dùng thì Hiện tại hoàn thành!"
            },
            {
                "num": 5,
                "type": "Phân biệt Have been to vs Have gone to",
                "q": "Where is Huy? - He ______ the public library to borrow science books; he will be back home in an hour.",
                "options": ["A. has gone to", "B. has been to", "C. went to", "D. was at"],
                "ans": "A. has gone to",
                "explain": "Has gone to = đã đi đến đó và hiện CHƯA VỀ (ngữ cảnh: 'he will be back in an hour'). Has been to = đã đi và đã trở về rồi.",
                "trap": "Bẫy siêu phổ biến trong đề thi vào 10: Người chưa có mặt tại đây thì bắt buộc dùng 'has gone to'!"
            }
        ]
    },
    "Unit 6: Vietnamese Lifestyle: Then and Now": {
        "title": "DẠNG ĐỘNG TỪ: V + TO-V VÀ V + V-ING",
        "know": "1. <b>V + to-V</b>: <i>decide, plan, hope, want, agree, refuse, tend, manage</i>.<br>2. <b>V + V-ing</b>: <i>enjoy, avoid, practice, suggest, mind, spend (time), consider</i>.<br>3. <b>Động từ biến đổi nghĩa</b>: <i>remember/forget/stop/try + to-V</i> (mục đích/tương lai) vs <i>+ V-ing</i> (quá khứ/thử nghiệm).",
        "notice": "Gặp <i>stop, remember, forget, regret, try</i> cần dịch kỹ ngữ cảnh để xem hành động đã làm rồi (V-ing) hay chuẩn bị làm (to-V).",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. <i>Stop to V</i> (dừng lại ĐỂ làm gì) vs <i>Stop V-ing</i> (dừng hẳn việc đang làm).<br>2. <i>Remember to V</i> (nhớ PHẢI làm nhiệm vụ) vs <i>Remember V-ing</i> (nhớ ĐÃ làm việc gì trong quá khứ).<br>3. <i>Used to + V</i> (từng) vs <i>Be used to + V-ing</i> (quen với việc gì).",
        "slides": ["__ng_t__theo_sau_b_i_V-ing.png", "NEW_V_to_V.png", "VERBS-FOLLOWED-BY-INFINITIVES-1-1.jpg"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Động từ theo sau bởi V-ing",
                "q": "To maintain a healthy weight, many young city dwellers avoid ______ high-calorie fast food.",
                "options": ["A. eating", "B. to eat", "C. eat", "D. to eating"],
                "ans": "A. eating",
                "explain": "Động từ 'avoid' (tránh) luôn đi kèm với danh động từ V-ing: avoid + V-ing.",
                "trap": "Đừng nhầm với các từ chỉ ý định như intend/tend + to V."
            },
            {
                "num": 2,
                "type": "Phân biệt Stop to V vs Stop V-ing theo ngữ cảnh",
                "q": "On his way home from work, my grandfather stopped ______ some fresh vegetables at the local market.",
                "options": ["A. to buy", "B. buying", "C. buy", "D. for buying"],
                "ans": "A. to buy",
                "explain": "Stop to V = dừng hành động đang làm lại ĐỂ thực hiện hành động khác (ông dừng xe lại để mua rau). Stop V-ing = dừng hẳn thói quen.",
                "trap": "Dịch nghĩa kỹ: Nếu dừng lại ĐỂ làm gì thì phải dùng 'to buy', không được chọn 'buying'."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Remember to V vs Remember V-ing)",
                "q": "Although he is busy, he always <u>remembers</u> (A) <u>calling</u> (B) his elderly grandparents <u>every Sunday</u> (C) to check on <u>their health</u> (D).",
                "options": ["A. remembers", "B. calling", "C. every Sunday", "D. their health"],
                "ans": "B. calling ➔ Sửa thành: 'to call'",
                "explain": "Remember to V = nhớ phải làm bổn phận/nhiệm vụ (ông luôn nhớ gọi điện vào mỗi Chủ nhật). Remember V-ing = nhớ đã làm việc gì trong quá khứ.",
                "trap": "Đây là câu bẫy kinh điển trong đề thi Chuyên và Đại trà."
            },
            {
                "num": 4,
                "type": "Viết lại câu chuyển đổi cấu trúc Spend time V-ing",
                "q": "It took Vietnamese people decades to adapt to the fast-paced modern lifestyle. (Dùng: SPENT)<br>➔ <i>Vietnamese people ____________________________________________.</i>",
                "options": [],
                "ans": "Vietnamese people spent decades adapting to the fast-paced modern lifestyle.",
                "explain": "Cấu trúc tương đương: It takes/took + O + time + to V ➔ S + spend/spent + time + V-ing.",
                "trap": "Sau spent time động từ phải chuyển thành 'adapting' (V-ing), không dùng 'to adapt'."
            },
            {
                "num": 5,
                "type": "Cụm động từ về quan hệ gia đình",
                "q": "Children raised in extended families usually find it easy to ______ people of different generations.",
                "options": ["A. get on with", "B. run out of", "C. pass down to", "D. keep up with"],
                "ans": "A. get on with",
                "explain": "Get on with / Get along with = có mối quan hệ hòa thuận, tốt đẹp với ai đó.",
                "trap": "Keep up with = bắt kịp (tiến độ/công nghệ); Get on with = hòa hợp với (con người)."
            }
        ]
    },
    "Unit 7: Natural Wonders of the World": {
        "title": "CÂU TƯỜNG THUẬT (REPORTED SPEECH) VỚI CÂU HỎI",
        "know": "1. Yes/No Question: <b>S + asked + O + IF / WHETHER + S + V(lùi thì)</b><br>2. Wh-Question: <b>S + asked + O + WH-WORD + S + V(lùi thì)</b><br>Quy tắc vàng: <b>ĐỔI NGÔI - LÙI THÌ - ĐỔI TRẠNG TỪ NƠI CHỐN/THỜI GIAN</b>.",
        "notice": "Trật tự từ trở về câu trần thuật: <b>S đứng trước V</b>, TUYỆT ĐỐI KHÔNG dùng trợ động từ <i>do/does/did</i>, không có dấu hỏi.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Quên đưa trợ động từ về sau S (Ví dụ: 'asked where did I live' ➔ SAI! Phải là 'where I lived').<br>2. Đổi trạng từ: <i>this ➔ that, here ➔ there, now ➔ then, today ➔ that day, tomorrow ➔ the next/following day, yesterday ➔ the day before</i>.",
        "slides": ["C_acirc_u_nghi_v_n_t__ng_thu_t_-_wh_ques.png", "C_acirc_u_t__ng_thu_t_thay___i_th_igrave_.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Câu tường thuật câu hỏi có từ để hỏi (Wh-question)",
                "q": "The foreign visitor asked the tour guide, 'Where can I buy tickets for the cave boat tour?'<br>➔ The foreign visitor asked the tour guide ______.",
                "options": [
                    "A. where he could buy tickets for the cave boat tour",
                    "B. where could he buy tickets for the cave boat tour",
                    "C. where he can buy tickets for the cave boat tour",
                    "D. that where he could buy tickets for the cave boat tour"
                ],
                "ans": "A",
                "explain": "Quy tắc câu gián tiếp Wh-: Wh-word + S + V lùi thì (can ➔ could). Trật tự S đứng trước V ('he could buy').",
                "trap": "Đáp án B đảo 'could' lên trước là bẫy đảo ngữ sai. Đáp án D thừa từ 'that'."
            },
            {
                "num": 2,
                "type": "Trắc nghiệm Câu tường thuật câu hỏi Yes/No",
                "q": "'Is stalactite formation still occurring inside Son Doong Cave?' asked the student.<br>➔ The student asked ______.",
                "options": [
                    "A. if stalactite formation was still occurring inside Son Doong Cave",
                    "B. if was stalactite formation still occurring inside Son Doong Cave",
                    "C. that stalactite formation was still occurring inside Son Doong Cave",
                    "D. whether stalactite formation is still occurring inside Son Doong Cave"
                ],
                "ans": "A",
                "explain": "Câu hỏi Yes/No tường thuật bằng 'if/whether' + S + V lùi thì ('is' lùi về 'was').",
                "trap": "Đáp án B đảo 'was' lên trước 'stalactite formation' là sai trật tự từ."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "The travel agent <u>asked</u> (A) the couple <u>if did they prefer</u> (B) a <u>scenic</u> (C) boat tour or a trekking <u>itinerary</u> (D).",
                "options": ["A. asked", "B. if did they prefer", "C. scenic", "D. itinerary"],
                "ans": "B. if did they prefer ➔ Sửa thành: 'if they preferred'",
                "explain": "Trong câu tường thuật gián tiếp, tuyệt đối không dùng trợ động từ did/do/does. Động từ chính lùi thì trực tiếp: prefer ➔ preferred.",
                "trap": "Bẫy trợ động từ trong câu gián tiếp xuất hiện với tần suất cực cao trong đề thi tuyển sinh."
            },
            {
                "num": 4,
                "type": "Viết lại câu trực tiếp sang gián tiếp",
                "q": "'When will our expedition set off tomorrow morning?' Mai asked.<br>➔ <i>Mai asked when ____________________________________________.</i>",
                "options": [],
                "ans": "Mai asked when their expedition would set off the following morning.",
                "explain": "Đổi ngôi: our ➔ their; lùi thì: will ➔ would; đổi trạng từ: tomorrow morning ➔ the following morning / the next morning.",
                "trap": "Học sinh rất hay quên đổi trạng từ chỉ thời gian 'tomorrow morning' dẫn đến mất nửa số điểm của câu!"
            },
            {
                "num": 5,
                "type": "Từ vựng cảnh quan thiên nhiên",
                "q": "The view of the limestone islands rising from the emerald waters was truly ______, leaving all tourists speechless.",
                "options": ["A. breathtaking", "B. breathless", "C. breathed", "D. breathing"],
                "ans": "A. breathtaking (adj: đẹp ngỡ ngàng, ngoạn mục)",
                "explain": "Breathtaking mô tả cảnh tượng đẹp đến nghẹt thở/ngoạn mục. Breathless = hụt hơi, thở hổn hển (chỉ trạng thái người sau vận động).",
                "trap": "Phân biệt kỹ giữa 'breathtaking' (cảnh đẹp) và 'breathless' (người hết hơi)."
            }
        ]
    },
    "Unit 8: Tourism": {
        "title": "ĐẠI TỪ QUAN HỆ (RELATIVE PRONOUNS)",
        "know": "• <b>WHO</b>: người làm Chủ ngữ.<br>• <b>WHOM</b>: người làm Tân ngữ (sau giới từ bắt buộc dùng Whom).<br>• <b>WHICH</b>: vật/sự việc.<br>• <b>THAT</b>: thay cho cả người và vật trong mệnh đề xác định.<br>• <b>WHOSE</b>: chỉ sở hữu (+ Noun không có mạo từ).",
        "notice": "Bắt buộc dùng <b>THAT</b> khi: danh từ đi trước gồm cả người lẫn vật; sau so sánh nhất; sau <i>all, everything, nothing, only</i>.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. <b>CẤM TUYỆT ĐỐI DÙNG 'THAT'</b> trong: (a) Mệnh đề có dấu phẩy (không xác định), (b) Ngay sau giới từ (ví dụ: 'in that' ➔ SAI, phải dùng 'in which').<br>2. Phân biệt <i>Whose + Noun</i> với <i>Who's (= Who is / Who has)</i>.",
        "slides": ["relative_pronouns_FINAL.png", "__i_t__-_Tr_ng_t__quan_h_.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Đại từ quan hệ chỉ vật làm chủ ngữ",
                "q": "Da Nang is a coastal city ______ attracts millions of international travelers with its pristine beaches.",
                "options": ["A. which", "B. whom", "C. who", "D. where"],
                "ans": "A. which",
                "explain": "Chỗ trống thay thế cho 'a coastal city' và làm chủ ngữ của động từ 'attracts' ➔ dùng 'which' (hoặc 'that').",
                "trap": "Tránh nhầm với 'where': 'where' là trạng từ chỉ nơi chốn, sau nó phải là một mệnh đề hoàn chỉnh (S + V), không thể làm chủ ngữ ngay trước 'attracts'."
            },
            {
                "num": 2,
                "type": "Đại từ quan hệ chỉ sở hữu (Whose)",
                "q": "The tour guide assisted an elderly couple ______ baggage was delayed at the airport carousel.",
                "options": ["A. whose", "B. who", "C. whom", "D. which"],
                "ans": "A. whose",
                "explain": "Whose + Noun (whose baggage = hành lý của cặp vợ chồng đó) chỉ quyền sở hữu.",
                "trap": "Cảnh giác với 'who's' trong đề thi trắc nghiệm: 'who's' là viết tắt của 'who is' hoặc 'who has', không phải từ chỉ sở hữu!"
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "Hoi An Ancient Town, <u>that</u> (A) is famous <u>for</u> (B) its preserved wooden houses, <u>welcomes</u> (C) travelers <u>all year round</u> (D).",
                "options": ["A. that", "B. for", "C. welcomes", "D. all year round"],
                "ans": "A. that ➔ Sửa thành: 'which'",
                "explain": "Quy tắc cấm kỵ số 1: 'THAT' không bao giờ được dùng trong mệnh đề quan hệ không xác định (mệnh đề có dấu phẩy). Bổ nghĩa cho địa danh phải dùng 'which'.",
                "trap": "Bẫy dùng 'that' sau dấu phẩy là cái bẫy xuất hiện nhiều nhất trong tất cả các đề thi tuyển sinh vào 10."
            },
            {
                "num": 4,
                "type": "Viết lại câu kết hợp dùng Giới từ + Đại từ quan hệ",
                "q": "The travel agent was extremely helpful. We booked our package holiday through him. (Dùng: THROUGH WHOM)<br>➔ <i>The travel agent ____________________________________________.</i>",
                "options": [],
                "ans": "The travel agent through whom we booked our package holiday was extremely helpful.",
                "explain": "Khi đưa giới từ lên trước đại từ quan hệ chỉ người, bắt buộc phải dùng 'whom', tuyệt đối không dùng 'who' hay 'that'.",
                "trap": "Cấu trúc: Noun (person) + Preposition + WHOM + S + V."
            },
            {
                "num": 5,
                "type": "Cụm động từ về thủ tục du lịch",
                "q": "Resort guests are kindly requested to ______ before 11:30 AM to avoid being charged an additional day fee.",
                "options": ["A. check out", "B. check in", "C. see off", "D. drop off"],
                "ans": "A. check out",
                "explain": "Check out = làm thủ tục trả phòng khách sạn/resort. Check in = nhận phòng; See off = tiễn ai đó; Drop off = cho ai xuống xe.",
                "trap": "Đọc kỹ giờ giấc và ngữ cảnh 'trả phòng' để tránh nhầm với 'check in'."
            }
        ]
    },
    "Unit 9: World Englishes": {
        "title": "MỆNH ĐỀ QUAN HỆ XÁC ĐỊNH & LƯỢC BỎ ĐẠI TỪ",
        "know": "<b>Defining Relative Clause</b>: Là mệnh đề bắt buộc phải có để xác định rõ danh từ đứng trước, nếu bỏ đi câu sẽ tối nghĩa.<br><b>Quy tắc lược bỏ:</b> Đại từ quan hệ (<i>who, whom, which, that</i>) ĐƯỢC PHÉP LƯỢC BỎ khi nó đóng vai trò làm <b>TÂN NGỮ</b> trong mệnh đề quan hệ.",
        "notice": "Nếu ngay sau đại từ quan hệ là một đại từ nhân xưng hoặc danh từ khác (S2 + V2) thì đó là tân ngữ ➔ Được phép lược bỏ!",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. KHÔNG được lược bỏ đại từ quan hệ khi nó làm <b>CHỦ NGỮ</b> (ngay sau là động từ).<br>2. KHÔNG được lược bỏ khi có giới từ đứng ngay trước đại từ quan hệ.<br>3. Mệnh đề xác định KHÔNG ĐƯỢC CÓ DẤU PHẨY.",
        "slides": ["M_nh____quan_h_.png", "relative_pronouns_FINAL.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Lược bỏ đại từ quan hệ làm tân ngữ",
                "q": "The English reference book ______ you lent me last week is extremely useful for my exam revision.",
                "options": [
                    "A. which",
                    "B. that",
                    "C. (Lược bỏ đại từ quan hệ - Zero relative pronoun)",
                    "D. Cả A, B, C đều đúng"
                ],
                "ans": "D. Cả A, B, C đều đúng",
                "explain": "Đại từ quan hệ thay cho 'book' làm tân ngữ của mệnh đề 'you lent me' (bạn cho tôi mượn [cuốn sách]). Do đó ta có thể dùng 'which', 'that' hoặc lược bỏ hoàn toàn.",
                "trap": "Học sinh chỉ thấy A hoặc B đúng mà quên mất trường hợp lược bỏ C cũng hoàn toàn chính xác ➔ Phải chọn D!"
            },
            {
                "num": 2,
                "type": "Giới từ đứng trước đại từ quan hệ",
                "q": "The international symposium ______ Dr. Smith delivered his presentation on World Englishes was held in Hanoi.",
                "options": ["A. at which", "B. at that", "C. which", "D. that"],
                "ans": "A. at which",
                "explain": "Symposium (hội nghị) cần giới từ 'at'. Khi giới từ đứng trước, chỉ có thể dùng 'at which' (hoặc 'where'), cấm tuyệt đối 'at that'.",
                "trap": "'That' không bao giờ đi sau bất kỳ giới từ nào."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Lặp đại từ tân ngữ thừa)",
                "q": "The foreign lecturer <u>whom</u> (A) we <u>met him</u> (B) at the bilingual symposium <u>speaks</u> (C) four languages <u>fluently</u> (D).",
                "options": ["A. whom", "B. met him", "C. speaks", "D. fluently"],
                "ans": "B. met him ➔ Sửa thành: 'met'",
                "explain": "Đại từ quan hệ 'whom' đã đóng vai trò làm tân ngữ rồi, việc viết thêm 'him' là lỗi lặp đại từ tân ngữ thừa nghiêm trọng.",
                "trap": "Lỗi thừa đại từ tân ngữ (met him, bought it, saw them) trong mệnh đề quan hệ là bẫy rất tinh vi trong đề thi."
            },
            {
                "num": 4,
                "type": "Viết lại câu lược bỏ đại từ quan hệ (Omission)",
                "q": "The girl won the top prize in the English speaking contest. You talked to her yesterday. (LƯỢC BỎ ĐẠI TỪ)<br>➔ <i>The girl ____________________________________________.</i>",
                "options": [],
                "ans": "The girl you talked to yesterday won the top prize in the English speaking contest.",
                "explain": "Lược bỏ đại từ quan hệ 'whom/who/that': Ghép trực tiếp 'you talked to yesterday' ngay sau 'The girl' làm thành phần bổ nghĩa.",
                "trap": "Nhớ giữ lại giới từ 'to' sau 'talked' và bỏ đại từ 'her'."
            },
            {
                "num": 5,
                "type": "Cụm động từ về ôn luyện ngôn ngữ",
                "q": "Before sitting the grade 10 entrance examination, candidates should ______ core phrasal verbs and idioms.",
                "options": ["A. brush up on", "B. run out of", "C. look forward to", "D. cut down on"],
                "ans": "A. brush up on",
                "explain": "Brush up on = ôn lại, trau dồi lại kiến thức/ngôn ngữ đã từng học để lấy lại độ thành thạo.",
                "trap": "Cụm từ 3 thành phần đặc trưng: brush + up + on."
            }
        ]
    },
    "Unit 10: Planet Earth": {
        "title": "MỆNH ĐỀ QUAN HỆ KHÔNG XÁC ĐỊNH (NON-DEFINING CLAUSES)",
        "know": "<b>Non-defining Relative Clause</b>: Dùng để bổ sung thêm thông tin cho danh từ đã rõ ràng (tên riêng, có this/that/these/those hoặc tính từ sở hữu).<br>Đặc điểm nhận diện: <b>LUÔN CÓ DẤU PHẨY</b> ngăn cách với mệnh đề chính.",
        "notice": "Danh từ đứng trước là danh từ riêng (Cuc Phuong, Ha Long Bay), hoặc có tính từ sở hữu (my mother), đại từ chỉ định (this forest).",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. <b>CẤM TUYỆT ĐỐI DÙNG 'THAT'</b> trong mệnh đề có dấu phẩy!<br>2. <b>CẤM TUYỆT ĐỐI LƯỢC BỎ</b> đại từ quan hệ trong mệnh đề không xác định dù làm tân ngữ!<br>3. Dùng <i>which</i> thay thế cho cả mệnh đề đứng trước (ngăn cách bởi dấu phẩy).",
        "slides": ["__i_t__-_Tr_ng_t__quan_h_.png", "relative_pronouns_FINAL.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Mệnh đề quan hệ không xác định (Non-defining)",
                "q": "The Mekong Delta, ______ produces over half of Vietnam's total rice output, is severely threatened by rising sea levels.",
                "options": ["A. which", "B. that", "C. where", "D. what"],
                "ans": "A. which",
                "explain": "Mệnh đề nằm giữa 2 dấu phẩy bổ nghĩa cho danh từ riêng 'The Mekong Delta' và làm chủ ngữ của động từ 'produces' ➔ bắt buộc dùng 'which'.",
                "trap": "Tuyệt đối không dùng 'that' trong mệnh đề có dấu phẩy. Không dùng 'where' vì 'where' không làm chủ ngữ cho 'produces'."
            },
            {
                "num": 2,
                "type": "Đại từ 'Which' thay thế cho toàn bộ mệnh đề đứng trước",
                "q": "Many factories continue dumping untreated toxic waste into rivers, ______ causes severe damage to aquatic ecosystems.",
                "options": ["A. which", "B. that", "C. who", "D. what"],
                "ans": "A. which",
                "explain": "'Which' đứng sau dấu phẩy có thể thay thế cho TOÀN BỘ hành động/mệnh đề đứng trước (việc các nhà máy xả thải trái phép).",
                "trap": "Đây là hiện tượng ngữ pháp ăn điểm tối đa trong đề thi vào 10 và các trường Chuyên."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Dùng 'that' trong mệnh đề không xác định)",
                "q": "Professor Minh, <u>that</u> (A) has spent <u>twenty years</u> (B) researching endangered flora and fauna, <u>will give</u> (C) a keynote lecture <u>tomorrow</u> (D).",
                "options": ["A. that", "B. twenty years", "C. will give", "D. tomorrow"],
                "ans": "A. that ➔ Sửa thành: 'who'",
                "explain": "'Professor Minh' là danh từ riêng chỉ người có dấu phẩy ngăn cách ➔ bắt buộc dùng 'who', cấm dùng 'that'.",
                "trap": "Quy tắc nằm lòng: Thấy dấu phẩy + danh từ riêng chỉ người ➔ chỉ dùng 'who' hoặc 'whom', gạch bỏ ngay 'that'!"
            },
            {
                "num": 4,
                "type": "Viết lại câu kết hợp hai câu đơn dùng Mệnh đề không xác định",
                "q": "Cat Tien National Park is located in southern Vietnam. It protects numerous endangered wildlife species. (Dùng: WHICH)<br>➔ <i>Cat Tien National Park, ____________________________________________.</i>",
                "options": [],
                "ans": "Cat Tien National Park, which is located in southern Vietnam, protects numerous endangered wildlife species.",
                "explain": "Đặt mệnh đề quan hệ vào giữa hai dấu phẩy ngay sau tên riêng 'Cat Tien National Park'.",
                "trap": "Phải có ĐẦY ĐỦ cả 2 dấu phẩy bao quanh mệnh đề quan hệ không xác định!"
            },
            {
                "num": 5,
                "type": "Cụm động từ về nguy cơ tuyệt chủng",
                "q": "If illegal poaching and habitat loss continue unchecked, many precious wildlife species will ______ completely.",
                "options": ["A. die out", "B. wipe out", "C. cut down", "D. give up"],
                "ans": "A. die out",
                "explain": "Die out = tuyệt chủng, biến mất vĩnh viễn (nội động từ, tự bản thân tuyệt chủng). Wipe out = xóa sổ (thường dùng dạng bị động 'be wiped out').",
                "trap": "Phân biệt dạng chủ động của 'die out' và dạng bị động 'be wiped out'."
            }
        ]
    },
    "Unit 11: Electronic Devices": {
        "title": "CẤU TRÚC GỢI Ý & KHUYÊN BẢO: SUGGEST, ADVISE, RECOMMEND",
        "know": "1. <b>S + suggest + V-ing</b> (gợi ý cùng làm gì)<br>2. <b>S + suggest + that + S + (should) + V_bare</b> (gợi ý ai đó nên làm gì - <i>giả định thức, V_bare giữ nguyên thể không chia số ít hay quá khứ</i>)<br>3. <b>Advise / Recommend + O + to V</b> hoặc <b>Advise / Recommend + V-ing</b>.",
        "notice": "Từ khóa <i>suggest, advise, recommend, insist</i> đi với mệnh đề <b>that</b> thì động từ sau chủ ngữ luôn ở dạng <b>nguyên thể không 'to'</b>.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. 'The teacher suggested that Tom <u>goes</u> home early' ➔ <b>SAI!</b> Phải là <b>go</b> (vì ẩn 'should').<br>2. Dạng bị động: <i>It is suggested that + S + (should) be + V3/ed</i>.<br>3. Biến đổi câu: <i>'Why don't we...?' / 'Let's...' ➔ S suggested + V-ing</i>.",
        "slides": ["C_acirc_u_gi____nh_v_i___ng_t_.png", "V___V-ing.png", "TAK12_Ghi_nh__-_English__8_.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Giả định thức với Suggest (Subjunctive)",
                "q": "The IT instructor suggested that each student ______ two-factor authentication on their school email account.",
                "options": ["A. enable", "B. enables", "C. enabled", "D. to enable"],
                "ans": "A. enable",
                "explain": "Cấu trúc giả định thức: 'S + suggest + that + S + (should) + V_bare'. Dù 'each student' là chủ ngữ số ít, động từ vẫn phải giữ nguyên thể không chia 'enable'.",
                "trap": "Học sinh nhìn thấy 'each student' số ít hay thì quá khứ 'suggested' rồi vội vàng chia 'enables' hoặc 'enabled' ➔ Bẫy điểm liệt!"
            },
            {
                "num": 2,
                "type": "Suggest theo sau bởi V-ing",
                "q": "Seeing dark storm clouds approaching, Peter suggested ______ inside the computer lab until the heavy rain stopped.",
                "options": ["A. staying", "B. to stay", "C. stay", "D. stayed"],
                "ans": "A. staying",
                "explain": "Cấu trúc: 'suggest + V-ing' dùng khi người nói gợi ý cùng thực hiện một hành động.",
                "trap": "Sau 'suggest' không bao giờ dùng 'to-V'!"
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Error Identification)",
                "q": "The doctor <u>suggested</u> (A) that the boy <u>avoids</u> (B) <u>using</u> (C) portable electronic devices <u>in the dark</u> (D).",
                "options": ["A. suggested", "B. avoids", "C. using", "D. in the dark"],
                "ans": "B. avoids ➔ Sửa thành: 'avoid' (hoặc 'should avoid')",
                "explain": "Sau 'suggest that + S', động từ bắt buộc phải ở dạng nguyên mẫu không chia (V_bare: avoid), không được thêm -s hay -es.",
                "trap": "Lỗi chia động từ số ít sau 'suggest that' là bẫy số 1 trong các câu tìm lỗi sai đề thi vào 10."
            },
            {
                "num": 4,
                "type": "Viết lại câu trực tiếp sang gián tiếp với Suggest",
                "q": "'Why don't we turn off all classroom computers to conserve electricity?' Nam said.<br>➔ <i>Nam suggested ____________________________________________.</i>",
                "options": [],
                "ans": "Nam suggested turning off all classroom computers to conserve electricity.",
                "explain": "Chuyển lời đề nghị 'Why don't we + V...?' thành: S + suggested + V-ing (turning off...). Có thể viết: 'Nam suggested that we/they should turn off...'.",
                "trap": "Đảm bảo bỏ hẳn cụm 'Why don't we' và đưa động từ chính về dạng V-ing."
            },
            {
                "num": 5,
                "type": "Cụm động từ về thiết bị điện tử",
                "q": "Before you leave the laboratory, please remember to ______ all the wireless devices and unplug the power strips.",
                "options": ["A. switch off", "B. plug in", "C. turn up", "D. look into"],
                "ans": "A. switch off",
                "explain": "Switch off = tắt nguồn thiết bị. Plug in = cắm điện; Turn up = vặn to âm lượng/xuất hiện; Look into = điều tra.",
                "trap": "Nhớ cặp từ trái nghĩa: switch on (bật) vs switch off (tắt); plug in (cắm) vs unplug (rút phích cắm)."
            }
        ]
    },
    "Unit 12: Career Choices": {
        "title": "MỆNH ĐỀ TRẠNG NGỮ CHỈ SỰ NHƯỢNG BỘ, NGUYÊN NHÂN, KẾT QUẢ",
        "know": "1. <b>Nhượng bộ</b>:<br>• <i>Although / Even though / Though + Clause (S + V)</i><br>• <i>Despite / In spite of + Noun phrase / V-ing</i><br>2. <b>Nguyên nhân</b>:<br>• <i>Because / Since / As + Clause (S + V)</i><br>• <i>Because of / Due to + Noun phrase / V-ing</i><br>3. <b>Kết quả & Mục đích</b>:<br>• <i>So + adj/adv + that + Clause</i> / <i>Such + (a/an) + adj + noun + that + Clause</i>.",
        "notice": "Nhìn sau liên từ: Nếu có đầy đủ Chủ ngữ + Vị ngữ chia thì ➔ Chọn nhóm Clause. Nếu chỉ có Cụm danh từ / V-ing ➔ Chọn nhóm Preposition.",
        "avoid": "<b>BẪY ĐỀ THI ĐIỂM LIỆT:</b><br>1. Tiếng Anh đã có <i>Although</i> thì <b>KHÔNG CÓ BUT</b> trong cùng một câu!<br>2. Biến đổi: <i>Although S + be + adj ➔ Despite the + adj + noun</i> hoặc <i>Despite being + adj</i>.<br>3. Phân biệt: <i>So... that</i> (Đến nỗi mà) vs <i>So that</i> (Để mà chỉ mục đích).",
        "slides": ["so..._that__such_..._that_final.png", "such_-_that_ri_ecirc_ng_-_Copy_1.png", "NEW_t__ch__nguy_ecirc_n_nh_acirc_n.png"],
        "examples": [
            {
                "num": 1,
                "type": "Trắc nghiệm Mệnh đề nhượng bộ (Despite vs Although)",
                "q": "______ having little practical work experience, the vocational student was hired immediately by a top technology firm.",
                "options": ["A. Despite", "B. Although", "C. Because of", "D. Because"],
                "ans": "A. Despite",
                "explain": "Sau chỗ trống là cụm danh động từ 'having little practical work experience' (V-ing) mang nghĩa tương phản ➔ dùng 'Despite' (hoặc 'In spite of'). 'Although' phải đi với mệnh đề có S + V.",
                "trap": "Học sinh hay vội chọn 'Although' mà không nhìn kỹ cấu trúc phía sau là V-ing chứ không có chủ ngữ riêng biệt."
            },
            {
                "num": 2,
                "type": "Mệnh đề nguyên nhân (Because vs Because of)",
                "q": "Many secondary school graduates choose vocational training programs ______ they want to secure employment quickly.",
                "options": ["A. because", "B. because of", "C. despite", "D. although"],
                "ans": "A. because",
                "explain": "Phía sau là mệnh đề đầy đủ 'they want to secure employment quickly' (S + V) giải thích lý do ➔ dùng liên từ 'because'.",
                "trap": "'Because of' chỉ đi kèm cụm danh từ hoặc V-ing, cấm đi với mệnh đề."
            },
            {
                "num": 3,
                "type": "Tìm và sửa lỗi sai (Lỗi 'Although ... but')",
                "q": "<u>Although</u> (A) she had impressive academic qualifications, <u>but</u> (B) she still found it challenging <u>to find</u> (C) her dream <u>job</u> (D).",
                "options": ["A. Although", "B. but", "C. to find", "D. job"],
                "ans": "B. but ➔ Sửa thành: Bỏ từ 'but'",
                "explain": "Nguyên tắc ngữ pháp tiếng Anh: Trong một câu phức đã có liên từ phụ thuộc 'Although' ở mệnh đề 1 thì KHÔNG ĐƯỢC dùng liên từ kết hợp 'but' ở mệnh đề 2.",
                "trap": "Thói quen dịch 'Mặc dù... nhưng...' của người Việt khiến lỗi này xuất hiện liên tục trong bài làm học sinh."
            },
            {
                "num": 4,
                "type": "Viết lại câu chuyển đổi Although ➔ In spite of",
                "q": "Although the entrance competition was extremely tough, Hoang won a place at the specialized high school. (Dùng: IN SPITE OF)<br>➔ <i>In spite of ____________________________________________.</i>",
                "options": [],
                "ans": "In spite of the extremely tough entrance competition, Hoang won a place at the specialized high school.",
                "explain": "Chuyển mệnh đề 'the entrance competition was extremely tough' thành cụm danh từ 'the extremely tough entrance competition' sau 'In spite of'. (Hoặc: In spite of the competition being extremely tough).",
                "trap": "In spite of + Noun phrase, không viết lại cả mệnh đề có động từ was."
            },
            {
                "num": 5,
                "type": "Cấu trúc kết quả So... that vs Such... that",
                "q": "The career guidance seminar was ______ informative ______ all students stayed until the very end to ask questions.",
                "options": ["A. so / that", "B. such / that", "C. too / to", "D. very / that"],
                "ans": "A. so / that",
                "explain": "'Informative' là tính từ đứng một mình ➔ dùng cấu trúc 'So + adj + that' (quá đến nỗi mà). Cấu trúc 'Such' cần cụm danh từ: 'such an informative seminar that...'.",
                "trap": "Phân biệt kỹ: So + Adj + that vs Such + (a/an) + Adj + Noun + that."
            }
        ]
    }
}

# 4 Checkpoint reviews
CHECKPOINTS = [
    {
        "name": "CHECKPOINT 1: REVIEW & ĐỀ THI GIỮA HỌC KÌ 1",
        "coverage": "Unit 1 (Local Community), Unit 2 (City Life), Unit 3 (Healthy Living for Teens)",
        "matrix": [
            ("Ngữ âm & Trọng âm", "Nguyên âm đơn / Nguyên âm đôi; Trọng âm từ 2 âm tiết có đuôi đặc biệt", "15%"),
            ("Ngữ pháp trọng tâm", "Wh- + to V; Double Comparatives (So sánh kép); Modals in Conditionals Type 1", "35%"),
            ("Từ vựng & Cụm động từ", "Phrasal Verbs Unit 1-2 (pass down, run out of, cut down on); Từ vựng đời sống, sức khỏe", "25%"),
            ("Đọc hiểu & Viết", "Điền từ đoạn văn chủ đề City/Health; Viết lại câu dùng So sánh kép và Wish", "25%")
        ],
        "links": [
            ("Kiểm tra Đọc hiểu & Từ vựng 1", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14601/test-yourself-1---doc-hieu--tu-vung"),
            ("Kiểm tra Ngữ pháp 1", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14591/test-yourself-1---ngu-phap"),
            ("Kiểm tra Năng lực giao tiếp 1", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14597/test-yourself-1---nang-luc-giao-tiep"),
            ("Đề thi giữa kì 1 - Đề số 1 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14612/de-thi-giua-ki-1-mon-tieng-anh-9-global-success---so-1"),
            ("Đề thi giữa kì 1 - Đề số 2 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14623/de-thi-giua-ki-1-mon-tieng-anh-9-global-success---so-2")
        ]
    },
    {
        "name": "CHECKPOINT 2: REVIEW & ĐỀ THI HỌC KÌ 1 (CUỐI KÌ 1)",
        "coverage": "Unit 4 (Remembering the Past), Unit 5 (Our Experiences), Unit 6 (Vietnamese Lifestyle)",
        "matrix": [
            ("Ngữ âm & Trọng âm", "Phát âm đuôi -ed; Trọng âm từ 3 âm tiết; Quy tắc trọng âm chứa hậu tố", "15%"),
            ("Ngữ pháp trọng tâm", "Past Continuous; Wish (Present); Present Perfect (since/for); Verb + to-V / V-ing", "35%"),
            ("Từ vựng & Cụm từ", "Lối sống xưa và nay; Kinh nghiệm khám phá; Gia đình đa thế hệ và hạt nhân", "25%"),
            ("Kỹ năng tổng hợp", "Biến đổi câu thì HTHT sang QKĐ; Viết lại câu với Wish và Used to", "25%")
        ],
        "links": [
            ("Kiểm tra Đọc hiểu & Từ vựng 2", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14872/test-yourself-2---doc-hieu--tu-vung"),
            ("Kiểm tra Ngữ pháp 2", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14856/test-yourself-2---ngu-phap"),
            ("Kiểm tra Năng lực giao tiếp 2", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14863/test-yourself-2---nang-luc-giao-tiep"),
            ("Đề thi học kì 1 - Đề số 1 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14878/de-thi-hoc-ki-1-mon-tieng-anh-9-global-success---so-1"),
            ("Đề thi học kì 1 - Đề số 2 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/14888/de-thi-hoc-ki-1-mon-tieng-anh-9-global-success---so-2")
        ]
    },
    {
        "name": "CHECKPOINT 3: REVIEW & ĐỀ THI GIỮA HỌC KÌ 2",
        "coverage": "Unit 7 (Natural Wonders), Unit 8 (Tourism), Unit 9 (World Englishes)",
        "matrix": [
            ("Ngữ âm & Trọng âm", "Trọng âm từ có tiền tố, hậu tố; Ngữ điệu câu hỏi đuôi và câu hỏi gián tiếp", "15%"),
            ("Ngữ pháp trọng tâm", "Reported Speech for Questions; Relative Pronouns (Who/Whom/Which/That/Whose)", "35%"),
            ("Từ vựng & Cụm từ", "Du lịch & Kỳ quan thế giới; World Englishes; Phrasal verbs (check out, brush up on)", "25%"),
            ("Đọc hiểu & Viết", "Đọc hiểu kỳ quan thế giới; Tường thuật câu hỏi và kết hợp câu dùng Đại từ quan hệ", "25%")
        ],
        "links": [
            ("Kiểm tra Đọc hiểu & Từ vựng 3", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15160/test-yourself-3---doc-hieu--tu-vung"),
            ("Kiểm tra Ngữ pháp 3", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15147/test-yourself-3---ngu-phap"),
            ("Kiểm tra Năng lực giao tiếp 3", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15152/test-yourself-3---nang-luc-giao-tiep"),
            ("Đề thi giữa kì 2 - Đề số 1 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15165/de-thi-giua-ki-2-mon-tieng-anh-9-global-success---so-1"),
            ("Đề thi giữa kì 2 - Đề số 2 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15175/de-thi-giua-ki-2-mon-tieng-anh-9-global-success---so-2")
        ]
    },
    {
        "name": "CHECKPOINT 4: TỔNG ÔN TOÀN DIỆN & LUYỆN ĐỀ THI VÀO 10",
        "coverage": "Unit 10 (Planet Earth), Unit 11 (Electronic Devices), Unit 12 (Career Choices) & Full Review",
        "matrix": [
            ("Ngữ âm & Trọng âm", "Tổng ôn toàn bộ quy tắc phát âm và trọng âm xuất hiện trong đề tuyển sinh", "15%"),
            ("Ngữ pháp nâng cao", "Non-defining relative clauses; Subjunctive với Suggest; Adverbial clauses of concession/reason", "35%"),
            ("Từ vựng & Cụm từ", "Môi trường, Thiết bị công nghệ thông minh, Định hướng nghề nghiệp tương lai", "25%"),
            ("Đề thi chuẩn hóa", "Luyện giải đề tổng hợp 50 câu / 60 phút theo form đề Sở GD&ĐT Hà Nội, TP.HCM", "25%")
        ],
        "links": [
            ("Kiểm tra Đọc hiểu & Từ vựng 4", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15474/test-yourself-4---doc-hieu--tu-vung"),
            ("Kiểm tra Ngữ pháp 4", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15467/test-yourself-4---ngu-phap"),
            ("Kiểm tra Năng lực giao tiếp 4", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15470/test-yourself-4---nang-luc-giao-tiep"),
            ("Đề thi học kì 2 - Đề số 1 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15479/de-thi-hoc-ki-2-mon-tieng-anh-9-global-success---so-1"),
            ("Đề thi học kì 2 - Đề số 2 (Chuẩn Tak12)", "https://tak12.com/ex/92/tieng-anh-lop-9-global-success/q/15486/de-thi-hoc-ki-2-mon-tieng-anh-9-global-success---so-2")
        ]
    }
]

# TOP TRANSFORMATION STRUCTURES
TRANSFORMATIONS = [
    ("Thì Hiện tại hoàn thành ➔ Quá khứ đơn",
     "S + last + V2/ed + ... ago<br>➔ S + have/has NOT + V3/ed + for...<br>➔ It is [time] since S + last + V2/ed",
     "I last saw Nam three years ago.<br>➔ <b>I haven't seen Nam for three years.</b>"),
    ("Câu ước ở hiện tại (Wish)",
     "S + do/does NOT + V_bare (hiện tại)<br>➔ S + wish(es) + S + V2/ed (were cho tất cả các ngôi)",
     "I don't have a modern laptop for my online study.<br>➔ <b>I wish I had a modern laptop for my online study.</b>"),
    ("Câu điều kiện loại 1 & Unless",
     "If + S + do/does NOT + V_bare...<br>➔ Unless + S + V(s/es)...",
     "If you don't revise carefully, you will fail the test.<br>➔ <b>Unless you revise carefully, you will fail the test.</b>"),
    ("So sánh kép (Double comparative)",
     "As S1 + V1 + adj-er, S2 + V2 + more adj<br>➔ The + adj-er/more adj + S1 + V1, the + adj-er/more adj + S2 + V2",
     "As the city becomes more crowded, life gets more stressful.<br>➔ <b>The more crowded the city becomes, the more stressful life gets.</b>"),
    ("Mệnh đề nhượng bộ (Although ➔ Despite)",
     "Although / Even though + S + V...<br>➔ Despite / In spite of + Noun phrase / V-ing",
     "Although the rain was heavy, we went on a field trip.<br>➔ <b>Despite the heavy rain, we went on a field trip.</b>"),
    ("Cấu trúc kết quả (So... that ➔ Such... that)",
     "S + be + so + adj + that + clause<br>➔ S + be + such + (a/an) + adj + noun + that + clause",
     "The cave was so magnificent that we visited it twice.<br>➔ <b>It was such a magnificent cave that we visited it twice.</b>"),
    ("Cấu trúc gợi ý (Suggest)",
     "Why don't we + V_bare...? / Let's + V_bare...<br>➔ S + suggested + V-ing<br>➔ S + suggested that + S + (should) + V_bare",
     "'Why don't we plant more trees around the school?'<br>➔ <b>Lan suggested planting more trees around the school.</b>")
]

# Generate Full HTML
html = """<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>CẨM NANG TINH HOA ÔN THI VÀO 10 — TIẾNG ANH 9 GLOBAL SUCCESS</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  
  @page {
    size: A4;
    margin: 12mm 10mm 12mm 10mm;
    @bottom-center {
      content: "Cẩm Nang Tinh Hoa Ôn Thi Vào 10 — Global Success 9 | Trang " counter(page);
      font-family: 'Open Sans', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
  }

  body {
    font-family: 'Open Sans', sans-serif;
    color: #1e293b;
    line-height: 1.45;
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-size: 8.5pt;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Montserrat', sans-serif;
    color: #0f172a;
    margin-top: 0;
  }

  .page-break {
    page-break-before: always;
  }

  /* Cover Page */
  .cover {
    height: 97vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 35px 25px;
    box-sizing: border-box;
  }

  .cover-tag {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 10.5pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .cover-title {
    font-size: 25pt;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 10px 0;
    color: #fef08a;
    text-shadow: 0 2px 4px rgba(0,0,0,0.25);
  }

  .cover-subtitle {
    font-size: 13pt;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 20px;
  }

  .cover-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 25px 0;
  }

  .stat-box {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 12px 8px;
  }

  .stat-number {
    font-size: 17pt;
    font-weight: 800;
    color: #fef08a;
  }

  .stat-label {
    font-size: 8pt;
    color: #e2e8f0;
    text-transform: uppercase;
    font-weight: 600;
  }

  .cover-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 12px;
    font-size: 9pt;
    color: #cbd5e1;
  }

  /* Section Headers */
  .section-banner {
    background: linear-gradient(90deg, #064e3b, #059669);
    color: #ffffff;
    padding: 9px 15px;
    border-radius: 6px;
    margin-bottom: 12px;
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

  .unit-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 15px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .unit-header {
    border-bottom: 2px solid #10b981;
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .unit-title {
    font-size: 11.5pt;
    font-weight: 700;
    color: #064e3b;
    margin: 0;
  }

  .unit-badge {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 7.5pt;
    font-weight: 600;
  }

  /* Knowledge Pillars */
  .pillar-box {
    margin-bottom: 7px;
    border-radius: 6px;
    padding: 7px 10px;
  }

  .pillar-know {
    background: #f0fdf4;
    border-left: 4px solid #10b981;
  }

  .pillar-notice {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
  }

  .pillar-avoid {
    background: #fef2f2;
    border-left: 4px solid #ef4444;
  }

  .pillar-apply {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 9px 12px;
  }

  .pillar-title {
    font-weight: 700;
    font-size: 8.5pt;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pillar-know .pillar-title { color: #047857; }
  .pillar-notice .pillar-title { color: #1d4ed8; }
  .pillar-avoid .pillar-title { color: #b91c1c; }
  .pillar-apply .pillar-title { color: #b45309; }

  /* 5 Exam Questions Cards */
  .example-card {
    background: #ffffff;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 8px 10px;
    margin-top: 8px;
    margin-bottom: 6px;
  }

  .example-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    border-bottom: 1px dashed #fcd34d;
    padding-bottom: 3px;
  }

  .ex-tag {
    background: #fef3c7;
    color: #92400e;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .ex-type {
    font-size: 7.5pt;
    color: #b45309;
    font-weight: 600;
    font-style: italic;
  }

  .ex-prompt {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    font-size: 8.5pt;
  }

  .ex-options {
    margin-left: 8px;
    margin-bottom: 4px;
    color: #334155;
    font-size: 8pt;
  }

  .ex-ans-box {
    background: #f8fafc;
    border-left: 3px solid #10b981;
    padding: 4px 8px;
    font-size: 8pt;
    margin-top: 4px;
    border-radius: 0 4px 4px 0;
  }

  .ex-ans-key {
    font-weight: 700;
    color: #047857;
  }

  .ex-trap-text {
    color: #b91c1c;
    font-size: 7.8pt;
    margin-top: 2px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 8pt;
  }

  th {
    background: #f1f5f9;
    color: #1e293b;
    font-weight: 700;
    text-align: left;
    padding: 5px 7px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 4px 7px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  .table-vocab td:nth-child(1) {
    font-weight: 700;
    color: #0f172a;
    width: 20%;
  }

  .table-vocab td:nth-child(2) {
    font-style: italic;
    color: #0284c7;
    width: 30%;
  }

  .table-vocab td:nth-child(3) {
    color: #334155;
    width: 50%;
  }

  /* Slide gallery */
  .slide-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .slide-img-container {
    flex: 1 1 calc(50% - 8px);
    max-width: calc(50% - 8px);
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    background: #f8fafc;
    text-align: center;
  }

  .slide-img-container img {
    width: 100%;
    height: auto;
    display: block;
  }

  .slide-caption {
    font-size: 7pt;
    color: #475569;
    padding: 3px;
    background: #f1f5f9;
    font-weight: 600;
  }

  /* Links & Badges */
  a.task-link {
    color: #0284c7;
    text-decoration: none;
    font-weight: 600;
  }

  a.task-link:hover {
    text-decoration: underline;
  }

  .badge-btn {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 600;
    text-decoration: none;
    margin-right: 3px;
  }

  .btn-quiz { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .btn-video { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  .btn-chuyende { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div>
    <span class="cover-tag">Hệ Thống Luyện Thi Vào 10 Chuyên & Đại Trà</span>
    <h1 class="cover-title">CẨM NANG TINH HOA<br>TIẾNG ANH 9 GLOBAL SUCCESS</h1>
    <div class="cover-subtitle">BỘ BẢN ĐỒ CHIẾN THUẬT • BẢNG CÔNG THỨC VÀNG • 5 CÂU VÍ DỤ THỰC CHIẾN / UNIT • VÍ DỤ NGỮ CẢNH TỪ VỰNG • 99 LINK THỰC HÀNH</div>
  </div>

  <div>
    <div class="cover-stats">
      <div class="stat-box">
        <div class="stat-number">12</div>
        <div class="stat-label">Chủ Điểm Unit SGK</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">60+</div>
        <div class="stat-label">Câu Ví Dụ Thực Chiến</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">96</div>
        <div class="stat-label">Từ Vựng Kèm Ví Dụ</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">99</div>
        <div class="stat-label">Task Bài Học & Luyện Thi</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <p>Biên soạn & Tích hợp đa phương tiện từ <b>Tak12, AzVocab, SGK Global Success & Đề Tuyển Sinh Vào 10</b></p>
    <p style="font-size: 8pt; opacity: 0.85;">Dành riêng cho Học sinh Lớp 9 Ôn thi Tuyển sinh Lớp 10 & Giáo viên bộ môn Tiếng Anh</p>
  </div>
</div>

<div class="page-break"></div>

<!-- PHẦN 1: BẢN ĐỒ CHIẾN THUẬT ÔN THI -->
<div class="section-banner">
  <h2>PHẦN 1: MA TRẬN ĐỀ THI VÀO 10 & CHIẾN LƯỢC TƯ DUY 4 BƯỚC</h2>
  <span style="font-size: 8pt; font-weight:600;">EXAM BLUEPRINT</span>
</div>

<p>Để đạt điểm số từ <b>8.5 đến 10.0</b> trong kì thi tuyển sinh vào lớp 10, học sinh không được học tủ hay học vẹt mà cần nắm vững <b>Ma trận cấu trúc đề thi</b> và quy trình tư duy giải đề chuẩn <b>KNOW → NOTICE → AVOID → APPLY</b>.</p>

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Chuyên đề thi</th>
      <th style="width: 45%;">Kiến thức trọng tâm kiểm tra</th>
      <th style="width: 15%;">Số câu ước tính</th>
      <th style="width: 15%;">Tỷ lệ điểm</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>1. Ngữ âm & Trọng âm</b></td>
      <td>Đuôi -s/-es, -ed; Nguyên âm đơn/đôi; Trọng âm từ 2 và 3 âm tiết</td>
      <td>4 câu</td>
      <td>10%</td>
    </tr>
    <tr>
      <td><b>2. Ngữ pháp & Từ vựng</b></td>
      <td>Thì động từ, Câu điều kiện, So sánh kép, Câu ước, Đại từ quan hệ, Phrasal verbs, Collocations</td>
      <td>14 - 16 câu</td>
      <td>35 - 40%</td>
    </tr>
    <tr>
      <td><b>3. Giao tiếp xã hội</b></td>
      <td>Tình huống chào hỏi, cảm ơn, xin lỗi, đề nghị, khuyên bảo, chúc mừng</td>
      <td>2 - 3 câu</td>
      <td>5 - 8%</td>
    </tr>
    <tr>
      <td><b>4. Đọc hiểu văn bản</b></td>
      <td>01 bài điền từ vào đoạn văn (Cloze test) + 01 bài đọc hiểu trả lời câu hỏi</td>
      <td>10 câu</td>
      <td>25%</td>
    </tr>
    <tr>
      <td><b>5. Viết & Biến đổi câu</b></td>
      <td>Viết lại câu tương đương (Wish, Conditionals, Reported speech, Passive voice, Double comparative, Because ➔ Despite)</td>
      <td>5 - 8 câu</td>
      <td>15 - 20%</td>
    </tr>
  </tbody>
</table>

<div class="pillar-box pillar-know">
  <div class="pillar-title">💎 1. KNOW — CÔNG THỨC BẮT BUỘC NHỚ</div>
  Nắm chắc công thức cốt lõi, trật tự từ và các dạng thức bất quy tắc của từng hiện tượng ngữ pháp.
</div>
<div class="pillar-box pillar-notice">
  <div class="pillar-title">🔍 2. NOTICE — DẤU HIỆU NHẬN BIẾT & TỪ KHÓA VÀNG</div>
  Tìm kiếm ngay các 'key signals' trong câu: trạng từ chỉ thời gian, mạo từ 'The... The...', từ nối, dấu phẩy trong câu.
</div>
<div class="pillar-box pillar-avoid">
  <div class="pillar-title">🚨 3. AVOID — BẪY ĐỀ THI HAY LỪA NHẤT</div>
  Cảnh giác với các bẫy đảo ngữ, bẫy thì kép, bẫy đại từ không dùng 'that', bẫy danh từ không đếm được.
</div>
<div class="pillar-box pillar-apply">
  <div class="pillar-title">🎯 4. APPLY — THỰC HÀNH CÂU ĐIỂN HÌNH</div>
  Luyện tập ngay các câu trích từ ngân hàng đề thi chính thức kèm link bài tập tự chấm điểm trên Tak12.
</div>

<div class="page-break"></div>

<!-- PHẦN 2: TINH HOA 12 UNIT -->
<div class="section-banner">
  <h2>PHẦN 2: TINH HOA 12 UNIT TIẾNG ANH 9 GLOBAL SUCCESS (KÈM 5 CÂU VÍ DỤ THỰC CHIẾN & VÍ DỤ TỪ VỰNG)</h2>
  <span style="font-size: 8pt; font-weight:600;">12 CORE UNITS</span>
</div>
"""

# Iterate through 12 Units
for u_idx, (unit_name, g_info) in enumerate(UNIT_GRAMMAR.items()):
    vocab_list = UNIT_VOCAB.get(unit_name, [])
    
    html += f"""
<div class="unit-card">
  <div class="unit-header">
    <h3 class="unit-title">{unit_name.upper()}</h3>
    <span class="unit-badge">TRỌNG TÂM THI VÀO 10</span>
  </div>

  <div style="font-weight: 700; color: #047857; margin-bottom: 6px; font-size: 9.5pt;">
    CHỦ ĐIỂM NGỮ PHÁP: {g_info['title']}
  </div>

  <div class="pillar-box pillar-know">
    <div class="pillar-title">💎 KNOW (CÔNG THỨC & QUY TẮC)</div>
    {g_info['know']}
  </div>

  <div class="pillar-box pillar-notice">
    <div class="pillar-title">🔍 NOTICE (DẤU HIỆU NHẬN BIẾT)</div>
    {g_info['notice']}
  </div>

  <div class="pillar-box pillar-avoid">
    <div class="pillar-title">🚨 AVOID (BẪY ĐỀ THI ĐIỂM LIỆT)</div>
    {g_info['avoid']}
  </div>

  <!-- 5 PRACTICE EXAM EXAMPLES -->
  <div class="pillar-box pillar-apply">
    <div class="pillar-title">🎯 APPLY: 5 CÂU VÍ DỤ THỰC CHIẾN ĐIỂN HÌNH (CÓ ĐÁP ÁN & GIẢI THÍCH CHI TIẾT)</div>
"""
    for ex in g_info.get('examples', []):
        opt_html = ""
        if ex.get('options'):
            opt_html = f"<div class='ex-options'>{' &nbsp;&nbsp;|&nbsp;&nbsp; '.join(ex['options'])}</div>"
        
        trap_html = ""
        if ex.get('trap'):
            trap_html = f"<div class='ex-trap-text'><b>⚠️ Mẹo phòng bẫy:</b> {ex['trap']}</div>"

        html += f"""
    <div class="example-card">
      <div class="example-header">
        <span class="ex-tag">Ví dụ {ex['num']}</span>
        <span class="ex-type">{ex['type']}</span>
      </div>
      <div class="ex-prompt"><b>Đề bài:</b> {ex['q']}</div>
      {opt_html}
      <div class="ex-ans-box">
        <span class="ex-ans-key">Đáp án: {ex['ans']}</span><br>
        <b>💡 Phân tích:</b> {ex['explain']}
        {trap_html}
      </div>
    </div>
"""
    html += """
  </div>

  <!-- VOCABULARY TABLE WITH EXAMPLES -->
  <div style="margin-top: 10px;">
    <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 8.5pt;">📚 TỪ VỰNG & CỤM TỪ ĂN ĐIỂM (KÈM VÍ DỤ MINH HỌA NGỮ CẢNH):</div>
    <table class="table-vocab">
      <thead>
        <tr>
          <th style="width: 20%;">Từ vựng & Phiên âm</th>
          <th style="width: 30%;">Từ loại & Ý nghĩa</th>
          <th style="width: 50%;">Ví dụ thực tế trong câu & Dịch nghĩa</th>
        </tr>
      </thead>
      <tbody>
"""
    for w, ipa, pos, meaning, ex_en, ex_vi in vocab_list:
        html += f"""
        <tr>
          <td><b>{w}</b><br><span style="font-family: monospace; color: #64748b; font-size: 7.5pt;">{ipa}</span></td>
          <td><span style="color: #0284c7; font-weight:600;">({pos})</span> {meaning}</td>
          <td><div style="color: #0f172a; font-weight:600;">• {ex_en}</div><div style="color: #475569; font-size: 7.5pt; font-style: italic;">➔ {ex_vi}</div></td>
        </tr>
"""
    html += """
      </tbody>
    </table>
  </div>
"""

    # Add slides if exist
    unit_slides = g_info.get('slides', [])
    existing_slides = [s for s in unit_slides if os.path.exists(os.path.join(SLIDES_DIR, s))]
    if existing_slides:
        html += """
  <div style="margin-top: 8px;">
    <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 8pt;">📊 SLIDE GHI NHỚ CHÍNH THỨC CỦA TAK12:</div>
    <div class="slide-gallery">
"""
        for s_file in existing_slides[:2]:
            caption = s_file.replace('.png', '').replace('.jpg', '').replace('_', ' ')
            html += f"""
      <div class="slide-img-container">
        <img src="slides/{s_file}" alt="{caption}">
        <div class="slide-caption">{caption[:45]}</div>
      </div>
"""
        html += """
    </div>
  </div>
"""

    html += """
</div>
"""
    # Break page every 2 units to prevent overcrowded pages
    if (u_idx + 1) % 2 == 0 and (u_idx + 1) < len(UNIT_GRAMMAR):
        html += '<div class="page-break"></div>'

# Checkpoints
html += """
<div class="page-break"></div>

<div class="section-banner">
  <h2>PHẦN 3: 4 CHẶNG CHECKPOINT ĐỀ THI & MA TRẬN TỔNG HỢP</h2>
  <span style="font-size: 8pt; font-weight:600;">EXAM CHECKPOINTS</span>
</div>
"""

for cp in CHECKPOINTS:
    html += f"""
<div class="unit-card" style="border-top: 4px solid #059669;">
  <div class="unit-header">
    <h3 class="unit-title" style="color: #047857;">{cp['name']}</h3>
    <span class="unit-badge">CHECKPOINT MÔ PHỎNG ĐỀ THI</span>
  </div>
  <div style="font-size: 8pt; color: #475569; margin-bottom: 6px;"><b>Phạm vi kiến thức:</b> {cp['coverage']}</div>

  <table style="margin-bottom: 8px;">
    <thead>
      <tr>
        <th style="width: 25%;">Chủ điểm</th>
        <th style="width: 60%;">Nội dung trọng điểm cần ôn</th>
        <th style="width: 15%;">Tỷ lệ</th>
      </tr>
    </thead>
    <tbody>
"""
    for topic, desc, weight in cp['matrix']:
        html += f"""
      <tr>
        <td><b>{topic}</b></td>
        <td>{desc}</td>
        <td style="font-weight: 700; color: #047857;">{weight}</td>
      </tr>
"""
    html += """
    </tbody>
  </table>

  <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 8pt;">🔗 LINK BÀI KIỂM TRA & ĐỀ THI TRỰC TIẾP TRÊN TAK12 (CLICK ĐỂ LÀM BÀI):</div>
  <div style="margin-left: 10px; line-height: 1.7;">
"""
    for l_name, l_url in cp['links']:
        html += f"""
    <div>• <a class="task-link" href="{l_url}" target="_blank">{l_name}</a> <span class="badge-btn btn-quiz">Làm bài online</span></div>
"""
    html += """
  </div>
</div>
"""

# Top Traps & Transformation Bank
html += """
<div class="page-break"></div>

<div class="section-banner">
  <h2>PHẦN 4: TOP BẪY ĐỀ THI KINH ĐIỂN & NGÂN HÀNG VIẾT LẠI CÂU</h2>
  <span style="font-size: 8pt; font-weight:600;">TRAP & TRANSFORMATION BANK</span>
</div>

<div class="unit-card">
  <h3 class="unit-title">1. BẢNG MẸO NHỚ PHÁT ÂM ĐUÔI -S/-ES VÀ -ED</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Đuôi</th>
        <th style="width: 15%;">Cách đọc</th>
        <th style="width: 35%;">Dấu hiệu tận cùng (Âm cuối)</th>
        <th style="width: 35%;">Mẹo ghi nhớ siêu nhanh</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="3"><b>Đuôi -S / -ES</b></td>
        <td><b style="color:#b91c1c;">/s/</b></td>
        <td>/p/, /k/, /f/, /t/, /θ/ (p, k, f, t, th)</td>
        <td><i><b>P</b>hải <b>K</b>hiêm <b>T</b>ốn <b>P</b>hát <b>T</b>hịt</i></td>
      </tr>
      <tr>
        <td><b style="color:#047857;">/ɪz/</b></td>
        <td>/s/, /z/, /ʃ/, /tʃ/, /dʒ/, /ʒ/ (s, x, z, ch, sh, ge, ce)</td>
        <td><i><b>S</b>óng <b>G</b>ió <b>C</b>hẳng <b>S</b>ợ <b>Z</b>ó <b>X</b>uân</i></td>
      </tr>
      <tr>
        <td><b style="color:#0369a1;">/z/</b></td>
        <td>Các âm còn lại (nguyên âm và phụ âm hữu thanh)</td>
        <td>Các trường hợp còn lại</td>
      </tr>
      <tr>
        <td rowspan="3"><b>Đuôi -ED</b></td>
        <td><b style="color:#b91c1c;">/ɪd/</b></td>
        <td>Tận cùng bằng /t/ hoặc /d/</td>
        <td><i><b>T</b>iền <b>Đ</b>âu</i></td>
      </tr>
      <tr>
        <td><b style="color:#047857;">/t/</b></td>
        <td>/p/, /k/, /f/, /s/, /ʃ/, /tʃ/ (p, k, f, s, sh, ch, x, c, gh)</td>
        <td><i><b>S</b>áng <b>S</b>ớm <b>Ch</b>ạy <b>Ph</b>à <b>K</b>hông <b>T</b>hôi</i></td>
      </tr>
      <tr>
        <td><b style="color:#0369a1;">/d/</b></td>
        <td>Các âm còn lại</td>
        <td>Các trường hợp còn lại</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="unit-card">
  <h3 class="unit-title">2. TOP 7 CẤU TRÚC BIẾN ĐỔI CÂU KINH ĐIỂN TRONG ĐỀ THI VÀO 10</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Dạng chuyển đổi</th>
        <th style="width: 45%;">Công thức biến đổi</th>
        <th style="width: 30%;">Ví dụ mẫu chuẩn</th>
      </tr>
    </thead>
    <tbody>
"""

for title, formula, ex in TRANSFORMATIONS:
    html += f"""
      <tr>
        <td><b>{title}</b></td>
        <td>{formula}</td>
        <td>{ex}</td>
      </tr>
"""

html += """
    </tbody>
  </table>
</div>
"""

# PHẦN 5: BẢNG REGISTRY 99 LINK
html += """
<div class="page-break"></div>

<div class="section-banner">
  <h2>PHẦN 5: BẢNG TRA CỨU REGISTRY TOÀN BỘ 99 TASK & LINK LUYỆN ĐỀ</h2>
  <span style="font-size: 8pt; font-weight:600;">LINK REGISTRY</span>
</div>

<p>Dưới đây là toàn bộ <b>99 liên kết học tập và đề thi</b> theo đúng lộ trình SGK Tiếng Anh 9 Global Success từ Google Spreadsheet. Học sinh và giáo viên có thể nhấp chuột trực tiếp vào từng đường link để làm bài trên Tak12 hoặc xem video giảng bài Youtube:</p>

<table>
  <thead>
    <tr>
      <th style="width: 6%;">STT</th>
      <th style="width: 24%;">Unit / Chặng</th>
      <th style="width: 45%;">Tên bài học & Chuyên đề</th>
      <th style="width: 15%;">Loại học liệu</th>
      <th style="width: 10%;">Truy cập</th>
    </tr>
  </thead>
  <tbody>
"""

for task in kb['tasks']:
    stt = task.get('stt', '')
    if not stt or stt == 'STT':
        continue
    unit = task.get('unit', '')
    title = task.get('title', '')
    link = task.get('link', '')
    t_type = task.get('type', 'other')
    
    type_badge = ""
    if 'youtube' in t_type:
        type_badge = "<span class='badge-btn btn-video'>Video YT</span>"
    elif 'quiz' in t_type:
        type_badge = "<span class='badge-btn btn-quiz'>Quiz Tak12</span>"
    elif 'chuyende' in t_type:
        type_badge = "<span class='badge-btn btn-chuyende'>Chuyên đề</span>"
    elif 'vocab' in t_type:
        type_badge = "<span class='badge-btn' style='background:#f3e8ff; color:#7e22ce;'>Từ vựng</span>"
    else:
        type_badge = "<span class='badge-btn' style='background:#f1f5f9; color:#475569;'>Đề thi</span>"

    click_link = f"<a class='task-link' href='{link}' target='_blank'>Làm bài</a>" if link else "-"
    
    html += f"""
    <tr>
      <td style="text-align: center; font-weight: 700;">{stt}</td>
      <td>{unit}</td>
      <td>{title}</td>
      <td>{type_badge}</td>
      <td style="text-align: center;">{click_link}</td>
    </tr>
"""

html += """
  </tbody>
</table>

</body>
</html>
"""

# Save HTML
with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"HTML generated successfully at: {HTML_FILE} ({len(html)} bytes)")

# Compile to PDF using headless Chrome
chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cmd = [
    chrome_bin,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_FILE}",
    HTML_FILE
]

print("Compiling PDF with Google Chrome...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"SUCCESS: PDF generated at: {PDF_FILE}")
    print(f"PDF File size: {os.path.getsize(PDF_FILE)} bytes")
else:
    print(f"ERROR: {res.stderr}")
