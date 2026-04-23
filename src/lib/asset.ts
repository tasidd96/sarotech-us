/**
 * Resolve a site-relative asset path to its absolute URL.
 *
 * When `NEXT_PUBLIC_ASSET_BASE_URL` is set (production and any env that has the
 * Blob store connected), paths get rewritten to the CDN:
 *   asset("/installation_guides/Decking Installation Guide.pdf")
 *   → "https://<store>.public.blob.vercel-storage.com/installation_guides/Decking Installation Guide.pdf"
 *
 * When the env var is unset (local dev without `vercel env pull`), the path is
 * returned unchanged so Next.js serves it from `/public` as usual.
 *
 * Use for anything that previously lived under `/public` and has since been
 * migrated to Vercel Blob: PDFs, isometric drawings, fuel-station photos,
 * corporate presentation.
 */
export function asset(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim() ?? "";
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!base) return normalized;
  const baseNoTrailing = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${baseNoTrailing}${normalized}`;
}
