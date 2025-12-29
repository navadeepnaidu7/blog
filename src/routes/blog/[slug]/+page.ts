import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
    try {
        const post = await import(`../../../content/posts/${params.slug}/index.md`);
        const rawContent = await import(`../../../content/posts/${params.slug}/index.md?raw`);
        return {
            content: post.default,
            meta: post.metadata,
            rawContent: rawContent.default
        };
    } catch {
        throw error(404, `Post not found: ${params.slug}`);
    }
};
