<script lang="ts">
    import { page } from '$app/stores';
    import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title="Page Not Found" description="The page you're looking for doesn't exist." />

<div class="container">
    <div class="error-page">
        <p class="error-code">Error {$page.status}</p>
        <h1 class="error-title">Page not found</h1>
        <p class="error-text">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" class="error-link">Go home</a>
    </div>
</div>
