import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load cached related topics into memory once
let cachedTopics: Record<string, any> = {};
const CACHE_PATH = path.join(process.cwd(), 'data', 'related_topics.json');

try {
  if (fs.existsSync(CACHE_PATH)) {
    cachedTopics = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  }
} catch (e) {
  console.error('Failed to load related_topics.json:', e);
}

// Lookup helper for study unit theory
function getStudyUnitTheory(studyUnit?: string | number | null): any {
  if (!studyUnit) return null;
  const theoriesDir = path.join(process.cwd(), 'data', 'theories');
  const cleanId = String(studyUnit).replace(/[^a-zA-Z0-9_-]/g, '').replace(/^(grammar_|vocab_)/, '');

  const grammarPath = path.join(theoriesDir, 'grammar', `grammar_${cleanId}.json`);
  if (fs.existsSync(grammarPath)) {
    try {
      return JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
    } catch (e) {}
  }

  const vocabPath = path.join(theoriesDir, 'vocabulary', `vocab_${cleanId}.json`);
  if (fs.existsSync(vocabPath)) {
    try {
      return JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    } catch (e) {}
  }

  return null;
}

// Lookup helper for section theory
function getSectionTheory(sectionId?: string | null): any {
  if (!sectionId) return null;
  const theoriesDir = path.join(process.cwd(), 'data', 'theories');
  const safeSectionId = sectionId.replace(/[^a-zA-Z0-9_-]/g, '');
  const secPath = path.join(theoriesDir, 'sections', `${safeSectionId}.json`);
  if (fs.existsSync(secPath)) {
    try {
      return JSON.parse(fs.readFileSync(secPath, 'utf8'));
    } catch (e) {}
  }
  return null;
}

// Lookup helper for topic theory
function getTopicTheory(topicId?: string | null): any {
  if (!topicId) return null;
  const theoriesDir = path.join(process.cwd(), 'data', 'theories');
  const safeTopicId = topicId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Check if topicId is a study unit ID first
  const studyUnitTheory = getStudyUnitTheory(safeTopicId);
  if (studyUnitTheory) return studyUnitTheory;

  const directPath = path.join(theoriesDir, `${safeTopicId}.json`);
  if (fs.existsSync(directPath)) {
    try {
      return JSON.parse(fs.readFileSync(directPath, 'utf8'));
    } catch (e) {}
  }

  return null;
}

// Fallback theory lookup helper
function getFallbackTheory(studyUnit?: string | null, sectionId?: string | null, topicId?: string | null): any {
  return getStudyUnitTheory(studyUnit) || getSectionTheory(sectionId) || (topicId && topicId !== '68' ? getTopicTheory(topicId) : null);
}

