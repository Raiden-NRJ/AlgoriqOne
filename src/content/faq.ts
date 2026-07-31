/** The six questions that actually block deals (docs/01 §10). */

export interface FaqItem {
  question: string;
  answer: string;
  /** Shown on the homepage, or only on /faq. */
  homepage: boolean;
}

export const FAQS: FaqItem[] = [
  {
    question: 'Can we migrate our existing data?',
    answer:
      'Yes. There is a CSV/Excel import wizard with column mapping, validation and a dry run before anything is committed, plus a REST API for anything the wizard doesn’t cover. Realistically, contacts, companies, projects and employees import cleanly; historical activity and custom-shaped data usually need a mapping pass. We will tell you which is which before you start.',
    homepage: true,
  },
  {
    question: 'Will our team actually use it?',
    answer:
      'The four applications share one design system, so the CRM, the project board and the timesheet all behave the same way. There is a command palette, keyboard paths for every interaction including drag-and-drop, and a single approvals inbox instead of four. You can try the whole thing before talking to anyone.',
    homepage: true,
  },
  {
    question: 'How do you handle security and access control?',
    answer:
      'Authorization is enforced server-side in all 30 services, deny by default — not hidden in the interface. One permission catalog covers every module, with per-user grants and denies, expiry dates, delegation and scoped assignments. Every change lands in an append-only audit log with per-field diffs. The full detail is on the security pages, without an NDA.',
    homepage: true,
  },
  {
    question: 'What happens to our data if we leave?',
    answer:
      'You export it. Every list has CSV export, every module has a REST API, and the platform runs from a Docker Compose stack you can host yourself. We also publish the failover path away from our primary cloud. Portability is a design constraint here, not a concession.',
    homepage: true,
  },
  {
    question: 'How much can we customize without engineering help?',
    answer:
      'Custom fields on any entity per tenant — they appear in forms, tables, filters and the API automatically. Approval workflows are built in a visual designer rather than configured by us. Modules can be turned on and off per tenant with feature flags. Branding, domains and locale are tenant-level settings.',
    homepage: true,
  },
  {
    question: 'How long does implementation take?',
    answer:
      'A workspace is provisioned in minutes and you can be working in it the same day. A realistic full rollout for a few hundred people — data import, permission model, approval chains, integrations — is measured in weeks, not quarters. We would rather tell you that than quote a number we can’t hold.',
    homepage: true,
  },
];

export const HOMEPAGE_FAQS = FAQS.filter((f) => f.homepage);
