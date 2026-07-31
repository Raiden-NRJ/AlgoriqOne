import { TESTIMONIALS, hasTestimonials } from '@/content/proof';
import { Container, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §15 Testimonials — GATED (docs/04 §15).
 *
 * Renders nothing at all until three approved, attributable testimonials exist
 * in content/proof.ts. No skeleton, no "coming soon", no invented quotes. The
 * component is complete and tested so the first real testimonial is a content
 * change rather than an engineering task.
 */
export function Testimonials() {
  if (!hasTestimonials()) return null;

  const approved = TESTIMONIALS.filter((t) => t.approved);

  return (
    <Section tone="subtle">
      <Container width="wide" className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="In their words"
            title="What teams say after they consolidate."
          />
        </Reveal>

        <ul className="grid gap-5 lg:grid-cols-3">
          {approved.map((item, i) => (
            <Reveal as="li" key={item.name} delay={i * 60}>
              <figure className="flex h-full flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)]">
                <blockquote className="text-sm leading-relaxed text-[var(--color-fg)]">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5 border-t border-[var(--color-border)] pt-4">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-[var(--color-fg-muted)]">
                    {item.role}, {item.company}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
