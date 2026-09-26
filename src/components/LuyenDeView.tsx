'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, Crown, ListFilter, Search, Users } from 'lucide-react';
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
  averagePoint?: number | null;
  attemptCount?: number;
  isPremium?: boolean;
  showFeedBackForFreeUser?: boolean;
}

interface ExamResult {
  examId: string | number;
  examTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt?: number;
}

type CategoryId = number | 'all';

// Names and ordering match the public Exam ID 9 catalogue.
const CATEGORIES: Array<{ id: number; name: string; data: ExamItem[] }> = [
  { id: 1263, name: 'Đề luyện thi vào 10 môn Anh Sở Hà Nội theo chương trình mới', data: cat1263Data as ExamItem[] },
  { id: 1097, name: 'Đề thi chính thức/minh họa vào 10 môn Anh Sở Hà Nội qua các năm', data: cat1097Data as ExamItem[] },
  { id: 1687, name: 'Đề thi môn Anh điều kiện các trường THPT Chuyên tại Hà Nội', data: cat1687Data as ExamItem[] },
  { id: 1489, name: 'Đề thi thử vào 10 môn Anh của các đơn vị GD tại Hà Nội', data: cat1489Data as ExamItem[] },
  { id: 170, name: 'Đề luyện thi vào 10 môn Anh Sở Hà Nội từ năm 2024 trở về trước', data: cat170Data as ExamItem[] },
];

const RANKING = [
  ['Nguyễn Ngọc Xuân Lan', '997'], ['Nguyễn Đức Quang Vinh', '750'], ['Nguyễn Trí Dũng', '422'],
  ['Nguyễn Đức Trí', '285'], ['Vũ Duy Khiêm', '273'], ['Vũ Khánh Chi', '271'], ['Hải', '234'],
  ['Trần Minh Nhật', '212'], ['Nguyễn Hồng Bảo Linh', '206'], ['Đinh Nho Hạo', '189'],
];

const GUIDE_LINKS = [
  'Tổng hợp đề thi vào 10 môn Toán, Văn, Tiếng Anh trên toàn quốc từ 2020 đến nay (kèm đáp án chi tiết)',
  'Hướng dẫn ôn thi vào 10 môn tiếng Anh theo đề thi năm 2026 chi tiết',
  'Tuyển tập 100+ đề ôn thi vào 10 môn Tiếng Anh theo mẫu Sở GD&ĐT Hà Nội (kèm đáp án có giải thích chi tiết)',
  'Tổng hợp lịch thi thử vào 10 Hà Nội mới nhất', 'Lộ trình ôn thi Tiếng Anh vào 10 tối ưu cho học sinh lớp 9',
  'Tổng hợp thông tin tuyển sinh lớp 10 tại Hà Nội mới nhất', 'Cẩm nang hướng dẫn ôn thi vào lớp 10 môn tiếng Anh toàn diện',
];

function formatCount(value?: number): string {
  if (!value) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
}

function ExamRow({ exam, result }: { exam: ExamItem; result?: ExamResult }) {
  const title = exam.title || exam.quizName || 'Đề thi Tiếng Anh vào 10';
  const premium = Boolean(exam.isPremium);
  return (
    <article className="group rounded-[4px] border border-slate-200 bg-white px-3 py-2.5 transition hover:border-[#83c224] hover:shadow-sm dark:border-[#383c38] dark:bg-[#242824]">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-2">
            <span className={`mt-0.5 shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${premium ? 'border-orange-200 bg-orange-50 text-orange-500 dark:border-orange-900 dark:bg-orange-950/30' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'}`}>
              {premium ? <><Crown className="mr-0.5 inline h-2.5 w-2.5" />PRO</> : 'Free'}
            </span>
            <Link href={`/exam/${exam.id}/intro`} className="min-w-0 truncate text-xs font-bold leading-5 text-[#1c581f] hover:text-[#5fbd18] dark:text-emerald-300 dark:hover:text-emerald-200" title={title}>{title}</Link>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 pl-7 text-[11px] text-slate-500 dark:text-slate-400">
            {exam.showFeedBackForFreeUser && <span className="font-semibold text-[#5fbd18]"><CheckCircle2 className="mr-1 inline h-3 w-3" />Có giải thích đáp án cho tài khoản FREE</span>}
            <span><ListFilter className="mr-1 inline h-3 w-3" />{exam.totalPoint || exam.questionCount} points</span>
            <span><Clock3 className="mr-1 inline h-3 w-3" />{exam.timeLimit || 60} phút</span>
            {exam.averagePoint != null && <span>Điểm TB: {Number(exam.averagePoint).toFixed(2)}</span>}
            {exam.attemptCount != null && <span><Users className="mr-1 inline h-3 w-3" />{formatCount(exam.attemptCount)} lượt làm</span>}
            {result ? <span className="font-bold text-emerald-700 dark:text-emerald-300">Điểm cao nhất: {result.score.toFixed(1)}/10</span> : <span>Điểm cao nhất: Chưa làm</span>}
          </div>
        </div>
        <Link href={`/exam/${exam.id}`} className="inline-flex shrink-0 items-center justify-center gap-1 rounded-[4px] bg-[#5fbd18] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#4ea713] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5fbd18] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1a1d1a]">Làm bài <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  );
}

