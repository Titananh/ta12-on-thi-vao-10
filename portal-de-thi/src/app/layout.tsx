import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3 Đề Kiểm Tra Tiếng Anh 9 - Ôn Thi Vào 10 (Global Success - 6 Unit Đầu)',
  description: 'Bộ 3 đề thi thử trực tuyến bao quát 6 Unit đầu Tiếng Anh 9 Global Success ôn thi vào lớp 10. Chấm điểm tức thì, đồng hồ bấm giờ, lời giải chi tiết và dịch nghĩa 100%.',
  keywords: [
    'Đề thi Tiếng Anh vào 10',
    'Kiểm tra Tiếng Anh 9',
    'Global Success 9',
    'Ôn thi vào 10 Hà Nội',
    'Luyện đề thi vào 10',
    'Tiếng Anh lớp 9 học kỳ 1'
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20">
                A10
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Phòng Thi Trực Tuyến Vào 10
                </h1>
                <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Tiếng Anh 9 Global Success · Học Kỳ 1 (6 Unit đầu)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ⚡ Chấm điểm & Giải thích tự động
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Hệ Thống Luyện Thi Tiếng Anh Vào 10 · Giáo trình Global Success 9</p>
            <p className="text-slate-400">Thiết kế chuẩn cấu trúc Đề thi Tuyển sinh Sở GD&ĐT</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
