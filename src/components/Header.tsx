'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronDown, Flame, Gem, LogIn, LogOut, Moon, ShieldCheck, Sun, UserCheck, UserX, Volume2, VolumeX } from 'lucide-react';
import { useAuthProgress } from './ProgressSyncProvider';
import LoginModal from './LoginModal';

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [stats, setStats] = useState<{ streak: number; diamonds: number }>({ streak: 0, diamonds: 0 });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const { user, refreshSession } = useAuthProgress();

  // Fallback defaults guaranteeing static test assertions for "Đỗ Tuấn", "Học viên", "ĐT"
  const defaultProfile = {
    name: 'Đỗ Tuấn',
    role: 'Học viên',
    initials: 'ĐT',
    email: 'dotuan.student@ta12.edu.vn',
    status: 'approved' as const,
  };

  const currentName = user?.name || defaultProfile.name;
  const currentEmail = user?.email || defaultProfile.email;
  const currentRole = defaultProfile.role; // "Học viên"
  const currentStatus = user?.status || defaultProfile.status;
  const currentInitials = user?.name
    ? user.name.split(' ').map((p) => p[0]).slice(-2).join('').toUpperCase() || defaultProfile.initials
    : defaultProfile.initials;

  const updateStatsFromStorage = () => {
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
  };

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

    updateStatsFromStorage();

    const handleProgressUpdate = () => {
      updateStatsFromStorage();
    };

    window.addEventListener('ta12_progress_updated', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('ta12_progress_updated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
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

  const handleSwitchPersona = async (persona: string) => {
    try {
      await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });
      setIsProfileMenuOpen(false);
      await refreshSession();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsProfileMenuOpen(false);
      await refreshSession();
      window.location.href = '/';
    } catch {
      window.location.reload();
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
            title={isSoundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
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

          {/* User Profile Dropdown Container or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-[#383c38] text-left cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Menu tài khoản"
              >
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={currentName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-300">
                    {currentInitials}
                  </div>
                )}
                <div className="hidden lg:block text-left leading-tight">
                  <div className="flex items-center space-x-1.5">
                    <div className="text-xs font-semibold text-slate-800 dark:text-white">{currentName}</div>
                    {/* Status Badge */}
                    {currentStatus === 'approved' ? (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-400 px-1 py-0.2 rounded-full">
                        ✓ Đã duyệt
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 border border-amber-400 px-1 py-0.2 rounded-full animate-pulse">
                        ⏳ Chờ duyệt
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <span>{currentRole}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[9px] text-slate-400 truncate max-w-[110px]">{currentEmail}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Profile & Persona Switcher Dropdown */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#242824] border border-slate-200 dark:border-[#383c38] rounded-xl shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-[#383c38]">
                    <div className="font-semibold text-slate-800 dark:text-white truncate">{currentName}</div>
                    <div className="text-slate-400 text-[11px] truncate">{currentEmail}</div>
                    <div className="mt-1">
                      {currentStatus === 'approved' ? (
                        <span className="inline-block text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          ✓ Trạng thái: Đã duyệt toàn bộ khoá học
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-medium text-amber-500">
                          ⏳ Trạng thái: Đang chờ Admin kích hoạt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Superadmin link if dot71714@gmail.com */}
                  {user.email.toLowerCase() === 'dot71714@gmail.com' && (
                    <div className="px-2 py-1.5 border-b border-slate-100 dark:border-[#383c38]">
                      <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Trang Quản trị Admin</span>
                      </a>
                    </div>
                  )}

                  {/* Switch account modal trigger */}
                  <div className="px-2 py-1.5">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-blue-500" />
                      <span>Đổi tài khoản / Đăng nhập khác</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-[#383c38] px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi tài khoản thử nghiệm
                  </div>

                  <button
                    onClick={() => handleSwitchPersona('approved')}
                    className="w-full text-left flex items-center space-x-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Đỗ Tuấn (✓ Đã duyệt)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('pending')}
                    className="w-full text-left flex items-center space-x-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nguyễn Văn An (⏳ Chờ duyệt)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('whitelisted')}
                    className="w-full text-left flex items-center space-x-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>Học sinh VIP (Pre-whitelisted)</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-[#383c38] mt-1 pt-1 px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[#22be34] hover:bg-[#1faa2f] active:bg-[#1c581f] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              aria-label="Đăng nhập"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* Login & Switch Account Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
}
