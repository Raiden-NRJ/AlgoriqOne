/**
 * WCAG contrast verification for the token set, on BOTH grounds.
 *
 * Converts oklch → sRGB → relative luminance and computes real contrast
 * ratios. This is the same approach the platform repo uses (and which caught a
 * genuine AA failure there) — colour is verified by arithmetic, never by eye.
 *
 * ── What changed on 2026-09-03, and why it matters ────────────────────────
 *
 * The site now ships two grounds (globals.css, "HOW THE TWO GROUNDS WORK").
 * A checker that resolves `--color-fg` to one value would verify exactly half
 * the product and report a clean run for the half it never looked at — which
 * is the same failure mode as the hand-mirrored table this script replaced in
 * August, just with a different cause. So:
 *
 *   · The pair list is written ONCE, in semantic-role terms, and RUN TWICE —
 *     once with the semantic layer resolved against `--dk-*`, once against
 *     `--lt-*`. A pair cannot be asserted on one ground only.
 *   · Comments are stripped before parsing. The old regex read commented-out
 *     declarations as real ones, which is why globals.css carried a warning
 *     about writing example values with arrows instead of colons. That warning
 *     is no longer load-bearing, but the arrows are harmless, so it stands.
 *   · The two light-activation blocks (attribute + media query) are checked
 *     for parity. They are the one unavoidable duplication in the stylesheet
 *     and this is what stops them drifting.
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
 * so it reads the same file the browser does.
 */

const CSS_RAW = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

/** Comments out, before anything else looks at the text. */
const CSS = CSS_RAW.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Returns the body of the block whose header matches `needle`, by counting
 * braces rather than by regex — the media block has a nested rule in it, and a
 * non-greedy `{...}` match would stop at the inner closing brace.
 */
function block(needle, { from = 0 } = {}) {
  const at = CSS.indexOf(needle, from);
  if (at === -1) throw new Error(`globals.css: could not find the block "${needle}"`);
  const open = CSS.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < CSS.length; i += 1) {
    if (CSS[i] === '{') depth += 1;
    else if (CSS[i] === '}') {
      depth -= 1;
      if (depth === 0) return { body: CSS.slice(open + 1, i), end: i };
    }
  }
  throw new Error(`globals.css: unbalanced braces after "${needle}"`);
}

/** Every `--name: value;` in a chunk of CSS, as a Map. */
function declarations(css) {
  return new Map(
    [...css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ]),
  );
}

const THEME = declarations(block('@theme').body);

const LIGHT_ATTR_BLOCK = block(":root[data-theme='light']");
const LIGHT_ATTR = declarations(LIGHT_ATTR_BLOCK.body);

/* The media-query fallback holds one nested rule; take the inner one. */
const LIGHT_MEDIA_OUTER = block('@media (prefers-color-scheme: light)');
const LIGHT_MEDIA = declarations(LIGHT_MEDIA_OUTER.body);

/**
 * Resolves a custom property to a literal oklch() triple, following `var()`
 * aliases through the palettes and the ramps.
 *
 * `overrides` is the active ground's override map — empty for the azure ground
 * (the @theme defaults already point at `--dk-*`), the light activation block
 * for the light one. Lookups fall through to @theme, which is what lets a
 * light alias land on an unswitched ramp step: `--color-diagram-ink` →
 * `--lt-diagram-ink` → `--color-brand-700` → a literal.
 */
function resolve(name, overrides, depth = 0) {
  const value = overrides.get(name) ?? THEME.get(name);
  if (value === undefined) throw new Error(`${name} is not declared in globals.css`);
  if (depth > 10) throw new Error(`${name}: var() chain too deep (cycle?)`);

  const alias = value.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/);
  if (alias) return resolve(alias[1], overrides, depth + 1);

  const oklch = value.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!oklch) throw new Error(`${name}: cannot parse "${value}" as a plain oklch() triple`);

  const [, l, c, h] = oklch;
  return [l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l), parseFloat(c), parseFloat(h)];
}

