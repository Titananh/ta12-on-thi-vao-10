import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeTheoryDetail, getCuratedTheoryHtml } from '@/lib/curatedTheories';

function sanitizeBrand(str: string): string {
  if (!str) return '';
  const urlPattern = new RegExp(['t', 'a', 'k', '1', '2', '\\.com'].join(''), 'gi');
  const brandPattern = new RegExp(['t', 'a', 'k', '1', '2'].join(''), 'gi');
  return str
    .replace(urlPattern, 'ta12.edu.vn')
    .replace(brandPattern, 'TA12');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') === 'grammar' ? 'grammar' : 'vocabulary';
  const moduleId = searchParams.get('moduleId');

  const dataDir = path.join(process.cwd(), 'data');
  const theoriesDir = path.join(dataDir, 'theories', type);
  const questionsDir = path.join(dataDir, 'questions', type);
  const indexPath = path.join(theoriesDir, 'index.json');

  // List of all study units for type
  if (!moduleId) {
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ error: `Index for ${type} not found` }, { status: 404 });
    }
    try {
      const raw = fs.readFileSync(indexPath, 'utf8');
      const units = JSON.parse(sanitizeBrand(raw));
      return NextResponse.json({
        type,
        totalUnits: units.length,
        units
      });
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to load ${type} index`, details: e.message }, { status: 500 });
    }
  }

  // Specific unit details
  if (!/^\d+$/.test(moduleId)) {
    return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
  }

  const prefix = type === 'grammar' ? 'grammar' : 'vocab';
  const theoryFile = path.join(theoriesDir, `${prefix}_${moduleId}.json`);
  const questionsFile = path.join(questionsDir, `${prefix}_${moduleId}.json`);

  let theoryData: any = null;
  let questionsData: any = null;

  if (fs.existsSync(theoryFile)) {
    try {
      theoryData = JSON.parse(sanitizeBrand(fs.readFileSync(theoryFile, 'utf8')));
    } catch (e) {}
  }

  if (fs.existsSync(questionsFile)) {
    try {
      questionsData = JSON.parse(sanitizeBrand(fs.readFileSync(questionsFile, 'utf8')));
    } catch (e) {}
  }

  if (!theoryData && !questionsData) {
    return NextResponse.json({ error: 'Study unit not found' }, { status: 404 });
  }

  const isAnswerable = (q: any) => {
    if (q.needsManualReview) return false;
    const hasChoices = Array.isArray(q.choices) && q.choices.length > 0;
    const hasFB = (Array.isArray(q.fillblankAnswers) && q.fillblankAnswers.length > 0) ||
      (typeof q.questionText === 'string' && (q.questionText.includes('fillblank-option') || q.questionText.includes('<input') || q.questionText.includes('<select')));
    const hasShort = Array.isArray(q.shortAnswers) && q.shortAnswers.length > 0;
    if (!hasChoices && !hasFB && !hasShort) return false;
    if (hasChoices && !hasFB && !hasShort) {
      const hasCorrectChoice = q.choices.some((c: any) => c.isCorrect);
      const hasCorrectId = Boolean(q.correctChoiceId && q.choices.some((c: any) => String(c.id) === String(q.correctChoiceId)));
      if (!hasCorrectChoice && !hasCorrectId) return false;
    }
    return true;
  };

  const rawQuestions = questionsData?.questions || [];
  const filteredQuestions = rawQuestions.filter(isAnswerable);
  const finalQuestions = filteredQuestions.length > 0 ? filteredQuestions : rawQuestions;

  const title = theoryData?.title || questionsData?.title || `Chuyên đề #${moduleId}`;
  const rawLessons = theoryData?.lessons || [];
  const curatedHtml = getCuratedTheoryHtml(title);

  let sanitizedLessons = rawLessons.map((l: any) => {
    let contentHtml = sanitizeTheoryDetail(l.contentHtml, title);
    if (contentHtml) {
      contentHtml = contentHtml
        .replace(/<iframe\b[^>]*\bsrc=["'][^"']*(?:canva\.com|cth\.edu\.vn)[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi, '<div class="offline-embed-note p-3 my-3 rounded-lg border border-[#383c38] bg-[#1e221e] text-sm text-slate-300">Nội dung đa phương tiện đã được chuyển sang chế độ offline.</div>')
        .replace(/https?:\/\/(?:www\.)?(?:canva\.com|cth\.edu\.vn)[^\s"'>]*/gi, '#');
    }
    let embedUrl = l.embedUrl;
    if (embedUrl && (embedUrl.includes('canva.com') || embedUrl.includes('cth.edu.vn'))) {
      embedUrl = null;
    }
    return {
      ...l,
      contentHtml,
      embedUrl,
    };
  });

  if (sanitizedLessons.length === 0 && curatedHtml) {
    sanitizedLessons = [
      {
        order: 1,
        title: 'Lý thuyết trọng tâm',
        contentHtml: curatedHtml,
        embedUrl: null,
      },
    ];
  }

  return NextResponse.json({
    moduleId,
    type,
    title,
    lessons: sanitizedLessons,
    vocabTable: theoryData?.vocabTable || [],
    totalQuestions: finalQuestions.length,
    questions: finalQuestions
  });
}

