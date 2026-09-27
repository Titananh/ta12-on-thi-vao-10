'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Info,
  BookOpen,
  Edit3,
  FileText,
  Repeat,
  Layers,
  GraduationCap,
  PlayCircle,
  Settings,
  Plus,
  Check,
  ListFilter,
  X,
  Play,
  Rocket,
  ArrowRight
} from 'lucide-react';
// Canonical 14 Authentic Tak12 Dạng Bài Cards
import sectionsData from '../../data/sections/index.json';

interface SectionItem {
  taxonomyId: number;
  sectionId: string;
  skill: string;
  sectionName: string;
  description: string;
  icon: string;
  totalQuestions: number;
  examCount: number;
  isDeHN?: boolean;
}

interface SectionProgress {
  sectionId: string;
  taxonomyId?: number;
  sectionName?: string;
  totalAnswered: number;
  correctCount: number;
  wrongCount?: number;
  accuracyPercent: number;
  lastTrainedAt?: string;
}

const SECTION_WEIGHTS: Record<string, string> = {
  pronunciation: '0.5 điểm (2 câu/đề)',
  stress: '0.5 điểm (2 câu/đề)',
  error_identification: '0.75 điểm (3 câu/đề)',
  communicative_functions: '0.5 điểm (2 câu/đề)',
  sign_notices: '0.5 điểm (2 câu/đề)',
  grammar_vocab_cloze: '2.5 - 3.0 điểm (12 câu/đề)',
  guided_cloze: '1.25 điểm (5 câu/đề)',
  reading_comprehension: '1.25 điểm (5 câu/đề)',
  sentence_transformation: '1.0 điểm (4 câu/đề)',
  sentence_combination: '0.75 điểm (3 câu/đề)',
};

const ICON_MAP: Record<string, React.ReactNode> = {
  'volume-2': <Volume2 className="w-5 h-5 text-emerald-700" />,
  'sparkles': <Sparkles className="w-5 h-5 text-amber-600" />,
  'alert-circle': <AlertCircle className="w-5 h-5 text-red-600" />,
  'message-circle': <MessageCircle className="w-5 h-5 text-blue-600" />,
  'info': <Info className="w-5 h-5 text-cyan-600" />,
  'book-open': <BookOpen className="w-5 h-5 text-indigo-600" />,
  'edit-3': <Edit3 className="w-5 h-5 text-violet-600" />,
  'file-text': <FileText className="w-5 h-5 text-emerald-700" />,
  'repeat': <Repeat className="w-5 h-5 text-teal-600" />,
  'layers': <Layers className="w-5 h-5 text-orange-600" />,
};

