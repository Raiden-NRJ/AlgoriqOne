# 15 — Content & Copy System

**Depends on:** `01` (voice), `11` §5 (content architecture).
**Purpose:** the writing standard, the content model, and the review process — so 45 pages read as
though one person wrote them on their best day.

---

## 1. The copy standard

Every piece of copy on the site passes six checks before it ships:

1. **Specific.** Could a competitor put this exact sentence on their site? If yes, rewrite it.
   *"Enterprise-grade security"* fails. *"Deny-by-default authorization enforced in all 30 services"*
   passes.
2. **True.** Traceable to `00-audit-and-inventory.md`. If it isn't built, it isn't claimed.
3. **Useful.** Tells the reader something that changes their decision. Cut anything that only fills a
   layout.
4. **Short.** Headlines ≤ 8 words where possible. Body sentences average ≤ 20 words. Cut every adverb
   that isn't load-bearing.
5. **Human.** Read it aloud. If it sounds like a press release, it's wrong.
6. **Consistent.** Uses the nomenclature table (`01` §7) and the banned-word list (`01` §6).

**Banned words** (from `01` §6, repeated here because this is where it gets enforced): leverage,
seamless, revolutionary, game-changing, cutting-edge, best-in-class, synergy, unlock, supercharge,
10x, empower, robust, powerful, next-generation, world-class. A lint rule checks the content modules
for these and warns.

---

## 2. Copy patterns by surface

| Surface | Pattern | Length |
|---|---|---|
| Hero headline | Outcome, not category. Two lines max. | ≤ 10 words |
| Hero sub | What it is + who for + the mechanism | ≤ 40 words |
| Eyebrow | Category label, sentence case, no period | 2–5 words |
| Section heading | A claim or a question, never a noun phrase ("Analytics") | ≤ 8 words |
| Section intro | One sentence that earns the section | ≤ 30 words |
| Feature card title | Verb-led where possible | 2–5 words |
| Feature card body | Mechanism + benefit, in that order | ≤ 25 words |
| Bullet | Parallel grammar across the set; no trailing periods on fragments | ≤ 12 words |
| CTA button | Verb + object. "Start free", "See pricing", "Read the architecture" | 2–4 words |
| Microcopy under CTA | Removes the last objection ("No credit card required") | ≤ 8 words |
| Form label | Plain noun ("Work email") | 1–3 words |
| Error message | What happened + what to do. Never blame the user. | ≤ 15 words |
| Empty state | What goes here + how to fill it | ≤ 20 words |
| FAQ answer | Direct answer in sentence one. Detail after. | ≤ 80 words |
| Alt text | What the image shows, in context | ≤ 20 words |
| Meta description | The page's promise, with the primary keyword, written for a human | ≤ 155 chars |

---

## 3. The content model

Content lives in typed modules (`11` §5). Each section component receives its copy as props — never
hardcoded in JSX. This gives us: reviewable copy diffs, type-checked required fields, a single place
to change a claim that appears on five pages, and a translation-ready structure.

```ts
// content/homepage.ts (shape)
export const hero = {
  eyebrow: 'One platform for revenue, delivery and people',
  headline: ['Revenue, delivery, and people.', 'One permission model.'],
  sub: '…',
  primaryCta:  { label: 'Start free',      href: '/signup' },
  secondaryCta:{ label: 'See it working',  href: '#overview' },
  proofPoints: ['Free 14-day trial', 'No credit card', 'Self-hosted option available'],
} satisfies HeroContent;
```

Zod schemas validate every module at build time. A missing `alt`, an over-length meta description, or
a banned word fails or warns at build — the standard is enforced by the compiler, not by memory.

**Single-source claims.** The six cluster definitions live in `content/clusters.ts` and feed the nav,
homepage §7, and the product pages. A capability described in one place is described everywhere the
same way.

---

## 4. Editorial content

### `/resources/blog`
Already live from `knowledge-base-service`. Editorial line: publish what we know that others can't
copy — architecture decisions, RBAC design, multi-tenancy trade-offs, building an approval engine,
migration write-ups. **No SEO filler, no "10 tips for sales teams".** The audience we want (CTOs,
platform leads) can smell content marketing and will discount everything else on the site because of it.

Cadence matters more than volume: one substantial piece a month beats four thin ones.

### `/resources/changelog`
Live from `releases-service`. Dated, honest, including fixes. A changelog that only lists features
reads as marketing; one that lists fixes reads as a real engineering team.

### `/resources/guides`
Long-form, practical: migrating from a three-system stack, designing your permission model, rolling
out approvals, setting up SSO. Each ends with a genuine next step, not a demo request.

---

## 5. Localization readiness

The platform ships an i18n runtime (next-intl in all three product apps) and tenant translations. The
site is built translation-ready even though it launches in English:
- All copy in content modules, none in JSX.
- No concatenated sentences; no string interpolation that assumes English word order.
- Layouts tolerate +35% string expansion (German/French) without breaking — verified with a
  pseudo-localization pass in the responsive review.
- Logical CSS properties (`margin-inline`, `padding-block`) so RTL is a stylesheet change.
- Dates, numbers and currency via `Intl`, never hand-formatted.

Launch locales: English. Next: whatever the first non-English customer needs — decided by demand,
not by guess.

---

## 6. Review process

Every copy change passes:
1. **Author** — writes to the patterns above.
2. **Truth check** — a reviewer verifies each claim against the codebase. Not a formality: this is the
   check that keeps working rule #1 real.
3. **Voice check** — banned words, sentence length, reading aloud.
4. **Legal check** — required for anything on `/security`, `/pricing`, `/compare`, and any claim about
   compliance, availability, or a competitor.
5. **A11y check** — alt text, link text ("Read the architecture", never "click here"), heading order.

Copy ships in the same PR as the layout it belongs to, so it is reviewed in place, at the right line
length, in both themes.

## Completion Status

- [ ] Content modules created and zod-validated
- [ ] Banned-word lint rule
- [ ] Homepage copy written and truth-checked
- [ ] All 45 page copies written and truth-checked
- [ ] Meta titles/descriptions unique per page, within limits
- [ ] Alt text for every image
- [ ] Pseudo-localization expansion pass
- [ ] Review process agreed and applied
