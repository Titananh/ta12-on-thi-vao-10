'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { ExamQuestion } from './ExamRunner';

interface QuestionResult {
  totalUnits: number;
  answeredUnits: number;
  correctUnits: number;
  isFullyAnswered: boolean;
  isFullyCorrect: boolean;
}

interface DiagnosticProps {
  questions: ExamQuestion[];
  answers: Record<string, any>;
  getQuestionResult: (q: ExamQuestion, ans: any) => QuestionResult;
}

interface DangBaiItem {
  name: string;
  sectionId: string;
}

interface ChuDiemItem {
  name: string;
  topicId: number;
}

function getQuestionDangBai(q: ExamQuestion): DangBaiItem {
  const text = (q.questionText || '').toLowerCase();
  const passage = (q.passageText || '').toLowerCase();
  const hint = (q.hint || '').toLowerCase();
  const exp = (q.explanation || '').toLowerCase();

  if (q.images && q.images.length > 0) return { name: 'ĐỌC - Hiểu nội dung hình ảnh, biển báo', sectionId: 'sign_notices' };
  if (text.includes('sign') || text.includes('notice') || text.includes('biển báo')) return { name: 'ĐỌC - Hiểu nội dung hình ảnh, biển báo', sectionId: 'sign_notices' };
  if (passage || text.includes('read the following passage') || text.includes('đọc đoạn văn')) return { name: 'ĐỌC HIỂU - Trả lời câu hỏi đọc hiểu', sectionId: 'reading_comprehension' };
  if (q.fillblankAnswers?.length || text.includes('fillblank-option') || text.includes('chọn từ/cụm từ trong số vài lựa chọn của mỗi chỗ trống')) return { name: 'HOÀN THÀNH ĐOẠN VĂN - Chọn một từ/cụm từ trong số vài lựa chọn của mỗi chỗ trống', sectionId: 'guided_cloze' };
  if (text.includes('stress') || text.includes('trọng âm') || hint.includes('trọng âm') || exp.includes('trọng âm')) return { name: 'NGỮ ÂM - Trọng âm', sectionId: 'stress' };
  if (text.includes('pronounced') || text.includes('underlined part') || text.includes('phát âm') || exp.includes('phát âm')) return { name: 'NGỮ ÂM - Phát âm', sectionId: 'pronunciation' };
  if (text.includes('correction') || text.includes('mistake') || text.includes('lỗi sai') || exp.includes('tìm lỗi')) return { name: 'TÌM LỖI SAI - Nhận diện lỗi sai ngữ pháp', sectionId: 'error_identification' };
  if (text.includes('closest in meaning to the original') || text.includes('sát câu gốc') || text.includes('meaning to the following sentence')) return { name: 'VIẾT CÂU - Chọn câu sát câu gốc', sectionId: 'sentence_transformation' };
  if (text.includes('combines') || text.includes('kết hợp câu') || text.includes('combine the sentences')) return { name: 'VIẾT CÂU - Chọn cách tạo câu từ các từ gợi ý', sectionId: 'sentence_combination' };
  if (text.includes('closest in meaning') || text.includes('opposite in meaning') || text.includes('đồng nghĩa') || text.includes('trái nghĩa')) return { name: 'TỪ VỰNG - Từ đồng nghĩa và trái nghĩa', sectionId: 'grammar_vocab_cloze' };
  if (text.includes('–') && (text.includes(':') || text.includes('conversation') || text.includes('hội thoại') || exp.includes('giao tiếp'))) return { name: 'HOÀN THÀNH HỘI THOẠI - Chọn cụm từ/câu để hoàn thành hội thoại 2 lượt lời', sectionId: 'communicative_functions' };

  return { name: 'HOÀN THÀNH CÂU VỀ NGỮ PHÁP - Chọn từ/cụm từ điền vào chỗ trống', sectionId: 'grammar_vocab_cloze' };
}

