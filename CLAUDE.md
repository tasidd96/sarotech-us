# CLAUDE.md

Durable context for Claude sessions on the sarotech-us website. Checked into the repo so it travels across devices and sessions.

## Working with Talha

- **GitHub:** `tasidd96`. Repo: `tasidd96/sarotech-us` (local dir is `sarotech-us-website`).
- **Git workflow:** short-lived branch → PR → merge → delete. No long-lived branches, no rebase, no force-push.
- **Plain language over jargon.** Explain effect, not concept.
- **No em dashes in generated copy.** When writing marketing/UI/commit prose, use commas, periods, middots, or sentence breaks. Em dashes in quoted or preserved source material are fine; this applies to anything Claude generates fresh.
- **Sibling project:** `../brillion-studio-website` (repo `tasidd96/brillion-studio`).
- **Dev server:** `npm run dev` on port 3001 (`npm run dev -- -p 3001`). PATH may need `/opt/homebrew/bin:$PATH` prefix.

## Project intent

E-commerce marketing site for Sarotech (US). Stack: Next.js 14 App Router, TypeScript, Tailwind, Vercel. Source of truth for products/inventory is **GoHighLevel (aka LeadConnector / HighLevel CRM)** — site pulls product + price data from the HighLevel API v2 server-side.

## Current build state (as of 2026-04-21)

Everything merged to `main` via PR from `feat/build-and-integration`.

### Pages built
- **`/`** — Homepage: hero, bestsellers carousel, Shop by Category (horizontal scroll carousel + 3 main cards with real photos), FeaturedProject ("Why SARO TECH?"), LocationsSection (full-width, column-swapped), ProjectGallery
- **`/products`** — Listing page: sidebar filters (animated drawer), category tabs (Interior/Exterior/Accessories), product type checkboxes (dynamic by category), color swatches, search, sort, per-page, pagination. Mobile accordion filter drawer. URL params: `?tab=` preselects category, `?q=` preselects search.
- **`/products/[productSlug]/[variantSlug]`** — Detail page: hero (image + swatches + specs), material calculator, info accordions + technical drawing + related products, FAQ + installation guide.

### Architecture notes
- `src/app/products/page.tsx` — **server component** wrapper; calls `getCatalog()`, passes products + URL params as props to `ProductsPageClient`
- `src/components/products/ProductsPageClient.tsx` — `"use client"` component with all filter/sort state
- `src/app/products/[productSlug]/[variantSlug]/page.tsx` — server component; calls `getCatalog()`
- `src/lib/catalog.ts` → `getCatalog()` — falls back to `src/data/products.ts` seed when HL env vars absent
- `src/lib/highlevel.ts` — HighLevel API client (server-only)
- `src/lib/slug.ts` — `slugify`, `productSlug`, `variantSlug`, `findVariant`, `findProductVariants`

### Container system (globals.css)
- `.container-std` — max-width 1200px, padding 1.5rem (Bestsellers, Footer, ProjectGallery, PopularProducts)
- `.container-lg` — max-width 1440px, padding 1.5rem (Nav, Products pages, Why SARO TECH, ShopByCategory)
- `.header-container-inner` — edge-to-edge with 5px margin (full-width nav feel)
- LocationsSection — full-width, zero padding (`.locations-container` overrides)

### Design decisions locked in
- Font: PasticheGrotesque (loaded via @font-face from `/fonts/`)
- Brand green: `#2D6A4F` (Tailwind: `saro-green`)
- Filter drawer: flex + inline `style={{ flexBasis }}` on aside — bypasses Tailwind cascade; CSS transitions on flex-basis + column-gap
- Nav items: staggered `fadeInDown` animation on page load (nth-child delays)
- Section headings: `font-semibold` — **no italic, no underline** (changed from sarotech.io original)
- Category cards (main 3): white pill label bottom-left (italic, `bg-white/95`, `rounded-[5px]`, `px-3 py-2`) — matches sarotech.io
- Product detail URL: `/products/[productSlug]/[variantSlug]` e.g. `/products/laminated-wall-panel/a02-natural-walnut`

### Pending / next session work
1. **HighLevel inventory** — backdate / log actual SKUs and quantities in HighLevel before going live. SKUs in seed data (`src/data/products.ts`) must match HL inventory SKUs for the overlay to work.
2. **Vercel deploy** — set env vars (`HIGHLEVEL_LOCATION_ID`, `HIGHLEVEL_ACCESS_TOKEN`, `HIGHLEVEL_API_VERSION=2021-07-28`) in Vercel dashboard.
3. **Contact page** (`/contact`) — referenced from the material calculator "GET A QUOTE" button (passes `?product=&variant=&boxes=` params).
4. **Remaining stub pages** — `/projects`, `/locations`, `/saro-rewards` are linked in nav but not yet built.
5. **Category carousel images** — only 8 real category images exist locally; rest reuse nearest match. Replace with product-specific shots when available.
6. **Color swatch filter** — sidebar color chips are UI-only; not wired to actual product filtering yet.

## HighLevel API integration

Env contract (`.env.local.example` — `.env.local` is gitignored, never commit real tokens):

- `HIGHLEVEL_LOCATION_ID` — sub-account/location ID from GHL URL or Settings → Business Profile
- `HIGHLEVEL_ACCESS_TOKEN` — Private Integration Token. Scopes: `products.readonly`, `products/prices.readonly`
- `HIGHLEVEL_API_VERSION=2021-07-28` — pinned version header

Auth: Private Integration Token (PIT), not OAuth — single-location, simpler. API calls **server-side only** — token never reaches browser.

## Commands

```
npm run dev -- -p 3001   # local dev (use PATH=/opt/homebrew/bin:$PATH prefix if npm not found)
npm run build            # production build (type-checks too)
npm run start            # serve production build
npm run lint             # ESLint
```

No test suite yet. Always verify UI with `npm run dev` + browser — don't rely on build passing alone.

## Conventions

- App Router: `src/app/`. Components: `src/components/` grouped by feature (`home/`, `products/`, `layout/`).
- Shared utils + HL client: `src/lib/`.
- Static seed data: `src/data/`.
- Category/product images: `public/images/categories/`, `public/images/products/`.
- Follow existing patterns before adding new directories or abstractions.
