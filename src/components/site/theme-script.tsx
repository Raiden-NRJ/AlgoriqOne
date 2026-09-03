import { THEME_INIT_SCRIPT } from './theme';

/**
 * The no-flash script tag. Server component — it must be in the HTML the
 * server sends, not something React adds later.
 *
 * ── Why a raw <script> and not next/script ────────────────────────────────
 *
 * `next/script` has no strategy that runs before first paint. `beforeInteractive`
 * is the closest and is still injected by the framework's own bootstrap, which
 * lands after the document has painted — so the flash it is meant to prevent
 * happens anyway. A plain synchronous <script> in <head> is the only thing the
 * parser will stop for.
 *
 * `dangerouslySetInnerHTML` is required to emit an inline script from JSX and
 * is safe here in the way that word is actually meant: the content is a
 * compile-time constant from `theme.ts` with no interpolation of anything a
 * request could influence. Nothing user-supplied reaches it.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