/** The two grounds, as `role → oklch` lookups. */
const GROUNDS = [
  { name: 'azure (dark)', overrides: new Map() },
  { name: 'light', overrides: LIGHT_ATTR },
];

/**
 * Every pair the site actually renders, in semantic-role terms.
 *
 * `min` is the ratio the pair must meet on EVERY ground: 7 for body text (our
 * AAA commitment), 4.5 for all other text, 3 for meaning-carrying non-text
 * (icons, focus rings, identity dots), and below 3 only for pure texture —
 * a section seam or a decorative rule, which is never the sole carrier of
 * anything and is listed with the reason inline.
 *
 * A role named here is resolved per ground, so one row is two assertions.
 */
const PAIRS = [
  /* ── Body copy on the three page surfaces ─────────────────────────────── */
  ['fg on bg', 'fg', 'bg', 7],
  ['fg on bg-subtle', 'fg', 'bg-subtle', 7],
  ['fg on surface', 'fg', 'surface', 7],
  ['fg-muted on bg', 'fg-muted', 'bg', 4.5],
  ['fg-muted on bg-subtle', 'fg-muted', 'bg-subtle', 4.5],
  ['fg-muted on surface', 'fg-muted', 'surface', 4.5],
  ['fg-subtle on bg', 'fg-subtle', 'bg', 4.5],
  ['fg-subtle on bg-subtle', 'fg-subtle', 'bg-subtle', 4.5],
  ['fg-subtle on surface', 'fg-subtle', 'surface', 4.5],

  /* Placeholders. Held to full text contrast: the site never uses a
     placeholder as a label, but a 3:1 placeholder is unreadable regardless. */
  ['placeholder on bg', 'placeholder', 'bg', 4.5],
  ['placeholder on surface', 'placeholder', 'surface', 4.5],

  /* ── Links and actions ────────────────────────────────────────────────── */
  ['link on bg', 'link', 'bg', 4.5],
  ['link on bg-subtle', 'link', 'bg-subtle', 4.5],
  ['link on surface', 'link', 'surface', 4.5],
  ['link-strong (hover) on bg', 'link-strong', 'bg', 4.5],
  ['link-strong (hover) on surface', 'link-strong', 'surface', 4.5],
  /* The button fill. fg-inverse is LIGHT on both grounds — see the palette
     note; the action is brand-600 either way, because the ramp does not
     switch. This is the pair that catches anyone "fixing" that. */
  ['fg-inverse on action (button fill)', 'fg-inverse', 'action', 4.5],
  ['fg-inverse on action-hover', 'fg-inverse', 'action-hover', 4.5],

  /* ── Chips and soft brand panels ──────────────────────────────────────── */
  ['chip-fg on chip', 'chip-fg', 'chip', 4.5],
  ['fg on chip', 'fg', 'chip', 4.5],

  /* ── Tint sections (Section tone="tint") ──────────────────────────────── */
  ['fg on tint', 'fg', 'tint', 7],
  ['fg-muted on tint', 'fg-muted', 'tint', 4.5],
  ['fg-subtle on tint', 'fg-subtle', 'tint', 4.5],
  ['link on tint', 'link', 'tint', 4.5],
  ['accent-text on tint', 'accent-text', 'tint', 4.5],

  /* ── Cyan by ROLE, not by ramp step. Which step backs each of these is the
        active ground's business; the obligation is the same on both. ─────── */
  ['accent-text on bg', 'accent-text', 'bg', 4.5],
  ['accent-text on surface', 'accent-text', 'surface', 4.5],
  ['accent-text on bg-subtle', 'accent-text', 'bg-subtle', 4.5],
  ['accent-line (border/icon) on bg', 'accent-line', 'bg', 3],
  ['accent-line (border/icon) on surface', 'accent-line', 'surface', 3],
  ['accent-line on tint', 'accent-line', 'tint', 3],
  /* The fill and what may sit on it. This is the pair that replaces the old
     FILL_ONLY machinery: rather than pinning cyan-500 as never-text, the fill
     now names its own foreground, and that foreground is ink on the light
     ground and ink on the dark one — because the fill is light on both. */
  ['accent-fill-fg on accent-fill', 'accent-fill-fg', 'accent-fill', 4.5],

  /* ── Diagram vocabulary ───────────────────────────────────────────────── */
  ['diagram-ink on diagram-fill', 'diagram-ink', 'diagram-fill', 4.5],
  ['diagram-ink on diagram-fill-strong', 'diagram-ink', 'diagram-fill-strong', 4.5],
  ['diagram-ink stroke on bg', 'diagram-ink', 'bg', 3],
  ['diagram-ink stroke on surface', 'diagram-ink', 'surface', 3],
  ['diagram-accent on bg', 'diagram-accent', 'bg', 3],
  ['diagram-accent on surface', 'diagram-accent', 'surface', 3],
  /* Texture, not meaning: a soft rule and a panel wash. Both are held above
     "visible at all" rather than to 3:1, and neither ever carries information
     on its own — every diagram fill has a label or an adjacent stroke. */
  ['diagram-line (soft rule) on bg', 'diagram-line', 'bg', 1.25],
  ['diagram-line on surface', 'diagram-line', 'surface', 1.25],
  ['diagram-fill on surface', 'diagram-fill', 'surface', 1.05],
  ['diagram-fill-strong vs diagram-fill', 'diagram-fill-strong', 'diagram-fill', 1.15],

  /* ── The band. Dark on BOTH grounds — only its depth changes — so these
        rows assert the same design on two different slabs. ───────────────── */
  ['band-fg on band', 'band-fg', 'band', 7],
  ['band-fg on band-surface', 'band-fg', 'band-surface', 7],
  ['band-fg-muted on band', 'band-fg-muted', 'band', 4.5],
  ['band-fg-muted on band-surface', 'band-fg-muted', 'band-surface', 4.5],
  /* The band's own link colour. `--color-link` is NOT usable here: on the
     light ground it is brand-600, which measures ~2.3:1 on a neutral-950 slab.
     That break is the reason band-link exists, and this is its guard. */
  ['band-link on band', 'band-link', 'band', 4.5],
  ['band-link on band-surface', 'band-link', 'band-surface', 4.5],
  ['band-accent-text on band', 'band-accent-text', 'band', 4.5],
  ['band-accent-text on band-surface', 'band-accent-text', 'band-surface', 4.5],
  ['band-accent (icon) on band', 'band-accent', 'band', 3],
  ['band-accent (icon) on band-surface', 'band-accent', 'band-surface', 3],
  ['success-band on band', 'success-band', 'band', 4.5],
  ['success-band on band-surface', 'success-band', 'band-surface', 4.5],
  ['fg-inverse on action, over band', 'fg-inverse', 'action', 4.5],

  /* ── Media: the mat behind footage and code panels. Fixed on both grounds
        (a terminal is a dark artefact on any page), so these two rows verify
        the same numbers twice — cheap, and it means a future "let's make the
        code panel light" cannot land unmeasured. ─────────────────────────── */
  ['media-fg on media', 'media-fg', 'media', 7],
  ['media-fg-muted on media (code rows)', 'media-fg-muted', 'media', 4.5],
  ['band-link on media', 'band-link', 'media', 4.5],

  /* ── Functional colours (quarantined; see globals.css) ────────────────── */
  ['success on bg', 'success', 'bg', 4.5],
  ['success on surface', 'success', 'surface', 4.5],
  ['danger on bg', 'danger', 'bg', 4.5],
  ['danger on surface', 'danger', 'surface', 4.5],
  ['warning on bg', 'warning', 'bg', 4.5],
  ['warning on surface', 'warning', 'surface', 4.5],

  /* ── Focus ring. WCAG 2.4.13. Judged against the PAGE, not the control:
        the ring is drawn at outline-offset 2px, which puts it on the ground —
        necessarily, since on the light ground the ring and the primary action
        are the same blue. ──────────────────────────────────────────────────*/
  ['focus ring on bg', 'focus', 'bg', 3],
  ['focus ring on bg-subtle', 'focus', 'bg-subtle', 3],
  ['focus ring on surface', 'focus', 'surface', 3],
  ['focus ring on tint', 'focus', 'tint', 3],
  /* Inside a band section the ring re-points to `--color-band-link` — the band
     is dark on both grounds and the page's ring is brand-600 on the light one,
     which measures 2.52:1 on a neutral-950 slab. That is a keyboard user
     losing the focus indicator entirely on the Permissions and Security
     sections, so the override is a fix and not a nicety; it is the
     `[data-tone='band']` rule in globals.css. Asserted here against both
     band surfaces. */
  ['band focus ring on band', 'band-link', 'band', 3],
  ['band focus ring on band-surface', 'band-link', 'band-surface', 3],

  /* ── App identity dots. 8px fills, so 3:1 — and each is paired with its app
        name in text, so colour is never the sole carrier (WCAG 1.4.1). ───── */
  ['app-portal on surface', 'app-portal', 'surface', 3],
  ['app-admin on surface', 'app-admin', 'surface', 3],
  ['app-platform on surface', 'app-platform', 'surface', 3],
  ['app-customer on surface', 'app-customer', 'surface', 3],
  ['app-portal on bg-subtle', 'app-portal', 'bg-subtle', 3],
  ['app-admin on bg-subtle', 'app-admin', 'bg-subtle', 3],
  ['app-platform on bg-subtle', 'app-platform', 'bg-subtle', 3],
  ['app-customer on bg-subtle', 'app-customer', 'bg-subtle', 3],

  /* ── Boundaries and seams. Below 3:1 on purpose — a hairline between two
        surfaces is texture. The floor is "distinguishable at all", which is
        what catches a border that vanishes on the ground it was not designed
        for: the rgba-white-on-white case in the brief. ───────────────────── */
  ['border on surface', 'border', 'surface', 1.15],
  ['border on bg', 'border', 'bg', 1.15],
  ['border-strong on bg', 'border-strong', 'bg', 1.3],
  ['border-strong on surface', 'border-strong', 'surface', 1.3],
  ['chip-border on chip', 'chip-border', 'chip', 1.15],
  ['tint-border on tint (section seam)', 'tint-border', 'tint', 1.3],
  ['tint section on bg', 'tint', 'bg', 1.03],
  ['bg-subtle band on bg', 'bg-subtle', 'bg', 1.03],
  /*
    There is deliberately NO `surface on bg` row.

    On the light ground the two are both white and measure 1.00 — a card is
    separated from the page by its BORDER, which is what `border on surface`
    and `border on bg` above assert. On the azure ground they cannot be equal
    (a card matching the ground disappears between its own hairlines) and the
    palette lifts surface to 0.19 against a 0.16 bg.

    So the invariant is "a card is distinguishable by its surface OR its
    border", and only the border half is universally true. A row asserting the
    surface half would have to be written per-ground, which is precisely the
    kind of one-ground assertion this rewrite exists to eliminate. Asserting it
    anyway, and then loosening the threshold until white-on-white passed, would
    have produced a row that can never fail — worse than none.
  */
  ['band-border on band', 'band-border', 'band', 1.2],
  /* 1.06, not 1.1: on the light ground the band is a neutral-950 well and its
     raised card is 0.205 L, which is a 1.08 step. That is the original design
     and it is legible because the card also draws a band-border at 1.42 — the
     seam is the border's job here, same as on the page ground above. */
  ['band-surface on band', 'band-surface', 'band', 1.06],
  ['media-border on media', 'media-border', 'media', 1.2],
];

