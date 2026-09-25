'use client';

import React, { useState, useEffect } from 'react';
import NavCards from '@/components/NavCards';
import FilterPills from '@/components/FilterPills';
import TopicList from '@/components/TopicList';
import PracticeSessionModal from '@/components/PracticeSessionModal';
import HocOnView from '@/components/HocOnView';
import LuyenDeView from '@/components/LuyenDeView';
import LuyenPhanView from '@/components/LuyenPhanView';
import taxonomyData from '../../data/taxonomy.json';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'hoc-on' | 'luyen-de' | 'luyen-phan' | 'luyen-chudiem'>('luyen-chudiem');
  const [activeSkillSeo, setActiveSkillSeo] = useState<string>('phonetics');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<{ [key: string]: number }>({});

  const skills = taxonomyData.skills || [];
  const currentSkill = skills.find((s: any) => s.seoName === activeSkillSeo) || skills[0];

  // Load user progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_progress');
      if (saved) {
        setUserStats(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-4">
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
      <NavCards activeTab={activeTab} onTabChange={setActiveTab} />

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
