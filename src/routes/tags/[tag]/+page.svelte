<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import PostCard from '$lib/components/PostCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<SEO 
    title={`#${data.tag}`}
    description={`Posts tagged ${data.tag}.`}
    canonical={`https://blog.navadeepnaidu.com/tags/${data.tag.toLowerCase()}`}
/>

<div class="container">
    <a href="/blog" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        All posts
    </a>

    <div class="page-header">
        <h1 class="page-title">#{data.tag}</h1>
    </div>

    {#if data.posts.length > 0}
        <div class="post-list">
            {#each data.posts as post}
                <PostCard {post} />
            {/each}
        </div>
    {:else}
        <p>No posts with this tag.</p>
    {/if}
</div>
