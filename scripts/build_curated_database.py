#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build 100% Offline Curated Grammar Theories for Grade 9 Entrance Exam (Vào 10).
Replaces all Canva (canva.com) and H5P (cth.edu.vn) broken iframes with
rich, dark-mode compliant, pedagogical HTML cards.
"""

import json
import re
import os

def build_card(badge, desc, sections, examples=None, traps=None):
    sec_html = ""
    for sec_title, formulas, sub_desc in sections:
        f_html = ""
        for f in formulas:
            f_html += f'<div class="font-mono bg-[#161916] p-2 rounded border border-[#383c38] text-emerald-300 text-xs mt-1">{f}</div>'
        sub_desc_html = f'<p class="text-slate-300 text-xs mt-1">{sub_desc}</p>' if sub_desc else ""
        sec_html += f"""
        <div class="p-3 bg-[#1e221e] border border-[#383c38] rounded-xl space-y-1.5">
          <div class="font-bold text-emerald-400 text-sm">{sec_title}</div>
          {f_html}
          {sub_desc_html}
        </div>
        """

    table_html = ""
    if examples and len(examples) > 0:
        rows = ""
        for col1, col2, col3 in examples:
            rows += f"""
            <tr>
              <td class="p-2 border border-[#383c38] font-bold text-emerald-300">{col1}</td>
              <td class="p-2 border border-[#383c38] font-mono text-[11px]">{col2}</td>
              <td class="p-2 border border-[#383c38] text-xs">{col3}</td>
            </tr>
            """
        table_html = f"""
        <div class="p-3 bg-[#1e221e] border border-[#383c38] rounded-xl space-y-2">
          <div class="font-bold text-emerald-400 text-sm">Bảng ví dụ & Cặp câu đối chiếu</div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-[#383c38]">
              <thead>
                <tr class="bg-[#1c581f] text-white">
                  <th class="p-2 border border-[#383c38]">Phân loại</th>
                  <th class="p-2 border border-[#383c38]">Cấu trúc / Quy tắc</th>
                  <th class="p-2 border border-[#383c38]">Ví dụ minh họa</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#383c38] text-slate-200">
                {rows}
              </tbody>
            </table>
          </div>
        </div>
        """

    traps_html = ""
    if traps and len(traps) > 0:
        items = "".join([f"<li>{t}</li>" for t in traps])
        traps_html = f"""
        <div class="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs space-y-1">
          <div class="font-bold text-amber-400">⚠️ Bẫy thường gặp trong đề thi vào 10:</div>
          <ul class="list-disc pl-4 space-y-1 text-slate-300">
            {items}
          </ul>
        </div>
        """

    return f"""
<div class="theory-offline-card space-y-4 text-slate-200">
  <div class="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
    <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
      {badge}
    </div>
    <p class="text-xs text-slate-300">{desc}</p>
  </div>
  <div class="space-y-3">
    {sec_html}
    {table_html}
    {traps_html}
  </div>
</div>
""".strip()

curated = {}

# --- 1. RESULT & PURPOSE STRUCTURES ---
curated["so... that, such (a/an)... that"] = build_card(
    "Cấu trúc kết quả: SO... THAT và SUCH (A/AN)... THAT",
    "Diễn tả nguyên nhân - kết quả: một tính chất/hành động xảy ra ở mức độ cao dẫn đến kết quả ở mệnh đề sau.",
    [
        ("1. Công thức với SO... THAT", [
            "S + be/linking verb + SO + Adj + THAT + S + V",
            "S + ordinary verb + SO + Adv + THAT + S + V",
            "S + V + SO + many/few + Plural Noun + THAT + S + V",
            "S + V + SO + much/little + Uncountable Noun + THAT + S + V"
        ], "The coffee was so hot that I couldn't drink it. / He spoke so quietly that no one heard."),
        ("2. Công thức với SUCH... THAT", [
            "S + V + SUCH + (a/an) + Adj + Noun + THAT + S + V"
        ], "It was such an exciting match that everybody cheered. / They are such nice people that everyone likes them."),
        ("3. Chuyển đổi qua lại (Viết lại câu)", [
            "SO + Adj + THAT ➔ SUCH + (a/an) + Adj + N + THAT",
            "SO/SUCH ➔ TOO + Adj + (for O) + to V (Quá... không thể)",
            "SO/SUCH ➔ (not) Adj + ENOUGH + (for O) + to V"
        ], "The exercise is so difficult that I can't do it. ➔ It is too difficult for me to do.")
    ],
    [
        ("SO + Adj", "The box is so heavy that he can't lift it.", "Cái hộp quá nặng đến nỗi anh ấy không nhấc nổi."),
        ("SUCH + a/an + Adj + N", "It is such a heavy box that he can't lift it.", "Đó là một cái hộp nặng đến mức anh ấy không nhấc nổi."),
        ("TOO... TO", "The box is too heavy for him to lift.", "Cái hộp quá nặng để anh ấy có thể nhấc (mang nghĩa phủ định)."),
        ("ENOUGH... TO", "He is not strong enough to lift the box.", "Anh ấy không đủ khỏe để nhấc cái hộp.")
    ],
    [
        "Danh từ đếm được số ít bắt buộc có 'a/an': such A sunny day (không dùng 'such sunny day').",
        "Danh từ số nhiều hoặc danh từ không đếm được KHÔNG dùng 'a/an': such cold water, such kind friends.",
        "Sau 'many, much, few, little' luôn dùng SO chứ không dùng SUCH (so many problems, so much sugar)."
    ]
)

curated["too, enough"] = build_card(
    "Cấu trúc TOO (quá đến nỗi không thể) và ENOUGH (đủ để làm gì)",
    "Hai cấu trúc thường xuyên xuất hiện trong phần viết lại câu và trắc nghiệm chọn đáp án của đề thi vào 10.",
    [
        ("1. Cấu trúc với TOO (mang nghĩa phủ định)", [
            "S + be + TOO + Adj + (for sb) + to V",
            "S + V(thường) + TOO + Adv + (for sb) + to V"
        ], "This shirt is too small for me to wear. / She walked too slowly to catch the bus."),
        ("2. Cấu trúc với ENOUGH (mang nghĩa khẳng định hoặc phủ định)", [
            "S + be + Adj + ENOUGH + (for sb) + to V (Tính từ đứng TRƯỚC enough)",
            "S + V(thường) + Adv + ENOUGH + (for sb) + to V (Trạng từ đứng TRƯỚC enough)",
            "S + V + ENOUGH + Noun + (for sb) + to V (Danh từ đứng SAU enough)"
        ], "He is tall enough to reach the top shelf. / We have enough time to finish the test.")
    ],
    [
        ("TOO + Adj", "The water is too cold to swim in.", "Nước quá lạnh để bơi."),
        ("Adj + ENOUGH", "The water is not warm enough to swim in.", "Nước không đủ ấm để bơi."),
        ("ENOUGH + Noun", "We don't have enough money to buy that car.", "Chúng tôi không có đủ tiền để mua chiếc xe đó.")
    ],
    [
        "Vị trí của ENOUGH: Đứng SAU Tính từ / Trạng từ (warm enough, well enough) nhưng đứng TRƯỚC Danh từ (enough money, enough seats).",
        "Tuyệt đối KHÔNG lặp lại tân ngữ ở cuối câu khi dùng TOO: 'The tea is too hot to drink' (ĐÚNG) - KHÔNG viết 'to drink it' (SAI)."
    ]
)

curated["Các cấu trúc chỉ mục đích"] = build_card(
    "Các cấu trúc chỉ mục đích (Clauses & Phrases of Purpose)",
    "Dùng để nêu mục đích của hành động: 'để làm gì', 'để cho ai làm gì', 'để không bị...'.",
    [
        ("1. Cụm từ chỉ mục đích (Phrases of Purpose)", [
            "S + V + to / in order to / so as to + V-inf (Để làm gì)",
            "S + V + in order not to / so as to not + V-inf (Để không làm gì)"
        ], "I study hard in order to pass the exam. / He left early so as not to be late."),
        ("2. Mệnh đề chỉ mục đích (Clauses of Purpose)", [
            "S + V + SO THAT / IN ORDER THAT + S + can/could/will/would + (not) + V-inf"
        ], "She whispered so that no one could hear their conversation.")
    ],
    [
        ("Cụm từ khẳng định", "He exercises daily to stay healthy.", "Anh ấy tập thể dục hàng ngày để giữ sức khỏe."),
        ("Cụm từ phủ định", "She set an alarm in order not to oversleep.", "Cô ấy đặt chuông để không ngủ quên."),
        ("Mệnh đề so that", "He saves money so that he can buy a laptop.", "Anh ấy tiết kiệm tiền để có thể mua máy tính.")
    ],
    [
        "Dạng phủ định với cụm từ bắt buộc là 'in order not to' hoặc 'so as not to', KHÔNG được dùng 'not to V'.",
        "Nếu chủ ngữ của 2 mệnh đề giống nhau ➔ rút gọn thành cụm từ 'to / in order to / so as to + V'.",
        "Nếu 2 chủ ngữ khác nhau ➔ bắt buộc dùng mệnh đề 'so that / in order that + S + modal + V'."
    ]
)

# --- 2. CONDITIONALS & WISHES ---
curated['Câu điều kiện loại 2'] = build_card(
    "Câu điều kiện loại 2 (Conditional Type 2)",
    "Diễn tả sự việc, tình huống không có thật hoặc trái ngược với thực tế ở hiện tại hoặc tương lai.",
    [
        ("Công thức chuẩn", [
            "Mệnh đề IF: If + S + V-ed / V2 (To be: dùng WERE cho mọi ngôi)",
            "Mệnh đề CHÍNH: S + would / could / might + V-inf"
        ], "If I had a lot of money, I would travel around the world."),
        ("Cấu trúc khuyên bảo với 'If I were you'", [
            "If I were you, I would / wouldn't + V-inf (Nếu tôi là bạn, tôi sẽ...)"
        ], "If I were you, I would accept that job offer.")
    ],
    [
        ("Thực tế (Hiện tại)", "I am busy, so I can't visit you.", "Tôi bận nên không thể thăm bạn."),
        ("Câu điều kiện loại 2", "If I weren't busy, I could visit you.", "Nếu tôi không bận thì tôi đã có thể thăm bạn."),
        ("Đảo ngữ (Nâng cao)", "Were I to have free time, I would visit you.", "Nếu tôi có thời gian rảnh, tôi sẽ đến thăm bạn.")
    ],
    [
        "To be trong mệnh đề If chuẩn thi cử luôn dùng 'WERE' cho tất cả các ngôi (If I were, If he were, If she were).",
        "Khi viết lại câu từ tình huống thực tế sang điều kiện loại 2: Khẳng định ➔ Phủ định, Phủ định ➔ Khẳng định."
    ]
)

curated['Câu ước với "I wish", "If only"'] = build_card(
    'Câu ước với "I wish" và "If only"',
    "Dùng để diễn tả mong ước một điều trái ngược với thực tế ở hiện tại, quá khứ hoặc tương lai.",
    [
        ("1. Ước ở hiện tại (Trái với hiện tại)", [
            "S + wish(es) + S + V-ed / V2 (To be dùng WERE cho mọi chủ ngữ)"
        ], "I don't have a car. ➔ I wish I had a car. / I wish I were taller."),
        ("2. Ước ở tương lai (Mong muốn thay đổi trong tương lai)", [
            "S + wish(es) + S + WOULD / COULD + V-inf"
        ], "It will rain tomorrow. ➔ I wish it wouldn't rain tomorrow."),
        ("3. Ước ở quá khứ (Hối tiếc về điều đã xảy ra)", [
            "S + wish(es) + S + HAD + V3/ed"
        ], "I failed the test. ➔ I wish I had studied harder.")
    ],
    [
        ("Ước hiện tại", "I am poor ➔ I wish I were rich.", "Ước một điều trái ngược với hiện tại (lùi 1 thì về QKĐ)."),
        ("Ước tương lai", "He won't come ➔ I wish he would come.", "Ước điều gì đó xảy ra trong tương lai (dùng would + V)."),
        ("If only", "If only I knew her phone number!", "Giá như tôi biết số điện thoại của cô ấy! (mạnh hơn I wish).")
    ],
    [
        "Quy tắc vàng: Câu ước LUÔN PHẢI LÙI THÌ so với câu gốc.",
        "Không dùng 'would' khi chủ ngữ của wish và mệnh đề sau là cùng một người ('I wish I would' là SAI ➔ dùng 'I wish I could')."
    ]
)

curated["Từ/Cụm từ liên kết: unless, provided that, as long as, in case"] = build_card(
    "Liên từ điều kiện: UNLESS, PROVIDED THAT, AS LONG AS, IN CASE",
    "Các liên từ mở đầu mệnh đề điều kiện hoặc phòng ngừa rủi ro.",
    [
        ("1. UNLESS = IF... NOT (Trừ khi, nếu không)", [
            "Unless + S + V (khẳng định) = If + S + do/does/did not + V"
        ], "Unless you study, you will fail. = If you don't study, you will fail."),
        ("2. AS LONG AS / PROVIDED (THAT) (Miễn là, với điều kiện là)", [
            "S + V + as long as / provided that + S + V"
        ], "You can borrow my bike as long as you return it tomorrow."),
        ("3. IN CASE (Phòng khi, đề phòng trường hợp)", [
            "S + V + in case + S + V (hiện tại đơn / quá khứ đơn)"
        ], "Take an umbrella in case it rains. (Mang ô phòng khi trời mưa).")
    ],
    [
        ("Unless", "Unless he arrives soon, we will leave.", "Nếu anh ấy không đến sớm, chúng tôi sẽ đi."),
        ("If not", "If he doesn't arrive soon, we will leave.", "Câu tương đương dùng If not."),
        ("In case", "I'll give you my key in case I am late.", "Phòng khi tôi về muộn.")
    ],
    [
        "Trong mệnh đề chứa UNLESS tuyệt đối KHÔNG dùng dạng phủ định (KHÔNG viết: Unless you don't study).",
        "Phân biệt IF và IN CASE: 'Take an umbrella if it rains' (mưa mới lấy ô); 'Take an umbrella in case it rains' (lấy ô sẵn để phòng mưa)."
    ]
)

# --- 3. PASSIVE VOICE ---
curated["Thể bị động ở thì quá khứ đơn"] = build_card(
    "Thể bị động ở thì Quá khứ đơn (Past Simple Passive)",
    "Diễn tả hành động đã xảy ra trong quá khứ khi đối tượng chịu tác động quan trọng hơn chủ thể thực hiện.",
    [
        ("Công thức chủ động & bị động", [
            "Chủ động: S + V-ed / V2 + O",
            "Bị động: S(O) + WAS / WERE + V3/ed + (by O)"
        ], "Was: dùng cho I, he, she, it, danh từ số ít / Were: dùng cho you, we, they, danh từ số nhiều.")
    ],
    [
        ("Chủ động", "Alexander Bell invented the telephone in 1876.", "Bell đã phát minh ra điện thoại."),
        ("Bị động", "The telephone was invented by Alexander Bell in 1876.", "Điện thoại được phát minh bởi Bell."),
        ("Phủ định", "The letters were not sent yesterday.", "Những lá thư đã không được gửi ngày hôm qua.")
    ],
    [
        "Trật tự trạng từ: Nơi chốn + BY O + Thời gian (Ví dụ: The cake was made in the kitchen by Mary yesterday).",
        "Bỏ 'by them, by people, by someone, by us' nếu chủ thể không xác định."
    ]
)

curated["Thể bị động ở thì hiện tại đơn"] = build_card(
    "Thể bị động ở thì Hiện tại đơn (Present Simple Passive)",
    "Diễn tả hành động lặp đi lặp lại hoặc chân lý, thói quen ở hiện tại dưới dạng bị động.",
    [
        ("Công thức chủ động & bị động", [
            "Chủ động: S + V(s/es) + O",
            "Bị động: S(O) + AM / IS / ARE + V3/ed + (by O)"
        ], "English is spoken all over the world.")
    ],
    [
        ("Chủ động", "Farmers grow rice in tropical countries.", "Nông dân trồng lúa ở các nước nhiệt đới."),
        ("Bị động", "Rice is grown in tropical countries.", "Lúa được trồng ở các nước nhiệt đới."),
        ("Nghi vấn", "Is this house cleaned every day?", "Ngôi nhà này có được dọn dẹp hàng ngày không?")
    ],
    [
        "Chia to be (am/is/are) theo CHỦ NGỮ MỚI, không chia theo chủ ngữ ban đầu.",
        "Động từ bất quy tắc phải chuyển sang dạng quá khứ phân từ V3 (write ➔ written, make ➔ made, speak ➔ spoken)."
    ]
)

curated["Thể bị động ở thì tương lai đơn"] = build_card(
    "Thể bị động ở thì Tương lai đơn (Future Simple Passive)",
    "Diễn tả hành động sẽ được thực hiện trong tương lai.",
    [
        ("Công thức chủ động & bị động", [
            "Chủ động: S + will + V-inf + O",
            "Bị động: S(O) + WILL BE + V3/ed + (by O)"
        ], "A new hospital will be built in this area next year.")
    ],
    [
        ("Khẳng định", "They will complete the bridge soon.", "The bridge will be completed soon."),
        ("Phủ định", "They won't hold the meeting.", "The meeting won't be held."),
        ("Nghi vấn", "Will the test be announced tomorrow?", "Bài kiểm tra sẽ được công bố vào ngày mai chứ?")
    ],
    [
        "Sau will be luôn là động từ dạng phân từ 2 (V3/ed), tuyệt đối không để nguyên thể.",
        "Phủ định là 'will not be + V3/ed' hoặc viết tắt 'won't be + V3/ed'."
    ]
)

curated["Thể bị động ở thì hiện tại hoàn thành"] = build_card(
    "Thể bị động ở thì Hiện tại hoàn thành (Present Perfect Passive)",
    "Diễn tả hành động đã hoàn thành tính đến thời điểm hiện tại và để lại kết quả.",
    [
        ("Công thức chủ động & bị động", [
            "Chủ động: S + have / has + V3/ed + O",
            "Bị động: S(O) + HAVE / HAS BEEN + V3/ed + (by O)"
        ], "Have been: I, you, we, they, N nhiều / Has been: he, she, it, N ít.")
    ],
    [
        ("Khẳng định", "They have repaired the road.", "The road has been repaired."),
        ("Phủ định", "We haven't received the letter.", "The letter hasn't been received yet."),
        ("Nghi vấn", "Has the project been approved?", "Dự án đã được phê duyệt chưa?")
    ],
    [
        "Chú ý phân biệt HAS BEEN (số ít) và HAVE BEEN (số nhiều) dựa theo chủ ngữ mới.",
        "Vị trí của ALREADY / JUST: đứng giữa have/has và been (The bill has just been paid)."
    ]
)

curated["Thể bị động với các thì tiếp diễn"] = build_card(
    "Thể bị động với các thì Tiếp diễn (Continuous Passive)",
    "Diễn tả hành động đang được thực hiện tại một thời điểm xác định ở hiện tại hoặc quá khứ.",
    [
        ("Hiện tại tiếp diễn bị động", [
            "S + AM / IS / ARE + BEING + V3/ed + (by O)"
        ], "My car is being washed right now."),
        ("Quá khứ tiếp diễn bị động", [
            "S + WAS / WERE + BEING + V3/ed + (by O)"
        ], "The dinner was being prepared when the guests arrived.")
    ],
    [
        ("Hiện tại tiếp diễn", "She is baking a cake.", "A cake is being baked right now."),
        ("Quá khứ tiếp diễn", "They were repairing the roof.", "The roof was being repaired at 3 PM yesterday."),
        ("Phủ định", "The report isn't being reviewed.", "Báo cáo đang không được xem xét.")
    ],
    [
        "Bắt buộc phải có từ 'BEING' giữa to be và V3/ed. Thiếu 'being' câu sẽ chuyển thành bị động thì đơn."
    ]
)

curated["Thể bị động với động từ khuyết thiếu"] = build_card(
    "Thể bị động với Động từ khuyết thiếu (Modal Verbs Passive)",
    "Áp dụng cho các trợ động từ tình thái: can, could, must, should, may, might, have to, ought to.",
    [
        ("Công thức chủ động & bị động", [
            "Chủ động: S + modal verb + V-inf + O",
            "Bị động: S(O) + MODAL VERB + BE + V3/ed + (by O)"
        ], "This homework must be submitted before Friday. / Plastic bags should be banned.")
    ],
    [
        ("Can", "You can solve this puzzle.", "This puzzle can be solved easily."),
        ("Must", "Students must wear uniforms.", "Uniforms must be worn by students."),
        ("Should", "We should protect wild animals.", "Wild animals should be protected.")
    ],
    [
        "Sau động từ khuyết thiếu luôn dùng nguyên mẫu 'BE' (không chia am/is/are).",
        "Với 'have to': Chủ ngữ số ít dùng 'has to be + V3', số nhiều dùng 'have to be + V3'."
    ]
)

curated["Thể bị động với các cấu trúc đặc biệt"] = build_card(
    "Thể bị động với các cấu trúc đặc biệt (Causative & Impersonal Passive)",
    "Bao gồm thể nhờ bảo (have/get something done) và câu bị động khách quan (It is said that...).",
    [
        ("1. Bị động thể nhờ bảo (Causative Form)", [
            "Chủ động: S + have + O(người) + V-inf / S + get + O(người) + to-V",
            "Bị động: S + HAVE / GET + O(vật) + V3/ed"
        ], "I had the mechanic repair my car. ➔ I had my car repaired."),
        ("2. Bị động khách quan / Mệnh đề tường thuật (Impersonal Passive)", [
            "Cách 1: It + be + V3/ed (said/believed/thought/reported) + that + S2 + V2",
            "Cách 2: S2 + be + V3/ed + to V-inf (nếu cùng thì) / to have V3/ed (nếu trước thì)"
        ], "People say that he is rich. ➔ It is said that he is rich. / He is said to be rich.")
    ],
    [
        ("Have something done", "I cut my hair (tự cắt) vs I had my hair cut (tiệm cắt).", "Thuê/nhờ ai làm việc gì."),
        ("Cùng thì", "People think he knows the truth.", "He is thought to know the truth."),
        ("Trước thì", "People believe she left yesterday.", "She is believed to have left yesterday.")
    ],
    [
        "HAVE + sb + V (nguyên thể không to), nhưng GET + sb + TO V.",
        "Cả hai cấu trúc khi bị động về vật đều là: HAVE/GET + something + V3/ed."
    ]
)

# --- 4. REPORTED SPEECH ---
curated["Chuyển câu tường thuật từ trực tiếp sang gián tiếp: có thay đổi thì"] = build_card(
    "Câu tường thuật: Chuyển từ trực tiếp sang gián tiếp (Lùi thì)",
    "Khi động từ giới thiệu ở quá khứ (said, told, asked), mệnh đề sau phải lùi thì và biến đổi đại từ, thời gian.",
    [
        ("1. Quy tắc lùi thì bắt buộc", [
            "Hiện tại đơn ➔ Quá khứ đơn (V/Vs,es ➔ V-ed/V2)",
            "Hiện tại tiếp diễn ➔ Quá khứ tiếp diễn (am/is/are V-ing ➔ was/were V-ing)",
            "Hiện tại hoàn thành ➔ Quá khứ hoàn thành (have/has V3 ➔ had V3)",
            "Quá khứ đơn ➔ Quá khứ hoàn thành (V-ed ➔ had V3)",
            "Tương lai đơn ➔ Tương lai trong quá khứ (will ➔ would, can ➔ could, may ➔ might)"
        ], "Lưu ý: must ➔ had to."),
        ("2. Biến đổi trạng từ thời gian và nơi chốn", [
            "now ➔ then | today ➔ that day | yesterday ➔ the day before / the previous day",
            "tomorrow ➔ the next day / the following day | this/these ➔ that/those | here ➔ there"
        ], "He said: 'I am leaving now.' ➔ He said that he was leaving then.")
    ],
    [
        ("Câu trực tiếp", "'I bought this computer yesterday,' said Tom.", "Lời nói trực tiếp trong ngoặc kép."),
        ("Câu gián tiếp", "Tom said that he had bought that computer the day before.", "Đã lùi thì, đổi this ➔ that, yesterday ➔ the day before.")
    ],
    [
        "SAID TO + O bắt buộc đổi thành TOLD + O (He said to me ➔ He told me).",
        "KHÔNG lùi thì khi động từ giới thiệu ở hiện tại (says, tells) hoặc diễn tả chân lý, sự thật hiển nhiên."
    ]
)

curated["Chuyển câu tường thuật từ trực tiếp sang gián tiếp: không thay đổi thì"] = build_card(
    "Câu tường thuật: Trường hợp KHÔNG thay đổi thì",
    "Các trường hợp đặc biệt không lùi thì trong câu gián tiếp.",
    [
        ("Các trường hợp giữ nguyên thì của động từ", [
            "1. Động từ giới thiệu ở hiện tại / tương lai: S + say(s) / tell(s) / will say",
            "2. Mệnh đề diễn tả một sự thật hiển nhiên, quy luật tự nhiên hoặc chân lý",
            "3. Mệnh đề chứa câu điều kiện loại 2, loại 3 hoặc mệnh đề wish",
            "4. Động từ khuyết thiếu: would, could, might, should, ought to, had better"
        ], "The teacher said: 'The earth moves around the sun.' ➔ The teacher said that the earth moves around the sun.")
    ],
    [
        ("Chân lý tự nhiên", "'Water boils at 100°C,' the scientist said.", "The scientist said that water boils at 100°C."),
        ("Giới thiệu hiện tại", "He says: 'I like football.'", "He says that he likes football.")
    ],
    [
        "Dù không lùi thì, đại từ nhân xưng (I/you/we) và tính từ sở hữu vẫn phải biến đổi theo người nói và người nghe!"
    ]
)

curated["Chuyển từ câu gián tiếp về câu trực tiếp"] = build_card(
    "Chuyển từ câu gián tiếp trở lại câu trực tiếp",
    "Ngược lại với quy tắc chuyển sang gián tiếp: tiến thì và khôi phục trạng từ nguyên bản.",
    [
        ("Các bước thực hiện", [
            "1. Đổi động từ giới thiệu: told sb ➔ said to sb, said that ➔ said, asked sb ➔ asked",
            "2. Đặt dấu hai chấm và mở ngoặc kép : \"...\"",
            "3. Tiến thì: had V3 ➔ V-ed hoặc have/has V3; was/were ➔ am/is/are; would ➔ will",
            "4. Khôi phục trạng từ: that day ➔ today, then ➔ now, the day before ➔ yesterday"
        ], "He said he had seen Mary the day before. ➔ He said, 'I saw Mary yesterday.'")
    ],
    [
        ("Gián tiếp", "She told me that she was studying for her exam then.", "Câu gián tiếp."),
        ("Trực tiếp", "She said to me, 'I am studying for my exam now.'", "Câu trực tiếp đã khôi phục.")
    ],
    [
        "Đừng quên viết hoa chữ cái đầu tiên trong ngoặc kép và đặt dấu chấm bên trong ngoặc kép!"
    ]
)

curated["Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp"] = build_card(
    "Câu tường thuật: Câu hỏi, Đề nghị và Mệnh lệnh",
    "Quy tắc chuyển đổi các dạng câu hỏi (Yes/No, Wh-questions) và câu mệnh lệnh.",
    [
        ("1. Câu hỏi Yes / No", [
            "S + asked + (O) + IF / WHETHER + S + V(lùi thì)"
        ], "'Do you like music?' ➔ He asked me if I liked music. (Bỏ trợ động từ do/does/did, đưa về trật tự câu khẳng định)."),
        ("2. Câu hỏi Wh- (Có từ để hỏi)", [
            "S + asked + (O) + WH-WORD + S + V(lùi thì)"
        ], "'Where do you live?' ➔ She asked me where I lived."),
        ("3. Câu mệnh lệnh & Đề nghị", [
            "Khẳng định: S + told / asked / ordered + O + TO V-inf",
            "Phủ định: S + told / asked / warned + O + NOT TO V-inf"
        ], "'Please sit down.' ➔ The teacher told us to sit down. / 'Don't touch it!' ➔ He told me not to touch it.")
    ],
    [
        ("Yes/No Question", "'Are you tired?'", "He asked me if I was tired. (KHÔNG đảo ngữ)."),
        ("Wh- Question", "'What are you doing?'", "She asked what I was doing."),
        ("Mệnh lệnh phủ định", "'Don't make noise!'", "The teacher told us not to make noise.")
    ],
    [
        "Tuyệt đối KHÔNG đảo trợ động từ lên trước chủ ngữ trong câu hỏi gián tiếp: 'where I lived' (ĐÚNG) - KHÔNG viết 'where did I live' (SAI).",
        "Câu hỏi gián tiếp kết thúc bằng DẤU CHẤM, không dùng dấu hỏi chấm."
    ]
)

curated["Động từ tường thuật"] = build_card(
    "Các động từ tường thuật đặc biệt (Reporting Verbs)",
    "Thay thế 'said' / 'told' bằng các động từ thể hiện cảm xúc, ý định chính xác.",
    [
        ("1. Verb + to V-inf (agree, offer, promise, refuse, threaten)", [
            "S + promise / threaten / refuse / agree + TO V-inf"
        ], "'I'll help you,' Tom said. ➔ Tom promised to help me."),
        ("2. Verb + O + to V-inf (advise, ask, remind, tell, warn, encourage)", [
            "S + advise / remind / warn / encourage + O + TO V-inf"
        ], "'Remember to lock the door,' Dad said. ➔ Dad reminded me to lock the door."),
        ("3. Verb + V-ing (admit, deny, suggest)", [
            "S + admit / deny / suggest + V-ing"
        ], "'Let's go swimming,' Mai said. ➔ Mai suggested going swimming."),
        ("4. Verb + preposition + V-ing (apologize for, thank for, congratulate on)", [
            "S + apologize to sb FOR V-ing | congratulate sb ON V-ing | accuse sb OF V-ing"
        ], "'Congratulations on winning!' ➔ He congratulated her on winning the contest.")
    ],
    [
        ("Apologize", "'I'm sorry I'm late.'", "He apologized for being late."),
        ("Congratulate", "'Well done!'", "She congratulated me on passing."),
        ("Warn", "'Don't swim here!'", "The lifeguard warned us against swimming there.")
    ],
    [
        "Nhớ giới từ đi kèm động từ: congratulate sb ON, apologize FOR, accuse sb OF, thank sb FOR, prevent sb FROM."
    ]
)

# --- 5. VERB FORMS & PATTERNS ---
curated["... suggest ... /... be suggested that ..."] = build_card(
    "Cấu trúc SUGGEST (Gợi ý, đề xuất) và Thể giả định",
    "Cấu trúc xuất hiện dày đặc trong đề thi vào 10 chuyên và đại trà.",
    [
        ("1. Suggest + V-ing (Đề xuất cùng làm gì)", [
            "S + suggest(s/ed) + V-ing"
        ], "I suggest going to the cinema tonight."),
        ("2. Suggest + that + S + (should) + V-inf (Đề xuất ai đó nên làm gì)", [
            "S1 + suggest(s/ed) + THAT + S2 + (SHOULD) + V-inf (nguyên thể không chia)"
        ], "The doctor suggested that he (should) take a rest. (Dù 'he' nhưng V vẫn nguyên thể!)."),
        ("3. Bị động với suggest (It was suggested that...)", [
            "It is/was suggested that + S + (should) be + V3/ed"
        ], "It was suggested that a new library (should) be built.")
    ],
    [
        ("Suggest + V-ing", "She suggested having dinner out.", "Cô ấy gợi ý ra ngoài ăn tối."),
        ("Suggest that... should V", "My teacher suggested that I study harder.", "Thầy giáo gợi ý tôi nên học chăm hơn."),
        ("Dạng bị động", "It is suggested that trees should be planted.", "Người ta đề xuất rằng nên trồng cây xanh.")
    ],
    [
        "Tuyệt đối KHÔNG DÙNG: 'suggest sb to do sth' (SAI HOÀN TOÀN). Bắt buộc là 'suggest that sb (should) do sth' hoặc 'suggest doing sth'.",
        "Động từ sau 'that + S' luôn ở dạng NGUYÊN THỂ (bare infinitive), kể cả với ngôi he/she/it hoặc thì quá khứ!"
    ]
)

curated["Động từ theo sau bởi V-ing hoặc to-V(inf)"] = build_card(
    "Động từ theo sau bởi V-ing hoặc To-V (Thay đổi & Không đổi nghĩa)",
    "Tổng hợp các động từ đi với Gerund (V-ing) hoặc Infinitive (To-V).",
    [
        ("1. Nhóm thay đổi nghĩa theo ngữ cảnh", [
            "REMEMBER to V: nhớ phải làm gì | remember V-ing: nhớ đã làm gì",
            "FORGET to V: quên phải làm gì | forget V-ing: quên đã làm gì",
            "STOP to V: dừng lại để làm việc khác | stop V-ing: dừng hẳn việc đang làm",
            "TRY to V: cố gắng làm gì | try V-ing: thử làm việc gì",
            "REGRET to V: tiếc khi phải báo tin | regret V-ing: hối hận vì đã làm gì"
        ], "Please remember to turn off the lights. vs I remember turning off the lights."),
        ("2. Nhóm KHÔNG thay đổi nghĩa (begin, start, continue, intend)", [
            "It started to rain. = It started raining."
        ], "Hai cách dùng đều đúng và tương đương ý nghĩa.")
    ],
    [
        ("Stop to V", "He stopped to smoke a cigarette.", "Anh ấy dừng lại để hút thuốc."),
        ("Stop V-ing", "He stopped smoking last year.", "Anh ấy đã bỏ thuốc lá năm ngoái."),
        ("Remember to V", "Remember to lock the door!", "Nhớ khóa cửa nhé! (nhiệm vụ trong tương lai).")
    ],
    [
        "Phân biệt rõ việc ĐÃ LÀM (quá khứ ➔ V-ing) với việc CẦN PHẢI LÀM (bổn phận ➔ to-V)."
    ]
)

curated["Động từ theo sau bởi V-ing"] = build_card(
    "Động từ bắt buộc theo sau bởi V-ing (Gerund)",
    "Các động từ chỉ đi kèm danh động từ trong tiếng Anh.",
    [
        ("Danh sách động từ cốt lõi thi vào 10", [
            "avoid, admit, consider, deny, enjoy, finish, practice, postpone, risk, mind, keep, suggest, imagine, dislike, miss"
        ], "She enjoys reading books in her free time. / Would you mind opening the window?"),
        ("Các cụm từ cố định đi với V-ing", [
            "look forward to + V-ing | can't help / can't stand + V-ing",
            "be/get used to + V-ing | it's no use / it's no good + V-ing",
            "spend time + V-ing | be busy + V-ing"
        ], "I look forward to hearing from you soon.")
    ],
    [
        ("Enjoy + V-ing", "They enjoy playing football.", "Họ thích chơi bóng đá."),
        ("Mind + V-ing", "Do you mind closing the door?", "Bạn có phiền đóng cửa không?"),
        ("Look forward to", "I look forward to meeting you.", "Tôi rất mong được gặp bạn.")
    ],
    [
        "Cảnh giác: 'look forward to' có từ 'to' nhưng 'to' ở đây là GIỚI TỪ, theo sau là V-ING chứ KHÔNG phải V nguyên thể!"
    ]
)

curated["Động từ theo sau bởi động từ nguyên thể"] = build_card(
    "Động từ bắt buộc theo sau bởi To-Infinitive (To-V)",
    "Các động từ đi kèm động từ nguyên mẫu có to.",
    [
        ("Danh sách động từ thi vào 10", [
            "want, decide, hope, expect, promise, agree, refuse, afford, offer, plan, manage, learn, pretend, seem, wish, tend"
        ], "She decided to study abroad. / We agreed to meet at 7 PM."),
        ("Cấu trúc: Verb + Object + To-V", [
            "ask, tell, advise, invite, allow, encourage, warn, remind, persuade + O + TO-V"
        ], "My mother told me to clean my bedroom.")
    ],
    [
        ("Decide to V", "He decided to buy a new computer.", "Anh ấy quyết định mua máy tính mới."),
        ("Allow sb to V", "My parents allow me to go out at weekends.", "Bố mẹ cho phép tôi đi chơi cuối tuần."),
        ("Promise to V", "She promised not to be late again.", "Cô ấy hứa sẽ không muộn nữa.")
    ],
    [
        "Phân biệt: ALLOW + V-ing (He allows smoking here) nhưng ALLOW + O + TO-V (He allows us TO smoke here)."
    ]
)

curated["Verb + V-ing: like/hate/love"] = build_card(
    "Động từ chỉ sở thích: LIKE, LOVE, HATE, PREFER",
    "Cách dùng với V-ing (sở thích lâu dài) và To-V (lựa chọn/thói quen tốt).",
    [
        ("1. Like / Love / Hate + V-ing", [
            "Diễn tả sở thích nói chung, niềm vui khi làm việc đó"
        ], "I like swimming in summer. / She loves listening to music."),
        ("2. Would like / Would love / Would prefer + TO-V", [
            "Bắt buộc dùng TO-V khi có WOULD (diễn tả mong muốn ở hiện tại/tương lai)"
        ], "I would like to drink a cup of tea. (KHÔNG dùng: would like drinking).")
    ],
    [
        ("Like + V-ing", "I like cooking.", "Tôi thích nấu ăn (sở thích chung)."),
        ("Would like + To-V", "I would like to order a pizza.", "Tôi muốn gọi một chiếc pizza (ngay bây giờ).")
    ],
    [
        "Gặp 'WOULD LIKE / WOULD LOVE' ➔ 100% chọn 'TO + V-inf'."
    ]
)

curated["Danh động từ"] = build_card(
    "Danh động từ (Gerund - V-ing)",
    "Cách dùng V-ing như một danh từ làm chủ ngữ, tân ngữ hoặc sau giới từ.",
    [
        ("Các vị trí của Danh động từ", [
            "1. Làm chủ ngữ: V-ing + V(số ít) (Swimming is good for your health)",
            "2. Làm tân ngữ sau động từ: S + V + V-ing (He loves cycling)",
            "3. Đứng sau TẤT CẢ các giới từ: Preposition + V-ing (in, on, at, about, for, without...)",
            "4. Trong cấu trúc cấm đoán: No + V-ing (No parking, No smoking)"
        ], "He passed the exam without studying much.")
    ],
    [
        ("Làm chủ ngữ", "Learning English opens many opportunities.", "Học tiếng Anh mở ra nhiều cơ hội (Động từ chia số ít: opens)."),
        ("Sau giới từ", "She is good at speaking French.", "Cô ấy giỏi nói tiếng Pháp.")
    ],
    [
        "Danh động từ làm chủ ngữ thì động từ chính của câu LUÔN CHIA Ở NGÔI SỐ ÍT (Reading books IS fun)."
    ]
)

curated["Tính từ + to + V-infinitive"] = build_card(
    "Cấu trúc: Tính từ đi với động từ nguyên thể (Adjective + To-V)",
    "Diễn tả cảm xúc hoặc đặc điểm tính chất của hành động.",
    [
        ("1. Cấu trúc chỉ cảm xúc: S + be + Adj + to-V", [
            "happy, glad, pleased, excited, sad, surprised, disappointed + TO-V"
        ], "I am very pleased to meet you. / We were surprised to hear the news."),
        ("2. Cấu trúc chủ ngữ giả: It + be + Adj + (for sb) + to-V", [
            "It is difficult / easy / important / necessary / dangerous + (for sb) + TO-V"
        ], "It is important to protect the environment. / It is easy for him to pass the test.")
    ],
    [
        ("Chỉ cảm xúc", "She was delighted to receive the scholarship.", "Cô ấy rất vui khi nhận được học bổng."),
        ("Chủ ngữ giả", "It is difficult to learn Chinese.", "Học tiếng Trung rất khó.")
    ],
    [
        "Viết lại câu: 'To learn Chinese is difficult' ➔ 'It is difficult to learn Chinese' ➔ 'Learning Chinese is difficult'."
    ]
)

# --- 6. USED TO & PREFERENCES ---
curated["Used to, would, get/be used to"] = build_card(
    "Phân biệt USED TO, BE USED TO, GET USED TO và WOULD",
    "Trọng điểm ngữ pháp kinh điển phân biệt thói quen trong quá khứ và sự quen thuộc.",
    [
        ("1. USED TO + V-inf (Thói quen trong quá khứ nay không còn)", [
            "Khẳng định: S + used to + V-inf",
            "Phủ định: S + didn't use to + V-inf",
            "Nghi vấn: Did + S + use to + V-inf?"
        ], "I used to ride a bike to school when I was young. (Bây giờ không còn đạp xe nữa)."),
        ("2. BE USED TO + V-ing / Noun (Đã quen với việc gì ở hiện tại)", [
            "S + am/is/are + used to + V-ing / Noun"
        ], "He is used to getting up early in the morning."),
        ("3. GET USED TO + V-ing / Noun (Dần dần trở nên quen với việc gì)", [
            "S + get / become + used to + V-ing / Noun"
        ], "She is getting used to the cold weather in London."),
        ("4. WOULD + V-inf (Thói quen hành động lặp lại trong quá khứ)", [
            "Chỉ dùng cho hành động, KHÔNG dùng cho động từ chỉ trạng thái (like, have, know, live)"
        ], "When we were children, we would play hide-and-seek every afternoon.")
    ],
    [
        ("Used to V", "He used to smoke a pack a day.", "Quá khứ từng hút, nay đã bỏ."),
        ("Be used to V-ing", "He is used to living alone.", "Hiện tại đã quen với cuộc sống một mình."),
        ("Get used to V-ing", "I can't get used to this noise.", "Tôi chưa thể quen được với tiếng ồn này.")
    ],
    [
        "Không có to be phía trước: USED TO + V-inf.",
        "Có TO BE (am/is/are/was/were) hoặc GET phía trước: USED TO + V-ING.",
        "Ở thể phủ định và nghi vấn của used to: 'didn't use to' (bỏ chữ d ở used)."
    ]
)

curated["Used to"] = curated["Used to, would, get/be used to"]

curated['Cấu trúc "hơn": prefer, would prefer, would rather/would sooner'] = build_card(
    'Cấu trúc diễn đạt sự thích hơn: PREFER, WOULD PREFER, WOULD RATHER',
    "Tổng hợp các công thức so sánh sự ưa thích trong đề thi.",
    [
        ("1. PREFER (Thích cái gì hơn cái gì - sở thích chung)", [
            "Prefer + Noun / V-ing + TO + Noun / V-ing",
            "Prefer + to V + RATHER THAN + (to) V"
        ], "I prefer tea TO coffee. / She prefers reading TO watching TV."),
        ("2. WOULD PREFER (Thích làm gì hơn trong tình huống cụ thể)", [
            "Would prefer + to V + RATHER THAN + V-inf"
        ], "I would prefer to stay at home tonight rather than go out."),
        ("3. WOULD RATHER (Thích làm gì hơn)", [
            "Would rather + V-inf + THAN + V-inf",
            "Phủ định: Would rather NOT + V-inf"
        ], "I would rather walk than take a taxi. / I would rather not discuss this.")
    ],
    [
        ("Prefer... to...", "He prefers cats to dogs.", "Thích mèo hơn chó (đi với giới từ TO)."),
        ("Would rather... than...", "She would rather cook than eat out.", "Thích nấu ăn hơn ăn ngoài (đi với THAN)."),
        ("Would rather sb did", "I would rather you didn't smoke here.", "Tôi muốn bạn đừng hút thuốc ở đây (giả định).")
    ],
    [
        "PREFER đi với giới từ TO (không dùng than): prefer doing sth TO doing sth.",
        "WOULD RATHER đi với THAN: would rather do sth THAN do sth.",
        "Sau would rather là động từ NGUYÊN MẪU KHÔNG TO (bare infinitive)."
    ]
)

curated["Would like"] = build_card(
    "Cấu trúc WOULD LIKE (Muốn làm gì / Lời mời lịch sự)",
    "Dùng để đưa ra lời yêu cầu hoặc lời mời lịch sự, trang trọng.",
    [
        ("1. Diễn đạt mong muốn", [
            "S + would like + to V-inf / S + would like + Noun"
        ], "I would like to book a table for two. / Would you like some coffee?"),
        ("2. Lời mời và cách đáp lại", [
            "Lời mời: Would you like to + V-inf?",
            "Đồng ý: Yes, I'd love to. / Yes, please.",
            "Từ chối lịch sự: I'd love to, but I'm busy. / No, thanks."
        ], "'Would you like to come to my party?' - 'I'd love to, thanks!'")
    ],
    [
        ("Lời mời", "Would you like some orange juice?", "Bạn có muốn dùng chút nước cam không?"),
        ("Đáp lại đồng ý", "Yes, please. That would be great.", "Vâng, làm ơn."),
        ("Đáp lại từ chối", "I'm sorry, I have plans already.", "Xin lỗi, tôi có kế hoạch rồi.")
    ],
    [
        "Trong câu hỏi mời với 'Would you like...?', dùng SOME chứ KHÔNG dùng ANY: 'Would you like SOME tea?' (ĐÚNG)."
    ]
)

# --- 7. TENSES & ASPECTS ---
curated["Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng"] = build_card(
    "Thì Hiện tại hoàn thành (Present Perfect Tense)",
    "Diễn tả hành động xảy ra trong quá khứ kéo dài đến hiện tại hoặc vừa mới xảy ra để lại kết quả.",
    [
        ("Công thức chuẩn", [
            "Khẳng định: S + have / has + V3/ed",
            "Phủ định: S + haven't / hasn't + V3/ed",
            "Nghi vấn: Have / Has + S + V3/ed?"
        ], "Have: I, you, we, they, N nhiều / Has: he, she, it, N ít."),
        ("Dấu hiệu nhận biết trọng tâm", [
            "since (+ mốc thời gian), for (+ khoảng thời gian)",
            "already, just, yet, ever, never, recently, so far, up to now",
            "This is the first time + S + have/has V3/ed"
        ], "I have lived here for 10 years. / She has just arrived.")
    ],
    [
        ("Since + mốc", "He has worked here since 2018.", "Làm việc từ năm 2018 đến nay."),
        ("For + khoảng", "He has worked here for 6 years.", "Làm việc được 6 năm."),
        ("Viết lại câu", "I last saw him 2 years ago. ➔ I haven't seen him for 2 years.", "Mẫu viết lại kinh điển.")
    ],
    [
        "Công thức viết lại câu kinh điển vào 10: 'S + last + V-ed + time + ago' = 'S + have/has not + V3/ed + for + time'.",
        "'The last time S + V-ed was...' = 'S + have/has not + V3/ed since...'."
    ]
)

curated['Thì Hiện tại Hoàn thành với "since, for"'] = curated["Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng"]
curated['Thì Hiện tại Hoàn thành với "yet, just, already"'] = curated["Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng"]
curated['Thì Hiện tại Hoàn thành với "ever, never"'] = curated["Thì Hiện tại Hoàn thành: Cấu tạo và cách dùng"]

curated["Thì Hiện tại đơn hay Thì Hiện tại tiếp diễn"] = build_card(
    "Phân biệt Thì Hiện tại đơn và Hiện tại tiếp diễn",
    "Hai thì nền tảng cơ bản nhất trong chương trình THCS.",
    [
        ("1. Hiện tại đơn (Present Simple)", [
            "S + V(s/es) | S + don't/doesn't + V-inf",
            "Dùng cho: Chân lý, sự thật hiển nhiên, thói quen lặp đi lặp lại, thời khóa biểu cố định",
            "Dấu hiệu: always, usually, often, sometimes, never, every day/week/year"
        ], "The sun rises in the east. / She goes to school by bus every day."),
        ("2. Hiện tại tiếp diễn (Present Continuous)", [
            "S + am/is/are + V-ing",
            "Dùng cho: Hành động đang diễn ra tại thời điểm nói, kế hoạch chắc chắn trong tương lai",
            "Dấu hiệu: now, at the moment, currently, Look!, Listen!, Be quiet!"
        ], "Look! The bus is coming. / She is reading a book right now.")
    ],
    [
        ("Thói quen", "He plays tennis every Sunday.", "Hiện tại đơn: thói quen định kỳ."),
        ("Đang diễn ra", "He is playing tennis right now.", "Hiện tại tiếp diễn: ngay lúc này."),
        ("Động từ chỉ trạng thái", "I know the answer. (KHÔNG dùng: I am knowing).", "Động từ tri giác không chia tiếp diễn.")
    ],
    [
        "Động từ chỉ tri giác, cảm xúc KHÔNG chia tiếp diễn: know, understand, believe, love, hate, want, need, hear, smell, seem."
    ]
)

curated["Thì Quá khứ tiếp diễn"] = build_card(
    "Thì Quá khứ tiếp diễn (Past Continuous Tense)",
    "Diễn tả hành động đang xảy ra tại một thời điểm xác định trong quá khứ hoặc hai hành động đồng thời.",
    [
        ("Công thức chuẩn", [
            "S + was / were + V-ing",
            "Was: I, he, she, it, N số ít | Were: you, we, they, N số nhiều"
        ], "At 8 PM yesterday, I was doing my homework."),
        ("Kết hợp với WHEN và WHILE", [
            "Hành động đang xảy ra (QKTD) thì hành động khác xen vào (QKĐ): When + QKĐ, QKTD",
            "Hai hành động xảy ra song song đồng thời trong quá khứ: While + QKTD, QKTD"
        ], "While I was studying, my mother was cooking dinner. / I was walking home when it started to rain.")
    ],
    [
        ("Xen vào", "The phone rang while I was taking a shower.", "Đang tắm (tiếp diễn) thì điện thoại reo (xen vào)."),
        ("Song song", "While Tom was reading, Mary was playing the piano.", "Hai hành động diễn ra song song."),
        ("Thời điểm xác định", "What were you doing at 9 PM last night?", "Hành động tại giờ giấc cụ thể trong quá khứ.")
    ],
    [
        "Quy tắc ghi nhớ nhanh: Sau WHEN thường là Quá khứ đơn; sau WHILE thường là Quá khứ tiếp diễn."
    ]
)

curated["Thì Tương lai đơn"] = build_card(
    "Thì Tương lai đơn (Future Simple Tense: WILL)",
    "Diễn tả quyết định tức thì tại thời điểm nói, lời hứa, lời đe dọa hoặc dự đoán không có căn cứ.",
    [
        ("Công thức chuẩn", [
            "Khẳng định: S + will + V-inf",
            "Phủ định: S + will not (won't) + V-inf",
            "Nghi vấn: Will + S + V-inf?"
        ], "I will help you with your homework. / I promise I won't tell anyone."),
        ("Dấu hiệu nhận biết", [
            "tomorrow, next week/month/year, in the future, in 2 days",
            "I think, I believe, I promise, probably, perhaps"
        ], "I think it will rain tomorrow.")
    ],
    [
        ("Quyết định tức thì", "The phone is ringing. - I will answer it.", "Quyết định ngay khi nghe chuông điện thoại."),
        ("Lời hứa", "I will return your money next Monday.", "Lời hứa."),
        ("Dự đoán", "People will travel to Mars in the future.", "Dự đoán cảm tính.")
    ],
    [
        "Phân biệt với BE GOING TO: 'Will' là quyết định bất chợt; 'Be going to' là kế hoạch định sẵn từ trước hoặc có bằng chứng cụ thể."
    ]
)

curated["Dùng Be going to để nói về tương lai"] = build_card(
    "Tương lai gần: BE GOING TO",
    "Diễn tả kế hoạch, dự định đã được chuẩn bị từ trước hoặc dự đoán có bằng chứng rõ ràng ở hiện tại.",
    [
        ("Công thức chuẩn", [
            "S + am / is / are + GOING TO + V-inf",
            "Phủ định: S + am/is/are + not going to + V-inf"
        ], "Look at those dark clouds! It is going to rain. (Bằng chứng: mây đen dày đặc).")
    ],
    [
        ("Kế hoạch trước", "I have bought a ticket. I am going to fly to Paris.", "Đã mua vé từ trước."),
        ("Có bằng chứng", "Be careful! That ladder is going to fall.", "Nhìn thang rung lắc ➔ sắp đổ."),
        ("So với will", "Will: I will visit my grandma. vs Be going to: I have planned it.", "Sự khác biệt về tính chuẩn bị.")
    ],
    [
        "Gặp câu có dấu hiệu quan sát thực tế ('Look at...', 'Be careful!') ➔ CHẮC CHẮN dùng BE GOING TO."
    ]
)

curated["Thì Hiện tại tiếp diễn biểu đạt kế hoạch tương lai"] = build_card(
    "Hiện tại tiếp diễn chỉ kế hoạch tương lai (Arrangements)",
    "Diễn tả một cuộc hẹn, kế hoạch chắc chắn trong tương lai đã ấn định thời gian, địa điểm cụ thể.",
    [
        ("Công thức & Cách dùng", [
            "S + am / is / are + V-ing + time in future",
            "Thường đi kèm thời gian và địa điểm xác định cụ thể"
        ], "I am meeting the doctor at 10 AM tomorrow. / We are flying to Da Nang next Monday.")
    ],
    [
        ("Kế hoạch đã hẹn", "She is getting married next month.", "Đã định ngày cưới cụ thể."),
        ("Lịch trình cá nhân", "What are you doing tonight?", "Tối nay bạn đã có hẹn làm gì chưa?")
    ],
    [
        "Hiện tại tiếp diễn thể hiện mức độ cam kết cao hơn 'be going to' vì đã có sự chuẩn bị về mặt thời gian/đối tác."
    ]
)

# --- 8. COMPARISONS ---
curated["So sánh bằng/không bằng: as ... as, not as/so ... as"] = build_card(
    "So sánh bằng và không bằng (Comparative of Equality)",
    "So sánh hai đối tượng có tính chất tương đương hoặc khác biệt.",
    [
        ("1. So sánh bằng (Khẳng định)", [
            "S1 + be/V + AS + Adj/Adv + AS + S2 + (trợ V / đại từ tân ngữ)"
        ], "He is as tall as his father. / She runs as fast as her brother."),
        ("2. So sánh không bằng (Phủ định)", [
            "S1 + be/V + NOT AS (hoặc NOT SO) + Adj/Adv + AS + S2"
        ], "This film is not as interesting as the book. / My room is not so big as yours.")
    ],
    [
        ("So sánh bằng", "Nam is as intelligent as Lan.", "Nam thông minh bằng Lan."),
        ("So sánh không bằng", "A bike is not as fast as a car.", "Xe đạp không nhanh bằng ô tô."),
        ("Viết lại câu", "A car is faster than a bike. ➔ A bike is not as fast as a car.", "Mẫu viết lại quen thuộc.")
    ],
    [
        "Trong câu phủ định có thể dùng 'not as... as' hoặc 'not so... as'; câu khẳng định CHỈ ĐƯỢC DÙNG 'as... as'.",
        "Giữa 2 chữ 'as... as' là TÍNH TỪ / TRẠNG TỪ NGUYÊN BẢN (không thêm -er, không thêm more)."
    ]
)

curated["So sánh hơn kém của tính từ"] = build_card(
    "So sánh hơn của tính từ (Comparative Adjectives)",
    "Dùng để so sánh tính chất giữa 2 người, 2 vật hoặc 2 sự việc.",
    [
        ("1. Tính từ ngắn (1 âm tiết, hoặc 2 âm tiết tận cùng -y, -le, -ow, -er)", [
            "S1 + be + Adj-ER + THAN + S2"
        ], "tall ➔ taller, short ➔ shorter, happy ➔ happier, simple ➔ simpler."),
        ("2. Tính từ dài (Từ 2 âm tiết trở lên)", [
            "S1 + be + MORE + Adj + THAN + S2 (hoặc LESS + Adj + THAN: kém hơn)"
        ], "more beautiful, more difficult, more expensive."),
        ("3. Các trường hợp bất quy tắc bắt buộc thuộc", [
            "good ➔ better | bad ➔ worse | far ➔ farther/further | little ➔ less | much/many ➔ more"
        ], "My English is better than his.")
    ],
    [
        ("Tính từ ngắn", "Mount Everest is higher than Mont Blanc.", "Everest cao hơn Mont Blanc."),
        ("Tính từ dài", "Health is more important than wealth.", "Sức khỏe quan trọng hơn tiền bạc."),
        ("Bất quy tắc", "Today the weather is worse than yesterday.", "Hôm nay thời tiết tệ hơn hôm qua.")
    ],
    [
        "Tính từ 2 âm tiết kết thúc bằng 'y' đổi 'y' thành 'i' rồi thêm 'er': happy ➔ happier, busy ➔ busier.",
        "Quy tắc gấp đôi phụ âm: kết thúc bằng 1 phụ âm đứng sau 1 nguyên âm ➔ gấp đôi phụ âm: big ➔ bigger, hot ➔ hotter."
    ]
)

curated["So sánh nhất của tính từ"] = build_card(
    "So sánh nhất của tính từ (Superlative Adjectives)",
    "Dùng để so sánh từ 3 người, 3 vật trở lên.",
    [
        ("1. Tính từ ngắn", [
            "S + be + THE + Adj-EST + (in / of...)"
        ], "tall ➔ the tallest, fast ➔ the fastest, happy ➔ the happiest."),
        ("2. Tính từ dài", [
            "S + be + THE MOST + Adj + (in / of...)"
        ], "the most beautiful, the most expensive, the most intelligent."),
        ("3. Các trường hợp bất quy tắc", [
            "good ➔ the best | bad ➔ the worst | far ➔ the farthest/furthest | little ➔ the least | many/much ➔ the most"
        ], "She is the best student in our class.")
    ],
    [
        ("Ngắn", "Russia is the largest country in the world.", "Nga là quốc gia lớn nhất thế giới."),
        ("Dài", "This is the most difficult exercise in the test.", "Đây là bài tập khó nhất trong đề thi."),
        ("Bất quy tắc", "Yesterday was the worst day of my life.", "Hôm qua là ngày tồi tệ nhất đời tôi.")
    ],
    [
        "Bắt buộc phải có mạo từ 'THE' trước tính từ so sánh nhất.",
        "Dùng 'IN' với không gian/nơi chốn/tập hợp số ít (in the world, in the class); dùng 'OF' với mốc thời gian hoặc tập hợp số nhiều (of all, of the three)."
    ]
)

curated["So sánh hơn kém của trạng từ"] = build_card(
    "So sánh hơn của trạng từ (Comparative Adverbs)",
    "Dùng để so sánh cách thức thực hiện hành động giữa hai chủ thể.",
    [
        ("1. Trạng từ ngắn (early, fast, hard, late, soon)", [
            "S1 + V + Adv-ER + THAN + S2"
        ], "He works harder than his colleagues. / She arrived earlier than me."),
        ("2. Trạng từ dài (Tận cùng đuôi -ly: quickly, carefully, fluently...)", [
            "S1 + V + MORE + Adv + THAN + S2"
        ], "She speaks English more fluently than her sister."),
        ("3. Bất quy tắc", [
            "well ➔ better | badly ➔ worse | far ➔ farther/further"
        ], "He sings much better than I do.")
    ],
    [
        ("Trạng từ ngắn", "He runs faster than anyone else.", "Anh ấy chạy nhanh hơn bất kỳ ai."),
        ("Trạng từ đuôi -ly", "Please drive more carefully in the rain.", "Xin hãy lái xe cẩn thận hơn trong trời mưa."),
        ("Bất quy tắc", "She did worse in the final exam than in the midterm.", "Cô ấy làm bài tệ hơn.")
    ],
    [
        "Không thêm đuôi -ly vào các trạng từ đã có sẵn dạng tính từ: fast, hard, late, early (KHÔNG có fastly!)."
    ]
)

curated["So sánh nhất của trạng từ"] = build_card(
    "So sánh nhất của trạng từ (Superlative Adverbs)",
    "So sánh cách thức hành động giữa 3 chủ thể trở lên.",
    [
        ("1. Trạng từ ngắn", [
            "S + V + (THE) + Adv-EST"
        ], "fast ➔ the fastest, hard ➔ the hardest."),
        ("2. Trạng từ dài (đuôi -ly)", [
            "S + V + (THE) MOST + Adv"
        ], "fluently ➔ the most fluently, carefully ➔ the most carefully."),
        ("3. Bất quy tắc", [
            "well ➔ the best | badly ➔ the worst"
        ], "Out of all candidates, she performed the best.")
    ],
    [
        ("Ví dụ ngắn", "He ran the fastest in the race.", "Anh ấy chạy nhanh nhất trong cuộc đua."),
        ("Ví dụ dài", "She explained the problem the most clearly.", "Cô ấy giải thích vấn đề rõ ràng nhất.")
    ],
    [
        "Với trạng từ so sánh nhất, mạo từ 'the' có thể lược bỏ trong văn phong thân mật nhưng đề thi viết câu nên giữ lại 'the'."
    ]
)

curated["So sánh kép"] = build_card(
    "So sánh kép (Double Comparatives: Càng... càng...)",
    "Cấu trúc nâng cao phân loại học sinh giỏi trong đề thi vào 10.",
    [
        ("1. Càng... càng... (Hai mệnh đề đồng biến)", [
            "THE + Comparative 1 + S1 + V1, THE + Comparative 2 + S2 + V2"
        ], "The harder you study, the higher marks you will get. / The more we know, the less we understand."),
        ("2. Càng ngày càng... (Một mệnh đề tăng tiến)", [
            "Tính từ ngắn: Adj-er and Adj-er (colder and colder, hotter and hotter)",
            "Tính từ dài: More and more + Adj (more and more beautiful, more and more expensive)"
        ], "It is getting darker and darker. / Petrol is becoming more and more expensive.")
    ],
    [
        ("The more... the more...", "The older he gets, the wiser he becomes.", "Càng lớn tuổi ông ấy càng thông thái."),
        ("The more... the less...", "The faster you drive, the less safe you are.", "Càng lái nhanh càng kém an toàn."),
        ("Tăng tiến", "Life is getting better and better.", "Cuộc sống ngày càng tốt hơn.")
    ],
    [
        "Cả hai vế của cấu trúc bắt buộc phải có từ 'THE' đứng trước cấp so sánh hơn: THE + adj-er / THE MORE + S + V."
    ]
)

curated["So sánh giống và khác nhau"] = build_card(
    "So sánh giống và khác nhau: THE SAME AS, DIFFERENT FROM",
    "Các từ và cụm từ diễn đạt sự tương đồng hoặc khác biệt.",
    [
        ("1. Giống nhau: THE SAME (AS)", [
            "S1 + be + THE SAME AS + S2 (Giống hệt)",
            "S1 + be + the same + Noun + as + S2"
        ], "My bag is the same as yours. / She is the same age as my sister."),
        ("2. Khác biệt: DIFFERENT FROM", [
            "S1 + be + DIFFERENT FROM + S2 (Khác với)"
        ], "Life in the countryside is different from life in the city.")
    ],
    [
        ("The same as", "His opinion is the same as mine.", "Ý kiến của anh ấy giống tôi."),
        ("The same + N + as", "Tom is the same height as Jack.", "Tom cao bằng Jack."),
        ("Different from", "This house is completely different from the old one.", "Ngôi nhà này hoàn toàn khác ngôi nhà cũ.")
    ],
    [
        "Giới từ chuẩn của DIFFERENT là FROM: 'different FROM' (không dùng 'different with').",
        "Trước SAME bắt buộc phải có mạo từ THE: 'the same as'."
    ]
)

# --- 9. MODAL VERBS ---
curated["Động từ khuyết thiếu diễn đạt sự bắt buộc và cấm đoán: Must/Must not"] = build_card(
    "Động từ khuyết thiếu: MUST và MUST NOT (Bắt buộc & Cấm đoán)",
    "Trọng tâm phân biệt nghĩa vụ và biển báo cấm trong đề thi.",
    [
        ("1. MUST + V-inf (Bắt buộc phải làm - luật lệ hoặc cảm xúc người nói)", [
            "S + MUST + V-inf"
        ], "You must drive on the right in this country. / I must study hard for the exam."),
        ("2. MUST NOT / MUSTN'T + V-inf (CẤM ĐOÁN - Tuyệt đối không được làm)", [
            "S + MUST NOT / MUSTN'T + V-inf = You are not allowed / prohibited to V"
        ], "You mustn't step on the grass. / Students mustn't use phones in the exam room.")
    ],
    [
        ("Bắt buộc", "All drivers must wear seatbelts.", "Mọi tài xế đều phải thắt dây an toàn."),
        ("Cấm đoán", "Visitors must not feed the animals.", "Khách tham quan cấm cho thú ăn."),
        ("Biển báo", "NO PARKING ➔ You mustn't park your car here.", "Biển cấm đỗ xe.")
    ],
    [
        "MUSTN'T mang nghĩa CẤM ĐOÁN, không phải là 'không cần làm'. Nếu muốn nói 'không cần' phải dùng 'don't have to' hoặc 'needn't'."
    ]
)

curated["Động từ khuyết thiếu diễn đạt sự bắt buộc và sự cần thiết: Must và Have to"] = build_card(
    "Phân biệt MUST và HAVE TO (Bắt buộc chủ quan vs Khách quan)",
    "Cách phân biệt tính chất bắt buộc do nội tại hay ngoại cảnh.",
    [
        ("1. MUST (Bắt buộc do người nói quyết định)", [
            "I must wash my hair tonight. / You must be home before 10 PM."
        ], "Mang tính chủ quan từ cảm nghĩ của người nói."),
        ("2. HAVE TO (Bắt buộc do quy định, luật lệ, ngoại cảnh)", [
            "I have to wear a helmet when riding a motorbike. (Luật giao thông bắt buộc)",
            "He has to work on Saturdays. (Quy định của công ty)"
        ], "Mang tính khách quan bên ngoài chi phối."),
        ("3. Phủ định: DON'T HAVE TO (Không cần phải làm gì)", [
            "S + don't / doesn't have to + V-inf = S + needn't + V-inf"
        ], "Tomorrow is Sunday, so I don't have to get up early.")
    ],
    [
        ("Must", "I must finish this book today.", "Tự tôi cảm thấy cần phải đọc xong."),
        ("Have to", "Doctors have to wear white coats.", "Quy định ngành y."),
        ("Don't have to", "You don't have to come if you are tired.", "Bạn không nhất thiết phải đến nếu mệt.")
    ],
    [
        "Phủ định của MUST (mustn't = cấm) KHÁC HOÀN TOÀN phủ định của HAVE TO (don't have to = không bắt buộc, thích thì làm, không thích thì thôi)."
    ]
)

curated["Diễn đạt sự cho phép: động từ khuyết thiếu Can, May, Could và cụm từ Be allowed to"] = build_card(
    "Diễn đạt sự cho phép: CAN, MAY, COULD và BE ALLOWED TO",
    "Hỏi xin phép, cho phép hoặc bị cấm đoán.",
    [
        ("1. Xin phép lịch sự", [
            "Can / Could / May + I + V-inf?"
        ], "May I come in? / Could I borrow your pen? (Could và May lịch sự hơn Can)."),
        ("2. Cho phép và được phép", [
            "S + can / may + V-inf (Có thể / Được phép làm gì)",
            "S + be allowed to + V-inf (Được ai đó cho phép làm gì)"
        ], "You can park your car here. / We are not allowed to talk during the test.")
    ],
    [
        ("Xin phép", "May I go out for a minute?", "Xin phép ra ngoài."),
        ("Được phép", "Students are allowed to use calculators.", "Học sinh được phép dùng máy tính."),
        ("Không được phép", "You aren't allowed to take photos in the museum.", "Không được phép chụp ảnh.")
    ],
    [
        "Trong văn cảnh trang trọng hoặc thi cử, cấu trúc 'be allowed to' thường dùng để viết lại câu với 'let': 'My dad lets me drive' ➔ 'I am allowed to drive by my dad'."
    ]
)

curated["Diễn đạt khả năng: động từ khuyết thiếu Can, Could và cụm từ Be able to"] = build_card(
    "Diễn đạt khả năng: CAN, COULD và BE ABLE TO",
    "Khả năng ở hiện tại, quá khứ và các thì khác.",
    [
        ("1. Khả năng ở hiện tại: CAN", [
            "S + can / can't + V-inf"
        ], "She can speak three languages fluently."),
        ("2. Khả năng chung trong quá khứ: COULD", [
            "S + could / couldn't + V-inf"
        ], "My grandfather could run very fast when he was young."),
        ("3. BE ABLE TO (Xoay xở làm được việc cụ thể hoặc chia ở thì khác)", [
            "Hiện tại: am/is/are able to + V | Quá khứ: was/were able to + V",
            "Tương lai: will be able to + V | Hoàn thành: have/has been able to + V"
        ], "Although the fire was big, everyone was able to escape safely.")
    ],
    [
        ("Can", "I can swim.", "Khả năng ở hiện tại."),
        ("Could", "I could read when I was 4.", "Khả năng chung thời thơ ấu."),
        ("Managed to", "He was able to pass the hard test.", "Vượt qua thử thách cụ thể thành công.")
    ],
    [
        "Hành động cụ thể trong quá khứ đòi hỏi sự nỗ lực (xoay xở để thoát hiểm/vượt qua kỳ thi khó) ➔ Dùng 'WAS/WERE ABLE TO' hoặc 'MANAGED TO', KHÔNG dùng 'could'."
    ]
)

curated["Diễn đạt lời khuyên và đề nghị: Should, Ought to, Had better"] = build_card(
    "Diễn đạt lời khuyên: SHOULD, OUGHT TO, HAD BETTER",
    "Khuyên bảo ai nên hoặc không nên làm điều gì.",
    [
        ("1. SHOULD / OUGHT TO (Nên làm gì)", [
            "S + SHOULD + V-inf = S + OUGHT TO + V-inf",
            "Phủ định: shouldn't + V-inf = ought not to + V-inf"
        ], "You should see a doctor. / You ought not to stay up late."),
        ("2. HAD BETTER (Tốt hơn hết là nên... - có tính cảnh báo hậu quả)", [
            "S + HAD BETTER ('D BETTER) + V-inf",
            "Phủ định: S + HAD BETTER NOT + V-inf"
        ], "You had better take an umbrella, or you will get wet.")
    ],
    [
        ("Should", "You should eat more fruits.", "Lời khuyên thông thường."),
        ("Ought to", "We ought to obey traffic rules.", "Bổn phận đạo đức/luật lệ."),
        ("Had better", "You'd better hurry, the train is leaving.", "Cảnh báo nếu không nhanh sẽ lỡ tàu.")
    ],
    [
        "Sau SHOULD và HAD BETTER là ĐỘNG TỪ NGUYÊN THỂ KHÔNG TO (bare inf): had better go (ĐÚNG) - KHÔNG dùng 'had better to go' (SAI).",
        "Phủ định của had better là 'had better NOT' (không dùng didn't had better)."
    ]
)

curated["Động từ khuyết thiếu diễn đạt khả năng và xác suất: May, Might, Could"] = build_card(
    "Động từ khuyết thiếu phỏng đoán: MAY, MIGHT, COULD",
    "Phỏng đoán sự việc có thể xảy ra ở hiện tại hoặc tương lai (xác suất khoảng 50% hoặc thấp hơn).",
    [
        ("Công thức phỏng đoán", [
            "S + MAY / MIGHT / COULD + V-inf (Có thể sẽ...)",
            "Phủ định: S + may not / might not + V-inf (Có thể sẽ không...)"
        ], "It might rain this afternoon, so take a raincoat. / She may be at home now.")
    ],
    [
        ("May", "We may go to the beach tomorrow.", "Khả năng 50%."),
        ("Might", "He might come to the party, but I doubt it.", "Xác suất thấp hơn may."),
        ("Could", "It could be cold tonight.", "Có khả năng lạnh.")
    ],
    [
        "Could not mang nghĩa là 'không thể nào làm được', trong khi 'may not / might not' mang nghĩa là 'có thể không xảy ra'."
    ]
)

# --- 10. QUESTIONS & COMMUNICATIVE FUNCTIONS ---
curated["Câu hỏi đuôi"] = build_card(
    "Câu hỏi đuôi (Tag Questions)",
    "Dùng để xác nhận thông tin: Vế trước khẳng định ➔ vế sau phủ định; vế trước phủ định ➔ vế sau khẳng định.",
    [
        ("Quy tắc cấu tạo cơ bản", [
            "Mệnh đề KHẲNG ĐỊNH, Trợ động từ PHỦ ĐỊNH (rút gọn) + Đại từ chủ ngữ?",
            "Mệnh đề PHỦ ĐỊNH, Trợ động từ KHẲNG ĐỊNH + Đại từ chủ ngữ?"
        ], "You are a student, AREN'T YOU? / He didn't come, DID HE? / She can swim, CAN'T SHE?")
    ],
    [
        ("Hiện tại đơn to be", "She is tired, isn't she?", "Chủ ngữ she, to be is."),
        ("Hiện tại đơn V thường", "They play football, don't they?", "Mượn trợ động từ do/does."),
        ("Quá khứ đơn", "He bought a car, didn't he?", "Mượn trợ động từ did.")
    ],
    [
        "Phần đuôi phủ định BẮT BUỘC phải viết ở dạng rút gọn: aren't you, doesn't he, didn't they (KHÔNG viết: are not you).",
        "Chủ ngữ ở phần đuôi BẮT BUỘC là ĐẠI TỪ NHÂN XƯNG (I, you, he, she, it, we, they), không được giữ nguyên tên riêng."
    ]
)

curated["Câu hỏi đuôi với một số trường hợp đặc biệt"] = build_card(
    "Câu hỏi đuôi: Các trường hợp đặc biệt (Special Tag Questions)",
    "Các trường hợp ngoại lệ kinh điển cần ghi nhớ chính xác tuyệt đối.",
    [
        ("Các trường hợp đặc biệt hay thi", [
            "1. I am... ➔ AREN'T I? (nhưng: I am not... ➔ AM I?)",
            "2. Let's + V... ➔ SHALL WE?",
            "3. Câu mệnh lệnh khẳng định/phủ định: Open the door / Don't talk ➔ WILL YOU?",
            "4. Từ mang nghĩa phủ định (never, seldom, rarely, hardly, scarcely, neither) ➔ Phần đuôi KHẲNG ĐỊNH",
            "5. Chủ ngữ Someone, Somebody, Anyone, Everyone, No one ➔ Đổi thành THEY",
            "6. Chủ ngữ Something, Anything, Everything, Nothing ➔ Đổi thành IT",
            "7. There is / There are ➔ Phần đuôi dùng THERE (isn't there? / aren't there?)"
        ], "I am late, aren't I? / He never lies, does he? / Nobody phoned, did they?")
    ],
    [
        ("I am", "I am right, aren't I?", "Ngoại lệ đặc biệt nhất."),
        ("Từ bán phủ định", "She rarely speaks English, does she?", "Rarely mang nghĩa phủ định ➔ đuôi khẳng định."),
        ("Everyone/Nobody", "Nobody called me, did they?", "Nobody là phủ định ➔ đuôi did they.")
    ],
    [
        "Khi chủ ngữ là 'Nobody / No one' thì mệnh đề đã mang nghĩa phủ định, nên phần đuôi PHẢI LÀ KHẲNG ĐỊNH và đại từ là 'THEY'."
    ]
)

curated["Đưa ra và đáp lại lời khen/chúc mừng"] = build_card(
    "Giao tiếp: Đưa ra và đáp lại lời khen, lời chúc mừng",
    "Phần kiểm tra chức năng giao tiếp thực tế (Communicative Functions).",
    [
        ("1. Đưa ra lời khen (Compliments)", [
            "You look great today! | What a lovely dress! | That's a nice shirt! | Well done! / Congratulations!"
        ], "Diễn đạt sự tán thưởng chân thành."),
        ("2. Đáp lại lời khen", [
            "Thank you. That's very kind of you. | Thanks! I'm glad you like it. | It's nice of you to say so."
        ], "Thể hiện sự khiêm tốn và biết ơn."),
        ("3. Lời chúc mừng và đáp lại", [
            "Congratulations on passing your exam! ➔ Thank you very much! | Thanks a lot!"
        ], "Lời chúc mừng thành tích.")
    ],
    [
        ("Lời khen", "- 'What a beautiful painting!'", "- 'Thank you. It took me a week to finish.'"),
        ("Khen quần áo", "- 'You look fantastic in that suit!'", "- 'Thanks, my mom bought it for me.'"),
        ("Chúc mừng", "- 'Congratulations on your victory!'", "- 'Thanks, we trained very hard.'")
    ],
    [
        "Khi người bản xứ khen, KHÔNG BAO GIỜ đáp lại bằng cách phủ nhận như: 'No, it's not good' (SAI). Bắt buộc phải nói cảm ơn: 'Thank you. That's very kind of you'."
    ]
)

curated["Bày tỏ lời cảm ơn và xin lỗi"] = build_card(
    "Giao tiếp: Bày tỏ lời cảm ơn và xin lỗi (Thanks & Apologies)",
    "Các mẫu câu đáp lại lịch sự trong giao tiếp hàng ngày.",
    [
        ("1. Cảm ơn và đáp lại", [
            "Cảm ơn: Thank you so much for your help! / Thanks a lot!",
            "Đáp lại cảm ơn: You're welcome. | Not at all. | Don't mention it. | It's my pleasure. | No problem."
        ], "'Thank you for carrying the bags.' - 'You're welcome.'"),
        ("2. Xin lỗi và đáp lại", [
            "Xin lỗi: I'm terribly sorry for being late. / Excuse me! / Pardon me!",
            "Đáp lại xin lỗi: Never mind. | That's all right. | Don't worry about it. | It doesn't matter."
        ], "'Sorry for keeping you waiting.' - 'That's all right. I've just arrived.'")
    ],
    [
        ("Đáp lại cảm ơn", "'Thanks for the wonderful dinner.' ➔ 'It was my pleasure.'", "Rất hân hạnh."),
        ("Đáp lại xin lỗi", "'I'm sorry I broke your vase.' ➔ 'Don't worry about it.'", "Đừng bận tâm.")
    ],
    [
        "Phân biệt 'You're welcome' (đáp lại CẢM ƠN) với 'That's all right / Never mind' (đáp lại XIN LỖI)."
    ]
)

curated["Đưa ra gợi ý và lời đề nghị"] = build_card(
    "Giao tiếp: Đưa ra và phản hồi lời gợi ý, đề nghị",
    "Các cấu trúc rủ rê, gợi ý hoạt động nhóm.",
    [
        ("1. Các mẫu câu gợi ý", [
            "Let's + V-inf! | Why don't we + V-inf? | How about / What about + V-ing? | Shall we + V-inf?"
        ], "Why don't we go to the beach this weekend? / How about watching a film?"),
        ("2. Đồng ý lời gợi ý", [
            "That's a great idea! | That sounds great / wonderful! | Yes, let's do that! | I'd love to."
        ], "Tán thành hào hứng."),
        ("3. Từ chối lời gợi ý", [
            "I'd love to, but I'm afraid I can't. | I'm sorry, I have other plans. | I'd rather stay at home."
        ], "Từ chối khéo léo và lịch sự.")
    ],
    [
        ("Why don't we", "Why don't we have pizza for lunch?", "That's a good idea!"),
        ("How about", "How about cycling around the lake?", "I'd love to, but my bike is broken.")
    ],
    [
        "Chú ý dạng động từ: 'Let's + V-inf', 'Why don't we + V-inf' nhưng 'How/What about + V-ING'."
    ]
)

curated["Đưa ra lời mời và phản hồi lời mời"] = build_card(
    "Giao tiếp: Đưa ra lời mời và phản hồi lời mời (Invitations)",
    "Mời ai đó tham dự sự kiện hoặc đi ăn uống.",
    [
        ("1. Đưa ra lời mời", [
            "Would you like to come to my birthday party? | Do you want to join us for dinner?"
        ], "Lời mời lịch thiệp."),
        ("2. Chấp nhận lời mời", [
            "Yes, I'd love to, thanks! | That sounds fun! | Sure, count me in!"
        ], "Vui vẻ nhận lời."),
        ("3. Từ chối lời mời", [
            "I'd love to, but I have an appointment. | Thank you, but I'm afraid I can't."
        ], "Cảm ơn và nêu lý do từ chối.")
    ],
    [
        ("Lời mời", "'Would you like to have dinner with us?'", "'I'd love to, thank you!'"),
        ("Từ chối", "'Can you come to the concert?'", "'I wish I could, but I have a test tomorrow.'")
    ],
    [
        "Không bao giờ từ chối cộc lốc bằng 'No, I don't want'. Bắt buộc phải có lời cảm ơn hoặc 'I'd love to, but...'."
    ]
)

curated["Bày tỏ sự đồng tình/không đồng tình"] = build_card(
    "Giao tiếp: Bày tỏ sự đồng tình và không đồng tình (Agreeing & Disagreeing)",
    "Đồng ý hoặc phản đối một quan điểm.",
    [
        ("1. Đồng tình hoàn toàn (Agreement)", [
            "I completely agree with you. | You are absolutely right. | I couldn't agree more. | That's true."
        ], "I couldn't agree more = Tôi hoàn toàn đồng ý (tôi không thể đồng ý hơn được nữa)."),
        ("2. Không đồng tình (Disagreement)", [
            "I don't think so. | I'm afraid I disagree. | That's not entirely true. | I see your point, but..."
        ], "Bày tỏ sự phản biện mềm mỏng.")
    ],
    [
        ("Đồng tình", "'This movie is awesome.' - 'I couldn't agree more.'", "Đồng ý 100%."),
        ("Không đồng tình", "'Math is very easy.' - 'I'm afraid I don't agree with you.'", "Phản đối lịch sự.")
    ],
    [
        "Bẫy kinh điển: 'I couldn't agree more' mang nghĩa ĐỒNG Ý TUYỆT ĐỐI (không phải không đồng ý!)."
    ]
)

curated["Bày tỏ quan điểm cá nhân"] = build_card(
    "Giao tiếp: Bày tỏ quan điểm cá nhân (Expressing Opinions)",
    "Cách mở đầu khi nêu suy nghĩ, quan điểm của mình.",
    [
        ("Các mẫu câu thông dụng", [
            "In my opinion, ... | From my point of view, ... | I think / believe that ... | As far as I know, ..."
        ], "In my opinion, reading books is more rewarding than watching videos.")
    ],
    [
        ("In my opinion", "In my opinion, we should plant more trees in our school.", "Theo ý kiến của tôi..."),
        ("I believe", "I believe that every student can succeed with hard work.", "Tôi tin rằng...")
    ],
    [
        "Sau các cụm từ này là một mệnh đề hoàn chỉnh gồm S + V."
    ]
)

# --- 11. ARTICLES, DETERMINERS & QUANTIFIERS ---
curated["Mạo từ xác định và mạo từ không xác định (a/an/the)"] = build_card(
    "Mạo từ trong tiếng Anh: A, AN và THE",
    "Tổng hợp cách dùng mạo từ không xác định (A/AN) và xác định (THE).",
    [
        ("1. Mạo từ không xác định: A / AN (Một)", [
            "Dùng trước danh từ đếm được số ít, được nhắc đến lần đầu tiên hoặc mang nghĩa nghề nghiệp",
            "AN: đứng trước từ bắt đầu bằng NGUYÊN ÂM về mặt PHÁT ÂM (u, e, o, a, i: an apple, an hour, an uncle)",
            "A: đứng trước từ bắt đầu bằng PHỤ ÂM về mặt phát âm (a book, a university, a uniform)"
        ], "He is an honest man. (chữ h câm) / She is a European girl. (âm /j/ là phụ âm)."),
        ("2. Mạo từ xác định: THE", [
            "Dùng khi danh từ đã được xác định, người nghe và người nói đều biết rõ",
            "Dùng với vật là duy nhất (the sun, the moon, the earth, the sky)",
            "Dùng trước tính từ so sánh nhất và số thứ tự (the best, the first, the second)",
            "Dùng trước nhạc cụ (play the guitar, play the piano)"
        ], "The man who helped me was very kind.")
    ],
    [
        ("A vs AN", "a university (phụ âm /j/) vs an umbrella (nguyên âm /ʌ/)", "Quy tắc dựa trên PHÁT ÂM, không dựa trên chữ viết."),
        ("Nhắc lại", "I bought a book yesterday. The book is very interesting.", "Lần đầu dùng a, lần 2 dùng the."),
        ("Duy nhất", "The sun rises in the east.", "Mặt trời là duy nhất.")
    ],
    [
        "Bẫy phát âm: an hour (h câm), an honest boy; nhưng: a university, a uniform, a one-way street."
    ]
)

curated["Mạo từ xác định và những trường hợp không dùng mạo từ"] = build_card(
    "Những trường hợp KHÔNG DÙNG MẠO TỪ (Zero Article - Ø)",
    "Các danh từ đi liền không có mạo từ theo quy tắc ngữ pháp tiếng Anh.",
    [
        ("Các trường hợp không dùng mạo từ", [
            "1. Trước danh từ số nhiều hoặc danh từ không đếm được nói chung: Dogs are loyal animals. / Water is vital.",
            "2. Trước tên môn thể thao, trò chơi: play football, play chess, play basketball (nhưng nhạc cụ có THE: play the guitar).",
            "3. Trước tên bữa ăn thông thường: have breakfast, have lunch, have dinner.",
            "4. Trước tên ngôn ngữ: English, Vietnamese, French (nhưng: THE English language).",
            "5. Trước tên riêng quốc gia (số ít), thành phố, lục địa, ngọn núi: Vietnam, Hanoi, Asia, Mount Everest (nhưng quần đảo, liên bang có THE: The USA, The Philippines).",
            "6. Trước các danh từ trường học, bệnh viện, nhà tù khi đến đúng mục đích: go to school (để học), go to hospital (chữa bệnh)."
        ], "He goes to school by bus every day. (Đi học, không có mạo từ).")
    ],
    [
        ("Thể thao", "We play basketball after school.", "Không dùng the trước basketball."),
        ("Bữa ăn", "What did you have for breakfast?", "Không dùng the trước breakfast."),
        ("Địa danh", "Paris is the capital of France.", "Không dùng the trước Paris, France.")
    ],
    [
        "Phân biệt: 'go to hospital' (để khám chữa bệnh ➔ bệnh nhân) vs 'go to THE hospital' (đến thăm người bệnh hoặc làm việc)."
    ]
)

curated['"a" hay "an"'] = curated["Mạo từ xác định và mạo từ không xác định (a/an/the)"]
curated["Những cách dùng đặc biệt của mạo từ"] = curated["Mạo từ xác định và những trường hợp không dùng mạo từ"]

curated["a lot of, lots of, many, much, few, a few, little, a little"] = build_card(
    "Từ định lượng: MANY, MUCH, A LOT OF, FEW, A FEW, LITTLE, A LITTLE",
    "Quy tắc lựa chọn từ chỉ số lượng đi với danh từ đếm được và không đếm được.",
    [
        ("1. Nhóm danh từ ĐẾM ĐƯỢC SỐ NHIỀU (plural count nouns)", [
            "MANY: nhiều (thường dùng trong câu phủ định và nghi vấn)",
            "A FEW: một vài, một ít (đủ dùng, mang nghĩa tích cực)",
            "FEW: rất ít, hầu như không có (không đủ, mang nghĩa tiêu cực)"
        ], "I have a few close friends. (Có vài người bạn thân) vs Few people passed the test. (Hầu như không ai đỗ)."),
        ("2. Nhóm danh từ KHÔNG ĐẾM ĐƯỢC (uncountable nouns)", [
            "MUCH: nhiều (thường dùng trong câu phủ định và nghi vấn)",
            "A LITTLE: một ít (đủ dùng, mang nghĩa tích cực)",
            "LITTLE: rất ít, hầu như không có (không đủ dùng, mang nghĩa tiêu cực)"
        ], "I have a little money left, let's buy an ice cream. vs We have little time left, hurry up!"),
        ("3. Dùng cho CẢ HAI nhóm: A LOT OF / LOTS OF", [
            "A lot of books (đếm được) / A lot of water (không đếm được) - dùng trong câu khẳng định"
        ], "She has a lot of homework to do.")
    ],
    [
        ("A few vs Few", "A few = several (đủ dùng) vs Few = almost none (thiếu hụt).", "Few mang hàm ý tiêu cực."),
        ("A little vs Little", "A little = some (đủ dùng) vs Little = almost none (thiếu hụt).", "Little mang hàm ý tiêu cực."),
        ("Many vs Much", "Many questions (đếm được) vs Much information (không đếm được).", "Information là danh từ không đếm được!")
    ],
    [
        "Các danh từ không đếm được hay bị bẫy trong đề thi: advice, news, information, furniture, homework, luggage, money."
    ]
)

curated["many, much, more"] = curated["a lot of, lots of, many, much, few, a few, little, a little"]
curated["How much/how many"] = build_card(
    "Câu hỏi số lượng: HOW MUCH và HOW MANY",
    "Hỏi số lượng và hỏi giá cả trong tiếng Anh.",
    [
        ("1. HOW MANY + Danh từ đếm được số nhiều", [
            "How many + Plural Noun + do/does/did + S + V?"
        ], "How many students are there in your class? / How many books did you buy?"),
        ("2. HOW MUCH + Danh từ không đếm được", [
            "How much + Uncountable Noun + do/does/did + S + V?"
        ], "How much water do you drink every day?"),
        ("3. HOW MUCH hỏi giá tiền", [
            "How much is this shirt? = How much does this shirt cost?"
        ], "Hỏi giá cả của đồ vật.")
    ],
    [
        ("How many", "How many brothers do you have?", "Hỏi số lượng người/vật đếm được."),
        ("How much", "How much sugar do we need?", "Hỏi lượng đường (không đếm được)."),
        ("Hỏi giá", "How much are these shoes?", "Những đôi giày này bao nhiêu tiền?")
    ],
    [
        "Hỏi giá tiền: nếu vật số ít dùng 'How much is it?', vật số nhiều dùng 'How much are they?'."
    ]
)

curated["Từ định lượng some, any..."] = build_card(
    "Từ định lượng: SOME và ANY",
    "Cách dùng một số/bất kỳ với danh từ số nhiều và không đếm được.",
    [
        ("1. SOME (Một vài, một ít)", [
            "Dùng trong câu KHẲNG ĐỊNH: I have some pens. / There is some milk.",
            "Dùng trong câu HỎI mang tính ĐỀ NGHỊ hoặc YÊU CẦU: Would you like some coffee? / Can I have some water?"
        ], "Một lượng không xác định trong ngữ cảnh khẳng định hoặc mời mọc."),
        ("2. ANY (Bất kỳ, chút nào)", [
            "Dùng trong câu PHỦ ĐỊNH: I don't have any money.",
            "Dùng trong câu HỎI nghi vấn thông thường: Do you have any questions?",
            "Dùng trong câu khẳng định với nghĩa 'BẤT CỨ': You can take any book you like."
        ], "Thường đi kèm trợ từ phủ định don't/doesn't/didn't.")
    ],
    [
        ("Khẳng định", "There are some apples in the basket.", "Có vài quả táo trong rổ."),
        ("Phủ định", "There aren't any apples left.", "Không còn quả táo nào cả."),
        ("Lời mời", "Would you like some tea?", "Mời dùng trà (dùng SOME).")
    ],
    [
        "Bẫy câu hỏi: Câu hỏi bình thường dùng ANY, nhưng câu hỏi MỜI (Would you like...?) hoặc XIN (Can I have...?) bắt buộc dùng SOME."
    ]
)

curated["each (of), every, each/ every one (of)"] = build_card(
    "Từ định lượng: EACH và EVERY (Mỗi / Mọi)",
    "Quy tắc chia động từ số ít với each và every.",
    [
        ("1. EACH (Từng người, từng vật - xét riêng rẽ)", [
            "EACH + Danh từ đếm được số ít + Động từ số ít",
            "EACH OF + the / these / them + Danh từ số nhiều + Động từ số ít"
        ], "Each student has a locker. / Each of the boys was given a prize."),
        ("2. EVERY (Mọi người, mọi vật - xét tổng thể)", [
            "EVERY + Danh từ đếm được số ít + Động từ số ít"
        ], "Every citizen has the right to vote. / Every room is air-conditioned.")
    ],
    [
        ("Each", "Each player was awarded a medal.", "Mỗi cầu thủ được trao huy chương riêng."),
        ("Every", "Every day brings new opportunities.", "Mỗi ngày mang lại cơ hội mới."),
        ("Each of", "Each of the books is worth reading.", "Mỗi cuốn trong số các cuốn sách đều đáng đọc.")
    ],
    [
        "Dù là 'Each of the students' (học sinh số nhiều) nhưng động từ theo sau LUÔN CHIA Ở NGÔI SỐ ÍT: 'Each of the students IS present' (ĐÚNG)."
    ]
)

curated["all, every"] = build_card(
    "Phân biệt ALL và EVERY",
    "So sánh cách dùng 'tất cả' (all) và 'mọi' (every).",
    [
        ("1. ALL (Tất cả - đi với danh từ số nhiều hoặc không đếm được)", [
            "All + Plural Noun + V(số nhiều): All students must wear uniforms.",
            "All + Uncountable Noun + V(số ít): All information is confidential."
        ], "Bao quát toàn bộ tập thể."),
        ("2. EVERY (Mỗi/Mọi - đi với danh từ số ít)", [
            "Every + Singular Noun + V(số ít)"
        ], "Every student must wear a uniform.")
    ],
    [
        ("All + N nhiều", "All cars have seatbelts.", "Động từ số nhiều (have)."),
        ("Every + N ít", "Every car has seatbelts.", "Động từ số ít (has)."),
        ("All day", "I waited all day (suốt cả ngày) vs every day (mỗi ngày).", "Khác biệt về thời gian.")
    ],
    [
        "'All day' có nghĩa là suốt cả ngày (từ sáng đến tối); 'every day' có nghĩa là hàng ngày (thói quen lặp lại)."
    ]
)

curated["One, ones, another, other, the other, each other, one another"] = build_card(
    "Đại từ thay thế: ONE, ONES, ANOTHER, OTHER, THE OTHER",
    "Phân biệt nhóm đại từ chỉ người/vật khác nhau rất hay xuất hiện trong bài trắc nghiệm.",
    [
        ("1. ONE và ONES (Thay thế tránh lặp từ)", [
            "ONE thay thế cho danh từ số ít: I don't like this red shirt, I prefer the blue ONE.",
            "ONES thay thế cho danh từ số nhiều: These apples are sour, give me the sweet ONES."
        ], "Tránh lặp lại danh từ đã nhắc phía trước."),
        ("2. ANOTHER (Một cái/người khác - không xác định)", [
            "ANOTHER + Danh từ đếm được số ít (hoặc đứng một mình làm đại từ)"
        ], "Would you like another cup of tea? / This pen is broken, please give me another."),
        ("3. OTHER và OTHERS (Những cái khác)", [
            "OTHER + Danh từ số nhiều / không đếm được: other students, other books",
            "OTHERS (đại từ, không đi kèm N): Some like sports, OTHERS like music."
        ], "Những đối tượng khác nói chung."),
        ("4. THE OTHER và THE OTHERS (Cái/người còn lại - đã xác định)", [
            "THE OTHER: cái còn lại trong 2 cái (I have 2 brothers: one is a doctor, the other is an engineer)",
            "THE OTHERS: những người/cái còn lại trong một nhóm xác định"
        ], "There were 10 people: 3 left early, the others stayed until midnight.")
    ],
    [
        ("Another", "Have another slice of cake!", "Thêm một miếng bánh nữa (số ít)."),
        ("Other + N", "There are other options to consider.", "Các lựa chọn khác."),
        ("The other", "One shoe is here, where is the other?", "Chiếc giày còn lại trong đôi giày.")
    ],
    [
        "Sau OTHERS tuyệt đối không có danh từ (vì others đã là đại từ mang nghĩa 'other ones'). Không viết: 'others students' (SAI)."
    ]
)

# --- 12. NOUNS & PRONOUNS ---
curated["Danh từ số ít và số nhiều"] = build_card(
    "Danh từ số ít và số nhiều (Singular & Plural Nouns)",
    "Quy tắc biến đổi danh từ số ít sang số nhiều và các danh từ bất quy tắc.",
    [
        ("1. Quy tắc thêm đuôi thông thường", [
            "Thông thường: thêm -s (cats, dogs, books)",
            "Tận cùng là s, ss, sh, ch, x, z: thêm -es (buses, classes, dishes, watches, boxes)",
            "Tận cùng là phụ âm + y: đổi y thành -ies (baby ➔ babies, country ➔ countries)",
            "Tận cùng là f, fe: đổi thành -ves (knife ➔ knives, leaf ➔ leaves, wife ➔ wives)"
        ], "Watch out: roof ➔ roofs, cliff ➔ cliffs (giữ nguyên f thêm s)."),
        ("2. Các danh từ biến đổi BẤT QUY TẮC hay gặp nhất", [
            "man ➔ men | woman ➔ women | child ➔ children | person ➔ people",
            "foot ➔ feet | tooth ➔ teeth | mouse ➔ mice | goose ➔ geese",
            "sheep ➔ sheep | fish ➔ fish | deer ➔ deer (giữ nguyên dạng)"
        ], "Children are playing in the playground. (Động từ chia số nhiều!).")
    ],
    [
        ("Bất quy tắc", "One child ➔ Three children", "Trẻ em."),
        ("Giữ nguyên", "One sheep ➔ Five sheep", "Con cừu (không có sheeps)."),
        ("Đuôi -ves", "One knife ➔ Two knives", "Con dao.")
    ],
    [
        "Từ 'PEOPLE' luôn là danh từ số nhiều và chia động từ số nhiều: 'People ARE friendly' (không dùng: People is)."
    ]
)

curated["Danh từ đếm được và không đếm được"] = build_card(
    "Danh từ đếm được và không đếm được (Countable & Uncountable Nouns)",
    "Phân loại danh từ và các bẫy thường gặp trong đề thi.",
    [
        ("1. Danh từ đếm được (Countable Nouns)", [
            "Có thể đếm 1, 2, 3...; có cả dạng số ít và số nhiều (a book, three books)",
            "Số ít bắt buộc có mạo từ a/an/the hoặc từ hạn định đứng trước"
        ], "A car, two apples, ten students."),
        ("2. Danh từ không đếm được (Uncountable Nouns)", [
            "Không đếm bằng số; KHÔNG có dạng số nhiều; KHÔNG dùng với 'a/an'",
            "Động từ đi kèm LUÔN CHIA Ở NGÔI SỐ ÍT",
            "Các từ phổ biến: water, milk, rice, money, traffic, news, information, advice, furniture, luggage, homework"
        ], "The news was shocking. / The advice he gave me was very useful.")
    ],
    [
        ("Advice", "He gave me good advice. (KHÔNG dùng: an advice)", "Lời khuyên là không đếm được."),
        ("Information", "This information is very helpful.", "Thông tin luôn chia số ít."),
        ("Furniture", "All the furniture in the room was old.", "Đồ đạc nội thất luôn chia số ít.")
    ],
    [
        "Muốn đếm danh từ không đếm được phải dùng ĐƠN VỊ ĐO LƯỜNG: a piece of advice (một lời khuyên), a cup of tea (một tách trà), a bottle of water (một chai nước)."
    ]
)

curated["Cách đo đếm danh từ không đếm được"] = build_card(
    "Cụm từ chỉ đơn vị đo đếm cho danh từ không đếm được (Partitives)",
    "Các lượng từ đo lường danh từ vật chất, thức ăn và chất lỏng.",
    [
        ("Các đơn vị thông dụng", [
            "a bottle of (water, milk) | a cup of (tea, coffee) | a glass of (juice, beer)",
            "a piece of (cake, paper, advice, news, information)",
            "a loaf of (bread) | a slice of (bread, cheese, pizza)",
            "a bowl of (soup, rice, noodles) | a bar of (chocolate, soap)",
            "a kilo of (meat, sugar) | a packet of (biscuits, tea)"
        ], "Can I have two slices of pizza and a cup of tea?")
    ],
    [
        ("A piece of advice", "Let me give you a piece of advice.", "Một lời khuyên."),
        ("A loaf of bread", "She bought two loaves of bread.", "Hai ổ bánh mì (loaves số nhiều)."),
        ("A bar of chocolate", "He ate a whole bar of chocolate.", "Một thanh sô-cô-la.")
    ],
    [
        "Khi đổi sang số nhiều, chỉ biến đổi từ chỉ đơn vị, danh từ không đếm được phía sau giữ nguyên: 'two cups of tea' (không viết: two cups of teas)."
    ]
)

curated["Danh từ ghép"] = build_card(
    "Danh từ ghép (Compound Nouns)",
    "Sự kết hợp giữa hai hay nhiều từ để tạo thành một danh từ có ý nghĩa mới.",
    [
        ("Các dạng cấu tạo phổ biến", [
            "Noun + Noun: toothbrush (bàn chải), football (bóng đá), bedroom (phòng ngủ)",
            "Noun + Preposition: mother-in-law (mẹ chồng), passer-by (người qua đường)",
            "Adj + Noun: blackboard (bảng đen), greenhouse (nhà kính)",
            "Verb-ing + Noun: washing machine (máy giặt), swimming pool (bể bơi)"
        ], "Quy tắc số nhiều: thêm -s vào từ CHÍNH: mothers-in-law, passers-by, washing machines.")
    ],
    [
        ("Swimming pool", "There is a large swimming pool nearby.", "Bể bơi."),
        ("Mother-in-law", "His mothers-in-law (số nhiều biến đổi từ chính).", "Mẹ vợ / mẹ chồng."),
        ("Traffic light", "Stop when the traffic lights turn red.", "Đèn giao thông.")
    ],
    [
        "Khi danh từ đóng vai trò như một tính từ bổ nghĩa cho danh từ khác, nó LUÔN Ở DẠNG SỐ ÍT: 'a two-week holiday' (kỳ nghỉ 2 tuần - KHÔNG có s ở week)."
    ]
)

curated["Đại từ làm chủ ngữ và tân ngữ (I, me,...)"] = build_card(
    "Đại từ nhân xưng: Đại từ chủ ngữ và Đại từ tân ngữ",
    "Phân biệt vị trí đứng trước và đứng sau động từ.",
    [
        ("1. Đại từ chủ ngữ (Subject Pronouns: I, you, he, she, it, we, they)", [
            "Đứng trước động từ chính làm chủ ngữ của câu"
        ], "SHE is an English teacher. / THEY play tennis every weekend."),
        ("2. Đại từ tân ngữ (Object Pronouns: me, you, him, her, it, us, them)", [
            "Đứng sau động từ hoặc sau giới từ làm tân ngữ"
        ], "The teacher called HIM. / Please listen to ME. / We invited THEM to dinner.")
    ],
    [
        ("Chủ ngữ", "They helped us yesterday.", "They đứng đầu câu làm chủ ngữ."),
        ("Tân ngữ sau V", "I saw her at the supermarket.", "Her đứng sau saw làm tân ngữ."),
        ("Tân ngữ sau giới từ", "He sat between you and me.", "Me đứng sau giới từ between.")
    ],
    [
        "Sau giới từ (between, with, to, for, about...) bắt buộc dùng đại từ tân ngữ: 'between you and ME' (KHÔNG dùng 'between you and I')."
    ]
)

curated["Tính từ sở hữu (my, your,...)"] = build_card(
    "Tính từ sở hữu: MY, YOUR, HIS, HER, ITS, OUR, THEIR",
    "Đứng trước danh từ để chỉ sự sở hữu của người hoặc vật.",
    [
        ("Bảng tính từ sở hữu tương ứng", [
            "I ➔ MY | You ➔ YOUR | He ➔ HIS | She ➔ HER",
            "It ➔ ITS | We ➔ OUR | They ➔ THEIR",
            "Công thức: TÍNH TỪ SỞ HỮU + DANH TỪ (bắt buộc có danh từ theo sau)"
        ], "This is my bicycle. / Her parents are doctors. / The dog wagged its tail.")
    ],
    [
        ("My bag", "This is my new laptop.", "Laptop của tôi."),
        ("Their school", "Their school is very large.", "Trường của họ."),
        ("Its tail", "The cat is licking its paws.", "Chân của con mèo.")
    ],
    [
        "Phân biệt 'ITS' (tính từ sở hữu: của nó) với 'IT'S' (viết tắt của It is hoặc It has). 'The dog lost its bone' (không dùng it's)."
    ]
)

curated["Đại từ sở hữu (mine, yours,...)"] = build_card(
    "Đại từ sở hữu: MINE, YOURS, HIS, HERS, OURS, THEIRS",
    "Thay thế cho cả cụm 'Tính từ sở hữu + Danh từ' để tránh lặp từ.",
    [
        ("Bảng đại từ sở hữu", [
            "my + N ➔ MINE | your + N ➔ YOURS | his + N ➔ HIS | her + N ➔ HERS",
            "our + N ➔ OURS | their + N ➔ THEIRS",
            "Công thức: ĐẠI TỪ SỞ HỮU đứng độc lập, TUYỆT ĐỐI KHÔNG CÓ DANH TỪ THEO SAU"
        ], "This pen is my pen, that one is YOURS (= your pen). / My house is smaller than THEIRS (= their house).")
    ],
    [
        ("Mine", "This coat is mine.", "Chiếc áo này là của tôi."),
        ("Yours", "Is that car yours?", "Chiếc xe đó có phải của bạn không?"),
        ("Theirs", "Their room is clean, ours is messy.", "Ours = our room.")
    ],
    [
        "Sau đại từ sở hữu KHÔNG ĐƯỢC CÓ DANH TỪ. Không viết: 'This is mine car' (SAI)."
    ]
)

curated["Sở hữu cách 's"] = build_card(
    "Sở hữu cách ('s và of)",
    "Chỉ quyền sở hữu thuộc về người, con vật hoặc tổ chức.",
    [
        ("1. Quy tắc sở hữu cách với 's", [
            "Danh từ số ít: thêm 's (Mary's book, the cat's tail)",
            "Danh từ số nhiều kết thúc bằng -s: chỉ thêm dấu nháy đơn ' (the students' books, the teachers' room)",
            "Danh từ số nhiều bất quy tắc (không tận cùng -s): thêm 's (the children's toys, women's clothes)"
        ], "This is Tom's new bicycle."),
        ("2. Sở hữu với đồ vật: Dùng OF", [
            "Với đồ vật, sự vật vô tri, thường dùng cấu trúc OF: the leg of the table (chân bàn), the roof of the house (mái nhà)"
        ], "Không dùng: table's leg.")
    ],
    [
        ("Số ít", "The boy's dog is running.", "Chó của cậu bé (1 cậu bé)."),
        ("Số nhiều có s", "The boys' dog is running.", "Chó của các cậu bé (nhiều cậu bé)."),
        ("Số nhiều bất quy tắc", "The children's room is upstairs.", "Phòng của lũ trẻ.")
    ],
    [
        "Hai người cùng sở hữu 1 vật: 'Tom and Mary's house' (thêm 's ở người cuối).",
        "Hai người sở hữu 2 vật riêng: 'Tom's and Mary's houses' (thêm 's ở cả hai)."
    ]
)

curated["Các dạng sở hữu khác"] = curated["Sở hữu cách 's"]

curated["Đại từ chỉ định"] = build_card(
    "Đại từ chỉ định: THIS, THAT, THESE, THOSE",
    "Chỉ vị trí gần hoặc xa trong không gian và thời gian.",
    [
        ("Quy tắc phân biệt 4 đại từ", [
            "THIS: số ít, ở gần người nói (This book is good)",
            "THAT: số ít, ở xa người nói (That car over there is expensive)",
            "THESE: số nhiều, ở gần người nói (These apples are sweet)",
            "THOSE: số nhiều, ở xa người nói (Those birds are flying south)"
        ], "This/These chỉ hiện tại, That/Those chỉ quá khứ.")
    ],
    [
        ("This (gần)", "This is my friend Nam.", "Giới thiệu bạn đứng cạnh."),
        ("That (xa)", "Who is that person standing by the door?", "Người đằng xa."),
        ("These/Those", "These books here vs Those books there.", "Số nhiều gần/xa.")
    ],
    [
        "Chia động từ theo sau: This/That đi với động từ số ít (is/was); These/Those đi với động từ số nhiều (are/were)."
    ]
)

curated["Đại từ/Trạng từ bất định (somebody, anything, anywhere...)"] = build_card(
    "Đại từ và Trạng từ bất định (Indefinite Pronouns)",
    "Các từ kết thúc bằng -body, -one, -thing, -where.",
    [
        ("Bảng đại từ bất định", [
            "Người: someone/somebody, anyone/anybody, everyone/everybody, no one/nobody",
            "Vật: something, anything, everything, nothing",
            "Nơi chốn: somewhere, anywhere, everywhere, nowhere"
        ], "Everyone wants to be happy. / Is there anything to eat?"),
        ("Quy tắc chia động từ", [
            "TẤT CẢ các đại từ bất định khi làm chủ ngữ LUÔN CHIA ĐỘNG TỪ SỐ ÍT"
        ], "Nobody knows the answer. / Everything is ready.")
    ],
    [
        ("Động từ số ít", "Everyone is here.", "Mọi người đều ở đây (dùng IS, không dùng are)."),
        ("Tính từ đứng sau", "I want to buy something special.", "Tính từ special đứng SAU something."),
        ("Nothing", "There is nothing wrong.", "Không có gì sai cả.")
    ],
    [
        "Tính từ bổ nghĩa cho đại từ bất định LUÔN ĐỨNG SAU: 'something interesting' (ĐÚNG) - KHÔNG viết 'interesting something' (SAI)."
    ]
)

# --- 13. ADJECTIVES, ADVERBS & CONJUNCTIONS ---
curated["Tính từ tận cùng bằng -ed và -ing"] = build_card(
    "Phân biệt Tính từ đuôi -ED và -ING (Participle Adjectives)",
    "Trọng điểm phân biệt cảm xúc của con người và tính chất của sự vật.",
    [
        ("1. Tính từ đuôi -ED (Chỉ CẢM XÚC, cảm giác của người hoặc con vật)", [
            "S(người) + be / feel + Adj-ED"
        ], "interested, bored, excited, tired, surprised, disappointed..."),
        ("2. Tính từ đuôi -ING (Chỉ BẢN CHẤT, tính chất của người hoặc sự vật)", [
            "S(sự vật/người) + be + Adj-ING"
        ], "interesting, boring, exciting, tiring, surprising, disappointing...")
    ],
    [
        ("Bản chất cuốn sách", "This book is very boring.", "Cuốn sách buồn ngủ (tính chất của sách)."),
        ("Cảm xúc người đọc", "I feel bored when reading this book.", "Tôi cảm thấy chán (cảm xúc của tôi)."),
        ("Người gây ấn tượng", "He is an interesting teacher.", "Thầy giáo thú vị (tính cách của thầy tạo sự hứng thú cho học sinh).")
    ],
    [
        "Người VẪN CÓ THỂ dùng đuôi -ING nếu miêu tả tính cách/bản chất của người đó tạo cảm xúc cho người khác: 'He is a boring person' (Anh ta là kẻ tẻ nhạt, ai gặp cũng thấy chán)."
    ]
)

curated["Trật tự của các tính từ"] = build_card(
    "Trật tự của tính từ trước danh từ: OSASCOMP",
    "Quy tắc sắp xếp nhiều tính từ cùng đứng trước một danh từ.",
    [
        ("Công thức trật tự OSASCOMP", [
            "1. O - Opinion (Ý kiến, đánh giá): beautiful, nice, lovely, ugly, terrible",
            "2. S - Size (Kích cỡ): big, small, tall, short, huge, tiny",
            "3. A - Age (Độ tuổi): old, young, new, ancient",
            "4. S - Shape (Hình dáng): round, square, triangle, oval",
            "5. C - Color (Màu sắc): red, blue, green, black, white",
            "6. O - Origin (Nguồn gốc, xuất xứ): Vietnamese, Japanese, American",
            "7. M - Material (Chất liệu): wooden, leather, plastic, silk, gold",
            "8. P - Purpose (Mục đích sử dụng): sleeping (bag), wedding (dress)"
        ], "A beautiful small old round wooden table.")
    ],
    [
        ("Ví dụ 1", "a lovely small black cat", "Opinion (lovely) ➔ Size (small) ➔ Color (black)."),
        ("Ví dụ 2", "a big round wooden table", "Size (big) ➔ Shape (round) ➔ Material (wooden)."),
        ("Ví dụ 3", "an expensive new Japanese car", "Opinion (expensive) ➔ Age (new) ➔ Origin (Japanese).")
    ],
    [
        "Học thuộc câu thần chú: Ông (Opinion) Sáu (Size) Ăn (Age) Súp (Shape) Cua (Color) Ông (Origin) Mập (Material) Phì (Purpose)."
    ]
)

curated["Tính từ hay trạng từ"] = build_card(
    "Phân biệt TÍNH TỪ và TRẠNG TỪ (Adjectives vs Adverbs)",
    "Vị trí và chức năng ngữ pháp của tính từ và trạng từ trong câu.",
    [
        ("1. TÍNH TỪ (Adjective - Adj)", [
            "Bổ nghĩa cho danh từ: đứng TRƯỚC danh từ (a careful driver)",
            "Đứng SAU động từ to be và các động từ tri giác/nối (look, feel, seem, taste, smell, sound, become): She looks happy. / The soup tastes delicious."
        ], "Bổ nghĩa cho danh từ hoặc chủ ngữ."),
        ("2. TRẠNG TỪ (Adverb - Adv)", [
            "Bổ nghĩa cho động từ thường: đứng SAU động từ hoặc sau tân ngữ (He drives carefully)",
            "Bổ nghĩa cho tính từ: đứng TRƯỚC tính từ (extremely cold, very beautiful)",
            "Bổ nghĩa cho cả câu: đứng ĐẦU câu (Luckily, he passed the exam)"
        ], "Thường cấu tạo bằng: Adj + ly (careful ➔ carefully).")
    ],
    [
        ("Sau động từ nối", "The food smells good.", "Smell là linking verb ➔ dùng tính từ GOOD, không dùng well."),
        ("Sau động từ thường", "She sings well.", "Sing là action verb ➔ dùng trạng từ WELL."),
        ("Trạng từ đặc biệt", "hard, fast, late, early", "Vừa là tính từ vừa là trạng từ (không có hardly với nghĩa chăm chỉ!).")
    ],
    [
        "HARDLY là trạng từ mang nghĩa 'hầu như không', KHÔNG phải là trạng từ của HARD (chăm chỉ/vất vả): 'He works hard' (chăm chỉ) vs 'He hardly works' (lười biếng, hầu như không làm gì)."
    ]
)

curated["Chức năng và vị trí của tính từ"] = curated["Tính từ hay trạng từ"]
curated["Chức năng và vị trí của trạng từ"] = curated["Tính từ hay trạng từ"]

curated["Trạng từ chỉ tần suất"] = build_card(
    "Trạng từ chỉ tần suất (Adverbs of Frequency)",
    "Chỉ mức độ thường xuyên của hành động trong thì hiện tại đơn.",
    [
        ("Các trạng từ theo mức độ giảm dần", [
            "always (100%) ➔ usually (80%) ➔ often (60%) ➔ sometimes (40%) ➔ rarely/seldom (10%) ➔ never (0%)"
        ], "Vị trí trong câu: Đứng TRƯỚC động từ thường, đứng SAU động từ to be và trợ động từ."),
        ("Vị trí chuẩn xác", [
            "S + be + Adv: He is ALWAYS late.",
            "S + Adv + V: She OFTEN visits her grandparents.",
            "S + Trợ V + Adv + V chính: I have NEVER seen that movie."
        ], "Quy tắc: Sau to be, trước động từ thường.")
    ],
    [
        ("Sau to be", "They are always polite.", "Đứng sau ARE."),
        ("Trước V thường", "He never eats seafood.", "Đứng trước EATS."),
        ("Sau trợ từ", "You should always tell the truth.", "Đứng giữa SHOULD và TELL.")
    ],
    [
        "Các từ 'never, rarely, seldom' đã mang nghĩa phủ định, nên động từ trong câu KHÔNG DÙNG NOT (không viết: He doesn't never smoke)."
    ]
)

curated["(Cụm) Trạng từ chỉ mức độ và xác xuất"] = build_card(
    "Trạng từ chỉ mức độ và xác suất (Adverbs of Degree & Probability)",
    "Bổ nghĩa cho mức độ của tính từ, trạng từ hoặc động từ.",
    [
        ("1. Trạng từ chỉ mức độ (Adverbs of Degree)", [
            "very, extremely, completely, totally, absolutely, quite, rather, fairly, slightly",
            "Đứng trước tính từ hoặc trạng từ mà nó bổ nghĩa"
        ], "The water is extremely cold. / I am quite tired."),
        ("2. Trạng từ chỉ xác suất (Probability)", [
            "probably, definitely, certainly, perhaps, maybe",
            "Đứng giữa trợ động từ và động từ chính hoặc đứng đầu câu"
        ], "He will probably pass the exam. / Definitely, we will win.")
    ],
    [
        ("Extremely", "The exam was extremely difficult.", "Cực kỳ khó."),
        ("Probably", "She will probably arrive at 7 PM.", "Có lẽ sẽ đến vào 7 giờ."),
        ("Quite", "The movie was quite interesting.", "Khá thú vị.")
    ],
    [
        "RATHER mang nghĩa tiêu cực hơn QUITE: 'rather cold' (hơi lạnh khó chịu) vs 'quite warm' (khá ấm áp dễ chịu)."
    ]
)

curated["Trạng từ chỉ nơi chốn, cách thức, thời gian"] = build_card(
    "Trật tự trạng từ trong câu: Cách thức - Nơi chốn - Thời gian",
    "Quy tắc sắp xếp khi có nhiều trạng từ cùng xuất hiện ở cuối câu.",
    [
        ("Quy tắc M-P-T (Manner - Place - Time)", [
            "S + V + (O) + MANNER (Cách thức) + PLACE (Nơi chốn) + TIME (Thời gian)",
            "Cách thức (How): well, fast, beautifully, carefully",
            "Nơi chốn (Where): at home, in the park, here, there",
            "Thời gian (When): yesterday, at 8 AM, last year"
        ], "He played the violin beautifully at the concert last night.")
    ],
    [
        ("Ví dụ chuẩn MPT", "She danced gracefully on the stage yesterday.", "Gracefully (M) ➔ on the stage (P) ➔ yesterday (T)."),
        ("Nơi chốn trước thời gian", "We arrived in London at 6 PM.", "In London (P) ➔ at 6 PM (T).")
    ],
    [
        "Thời gian có thể chuyển lên ĐẦU CÂU để nhấn mạnh: 'Yesterday, she danced gracefully on the stage'."
    ]
)

curated["Cụm trạng từ chỉ thời gian, nơi chốn, tần suất"] = curated["Trạng từ chỉ nơi chốn, cách thức, thời gian"]
curated["Cụm giới từ"] = build_card(
    "Cụm giới từ (Prepositional Phrases)",
    "Các cụm từ cố định đi với giới từ hay gặp nhất trong đề thi vào 10.",
    [
        ("Các cụm giới từ chỉ thời gian & nơi chốn", [
            "AT: at 7 o'clock, at night, at the weekend, at home, at school, at the station",
            "ON: on Monday, on July 15th, on the bus, on the table, on foot",
            "IN: in 2026, in May, in summer, in the morning, in Hanoi, in the room, in hospital"
        ], "Quy tắc: In năm, in tháng, in mùa, in sáng chiều tối; On ngày, on thứ; At giờ giấc.")
    ],
    [
        ("On time vs In time", "On time = đúng giờ (lịch trình) vs In time = kịp giờ (vừa kịp lúc).", "Sự khác biệt quan trọng."),
        ("At the end vs In the end", "At the end of the road vs In the end, he succeeded (cuối cùng).", "Khác biệt ý nghĩa.")
    ],
    [
        "Đi bộ là 'ON FOOT' (không dùng: by foot)."
    ]
)

curated["Liên từ kết hợp (and, or, but...)"] = build_card(
    "Liên từ kết hợp: FANBOYS (For, And, Nor, But, Or, Yet, So)",
    "Dùng để nối các từ, cụm từ hoặc mệnh đề độc lập có chức năng ngữ pháp tương đương.",
    [
        ("Ý nghĩa và chức năng của FANBOYS", [
            "AND (và): nối ý bổ sung (I like tea and coffee)",
            "BUT (nhưng): chỉ sự đối lập (He studied hard, but he failed the exam)",
            "OR (hoặc): chỉ sự lựa chọn (Would you like tea or coffee?)",
            "SO (cho nên, vì vậy): chỉ kết quả (It rained heavily, so we stayed home)",
            "YET (tuy nhiên): tương tự but (He is rich, yet he is unhappy)",
            "FOR (bởi vì): chỉ nguyên nhân (I drank water, for I was thirsty)"
        ], "He was tired, so he went to bed early.")
    ],
    [
        ("And", "She is smart and hardworking.", "Nối hai tính từ tích cực."),
        ("But", "The phone is expensive, but it is worth the money.", "Nối hai vế đối lập."),
        ("So", "I lost my key, so I couldn't enter the house.", "Nối nguyên nhân - kết quả.")
    ],
    [
        "Khi nối 2 mệnh đề độc lập, trước liên từ kết hợp thường có DẤU PHẨY: 'S + V, but S + V' / 'S + V, so S + V'."
    ]
)

curated["Trạng từ liên kết (however, therefore, accordingly...)"] = build_card(
    "Trạng từ liên kết: HOWEVER, THEREFORE, MOREOVER, BESIDES",
    "Dùng để liên kết câu hoặc mệnh đề, đứng sau dấu chấm phẩy hoặc đầu câu có dấu phẩy.",
    [
        ("1. HOWEVER / NEVERTHELESS (Tuy nhiên - đối lập)", [
            "S1 + V1. However, S2 + V2 = S1 + V1; however, S2 + V2"
        ], "He ran very fast. However, he didn't win the race."),
        ("2. THEREFORE / AS A RESULT (Do đó, vì vậy - kết quả)", [
            "S1 + V1. Therefore, S2 + V2 = S1 + V1; therefore, S2 + V2"
        ], "He didn't study. Therefore, he failed the exam."),
        ("3. MOREOVER / IN ADDITION (Hơn nữa, ngoài ra - bổ sung)", [
            "S1 + V1. Moreover, S2 + V2"
        ], "He is handsome. Moreover, he is very polite.")
    ],
    [
        ("However", "I love this car. However, it is too expensive.", "Tuy nhiên."),
        ("Therefore", "It rained hard. Therefore, the match was postponed.", "Vì vậy, kết quả là."),
        ("Dấu câu", "; however, hoặc . However,", "Bắt buộc có dấu phẩy sau however/therefore.")
    ],
    [
        "Phân biệt BUT và HOWEVER: 'BUT' là liên từ đứng sau dấu phẩy (S + V, but S + V); 'HOWEVER' là trạng từ liên kết đứng đầu câu có dấu phẩy (However, S + V) hoặc đứng giữa chấm phẩy và phẩy (; however,)."
    ]
)

curated["Những trường hợp cần lưu ý về hòa hợp S-V"] = build_card(
    "Sự hòa hợp giữa Chủ ngữ và Động từ (Subject-Verb Agreement)",
    "Các quy tắc đặc biệt quyết định chia động từ số ít hay số nhiều.",
    [
        ("1. Động từ chia SỐ ÍT", [
            "Chủ ngữ là danh từ không đếm được: Water is essential.",
            "Chủ ngữ là V-ing / To-V: Learning English is fun.",
            "Chủ ngữ là đại từ bất định (everyone, nobody, something, each, every): Everyone knows him.",
            "Khoảng cách, thời gian, tiền bạc: 10 miles is a long way. / 5 million dollars is a large sum."
        ], "Cụm đo lường tính là một thể thống nhất."),
        ("2. Chia theo chủ ngữ đứng GẦN ĐỘNG TỪ NHẤT (Quy tắc gần nhất)", [
            "EITHER... OR... | NEITHER... NOR... | NOT ONLY... BUT ALSO...",
            "Either my brother or my PARENTS ARE going. / Neither they nor HE IS going."
        ], "Động từ chia theo danh từ thứ hai (đứng sát động từ)."),
        ("3. Chia theo CHỦ NGỮ ĐẦU TIÊN (Quy tắc chủ ngữ thứ nhất)", [
            "S1 + WITH / ALONG WITH / AS WELL AS / TOGETHER WITH + S2 + V(chia theo S1)",
            "The teacher, as well as his students, IS excited."
        ], "Chủ ngữ chính là S1.")
    ],
    [
        ("Either... or", "Neither the teacher nor the students were there.", "Chia theo students (số nhiều: were)."),
        ("As well as", "My mother, along with my aunts, is cooking.", "Chia theo my mother (số ít: is)."),
        ("Tiền bạc/Thời gian", "Twenty dollars is too much for this meal.", "Chia số ít: is.")
    ],
    [
        "Cẩn thận: 'The number of + N nhiều + V(số ít)' (Số lượng...) vs 'A number of + N nhiều + V(số nhiều)' (Nhiều...)."
    ]
)

# --- 14. CLAUSES & SENTENCE STRUCTURES ---
curated["Chủ ngữ giả"] = build_card(
    "Chủ ngữ giả: IT và THERE",
    "Dùng 'It' và 'There' làm chủ ngữ hình thức trong câu.",
    [
        ("1. Chủ ngữ giả IT", [
            "Chỉ thời tiết, thời gian, khoảng cách: It is 8 o'clock. / It is rainy today. / It is 5 km to the airport.",
            "Cấu trúc: It takes sb + time + to V (Mất bao nhiêu thời gian để làm gì)",
            "Cấu trúc: It is + Adj + (for sb) + to V: It is difficult to learn a new language."
        ], "It took me two hours to do my homework."),
        ("2. Chủ ngữ giả THERE (Có cái gì)", [
            "There is + Danh từ số ít / không đếm được: There is a book on the desk. / There is milk in the fridge.",
            "There are + Danh từ số nhiều: There are forty students in my class."
        ], "There is/are chia theo danh từ ngay sau nó.")
    ],
    [
        ("It takes time", "It takes 30 minutes to walk to school.", "Viết lại: I spend 30 minutes walking to school."),
        ("There is vs There are", "There is a pen and two rulers on the table.", "Chia theo a pen (danh từ đầu tiên đứng sát).")
    ],
    [
        "Viết lại câu kinh điển: 'It takes sb + time + to V' = 'S + spend(s) + time + V-ing'."
    ]
)

curated['Mệnh đề "That"'] = build_card(
    'Mệnh đề "THAT" (That-Clause)',
    "Mệnh đề danh từ hoặc bổ ngữ bắt đầu bằng liên từ THAT.",
    [
        ("Các cấu trúc thông dụng với THAT", [
            "1. Sau tính từ chỉ cảm xúc: S + be + Adj (glad, happy, sorry, afraid) + THAT + S + V",
            "2. Sau động từ tường thuật: S + say / tell / believe / think / know + THAT + S + V",
            "3. Mệnh đề kết quả: SO / SUCH ... THAT ... (Quá... đến nỗi mà)"
        ], "I am sorry that I am late. / He said that he would come.")
    ],
    [
        ("Sau tính từ", "We are pleased that you could make it.", "Chúng tôi rất vui vì bạn đã đến được."),
        ("Sau động từ", "She believes that honesty is the best policy.", "Cô ấy tin rằng trung thực là thượng sách.")
    ],
    [
        "Trong văn phong giao tiếp, từ 'that' thường có thể được lược bỏ mà câu vẫn đúng ngữ pháp."
    ]
)

curated["Mệnh đề danh ngữ"] = build_card(
    "Mệnh đề danh ngữ (Noun Clauses)",
    "Mệnh đề đóng vai trò như một danh từ làm chủ ngữ hoặc tân ngữ trong câu.",
    [
        ("Cấu trúc mở đầu mệnh đề danh ngữ", [
            "Bắt đầu bằng THAT / WHAT / WHERE / WHEN / WHY / HOW / WHETHER",
            "1. Làm chủ ngữ: What he said was very interesting. / That she passed surprised everyone.",
            "2. Làm tân ngữ: I don't know where he lives. / Tell me what happened."
        ], "Động từ chính của câu chia ở ngôi số ít khi mệnh đề danh ngữ làm chủ ngữ.")
    ],
    [
        ("Làm chủ ngữ", "What you need is a good night's sleep.", "Điều bạn cần là một giấc ngủ ngon."),
        ("Làm tân ngữ", "I wonder whether she will come.", "Tôi tự hỏi liệu cô ấy có đến không.")
    ],
    [
        "Trong mệnh đề danh ngữ, trật tự từ LUÔN LÀ TRẬT TỰ CÂU TRẦN THUẬT (S + V), KHÔNG được đảo trợ động từ lên trước: 'where he lives' (ĐÚNG) - 'where does he live' (SAI)."
    ]
)

curated["Mệnh đề phân từ"] = build_card(
    "Mệnh đề phân từ (Participle Clauses: V-ing & V3/ed)",
    "Rút gọn mệnh đề quan hệ hoặc mệnh đề trạng ngữ có cùng chủ ngữ.",
    [
        ("1. Phân từ hiện tại (V-ing) - Rút gọn mang nghĩa CHỦ ĐỘNG", [
            "Mệnh đề quan hệ chủ động: The boy who is playing soccer ➔ The boy PLAYING soccer.",
            "Mệnh đề trạng ngữ: Seeing the police, the thief ran away. (= When he saw the police...)"
        ], "Chủ động ➔ rút gọn thành V-ing."),
        ("2. Phân từ quá khứ (V3/ed) - Rút gọn mang nghĩa BỊ ĐỘNG", [
            "Mệnh đề quan hệ bị động: The car which was stolen yesterday ➔ The car STOLEN yesterday.",
            "Mệnh đề trạng ngữ: Injured in the accident, he was taken to hospital."
        ], "Bị động ➔ rút gọn thành V3/ed.")
    ],
    [
        ("Rút gọn chủ động", "The girl standing by the door is my sister.", "Cô gái đang đứng cạnh cửa..."),
        ("Rút gọn bị động", "The bridge built in 1990 is still strong.", "Cây cầu được xây năm 1990..."),
        ("Cùng chủ ngữ", "Feeling tired, she went to bed early.", "Vì cảm thấy mệt, cô ấy đi ngủ sớm.")
    ],
    [
        "Chỉ được rút gọn mệnh đề trạng ngữ khi HAI MỆNH ĐỀ CÓ CÙNG MỘT CHỦ NGỮ."
    ]
)

curated['Mệnh đề trạng ngữ chỉ thời gian với "When"'] = build_card(
    'Mệnh đề thời gian với "WHEN"',
    "Sự phối hợp thì giữa mệnh đề thời gian và mệnh đề chính.",
    [
        ("Các quy tắc phối hợp thì với WHEN", [
            "1. Quá khứ đơn + Quá khứ tiếp diễn (Đang xảy ra thì xen vào): When I arrived, they were having dinner.",
            "2. Quá khứ đơn + Quá khứ hoàn thành (Hành động xảy ra trước): When I arrived at the station, the train had already left.",
            "3. Hiện tại đơn + Tương lai đơn (Thời gian trong tương lai): When I grow up, I will become a doctor."
        ], "When the phone rang, I was sleeping.")
    ],
    [
        ("Xen vào", "When she came home, her children were sleeping.", "Con đang ngủ thì mẹ về."),
        ("Trước sau", "When we got to the cinema, the film had started.", "Phim đã chiếu trước khi chúng tôi đến."),
        ("Tương lai", "When he arrives tomorrow, we will start the meeting.", "Trong mệnh đề When dùng hiện tại đơn!")
    ],
    [
        "TUYỆT ĐỐI KHÔNG DÙNG THÌ TƯƠNG LAI (will) TRONG MỆNH ĐỀ CHỈ THỜI GIAN VỚI WHEN: 'When he arrives' (ĐÚNG) - KHÔNG viết 'When he will arrive' (SAI)."
    ]
)

curated["Mệnh đề chỉ thời gian trong tương lai"] = build_card(
    "Mệnh đề trạng ngữ chỉ thời gian trong tương lai (Time Clauses in Future)",
    "Quy tắc vàng về thì: Mệnh đề thời gian không dùng will.",
    [
        ("Quy tắc phối hợp thì chuẩn", [
            "Mệnh đề THỜI GIAN: When / As soon as / Until / Before / After + S + HIỆN TẠI ĐƠN (hoặc HIỆN TẠI HOÀN THÀNH)",
            "Mệnh đề CHÍNH: S + WILL / CAN + V-inf"
        ], "As soon as I receive the test results, I will call you immediately.")
    ],
    [
        ("As soon as", "I will leave as soon as it stops raining.", "Ngay khi trời tạnh mưa tôi sẽ đi."),
        ("Until", "We will wait here until you come back.", "Chúng tôi sẽ đợi ở đây cho đến khi bạn quay lại."),
        ("Before", "Turn off the lights before you leave.", "Tắt đèn trước khi bạn rời đi.")
    ],
    [
        "Quy tắc sống còn trong đề thi vào 10: Sau các liên từ chỉ thời gian (when, as soon as, before, after, until, while) KHÔNG BAO GIỜ dùng thì tương lai (will/shall)."
    ]
)

curated["Các cấu trúc câu đơn cơ bản và trật tự từ"] = build_card(
    "Các cấu trúc câu đơn cơ bản và trật tự từ (Sentence Structures)",
    "Năm mẫu câu đơn cơ bản trong tiếng Anh.",
    [
        ("5 mẫu câu đơn cơ bản", [
            "1. S + V: The baby cried.",
            "2. S + V + O: She plays badminton.",
            "3. S + V + Adj / N (Linking verb): He is a teacher. / She looks happy.",
            "4. S + V + O1 (gián tiếp) + O2 (trực tiếp): He gave me a present. = He gave a present TO me.",
            "5. S + V + O + C (Bổ ngữ tân ngữ): They elected him monitor. / The news made her sad."
        ], "Trật tự từ chuẩn: Subject + Verb + Object + Place + Time.")
    ],
    [
        ("Give sb sth", "She bought me a book.", "She bought a book for me."),
        ("Make sb + Adj", "The movie made him cry.", "Make sb do sth / Make sb Adj."),
        ("Trật tự từ", "I saw Tom at the supermarket yesterday.", "S + V + O + Place + Time.")
    ],
    [
        "Hai giới từ cho tân ngữ gián tiếp: GIVE sth TO sb nhưng BUY sth FOR sb."
    ]
)

curated["Thành lập động từ"] = build_card(
    "Cấu tạo từ: Thành lập động từ (Verb Formation)",
    "Các tiền tố và hậu tố dùng để biến đổi danh từ, tính từ thành động từ.",
    [
        ("Các tiền tố và hậu tố thông dụng", [
            "Hậu tố -en: wide ➔ widen (mở rộng), short ➔ shorten (thu ngắn), sharp ➔ sharpen, deep ➔ deepen",
            "Hậu tố -ize / -ise: modern ➔ modernize (hiện đại hóa), social ➔ socialize",
            "Hậu tố -ify: pure ➔ purify (làm sạch), beauty ➔ beautify (làm đẹp), simple ➔ simplify",
            "Tiền tố en-: courage ➔ encourage (khuyến khích), large ➔ enlarge (phóng to), danger ➔ endanger (gây nguy hiểm)"
        ], "Pollution endangers many marine species. / Regular exercise strengthens your heart.")
    ],
    [
        ("Enlarge", "Please enlarge this photo.", "Phóng to ảnh này."),
        ("Widen", "They are widening the road.", "Mở rộng con đường."),
        ("Simplify", "We need to simplify the procedure.", "Đơn giản hóa thủ tục.")
    ],
    [
        "Nhận diện vị trí cần điền ĐỘNG TỪ: sau chủ ngữ, sau trợ động từ, hoặc sau 'to' chỉ mục đích."
    ]
)

curated["Câu mệnh lệnh"] = build_card(
    "Câu mệnh lệnh (Imperative Sentences)",
    "Dùng để ra lệnh, hướng dẫn, yêu cầu hoặc cảnh báo.",
    [
        ("Công thức câu mệnh lệnh", [
            "Khẳng định: V-inf + (O / Adv)!: Open the window! / Listen carefully!",
            "Phủ định: DON'T + V-inf + (O / Adv)!: Don't touch that! / Don't make noise!",
            "Lịch sự: Thêm 'Please' ở đầu hoặc cuối câu: Please sit down. / Sit down, please."
        ], "Thường không có chủ ngữ (ngầm hiểu là 'you').")
    ],
    [
        ("Khẳng định", "Turn off the lights before leaving.", "Tắt đèn trước khi ra ngoài."),
        ("Phủ định", "Don't forget to do your homework.", "Đừng quên làm bài tập."),
        ("Chuyển sang gián tiếp", "He said, 'Be quiet!' ➔ He told us to be quiet.", "Tường thuật câu mệnh lệnh dùng to V.")
    ],
    [
        "Câu mệnh lệnh bắt đầu bằng động từ NGUYÊN THỂ (không chia s/es, không thêm ed, không có to)."
    ]
)

curated["Câu hỏi Yes/No"] = build_card(
    "Câu hỏi Yes/No (Yes/No Questions)",
    "Câu hỏi bắt đầu bằng trợ động từ hoặc to be để trả lời Có hoặc Không.",
    [
        ("Công thức chung", [
            "To be: Am / Is / Are / Was / Were + S + ...?",
            "Động từ thường: Do / Does / Did + S + V-inf?",
            "Động từ khuyết thiếu: Can / Could / Will / Should + S + V-inf?",
            "Hiện tại hoàn thành: Have / Has + S + V3/ed?"
        ], "Trả lời ngắn: Yes, S + trợ V. / No, S + trợ V + not.")
    ],
    [
        ("Hiện tại đơn", "Do you like English? - Yes, I do.", "Mượn trợ động từ do."),
        ("Quá khứ đơn", "Did you see him yesterday? - No, I didn't.", "Động từ see trở về nguyên thể."),
        ("Hoàn thành", "Have you finished your dinner? - Yes, I have.", "Hỏi với Have.")
    ],
    [
        "Khi đã mượn DO/DOES/DID trong câu hỏi thì động từ chính BẮT BUỘC trở về dạng NGUYÊN THỂ (bare infinitive)."
    ]
)

curated["Cấu trúc đồng tình: So, too, neither, either"] = build_card(
    "Cấu trúc đồng tình: SO, TOO, NEITHER, EITHER",
    "Thể hiện sự đồng thuận với ý kiến khẳng định hoặc phủ định của người khác.",
    [
        ("1. Đồng tình khẳng định (Cũng vậy)", [
            "TOO: đứng cuối câu khẳng định (S + trợ V, too): I like apples. - I do, too.",
            "SO: đứng đầu câu với cấu trúc đảo ngữ (SO + trợ V + S): I like apples. - So do I."
        ], "She is a student. ➔ So am I. / I am, too."),
        ("2. Đồng tình phủ định (Cũng không)", [
            "EITHER: đứng cuối câu phủ định (S + trợ V + not, either): I don't smoke. - I don't, either.",
            "NEITHER: đứng đầu câu đảo ngữ (NEITHER + trợ V + S): I don't smoke. - Neither do I."
        ], "He can't swim. ➔ Neither can I. / I can't, either.")
    ],
    [
        ("Đồng tình khẳng định", "I love chocolate. ➔ So do I. / Me, too.", "Cũng thích."),
        ("Đồng tình phủ định", "I haven't visited Paris. ➔ Neither have I. / I haven't, either.", "Cũng chưa."),
        ("Phân biệt", "Neither đã có phủ định nên trợ từ KHÔNG có not (Neither do I, không dùng Neither don't I).", "Quy tắc cốt lõi.")
    ],
    [
        "NEITHER đã mang nghĩa phủ định (Not either) nên trợ động từ đi kèm PHẢI Ở DẠNG KHẲNG ĐỊNH: 'Neither DO I' (ĐÚNG) - KHÔNG viết 'Neither don't I' (SAI)."
    ]
)

curated["Câu giả định với would rather/would sooner"] = build_card(
    "Câu giả định với WOULD RATHER (Muốn ai đó làm gì)",
    "Cấu trúc mong muốn người khác làm điều gì ở hiện tại hoặc quá khứ.",
    [
        ("1. Trái ngược hoặc mong muốn ở hiện tại/tương lai (Lùi về Quá khứ đơn)", [
            "S1 + would rather (that) + S2 + V-ed/V2 (to be dùng WERE)"
        ], "I would rather you didn't smoke in here. / I'd rather she stayed at home today."),
        ("2. Trái ngược với thực tế ở quá khứ (Lùi về Quá khứ hoàn thành)", [
            "S1 + would rather (that) + S2 + HAD + V3/ed"
        ], "I would rather you had told me the truth yesterday.")
    ],
    [
        ("Ước hiện tại", "I would rather you went to bed early.", "Tôi muốn bạn đi ngủ sớm tối nay."),
        ("Ước quá khứ", "I would rather he hadn't spent all his money.", "Giá mà hôm qua anh ấy không tiêu hết tiền.")
    ],
    [
        "Phân biệt: Nếu CÙNG MỘT CHỦ NGỮ thì dùng nguyên thể không to: 'I would rather STAY home'. Nếu CÓ HAI CHỦ NGỮ thì phải LÙI THÌ: 'I would rather YOU STAYED home'."
    ]
)

curated["Ôn luyện tổng hợp về các động từ khuyết thiếu"] = build_card(
    "Tổng hợp toàn diện Động từ khuyết thiếu (Modal Verbs Review)",
    "Bảng tổng kết chức năng của can, could, may, might, must, should, have to.",
    [
        ("Bảng tra cứu chức năng", [
            "Khả năng (Ability): CAN (hiện tại), COULD (quá khứ)",
            "Cho phép (Permission): CAN, MAY, COULD, BE ALLOWED TO",
            "Bắt buộc (Obligation): MUST (chủ quan), HAVE TO (khách quan)",
            "Cấm đoán (Prohibition): MUST NOT / MUSTN'T",
            "Lời khuyên (Advice): SHOULD, OUGHT TO, HAD BETTER",
            "Dự đoán (Possibility): MUST (chắc chắn), MAY/MIGHT/COULD (có thể), CAN'T (chắc chắn không)"
        ], "All modal verbs are followed by bare infinitive (V-inf).")
    ],
    [
        ("Phỏng đoán chắc chắn", "He has worked for 12 hours. He must be tired.", "Chắc chắn mệt (must be)."),
        ("Phỏng đoán phủ định", "It can't be true!", "Không thể nào là sự thật được (can't be)."),
        ("Khuyên bảo", "You should take a rest.", "Nên nghỉ ngơi.")
    ],
    [
        "Động từ khuyết thiếu KHÔNG thêm -s ở ngôi số ít và KHÔNG dùng trợ động từ do/does trong câu hỏi."
    ]
)

print(f"Curated {len(curated)} grammar master topics.")

# Save master curated theories to json
CURATED_PATH = "data/curated_grammar_theories.json"
with open(CURATED_PATH, "w", encoding="utf-8") as f:
    json.dump(curated, f, ensure_ascii=False, indent=2)
print(f"Saved to {CURATED_PATH}")

# Now build the matching logic for all 114 topics
def normalize_name(s):
    if not s:
        return ""
    # remove special characters, extra spaces, lowercase
    s = s.lower().strip()
    s = re.sub(r'[\"\',.:;!?()\\/\-_]+', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

# Create normalized lookup index
normalized_index = {}
for name, html in curated.items():
    normalized_index[normalize_name(name)] = html

# Provide manual alias mapping for tricky names
aliases = {
    "so that such a an that": "so... that, such (a/an)... that",
    "cau uoc voi i wish if only": 'Câu ước với "I wish", "If only"',
    "cau dieu kien loai 2": "Câu điều kiện loại 2",
    "cac cau truc chi muc dich": "Các cấu trúc chỉ mục đích",
    "suggest be suggested that": "... suggest ... /... be suggested that ...",
    "used to would get be used to": "Used to, would, get/be used to",
    "used to": "Used to, would, get/be used to",
    "cau truc hon prefer would prefer would rather would sooner": 'Cấu trúc "hơn": prefer, would prefer, would rather/would sooner',
    "the bi dong o thi qua khu don": "Thể bị động ở thì quá khứ đơn",
    "the bi dong o thi hien tai don": "Thể bị động ở thì hiện tại đơn",
    "the bi dong o thi tuong lai don": "Thể bị động ở thì tương lai đơn",
    "the bi dong o thi hien tai hoan thanh": "Thể bị động ở thì hiện tại hoàn thành",
    "the bi dong voi cac thi tiep dien": "Thể bị động với các thì tiếp diễn",
    "the bi dong voi dong tu khuyet thieu": "Thể bị động với động từ khuyết thiếu",
    "the bi dong voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "chuyen cau tuong thuat tu truc tiep sang gian tiep co thay doi thi": "Chuyển câu tường thuật từ trực tiếp sang gián tiếp: có thay đổi thì",
    "chuyen cau tuong thuat tu truc tiep sang gian tiep khong thay doi thi": "Chuyển câu tường thuật từ trực tiếp sang gián tiếp: không thay đổi thì",
    "chuyen tu cau gian tiep ve cau truc tiep": "Chuyển từ câu gián tiếp về câu trực tiếp",
    "cau nghi van de nghi menh lenh o dang gian tiep": "Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp",
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
    "a hay an": '"a" hay "an"',
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
    "trang tu lien ket however therefore accordingly": "Trạng từ liên kết (however, therefore, accordingly...)",
    "nhung truong hop can luu y ve hoa hop s v": "Những trường hợp cần lưu ý về hòa hợp S-V",
    "chu ngu gia": "Chủ ngữ giả",
    "menh de that": 'Mệnh đề "That"',
    "menh de danh ngu": "Mệnh đề danh ngữ",
    "menh de phan tu": "Mệnh đề phân từ",
    "menh de trang ngu chi thoi gian voi when": 'Mệnh đề trạng ngữ chỉ thời gian với "When"',
    "menh de chi thoi gian trong tuong lai": "Mệnh đề chỉ thời gian trong tương lai",
    "cac cau truc cau don co ban va trat tu tu": "Các cấu trúc câu đơn cơ bản và trật tự từ",
    "thanh lap dong tu": "Thành lập động từ",
    "cau menh lenh": "Câu mệnh lệnh",
    "cau truc dong tinh so too neither either": "Cấu trúc đồng tình: So, too, neither, either",
    "cau gia dinh voi would rather would sooner": "Câu giả định với would rather/would sooner",
    "on luyen tong hop ve cac dong tu khuyet thieu": "Ôn luyện tổng hợp về các động từ khuyết thiếu",
    "dua ra va dap lai loi khen chuc mung": "Đưa ra và đáp lại lời khen/chúc mừng",
    "bay to loi cam on va xin loi": "Bày tỏ lời cảm ơn và xin lỗi",
    "dua ra goi y va loi de nghi": "Đưa ra gợi ý và lời đề nghị",
    "dua ra loi moi va phan hoi loi moi": "Đưa ra lời mời và phản hồi lời mời",
    "bay to su dong tinh khong dong tinh": "Bày tỏ sự đồng tình/không đồng tình",
    "bay to quan diem ca nhan": "Bày tỏ quan điểm cá nhân",
    "would like": "Would like",
    "too enough": "too, enough",
    "the bi dng voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "the bi dong voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "cau diu kien loai 2": "Câu điều kiện loại 2",
    "cau dieu kien loai 2": "Câu điều kiện loại 2",
    "cac cau truc chi mc dich": "Các cấu trúc chỉ mục đích",
    "the bi dong vi dong tu khuyet thieu": "Thể bị động với động từ khuyết thiếu",
    "lien tu kt hop and or but": "Liên từ kết hợp (and, or, but...)",
    "cau nghi van de nghi mnh lenh o dang gian tiep": "Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp",
    "dong tu khuyet thieu dua yeu cau de nghi goi y": "Ôn luyện tổng hợp về các động từ khuyết thiếu",

    "the bi d ng voi cac cau truc dac biet": "Thể bị động với các cấu trúc đặc biệt",
    "dong tu khuyet thieu dua yeu cau de nghi goi y": "Ôn luyện tổng hợp về các động từ khuyết thiếu",
    "cau nghi van de nghi m nh lenh o dang gian tiep": "Câu nghi vấn, đề nghị, mệnh lệnh ở dạng gián tiếp",
    "lien tu k t hop and or but": "Liên từ kết hợp (and, or, but...)",
    "the bi dong v i dong tu khuyet thieu": "Thể bị động với động từ khuyết thiếu",
    "cac cau truc chi m c dich": "Các cấu trúc chỉ mục đích",
    "cau di u kien loai 2": "Câu điều kiện loại 2"
}

def remove_accents(input_str):
    import unicodedata
    s = input_str.replace("đ", "d").replace("Đ", "d").replace("\ufffd", "")
    nfkd_form = unicodedata.normalize('NFKD', s)
    cleaned = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    return re.sub(r"\s+", " ", cleaned).strip()

def get_theory_for_topic(name):
    if not name:
        return None
    # 1. Exact match
    if name in curated:
        return curated[name]
    # 2. Normalized match
    norm = normalize_name(name)
    if norm in normalized_index:
        return normalized_index[norm]
    # 3. Normalized without accents
    norm_no_acc = remove_accents(norm)
    if norm_no_acc in aliases:
        canonical = aliases[norm_no_acc]
        return curated.get(canonical)
    for k, canonical in aliases.items():
        if k in norm_no_acc or norm_no_acc in k:
            return curated.get(canonical)
    # 4. Partial substring search in curated keys
    for k in curated:
        norm_k = remove_accents(normalize_name(k))
        if norm_no_acc in norm_k or norm_k in norm_no_acc:
            return curated[k]
    return None

# Test resolution of all 114 topics
with open("scripts/topics_list.json", "r", encoding="utf-8") as f:
    topics_list = json.load(f)

resolved_count = 0
unresolved = []
for t in topics_list:
    th = get_theory_for_topic(t)
    if th:
        resolved_count += 1
    else:
        unresolved.append(t)

print(f"Resolved {resolved_count} / {len(topics_list)} topics (100% target).")
if unresolved:
    print(f"Unresolved ({len(unresolved)}):", unresolved)
else:
    print("🌟 100% of all 114 broken iframe topics are now backed by authentic, rich offline cards!")
