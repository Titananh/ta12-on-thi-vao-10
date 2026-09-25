'use client';

import React, { useState } from 'react';
import { X, LogIn, Mail, User, Lock, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { useAuthProgress } from './ProgressSyncProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { refreshSession } = useAuthProgress();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSuperadminEmail = email.trim().toLowerCase() === 'dot71714@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload: any = {
        persona: isSuperadminEmail ? 'admin' : 'custom',
        email: email.trim().toLowerCase(),
        name: name.trim() || (isSuperadminEmail ? 'Admin Tuấn Anh' : email.split('@')[0]),
      };

      if (isSuperadminEmail) {
        if (!adminPassword.trim()) {
          setError('Vui lòng nhập mật khẩu xác thực của Quản trị viên!');
          setIsLoading(false);
          return;
        }
        payload.password = adminPassword.trim();
      }

      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng nhập không thành công, vui lòng thử lại');
      }

      await refreshSession();
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Nút Đăng nhập Google Chuẩn */}
          <div>
            <a
              href="/api/auth/google"
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-[#383c38] bg-white dark:bg-[#1a1d1a] hover:bg-slate-50 dark:hover:bg-[#252b25] text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Đăng nhập bằng tài khoản Google</span>
            </a>
          </div>

          {/* Separator */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-[#383c38]"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hoặc đăng nhập bằng Email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-[#383c38]"></div>
          </div>

          {/* Form đăng nhập Email */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email tài khoản:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: hocsinh@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22be34]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên học sinh (tùy chọn):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ và tên của bạn..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22be34]"
                />
              </div>
            </div>

            {/* Bảo mật Admin: Nếu nhập dot71714@gmail.com, bắt buộc phải nhập Mật khẩu Quản trị viên */}
            {isSuperadminEmail && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>Xác thực Quản trị viên tối cao (dot71714@gmail.com)</span>
                </div>
                <p className="text-[11px] text-red-600 dark:text-red-400">
                  Tài khoản này có toàn quyền duyệt học sinh và quản lý hệ thống. Vui lòng nhập mật khẩu bảo mật:
                </p>
                <div className="relative">
                  <Lock className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Nhập mật khẩu Admin..."
                    className="w-full pl-10 pr-3.5 py-2 bg-white dark:bg-[#181a18] border border-red-300 dark:border-red-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer ${
                isSuperadminEmail
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#22be34] hover:bg-[#1faa2f] active:bg-[#1c581f]'
              }`}
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : isSuperadminEmail ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác thực & Đăng nhập Admin</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập / Đăng ký Học viên</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Ghi chú về quy trình duyệt tài khoản */}
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-1.5 leading-relaxed border-t border-slate-100 dark:border-[#383c38]">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>
              Học sinh mới đăng ký sẽ ở trạng thái chờ duyệt. Quản trị viên (<code>dot71714@gmail.com</code>) sẽ phê duyệt trên Cổng Quản Trị trước khi mở khóa nội dung.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
