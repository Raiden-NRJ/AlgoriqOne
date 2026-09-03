/**
 * The ground switch — shared vocabulary for the toggle and the blocking script.
 *
 * No imports, no JSX, no `'use client'`. Same construction as `motion.ts` and
 * for the same reason: both halves of the theme system need these constants,
 * and one half is a server component that renders into <head> while the other
 * is a client island. A module with a directive at the top could not be used by
 * both, and duplicating the storage key across them is how a toggle ends up
 * writing to one key and reading from another.
 *
 * The colour work itself is entirely in `globals.css` — see "HOW THE TWO
 * GROUNDS WORK" there. This file only decides *which* ground is active.
 */

/** Values of `data-theme` on <html>. There is no "system" value: see below. */
export type Theme = 'light' | 'dark';

/**
 * What the user explicitly chose, if anything. `'system'` is the absence of a
 * choice, and it is deliberately NOT a value the attribute ever takes.
 *
 * The distinction matters because the two are stored in different places: the
 * *preference* lives in localStorage and may be "no preference"; the *resolved
 * ground* lives on the attribute and is always one of two concrete values. If
 * `data-theme` could be "system", every CSS rule would need a third branch and
 * `prefers-color-scheme` would have to be consulted from CSS as well as from
 * JS — which is exactly the arrangement that makes OS-change tracking
 * unreliable, because the two can disagree.
 */
export type ThemePreference = Theme | 'system';

/**
 * localStorage key. Namespaced: the portal runs on a sibling host under the
 * same registrable domain, and an unprefixed `theme` is the single most likely
 * key to collide.
 */
export const THEME_STORAGE_KEY = 'algoryq-one:theme';

/** The ground a visitor gets when the OS expresses no opinion. */
export const DEFAULT_THEME: Theme = 'dark';

/**
 * The blocking script, as source text.
 *
 * ── Why this exists and why it is a string ────────────────────────────────
 *
 * It runs synchronously in <head>, before the browser paints anything, so the
 * document's very first frame is already on the right ground. Without it the
 * page paints with the CSS default (azure), then React hydrates and switches —
 * a white flash on every navigation for every light-mode visitor, which is the
 * defect this is specifically here to prevent. It cannot be a component,
 * because a component runs after hydration, which is the thing we are beating.
 *
 * Constraints it is written under, each of which has bitten someone:
 *
 *  · **Everything is in a try/catch.** `localStorage` *throws* on access —
 *    not returns null — in Safari private browsing and under a
 *    block-third-party-cookies policy in an iframe. An uncaught throw here is
 *    a script error before first paint, and the page renders on the default
 *    ground with no toggle behaviour at all.
 *  · **The inner try/catch is separate.** Only the storage read can throw for
 *    policy reasons; wrapping the whole body in one catch would silently skip
 *    the matchMedia fallback too, so a private-browsing visitor would lose OS
 *    detection as well as persistence.
 *  · **It sets `colorScheme` inline as well as the attribute.** The attribute
 *    drives our own tokens through CSS, but the stylesheet may not have
 *    arrived yet, and `color-scheme` is what the UA uses for the scrollbar,
 *    form controls and the canvas behind the page. Setting it here means even
 *    the scrollbar is correct in the first frame.
 *  · **It queries `light`, not `dark`.** `(prefers-color-scheme: dark)` and
 *    `(prefers-color-scheme: light)` are not complements: a UA that reports
 *    neither matches only the light query in practice, and the fallback we
 *    want in that case is DEFAULT_THEME. Asking for light and defaulting
 *    otherwise expresses that in one expression.
 *
 * Interpolated values are the two module constants above, so the script and
 * the island can never disagree about the key or the default.
 */
export const THEME_INIT_SCRIPT = `(function(){
try{
var k=${JSON.stringify(THEME_STORAGE_KEY)},s=null;
try{s=window.localStorage.getItem(k)}catch(e){}
var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':${JSON.stringify(DEFAULT_THEME)});
var r=document.documentElement;
r.setAttribute('data-theme',t);
r.style.colorScheme=t;
}catch(e){}
})();`;
