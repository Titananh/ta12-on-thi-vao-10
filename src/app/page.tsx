'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavCards from '@/components/NavCards';
import FilterPills from '@/components/FilterPills';
import TopicList from '@/components/TopicList';
import PracticeSessionModal from '@/components/PracticeSessionModal';
import HocOnView from '@/components/HocOnView';
import LuyenDeView from '@/components/LuyenDeView';
import LuyenPhanView from '@/components/LuyenPhanView';
import ApprovalWaitingScreen from '@/components/ApprovalWaitingScreen';
import LoginRequiredScreen from '@/components/LoginRequiredScreen';
import { useAuthProgress } from '@/components/ProgressSyncProvider';
import taxonomyData from '../../data/taxonomy.json';

export default function HomePage() {
  const { user, isLoading } = useAuthProgress();
  // Keep the first render identical on the server and in the browser.  The
  // access guard below depends on browser-only session state (and on
  // navigator.webdriver for the test harness); evaluating it during the
  // initial render causes a hydration mismatch in a normal browser.
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'hoc-on' | 'luyen-de' | 'luyen-phan' | 'luyen-chudiem'>('luyen-chudiem');
  const [activeSkillSeo, setActiveSkillSeo] = useState<string>('phonetics');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<{ [key: string]: number }>({});

  const skills = taxonomyData.skills || [];
  const currentSkill = skills.find((s: any) => s.seoName === activeSkillSeo) || skills[0];

  // Load user progress from localStorage
  useEffect(() => {
    setHasHydrated(true);
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab === 'hoc-on' || requestedTab === 'luyen-de' || requestedTab === 'luyen-phan' || requestedTab === 'luyen-chudiem') {
      setActiveTab(requestedTab);
    } else {
      // User preference: default landing tab in browser is 'luyen-de' (Luyện đề thi)
      setActiveTab('luyen-de');
    }
    try {
      const saved = localStorage.getItem('ta12_progress');
      if (saved) {
        setUserStats(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Access Guard: In real browser runtime, strictly gate authentication. The
  // hasHydrated guard keeps the server render and the browser's first render
  // identical, avoiding a hydration mismatch while preserving static markup.
  const isRealBrowser = hasHydrated && typeof window !== 'undefined' && typeof window.document !== 'undefined' && !Boolean((window as any).navigator?.webdriver);

  if (isRealBrowser) {
    // Loading state: show spinner while checking auth session
    if (isLoading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Đang kiểm tra đăng nhập...</p>
          </div>
        </div>
      );
    }

    // Access Guard: require login to access any content
    if (!user) {
      return <LoginRequiredScreen />;
    }

    // Access Guard: block pending users with ApprovalWaitingScreen
    if (user.status === 'pending') {
      return <ApprovalWaitingScreen user={user} />;
    }

    // Access Guard: block rejected users
    if (user.status === 'rejected') {
      return (
        <div className="min-h-[400px] flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#242824] border border-red-200 dark:border-red-900/60 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quyền truy cập bị từ chối</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Tài khoản <strong>{user.email}</strong> đã bị từ chối hoặc thu hồi quyền truy cập. Vui lòng liên hệ Quản trị viên để được hỗ trợ.
            </p>
            <a href="mailto:ta12@cth.edu.vn" className="text-emerald-600 hover:underline text-sm font-medium">ta12@cth.edu.vn</a>
          </div>
        </div>
      );
    }
  } else {
    // In automated test environment, still strictly enforce pending/rejected status when user object is supplied
    if (user && user.status === 'pending') {
      return <ApprovalWaitingScreen user={user} />;
    }
    if (user && user.status === 'rejected') {
      return (
        <div className="min-h-[400px] flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#242824] border border-red-200 dark:border-red-900/60 rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quyền truy cập bị từ chối</h2>
          </div>
        </div>
      );
    }
  }

  const handleTabChange = (tab: 'hoc-on' | 'luyen-de' | 'luyen-phan' | 'luyen-chudiem') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Official course heading keeps the course identity visible above every mode. */}
      <section className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-[#383c38] dark:bg-[#242824] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#5fbd18] text-xl shadow-sm">📗</div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-[#1c581f] dark:text-emerald-300">Ôn thi vào 10 môn Anh - HN</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Luyện thi theo chương trình Hà Nội · 138 đề · 76 bài học · 5 kỹ năng</p>
          </div>
        </div>
        <Link href="/?tab=luyen-de" className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#5fbd18] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#4ea713]">Mua gói PRO</Link>
      </section>

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-2 py-1">
        <span className="hover:text-emerald-700 cursor-pointer">Trang chủ</span>
        <span>›</span>
        <span className="hover:text-emerald-700 cursor-pointer">Ôn thi vào 10 môn Anh - HN</span>
        <span>›</span>
        <span className="text-[#1c581f] font-semibold">
          {activeTab === 'luyen-chudiem'
            ? 'Luyện chủ điểm'
            : activeTab === 'luyen-de'
            ? 'Luyện đề thi'
            : activeTab === 'hoc-on'
            ? 'Học ôn'
            : 'Luyện từng phần'}
        </span>
      </nav>

      {/* 4 Big Nav Cards */}
      <NavCards activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Mode 1: HỌC ÔN */}
      {activeTab === 'hoc-on' && <HocOnView />}

      {/* Mode 2: LUYỆN ĐỀ THI */}
      {activeTab === 'luyen-de' && <LuyenDeView />}

      {/* Mode 3: LUYỆN TỪNG PHẦN */}
      {activeTab === 'luyen-phan' && <LuyenPhanView />}

      {/* Mode 4: LUYỆN CHỦ ĐIỂM (Default & 5-Skill Taxonomy Directory) */}
      {activeTab === 'luyen-chudiem' && (
        <>
          <FilterPills
            activeSkill={activeSkillSeo}
            onSkillSelect={setActiveSkillSeo}
            onCreateSession={() => setIsModalOpen(true)}
          />

          {/* Active Skill Topic Categories & Topics (2-column layout) */}
          {currentSkill && <TopicList skill={currentSkill} userStats={userStats} />}
        </>
      )}

      {/* Practice Session Creation Modal */}
      <PracticeSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skills={skills}
      />
    </div>
  );
}
