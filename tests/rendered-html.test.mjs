import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

test("defines the wedding invitation content", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  const source = `${page}\n${layout}`;

  assert.match(source, /Sama Matar & Hisham Daraghmeh/);
  assert.match(source, /10 October 2026/);
  assert.match(source, /Odeh Hotel,\s*Aida's Garden/);
  assert.match(source, /Will you be there\?/);
  assert.doesNotMatch(source, /codex-preview|Your site is taking shape/);
});

test("keeps production assets and storage wiring in place", async () => {
  const [page, layout, packageJson, hosting, migration] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_brave_lockheed.sql", import.meta.url), "utf8"),
  ]);

  assert.match(page, /\/api\/rsvp/);
  assert.match(page, /Open Map/);
  assert.match(layout, /\/og\.png/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(migration, /CREATE TABLE `rsvps`/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/couple-hero.jpg", import.meta.url)),
    access(new URL("../public/couple-arch.jpg", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  await assert.rejects(
    access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
});
