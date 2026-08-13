import type { Metadata } from 'next';
import { Check, Plus } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { BulletList, Button, Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { Illustration } from '@/components/site/illustration';
import { RoiTeaser } from '@/components/interactive/roi-teaser';
import { getPlans, formatPrice } from '@/lib/billing';
import { CALCULATOR, CAPABILITY_GROUPS, INCLUDED_EVERYWHERE, PRICING_FAQS } from '@/content/pricing';

export const metadata: Metadata = {
  title: 'Pricing — no feature held hostage to a higher tier',
  description:
    'SSO, audit logs, the full API and the complete permission model are included everywhere. Turn modules on per tenant. Export your data whenever you want it.',
  alternates: { canonical: '/pricing' },
};

// Plans are read at request time and revalidated; the page must still render
// perfectly when the billing service is unreachable (docs/08 §1).
export const revalidate = 300;

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Pricing that doesn’t punish you for consolidating."
        intro="Per seat, with modules you switch on as you need them. Security features are not an upsell, your clients are not seats, and your data is exportable on the day you decide to leave."
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-12">
          {plans.length > 0 ? (
            <Reveal>
              <ul className="grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                  <li key={plan.id}>
                    <div
                      className={`flex h-full flex-col gap-5 rounded-[var(--radius-xl)] border p-6 ${
                        plan.isPopular
                          ? 'border-[var(--color-brand-400)] bg-[var(--color-surface)] shadow-[var(--shadow-e3)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e1)]'
                      }`}
                    >
                      {plan.isPopular ? (
                        <span className="w-fit rounded-full bg-[var(--color-brand-600)] px-2.5 py-0.5 text-xs font-semibold text-white">
                          Most popular
                        </span>
                      ) : null}
                      <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold">{plan.name}</h2>
                        {plan.description ? (
                          <p className="text-sm text-[var(--color-fg-muted)]">{plan.description}</p>
                        ) : null}
                      </div>
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-semibold tracking-[-0.03em]">
                          {formatPrice(plan)}
                        </span>
                        <span className="text-sm text-[var(--color-fg-subtle)]">
                          per seat / {plan.interval}
                        </span>
                      </p>
                      {plan.features?.length ? (
                        <ul className="flex flex-col gap-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <Check
                                aria-hidden
                                className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]"
                              />
                              <span className="text-[var(--color-fg-muted)]">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-auto pt-2">
                        <Button
                          href="/signup"
                          variant={plan.isPopular ? 'primary' : 'secondary'}
                          className="w-full"
                        >
                          Start free
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : (
            <Reveal>
              <div className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8">
                <h2 className="text-h2">Per-seat pricing, quoted properly.</h2>
                <BulletList
                  items={[
                    'Plan prices come straight from our billing system',
                    'They cannot drift from what you would be charged',
                    'The service is not answering right now',
                    'We would rather show nothing than a number this page invented',
                    'Send your team size and modules — you get a real figure the same day',
                  ]}
                />
                <div className="flex flex-wrap gap-3">
                  <Button href="/company/contact">Get a quote</Button>
                  <Button href="/roi" variant="secondary">
                    Estimate the consolidation saving
                  </Button>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">In every plan</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED_EVERYWHERE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed"
                >
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-600)]" />
                  <span className="text-[var(--color-fg-muted)]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="max-w-[min(68ch,100%)] text-sm text-[var(--color-fg-subtle)]">
              Holding single sign-on or audit logs behind an enterprise tier makes a platform less
              safe for the customers least able to afford it. We decided not to do that.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-h2">What you can switch on</h2>
              <p className="max-w-[min(52ch,100%)] text-[var(--color-fg-muted)]">
                Licensed per tenant. Start with two clusters, add the rest as you grow into them.
              </p>
            </div>
            <Illustration
              src="/illustrations/pricing.jpg"
              alt="The six module clusters — Revenue, Delivery, People, Service, Intelligence and Platform — each shown as a labelled switch that a tenant can turn on independently."
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="max-w-[46rem]"
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITY_GROUPS.map((group) => (
                <li
                  key={group.group}
                  className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <h3 className="text-sm font-semibold">{group.group}</h3>
                  <ul className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <li key={item.capability} className="text-sm leading-relaxed">
                        <span className="text-[var(--color-fg-muted)]">{item.capability}</span>
                        {item.note ? (
                          <span className="mt-0.5 block text-xs text-[var(--color-fg-subtle)]">
                            {item.note}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Reveal>

          {/*
            The consolidation calculator, moved off the homepage 2026-08-10.

            Placed after the plans and the module list, before the FAQ: by this
            point the visitor has a per-seat price and knows what they would
            switch on, which is exactly when "what does consolidating save me"
            becomes a real question rather than a hypothetical one.

            Rendered as a sibling Reveal block rather than its own <Section>.
            Everything on this page lives inside one Section with a gap-12
            Container, so transplanting the homepage's `tone="tint"` wrapper
            would have nested a Section inside a Section and broken the rhythm.
            The island, its state and its arithmetic are untouched.

            `id` is new — nothing linked to this section on the homepage (it had
            no anchor), but it is worth one here so the block can be linked to.
          */}
          <Reveal id="calculator" className="flex flex-col gap-6 scroll-mt-28">
            <div className="flex flex-col gap-2">
              <h2 className="text-h2">{CALCULATOR.heading}</h2>
              <p className="max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">
                {CALCULATOR.sub}
              </p>
            </div>
            <RoiTeaser />
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <h2 className="text-h2">Pricing questions</h2>
            <ul className="flex flex-col gap-2">
              {PRICING_FAQS.map((item) => (
                <li key={item.question}>
                  <details className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] open:border-[var(--color-border-strong)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <Plus
                        aria-hidden
                        className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-open:rotate-45"
                      />
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {item.answer}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Start free, decide later."
        body="Fourteen days, no card. If it does not fit, export everything and go — that path is built, not promised."
      />
    </>
  );
}
