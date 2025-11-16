import { getAllPosts } from '@/lib/github';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const posts = await getAllPosts();

  // Generate XML for all posts
  const postEntries = posts
    .map((post) => {
      return `  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${new Date(post.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  // Static pages
  const staticPages = [
    {
      url: '',
      priority: '1.0',
      changefreq: 'daily',
    },
    {
      url: '/contact',
      priority: '0.7',
      changefreq: 'monthly',
    },
  ];

  const staticEntries = staticPages
    .map((page) => {
      return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache 1 hour
    },
  });
}
