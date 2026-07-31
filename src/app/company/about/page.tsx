import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { PARENT, PLATFORM_FACTS, SITE } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Algoryq One',
  description:
    'Why we built one platform instead of integrating three, what we have shipped, and what we have deliberately not built yet.',
  alternates: { canonical: '/company/about' },
};

const PRINCIPLES = [
  {
    title: 'Deny by default',
    body: 'Every service checks a permission before it acts. A hidden button is not a security control, and we do not treat it as one.',
  },
  {
    title: 'No fabricated data',
    body: 'No invented customer logos, no testimonials we do not have, no certification we have not earned. Empty is better than false — including on this website.',
  },
  {
    title: 'Every mutation is auditable',
    body: 'Changes emit events into an append-only trail with per-field diffs. Reconstructing what happened should not require a database archaeologist.',
  },
  {
    title: 'No lock-in we cannot undo',
    body: 'No cloud SDK in application code, adapters selected by environment variable, export on every list, and a Compose stack that runs the whole platform on one machine.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We didn’t integrate three products. We built one."
        intro="Algoryq One started from a specific frustration: in services businesses, the commercial pipeline, the delivery organisation and the people data are the same problem, and every available answer treated them as three."
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-16">
          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Why this exists</h2>
            <div className="flex max-w-[min(68ch,100%)] flex-col gap-4 leading-relaxed text-[var(--color-fg-muted)]">
              <p>
                Suites solve the integration problem at the interface. They share a navigation bar and
                a login, then keep three permission models, three audit trails and three definitions
                of “customer” underneath. The reconciliation work never ends, because the screens
                were integrated and the data was not.
              </p>
              <p>
                So the constraint we set was awkward and, in hindsight, correct: no module ships
                unless it sits on the same authorization engine, emits into the same audit trail, and
                answers to the same API gateway as every other module. That made the first year
                slower and every year after it faster.
              </p>
              <p>
                It is also why this website spends so much time on permissions. It is not a feature
                we are proud of; it is the structural decision the rest of the platform depends on.
              </p>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Who builds it</h2>
            <div className="flex max-w-[min(68ch,100%)] flex-col gap-4 leading-relaxed text-[var(--color-fg-muted)]">
              <p>
                {SITE.name} is built by{' '}
                <a
                  href={PARENT.siteUrl}
                  className="font-medium text-[var(--color-brand-700)] underline underline-offset-4"
                >
                  {PARENT.name}
                </a>
                , an engineering company whose stated business is the AI platforms, cloud
                infrastructure and enterprise systems that other organisations run on.
              </p>
              <p>
                We mention it because it is the honest answer to a question every buyer of a
                thirty-service platform should ask, and few vendors answer plainly: who is going to
                be operating this in five years? {SITE.name} is not a product looking for a parent.
                It is what an infrastructure company built when it needed the deal-to-cash chain to
                work properly.
              </p>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">Where we are</h2>
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {PLATFORM_FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="flex flex-col gap-1">
                    <span className="text-3xl font-semibold tracking-[-0.03em]">{fact.value}</span>
                    <span className="text-sm leading-snug text-[var(--color-fg-muted)]">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="max-w-[min(68ch,100%)] text-sm leading-relaxed text-[var(--color-fg-subtle)]">
              We are early. There is no logo wall on this site because we have not earned one yet,
              and inventing one would contradict the second principle below on the day we published
              it.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">How we work</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle.title}
                  className="flex flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-e1)]"
                >
                  <h3 className="text-base font-semibold">{principle.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">What we have not built</h2>
            <div className="flex max-w-[min(68ch,100%)] flex-col gap-4 leading-relaxed text-[var(--color-fg-muted)]">
              <p>
                There is no payroll — it is compliance-heavy and jurisdiction-specific, and doing it
                badly would be worse than not doing it. There is no native mobile application; there
                is a fast web app that installs to a home screen. There is no app marketplace. Some
                event-driven workflow triggers are still being migrated onto the engine.
              </p>
              <p>
                We publish this list because the alternative is you finding it out after signing, and
                because a roadmap page that only lists strengths is not a roadmap.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Founding customers wanted."
        body="Early partners get implementation support and real influence over what gets built next, in exchange for being a public reference when it has earned it."
      />
    </>
  );
}
