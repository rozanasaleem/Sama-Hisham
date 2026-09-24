import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

test("defines the wedding invitation content", async () => {
  const [page, layout, guests] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/guests.ts", import.meta.url), "utf8"),
  ]);
  const source = `${page}\n${layout}\n${guests}`;

  assert.match(source, /Sama Matar & Hisham Daraghme/);
  assert.doesNotMatch(source, /Daraghmeh/);
  assert.match(source, /سما مطر وهشام دراغمة/);
  assert.match(source, /10 October 2026/);
  assert.match(source, /Odeh Hotel,\s*Aida's Garden/);
  assert.match(source, /Will you be there\?/);
  assert.match(source, /هل ستنضمون إلينا؟/);
  assert.match(source, /Our forever begins in/);
  assert.match(source, /A garden evening, softly unfolding/);
  assert.match(source, /Reception/);
  assert.match(source, /Grand entrance/);
  assert.match(source, /Party/);
  assert.match(source, /الدخول الكبير/);
  assert.match(source, /timeline-icon/);
  assert.match(source, /Date/);
  assert.match(source, /Location/);
  assert.match(source, /Time/);
  assert.match(source, /Adults only/);
  assert.match(source, /نوماً هنيئاً لأطفالكم/);
  assert.match(source, /guestName/);
  assert.match(source, /guestSlug/);
  assert.match(source, /plusOneName/);
  assert.match(source, /Mira Afaneh/);
  assert.match(source, /mira-afaneh/);
  assert.match(source, /personal invitation link/);
  assert.doesNotMatch(source, /Choose your name/);
  assert.match(source, /No attend/);
  assert.match(source, /monogram-mark\.png/);
  assert.match(source, /landing-video\.mp4/);
  assert.match(source, /hero-fallback\.jpg/);
  assert.match(source, /film-reel/);
  assert.match(source, /detailImages/);
  assert.match(source, /detail-bg/);
  assert.match(source, /detail-date\.jpg/);
  assert.match(source, /detail-location\.jpg/);
  assert.match(source, /detail-time\.jpg/);
  assert.match(source, /detail-adults\.jpg/);
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
  assert.match(migration, /`guest_name` text/);
  assert.match(migration, /`first_name` text NOT NULL/);
  assert.match(migration, /`last_name` text NOT NULL/);
  assert.match(migration, /`plus_one_name` text/);
  assert.doesNotMatch(migration, /`guests`|`contact`|`note`/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/couple-hero.jpg", import.meta.url)),
    access(new URL("../public/couple-arch.jpg", import.meta.url)),
    access(new URL("../public/couple-vertical.jpg", import.meta.url)),
    access(new URL("../public/couple-black-white.jpg", import.meta.url)),
    access(new URL("../public/detail-date.jpg", import.meta.url)),
    access(new URL("../public/detail-location.jpg", import.meta.url)),
    access(new URL("../public/detail-time.jpg", import.meta.url)),
    access(new URL("../public/detail-adults.jpg", import.meta.url)),
    access(new URL("../public/landing-video.mp4", import.meta.url)),
    access(new URL("../public/hero-fallback.jpg", import.meta.url)),
    access(new URL("../public/monogram-logo-transparent.png", import.meta.url)),
    access(new URL("../public/monogram-mark.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  await assert.rejects(
    access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
});
