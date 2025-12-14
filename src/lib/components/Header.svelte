<script lang="ts">
    import ThemeToggle from './ThemeToggle.svelte';
    import { getAllCategories, getPostsByCategory } from '$lib/utils/posts';

    let showCategories = $state(false);
    let categories = $state<{name: string, count: number}[]>([]);
    let isClosing = $state(false);

    async function loadCategories() {
        const cats = await getAllCategories();
        const result = [];
        for (const cat of cats) {
            const posts = await getPostsByCategory(cat);
            result.push({ name: cat, count: posts.length });
        }
        categories = result;
    }

    function toggleCategories() {
        if (!showCategories && categories.length === 0) {
            loadCategories();
        }
        if (showCategories) {
            isClosing = true;
            setTimeout(() => {
                showCategories = false;
                isClosing = false;
            }, 150);
        } else {
            showCategories = true;
        }
    }

    function closeCategories() {
        if (showCategories) {
            isClosing = true;
            setTimeout(() => {
                showCategories = false;
                isClosing = false;
            }, 150);
        }
    }

    let mobileMenuOpen = $state(false);
</script>

<svelte:window onclick={(e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.categories-dropdown')) {
        closeCategories();
    }
}} />

<header class="site-header">
    <div class="header-inner">
        <a href="/" class="site-logo">Navadeep Naidu</a>
        
        <button class="mobile-menu-btn" onclick={() => mobileMenuOpen = !mobileMenuOpen} aria-label="Toggle menu">
            {#if mobileMenuOpen}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            {:else}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
            {/if}
        </button>

        <nav class="header-nav" class:open={mobileMenuOpen}>
            <a href="/blog" onclick={() => mobileMenuOpen = false}>All</a>
            <div class="categories-dropdown">
                <button class="nav-btn" onclick={toggleCategories}>
                    Categories
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class:rotated={showCategories && !isClosing}>
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                {#if showCategories}
                    <div class="dropdown-menu" class:closing={isClosing}>
                        {#each categories as cat}
                            <a href="/category/{cat.name.toLowerCase()}" onclick={() => { closeCategories(); mobileMenuOpen = false; }}>
                                <span>{cat.name}</span>
                                <span class="count">{cat.count}</span>
                            </a>
                        {/each}
                        {#if categories.length === 0}
                            <span class="loading">Loading...</span>
                        {/if}
                    </div>
                {/if}
            </div>
            <a href="/about" onclick={() => mobileMenuOpen = false}>About</a>
            <div class="header-icons">
                <a href="/rss.xml" class="icon-link" aria-label="RSS Feed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="6.18" cy="17.82" r="2.18"/>
                        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
                    </svg>
                </a>
                <ThemeToggle />
            </div>
        </nav>
    </div>
</header>
