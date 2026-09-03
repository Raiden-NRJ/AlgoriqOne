import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { security } from '@/content/homepage';
import { COMPLIANCE_STATEMENT, CERTIFICATIONS, SECURITY_CONTROLS } from '@/content/proof';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { stagger } from '@/components/site/motion';

/**
 * §12 Security & trust — beat 8. One idea: you can get this through procurement.
 *
 * A teaser, not a summary. Until 2026-08-10 this section rendered all six
 * SECURITY_CONTROLS as cards under a headline that was word-for-word /security's
 * H1 — so "See the security controls" landed on the same six cards under the
 * same sentence, and the click bought nothing (audit B2.1, B2.4). It now shows
 * three area labels and routes; the mechanisms stay canonical on /security.
 *
 * The compliance line is deliberately precise, and no certification badge
 * renders unless an auditor's report is on file — see content/proof.ts and
 * docs/07 §1. This is the rule a CISO will check, and the one most vendors
 * quietly break. It is unchanged by the trim.
 */
export function Security() {
  const certified = CERTIFICATIONS.filter((c) => c.reportOnFile);

  /*
    Three of the six, resolved against SECURITY_CONTROLS rather than retyped —
    so an area renamed or removed in content/proof.ts cannot leave a stale label
    rendering here. The statements stay on /security; repeating them was the
    duplication B2.4 found.
  */
  const teasers = security.teaserAreas
    .map((area) => SECURITY_CONTROLS.find((control) => control.area === area))
    .filter((control) => control !== undefined);

  return (
    <Section tone="band" size="lg">
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow tone="band">{security.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(22ch,100%)]">{security.headline}</h2>
          <p className="text-body-lg max-w-[min(58ch,100%)] text-[var(--color-band-fg-muted)]">
            {security.sub}
          </p>
        </Reveal>

        {/* One observer on the grid, not one per teaser (deck slide 06). */}
        <Reveal>
          <ul className="grid gap-4 sm:grid-cols-3">
            {teasers.map((control, i) => (
              <li key={control.area} data-rise-item="" style={{ animationDelay: `${stagger(i)}ms` }}>
              <div className="flex h-full items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-band-border)] bg-[var(--color-band-surface)] px-5 py-8">
                <h3 className="text-h2 text-center text-[var(--color-band-fg)]">{control.area}</h3>
              </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4 text-center">
          {certified.length > 0 ? (
            <ul className="flex flex-wrap items-center justify-center gap-4">
              {certified.map((cert) => (
                // eslint-disable-next-line @next/next/no-img-element
                <li key={cert.name}>
                  <img src={cert.badge} alt={cert.name} className="h-12 w-auto" />
                </li>
              ))}
            </ul>
          ) : null}

          <p className="max-w-[min(68ch,100%)] text-sm leading-relaxed text-[var(--color-band-fg-muted)]">
            {COMPLIANCE_STATEMENT}
          </p>

          <Link
            href="/security"
            className="inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-link)] underline decoration-[var(--color-link)]/50 underline-offset-4 transition-colors hover:decoration-[var(--color-link-strong)]"
          >
            {security.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
