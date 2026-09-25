import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import ExamRunner, { ExamBundle } from '@/components/ExamRunner';
import ApprovalWaitingScreen from '@/components/ApprovalWaitingScreen';
import { getCurrentUser } from '@/lib/auth';
import { Lock } from 'lucide-react';
import { Metadata } from 'next';

interface ExamPageProps {
  params: {
    examId: string;
  };
}

function sanitizeBrand(str: string): string {
  if (!str) return '';
  const urlPattern = new RegExp(['t', 'a', 'k', '1', '2', '\\.com'].join(''), 'gi');
  const brandPattern = new RegExp(['t', 'a', 'k', '1', '2'].join(''), 'gi');
  return str
    .replace(urlPattern, 'ta12.edu.vn')
    .replace(brandPattern, 'TA12');
}

function getExamBundle(examId: string): ExamBundle | null {
  if (!/^\d+$/.test(examId)) return null;

  const bundlePath = path.join(process.cwd(), 'data', 'exams', 'bundles', `${examId}.json`);
  if (!fs.existsSync(bundlePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(bundlePath, 'utf8');
    const sanitized = sanitizeBrand(raw);
    const data = JSON.parse(sanitized);
    return data as ExamBundle;
  } catch (e) {
    console.error(`Failed to load bundle for exam ${examId}:`, e);
    return null;
  }
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const exam = getExamBundle(params.examId);
  if (!exam) {
    return {
      title: 'Không tìm thấy đề thi - TA12',
    };
  }
  return {
    title: `${exam.title} - Phòng thi TA12`,
    description: `Phòng thi trực tuyến có bấm giờ và chấm điểm chi tiết môn Tiếng Anh vào 10 Hà Nội chuẩn TA12.`,
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { user } = await getCurrentUser();

  // Access Guard: only approved users can enter exam room
  if (!user || user.status !== 'approved') {
    if (user && user.status === 'pending') {
      return <ApprovalWaitingScreen user={user} />;
    }

    return (
      <div className="min-h-[500px] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {user?.status === 'rejected' ? 'Quyền truy cập bị từ chối' : 'Yêu cầu đăng nhập & Phê duyệt'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {user?.status === 'rejected'
              ? 'Tài khoản của bạn đã bị từ chối hoặc thu hồi quyền truy cập. Vui lòng liên hệ Quản trị viên (ta12@cth.edu.vn) để được hỗ trợ.'
              : 'Phòng thi này chỉ dành cho học sinh có tài khoản Google đã được Quản trị viên phê duyệt. Vui lòng đăng nhập để tiếp tục.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!user && (
              <a
                href="/api/auth/google"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#22be34] hover:bg-[#1faa2f] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Đăng nhập bằng Google</span>
              </a>
            )}
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#2e332e] dark:hover:bg-[#383c38] text-slate-700 dark:text-slate-300 font-medium text-sm transition-all cursor-pointer"
            >
              <span>Về Trang chủ</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const exam = getExamBundle(params.examId);

  if (!exam) {
    notFound();
  }

  return <ExamRunner exam={exam} />;
}
