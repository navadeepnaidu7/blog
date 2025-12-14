<script lang="ts">
    import { siteConfig } from '$lib/config';

    interface Props {
        title?: string;
        description?: string;
        canonical?: string;
        image?: string;
        type?: 'website' | 'article';
        publishedTime?: string;
    }

    let { 
        title = siteConfig.title,
        description = siteConfig.description,
        canonical = siteConfig.url,
        image = '',
        type = 'website',
        publishedTime = ''
    }: Props = $props();

    const fullTitle = title === siteConfig.title ? title : `${title} | ${siteConfig.title}`;
    const ogImage = image ? `${siteConfig.url}${image}` : '';
</script>

<svelte:head>
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content={siteConfig.title} />
    {#if ogImage}
        <meta property="og:image" content={ogImage} />
    {/if}
    {#if publishedTime}
        <meta property="article:published_time" content={publishedTime} />
    {/if}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if ogImage}
        <meta name="twitter:image" content={ogImage} />
    {/if}
</svelte:head>
