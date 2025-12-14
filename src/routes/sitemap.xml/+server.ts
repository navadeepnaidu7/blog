import type { RequestHandler } from './$types';
import { getPosts } from '$lib/utils/posts';
import { siteConfig } from '$lib/config';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const posts = await getPosts();

    const staticPages = [
        { url: '', priority: '1.0' },
        { url: '/blog', priority: '0.9' },
        { url: '/about', priority: '0.8' }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => `
    <url>
        <loc>${siteConfig.url}${page.url}</loc>
        <priority>${page.priority}</priority>
    </url>`).join('')}
    ${posts.map(post => `
    <url>
        <loc>${siteConfig.url}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
        <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
