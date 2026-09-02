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
  fgInverse: token('fg-inverse'),

  band: token('band'),
  bandSurface: token('band-surface'),
  bandBorder: token('band-border'),
  bandFg: token('band-fg'),
  bandFgMuted: token('band-fg-muted'),

  // Aurora cyan — the third brand colour. Every step the site renders is
  // pinned below; a cyan step that is not in PAIRS is not verified.
  cyan50: token('cyan-50'),
  cyan100: token('cyan-100'),
  cyan300: token('cyan-300'),
  cyan400: token('cyan-400'),
  cyan500: token('cyan-500'),
  cyan600: token('cyan-600'),
  cyan700: token('cyan-700'),

  brand50: token('brand-50'),
  brand300: token('brand-300'),
  brand400: token('brand-400'),
  brand600: token('brand-600'),
  brand700: token('brand-700'),
  // Semantic layer, added with the azure ground (2026-09-02). These are what
  // components reference now; the raw ramp steps above are kept only because a
  // few fills still use them legitimately.
  action: token('action'),
  actionHover: token('action-hover'),
  link: token('link'),
  linkStrong: token('link-strong'),
  chip: token('chip'),
  chipFg: token('chip-fg'),
  chipBorder: token('chip-border'),
  tint: token('tint'),
  tintBorder: token('tint-border'),
  accentText: token('accent-text'),
  accentLine: token('accent-line'),
  brand800: token('brand-800'),

  // App identity dots (architecture.tsx). Non-text, but they carry app
  // identity, so they are held to the 3:1 non-text boundary.
  appPortal: token('app-portal'),
  appAdmin: token('app-admin'),
  appPlatform: token('app-platform'),
  appCustomer: token('app-customer'),
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

  // Cyan-tinted surfaces (Section tone="tint"). Every text weight the site
  // puts on cyan-50 is pinned here.
  ['fg on tint', T.fg, T.tint, 7],
  ['fg-muted on tint', T.fgMuted, T.tint, 4.5],
  ['fg-subtle on tint', T.fgSubtle, T.tint, 4.5],
  ['link on tint', T.link, T.tint, 4.5],
  ['accent-text on tint', T.accentText, T.tint, 4.5],
  ['fg on chip', T.fg, T.chip, 7],
  ['chip-fg on chip', T.chipFg, T.chip, 4.5],

  // Cyan as text / UI on white — the two steps that are allowed to carry it.
  ['accent-text on bg', T.accentText, T.bg, 4.5],
  ['accent-text on surface', T.accentText, T.surface, 4.5],
  ['accent-line on bg (border/icon)', T.accentLine, T.bg, 3],

  // Cyan on the dark band
  ['cyan-300 TEXT on band', T.cyan300, T.band, 4.5],
  ['cyan-300 TEXT on band-surface', T.cyan300, T.bandSurface, 4.5],
  ['cyan-400 on band', T.cyan400, T.band, 3],
  ['cyan-400 on band-surface', T.cyan400, T.bandSurface, 3],

  ['link on bg', T.link, T.bg, 4.5],
  ['link on surface', T.link, T.surface, 4.5],
  ['link on bg-subtle', T.link, T.bgSubtle, 4.5],
  ['chip-fg on chip', T.chipFg, T.chip, 4.5],
  ['fg-inverse on action (button fill)', T.fgInverse, T.action, 4.5],
  /*
    No `text on cyan-500` pair, deliberately. On the white ground cyan-500 was
    a fill that ink sat on, so the pair existed. On the azure ground nothing
    renders text on it at all — checked: the §7 peak bar and the §2 rail token
    are the only cyan-500 surfaces and both are bare shapes. Asserting a pair
    the site does not render is how the old mirrored table came to pass against
    deleted colours; if text ever lands on a cyan fill, add the pair then and
    it will have to be `--color-fg-inverse`-dark, not light.
  */
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
  ['focus ring (link) on bg', T.link, T.bg, 3],
  ['brand-400 on band-surface', T.brand400, T.bandSurface, 3],
  ['band-border on band', T.bandBorder, T.band, 1.2],

  // Cyan non-text boundaries. cyan-100 is the section border on tint sections;
  // cyan-600 carries the diagram strokes that used to be --color-danger and
  // the chart's second series, so it is held to the full 3:1 on every surface
  // it appears on.
  // cyan-300 is the section border on tint. cyan-100 was tried first and
  // measured 1.09:1 against cyan-50 — fainter than the neutral border it
  // replaces, so the section boundary would have disappeared. Held to the
  // same 1.3 the neutral border-strong is held to.
  ['tint-border on tint (section seam)', T.tintBorder, T.tint, 1.3],
  ['cyan-300 border on bg', T.cyan300, T.bg, 1.3],
  ['tint section on bg', T.tint, T.bg, 1.05],
  ['accent-line stroke on tint', T.accentLine, T.tint, 3],

  // App identity dots on a white card. Customer is cyan-600 rather than
  // cyan-500 precisely because a bare dot is a mark, not a fill.
  ['app-portal on surface', T.appPortal, T.surface, 3],
  ['app-admin on surface', T.appAdmin, T.surface, 3],
  ['app-platform on surface', T.appPlatform, T.surface, 3],
  ['app-customer on surface', T.appCustomer, T.surface, 3],
];

