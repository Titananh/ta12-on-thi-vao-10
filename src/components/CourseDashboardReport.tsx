'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Pencil,
  Check,
  Layers,
  Clock,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface StatsState {
  questionsDone: number;
  quizzesDone: number;
  accuracy: number;
  taxonomiesDone: number;
  minutesSpent: number;
  topicsDone: number;
}

export default function CourseDashboardReport() {
  const [timeFilter, setTimeFilter] = useState<'7d' | '15d' | '30d' | '7' | '15' | '30'>('7d');
  const [stats, setStats] = useState<StatsState>({
    questionsDone: 0,
    quizzesDone: 0,
    accuracy: 100,
    taxonomiesDone: 0,
    minutesSpent: 0,
    topicsDone: 0,
  });

  useEffect(() => {
    try {
      let qCount = 0;
      let examCount = 0;
      let totalScore = 0;
      let evaluatedExams = 0;
      let topicsCount = 0;
      let taxonomiesCount = 0;

      let days = 7;
      if (timeFilter === '15d' || timeFilter === '15') days = 15;
      else if (timeFilter === '30d' || timeFilter === '30') days = 30;
      else if (timeFilter === '7d' || timeFilter === '7') days = 7;
      const cutoff = Date.now() - days * 86400000;

      // Read exam results
      const examSaved = localStorage.getItem('ta12_exam_results');
      if (examSaved) {
        const parsed = JSON.parse(examSaved);
        const allEntries = Object.values(parsed) as any[];
        const filteredEntries = allEntries.filter((e) => {
          if (!e) return false;
          const ts = typeof e.completedAt === 'number' ? e.completedAt : (e.completedAt ? new Date(e.completedAt).getTime() : null);
          if (ts !== null && !isNaN(ts)) {
            return ts >= cutoff;
          }
          return true;
        });
        examCount = filteredEntries.length;
        filteredEntries.forEach((e) => {
          if (e.totalQuestions) qCount += e.totalQuestions;
          if (typeof e.score === 'number') {
            totalScore += (e.score / 10) * 100;
            evaluatedExams++;
          }
        });
      }

      // Read topic practice progress
      const progSaved = localStorage.getItem('ta12_progress');
      if (progSaved) {
        const parsed = JSON.parse(progSaved);
        const progEntries = Object.entries(parsed).filter(([_, val]: [string, any]) => {
          if (val && typeof val === 'object') {
            const ts = typeof val.completedAt === 'number' ? val.completedAt : (val.completedAt ? new Date(val.completedAt).getTime() : (val.lastTrainedAt ? new Date(val.lastTrainedAt).getTime() : null));
            if (ts !== null && !isNaN(ts)) {
              return ts >= cutoff;
            }
          }
          return true;
        });
        topicsCount = progEntries.length;
        // Each topic practice session is typically 15-20 questions
        qCount += topicsCount * 15;
      }

      // Read section progress
      const secSaved = localStorage.getItem('ta12_section_progress');
      if (secSaved) {
        const parsed = JSON.parse(secSaved);
        const secEntries = Object.values(parsed).filter((sec: any) => {
          if (sec && typeof sec === 'object') {
            const ts = typeof sec.completedAt === 'number' ? sec.completedAt : (sec.completedAt ? new Date(sec.completedAt).getTime() : (sec.lastTrainedAt ? new Date(sec.lastTrainedAt).getTime() : null));
            if (ts !== null && !isNaN(ts)) {
              return ts >= cutoff;
            }
          }
          return true;
        });
        taxonomiesCount = secEntries.length;
      }

      const calculatedAccuracy = evaluatedExams > 0 ? Math.round(totalScore / evaluatedExams) : (qCount > 0 ? 90 : 0);
      const calculatedMinutes = Math.round((qCount * 1.5) + (examCount * 45));

      setStats({
        questionsDone: qCount,
        quizzesDone: examCount,
        accuracy: calculatedAccuracy,
        taxonomiesDone: taxonomiesCount,
        minutesSpent: calculatedMinutes,
        topicsDone: topicsCount,
      });
    } catch (e) {
      // Fallback cleanly
    }
  }, [timeFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-2">
      {/* Left container: Thống kê */}
      <div className="lg:col-span-6 bg-slate-50 dark:bg-[#1e221e] rounded-xl p-4 border border-slate-200 dark:border-[#383c38] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base font-extrabold text-[#1c581f] dark:text-emerald-300">
            Thống kê
          </h3>
          <div className="relative inline-block text-xs">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="bg-white dark:bg-[#252825] border border-slate-200 dark:border-[#383c38] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 pr-6 appearance-none outline-none cursor-pointer focus:border-[#5fbd18]"
            >
              <option value="7d">7 Ngày gần đây</option>
              <option value="15d">15 Ngày gần đây</option>
              <option value="30d">30 Ngày gần đây</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 6 Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Box 1: Câu hỏi đã làm */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div
                className="text-xl font-black text-slate-800 dark:text-white leading-tight"
                data-testid="stat-box-value-question"
              >
                {stats.questionsDone}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Câu hỏi đã làm
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Box 2: Đề/bài tập đã làm */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div
                className="text-xl font-black text-slate-800 dark:text-white leading-tight"
                data-testid="stat-box-value-quiz"
              >
                {stats.quizzesDone}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Đề/bài tập đã làm
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
          </div>

          {/* Box 3: Trả lời đúng */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div
                className="text-xl font-black text-slate-800 dark:text-white leading-tight"
                data-testid="stat-box-value-accuracy"
              >
                {stats.accuracy}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Trả lời đúng
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Box 4: Dạng bài đã làm */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div
                className="text-xl font-black text-slate-800 dark:text-white leading-tight"
                data-testid="stat-box-value-taxonomy"
              >
                {stats.taxonomiesDone}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Dạng bài đã làm
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* Box 5: Phút đã ôn luyện */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                {stats.minutesSpent}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Phút đã ôn luyện
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Box 6: Chủ điểm đã làm */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                {stats.topicsDone}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Chủ điểm đã làm
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#1a2d1a] flex items-center justify-center text-[#5fbd18] flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Right container: Gợi ý ưu tiên ôn luyện */}
      <div className="lg:col-span-6 bg-slate-50 dark:bg-[#1e221e] rounded-xl p-4 border border-slate-200 dark:border-[#383c38] shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3.5">
          <Lightbulb className="w-4 h-4 text-[#5fbd18] fill-[#5fbd18]/20" />
          <h3 className="text-base font-extrabold text-[#1c581f] dark:text-emerald-300">
            Gợi ý ưu tiên ôn luyện
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Suggestion 1: Đề nên làm */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Đề nên làm
              </span>
              <Link
                href="/exam/14532"
                data-testid="quiz-todo-title"
                className="text-xs sm:text-sm font-bold text-[#1c581f] dark:text-emerald-300 hover:text-[#5fbd18] transition-colors truncate block"
                title="Đề thi chính thức vào 10 môn Anh Sở Hà Nội năm 2024"
              >
                Đề thi chính thức vào 10 môn Anh Sở Hà Nội năm 2024
              </Link>
            </div>
            <Link
              href="/exam/14532"
              data-testid="quiz-todo-button"
              className="inline-flex items-center justify-center gap-1 rounded bg-[#5fbd18] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#4ea713] shrink-0"
            >
              <span>Luyện ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Suggestion 2: Dạng bài nên ôn luyện */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Dạng bài nên ôn luyện
              </span>
              <Link
                href="/practice/guided_cloze?sectionId=guided_cloze"
                data-testid="taxonomy-todo-title"
                className="text-xs sm:text-sm font-bold text-[#1c581f] dark:text-emerald-300 hover:text-[#5fbd18] transition-colors truncate block"
                title="HOÀN THÀNH ĐOẠN VĂN - Chọn một từ/cụm từ trong số vài lựa chọn"
              >
                HOÀN THÀNH ĐOẠN VĂN - Chọn từ/cụm từ thích hợp cho ô trống
              </Link>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400" data-testid="taxonomy-score">
                Đúng 0.0%
              </span>
              <Link
                href="/practice/guided_cloze?sectionId=guided_cloze"
                className="inline-flex items-center justify-center gap-1 rounded bg-[#5fbd18] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#4ea713]"
              >
                <span>Luyện ngay</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Suggestion 3: Chủ điểm nên ôn luyện */}
          <div className="bg-white dark:bg-[#252825] rounded-lg p-3 border border-slate-100 dark:border-[#333733] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Chủ điểm nên ôn luyện
              </span>
              <Link
                href="/practice/29"
                data-testid="topic-todo-title"
                className="text-xs sm:text-sm font-bold text-[#1c581f] dark:text-emerald-300 hover:text-[#5fbd18] transition-colors truncate block"
                title="Từ có 2 âm tiết (2-syllable words stress)"
              >
                Trọng âm: Từ có 2 âm tiết (2-syllable words stress)
              </Link>
            </div>
            <Link
              href="/practice/29"
              data-testid="topic-todo-button"
              className="inline-flex items-center justify-center gap-1 rounded bg-[#5fbd18] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#4ea713] shrink-0"
            >
              <span>Luyện ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
