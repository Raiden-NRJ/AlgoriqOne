import type { Metadata } from 'next';
import { Check, Plus } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Button, Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { getPlans, formatPrice } from '@/lib/billing';
import { CAPABILITY_GROUPS, INCLUDED_EVERYWHERE, PRICING_FAQS } from '@/content/pricing';

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
        <Container width="wide" className="flex flex-col gap-16">
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
                <p className="max-w-[min(62ch,100%)] leading-relaxed text-[var(--color-fg-muted)]">
                  Published plan prices come straight out of our billing system so they cannot drift
                  from what you would actually be charged. They are not being served right now, and
                  we would rather show you nothing than a number this page invented. Tell us your
                  team size and the modules you need and you will get a real figure the same day.
                </p>
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
              <p className="max-w-[min(62ch,100%)] text-[var(--color-fg-muted)]">
                Modules are licensed per tenant, so you can start with two clusters and add the rest
                as your process grows into them.
              </p>
            </div>
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
