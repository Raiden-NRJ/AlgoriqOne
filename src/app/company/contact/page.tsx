import type { Metadata } from 'next';
import { CONTACT } from '@/content/site';
import { PageHero } from '@/components/page/page-template';
import { Container, Section } from '@/components/site/primitives';
import { Reveal } from '@/components/site/reveal';
import { ContactForm } from '@/components/interactive/contact-form';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Ask a question, request a quote, or send this to your security reviewer. We reply to everything within one business day.',
  alternates: { canonical: '/company/contact' },
};

const ROUTES = [
  {
    heading: 'Evaluating the platform',
    body: 'Public and ungated — no call needed.',
    links: [
      { label: 'Interactive demo', href: '/demo' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security centre', href: '/security' },
    ],
  },
  {
    heading: 'Technical review',
    body: 'Written for whoever owns this after the contract.',
    links: [
      { label: 'Architecture', href: '/platform/architecture' },
      { label: 'How authorization works', href: '/security/permissions' },
      { label: 'Developer platform', href: '/developers' },
    ],
  },
  {
    heading: 'Security disclosure',
    body: `Email ${CONTACT.security}. Acknowledged within two business days, and no legal action against good-faith research.`,
    links: [],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Ask us the awkward question."
        intro="We would rather answer it now than have you discover the answer in month three. If we cannot do something, we will say so."
      />

      <Section>
        <Container width="wide" className="grid gap-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={70} className="flex flex-col gap-8">
            {ROUTES.map((route) => (
              <div key={route.heading} className="flex flex-col gap-2">
                <h2 className="text-base font-semibold">{route.heading}</h2>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{route.body}</p>
                {route.links.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    {route.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm font-medium text-[var(--color-link)] underline decoration-[var(--color-link)]/50 underline-offset-4"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
