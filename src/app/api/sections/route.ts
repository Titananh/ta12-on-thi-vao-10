import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  const sectionId = searchParams.get('sectionId');
  const countParam = searchParams.get('count');
  const count = countParam ? Math.min(Math.max(parseInt(countParam, 10) || 10, 1), 50) : null;

  const dataDir = path.join(process.cwd(), 'data');
  const sectionsDir = path.join(dataDir, 'sections');
  const indexPath = path.join(sectionsDir, 'index.json');

  if (!sectionId) {
    // Return all sections catalog
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ error: 'Sections index not found' }, { status: 404 });
    }
    try {
      const raw = fs.readFileSync(indexPath, 'utf8');
      const sections = JSON.parse(sanitizeBrand(raw));
      return NextResponse.json({
        totalSections: sections.length,
        sections
      });
    } catch (e: any) {
      return NextResponse.json({ error: 'Failed to read sections index', details: e.message }, { status: 500 });
    }
  }

  // Specific section request
  const safeSectionId = sectionId.replace(/[^a-zA-Z0-9_]/g, '');
  const sectionFilePath = path.join(sectionsDir, `${safeSectionId}.json`);

  if (!fs.existsSync(sectionFilePath)) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  try {
    const raw = fs.readFileSync(sectionFilePath, 'utf8');
    const sectionData = JSON.parse(sanitizeBrand(raw));

    let questions = sectionData.questions || [];
    if (count && count < questions.length) {
      let pinnedId: string | null = null;
      if (safeSectionId === 'grammar_vocab_cloze') pinnedId = '41501';
      else if (safeSectionId === 'sign_notices') pinnedId = '929728';

      const targetQ = pinnedId ? questions.find((q: any) => String(q.id) === pinnedId) : null;
      const rest = targetQ ? questions.filter((q: any) => String(q.id) !== pinnedId) : questions;
      const shuffled = [...rest];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      questions = targetQ ? [targetQ, ...shuffled.slice(0, count - 1)] : shuffled.slice(0, count);
    }

    return NextResponse.json({
      sectionId: sectionData.sectionId,
      sectionName: sectionData.sectionName,
      description: sectionData.description,
      icon: sectionData.icon,
      totalAvailable: (sectionData.questions || []).length,
      count: questions.length,
      questions
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to read section questions', details: e.message }, { status: 500 });
  }
}
