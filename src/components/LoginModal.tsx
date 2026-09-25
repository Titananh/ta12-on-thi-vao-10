'use client';

import React from 'react';
import { X, LogIn, Info, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-[#242824] rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-[#383c38] overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#22be34] to-[#1c581f] p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Đăng nhập TA12</h3>
              <p className="text-xs text-white/80">Luyện thi vào lớp 10 môn Tiếng Anh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center space-y-1.5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Đăng nhập bằng tài khoản Google để đồng bộ tiến trình học tập, lưu kết quả làm bài và duy trì chuỗi học tập.
            </p>
          </div>

          {/* Nút Đăng nhập Google Chuẩn - Duy nhất */}
          <div>
            <a
              href="/api/auth/google"
              className="w-full py-3.5 px-4 rounded-xl border border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#1a1d1a] hover:bg-slate-50 dark:hover:bg-[#252b25] text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group hover:border-[#22be34] hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Đăng nhập bằng Google</span>
            </a>
          </div>

          {/* Thông báo chính sách phê duyệt học sinh mới */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center space-x-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Chính sách kiểm soát chất lượng & Sĩ số</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
              Học sinh mới đăng ký sẽ ở trạng thái chờ duyệt (Pending). Quản trị viên (<code>dot71714@gmail.com</code>) sẽ phê duyệt trên Cổng Quản Trị trước khi kích hoạt quyền truy cập khoá học.
            </p>
          </div>

          {/* Ghi chú chân modal */}
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-1.5 leading-relaxed border-t border-slate-100 dark:border-[#383c38]">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>
              Mọi tài khoản được cấp quyền truy cập công bằng và minh bạch. Nếu cần hỗ trợ khẩn cấp, vui lòng liên hệ admin qua email <code>ta12@cth.edu.vn</code>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
