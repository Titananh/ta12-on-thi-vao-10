import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTopicId = searchParams.get('topicId') || '68';
  // Strictly validate topicId to prevent path traversal
  const isCustom = rawTopicId === 'custom';
  const topicId = isCustom ? 'custom' : (/^\d+$/.test(rawTopicId) ? rawTopicId : '68');
  const countParam = searchParams.get('count');
  const count = countParam ? Math.min(Math.max(parseInt(countParam, 10) || 15, 1), 50) : null;
  const topicsParam = searchParams.get('topics');

  const dataDir = path.join(process.cwd(), 'data');
  const questionsDir = path.join(dataDir, 'questions');
  const theoriesDir = path.join(dataDir, 'theories');
  const taxonomyPath = path.join(dataDir, 'taxonomy.json');

  let topicName = `Chuyên đề #${topicId}`;
  let englishName = '';

  // Handle multi-topic blended session
  if (topicId === 'custom' || topicsParam) {
    const topicList = (topicsParam || '68,69,29,126,78')
      .split(',')
      .map(t => t.trim())
      .filter(t => /^\d+$/.test(t));

    let blendedQuestions: any[] = [];
    for (const tid of topicList) {
      const qPath = path.join(questionsDir, `${tid}.json`);
      if (fs.existsSync(qPath)) {
        try {
          const qs = JSON.parse(fs.readFileSync(qPath, 'utf8'));
          blendedQuestions = blendedQuestions.concat(qs);
        } catch (e) {}
      }
    }

    // Shuffle blended questions
    for (let i = blendedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blendedQuestions[i], blendedQuestions[j]] = [blendedQuestions[j], blendedQuestions[i]];
    }

    const finalQuestions = count ? blendedQuestions.slice(0, count) : blendedQuestions.slice(0, 20);

    return NextResponse.json({
      topicId: 'custom',
      topicName: 'Phiên ôn luyện tổng hợp',
      englishName: 'Custom Practice Session',
      questions: finalQuestions,
      theory: {
        topicId: 0,
        topicName: 'Phiên ôn luyện tổng hợp',
        englishName: 'Custom Practice Session',
        rules: [
          {
            rule: 'Phiên ôn luyện tổng hợp kết hợp các câu hỏi từ nhiều chuyên đề thi vào 10.',
            formula: 'Ôn tập đa dạng ➔ Nâng cao phản xạ làm bài',
            examples: 'Hãy đọc kỹ câu hỏi, loại trừ các phương án sai và kiểm tra lại giải thích chi tiết sau khi làm bài.'
          }
        ]
      }
    });
  }

  // Look up topic name from taxonomy
  if (fs.existsSync(taxonomyPath)) {
    try {
      const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
      for (const skill of taxonomy.skills || []) {
        for (const cat of skill.topicCategories || []) {
          for (const t of cat.topics || []) {
            if (String(t.id) === String(topicId)) {
              topicName = t.topicName;
              englishName = t.englishName;
              break;
            }
          }
        }
      }
    } catch (e) {}
  }

  // Load questions
  const questionsPath = path.join(questionsDir, `${topicId}.json`);
  let questions: any[] = [];
  if (fs.existsSync(questionsPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    } catch (e) {}
  }

  // Check grammar subdirectory
  if (questions.length === 0) {
    const grammarPath = path.join(questionsDir, 'grammar', `grammar_${topicId}.json`);
    if (fs.existsSync(grammarPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
        questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        if (parsed.title) topicName = parsed.title;
      } catch (e) {}
    }
  }

  // Check vocabulary subdirectory
  if (questions.length === 0) {
    const vocabPath = path.join(questionsDir, 'vocabulary', `vocab_${topicId}.json`);
    if (fs.existsSync(vocabPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
        questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        if (parsed.title) topicName = parsed.title;
      } catch (e) {}
    }
  }

  // Fallback to sample topic 68 if specific topic file not found
  if (questions.length === 0) {
    const fallbackPath = path.join(questionsDir, '68.json');
    if (fs.existsSync(fallbackPath)) {
      try {
        questions = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      } catch (e) {}
    }
  }

  // Apply count limit if requested
  if (count && questions.length > count) {
    questions = questions.slice(0, count);
  }

  // Load theory
  const theoryPath = path.join(theoriesDir, `${topicId}.json`);
  let theory = null;
  if (fs.existsSync(theoryPath)) {
    try {
      theory = JSON.parse(fs.readFileSync(theoryPath, 'utf8'));
    } catch (e) {}
  } else {
    const grammarTheoryPath = path.join(theoriesDir, 'grammar', `grammar_${topicId}.json`);
    const vocabTheoryPath = path.join(theoriesDir, 'vocabulary', `vocab_${topicId}.json`);
    if (fs.existsSync(grammarTheoryPath)) {
      try {
        theory = JSON.parse(fs.readFileSync(grammarTheoryPath, 'utf8'));
      } catch (e) {}
    } else if (fs.existsSync(vocabTheoryPath)) {
      try {
        theory = JSON.parse(fs.readFileSync(vocabTheoryPath, 'utf8'));
      } catch (e) {}
    }
  }

  if (!theory) {
    theory = {
      topicId: Number(topicId) || 0,
      topicName,
      englishName,
      rules: [
        {
          rule: `Nắm vững các cấu trúc câu và quy tắc ngữ âm/ngữ pháp của chuyên đề ${topicName}.`,
          formula: 'Quy tắc trọng tâm thi tuyển sinh vào 10 Hà Nội',
          examples: 'Luyện tập thường xuyên với các dạng câu hỏi trắc nghiệm chuẩn TA12.'
        }
      ]
    };
  }

  return NextResponse.json({
    topicId,
    topicName,
    englishName,
    questions,
    theory,
  });
}
