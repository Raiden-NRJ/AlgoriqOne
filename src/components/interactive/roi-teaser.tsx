'use client';

/**
 * §16 ROI teaser (docs/08 §2).
 *
 * Integrity rules encoded here, not just documented:
 *  - Every input is the visitor's own. Nothing is assumed on their behalf
 *    except the number of tools, which they can change.
 *  - The formula is shown. A CFO who can see the arithmetic trusts it.
 *  - No email gate. The number is visible immediately — gating it converts
 *    worse and reads as manipulative.
 *  - No "average customer sees X%" claim, because we have no customer data.
 */

import { useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function RoiTeaser() {
  const seatsId = useId();
  const toolsId = useId();
  const costId = useId();

  const [seats, setSeats] = useState(250);
  const [tools, setTools] = useState(3);
  const [costPerSeat, setCostPerSeat] = useState(38);

  // Deliberately conservative: only the licence overlap of the tools being
  // replaced, minus one platform. No productivity multiplier, no invented
  // efficiency gain.
  const replaced = Math.max(tools - 1, 0);
  const annualSaving = seats * costPerSeat * 12 * replaced * 0.6;

  return (
    <div className="grid gap-8 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e2)] sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-5">
        <Field
          id={seatsId}
          label="People who need a seat"
          value={seats}
          min={10}
          max={5000}
          step={10}
          onChange={setSeats}
        />
        <Field
          id={toolsId}
          label="Tools you would consolidate"
          value={tools}
          min={1}
          max={8}
          step={1}
          onChange={setTools}
        />
        <Field
          id={costId}
          label="Average cost per seat, per month"
          value={costPerSeat}
          min={5}
          max={300}
          step={1}
          prefix="$"
          onChange={setCostPerSeat}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
        <p className="text-label text-[var(--color-fg-subtle)]">Estimated annual licence overlap</p>
        <p
          aria-live="polite"
          className="text-4xl font-semibold tracking-[-0.03em] text-[var(--color-fg)]"
        >
          {currency.format(annualSaving)}
        </p>

        <p className="text-xs leading-relaxed text-[var(--color-fg-muted)]">
          <span className="font-medium text-[var(--color-fg)]">The arithmetic: </span>
          {seats} seats × ${costPerSeat}/month × 12 × {replaced} tool
          {replaced === 1 ? '' : 's'} replaced, discounted by 40% because consolidation is never
          total. Your own numbers, our pessimistic assumption.
        </p>

        <p className="text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          This estimate excludes the time your team spends reconciling systems, which is usually the
          larger number — the full calculator lets you put a value on it.
        </p>

        <Link
          href="/roi"
          className="mt-auto inline-flex min-h-6 w-fit items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4 hover:decoration-[var(--color-brand-600)]"
        >
          Open the full calculator
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  min,
  max,
  step,
  prefix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="font-mono text-sm text-[var(--color-fg-muted)]">
          {prefix}
          {value.toLocaleString('en-US')}
        </span>
      </div>
      {/*
        The control box is 24px tall to meet the WCAG 2.2 target-size minimum,
        while the visible track stays 6px — drawn on the track pseudo-element
        rather than on the input itself. A 6px-tall input is a real problem on
        a touch screen, not a theoretical one.
      */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-6 w-full cursor-pointer appearance-none bg-transparent
          [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--color-brand-600)]
          [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[var(--color-border)]
          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[var(--color-border)]
          [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-brand-600)]"
      />
      {/* Text equivalent: sliders alone are a poor keyboard/AT experience for
          precise values (docs/13 §2). */}
      <input
        type="number"
        aria-label={`${label} (exact value)`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
      />
    </div>
  );
}
