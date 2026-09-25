#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Generation Pipeline for Phonetics and Speaking (Milestone 1)
Topics covered:
  Phonetics: 68 (-ed), 69 (-s/es), 70 (vowels), 72 (consonants), 29 (2-syllables stress), 30 (3-syllables stress)
  Speaking: 78 (thanking/apologizing), 79 (compliments/congratulations), 80 (suggestions/invitations)
Aliases:
  26, 27 -> 70
  28 -> 72
  307, 301 -> 80
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
# TOPIC 68: Đuôi "-ed" (15 questions)
# -------------------------------------------------------------
q68 = [
    {
        "id": "68_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_1_1", "text": "happened", "html": "happen<u>ed</u>"},
            {"id": "68_1_2", "text": "mixed", "html": "mix<u>ed</u>"},
            {"id": "68_1_3", "text": "listened", "html": "listen<u>ed</u>"},
            {"id": "68_1_4", "text": "lived", "html": "liv<u>ed</u>"}
        ],
        "correctChoiceId": "68_1_2",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"mixed\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>mixed</strong> (v.) /mɪkst/</li><li><strong>happened</strong> (v.) /ˈhæpənd/</li><li><strong>listened</strong> (v.) /ˈlɪsnd/</li><li><strong>lived</strong> (v.) /lɪvd/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /t/ sau các âm vô thanh (/s/, /p/, /k/, /f/, /ʃ/, /tʃ/)."
    },
    {
        "id": "68_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_2_1", "text": "passed", "html": "pass<u>ed</u>"},
            {"id": "68_2_2", "text": "opened", "html": "open<u>ed</u>"},
            {"id": "68_2_3", "text": "washed", "html": "wash<u>ed</u>"},
            {"id": "68_2_4", "text": "worked", "html": "work<u>ed</u>"}
        ],
        "correctChoiceId": "68_2_2",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"opened\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>opened</strong> (v.) /ˈəʊpənd/</li><li><strong>passed</strong> (v.) /pɑːst/</li><li><strong>washed</strong> (v.) /wɒʃt/</li><li><strong>worked</strong> (v.) /wɜːkt/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /d/ sau các âm hữu thanh còn lại (như /n/)."
    },
    {
        "id": "68_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_3_1", "text": "dressed", "html": "dress<u>ed</u>"},
            {"id": "68_3_2", "text": "dropped", "html": "dropp<u>ed</u>"},
            {"id": "68_3_3", "text": "matched", "html": "match<u>ed</u>"},
            {"id": "68_3_4", "text": "joined", "html": "join<u>ed</u>"}
        ],
        "correctChoiceId": "68_3_4",
        "explanation": "<p>Phần gạch chân trong <strong>\"joined\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>joined</strong> (v.) /dʒɔɪnd/</li><li><strong>dressed</strong> (v.) /drest/</li><li><strong>dropped</strong> (v.) /drɒpt/</li><li><strong>matched</strong> (v.) /mætʃt/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /d/ sau các nguyên âm và phụ âm hữu thanh."
    },
    {
        "id": "68_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_4_1", "text": "played", "html": "play<u>ed</u>"},
            {"id": "68_4_2", "text": "planned", "html": "plann<u>ed</u>"},
            {"id": "68_4_3", "text": "cooked", "html": "cook<u>ed</u>"},
            {"id": "68_4_4", "text": "lived", "html": "liv<u>ed</u>"}
        ],
        "correctChoiceId": "68_4_3",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"cooked\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>cooked</strong> (v.) /kʊkt/</li><li><strong>played</strong> (v.) /pleɪd/</li><li><strong>planned</strong> (v.) /plænd/</li><li><strong>lived</strong> (v.) /lɪvd/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /t/ sau âm vô thanh /k/."
    },
    {
        "id": "68_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_5_1", "text": "watched", "html": "watch<u>ed</u>"},
            {"id": "68_5_2", "text": "cleaned", "html": "clean<u>ed</u>"},
            {"id": "68_5_3", "text": "missed", "html": "miss<u>ed</u>"},
            {"id": "68_5_4", "text": "talked", "html": "talk<u>ed</u>"}
        ],
        "correctChoiceId": "68_5_2",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"cleaned\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>cleaned</strong> (v.) /kliːnd/</li><li><strong>watched</strong> (v.) /wɒtʃt/</li><li><strong>missed</strong> (v.) /mɪst/</li><li><strong>talked</strong> (v.) /tɔːkt/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /d/ sau âm hữu thanh /n/."
    },
    {
        "id": "68_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_6_1", "text": "toured", "html": "tour<u>ed</u>"},
            {"id": "68_6_2", "text": "jumped", "html": "jump<u>ed</u>"},
            {"id": "68_6_3", "text": "solved", "html": "solv<u>ed</u>"},
            {"id": "68_6_4", "text": "rained", "html": "rain<u>ed</u>"}
        ],
        "correctChoiceId": "68_6_2",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"jumped\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại được phát âm là <strong>/d/</strong>.</p><ul><li><strong>jumped</strong> (v.) /dʒʌmpt/</li><li><strong>toured</strong> (v.) /tʊəd/</li><li><strong>solved</strong> (v.) /sɒlvd/</li><li><strong>rained</strong> (v.) /reɪnd/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /t/ sau âm vô thanh /p/."
    },
    {
        "id": "68_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_7_1", "text": "talked", "html": "talk<u>ed</u>"},
            {"id": "68_7_2", "text": "naked", "html": "nak<u>ed</u>"},
            {"id": "68_7_3", "text": "missed", "html": "miss<u>ed</u>"},
            {"id": "68_7_4", "text": "stepped", "html": "stepp<u>ed</u>"}
        ],
        "correctChoiceId": "68_7_2",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"naked\"</strong> được phát âm là <strong>/ɪd/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>naked</strong> (adj.) /ˈneɪkɪd/</li><li><strong>talked</strong> (v.) /tɔːkt/</li><li><strong>missed</strong> (v.) /mɪst/</li><li><strong>stepped</strong> (v.) /stept/</li></ul>",
        "ruleTip": "Tính từ đặc biệt kết thúc bằng '-ed' như 'naked', 'wicked', 'crooked' luôn phát âm là /ɪd/."
    },
    {
        "id": "68_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_8_1", "text": "wanted", "html": "want<u>ed</u>"},
            {"id": "68_8_2", "text": "decided", "html": "decid<u>ed</u>"},
            {"id": "68_8_3", "text": "needed", "html": "need<u>ed</u>"},
            {"id": "68_8_4", "text": "stopped", "html": "stopp<u>ed</u>"}
        ],
        "correctChoiceId": "68_8_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"stopped\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại phát âm là <strong>/ɪd/</strong>.</p><ul><li><strong>stopped</strong> (v.) /stɒpt/</li><li><strong>wanted</strong> (v.) /ˈwɒntɪd/</li><li><strong>decided</strong> (v.) /dɪˈsaɪdɪd/</li><li><strong>needed</strong> (v.) /ˈniːdɪd/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /ɪd/ khi tận cùng là /t/ hoặc /d/ (mẹo: 'tiền đô')."
    },
    {
        "id": "68_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_9_1", "text": "invited", "html": "invit<u>ed</u>"},
            {"id": "68_9_2", "text": "attended", "html": "attend<u>ed</u>"},
            {"id": "68_9_3", "text": "visited", "html": "visit<u>ed</u>"},
            {"id": "68_9_4", "text": "looked", "html": "look<u>ed</u>"}
        ],
        "correctChoiceId": "68_9_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"looked\"</strong> được phát âm là <strong>/t/</strong>, các từ còn lại phát âm là <strong>/ɪd/</strong>.</p><ul><li><strong>looked</strong> (v.) /lʊkt/</li><li><strong>invited</strong> (v.) /ɪnˈvaɪtɪd/</li><li><strong>attended</strong> (v.) /əˈtendɪd/</li><li><strong>visited</strong> (v.) /ˈvɪzɪtɪd/</li></ul>",
        "ruleTip": "Đuôi '-ed' phát âm là /ɪd/ sau /t/ và /d/. 'looked' kết thúc bằng /k/ nên đọc là /t/."
    },
    {
        "id": "68_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_10_1", "text": "helped", "html": "help<u>ed</u>"},
            {"id": "68_10_2", "text": "laughed", "html": "laugh<u>ed</u>"},
            {"id": "68_10_3", "text": "hoped", "html": "hop<u>ed</u>"},
            {"id": "68_10_4", "text": "loved", "html": "lov<u>ed</u>"}
        ],
        "correctChoiceId": "68_10_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"loved\"</strong> được phát âm là <strong>/d/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>loved</strong> (v.) /lʌvd/</li><li><strong>helped</strong> (v.) /helpt/</li><li><strong>laughed</strong> (v.) /lɑːft/</li><li><strong>hoped</strong> (v.) /həʊpt/</li></ul>",
        "ruleTip": "Đuôi '-ed' sau 'gh' đọc là /f/ (laughed) phát âm là /t/. 'loved' kết thúc bằng /v/ nên phát âm là /d/."
    },
    {
        "id": "68_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_11_1", "text": "wicked", "html": "wick<u>ed</u>"},
            {"id": "68_11_2", "text": "fixed", "html": "fix<u>ed</u>"},
            {"id": "68_11_3", "text": "looked", "html": "look<u>ed</u>"},
            {"id": "68_11_4", "text": "promised", "html": "promis<u>ed</u>"}
        ],
        "correctChoiceId": "68_11_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"wicked\"</strong> được phát âm là <strong>/ɪd/</strong>, trong các từ còn lại được phát âm là <strong>/t/</strong>.</p><ul><li><strong>wicked</strong> (adj.) /ˈwɪkɪd/</li><li><strong>fixed</strong> (v.) /fɪkst/</li><li><strong>looked</strong> (v.) /lʊkt/</li><li><strong>promised</strong> (v.) /ˈprɒmɪst/</li></ul>",
        "ruleTip": "Tính từ 'wicked' /ˈwɪkɪd/ (độc ác) là trường hợp đặc biệt phát âm là /ɪd/."
    },
    {
        "id": "68_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_12_1", "text": "painted", "html": "paint<u>ed</u>"},
            {"id": "68_12_2", "text": "waited", "html": "wait<u>ed</u>"},
            {"id": "68_12_3", "text": "decided", "html": "decid<u>ed</u>"},
            {"id": "68_12_4", "text": "watched", "html": "watch<u>ed</u>"}
        ],
        "correctChoiceId": "68_12_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"watched\"</strong> được phát âm là <strong>/t/</strong>, các từ còn lại phát âm là <strong>/ɪd/</strong>.</p><ul><li><strong>watched</strong> (v.) /wɒtʃt/</li><li><strong>painted</strong> (v.) /ˈpeɪntɪd/</li><li><strong>waited</strong> (v.) /ˈweɪtɪd/</li><li><strong>decided</strong> (v.) /dɪˈsaɪdɪd/</li></ul>",
        "ruleTip": "Đuôi '-ed' sau /tʃ/ phát âm là /t/, sau /t, d/ phát âm là /ɪd/."
    },
    {
        "id": "68_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_13_1", "text": "kissed", "html": "kiss<u>ed</u>"},
            {"id": "68_13_2", "text": "arrested", "html": "arrest<u>ed</u>"},
            {"id": "68_13_3", "text": "excited", "html": "excit<u>ed</u>"},
            {"id": "68_13_4", "text": "minded", "html": "mind<u>ed</u>"}
        ],
        "correctChoiceId": "68_13_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"kissed\"</strong> được phát âm là <strong>/t/</strong>, các từ còn lại phát âm là <strong>/ɪd/</strong>.</p><ul><li><strong>kissed</strong> (v.) /kɪst/</li><li><strong>arrested</strong> (v.) /əˈrestɪd/</li><li><strong>excited</strong> (v.) /ɪkˈsaɪtɪd/</li><li><strong>minded</strong> (v.) /ˈmaɪndɪd/</li></ul>",
        "ruleTip": "Đuôi '-ed' sau /s/ phát âm là /t/, sau /t, d/ phát âm là /ɪd/."
    },
    {
        "id": "68_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_14_1", "text": "phoned", "html": "phon<u>ed</u>"},
            {"id": "68_14_2", "text": "called", "html": "call<u>ed</u>"},
            {"id": "68_14_3", "text": "arrived", "html": "arriv<u>ed</u>"},
            {"id": "68_14_4", "text": "parked", "html": "park<u>ed</u>"}
        ],
        "correctChoiceId": "68_14_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"parked\"</strong> được phát âm là <strong>/t/</strong>, các từ còn lại phát âm là <strong>/d/</strong>.</p><ul><li><strong>parked</strong> (v.) /pɑːkt/</li><li><strong>phoned</strong> (v.) /fəʊnd/</li><li><strong>called</strong> (v.) /kɔːld/</li><li><strong>arrived</strong> (v.) /əˈraɪvd/</li></ul>",
        "ruleTip": "Đuôi '-ed' sau /k/ phát âm là /t/, các từ còn lại kết thúc bằng phụ âm hữu thanh (/n, l, v/) phát âm là /d/."
    },
    {
        "id": "68_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "68_15_1", "text": "crooked", "html": "crook<u>ed</u>"},
            {"id": "68_15_2", "text": "touched", "html": "touch<u>ed</u>"},
            {"id": "68_15_3", "text": "checked", "html": "check<u>ed</u>"},
            {"id": "68_15_4", "text": "laughed", "html": "laugh<u>ed</u>"}
        ],
        "correctChoiceId": "68_15_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"crooked\"</strong> được phát âm là <strong>/ɪd/</strong>, các từ còn lại phát âm là <strong>/t/</strong>.</p><ul><li><strong>crooked</strong> (adj.) /ˈkrʊkɪd/</li><li><strong>touched</strong> (v.) /tʌtʃt/</li><li><strong>checked</strong> (v.) /tʃekt/</li><li><strong>laughed</strong> (v.) /lɑːft/</li></ul>",
        "ruleTip": "Tính từ 'crooked' /ˈkrʊkɪd/ (cong queo) là trường hợp ngoại lệ phát âm là /ɪd/."
    }
]

