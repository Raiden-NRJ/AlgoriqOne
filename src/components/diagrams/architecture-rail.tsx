/**
 * §4 Platform — the connectors in "How it fits together".
 *
 * The section's own copy states the thesis: *"all of them sit on one gateway
 * and one shared spine."* Until 2026-09-02 the diagram under it rendered three
 * stacked boxes — four app cards, the gateway, the shared spine — with no line,
 * no arrow, nothing between them at all. It enumerated the parts and drew none
 * of the relationship it exists to show. These are the lines that draw it.
 *
 * Still server-rendered, and still with no observer of its own. Nothing
 * focusable, no text — the boxes already carry the content, the lines carry
 * only the relationship (`role="presentation"`, `aria-hidden`).
 *
 * ── Two things drive these paths, and which one depends on the width ──────
 *
 * As of 2026-09-03 (owner instruction) the draw is scroll-scrubbed at `sm` and
 * up by `interactive/architecture-draw.tsx`, which pins the diagram and binds
 * the whole apps → gateway → spine sequence to the scrollbar. Below `sm` — and
 * under reduced motion at every width — nothing changes: the draw stays the
 * one-shot CSS entrance gated on a `.reveal-seen` ancestor, which the enclosing
 * <Reveal> in platform.tsx supplies.
 *
 * That split is why this file gained `kind` and `data-arch-cols` and nothing
 * else. **The markup is the same under both drivers**, the CSS default is still
 * the finished state, and the island only ever *winds it back* — so a build
 * with no JavaScript, a failed hydration, or a reverted island all render a
 * complete diagram, exactly as before.
 *
 * Everything about the Draw itself follows ChainRail in `chain-steps.tsx`:
 * `pathLength="100"` with `stroke-dasharray/dashoffset 100 → 0`, so nothing is
 * measured, nothing needs `getTotalLength()`, and editing a `d` cannot break
 * the animation. The CSS — including the default-is-drawn contract and the
 * reduced-motion branch — is the `[data-arch-rail]` block in globals.css.
 *
 * `pathLength="100"` is also what makes the scrubbed version resize-proof for
 * free. It declares the path's length to be 100 user units whatever its real
 * geometry, so `stroke-dasharray: 100` covers the path exactly at every
 * viewport width and the island's tween endpoints (100 → 0) are constants. A
 * `getTotalLength()` implementation would have to re-measure six paths on every
 * resize and rewrite both properties to keep up; this one has nothing to
 * recompute, because there is no measured number anywhere in it.
 *
 * ── Alignment is structural, and that is the whole trick ──────────────────
 *
 * The lines have to leave from the *centre of each app card*, at every
 * viewport width, with no JavaScript measuring anything. ChainRail solved the
 * same problem by insetting itself to the first and last card centres and
 * letting its viewBox span exactly that distance; this does the same, with the
 * inset derived rather than eyeballed.
 *
 * For an N-column grid of width W with gap g, a column is `(W - (N-1)g) / N`
 * wide, so the first column's centre sits at `W/2N - (N-1)g/2N` from the left
 * edge — which is the `INSET` expression below. Two things then fall out for
 * free, and both are what make the rest of this file simple:
 *
 *   · The span between the first and last centres is exactly `(N-1)(col + g)`,
 *     so the inner columns land on exact fractions of it. With the viewBox
 *     spanning 0 → 1000, four columns put their drops on 0 / 333.3 / 666.7 /
 *     1000 and two on 0 / 1000. No arithmetic per width, and no drift: this is
 *     the failure ChainRail hit when it spaced its nodes evenly across the
 *     whole container instead of between card centres.
 *   · The inset is symmetric, so x=500 in the viewBox is the container's own
 *     centre — which is where the gateway box below is centred. The collector
 *     line lands on it without knowing anything about the gateway.
 *
 * The gap term reads `var(--spacing)`, Tailwind v4's spacing base, times 3 —
 * i.e. literally the `gap-3` the app grid is set with. A fallback is supplied
 * so a theme that drops the variable degrades to a 4px error rather than to a
 * broken `calc`. **If the app grid's gap changes, this changes with it.**
 *
 * ── Why preserveAspectRatio="none" ────────────────────────────────────────
 *
 * The rail is 40px tall and up to ~1200px wide, so uniform scaling — what
 * ChainRail uses to keep its circles round — would make it grow to 48px of
 * height for every 1200px of width. There are no circles here, only lines, so
 * non-uniform scaling costs nothing except stroke width, and
 * `vector-effect="non-scaling-stroke"` puts that back: the stroke renders at
 * its authored weight regardless of how the box is stretched. `ChainCurrent`
 * in `chain-steps.tsx` takes the same decision for the same reason.
 *
 * The viewBox height matches the rendered pixel height exactly (40 units /
 * `h-10`), so the vertical scale is 1 and the curve control points below mean
 * in pixels what they say.
 */

import { stagger } from '@/components/site/motion';
import { cn } from '@/components/site/primitives';

/** The app grid's `gap-3`, as a length. Must track that class. */
const GAP = 'calc(var(--spacing, 0.25rem) * 3)';

