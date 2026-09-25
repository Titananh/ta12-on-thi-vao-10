'use client';

import React from 'react';
import { LogIn, BookOpen, Trophy, Brain, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginRequiredScreen() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#22be34] via-[#27ae60] to-[#1c581f]" />

          {/* Hero Section */}
          <div className="px-8 pt-8 pb-6 text-center">
            {/* Logo */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#22be34] to-[#1c581f] flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-white tracking-tight">TA12</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
              Ôn thi vào 10 môn Tiếng Anh
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Hà Nội • Hệ thống luyện thi thông minh
            </p>
          </div>

          {/* Features */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Học ôn lý thuyết</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Luyện đề thi thật</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Luyện chủ điểm</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Giải thích chi tiết</span>
              </div>
            </div>

            {/* Login CTA */}
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
              <span>Đăng nhập bằng Google để bắt đầu học</span>
            </a>

            {/* Policy note */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-100 dark:border-[#383c38] rounded-xl">
              <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Đăng nhập bằng tài khoản Google để truy cập nội dung ôn thi. 
                  Tài khoản mới sẽ cần được Quản trị viên phê duyệt trước khi mở khóa toàn bộ khoá học.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4">
          © 2026 TA12 — Hệ thống ôn thi vào lớp 10 môn Tiếng Anh Hà Nội
        </p>
      </div>
    </div>
  );
}
