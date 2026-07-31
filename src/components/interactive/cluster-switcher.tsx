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
import { ArrowRight, Check } from 'lucide-react';
import { CLUSTERS, type ClusterId } from '@/content/clusters';
import { cn } from '@/components/site/primitives';

export function ClusterSwitcher() {
  const [active, setActive] = useState<ClusterId>(CLUSTERS[0]!.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-600)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]',
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`cluster-panel-${cluster.id}`}
        aria-labelledby={`cluster-tab-${cluster.id}`}
        className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center"
      >
        <div className="flex flex-col gap-5">
          <h3 className="text-h2">{cluster.name}</h3>
          <p className="text-body-lg text-[var(--color-fg-muted)]">{cluster.valueProp}</p>

          <ul className="flex flex-col gap-2">
            {cluster.modules.map((module) => (
              <li key={module} className="flex items-center gap-2.5 text-sm">
                <Check className="size-4 shrink-0 text-[var(--color-brand-600)]" aria-hidden />
                {module}
              </li>
            ))}
          </ul>

          <Link
            href={cluster.href}
            className="inline-flex min-h-6 w-fit items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4 transition-colors hover:decoration-[var(--color-brand-600)]"
          >
            Explore {cluster.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {/* The chain — the proof that these modules are one system */}
        <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] sm:p-8">
          <p className="text-label text-[var(--color-fg-subtle)]">End to end</p>
          <ol className="flex flex-col gap-0">
            {cluster.chain.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex flex-col items-center self-stretch">
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1.5 size-2.5 shrink-0 rounded-full',
                      i === cluster.chain.length - 1
                        ? 'bg-[var(--color-brand-600)]'
                        : 'bg-[var(--color-brand-300)]',
                    )}
                  />
                  {i < cluster.chain.length - 1 ? (
                    <span aria-hidden className="w-px flex-1 bg-[var(--color-border-strong)]" />
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
      </div>
    </div>
  );
}
