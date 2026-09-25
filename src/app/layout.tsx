import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ProgressSyncProvider from '@/components/ProgressSyncProvider';

export const metadata: Metadata = {
  title: 'TA12 - Ôn thi vào 10 môn Tiếng Anh Hà Nội',
  description: 'Nền tảng học thêm & Ôn thi vào lớp 10 môn Tiếng Anh theo chuyên đề và luyện đề chuẩn TA12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="dark" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-[#e6e6e6] transition-colors">
        <ProgressSyncProvider>
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4">
            {children}
          </main>
          <footer className="bg-white dark:bg-[#242824] border-t border-slate-200 dark:border-[#383c38] py-6 mt-12 text-center text-sm text-slate-600 dark:text-slate-400">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 TA12 - Học tập & Ôn thi theo cách tối ưu</p>
              <div className="flex items-center space-x-6 text-xs text-slate-400">
                <span>Chính sách</span>
                <span>Điều khoản sử dụng</span>
                <span>Hỗ trợ: ta12@cth.edu.vn</span>
              </div>
            </div>
          </footer>
        </ProgressSyncProvider>
      </body>
    </html>
  );
}
