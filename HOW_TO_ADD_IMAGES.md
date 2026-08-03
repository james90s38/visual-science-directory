# How to add more infographic images

The site is intentionally simple. To add a new topic, you only need an optimized image and one JSON entry.

## 1. Put the image in assets

Recommended files:

- `assets/images/topic-name-thumb.webp` — small grid image, around 100–250 KB
- `assets/images/topic-name-large.webp` — modal/detail image, around 300–800 KB
- optional `assets/video/topic-name.mp4` — only if there is a motion-video version

Keep the same aspect ratio as the original infographic. Do not crop unless you intentionally want a cropped preview.

## 2. Add an entry to data/items.json

Copy this object, change the text, and add it to the JSON array:

```json
{
  "id": "why-onions-make-you-cry",
  "title": "Why onions make you cry",
  "question": "Why do onions sting your eyes?",
  "category": "Everyday Chemistry",
  "tags": ["Chemistry", "Biology"],
  "takeaway": "Cut onions release reactive sulfur compounds that irritate your eyes and trigger tears.",
  "mechanism": "Sulfur compounds form a gas that reacts with moisture near your eyes.",
  "fields": ["plant chemistry", "sensory biology"],
  "status": "Draft / approved / motion-video available",
  "description": "Short simple explanation for the detail modal.",
  "alt": "Infographic explaining why onions make you cry.",
  "images": {
    "thumb": "assets/images/onion-thumb.webp",
    "large": "assets/images/onion-large.webp"
  },
  "video": "assets/video/onion-motion.mp4"
}
```

If there is no video yet, remove the `video` line and the comma before it.

## 3. Commit and deploy

```bash
git add .
git commit -m "Add onion infographic"
git push
vercel --prod --yes
```

## Best workflow later

For many images, we should create a tiny script where you drop a PNG/JPG into a folder and it automatically creates the WebP thumbnail, large image, and starter JSON object.
