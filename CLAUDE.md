# CLAUDE.md

Durable context for Claude sessions on the sarotech-us website. Checked into the repo so it travels across devices and sessions.

## Working with Talha

- **GitHub:** `tasidd96`. Email/config already set locally.
- **Git workflow:** short-lived branch → PR → merge → delete. Don't propose long-lived branches, complex rebase flows, or force-push workflows.
- **Plain language over jargon.** When a git flag or command needs explaining, describe the *effect* ("this makes future `git push` work without arguments") rather than the concept. Same rule for any tooling: explain what it gets the user, not what it is.
- **Sibling project:** `../brillion-studio-website` (separate repo `tasidd96/brillion-studio`). Sometimes useful for patterns but don't conflate the two.

## Project intent

E-commerce marketing site for Sarotech (US). Stack: Next.js 14 App Router, TypeScript, Tailwind, deployed on Vercel. Source of truth for products/inventory is **GoHighLevel (aka LeadConnector / HighLevel CRM)** — the site pulls product + price data from the HighLevel API v2 server-side.

Current state (as of 2026-04-21):
- Site layout, nav, branding, and product-page shell exist (see `src/app/products/`, `src/components/`).
- HighLevel inventory layer **scaffolded but not wired to the UI** — see `src/lib/highlevel.ts`, `src/lib/types.ts`, `src/lib/catalog.ts`.
- Next planned work: wire product pages to live HighLevel data, finalize build pipeline for Vercel deploy.

## HighLevel API integration

Env contract (see `.env.local.example` — `.env.local` is gitignored, never commit real tokens):

- `HIGHLEVEL_LOCATION_ID` — sub-account/location ID from the GHL URL or Settings → Business Profile
- `HIGHLEVEL_ACCESS_TOKEN` — Private Integration Token. Required scopes: `products.readonly`, `products/prices.readonly`
- `HIGHLEVEL_API_VERSION=2021-07-28` — pinned API version header

Auth approach is a Private Integration Token (PIT), not full OAuth — chosen because this is a single-location integration and PIT is far simpler. If multi-location support is needed later, revisit.

API calls are **server-side only** (Next.js server components or route handlers). The access token must never reach the browser.

## Commands

```
npm run dev     # local dev server on :3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # Next/ESLint
```

No test suite exists yet. When verifying UI changes, run `npm run dev` and check the relevant page in a browser — don't claim a UI change works based only on a successful `npm run build`.

## Conventions

- App Router under `src/app/`. Components under `src/components/` grouped by feature (`home/`, `products/`, `layout/`).
- Shared utilities and the HighLevel client live under `src/lib/`.
- Static product/display data (when not coming from HighLevel) under `src/data/`.
- Follow existing patterns before introducing new abstractions. If you're about to add a new directory or top-level pattern, pause and check whether an existing one fits.
