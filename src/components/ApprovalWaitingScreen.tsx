'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Clock, RefreshCw, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthProgress } from './ProgressSyncProvider';

interface Props {
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string | null;
    created_at?: string;
  };
}

export default function ApprovalWaitingScreen({ user }: Props) {
  const { refreshSession } = useAuthProgress();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);

  // Auto-poll session every 10 seconds to detect Admin approval in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshSession();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshSession]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    await refreshSession();
    setTimeout(() => {
      setIsChecking(false);
      setCountdown(10);
    }, 600);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  // Format creation time
  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Vừa xong';

  const initials = user.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(-2)
        .join('')
        .toUpperCase()
    : 'HV';

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Top accent banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600" />

        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-600/50 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-6">
          <Clock className="w-4 h-4 animate-spin text-amber-500" style={{ animationDuration: '4s' }} />
          <span>⏳ ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN</span>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative mb-3">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={72}
                height={72}
                className="w-18 h-18 rounded-full border-2 border-amber-400 shadow-md object-cover"
              />
            ) : (
              <div className="w-18 h-18 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-2xl border-2 border-amber-400 shadow-md">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow">
              ⏳
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Đăng ký lúc: {formattedDate}</p>
        </div>

        {/* Informative explanation */}
        <div className="bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-xl p-5 mb-6 text-left text-sm text-slate-600 dark:text-slate-300 space-y-2.5">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Tài khoản Google của bạn đã được kết nối thành công với hệ thống TA12.</span>
          </div>
          <div className="flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>
              Để đảm bảo chất lượng và sĩ số ôn luyện môn Tiếng Anh vào 10 Hà Nội, quản trị viên đang xét duyệt tài khoản.
            </span>
          </div>
          <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400 pl-6">
            <span>Hệ thống tự động kiểm tra mỗi 10 giây (còn {countdown}s). Khi được duyệt, trang web sẽ tự động mở khóa ngay lập tức!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-[#1c581f] hover:bg-[#27ae60] text-white font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra lại trạng thái'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#2e332e] dark:hover:bg-[#383c38] text-slate-700 dark:text-slate-300 font-medium text-sm transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất / Đổi tài khoản</span>
          </button>
        </div>

        {/* Support Help */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#383c38] text-xs text-slate-400">
          Cần kích hoạt khẩn cấp? Liên hệ trực tiếp Admin qua email{' '}
          <a href="mailto:ta12@cth.edu.vn" className="text-emerald-500 underline font-medium">
            ta12@cth.edu.vn
          </a>
        </div>
      </div>
    </div>
  );
}
