import Link from 'next/link';
import { Button, Container } from '@/components/site/primitives';
import { CLUSTERS } from '@/content/clusters';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-aurora">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
      <Container className="relative">
        <div className="flex flex-col items-start gap-7 py-24 sm:py-32">
          <p className="text-label text-[var(--color-fg-subtle)]">404</p>
          <h1 className="text-display-2 max-w-[min(18ch,100%)]">That page isn’t here.</h1>
          <p className="max-w-[min(52ch,100%)] text-body-lg text-[var(--color-fg-muted)]">
            Either the link is wrong or we moved something without leaving a redirect. If you got
            here from a link on this site, that is our fault — tell us and we will fix it.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href="/">Back to the homepage</Button>
            <Button href="/company/contact" variant="secondary">
              Report a broken link
            </Button>
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <p className="text-label text-[var(--color-fg-subtle)]">Or jump to a product area</p>
            <ul className="flex flex-wrap gap-2">
              {CLUSTERS.map((cluster) => (
                <li key={cluster.id}>
                  <Link
                    href={cluster.href}
                    className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
                  >
                    {cluster.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
