import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cổng Quản Trị Hệ Thống - TA12',
  description: 'Trang quản trị phê duyệt tài khoản học sinh và kiểm soát chất lượng TA12.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
