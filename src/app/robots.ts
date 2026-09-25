import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/api/auth/'],
      },
    ],
    sitemap: 'https://' + ['ta12-on-thi-vao-10', 'vercel', 'app'].join('.') + '/sitemap.xml',
  };
}
