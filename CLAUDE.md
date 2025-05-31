# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start local development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Build and preview locally with Wrangler
- `npm run check` - Full validation: build + TypeScript check + dry-run deploy

### Deployment
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Worker types

### Validation
- `astro check` - Check Astro project for errors
- `tsc` - TypeScript type checking

## Architecture Overview

### Content Management
- **Content Collections**: Blog posts are managed via Astro's content collections in `src/content/blog/`
- **Schema Validation**: Blog frontmatter is type-checked using Zod schema in `src/content.config.ts`
- **Supported Formats**: Markdown (.md) and MDX (.mdx) files with frontmatter including title, description, pubDate, updatedDate, and heroImage

### Routing Structure
- **Static Pages**: `src/pages/index.astro` (homepage), `src/pages/about.astro`
- **Blog Routes**: 
  - `src/pages/blog/index.astro` - Blog listing page
  - `src/pages/blog/[...slug].astro` - Dynamic blog post pages
- **Feeds**: `src/pages/rss.xml.js` - RSS feed generation

### Deployment Architecture
- **Platform**: Cloudflare Workers with static assets
- **Build Output**: `./dist/` directory contains built site
- **Worker Entry**: `./dist/_worker.js/index.js` as defined in wrangler.json
- **Assets**: Static files served via Cloudflare's ASSETS binding

### Global Configuration
- **Site Metadata**: Defined in `src/consts.ts` (SITE_TITLE, SITE_DESCRIPTION)
- **Astro Config**: `astro.config.mjs` includes MDX, sitemap, and Cloudflare adapter
- **Deployment Config**: `wrangler.json` configures Cloudflare Workers deployment

### Key Integrations
- **@astrojs/mdx**: Enhanced Markdown with JSX components
- **@astrojs/sitemap**: Automatic sitemap generation
- **@astrojs/rss**: RSS feed functionality
- **@astrojs/cloudflare**: Cloudflare Workers adapter with platform proxy