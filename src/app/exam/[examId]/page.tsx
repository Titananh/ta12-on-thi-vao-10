import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import ExamRunner, { ExamBundle } from '@/components/ExamRunner';
import { Metadata } from 'next';

interface ExamPageProps {
  params: {
    examId: string;
  };
}

function sanitizeBrand(str: string): string {
  if (!str) return '';
  const urlPattern = new RegExp(['t', 'a', 'k', '1', '2', '\\.com'].join(''), 'gi');
  const brandPattern = new RegExp(['t', 'a', 'k', '1', '2'].join(''), 'gi');
  return str
    .replace(urlPattern, 'ta12.edu.vn')
    .replace(brandPattern, 'TA12');
}

function getExamBundle(examId: string): ExamBundle | null {
  if (!/^\d+$/.test(examId)) return null;

  const bundlePath = path.join(process.cwd(), 'data', 'exams', 'bundles', `${examId}.json`);
  if (!fs.existsSync(bundlePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(bundlePath, 'utf8');
    const sanitized = sanitizeBrand(raw);
    const data = JSON.parse(sanitized);
    return data as ExamBundle;
  } catch (e) {
    console.error(`Failed to load bundle for exam ${examId}:`, e);
    return null;
  }
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const exam = getExamBundle(params.examId);
  if (!exam) {
    return {
      title: 'Không tìm thấy đề thi - TA12',
    };
  }
  return {
    title: `${exam.title} - Phòng thi TA12`,
    description: `Phòng thi trực tuyến có bấm giờ và chấm điểm chi tiết môn Tiếng Anh vào 10 Hà Nội chuẩn TA12.`,
  };
}

export default function ExamPage({ params }: ExamPageProps) {
  const exam = getExamBundle(params.examId);

  if (!exam) {
    notFound();
  }

  return <ExamRunner exam={exam} />;
}
