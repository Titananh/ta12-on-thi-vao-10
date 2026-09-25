'use client';

import React, { useState } from 'react';
import { X, LogIn, Mail, User, ShieldCheck, UserCheck, UserX, Star, ArrowRight } from 'lucide-react';
import { useAuthProgress } from './ProgressSyncProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { refreshSession } = useAuthProgress();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const isSuperadmin = email.trim().toLowerCase() === 'dot71714@gmail.com';
      const persona = isSuperadmin ? 'admin' : 'custom';

      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          email: email.trim().toLowerCase(),
          name: name.trim() || (isSuperadmin ? 'Admin Tuấn Anh' : email.split('@')[0]),
        }),
      });

      if (!res.ok) {
        throw new Error('Đăng nhập không thành công, vui lòng thử lại');
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

  const handleQuickPersona = async (persona: string, personaEmail?: string, personaName?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          email: personaEmail,
          name: personaName,
        }),
      });

      if (!res.ok) {
        throw new Error('Đăng nhập thất bại');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form đăng nhập bằng Email Google */}
          <form onSubmit={handleLoginWithEmail} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email tài khoản Google / Học viên:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: dot71714@gmail.com hoặc email của bạn..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22be34]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên (tùy chọn):
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#22be34] hover:bg-[#1faa2f] active:bg-[#1c581f] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>Đăng nhập ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-[#383c38]"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hoặc trải nghiệm nhanh với
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-[#383c38]"></div>
          </div>

          {/* 1-Click Fast Accounts */}
          <div className="space-y-2">
            {/* Superadmin dot71714 */}
            <button
              type="button"
              onClick={() => handleQuickPersona('admin', 'dot71714@gmail.com', 'Admin Tuấn Anh')}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/40 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-800 dark:text-red-300">dot71714@gmail.com</div>
                  <div className="text-[10px] text-red-600 dark:text-red-400">Quản trị viên Superadmin (Toàn quyền)</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-red-200 dark:bg-red-900/80 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </button>

            {/* Đỗ Tuấn (Học viên mẫu) */}
            <button
              type="button"
              onClick={() => handleQuickPersona('approved')}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Đỗ Tuấn</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">dotuan.student@ta12.edu.vn</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Đã duyệt
              </span>
            </button>

            {/* Nguyễn Văn An (Chờ duyệt) */}
            <button
              type="button"
              onClick={() => handleQuickPersona('pending')}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300">Nguyễn Văn An</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400">pending.student@ta12.edu.vn</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                ⏳ Chờ duyệt
              </span>
            </button>

            {/* VIP Pre-whitelisted */}
            <button
              type="button"
              onClick={() => handleQuickPersona('whitelisted')}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-950/40 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-800 dark:text-purple-300">Học sinh VIP</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400">vip.student@ta12.edu.vn (Pre-whitelisted)</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
                Tự động duyệt
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
