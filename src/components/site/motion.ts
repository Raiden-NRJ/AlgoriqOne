/**
 * Motion constants — the TS half of the M5 motion system.
 *
 * Server-safe by design, and that is the whole reason this file exists rather
 * than living in reveal.tsx. `reveal.tsx` opens with 'use client', which makes
 * every one of its exports a client binding — so a *pure function* exported
 * from it cannot be called during server render. Every section on this site is
 * a server component, so `delay={stagger(i)}` failed the prerender with
 * "Attempted to call stagger() from the server but stagger is on the client".
 * Typecheck passes either way; only `next build` catches it.
 *
 * The CSS half is in globals.css (--stagger-tight / --stagger-wide). These are
 * duplicated here because `delay` is a number of milliseconds and a component
 * cannot read a custom property. **The two must move together** — CSS is
 * authoritative for anything a stylesheet applies, this file for anything a
 * component computes.
 *
 * Redlines and provenance: docs/ANIMATION_SPEC_FROM_VIDEO.md.
 */

/**
 * Hard cap on staggered children, from the deck's Stagger row: "cap 6".
 *
 * `index * step` grows without bound, so a tenth child waits 630ms after the
 * first and the group stops reading as one gesture — it becomes a queue. Past
 * the sixth child the delay holds.
 *
 * Every staggered list on the site is currently under six items, so this is
 * latent. It is enforced now *because* it is latent: the rule is invisible
 * until someone adds a seventh card, and at that point nothing would tell them.
 */
export const STAGGER_CAP = 6;

/**
 * The two steps in the deck's 60–80ms band. There is no third value — a
 * stagger outside this band is drift, which is how the site arrived at
 * 50/60/70/80/260ms before this pass.
 *
 * TIGHT is the default and covers P2 Chain, P3 Problem, P4 Platform and
 * P7 Intelligence. WIDE is for the beats with fewer children to get through —
 * P1 Hero and P5 Capabilities — where the slower cadence still resolves fast
 * enough.
 */
export const STAGGER_TIGHT = 70;
export const STAGGER_WIDE = 80;

/** Delay for the nth staggered child, capped at STAGGER_CAP. */
export function stagger(
  index: number,
  step: typeof STAGGER_TIGHT | typeof STAGGER_WIDE = STAGGER_TIGHT,
): number {
  return Math.min(index, STAGGER_CAP - 1) * step;
}

/* ──────────────────── The framer mirror ─────────────────────────────────
 *
 * framer-motion takes numbers in **seconds** and a four-number cubic-bezier
 * array. It cannot read a CSS custom property, so the islands that use it were
 * each carrying their own copy of `0.2` and `[0.16, 1, 0.3, 1]` — five literal
 * pairs across three files, which is precisely the drift `stagger()` was
 * introduced to stop on the delay side.
 *
 * These are that same mirror, in one place. **globals.css is still
 * authoritative** — these exist because framer cannot reach it, not because
 * there are two sources of truth. Change a `--duration-*` token and change the
 * matching constant here in the same edit.
 *
 * Written as `MS / 1000` rather than as a decimal so the millisecond value —
 * the one the deck actually redlines — is the number a reader sees.
 */
const MS = 1000;

/** cubic-bezier(0.16, 1, 0.3, 1) — mirrors `--ease-out-quint`. */
export const EASE_OUT_QUINT = [0.16, 1, 0.3, 1] as const;

/** 320ms — mirrors `--duration-rise`. */
export const DURATION_RISE_S = 320 / MS;
/** 200ms — mirrors `--duration-cross-fade`. */
export const DURATION_CROSS_FADE_S = 200 / MS;
/** 120ms — mirrors `--duration-lift`. */
export const DURATION_LIFT_S = 120 / MS;
/** 240ms — mirrors `--duration-indicator` (M6 slide 08, "TABS indicator"). */
export const DURATION_INDICATOR_S = 240 / MS;

/** Stagger delay for the nth child, in seconds, for a framer `transition`. */
export function staggerS(
  index: number,
  step: typeof STAGGER_TIGHT | typeof STAGGER_WIDE = STAGGER_TIGHT,
): number {
  return stagger(index, step) / MS;
}