function getQuestionChuDiem(q: ExamQuestion): ChuDiemItem {
  const combined = `${q.questionText || ''} ${q.hint || ''} ${q.explanation || ''}`.toLowerCase();

  if (combined.includes('đuôi "ed"') || combined.includes('phát âm ed') || combined.includes('đuôi ed') || combined.includes('-ed')) return { name: 'Phonetics/Đuôi "ed"', topicId: 68 };
  if (combined.includes('đuôi "s"') || combined.includes('đuôi "es"') || combined.includes('phát âm s/es') || combined.includes('-s/es')) return { name: 'Phonetics/Đuôi "s"/"es"', topicId: 69 };
  if (combined.includes('từ có 2 âm tiết') || combined.includes('2-syllable')) return { name: 'Phonetics/Từ có 2 âm tiết', topicId: 29 };
  if (combined.includes('từ có 3 âm tiết') || combined.includes('3-syllable')) return { name: 'Phonetics/Từ có 3 âm tiết', topicId: 30 };
  if (combined.includes('câu điều kiện') || combined.includes('conditional') || combined.includes('if type')) return { name: 'Grammar/Câu điều kiện', topicId: 126 };
  if (combined.includes('câu ước') || combined.includes('wish')) return { name: 'Grammar/Câu ước (Wish)', topicId: 141 };
  if (combined.includes('câu bị động') || combined.includes('passive voice')) return { name: 'Grammar/Câu bị động', topicId: 143 };
  if (combined.includes('đại từ quan hệ') || combined.includes('mệnh đề quan hệ') || combined.includes('relative clause')) return { name: 'Grammar/Mệnh đề quan hệ', topicId: 151 };
  if (combined.includes('câu gián tiếp') || combined.includes('câu trực tiếp') || combined.includes('reported speech')) return { name: 'Grammar/Câu gián tiếp', topicId: 114 };
  if (combined.includes('mạo từ') || combined.includes('articles (a/an/the)')) return { name: 'Grammar/Mạo từ xác định và mạo từ không xác định (a/an/the)', topicId: 109 };
  if (combined.includes('liên từ') || combined.includes('conjunctions') || combined.includes('although') || combined.includes('because')) return { name: 'Grammar/Liên từ chỉ nguyên nhân, nhượng bộ', topicId: 399 };
  if (combined.includes('so sánh') || combined.includes('comparative') || combined.includes('superlative')) return { name: 'Grammar/Các cấp so sánh', topicId: 257 };
  if (combined.includes('câu hỏi đuôi') || combined.includes('tag question')) return { name: 'Grammar/Câu hỏi đuôi (Tag questions)', topicId: 168 };
  if (combined.includes('động từ khuyết thiếu') || combined.includes('modal verbs')) return { name: 'Grammar/Động từ khuyết thiếu (Modal verbs)', topicId: 313 };
  if (combined.includes('thì hiện tại hoàn thành') || combined.includes('present perfect')) return { name: 'Grammar/Thì hiện tại hoàn thành', topicId: 429 };
  if (combined.includes('thì quá khứ đơn') || combined.includes('past simple')) return { name: 'Grammar/Thì quá khứ đơn', topicId: 91 };
  if (combined.includes('thì quá khứ tiếp diễn') || combined.includes('past continuous')) return { name: 'Grammar/Thì quá khứ tiếp diễn', topicId: 92 };
  if (combined.includes('thì tương lai') || combined.includes('future tense')) return { name: 'Grammar/Thì tương lai đơn và tương lai gần', topicId: 95 };
  if (combined.includes('cụm động từ') || combined.includes('phrasal verb')) return { name: 'Vocabulary/Cụm động từ (Phrasal verbs)', topicId: 73 };
  if (combined.includes('thành ngữ') || combined.includes('idiom') || combined.includes('tight with money')) return { name: 'Vocabulary/Thành ngữ thông dụng', topicId: 74 };
  if (combined.includes('từ đồng nghĩa') || combined.includes('synonym')) return { name: 'Vocabulary/Từ đồng nghĩa', topicId: 1644 };
  if (combined.includes('từ trái nghĩa') || combined.includes('antonym')) return { name: 'Vocabulary/Từ trái nghĩa', topicId: 1662 };
  if (combined.includes('collocation') || combined.includes('cụm từ cố định')) return { name: 'Vocabulary/Cụm từ cố định (Collocations)', topicId: 216 };
  if (combined.includes('đoạn văn') || combined.includes('đọc hiểu') || combined.includes('main idea')) return { name: 'Reading/Kỹ năng đọc hiểu & tìm ý chính', topicId: 58 };

  return { name: 'Grammar/Cấu trúc câu & Ngữ pháp tổng hợp', topicId: 383 };
}