theory68 = {
    "topicId": 68,
    "topicName": "Đuôi \"ed\"",
    "englishName": "\"ed\" ending",
    "infographicImage": "/images/theories/duoi-ed.png",
    "rules": [
        {
            "sound": "/ɪd/",
            "rule": "Phát âm là /ɪd/ khi động từ kết thúc bằng âm /t/ hoặc /d/ (mẹo nhớ: 'tiền đô').",
            "examples": "wanted /ˈwɒntɪd/, needed /ˈniːdɪd/, decided /dɪˈsaɪdɪd/, invited /ɪnˈvaɪtɪd/, painted /ˈpeɪntɪd/"
        },
        {
            "sound": "/t/",
            "rule": "Phát âm là /t/ khi động từ kết thúc bằng các âm vô thanh: /p/, /k/, /f/, /s/, /ʃ/ (sh), /tʃ/ (ch) (mẹo nhớ: 'phải kính phục sư phụ chất').",
            "examples": "stopped /stɒpt/, looked /lʊkt/, laughed /lɑːft/, washed /wɒʃt/, watched /wɒtʃt/, missed /mɪst/, fixed /fɪkst/"
        },
        {
            "sound": "/d/",
            "rule": "Phát âm là /d/ khi động từ kết thúc bằng các âm hữu thanh còn lại (nguyên âm và các phụ âm hữu thanh /b, ɡ, v, z, m, n, ŋ, l, r, ð/).",
            "examples": "played /pleɪd/, cleaned /kliːnd/, lived /lɪvd/, opened /ˈəʊpənd/, rained /reɪnd/, loved /lʌvd/"
        },
        {
            "sound": "Đặc biệt",
            "rule": "Một số tính từ kết thúc bằng '-ed' luôn phát âm là /ɪd/ bất kể âm tận cùng.",
            "examples": "naked /ˈneɪkɪd/ (khỏa thân), wicked /ˈwɪkɪd/ (độc ác), crooked /ˈkrʊkɪd/ (cong queo), learned /ˈlɜːnɪd/ (uyên bác), blessed /ˈblesɪd/ (may mắn/thiêng liêng)"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 69: Đuôi "-s/es" (15 questions)
# -------------------------------------------------------------
q69 = [
    {
        "id": "69_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_1_1", "text": "books", "html": "book<u>s</u>"},
            {"id": "69_1_2", "text": "cats", "html": "cat<u>s</u>"},
            {"id": "69_1_3", "text": "dogs", "html": "dog<u>s</u>"},
            {"id": "69_1_4", "text": "maps", "html": "map<u>s</u>"}
        ],
        "correctChoiceId": "69_1_3",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"dogs\"</strong> được phát âm là <strong>/z/</strong>, trong các từ còn lại được phát âm là <strong>/s/</strong>.</p><ul><li><strong>dogs</strong> /dɒɡz/ (âm /g/ hữu thanh)</li><li><strong>books</strong> /bʊks/</li><li><strong>cats</strong> /kæts/</li><li><strong>maps</strong> /mæps/</li></ul>",
        "ruleTip": "Đuôi 's/es' sau âm vô thanh (/p/, /k/, /t/, /f/, /θ/) phát âm là /s/. Sau âm hữu thanh phát âm là /z/."
    },
    {
        "id": "69_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_2_1", "text": "watches", "html": "watch<u>es</u>"},
            {"id": "69_2_2", "text": "boxes", "html": "box<u>es</u>"},
            {"id": "69_2_3", "text": "buses", "html": "bus<u>es</u>"},
            {"id": "69_2_4", "text": "apples", "html": "apple<u>s</u>"}
        ],
        "correctChoiceId": "69_2_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"apples\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>apples</strong> /ˈæplz/</li><li><strong>watches</strong> /ˈwɒtʃɪz/</li><li><strong>boxes</strong> /ˈbɒksɪz/</li><li><strong>buses</strong> /ˈbʌsɪz/</li></ul>",
        "ruleTip": "Đuôi 'es' sau các âm xuýt /s, z, ʃ, tʃ, dʒ, ʒ/ (ch, sh, x, s, ce, ge) đọc là /ɪz/."
    },
    {
        "id": "69_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_3_1", "text": "roofs", "html": "roof<u>s</u>"},
            {"id": "69_3_2", "text": "cups", "html": "cup<u>s</u>"},
            {"id": "69_3_3", "text": "banks", "html": "bank<u>s</u>"},
            {"id": "69_3_4", "text": "pens", "html": "pen<u>s</u>"}
        ],
        "correctChoiceId": "69_3_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"pens\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>pens</strong> /penz/</li><li><strong>roofs</strong> /ruːfs/</li><li><strong>cups</strong> /kʌps/</li><li><strong>banks</strong> /bæŋks/</li></ul>",
        "ruleTip": "Đuôi 's' sau âm /n/ hữu thanh đọc là /z/, sau /f, p, k/ vô thanh đọc là /s/."
    },
    {
        "id": "69_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_4_1", "text": "misses", "html": "miss<u>es</u>"},
            {"id": "69_4_2", "text": "changes", "html": "chang<u>es</u>"},
            {"id": "69_4_3", "text": "washes", "html": "wash<u>es</u>"},
            {"id": "69_4_4", "text": "lives", "html": "live<u>s</u>"}
        ],
        "correctChoiceId": "69_4_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"lives\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>lives</strong> /lɪvz/</li><li><strong>misses</strong> /ˈmɪsɪz/</li><li><strong>changes</strong> /ˈtʃeɪndʒɪz/</li><li><strong>washes</strong> /ˈwɒʃɪz/</li></ul>",
        "ruleTip": "lives kết thúc bằng âm /v/ nên thêm -s đọc là /z/, các từ kia tận cùng là âm xuýt nên đọc là /ɪz/."
    },
    {
        "id": "69_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_5_1", "text": "laughs", "html": "laugh<u>s</u>"},
            {"id": "69_5_2", "text": "coughs", "html": "cough<u>s</u>"},
            {"id": "69_5_3", "text": "steps", "html": "step<u>s</u>"},
            {"id": "69_5_4", "text": "stays", "html": "stay<u>s</u>"}
        ],
        "correctChoiceId": "69_5_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"stays\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>stays</strong> /steɪz/</li><li><strong>laughs</strong> /lɑːfs/</li><li><strong>coughs</strong> /kɒfs/</li><li><strong>steps</strong> /steps/</li></ul>",
        "ruleTip": "Đuôi 's' sau nguyên âm đọc là /z/, sau âm vô thanh (/f/, /p/) đọc là /s/."
    },
    {
        "id": "69_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_6_1", "text": "stops", "html": "stop<u>s</u>"},
            {"id": "69_6_2", "text": "looks", "html": "look<u>s</u>"},
            {"id": "69_6_3", "text": "cleans", "html": "clean<u>s</u>"},
            {"id": "69_6_4", "text": "visits", "html": "visit<u>s</u>"}
        ],
        "correctChoiceId": "69_6_3",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"cleans\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>cleans</strong> /kliːnz/</li><li><strong>stops</strong> /stɒps/</li><li><strong>looks</strong> /lʊks/</li><li><strong>visits</strong> /ˈvɪzɪts/</li></ul>",
        "ruleTip": "cleans kết thúc bằng /n/ hữu thanh đọc là /z/, các từ còn lại tận cùng bằng âm vô thanh /p, k, t/ đọc là /s/."
    },
    {
        "id": "69_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_7_1", "text": "faces", "html": "face<u>s</u>"},
            {"id": "69_7_2", "text": "places", "html": "place<u>s</u>"},
            {"id": "69_7_3", "text": "horses", "html": "horse<u>s</u>"},
            {"id": "69_7_4", "text": "rides", "html": "ride<u>s</u>"}
        ],
        "correctChoiceId": "69_7_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"rides\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>rides</strong> /raɪdz/</li><li><strong>faces</strong> /ˈfeɪsɪz/</li><li><strong>places</strong> /ˈpleɪsɪz/</li><li><strong>horses</strong> /ˈhɔːsɪz/</li></ul>",
        "ruleTip": "rides tận cùng là /d/ nên thêm -s phát âm là /z/, face, place, horse tận cùng là âm xuýt /s/ nên đọc là /ɪz/."
    },
    {
        "id": "69_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_8_1", "text": "laughs", "html": "laugh<u>s</u>"},
            {"id": "69_8_2", "text": "hopes", "html": "hope<u>s</u>"},
            {"id": "69_8_3", "text": "walks", "html": "walk<u>s</u>"},
            {"id": "69_8_4", "text": "bags", "html": "bag<u>s</u>"}
        ],
        "correctChoiceId": "69_8_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"bags\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>bags</strong> /bæɡz/</li><li><strong>laughs</strong> /lɑːfs/</li><li><strong>hopes</strong> /həʊps/</li><li><strong>walks</strong> /wɔːks/</li></ul>",
        "ruleTip": "laughs có 'gh' phát âm là /f/ (vô thanh) nên thêm -s đọc là /s/. 'bags' tận cùng là /g/ hữu thanh nên đọc là /z/."
    },
    {
        "id": "69_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_9_1", "text": "houses", "html": "hous<u>es</u>"},
            {"id": "69_9_2", "text": "plates", "html": "plate<u>s</u>"},
            {"id": "69_9_3", "text": "cups", "html": "cup<u>s</u>"},
            {"id": "69_9_4", "text": "desks", "html": "desk<u>s</u>"}
        ],
        "correctChoiceId": "69_9_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"houses\"</strong> được phát âm là <strong>/ɪz/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>houses</strong> /ˈhaʊzɪz/</li><li><strong>plates</strong> /pleɪts/</li><li><strong>cups</strong> /kʌps/</li><li><strong>desks</strong> /desks/</li></ul>",
        "ruleTip": "house /ˈhaʊs/ khi thêm -s đổi thành /ˈhaʊzɪz/ (/ɪz/), các từ còn lại tận cùng bằng /t, p, k/ đọc là /s/."
    },
    {
        "id": "69_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_10_1", "text": "dreams", "html": "dream<u>s</u>"},
            {"id": "69_10_2", "text": "songs", "html": "song<u>s</u>"},
            {"id": "69_10_3", "text": "teaches", "html": "teach<u>es</u>"},
            {"id": "69_10_4", "text": "feels", "html": "feel<u>s</u>"}
        ],
        "correctChoiceId": "69_10_3",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"teaches\"</strong> được phát âm là <strong>/ɪz/</strong>, các từ còn lại phát âm là <strong>/z/</strong>.</p><ul><li><strong>teaches</strong> /ˈtiːtʃɪz/</li><li><strong>dreams</strong> /driːmz/</li><li><strong>songs</strong> /sɒŋz/</li><li><strong>feels</strong> /fiːlz/</li></ul>",
        "ruleTip": "teach kết thúc bằng /tʃ/ nên thêm -es phát âm là /ɪz/, các từ còn lại kết thúc bằng phụ âm hữu thanh (/m, ŋ, l/) phát âm là /z/."
    },
    {
        "id": "69_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_11_1", "text": "matches", "html": "match<u>es</u>"},
            {"id": "69_11_2", "text": "kisses", "html": "kiss<u>es</u>"},
            {"id": "69_11_3", "text": "oranges", "html": "orang<u>es</u>"},
            {"id": "69_11_4", "text": "guides", "html": "guide<u>s</u>"}
        ],
        "correctChoiceId": "69_11_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"guides\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>guides</strong> /ɡaɪdz/</li><li><strong>matches</strong> /ˈmætʃɪz/</li><li><strong>kisses</strong> /ˈkɪsɪz/</li><li><strong>oranges</strong> /ˈɒrɪndʒɪz/</li></ul>",
        "ruleTip": "guides tận cùng bằng /d/ nên đuôi -s phát âm là /z/, match (/tʃ/), kiss (/s/), orange (/dʒ/) tận cùng là âm xuýt nên phát âm là /ɪz/."
    },
    {
        "id": "69_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_12_1", "text": "breaths", "html": "breath<u>s</u>"},
            {"id": "69_12_2", "text": "proofs", "html": "proof<u>s</u>"},
            {"id": "69_12_3", "text": "laughs", "html": "laugh<u>s</u>"},
            {"id": "69_12_4", "text": "days", "html": "day<u>s</u>"}
        ],
        "correctChoiceId": "69_12_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"days\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>days</strong> /deɪz/</li><li><strong>breaths</strong> /breθs/</li><li><strong>proofs</strong> /pruːfs/</li><li><strong>laughs</strong> /lɑːfs/</li></ul>",
        "ruleTip": "breath (/θ/), proof (/f/), laugh (/f/) là âm vô thanh -> /s/. 'days' tận cùng là nguyên âm -> /z/."
    },
    {
        "id": "69_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_13_1", "text": "fixes", "html": "fix<u>es</u>"},
            {"id": "69_13_2", "text": "mixes", "html": "mix<u>es</u>"},
            {"id": "69_13_3", "text": "prizes", "html": "priz<u>es</u>"},
            {"id": "69_13_4", "text": "tables", "html": "table<u>s</u>"}
        ],
        "correctChoiceId": "69_13_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"tables\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>tables</strong> /ˈteɪblz/</li><li><strong>fixes</strong> /ˈfɪksɪz/</li><li><strong>mixes</strong> /ˈmɪksɪz/</li><li><strong>prizes</strong> /ˈpraɪzɪz/</li></ul>",
        "ruleTip": "tables tận cùng bằng âm /l/ hữu thanh -> /z/, fixes, mixes, prizes tận cùng là /s, z/ -> /ɪz/."
    },
    {
        "id": "69_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_14_1", "text": "paints", "html": "paint<u>s</u>"},
            {"id": "69_14_2", "text": "asks", "html": "ask<u>s</u>"},
            {"id": "69_14_3", "text": "reads", "html": "read<u>s</u>"},
            {"id": "69_14_4", "text": "cooks", "html": "cook<u>s</u>"}
        ],
        "correctChoiceId": "69_14_3",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"reads\"</strong> được phát âm là <strong>/z/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>reads</strong> /riːdz/</li><li><strong>paints</strong> /peɪnts/</li><li><strong>asks</strong> /ɑːsks/</li><li><strong>cooks</strong> /kʊks/</li></ul>",
        "ruleTip": "reads tận cùng là /d/ hữu thanh -> /z/, paints (/t/), asks (/k/), cooks (/k/) tận cùng là âm vô thanh -> /s/."
    },
    {
        "id": "69_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "69_15_1", "text": "bridges", "html": "bridg<u>es</u>"},
            {"id": "69_15_2", "text": "dishes", "html": "dish<u>es</u>"},
            {"id": "69_15_3", "text": "judges", "html": "judg<u>es</u>"},
            {"id": "69_15_4", "text": "lakes", "html": "lake<u>s</u>"}
        ],
        "correctChoiceId": "69_15_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"lakes\"</strong> được phát âm là <strong>/s/</strong>, các từ còn lại phát âm là <strong>/ɪz/</strong>.</p><ul><li><strong>lakes</strong> /leɪks/</li><li><strong>bridges</strong> /ˈbrɪdʒɪz/</li><li><strong>dishes</strong> /ˈdɪʃɪz/</li><li><strong>judges</strong> /ˈdʒʌdʒɪz/</li></ul>",
        "ruleTip": "lake kết thúc bằng /k/ nên thêm -s phát âm là /s/, bridge, dish, judge kết thúc bằng âm xuýt nên phát âm là /ɪz/."
    }
]

