#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
import os
import unicodedata

with open("data/curated_grammar_theories.json", "r", encoding="utf-8") as f:
    curated = json.load(f)

def remove_accents(input_str):
    s = input_str.replace("đ", "d").replace("Đ", "d").replace("\ufffd", "")
    nfkd_form = unicodedata.normalize("NFKD", s)
    cleaned = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    return re.sub(r"\s+", " ", cleaned).strip()

def normalize_name(s):
    if not s:
        return ""
    s = s.lower().strip()
    s = re.sub(r"[\"\'',.:;!?()\\/\-_]+", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

normalized_index = {normalize_name(k): v for k, v in curated.items()}

aliases = {
    "so that such a an that": "so... that, such (a/an)... that",
    "cau uoc voi i wish if only": 'Câu ước với "I wish", "If only"',
    "cau dieu kien loai 2": "Câu điều kiện loại 2",
    "cau diu kien loai 2": "Câu điều kiện loại 2",
    "cac cau truc chi muc dich": "Các cấu trúc chỉ mục đích",
    "cac cau truc chi mc dich": "Các cấu trúc chỉ mục đích",
    "suggest be suggested that": "... suggest ... /... be suggested that ...",
    "used to would get be used to": "Used to, would, get/be used to",
    "used to": "Used to, would, get/be used to",
    'cau truc hon prefer would prefer would rather would sooner': 'Cấu trúc "hơn": prefer, would prefer, would rather/would sooner',
    "the bi dong o thi qua khu don": "Thể bị động ở thì quá khứ đơn",
    "the bi dong o thi hien tai don": "Thể bị động ở thì hiện tại đơn",
    "the bi dong o thi tuong lai don": "Thể bị động ở thì tương lai đơn",
    "the bi dong o thi hien tai hoan thanh": "Thể bị động ở thì hiện tại hoàn thành",
    "the bi dong voi cac thi tiep dien": "Thể bị động với các thì tiếp diễn",
    "the bi dong voi dong tu khuyet thieu": "Thể bị động với động từ khuyết thiếu",
    "the bi dong vi dong tu khuyet thieu": "Thể bị động với động từ khuyết thiếu",
    "the bi dong voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "the bi dng voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "chuyen cau tuong thuat tu truc tiep sang gian tiep co thay doi thi": "Chuyển câu tường thuật từ trực tiếp sang gián tiếp: có thay đổi thì",
    "chuyen cau tuong thuat tu truc tiep sang gian tiep khong thay doi thi": "Chuyển câu tường thuật từ trực tiếp sang gián tiếp: không thay đổi thì",
    "chuyen tu cau gian tiep ve cau truc tiep": "Chuyển từ câu gián tiếp về câu trực tiếp",
    "cau nghi van de nghi menh lenh o dang gian tiep": "Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp",
    "cau nghi van de nghi mnh lenh o dang gian tiep": "Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp",
    "dong tu tuong thuat": "Động từ tường thuật",
    "dong tu theo sau boi v ing hoac to v inf": "Động từ theo sau bởi V-ing hoặc to-V(inf)",
    "dong tu theo sau boi v ing": "Động từ theo sau bởi V-ing",
    "dong tu theo sau boi dong tu nguyen the": "Động từ theo sau bởi động từ nguyên thể",
    "verb v ing like hate love": "Verb + V-ing: like/hate/love",
    "danh dong tu": "Danh động từ",
    "tinh tu to v infinitive": "Tính từ + to + V-infinitive",
    "thi hien tai hoan thanh cau tao va cach dung": "Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng",
    "thi hien tai hoan thanh voi since for": "Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng",
    "thi hien tai hoan thanh voi yet just already": "Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng",
    "thi hien tai hoan thanh voi ever never": "Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng",
    "thi hien tai don hay thi hien tai tiep dien": "Thì Hiện tại đơn hay Thì Hiện tại tiếp diễn",
    "thi qua khu tiep dien": "Thì Quá khứ tiếp diễn",
    "thi tuong lai don": "Thì Tương lai đơn",
    "dung be going to de noi ve tuong lai": "Dùng Be going to để nói về tương lai",
    "thi hien tai tiep dien bieu dat ke hoach tuong lai": "Thì Hiện tại tiếp diễn biểu đạt kế hoạch tương lai",
    "so sanh bang khong bang as as not as so as": "So sánh bằng/không bằng: as ... as, not as/so ... as",
    "so sanh hon kem cua tinh tu": "So sánh hơn kém của tính từ",
    "so sanh nhat cua tinh tu": "So sánh nhất của tính từ",
    "so sanh hon kem cua trang tu": "So sánh hơn kém của trạng từ",
    "so sanh nhat cua trang tu": "So sánh nhất của trạng từ",
    "so sanh kep": "So sánh kép",
    "so sanh giong va khac nhau": "So sánh giống và khác nhau",
    "cau hoi duoi": "Câu hỏi đuôi",
    "cau hoi duoi voi mot so truong hop dac biet": "Câu hỏi đuôi với một số trường hợp đặc biệt",
    "cau hoi yes no": "Câu hỏi Yes/No",
    "mao tu xac dinh va mao tu khong xac dinh a an the": "Mạo từ xác định và mạo từ không xác định (a/an/the)",
    "mao tu xac dinh va nhung truong hop khong dung mao tu": "Mạo từ xác định và những trường hợp không dùng mạo từ",
    "nhung cach dung dac biet cua mao tu": "Những cách dùng đặc biệt của mạo từ",
    'a hay an': '"a" hay "an"',
    "a lot of lots of many much few a few little a little": "a lot of, lots of, many, much, few, a few, little, a little",
    "many much more": "many, much, more",
    "how much how many": "How much/how many",
    "tu dinh luong some any": "Từ định lượng some, any...",
    "each of every each every one of": "each (of), every, each/ every one (of)",
    "all every": "all, every",
    "one ones another other the other each other one another": "One, ones, another, other, the other, each other, one another",
    "danh tu so it va so nhieu": "Danh từ số ít và số nhiều",
    "danh tu dem duoc va khong dem duoc": "Danh từ đếm được và không đếm được",
    "cach do dem danh tu khong dem duoc": "Cách đo đếm danh từ không đếm được",
    "danh tu ghep": "Danh từ ghép",
    "dai tu lam chu ngu va tan ngu i me": "Đại từ làm chủ ngữ và tân ngữ (I, me,...)",
    "tinh tu so huu my your": "Tính từ sở hữu (my, your,...)",
    "dai tu so huu mine yours": "Đại từ sở hữu (mine, yours,...)",
    "so huu cach s": "Sở hữu cách 's",
    "cac dang so huu khac": "Các dạng sở hữu khác",
    "dai tu chi dinh": "Đại từ chỉ định",
    "dai tu trang tu bat dinh somebody anything anywhere": "Đại từ/Trạng từ bất định (somebody, anything, anywhere...)",
    "tinh tu tan cung bang ed va ing": "Tính từ tận cùng bằng -ed và -ing",
    "trat tu cua cac tinh tu": "Trật tự của các tính từ",
    "tinh tu hay trang tu": "Tính từ hay trạng từ",
    "chuc nang va vi tri cua tinh tu": "Chức năng và vị trí của tính từ",
    "chuc nang va vi tri cua trang tu": "Chức năng và vị trí của trạng từ",
    "trang tu chi tan suat": "Trạng từ chỉ tần suất",
    "cum trang tu chi muc do va xac xuat": "(Cụm) Trạng từ chỉ mức độ và xác xuất",
    "trang tu chi noi chon cach thuc thoi gian": "Trạng từ chỉ nơi chốn, cách thức, thời gian",
    "cum trang tu chi thoi gian noi chon tan suat": "Cụm trạng từ chỉ thời gian, nơi chốn, tần suất",
    "cum gioi tu": "Cụm giới từ",
    "lien tu ket hop and or but": "Liên từ kết hợp (and, or, but...)",
    "lien tu kt hop and or but": "Liên từ kết hợp (and, or, but...)",
    "trang tu lien ket however therefore accordingly": "Trạng từ liên kết (however, therefore, accordingly...)",
    "nhung truong hop can luu y ve hoa hop s v": "Những trường hợp cần lưu ý về hòa hợp S-V",
    "chu ngu gia": "Chủ ngữ giả",
    'menh de that': 'Mệnh đề "That"',
    "menh de danh ngu": "Mệnh đề danh ngữ",
    "menh de phan tu": "Mệnh đề phân từ",
    'menh de trang ngu chi thoi gian voi when': 'Mệnh đề trạng ngữ chỉ thời gian với "When"',
    "menh de chi thoi gian trong tuong lai": "Mệnh đề chỉ thời gian trong tương lai",
    "cac cau truc cau don co ban va trat tu tu": "Các cấu trúc câu đơn cơ bản và trật tự từ",
    "thanh lap dong tu": "Thành lập động từ",
    "cau menh lenh": "Câu mệnh lệnh",
    "cau truc dong tinh so too neither either": "Cấu trúc đồng tình: So, too, neither, either",
    "cau gia dinh voi would rather would sooner": "Câu giả định với would rather/would sooner",
    "on luyen tong hop ve cac dong tu khuyet thieu": "Ôn luyện tổng hợp về các động từ khuyết thiếu",
    "dong tu khuyet thieu dua yeu cau de nghi goi y": "Ôn luyện tổng hợp về các động từ khuyết thiếu",
    "dua ra va dap lai loi khen chuc mung": "Đưa ra và đáp lại lời khen/chúc mừng",
    "bay to loi cam on va xin loi": "Bày tỏ lời cảm ơn và xin lỗi",
    "dua ra goi y va loi de nghi": "Đưa ra gợi ý và lời đề nghị",
    "dua ra loi moi va phan hoi loi moi": "Đưa ra lời mời và phản hồi lời mời",
    "bay to su dong tinh khong dong tinh": "Bày tỏ sự đồng tình/không đồng tình",
    "bay to quan diem ca nhan": "Bày tỏ quan điểm cá nhân",
    "would like": "Would like",
    "too enough": "too, enough"
}

def get_curated(name):
    if not name:
        return None
    if name in curated:
        return curated[name]
    norm = normalize_name(name)
    if norm in normalized_index:
        return normalized_index[norm]
    norm_no_acc = remove_accents(norm)
    if norm_no_acc in aliases:
        return curated.get(aliases[norm_no_acc])
    for k, canonical in aliases.items():
        if k in norm_no_acc or norm_no_acc in k:
            return curated.get(canonical)
    for k in curated:
        norm_k = remove_accents(normalize_name(k))
        if norm_no_acc in norm_k or norm_k in norm_no_acc:
            return curated[k]
    return None

print("Loading data/related_topics.json...")
with open("data/related_topics.json", "r", encoding="utf-8") as f:
    related = json.load(f)

replaced_count = 0
fixed_img_iframes = 0

for qid, obj in related.items():
    if obj and "listQuestionTopicDetail" in obj:
        for t in obj["listQuestionTopicDetail"]:
            detail = t.get("detail", "")
            if detail:
                # 1. Fix iframe with local image inside: <iframe src="/Upload/...jpg">
                img_match = re.search(r'<iframe[^>]*src=["\'](/Upload/[^"\']+\.(?:jpg|png|jpeg))["\'][^>]*>\s*</iframe>', detail, re.IGNORECASE)
                if img_match:
                    img_src = img_match.group(1)
                    t["detail"] = f'<div class="text-center my-3"><img src="{img_src}" class="max-w-full h-auto rounded-lg mx-auto shadow-md" alt="Kiến thức minh họa" /></div>'
                    fixed_img_iframes += 1
                    continue

                # 2. Check for Canva or H5P or broken iframes
                if "canva.com" in detail or "cth.edu.vn" in detail or "h5p" in detail:
                    topic_name = t.get("name", "").strip()
                    curated_card = get_curated(topic_name)
                    if curated_card:
                        t["detail"] = curated_card
                        replaced_count += 1
                    else:
                        print(f"Warning: No curated card for topic {topic_name}")

print(f"Replaced {replaced_count} broken iframes with offline curated HTML cards.")
print(f"Fixed {fixed_img_iframes} image-in-iframe tags.")

with open("data/related_topics.json", "w", encoding="utf-8") as f:
    json.dump(related, f, ensure_ascii=False)

print("Saved updated data/related_topics.json.")