export default function DiagnosticAnalysisSection({
  questions,
  answers,
  getQuestionResult
}: DiagnosticProps) {
  const router = useRouter();

  // 1. Group by Dạng bài
  const { dangBaiNeedImprove, dangBaiGood } = useMemo(() => {
    const groups: Record<string, { name: string; sectionId: string; correct: number; wrong: number }> = {};

    questions.forEach((q) => {
      const { name, sectionId } = getQuestionDangBai(q);
      if (!groups[name]) groups[name] = { name, sectionId, correct: 0, wrong: 0 };

      const userChoice = answers[String(q.id)];
      const res = getQuestionResult(q, userChoice);
      if (res.isFullyCorrect) {
        groups[name].correct++;
      } else {
        groups[name].wrong++;
      }
    });

    const need: Array<{ name: string; sectionId: string; correct: number; wrong: number }> = [];
    const good: Array<{ name: string; sectionId: string; correct: number; wrong: number }> = [];

    Object.values(groups).forEach((g) => {
      if (g.wrong > 0) {
        need.push(g);
      } else if (g.correct > 0) {
        good.push(g);
      }
    });

    return { dangBaiNeedImprove: need, dangBaiGood: good };
  }, [questions, answers, getQuestionResult]);

  // 2. Group by Chủ điểm
  const { chuDiemNeedImprove, chuDiemGood } = useMemo(() => {
    const groups: Record<string, { name: string; topicId: number; correct: number; wrong: number }> = {};

    questions.forEach((q) => {
      const { name, topicId } = getQuestionChuDiem(q);
      if (!groups[name]) groups[name] = { name, topicId, correct: 0, wrong: 0 };

      const userChoice = answers[String(q.id)];
      const res = getQuestionResult(q, userChoice);
      if (res.isFullyCorrect) {
        groups[name].correct++;
      } else {
        groups[name].wrong++;
      }
    });

    const need: Array<{ name: string; topicId: number; correct: number; wrong: number }> = [];
    const good: Array<{ name: string; topicId: number; correct: number; wrong: number }> = [];

    Object.values(groups).forEach((g) => {
      if (g.wrong > 0) {
        need.push(g);
      } else if (g.correct > 0) {
        good.push(g);
      }
    });

    return { chuDiemNeedImprove: need, chuDiemGood: good };
  }, [questions, answers, getQuestionResult]);

  const [selectedDangBai, setSelectedDangBai] = useState<string[]>([]);
  const [selectedChuDiem, setSelectedChuDiem] = useState<string[]>([]);

  // Init selection with top 5
  React.useEffect(() => {
    setSelectedDangBai(dangBaiNeedImprove.slice(0, 5).map((d) => d.name));
    setSelectedChuDiem(chuDiemNeedImprove.slice(0, 5).map((c) => c.name));
  }, [dangBaiNeedImprove, chuDiemNeedImprove]);

  const handleStartCustomSession = (selectedItems: string[]) => {
    const topicIdMap: Record<string, number | number[]> = {
      'Phonetics/Đuôi "ed"': 68,
      'Phonetics/Đuôi "s"/"es"': 69,
      'Phonetics/Từ có 2 âm tiết': 29,
      'Phonetics/Từ có 3 âm tiết': 30,
      'Grammar/Câu điều kiện': 126,
      'Grammar/Câu ước (Wish)': 141,
      'Grammar/Câu bị động': 143,
      'Grammar/Mệnh đề quan hệ': 151,
      'Grammar/Câu gián tiếp': 114,
      'Grammar/Mạo từ xác định và mạo từ không xác định (a/an/the)': 109,
      'Grammar/Liên từ chỉ nguyên nhân, nhượng bộ': 399,
      'Grammar/Các cấp so sánh': 257,
      'Grammar/Câu hỏi đuôi (Tag questions)': 168,
      'Grammar/Động từ khuyết thiếu (Modal verbs)': 313,
      'Grammar/Thì hiện tại hoàn thành': 429,
      'Grammar/Thì quá khứ đơn': 91,
      'Grammar/Thì quá khứ tiếp diễn': 92,
      'Grammar/Thì tương lai đơn và tương lai gần': 95,
      'Vocabulary/Cụm động từ (Phrasal verbs)': 73,
      'Vocabulary/Thành ngữ thông dụng': 74,
      'Vocabulary/Từ đồng nghĩa': 1644,
      'Vocabulary/Từ trái nghĩa': 1662,
      'Vocabulary/Cụm từ cố định (Collocations)': 216,
      'Reading/Kỹ năng đọc hiểu & tìm ý chính': 58,
      'Grammar/Cấu trúc câu & Ngữ pháp tổng hợp': 383,
      // Section mappings
      'ĐỌC - Hiểu nội dung hình ảnh, biển báo': [67, 62],
      'ĐỌC HIỂU - Trả lời câu hỏi đọc hiểu': [58, 62, 67],
      'HOÀN THÀNH ĐOẠN VĂN - Chọn một từ/cụm từ trong số vài lựa chọn của mỗi chỗ trống': [109, 399, 151],
      'NGỮ ÂM - Trọng âm': [29, 30],
      'NGỮ ÂM - Phát âm': [68, 69],
      'TÌM LỖI SAI - Nhận diện lỗi sai ngữ pháp': [100, 143, 151],
      'VIẾT CÂU - Chọn câu sát câu gốc': [143, 114, 126],
      'VIẾT CÂU - Chọn cách tạo câu từ các từ gợi ý': [383, 399],
      'TỪ VỰNG - Từ đồng nghĩa và trái nghĩa': [1644, 1662, 73],
      'HOÀN THÀNH HỘI THOẠI - Chọn cụm từ/câu để hoàn thành hội thoại 2 lượt lời': [78, 79, 82],
      'HOÀN THÀNH CÂU VỀ NGỮ PHÁP - Chọn từ/cụm từ điền vào chỗ trống': [73, 216, 429],
    };

    const numericTopicIds: number[] = [];
    selectedItems.forEach((name) => {
      if (/^\d+$/.test(name)) {
        numericTopicIds.push(parseInt(name, 10));
      } else if (topicIdMap[name]) {
        const val = topicIdMap[name];
        if (Array.isArray(val)) {
          numericTopicIds.push(...val);
        } else {
          numericTopicIds.push(val);
        }
      } else {
        const found = chuDiemNeedImprove.find((c) => c.name === name);
        if (found && found.topicId) {
          numericTopicIds.push(found.topicId);
        }
      }
    });

    const uniqueTopicIds = Array.from(new Set(numericTopicIds));
    const finalIds = uniqueTopicIds.length > 0 ? uniqueTopicIds : [126, 143, 151];
    router.push(`/practice/custom?topics=${finalIds.join(',')}&count=20`);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TIER 1: Phân tích kết quả theo dạng bài */}
      {/* ========================================================================= */}
      <div className="analysis-container bg-white dark:bg-[#242824] rounded-2xl p-5 border border-slate-200 dark:border-[#383c38] shadow-xs space-y-4">
        <div className="analysis-header border-b border-slate-100 dark:border-[#383c38] pb-3">
          <strong
            className="text-base font-extrabold text-[#1c581f] dark:text-emerald-300"
            data-testid="taxonomy-analysis-title"
          >
            Phân tích kết quả theo dạng bài
          </strong>
        </div>

        {/* Group: Cần ôn luyện thêm */}
        {dangBaiNeedImprove.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 dark:bg-[#1e221e] p-3 rounded-xl border border-slate-200 dark:border-[#383c38]">
              <span className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Cần ôn luyện thêm - {dangBaiNeedImprove.length} dạng bài</span>
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDangBai.length === dangBaiNeedImprove.length) {
                      setSelectedDangBai([]);
                    } else {
                      setSelectedDangBai(dangBaiNeedImprove.map((d) => d.name));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
                >
                  {selectedDangBai.length === dangBaiNeedImprove.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartCustomSession(selectedDangBai)}
                  disabled={selectedDangBai.length === 0}
                  data-testid="taxonomy-practice-session-btn"
                  className="app-btn-base app-btn-positive-outline px-3 py-1.5 text-xs font-bold disabled:opacity-40"
                >
                  Tạo phiên ôn luyện ({selectedDangBai.length})
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {dangBaiNeedImprove.map((item, idx) => {
                const isChecked = selectedDangBai.includes(item.name);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#1a1d1a] gap-2.5 transition hover:border-[#5fbd18]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedDangBai((prev) =>
                            prev.includes(item.name)
                              ? prev.filter((n) => n !== item.name)
                              : [...prev, item.name]
                          );
                        }}
                        className="w-4 h-4 accent-[#5fbd18] rounded cursor-pointer shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Đúng-Sai: <strong className="text-[#5fbd18]">{item.correct}</strong>-<strong className="text-[#db2828]">{item.wrong}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push(`/practice/${item.sectionId}?sectionId=${item.sectionId}&count=20`)}
                        className="app-btn-base app-btn-positive-outline px-3 py-1 text-xs font-bold"
                      >
                        Luyện dạng bài này
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Group: Làm tốt */}
        {dangBaiGood.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs sm:text-sm font-bold text-[#5fbd18] flex items-center gap-1.5 mb-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Làm tốt - {dangBaiGood.length} dạng bài</span>
            </span>

            <div className="space-y-1.5">
              {dangBaiGood.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-100 dark:border-[#2d3a2d] bg-emerald-50/50 dark:bg-[#182418] text-xs sm:text-sm"
                >
                  <span className="font-semibold text-slate-700 dark:text-emerald-200">{item.name}</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Đúng-Sai: {item.correct}-0
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Phân tích kết quả theo chủ điểm */}
      {/* ========================================================================= */}
      <div className="analysis-container bg-white dark:bg-[#242824] rounded-2xl p-5 border border-slate-200 dark:border-[#383c38] shadow-xs space-y-4">
        <div className="analysis-header border-b border-slate-100 dark:border-[#383c38] pb-3">
          <strong
            className="text-base font-extrabold text-[#1c581f] dark:text-emerald-300"
            data-testid="topic-analysis-title"
          >
            Phân tích kết quả theo chủ điểm
          </strong>
        </div>

        {/* Group: Cần ôn luyện thêm */}
        {chuDiemNeedImprove.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 dark:bg-[#1e221e] p-3 rounded-xl border border-slate-200 dark:border-[#383c38]">
              <span className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Cần ôn luyện thêm - {chuDiemNeedImprove.length} chủ điểm</span>
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedChuDiem.length === chuDiemNeedImprove.length) {
                      setSelectedChuDiem([]);
                    } else {
                      setSelectedChuDiem(chuDiemNeedImprove.map((c) => c.name));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
                >
                  {selectedChuDiem.length === chuDiemNeedImprove.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartCustomSession(selectedChuDiem)}
                  disabled={selectedChuDiem.length === 0}
                  data-testid="topic-practice-session-btn"
                  className="app-btn-base app-btn-positive-outline px-3 py-1.5 text-xs font-bold disabled:opacity-40"
                >
                  Tạo phiên ôn luyện ({selectedChuDiem.length})
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {chuDiemNeedImprove.map((item, idx) => {
                const isChecked = selectedChuDiem.includes(item.name);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#1a1d1a] gap-2.5 transition hover:border-[#5fbd18]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedChuDiem((prev) =>
                            prev.includes(item.name)
                              ? prev.filter((n) => n !== item.name)
                              : [...prev, item.name]
                          );
                        }}
                        className="w-4 h-4 accent-[#5fbd18] rounded cursor-pointer shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Đúng-Sai: <strong className="text-[#5fbd18]">{item.correct}</strong>-<strong className="text-[#db2828]">{item.wrong}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push(`/practice/${item.topicId}`)}
                        className="app-btn-base app-btn-positive-outline px-3 py-1 text-xs font-bold"
                      >
                        Luyện chủ điểm này
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Group: Làm tốt */}
        {chuDiemGood.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs sm:text-sm font-bold text-[#5fbd18] flex items-center gap-1.5 mb-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Làm tốt - {chuDiemGood.length} chủ điểm</span>
            </span>

            <div className="space-y-1.5">
              {chuDiemGood.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-100 dark:border-[#2d3a2d] bg-emerald-50/50 dark:bg-[#182418] text-xs sm:text-sm"
                >
                  <span className="font-semibold text-slate-700 dark:text-emerald-200">{item.name}</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Đúng-Sai: {item.correct}-0
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
