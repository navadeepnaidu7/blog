<script lang="ts">
  import type { Post } from "$lib/utils/posts";
  import { formatDate } from "$lib/utils/posts";

  interface Props {
    post: Post;
  }

  let { post }: Props = $props();
</script>

<a href="/blog/{post.slug}" class="post-item">
  <div class="post-item-content">
    <span class="post-item-date">{formatDate(post.date)}</span>
    <h2 class="post-item-title">{post.title}</h2>
    <p class="post-item-excerpt">{post.description}</p>
    {#if post.tags && post.tags.length > 0}
      <div class="post-item-tags">
        {#each post.tags.slice(0, 3) as tag}
          <span class="post-tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </div>
  {#if post.image}
    <div class="post-item-image">
      <img src={post.image} alt={post.title} />
    </div>
  {/if}
</a>
