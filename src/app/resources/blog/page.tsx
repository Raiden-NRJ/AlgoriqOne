import type { Metadata } from 'next';
import { PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { formatDate, getArticles } from '@/lib/content-api';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Architecture decisions, RBAC design, multi-tenancy trade-offs and migration write-ups — what we know that is worth writing down.',
  alternates: { canonical: '/resources/blog' },
};

export const revalidate = 300;

/**
 * The feed is published by the platform's own knowledge-base service. When it
 * is not reachable, this renders an honest empty state rather than filler.
 */
export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="What we know that is worth writing down."
        intro="Architecture decisions, permission-model design, multi-tenancy trade-offs, migration write-ups. No listicles and no SEO filler — the audience we want can tell."
      />

      <Section>
        <Container width="wide">
          {articles.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Reveal as="li" key={article.id}>
                  <article className="flex h-full flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)]">
                    {article.category ? (
                      <span className="text-label text-[var(--color-fg-subtle)]">
                        {article.category}
                      </span>
                    ) : null}
                    <h2 className="text-lg font-semibold leading-snug">{article.title}</h2>
                    {article.excerpt ? (
                      <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                        {article.excerpt}
                      </p>
                    ) : null}
                    {formatDate(article.publishedAt) ? (
                      <time
                        dateTime={article.publishedAt}
                        className="mt-auto pt-2 text-xs text-[var(--color-fg-subtle)]"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal>
              <div className="flex max-w-[min(62ch,100%)] flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8">
                <h2 className="text-h2">Nothing published here yet.</h2>
                <p className="leading-relaxed text-[var(--color-fg-muted)]">
                  This feed comes from the platform’s own knowledge-base service — the one customers
                  publish their internal documentation with. It is empty or unreachable right now.
                </p>
                <p className="leading-relaxed text-[var(--color-fg-muted)]">
                  We would rather show you an empty page than generate articles to fill it. In the
                  meantime, the{' '}
                  <a
                    href="/platform/architecture"
                    className="font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
                  >
                    architecture page
                  </a>{' '}
                  and{' '}
                  <a
                    href="/security/permissions"
                    className="font-medium text-[var(--color-brand-700)] underline decoration-[var(--color-brand-300)] underline-offset-4"
                  >
                    how authorization works
                  </a>{' '}
                  are the two most substantial things we have written.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>
    </>
  );
}
