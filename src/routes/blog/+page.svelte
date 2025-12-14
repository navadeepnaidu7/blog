<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import PostCard from '$lib/components/PostCard.svelte';
    import { formatDate } from '$lib/utils/posts';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    let viewMode = $state<'cards' | 'list'>('cards');

    // Group posts by year for list view
    function groupByYear(posts: typeof data.posts) {
        const groups: Record<string, typeof data.posts> = {};
        for (const post of posts) {
            const year = new Date(post.date).getFullYear().toString();
            if (!groups[year]) groups[year] = [];
            groups[year].push(post);
        }
        return Object.entries(groups).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    }

    let groupedPosts = $derived(groupByYear(data.posts));
</script>

<SEO 
    title="All Posts"
    description="Browse all blog posts"
/>

<div class="container">
    <div class="page-header-with-toggle">
        <h1 class="page-title">All Posts</h1>
        <div class="view-toggle">
            <button 
                class="view-btn" 
                class:active={viewMode === 'cards'}
                onclick={() => viewMode = 'cards'}
                aria-label="Cards view"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
            </button>
            <button 
                class="view-btn" 
                class:active={viewMode === 'list'}
                onclick={() => viewMode = 'list'}
                aria-label="List view"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
        </div>
    </div>

    {#if data.posts.length > 0}
        {#if viewMode === 'cards'}
            <div class="post-list">
                {#each data.posts as post}
                    <PostCard {post} />
                {/each}
            </div>
        {:else}
            <div class="post-list-view">
                {#each groupedPosts as [year, posts]}
                    <div class="year-group">
                        <h2 class="year-heading">{year}</h2>
                        <div class="year-posts">
                            {#each posts as post}
                                <a href="/blog/{post.slug}" class="list-item">
                                    <span class="list-title">{post.title}</span>
                                    <span class="list-meta">
                                        <span class="list-category">{post.category}</span>
                                        <span class="list-date">{formatDate(post.date)}</span>
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <p>No posts yet.</p>
    {/if}
</div>