// Render fallback HTML detail from structured theory rules
function formatTheoryToHtml(theory: any): string {
  if (!theory) return '';
  if (theory.detail) return theory.detail;

  // Support lessons array (Học Ôn, Grammar, Vocabulary) with Canva 16:9 embeds
  if (theory.lessons && Array.isArray(theory.lessons) && theory.lessons.length > 0) {
    const validLessons = theory.lessons
      .filter((l: any) => l.contentHtml || l.embedUrl)
      .map((l: any) => {
        let content = l.contentHtml || '';
        if (l.embedUrl && !content.includes('<iframe')) {
          content += `
            <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
              <iframe style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;" src="${l.embedUrl}" allowfullscreen="allowfullscreen" loading="lazy"></iframe>
            </div>
          `;
        }
        return content;
      });
    if (validLessons.length > 0) {
      return validLessons.join('<hr class="my-6 border-[#383c38]"/>');
    }
  }

  // Direct contentHtml / embedUrl on theory root
  if (theory.contentHtml || theory.embedUrl) {
    let content = theory.contentHtml || '';
    if (theory.embedUrl && !content.includes('<iframe')) {
      content += `
        <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
          <iframe style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;" src="${theory.embedUrl}" allowfullscreen="allowfullscreen" loading="lazy"></iframe>
        </div>
      `;
    }
    return content;
  }

  let html = `<div class="theory-body space-y-3">`;
  if (theory.infographicImage) {
    html += `<div class="text-center my-3"><img src="${theory.infographicImage}" alt="${theory.topicName || ''}" class="max-w-full h-auto rounded-lg mx-auto" /></div>`;
  }

  if (theory.rules && Array.isArray(theory.rules) && theory.rules.length > 0) {
    html += `<div class="space-y-2.5">`;
    for (const r of theory.rules) {
      html += `<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">`;
      if (r.sound) {
        html += `<span class="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded mr-2">${r.sound}</span>`;
      }
      html += `<span class="font-semibold text-slate-800">${r.rule || ''}</span>`;
      if (r.formula) {
        html += `<div class="mt-1 font-mono text-xs text-emerald-700 bg-white p-1.5 rounded border border-slate-200">${r.formula}</div>`;
      }
      if (r.examples) {
        html += `<div class="mt-1 text-xs text-slate-600 italic"><strong class="not-italic font-semibold text-slate-700">Ví dụ:</strong> ${r.examples}</div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('questionId');
  const studyUnit = searchParams.get('studyUnit');
  const sectionId = searchParams.get('sectionId');
  const topicId = searchParams.get('topicId');
  const explanation = searchParams.get('explanation') || searchParams.get('questionDetail');
  const ruleTip = searchParams.get('ruleTip');

  // Level 1: Check local cached topics by questionId (data/related_topics.json)
  if (questionId && cachedTopics[questionId]) {
    const cached = cachedTopics[questionId];
    if (cached.listQuestionTopicDetail && cached.listQuestionTopicDetail.length > 0) {
      // Enrich any null/empty detail if possible
      const enrichedList = cached.listQuestionTopicDetail.map((t: any) => {
        if (!t.detail || t.detail.trim() === '') {
          // Check Level 2 explanation/ruleTip
          if (explanation?.trim() || ruleTip?.trim()) {
            return {
              ...t,
              detail: explanation?.trim() || ruleTip?.trim() || '',
            };
          }
          // Check Level 3 studyUnit or Level 4 sectionId
          const fallback = getFallbackTheory(studyUnit, sectionId, topicId);
          if (fallback) {
            return {
              ...t,
              detail: formatTheoryToHtml(fallback),
            };
          }
        }
        return t;
      });

      return NextResponse.json({
        isDisplay: true,
        source: 'question',
        listQuestionTopicDetail: enrichedList,
      });
    }
  }

  // Level 2: Explanation / ruleTip of the question
  if (explanation?.trim() || ruleTip?.trim()) {
    return NextResponse.json({
      isDisplay: true,
      source: 'explanation',
      listQuestionTopicDetail: [
        {
          name: 'Kiến thức cần vận dụng',
          detail: explanation?.trim() || ruleTip?.trim() || '',
        },
      ],
    });
  }

  // Level 3: Study unit theory (data/theories/grammar/ or data/theories/vocabulary/)
  const studyTheory = getStudyUnitTheory(studyUnit) || (topicId && topicId !== '68' ? getStudyUnitTheory(topicId) : null);
  if (studyTheory) {
    const title = studyTheory.topicName || studyTheory.title || (studyTheory.englishName ? `${studyTheory.topicName || studyTheory.title} (${studyTheory.englishName})` : 'Kiến thức chủ điểm');
    return NextResponse.json({
      isDisplay: true,
      source: 'studyUnit',
      listQuestionTopicDetail: [
        {
          name: title,
          detail: formatTheoryToHtml(studyTheory),
        },
      ],
    });
  }

  // Level 4: Section question type theory (data/theories/sections/${sectionId}.json)
  const sectionTheory = getSectionTheory(sectionId);
  if (sectionTheory) {
    const title = sectionTheory.topicName || sectionTheory.title || (sectionTheory.englishName ? `${sectionTheory.topicName || sectionTheory.title} (${sectionTheory.englishName})` : 'Kiến thức dạng bài');
    return NextResponse.json({
      isDisplay: true,
      source: 'section',
      listQuestionTopicDetail: [
        {
          name: title,
          detail: formatTheoryToHtml(sectionTheory),
        },
      ],
    });
  }

  // Topic theory fallback (only when genuine topicId provided, not dummy '68' when studyUnit or sectionId was provided)
  if (topicId && !studyUnit && !sectionId) {
    const topicTheory = getTopicTheory(topicId);
    if (topicTheory) {
      const title = topicTheory.topicName || topicTheory.title || (topicTheory.englishName ? `${topicTheory.topicName || topicTheory.title} (${topicTheory.englishName})` : 'Kiến thức liên quan');
      return NextResponse.json({
        isDisplay: true,
        source: 'topic',
        listQuestionTopicDetail: [
          {
            name: title,
            detail: formatTheoryToHtml(topicTheory),
          },
        ],
      });
    }
  }

  // Default generic response
  return NextResponse.json({
    isDisplay: true,
    source: 'generic',
    listQuestionTopicDetail: [
      {
        name: 'Kiến thức ôn thi vào 10 môn Tiếng Anh',
        detail: '<p>Nắm chắc cấu trúc ngữ pháp, quy tắc phát âm, từ vựng theo chủ điểm và chiến thuật xử lý từng dạng bài thi vào 10 Hà Nội.</p>',
      },
    ],
  });
}
