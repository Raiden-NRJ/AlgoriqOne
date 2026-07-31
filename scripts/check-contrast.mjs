/**
 * WCAG contrast verification for the token set.
 *
 * Converts oklch → sRGB → relative luminance and computes real contrast
 * ratios. This is the same approach the platform repo uses (and which caught a
 * genuine AA failure there) — colour is verified by arithmetic, never by eye.
 *
 * Usage: node scripts/check-contrast.mjs
 */

import { readFileSync } from 'node:fs';

/* ── oklch → sRGB ────────────────────────────────────────────────────────── */

function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, v));
  };

  return [gamma(r), gamma(g), gamma(bl)];
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg, bg) {
  const a = relativeLuminance(oklchToSrgb(...fg));
  const b = relativeLuminance(oklchToSrgb(...bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const hex = (oklch) =>
  '#' +
  oklchToSrgb(...oklch)
    .map((c) => Math.round(c * 255).toString(16).padStart(2, '0'))
    .join('');

/* ── The tokens, read from globals.css ───────────────────────────────────── */

/**
 * Parsed out of the stylesheet rather than mirrored by hand.
 *
 * This used to be a hand-copied table with a "must mirror globals.css" comment
 * on it, which is exactly as reliable as it sounds: during the Algoryq rebrand
 * the whole ramp was re-hued and this script cheerfully reported "all 26 pairs
 * meet target" — for the violet tokens that had just been deleted. A checker
 * that can pass against colours the site no longer ships is worse than none,
 * so it now reads the same file the browser does.
 */

const CSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

const DECLARED = new Map(
  [...CSS.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

/** Resolves `var(--color-x)` aliases down to a literal oklch() triple. */
function token(name, depth = 0) {
  const value = DECLARED.get(name);
  if (value === undefined) throw new Error(`--color-${name} is not declared in globals.css`);
  if (depth > 8) throw new Error(`--color-${name}: var() chain too deep (cycle?)`);

  const alias = value.match(/^var\(\s*--color-([a-z0-9-]+)\s*\)$/);
  if (alias) return token(alias[1], depth + 1);

  const oklch = value.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/,
  );
  if (!oklch) throw new Error(`--color-${name}: cannot parse "${value}" as a plain oklch() triple`);

  const [, l, c, h] = oklch;
  return [l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l), parseFloat(c), parseFloat(h)];
}

const T = {
  bg: token('bg'),
  bgSubtle: token('bg-subtle'),
  surface: token('surface'),
  border: token('border'),
  borderStrong: token('border-strong'),
  fg: token('fg'),
  fgMuted: token('fg-muted'),
  fgSubtle: token('fg-subtle'),

  band: token('band'),
  bandSurface: token('band-surface'),
  bandBorder: token('band-border'),
  bandFg: token('band-fg'),
  bandFgMuted: token('band-fg-muted'),

  brand50: token('brand-50'),
  brand300: token('brand-300'),
  brand400: token('brand-400'),
  brand600: token('brand-600'),
  brand700: token('brand-700'),
  brand800: token('brand-800'),
  // Not a token: the literal white we set on brand-filled buttons.
  white: [1, 0, 0],
  // Two greens: one dark enough for white surfaces, one light enough for the
  // dark band. A single value cannot clear 4.5:1 against both.
  success: token('success'),
  successOnBand: token('success-band'),
  danger: token('danger'),
  warning: token('warning'),
};

/**
 * Every pair the site actually renders. `min` is the ratio this pair must meet:
 * 7 for body text (our AAA commitment), 4.5 for all other text, 3 for
 * non-text boundaries such as focus rings.
 */
const PAIRS = [
  // Light surfaces
  ['fg on bg', T.fg, T.bg, 7],
  ['fg on bg-subtle', T.fg, T.bgSubtle, 7],
  ['fg-muted on bg', T.fgMuted, T.bg, 4.5],
  ['fg-muted on bg-subtle', T.fgMuted, T.bgSubtle, 4.5],
  ['fg-subtle on bg', T.fgSubtle, T.bg, 4.5],
  ['fg-subtle on bg-subtle', T.fgSubtle, T.bgSubtle, 4.5],
  ['brand-600 on bg', T.brand600, T.bg, 4.5],
  ['brand-700 on bg', T.brand700, T.bg, 4.5],
  ['brand-700 on bg-subtle', T.brand700, T.bgSubtle, 4.5],
  ['brand-800 on brand-50', T.brand800, T.brand50, 4.5],
  ['white on brand-600', T.white, T.brand600, 4.5],
  ['success on bg', T.success, T.bg, 4.5],
  ['danger on bg', T.danger, T.bg, 4.5],

  // Dark band
  ['band-fg on band', T.bandFg, T.band, 7],
  ['band-fg on band-surface', T.bandFg, T.bandSurface, 7],
  ['band-fg-muted on band', T.bandFgMuted, T.band, 4.5],
  ['band-fg-muted on band-surface', T.bandFgMuted, T.bandSurface, 4.5],
  ['brand-300 on band', T.brand300, T.band, 4.5],
  ['brand-300 on band-surface', T.brand300, T.bandSurface, 4.5],
  ['success-on-band on band-surface', T.successOnBand, T.bandSurface, 4.5],
  ['success-on-band on band', T.successOnBand, T.band, 4.5],
  ['white on brand-600 (band)', T.white, T.brand600, 4.5],

  // Non-text boundaries
  ['border-strong on bg', T.borderStrong, T.bg, 1.3],
  ['brand-600 ring on bg', T.brand600, T.bg, 3],
  ['brand-400 on band-surface', T.brand400, T.bandSurface, 3],
  ['band-border on band', T.bandBorder, T.band, 1.2],
];

let failed = 0;
console.log('  ratio   min   pair');
console.log('  ─────   ───   ────');

for (const [label, fg, bg, min] of PAIRS) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed += 1;
  console.log(
    `  ${ratio.toFixed(2).padStart(5)}   ${String(min).padStart(3)}   ${ok ? ' ' : '✗'} ${label}  (${hex(fg)} on ${hex(bg)})`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} contrast pair(s) below target.`);
  process.exit(1);
}
console.log(`\nAll ${PAIRS.length} pairs meet target.`);
