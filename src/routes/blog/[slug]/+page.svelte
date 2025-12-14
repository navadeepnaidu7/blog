<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import { formatDate } from '$lib/utils/posts';
    import { calculateReadingTime, formatReadingTime } from '$lib/utils/reading-time';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    const readingTime = calculateReadingTime(data.meta.description || '');
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
    <header class="article-header">
        <h1 class="article-title">{data.meta.title}</h1>
        <div class="article-meta">
            <a href="/category/{data.meta.category.toLowerCase()}" class="article-category">{data.meta.category}</a>
            <span class="meta-separator"></span>
            <time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
            <span class="meta-separator"></span>
            <span>{formatReadingTime(readingTime)}</span>
        </div>
    </header>

    <div class="article-content">
        <svelte:component this={data.content} />
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