export default function LuyenPhanView() {
  const [progressMap, setProgressMap] = useState<Record<string, SectionProgress>>({});
  
  // Drill Modal State
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [drillCount, setDrillCount] = useState<number>(20);
  const [drillDifficulty, setDrillDifficulty] = useState<string>('all');

  // Detailed CEFR modal
  const [detailSection, setDetailSection] = useState<SectionItem | null>(null);

  // Top "+ Tạo phiên ôn luyện" modal
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [sessionQuestionTypes, setSessionQuestionTypes] = useState<string[]>(['Chưa làm']);
  const [sessionDifficulties, setSessionDifficulties] = useState<string[]>([]);
  const [selectedTaxonomyIds, setSelectedTaxonomyIds] = useState<number[]>([]);
  const [sessionCount, setSessionCount] = useState<number>(10);
  const [sessionTimeMinutes, setSessionTimeMinutes] = useState<string>('');

  // Load progress from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_section_progress');
      if (saved) {
        setProgressMap(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const items = sectionsData as SectionItem[];

  // Start default 20-question practice directly
  const handleStartDefaultPractice = (item: SectionItem) => {
    window.location.href = `/practice/${item.sectionId}?taxonomyId=${item.taxonomyId}&count=20`;
  };

  // Open Quick Drill Modal
  const handleOpenDrill = (item: SectionItem) => {
    setSelectedSection(item);
    setDrillCount(20);
    setDrillDifficulty('all');
    setIsDrillModalOpen(true);
  };

  // Confirm Quick Drill
  const handleStartDrill = () => {
    if (!selectedSection) return;
    setIsDrillModalOpen(false);
    const diffQuery = drillDifficulty !== 'all' ? `&difficulty=${drillDifficulty}` : '';
    window.location.href = `/practice/${selectedSection.sectionId}?taxonomyId=${selectedSection.taxonomyId}&count=${drillCount}${diffQuery}`;
  };

  // Redo wrong questions
  const handleRedoWrong = (item: SectionItem) => {
    window.location.href = `/practice/${item.sectionId}?taxonomyId=${item.taxonomyId}&count=10&mode=wrong_only`;
  };

  // Toggle taxonomy in create session modal
  const toggleTaxonomySelection = (taxId: number) => {
    if (selectedTaxonomyIds.includes(taxId)) {
      setSelectedTaxonomyIds(selectedTaxonomyIds.filter(id => id !== taxId));
    } else {
      if (selectedTaxonomyIds.length < 5) {
        setSelectedTaxonomyIds([...selectedTaxonomyIds, taxId]);
      }
    }
  };

  // Launch custom practice session
  const handleStartCustomSession = () => {
    setIsCreateSessionOpen(false);
    const targetTaxId = selectedTaxonomyIds.length > 0 ? selectedTaxonomyIds[0] : 6;
    const targetItem = items.find(i => i.taxonomyId === targetTaxId) || items[0];
    const diffQuery = sessionDifficulties.length > 0 ? `&difficulty=${sessionDifficulties.join(',')}` : '';
    const timeQuery = sessionTimeMinutes ? `&time=${sessionTimeMinutes}` : '';
    window.location.href = `/practice/${targetItem.sectionId}?taxonomyId=${targetTaxId}&count=${sessionCount}${diffQuery}${timeQuery}`;
  };

  const totalAllQuestions = items.reduce((sum, item) => sum + (item.totalQuestions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar with '+ Tạo phiên ôn luyện' button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1c581f] dark:text-[#7ed957] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            Luyện theo dạng bài
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mt-2">
            14 Dạng Bài Chuẩn Hóa Vào Lớp 10 Môn Tiếng Anh (14 Dạng Bài Chi Tiết)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ngân hàng {totalAllQuestions.toLocaleString('vi-VN')} câu hỏi phân loại chi tiết theo ma trận đề thi chính thức
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateSessionOpen(true)}
          data-testid="create-practice-session-button"
          className="app-btn-base inline-flex items-center gap-2 bg-[#1c581f] hover:bg-[#164718] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer"
          style={{ backgroundColor: '#1c581f' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tạo phiên ôn luyện</span>
        </button>
      </div>

      {/* 14 Authentic Tak12 Dạng Bài Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {items.map((sec) => {
          // Binds progressMap to section cards
          const progress = progressMap[sec.sectionId] || progressMap[String(sec.taxonomyId)] || {
            sectionId: sec.sectionId,
            totalAnswered: 0,
            correctCount: 0,
            wrongCount: 0,
            accuracyPercent: 0,
          };
          const wrongCount = progress.wrongCount ?? Math.max(0, progress.totalAnswered - progress.correctCount);
          const weight = SECTION_WEIGHTS[sec.sectionId] || '1.0 điểm';

          return (
            <div
              key={sec.taxonomyId}
              data-taxonomy-id={sec.taxonomyId}
              className="column bg-white dark:bg-[#1a1d1a] rounded-xl border border-slate-200 dark:border-[#2a302a] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
            >
              {/* Card Header: Diagonal striped cyan banner */}
              <div className="relative w-full h-[46px] overflow-hidden rounded-t-xl bg-[#2fbfa8]">
                {/* Authentic diagonal striped banner overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-right bg-no-repeat pointer-events-none"
                  style={{ backgroundImage: `url('/images/cyan_banner.png')` }}
                />

                {/* Skill Name (White bold uppercase text on left) */}
                <div className="absolute left-4 top-0 bottom-0 flex items-center z-10">
                  <span className="absolute-title font-bold text-[14px] md:text-[15px] uppercase tracking-wide text-white drop-shadow-xs">
                    {sec.skill}
                  </span>
                </div>

                {/* Gear Icon (White on top-right) */}
                <button
                  type="button"
                  title="Chọn độ khó"
                  data-testid={`taxonomy-setting-icon-${sec.taxonomyId}`}
                  onClick={() => setDetailSection(sec)}
                  className="absolute right-3.5 top-0 bottom-0 flex items-center justify-center text-white/90 hover:text-white hover:scale-110 transition-transform z-10 p-1 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {weight}
                    </span>
                    {sec.isDeHN && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Đề HN
                      </span>
                    )}
                  </div>

                  {/* Title Link */}
                  <h3 className="font-bold text-slate-800 dark:text-[#7ed957] text-[16px] md:text-[17px] leading-snug hover:text-[#1c581f] dark:hover:text-[#a3f07a] transition-colors cursor-pointer">
                    <a
                      data-testid={`taxonomy-link-${sec.taxonomyId}`}
                      href={`/practice/${sec.sectionId}?taxonomyId=${sec.taxonomyId}&count=20`}
                      className="hover:underline"
                    >
                      {sec.sectionName}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>

                  {/* Difficulty Level Badges */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                      Dễ
                    </span>
                    <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">
                      Trung bình
                    </span>
                    <span className="text-[10px] font-semibold text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-md">
                      Khó
                    </span>
                  </div>
                </div>

                {/* Stats & Progress Section */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                      <span data-testid={`taxonomy-stat-text-${sec.taxonomyId}`}>
                        Đã làm: {progress.totalAnswered}/{sec.totalQuestions.toLocaleString('vi-VN')} câu
                      </span>
                      <div className="group/tooltip relative inline-flex items-center">
                        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer ml-0.5" />
                        <div className="hidden group-hover/tooltip:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 bg-slate-900 text-white text-[11px] rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>{progress.correctCount} đúng</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            <span>{wrongCount} chưa đúng</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Redo Wrong Button */}
                    {wrongCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRedoWrong(sec)}
                        data-testid={`taxonomy-redo-wrong-btn-${sec.taxonomyId}`}
                        className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full px-2.5 py-0.5 transition-colors cursor-pointer"
                      >
                        Làm lại {wrongCount} câu sai
                      </button>
                    )}
                  </div>

                  {/* Accuracy Portion */}
                  {progress.totalAnswered > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <span
                        data-testid={`taxonomy-correct-portion-${sec.taxonomyId}`}
                        className="font-bold flex items-center gap-0.5 text-blue-600 dark:text-blue-400"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{progress.accuracyPercent}%</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        trả lời đúng
                      </span>
                    </div>
                  )}

                  {/* Visual Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-[#83c224] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((progress.totalAnswered / Math.max(sec.totalQuestions, 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Split Button in Tak12 Green (#5fbd18) */}
              <div className="p-4 pt-0">
                <div className="flex items-stretch rounded-lg overflow-hidden bg-[#5fbd18] shadow-xs">
                  <button
                    type="button"
                    title="Luyện tập dạng bài"
                    onClick={() => handleStartDefaultPractice(sec)}
                    data-testid={`taxonomy-start-btn-taxonomy-${sec.taxonomyId}`}
                    className="flex-1 py-2.5 px-3 flex items-center justify-center gap-2 text-white font-semibold text-sm hover:bg-[#54a915] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Luyện ngay - 20 câu</span>
                  </button>

                  <div className="w-[1px] bg-white/20 self-stretch my-1.5" />

                  <button
                    type="button"
                    title="Tuỳ chỉnh số câu"
                    aria-label="Tuỳ chỉnh số câu"
                    data-testid={`taxonomy-settings-btn-taxonomy-${sec.taxonomyId}`}
                    onClick={() => handleOpenDrill(sec)}
                    className="px-3.5 py-2.5 flex items-center justify-center text-white hover:bg-[#54a915] transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Drill Launch Modal [10, 20, 30] */}
      {isDrillModalOpen && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white dark:bg-[#1a1d1a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-6 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  {ICON_MAP[selectedSection.icon] || <Sparkles className="w-5 h-5 text-emerald-600" />}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Thiết lập phiên luyện tập
                  </span>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{selectedSection.sectionName}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrillModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Chọn số lượng câu hỏi luyện tập:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[10, 20, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDrillCount(num)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      drillCount === num
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-[#1c581f] dark:text-[#7ed957] ring-2 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base block">{num}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {num === 10 ? 'Nhanh' : num === 20 ? 'Tiêu chuẩn' : 'Chuyên sâu'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Ngân hàng có sẵn <strong>{selectedSection.totalQuestions.toLocaleString('vi-VN')} câu hỏi</strong> trích xuất theo chuẩn thi vào 10 Hà Nội.
              </p>
            </div>

            {/* Chọn mức độ khó */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Mức độ khó:
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
                    onClick={() => setDrillDifficulty(lvl.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      drillDifficulty === lvl.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-[#1c581f] dark:text-[#7ed957] ring-2 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDrillModalOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleStartDrill}
                className="px-5 py-2 bg-[#1c581f] hover:bg-[#164718] text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Bắt đầu luyện tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Card CEFR & Difficulty Settings (from Header Gear ⚙️) */}
      {detailSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white dark:bg-[#1a1d1a] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a302a] p-6 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  {detailSection.skill}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Dạng bài: {detailSection.sectionName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailSection(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CEFR Level Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                📑 CEFR level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { lvl: 'A1', count: '0 Question' },
                  { lvl: 'A2', count: `${Math.round(detailSection.totalQuestions * 0.5).toLocaleString('vi-VN')} câu` },
                  { lvl: 'B1', count: `${Math.round(detailSection.totalQuestions * 0.4).toLocaleString('vi-VN')} câu` },
                  { lvl: 'B2', count: `${Math.round(detailSection.totalQuestions * 0.1).toLocaleString('vi-VN')} câu` },
                  { lvl: 'C1', count: '0 Question' },
                  { lvl: 'C2', count: '0 Question' },
                ].map((item) => (
                  <div
                    key={item.lvl}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-center"
                  >
                    <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">{item.lvl}</span>
                    <span className="text-[10px] text-slate-500">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ⚡ Mức độ khó:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { lvl: 'Dễ', share: '30%' },
                  { lvl: 'Trung bình', share: '50%' },
                  { lvl: 'Khó', share: '15%' },
                  { lvl: 'Rất khó', share: '5%' },
                ].map((d) => (
                  <div
                    key={d.lvl}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{d.lvl}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{d.share}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1">
              <div className="text-slate-700 dark:text-slate-300">
                ℹ️ Có <strong>{detailSection.totalQuestions.toLocaleString('vi-VN')} câu</strong> đáp ứng điều kiện lọc
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                🎯 Sẵn sàng để luyện tập theo cấu trúc đề thi chính thức
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDetailSection(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg text-xs hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const it = detailSection;
                  setDetailSection(null);
                  handleStartDefaultPractice(it);
                }}
                className="px-5 py-2 bg-[#5fbd18] hover:bg-[#54a915] text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bắt đầu luyện tập</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: '+ Tạo phiên ôn luyện' Modal */}
      {isCreateSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white dark:bg-[#1a1d1a] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a302a] flex flex-col max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#2a302a]">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                <Rocket className="w-5 h-5 text-emerald-600" />
                <span>Tạo phiên ôn luyện</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Môn học: <strong className="text-slate-700 dark:text-slate-200">Tiếng Anh</strong></span>
                <button
                  type="button"
                  onClick={() => setIsCreateSessionOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Option 1: Filters */}
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-200">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <span>Tùy chọn</span>
                  </div>
                  <span className="text-xs text-slate-400">Điều kiện câu hỏi</span>
                </div>

                {/* Question Types */}
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                    Loại câu hỏi:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Chưa làm', 'Đã bỏ qua', 'Làm sai', 'Làm đúng'].map((qtype) => {
                      const isChecked = sessionQuestionTypes.includes(qtype);
                      return (
                        <label
                          key={qtype}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-[#1c581f] dark:text-[#7ed957]'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSessionQuestionTypes(sessionQuestionTypes.filter(t => t !== qtype));
                              } else {
                                setSessionQuestionTypes([...sessionQuestionTypes, qtype]);
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <span>{qtype}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulties */}
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                    Độ khó:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((diff) => {
                      const isChecked = sessionDifficulties.includes(diff);
                      return (
                        <label
                          key={diff}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-[#1c581f] dark:text-[#7ed957]'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSessionDifficulties(sessionDifficulties.filter(d => d !== diff));
                              } else {
                                setSessionDifficulties([...sessionDifficulties, diff]);
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <span>{diff}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Option 2: Chọn dạng bài (0/5) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-200">
                    <ListFilter className="w-4 h-4 text-emerald-600" />
                    <span>Chọn dạng bài ({selectedTaxonomyIds.length}/5)</span>
                  </div>
                  {selectedTaxonomyIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTaxonomyIds([])}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Bỏ chọn tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {items.map((it) => {
                    const isSelected = selectedTaxonomyIds.includes(it.taxonomyId);
                    return (
                      <div
                        key={it.taxonomyId}
                        onClick={() => toggleTaxonomySelection(it.taxonomyId)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <span>
                            <strong className="text-slate-800 dark:text-slate-200">{it.skill}</strong> - {it.sectionName}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                          {it.totalQuestions.toLocaleString('vi-VN')} câu hỏi
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Control Bar */}
            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-[#2a302a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span>Tạo phiên:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSessionCount(Math.max(5, sessionCount - 5))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-slate-800 dark:text-white">
                      {sessionCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSessionCount(Math.min(50, sessionCount + 5))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span>câu trên <strong>{totalAllQuestions.toLocaleString('vi-VN')}</strong> câu</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSessionOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleStartCustomSession}
                  className="px-5 py-2 bg-[#5fbd18] hover:bg-[#54a915] text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Luyện ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
