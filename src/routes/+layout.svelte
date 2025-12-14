<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import '../app.css';

    let { children } = $props();
</script>

<Header />
<main class="main-content">
    <div class="container">
        {@render children()}
    </div>
</main>
<Footer />
