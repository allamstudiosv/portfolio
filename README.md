# portfolio

Hamza Allam's video editing and UI design portfolio, hosted on Cloudflare Pages.

- `public/` – the static site; this is the build output directory
  - `index.html` (English) and `ar/index.html` (Arabic, right-to-left), plus a thanks page for each
  - `assets/content.js` – videos and UI projects in both languages; edit this to add work
  - `assets/site.css`, `assets/site.js` – shared styles and rendering for both languages
- `functions/api/contact.js` – Pages Function that handles the contact form at `/api/contact`
- `wrangler.jsonc` – Pages config, including the D1 binding for contact messages
- `migrations/` – database schema for the `portfolio-contact` D1 database

Every push to `main` redeploys automatically through Cloudflare Pages' Git integration.