export default function LuyenDeView() {
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [examResults, setExamResults] = useState<Record<string, ExamResult>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_exam_results');
      if (saved) setExamResults(JSON.parse(saved));
    } catch {
      // Local progress is optional; the public catalogue remains usable.
    }
  }, []);

  const visibleCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return CATEGORIES.filter((category) => selectedCatId === 'all' || category.id === selectedCatId)
      .map((category) => ({ ...category, data: category.data.filter((exam) => !term || `${exam.title || ''} ${exam.quizName || ''} ${exam.year || ''}`.toLowerCase().includes(term)) }))
      .filter((category) => category.data.length > 0);
  }, [searchTerm, selectedCatId]);
  const totalVisible = visibleCategories.reduce((sum, category) => sum + category.data.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-[#383c38] dark:bg-[#242824] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5">
          <span className="shrink-0 text-xs font-extrabold uppercase tracking-wide text-[#1c581f] dark:text-emerald-300">Luyện đề thi</span>
          <button type="button" onClick={() => setSelectedCatId('all')} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${selectedCatId === 'all' ? 'bg-[#5fbd18] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1a1d1a] dark:text-slate-300'}`}>Tất cả 138</button>
          {CATEGORIES.map((category) => <button key={category.id} type="button" data-category-id={category.id} aria-label={`Danh mục ${category.id}`} onClick={() => setSelectedCatId(category.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${selectedCatId === category.id ? 'bg-[#5fbd18] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1a1d1a] dark:text-slate-300'}`}>{category.data.length} bài{category.id === 1097 && <span className="sr-only"> Đề chính thức &amp; mẫu</span>}</button>)}
        </div>
        <label className="relative block w-full shrink-0 sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Nhập tên quiz, năm..." className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-[#83c224] focus:ring-1 focus:ring-[#83c224] dark:border-[#383c38] dark:bg-[#1a1d1a] dark:text-slate-200" /></label>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="space-y-7 lg:col-span-9">
          {visibleCategories.map((category) => { const expanded = expandedCategories[String(category.id)] || selectedCatId === category.id || Boolean(searchTerm.trim()); const displayed = expanded ? category.data : category.data.slice(0, 5); return <section key={category.id}><div className="mb-2 flex items-center gap-2"><span className="rounded-full bg-[#f0f9e8] px-2 py-1 text-[10px] font-bold text-[#5fbd18] dark:bg-[#24351f]">{category.data.length} bài</span><h2 className="text-sm font-extrabold text-[#1c581f] dark:text-emerald-300">{category.name}</h2></div><div className="space-y-1.5">{displayed.map((exam) => <ExamRow key={exam.id} exam={exam} result={examResults[String(exam.id)]} />)}</div>{!expanded && category.data.length > displayed.length && <button type="button" onClick={() => setExpandedCategories((current) => ({ ...current, [String(category.id)]: true }))} className="mt-2 float-right rounded bg-[#a9dc36] px-4 py-1 text-[11px] font-extrabold text-[#315400] hover:bg-[#96cd1f]">Xem thêm &gt;&gt;</button>}<div className="clear-both" /></section>; })}
          {totalVisible === 0 && <div className="rounded-md border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-[#383c38] dark:bg-[#242824] dark:text-slate-300">Không tìm thấy đề thi phù hợp với “{searchTerm}”.</div>}
        </div>
        <aside className="space-y-4 lg:col-span-3">
          <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-[#383c38] dark:bg-[#242824]"><div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-[#383c38]"><h3 className="font-bold text-slate-700 dark:text-slate-200">📗 Bảng xếp hạng</h3><span className="rounded-full bg-[#f0f9e8] px-2 py-1 text-[10px] font-bold text-[#5fbd18]">Tuần này</span></div><ol className="space-y-2 text-xs">{RANKING.map(([name, score], index) => <li key={`${name}-${index}`} className="flex items-center gap-2"><span className="w-4 text-center font-bold text-[#a9c83c]">{index + 1}</span><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-[#1a1d1a] dark:text-slate-300">{name.charAt(0)}</span><span className="min-w-0 flex-1 truncate text-slate-600 dark:text-slate-300">{name}</span><strong className="text-[#5fbd18]">{score}</strong></li>)}</ol></div>
          <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-[#383c38] dark:bg-[#242824]"><h3 className="mb-3 font-bold text-slate-700 dark:text-slate-200">Hướng dẫn ôn luyện</h3><ul className="space-y-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{GUIDE_LINKS.map((guide) => <li key={guide} className="border-b border-slate-100 pb-2 pl-3 before:mr-1 before:content-['•'] dark:border-[#383c38]">{guide}</li>)}</ul><button type="button" className="mt-3 text-xs font-bold text-[#5fbd18] hover:underline">Xem thêm &gt;&gt;</button></div>
        </aside>
      </div>
    </div>
  );
}