/** viewBox width. Arbitrary — only the ratios matter — but round is readable. */
const SPAN = 1000;
/** viewBox height, in user units, equal to the rendered height (`h-10`). */
const DEPTH = 40;
/** The collector point: the container's centre, which is the gateway's centre. */
const MID = SPAN / 2;

/**
 * One connector, from a column centre down to the collector point.
 *
 * A cubic that leaves vertically and arrives vertically — the org-chart elbow —
 * rather than a straight diagonal. A diagonal across a 40px-tall, 1000px-wide
 * box is a nearly-horizontal line that reads as a stray rule; the curve reads
 * as flow into the box below it.
 *
 * The single-column case is not special-cased and does not need to be: with
 * `x === MID` both control points collapse onto the same vertical and the
 * cubic degenerates to exactly the straight drop that case wants.
 */
function connector(x: number): string {
  return `M ${x} 0 C ${x} ${DEPTH * 0.6}, ${MID} ${DEPTH * 0.4}, ${MID} ${DEPTH}`;
}

/**
 * Drop positions for an N-column grid, in viewBox units, and the inset that
 * makes them land on real card centres. See the header note for the algebra.
 */
function geometry(columns: number): { drops: number[]; inset: string } {
  if (columns === 1) return { drops: [MID], inset: '0px' };

  const drops = Array.from({ length: columns }, (_, i) => (i * SPAN) / (columns - 1));
  // W/2N - (N-1)g/2N, expressed as a percentage plus a gap term.
  const edge = 100 / (2 * columns);
  const gapTerm = (columns - 1) / (2 * columns);
  return { drops, inset: `calc(${edge}% - (${GAP}) * ${gapTerm})` };
}

/**
 * @param columns  How many app cards the grid is showing at this breakpoint.
 *                 One rail is rendered per breakpoint, because a converging
 *                 fan under a single stacked column is not a fan — it is one
 *                 line, and that is what `columns={1}` draws.
 * @param className  Breakpoint visibility, supplied by the caller.
 * @param kind  Which of the diagram's two rails this is: the apps → gateway
 *              `fan`, or the gateway → spine `drop`. Emitted as the value of
 *              `data-arch-rail`, which is what lets ArchitectureDraw sequence
 *              the two — the fan draws, the gateway pulses, *then* the drop
 *              draws. The CSS in globals.css selects on the attribute's
 *              presence (`[data-arch-rail]`), so it is unaffected by the value
 *              and the no-JS/reduced-motion path is exactly as it was.
 */
export function ArchitectureRail({
  columns,
  className,
  kind = 'fan',
}: {
  columns: 1 | 2 | 4;
  className?: string;
  kind?: 'fan' | 'drop';
}) {
  const { drops, inset } = geometry(columns);

  return (
    /*
      The inset lives on a wrapper <div>, not on the <svg>, and that is load-
      bearing rather than tidiness. The rail is a flex item; a block-level item
      with `width: auto` is stretched to the container's width *minus its own
      margins*, which is exactly the geometry above. Putting the margins on an
      element that also carries `w-full` instead sets the width to the full
      container and then pushes it outward — measured, the four drops came out
      spaced 372.7px apart against card centres 282.5px apart at 1280px, with
      only the first one landing correctly because only its inset was applied
      before the width was resolved.

      -my-5 cancels the flex parent's `gap-5` on both sides so the rail meets
      the boxes above and below it rather than floating in 80px of air. It
      tracks that gap; change one and change the other.
    */
    /*
      `data-arch-cols` is how ArchitectureDraw picks the *rendered* rail. Three
      fans exist in the DOM at once and two of them are `display: none`, so a
      bare `[data-arch-rail="fan"]` selector would return paths that are not on
      screen and tween them for nothing. The island's `gsap.matchMedia` branch
      already knows the width, so it names the column count it wants rather than
      measuring which sibling is visible.
    */
    <div
      data-arch-cols={columns}
      className={cn('-my-5', className)}
      style={{ marginInline: inset }}
    >
      <svg
        viewBox={`0 0 ${SPAN} ${DEPTH}`}
        preserveAspectRatio="none"
        className="block h-10 w-full"
        role="presentation"
        aria-hidden="true"
      >
        {drops.map((x, i) => (
          <path
            key={x}
            data-arch-rail={kind}
            d={connector(x)}
            pathLength="100"
            fill="none"
            stroke="var(--color-accent-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            /* Draw + Stagger composed: the lines arrive 70ms apart, in the
               deck's band, via the same helper every other staggered group
               uses — so the fan reads as four things converging rather than as
               one wire being pulled across. */
            style={{ animationDelay: `${stagger(i)}ms` }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * The apps → gateway fan, at all three of the grid's column counts.
 *
 * Rendered as three siblings with breakpoint visibility rather than one
 * measured element: a `display: none` rail is not a flex item, so exactly one
 * participates in layout at any width and the negative margins above stay
 * correct. The breakpoints mirror `platform.tsx`'s
 * `grid sm:grid-cols-2 lg:grid-cols-4` and must move with it.
 */
export function ArchitectureFan() {
  return (
    <>
      <ArchitectureRail columns={1} className="sm:hidden" />
      <ArchitectureRail columns={2} className="hidden sm:block lg:hidden" />
      <ArchitectureRail columns={4} className="hidden lg:block" />
    </>
  );
}
