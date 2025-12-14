<script lang="ts">
    import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="site-header">
    <div class="header-inner">
        <a href="/" class="site-logo">Navadeep Naidu</a>
        <nav class="header-nav">
            <a href="/blog">Writing</a>
            <a href="/about">About</a>
            <ThemeToggle />
        </nav>
    </div>
</header>
