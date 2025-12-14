import type { RequestHandler } from './$types';
import { getPosts } from '$lib/utils/posts';
import { siteConfig } from '$lib/config';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const posts = await getPosts();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${siteConfig.title}</title>
        <description>${siteConfig.description}</description>
        <link>${siteConfig.url}</link>
        <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${posts.map(post => `
        <item>
            <title>${escapeXml(post.title)}</title>
            <description>${escapeXml(post.description)}</description>
            <link>${siteConfig.url}/blog/${post.slug}</link>
            <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <category>${escapeXml(post.category)}</category>
        </item>`).join('')}
    </channel>
</rss>`;

    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
