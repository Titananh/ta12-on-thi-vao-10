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

function getQuestionDangBai(q: ExamQuestion): string {
  const text = (q.questionText || '').toLowerCase();
  const passage = (q.passageText || '').toLowerCase();
  const hint = (q.hint || '').toLowerCase();
  const exp = (q.explanation || '').toLowerCase();

  if (q.images && q.images.length > 0) return 'ĐỌC - Hiểu nội dung hình ảnh, biển báo';
  if (text.includes('sign') || text.includes('notice') || text.includes('biển báo')) return 'ĐỌC - Hiểu nội dung hình ảnh, biển báo';
  if (passage || text.includes('read the following passage') || text.includes('đọc đoạn văn')) return 'ĐỌC HIỂU - Trả lời câu hỏi đọc hiểu';
  if (q.fillblankAnswers?.length || text.includes('fillblank-option') || text.includes('chọn từ/cụm từ trong số vài lựa chọn của mỗi chỗ trống')) return 'HOÀN THÀNH ĐOẠN VĂN - Chọn một từ/cụm từ trong số vài lựa chọn của mỗi chỗ trống';
  if (text.includes('stress') || text.includes('trọng âm') || hint.includes('trọng âm') || exp.includes('trọng âm')) return 'NGỮ ÂM - Trọng âm';
  if (text.includes('pronounced') || text.includes('underlined part') || text.includes('phát âm') || exp.includes('phát âm')) return 'NGỮ ÂM - Phát âm';
  if (text.includes('correction') || text.includes('mistake') || text.includes('lỗi sai') || exp.includes('tìm lỗi')) return 'TÌM LỖI SAI - Nhận diện lỗi sai ngữ pháp';
  if (text.includes('closest in meaning to the original') || text.includes('sát câu gốc') || text.includes('meaning to the following sentence')) return 'VIẾT CÂU - Chọn câu sát câu gốc';
  if (text.includes('combines') || text.includes('kết hợp câu') || text.includes('combine the sentences')) return 'VIẾT CÂU - Chọn cách tạo câu từ các từ gợi ý';
  if (text.includes('closest in meaning') || text.includes('opposite in meaning') || text.includes('đồng nghĩa') || text.includes('trái nghĩa')) return 'TỪ VỰNG - Từ đồng nghĩa và trái nghĩa';
  if (text.includes('–') && (text.includes(':') || text.includes('conversation') || text.includes('hội thoại') || exp.includes('giao tiếp'))) return 'HOÀN THÀNH HỘI THOẠI - Chọn cụm từ/câu để hoàn thành hội thoại 2 lượt lời';

  return 'HOÀN THÀNH CÂU VỀ NGỮ PHÁP - Chọn từ/cụm từ điền vào chỗ trống';
}

