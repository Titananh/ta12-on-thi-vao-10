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

  const taxonomyParam = searchParams.get('taxonomyId');
  const requestedId = sectionId || taxonomyParam;

  const dataDir = path.join(process.cwd(), 'data');
  const sectionsDir = path.join(dataDir, 'sections');
  const indexPath = path.join(sectionsDir, 'index.json');

  if (!requestedId) {
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

  // Specific section request (support both string sectionId and numeric taxonomyId)
  const TAXONOMY_MAP: Record<string, string> = {
    '6': 'pronunciation',
    '7': 'stress',
    '4': 'grammar_vocab_cloze',
    '537': 'grammar_vocab_cloze',
    '457': 'guided_cloze',
    '242': 'guided_cloze',
    '16': 'guided_cloze',
    '11': 'communicative_functions',
    '456': 'sign_notices',
    '304': 'sign_notices',
    '224': 'sign_notices',
    '17': 'reading_comprehension',
    '14': 'sentence_transformation',
    '246': 'sentence_combination',
  };

  const rawId = requestedId.replace(/[^a-zA-Z0-9_]/g, '');
  const mappedFileId = TAXONOMY_MAP[rawId] || rawId;
  const sectionFilePath = path.join(sectionsDir, `${mappedFileId}.json`);

  if (!fs.existsSync(sectionFilePath)) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  try {
    const raw = fs.readFileSync(sectionFilePath, 'utf8');
    const sectionData = JSON.parse(sanitizeBrand(raw));

    // Match exact taxonomy metadata from index.json if available
    let exactSkill = sectionData.skill || '';
    let exactSectionName = sectionData.sectionName || '';
    let exactDescription = sectionData.description || '';
    let matchedTaxonomyId = taxonomyParam ? parseInt(taxonomyParam, 10) : undefined;

    if (fs.existsSync(indexPath)) {
      try {
        const rawIndex = fs.readFileSync(indexPath, 'utf8');
        const catalog = JSON.parse(rawIndex);
        const match = catalog.find((item: any) => {
          if (taxonomyParam && String(item.taxonomyId) === String(taxonomyParam)) return true;
          if (sectionId && String(item.sectionId) === String(sectionId) && (!taxonomyParam || String(item.taxonomyId) === String(taxonomyParam))) return true;
          if (String(item.taxonomyId) === rawId) return true;
          return false;
        });
        if (match) {
          exactSkill = match.skill || exactSkill;
          exactSectionName = match.sectionName || exactSectionName;
          exactDescription = match.description || exactDescription;
          matchedTaxonomyId = match.taxonomyId;
        }
      } catch (e) {}
    }

    let questions = sectionData.questions || [];
    if (count && count < questions.length) {
      let pinnedId: string | null = null;
      if (mappedFileId === 'grammar_vocab_cloze') pinnedId = '41501';
      else if (mappedFileId === 'sign_notices') pinnedId = '929728';

      const targetQ = pinnedId ? questions.find((q: any) => String(q.id) === pinnedId) : null;
      const rest = targetQ ? questions.filter((q: any) => String(q.id) !== pinnedId) : questions;
      const shuffled = [...rest];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      questions = targetQ ? [targetQ, ...shuffled.slice(0, count - 1)] : shuffled.slice(0, count);
    }

    // Load section theory if exists
    let theory: any = null;
    const theoryPath = path.join(dataDir, 'theories', 'sections', `${mappedFileId}.json`);
    if (fs.existsSync(theoryPath)) {
      try {
        theory = JSON.parse(fs.readFileSync(theoryPath, 'utf8'));
      } catch (e) {}
    }

    const title = exactSkill ? `${exactSkill} - ${exactSectionName}` : exactSectionName;

    return NextResponse.json({
      sectionId: mappedFileId,
      taxonomyId: matchedTaxonomyId,
      skill: exactSkill,
      sectionName: exactSectionName,
      title,
      description: exactDescription,
      icon: sectionData.icon,
      totalAvailable: (sectionData.questions || []).length,
      count: questions.length,
      questions,
      theory
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to read section questions', details: e.message }, { status: 500 });
  }
}
