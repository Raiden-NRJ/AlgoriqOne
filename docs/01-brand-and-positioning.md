# 01 — Brand, Positioning & Messaging Spine

**Depends on:** `00-audit-and-inventory.md`.
**Purpose:** decide what RocketCRM *means* before deciding what it looks like. Every headline, every
section order, and every CTA on the site derives from this document.

---

## 1. The strategic problem

RocketCRM is a **CRM + PSA + HRMS suite on one permission model** (00 §2). That is a strength as
product and a liability as positioning: "we do everything" is the least credible claim in enterprise
software. Zoho One already owns "everything, cheap". Salesforce owns "everything, enterprise".

We cannot out-breadth them and must not try. We win on a narrower, sharper, provable claim.

## 2. Positioning statement

> **For services businesses of 200–5,000 people whose won deals become projects, whose projects become
> logged hours, and whose hours become invoices — across three systems that don't agree — RocketCRM is
> the platform where that entire chain lives in one place.**
>
> Unlike a CRM that stops at the closed deal, or a PSA that starts after it, every step from lead to
> paid invoice is one continuous record on one permission model.

**The wedge, in five words:** *deal to delivery to cash.*

## 3. Why this wedge and not another

**Chosen 2026-07-31.** The decision was between the operational chain and the governance argument
("one permission model"), and it came down to who owns the budget.

| Candidate wedge | Verdict |
|---|---|
| **"Deal → delivery → cash, in one system"** | **Chosen** — the most concrete, demonstrable in one screen-share, and closest to money. It speaks to the COO/CFO of a services firm, who signs. |
| "One permission model across revenue, delivery, and people" | **Demoted to the proof layer.** It is our deepest moat and the hardest thing to copy — but it is a *governance* argument, which wins the CISO and the CTO, neither of whom usually owns the budget. It now appears as the answer to "why can I trust this chain?", which is where it is strongest. |
| "The suite that was actually built as a suite" | Rejected as primary — broad and easy to grasp, but it is a claim about us rather than about the buyer's problem, and harder to prove in a 30-minute demo. Retained as comparison-page framing. |
| "Open, portable, no lock-in" | Adopted as the **secondary** wedge — carries the security and infrastructure story. |
| "All-in-one suite" | Rejected — undifferentiated, invites a feature-checklist comparison we lose. |
| "AI-first CRM" | Rejected — assistant-service is real but not our deepest asset; the category is saturated. |
| "Affordable Salesforce alternative" | Rejected — races to the bottom, attracts the wrong buyer. |

**The cost of this choice, stated plainly:** naming the delivery chain puts us in the PSA category, so
we compete with Kantata and Certinia rather than Salesforce, and the HR modules become supporting cast
rather than headline. That is an acceptable trade — the PSA category is where our chain is genuinely
better, and "CRM that also does HR" was never going to beat Zoho on breadth anyway.

**The layering that makes this work:** the chain is the *promise*; the shared permission model is the
*reason the promise is credible*. Sections 1–4 sell the chain; sections 5–6 prove it cannot drift.

## 4. Ideal customer profile

**Primary:** 200–5,000 employees. Services-led or hybrid (consultancies, agencies, systems
integrators, professional services, product companies with delivery orgs). Already running a CRM +
a PSA/PM tool + an HRMS, and paying an integration tax between them. Has a compliance function.

**Buying committee, and what each one needs from the homepage:**

| Role | The question they arrive with | Section that answers it | Their proof |
|---|---|---|---|
| CEO / COO | "Will this actually consolidate three systems?" | Story + platform map | The service map, the module clusters |
| CRO / Sales Head | "Will my team use it?" | Revenue cluster + pipeline | Real pipeline/deal screenshots |
| Delivery / PMO Head | "Does it handle projects, WBS, time?" | Delivery cluster | Timesheet + WBS + Kanban screens |
| CHRO | "Is the HR side real or a checkbox?" | People cluster | Leave/attendance/performance/recruitment services |
| **CTO / Platform lead** | "What am I inheriting?" | Architecture + API + extensibility | 30 services, gateway, SDK, webhooks, compose stack |
| **CISO / Procurement** | "Can I sign this off?" | Security & Trust | RBAC catalog, audit hash chain, SSO/SCIM, DSR flows, DR runbook |
| CFO | "What's the real cost?" | Pricing + ROI | Live plans, ROI calculator, consolidation math |

