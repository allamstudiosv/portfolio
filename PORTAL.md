# Project portal

The bilingual portal lives at `/portal/` and `/ar/portal/`. Public pages contain no customer data; authenticated requests go to `/api/portal` and use the existing `DB` binding.

## Access

- Administrators see all briefs, assign projects, issue client codes, and create or reset employee invitations.
- Employees see briefs and publish progress only for projects currently assigned to them. Assignment is checked on the server for both reads and writes.
- Clients use a private, randomly generated project code. They see their project's title, stage, percentage, target date, and client-facing update history only. They cannot see briefs, contact details, employee accounts, or other projects.
- All progress notes are client-facing; there is no private/internal notes feature.
- New briefs are stored together with an initial project record in a D1 transaction. No client code is issued automatically. An administrator shares one privately when the project is accepted.

## Deployment

Apply `migrations/0002_project_briefs.sql`, then `migrations/0003_project_portal.sql` to `portfolio-contact` before enabling submission. They add tables without modifying existing contact messages. Both migrations can be rerun.

Bootstrap the initial administrator through an authenticated D1 administrator connection: generate a cryptographically random 24-byte activation token, insert the email, role `admin`, SHA-256 token hash and a seven-day expiry into `portal_users`. Share `/ar/portal/#invite=<token>` through a private local file, never source control. The recipient chooses their own password. No password or raw token is stored in the database. Subsequent employee accounts are invited from the portal. Reissuing an employee invitation resets their password and sessions. An administrator recovery invitation must be issued through the trusted D1 administration connection.

Passwords use PBKDF2-HMAC-SHA512 with a unique random salt and 100,000 iterations, within the Workers Web Crypto iteration cap. Sign-in is rate limited. Passwords require 12–128 characters. Authenticated sessions are random, hashed in D1, expire in eight hours, and use Secure, HttpOnly, SameSite=Strict cookies. Invitations expire after seven days and are single use. Replacing a client code invalidates its old sessions. Deactivating an employee invalidates their sessions. APIs return no-store responses. Project code holders have access to that project's public updates, so share codes only with the intended client.

Email and Notion delivery remain unconfigured. The portal and D1 are the active destination for briefs; the existing contact form is separate.

## Local validation

Use the installed Wrangler version, apply the two migrations locally, and run `npx wrangler pages dev`. Check both languages at desktop and phone widths. `scripts/test-portal.cjs` runs the API integration checks against its own local D1 state and local server, with synthetic accounts and briefs. It never targets production.
