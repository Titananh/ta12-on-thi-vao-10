import React from 'react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

interface PracticeLayoutProps {
  children: React.ReactNode;
  params: {
    topicId: string;
  };
}

function getTopicInfo(topicId: string): { name: string; englishName: string } | null {
  try {
    const taxPath = path.join(process.cwd(), 'data', 'taxonomy.json');
    if (!fs.existsSync(taxPath)) return null;
    const tax = JSON.parse(fs.readFileSync(taxPath, 'utf8'));
    for (const skill of tax.skills || []) {
      for (const cat of skill.topicCategories || []) {
        for (const topic of cat.topics || []) {
          if (String(topic.id) === String(topicId)) {
            return {
              name: topic.topicName,
              englishName: topic.englishName || '',
            };
          }
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateMetadata({ params }: { params: { topicId: string } }): Promise<Metadata> {
  const isCustom = params.topicId === 'custom';
  const topic = isCustom ? { name: 'Phiên ôn luyện tổng hợp', englishName: 'Custom Practice' } : getTopicInfo(params.topicId);
  const topicName = topic?.name || `Chủ điểm #${params.topicId}`;
  const title = `Luyện chuyên đề: ${topicName} - TA12`;
  const description = `Luyện tập chuyên sâu dạng bài ${topicName} với giải thích đáp án chi tiết và lý thuyết ngữ pháp chuẩn thi vào 10.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://' + ['ta12-on-thi-vao-10', 'vercel', 'app'].join('.') + `/practice/${params.topicId}`,
      siteName: 'TA12',
      type: 'article',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
  };
}

export default function PracticeLayout({ children }: PracticeLayoutProps) {
  return <>{children}</>;
}
