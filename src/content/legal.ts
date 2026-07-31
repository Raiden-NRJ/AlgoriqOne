/**
 * Legal pages.
 *
 * These are plain-language summaries of intended policy, published so the site
 * is navigable and honest — they are NOT a substitute for counsel-reviewed
 * documents, and each page says so at the top. Do not remove that notice
 * without a lawyer having actually reviewed the text.
 */

export type LegalDocId = 'privacy' | 'terms' | 'accessibility';

export interface LegalDoc {
  id: LegalDocId;
  title: string;
  intro: string;
  /** Shown when the document has not been through legal review. */
  draft: boolean;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
}

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy',
    intro:
      'What this website collects, why, and how to have it removed. Written to be read rather than to be defensible.',
    draft: true,
    sections: [
      {
        heading: 'This website',
        paragraphs: [
          'We use privacy-preserving, cookieless analytics to understand which pages are useful. It does not set tracking cookies, does not follow you across other sites, and does not build a profile of you. That is why you are not being asked to dismiss a consent wall — we do not need one for this.',
        ],
        bullets: [
          'No advertising trackers, no tag manager, no session replay, no heatmaps',
          'Aggregate page and interaction counts only, never raw form input',
          'Core Web Vitals measurements sent to our own endpoint, not a third party',
          'Do Not Track and Global Privacy Control are honoured',
        ],
      },
      {
        heading: 'If you contact us',
        paragraphs: [
          'The contact form collects your name, work email, optional company and your message, so that we can reply. It is stored as a lead record in our own platform. We do not add you to a marketing list unless you ask, and we do not sell or share it.',
        ],
      },
      {
        heading: 'If you use the product',
        paragraphs: [
          'Data you put into a RocketCRM workspace belongs to you. We process it to provide the service. The platform implements GDPR data-subject request flows — export and erasure — and retention policies, so a request is an operation rather than an engineering project.',
        ],
        bullets: [
          'Export your data at any time through the API or CSV export',
          'Erasure requests are handled through the platform’s DSR flow',
          'Audit history is append-only; erasure uses crypto-shredding and tombstones rather than deleting the trail',
        ],
      },
      {
        heading: 'Retention and contact',
        paragraphs: [
          'Website analytics are retained for 24 months, then aggregated and purged. Contact records are kept while the conversation is live and for a reasonable period after. To ask what we hold, or to have it removed, email privacy@rocketcrm.app.',
        ],
      },
    ],
  },

  terms: {
    id: 'terms',
    title: 'Terms',
    intro:
      'A plain-language summary of the terms we intend to operate under. The binding contract is the agreement you sign.',
    draft: true,
    sections: [
      {
        heading: 'The service',
        paragraphs: [
          'RocketCRM provides a multi-tenant software platform. You get a workspace, we keep it running, and you pay per seat for the modules you have enabled.',
        ],
      },
      {
        heading: 'Your data',
        paragraphs: [
          'You own your data. We do not use it to train models, we do not sell it, and we do not share it except where you direct us to or the law requires it. You can export it at any time, including after you cancel and during the retention window.',
        ],
      },
      {
        heading: 'Availability',
        paragraphs: [
          'The platform is designed for high availability, with autoscaling, staged deploys and automatic rollback. We do not publish a contractual availability percentage on this website; where an SLA applies it is stated in your agreement, because a number on a marketing page is not a commitment and should not be read as one.',
        ],
      },
      {
        heading: 'Ending it',
        paragraphs: [
          'You can cancel from the console. At the end of a trial the workspace becomes read-only rather than being deleted, so nothing disappears while you decide. We will not hold your data hostage to a renewal conversation.',
        ],
      },
    ],
  },

  accessibility: {
    id: 'accessibility',
    title: 'Accessibility',
    intro:
      'Our conformance target, how we test, and the limitations we currently know about.',
    draft: false,
    sections: [
      {
        heading: 'Conformance target',
        paragraphs: [
          'This website and the RocketCRM platform target WCAG 2.2 Level AA, with AAA contrast on body text. We treat accessibility as a build gate rather than a review stage.',
        ],
        bullets: [
          'Automated accessibility checks fail the build on violation',
          'Colour contrast is verified by script, not by eye',
          'Every drag interaction in the product has a keyboard equivalent — a “Move to…” menu on every board',
          'Reduced-motion preferences are honoured globally, and the reduced-motion experience is designed rather than stripped',
        ],
      },
      {
        heading: 'How we test',
        paragraphs: [
          'Automated tooling catches roughly a third of real issues, so it is a floor and not a finish line. We combine it with keyboard-only traversal, screen-reader passes, a 400% zoom check and a forced-colors pass.',
        ],
      },
      {
        heading: 'Known limitations',
        paragraphs: [
          'This website has not yet completed its full manual screen-reader matrix — that work is scheduled and not finished, and we would rather say so than imply a clean bill of health. If you hit a barrier, tell us and we will fix it and tell you when it is done.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Email accessibility@rocketcrm.app. We will acknowledge within two business days. A VPAT is available on request for procurement processes that need one.',
        ],
      },
    ],
  },
};

export const LEGAL_DOC_IDS = Object.keys(LEGAL_DOCS) as LegalDocId[];
