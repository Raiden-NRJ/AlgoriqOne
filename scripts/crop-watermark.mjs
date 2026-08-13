/**
 * Crop the generator watermark off the photographic icon set.
 *
 * The source renders carry a small four-pointed sparkle in the bottom-right
 * corner. It is burned into the pixels, so the only fix is to cut it off.
 *
 * ── Why it reads from the originals ───────────────────────────────────────
 * Source is `public/images/<original-name>.jpeg`, destination is
 * `public/images/icons-photo/<short-name>.jpg`. Never in place: cropping a file
 * onto itself is destructive and not idempotent — run it twice and you have
 * cropped twice. Reading from a pristine original means this script can be
 * re-run any number of times and always produces the same output, and the
 * uncropped frame stays available if the crop ever needs revisiting.
 *
 * ── Why a corner crop rather than detection ───────────────────────────────
 * A brightness pass was tried first and rejected: it flagged 8,000–19,000
 * "bright" pixels per image, because these are photographs with genuine
 * highlights — window light, paper, laptop screens — and the mark is a small
 * translucent glyph that does not separate cleanly from them. A fixed crop of
 * the corner it always occupies is boring, verifiable by eye, and cannot
 * mistake a highlight for a watermark.
 *
 * The mark sits inside the bottom ~140px of a 1024px frame, so removing that
 * band clears it with margin. The five icons are additionally centred
 * horizontally to a square; the diagram keeps full width, which lands it at
 * 1024×880 (1.164) — near enough to the hero card's 960:820 (1.171) that
 * object-cover has almost nothing to trim.
 *
 * Usage: node scripts/crop-watermark.mjs [--check]
 *   --check  report what would be written, without writing.
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'public', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'icons-photo');

/** Height of the bottom band removed from every frame. */
const BAND = 144;

const JOBS = [
  { out: 'deal.jpg', src: 'Handshake_over_wooden_desk_202608111915.jpeg', square: true },
  { out: 'project.jpg', src: 'Project_folder_on_office_desk_202608111915.jpeg', square: true },
  { out: 'plan.jpg', src: 'Desk_planner_with_sticky_notes_202608111915.jpeg', square: true },
  { out: 'time.jpg', src: 'Wristwatch_near_laptop_on_desk_202608111915.jpeg', square: true },
  { out: 'invoice.jpg', src: 'Pen_resting_on_printed_invoice_202608111915.jpeg', square: true },
  { out: 'relationship-diagram.jpg', src: 'Desk_with_laptop_and_objects_202608111915.jpeg', square: false },
];

const check = process.argv.includes('--check');
if (!check) mkdirSync(OUT_DIR, { recursive: true });

let failed = 0;

for (const job of JOBS) {
  const src = path.join(SRC_DIR, job.src);
  if (!existsSync(src)) {
    console.error(`MISSING SOURCE  ${job.src}`);
    failed += 1;
    continue;
  }

  const { width, height } = await sharp(src).metadata();
  const cropH = height - BAND;
  // Square icons: centre horizontally on the remaining height.
  const cropW = job.square ? cropH : width;
  const left = Math.round((width - cropW) / 2);

  const region = { left, top: 0, width: cropW, height: cropH };
  const dest = path.join(OUT_DIR, job.out);

  console.log(
    `${check ? 'would write' : 'wrote     '} ${job.out.padEnd(26)} ` +
      `${width}x${height} → ${cropW}x${cropH}  (crop x${left} y0, dropped bottom ${BAND}px)`,
  );

  if (!check) {
    await sharp(src).extract(region).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
  }
}

if (failed) {
  console.error(`\n${failed} source file(s) missing — nothing written for those.`);
  process.exit(1);
}
console.log(`\n${JOBS.length} image(s) ${check ? 'checked' : 'cropped'}.`);
