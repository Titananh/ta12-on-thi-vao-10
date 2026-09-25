'use client';

import React from 'react';
import Image from 'next/image';

interface NavCardsProps {
  activeTab: 'hoc-on' | 'luyen-de' | 'luyen-phan' | 'luyen-chudiem';
  onTabChange: (tab: 'hoc-on' | 'luyen-de' | 'luyen-phan' | 'luyen-chudiem') => void;
}

export default function NavCards({ activeTab, onTabChange }: NavCardsProps) {
  const cards = [
    {
      id: 'hoc-on' as const,
      title: 'HỌC ÔN',
      bgColor: 'bg-[#ebf7ee] dark:bg-[#242824]',
      activeColor: 'bg-[#d2f0d8] dark:bg-[#2e3b2e]',
      textColor: 'text-[#1c581f] dark:text-emerald-300',
      activeTextColor: 'text-[#1c581f] dark:text-emerald-200',
      icon: '/images/hoc_on.png',
    },
    {
      id: 'luyen-de' as const,
      title: 'LUYỆN ĐỀ THI',
      bgColor: 'bg-[#dcf1f6] dark:bg-[#242824]',
      activeColor: 'bg-[#bee7f1] dark:bg-[#22383e]',
      textColor: 'text-[#0e5868] dark:text-cyan-300',
      activeTextColor: 'text-[#0e5868] dark:text-cyan-200',
      icon: '/images/luyen_de.png',
    },
    {
      id: 'luyen-phan' as const,
      title: 'LUYỆN TỪNG PHẦN',
      bgColor: 'bg-[#ebf7ee] dark:bg-[#242824]',
      activeColor: 'bg-[#d2f0d8] dark:bg-[#2e3b2e]',
      textColor: 'text-[#1c581f] dark:text-emerald-300',
      activeTextColor: 'text-[#1c581f] dark:text-emerald-200',
      icon: '/images/luyen_phan.png',
    },
    {
      id: 'luyen-chudiem' as const,
      title: 'LUYỆN CHỦ ĐIỂM',
      bgColor: 'bg-[#f0f9e8] dark:bg-[#242824]',
      activeColor: 'bg-[#83c224] dark:bg-[#83c224]',
      textColor: 'text-[#2d610f] dark:text-emerald-300',
      activeTextColor: 'text-white',
      icon: '/images/luyen_chudiem.png',
      isDefaultActive: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
      {cards.map((c) => {
        const isActive = activeTab === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onTabChange(c.id)}
            className={`flex items-center justify-between px-5 py-4 rounded-xl shadow-sm transition-all duration-200 border text-left ${
              isActive
                ? `${c.activeColor} ${c.activeTextColor || c.textColor} font-bold shadow-md scale-[1.01] border-black/10 dark:border-white/10`
                : `${c.bgColor} ${c.textColor} font-semibold hover:shadow-md border-transparent dark:border-[#383c38]`
            }`}
          >
            <span className="text-sm md:text-base tracking-wide uppercase">{c.title}</span>
            <div className="relative w-11 h-11 flex-shrink-0">
              <Image
                src={c.icon}
                alt={c.title}
                fill
                className="object-contain"
                sizes="44px"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
