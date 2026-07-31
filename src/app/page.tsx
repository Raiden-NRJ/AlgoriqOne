import type { Metadata } from 'next';
import { SITE } from '@/content/site';
import { Hero } from '@/components/sections/hero';
import { ProofBand } from '@/components/sections/proof-band';
import { Chain } from '@/components/sections/chain';
import { Problem } from '@/components/sections/problem';
import { Thesis } from '@/components/sections/thesis';
import { Architecture } from '@/components/sections/architecture';
import { Clusters } from '@/components/sections/clusters';
import { Permissions } from '@/components/sections/permissions';
import { Capabilities } from '@/components/sections/capabilities';
import { Intelligence } from '@/components/sections/intelligence';
import { Devices } from '@/components/sections/devices';
import { Developers } from '@/components/sections/developers';
import { Security } from '@/components/sections/security';
import { Solutions } from '@/components/sections/solutions';
import { Testimonials } from '@/components/sections/testimonials';
import { Roi } from '@/components/sections/roi';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

/**
 * The homepage, in narrative order. Each section serves exactly one beat of the
 * nine-beat spine in website/docs/01 §8; a section that doesn't advance a beat
 * is cut rather than kept.
 *
 * Gated sections (ProofBand, Testimonials) read content/proof.ts and render an
 * honest alternative — or nothing — rather than fabricated social proof.
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
      {/* Beat 1 — the chain, named */}
      <Hero />
      <ProofBand />
      <Chain />

      {/* Beats 2–3 — where it breaks, and why it stayed broken */}
      <Problem />

      {/* Beat 4 — the claim */}
      <Thesis />

      {/* Beat 5 — proof: the modules behind each link */}
      <Clusters />
      <Architecture />

      {/* Beats 6–7 — proof: why the chain can be trusted */}
      <Permissions />

      {/* Beat 8 — proof of platform and trust */}
      <Capabilities />
      <Intelligence />
      <Devices />
      <Developers />
      <Security />
      <Solutions />
      <Testimonials />
      <Roi />
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
