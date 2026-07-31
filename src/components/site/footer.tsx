import Link from 'next/link';
import { FOOTER_COLUMNS, SITE } from '@/content/site';
import { Container } from './primitives';
import { Logo } from './logo';

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <Container width="wide" className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2.4fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-[min(34ch,100%)] text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {SITE.description}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.label} className="flex flex-col gap-3">
                <h2 className="text-label text-[var(--color-fg-subtle)]">{column.label}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links?.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} RocketCRM. All rights reserved.</p>
          <p>
            Product claims on this site are traceable to the platform’s source. Sample data is
            fictional and labelled.
          </p>
        </div>
      </Container>
    </footer>
  );
}
