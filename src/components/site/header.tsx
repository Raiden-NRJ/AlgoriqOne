'use client';

/**
 * Site header. Client component because it owns the mega-menu disclosure and
 * the mobile sheet — both need state and keyboard handling (docs/03 §3.1,
 * docs/13 §2). Every link is in the DOM for crawlers regardless of menu state.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAV } from '@/content/site';
import { Button, cn, Container } from './primitives';
import { Logo } from './logo';

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

/**
 * Routes whose hero runs full-bleed video *behind* the header, so the header
 * renders transparent over it until the first scroll.
 *
 * A list, not a `pathname === '/'` check, because the condition is "this page
 * has a video hero", not "this page is the homepage" — and the two will stop
 * being the same the moment a second one gets one. The hero on such a route
 * must pull itself up by --header-h; see hero.tsx.
 */
const OVERLAY_HEADER_ROUTES = ['/'];

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes whatever is open; focus returns to the trigger naturally
  // because the trigger is never removed from the DOM.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close the mega-menu when focus or pointer leaves the nav entirely.
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const schedule = useCallback((value: string | null, delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenMenu(value), delay);
  }, []);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  /*
   * Overlay mode: transparent header sitting on the hero video.
   *
   * Only at the top of an overlay route — the moment you scroll, `scrolled`
   * takes over and the normal solid header returns. That is deliberate rather
   * than staying transparent for the hero's full height: past the fold the
   * header is over ordinary light sections, where light-on-light nav links
   * would be unreadable, and tying the swap to scroll keeps one trigger for
   * both instead of a second observer that could disagree with it.
   *
   * No background of its own: the hero's flat scrim is already behind it and
   * is what the nav's contrast was measured against. Adding a second veil here
   * would darken the strip under the header relative to the rest of the hero,
   * which is exactly the visible seam this change is meant to remove.
   */
  const overlay = OVERLAY_HEADER_ROUTES.includes(pathname) && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-cross-fade)]',
        scrolled
          ? 'border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_85%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent',
        overlay ? 'bg-transparent' : !scrolled && 'bg-[var(--color-bg)]',
      )}
    >
      {/* Brand accent bar — from the Figma cover (node 3:3). */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-linear-to-r from-[var(--color-brand-600)] via-[var(--color-brand-400)] to-[var(--color-cyan-500)]"
      />

      <Container width="wide">
        <div ref={navRef} className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="shrink-0 rounded-[var(--radius-md)]" aria-label="Algoryq One home">
            <Logo size="sm" tone={overlay ? 'band' : 'default'} />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((group) => {
                const hasMenu = Boolean(group.links?.length);
                const isOpen = openMenu === group.label;

                if (!hasMenu) {
                  return (
                    <li key={group.label}>
                      <Link
                        href={group.href ?? '#'}
                        className={cn(
                          'rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                          overlay
                            ? 'text-[var(--color-band-fg)] hover:text-white'
                            : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
                        )}
                      >
                        {group.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={group.label}
                    className="relative"
                    onMouseEnter={() => schedule(group.label, OPEN_DELAY)}
                    onMouseLeave={() => schedule(null, CLOSE_DELAY)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`menu-${group.label}`}
                      onClick={() => {
                        cancel();
                        setOpenMenu(isOpen ? null : group.label);
                      }}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                        overlay
                          ? 'text-[var(--color-band-fg)] hover:text-white'
                          : isOpen
                            ? 'text-[var(--color-fg)]'
                            : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
                      )}
                    >
                      {group.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 transition-transform duration-[var(--duration-lift)]',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <div
                      id={`menu-${group.label}`}
                      hidden={!isOpen}
                      className="absolute left-0 top-full w-[30rem] pt-3"
                    >
                      <ul className="grid grid-cols-2 gap-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-e3)]">
                        {group.links?.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setOpenMenu(null)}
                              className="block rounded-[var(--radius-md)] p-3 transition-colors hover:bg-[var(--color-bg-subtle)]"
                            >
                              <span className="block text-sm font-medium text-[var(--color-fg)]">
                                {link.label}
                              </span>
                              {link.description ? (
                                <span className="mt-0.5 block text-xs leading-relaxed text-[var(--color-fg-muted)]">
                                  {link.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button href="/login" variant={overlay ? 'ghostOnBand' : 'ghost'}>
              Sign in
            </Button>
            <Button href="/signup">Start free</Button>
          </div>

          <button
            type="button"
            className={cn(
              'rounded-[var(--radius-md)] p-2 lg:hidden',
              overlay ? 'text-[var(--color-band-fg)]' : 'text-[var(--color-fg)]',
            )}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </Container>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-[4.25rem] z-50 overflow-y-auto border-t border-[var(--color-border)] bg-[var(--color-bg)] lg:hidden"
      >
        <Container className="flex flex-col gap-8 py-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-[var(--radius-md)] p-2 text-[var(--color-fg-muted)]"
            >
              <span className="sr-only">Close menu</span>
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-6">
            {NAV.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <p className="text-label text-[var(--color-fg-subtle)]">{group.label}</p>
                {group.links ? (
                  <ul className="flex flex-col gap-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-base font-medium text-[var(--color-fg)]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link
                    href={group.href ?? '#'}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1 text-base font-medium text-[var(--color-fg)]"
                  >
                    Go to {group.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-6">
            <Button href="/signup" size="lg">
              Start free
            </Button>
            <Button href="/login" variant="secondary" size="lg">
              Sign in
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