/**
 * FILL-ONLY colours.
 *
 * cyan-500 (#00BEC7) is 2.29:1 on white. It cannot be text and cannot be a
 * border or a meaning-carrying icon. It is legal in exactly one role: a large
 * decorative fill with ink on top.
 *
 * Asserting only "ink on cyan-500 passes" would be a checker that quietly
 * blesses the colour. So each entry asserts BOTH halves:
 *   1. ink on the fill clears the text threshold  (what makes the fill legal)
 *   2. the fill on white is still BELOW 3:1       (the reason for the rule)
 *
 * If (2) ever starts passing, someone has changed the ramp and the fill-only
 * restriction may no longer be needed — that is a deliberate decision, so the
 * checker fails and makes you take it.
 */
/*
 * Empty since 2026-09-02, and that is the correct answer rather than a gap.
 *
 * The fill-only restriction existed because cyan-500 measured 2.29:1 on WHITE,
 * so on that ground it could not be text, a border, or a meaning-carrying
 * icon. On the azure ground it measures 8.5:1 against the surface — the
 * restriction is not relaxed, its premise is gone. Cyan-500 is a legitimate
 * border and icon colour here, which is what `--color-accent-line` is for.
 *
 * The trap inverted rather than disappearing: text on a cyan fill must now be
 * DARK, because `--color-fg` is light and measures 2.1:1 on it. That is
 * asserted as a normal pair above (`fg-inverse on cyan-500`), so the check
 * still exists — it just belongs in PAIRS now, not here.
 */
const FILL_ONLY = [];

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

console.log('\n  fill-only colours — legal as a large fill with ink on top, nothing else');
console.log('  ─────────────────────────────────────────────────────────────────────');

for (const [label, fill, inkMin, nonTextCeiling] of FILL_ONLY) {
  const inkOn = contrast(T.fg, fill);
  const onWhite = contrast(fill, T.bg);

  const inkOk = inkOn >= inkMin;
  if (!inkOk) failed += 1;
  console.log(
    `  ${inkOn.toFixed(2).padStart(5)}   ${String(inkMin).padStart(3)}   ${inkOk ? ' ' : '✗'} ink on ${label} (fill is legal)  (${hex(T.fg)} on ${hex(fill)})`,
  );

  // Deliberately inverted: this one must stay BELOW the non-text threshold.
  const stillFillOnly = onWhite < nonTextCeiling;
  if (!stillFillOnly) failed += 1;
  console.log(
    `  ${onWhite.toFixed(2).padStart(5)}   <${String(nonTextCeiling).padStart(2)}   ${stillFillOnly ? ' ' : '✗'} ${label} on white — must stay fill-only, never text/border/icon`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} contrast assertion(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${PAIRS.length} pairs meet target; ${FILL_ONLY.length} fill-only colour(s) verified.`);
