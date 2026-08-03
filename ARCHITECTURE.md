# Visual Science Directory — Architecture Decision

## Options considered

1. **Plain static HTML/CSS/JS (chosen)**
   - Fastest runtime: no framework bundle, no hydration, no build step.
   - Easiest to deploy to Vercel/GitHub.
   - Best for v1 because requirements are simple: grid, search, filters, detail modal.

2. **Astro**
   - Very fast and good for content sites, but adds install/build complexity.
   - Better later when the directory grows to many real pages.

3. **Next.js / React**
   - Powerful but unnecessary for v1.
   - More JS and build complexity than needed.

4. **Vite React**
   - Easier than Next, still heavier than required.
   - Not worth it for a no-login static gallery.

5. **CMS-backed site**
   - Useful later for editor workflow, but premature for one approved item.

## Chosen approach

Use a zero-framework static site:
- `index.html`
- modular CSS following design-token / atoms / molecules / organisms / pages naming
- tiny vanilla JS that fetches `data/items.json`
- optimized WebP thumbnails for speed

This gives the fastest first version and keeps the code simple enough to evolve.
