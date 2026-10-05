# portfolio

Zayd's video editing and UI design portfolio, hosted on Cloudflare Workers.

- `public/` – the static site (index.html, thanks.html)
- `src/worker.js` – handles the contact form at `/api/contact` and serves everything else from `public/`
- `wrangler.jsonc` – Worker config, including the D1 binding for contact messages
- `migrations/` – database schema for the `portfolio-contact` D1 database

Every push to `main` redeploys automatically through Cloudflare's Git integration.
