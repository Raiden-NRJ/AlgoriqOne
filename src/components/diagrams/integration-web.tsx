/**
 * §1 hero visual — the integration web (docs/10 §2).
 *
 * The portal sits in the middle and the modules that feed it are wired around
 * the outside, because that is the literal argument of the headline: the
 * handoffs are inside the product, not between products.
 *
 * Built from DOM + SVG rather than a screenshot: crisp at any DPI, weighs
 * nothing, and cannot go stale when the product ships a release.
 *
 * Two things carry the geometry:
 *
 * 1. Everything is placed as a percentage of a fixed-aspect box that shares its
 *    coordinate space with the SVG viewBox below, so a wire endpoint and the
 *    icon it lands on stay welded together at every width.
 * 2. Everything is *sized* in `em`, off one fluid font-size set on the root.
 *    That makes the whole composition scale as a unit — the alternative is a
 *    breakpoint per element and a set of drifting magic numbers.
 *
 * Below xl the wire mesh is dropped entirely and the portal window stands on
 * its own: at that width the nodes would be 20px of unreadable line art, and a
 * smaller true thing beats a shrunken busy one.
 *
 * ── UNRENDERED, and it is NOT ready for the azure ground ──────────────────
 * Nothing imports this component. It is kept deliberately, as blocker B10's
 * option (b): the DOM composition the hero video replaced on 2026-08-09, ready
 * to be reinstated if the video's misspelled baked-in text is never re-cut.
 *
 * It was written for the white ground and was **skipped by the 2026-09-02
 * semantic-token migration on purpose**, because a component that renders
 * nowhere cannot be verified by looking at it — a blind token swap here would
 * have produced confidence rather than correctness. It is now the only file in
 * `src/` still reaching past the semantic layer for a foreground colour: four
 * call sites on `brand-600/700/800` as text, plus `brand-50/100/200` chip
 * fills that assume a light surface underneath.
 *
 * On the azure ground those invert: brand-700 text measures ~2:1 on the dark
 * surface, and the pale chip fills become light slabs. So reinstating this is
 * a **dark-ground design pass**, not a find-and-replace — expect to rebuild
 * the chip recipe on `--color-chip` / `--color-chip-fg` and move the icon and
 * wire strokes onto `--color-link` / `--color-accent-line`, then add its pairs
 * to `check:contrast` before it ships.
 */
import { Clock, Flag, Handshake, Lock, ReceiptText, SquareCheckBig } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { heroVisual, type HeroVisualNodeId } from '@/content/homepage';
import { cn } from '@/components/site/primitives';

/* ─────────────────────────── Geometry ─────────────────────────────────── */

/** The one coordinate space. The SVG viewBox and every `%` below share it. */
const VIEW = { w: 960, h: 820 } as const;

/** Icon centres. Labels hang underneath and are laid out from the same point. */
const NODE_AT: Record<HeroVisualNodeId, { x: number; y: number }> = {
  crm: { x: 65, y: 110 },
  hrms: { x: 480, y: 57 },
  payroll: { x: 835, y: 80 },
  sales: { x: 63, y: 383 },
  timesheet: { x: 878, y: 392 },
  hris: { x: 527, y: 730 },
  projects: { x: 765, y: 725 },
};

/**
 * Six of the seven are hand-drawn. The icon set's outlines are built for 16–20px
 * UI, and at 3.4em on a pale wash they wash out — the ID card in particular
 * collapses to a rounded rectangle. These are duotone: a filled container shape
 * plus detail knocked back out in the surface colour, which survives the size.
 * Handshake is the exception; it reads correctly straight from the set.
 */
const NODE_ICON: Record<HeroVisualNodeId, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  crm: Handshake,
  hrms: IdCardIcon,
  payroll: BanknoteIcon,
  sales: CoinsIcon,
  timesheet: ClockIcon,
  hris: BadgeIcon,
  projects: GanttIcon,
};

/**
 * The mesh. Continuous beziers rather than elbowed H/V runs — these read as
 * plumbing, and plumbing that swoops looks routed rather than snapped to a
 * grid. `flow: 'settled'` is the green run: the two hops where money and a
 * person record land somewhere final.
 *
 * Two constraints shape every path here, and both were found in a screenshot
 * rather than by reading the numbers:
 *
 * 1. NOTHING MAY CROSS A LABEL. Labels are centred under their icon, so the
 *    obvious route — straight down from an icon's bottom edge to the one below
 *    it — goes through its own caption. CRM→Sales, Payroll→Timesheet and
 *    Timesheet→Projects all leave from an icon's *side* and bow past the text
 *    instead. Label boxes, in this coordinate space: a caption spans
 *    y+41…y+58 below its node centre and roughly ±0.5×(its rendered width),
 *    which for "Timesheet" is ±42 — wide enough that its wire has to bow left,
 *    where every other one bows right.
 * 2. A WIRE THAT ENDS AT THE PORTAL MUST END *INSIDE* IT. The portal's rect is
 *    x 163…770, y 167…675, and it paints over this svg. Stopping on the edge
 *    reads as a wire that halts at the window; ending 12–35 units in reads as
 *    one passing behind it, which is the point — these modules are wired
 *    *through* the portal, not merely arranged around it.
 */
