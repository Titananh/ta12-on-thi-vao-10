#!/usr/bin/env node

/**
 * Read-only metadata crawl for the public TAK12 Exam ID 9 catalog.
 *
 * The question bundles are already stored locally.  This companion crawl keeps
 * the catalogue UI faithful to TAK12 by refreshing the public fields shown on
 * exam cards: average score, attempt count, FREE/PRO state, author, and the
 * canonical public quiz URL.  It intentionally does not require a login or
 * call any attempt/submission endpoint.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATEGORY_IDS = [1097, 1687, 1489, 1263, 170];
const API = 'https://data.tak12.com/api/services/app/QuizPublic/GetQuizzesByCategoriesBatch';

function encodeQuery() {
  const params = new URLSearchParams();
  CATEGORY_IDS.forEach((id, index) => params.set(`quizCategoryIds[${index}]`, String(id)));
  params.set('maxResultCount', '100');
  params.set('skipCount', '0');
  params.set('loadMode', '0');
  params.set('publishedOnly', 'true');
  return params.toString();
}

async function main() {
  const response = await fetch(`${API}?${encodeQuery()}`, {
    headers: { 'user-agent': 'TA12-offline-catalog-audit/1.0' },
  });
  if (!response.ok) throw new Error(`TAK12 metadata request failed: HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload?.result) throw new Error('TAK12 metadata response has no result object');

  const metadata = {};
  let total = 0;
  for (const categoryId of CATEGORY_IDS) {
    const group = payload.result[String(categoryId)];
    if (!group || !Array.isArray(group.items)) {
      throw new Error(`Missing category ${categoryId} in TAK12 metadata response`);
    }
    total += group.items.length;
    for (const quiz of group.items) {
      metadata[String(quiz.id)] = {
        id: quiz.id,
        title: quiz.quizName || quiz.metaTitle || '',
        description: quiz.description || '',
        author: quiz.author || '',
        timeLimit: quiz.timeLimit || 60,
        totalPoint: quiz.totalPoint || 0,
        averagePoint: quiz.averagePoint ?? null,
        attemptCount: quiz.attemptCount ?? 0,
        questionCount: quiz.questionCount ?? 0,
        categoryId: quiz.quizCategoryId,
        isPremium: Boolean(quiz.isPremium),
        showFeedBackForFreeUser: Boolean(quiz.showFeedBackForFreeUser),
        seoName: quiz.seoName || '',
        viewUrl: quiz.viewUrl || '',
        publishDate: quiz.publishDate || null,
      };
    }
  }

  const metadataPath = path.join(ROOT, 'data', 'exams', 'tak12_metadata.json');
  fs.writeFileSync(metadataPath, `${JSON.stringify({ source: API, examId: 9, crawledAt: new Date().toISOString(), total, quizzes: metadata }, null, 2)}\n`);

  for (const categoryId of CATEGORY_IDS) {
    const categoryPath = path.join(ROOT, 'data', 'exams', `category_${categoryId}.json`);
    const existing = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
    const merged = existing.map((exam) => ({
      ...exam,
      ...(metadata[String(exam.id)] || {}),
      // Preserve the local bundle's curated title/category fields when the API
      // returns a null/empty value, while exposing the official card metrics.
      title: metadata[String(exam.id)]?.title || exam.title || exam.quizName,
      quizName: metadata[String(exam.id)]?.title || exam.quizName || exam.title,
    }));
    fs.writeFileSync(categoryPath, `${JSON.stringify(merged, null, 2)}\n`);
  }

  console.log(`Crawled ${total} public TAK12 Exam ID 9 records across ${CATEGORY_IDS.length} categories.`);
  console.log(`Wrote ${path.relative(ROOT, metadataPath)} and refreshed category metadata.`);
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
