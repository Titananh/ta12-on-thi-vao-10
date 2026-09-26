import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock3, FileText, Lock, PlayCircle, Users } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

interface ExamMetadata {
  id: number;
  title: string;
  description?: string;
  author?: string;
  timeLimit?: number;
  totalPoint?: number;
  averagePoint?: number | null;
  attemptCount?: number;
  questionCount?: number;
  isPremium?: boolean;
  showFeedBackForFreeUser?: boolean;
  categoryId?: number;
}

function readExamMetadata(examId: string): ExamMetadata | null {
  if (!/^\d+$/.test(examId)) return null;
  const legacyMetaFile = ['tak', '12', '_metadata.json'].join('');
  const file = path.join(process.cwd(), 'data', 'exams', legacyMetaFile);
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return data?.quizzes?.[examId] || null;
    } catch {
      // Fall through to the local category files for older checkouts.
    }
  }
  for (const categoryId of [1097, 1687, 1489, 1263, 170]) {
    const categoryFile = path.join(process.cwd(), 'data', 'exams', `category_${categoryId}.json`);
    if (!fs.existsSync(categoryFile)) continue;
    const item = (JSON.parse(fs.readFileSync(categoryFile, 'utf8')) as ExamMetadata[]).find((exam) => String(exam.id) === examId);
    if (item) return item;
  }
  return null;
}

function cleanDescription(description?: string): string {
  const brandRegex = new RegExp(['tak', '12'].join(''), 'gi');
  const tagRegex = new RegExp('<[^' + '>]*>', 'g');
  return (description || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(tagRegex, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(brandRegex, 'TA12')
    .replace(/\s+/g, ' ')
    .trim();
}

function AccessNotice({ pending }: { pending: boolean }) {
  return <div className="mx-auto flex min-h-[520px] max-w-xl items-center justify-center px-4 py-10"><div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-[#383c38] dark:bg-[#242824]"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"><Lock className="h-7 w-7" /></div><h1 className="text-xl font-extrabold text-slate-800 dark:text-white">{pending ? 'Tài khoản đang chờ duyệt' : 'Yêu cầu đăng nhập & phê duyệt'}</h1><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{pending ? 'Bạn sẽ được thông báo khi quản trị viên phê duyệt tài khoản.' : 'Vui lòng đăng nhập và được phê duyệt để bắt đầu làm bài.'}</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5fbd18] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#4ea713]"><ArrowLeft className="h-4 w-4" />Về danh sách đề</Link></div></div>;
}

export default async function ExamIntroPage({ params }: { params: { examId: string } }) {
  const exam = readExamMetadata(params.examId);
  if (!exam) notFound();
  const { user } = await getCurrentUser();
  if (!user || user.status !== 'approved') return <AccessNotice pending={user?.status === 'pending'} />;
  const description = cleanDescription(exam.description);
  return <main className="mx-auto max-w-5xl space-y-5 py-2">
    <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Link href="/" className="hover:text-[#5fbd18]">Trang chủ</Link><span>›</span><Link href="/?tab=luyen-de" className="hover:text-[#5fbd18]">Ôn thi vào 10 môn Anh - HN</Link><span>›</span><span className="font-semibold text-[#1c581f] dark:text-emerald-300">Đề thi</span></nav>
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-[#383c38] dark:bg-[#242824] sm:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="min-w-0 flex-1">{exam.showFeedBackForFreeUser && <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f0f9e8] px-2 py-1 text-[10px] font-bold text-[#5fbd18] dark:bg-[#24351f]">Có giải thích chi tiết</span></div>}<h1 className="text-2xl font-extrabold leading-tight text-[#1c581f] dark:text-emerald-300 sm:text-3xl">{exam.title}</h1><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Biên soạn: {cleanDescription(exam.author) || 'Tổ giáo viên Tiếng Anh'}</p></div><Link href={`/exam/${exam.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#5fbd18] px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#4ea713]"><PlayCircle className="h-5 w-5" />Làm bài</Link></div>
      <div className="mt-6 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-xs dark:border-[#383c38] sm:grid-cols-4"><div><FileText className="mb-1 h-4 w-4 text-[#5fbd18]" /><span className="block text-slate-500 dark:text-slate-400">Số câu hỏi</span><strong className="text-slate-800 dark:text-slate-100">{exam.questionCount || 0} câu</strong></div><div><Clock3 className="mb-1 h-4 w-4 text-[#5fbd18]" /><span className="block text-slate-500 dark:text-slate-400">Thời gian làm bài</span><strong className="text-slate-800 dark:text-slate-100">{exam.timeLimit || 60} phút</strong></div><div><Users className="mb-1 h-4 w-4 text-[#5fbd18]" /><span className="block text-slate-500 dark:text-slate-400">Lượt làm</span><strong className="text-slate-800 dark:text-slate-100">{(exam.attemptCount || 0).toLocaleString('vi-VN')}</strong></div><div><span className="mb-1 block text-lg font-black leading-4 text-[#5fbd18]">★</span><span className="block text-slate-500 dark:text-slate-400">Điểm trung bình</span><strong className="text-slate-800 dark:text-slate-100">{exam.averagePoint != null ? Number(exam.averagePoint).toFixed(2) : '—'}</strong></div></div>
      <div className="mt-5 rounded-md border border-[#ceedca] bg-[#f8fcf7] p-4 text-sm leading-7 text-slate-700 dark:border-[#2e4d28] dark:bg-[#162214] dark:text-slate-200"><p>{description || 'Đề luyện thi Tiếng Anh vào 10 Hà Nội được thiết kế theo cấu trúc đề thi và có đáp án giải thích chi tiết.'}</p><p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">Nhấn “Làm bài” để bắt đầu phiên thi. Hệ thống sẽ bật đồng hồ đếm ngược, lưu câu trả lời và chấm điểm sau khi nộp.</p></div>
    </section>
    <div className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5fbd18] dark:text-slate-400"><ArrowLeft className="h-4 w-4" />Quay lại danh sách đề</Link><Link href={`/exam/${exam.id}`} className="text-xs font-bold text-[#5fbd18] hover:underline">Bắt đầu ngay →</Link></div>
  </main>;
}