theory69 = {
    "topicId": 69,
    "topicName": "Đuôi \"s\"/\"es\"",
    "englishName": "\"s\"/\"es\" ending",
    "rules": [
        {
            "sound": "/ɪz/",
            "rule": "Phát âm là /ɪz/ khi từ tận cùng bằng các âm xuýt: /s/, /z/, /ʃ/, /tʃ/, /ʒ/, /dʒ/ (thường tận cùng là s, ss, ch, sh, x, z, ge, ce).",
            "examples": "kisses /ˈkɪsɪz/, watches /ˈwɒtʃɪz/, washes /ˈwɒʃɪz/, boxes /ˈbɒksɪz/, changes /ˈtʃeɪndʒɪz/, places /ˈpleɪsɪz/"
        },
        {
            "sound": "/s/",
            "rule": "Phát âm là /s/ khi từ tận cùng bằng các âm vô thanh: /p/, /k/, /f/, /t/, /θ/ (mẹo nhớ: 'thời phong kiến phương Tây').",
            "examples": "stops /stɒps/, books /bʊks/, cats /kæts/, laughs /lɑːfs/, months /mʌnθs/, roofs /ruːfs/"
        },
        {
            "sound": "/z/",
            "rule": "Phát âm là /z/ khi từ tận cùng bằng các nguyên âm và phụ âm hữu thanh còn lại.",
            "examples": "plays /pleɪz/, dogs /dɒɡz/, pens /penz/, lives /lɪvz/, windows /ˈwɪndəʊz/, tables /ˈteɪblz/"
        },
        {
            "sound": "Ngoại lệ",
            "rule": "Từ 'house' /ˈhaʊs/ khi thêm 's' đổi thành 'houses' /ˈhaʊzɪz/ (/ɪz/). Từ 'says' phát âm là /sez/.",
            "examples": "houses /ˈhaʊzɪz/, says /sez/"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 70: Nguyên âm đơn & đôi (15 questions)
# -------------------------------------------------------------
q70 = [
    {
        "id": "70_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_1_1", "text": "great", "html": "gr<u>ea</u>t"},
            {"id": "70_1_2", "text": "meat", "html": "m<u>ea</u>t"},
            {"id": "70_1_3", "text": "beach", "html": "b<u>ea</u>ch"},
            {"id": "70_1_4", "text": "team", "html": "t<u>ea</u>m"}
        ],
        "correctChoiceId": "70_1_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"great\"</strong> được phát âm là <strong>/eɪ/</strong>, các từ còn lại phát âm là <strong>/iː/</strong>.</p><ul><li><strong>great</strong> /ɡreɪt/</li><li><strong>meat</strong> /miːt/</li><li><strong>beach</strong> /biːtʃ/</li><li><strong>team</strong> /tiːm/</li></ul>",
        "ruleTip": "Nhóm từ đặc biệt 'great', 'break', 'steak' có 'ea' phát âm là /eɪ/, khác với 'ea' thường phát âm là /iː/."
    },
    {
        "id": "70_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_2_1", "text": "blood", "html": "bl<u>oo</u>d"},
            {"id": "70_2_2", "text": "moon", "html": "m<u>oo</u>n"},
            {"id": "70_2_3", "text": "food", "html": "f<u>oo</u>d"},
            {"id": "70_2_4", "text": "noon", "html": "n<u>oo</u>n"}
        ],
        "correctChoiceId": "70_2_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"blood\"</strong> được phát âm là <strong>/ʌ/</strong>, các từ còn lại phát âm là <strong>/uː/</strong>.</p><ul><li><strong>blood</strong> /blʌd/</li><li><strong>moon</strong> /muːn/</li><li><strong>food</strong> /fuːd/</li><li><strong>noon</strong> /nuːn/</li></ul>",
        "ruleTip": "'blood' và 'flood' là hai từ đặc biệt có 'oo' phát âm là /ʌ/, trong khi hầu hết các từ 'oo' còn lại phát âm là /uː/ hoặc /ʊ/."
    },
    {
        "id": "70_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_3_1", "text": "busy", "html": "b<u>u</u>sy"},
            {"id": "70_3_2", "text": "bus", "html": "b<u>u</u>s"},
            {"id": "70_3_3", "text": "sun", "html": "s<u>u</u>n"},
            {"id": "70_3_4", "text": "cup", "html": "c<u>u</u>p"}
        ],
        "correctChoiceId": "70_3_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"busy\"</strong> được phát âm là <strong>/ɪ/</strong>, các từ còn lại phát âm là <strong>/ʌ/</strong>.</p><ul><li><strong>busy</strong> /ˈbɪzi/</li><li><strong>bus</strong> /bʌs/</li><li><strong>sun</strong> /sʌn/</li><li><strong>cup</strong> /kʌp/</li></ul>",
        "ruleTip": "Chữ 'u' trong 'busy' phát âm là /ɪ/ (/ˈbɪzi/), trong khi 'bus', 'sun', 'cup' phát âm là /ʌ/."
    },
    {
        "id": "70_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_4_1", "text": "head", "html": "h<u>ea</u>d"},
            {"id": "70_4_2", "text": "bread", "html": "br<u>ea</u>d"},
            {"id": "70_4_3", "text": "heavy", "html": "h<u>ea</u>vy"},
            {"id": "70_4_4", "text": "clean", "html": "cl<u>ea</u>n"}
        ],
        "correctChoiceId": "70_4_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"clean\"</strong> được phát âm là <strong>/iː/</strong>, các từ còn lại phát âm là <strong>/e/</strong>.</p><ul><li><strong>clean</strong> /kliːn/</li><li><strong>head</strong> /hed/</li><li><strong>bread</strong> /bred/</li><li><strong>heavy</strong> /ˈhevi/</li></ul>",
        "ruleTip": "'clean' có 'ea' phát âm là /iː/, trong khi 'head', 'bread', 'heavy' có 'ea' phát âm là /e/."
    },
    {
        "id": "70_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_5_1", "text": "mind", "html": "m<u>i</u>nd"},
            {"id": "70_5_2", "text": "find", "html": "f<u>i</u>nd"},
            {"id": "70_5_3", "text": "drive", "html": "dr<u>i</u>ve"},
            {"id": "70_5_4", "text": "live", "html": "l<u>i</u>ve"}
        ],
        "correctChoiceId": "70_5_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"live\"</strong> được phát âm là <strong>/ɪ/</strong>, các từ còn lại phát âm là <strong>/aɪ/</strong>.</p><ul><li><strong>live</strong> /lɪv/ (động từ)</li><li><strong>mind</strong> /maɪnd/</li><li><strong>find</strong> /faɪnd/</li><li><strong>drive</strong> /draɪv/</li></ul>",
        "ruleTip": "Động từ 'live' phát âm là /lɪv/ (nguyên âm ngắn /ɪ/), trong khi 'mind', 'find', 'drive' có nguyên âm đôi /aɪ/."
    },
    {
        "id": "70_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_6_1", "text": "cow", "html": "c<u>ow</u>"},
            {"id": "70_6_2", "text": "how", "html": "h<u>ow</u>"},
            {"id": "70_6_3", "text": "now", "html": "n<u>ow</u>"},
            {"id": "70_6_4", "text": "slow", "html": "sl<u>ow</u>"}
        ],
        "correctChoiceId": "70_6_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"slow\"</strong> được phát âm là <strong>/əʊ/</strong>, các từ còn lại phát âm là <strong>/aʊ/</strong>.</p><ul><li><strong>slow</strong> /sləʊ/</li><li><strong>cow</strong> /kaʊ/</li><li><strong>how</strong> /haʊ/</li><li><strong>now</strong> /naʊ/</li></ul>",
        "ruleTip": "'slow' có 'ow' phát âm là /əʊ/, trong khi 'cow', 'how', 'now' có 'ow' phát âm là /aʊ/."
    },
    {
        "id": "70_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_7_1", "text": "bed", "html": "b<u>e</u>d"},
            {"id": "70_7_2", "text": "send", "html": "s<u>e</u>nd"},
            {"id": "70_7_3", "text": "pencil", "html": "p<u>e</u>ncil"},
            {"id": "70_7_4", "text": "scene", "html": "sc<u>e</u>ne"}
        ],
        "correctChoiceId": "70_7_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"scene\"</strong> được phát âm là <strong>/iː/</strong>, các từ còn lại phát âm là <strong>/e/</strong>.</p><ul><li><strong>scene</strong> /siːn/</li><li><strong>bed</strong> /bed/</li><li><strong>send</strong> /send/</li><li><strong>pencil</strong> /ˈpensl/</li></ul>",
        "ruleTip": "'scene' phát âm là /siːn/ (nguyên âm dài /iː/), còn 'bed', 'send', 'pencil' phát âm là /e/."
    },
    {
        "id": "70_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_8_1", "text": "book", "html": "b<u>oo</u>k"},
            {"id": "70_8_2", "text": "look", "html": "l<u>oo</u>k"},
            {"id": "70_8_3", "text": "foot", "html": "f<u>oo</u>t"},
            {"id": "70_8_4", "text": "boot", "html": "b<u>oo</u>t"}
        ],
        "correctChoiceId": "70_8_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"boot\"</strong> được phát âm là <strong>/uː/</strong>, các từ còn lại phát âm là <strong>/ʊ/</strong>.</p><ul><li><strong>boot</strong> /buːt/</li><li><strong>book</strong> /bʊk/</li><li><strong>look</strong> /lʊk/</li><li><strong>foot</strong> /fʊt/</li></ul>",
        "ruleTip": "'boot' có 'oo' phát âm là âm dài /uː/, trong khi 'book', 'look', 'foot' có 'oo' phát âm là âm ngắn /ʊ/."
    },
    {
        "id": "70_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_9_1", "text": "cat", "html": "c<u>a</u>t"},
            {"id": "70_9_2", "text": "hat", "html": "h<u>a</u>t"},
            {"id": "70_9_3", "text": "dad", "html": "d<u>a</u>d"},
            {"id": "70_9_4", "text": "father", "html": "f<u>a</u>ther"}
        ],
        "correctChoiceId": "70_9_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"father\"</strong> được phát âm là <strong>/ɑː/</strong>, các từ còn lại phát âm là <strong>/æ/</strong>.</p><ul><li><strong>father</strong> /ˈfɑːðə/</li><li><strong>cat</strong> /kæt/</li><li><strong>hat</strong> /hæt/</li><li><strong>dad</strong> /dæd/</li></ul>",
        "ruleTip": "'father' có 'a' phát âm là /ɑː/ (/ˈfɑːðə/), các từ 'cat', 'hat', 'dad' có 'a' phát âm là /æ/."
    },
    {
        "id": "70_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_10_1", "text": "come", "html": "c<u>o</u>me"},
            {"id": "70_10_2", "text": "love", "html": "l<u>o</u>ve"},
            {"id": "70_10_3", "text": "mother", "html": "m<u>o</u>ther"},
            {"id": "70_10_4", "text": "home", "html": "h<u>o</u>me"}
        ],
        "correctChoiceId": "70_10_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"home\"</strong> được phát âm là <strong>/əʊ/</strong>, các từ còn lại phát âm là <strong>/ʌ/</strong>.</p><ul><li><strong>home</strong> /həʊm/</li><li><strong>come</strong> /kʌm/</li><li><strong>love</strong> /lʌv/</li><li><strong>mother</strong> /ˈmʌðə/</li></ul>",
        "ruleTip": "'home' phát âm là /həʊm/ (nguyên âm đôi /əʊ/), còn 'come', 'love', 'mother' có 'o' phát âm là /ʌ/."
    },
    {
        "id": "70_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_11_1", "text": "plane", "html": "pl<u>a</u>ne"},
            {"id": "70_11_2", "text": "date", "html": "d<u>a</u>te"},
            {"id": "70_11_3", "text": "make", "html": "m<u>a</u>ke"},
            {"id": "70_11_4", "text": "hat", "html": "h<u>a</u>t"}
        ],
        "correctChoiceId": "70_11_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"hat\"</strong> được phát âm là <strong>/æ/</strong>, các từ còn lại phát âm là <strong>/eɪ/</strong>.</p><ul><li><strong>hat</strong> /hæt/</li><li><strong>plane</strong> /pleɪn/</li><li><strong>date</strong> /deɪt/</li><li><strong>make</strong> /meɪk/</li></ul>",
        "ruleTip": "'hat' có 'a' phát âm là /æ/, trong khi 'plane', 'date', 'make' có 'a' phát âm là /eɪ/."
    },
    {
        "id": "70_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_12_1", "text": "hear", "html": "h<u>ear</u>"},
            {"id": "70_12_2", "text": "clear", "html": "cl<u>ear</u>"},
            {"id": "70_12_3", "text": "near", "html": "n<u>ear</u>"},
            {"id": "70_12_4", "text": "bear", "html": "b<u>ear</u>"}
        ],
        "correctChoiceId": "70_12_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"bear\"</strong> được phát âm là <strong>/eə/</strong>, các từ còn lại phát âm là <strong>/ɪə/</strong>.</p><ul><li><strong>bear</strong> /beə/</li><li><strong>hear</strong> /hɪə/</li><li><strong>clear</strong> /klɪə/</li><li><strong>near</strong> /nɪə/</li></ul>",
        "ruleTip": "'bear' có 'ear' phát âm là /eə/, trong khi 'hear', 'clear', 'near' phát âm là /ɪə/."
    },
    {
        "id": "70_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_13_1", "text": "though", "html": "th<u>ough</u>"},
            {"id": "70_13_2", "text": "thought", "html": "th<u>ought</u>"},
            {"id": "70_13_3", "text": "bought", "html": "b<u>ought</u>"},
            {"id": "70_13_4", "text": "fought", "html": "f<u>ought</u>"}
        ],
        "correctChoiceId": "70_13_1",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"though\"</strong> được phát âm là <strong>/əʊ/</strong>, các từ còn lại phát âm là <strong>/ɔː/</strong>.</p><ul><li><strong>though</strong> /ðəʊ/</li><li><strong>thought</strong> /θɔːt/</li><li><strong>bought</strong> /bɔːt/</li><li><strong>fought</strong> /fɔːt/</li></ul>",
        "ruleTip": "'though' phát âm là /ðəʊ/ (/əʊ/), trong khi 'thought', 'bought', 'fought' có 'ough/ought' phát âm là /ɔː/."
    },
    {
        "id": "70_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_14_1", "text": "sound", "html": "s<u>ou</u>nd"},
            {"id": "70_14_2", "text": "cloud", "html": "cl<u>ou</u>d"},
            {"id": "70_14_3", "text": "house", "html": "h<u>ou</u>se"},
            {"id": "70_14_4", "text": "country", "html": "c<u>ou</u>ntry"}
        ],
        "correctChoiceId": "70_14_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"country\"</strong> được phát âm là <strong>/ʌ/</strong>, các từ còn lại phát âm là <strong>/aʊ/</strong>.</p><ul><li><strong>country</strong> /ˈkʌntri/</li><li><strong>sound</strong> /saʊnd/</li><li><strong>cloud</strong> /klaʊd/</li><li><strong>house</strong> /haʊs/</li></ul>",
        "ruleTip": "'country' có 'ou' phát âm là /ʌ/ (/ˈkʌntri/), trong khi 'sound', 'cloud', 'house' phát âm là /aʊ/."
    },
    {
        "id": "70_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "70_15_1", "text": "hit", "html": "h<u>i</u>t"},
            {"id": "70_15_2", "text": "sit", "html": "s<u>i</u>t"},
            {"id": "70_15_3", "text": "kid", "html": "k<u>i</u>d"},
            {"id": "70_15_4", "text": "bike", "html": "b<u>i</u>ke"}
        ],
        "correctChoiceId": "70_15_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"bike\"</strong> được phát âm là <strong>/aɪ/</strong>, các từ còn lại phát âm là <strong>/ɪ/</strong>.</p><ul><li><strong>bike</strong> /baɪk/</li><li><strong>hit</strong> /hɪt/</li><li><strong>sit</strong> /sɪt/</li><li><strong>kid</strong> /kɪd/</li></ul>",
        "ruleTip": "'bike' có 'i' phát âm là /aɪ/, trong khi 'hit', 'sit', 'kid' có 'i' phát âm là /ɪ/."
    }
]

