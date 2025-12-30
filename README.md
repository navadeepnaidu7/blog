A minimal, fast and distraction-free blog built with SvelteKit. This repository contains both the blog template and my personal content.

## Tech Stack

- **SvelteKit** - Framework
- **TypeScript** - Type safety
- **mdsvex** - Markdown processing
- **Shiki** - Syntax highlighting
- **Cloudflare Pages** - Hosting

## Project Structure

```
src/
├── content/posts/          # Blog posts (markdown files)
├── lib/
│   ├── components/         # Reusable components
│   └── utils/              # Utility functions
├── routes/                 # SvelteKit routes
└── app.css                 # Global styles
```

## Development

```sh
npm install
npm run dev
```

## Building

```sh
npm run build
```

## License

The **blog template** (code, structure, and design) is licensed under the [MIT License](LICENSE) - free to use, modify, and distribute.

The **blog content** (all markdown files in `src/content/posts/`) is copyrighted. You may reference, quote, or share excerpts with attribution, but you may not republish entire posts or use the content commercially.

---

Feel free to fork this repository and use it as a template for your own blog. Just replace the content with your own writing!
