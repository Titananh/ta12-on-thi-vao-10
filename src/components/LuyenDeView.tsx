'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, HelpCircle, Trophy, Search, Sparkles, Award, ArrowRight, RotateCcw } from 'lucide-react';
import cat1097Data from '../../data/exams/category_1097.json';
import cat1687Data from '../../data/exams/category_1687.json';
import cat1489Data from '../../data/exams/category_1489.json';
import cat1263Data from '../../data/exams/category_1263.json';
import cat170Data from '../../data/exams/category_170.json';

interface ExamItem {
  id: number;
  quizName?: string;
  title: string;
  year?: number;
  categoryId: number;
  categoryName?: string;
  timeLimit: number;
  questionCount: number;
  totalPoint?: number;
  description?: string;
}

interface ExamResult {
  examId: string | number;
  examTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt?: number;
}

const CATEGORIES = [
  { id: 1097, name: 'Đề chính thức & mẫu (2019-2026)', count: cat1097Data.length, data: cat1097Data },
  { id: 1687, name: 'Đề THPT Chuyên tại HN', count: cat1687Data.length, data: cat1687Data },
  { id: 1489, name: 'Đề đơn vị GD Hà Nội', count: cat1489Data.length, data: cat1489Data },
  { id: 1263, name: 'Đề chương trình mới', count: cat1263Data.length, data: cat1263Data },
  { id: 170, name: 'Đề ôn luyện các năm trước', count: cat170Data.length, data: cat170Data },
];

export default function LuyenDeView() {
  const [selectedCatId, setSelectedCatId] = useState<number>(1097);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [examResults, setExamResults] = useState<Record<string, ExamResult>>({});

  // Load user exam history from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_exam_results');
      if (saved) {
        setExamResults(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  const allCurrentExams: ExamItem[] = (activeCategory.data as ExamItem[]) || [];

  const filteredExams = allCurrentExams.filter((exam) => {
    const titleMatch = (exam.title || exam.quizName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const yearMatch = exam.year ? String(exam.year).includes(searchTerm) : false;
    return titleMatch || yearMatch;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-white dark:bg-[#242824] p-3 rounded-2xl border border-slate-100 dark:border-[#383c38] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  setSearchTerm('');
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-[#1c581f] text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-[#1a1d1a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2e3b2e] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Info & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>{activeCategory.name}</span>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              {filteredExams.length} đề thi
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mô phỏng thi thật với đồng hồ đếm ngược, bảng palette chuyển câu nhanh và chấm điểm chi tiết.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo năm hoặc tên trường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-[#383c38] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => {
          const result = examResults[String(exam.id)];
          const hasAttempted = Boolean(result);

          return (
            <div
              key={exam.id}
              className="bg-white dark:bg-[#242824] rounded-2xl p-5 border border-slate-200 dark:border-[#383c38] hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Year Accent Banner */}
              {exam.year && (
                <div className="absolute top-0 right-0 bg-emerald-50 dark:bg-emerald-950 text-[#1c581f] dark:text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-100 dark:border-emerald-900">
                  Năm {exam.year}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2 pr-16">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-[#1a1d1a] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Mã đề #{exam.id}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug group-hover:text-[#1c581f] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mt-1">
                  {exam.title || exam.quizName}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-[#383c38]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.timeLimit || 60} phút</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.questionCount} câu hỏi</span>
                  </div>
                </div>

                {/* Score Status */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d1a] border border-slate-100 dark:border-[#383c38] flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Điểm cao nhất:</span>
                  {hasAttempted ? (
                    <span className="font-extrabold text-[#1c581f] dark:text-emerald-300 flex items-center gap-1 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {result.score.toFixed(1)} / 10 ({result.correctCount}/{result.totalQuestions})
                      </span>
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400">Chưa làm</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <Link
                  href={`/exam/${exam.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                    hasAttempted
                      ? 'bg-emerald-50 dark:bg-[#1a1d1a] text-[#1c581f] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                      : 'bg-[#1c581f] text-white hover:bg-[#164718] hover:shadow-md'
                  }`}
                >
                  {hasAttempted ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Làm lại đề thi</span>
                    </>
                  ) : (
                    <>
                      <span>Làm bài</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="bg-white dark:bg-[#242824] rounded-2xl p-12 border border-slate-100 dark:border-[#383c38] text-center text-slate-500 dark:text-slate-400 space-y-2">
          <p className="font-semibold">Không tìm thấy đề thi phù hợp với từ khóa &quot;{searchTerm}&quot;</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
}
