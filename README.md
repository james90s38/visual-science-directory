# Visual Science Directory

A simple, very fast static website for premium visual science infographics.

## Structure

- `styles/00-tokens.css` — design tokens
- `styles/01-atoms.css` — buttons, chips, inputs, base image rules
- `styles/02-molecules.css` — search/filter groups, cards, modal blocks
- `styles/03-organisms.css` — header, toolbar, grid, lightbox
- `styles/04-pages.css` — page-specific layout and responsiveness
- `scripts/app.js` — vanilla JS search/filter/modal behavior
- `data/items.json` — content source
- `assets/images/` — optimized image assets
- `assets/video/` — optional motion-video assets

## Local preview

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.
