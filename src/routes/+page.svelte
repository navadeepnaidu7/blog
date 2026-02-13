<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import PostCard from "$lib/components/PostCard.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let showTooltip = $state(false);

  function handleMouseMove(e: MouseEvent) {
    tooltipX = e.clientX;
    tooltipY = e.clientY;
  }
</script>

<SEO />

<div class="container">
  <div class="home-intro">
    <div class="intro-layout">
      <p>
        Hi, I'm <strong>Navadeep Naidu</strong>. I'm a software engineer who
        loves building things related to backend and cloud. This is my corner
        of the internet where I write about technology, software and everything I feel that is worth sharing.
      </p>
      <div
        class="profile-image-wrapper"
        role="button"
        aria-label="Profile picture with status"
        tabindex="0"
        onmouseenter={() => (showTooltip = true)}
        onmouseleave={() => (showTooltip = false)}
        onmousemove={handleMouseMove}
      >
        <img src="/profile.jpg" alt="Navadeep Naidu" class="profile-image" />
        {#if showTooltip}
          <span
            class="status-tooltip"
            style="left: {tooltipX}px; top: {tooltipY + 20}px;"
          >
            I don't have any other pictures in my pc 
          </span>
        {/if}
      </div>
    </div>
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
