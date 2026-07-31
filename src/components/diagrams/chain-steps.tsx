/**
 * §3 the chain — the per-step illustrations and the current that runs behind
 * them (docs/10 §3).
 *
 * Drawn, not photographed. Five raster illustrations would be ~400KB of assets
 * that go stale the first time the product's UI moves; these are a few hundred
 * bytes of markup each, crisp at any DPI, and they recolour with the tokens.
 *
 * House style, shared with the hero's node icons: a filled container shape in
 * `brand-100`, detail knocked back out in `surface`, one `success` accent where
 * something has *completed*. Every element carries an explicit fill — these sit
 * inside a wrapper that sets a CSS `fill`, and CSS beats a presentation
 * attribute, so an unset element inherits the wash and flattens.
 *
 * All five share one 160×112 viewBox so the row's optical weight stays even;
 * that is also why the record-stack motif sits at the same x in each.
 */
import type { ReactNode } from 'react';

const VIEW = '0 0 160 112';

function Plate({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={VIEW}
      className="h-full w-full"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/**
 * The record itself, as a stack of discs. It appears in every step after the
 * first, at the same place and the same size, because that repetition *is* the
 * section's argument — one record, handed on, never retyped.
 */
function RecordStack({ x = 10, y = 44 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 6v18c0 3.3 4.9 6 11 6s11-2.7 11-6V6Z"
        fill="var(--color-brand-100)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path
        d="M0 15c0 3.3 4.9 6 11 6s11-2.7 11-6"
        fill="none"
        stroke="var(--color-brand-600)"
        strokeWidth={1.6}
      />
      <ellipse
        cx="11"
        cy="6"
        rx="11"
        ry="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
    </g>
  );
}

/**
 * Step 1 — Deal. The agreement, shaken on and approved.
 *
 * The handshake is the icon set's glyph nested at 62px rather than a shape
 * drawn here: hand-abstracting it at this size produced something that read as
 * a boat. Its stroke is 1.15 because the nested viewBox scales it ~2.6×, and
 * the plate's own strokes are 2 — this lands them at the same optical weight.
 */
function DealPlate() {
  return (
    <Plate>
      <rect
        x="48"
        y="6"
        width="60"
        height="62"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path
        d="M60 22h36M60 34h36M60 46h22"
        fill="none"
        stroke="var(--color-brand-300)"
        strokeWidth={3}
      />
      <svg
        x="36"
        y="46"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-brand-600)"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </svg>
      {/* approval */}
      <circle cx="120" cy="22" r="14" fill="var(--color-success)" />
      <path
        d="m114 22 4.5 4.5L127 18"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth={3}
      />
    </Plate>
  );
}

/**
 * Step 2 — Project. The won deal becomes a board with owners.
 *
 * The owner discs sit *above* the board rather than in its header strip: three
 * small circles inside a window's top bar are the universal traffic-light
 * motif, and they read as browser chrome no matter what they are meant to be.
 */
function ProjectPlate() {
  return (
    <Plate>
      <RecordStack x={8} y={50} />
      <rect
        x="46"
        y="30"
        width="104"
        height="66"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path d="M46 44h104" fill="none" stroke="var(--color-brand-600)" strokeWidth={2} />
      {[54, 86, 118].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={52}
            width="24"
            height="16"
            rx="3"
            fill={i === 1 ? 'var(--color-brand-200)' : 'var(--color-brand-100)'}
          />
          <rect
            x={x}
            y={74}
            width="24"
            height="16"
            rx="3"
            fill={i === 0 ? 'var(--color-brand-200)' : 'var(--color-brand-100)'}
          />
        </g>
      ))}
      {[
        { cx: 60, fill: 'var(--color-brand-200)' },
        { cx: 76, fill: 'var(--color-brand-300)' },
        { cx: 92, fill: 'var(--color-brand-100)' },
      ].map((owner) => (
        <circle
          key={owner.cx}
          cx={owner.cx}
          cy="16"
          r="9"
          fill={owner.fill}
          stroke="var(--color-brand-600)"
          strokeWidth={2}
        />
      ))}
    </Plate>
  );
}