theory70 = {
    "topicId": 70,
    "topicName": "Nguyên âm đơn & đôi",
    "englishName": "Monophthongs and Diphthongs",
    "rules": [
        {
            "sound": "/iː/ vs /ɪ/",
            "rule": "Nguyên âm dài /iː/ (căng miệng cười) vs ngắn /ɪ/ (thả lỏng). 'ea' và 'ee' thường đọc là /iː/ (clean, meet), nhưng 'head', 'bread' đọc là /e/.",
            "examples": "seat /siːt/ vs sit /sɪt/; sheep /ʃiːp/ vs ship /ʃɪp/; clean /kliːn/ vs live /lɪv/"
        },
        {
            "sound": "/e/ vs /æ/",
            "rule": "Âm /e/ (mở miệng vừa phải) vs /æ/ (hạ cằm, mở rộng miệng hết cỡ).",
            "examples": "bed /bed/ vs bad /bæd/; men /men/ vs man /mæn/; pen /pen/ vs pan /pæn/"
        },
        {
            "sound": "/uː/ vs /ʊ/",
            "rule": "Chữ 'oo' thường phát âm là /uː/ dài (moon, food, spoon) hoặc /ʊ/ ngắn (book, look, foot, cook). Ngoại lệ cực quan trọng: 'blood' và 'flood' phát âm là /ʌ/.",
            "examples": "food /fuːd/, book /bʊk/, blood /blʌd/, flood /flʌd/"
        },
        {
            "sound": "/eɪ/ đặc biệt",
            "rule": "Ba từ cực kỳ phổ biến trong đề thi có 'ea' phát âm là /eɪ/ thay vì /iː/ hoặc /e/: great, break, steak.",
            "examples": "great /ɡreɪt/, break /breɪk/, steak /steɪk/"
        },
        {
            "sound": "/aʊ/ vs /əʊ/",
            "rule": "Vần 'ow' và 'ou' phát âm là /aʊ/ (cow, now, house, out) hoặc /əʊ/ (slow, know, bowl, though).",
            "examples": "now /naʊ/ vs know /nəʊ/; shout /ʃaʊt/ vs soul /səʊl/"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 72: Phụ âm & Âm câm (15 questions)
# -------------------------------------------------------------
q72 = [
    {
        "id": "72_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_1_1", "text": "think", "html": "<u>th</u>ink"},
            {"id": "72_1_2", "text": "thank", "html": "<u>th</u>ank"},
            {"id": "72_1_3", "text": "thick", "html": "<u>th</u>ick"},
            {"id": "72_1_4", "text": "this", "html": "<u>th</u>is"}
        ],
        "correctChoiceId": "72_1_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"this\"</strong> được phát âm là <strong>/ð/</strong>, các từ còn lại phát âm là <strong>/θ/</strong>.</p><ul><li><strong>this</strong> /ðɪs/</li><li><strong>think</strong> /θɪŋk/</li><li><strong>thank</strong> /θæŋk/</li><li><strong>thick</strong> /θɪk/</li></ul>",
        "ruleTip": "Đại từ chỉ định 'this', 'that', 'these', 'those' có 'th' phát âm là /ð/, còn danh từ/tính từ thường (think, thank, thick) phát âm là /θ/."
    },
    {
        "id": "72_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_2_1", "text": "chair", "html": "<u>ch</u>air"},
            {"id": "72_2_2", "text": "cheap", "html": "<u>ch</u>eap"},
            {"id": "72_2_3", "text": "child", "html": "<u>ch</u>ild"},
            {"id": "72_2_4", "text": "chemistry", "html": "<u>ch</u>emistry"}
        ],
        "correctChoiceId": "72_2_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"chemistry\"</strong> được phát âm là <strong>/k/</strong>, các từ còn lại phát âm là <strong>/tʃ/</strong>.</p><ul><li><strong>chemistry</strong> /ˈkemɪstri/</li><li><strong>chair</strong> /tʃeə/</li><li><strong>cheap</strong> /tʃiːp/</li><li><strong>child</strong> /tʃaɪld/</li></ul>",
        "ruleTip": "'chemistry' là từ gốc Hy Lạp có 'ch' phát âm là /k/, trong khi các từ thuần Anh (chair, cheap, child) phát âm là /tʃ/."
    },
    {
        "id": "72_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_3_1", "text": "school", "html": "s<u>ch</u>ool"},
            {"id": "72_3_2", "text": "scholar", "html": "s<u>ch</u>olar"},
            {"id": "72_3_3", "text": "ache", "html": "a<u>ch</u>e"},
            {"id": "72_3_4", "text": "chocolate", "html": "<u>ch</u>ocolate"}
        ],
        "correctChoiceId": "72_3_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"chocolate\"</strong> được phát âm là <strong>/tʃ/</strong>, các từ còn lại phát âm là <strong>/k/</strong>.</p><ul><li><strong>chocolate</strong> /ˈtʃɒklət/</li><li><strong>school</strong> /skuːl/</li><li><strong>scholar</strong> /ˈskɒlə/</li><li><strong>ache</strong> /eɪk/</li></ul>",
        "ruleTip": "'chocolate' có 'ch' phát âm là /tʃ/, trong khi 'school', 'scholar', 'ache' có 'ch' phát âm là /k/."
    },
    {
        "id": "72_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_4_1", "text": "machine", "html": "ma<u>ch</u>ine"},
            {"id": "72_4_2", "text": "chef", "html": "<u>ch</u>ef"},
            {"id": "72_4_3", "text": "parachute", "html": "para<u>ch</u>ute"},
            {"id": "72_4_4", "text": "children", "html": "<u>ch</u>ildren"}
        ],
        "correctChoiceId": "72_4_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"children\"</strong> được phát âm là <strong>/tʃ/</strong>, các từ còn lại phát âm là <strong>/ʃ/</strong>.</p><ul><li><strong>children</strong> /ˈtʃɪldrən/</li><li><strong>machine</strong> /məˈʃiːn/</li><li><strong>chef</strong> /ʃef/</li><li><strong>parachute</strong> /ˈpærəʃuːt/</li></ul>",
        "ruleTip": "Các từ mượn gốc Pháp 'machine', 'chef', 'parachute' có 'ch' phát âm là /ʃ/, còn 'children' phát âm là /tʃ/."
    },
    {
        "id": "72_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_5_1", "text": "knife", "html": "<u>k</u>nife"},
            {"id": "72_5_2", "text": "knock", "html": "<u>k</u>nock"},
            {"id": "72_5_3", "text": "knee", "html": "<u>k</u>nee"},
            {"id": "72_5_4", "text": "kettle", "html": "<u>k</u>ettle"}
        ],
        "correctChoiceId": "72_5_4",
        "explanation": "<p>Chữ cái <strong>\"k\"</strong> trong <strong>\"kettle\"</strong> được phát âm là <strong>/k/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>kettle</strong> /ˈketl/</li><li><strong>knife</strong> /naɪf/ (k câm)</li><li><strong>knock</strong> /nɒk/ (k câm)</li><li><strong>knee</strong> /niː/ (k câm)</li></ul>",
        "ruleTip": "Chữ 'k' đứng trước chữ 'n' ở đầu từ luôn là âm câm (knife, knock, knee). Trong 'kettle', 'k' phát âm là /k/."
    },
    {
        "id": "72_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_6_1", "text": "climb", "html": "clim<u>b</u>"},
            {"id": "72_6_2", "text": "comb", "html": "com<u>b</u>"},
            {"id": "72_6_3", "text": "lamb", "html": "lam<u>b</u>"},
            {"id": "72_6_4", "text": "table", "html": "ta<u>b</u>le"}
        ],
        "correctChoiceId": "72_6_4",
        "explanation": "<p>Chữ cái <strong>\"b\"</strong> trong <strong>\"table\"</strong> được phát âm là <strong>/b/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>table</strong> /ˈteɪbl/</li><li><strong>climb</strong> /klaɪm/ (b câm)</li><li><strong>comb</strong> /kəʊm/ (b câm)</li><li><strong>lamb</strong> /læm/ (b câm)</li></ul>",
        "ruleTip": "Chữ 'b' đứng sau chữ 'm' ở cuối từ là âm câm (climb, comb, lamb). Trong 'table', 'b' phát âm là /b/."
    },
    {
        "id": "72_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_7_1", "text": "hour", "html": "<u>h</u>our"},
            {"id": "72_7_2", "text": "honest", "html": "<u>h</u>onest"},
            {"id": "72_7_3", "text": "honour", "html": "<u>h</u>onour"},
            {"id": "72_7_4", "text": "house", "html": "<u>h</u>ouse"}
        ],
        "correctChoiceId": "72_7_4",
        "explanation": "<p>Chữ cái <strong>\"h\"</strong> trong <strong>\"house\"</strong> được phát âm là <strong>/h/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>house</strong> /haʊs/</li><li><strong>hour</strong> /ˈaʊə/ (h câm)</li><li><strong>honest</strong> /ˈɒnɪst/ (h câm)</li><li><strong>honour</strong> /ˈɒnə/ (h câm)</li></ul>",
        "ruleTip": "Các từ đặc biệt 'hour', 'honest', 'honour' có âm 'h' câm, còn 'house' có 'h' phát âm là /h/."
    },
    {
        "id": "72_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_8_1", "text": "write", "html": "<u>w</u>rite"},
            {"id": "72_8_2", "text": "wrong", "html": "<u>w</u>rong"},
            {"id": "72_8_3", "text": "wrap", "html": "<u>w</u>rap"},
            {"id": "72_8_4", "text": "window", "html": "<u>w</u>indow"}
        ],
        "correctChoiceId": "72_8_4",
        "explanation": "<p>Chữ cái <strong>\"w\"</strong> trong <strong>\"window\"</strong> được phát âm là <strong>/w/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>window</strong> /ˈwɪndəʊ/</li><li><strong>write</strong> /raɪt/ (w câm)</li><li><strong>wrong</strong> /rɒŋ/ (w câm)</li><li><strong>wrap</strong> /ræp/ (w câm)</li></ul>",
        "ruleTip": "Chữ 'w' đứng trước 'r' ở đầu từ luôn là âm câm (write, wrong, wrap). Trong 'window', 'w' phát âm là /w/."
    },
    {
        "id": "72_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_9_1", "text": "fast", "html": "fas<u>t</u>"},
            {"id": "72_9_2", "text": "castle", "html": "cas<u>t</u>le"},
            {"id": "72_9_3", "text": "listen", "html": "lis<u>t</u>en"},
            {"id": "72_9_4", "text": "whistle", "html": "whis<u>t</u>le"}
        ],
        "correctChoiceId": "72_9_1",
        "explanation": "<p>Chữ cái <strong>\"t\"</strong> trong <strong>\"fast\"</strong> được phát âm là <strong>/t/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>fast</strong> /fɑːst/</li><li><strong>castle</strong> /ˈkɑːsl/ (t câm)</li><li><strong>listen</strong> /ˈlɪsn/ (t câm)</li><li><strong>whistle</strong> /ˈwɪsl/ (t câm)</li></ul>",
        "ruleTip": "Chữ 't' trong 'castle', 'listen', 'whistle' là âm câm. Trong 'fast', 't' phát âm là /t/."
    },
    {
        "id": "72_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_10_1", "text": "laugh", "html": "lau<u>gh</u>"},
            {"id": "72_10_2", "text": "cough", "html": "cou<u>gh</u>"},
            {"id": "72_10_3", "text": "enough", "html": "enou<u>gh</u>"},
            {"id": "72_10_4", "text": "through", "html": "throu<u>gh</u>"}
        ],
        "correctChoiceId": "72_10_4",
        "explanation": "<p>Đuôi <strong>\"gh\"</strong> trong <strong>\"through\"</strong> là âm câm, các từ còn lại phát âm là <strong>/f/</strong>.</p><ul><li><strong>through</strong> /θruː/ (gh câm)</li><li><strong>laugh</strong> /lɑːf/</li><li><strong>cough</strong> /kɒf/</li><li><strong>enough</strong> /ɪˈnʌf/</li></ul>",
        "ruleTip": "'through' có 'gh' câm (/θruː/), trong khi 'laugh', 'cough', 'enough' có 'gh' phát âm là /f/."
    },
    {
        "id": "72_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_11_1", "text": "city", "html": "<u>c</u>ity"},
            {"id": "72_11_2", "text": "circle", "html": "<u>c</u>ircle"},
            {"id": "72_11_3", "text": "cinema", "html": "<u>c</u>inema"},
            {"id": "72_11_4", "text": "cook", "html": "<u>c</u>ook"}
        ],
        "correctChoiceId": "72_11_4",
        "explanation": "<p>Chữ cái <strong>\"c\"</strong> trong <strong>\"cook\"</strong> được phát âm là <strong>/k/</strong>, các từ còn lại phát âm là <strong>/s/</strong>.</p><ul><li><strong>cook</strong> /kʊk/</li><li><strong>city</strong> /ˈsɪti/</li><li><strong>circle</strong> /ˈsɜːkl/</li><li><strong>cinema</strong> /ˈsɪnəmə/</li></ul>",
        "ruleTip": "Chữ 'c' đứng trước 'e', 'i', 'y' phát âm là /s/ (city, circle, cinema). Đứng trước 'a', 'o', 'u' phát âm là /k/ (cook, cat, cup)."
    },
    {
        "id": "72_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_12_1", "text": "gentle", "html": "<u>g</u>entle"},
            {"id": "72_12_2", "text": "giant", "html": "<u>g</u>iant"},
            {"id": "72_12_3", "text": "gym", "html": "<u>g</u>ym"},
            {"id": "72_12_4", "text": "garden", "html": "<u>g</u>arden"}
        ],
        "correctChoiceId": "72_12_4",
        "explanation": "<p>Chữ cái <strong>\"g\"</strong> trong <strong>\"garden\"</strong> được phát âm là <strong>/ɡ/</strong>, các từ còn lại phát âm là <strong>/dʒ/</strong>.</p><ul><li><strong>garden</strong> /ˈɡɑːdn/</li><li><strong>gentle</strong> /ˈdʒentl/</li><li><strong>giant</strong> /ˈdʒaɪənt/</li><li><strong>gym</strong> /dʒɪm/</li></ul>",
        "ruleTip": "Chữ 'g' đứng trước 'e', 'i', 'y' thường phát âm là /dʒ/ (gentle, giant, gym). Trong 'garden', 'g' phát âm là /ɡ/."
    },
    {
        "id": "72_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_13_1", "text": "breathe", "html": "brea<u>th</u>e"},
            {"id": "72_13_2", "text": "weather", "html": "wea<u>th</u>er"},
            {"id": "72_13_3", "text": "feather", "html": "fea<u>th</u>er"},
            {"id": "72_13_4", "text": "breath", "html": "brea<u>th</u>"}
        ],
        "correctChoiceId": "72_13_4",
        "explanation": "<p>Phần gạch chân trong từ <strong>\"breath\"</strong> được phát âm là <strong>/θ/</strong>, các từ còn lại phát âm là <strong>/ð/</strong>.</p><ul><li><strong>breath</strong> /breθ/ (danh từ)</li><li><strong>breathe</strong> /briːð/ (động từ)</li><li><strong>weather</strong> /ˈweðə/</li><li><strong>feather</strong> /ˈfeðə/</li></ul>",
        "ruleTip": "Danh từ 'breath' phát âm là /breθ/ (/θ/), trong khi động từ 'breathe' và danh từ 'weather', 'feather' có 'th' phát âm là /ð/."
    },
    {
        "id": "72_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_14_1", "text": "sure", "html": "<u>s</u>ure"},
            {"id": "72_14_2", "text": "sugar", "html": "<u>s</u>ugar"},
            {"id": "72_14_3", "text": "special", "html": "<u>s</u>pecial"},
            {"id": "72_14_4", "text": "see", "html": "<u>s</u>ee"}
        ],
        "correctChoiceId": "72_14_4",
        "explanation": "<p>Chữ cái <strong>\"s\"</strong> trong <strong>\"see\"</strong> được phát âm là <strong>/s/</strong>, các từ còn lại phát âm là <strong>/ʃ/</strong>.</p><ul><li><strong>see</strong> /siː/</li><li><strong>sure</strong> /ʃɔː/</li><li><strong>sugar</strong> /ˈʃʊɡə/</li><li><strong>special</strong> /ˈspeʃl/</li></ul>",
        "ruleTip": "'sure' và 'sugar' là hai từ đặc biệt có chữ 's' phát âm là /ʃ/. 'see' có chữ 's' phát âm là /s/."
    },
    {
        "id": "72_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose underlined part is pronounced differently from that of the others.</strong></p>",
        "choices": [
            {"id": "72_15_1", "text": "half", "html": "ha<u>l</u>f"},
            {"id": "72_15_2", "text": "calm", "html": "ca<u>l</u>m"},
            {"id": "72_15_3", "text": "talk", "html": "ta<u>l</u>k"},
            {"id": "72_15_4", "text": "milk", "html": "mi<u>l</u>k"}
        ],
        "correctChoiceId": "72_15_4",
        "explanation": "<p>Chữ cái <strong>\"l\"</strong> trong <strong>\"milk\"</strong> được phát âm là <strong>/l/</strong>, trong các từ còn lại là âm câm.</p><ul><li><strong>milk</strong> /mɪlk/</li><li><strong>half</strong> /hɑːf/ (l câm)</li><li><strong>calm</strong> /kɑːm/ (l câm)</li><li><strong>talk</strong> /tɔːk/ (l câm)</li></ul>",
        "ruleTip": "Chữ 'l' trước 'f', 'm', 'k' trong 'half', 'calm', 'talk' là âm câm. Trong 'milk', 'l' phát âm rõ ràng /l/."
    }
]

