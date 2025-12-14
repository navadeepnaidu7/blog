<script lang="ts">
    import SEO from '$lib/components/SEO.svelte';
    import PostCard from '$lib/components/PostCard.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<SEO />

<div class="container">
    <div class="home-intro">
        <p>Hi, I'm <strong>Navadeep Naidu</strong>. I'm a software engineer who loves building things and thinking through problems. This is my corner of the internet where I write about technology, development, and life.</p>
    </div>

    <div class="intro-ornament">
        <span class="ornament-dot"></span>
        <span class="ornament-dot"></span>
        <span class="ornament-dot"></span>
    </div>

    <div class="page-header">
        <h2 class="section-title">Recent Posts</h2>
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
