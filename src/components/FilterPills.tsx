'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface FilterPillsProps {
  activeSkill: string;
  onSkillSelect: (skillSeo: string) => void;
  onCreateSession: () => void;
}

export default function FilterPills({
  activeSkill,
  onSkillSelect,
  onCreateSession,
}: FilterPillsProps) {
  const skills = [
    { name: 'Ngữ âm', en: 'Phonetics', label: 'Ngữ âm (Phonetics)', seo: 'phonetics' },
    { name: 'Từ vựng', en: 'Vocabulary', label: 'Từ vựng (Vocabulary)', seo: 'vocabulary' },
    { name: 'Ngữ pháp', en: 'Grammar', label: 'Ngữ pháp (Grammar)', seo: 'grammar' },
    { name: 'Kỹ năng đọc', en: 'Reading', label: 'Kỹ năng đọc (Reading)', seo: 'reading' },
    { name: 'Kỹ năng nói', en: 'Speaking', label: 'Kỹ năng nói (Speaking)', seo: 'speaking' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
      {/* 5 Tag Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {skills.map((s) => {
          const isActive = activeSkill === s.seo;
          return (
            <button
              key={s.seo}
              onClick={() => onSkillSelect(s.seo)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-[#1c581f] text-white border-[#1c581f] shadow-sm'
                  : 'bg-[#add93f] dark:bg-[#2e3b2e] text-[#1c581f] dark:text-emerald-300 hover:bg-[#9ecc30] dark:hover:bg-[#384838] border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-[#1c581f] dark:bg-emerald-400'}`}></span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Button: + Tạo phiên ôn luyện */}
      <button
        onClick={onCreateSession}
        className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#1c581f] hover:bg-[#164718] text-white text-sm font-semibold shadow-sm transition-all flex-shrink-0"
        title="+ Tạo phiên ôn luyện"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>+ Tạo phiên ôn luyện</span>
      </button>
    </div>
  );
}
