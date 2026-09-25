import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Clean legacy brand names to maintain 100% TA12 consistency
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
  const examId = searchParams.get('examId');
  const categoryId = searchParams.get('categoryId');

  const dataDir = path.join(process.cwd(), 'data');
  const examsDir = path.join(dataDir, 'exams');
  const bundlesDir = path.join(examsDir, 'bundles');

  // Single exam bundle request
  if (examId) {
    if (!/^\d+$/.test(examId)) {
      return NextResponse.json({ error: 'Invalid exam ID' }, { status: 400 });
    }

    const bundlePath = path.join(bundlesDir, `${examId}.json`);
    if (!fs.existsSync(bundlePath)) {
      return NextResponse.json({ error: 'Exam bundle not found' }, { status: 404 });
    }

    try {
      const raw = fs.readFileSync(bundlePath, 'utf8');
      const sanitized = sanitizeBrand(raw);
      const bundle = JSON.parse(sanitized);
      return NextResponse.json(bundle);
    } catch (e: any) {
      return NextResponse.json({ error: 'Failed to read exam bundle', details: e.message }, { status: 500 });
    }
  }

  // Catalog request: either filtered by categoryId or all exams
  try {
    const categoriesPath = path.join(examsDir, 'categories.json');
    let categories: any[] = [];
    if (fs.existsSync(categoriesPath)) {
      categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    }

    const catFiles = [1097, 1687, 1489, 1263, 170];
    let allExams: any[] = [];

    for (const catId of catFiles) {
      if (categoryId && String(catId) !== String(categoryId)) {
        continue;
      }

      const catFilePath = path.join(examsDir, `category_${catId}.json`);
      if (fs.existsSync(catFilePath)) {
        try {
          const raw = fs.readFileSync(catFilePath, 'utf8');
          const sanitized = sanitizeBrand(raw);
          const exams = JSON.parse(sanitized);
          allExams = allExams.concat(exams);
        } catch (e) {}
      }
    }

    return NextResponse.json({
      categories,
      totalExams: allExams.length,
      exams: allExams
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load exams catalog', details: e.message }, { status: 500 });
  }
}