/** Step 3 — Plan. A schedule: staggered bars against a spine of rows. */
function PlanPlate() {
  const bars = [
    { y: 38, x: 56, w: 46, tone: 'var(--color-brand-500)' },
    { y: 54, x: 72, w: 54, tone: 'var(--color-brand-300)' },
    { y: 70, x: 64, w: 36, tone: 'var(--color-success)' },
    { y: 86, x: 92, w: 44, tone: 'var(--color-brand-400)' },
  ];
  return (
    <Plate>
      <RecordStack />
      <rect
        x="44"
        y="16"
        width="106"
        height="80"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path d="M44 30h106M56 30v66" fill="none" stroke="var(--color-brand-600)" strokeWidth={2} />
      {bars.map((bar) => (
        <g key={bar.y}>
          <rect x="46" y={bar.y - 4} width="7" height="8" rx="2" fill="var(--color-brand-100)" />
          <rect x={bar.x} y={bar.y - 5} width={bar.w} height="10" rx="5" fill={bar.tone} />
        </g>
      ))}
    </Plate>
  );
}

/** Step 4 — Time. A week logged against the work, then approved once. */
function TimePlate() {
  const filled = new Set([0, 1, 3, 4, 5, 7, 8, 11]);
  return (
    <Plate>
      <RecordStack />
      <rect
        x="44"
        y="16"
        width="106"
        height="80"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <path d="M44 32h106" fill="none" stroke="var(--color-brand-600)" strokeWidth={2} />
      {Array.from({ length: 15 }, (_, i) => (
        <rect
          key={i}
          x={54 + (i % 5) * 20}
          y={42 + Math.floor(i / 5) * 18}
          width="16"
          height="12"
          rx="3"
          fill={filled.has(i) ? 'var(--color-brand-200)' : 'var(--color-brand-100)'}
        />
      ))}
      <circle
        cx="130"
        cy="82"
        r="15"
        fill="var(--color-success)"
        stroke="var(--color-surface)"
        strokeWidth={3}
      />
      <path
        d="m123.5 82 4.5 4.5 9-9"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth={3}
      />
    </Plate>
  );
}

/** Step 5 — Invoice. The approved hours, totalled, and closed. */
function InvoicePlate() {
  return (
    <Plate>
      <RecordStack />
      <rect
        x="52"
        y="12"
        width="76"
        height="88"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-brand-600)"
        strokeWidth={2}
      />
      <rect x="64" y="24" width="34" height="8" rx="4" fill="var(--color-brand-500)" />
      <path
        d="M64 48h52M64 60h52M64 72h30"
        fill="none"
        stroke="var(--color-brand-200)"
        strokeWidth={3}
      />
      {/* the total */}
      <rect x="64" y="82" width="52" height="10" rx="5" fill="var(--color-brand-100)" />
      <rect x="90" y="82" width="26" height="10" rx="5" fill="var(--color-brand-500)" />
      {/* sealed */}
      <circle
        cx="128"
        cy="84"
        r="15"
        fill="var(--color-brand-600)"
        stroke="var(--color-surface)"
        strokeWidth={3}
      />
      <path
        d="M123 83v-3a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth={2.2}
      />
      <rect x="121.5" y="83" width="13" height="9.5" rx="2" fill="var(--color-surface)" />
    </Plate>
  );
}

/** Keyed by `stage` so content/homepage.ts stays the single source of order. */
export const CHAIN_PLATES: Record<string, () => ReactNode> = {
  Deal: DealPlate,
  Project: ProjectPlate,
  Plan: PlanPlate,
  Time: TimePlate,
  Invoice: InvoicePlate,
};

/**
 * The current: one continuous stroke that enters at the left viewport edge,
 * runs behind the row of cards and leaves at the right. It is the only thing on
 * the page that crosses a section end to end, which is the point — the chain
 * does not stop at a card boundary.
 *
 * preserveAspectRatio="none" is deliberate: this is a gradient wash, not
 * geometry, so stretching it across any viewport is the intended behaviour.
 */
export function ChainCurrent() {
  return (
    <svg
      viewBox="0 0 1600 240"
      preserveAspectRatio="none"
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        {/*
          Transparent across the middle, not merely dimmed. The card row is not
          a solid wall — there are ~16px gaps between cards, and a current that
          stayed visible under them showed through as five bright bars, which
          reads as a rendering fault rather than as depth. It fades out before
          the first card and returns after the last.
        */}
        <linearGradient id="chain-current" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.5" />
          <stop offset="7%" stopColor="var(--color-brand-500)" stopOpacity="0.45" />
          <stop offset="16%" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="84%" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="93%" stopColor="var(--color-brand-500)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d="M0 156C150 156 210 96 360 96H1240c150 0 210 60 360 60"
        fill="none"
        stroke="url(#chain-current)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M0 156C150 156 210 96 360 96H1240c150 0 210 60 360 60"
        fill="none"
        stroke="url(#chain-current)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
