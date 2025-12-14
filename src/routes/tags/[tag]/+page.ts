import type { PageLoad } from './$types';
import { getPostsByTag } from '$lib/utils/posts';

export const load: PageLoad = async ({ params }) => {
    const posts = await getPostsByTag(params.tag);
    return {
        tag: params.tag,
        posts
    };
};
