<script lang="ts">
    import { browser } from '$app/environment';
    import SEO from '$lib/components/SEO.svelte';
    import { formatDate } from '$lib/utils/posts';
    import { calculateReadingTime, formatReadingTime } from '$lib/utils/reading-time';
    import { onMount, tick } from 'svelte';
    import type { PageData } from './$types';

    type TocItem = {
        id: string;
        text: string;
        level: 1 | 2 | 3;
        element: HTMLElement;
    };

    const HEADER_OFFSET = 130;

    let { data }: { data: PageData } = $props();

    const readingTime = $derived(calculateReadingTime(data.rawContent || ''));

    let tocItems = $state<TocItem[]>([]);
    let activeHeadingId = $state('article-top');

    let refreshToken = $state(0);

    function slugify(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    function assignHeadingId(heading: HTMLElement, usedIds: Set<string>): string {
        const existingId = heading.id?.trim();
        if (existingId && !usedIds.has(existingId)) {
            usedIds.add(existingId);
            return existingId;
        }

        const baseId = slugify(heading.textContent || 'section') || 'section';
        let candidate = baseId;
        let count = 2;

        while (usedIds.has(candidate)) {
            candidate = `${baseId}-${count}`;
            count += 1;
        }

        heading.id = candidate;
        usedIds.add(candidate);
        return candidate;
    }

    function updateActiveHeading() {
        if (!tocItems.length) {
            return;
        }

        let currentId = tocItems[0].id;

        for (const item of tocItems) {
            const top = item.element.getBoundingClientRect().top;
            if (top - HEADER_OFFSET <= 0) {
                currentId = item.id;
            } else {
                break;
            }
        }

        activeHeadingId = currentId;
    }

    function scrollToHeading(id: string) {
        if (!browser) {
            return;
        }

        const target = document.getElementById(id);
        if (!target) {
            return;
        }

        const targetTop = target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: Math.max(0, targetTop - HEADER_OFFSET + 12),
            behavior: 'smooth'
        });

        activeHeadingId = id;
    }

    function collectHeadings() {
        if (!browser) {
            return;
        }

        const articleTitle = document.querySelector<HTMLElement>('.article-title');
        const articleContent = document.querySelector<HTMLElement>('.article-content');

        if (!articleTitle || !articleContent) {
            tocItems = [];
            return;
        }

        articleTitle.id = 'article-top';

        const usedIds = new Set<string>(['article-top']);
        const contentHeadings = Array.from(
            articleContent.querySelectorAll<HTMLElement>('h1, h2, h3')
        );

        const items: TocItem[] = [
            {
                id: 'article-top',
                text: articleTitle.textContent?.trim() || 'Top',
                level: 1,
                element: articleTitle
            }
        ];

        for (const heading of contentHeadings) {
            const text = heading.textContent?.trim();
            if (!text) {
                continue;
            }

            const id = assignHeadingId(heading, usedIds);
            const tagLevel = Number(heading.tagName.slice(1));
            const level = (tagLevel >= 1 && tagLevel <= 3 ? tagLevel : 3) as 1 | 2 | 3;

            items.push({ id, text, level, element: heading });
        }

        tocItems = items;
    }

    async function refreshToc() {
        await tick();
        collectHeadings();
        updateActiveHeading();
    }

    $effect(() => {
        data.rawContent;
        refreshToken;

        if (!browser) {
            return;
        }

        void refreshToc();
    });

    onMount(() => {
        if (!browser) {
            return;
        }

        const handleScroll = () => updateActiveHeading();
        const handleResize = () => {
            refreshToken += 1;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        void refreshToc();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<SEO 
    title={data.meta.title}
    description={data.meta.description}
    canonical={data.meta.canonical}
    type="article"
    publishedTime={data.meta.date}
    image={data.meta.image}
/>

<article class="article-container">
    {#if tocItems.length > 1}
        <nav class="floating-toc" aria-label="Table of contents">
            <div class="toc-rail" aria-hidden="true">
                {#each tocItems as item}
                    <a
                        href={`#${item.id}`}
                        class="toc-rail-link"
                        class:active={activeHeadingId === item.id}
                        aria-label={item.text}
                        onclick={(event) => {
                            event.preventDefault();
                            scrollToHeading(item.id);
                        }}
                    >
                        <span class="toc-rail-line"></span>
                    </a>
                {/each}
            </div>

            <div class="toc-panel" role="presentation">
                <p class="toc-label">On this page</p>
                <ol class="toc-list">
                    {#each tocItems as item}
                        <li class={`toc-item level-${item.level}`}>
                            <a
                                href={`#${item.id}`}
                                class="toc-link"
                                class:active={activeHeadingId === item.id}
                                onclick={(event) => {
                                    event.preventDefault();
                                    scrollToHeading(item.id);
                                }}
                            >
                                {item.text}
                            </a>
                        </li>
                    {/each}
                </ol>
            </div>
        </nav>
    {/if}

    <div class="container">
        <a href="/blog" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to all posts
        </a>
    </div>

    <header class="article-header">
        <h1 id="article-top" class="article-title">{data.meta.title}</h1>
        <div class="article-meta">
            <a href="/category/{data.meta.category.toLowerCase()}" class="article-category">{data.meta.category}</a>
            <span class="meta-separator"></span>
            <time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
            <span class="meta-separator"></span>
            <span>{formatReadingTime(readingTime)}</span>
        </div>
    </header>

    <div class="article-content">
        {@render data.content()}
    </div>

    {#if data.meta.tags && data.meta.tags.length > 0}
        <footer class="article-footer">
            <div class="article-tags">
                {#each data.meta.tags as tag}
                    <a href="/tags/{tag.toLowerCase()}" class="tag">{tag}</a>
                {/each}
            </div>
        </footer>
    {/if}
</article>

<style>
    .floating-toc {
        position: fixed;
        top: 120px;
        left: 10px;
        transform: none;
        z-index: 40;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 4px;
    }

    .toc-rail {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 6px;
        border-radius: 10px;
        background-color: color-mix(in srgb, var(--color-bg) 86%, transparent);
        backdrop-filter: blur(8px);
    }

    .toc-rail-link {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 14px;
        height: 6px;
        color: var(--color-subtle);
        opacity: 0.8;
    }

    .toc-rail-line {
        width: 9px;
        height: 1.5px;
        border-radius: 999px;
        background-color: currentColor;
        transition: all var(--transition);
    }

    .toc-rail-link.active {
        color: var(--color-subtle);
        opacity: 0.8;
    }

    .toc-rail-link.active .toc-rail-line {
        width: 9px;
        box-shadow: none;
    }

    .toc-panel {
        width: min(250px, 24vw);
        max-height: 70vh;
        overflow-y: auto;
        padding: 14px 12px;
        border: 1px solid var(--color-border);
        border-radius: 14px;
        background-color: color-mix(in srgb, var(--color-bg) 92%, transparent);
        backdrop-filter: blur(12px);
        opacity: 0;
        transform: translateX(10px);
        pointer-events: none;
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .floating-toc:hover .toc-panel,
    .floating-toc:focus-within .toc-panel {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }

    .toc-label {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        color: var(--color-muted);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    .toc-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .toc-item {
        margin: 0;
    }

    .toc-item.level-1 {
        padding-left: 0;
    }

    .toc-item.level-2 {
        padding-left: 10px;
    }

    .toc-item.level-3 {
        padding-left: 20px;
    }

    .toc-link {
        display: block;
        font-family: var(--font-sans);
        font-size: 12px;
        line-height: 1.4;
        color: var(--color-muted);
        padding: 4px 5px;
        border-radius: 5px;
        transition: all var(--transition);
    }

    .toc-link:hover {
        color: var(--color-fg);
        background-color: var(--color-hover-bg);
    }

    .toc-link.active {
        color: var(--color-muted);
        font-weight: 400;
    }

    .article-title {
        scroll-margin-top: 120px;
    }

    .article-content :global(h1),
    .article-content :global(h2),
    .article-content :global(h3) {
        scroll-margin-top: 120px;
    }

    @media (max-width: 1200px) {
        .floating-toc {
            left: 6px;
        }

        .toc-panel {
            width: min(220px, 26vw);
        }
    }

    @media (max-width: 980px) {
        .floating-toc {
            display: none;
        }
    }
</style>