function getQuestionChuDiem(q: ExamQuestion): string {
  const combined = `${q.questionText || ''} ${q.hint || ''} ${q.explanation || ''}`.toLowerCase();

  if (combined.includes('đuôi "ed"') || combined.includes('phát âm ed') || combined.includes('đuôi ed') || combined.includes('-ed')) return 'Phonetics/Đuôi "ed"';
  if (combined.includes('đuôi "s"') || combined.includes('đuôi "es"') || combined.includes('phát âm s/es') || combined.includes('-s/es')) return 'Phonetics/Đuôi "s"/"es"';
  if (combined.includes('từ có 2 âm tiết') || combined.includes('2-syllable')) return 'Phonetics/Từ có 2 âm tiết';
  if (combined.includes('từ có 3 âm tiết') || combined.includes('3-syllable')) return 'Phonetics/Từ có 3 âm tiết';
  if (combined.includes('câu điều kiện') || combined.includes('conditional') || combined.includes('if type')) return 'Grammar/Câu điều kiện';
  if (combined.includes('câu ước') || combined.includes('wish')) return 'Grammar/Câu ước (Wish)';
  if (combined.includes('câu bị động') || combined.includes('passive voice')) return 'Grammar/Câu bị động';
  if (combined.includes('đại từ quan hệ') || combined.includes('mệnh đề quan hệ') || combined.includes('relative clause')) return 'Grammar/Mệnh đề quan hệ';
  if (combined.includes('câu gián tiếp') || combined.includes('câu trực tiếp') || combined.includes('reported speech')) return 'Grammar/Câu gián tiếp';
  if (combined.includes('mạo từ') || combined.includes('articles (a/an/the)')) return 'Grammar/Mạo từ xác định và mạo từ không xác định (a/an/the)';
  if (combined.includes('liên từ') || combined.includes('conjunctions') || combined.includes('although') || combined.includes('because')) return 'Grammar/Liên từ chỉ nguyên nhân, nhượng bộ';
  if (combined.includes('so sánh') || combined.includes('comparative') || combined.includes('superlative')) return 'Grammar/Các cấp so sánh';
  if (combined.includes('câu hỏi đuôi') || combined.includes('tag question')) return 'Grammar/Câu hỏi đuôi (Tag questions)';
  if (combined.includes('động từ khuyết thiếu') || combined.includes('modal verbs')) return 'Grammar/Động từ khuyết thiếu (Modal verbs)';
  if (combined.includes('thì hiện tại hoàn thành') || combined.includes('present perfect')) return 'Grammar/Thì hiện tại hoàn thành';
  if (combined.includes('thì quá khứ đơn') || combined.includes('past simple')) return 'Grammar/Thì quá khứ đơn';
  if (combined.includes('thì quá khứ tiếp diễn') || combined.includes('past continuous')) return 'Grammar/Thì quá khứ tiếp diễn';
  if (combined.includes('thì tương lai') || combined.includes('future tense')) return 'Grammar/Thì tương lai đơn và tương lai gần';
  if (combined.includes('cụm động từ') || combined.includes('phrasal verb')) return 'Vocabulary/Cụm động từ (Phrasal verbs)';
  if (combined.includes('thành ngữ') || combined.includes('idiom') || combined.includes('tight with money')) return 'Vocabulary/Thành ngữ thông dụng';
  if (combined.includes('từ đồng nghĩa') || combined.includes('synonym')) return 'Vocabulary/Từ đồng nghĩa';
  if (combined.includes('từ trái nghĩa') || combined.includes('antonym')) return 'Vocabulary/Từ trái nghĩa';
  if (combined.includes('collocation') || combined.includes('cụm từ cố định')) return 'Vocabulary/Cụm từ cố định (Collocations)';
  if (combined.includes('đoạn văn') || combined.includes('đọc hiểu') || combined.includes('main idea')) return 'Reading/Kỹ năng đọc hiểu & tìm ý chính';

  return 'Grammar/Cấu trúc câu & Ngữ pháp tổng hợp';
}

export default function DiagnosticAnalysisSection({
  questions,
  answers,
  getQuestionResult
}: DiagnosticProps) {
  const router = useRouter();

  // 1. Group by Dạng bài
  const { dangBaiNeedImprove, dangBaiGood } = useMemo(() => {
    const groups: Record<string, { name: string; correct: number; wrong: number }> = {};

    questions.forEach((q) => {
      const name = getQuestionDangBai(q);
      if (!groups[name]) groups[name] = { name, correct: 0, wrong: 0 };

      const userChoice = answers[String(q.id)];
      const res = getQuestionResult(q, userChoice);
      if (res.isFullyCorrect) {
        groups[name].correct++;
      } else {
        groups[name].wrong++;
      }
    });

    const need: Array<{ name: string; correct: number; wrong: number }> = [];
    const good: Array<{ name: string; correct: number; wrong: number }> = [];

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
    const groups: Record<string, { name: string; correct: number; wrong: number }> = {};

    questions.forEach((q) => {
      const name = getQuestionChuDiem(q);
      if (!groups[name]) groups[name] = { name, correct: 0, wrong: 0 };

      const userChoice = answers[String(q.id)];
      const res = getQuestionResult(q, userChoice);
      if (res.isFullyCorrect) {
        groups[name].correct++;
      } else {
        groups[name].wrong++;
      }
    });

    const need: Array<{ name: string; correct: number; wrong: number }> = [];
    const good: Array<{ name: string; correct: number; wrong: number }> = [];

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

  const handleStartCustomSession = (topics: string[]) => {
    router.push(`/practice/custom?topics=${encodeURIComponent(topics.join(','))}&count=20`);
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
                        onClick={() => router.push('/practice/guided_cloze?sectionId=guided_cloze')}
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
                        onClick={() => router.push('/practice/29')}
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
