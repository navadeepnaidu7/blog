<script lang="ts">
  import { siteConfig } from "$lib/config";

  interface Props {
    title?: string;
    description?: string;
    canonical?: string;
    image?: string;
    type?: "website" | "article";
    publishedTime?: string;
  }

  let {
    title = siteConfig.title,
    description = siteConfig.description,
    canonical = siteConfig.url,
    image = "/og-image.png",
    type = "website",
    publishedTime = "",
  }: Props = $props();

  const fullTitle =
    title === siteConfig.title ? title : `${title} | ${siteConfig.title}`;
  const ogImage = `${siteConfig.url}${image}`;
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <link
    rel="alternate"
    type="application/rss+xml"
    title={siteConfig.title}
    href="{siteConfig.url}/rss.xml"
  />

  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:site_name" content={siteConfig.title} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>
