# Design notes and content decisions

## Stack used

This project uses the simplest stack possible for v1:

- static HTML
- modular CSS
- vanilla JavaScript
- JSON as the content database
- Pillow-generated images for drafted infographics
- Vercel static hosting

No React, Next.js, Vite, Tailwind, UI library, image-generation model, database, auth, or CMS is used.

## Why this stack

The v1 only needs a grid, search, filters, a modal, and images. Plain static files are fastest because there is no app bundle, no hydration, no server dependency, and no build step. Images are optimized as WebP thumbnails and larger WebP detail assets.

## Design-system rule

Changes should happen in the correct layer:

- `00-tokens.css` — colors, spacing, radii, page width, grid size
- `01-atoms.css` — chips, buttons, links, basic controls
- `02-molecules.css` — search, filters, cards, skeletons, detail lists
- `03-organisms.css` — nav, hero, toolbar, grid, modal
- `04-pages.css` — responsive page rules

Avoid one-off styling in HTML or JavaScript unless the content itself requires it.

## Text casing rule

Use normal sentence/title casing. Avoid all-uppercase UI labels. If emphasis is needed, use weight, size, spacing, or placement from the CSS system instead of uppercase text.

## If we hide titles under images

A pure image grid can still communicate the topic if we combine:

1. strong text inside each infographic image
2. a small overlay hint chip on the image
3. category/filter icons
4. clear hover/click modal detail
5. good alt text and searchable metadata

For now, the site keeps a smaller title below each image for clarity, plus an overlay hint. Later we can test an image-only mode where the title below is hidden and only the image + hint chip remains.

## Loading and pagination

Current simple strategy:

- render skeleton cards immediately while JSON loads
- lazy-load grid images
- use small WebP thumbnails in the grid
- load large images only when opening the modal
- keep motion videos as links so they do not load on the landing page
- use a `Load more` button after the first page instead of infinite scroll

This is simpler and faster than a heavy masonry library or infinite-scroll package.
