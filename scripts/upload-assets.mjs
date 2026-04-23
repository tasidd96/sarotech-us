#!/usr/bin/env node
/**
 * One-shot migration script: uploads public/ binaries to Vercel Blob.
 *
 * Run with: node --env-file=.env.local scripts/upload-assets.mjs
 *
 * Requires: BLOB_READ_WRITE_TOKEN in env
 *
 * Uploads everything under the configured ROOTS (recursively) plus SINGLE_FILES
 * to Blob, preserving the directory structure relative to /public. So
 *   public/installation_guides/Decking Installation Guide.pdf
 * becomes
 *   https://<store>.public.blob.vercel-storage.com/installation_guides/Decking Installation Guide.pdf
 *
 * Safe to re-run; allowOverwrite is true and addRandomSuffix is false so the
 * same pathname maps to the same URL.
 */

import { put } from "@vercel/blob";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const ROOTS = [
  "installation_guides",
  "technical_sheets",
  "images/technical-drawings",
  "images/projects", // includes fuel_stations/ subdir via recursion
];

const SINGLE_FILES = ["SARO TECH - 2026 Corporate Presentation.pdf"];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "FATAL: BLOB_READ_WRITE_TOKEN not set. Run: npx vercel env pull .env.local"
    );
    process.exit(1);
  }

  const toUpload = [];

  for (const root of ROOTS) {
    const dir = path.join(PUBLIC_DIR, root);
    if (!fs.existsSync(dir)) {
      console.warn(`  skip (missing): ${root}`);
      continue;
    }
    for (const file of walk(dir)) {
      const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
      toUpload.push({ file, rel });
    }
  }

  for (const name of SINGLE_FILES) {
    const file = path.join(PUBLIC_DIR, name);
    if (fs.existsSync(file)) toUpload.push({ file, rel: name });
    else console.warn(`  skip (missing): ${name}`);
  }

  console.log(`Uploading ${toUpload.length} files to Vercel Blob...`);
  let baseUrl = null;
  let totalBytes = 0;

  for (const { file, rel } of toUpload) {
    const data = fs.readFileSync(file);
    totalBytes += data.byteLength;
    const result = await put(rel, data, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    if (!baseUrl) {
      // extract the base: everything before /<rel>
      const idx = result.url.indexOf("/" + rel.split("/")[0]);
      if (idx > 0) baseUrl = result.url.slice(0, idx);
    }
    console.log(`  ${rel}  →  ${(data.byteLength / 1024).toFixed(0)} KB`);
  }

  console.log(`\nDone. ${toUpload.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total.`);
  if (baseUrl) {
    console.log(`\nNEXT_PUBLIC_ASSET_BASE_URL=${baseUrl}`);
  }
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
