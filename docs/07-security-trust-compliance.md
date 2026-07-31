# 07 — Security, Trust & Compliance Surfaces

**Depends on:** `00` (what's actually built), `01` (CISO in the buying committee).
**Purpose:** the pages and components that get Algoryq One through procurement — and the rules that keep
us out of legal trouble while doing it.

This is the highest-risk document in the folder. Overstating a compliance posture is not a marketing
error; it is a misrepresentation that can void a contract and, in some jurisdictions, attract
regulatory attention. Every rule below is binding.

---

## 1. The honesty contract

| We may say | We may **not** say |
|---|---|
| "SOC 2-ready architecture" | "SOC 2 certified", "SOC 2 compliant", or any SOC 2 badge |
| "GDPR data-subject request flows implemented (export + erasure)" | "GDPR compliant" as an unqualified claim |
| "Encrypted in transit (TLS 1.2+) and at rest" — **after verifying the deployed config** | Any specific cipher/key-length claim not verified in `infrastructure/` |
| "Deny-by-default authorization enforced in all 30 services" | "Zero trust" as a bare buzzword |
| "Append-only audit log with change diffs and hash-chain tamper evidence" | "Immutable" without qualifying that it is append-only at the application layer |
| "Automated backups with geo-redundant retention (Terraform-configured)" | An RPO/RTO number until a restore drill has actually been run and documented |
| "Designed for 99.9% availability" | "99.9% uptime SLA" until Legal approves a contractual SLA |
| "SSO via OIDC and SAML; SCIM v2 user provisioning" | Named IdP certifications (Okta Verified, Azure AD Gallery) until we're actually listed |

**Badge rule:** no compliance mark, seal, or shield graphic renders on the site until the corresponding
report or certificate exists and is on file. The `ComplianceBadges` component reads
`website/content/certifications.json` and renders nothing when it is empty. There is no override.

**Review rule:** every page under `/security` requires sign-off from whoever owns security at
Algoryq One before publish, and a re-review whenever the underlying implementation changes.

---

## 2. `/security` — the trust centre hub

Structure:

1. **Hero** — *"Security you can verify, not just read about."* Sub: the three things we do differently
   (enforcement in every service, one audit trail, portable deployment).
2. **The trust boundary** — an `ArchitectureDiagram` variant showing exactly what the gateway does:
   validates the JWT, **strips spoofable identity headers**, stamps `x-user-id` / `x-tenant-id`, rate
   limits, and proxies. Then the second layer: in-cluster network policies and an internal-auth header
   so a service will not answer a request that didn't come through the gateway. Explaining the header-
   stripping detail is exactly the kind of specificity that convinces a security reviewer we're real.
3. **Control domains** — six cards, each expanding to the mechanism, matching homepage §13:
   authorization · identity · audit · isolation · privacy · operations.
4. **Compliance posture** — a plain table: control area / what's implemented / evidence available /
   status. Statuses are only: *Implemented* · *In progress* · *Planned*. No green checkmarks that
   imply certification.
5. **Sub-processors & data flow** — where data goes, which providers touch it, per deployment mode.
   Required for any GDPR conversation and almost always requested.
6. **Deployment & residency** — Azure-first, region choice, self-hosted via Compose/Helm. Portability
   is stated as a security property: *"you can take it with you"*.
7. **Responsible disclosure** — a real `security.txt`, a reporting address, and a stated response
   window. Cheap to publish, disproportionately credibility-building.
8. **Documentation for review** — what we'll provide under NDA: architecture docs, penetration-test
   results (when they exist), the RBAC catalog, the audit schema, the DR runbook.

---

## 3. `/security/permissions` — the wedge page

The deepest page on the site, aimed at the reviewer who wants to break the claim.

- **The claim, stated precisely:** authorization is enforced server-side in every service, deny by
  default. The UI's permission gating is a UX layer and we say so explicitly — admitting that the
  frontend is not a security boundary is a credibility move that most vendors won't make.
- **The catalog** — the `module.resource.action` convention, wildcard expansion (`crm.lead.*`,
  `crm.*`, `*`), and the standard action set per module. Show real keys.
- **Beyond roles** — per-user ALLOW/DENY overrides with expiry (DENY wins), out-of-office delegation
  with a time window, approval-based access requests, and scoped assignments (global / org-unit /
  record). This combination is genuinely uncommon in mid-market platforms and is the section that wins
  the page.
- **Resolution order** — published openly: `DENY override → ALLOW override → role grants (nearest
  scope wins) → delegation (within window) → default deny`. Publishing your resolution algorithm is a
  confidence signal.
- **Revocation** — permission-version invalidation, so a role change propagates without waiting for a
  re-login. Directly answers the offboarding question every CISO asks.
- **Interactive matrix** — the homepage's `PermissionMatrix`, expanded: pick a role, see every key,
  see the resulting UI, see the API response a denied call would get (`403` with the standard envelope).
- **Verification** — how we test it: guard contract tests per service, and a Playwright authz sweep
  generated from the live gateway route table. *"We test that unauthorized calls fail"* is a sentence
  very few competitors can write.

---

## 4. `/security/compliance`

GDPR data-subject requests (intake → verify → export/erase → evidence in the audit trail), retention
policies, legal hold, consent records, and the crypto-shredding/tombstone approach that reconciles
erasure with an append-only audit log. That reconciliation is a genuinely hard problem, and explaining
how we solved it is more persuasive than any badge would be.

Also: the DPA, sub-processor list, and a privacy-by-design summary. Each links to the legal document.

---

## 5. `/security/infrastructure`

Hosting model, tenant isolation (database-per-service plus tenant-stamped queries), network policies,
secrets handling, backup configuration and retention, disaster-recovery approach with the documented
failover runbook, and observability (structured logs, metrics, traces).

**Portability section** — a differentiator worth its own heading: no cloud-provider SDKs in application
code, driver-selected adapters (`STORAGE_DRIVER=azure-blob|s3|local`), a documented env-var failover
matrix, and a Compose stack that boots the entire platform. For a buyer who has been burned by lock-in,
this is the strongest paragraph on the site.

**RPO/RTO:** stays absent until a restore drill is run and documented. Then it appears with the drill
date. Not before.

---

## 6. `/status` and `/changelog`

Two low-effort, high-trust surfaces:

- **Status** — links to the real status page once one exists; until then, `/security/infrastructure`
  describes the monitoring stack honestly. Do not ship a fake status page with green dots.
- **Changelog** — powered by `releases-service`, which already stores releases, changelog entries and
  deployments. A live, dated, public changelog is one of the cheapest and most convincing trust
  signals available to us, and the data is already there. **Build this early** — it is high value per
  hour of work.

---

## 7. Trust components (shared)

| Component | Data source | Empty behaviour |
|---|---|---|
| `TrustBar` | `content/customers.json` | Engineering-proof band (`04` §2) |
| `TestimonialsSection` | `content/testimonials.json` | Does not render |
| `CaseStudyGrid` | `content/case-studies.json` | Founding-customers offer |
| `ComplianceBadges` | `content/certifications.json` | Does not render |
| `ControlTable` | `content/controls.json` | Always renders — this is our real proof |
| `ChangelogFeed` | `releases-service` (live) | Falls back to last static snapshot |
| `SecurityContactBlock` | static | Always renders |

All content files are typed and schema-validated at build time. A malformed entry fails the build
rather than rendering a broken or misleading claim.

## Completion Status

- [ ] Honesty contract circulated and agreed with whoever owns security + Legal
- [ ] `/security` hub built
- [ ] `/security/permissions` built (deepest page, interactive matrix)
- [ ] `/security/compliance` built
- [ ] `/security/infrastructure` built
- [ ] `security.txt` + disclosure policy published
- [ ] `/changelog` wired to `releases-service`
- [ ] All gated components verified to render nothing (not placeholders) when content is absent
