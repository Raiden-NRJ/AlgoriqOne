/**
 * GATED TRUST CONTENT.
 *
 * These arrays are empty because RocketCRM has no customer logos, testimonials,
 * case studies, or compliance certifications on file — and inventing them is
 * forbidden (website/CLAUDE.md rule 1, docs/07 §1).
 *
 * The components that read them render an honest alternative when empty, and
 * the real thing the moment real, permissioned content is added here. Adding an
 * entry is a content change, not an engineering task.
 */

export interface CustomerLogo {
  name: string;
  /** Path under /public. */
  logo: string;
  /** Must be true — written permission on file. No exceptions. */
  permissionGranted: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Written approval on file. */
  approved: boolean;
}

export interface CaseStudy {
  slug: string;
  company: string;
  headline: string;
  /** A metric the customer stated themselves. */
  metric?: string;
  verifiedAt: string;
}

export interface Certification {
  name: string;
  /** Only set once an auditor's report exists and is on file. */
  reportOnFile: boolean;
  badge: string;
}

export const CUSTOMER_LOGOS: CustomerLogo[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const CASE_STUDIES: CaseStudy[] = [];
export const CERTIFICATIONS: Certification[] = [];

/** A logo wall needs enough logos to look deliberate rather than thin. */
export const MIN_LOGOS = 6;
export const MIN_TESTIMONIALS = 3;

export const hasLogos = () =>
  CUSTOMER_LOGOS.filter((l) => l.permissionGranted).length >= MIN_LOGOS;

export const hasTestimonials = () =>
  TESTIMONIALS.filter((t) => t.approved).length >= MIN_TESTIMONIALS;

/**
 * Security controls — these ARE real and always render. Mechanisms, not
 * adjectives; every one traces to code (docs/00 §2).
 */
export const SECURITY_CONTROLS = [
  {
    area: 'Authorization',
    statement: 'Deny-by-default permission checks in all 30 services — guards, not just UI gating.',
  },
  {
    area: 'Identity',
    statement: 'Argon2id hashing, account lockout, TOTP MFA, refresh rotation, SSO (OIDC/SAML), SCIM provisioning.',
  },
  {
    area: 'Audit',
    statement: 'Append-only log with per-field change diffs and hash-chain tamper evidence.',
  },
  {
    area: 'Isolation',
    statement: 'Database per service, tenant-stamped queries, in-cluster network policies, internal-auth headers.',
  },
  {
    area: 'Privacy',
    statement: 'GDPR data-subject requests: export and erasure flows, retention policies, consent records.',
  },
  {
    area: 'Operations',
    statement: 'Structured logs, Prometheus metrics, OpenTelemetry traces, staged deploys with automatic rollback.',
  },
] as const;

/**
 * Compliance posture. Precise by design: "ready", never "certified".
 * No badge renders until CERTIFICATIONS contains a report on file.
 */
export const COMPLIANCE_STATEMENT =
  'SOC 2-ready architecture with GDPR data-subject request flows implemented. We do not claim certification we do not hold — reports will be available under NDA when an audit completes.';
