import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COMPLIANCE_STATEMENT, CERTIFICATIONS, SECURITY_CONTROLS } from '@/content/proof';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §13 Security & trust — beat 8. One idea: you can get this through procurement.
 *
 * Each card states a mechanism, not an adjective. The compliance line is
 * deliberately precise, and no certification badge renders unless an auditor's
 * report is on file — see content/proof.ts and docs/07 §1. This is the rule
 * that a CISO will check, and the one most vendors quietly break.
 */
export function Security() {
  const certified = CERTIFICATIONS.filter((c) => c.reportOnFile);

  return (
    <Section tone="band">
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Eyebrow tone="band">Security & trust</Eyebrow>
          <h2 className="text-display-2 max-w-[min(22ch,100%)]">
            Security you can verify, not just read about.
          </h2>
          <p className="text-body-lg max-w-[min(58ch,100%)] text-[var(--color-band-fg-muted)]">
            Six control areas, stated as mechanisms. If you want the detail, it is published — no
            NDA required to read how the platform works.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_CONTROLS.map((control, i) => (
            <Reveal as="li" key={control.area} delay={i * 50}>
              <div className="flex h-full flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-band-border)] bg-[var(--color-band-surface)] p-5">
                <h3 className="text-sm font-semibold text-[var(--color-band-fg)]">
                  {control.area}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-band-fg-muted)]">
                  {control.statement}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

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
            className="inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-300)] underline decoration-[var(--color-brand-400)]/50 underline-offset-4 transition-colors hover:decoration-[var(--color-brand-300)]"
          >
            See the security controls
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