const WIRES: Array<{ d: string; flow?: 'settled' }> = [
  { d: 'M100 113 C188 113 206 59 296 59 H447' }, // CRM → HRMS
  { d: 'M516 58 C592 58 614 78 668 78 H800', flow: 'settled' }, // HRMS → Payroll
  { d: 'M88 140 C102 148 106 158 106 174 V318 C106 336 98 348 84 352' }, // CRM → Sales
  { d: 'M97 383 H178' }, // Sales → portal
  { d: 'M92 404 C104 416 106 430 106 448 V580 C106 640 132 690 190 690 H238' }, // Sales → run
  { d: 'M238 690 C302 690 322 730 388 730 H494', flow: 'settled' }, // run → HRIS
  { d: 'M866 90 C892 96 902 116 902 140 V210 C902 258 878 272 878 306 V358' }, // Payroll → Timesheet
  { d: 'M758 392 H846' }, // portal → Timesheet
  { d: 'M852 420 C824 434 806 452 806 476 V640 C806 700 806 726 796 726' }, // Timesheet → Projects Gantt
  { d: 'M562 730 H730' }, // HRIS → Projects Gantt
  { d: 'M688 662 V690 C688 706 700 716 720 716 H736' }, // portal → Projects Gantt
  { d: 'M98 130 C168 138 196 168 252 200' }, // CRM → behind the portal
  { d: 'M508 78 C562 98 578 150 620 205' }, // HRMS → behind the portal
  { d: 'M676 182 C730 176 764 140 790 108 C796 100 800 96 806 94' }, // portal → Payroll
  { d: 'M252 662 V690' }, // portal → the bottom run
  // Lands *on* the Payroll → Timesheet curve at (900,230) — an endpoint a few
  // units short of it reads as a wire stopping in mid-air.
  { d: 'M756 306 C820 306 866 274 900 230' }, // portal → the right column
];

/**
 * Junctions. A wire that just stops looks broken; a wire that lands does not.
 * Each of these is solved *on* its wire — a joint a few units off its curve is
 * the most visible defect in the whole composition, because the eye reads it as
 * a disconnected dot rather than as a join.
 */
const JOINTS: Array<{ x: number; y: number; tone?: 'settled' | 'ink' }> = [
  { x: 100, y: 113 },
  { x: 447, y: 59 },
  { x: 516, y: 58 },
  { x: 800, y: 78, tone: 'settled' },
  { x: 106, y: 240 },
  { x: 136, y: 383, tone: 'ink' },
  { x: 206, y: 690 },
  { x: 252, y: 690 },
  { x: 494, y: 730, tone: 'settled' },
  { x: 566, y: 730 },
  { x: 726, y: 730 },
  { x: 878, y: 314 },
  { x: 806, y: 478 },
  { x: 800, y: 392 },
  { x: 900, y: 230 },
];

const pct = (value: number, of: number) => `${((value / of) * 100).toFixed(3)}%`;

/* ─────────────────────────── Composition ──────────────────────────────── */

export function IntegrationWeb() {
  return (
    <div
      className="relative w-full xl:aspect-[960/820]"
      style={{ fontSize: 'clamp(0.6875rem, 1.02vw, 1.0625rem)' }}
    >
      <p className="sr-only">{heroVisual.alt}</p>

      <div aria-hidden="true" className="contents">
        <Wires />
        {heroVisual.nodes.map((node) => (
          <Node key={node.id} id={node.id} label={node.label} />
        ))}
      </div>

      <PortalWindow />
    </div>
  );
}