/* ── Run ─────────────────────────────────────────────────────────────────── */

let failed = 0;

for (const ground of GROUNDS) {
  console.log(`\n  GROUND: ${ground.name}`);
  console.log('  ratio   min   pair');
  console.log('  ─────   ───   ────');

  for (const [label, fgRole, bgRole, min] of PAIRS) {
    const fg = resolve(`--color-${fgRole}`, ground.overrides);
    const bg = resolve(`--color-${bgRole}`, ground.overrides);
    const ratio = contrast(fg, bg);
    const ok = ratio >= min;
    if (!ok) failed += 1;
    console.log(
      `  ${ratio.toFixed(2).padStart(5)}   ${String(min).padStart(3)}   ${ok ? ' ' : '✗'} ${label}  (${hex(fg)} on ${hex(bg)})`,
    );
  }
}

/* ── Parity: the light palette is activated twice and must not drift ─────── */

console.log('\n  light activation blocks — attribute vs. prefers-color-scheme');
console.log('  ───────────────────────────────────────────────────────────');

const attrKeys = [...LIGHT_ATTR.keys()].sort();
const mediaKeys = [...LIGHT_MEDIA.keys()].sort();

const missingFromMedia = attrKeys.filter((k) => !LIGHT_MEDIA.has(k));
const missingFromAttr = mediaKeys.filter((k) => !LIGHT_ATTR.has(k));
const mismatched = attrKeys.filter(
  (k) => LIGHT_MEDIA.has(k) && LIGHT_MEDIA.get(k) !== LIGHT_ATTR.get(k),
);