theory72 = {
    "topicId": 72,
    "topicName": "Phụ âm & Âm câm",
    "englishName": "Consonants and Silent Letters",
    "rules": [
        {
            "sound": "/θ/ vs /ð/",
            "rule": "Chữ 'th' phát âm là /θ/ (vô thanh) trong hầu hết danh từ, tính từ (think, thank, thick, month). Phát âm là /ð/ (hữu thanh) trong đại từ chỉ định và từ chức năng (this, that, these, there, they, with).",
            "examples": "think /θɪŋk/ vs this /ðɪs/; breath /breθ/ (n.) vs breathe /briːð/ (v.)"
        },
        {
            "sound": "/tʃ/ vs /k/ vs /ʃ/",
            "rule": "Chữ 'ch' phát âm là /tʃ/ trong từ thuần Anh (chair, cheap, child). Phát âm là /k/ trong từ gốc Hy Lạp (school, chemistry, character, ache, stomach). Phát âm là /ʃ/ trong từ mượn tiếng Pháp (machine, chef, parachute).",
            "examples": "church /tʃɜːtʃ/ vs school /skuːl/ vs machine /məˈʃiːn/"
        },
        {
            "sound": "/s/ vs /k/",
            "rule": "Chữ 'c' đứng trước 'e', 'i', 'y' phát âm là /s/ (city, cycle, pencil). Đứng trước 'a', 'o', 'u' hoặc phụ âm phát âm là /k/ (cat, cook, club).",
            "examples": "city /ˈsɪti/, cinema /ˈsɪnəmə/ vs cat /kæt/, cup /kʌp/"
        },
        {
            "sound": "Âm câm",
            "rule": "Các phụ âm câm hay thi vào 10:\n1. 'k' câm trước 'n' (knife, know, knee, knock)\n2. 'b' câm sau 'm' ở cuối từ (climb, comb, lamb, bomb)\n3. 'w' câm trước 'r' (write, wrong, wrap)\n4. 'h' câm trong: hour, honest, honour\n5. 't' câm trong: listen, castle, whistle, Christmas\n6. 'l' câm trong: half, calm, talk, walk",
            "examples": "knife /naɪf/, climb /klaɪm/, honest /ˈɒnɪst/, listen /ˈlɪsn/, half /hɑːf/"
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 29: Trọng âm từ 2 âm tiết (15 questions)
# -------------------------------------------------------------
q29 = [
    {
        "id": "29_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_1_1", "text": "teacher", "html": "teacher"},
            {"id": "29_1_2", "text": "student", "html": "student"},
            {"id": "29_1_3", "text": "doctor", "html": "doctor"},
            {"id": "29_1_4", "text": "police", "html": "police"}
        ],
        "correctChoiceId": "29_1_4",
        "explanation": "<p>Trọng âm của từ <strong>\"police\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/pəˈliːs/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>police</strong> /pəˈliːs/ (âm tiết 2)</li><li><strong>teacher</strong> /ˈtiːtʃə/ (âm tiết 1)</li><li><strong>student</strong> /ˈstjuːdnt/ (âm tiết 1)</li><li><strong>doctor</strong> /ˈdɒktə/ (âm tiết 1)</li></ul>",
        "ruleTip": "Hầu hết danh từ 2 âm tiết có trọng âm rơi vào âm tiết 1. Riêng từ 'police' là ngoại lệ rơi vào âm tiết 2."
    },
    {
        "id": "29_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_2_1", "text": "decide", "html": "decide"},
            {"id": "29_2_2", "text": "agree", "html": "agree"},
            {"id": "29_2_3", "text": "enjoy", "html": "enjoy"},
            {"id": "29_2_4", "text": "listen", "html": "listen"}
        ],
        "correctChoiceId": "29_2_4",
        "explanation": "<p>Trọng âm của từ <strong>\"listen\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈlɪsn/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>listen</strong> /ˈlɪsn/ (âm tiết 1)</li><li><strong>decide</strong> /dɪˈsaɪd/ (âm tiết 2)</li><li><strong>agree</strong> /əˈɡriː/ (âm tiết 2)</li><li><strong>enjoy</strong> /ɪnˈdʒɔɪ/ (âm tiết 2)</li></ul>",
        "ruleTip": "Hầu hết động từ 2 âm tiết có trọng âm rơi vào âm tiết 2. Động từ tận cùng -en, -er như 'listen', 'enter' nhấn âm 1."
    },
    {
        "id": "29_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_3_1", "text": "happy", "html": "happy"},
            {"id": "29_3_2", "text": "clever", "html": "clever"},
            {"id": "29_3_3", "text": "famous", "html": "famous"},
            {"id": "29_3_4", "text": "alone", "html": "alone"}
        ],
        "correctChoiceId": "29_3_4",
        "explanation": "<p>Trọng âm của từ <strong>\"alone\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/əˈləʊn/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>alone</strong> /əˈləʊn/ (âm tiết 2)</li><li><strong>happy</strong> /ˈhæpi/ (âm tiết 1)</li><li><strong>clever</strong> /ˈklevə/ (âm tiết 1)</li><li><strong>famous</strong> /ˈfeɪməs/ (âm tiết 1)</li></ul>",
        "ruleTip": "Tính từ 2 âm tiết thường nhấn âm 1. Tính từ bắt đầu bằng tiền tố a- (alone, alive, asleep) nhấn âm 2."
    },
    {
        "id": "29_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_4_1", "text": "arrive", "html": "arrive"},
            {"id": "29_4_2", "text": "forget", "html": "forget"},
            {"id": "29_4_3", "text": "return", "html": "return"},
            {"id": "29_4_4", "text": "open", "html": "open"}
        ],
        "correctChoiceId": "29_4_4",
        "explanation": "<p>Trọng âm của từ <strong>\"open\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈəʊpən/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>open</strong> /ˈəʊpən/ (âm tiết 1)</li><li><strong>arrive</strong> /əˈraɪv/ (âm tiết 2)</li><li><strong>forget</strong> /fəˈɡet/ (âm tiết 2)</li><li><strong>return</strong> /rɪˈtɜːn/ (âm tiết 2)</li></ul>",
        "ruleTip": "Động từ tận cùng bằng -en như 'open', 'happen', 'listen' có trọng âm rơi vào âm tiết 1."
    },
    {
        "id": "29_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_5_1", "text": "paper", "html": "paper"},
            {"id": "29_5_2", "text": "village", "html": "village"},
            {"id": "29_5_3", "text": "river", "html": "river"},
            {"id": "29_5_4", "text": "machine", "html": "machine"}
        ],
        "correctChoiceId": "29_5_4",
        "explanation": "<p>Trọng âm của từ <strong>\"machine\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/məˈʃiːn/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>machine</strong> /məˈʃiːn/ (âm tiết 2)</li><li><strong>paper</strong> /ˈpeɪpə/ (âm tiết 1)</li><li><strong>village</strong> /ˈvɪlɪdʒ/ (âm tiết 1)</li><li><strong>river</strong> /ˈrɪvə/ (âm tiết 1)</li></ul>",
        "ruleTip": "Danh từ mượn gốc Pháp như ma'chine /məˈʃiːn/ có trọng âm rơi vào âm tiết 2."
    },
    {
        "id": "29_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_6_1", "text": "relax", "html": "relax"},
            {"id": "29_6_2", "text": "explain", "html": "explain"},
            {"id": "29_6_3", "text": "protect", "html": "protect"},
            {"id": "29_6_4", "text": "visit", "html": "visit"}
        ],
        "correctChoiceId": "29_6_4",
        "explanation": "<p>Trọng âm của từ <strong>\"visit\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈvɪzɪt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>visit</strong> /ˈvɪzɪt/ (âm tiết 1)</li><li><strong>relax</strong> /rɪˈlæks/ (âm tiết 2)</li><li><strong>explain</strong> /ɪkˈspleɪn/ (âm tiết 2)</li><li><strong>protect</strong> /prəˈtekt/ (âm tiết 2)</li></ul>",
        "ruleTip": "Động từ 'visit' có trọng âm rơi vào âm tiết 1 (/ˈvɪzɪt/), các động từ 2 âm tiết thông thường nhấn âm 2."
    },
    {
        "id": "29_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_7_1", "text": "advice", "html": "advice"},
            {"id": "29_7_2", "text": "mistake", "html": "mistake"},
            {"id": "29_7_3", "text": "hotel", "html": "hotel"},
            {"id": "29_7_4", "text": "table", "html": "table"}
        ],
        "correctChoiceId": "29_7_4",
        "explanation": "<p>Trọng âm của từ <strong>\"table\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈteɪbl/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>table</strong> /ˈteɪbl/ (âm tiết 1)</li><li><strong>advice</strong> /ədˈvaɪs/ (âm tiết 2)</li><li><strong>mistake</strong> /mɪˈsteɪk/ (âm tiết 2)</li><li><strong>hotel</strong> /həʊˈtel/ (âm tiết 2)</li></ul>",
        "ruleTip": "'table' nhấn âm 1. Ba từ 'advice', 'mistake', 'hotel' là ngoại lệ danh từ 2 âm tiết nhấn âm 2."
    },
    {
        "id": "29_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_8_1", "text": "borrow", "html": "borrow"},
            {"id": "29_8_2", "text": "follow", "html": "follow"},
            {"id": "29_8_3", "text": "finish", "html": "finish"},
            {"id": "29_8_4", "text": "enjoy", "html": "enjoy"}
        ],
        "correctChoiceId": "29_8_4",
        "explanation": "<p>Trọng âm của từ <strong>\"enjoy\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/ɪnˈdʒɔɪ/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>enjoy</strong> /ɪnˈdʒɔɪ/ (âm tiết 2)</li><li><strong>borrow</strong> /ˈbɒrəʊ/ (âm tiết 1)</li><li><strong>follow</strong> /ˈfɒləʊ/ (âm tiết 1)</li><li><strong>finish</strong> /ˈfɪnɪʃ/ (âm tiết 1)</li></ul>",
        "ruleTip": "Động từ tận cùng bằng -ow, -ish ('borrow', 'follow', 'finish') nhấn âm 1. 'enjoy' nhấn âm 2."
    },
    {
        "id": "29_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_9_1", "text": "narrow", "html": "narrow"},
            {"id": "29_9_2", "text": "heavy", "html": "heavy"},
            {"id": "29_9_3", "text": "simple", "html": "simple"},
            {"id": "29_9_4", "text": "polite", "html": "polite"}
        ],
        "correctChoiceId": "29_9_4",
        "explanation": "<p>Trọng âm của từ <strong>\"polite\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/pəˈlaɪt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>polite</strong> /pəˈlaɪt/ (âm tiết 2)</li><li><strong>narrow</strong> /ˈnærəʊ/ (âm tiết 1)</li><li><strong>heavy</strong> /ˈhevi/ (âm tiết 1)</li><li><strong>simple</strong> /ˈsɪmpl/ (âm tiết 1)</li></ul>",
        "ruleTip": "Tính từ 2 âm tiết 'polite' nhấn âm 2 (/pəˈlaɪt/), các tính từ còn lại nhấn âm 1."
    },
    {
        "id": "29_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_10_1", "text": "answer", "html": "answer"},
            {"id": "29_10_2", "text": "offer", "html": "offer"},
            {"id": "29_10_3", "text": "promise", "html": "promise"},
            {"id": "29_10_4", "text": "succeed", "html": "succeed"}
        ],
        "correctChoiceId": "29_10_4",
        "explanation": "<p>Trọng âm của từ <strong>\"succeed\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/səkˈsiːd/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>succeed</strong> /səkˈsiːd/ (âm tiết 2)</li><li><strong>answer</strong> /ˈɑːnsə/ (âm tiết 1)</li><li><strong>offer</strong> /ˈɒfə/ (âm tiết 1)</li><li><strong>promise</strong> /ˈprɒmɪs/ (âm tiết 1)</li></ul>",
        "ruleTip": "'answer', 'offer', 'promise' là động từ 2 âm tiết nhấn âm 1. 'succeed' nhấn âm 2 (/səkˈsiːd/)."
    },
    {
        "id": "29_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_11_1", "text": "traffic", "html": "traffic"},
            {"id": "29_11_2", "text": "weather", "html": "weather"},
            {"id": "29_11_3", "text": "summer", "html": "summer"},
            {"id": "29_11_4", "text": "depend", "html": "depend"}
        ],
        "correctChoiceId": "29_11_4",
        "explanation": "<p>Trọng âm của từ <strong>\"depend\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/dɪˈpend/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>depend</strong> /dɪˈpend/ (âm tiết 2)</li><li><strong>traffic</strong> /ˈtræfɪk/ (âm tiết 1)</li><li><strong>weather</strong> /ˈweðə/ (âm tiết 1)</li><li><strong>summer</strong> /ˈsʌmə/ (âm tiết 1)</li></ul>",
        "ruleTip": "Động từ 'depend' có tiền tố de- nên trọng âm rơi vào âm 2. Ba danh từ còn lại nhấn âm 1."
    },
    {
        "id": "29_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_12_1", "text": "attract", "html": "attract"},
            {"id": "29_12_2", "text": "invite", "html": "invite"},
            {"id": "29_12_3", "text": "attend", "html": "attend"},
            {"id": "29_12_4", "text": "morning", "html": "morning"}
        ],
        "correctChoiceId": "29_12_4",
        "explanation": "<p>Trọng âm của từ <strong>\"morning\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈmɔːnɪŋ/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>morning</strong> /ˈmɔːnɪŋ/ (âm tiết 1)</li><li><strong>attract</strong> /əˈtrækt/ (âm tiết 2)</li><li><strong>invite</strong> /ɪnˈvaɪt/ (âm tiết 2)</li><li><strong>attend</strong> /əˈtend/ (âm tiết 2)</li></ul>",
        "ruleTip": "'morning' là danh từ nhấn âm 1, ba từ còn lại là động từ 2 âm tiết nhấn âm 2."
    },
    {
        "id": "29_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_13_1", "text": "guitar", "html": "guitar"},
            {"id": "29_13_2", "text": "canal", "html": "canal"},
            {"id": "29_13_3", "text": "police", "html": "police"},
            {"id": "29_13_4", "text": "beauty", "html": "beauty"}
        ],
        "correctChoiceId": "29_13_4",
        "explanation": "<p>Trọng âm của từ <strong>\"beauty\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈbjuːti/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>beauty</strong> /ˈbjuːti/ (âm tiết 1)</li><li><strong>guitar</strong> /ɡɪˈtɑː/ (âm tiết 2)</li><li><strong>canal</strong> /kəˈnæl/ (âm tiết 2)</li><li><strong>police</strong> /pəˈliːs/ (âm tiết 2)</li></ul>",
        "ruleTip": "'beauty' nhấn âm 1. Ba danh từ ngoại lệ 'guitar', 'canal', 'police' nhấn âm 2."
    },
    {
        "id": "29_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_14_1", "text": "healthy", "html": "healthy"},
            {"id": "29_14_2", "text": "friendly", "html": "friendly"},
            {"id": "29_14_3", "text": "lovely", "html": "lovely"},
            {"id": "29_14_4", "text": "deny", "html": "deny"}
        ],
        "correctChoiceId": "29_14_4",
        "explanation": "<p>Trọng âm của từ <strong>\"deny\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/dɪˈnaɪ/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>deny</strong> /dɪˈnaɪ/ (âm tiết 2)</li><li><strong>healthy</strong> /ˈhelθi/ (âm tiết 1)</li><li><strong>friendly</strong> /ˈfrendli/ (âm tiết 1)</li><li><strong>lovely</strong> /ˈlʌvli/ (âm tiết 1)</li></ul>",
        "ruleTip": "'deny' là động từ nhấn âm 2 (/dɪˈnaɪ/). Ba tính từ đuôi -y, -ly nhấn âm 1."
    },
    {
        "id": "29_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "29_15_1", "text": "reduce", "html": "reduce"},
            {"id": "29_15_2", "text": "provide", "html": "provide"},
            {"id": "29_15_3", "text": "destroy", "html": "destroy"},
            {"id": "29_15_4", "text": "damage", "html": "damage"}
        ],
        "correctChoiceId": "29_15_4",
        "explanation": "<p>Trọng âm của từ <strong>\"damage\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈdæmɪdʒ/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>damage</strong> /ˈdæmɪdʒ/ (âm tiết 1)</li><li><strong>reduce</strong> /rɪˈdjuːs/ (âm tiết 2)</li><li><strong>provide</strong> /prəˈvaɪd/ (âm tiết 2)</li><li><strong>destroy</strong> /dɪˈstrɔɪ/ (âm tiết 2)</li></ul>",
        "ruleTip": "Động từ 'damage' có trọng âm rơi vào âm 1 (/ˈdæmɪdʒ/), các động từ 'reduce', 'provide', 'destroy' nhấn âm 2."
    }
]

theory29 = {
    "topicId": 29,
    "topicName": "Từ có 2 âm tiết",
    "englishName": "2-syllable words stress",
    "rules": [
        {
            "rule": "Quy tắc 1: Đa số danh từ và tính từ có 2 âm tiết thì trọng âm rơi vào âm tiết thứ 1.",
            "formula": "DANH TỪ / TÍNH TỪ 2 ÂM TIẾT ➔ TRỌNG ÂM 1",
            "examples": "DANH TỪ: 'table, 'window, 'father, 'paper, 'village, 'weather. TÍNH TỪ: 'happy, 'clever, 'busy, 'famous, 'simple, 'narrow."
        },
        {
            "rule": "Quy tắc 2: Đa số động từ có 2 âm tiết thì trọng âm rơi vào âm tiết thứ 2.",
            "formula": "ĐỘNG TỪ 2 ÂM TIẾT ➔ TRỌNG ÂM 2",
            "examples": "de'cide, a'gree, en'joy, re'lax, at'tract, be'gin, re'ceive, for'get, ex'plain, pro'tect."
        },
        {
            "rule": "Quy tắc 3: Động từ có âm tiết thứ 2 kết thúc bằng -en, -er, -el, -ow, -ish có trọng âm rơi vào âm tiết thứ 1.",
            "formula": "V + (-en, -er, -ow, -ish) ➔ TRỌNG ÂM 1",
            "examples": "'listen, 'enter, 'open, 'happen, 'visit, 'borrow, 'follow, 'finish."
        },
        {
            "rule": "Ngoại lệ cực kỳ quan trọng thi vào 10:",
            "formula": "DANH TỪ NHẤN ÂM 2 & ĐỘNG TỪ NHẤN ÂM 1",
            "examples": "Danh từ nhấn âm 2: po'lice, mis'take, a'dvice, ma'chine, ho'tel, gui'tar. Động từ nhấn âm 1: 'listen, 'visit, 'open, 'happen, 'borrow, 'answer, 'offer, 'promise."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 30: Trọng âm từ 3 âm tiết (15 questions)
# -------------------------------------------------------------
q30 = [
    {
        "id": "30_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_1_1", "text": "family", "html": "family"},
            {"id": "30_1_2", "text": "animal", "html": "animal"},
            {"id": "30_1_3", "text": "cinema", "html": "cinema"},
            {"id": "30_1_4", "text": "decision", "html": "decision"}
        ],
        "correctChoiceId": "30_1_4",
        "explanation": "<p>Trọng âm của từ <strong>\"decision\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/dɪˈsɪʒn/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>decision</strong> /dɪˈsɪʒn/ (âm tiết 2)</li><li><strong>family</strong> /ˈfæməli/ (âm tiết 1)</li><li><strong>animal</strong> /ˈænɪml/ (âm tiết 1)</li><li><strong>cinema</strong> /ˈsɪnəmə/ (âm tiết 1)</li></ul>",
        "ruleTip": "Hậu tố -ion (decision, pollution) làm trọng âm rơi vào âm tiết ngay trước nó (âm 2)."
    },
    {
        "id": "30_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_2_1", "text": "beautiful", "html": "beautiful"},
            {"id": "30_2_2", "text": "dangerous", "html": "dangerous"},
            {"id": "30_2_3", "text": "difficult", "html": "difficult"},
            {"id": "30_2_4", "text": "expensive", "html": "expensive"}
        ],
        "correctChoiceId": "30_2_4",
        "explanation": "<p>Trọng âm của từ <strong>\"expensive\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/ɪkˈspensɪv/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>expensive</strong> /ɪkˈspensɪv/ (âm tiết 2)</li><li><strong>beautiful</strong> /ˈbjuːtɪfl/ (âm tiết 1)</li><li><strong>dangerous</strong> /ˈdeɪndʒərəs/ (âm tiết 1)</li><li><strong>difficult</strong> /ˈdɪfɪkəlt/ (âm tiết 1)</li></ul>",
        "ruleTip": "'expensive' có hậu tố -ive nhấn âm 2 (/ɪkˈspensɪv/), ba tính từ đuôi -ful, -ous, -ult nhấn âm 1."
    },
    {
        "id": "30_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_3_1", "text": "musician", "html": "musician"},
            {"id": "30_3_2", "text": "fantastic", "html": "fantastic"},
            {"id": "30_3_3", "text": "delicious", "html": "delicious"},
            {"id": "30_3_4", "text": "hospital", "html": "hospital"}
        ],
        "correctChoiceId": "30_3_4",
        "explanation": "<p>Trọng âm của từ <strong>\"hospital\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈhɒspɪtl/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>hospital</strong> /ˈhɒspɪtl/ (âm tiết 1)</li><li><strong>musician</strong> /mjuˈzɪʃn/ (âm tiết 2)</li><li><strong>fantastic</strong> /fænˈtæstɪk/ (âm tiết 2)</li><li><strong>delicious</strong> /dɪˈlɪʃəs/ (âm tiết 2)</li></ul>",
        "ruleTip": "Hậu tố -ian (musician), -ic (fantastic), -ious (delicious) nhấn âm liền trước (âm 2). 'hospital' nhấn âm 1."
    },
    {
        "id": "30_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_4_1", "text": "volunteer", "html": "volunteer"},
            {"id": "30_4_2", "text": "engineer", "html": "engineer"},
            {"id": "30_4_3", "text": "Vietnamese", "html": "Vietnamese"},
            {"id": "30_4_4", "text": "accident", "html": "accident"}
        ],
        "correctChoiceId": "30_4_4",
        "explanation": "<p>Trọng âm của từ <strong>\"accident\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈæksɪdənt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>3</strong>.</p><ul><li><strong>accident</strong> /ˈæksɪdənt/ (âm tiết 1)</li><li><strong>volunteer</strong> /ˌvɒlənˈtɪə/ (âm tiết 3)</li><li><strong>engineer</strong> /ˌendʒɪˈnɪə/ (âm tiết 3)</li><li><strong>Vietnamese</strong> /ˌvjetnəˈmiːz/ (âm tiết 3)</li></ul>",
        "ruleTip": "Các đuôi -eer, -ese nhận trọng âm chính trên chính đuôi đó (âm 3). 'accident' nhấn âm 1."
    },
    {
        "id": "30_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_5_1", "text": "celebrate", "html": "celebrate"},
            {"id": "30_5_2", "text": "organize", "html": "organize"},
            {"id": "30_5_3", "text": "calculate", "html": "calculate"},
            {"id": "30_5_4", "text": "pollution", "html": "pollution"}
        ],
        "correctChoiceId": "30_5_4",
        "explanation": "<p>Trọng âm của từ <strong>\"pollution\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/pəˈluːʃn/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>pollution</strong> /pəˈluːʃn/ (âm tiết 2)</li><li><strong>celebrate</strong> /ˈselɪbreɪt/ (âm tiết 1)</li><li><strong>organize</strong> /ˈɔːɡənaɪz/ (âm tiết 1)</li><li><strong>calculate</strong> /ˈkælkjuleɪt/ (âm tiết 1)</li></ul>",
        "ruleTip": "Động từ 3 âm tiết tận cùng -ate, -ize nhấn âm 1 ('celebrate, 'organize). Đuôi -tion nhấn âm 2."
    },
    {
        "id": "30_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_6_1", "text": "attractive", "html": "attractive"},
            {"id": "30_6_2", "text": "historic", "html": "historic"},
            {"id": "30_6_3", "text": "impressive", "html": "impressive"},
            {"id": "30_6_4", "text": "natural", "html": "natural"}
        ],
        "correctChoiceId": "30_6_4",
        "explanation": "<p>Trọng âm của từ <strong>\"natural\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈnætʃrəl/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>natural</strong> /ˈnætʃrəl/ (âm tiết 1)</li><li><strong>attractive</strong> /əˈtræktɪv/ (âm tiết 2)</li><li><strong>historic</strong> /hɪˈstɒrɪk/ (âm tiết 2)</li><li><strong>impressive</strong> /ɪmˈpresɪv/ (âm tiết 2)</li></ul>",
        "ruleTip": "Hậu tố -ive, -ic làm trọng âm rơi vào âm liền trước (âm 2). 'natural' nhấn âm 1."
    },
    {
        "id": "30_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_7_1", "text": "tradition", "html": "tradition"},
            {"id": "30_7_2", "text": "collection", "html": "collection"},
            {"id": "30_7_3", "text": "invention", "html": "invention"},
            {"id": "30_7_4", "text": "holiday", "html": "holiday"}
        ],
        "correctChoiceId": "30_7_4",
        "explanation": "<p>Trọng âm của từ <strong>\"holiday\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈhɒlədeɪ/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>holiday</strong> /ˈhɒlədeɪ/ (âm tiết 1)</li><li><strong>tradition</strong> /trəˈdɪʃn/ (âm tiết 2)</li><li><strong>collection</strong> /kəˈlekʃn/ (âm tiết 2)</li><li><strong>invention</strong> /ɪnˈvenʃn/ (âm tiết 2)</li></ul>",
        "ruleTip": "Các từ đuôi -ion (tradition, collection, invention) nhấn âm 2. 'holiday' nhấn âm 1."
    },
    {
        "id": "30_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_8_1", "text": "fabulous", "html": "fabulous"},
            {"id": "30_8_2", "text": "terrible", "html": "terrible"},
            {"id": "30_8_3", "text": "generous", "html": "generous"},
            {"id": "30_8_4", "text": "convenient", "html": "convenient"}
        ],
        "correctChoiceId": "30_8_4",
        "explanation": "<p>Trọng âm của từ <strong>\"convenient\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/kənˈviːniənt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>convenient</strong> /kənˈviːniənt/ (âm tiết 2)</li><li><strong>fabulous</strong> /ˈfæbjələs/ (âm tiết 1)</li><li><strong>terrible</strong> /ˈterəbl/ (âm tiết 1)</li><li><strong>generous</strong> /ˈdʒenərəs/ (âm tiết 1)</li></ul>",
        "ruleTip": "'convenient' nhấn âm 2 (/kənˈviːniənt/), ba tính từ còn lại đuôi -ous, -ible nhấn âm 1."
    },
    {
        "id": "30_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_9_1", "text": "referee", "html": "referee"},
            {"id": "30_9_2", "text": "employee", "html": "employee"},
            {"id": "30_9_3", "text": "Japanese", "html": "Japanese"},
            {"id": "30_9_4", "text": "government", "html": "government"}
        ],
        "correctChoiceId": "30_9_4",
        "explanation": "<p>Trọng âm của từ <strong>\"government\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈɡʌvənmənt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>3</strong>.</p><ul><li><strong>government</strong> /ˈɡʌvənmənt/ (âm tiết 1)</li><li><strong>referee</strong> /ˌrefəˈriː/ (âm tiết 3)</li><li><strong>employee</strong> /ɪmˈplɔɪiː/ (âm tiết 3)</li><li><strong>Japanese</strong> /ˌdʒæpəˈniːz/ (âm tiết 3)</li></ul>",
        "ruleTip": "Hậu tố -ee, -ese nhận trọng âm chính (âm 3). 'government' nhấn âm 1."
    },
    {
        "id": "30_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_10_1", "text": "computer", "html": "computer"},
            {"id": "30_10_2", "text": "disaster", "html": "disaster"},
            {"id": "30_10_3", "text": "exciting", "html": "exciting"},
            {"id": "30_10_4", "text": "furniture", "html": "furniture"}
        ],
        "correctChoiceId": "30_10_4",
        "explanation": "<p>Trọng âm của từ <strong>\"furniture\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈfɜːnɪtʃə/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>furniture</strong> /ˈfɜːnɪtʃə/ (âm tiết 1)</li><li><strong>computer</strong> /kəmˈpjuːtə/ (âm tiết 2)</li><li><strong>disaster</strong> /dɪˈzɑːstə/ (âm tiết 2)</li><li><strong>exciting</strong> /ɪkˈsaɪtɪŋ/ (âm tiết 2)</li></ul>",
        "ruleTip": "'furniture' nhấn âm 1 (/ˈfɜːnɪtʃə/), các từ 'computer', 'disaster', 'exciting' nhấn âm 2."
    },
    {
        "id": "30_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_11_1", "text": "chemistry", "html": "chemistry"},
            {"id": "30_11_2", "text": "primary", "html": "primary"},
            {"id": "30_11_3", "text": "energy", "html": "energy"},
            {"id": "30_11_4", "text": "electric", "html": "electric"}
        ],
        "correctChoiceId": "30_11_4",
        "explanation": "<p>Trọng âm của từ <strong>\"electric\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/ɪˈlektrɪk/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>electric</strong> /ɪˈlektrɪk/ (âm tiết 2)</li><li><strong>chemistry</strong> /ˈkemɪstri/ (âm tiết 1)</li><li><strong>primary</strong> /ˈpraɪməri/ (âm tiết 1)</li><li><strong>energy</strong> /ˈenədʒi/ (âm tiết 1)</li></ul>",
        "ruleTip": "Từ có đuôi -ic (electric) có trọng âm rơi vào âm liền trước (âm 2). 'chemistry', 'primary', 'energy' nhấn âm 1."
    },
    {
        "id": "30_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_12_1", "text": "confident", "html": "confident"},
            {"id": "30_12_2", "text": "cultural", "html": "cultural"},
            {"id": "30_12_3", "text": "sensible", "html": "sensible"},
            {"id": "30_12_4", "text": "remember", "html": "remember"}
        ],
        "correctChoiceId": "30_12_4",
        "explanation": "<p>Trọng âm của từ <strong>\"remember\"</strong> rơi vào âm tiết thứ <strong>2</strong> (/rɪˈmembə/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>1</strong>.</p><ul><li><strong>remember</strong> /rɪˈmembə/ (âm tiết 2)</li><li><strong>confident</strong> /ˈkɒnfɪdənt/ (âm tiết 1)</li><li><strong>cultural</strong> /ˈkʌltʃərəl/ (âm tiết 1)</li><li><strong>sensible</strong> /ˈsensəbl/ (âm tiết 1)</li></ul>",
        "ruleTip": "'remember' là động từ 3 âm tiết nhấn âm 2 (/rɪˈmembə/). Ba từ còn lại nhấn âm 1."
    },
    {
        "id": "30_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_13_1", "text": "dramatic", "html": "dramatic"},
            {"id": "30_13_2", "text": "artistic", "html": "artistic"},
            {"id": "30_13_3", "text": "Pacific", "html": "Pacific"},
            {"id": "30_13_4", "text": "customer", "html": "customer"}
        ],
        "correctChoiceId": "30_13_4",
        "explanation": "<p>Trọng âm của từ <strong>\"customer\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈkʌstəmə/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>customer</strong> /ˈkʌstəmə/ (âm tiết 1)</li><li><strong>dramatic</strong> /drəˈmætɪk/ (âm tiết 2)</li><li><strong>artistic</strong> /ɑːˈtɪstɪk/ (âm tiết 2)</li><li><strong>Pacific</strong> /pəˈsɪfɪk/ (âm tiết 2)</li></ul>",
        "ruleTip": "Đuôi -ic nhấn âm ngay liền trước (dra'matic, ar'tistic, Pa'cific nhấn âm 2). 'customer' nhấn âm 1."
    },
    {
        "id": "30_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_14_1", "text": "lemonade", "html": "lemonade"},
            {"id": "30_14_2", "text": "cigarette", "html": "cigarette"},
            {"id": "30_14_3", "text": "entertain", "html": "entertain"},
            {"id": "30_14_4", "text": "history", "html": "history"}
        ],
        "correctChoiceId": "30_14_4",
        "explanation": "<p>Trọng âm của từ <strong>\"history\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈhɪstri/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>3</strong>.</p><ul><li><strong>history</strong> /ˈhɪstri/ (âm tiết 1)</li><li><strong>lemonade</strong> /ˌleməˈneɪd/ (âm tiết 3)</li><li><strong>cigarette</strong> /ˌsɪɡəˈret/ (âm tiết 3)</li><li><strong>entertain</strong> /ˌentəˈteɪn/ (âm tiết 3)</li></ul>",
        "ruleTip": "Các đuôi -ade, -ette, -ain thường nhận trọng âm (âm 3). 'history' nhấn âm 1."
    },
    {
        "id": "30_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Choose the word whose stress pattern is different from that of the others.</strong></p>",
        "choices": [
            {"id": "30_15_1", "text": "develop", "html": "develop"},
            {"id": "30_15_2", "text": "imagine", "html": "imagine"},
            {"id": "30_15_3", "text": "continue", "html": "continue"},
            {"id": "30_15_4", "text": "celebrate", "html": "celebrate"}
        ],
        "correctChoiceId": "30_15_4",
        "explanation": "<p>Trọng âm của từ <strong>\"celebrate\"</strong> rơi vào âm tiết thứ <strong>1</strong> (/ˈselɪbreɪt/), các từ còn lại có trọng âm rơi vào âm tiết thứ <strong>2</strong>.</p><ul><li><strong>celebrate</strong> /ˈselɪbreɪt/ (âm tiết 1)</li><li><strong>develop</strong> /dɪˈveləp/ (âm tiết 2)</li><li><strong>imagine</strong> /ɪˈmædʒɪn/ (âm tiết 2)</li><li><strong>continue</strong> /kənˈtɪnjuː/ (âm tiết 2)</li></ul>",
        "ruleTip": "Động từ tận cùng -ate nhấn lùi 2 âm tiết (âm 1: 'celebrate). 'develop', 'imagine', 'continue' nhấn âm 2."
    }
]

