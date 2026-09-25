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

  return NextResponse.json({
    moduleId,
    type,
    title: theoryData?.title || questionsData?.title || `Chuyên đề #${moduleId}`,
    lessons: theoryData?.lessons || [],
    vocabTable: theoryData?.vocabTable || [],
    totalQuestions: questionsData?.questions?.length || 0,
    questions: questionsData?.questions || []
  });
}
