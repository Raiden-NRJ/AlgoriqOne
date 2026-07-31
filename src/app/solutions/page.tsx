import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { INDUSTRY_IDS, INDUSTRY_PAGES, ROLE_IDS, ROLE_PAGES } from '@/content/pages-solutions';

export const metadata: Metadata = {
  title: 'Solutions — by industry and by role',
  description:
    'Professional services, agencies and technology companies; sales, delivery, people, IT and finance leaders. Find the version of this written for you.',
  alternates: { canonical: '/solutions' },
};

export default function SolutionsIndexPage() {
  const industries = INDUSTRY_IDS.map((id) => ({ id, page: INDUSTRY_PAGES[id], href: `/solutions/${id}` }));
  const roles = ROLE_IDS.map((id) => ({ id, page: ROLE_PAGES[id], href: `/solutions/by-role/${id}` }));

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Find the version of this written for you."
        intro="The product pages describe what the platform does. These describe what it does for a particular shape of company, or a particular job."
      />

      <Section>
        <Container width="wide" className="flex flex-col gap-14">
          {[
            { heading: 'By industry', items: industries },
            { heading: 'By role', items: roles },
          ].map((group) => (
            <Reveal key={group.heading} className="flex flex-col gap-6">
              <h2 className="text-h2">{group.heading}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex h-full flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-e2)]"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold">{item.page.eyebrow}</span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-600)]"
                        />
                      </span>
                      <span className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                        {item.page.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