theory30 = {
    "topicId": 30,
    "topicName": "Từ có 3 âm tiết",
    "englishName": "3-syllable words stress",
    "rules": [
        {
            "rule": "Quy tắc 1 (Trọng âm 1): Đa số danh từ và tính từ 3 âm tiết có âm tiết 2 và 3 chứa nguyên âm ngắn, hoặc tận cùng bằng -ous, -ful, -al, -y, -ent.",
            "formula": "NOUN / ADJ + (-ous, -ful, -al, -y, -ent) ➔ TRỌNG ÂM 1",
            "examples": "'family, 'animal, 'cinema, 'difficult, 'dangerous, 'beautiful, 'natural, 'generous, 'confident, 'hospital."
        },
        {
            "rule": "Quy tắc 2 (Trọng âm 2): Trọng âm rơi vào âm tiết NGAY TRƯỚC các hậu tố: -tion, -sion, -ic, -ical, -ian, -ious, -ive.",
            "formula": "STEM + (-tion / -sion / -ic / -ian / -ious / -ive) ➔ TRỌNG ÂM LIỀN TRƯỚC",
            "examples": "po'llution, de'cision, fan'tastic, his'toric, mu'sician, de'licious, ex'pensive, at'tractive."
        },
        {
            "rule": "Quy tắc 3 (Trọng âm 3): Trọng âm rơi vào CHÍNH các hậu tố: -ee, -eer, -ese, -ette, -ade.",
            "formula": "STEM + (-ee / -eer / -ese / -ette / -ade) ➔ TRỌNG ÂM CHÍNH NÓ",
            "examples": "refu'gee, volun'teer, engi'neer, Vietna'mese, Japa'nese, ciga'rette, lemon'ade."
        },
        {
            "rule": "Quy tắc 4 (Động từ -ate, -ize, -fy): Động từ 3 âm tiết kết thúc bằng -ate, -ize, -fy có trọng âm dịch lùi 2 âm tiết (rơi vào âm tiết thứ 1).",
            "formula": "VERB + (-ate / -ize / -fy) ➔ TRỌNG ÂM 1",
            "examples": "'celebrate, 'organize, 'calculate, 'fascinate, 'satisfy."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 78: Bày tỏ lời cảm ơn và xin lỗi (15 questions)
# -------------------------------------------------------------
q78 = [
    {
        "id": "78_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Mark:</strong> \"Thank you very much for helping me with the project!\"<br/><strong>Linda:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_1_1", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_1_2", "text": "Yes, of course.", "html": "Yes, of course."},
            {"id": "78_1_3", "text": "Never mind me.", "html": "Never mind me."},
            {"id": "78_1_4", "text": "It's a pity.", "html": "It's a pity."}
        ],
        "correctChoiceId": "78_1_1",
        "explanation": "<p>Để đáp lại lời cảm ơn (\"Thank you very much...\"), câu trả lời lịch sự và tự nhiên nhất là <strong>\"You're welcome.\"</strong> (Không có chi/ Rất sẵn lòng giúp bạn).</p>",
        "ruleTip": "Đáp lại lời cảm ơn trang trọng/thông dụng: 'You're welcome.' (Không có chi)."
    },
    {
        "id": "78_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Tom:</strong> \"Thanks a lot for giving me a ride home.\"<br/><strong>Peter:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_2_1", "text": "My pleasure.", "html": "My pleasure."},
            {"id": "78_2_2", "text": "You can do it.", "html": "You can do it."},
            {"id": "78_2_3", "text": "I don't care.", "html": "I don't care."},
            {"id": "78_2_4", "text": "Not at all me.", "html": "Not at all me."}
        ],
        "correctChoiceId": "78_2_1",
        "explanation": "<p>Đáp lại lời cảm ơn khi giúp đỡ người khác: <strong>\"My pleasure.\"</strong> (Đó là niềm vui/vinh hạnh của tôi).</p>",
        "ruleTip": "Đáp lại lời cảm ơn: 'My pleasure' hoặc 'It's my pleasure' (Niềm vinh hạnh của tôi)."
    },
    {
        "id": "78_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Daisy:</strong> \"I'm extremely sorry for breaking your favourite mug.\"<br/><strong>Laura:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_3_1", "text": "Never mind. It was an accident.", "html": "Never mind. It was an accident."},
            {"id": "78_3_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_3_3", "text": "Don't mention it.", "html": "Don't mention it."},
            {"id": "78_3_4", "text": "It's my pleasure.", "html": "It's my pleasure."}
        ],
        "correctChoiceId": "78_3_1",
        "explanation": "<p>Đáp lại lời xin lỗi: dùng <strong>\"Never mind\"</strong> (Đừng bận tâm / Không sao đâu).</p>",
        "ruleTip": "Đáp lại lời xin lỗi: 'Never mind' (Đừng bận tâm) hoặc 'That's all right'."
    },
    {
        "id": "78_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Jane:</strong> \"Thank you for the delicious dinner!\"<br/><strong>Host:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_4_1", "text": "Don't mention it. I'm glad you liked it.", "html": "Don't mention it. I'm glad you liked it."},
            {"id": "78_4_2", "text": "That's all right.", "html": "That's all right."},
            {"id": "78_4_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_4_4", "text": "It doesn't matter.", "html": "It doesn't matter."}
        ],
        "correctChoiceId": "78_4_1",
        "explanation": "<p>Chủ nhà đáp lại lời cảm ơn bữa ăn: <strong>\"Don't mention it. I'm glad you liked it.\"</strong> (Không có chi. Rất vui vì bạn thích bữa ăn).</p>",
        "ruleTip": "'Don't mention it' (Không có gì đâu) dùng để đáp lại lời cảm ơn một cách thân mật."
    },
    {
        "id": "78_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Customer:</strong> \"Excuse me, I'm sorry to interrupt, but is this seat taken?\"<br/><strong>Person:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_5_1", "text": "No, not at all. Please go ahead.", "html": "No, not at all. Please go ahead."},
            {"id": "78_5_2", "text": "Yes, I do.", "html": "Yes, I do."},
            {"id": "78_5_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_5_4", "text": "It's my duty.", "html": "It's my duty."}
        ],
        "correctChoiceId": "78_5_1",
        "explanation": "<p>Trả lời câu hỏi xem chỗ ngồi đã có ai ngồi chưa: <strong>\"No, not at all. Please go ahead.\"</strong> (Không hề, xin mời bạn cứ ngồi).</p>",
        "ruleTip": "'Not at all' (Hoàn toàn không) dùng để phản hồi lịch sự khi người khác xin phép hoặc hỏi xem có phiền không."
    },
    {
        "id": "78_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Student:</strong> \"I apologize for handing in my homework late, sir.\"<br/><strong>Teacher:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_6_1", "text": "That's all right, but try to be on time next time.", "html": "That's all right, but try to be on time next time."},
            {"id": "78_6_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_6_3", "text": "Never mind you.", "html": "Never mind you."},
            {"id": "78_6_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "78_6_1",
        "explanation": "<p>Thầy giáo chấp nhận lời xin lỗi của học sinh: <strong>\"That's all right...\"</strong> (Không sao, nhưng lần sau nhớ nộp đúng giờ nhé).</p>",
        "ruleTip": "Đáp lại lời xin lỗi: 'That's all right' (Không sao đâu)."
    },
    {
        "id": "78_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Lan:</strong> \"Thank you so much for the lovely birthday gift!\"<br/><strong>Mai:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_7_1", "text": "I'm glad you like it.", "html": "I'm glad you like it."},
            {"id": "78_7_2", "text": "Not at all.", "html": "Not at all."},
            {"id": "78_7_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_7_4", "text": "That's fine for you.", "html": "That's fine for you."}
        ],
        "correctChoiceId": "78_7_1",
        "explanation": "<p>Khi bạn cảm ơn vì món quà, câu trả lời tự nhiên nhất là: <strong>\"I'm glad you like it.\"</strong> (Mình rất vui vì bạn thích nó).</p>",
        "ruleTip": "Khi người khác cảm ơn vì món quà, câu trả lời tự nhiên nhất là 'I'm glad you like it'."
    },
    {
        "id": "78_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>John:</strong> \"Sorry, I stepped on your foot.\"<br/><strong>Mary:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_8_1", "text": "Don't worry about it.", "html": "Don't worry about it."},
            {"id": "78_8_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_8_3", "text": "It's very kind of you.", "html": "It's very kind of you."},
            {"id": "78_8_4", "text": "Same to you.", "html": "Same to you."}
        ],
        "correctChoiceId": "78_8_1",
        "explanation": "<p>Đáp lại lời xin lỗi về một va chạm nhẹ vô ý: <strong>\"Don't worry about it.\"</strong> (Không sao đâu, đừng bận tâm).</p>",
        "ruleTip": "Đáp lại lời xin lỗi về sự cố nhỏ: 'Don't worry about it' (Đừng lo/ Không sao đâu)."
    },
    {
        "id": "78_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Tourist:</strong> \"Thank you for showing me the way to the museum.\"<br/><strong>Local:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_9_1", "text": "No problem. Have a nice trip!", "html": "No problem. Have a nice trip!"},
            {"id": "78_9_2", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_9_3", "text": "That's all right.", "html": "That's all right."},
            {"id": "78_9_4", "text": "It's a waste of time.", "html": "It's a waste of time."}
        ],
        "correctChoiceId": "78_9_1",
        "explanation": "<p>Đáp lại lời cảm ơn khi chỉ đường: <strong>\"No problem. Have a nice trip!\"</strong> (Không có vấn đề gì. Chúc bạn có chuyến đi vui vẻ!).</p>",
        "ruleTip": "'No problem' (Không vấn đề gì) rất phổ biến trong giao tiếp hiện đại để đáp lại lời cảm ơn."
    },
    {
        "id": "78_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Guest:</strong> \"I must apologize for not being able to attend your party yesterday.\"<br/><strong>Host:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_10_1", "text": "It doesn't matter. We missed you though.", "html": "It doesn't matter. We missed you though."},
            {"id": "78_10_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_10_3", "text": "Don't mention it.", "html": "Don't mention it."},
            {"id": "78_10_4", "text": "It's my pleasure.", "html": "It's my pleasure."}
        ],
        "correctChoiceId": "78_10_1",
        "explanation": "<p>Đáp lại lời xin lỗi vì vắng mặt: <strong>\"It doesn't matter. We missed you though.\"</strong> (Không sao đâu. Dù vậy chúng mình vẫn rất nhớ bạn).</p>",
        "ruleTip": "'It doesn't matter' (Không sao cả/ Không thành vấn đề) dùng để đáp lại lời xin lỗi."
    },
    {
        "id": "78_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Passenger:</strong> \"Thank you for carrying my heavy suitcase up the stairs.\"<br/><strong>Boy:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_11_1", "text": "Anytime! I'm happy to help.", "html": "Anytime! I'm happy to help."},
            {"id": "78_11_2", "text": "Forget me.", "html": "Forget me."},
            {"id": "78_11_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_11_4", "text": "It was so bad.", "html": "It was so bad."}
        ],
        "correctChoiceId": "78_11_1",
        "explanation": "<p>Đáp lại lời cảm ơn khi giúp đỡ người khác: <strong>\"Anytime! I'm happy to help.\"</strong> (Bất cứ lúc nào! Em rất vui được giúp đỡ ạ).</p>",
        "ruleTip": "'Anytime' (Bất cứ lúc nào / Rất sẵn lòng) là cách đáp lại lời cảm ơn thân thiện, sẵn sàng giúp đỡ."
    },
    {
        "id": "78_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Driver:</strong> \"I'm terribly sorry for keeping you waiting so long.\"<br/><strong>Passenger:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_12_1", "text": "That's OK. The traffic was terrible.", "html": "That's OK. The traffic was terrible."},
            {"id": "78_12_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_12_3", "text": "My pleasure.", "html": "My pleasure."},
            {"id": "78_12_4", "text": "No thanks.", "html": "No thanks."}
        ],
        "correctChoiceId": "78_12_1",
        "explanation": "<p>Đáp lại lời xin lỗi vì để đợi lâu: <strong>\"That's OK. The traffic was terrible.\"</strong> (Không sao đâu. Giao thông hôm nay quả thật rất tệ).</p>",
        "ruleTip": "'That's OK' (Không sao đâu) dùng để chấp nhận lời xin lỗi khi có lý do chính đáng."
    },
    {
        "id": "78_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>David:</strong> \"Thanks for your useful advice on my presentation.\"<br/><strong>Sarah:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_13_1", "text": "You're very welcome.", "html": "You're very welcome."},
            {"id": "78_13_2", "text": "That's all right.", "html": "That's all right."},
            {"id": "78_13_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_13_4", "text": "Never thought of it.", "html": "Never thought of it."}
        ],
        "correctChoiceId": "78_13_1",
        "explanation": "<p>Đáp lại lời cảm ơn trang trọng, chân thành: <strong>\"You're very welcome.\"</strong> (Bạn luôn luôn được chào đón / Rất sẵn lòng giúp bạn).</p>",
        "ruleTip": "'You're very welcome' là biến thể nhấn mạnh lịch sự của 'You're welcome'."
    },
    {
        "id": "78_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Huy:</strong> \"Sorry, I forgot to bring the book you lent me.\"<br/><strong>Phong:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_14_1", "text": "Forget it. You can return it tomorrow.", "html": "Forget it. You can return it tomorrow."},
            {"id": "78_14_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "78_14_3", "text": "My pleasure.", "html": "My pleasure."},
            {"id": "78_14_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "78_14_1",
        "explanation": "<p>Bạn bè đáp lại lời xin lỗi khi quên mang sách: <strong>\"Forget it. You can return it tomorrow.\"</strong> (Quên chuyện đó đi. Mai bạn trả mình cũng được).</p>",
        "ruleTip": "'Forget it' (Quên chuyện đó đi / Không sao đâu) thể hiện sự thoải mái tha thứ giữa bạn bè thân thiết."
    },
    {
        "id": "78_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Anna:</strong> \"It was so kind of you to look after my cat while I was away.\"<br/><strong>Neighbor:</strong> \"________\"</p>",
        "choices": [
            {"id": "78_15_1", "text": "It was the least I could do.", "html": "It was the least I could do."},
            {"id": "78_15_2", "text": "Never mind.", "html": "Never mind."},
            {"id": "78_15_3", "text": "That's bad.", "html": "That's bad."},
            {"id": "78_15_4", "text": "Nothing to talk about.", "html": "Nothing to talk about."}
        ],
        "correctChoiceId": "78_15_1",
        "explanation": "<p>Đáp lại lời cảm ơn khi giúp hàng xóm: <strong>\"It was the least I could do.\"</strong> (Đó là điều tối thiểu tôi có thể làm để giúp bạn mà).</p>",
        "ruleTip": "'It was the least I could do' (Đó là điều tối thiểu tôi có thể làm) thể hiện sự nhiệt tình khi được cảm ơn."
    }
]

