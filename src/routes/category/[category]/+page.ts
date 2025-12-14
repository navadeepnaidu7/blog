import type { PageLoad } from './$types';
import { getPostsByCategory } from '$lib/utils/posts';

export const load: PageLoad = async ({ params }) => {
    const posts = await getPostsByCategory(params.category);
    return {
        category: params.category,
        posts
    };
};
