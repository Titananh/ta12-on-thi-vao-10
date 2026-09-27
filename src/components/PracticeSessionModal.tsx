'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, X, CheckSquare, Square } from 'lucide-react';

interface PracticeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: any[];
}

export default function PracticeSessionModal({
  isOpen,
  onClose,
  skills,
}: PracticeSessionModalProps) {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['phonetics', 'grammar']);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<string>('all');

  if (!isOpen) return null;

  const toggleSkill = (seo: string) => {
    if (selectedSkills.includes(seo)) {
      setSelectedSkills(selectedSkills.filter(s => s !== seo));
    } else {
      setSelectedSkills([...selectedSkills, seo]);
    }
  };

  const handleStart = () => {
    // Collect topic IDs belonging to selected skills
    const selectedTopicIds: number[] = [];
    selectedSkills.forEach((seo) => {
      const skillObj = skills.find((s) => s.seoName === seo);
      if (skillObj && skillObj.topicCategories) {
        skillObj.topicCategories.forEach((cat: any) => {
          if (cat.topics) {
            cat.topics.forEach((t: any) => {
              if (t.id) selectedTopicIds.push(t.id);
            });
          }
        });
      }
    });

    onClose();
    const diffQuery = difficulty && difficulty !== 'all' ? `&difficulty=${difficulty}` : '';
    if (selectedTopicIds.length > 0) {
      router.push(`/practice/custom?topics=${selectedTopicIds.slice(0, 15).join(',')}&count=${questionCount}${diffQuery}`);
    } else {
      router.push(`/practice/68?count=${questionCount}${diffQuery}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#242824] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-[#383c38]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#383c38] flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1d1a]">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-[#7ed957] font-bold text-lg">
            <Rocket className="w-5 h-5 text-emerald-600 dark:text-[#7ed957]" />
            <span>Tạo phiên ôn luyện</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#383c38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Môn học */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Môn học:</span>
            <span className="font-bold text-slate-800 dark:text-[#7ed957] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#7ed957] px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Tiếng Anh vào 10 HN
            </span>
          </div>

          {/* Chọn chủ điểm */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
              Chọn chuyên đề ôn luyện ({selectedSkills.length}/5)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {skills.map((s) => {
                const checked = selectedSkills.includes(s.seoName);
                return (
                  <button
                    key={s.seoName}
                    type="button"
                    onClick={() => toggleSkill(s.seoName)}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                      checked
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-[#7ed957]'
                        : 'border-slate-200 dark:border-[#383c38] hover:bg-slate-50 dark:hover:bg-[#1a1d1a] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-[#7ed957] flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    )}
                    <span className="truncate">{s.skillName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Số lượng câu hỏi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
              Số lượng câu hỏi trong phiên
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 40].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl border text-center text-sm font-bold transition-all ${
                    questionCount === num
                      ? 'border-emerald-600 bg-[#1c581f] text-white shadow-xs'
                      : 'border-slate-200 dark:border-[#383c38] hover:bg-slate-50 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          {/* Mức độ khó */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
              Mức độ khó
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'easy', label: 'Dễ' },
                { id: 'medium', label: 'Trung bình' },
                { id: 'hard', label: 'Khó' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id)}
                  className={`py-2.5 rounded-xl border text-center text-xs sm:text-sm font-bold transition-all ${
                    difficulty === lvl.id
                      ? 'border-emerald-600 bg-[#1c581f] text-white shadow-xs'
                      : 'border-slate-200 dark:border-[#383c38] hover:bg-slate-50 dark:hover:bg-[#1a1d1a] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thời gian gợi ý */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>⏱️ Thời gian làm bài gợi ý:</span>
            <span className="font-bold">{questionCount * 1.5} phút</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#383c38] flex items-center justify-end space-x-3 bg-slate-50/50 dark:bg-[#1a1d1a]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-[#383c38] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#242824] text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={selectedSkills.length === 0}
            className="px-5 py-2 rounded-lg bg-[#1c581f] hover:bg-[#164718] disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all flex items-center space-x-1.5"
          >
            <Rocket className="w-4 h-4" />
            <span>Luyện ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