theory78 = {
    "topicId": 78,
    "topicName": "Bày tỏ lời cảm ơn và xin lỗi",
    "englishName": "Thanking and Apologizing",
    "rules": [
        {
            "rule": "Cách bày tỏ lời cảm ơn:",
            "formula": "Thank you (very much) for + N/V-ing / Thanks a lot / It was very kind/nice of you to + V",
            "examples": "Thank you for helping me. / Thanks a lot for the ride. / It was very kind of you to invite us."
        },
        {
            "rule": "Cách đáp lại lời cảm ơn lịch sự:",
            "formula": "You're welcome / My pleasure / Not at all / Don't mention it / No problem / Anytime / I'm glad you liked it",
            "examples": "- 'Thank you for dinner.' - 'Don't mention it. I'm glad you liked it.' / - 'Thanks!' - 'You're welcome.'"
        },
        {
            "rule": "Cách bày tỏ lời xin lỗi:",
            "formula": "I'm (so/terribly) sorry for + N/V-ing / I apologize for + N/V-ing / Please forgive me",
            "examples": "I'm sorry for being late. / I apologize for stepping on your foot."
        },
        {
            "rule": "Cách đáp lại lời xin lỗi (tha thứ, thông cảm):",
            "formula": "That's all right / That's OK / Never mind / Don't worry about it / It doesn't matter / Forget it",
            "examples": "- 'Sorry, I broke the cup.' - 'Never mind. It was an accident.' / - 'I'm sorry.' - 'That's OK.'"
        },
        {
            "rule": "Lưu ý tránh bẫy đề thi:",
            "formula": "KHÔNG NHẦM LẪN CẢM ƠN VÀ XIN LỖI",
            "examples": "Tuyệt đối KHÔNG dùng 'You're welcome' để đáp lại lời xin lỗi. KHÔNG dùng 'Never mind' để đáp lại lời cảm ơn."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 79: Đưa ra và đáp lại lời khen / chúc mừng (15 questions)
# -------------------------------------------------------------
q79 = [
    {
        "id": "79_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Alice:</strong> \"What a gorgeous dress you are wearing!\"<br/><strong>Mary:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_1_1", "text": "Thank you. That's a nice compliment.", "html": "Thank you. That's a nice compliment."},
            {"id": "79_1_2", "text": "Yes, of course. I'm rich.", "html": "Yes, of course. I'm rich."},
            {"id": "79_1_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_1_4", "text": "No, it's terrible.", "html": "No, it's terrible."}
        ],
        "correctChoiceId": "79_1_1",
        "explanation": "<p>Đáp lại lời khen ngợi ngoại hình/trang phục: luôn nói lời cảm ơn lịch sự: <strong>\"Thank you. That's a nice compliment.\"</strong>.</p>",
        "ruleTip": "Đáp lại lời khen ngợi ngoại hình/trang phục: luôn nói lời cảm ơn lịch sự ('Thank you...')."
    },
    {
        "id": "79_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Teacher:</strong> \"Congratulations on winning the first prize in the English contest, Nam!\"<br/><strong>Nam:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_2_1", "text": "Thank you very much, teacher.", "html": "Thank you very much, teacher."},
            {"id": "79_2_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_2_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_2_4", "text": "That's all right.", "html": "That's all right."}
        ],
        "correctChoiceId": "79_2_1",
        "explanation": "<p>Đáp lại lời chúc mừng của thầy cô: <strong>\"Thank you very much, teacher.\"</strong>.</p>",
        "ruleTip": "Đáp lại lời chúc mừng ('Congratulations on...'): 'Thank you very much'."
    },
    {
        "id": "79_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Susan:</strong> \"You gave a really impressive presentation today!\"<br/><strong>Jack:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_3_1", "text": "Thanks! It's very nice of you to say so.", "html": "Thanks! It's very nice of you to say so."},
            {"id": "79_3_2", "text": "I know I am great.", "html": "I know I am great."},
            {"id": "79_3_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_3_4", "text": "You're welcome.", "html": "You're welcome."}
        ],
        "correctChoiceId": "79_3_1",
        "explanation": "<p>Đáp lại lời khen bài thuyết trình: <strong>\"Thanks! It's very nice of you to say so.\"</strong> (Cảm ơn bạn! Bạn thật tốt khi nói như vậy).</p>",
        "ruleTip": "'It's very nice/kind of you to say so' (Bạn thật tốt khi nói như vậy) là mẫu câu chuẩn đáp lại lời khen."
    },
    {
        "id": "79_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Mai:</strong> \"Your new hairstyle looks really great!\"<br/><strong>Hoa:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_4_1", "text": "Thanks, I had it cut yesterday.", "html": "Thanks, I had it cut yesterday."},
            {"id": "79_4_2", "text": "Yes, it is very expensive.", "html": "Yes, it is very expensive."},
            {"id": "79_4_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_4_4", "text": "Not at all.", "html": "Not at all."}
        ],
        "correctChoiceId": "79_4_1",
        "explanation": "<p>Đáp lại lời khen kiểu tóc mới: cảm ơn kèm chi tiết tự nhiên <strong>\"Thanks, I had it cut yesterday.\"</strong>.</p>",
        "ruleTip": "Đáp lại lời khen kiểu tóc: cảm ơn kèm theo thông tin bổ sung tự nhiên."
    },
    {
        "id": "79_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Tim:</strong> \"I've passed the Grade 10 entrance examination with high marks!\"<br/><strong>Uncle:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_5_1", "text": "Well done! I'm so proud of you.", "html": "Well done! I'm so proud of you."},
            {"id": "79_5_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_5_3", "text": "It's a pity.", "html": "It's a pity."},
            {"id": "79_5_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "79_5_1",
        "explanation": "<p>Người chú chúc mừng cháu thi đỗ điểm cao: <strong>\"Well done! I'm so proud of you.\"</strong> (Làm tốt lắm! Chú rất tự hào về cháu).</p>",
        "ruleTip": "Đưa ra lời khen ngợi/chúc mừng khi ai đó đạt thành tích: 'Well done!' hoặc 'Congratulations!'."
    },
    {
        "id": "79_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Guest:</strong> \"The meal was absolutely delicious!\"<br/><strong>Host:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_6_1", "text": "Thank you. I'm glad you enjoyed it.", "html": "Thank you. I'm glad you enjoyed it."},
            {"id": "79_6_2", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_6_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_6_4", "text": "It doesn't matter.", "html": "It doesn't matter."}
        ],
        "correctChoiceId": "79_6_1",
        "explanation": "<p>Chủ nhà đáp lại lời khen món ăn: <strong>\"Thank you. I'm glad you enjoyed it.\"</strong> (Cảm ơn bạn. Mình rất vui vì bạn thích món ăn).</p>",
        "ruleTip": "Chủ nhà đáp lại lời khen món ăn: 'Thank you. I'm glad you enjoyed it'."
    },
    {
        "id": "79_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Peter:</strong> \"You played badminton so skillfully!\"<br/><strong>David:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_7_1", "text": "Thank you, but I still need more practice.", "html": "Thank you, but I still need more practice."},
            {"id": "79_7_2", "text": "Of course, I am the best.", "html": "Of course, I am the best."},
            {"id": "79_7_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_7_4", "text": "You're welcome.", "html": "You're welcome."}
        ],
        "correctChoiceId": "79_7_1",
        "explanation": "<p>Đáp lại lời khen thể thao một cách khiêm tốn: <strong>\"Thank you, but I still need more practice.\"</strong> (Cảm ơn bạn, nhưng mình vẫn cần luyện thêm).</p>",
        "ruleTip": "Cách đáp lại lời khen thể hiện sự khiêm tốn: cảm ơn và nói mình cần rèn luyện thêm."
    },
    {
        "id": "79_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Lisa:</strong> \"How beautiful your garden is!\"<br/><strong>Mrs. Green:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_8_1", "text": "Thanks. My husband spends a lot of time taking care of it.", "html": "Thanks. My husband spends a lot of time taking care of it."},
            {"id": "79_8_2", "text": "Yes, I think so too.", "html": "Yes, I think so too."},
            {"id": "79_8_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_8_4", "text": "Don't worry.", "html": "Don't worry."}
        ],
        "correctChoiceId": "79_8_1",
        "explanation": "<p>Đáp lại lời khen khu vườn xinh đẹp: <strong>\"Thanks. My husband spends a lot of time taking care of it.\"</strong>.</p>",
        "ruleTip": "Cấu trúc câu khen ngợi cảm thán: 'How + adj + S + V!' hoặc 'What a/an + adj + noun!'."
    },
    {
        "id": "79_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Tom:</strong> \"Happy birthday, Linh! Wishing you all the best.\"<br/><strong>Linh:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_9_1", "text": "Thank you so much for remembering my birthday.", "html": "Thank you so much for remembering my birthday."},
            {"id": "79_9_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_9_3", "text": "Not at all.", "html": "Not at all."},
            {"id": "79_9_4", "text": "That's fine.", "html": "That's fine."}
        ],
        "correctChoiceId": "79_9_1",
        "explanation": "<p>Đáp lại lời chúc mừng sinh nhật: <strong>\"Thank you so much for remembering my birthday.\"</strong> (Cảm ơn bạn rất nhiều vì đã nhớ ngày sinh nhật của mình).</p>",
        "ruleTip": "Đáp lại lời chúc mừng sinh nhật: cảm ơn người chúc đã nhớ ngày sinh nhật của mình."
    },
    {
        "id": "79_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Jane:</strong> \"Congratulations on getting the scholarship!\"<br/><strong>Brian:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_10_1", "text": "Thanks! I couldn't have done it without your encouragement.", "html": "Thanks! I couldn't have done it without your encouragement."},
            {"id": "79_10_2", "text": "Yes, obviously.", "html": "Yes, obviously."},
            {"id": "79_10_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_10_4", "text": "You're welcome.", "html": "You're welcome."}
        ],
        "correctChoiceId": "79_10_1",
        "explanation": "<p>Đáp lại lời chúc học bổng bằng sự biết ơn: <strong>\"Thanks! I couldn't have done it without your encouragement.\"</strong>.</p>",
        "ruleTip": "Đáp lại lời chúc mừng học bổng: tri ân sự hỗ trợ của bạn bè/thầy cô."
    },
    {
        "id": "79_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>Mother:</strong> \"You have cleaned your room so neatly, son!\"<br/><strong>Son:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_11_1", "text": "Thank you, Mom.", "html": "Thank you, Mom."},
            {"id": "79_11_2", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_11_3", "text": "Don't mention it.", "html": "Don't mention it."},
            {"id": "79_11_4", "text": "It's a pity.", "html": "It's a pity."}
        ],
        "correctChoiceId": "79_11_1",
        "explanation": "<p>Con trai đáp lại lời khen của mẹ: <strong>\"Thank you, Mom.\"</strong> (Con cảm ơn mẹ ạ).</p>",
        "ruleTip": "Trẻ em đáp lại lời khen của phụ huynh bằng lời cảm ơn ngoan ngoãn."
    },
    {
        "id": "79_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Colleague:</strong> \"Your design idea was very creative!\"<br/><strong>Designer:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_12_1", "text": "Thank you. That means a lot to me.", "html": "Thank you. That means a lot to me."},
            {"id": "79_12_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_12_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_12_4", "text": "That's all right.", "html": "That's all right."}
        ],
        "correctChoiceId": "79_12_1",
        "explanation": "<p>Đáp lại lời khen sáng tạo từ đồng nghiệp: <strong>\"Thank you. That means a lot to me.\"</strong> (Cảm ơn bạn. Lời khen đó có ý nghĩa rất lớn với mình).</p>",
        "ruleTip": "'That means a lot to me' (Điều đó có ý nghĩa rất lớn với tôi) đáp lại lời khen công việc."
    },
    {
        "id": "79_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Mark:</strong> \"You have a lovely speaking voice!\"<br/><strong>Anna:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_13_1", "text": "That's very kind of you. Thank you!", "html": "That's very kind of you. Thank you!"},
            {"id": "79_13_2", "text": "No problem.", "html": "No problem."},
            {"id": "79_13_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_13_4", "text": "Of course I know.", "html": "Of course I know."}
        ],
        "correctChoiceId": "79_13_1",
        "explanation": "<p>Đáp lại lời khen giọng nói: <strong>\"That's very kind of you. Thank you!\"</strong> (Bạn thật tốt khi khen như vậy. Cảm ơn bạn!).</p>",
        "ruleTip": "'That's very kind of you' là phản hồi thanh lịch khi được khen năng khiếu."
    },
    {
        "id": "79_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Bill:</strong> \"We have just bought a new house near West Lake.\"<br/><strong>Friend:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_14_1", "text": "Congratulations! That's wonderful news.", "html": "Congratulations! That's wonderful news."},
            {"id": "79_14_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "79_14_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "79_14_4", "text": "It's my pleasure.", "html": "It's my pleasure."}
        ],
        "correctChoiceId": "79_14_1",
        "explanation": "<p>Chúc mừng bạn mua nhà mới: <strong>\"Congratulations! That's wonderful news.\"</strong> (Chúc mừng bạn! Thật là một tin tuyệt vời).</p>",
        "ruleTip": "Chúc mừng bạn bè khi có tin vui lớn (mua nhà, có tin vui): 'Congratulations! That's wonderful news.'"
    },
    {
        "id": "79_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>Paul:</strong> \"You danced exceptionally well tonight!\"<br/><strong>Sarah:</strong> \"________\"</p>",
        "choices": [
            {"id": "79_15_1", "text": "Thank you. You're giving me too much credit.", "html": "Thank you. You're giving me too much credit."},
            {"id": "79_15_2", "text": "Yes, I am an expert.", "html": "Yes, I am an expert."},
            {"id": "79_15_3", "text": "Don't worry.", "html": "Don't worry."},
            {"id": "79_15_4", "text": "You're welcome.", "html": "You're welcome."}
        ],
        "correctChoiceId": "79_15_1",
        "explanation": "<p>Đáp lại lời khen khiêu vũ khiêm tốn: <strong>\"Thank you. You're giving me too much credit.\"</strong> (Cảm ơn bạn. Bạn quá khen rồi ạ).</p>",
        "ruleTip": "'You're giving me too much credit' (Bạn quá khen rồi) là cách từ chối khéo, khiêm nhường."
    }
]

