import visit from 'unist-util-visit';

/**
 * Remark plugin to transform relative image paths in markdown to use Vite's asset handling.
 * Converts ./image.png to the proper import path for co-located images.
 * @returns {(tree: any, file: any) => void}
 */
export function remarkRelativeImages() {
    return (tree, file) => {
        // Get the directory of the markdown file
        const filePath = file.filename || file.path || '';
        
        visit(tree, 'image', (node) => {
            const src = node.url;
            
            // Only transform relative paths (starting with ./ or not starting with / or http)
            if (src && (src.startsWith('./') || src.startsWith('../') || (!src.startsWith('/') && !src.startsWith('http')))) {
                // Get the post slug from the file path
                // File path format: /src/content/posts/[slug]/index.md
                const pathParts = filePath.split(/[/\\]/);
                const postsIndex = pathParts.findIndex((/** @type {string} */ p) => p === 'posts');
                
                if (postsIndex !== -1 && pathParts[postsIndex + 1]) {
                    const slug = pathParts[postsIndex + 1];
                    // Remove leading ./ if present
                    const imageName = src.replace(/^\.\//, '');
                    // Transform to absolute path for the static build
                    node.url = `/content/posts/${slug}/${imageName}`;
                }
            }
        });
    };
}
