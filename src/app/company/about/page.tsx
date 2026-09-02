import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { BulletList, Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { PARENT, PLATFORM_FACTS, SITE } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Algoryq One',
  description:
    'Why we built one platform instead of integrating three, what we have shipped, and what we have deliberately not built yet.',
  alternates: { canonical: '/company/about' },
};

/**
 * Hoisted out of PRINCIPLES because the caveat above the grid names it in
 * prose. It used to say "the second principle below" — a positional reference
 * into a two-column grid, where "second" is ambiguous and wrong the moment the
 * array is reordered (audit B7). Both places now read the same object.
 */
const NO_FABRICATED_DATA = {
  title: 'No fabricated data',
  body: 'No invented customer logos, no testimonials we do not have, no certification we have not earned. Empty is better than false — including on this website.',
};

const PRINCIPLES = [
  {
    title: 'Deny by default',
    body: 'Every service checks a permission before it acts. A hidden button is not a security control, and we do not treat it as one.',
  },
  NO_FABRICATED_DATA,
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
        <Container width="wide" className="flex flex-col gap-12">
          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Why this exists</h2>
            <p className="max-w-[min(52ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              Suites integrate the screens and leave the data alone.
            </p>
            <BulletList
              items={[
                'A shared navigation bar and one login, on top',
                'Three permission models, three audit trails underneath',
                'Three different definitions of “customer”',
                'Reconciliation work that never ends',
              ]}
            />
            <p className="max-w-[min(52ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              So we set one awkward constraint. No module ships unless it:
            </p>
            <BulletList
              items={[
                'Sits on the same authorization engine',
                'Emits into the same append-only audit trail',
                'Answers to the same API gateway',
              ]}
            />
            <p className="max-w-[min(62ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              That made the first year slower and every year after it faster. It is also why this
              site spends so much time on permissions — not a feature we are proud of, but the
              structural decision everything else depends on.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <h2 className="text-h2">Who builds it</h2>
            <div className="flex max-w-[min(68ch,100%)] flex-col gap-4 leading-relaxed text-[var(--color-fg-muted)]">
              <p>
                {SITE.name} is built by{' '}
                <a
                  href={PARENT.siteUrl}
                  className="font-medium text-[var(--color-link)] underline underline-offset-4"
                >
                  {PARENT.name}
                </a>
                , an engineering company whose stated business is the AI platforms, cloud
                infrastructure and enterprise systems that other organisations run on.
              </p>
              <p>
                Every buyer of a thirty-service platform should ask who will be operating it in five
                years. {SITE.name} is not a product looking for a parent — it is what an
                infrastructure company built when it needed the deal-to-cash chain to work properly.
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
            {/*
              KEPT, against audit B7's original recommendation — deliberately.

              B7 proposed cutting this as a duplicate of the homepage ProofBand,
              which carried the same "we are early / no logo wall" caveat under
              the same PLATFORM_FACTS row. That component was deleted on
              2026-08-09 at the client's request (see the note in app/page.tsx),
              so there is no longer a duplicate: this is the only place on the
              site that explains the absent logo wall. Cutting it now would
              remove an honesty statement rather than a repetition, which rule 1
              does not allow. Revisit only if a proof band returns.

              The positional reference *was* the real bug and is fixed: "the
              second principle below" is ambiguous in a 2-column grid and wrong
              the moment PRINCIPLES is reordered. It now names the principle and
              reads the same object the grid renders, so the two cannot drift.
            */}
            <p className="max-w-[min(68ch,100%)] text-sm leading-relaxed text-[var(--color-fg-subtle)]">
              We are early. There is no logo wall on this site because we have not earned one yet,
              and inventing one would contradict “{NO_FABRICATED_DATA.title}” below on the day we
              published it.
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
            {/*
              The payroll line here read "There is no payroll" until 2026-08-10.
              That was stale and, worse, contradicted two other surfaces: the
              owner confirmed the module on 2026-07-31 and both `pages-solutions`
              (`by-role/hr → payroll`) and the homepage integration diagram were
              corrected then — this page was missed, so the site simultaneously
              claimed payroll shipped and did not. The live caveat is
              jurisdiction coverage, not existence; it now matches
              pages-solutions.ts, and the two must move together.
            */}
            <BulletList
              items={[
                'No native mobile app — a PWA that installs to a home screen',
                'No public app marketplace or connector directory',
                'Payroll ships, but jurisdiction coverage is limited — ask first',
                'Some event-driven workflow triggers still moving onto the engine',
                'No SOC 2 or ISO certification; the architecture is ready, the audit is not done',
              ]}
            />
            <p className="max-w-[min(62ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
              A roadmap page that only lists strengths is not a roadmap. The alternative to
              publishing this is you finding it out after signing.
            </p>
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
