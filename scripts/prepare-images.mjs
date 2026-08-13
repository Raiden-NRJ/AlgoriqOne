/**
 * Asset preparation for the photography and illustration sets.
 *
 * Both sets came out of the same image generator at exactly 1376×768, and both
 * carry the generator's watermark: a faint four-pointed sparkle in the
 * bottom-right, at a fixed offset from the corner. This script crops it off and
 * gives the photography set its published filenames.
 *
 * ── Why a crop rather than a paint-out ────────────────────────────────────
 * The mark sits on top of real subject matter (a shirt, a wall, a desk). Any
 * inpainting we could do here would invent pixels; a crop only discards them.
 * The mark is inset far enough from the corner that a ~10% crop of width and
 * height removes it with margin, which is cheap on a 1376px source that is
 * never rendered above ~700 CSS px.
 *
 * ── The measurement ───────────────────────────────────────────────────────
 * Not eyeballed. The mark is composited at an identical position in all 36
 * images, so averaging the corner region across the set cancels the
 * (uncorrelated) photographic content and leaves the (identical) overlay
 * standing proud. Thresholding that stack at mean + k·sd gives:
 *
 *   k = 3.0  →  x 1255–1301, y 648–693   the solid core of the sparkle
 *   k = 2.0  →  x 1216–1302, y 639–694   core plus its faint outer glow
 *
 * The crop clears the **glow**, not just the core: a faint smudge left behind
 * is still a visible remnant, and the whole point is that nothing of the mark
 * survives. Keeping x < 1216 does that with nothing to spare and nothing wasted.
 *
 * That costs 11.6% of width rather than the 8–10% first estimated — the extra
 * 1.6% is the glow, and it is the difference between "cropped" and "cropped
 * except for a smudge". `--sheet` re-renders the corners so this stays checkable
 * by eye rather than trusted.
 *
 * Height is cut by the same 11.6% so the output ratio (1216/679 = 1.7909)
 * tracks the source (1376/768 = 1.7917) to within 0.04% — `Illustration`'s
 * declared RATIO stays accurate and the reserved box still prevents layout
 * shift.
 *
 * ── sharp ─────────────────────────────────────────────────────────────────
 * Resolved from Next's own dependency tree rather than declared here: this is a
 * one-off asset tool run by hand, not part of `build`, and adding a 30MB native
 * dependency to the app's manifest for it would be the wrong trade. If sharp
 * ever stops shipping with Next, `npm i -D sharp` before running.
 *
 * Usage:
 *   node scripts/prepare-images.mjs --sheet     # inspect corners, write nothing
 *   node scripts/prepare-images.mjs --dry       # report the plan
 *   node scripts/prepare-images.mjs             # crop in place / to clean names
 */