function Wires() {
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
      role="presentation"
      aria-hidden="true"
    >
      {WIRES.map((wire) => (
        <path
          key={wire.d}
          d={wire.d}
          fill="none"
          stroke={
            wire.flow === 'settled' ? 'var(--color-success)' : 'var(--color-brand-500)'
          }
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {JOINTS.map((joint) => (
        <circle
          key={`${joint.x}-${joint.y}`}
          cx={joint.x}
          cy={joint.y}
          r={5.5}
          fill={
            joint.tone === 'settled'
              ? 'var(--color-success)'
              : joint.tone === 'ink'
                ? 'var(--color-brand-900)'
                : 'var(--color-brand-600)'
          }
        />
      ))}
    </svg>
  );
}

function Node({ id, label }: { id: HeroVisualNodeId; label: string }) {
  const Icon = NODE_ICON[id];
  const at = NODE_AT[id];

  return (
    // Centred on the icon, not on the icon+label stack: the label is taken out
    // of flow so adding or shortening a word never moves the wire's landing.
    <div
      className="absolute hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center xl:flex"
      style={{ left: pct(at.x, VIEW.w), top: pct(at.y, VIEW.h) }}
    >
      <Icon
        className="size-[3.4em] fill-[var(--color-brand-100)] text-[var(--color-brand-600)]"
        strokeWidth={1.5}
      />
      <span className="absolute top-full mt-[0.55em] whitespace-nowrap text-[0.92em] font-medium text-[var(--color-fg)]">
        {label}
      </span>
    </div>
  );
}

/* ────────────────────────── The portal window ─────────────────────────── */

const ROW_ICON = {
  lead: SquareCheckBig,
  payroll: ReceiptText,
  milestone: Flag,
  time: Clock,
} as const;

/*
 * The reference tints the payroll row violet against the blue of the time rows.
 * We have no violet, and inventing one would be a hex literal in a component
 * (rule 8) — so the separation comes from depth on the brand ramp instead,
 * which is the same signal and stays inside the token set.
 */
const ROW_TONE = {
  success: 'bg-[var(--color-success)]/12 text-[var(--color-success)]',
  brand: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
  brandStrong: 'bg-[var(--color-brand-200)] text-[var(--color-brand-800)]',
  neutral: 'bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]',
} as const;

function PortalWindow() {
  const { portal } = heroVisual;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'mx-auto flex w-full max-w-[34rem] flex-col overflow-hidden rounded-[1.15em]',
        'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-e4)]',
        // xl: lifted out of flow and dropped into the mesh. The percentages are
        // the window's rect in the same coordinate space as the wires above.
        'xl:absolute xl:left-[17%] xl:top-[20.4%] xl:mx-0 xl:h-[62%] xl:w-[63.2%] xl:max-w-none',
      )}
    >
      {/* Chrome */}
      <div className="flex shrink-0 items-center gap-[0.45em] border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-[1.1em] py-[0.85em]">
        <span className="size-[0.55em] rounded-full bg-[var(--color-border-strong)]" />
        <span className="size-[0.55em] rounded-full bg-[var(--color-border-strong)]" />
        <span className="size-[0.55em] rounded-full bg-[var(--color-border-strong)]" />
        <span className="mx-auto inline-flex min-w-0 items-center gap-[0.4em] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[1em] py-[0.3em] font-mono text-[0.72em] text-[var(--color-fg-subtle)]">
          <Lock aria-hidden className="size-[1.1em] shrink-0" strokeWidth={2} />
          <span className="truncate">{portal.url}</span>
        </span>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Nav rail — the real portal's sections, in the real order */}
        <div className="hidden w-[8em] shrink-0 flex-col gap-[0.1em] border-r border-[var(--color-border)] p-[0.7em] sm:flex">
          {portal.nav.map((item, i) => (
            <span
              key={item}
              className={cn(
                'truncate rounded-[0.45em] px-[0.7em] py-[0.45em] text-[0.8em]',
                i === 0
                  ? 'bg-[var(--color-brand-50)] font-medium text-[var(--color-brand-800)]'
                  : 'text-[var(--color-fg-muted)]',
              )}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[0.9em] p-[1.1em]">
          <span className="text-[0.95em] font-semibold text-[var(--color-fg)]">
            {portal.heading}
          </span>

          {/* flex-1 + justify-between: at xl the window's height is fixed by the
              mesh geometry, so the feed spreads to fill it rather than stacking
              at the top over a pool of dead space. Below xl the height is
              content-driven and the gap governs. */}
          <ul className="flex min-w-0 flex-1 flex-col justify-between gap-[0.85em]">
            {portal.items.map((item, i) => {
              const Icon = ROW_ICON[item.icon];
              return (
                <li key={`${item.title}-${i}`} className="flex min-w-0 items-center gap-[0.7em]">
                  <span
                    className={cn(
                      'grid size-[2.15em] shrink-0 place-items-center rounded-full',
                      ROW_TONE[item.tone],
                    )}
                  >
                    <Icon className="size-[1.05em]" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.85em] font-semibold text-[var(--color-fg)]">
                      {item.title}
                    </span>
                    <span className="block truncate text-[0.78em] text-[var(--color-fg-subtle)]">
                      {item.meta}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Icons ────────────────────────────────── */

type NodeIconProps = { className?: string; strokeWidth?: number };

/**
 * Every element carries an explicit fill. Node applies a CSS `fill` to the root
 * svg for the icon-set glyph, and CSS beats a presentation attribute — so an
 * element that leaves fill unset here inherits the wash and flattens.
 */
function NodeIcon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** HRMS — an ID card, portrait left, detail lines right. */
function IdCardIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      <rect
        x="2.4"
        y="4.6"
        width="19.2"
        height="14.8"
        rx="2.6"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="8.6"
        cy="10.6"
        r="2.2"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={1.35}
      />
      <path
        d="M5.2 16.6a3.7 3.7 0 0 1 6.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
      />
      <path
        d="M14.9 10.2h4.3M14.9 13.8h4.3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
      />
    </NodeIcon>
  );
}

/**
 * HRIS — the HRMS card again, but clipped to a lanyard. Same portrait-left,
 * lines-right anatomy so the pair reads as one family; the clip is the only
 * thing telling them apart, which is exactly how the reference does it.
 */
function BadgeIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      <path
        d="M9.7 4.6V3.6a1 1 0 0 1 1-1h2.6a1 1 0 0 1 1 1v1"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <rect
        x="2.8"
        y="4.6"
        width="18.4"
        height="15"
        rx="2.6"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="8.4"
        cy="10.7"
        r="2.1"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={1.35}
      />
      <path
        d="M5.2 16.5a3.5 3.5 0 0 1 6.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
      />
      <path
        d="M14.7 10.3h4.2M14.7 13.9h4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
      />
    </NodeIcon>
  );
}

/**
 * Payroll — a cash tray: coins stacked one side, a note the other. A plain
 * banknote outline was the closest single glyph and it read as a rounded
 * rectangle with a dot in it at this size; the tray gives it a silhouette.
 */
function BanknoteIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      {/* coins */}
      <path
        d="M3.1 7.5v2.9c0 .9 1.75 1.6 3.9 1.6s3.9-.7 3.9-1.6V7.5Z"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <ellipse
        cx="7"
        cy="7.5"
        rx="3.9"
        ry="1.7"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      {/* the note. The coin on it is drawn large and thin-stroked on purpose —
          at 1.4r/1.1w it filled in and read as a solid dot, not a coin. */}
      <rect
        x="12.2"
        y="5.9"
        width="8.8"
        height="6.2"
        rx="1.3"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <circle
        cx="16.6"
        cy="9"
        r="1.75"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={1}
      />
      {/* the tray */}
      <path
        d="M2.7 13.6h18.6a1 1 0 0 1 .99 1.15l-.62 4.1a1.6 1.6 0 0 1-1.58 1.35H3.91a1.6 1.6 0 0 1-1.58-1.35l-.62-4.1a1 1 0 0 1 .99-1.15Z"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </NodeIcon>
  );
}

/**
 * Sales — two coin stacks, the short one behind. Drawn back-to-front and
 * bottom-up so every top face stays crisp against the stack below it.
 */
function CoinsIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      {/* back stack */}
      <path
        d="M11 9.5v3.3c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V9.5Z"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={1.3}
      />
      <ellipse
        cx="16"
        cy="9.5"
        rx="5"
        ry="2.1"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={1.3}
      />
      {/* front stack */}
      <path
        d="M3 8.7v8.1c0 1.33 2.57 2.4 5.75 2.4s5.75-1.07 5.75-2.4V8.7Z"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M3 12.8c0 1.33 2.57 2.4 5.75 2.4s5.75-1.07 5.75-2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
      />
      <ellipse
        cx="8.75"
        cy="8.7"
        rx="5.75"
        ry="2.4"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </NodeIcon>
  );
}

/** Timesheet — a clock. */
function ClockIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      <circle
        cx="12"
        cy="12"
        r="8.7"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path d="M12 6.8V12l3.4 2.1" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </NodeIcon>
  );
}

/**
 * Projects Gantt — the one node where the icon's *content* carries the meaning:
 * a plan with bars on it. The green bar is the same green as the settled wires.
 */
function GanttIcon({ className, strokeWidth = 1.5 }: NodeIconProps) {
  return (
    <NodeIcon className={className}>
      <rect
        x="2.6"
        y="3.9"
        width="18.8"
        height="16.2"
        rx="2.7"
        fill="var(--color-brand-100)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path d="M2.6 8.2h18.8" fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      {/* the plan's own sidebar — what makes this a schedule and not a window */}
      <path d="M8.1 8.2v11.9" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <rect x="10" y="10.3" width="6.2" height="2.3" rx="1.15" fill="var(--color-brand-500)" />
      <rect x="12.5" y="13.7" width="6.3" height="2.3" rx="1.15" fill="var(--color-success)" />
      <rect x="10.8" y="17.1" width="5" height="2.3" rx="1.15" fill="var(--color-brand-400)" />
    </NodeIcon>
  );
}
