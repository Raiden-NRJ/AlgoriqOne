import { devices } from '@/content/homepage';
import { Container, Section, SectionHeading } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';

/**
 * §11 Works everywhere — beat 5.
 *
 * Device frames are CSS/SVG, not images: resolution-independent and ~2KB
 * instead of ~200KB (docs/10 §6). Each frame shows the screen that device is
 * actually used for — phone shows approvals, because approving from a phone is
 * the real mobile job. Showing one desktop screenshot in every frame is the
 * classic tell, and is not done here.
 *
 * The copy is deliberately honest: responsive web plus an installable PWA. No
 * native app claim, because there is no native app.
 */
export function Devices() {
  return (
    <Section>
      <Container width="wide" className="flex flex-col gap-14">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <SectionHeading
            align="center"
            eyebrow={devices.eyebrow}
            title={devices.headline}
            description={devices.sub}
          />
        </Reveal>

        <Reveal>
          <div className="grid items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.7fr]">
            <DeviceFrame kind="desktop" label="Desktop — the full working interface">
              <MiniBoard />
            </DeviceFrame>
            <DeviceFrame kind="tablet" label="Tablet — dashboards and review">
              <MiniDashboard />
            </DeviceFrame>
            <DeviceFrame kind="phone" label="Phone — approvals on the move">
              <MiniApprovals />
            </DeviceFrame>
          </div>
        </Reveal>

        <Reveal className="mx-auto max-w-[min(62ch,100%)] text-center">
          <p className="text-sm leading-relaxed text-[var(--color-fg-subtle)]">{devices.honesty}</p>
        </Reveal>
      </Container>
    </Section>
  );
}

function DeviceFrame({
  kind,
  label,
  children,
}: {
  kind: 'desktop' | 'tablet' | 'phone';
  label: string;
  children: React.ReactNode;
}) {
  const shells = {
    desktop: 'rounded-[var(--radius-lg)] p-2',
    tablet: 'rounded-[var(--radius-lg)] p-2.5',
    phone: 'rounded-[var(--radius-xl)] p-2 max-w-[13rem] mx-auto sm:mx-0',
  } as const;

  const heights = {
    desktop: 'h-56',
    tablet: 'h-48',
    phone: 'h-64',
  } as const;

  return (
    <figure className="flex flex-col gap-3">
      {/*
        Illustrations of the interface at each size, treated exactly as a
        screenshot would be: hidden from assistive technology, with the caption
        carrying the meaning. Their small type is therefore exempt from the 12px
        content minimum — it is a depiction of an interface, not body copy.
      */}
      <div
        aria-hidden="true"
        className={`border border-[var(--color-border-strong)] bg-[var(--color-neutral-900)] shadow-[var(--shadow-e3)] ${shells[kind]}`}
      >
        {kind === 'phone' ? (
          <div
            aria-hidden
            className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-[var(--color-neutral-700)]"
          />
        ) : null}
        <div
          className={`overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)] ${heights[kind]}`}
        >
          {children}
        </div>
      </div>
      <figcaption className="text-xs text-[var(--color-fg-subtle)]">{label}</figcaption>
    </figure>
  );
}

function MiniBoard() {
  const columns = [
    { name: 'Backlog', items: ['Data migration plan', 'Field mapping'] },
    { name: 'In progress', items: ['Pipeline import', 'SSO setup'] },
    { name: 'Review', items: ['Approval chains'] },
  ];
  return (
    <div className="flex h-full gap-2 p-3">
      {columns.map((column) => (
        <div key={column.name} className="flex flex-1 flex-col gap-1.5">
          <span className="text-[0.625rem] font-semibold text-[var(--color-fg-muted)]">
            {column.name}
          </span>
          {column.items.map((item) => (
            <span
              key={item}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2 py-1.5 text-[0.625rem] leading-tight text-[var(--color-fg-muted)]"
            >
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniDashboard() {
  const bars = [58, 74, 41, 88, 63];
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <span className="text-[0.625rem] font-semibold text-[var(--color-fg-muted)]">
        Utilisation this quarter
      </span>
      <div className="flex flex-1 items-end gap-2">
        {bars.map((height, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-[var(--radius-sm)] bg-[var(--color-brand-600)]/85"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function MiniApprovals() {
  const rows = ['Timesheet · Ava K.', 'Deal · Vertex', 'Leave · Noah C.'];
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <span className="text-[0.625rem] font-semibold text-[var(--color-fg-muted)]">
        My actions · 3
      </span>
      {rows.map((row) => (
        <div
          key={row}
          className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-2"
        >
          <span className="truncate text-[0.625rem] text-[var(--color-fg-muted)]">{row}</span>
          <span className="shrink-0 rounded-[3px] bg-[var(--color-brand-600)] px-1.5 py-0.5 text-[0.5625rem] font-semibold text-white">
            OK
          </span>
        </div>
      ))}
    </div>
  );
}
