'use client';

/**
 * §7 Module clusters — beat 6 (depth). One idea: each of these is a full
 * product, not a tab.
 *
 * A real ARIA tablist with roving tabindex and arrow-key navigation
 * (docs/13 §2). Never auto-rotates: tabs change only on user action.
 */

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { CLUSTERS, type ClusterId } from '@/content/clusters';
import { cn } from '@/components/site/primitives';
// The framer mirror — framer cannot read a CSS custom property, so these are
// the one place the millisecond redlines are duplicated for it (motion.ts).
import {
  DURATION_CROSS_FADE_S,
  DURATION_INDICATOR_S,
  EASE_OUT_QUINT,
  stagger,
} from '@/components/site/motion';

export function ClusterSwitcher() {
  const [active, setActive] = useState<ClusterId>(CLUSTERS[0]!.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reduced = useReducedMotion();

  const cluster = CLUSTERS.find((c) => c.id === active)!;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = CLUSTERS.findIndex((c) => c.id === active);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % CLUSTERS.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + CLUSTERS.length) % CLUSTERS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = CLUSTERS.length - 1;
    else return;

    event.preventDefault();
    const target = CLUSTERS[next]!;
    setActive(target.id);
    tabRefs.current[target.id]?.focus();
  };

  return (
    <div className="flex flex-col gap-8">
      {/*
        Tablist. This wraps rather than scrolls: the previous negative-margin
        bleed (-mx-5 + overflow-x-auto) grew the flex parent past the viewport
        and pushed the whole page into horizontal scroll at 390px. Six short
        labels wrap onto two lines cleanly, and wrapping needs no scroll
        affordance for keyboard or screen-reader users.
      */}
      <div
        role="tablist"
        aria-label="Product clusters"
        onKeyDown={onKeyDown}
        className="flex flex-wrap justify-center gap-2"
      >
        {CLUSTERS.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              type="button"
              role="tab"
              id={`cluster-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`cluster-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                'relative rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-[var(--color-action)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]',
              )}
            >
              {/*
                Sliding indicator — M6 slide 08, "TABS indicator 240ms".

                The filled pill *is* the indicator: `layoutId` makes framer
                animate it from the old tab to the new one instead of
                repainting it in place, so the design is unchanged and only the
                motion is added. Redrawing the tabs as an underline to match
                the deck's mock would have been a design change dressed up as a
                motion one.

                Behind the label (-z-10 on the pill, relative on the button) so
                the text is never occluded mid-slide. Reduced motion drops the
                travel and it simply appears.
              */}
              {selected ? (
                <motion.span
                  aria-hidden
                  layoutId="cluster-tab-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--color-action)]"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: DURATION_INDICATOR_S, ease: EASE_OUT_QUINT }
                  }
                />
              ) : null}
              {item.name}
            </button>
          );
        })}
      </div>

      {/*
        Panel content fades in on cluster change instead of hard-swapping.
        No AnimatePresence/exit here on purpose: an earlier version used
        mode="wait" with an exit animation, and on this React 19 + framer-
        motion combination the exit-complete callback never fired, so the old
        panel stayed on screen forever after the first click — confirmed live
        (tab state updated, content did not). key={cluster.id} still forces a
        clean remount; the old panel just disappears instantly instead of
        fading out, and the new one fades in. useReducedMotion collapses that
        to an instant swap (rule 5).
      */}
      <motion.div
          key={cluster.id}
          role="tabpanel"
          id={`cluster-panel-${cluster.id}`}
          aria-labelledby={`cluster-tab-${cluster.id}`}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          /*
            Cross-fade, per deck slide 02: 200ms, opacity + 8px slide. Was
            180ms with framer's generic 'easeOut'; both now match the tokens.

            The values are duplicated from --duration-cross-fade and
            --ease-out-quint because framer takes numbers, not custom
            properties. They must move together — the CSS is authoritative.

            This is a keyed remount rather than two panels present at once, so
            it does not use the `.cross-fade` class: that class needs both the
            outgoing and incoming panel in the DOM. The comment below explains
            why an AnimatePresence version was abandoned.
          */
          transition={{ duration: reduced ? 0 : DURATION_CROSS_FADE_S, ease: EASE_OUT_QUINT }}
          className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center"
        >
        <div className="flex flex-col gap-5">
          <h3 className="text-h2">{cluster.name}</h3>
          <p className="text-body-lg text-[var(--color-fg-muted)]">{cluster.valueProp}</p>

          <ul className="flex flex-col gap-2">
            {cluster.modules.map((module) => (
              <li key={module} className="flex items-center gap-2.5 text-sm">
                <Check className="size-4 shrink-0 text-[var(--color-link)]" aria-hidden />
                {module}
              </li>
            ))}
          </ul>

          <Link
            href={cluster.href}
            className="inline-flex min-h-6 w-fit items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-link)] underline decoration-[var(--color-link)]/50 underline-offset-4 transition-colors hover:decoration-[var(--color-link-strong)]"
          >
            Explore {cluster.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {/*
          The chain — the proof that these modules are one system.

          It animates as of 2026-09-02, and the trigger is the remount this
          panel already does. `key={cluster.id}` above tears the whole subtree
          down and builds a new one on every cluster change; a CSS animation
          starts when its element is inserted, so the dots and the segments
          replay in step with the panel's own cross-fade without a single line
          of switch-aware code. Before this, the panel sat beside a tablist
          whose indicator *does* animate, and a cluster change read as "the
          label changed" rather than "the pipeline rebuilt".

          The two `data-pipe-*` attributes and their delays are the entire
          implementation; the motion is the `[data-pipe-dot]` / `[data-pipe-line]`
          block in globals.css, shared verbatim with the server-rendered `Chain`
          in page-template.tsx, which is the same composition on ~12 deep-page
          blocks. Reduced motion is handled there too, globally, rather than
          through the `reduced` flag this file uses for its framer transitions.
        */}
        <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] sm:p-8">
          <p className="text-label text-[var(--color-fg-subtle)]">End to end</p>
          <ol className="flex flex-col gap-0">
            {cluster.chain.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex flex-col items-center self-stretch">
                  <span
                    aria-hidden
                    data-pipe-dot=""
                    style={{ animationDelay: `${stagger(i)}ms` }}
                    className={cn(
                      'mt-1.5 size-2.5 shrink-0 rounded-full',
                      i === cluster.chain.length - 1
                        ? 'bg-[var(--color-action)]'
                        : 'bg-[var(--color-brand-300)]',
                    )}
                  />
                  {i < cluster.chain.length - 1 ? (
                    <span
                      aria-hidden
                      data-pipe-line=""
                      style={{ animationDelay: `${stagger(i)}ms` }}
                      className="w-px flex-1 bg-[var(--color-border-strong)]"
                    />
                  ) : null}
                </span>
                <span className="pb-4 text-sm font-medium">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-auto flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-4">
            {cluster.permissions.map((key) => (
              <code
                key={key}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-fg-muted)]"
              >
                {key}
              </code>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
