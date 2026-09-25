import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuestionId = searchParams.get('questionId');

  if (!rawQuestionId) {
    return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
  }

  const questionId = rawQuestionId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!questionId) {
    return NextResponse.json({ error: 'Invalid questionId' }, { status: 400 });
  }

  const transPath = path.join(process.cwd(), 'data', 'translations.json');
  if (fs.existsSync(transPath)) {
    try {
      const transMap = JSON.parse(fs.readFileSync(transPath, 'utf8'));
      if (transMap[questionId]) {
        return NextResponse.json({
          questionId: Number(questionId) || questionId,
          language: 'vi',
          ...transMap[questionId],
        });
      }
    } catch (e) {}
  }

  // Fallback: check section files
  const sectionsDir = path.join(process.cwd(), 'data', 'sections');
  if (fs.existsSync(sectionsDir)) {
    try {
      const files = fs.readdirSync(sectionsDir);
      for (const f of files) {
        if (f.endsWith('.json') && f !== 'index.json') {
          const s = JSON.parse(fs.readFileSync(path.join(sectionsDir, f), 'utf8'));
          const q = (s.questions || []).find((x: any) => String(x.id) === String(questionId));
          if (q && q.translation) {
            return NextResponse.json({
              questionId: Number(questionId) || questionId,
              language: 'vi',
              ...q.translation,
            });
          }
        }
      }
    } catch (e) {}
  }

  return NextResponse.json({
    questionId: Number(questionId) || questionId,
    language: 'vi',
    questionText: null,
    answers: {},
  });
}
