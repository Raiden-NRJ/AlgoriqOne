'use client';

/**
 * The ground toggle. Header chrome, on every route.
 *
 * A real <button> with a real `aria-label`, so it is reachable, operable and
 * announced without a single line of key handling — the site's standing
 * position on interactive controls (docs/13 §2). A div with an onClick would
 * need `role`, `tabIndex`, Enter and Space handlers, and would still not be
 * announced as a button by every AT.
 *
 * ── The state model, which is the only subtle part ────────────────────────
 *
 * There are two pieces of state and conflating them is the classic bug:
 *
 *   PREFERENCE  what the user chose — 'light', 'dark', or 'system' (never
 *               chosen). Lives in localStorage.
 *   GROUND      what is actually rendered — 'light' or 'dark'. Lives on
 *               <html data-theme>.
 *
 * A visitor who has never touched the toggle has preference 'system', and
 * their ground must keep following the OS *for as long as that is true* — the
 * brief's "keep listening for OS-level changes if the user hasn't manually
 * overridden it". So the matchMedia subscription is not a one-shot read at
 * mount; it is a live listener that is ignored the moment a preference exists.
 *
 * Clicking sets a concrete preference, which is what ends OS-following. There
 * is deliberately no third "system" position in the control: a three-state
 * toggle in a header is a usability tax, and the OS default is already the
 * behaviour on arrival. Clearing a preference is a browser-data action.
 *
 * ── Hydration ─────────────────────────────────────────────────────────────
 *
 * The server cannot know the ground — it depends on localStorage and an OS
 * setting — so this renders a stable, ground-agnostic shell on the server and
 * fills in the label and icon after mount. `mounted` is what gates that. The
 * button is present and correctly sized in the server HTML, so nothing shifts
 * when it resolves; only the glyph and the label change.
 */

import { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemePreference,
} from '@/components/site/theme';

/** How long `data-theme-switching` stays on <html>. Must match globals.css. */
const SWITCH_MS = 180;

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage can throw outright (Safari private mode, blocked storage in an
    // embedded context) rather than returning null. Treat it as no preference:
    // the toggle still works for the session, it just cannot remember.
  }
  return 'system';
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : DEFAULT_THEME;
}

/**
 * Writes the ground to the DOM.
 *
 * Both the attribute and the inline `color-scheme` are set, for the same
 * reason the blocking script sets both: the attribute drives our tokens, and
 * `color-scheme` drives the UA's own surfaces — scrollbars, form controls, the
 * canvas behind the document. The script sets the inline style on first paint,
 * so if this only set the attribute the two would disagree from the first
 * toggle onward and the scrollbar would stay on the old ground.
 *
 * `animate` gates the 180ms colour cross-fade defined in globals.css. It is
 * false when this runs for a reason the user did not initiate — mount, or the
 * OS flipping under us — because a transition is feedback for an action, and
 * cross-fading the entire page on arrival is just a slow paint.
 */
function applyTheme(theme: Theme, { animate }: { animate: boolean }) {
  const root = document.documentElement;

  if (animate) {
    root.setAttribute('data-theme-switching', '');
    window.setTimeout(() => root.removeAttribute('data-theme-switching'), SWITCH_MS);
  }

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // Resolve the real ground once we are in the browser. This deliberately
  // re-derives rather than reading the attribute the script wrote: the script
  // and this share `theme.ts`, so they agree by construction, and re-deriving
  // means the component is still correct if the script is ever absent.
  useEffect(() => {
    const preference = readPreference();
    setTheme(preference === 'system' ? systemTheme() : preference);
    setMounted(true);
  }, []);

  // OS tracking, live, and only while no explicit preference exists.
  //
  // The preference is re-read inside the handler rather than captured in the
  // dependency array on purpose: the listener must survive the user's first
  // click (which is what makes it stop mattering) without being torn down and
  // rebuilt, and re-reading is both cheaper and impossible to get out of sync.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');

    const onChange = (event: MediaQueryListEvent) => {
      if (readPreference() !== 'system') return;
      const next: Theme = event.matches ? 'light' : DEFAULT_THEME;
      setTheme(next);
      applyTheme(next, { animate: false });
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // See readPreference: the choice still applies for this page view.
      }
      applyTheme(next, { animate: true });
      return next;
    });
  }, []);

  /*
    The label names the DESTINATION, not the current state — "Switch to light
    mode" while dark is showing. Naming the current state ("Dark mode") makes
    the control ambiguous to a screen-reader user, who cannot see which way it
    is pointing and has to guess whether the button reports or acts.

    Before mount the label is the neutral "Switch colour theme": the server
    does not know the ground, and a label that says "Switch to light mode" in
    HTML that might be light already is worse than one that says less.

    aria-pressed is deliberately absent. This is not a two-state control in the
    toggle-button sense — pressing it does not "turn dark mode on", it moves
    between two equal grounds — and `aria-pressed` on a button whose label
    already changes double-announces the state.
  */
  const label = mounted
    ? theme === 'dark'
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    : 'Switch colour theme';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={[
        // size-9 clears the WCAG 2.2 target-size minimum (24px) with room to
        // spare, and matches the mobile menu button's optical weight.
        'inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
        'text-[var(--color-fg-muted)] transition-colors duration-[var(--duration-lift)]',
        'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]',
        className ?? '',
      ].join(' ')}
    >
      {/*
        Both glyphs are always in the DOM and swapped with `hidden`, rather
        than one being conditionally rendered. Two reasons: the button's box
        never changes size (no layout shift when the ground resolves after
        mount), and there is no icon mount/unmount for the reveal system to
        observe. `mounted` shows neither, so the server HTML and the first
        client render are byte-identical.

        aria-hidden on both: the accessible name is the button's aria-label,
        and an icon that also announced itself would double up.
      */}
      {/*
        Expressed as a class rather than the `hidden` attribute: lucide-react
        types its icons as `Omit<LucideProps, 'ref'>`, which does not carry the
        HTML global attributes, so `hidden={...}` is a type error (TS2322) and
        failed `next build`. Tailwind's `hidden` utility is `display: none`,
        i.e. exactly what the attribute resolves to — both glyphs stay in the
        DOM and the behaviour described above is unchanged.
      */}
      <Sun
        className={`size-4.5${!mounted || theme === 'light' ? ' hidden' : ''}`}
        aria-hidden
      />
      <Moon
        className={`size-4.5${!mounted || theme === 'dark' ? ' hidden' : ''}`}
        aria-hidden
      />
    </button>
  );
}
