import { createHighlighter } from 'shiki';
import { remarkRelativeImages } from './src/lib/utils/remark-relative-images.js';

const theme = 'github-dark-dimmed';
const langs = ['javascript', 'typescript', 'python', 'bash', 'json', 'html', 'css', 'svelte', 'markdown', 'yaml', 'go'];

let highlighter;

async function highlightCode(code, lang) {
    if (!highlighter) {
        highlighter = await createHighlighter({ themes: [theme], langs });
    }
    
    const validLang = langs.includes(lang) ? lang : 'text';
    return highlighter.codeToHtml(code, { lang: validLang, theme });
}

const config = {
    extensions: ['.md', '.svx'],
    highlight: {
        highlighter: async (code, lang) => {
            const html = await highlightCode(code, lang || 'text');
            return `{@html \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
        }
    },
    smartypants: {
        dashes: 'oldschool'
    },
    remarkPlugins: [remarkRelativeImages],
    rehypePlugins: []
};

export default config;
