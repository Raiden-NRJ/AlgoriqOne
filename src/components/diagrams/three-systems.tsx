/**
 * The problem diagram (docs/10 §7): three systems held together by brittle
 * integrations. The visual argument is that the integration layer is the
 * failure, not the tools.
 *
 * Authored as SVG with a text equivalent — accessible, theme-aware, printable,
 * and static under reduced motion (no animation is used here at all; the
 * argument reads instantly and does not need one).
 */
export function ThreeSystemsDiagram() {
  const systems = [
    { label: 'CRM', sub: 'Customers, deals' },
    { label: 'PSA', sub: 'Projects, time' },
    { label: 'HRMS', sub: 'People, leave' },
  ];

  const links = [
    'Nightly sync',
    'CSV export',
    'Manual re-key',
  ];

  return (
    <figure className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] sm:p-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {systems.map((system) => (
            <div
              key={system.label}
              className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2 py-4 text-center sm:px-4"
            >
              <span className="text-sm font-semibold">{system.label}</span>
              <span className="text-xs leading-tight text-[var(--color-fg-subtle)]">
                {system.sub}
              </span>
            </div>
          ))}
        </div>

        {/* The brittle middle */}
        <div className="relative my-5 flex items-center justify-center" aria-hidden="true">
          <svg
            viewBox="0 0 320 64"
            className="h-16 w-full text-[var(--color-border-strong)]"
            role="presentation"
          >
            <path
              d="M53 4 C53 32, 160 32, 160 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M160 4 L160 60"
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.65"
            />
            <path
              d="M267 4 C267 32, 160 32, 160 60"
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.65"
            />
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {links.map((link) => (
            <span
              key={link}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-subtle)]"
            >
              {link}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-danger)]/40 bg-[var(--color-danger)]/6 px-4 py-3 text-center">
          <p className="text-sm font-medium text-[var(--color-fg)]">
            Three permission models. Three audit trails.
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
            Nothing in the middle is a system of record.
          </p>
        </div>
      </div>

      <figcaption className="sr-only">
        Diagram: a CRM, a PSA and an HRMS connected by nightly syncs, CSV exports and manual
        re-keying. Each system keeps its own permission model and audit trail, so no single system
        is authoritative.
      </figcaption>
    </figure>
  );
}
