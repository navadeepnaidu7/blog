import { calculateReadingTime } from './reading-time';

export interface PostMetadata {
    title: string;
    date: string;
    description: string;
    tags: string[];
    category: string;
    canonical?: string;
    draft?: boolean;
    image?: string;
}

export interface Post extends PostMetadata {
    slug: string;
    readingTime: number;
    content: string;
}

type GlobEntry = {
    metadata: PostMetadata;
    default: unknown;
};

export async function getPosts(): Promise<Post[]> {
    const modules = import.meta.glob<GlobEntry>('/src/content/posts/*/index.md', { eager: true });

    const posts: Post[] = [];

    for (const path in modules) {
        const module = modules[path];
        // Extract slug from folder name: /src/content/posts/[slug]/index.md
        const pathParts = path.split('/');
        const slug = pathParts[pathParts.length - 2] || '';
        const metadata = module.metadata as PostMetadata;

        if (metadata.draft && import.meta.env.PROD) {
            continue;
        }

        const content = typeof module.default === 'string' ? module.default : '';
        const readingTime = calculateReadingTime(content);

        posts.push({
            ...metadata,
            slug,
            readingTime,
            content
        });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<{ post: Post; component: unknown } | null> {
    const modules = import.meta.glob<GlobEntry>('/src/content/posts/*/index.md', { eager: true });

    for (const path in modules) {
        // Extract slug from folder name: /src/content/posts/[slug]/index.md
        const pathParts = path.split('/');
        const fileSlug = pathParts[pathParts.length - 2] || '';
        if (fileSlug === slug) {
            const module = modules[path];
            const metadata = module.metadata as PostMetadata;
            const content = typeof module.default === 'string' ? module.default : '';

            return {
                post: {
                    ...metadata,
                    slug: fileSlug,
                    readingTime: calculateReadingTime(content),
                    content
                },
                component: module.default
            };
        }
    }

    return null;
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await getPosts();
    return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await getPosts();
    return posts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

export async function getAllTags(): Promise<string[]> {
    const posts = await getPosts();
    const tags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag.toLowerCase())));
    return Array.from(tags).sort();
}

export async function getAllCategories(): Promise<string[]> {
    const posts = await getPosts();
    const categories = new Set<string>();
    posts.forEach(post => categories.add(post.category));
    return Array.from(categories).sort();
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
