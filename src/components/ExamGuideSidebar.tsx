'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const GUIDES = [
  {
    id: 1523,
    title: 'Tổng hợp đề thi vào 10 môn Toán, Văn, Tiếng Anh trên toàn quốc từ 2020 đến nay (kèm đáp án chi tiết)',
    href: '/exam/14532/intro',
  },
  {
    id: 1844,
    title: 'Hướng dẫn ôn thi vào 10 môn tiếng Anh theo đề thi năm 2026 chi tiết',
    href: '/exam/18177/intro',
  },
  {
    id: 1363,
    title: 'Ma trận đề thi tuyển sinh vào 10 môn Tiếng Anh Sở Giáo dục và Đào tạo Hà Nội',
    href: '/exam/12379/intro',
  },
  {
    id: 1420,
    title: 'Cấu trúc bài thi môn Tiếng Anh vào lớp 10 theo chương trình GDPT 2018',
    href: '/exam/14188/intro',
  },
  {
    id: 1729,
    title: 'Kinh nghiệm ôn thi và chiến thuật làm bài thi vào 10 môn Anh đạt điểm 9+',
    href: '/exam/14192/intro',
  },
];

export default function ExamGuideSidebar() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-[#383c38] dark:bg-[#242824]">
      {/* Header with image/book badge */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-[#383c38]">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-[#5fbd18] mb-2.5 shadow-2xs">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-extrabold text-[#1c581f] dark:text-emerald-300">
          Hướng dẫn ôn luyện
        </h3>
      </div>

      {/* Guide Links List */}
      <div className="divide-y divide-slate-100 dark:divide-[#333733] pt-2">
        {GUIDES.map((guide) => (
          <div key={guide.id} className="py-3 flex items-start gap-2.5 group">
            <span className="text-slate-400 group-hover:text-[#5fbd18] text-lg leading-none select-none transition-colors">
              •
            </span>
            <Link
              href={guide.href}
              data-testid={`related-news-link-${guide.id}`}
              className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#5fbd18] dark:hover:text-emerald-300 leading-snug transition-colors"
            >
              {guide.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
