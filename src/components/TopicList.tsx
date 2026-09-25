'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export interface Topic {
  id: number;
  topicName: string;
  englishName: string;
  seoName: string;
  totalQuestions: number;
  completed?: number;
  score?: number;
}

export interface TopicCategory {
  id: number;
  topicCategoryName: string;
  seoName: string;
  topics: Topic[];
}

export interface Skill {
  id: number;
  skillName: string;
  seoName: string;
  topicCategories: TopicCategory[];
}

interface TopicListProps {
  skill: Skill;
  userStats?: { [key: string]: number };
}

export default function TopicList({ skill, userStats }: TopicListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = skill.topicCategories
    .map((category) => {
      if (!searchTerm.trim()) return category;
      const term = searchTerm.toLowerCase();
      const matchingTopics = category.topics.filter(
        (topic) =>
          topic.topicName.toLowerCase().includes(term) ||
          topic.englishName.toLowerCase().includes(term)
      );
      return {
        ...category,
        topics: matchingTopics,
      };
    })
    .filter((category) => category.topics.length > 0);

  return (
    <div className="bg-white dark:bg-[#242824] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#383c38] my-4">
      {/* Skill Main Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-[#1c581f] dark:text-emerald-400 tracking-tight">
          {skill.skillName}
        </h1>

        {/* Topic Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm chủ điểm..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#383c38] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Categories (2 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            {/* Category Header */}
            <h2 className="text-xl font-bold text-[#83c224] pb-2 border-b border-slate-100 dark:border-[#383c38]">
              {category.topicCategoryName}
            </h2>

            {/* Topic List */}
            <div className="divide-y divide-slate-100 dark:divide-[#383c38]">
              {category.topics.map((topic) => {
                const topicScore = (userStats && userStats[String(topic.id)]) ?? topic.score ?? 0;
                return (
                  <div
                    key={topic.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-[#1a1d1a]/50 rounded-lg transition-colors group"
                  >
                    <Link
                      href={`/practice/${topic.id}`}
                      className="flex-1 pr-4"
                    >
                      <div className="text-[16px] font-semibold text-[#1c581f] dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors">
                        {topic.topicName}
                      </div>
                      <div className="text-xs text-slate-400 italic font-normal mt-0.5">
                        {topic.englishName}
                      </div>
                    </Link>

                    {/* Authentic Tak12 Score Progress: vertical pill bar & score label */}
                    <div
                      className="flex flex-col items-center justify-center min-w-[28px] pl-2 flex-shrink-0"
                      title={`Điểm: ${topicScore}/100 • Ngân hàng: ${topic.totalQuestions || 0} câu`}
                    >
                      {/* Vertical pill progress bar */}
                      <div className="w-[7px] h-[20px] bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex flex-col justify-end">
                        <div
                          className={`w-full rounded-full transition-all duration-300 ${
                            topicScore >= 80
                              ? 'bg-[#22be34]'
                              : topicScore > 0
                              ? 'bg-[#83c224]'
                              : 'bg-transparent'
                          }`}
                          style={{ height: `${Math.max(topicScore > 0 ? topicScore : 0, topicScore > 0 ? 15 : 0)}%` }}
                        />
                      </div>
                      {/* Score label below */}
                      <span
                        className={`text-[12px] font-semibold mt-1 leading-none ${
                          topicScore > 0 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {topicScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
