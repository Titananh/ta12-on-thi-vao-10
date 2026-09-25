import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TA12 Admin Portal | Quản trị Học viên & Duyệt tài khoản',
  description: 'Hệ thống quản trị và phê duyệt tài khoản học viên nền tảng TA12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#121412] text-[#f0f3f0] antialiased">
        {children}
      </body>
    </html>
  );
}
