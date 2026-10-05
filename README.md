# portfolio

Hamza Allam's video editing and UI design portfolio, hosted on Cloudflare Pages.

- `public/` – the static site (index.html, thanks.html); this is the build output directory
- `functions/api/contact.js` – Pages Function that handles the contact form at `/api/contact`
- `wrangler.jsonc` – Pages config, including the D1 binding for contact messages
- `migrations/` – database schema for the `portfolio-contact` D1 database

Every push to `main` redeploys automatically through Cloudflare Pages' Git integration.
