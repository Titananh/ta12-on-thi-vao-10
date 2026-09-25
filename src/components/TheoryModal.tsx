'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export interface RelatedTopicItem {
  name: string;
  detail: string | null;
}

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: string | number | null;
  topicId?: string | null;
  sectionId?: string | null;
  theoryFallback?: {
    topicName?: string;
    englishName?: string;
    detail?: string;
    infographicImage?: string;
    rules?: Array<{
      sound?: string;
      rule: string;
      formula?: string;
      examples?: string;
    }>;
  } | null;
}

export default function TheoryModal({
  isOpen,
  onClose,
  questionId,
  topicId,
  sectionId,
  theoryFallback,
}: TheoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<RelatedTopicItem[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadRelatedTopics() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (questionId) queryParams.set('questionId', String(questionId));
        if (topicId) queryParams.set('topicId', String(topicId));
        if (sectionId) queryParams.set('sectionId', String(sectionId));

        const res = await fetch(`/api/related-topic?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.listQuestionTopicDetail) && data.listQuestionTopicDetail.length > 0) {
            setTopics(data.listQuestionTopicDetail);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load related topics:', err);
      }

      // Fallback if network or no topics found
      if (isMounted) {
        if (theoryFallback) {
          let fallbackDetail = theoryFallback.detail || '';
          if (!fallbackDetail && theoryFallback.rules && theoryFallback.rules.length > 0) {
            fallbackDetail = `
              <div class="space-y-4">
                ${theoryFallback.infographicImage ? `<div class="text-center my-3"><img src="${theoryFallback.infographicImage}" alt="${theoryFallback.topicName || ''}" class="max-w-full h-auto rounded-lg mx-auto" /></div>` : ''}
                <div class="space-y-3">
                  ${theoryFallback.rules.map(r => `
                    <div class="p-3 bg-[#1e221e] border border-[#383c38] rounded-lg">
                      ${r.sound ? `<span class="inline-block px-2 py-0.5 bg-emerald-900/60 text-emerald-300 font-mono font-bold text-xs rounded mr-2 border border-emerald-700/50">${r.sound}</span>` : ''}
                      <span class="font-semibold text-white">${r.rule || ''}</span>
                      ${r.formula ? `<div class="mt-1 font-mono text-xs text-emerald-400 bg-[#161916] p-2 rounded border border-[#383c38]">${r.formula}</div>` : ''}
                      ${r.examples ? `<div class="mt-1 text-xs text-slate-300 italic"><strong class="not-italic font-semibold text-white">Ví dụ:</strong> ${r.examples}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }

          setTopics([
            {
              name: theoryFallback.topicName || 'Kiến thức liên quan',
              detail: fallbackDetail || '<p>Chỉ xem được kiến thức liên quan khi đang ôn luyện.</p>',
            },
          ]);
        } else {
          setTopics([
            {
              name: 'Kiến thức liên quan',
              detail: '<p>Chỉ xem được kiến thức liên quan khi đang ôn luyện.</p>',
            },
          ]);
        }
        setLoading(false);
      }
    }

    loadRelatedTopics();

    return () => {
      isMounted = false;
    };
  }, [isOpen, questionId, topicId, sectionId, theoryFallback]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[720px] rounded-[16px] shadow-2xl overflow-hidden border border-[#383c38] animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        style={{
          backgroundColor: 'rgb(36, 40, 36)',
          color: 'rgb(230, 230, 230)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="related-topic-title"
      >
        {/* Header - 100% Authentic Tak12 Lime Green Bar */}
        <div
          className="header relative shrink-0"
          style={{
            backgroundColor: 'rgb(102, 204, 0)',
            textAlign: 'center',
            color: 'rgb(255, 255, 255)',
            fontWeight: 'bold',
            fontSize: '1.5em',
            padding: '15px',
          }}
          id="related-topic-title"
        >
          Kiến thức liên quan
          <button
            type="button"
            onClick={onClose}
            className="absolute cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              top: '10px',
              right: '10px',
              color: 'rgb(255, 255, 255)',
              background: 'transparent',
              border: 'none',
              padding: '6px',
            }}
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Body - 100% Authentic Dark Theme Content */}
        <div
          className="content p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#e6e6e6] scrollbar-thin"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target && target.tagName === 'IMG') {
              const src = (target as HTMLImageElement).src;
              if (src) setZoomedImage(src);
            }
          }}
        >
          {loading ? (
            <div className="min-h-[220px] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#66cc00] animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Đang tải kiến thức liên quan...</span>
            </div>
          ) : topics && topics.length > 0 ? (
            topics.map((item, idx) => (
              <div key={idx} data-testid={`related-topic-item-${idx}`} className="space-y-4">
                <h3
                  data-testid={`related-topic-title-${idx}`}
                  style={{
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  {item.name}
                </h3>

                <div
                  data-testid={`related-topic-detail-${idx}`}
                  className="related-topic-content prose prose-invert max-w-none text-[#e6e6e6]"
                  dangerouslySetInnerHTML={{
                    __html: item.detail || '<p class="text-slate-400 italic">Nội dung kiến thức đang được cập nhật.</p>',
                  }}
                />

                {idx < topics.length - 1 && (
                  <div className="w-full my-6 border-b border-[#383c38]/80" style={{ height: '30px' }} />
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-slate-400 text-sm">
              Chỉ xem được kiến thức liên quan khi đang ôn luyện.
            </p>
          )}
        </div>

        {/* Footer with Authentic Button */}
        <div className="px-6 py-3.5 border-t border-[#383c38] bg-[#1c201c] flex items-center justify-end">
          <button
            onClick={onClose}
            data-testid="close-related-topic-btn"
            style={{
              backgroundColor: 'rgb(102, 204, 0)',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            className="px-6 py-2 rounded-lg text-sm shadow-xs transition-colors hover:brightness-105 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Zoomed Infographic Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Phóng to ảnh kiến thức"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Đóng phóng to"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
