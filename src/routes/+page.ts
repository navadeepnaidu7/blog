import type { PageLoad } from './$types';
import { getPosts } from '$lib/utils/posts';

export const load: PageLoad = async () => {
    const posts = await getPosts();
    return {
        posts: posts.slice(0, 5)
    };
};
