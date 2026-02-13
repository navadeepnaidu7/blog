<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "../app.css";

  let { children } = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<div class="page-wrapper" class:mounted>
  <Header />
  <main class="main-content">
    <div class="container">
      {@render children()}
    </div>
  </main>
  <Footer />
</div>

<style>
  .page-wrapper {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.3s ease,
      transform 0.5s ease;
  }

  .page-wrapper.mounted {
    opacity: 1;
    transform: translateY(0);
  }
</style>
