import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { ThemeScript } from '@/components/site/theme-script';
import { SITE } from '@/content/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Metrics-matched fallback so the font swap causes zero layout shift.
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

/*
 * Both fields are ground-aware now.
 *
 * `colorScheme: 'light dark'` tells the UA the document supports either, which
 * is what makes the browser's own surfaces (scrollbars, form controls, the
 * canvas behind the page) legal to render on both. It was pinned to 'light'
 * under the single-ground rule and stayed there through the azure pass, which
 * meant that for a whole milestone the site rendered a dark page inside
 * light-coloured browser chrome. The concrete value is then narrowed to the
 * active ground by `color-scheme` in globals.css and by the blocking script.
 *
 * themeColor is media-scoped: it is what a mobile browser paints its address
 * bar with, and one value cannot serve both. The two are --color-bg's ends,
 * as literals because <meta> cannot read a custom property. They are the only
 * hardcoded colours left in the app shell, and they are pinned here rather
 * than in a component so there is exactly one place to update if the ground
 * moves. Keep them in step with --dk-bg / --lt-bg.
 */
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#12161f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      suppressHydrationWarning is required and is scoped to exactly the element
      that needs it. ThemeScript writes `data-theme` and an inline
      `color-scheme` onto <html> before React hydrates, so the client's first
      pass sees attributes the server never rendered. Without this React logs a
      hydration mismatch on every page load; with it, the warning is suppressed
      for this element's attributes only — children are unaffected, so a real
      mismatch anywhere inside still surfaces.

      It is NOT on <body>, deliberately. That is the usual copy-paste
      over-reach and it would blanket the whole tree.
    */
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/*
          First thing in <head>, ahead of the stylesheet link Next injects, so
          the ground is decided before there is anything to paint. See
          components/site/theme.ts for why this cannot be a component.
        */}
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-action)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-fg-inverse)]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
