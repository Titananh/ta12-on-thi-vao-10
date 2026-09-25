'use client';

import React, { useState } from 'react';
import { X, Search, Volume2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export interface VocabItem {
  word: string;
  pos: string;
  ipa: string;
  meaning: string;
  example: string;
}

interface VocabLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleId?: string | number;
  type?: 'vocabulary' | 'grammar';
  vocabItems?: VocabItem[];
  lessons?: Array<{ order?: number; title?: string; contentHtml?: string; embedUrl?: string | null }>;
  onStartPractice?: () => void;
}

export default function VocabLookupModal({
  isOpen,
  onClose,
  title,
  type = 'vocabulary',
  vocabItems = [],
  lessons = [],
  onStartPractice,
}: VocabLookupModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = vocabItems.filter(
    (item) =>
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setPlayingWord(text);
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setPlayingWord(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#f7faf8]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              {type === 'vocabulary' ? <BookOpen className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {type === 'vocabulary' ? 'Tra cứu từ vựng cốt lõi' : 'Lý thuyết ngữ pháp trọng tâm'}
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-0.5 line-clamp-1">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {type === 'vocabulary' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Search Bar & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm từ vựng hoặc nghĩa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
                Hiển thị <span className="font-bold text-[#1c581f]">{filteredItems.length}</span> / {vocabItems.length} từ
              </div>
            </div>

            {/* Vocabulary Table */}
            {filteredItems.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f2f8f4] text-[#1c581f] border-b border-emerald-200 font-bold">
                      <th className="py-3 px-4 w-[38%]">Từ vựng & Phiên âm</th>
                      <th className="py-3 px-4 w-[32%]">Nghĩa tiếng Việt</th>
                      <th className="py-3 px-4 w-[30%]">Ví dụ ngữ cảnh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#1c581f] text-base">{item.word}</span>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {item.pos}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-slate-500 block mt-0.5">{item.ipa}</span>
                            </div>
                            <button
                              onClick={() => handleSpeak(item.word)}
                              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                                playingWord === item.word
                                  ? 'bg-emerald-600 text-white animate-pulse'
                                  : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top text-slate-700 font-medium leading-relaxed">
                          {item.meaning}
                        </td>
                        <td className="py-3 px-4 align-top text-xs text-slate-500 italic leading-relaxed">
                          {item.example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Không tìm thấy từ vựng phù hợp với từ khóa.</p>
              </div>
            )}
          </div>
        ) : (
          /* Grammar Lessons Body */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {lessons && lessons.length > 0 ? (
              lessons.map((lesson, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1c581f] text-white text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    Bài học lý thuyết #{idx + 1}
                  </h3>
                  {lesson.contentHtml && (
                    <div
                      className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Nội dung lý thuyết đang được tải.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-white transition-colors"
          >
            Đóng
          </button>
          {onStartPractice && (
            <button
              onClick={onStartPractice}
              className="px-5 py-2 bg-[#1c581f] hover:bg-[#164718] text-white font-bold rounded-xl text-sm shadow-sm flex items-center gap-2 transition-all hover:gap-3"
            >
              <span>Luyện bài tập cho chuyên đề này</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
