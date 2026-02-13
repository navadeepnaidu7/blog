A minimal, fast and distraction-free blog built with SvelteKit. This repository contains both the blog template and my personal content.

## Tech Stack

- **SvelteKit** - Framework
- **TypeScript** - Type safety
- **mdsvex** - Markdown processing
- **Shiki** - Syntax highlighting
- **Cloudflare Pages** - Hosting

## Project Structure

```
blog/
├── src/
│   ├── content/
│   │   └── posts/                  # Blog posts directory
│   │       ├── hello-world/        # Each post is a folder
│   │       │   ├── index.md        # Post content with frontmatter
│   │       │   └── image.png       # Co-located images (optional)
│   │       └── another-post/
│   │           └── index.md
│   │
│   ├── lib/
│   │   ├── components/             # Reusable Svelte components
│   │   │   ├── SEO.svelte         # SEO meta tags
│   │   │   ├── Header.svelte      # Site header
│   │   │   ├── Footer.svelte      # Site footer
│   │   │   ├── PostCard.svelte    # Blog post preview card
│   │   │   ├── TableOfContents.svelte
│   │   │   └── BlogLayout.svelte  # Blog post layout wrapper
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── posts.ts           # Post loading & filtering
│   │   │   ├── reading-time.ts    # Calculate reading time
│   │   │   └── remark-relative-images.js  # Image path transformer
│   │   │
│   │   ├── config.ts              # Site configuration
│   │   └── index.ts               # Lib exports
│   │
│   ├── routes/                     # SvelteKit routes (file-based routing)
│   │   ├── +layout.svelte         # Root layout
│   │   ├── +layout.ts             # Root layout data
│   │   ├── +page.svelte           # Home page
│   │   ├── +page.ts               # Home page data
│   │   ├── +error.svelte          # Custom 404/error page
│   │   │
│   │   ├── blog/
│   │   │   ├── +page.svelte       # Blog index (all posts)
│   │   │   ├── +page.ts           # Blog index data
│   │   │   └── [slug]/
│   │   │       ├── +page.svelte   # Individual blog post
│   │   │       └── +page.ts       # Post data loader
│   │   │
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       ├── +page.svelte   # Posts by category
│   │   │       └── +page.ts       # Category data
│   │   │
│   │   ├── tags/
│   │   │   └── [tag]/
│   │   │       ├── +page.svelte   # Posts by tag
│   │   │       └── +page.ts       # Tag data
│   │   │
│   │   ├── about/
│   │   │   └── +page.svelte       # About page
│   │   │
│   │   ├── rss.xml/
│   │   │   └── +server.ts         # RSS feed generator
│   │   │
│   │   └── sitemap.xml/
│   │       └── +server.ts         # Sitemap generator
│   │
│   ├── app.html                    # HTML template
│   ├── app.css                     # Global styles
│   └── app.d.ts                    # TypeScript declarations
│
├── static/                         # Static assets (served as-is)
│   ├── content/posts/             # Copied images (auto-generated)
│   ├── favicon.png                # Site favicon
│   └── og-image.png               # Default OG image
│
├── scripts/
│   └── copy-post-images.js        # Build script to copy images
│
├── mdsvex.config.js               # MDsveX configuration
├── svelte.config.js               # SvelteKit configuration
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies & scripts
```

For detailed instructions on creating blog posts, see [src/content/README.md](src/content/README.md).

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run check

# Build 
npm run build

# Preview
npm run preview
```

## Available Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start development server with HMR |
| `npm run build`       | Build static site for production  |
| `npm run preview`     | Preview production build locally  |
| `npm run check`       | Run TypeScript and Svelte checks  |
| `npm run check:watch` | Run checks in watch mode          |
| `npm run copy-images` | Copy post images to static folder |

## Deployment

This blog deploys automatically to **Cloudflare Pages** when you push to GitHub:

1. Push your changes to the `main` branch
2. Cloudflare Pages detects the push
3. Runs `npm run build`
4. Deploys the `build/` directory
5. Site is live at `blog.navadeepnaidu.com`

**Build settings:**

- Build command: `npm run build`
- Build output directory: `build`
- Node version: 18+

## License

The **blog template** (code, structure, and design) is licensed under the [MIT License](LICENSE) - free to use, modify, and distribute.

The **blog content** (all markdown files in `src/content/posts/`) is copyrighted. You may reference, quote, or share excerpts with attribution, but you may not republish entire posts or use the content commercially.

---

Feel free to fork this repository and use it as a template for your own blog. Just replace the content with your own writing!