**The CTO and CISO are our highest-leverage visitors** — they are the ones who can verify our claims,
and the only ones who will be *more* impressed the deeper they look. The site is deliberately built to
reward technical scrutiny. That is a strategy, not a nicety.

## 5. Brand attributes

Five, ranked. Every design and copy decision resolves in this order when they conflict.

1. **Substantiated** — every claim has a receipt. This is the core of the brand; it is why the site
   shows a service map instead of a stock photo.
2. **Composed** — enterprise calm. Generous space, restrained motion, no exclamation marks, no
   urgency theatre, no "🚀 Supercharge your workflow".
3. **Precise** — Linear/Stripe register. Exact numbers, exact nouns, tight sentences.
4. **Warm** — precise is not cold. Real product screenshots of real work, human language, plain words.
5. **Confident** — we do not hedge, apologise, or over-qualify. We also do not shout.

**Anti-attributes (explicitly banned):** playful mascots, gradient blobs as decoration, "AI-powered
everything", countdown timers, fake urgency, stock photography of people in glass offices, animated
counters that spin to arbitrary numbers, chat-bubble popups on load.

## 6. Voice & tone

- **Sentences are short. Claims are specific.** Not "enterprise-grade security" → "Deny-by-default
  authorization enforced in all 30 services, not just the UI."
- **Nouns over adjectives.** "Immutable audit log with change diffs and hash-chain tamper evidence"
  beats "powerful, robust auditing".
- **Second person, active voice.** "You approve a timesheet in one click." Not "Timesheets can be
  approved."
- **Numbers get units and context.** "30 services" alone is trivia; "30 independently deployable
  services behind one gateway — so a CRM incident can't take down payroll" is an argument.
- **Never use:** leverage, seamless, revolutionary, game-changing, cutting-edge, best-in-class,
  synergy, unlock, supercharge, 10x, empower.
- **Do use:** enforce, verify, isolate, consolidate, prove, migrate, own, audit.

## 7. Naming & nomenclature

| Concept | Website term | Never say |
|---|---|---|
| The product | RocketCRM | RocketCRM.io, the RocketCRM |
| The whole thing | "the platform" | "the suite", "the ecosystem" |
| Modules | Revenue / Delivery / People / Service / Intelligence / Platform | "verticals", "pillars" |
| `talentory-service` | **Skills & Learning** | Talentory (internal name only) |
| Customer's tenant | "your workspace" | "your instance", "your org" (ambiguous with org-units) |
| RBAC | "permissions" (headline) / "authorization" (technical pages) | "ACLs", "roles engine" |

## 8. The homepage story (narrative spine)

Nine beats. Every homepage section belongs to exactly one beat; if a section doesn't advance a beat,
it is cut. This spine is what turns 37 requested topics into a keynote instead of a datasheet.

| # | Beat | The visitor's internal state after it |
|---|---|---|
| 1 | **The chain, named** — a won deal becomes a project, becomes logged hours, becomes an invoice. Here it is, end to end. | "That is exactly what my business does." |
| 2 | **Where it breaks** — the handoffs. Sales closes and emails delivery. Delivery finishes and emails finance. Every seam is a re-key. | "That's our Tuesday." |
| 3 | **Why it stayed broken** — a CRM stops at the closed deal and a PSA starts after it, so somebody always owns the gap manually. | "So it's structural, not our fault." |
| 4 | **The claim** — the whole chain is one continuous record, not four systems and three exports. | "That would fix it." |
| 5 | **Proof: the modules** — each link in the chain is a real product, not a tab. | "It's not shallow." |
| 6 | **Proof: the people layer** — resourcing already knows about capacity and approved leave, so the chain reflects reality. | "It won't lie to me." |
| 7 | **Proof: why the chain holds** — one permission model, one audit trail. Approvals are enforced, not implied. | "The numbers are trustworthy." |
| 8 | **Proof of platform and trust** — customize, automate, integrate, secure, and take it with you. | "I can get this signed off." |
| 9 | **The ask** — start free, see plans, or talk to us. Low friction, no dark patterns. | "I'll start." |

