import type { Metadata } from 'next';
import { SITE } from '@/content/site';
import { Hero } from '@/components/sections/hero';
import { Chain } from '@/components/sections/chain';
import { Problem } from '@/components/sections/problem';
import { Platform } from '@/components/sections/platform';
import { Permissions } from '@/components/sections/permissions';
import { Capabilities } from '@/components/sections/capabilities';
import { Intelligence } from '@/components/sections/intelligence';
import { Developers } from '@/components/sections/developers';
import { Security } from '@/components/sections/security';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

/**
 * The homepage, in narrative order. Each section serves exactly one beat of the
 * nine-beat spine in docs/01 §8; a section that doesn't advance a beat is cut
 * rather than kept.
 *
 * Gated sections (Testimonials) read content/proof.ts and render an honest
 * alternative — or nothing — rather than fabricated social proof.
 *
 * The §2 trust bar (docs/04 §2) was removed 2026-08-09 at the client's request,
 * and its component deleted. The homepage therefore carries no proof element
 * between the hero and the chain — if a logo wall is wanted later, it has to be
 * rebuilt. CUSTOMER_LOGOS / hasLogos in content/proof.ts are now unused but kept:
 * they are the gate that stops a thin or unapproved logo wall from shipping.
 *
 * ── Restructure, 2026-08-10 ────────────────────────────────────────────────
 * Sixteen rendered sections became twelve, at the client's request, to a
 * Zoho-style shape: fewer sections, one idea each, headers over paragraphs.
 *
 *   Thesis       → merged into Problem      (failures and their answer in one beat)
 *   Clusters     ┐
 *   Architecture ┘ merged into Platform     (both enumerated the same six clusters)
 *   Devices      → merged into Capabilities (became its fourth card)
 *   Solutions    → deleted                  (six links, no copy; all six are in
 *                                            the header mega-menu, the footer
 *                                            and /solutions)
 *
 * Then, 2026-08-10, twelve → eleven:
 *
 *   Roi          → moved to /pricing        (the consolidation calculator now
 *                                            sits between "What you can switch
 *                                            on" and the pricing FAQ, where the
 *                                            visitor already has a per-seat
 *                                            price in front of them. The island
 *                                            is unchanged and still shared with
 *                                            /roi, the full calculator.)
 *
 * **Every video was kept.** Hero, Problem, Intelligence and Developers each
 * host one, which made those four sections ineligible for removal or merging
 * away regardless of the section arithmetic. That constraint is the reason
 * Thesis folded into Problem rather than Problem folding into Chain, and the
 * reason Intelligence and Developers remain separate sections rather than
 * becoming cards alongside the others.
 *
 * Tone alternates on every boundary and the three structural pivots — Chain,
 * Permissions, Security — carry size="lg". Do not add a section without
 * checking both.
 */
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: SITE.description,
    url: SITE.url,
  };

  return (
    <>
      {/* Beat 1 — the promise, and the chain that delivers it */}
      <Hero />
      <Chain />

      {/* Beats 2–4 — where it breaks today, and what replaces it */}
      <Problem />

      {/* Beat 5 — proof: the modules behind each link, and what they sit on */}
      <Platform />

      {/* Beats 6–7 — proof: why the chain can be trusted */}
      <Permissions />

      {/* Beat 8 — proof of platform and trust */}
      <Capabilities />
      <Intelligence />
      <Developers />
      <Security />
      <Testimonials />
      <Faq />

      {/* Beat 9 — the ask */}
      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
