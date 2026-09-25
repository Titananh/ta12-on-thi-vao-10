'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Search, CheckCircle2, ArrowRight, Eye, PlayCircle } from 'lucide-react';
import VocabLookupModal, { VocabItem } from './VocabLookupModal';
import vocabIndexData from '../../data/theories/vocabulary/index.json';
import grammarIndexData from '../../data/theories/grammar/index.json';

interface StudyUnit {
  id: number;
  title: string;
  type: string;
  questionCount: number;
}

interface HocOnViewProps {
  onStartQuiz?: (unitId: number, type: 'vocabulary' | 'grammar') => void;
}

export default function HocOnView({ onStartQuiz }: HocOnViewProps) {
  const [subTab, setSubTab] = useState<'vocabulary' | 'grammar'>('vocabulary');
  const [searchQuery, setSearchQuery] = useState('');
  const [studyProgress, setStudyProgress] = useState<Record<string, boolean>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<StudyUnit | null>(null);
  const [modalVocabItems, setModalVocabItems] = useState<VocabItem[]>([]);
  const [modalLessons, setModalLessons] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load study progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_study_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        const map: Record<string, boolean> = {};
        Object.keys(parsed).forEach((k) => {
          map[k] = parsed[k]?.quizCompleted || parsed[k]?.theoryViewed || false;
        });
        setStudyProgress(map);
      }
    } catch (e) {}
  }, []);

  const currentList: StudyUnit[] = subTab === 'vocabulary' ? (vocabIndexData as StudyUnit[]) : (grammarIndexData as StudyUnit[]);

  const filteredUnits = currentList.filter((unit) =>
    unit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetails = async (unit: StudyUnit) => {
    setSelectedUnit(unit);
    setIsLoadingDetails(true);
    setIsModalOpen(true);

    try {
      const res = await fetch(`/api/study?moduleId=${unit.id}&type=${subTab}`);
      if (res.ok) {
        const data = await res.json();
        setModalVocabItems(data.vocabTable || []);
        setModalLessons(data.lessons || []);

        // Record theory viewed in localStorage
        try {
          const key = 'ta12_study_progress';
          const saved = JSON.parse(localStorage.getItem(key) || '{}');
          saved[String(unit.id)] = {
            ...(saved[String(unit.id)] || {}),
            moduleId: String(unit.id),
            moduleType: subTab,
            theoryViewed: true,
            lastStudiedAt: Date.now(),
          };
          localStorage.setItem(key, JSON.stringify(saved));
          setStudyProgress((prev) => ({ ...prev, [String(unit.id)]: true }));
        } catch (e) {}
      }
    } catch (e) {
      console.error('Failed to load study unit details:', e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handlePractice = (unitId: number) => {
    setIsModalOpen(false);
    if (onStartQuiz) {
      onStartQuiz(unitId, subTab);
    } else {
      // Direct navigation to practice runner
      window.location.href = `/practice/68?studyUnit=${unitId}&type=${subTab}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => {
              setSubTab('vocabulary');
              setSearchQuery('');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              subTab === 'vocabulary'
                ? 'bg-white text-[#1c581f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Từ vựng trọng tâm (76 bộ)</span>
          </button>
          <button
            onClick={() => {
              setSubTab('grammar');
              setSearchQuery('');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              subTab === 'grammar'
                ? 'bg-white text-[#1c581f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ngữ pháp trọng điểm (76 bài)</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={subTab === 'vocabulary' ? 'Tìm bài học từ vựng...' : 'Tìm bài ngữ pháp...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid of Study Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit, index) => {
          const isDone = Boolean(studyProgress[String(unit.id)]);

          return (
            <div
              key={unit.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-[#1c581f] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Bài {index + 1}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã học</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Chưa học
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug group-hover:text-[#1c581f] transition-colors line-clamp-2">
                  {unit.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2.5">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">{unit.questionCount}</span> câu bài tập
                  </span>
                  <span>•</span>
                  <span>
                    {subTab === 'vocabulary' ? 'Tra cứu IPA & Audio' : 'Công thức & Ví dụ'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenDetails(unit)}
                  className="py-2 px-3 border border-emerald-200 text-[#1c581f] bg-emerald-50/50 hover:bg-emerald-100/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{subTab === 'vocabulary' ? 'Tra từ vựng' : 'Xem lý thuyết'}</span>
                </button>
                <button
                  onClick={() => handlePractice(unit.id)}
                  className="py-2 px-3 bg-[#1c581f] hover:bg-[#164718] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Luyện tập</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUnits.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center text-slate-500 space-y-2">
          <p className="font-semibold">Không tìm thấy bài học nào phù hợp với từ khóa &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Vocabulary / Grammar Details Modal */}
      {selectedUnit && (
        <VocabLookupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedUnit.title}
          moduleId={selectedUnit.id}
          type={subTab}
          vocabItems={modalVocabItems}
          lessons={modalLessons}
          onStartPractice={() => handlePractice(selectedUnit.id)}
        />
      )}
    </div>
  );
}
