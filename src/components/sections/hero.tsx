import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { hero } from '@/content/homepage';
import { DEMO_TENANT } from '@/content/demo-tenant';
import { Button, Card, Container, Pill } from '@/components/site/primitives';

/**
 * §1 Hero — beat 1 (recognition). One idea: three systems, one permission model.
 *
 * The visual is an orchestrated product composition built from DOM, not a
 * screenshot: it is crisp at any DPI, weighs nothing, needs no capture pipeline
 * to stay current, and cannot go stale when the product ships a release.
 * Screenshots arrive in §6 and on the module pages (docs/10).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid" />

      <Container width="wide" className="relative">
        {/*
          [&>*]:min-w-0 is load-bearing. The product composition below has a
          36rem min-content width; without this, grid's default
          min-width: auto pushes the shared column to ~500px at phone widths and
          the copy runs past the viewport. The section's overflow-hidden then
          *clips* it silently — scrollWidth stays correct while the text is cut
          off mid-word. Only a screenshot catches that.
        */}
        <div className="grid items-center gap-16 py-20 [&>*]:min-w-0 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-28">
          {/* Copy */}
          <div className="flex flex-col items-start gap-7">
            <Pill tone="brand">
              <ShieldCheck className="size-3.5" aria-hidden />
              {hero.eyebrow}
            </Pill>

            <h1 className="text-display-1 max-w-[min(16ch,100%)]">
              <span className="block">{hero.headline[0]}</span>
              <span className="block text-[var(--color-brand-600)]">{hero.headline[1]}</span>
            </h1>

            <p className="text-body-lg max-w-[min(52ch,100%)] text-[var(--color-fg-muted)]">{hero.sub}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-fg-subtle)]">
              {hero.proofPoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-[var(--color-brand-600)]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Product composition */}
          <div className="relative">
            <HeroComposition />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroComposition() {
  return (
    /*
     * A decorative representation of the product, exactly as a screenshot would
     * be — so it is aria-hidden and carries a text alternative. Every claim it
     * depicts (the approvals inbox, the permission check, the invoice handoff)
     * is stated in real prose in the hero copy and in the chain section, so
     * nothing is lost to assistive technology. This is also why its small type
     * is exempt from the 12px content minimum: it is an illustration of an
     * interface, not body copy.
     */
    <div className="relative mx-auto w-full max-w-[36rem]">
      <p className="sr-only">
        An illustration of the Algoryq One portal showing the “My actions” inbox with four pending
        approvals — a timesheet, a deal and a leave request — and a confirmation that 38 approved
        hours have been attached to invoice INV-2041.
      </p>
      <div aria-hidden="true">
      {/* The window */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e4)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
          <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
          <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
          <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
          <span className="ml-2 truncate rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 font-mono text-[0.6875rem] text-[var(--color-fg-subtle)]">
            portal.one.algoryq.com/actions
          </span>
        </div>

        <div className="flex">
          {/* Nav rail — mirrors the real portal sections */}
          <div className="hidden w-36 shrink-0 flex-col gap-1 border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 sm:flex">
            {['Dashboard', 'CRM', 'Projects', 'Time & Work', 'People', 'Business'].map((item, i) => (
              <span
                key={item}
                className={
                  i === 3
                    ? 'rounded-[var(--radius-sm)] bg-[var(--color-brand-50)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-brand-800)]'
                    : 'px-2.5 py-1.5 text-xs text-[var(--color-fg-muted)]'
                }
              >
                {item}
              </span>
            ))}
          </div>

          {/*
            Two rows, then reserved space. The floating card below overlaps that
            space deliberately; with a third row it cut a name in half, which
            reads as a rendering bug rather than as depth.
          */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 pb-40 sm:pb-44">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">My actions</span>
              <span className="rounded-full bg-[var(--color-brand-600)] px-2 py-0.5 text-[0.6875rem] font-semibold text-white">
                4 pending
              </span>
            </div>

            <ApprovalRow
              module="Timesheet"
              title="Ava Kapoor · week 30"
              meta="38h · Atlas CRM Rollout"
            />
            <ApprovalRow
              module="Deal"
              title="Vertex Manufacturing"
              meta="$84,000 · 18% discount"
            />
          </div>
        </div>
      </div>

      {/* The payload: what the approval above turns into, one step later. */}
      <Card className="absolute bottom-4 left-4 hidden w-[17rem] gap-2 p-4 shadow-[var(--shadow-e4)] sm:flex sm:flex-col lg:-left-6">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-[var(--color-success)]/12 text-[var(--color-success)]">
            <Check className="size-3.5" aria-hidden />
          </span>
          <span className="text-xs font-semibold">38h approved → INV-2041</span>
        </div>
        <code className="font-mono text-[0.6875rem] text-[var(--color-fg-muted)]">
          timesheet.timesheet.approve
        </code>
        <p className="text-[0.6875rem] leading-relaxed text-[var(--color-fg-subtle)]">
          No export in between. The approval is checked in the service and recorded in the audit
          trail.
        </p>
      </Card>
      </div>

      {/* Caption sits outside the aria-hidden illustration so it is readable
          by everyone — the sample-data disclosure is not decorative. */}
      <p className="mt-4 text-xs text-[var(--color-fg-subtle)]">
        Sample data · {DEMO_TENANT.name}
      </p>
    </div>
  );
}

function ApprovalRow({ module, title, meta }: { module: string; title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-[0.625rem] font-medium text-[var(--color-fg-muted)]">
            {module}
          </span>
          <span className="truncate text-xs font-medium">{title}</span>
        </div>
        <p className="mt-0.5 truncate text-[0.6875rem] text-[var(--color-fg-subtle)]">{meta}</p>
      </div>
      <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-brand-600)] px-2 py-1 text-[0.625rem] font-semibold text-white">
        Approve
      </span>
    </div>
  );
}