theory79 = {
    "topicId": 79,
    "topicName": "Đưa ra và đáp lại lời khen/chúc mừng",
    "englishName": "Giving and responding to compliments/congratulations",
    "rules": [
        {
            "rule": "Cách đưa ra lời khen ngợi (Compliments):",
            "formula": "What a/an + adj + noun! / How + adj + S + V! / You look great in... / You did a great job!",
            "examples": "What a lovely dress! / How well you play the piano! / Your new haircut looks fantastic!"
        },
        {
            "rule": "Cách đưa ra lời chúc mừng (Congratulations):",
            "formula": "Congratulations on + N/V-ing! / Well done! / Happy birthday / Wishing you all the best!",
            "examples": "Congratulations on passing the exam! / Well done! I'm so proud of you."
        },
        {
            "rule": "Cách đáp lại lời khen lịch sự và khiêm tốn:",
            "formula": "Thank you. That's a nice compliment / It's very kind/nice of you to say so / Thanks, I'm glad you like it",
            "examples": "- 'Your dress is beautiful.' - 'Thank you. It's very kind of you to say so.'"
        },
        {
            "rule": "Cách đáp lại lời chúc mừng:",
            "formula": "Thank you very much / Thanks! I couldn't have done it without your support",
            "examples": "- 'Congratulations on winning!' - 'Thank you very much, teacher.'"
        },
        {
            "rule": "Lưu ý tránh bẫy đề thi:",
            "formula": "TRÁNH KIÊU NGẠO HOẶC CHỐI BỎ THÔ THIỂN",
            "examples": "Tránh chọn: 'Yes, of course' (tự phụ), 'I know that' (bất lịch sự), 'No, I'm ugly' (tự ti thái quá). Luôn chọn phương án cảm ơn nhã nhặn."
        }
    ]
}

# -------------------------------------------------------------
# TOPIC 80: Đưa ra gợi ý, lời đề nghị và lời mời (15 questions)
# -------------------------------------------------------------
q80 = [
    {
        "id": "80_1",
        "questionName": "Question 1",
        "questionText": "<p><strong>Nick:</strong> \"Why don't we go to the cinema tonight?\"<br/><strong>John:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_1_1", "text": "That's a great idea!", "html": "That's a great idea!"},
            {"id": "80_1_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_1_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_1_4", "text": "It doesn't matter.", "html": "It doesn't matter."}
        ],
        "correctChoiceId": "80_1_1",
        "explanation": "<p>Đồng ý với lời gợi ý đi xem phim: <strong>\"That's a great idea!\"</strong> (Đó là một ý kiến tuyệt vời!).</p>",
        "ruleTip": "Đồng ý với gợi ý 'Why don't we + V-inf?': dùng 'That's a great idea!' hoặc 'That sounds great!'."
    },
    {
        "id": "80_2",
        "questionName": "Question 2",
        "questionText": "<p><strong>Mary:</strong> \"Would you like to come to my birthday party this Saturday?\"<br/><strong>Helen:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_2_1", "text": "I'd love to, thanks!", "html": "I'd love to, thanks!"},
            {"id": "80_2_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_2_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_2_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_2_1",
        "explanation": "<p>Nhận lời mời sinh nhật một cách nhiệt tình: <strong>\"I'd love to, thanks!\"</strong> (Mình rất muốn tham gia, cảm ơn bạn!).</p>",
        "ruleTip": "Đồng ý với lời mời 'Would you like to + V-inf?': dùng 'I'd love to, thanks!' hoặc 'Yes, I'd love to.'."
    },
    {
        "id": "80_3",
        "questionName": "Question 3",
        "questionText": "<p><strong>Kevin:</strong> \"Let's go for a picnic in the park tomorrow.\"<br/><strong>Tom:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_3_1", "text": "I'd love to, but I have to study for my exam.", "html": "I'd love to, but I have to study for my exam."},
            {"id": "80_3_2", "text": "No, I hate picnics.", "html": "No, I hate picnics."},
            {"id": "80_3_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_3_4", "text": "Not at all.", "html": "Not at all."}
        ],
        "correctChoiceId": "80_3_1",
        "explanation": "<p>Từ chối lịch sự lời mời đi dã ngoại: <strong>\"I'd love to, but I have to study for my exam.\"</strong> (Mình rất muốn đi, nhưng mình phải ôn thi rồi).</p>",
        "ruleTip": "Từ chối lịch sự lời gợi ý: 'I'd love to, but...' kèm theo lý do chính đáng."
    },
    {
        "id": "80_4",
        "questionName": "Question 4",
        "questionText": "<p><strong>Clerk:</strong> \"May I help you carry those bags?\"<br/><strong>Elderly lady:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_4_1", "text": "Yes, please. That's very kind of you.", "html": "Yes, please. That's very kind of you."},
            {"id": "80_4_2", "text": "No, you can't.", "html": "No, you can't."},
            {"id": "80_4_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_4_4", "text": "Never mind.", "html": "Never mind."}
        ],
        "correctChoiceId": "80_4_1",
        "explanation": "<p>Đồng ý nhận sự giúp đỡ xách túi đồ: <strong>\"Yes, please. That's very kind of you.\"</strong> (Vâng, làm ơn giúp tôi. Cháu thật tốt bụng).</p>",
        "ruleTip": "Đồng ý nhận sự giúp đỡ ('May I help you...?'): 'Yes, please. That's very kind of you.'."
    },
    {
        "id": "80_5",
        "questionName": "Question 5",
        "questionText": "<p><strong>Peter:</strong> \"How about having Vietnamese noodle soup for breakfast?\"<br/><strong>Linda:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_5_1", "text": "Sounds good to me!", "html": "Sounds good to me!"},
            {"id": "80_5_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_5_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_5_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_5_1",
        "explanation": "<p>Đồng ý với gợi ý ăn phở cho bữa sáng: <strong>\"Sounds good to me!\"</strong> (Nghe hay đấy/ Mình đồng ý!).</p>",
        "ruleTip": "Cấu trúc gợi ý 'How about + V-ing?'. Đồng ý nhanh gọn: 'Sounds good to me!'."
    },
    {
        "id": "80_6",
        "questionName": "Question 6",
        "questionText": "<p><strong>Henry:</strong> \"Shall I open the window? It's quite hot in here.\"<br/><strong>Roommate:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_6_1", "text": "No, thank you. I'm feeling a bit cold.", "html": "No, thank you. I'm feeling a bit cold."},
            {"id": "80_6_2", "text": "Yes, you are welcome.", "html": "Yes, you are welcome."},
            {"id": "80_6_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_6_4", "text": "That's all right.", "html": "That's all right."}
        ],
        "correctChoiceId": "80_6_1",
        "explanation": "<p>Từ chối lịch sự lời đề nghị mở cửa sổ vì thấy lạnh: <strong>\"No, thank you. I'm feeling a bit cold.\"</strong>.</p>",
        "ruleTip": "Từ chối lời đề nghị giúp đỡ/hành động: 'No, thank you. I...'."
    },
    {
        "id": "80_7",
        "questionName": "Question 7",
        "questionText": "<p><strong>Lucy:</strong> \"Do you want to join our English speaking club this afternoon?\"<br/><strong>Ben:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_7_1", "text": "Sure, why not? What time does it start?", "html": "Sure, why not? What time does it start?"},
            {"id": "80_7_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_7_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_7_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_7_1",
        "explanation": "<p>Hào hứng tham gia câu lạc bộ tiếng Anh: <strong>\"Sure, why not? What time does it start?\"</strong> (Chắc chắn rồi, sao lại không chứ? Mấy giờ bắt đầu vậy bạn?).</p>",
        "ruleTip": "'Sure, why not?' (Chắc chắn rồi, sao lại không chứ?) dùng để hào hứng nhận lời mời."
    },
    {
        "id": "80_8",
        "questionName": "Question 8",
        "questionText": "<p><strong>Driver:</strong> \"Would you like me to give you a lift to the bus station?\"<br/><strong>Traveler:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_8_1", "text": "Thanks, but my brother is coming to pick me up.", "html": "Thanks, but my brother is coming to pick me up."},
            {"id": "80_8_2", "text": "No, never.", "html": "No, never."},
            {"id": "80_8_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_8_4", "text": "Never mind.", "html": "Never mind."}
        ],
        "correctChoiceId": "80_8_1",
        "explanation": "<p>Từ chối lịch sự lời cho đi nhờ xe: <strong>\"Thanks, but my brother is coming to pick me up.\"</strong> (Cảm ơn anh, nhưng anh trai em sắp đến đón rồi ạ).</p>",
        "ruleTip": "Từ chối lịch sự lời đề nghị chở xe: cảm ơn và giải thích lý do người thân đón."
    },
    {
        "id": "80_9",
        "questionName": "Question 9",
        "questionText": "<p><strong>Ann:</strong> \"What about cycling to Bat Trang ceramic village this Sunday?\"<br/><strong>Mai:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_9_1", "text": "That sounds like fun! Let's do that.", "html": "That sounds like fun! Let's do that."},
            {"id": "80_9_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_9_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_9_4", "text": "It's a pity.", "html": "It's a pity."}
        ],
        "correctChoiceId": "80_9_1",
        "explanation": "<p>Đồng ý đạp xe đi Bát Tràng: <strong>\"That sounds like fun! Let's do that.\"</strong> (Nghe vui đấy! Chúng mình làm vậy đi!).</p>",
        "ruleTip": "Đồng ý nhiệt tình với gợi ý 'What about + V-ing?': 'That sounds like fun! Let's do that.'."
    },
    {
        "id": "80_10",
        "questionName": "Question 10",
        "questionText": "<p><strong>Waiter:</strong> \"Would you like some more iced tea, sir?\"<br/><strong>Customer:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_10_1", "text": "No more for me, thank you. Just the bill, please.", "html": "No more for me, thank you. Just the bill, please."},
            {"id": "80_10_2", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_10_3", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_10_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_10_1",
        "explanation": "<p>Từ chối thêm trà đá và xin hóa đơn: <strong>\"No more for me, thank you. Just the bill, please.\"</strong> (Tôi đủ rồi, cảm ơn. Làm ơn cho tôi thanh toán).</p>",
        "ruleTip": "Từ chối dùng thêm đồ uống/món ăn tại nhà hàng: 'No more for me, thank you.'."
    },
    {
        "id": "80_11",
        "questionName": "Question 11",
        "questionText": "<p><strong>David:</strong> \"Shall we meet in front of the bookstore at 8 a.m.?\"<br/><strong>Sarah:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_11_1", "text": "Yes, that suits me fine.", "html": "Yes, that suits me fine."},
            {"id": "80_11_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_11_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_11_4", "text": "That's all right.", "html": "That's all right."}
        ],
        "correctChoiceId": "80_11_1",
        "explanation": "<p>Đồng ý giờ hẹn: <strong>\"Yes, that suits me fine.\"</strong> (Được, giờ đó rất thuận tiện cho mình).</p>",
        "ruleTip": "'Shall we + V-inf?' dùng để thống nhất giờ giấc/địa điểm. Đồng ý: 'Yes, that suits me fine.'."
    },
    {
        "id": "80_12",
        "questionName": "Question 12",
        "questionText": "<p><strong>Sam:</strong> \"Can I get you something to drink?\"<br/><strong>Guest:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_12_1", "text": "A glass of water would be lovely, please.", "html": "A glass of water would be lovely, please."},
            {"id": "80_12_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_12_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_12_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_12_1",
        "explanation": "<p>Khách chọn nước uống lịch sự: <strong>\"A glass of water would be lovely, please.\"</strong> (Làm ơn cho tôi một cốc nước là tuyệt vời rồi).</p>",
        "ruleTip": "Đưa ra lời đề nghị mời nước: 'Can I get you...'. Đáp nhận lịch sự: 'A glass of... would be lovely, please.'."
    },
    {
        "id": "80_13",
        "questionName": "Question 13",
        "questionText": "<p><strong>Jack:</strong> \"Why not try the new Italian restaurant down the street?\"<br/><strong>Emma:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_13_1", "text": "Great idea! I've heard good reviews about it.", "html": "Great idea! I've heard good reviews about it."},
            {"id": "80_13_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_13_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_13_4", "text": "It doesn't matter.", "html": "It doesn't matter."}
        ],
        "correctChoiceId": "80_13_1",
        "explanation": "<p>Đồng ý thử nhà hàng Ý mới: <strong>\"Great idea! I've heard good reviews about it.\"</strong> (Ý tưởng tuyệt đấy! Mình cũng nghe nhiều đánh giá tốt về nó).</p>",
        "ruleTip": "Gợi ý 'Why not + V-inf?'. Đồng ý: 'Great idea!'."
    },
    {
        "id": "80_14",
        "questionName": "Question 14",
        "questionText": "<p><strong>Chris:</strong> \"Would you like to play chess with me?\"<br/><strong>Paul:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_14_1", "text": "I'm afraid I don't know how to play it.", "html": "I'm afraid I don't know how to play it."},
            {"id": "80_14_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_14_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_14_4", "text": "Don't mention it.", "html": "Don't mention it."}
        ],
        "correctChoiceId": "80_14_1",
        "explanation": "<p>Từ chối lời mời chơi cờ vua: <strong>\"I'm afraid I don't know how to play it.\"</strong> (E là mình không biết chơi cờ vua rồi).</p>",
        "ruleTip": "Từ chối lời mời chơi trò chơi vì không biết chơi: 'I'm afraid I don't know how to play it.'."
    },
    {
        "id": "80_15",
        "questionName": "Question 15",
        "questionText": "<p><strong>George:</strong> \"Let's organize a book exchange fair for our class.\"<br/><strong>Class monitor:</strong> \"________\"</p>",
        "choices": [
            {"id": "80_15_1", "text": "I couldn't agree more. Let's plan it.", "html": "I couldn't agree more. Let's plan it."},
            {"id": "80_15_2", "text": "You're welcome.", "html": "You're welcome."},
            {"id": "80_15_3", "text": "Never mind.", "html": "Never mind."},
            {"id": "80_15_4", "text": "It's a pity.", "html": "It's a pity."}
        ],
        "correctChoiceId": "80_15_1",
        "explanation": "<p>Lớp trưởng đồng ý hoàn toàn: <strong>\"I couldn't agree more. Let's plan it.\"</strong> (Mình hoàn toàn đồng ý. Chúng ta hãy lên kế hoạch thôi).</p>",
        "ruleTip": "'I couldn't agree more' (Tôi hoàn toàn đồng ý) là sự tán thành tuyệt đối với một đề xuất hay."
    }
]

theory80 = {
    "topicId": 80,
    "topicName": "Gợi ý, lời đề nghị và lời mời",
    "englishName": "Suggestions, Offers and Invitations",
    "rules": [
        {
            "rule": "1. Đưa ra gợi ý (Suggestions) & Phản hồi:",
            "formula": "Why don't we + V-inf? / Let's + V-inf / How about / What about + V-ing? / Shall we + V-inf?",
            "examples": "Đồng ý: 'That's a great idea!' / 'Sounds good to me!' / 'That sounds like fun!'. Từ chối: 'I'd love to, but I have to study.'"
        },
        {
            "rule": "2. Đưa ra lời đề nghị giúp đỡ (Offers) & Phản hồi:",
            "formula": "Can/May I help you? / Shall I + V-inf? / Would you like me to + V-inf?",
            "examples": "Đồng ý: 'Yes, please. That's very kind of you.' Từ chối: 'No, thank you. I can manage it myself.'"
        },
        {
            "rule": "3. Đưa ra lời mời (Invitations) & Phản hồi:",
            "formula": "Would you like to + V-inf? / Do you want to join us for...?",
            "examples": "Đồng ý: 'Yes, I'd love to. Thank you!' / 'Sure, why not?'. Từ chối: 'I'd love to, but I'm afraid I have an appointment.'"
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
        (68, q68, theory68),
        (69, q69, theory69),
        (70, q70, theory70),
        (72, q72, theory72),
        (29, q29, theory29),
        (30, q30, theory30),
        (78, q78, theory78),
        (79, q79, theory79),
        (80, q80, theory80)
    ]
    for tid, qs, th in datasets:
        save_data(tid, qs, th)

    # Create aliases for taxonomy synchronization
    create_alias(70, 26)
    create_alias(70, 27)
    create_alias(72, 28)
    create_alias(80, 307)
    create_alias(80, 301)
    print("All Phonetics & Speaking topics and aliases successfully generated!")

if __name__ == "__main__":
    main()
