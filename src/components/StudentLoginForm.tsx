'use client';

import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuthProgress } from './ProgressSyncProvider';

interface StudentLoginFormProps {
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export default function StudentLoginForm({
  onSuccess,
  defaultMode = 'login',
}: StudentLoginFormProps) {
  const { refreshSession } = useAuthProgress();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email.');
      return false;
    }

    const isGmail = /^[a-zA-Z0-9._%+-]+@gmail(\.com)?$/i.test(trimmedEmail);
    if (!isGmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email có đuôi @gmail.com (Ví dụ: hocsinh@gmail.com).');
      return false;
    }

    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có tối thiểu 6 ký tự.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Đăng nhập không thành công.');
        return;
      }

      setSuccessMessage(
        data.user?.status === 'approved'
          ? 'Đăng nhập thành công! Đang tải dữ liệu...'
          : 'Đăng nhập thành công! Tài khoản đang ở trạng thái chờ duyệt.'
      );

      await refreshSession();

      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 700);
    } catch {
      setErrorMessage('Có lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab switch */}
      <div className="flex border border-slate-200 dark:border-[#383c38] rounded-xl overflow-hidden bg-slate-50 dark:bg-[#1a1d1a]">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-white dark:bg-[#283028] text-[#1c581f] dark:text-[#22be34] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng nhập</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-white dark:bg-[#283028] text-[#1c581f] dark:text-[#22be34] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Đăng ký mới</span>
        </button>
      </div>

      {/* Error & Success Alerts */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span>{errorMessage}</span>
            {errorMessage.includes('chưa tồn tại') && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-bold underline text-rose-800 dark:text-rose-200 hover:text-rose-950"
                >
                  Bấm vào đây để chuyển sang Đăng ký ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Họ và tên học sinh
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#383c38] bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#22be34] focus:ring-1 focus:ring-[#22be34] transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email học sinh <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Đuôi @gmail.com
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailcuaban@gmail.com"
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#383c38] bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#22be34] focus:ring-1 focus:ring-[#22be34] transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Mật khẩu <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu tự chọn (tối thiểu 6 ký tự)"
              className="w-full pl-9 pr-16 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#383c38] bg-slate-50 dark:bg-[#1a1d1a] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#22be34] focus:ring-1 focus:ring-[#22be34] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#22be34] to-[#1c581f] hover:from-[#27ae60] hover:to-[#164819] text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản học sinh'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
