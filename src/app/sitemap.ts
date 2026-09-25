import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://' + ['ta12-on-thi-vao-10', 'vercel', 'app'].join('.');
  const currentDate = new Date().toISOString().split('T')[0];

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Exams
  try {
    const bundlesDir = path.join(process.cwd(), 'data', 'exams', 'bundles');
    if (fs.existsSync(bundlesDir)) {
      const files = fs.readdirSync(bundlesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const examId = file.replace('.json', '');
          routes.push({
            url: `${baseUrl}/exam/${examId}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch {}

  // Topics
  try {
    const taxPath = path.join(process.cwd(), 'data', 'taxonomy.json');
    if (fs.existsSync(taxPath)) {
      const tax = JSON.parse(fs.readFileSync(taxPath, 'utf8'));
      for (const skill of tax.skills || []) {
        for (const cat of skill.topicCategories || []) {
          for (const topic of cat.topics || []) {
            routes.push({
              url: `${baseUrl}/practice/${topic.id}`,
              lastModified: currentDate,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch {}

  return routes;
}
