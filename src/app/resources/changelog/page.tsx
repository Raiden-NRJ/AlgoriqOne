import type { Metadata } from 'next';
import { PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { formatDate, getReleases } from '@/lib/content-api';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'What shipped, when, including the fixes. Published live from the platform’s own release service.',
  alternates: { canonical: '/resources/changelog' },
};

export const revalidate = 300;

/**
 * A dated public changelog is one of the cheapest and most convincing trust
 * signals available (docs/07 §6) — and the data already exists in the releases
 * service, so this is a query rather than a content programme.
 */
export default async function ChangelogPage() {
  const releases = await getReleases();

  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="What shipped, and when."
        intro="Including the fixes. A changelog that only lists features reads as marketing; one that lists what broke and got repaired reads as an engineering team you can rely on."
      />

      <Section>
        <Container className="flex flex-col gap-12">
          {releases.length > 0 ? (
            <ol className="flex flex-col gap-6">
              {releases.map((release) => (
                <Reveal as="li" key={release.id}>
                  <article className="flex flex-col gap-2 border-l-2 border-[var(--color-brand-300)] pl-6">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h2 className="text-lg font-semibold">{release.title || release.version}</h2>
                      <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-fg-muted)]">
                        {release.version}
                      </span>
                      {formatDate(release.releasedAt) ? (
                        <time
                          dateTime={release.releasedAt}
                          className="text-xs text-[var(--color-fg-subtle)]"
                        >
                          {formatDate(release.releasedAt)}
                        </time>
                      ) : null}
                    </div>
                    {release.notes ? (
                      <p className="whitespace-pre-line leading-relaxed text-[var(--color-fg-muted)]">
                        {release.notes}
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </ol>
          ) : (
            <Reveal>
              <div className="flex max-w-[min(62ch,100%)] flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8">
                <h2 className="text-h2">No releases to show from here.</h2>
                <p className="leading-relaxed text-[var(--color-fg-muted)]">
                  This page reads directly from the platform’s release service, which is not
                  reachable from this environment. We are deliberately not caching a hand-written
                  copy — a changelog that is maintained separately from the deploys it describes
                  stops being true within a month.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>
    </>
  );
}
