<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import PostCard from '$lib/components/PostCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<SEO 
    title="Writing" 
    description="All blog posts by Navadeep Naidu."
    canonical="https://blog.navadeepnaidu.com/blog"
/>

<div class="container">
    <div class="page-header">
        <h1 class="page-title">All Posts</h1>
    </div>

    {#if data.posts.length > 0}
        <div class="post-list">
            {#each data.posts as post}
                <PostCard {post} />
            {/each}
        </div>
    {:else}
        <p>No posts yet.</p>
    {/if}
</div>
