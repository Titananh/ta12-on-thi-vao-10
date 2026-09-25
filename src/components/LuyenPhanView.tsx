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
  PlayCircle,
  CheckCircle2,
  BarChart2,
  X,
  ArrowRight
} from 'lucide-react';
import sectionsData from '../../data/sections/index.json';

interface SectionItem {
  sectionId: string;
  sectionName: string;
  description: string;
  icon: string;
  totalQuestions: number;
  examCount: number;
}

interface SectionProgress {
  sectionId: string;
  sectionName: string;
  totalAnswered: number;
  correctCount: number;
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
  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [drillCount, setDrillCount] = useState<number>(10);

  // Load section progress from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta12_section_progress');
      if (saved) {
        setProgressMap(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleOpenDrill = (section: SectionItem) => {
    setSelectedSection(section);
    setDrillCount(10);
    setIsDrillModalOpen(true);
  };

  const handleStartDrill = () => {
    if (!selectedSection) return;
    setIsDrillModalOpen(false);
    // Navigate to practice session configured for this section
    window.location.href = `/practice/${selectedSection.sectionId}?sectionId=${selectedSection.sectionId}&count=${drillCount}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1c581f] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            Ma trận đề thi vào 10 Hà Nội
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-2">
            10 Dạng Bài Chuẩn Hóa Vào Lớp 10 Môn Tiếng Anh
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Luyện tập tập trung theo từng cấu phần của đề thi chính thức Sở GD&ĐT Hà Nội để tối ưu hóa điểm số từng phần.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#f7faf8] p-3 rounded-xl border border-emerald-100 flex-shrink-0">
          <BarChart2 className="w-5 h-5 text-emerald-700" />
          <div className="text-xs">
            <span className="text-slate-500 block">Tổng ngân hàng</span>
            <span className="font-bold text-[#1c581f] text-sm">4,500+ câu hỏi</span>
          </div>
        </div>
      </div>

      {/* 10 Section Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(sectionsData as SectionItem[]).map((sec, idx) => {
          const progress = progressMap[sec.sectionId] || {
            totalAnswered: 0,
            correctCount: 0,
            accuracyPercent: 0,
          };
          const weight = SECTION_WEIGHTS[sec.sectionId] || '1.0 điểm';
          const icon = ICON_MAP[sec.icon] || <Sparkles className="w-5 h-5 text-emerald-600" />;

          return (
            <div
              key={sec.sectionId}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Dạng #{idx + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {weight}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-[#1c581f] transition-colors mt-2">
                  {sec.sectionName}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                  {sec.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Đã làm: <span className="font-bold text-slate-700">{progress.totalAnswered}</span> / {sec.totalQuestions} câu
                    </span>
                    {progress.totalAnswered > 0 && (
                      <span className="font-bold text-emerald-700">{progress.accuracyPercent}% đúng</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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

              {/* Action Button */}
              <div className="mt-5">
                <button
                  onClick={() => handleOpenDrill(sec)}
                  className="w-full py-2.5 px-4 bg-[#1c581f] hover:bg-[#164718] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Luyện tập dạng bài</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Drill Launch Modal */}
      {isDrillModalOpen && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  {ICON_MAP[selectedSection.icon]}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Thiết lập phiên luyện tập
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedSection.sectionName}</h3>
                </div>
              </div>
              <button
                onClick={() => setIsDrillModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Chọn số lượng câu hỏi luyện tập:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[10, 20, 30].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDrillCount(num)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                      drillCount === num
                        ? 'border-emerald-600 bg-emerald-50 text-[#1c581f] ring-2 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
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
                Ngân hàng có sẵn <strong>{selectedSection.totalQuestions} câu hỏi</strong> được trích xuất từ các đề thi vào 10 Hà Nội qua các năm.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDrillModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleStartDrill}
                className="px-5 py-2 bg-[#1c581f] hover:bg-[#164718] text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Bắt đầu luyện tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
