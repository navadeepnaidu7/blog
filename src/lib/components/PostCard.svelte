<script lang="ts">
    import type { Post } from '$lib/utils/posts';
    import { formatDate } from '$lib/utils/posts';

    interface Props {
        post: Post;
    }

    let { post }: Props = $props();
</script>

<a href="/blog/{post.slug}" class="post-item">
    <span class="post-item-date">{formatDate(post.date)}</span>
    <h2 class="post-item-title">{post.title}</h2>
    <p class="post-item-excerpt">{post.description}</p>
</a>