import sharp from 'sharp';
import { readdirSync, existsSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SHEET = process.argv.includes('--sheet');
const DRY = process.argv.includes('--dry');

const SOURCE = { width: 1376, height: 768 };

/**
 * Measured bounding box of the generator's sparkle *including its outer glow*
 * (stack threshold k = 2.0). The solid core is the tighter x 1255–1301,
 * y 648–693; we crop against the glow, not the core.
 */
const WATERMARK = { x0: 1216, y0: 639, x1: 1302, y1: 694 };

/** The kept region. Anything at or beyond these bounds is discarded. */
const CROP = { left: 0, top: 0, width: 1216, height: 679 };

const HERO_DIR = 'public/hero';
const ILLUSTRATION_DIR = 'public/illustrations';

/**
 * Photography source → published name. Keyed on a distinctive prefix because
 * the generator's filenames contain a U+2026 ellipsis on the longer ones, which
 * is painful to match literally and easy to mistype.
 */
const HERO_NAMES = [
  ['Team_collaborating_in_office', 'home'],
  ['Salesperson_talking_on_phone_in', 'product-revenue'],
  ['Colleagues_discussing_timeline', 'product-delivery'],
  ['HR_professional_welcoming_new_hire', 'product-people'],
  ['Support_agent_laughing_at_desk', 'product-service'],
  ['Analyst_viewing_charts_on_screen', 'product-intelligence'],
  ['Engineer_standing_in_server_room', 'platform-architecture'],
  ['Person_customizing_software_on_l', 'platform-customization'],
  ['Person_sketching_process_flow', 'platform-workflows'],
  ['Professional_walking_and_glancin', 'platform-ai'],
  ['Person_approving_content_on_phone', 'platform-mobile'],
  ['Founder_showing_laptop_to_client', 'platform-white-label'],
  ['Professional_reviewing_monitor_a', 'security'],
  ['Admin_managing_security_at_laptop', 'security-permissions'],
  ['Compliance_officer_reviewing_report', 'security-compliance'],
  ['Engineer_checking_equipment_in_d', 'security-infrastructure'],
  ['Developer_typing_at_dual_monitors', 'developers'],
  ['Founder_relaxing_at_laptop', 'pricing'],
];

/* ─────────────────────────── Corner contact sheet ─────────────────────── */

async function sheet(dir, out) {
  const REGION = {
    left: SOURCE.width - 210,
    top: SOURCE.height - 190,
    width: 210,
    height: 190,
  };
  const COLS = 6;
  const files = readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

  const tiles = await Promise.all(
    files.map(async (f) => {
      const meta = await sharp(join(dir, f)).metadata();
      // Already-cropped files are shorter than the source; clamp so a re-run
      // of --sheet after a crop still renders instead of throwing.
      const region = {
        left: Math.max(0, meta.width - REGION.width),
        top: Math.max(0, meta.height - REGION.height),
        width: Math.min(REGION.width, meta.width),
        height: Math.min(REGION.height, meta.height),
      };
      return sharp(join(dir, f))
        .extract(region)
        .resize({ width: REGION.width, height: REGION.height })
        .extend({ top: 1, bottom: 1, left: 1, right: 1, background: '#ff0000' })
        .toBuffer();
    }),
  );

  const TW = REGION.width + 2;
  const TH = REGION.height + 2;
  const rows = Math.ceil(tiles.length / COLS);

  await sharp({
    create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#000' },
  })
    .composite(
      tiles.map((input, i) => ({
        input,
        left: (i % COLS) * TW,
        top: Math.floor(i / COLS) * TH,
      })),
    )
    .png()
    .toFile(out);

  console.log(`\n${dir} → ${out}  (${files.length} tiles, ${COLS} per row)`);
  files.forEach((f, i) => console.log(`  ${String(i + 1).padStart(2)}. ${f}`));
}

/* ──────────────────────────────── Cropping ────────────────────────────── */

function assertRemovesWatermark() {
  const keptRight = CROP.left + CROP.width;
  const keptBottom = CROP.top + CROP.height;
  const survivesX = WATERMARK.x0 < keptRight;
  const survivesY = WATERMARK.y0 < keptBottom;
  if (survivesX && survivesY) {
    throw new Error(
      `CROP keeps the watermark box (${JSON.stringify(WATERMARK)}). Refusing to run.`,
    );
  }
  const pctW = (((SOURCE.width - CROP.width) / SOURCE.width) * 100).toFixed(1);
  const pctH = (((SOURCE.height - CROP.height) / SOURCE.height) * 100).toFixed(1);
  console.log(
    `Crop ${SOURCE.width}×${SOURCE.height} → ${CROP.width}×${CROP.height} ` +
      `(−${pctW}% width, −${pctH}% height); watermark removed by the width cut.`,
  );
}

async function cropFile(src, dest) {
  const meta = await sharp(src).metadata();
  if (meta.width !== SOURCE.width || meta.height !== SOURCE.height) {
    return { skipped: `already ${meta.width}×${meta.height}` };
  }
  if (DRY) return { planned: true };
  const buf = await sharp(src)
    .extract(CROP)
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  // Write to a sibling temp file and rename over the target, rather than
  // opening `dest` directly. The illustrations are cropped *in place*, and on
  // Windows sharp's read handle on the source is still open when the write is
  // attempted — opening the same path for writing fails with EUNKNOWN. A
  // rename is also atomic, so a crash cannot leave a half-written asset behind.
  const { writeFileSync, renameSync } = await import('node:fs');
  const tmp = `${dest}.tmp`;
  writeFileSync(tmp, buf);
  renameSync(tmp, dest);
  return { bytes: buf.length };
}

async function prepareHero() {
  console.log(`\n── ${HERO_DIR} ─────────────────────────────────────────`);
  const files = readdirSync(HERO_DIR).filter((f) => /\.(jpe?g)$/i.test(f));
  const used = new Set();

  for (const [prefix, clean] of HERO_NAMES) {
    const src = files.find((f) => f.startsWith(prefix));
    if (!src) {
      console.log(`  MISSING  ${prefix}* → ${clean}.jpg`);
      continue;
    }
    used.add(src);
    const dest = join(HERO_DIR, `${clean}.jpg`);
    const res = await cropFile(join(HERO_DIR, src), dest);
    if (res.skipped) {
      console.log(`  skip     ${clean}.jpg (${res.skipped})`);
      continue;
    }
    if (DRY) {
      console.log(`  plan     ${src}  →  ${clean}.jpg`);
      continue;
    }
    unlinkSync(join(HERO_DIR, src)); // the generator name is not a published asset
    console.log(`  ok       ${clean}.jpg  (${(res.bytes / 1024).toFixed(0)} KB)`);
  }

  const orphans = files.filter((f) => !used.has(f));
  if (orphans.length) console.log(`  ${orphans.length} unmapped file(s): ${orphans.join(', ')}`);
}

async function prepareIllustrations() {
  console.log(`\n── ${ILLUSTRATION_DIR} ─────────────────────────────────`);
  for (const f of readdirSync(ILLUSTRATION_DIR).filter((x) => /\.(jpe?g)$/i.test(x))) {
    const p = join(ILLUSTRATION_DIR, f);
    const res = await cropFile(p, p); // in place: the names are already published
    if (res.skipped) console.log(`  skip     ${f} (${res.skipped})`);
    else if (DRY) console.log(`  plan     ${f} (crop in place)`);
    else console.log(`  ok       ${f}  (${(res.bytes / 1024).toFixed(0)} KB)`);
  }
}

/* ─────────────────────────────────  Main ──────────────────────────────── */

if (SHEET) {
  const out = process.env.SHEET_OUT ?? '.';
  mkdirSync(out, { recursive: true });
  if (existsSync(HERO_DIR)) await sheet(HERO_DIR, join(out, 'corners-hero.png'));
  if (existsSync(ILLUSTRATION_DIR)) await sheet(ILLUSTRATION_DIR, join(out, 'corners-illustrations.png'));
} else {
  assertRemovesWatermark();
  await prepareHero();
  await prepareIllustrations();
  console.log('\nDone.\n');
}