## 9. Message hierarchy (the words themselves)

**Primary headline (hero) — chosen:**
> **From won deal to paid invoice, without leaving the platform.**
> RocketCRM connects your pipeline, your delivery team and your billing — so the hours your team logs
> are the hours you invoice, and nobody reconciles three systems to find out.

Alternates held for A/B (`16-analytics-and-experimentation.md`):
- *"Your CRM stops at the closed deal. Your business doesn't."* — sharpest problem framing; test as variant B.
- *"One record, from lead to invoice."* — shortest; test as variant C.
- *"Revenue, delivery, and people. One permission model."* — the previous wedge, retained as variant D
  so the demotion is tested rather than assumed.

**Section-level claims (each must be independently defensible):**

| Link in the chain | Claim | Receipt |
|---|---|---|
| **Deal** | "Pipeline, deals and discount approvals that don't need a spreadsheet on the side." | crm + sales services, deal governance, forecast |
| **Delivery** | "The won deal becomes a project with the client and the commercial terms already attached." | project-service, shared client records |
| **Work** | "Project request → WBS → tasks. One structure, one approval inbox." | wbs + task services, `/actions` inbox |
| **Time** | "Hours logged against the work item, approved once, and billable by construction." | timesheet-service, approval chain |
| **Cash** | "Approved hours reconcile to the invoice — no export, no re-key, no month-end archaeology." | billing-service: invoices, payments, credit notes |
| **People** (supporting) | "Resourcing knows about capacity and approved leave, so the chain reflects who is actually available." | employee + leave + attendance services |
| **Trust** (proof) | "Every approval in that chain is enforced in the service, not implied by the interface." | `@rocketcrm/authz`, deny-by-default across 30 services |

**Closing CTA:** "Start free" (primary) / "See pricing" (secondary) / "Talk to us" (tertiary, always
available in header). No "Book a demo" as primary — it contradicts the brief's own goal of converting
without a sales call.

## 10. Objection map → site response

Every objection in the brief, mapped to the surface that kills it. Any objection without an owning
section is a hole in the site.

| Objection | Owning surface |
|---|---|
| Is it secure? | Security & Trust page + homepage beat 8 |
| Where is my data stored? | Trust page — hosting policy, region, portability |
| Can my team learn it? | Product tour section + onboarding checklist screens |
| Can I migrate? | Import wizard section (`import-wizard` pattern is real) + Migration page |
| Does it scale? | Architecture page — HPA, cursor pagination, read models, load baseline |
| Can I customize? | Customization page — custom fields + workflow designer |
| Does it support mobile? | Device showcase — responsive + PWA, honestly scoped |
| Can it integrate? | Developer page — REST API, typed SDK, API keys, webhooks |
| How much ROI? | ROI calculator (consolidation math, user-supplied inputs only) |
| Can I automate? | Workflow builder section |
| How fast is onboarding? | Onboarding section — provisioning wizard, invitations, import |
| Will my sales team use it? | Revenue module page + real pipeline screens |
| Is the vendor real? | About + changelog (releases-service) + public roadmap |
| What if I want out? | Portability: open API, export on every list, compose stack — **a real differentiator** |

## Completion Status

- [x] Positioning statement + wedge chosen with rejected alternatives recorded
- [x] ICP + buying committee mapped to sections and proof
- [x] Brand attributes, anti-attributes, voice rules
- [x] Nine-beat narrative spine (the homepage's structural contract)
- [x] Headline + section claims, each with a code-level receipt
- [x] Objection → owning-surface map with no orphans
