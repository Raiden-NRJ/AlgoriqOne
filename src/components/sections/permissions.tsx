import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { permissions } from '@/content/homepage';
import { Container, Eyebrow, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { PermissionMatrix } from '@/components/interactive/permission-matrix';

/**
 * §8 Permissions — the wedge. Rendered on a dark band: a deliberate tonal shift
 * that marks the serious part of the page (docs/04 §8). The site itself stays
 * light mode; this is a device, not a theme.
 */
export function Permissions() {
  return (
    <Section tone="band" size="lg">
      <Container width="wide" className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow tone="band">{permissions.eyebrow}</Eyebrow>
          <h2 className="text-display-2 max-w-[min(18ch,100%)]">{permissions.headline}</h2>
          <p className="text-body-lg max-w-[min(52ch,100%)] text-[var(--color-band-fg-muted)]">
            {permissions.sub}
          </p>

          <ul className="flex flex-col gap-3">
            {permissions.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                <Check
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-400)]"
                />
                <span className="text-[var(--color-band-fg)]">{point}</span>
              </li>
            ))}
          </ul>

          <p className="max-w-[min(52ch,100%)] rounded-[var(--radius-lg)] border border-[var(--color-band-border)] bg-[var(--color-band-surface)] p-4 text-sm leading-relaxed text-[var(--color-band-fg-muted)]">
            {permissions.note}
          </p>

          <Link
            href="/security/permissions"
            className="inline-flex min-h-6 w-fit items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-300)] underline decoration-[var(--color-brand-400)]/50 underline-offset-4 transition-colors hover:decoration-[var(--color-brand-300)]"
          >
            How authorization works
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>

        {/* min-w-0: the matrix table would otherwise contribute its full
            min-content width to the grid column (see developers.tsx). */}
        <Reveal delay={80} className="min-w-0">
          <PermissionMatrix />
        </Reveal>
      </Container>
    </Section>
  );
}
