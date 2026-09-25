'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Flame, Gem, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [stats, setStats] = useState<{ streak: number; diamonds: number }>({ streak: 0, diamonds: 0 });

  useEffect(() => {
    // Check localStorage or default to dark
    const stored = localStorage.getItem('ta12_theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }

    const soundStored = localStorage.getItem('ta12_sound');
    if (soundStored === 'false') {
      setIsSoundOn(false);
    }

    try {
      const statsStr = localStorage.getItem('ta12_user_stats');
      if (statsStr) {
        const parsed = JSON.parse(statsStr);
        setStats({
          streak: parsed.streak || 0,
          diamonds: parsed.diamonds || 0,
        });
      } else {
        const progStr = localStorage.getItem('ta12_progress');
        if (progStr) {
          const prog = JSON.parse(progStr);
          const keys = Object.keys(prog);
          if (keys.length > 0) {
            setStats({
              streak: Math.min(keys.length, 5),
              diamonds: keys.length * 10,
            });
          }
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem('ta12_sound', String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem('ta12_theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      localStorage.setItem('ta12_theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <header className="bg-white dark:bg-[#242824] border-b border-slate-200 dark:border-[#383c38] sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt="TA12"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link
              href="/"
              className="hover:text-emerald-500 flex items-center space-x-1 text-slate-600 dark:text-slate-300"
            >
              <span>📊 Tổng quan</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <Link
              href="/"
              className="text-[#66cc00] font-semibold border-b-2 border-[#66cc00] pb-0.5"
            >
              TA vào 10 HN
            </Link>
            <Link
              href="/"
              className="hover:text-emerald-500 text-slate-600 dark:text-slate-300"
            >
              Chương trình ôn luyện
            </Link>
            <Link
              href="/"
              className="hover:text-emerald-500 text-slate-600 dark:text-slate-300"
            >
              Tiếng Anh THPT
            </Link>
          </nav>
        </div>

        {/* Right: Gamification Badges, Theme Toggle & User Profile */}
        <div className="flex items-center space-x-4">
          {/* Gems & Streak */}
          <div className="hidden sm:flex items-center space-x-3 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-full px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <div className="flex items-center space-x-1 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{stats.streak}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
              <Gem className="w-4 h-4" />
              <span>{stats.diamonds}</span>
            </div>
            {/* Zero fallback state: <span>0</span> */}
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e221e] transition-colors cursor-pointer"
            title={isSoundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            aria-label="Bật/Tắt âm thanh"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e221e] transition-colors cursor-pointer"
            title="Đổi giao diện sáng/tối"
            aria-label="Đổi giao diện sáng/tối"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#1e221e]">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-[#383c38]">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-300">
              ĐT
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-semibold text-slate-800 dark:text-white">Đỗ Tuấn</div>
              <div className="text-[10px] text-slate-400">Học viên</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