for (const k of missingFromMedia) {
  failed += 1;
  console.log(`  ✗ ${k} is in :root[data-theme='light'] but not in the media fallback`);
}
for (const k of missingFromAttr) {
  failed += 1;
  console.log(`  ✗ ${k} is in the media fallback but not in :root[data-theme='light']`);
}
for (const k of mismatched) {
  failed += 1;
  console.log(
    `  ✗ ${k} differs: "${LIGHT_ATTR.get(k)}" vs "${LIGHT_MEDIA.get(k)}"`,
  );
}
if (failed === 0) {
  console.log(`    ${attrKeys.length} declarations, identical in both blocks`);
}

/* ── Completeness: every semantic role must exist on both grounds ────────── */

/**
 * Catches the other half of the drift problem: a role added to @theme (so the
 * azure ground gets it) and never given an `--lt-*` value, which would leave
 * the light ground silently inheriting an azure colour. The pair list above
 * cannot catch that on its own — it would just measure the azure value twice
 * and pass.
 */
const SEMANTIC_SKIP = new Set([
  // Fixed by design — declared once, identical on both grounds. See globals.css.
  '--color-media',
  '--color-media-border',
  '--color-media-fg',
  '--color-media-fg-muted',
  '--color-success-band',
]);

const semanticRoles = [...THEME.keys()].filter(
  (k) =>
    k.startsWith('--color-') &&
    /^var\(\s*--dk-/.test(THEME.get(k) ?? '') === false &&
    !SEMANTIC_SKIP.has(k) &&
    // The ramps are absolute and correctly do not switch.
    !/^--color-(brand|neutral|cyan)-/.test(k),
);

console.log('\n  semantic roles present on both grounds');
console.log('  ─────────────────────────────────────');
const unswitched = semanticRoles.filter((k) => !LIGHT_ATTR.has(k));
for (const k of unswitched) {
  failed += 1;
  console.log(`  ✗ ${k} has no light-ground value — it will inherit the azure one`);
}
if (unswitched.length === 0) {
  const switched = [...THEME.keys()].filter((k) => /^var\(\s*--dk-/.test(THEME.get(k) ?? ''));
  console.log(`    ${switched.length} switched roles, ${SEMANTIC_SKIP.size} fixed by design`);
}

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log(
  `\nAll ${PAIRS.length} pairs meet target on both grounds (${PAIRS.length * GROUNDS.length} assertions).`,
);
