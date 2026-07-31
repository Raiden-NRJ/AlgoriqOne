# 16 — Analytics, Experimentation & Privacy

**Depends on:** `08` (conversion), `12` (performance budgets).
**Purpose:** measure what matters, without wrecking performance or privacy — the two things most
analytics implementations quietly destroy.

---

## 1. Principles

1. **Privacy-first by default.** Cookieless, no cross-site tracking, no data broker, no fingerprinting.
   We sell to CISOs; running invasive tracking on our own marketing site would be an argument against
   us that the visitor can see in their network tab.
2. **Performance budget applies to analytics.** ≤ 5KB, loaded on idle or first interaction, never
   render-blocking, never a tag manager. A tag manager defeats every budget in `12-` and inevitably
   accumulates scripts nobody owns.
3. **Measure decisions, not vanity.** Pageviews are context; the funnel is the metric.
4. **Instrument once, in one place** — `lib/analytics.ts` — with a typed event schema. No ad-hoc
   tracking calls scattered through components.
5. **Consent before anything optional.** The `/api/consent` route already exists; use it.

---

## 2. Tooling

| Need | Choice | Why |
|---|---|---|
| Product/marketing analytics | **Plausible** or **Umami** (self-hosted option) | Cookieless, GDPR-friendly, ~1KB, no consent banner required for basic use in most jurisdictions |
| Core Web Vitals (field) | `web-vitals` → own endpoint | Real-user data, ~1.5KB, no third party |
| Error tracking | Sentry, **browser SDK deferred** and sampled | Catch real breakage; sample to stay in budget |
| Session replay | **Not used** | Privacy cost and payload weight outweigh the value for a marketing site |
| A/B testing | Edge middleware + cookie assignment, results in the analytics store | No flicker, no third-party script, no layout shift |
| Heatmaps | **Not used** | Same reasoning as replay; scroll-depth events cover the useful 80% |

Explicitly rejected: Google Tag Manager, Facebook Pixel, LinkedIn Insight, Hotjar, and any chat widget
that loads on page load. If paid-acquisition attribution is later required, it loads **only** on
consent and only on the specific landing pages that need it.

---

## 3. Event schema

Typed, finite, and versioned. Adding an event requires adding it here.

| Event | Properties | Answers |
|---|---|---|
| `page_view` | path, referrer, device class | Traffic shape |
| `cta_click` | label, location (section id), lane | Which CTA in which section works |
| `section_view` | section id, dwell ms | **Where the story loses people** — the key homepage metric |
| `scroll_depth` | 25/50/75/100 | Narrative completion rate |
| `demo_start` / `demo_tab` / `demo_complete` | tab id, duration | Whether §6 replaces a sales call |
| `permission_matrix_interact` | role selected | Whether the wedge lands |
| `roi_calculate` | inputs bucketed (never raw), result bucketed | ICP shape + whether ROI persuades |
| `pricing_toggle` | monthly/annual | Pricing preference |
| `plan_select` | plan id | Which tier attracts |
| `comparison_view` | competitor | Who we're actually up against |
| `form_start` / `form_submit` / `form_error` | form id, field (for errors) | Form friction, field by field |
| `search`, `faq_open`, `outbound_click`, `theme_toggle`, `web_vital` | … | Secondary |

**Never collected:** raw form input, email addresses in event properties, IP-based identity, anything
that could identify an individual visitor.

---

## 4. The funnel

Defined once, dashboarded, reviewed weekly:

```
Visit → Engaged (>25% scroll or >15s) → Product understood (§6 viewed or product page)
      → Intent (pricing / ROI / demo / comparison) → Action (signup or contact)
```

Per-stage questions, with the diagnosis each answer implies:

| Stage | Question | If it's bad |
|---|---|---|
| Visit → Engaged | Does the hero earn a scroll? | Headline or hero visual is wrong (test `01` §9 alternates) |
| Engaged → Understood | Do they reach §6, and do they use it? | The story before §6 is too long or the demo isn't inviting |
| Understood → Intent | Do they seek pricing/ROI? | Value is unclear, or the product doesn't look like it fits them |
| Intent → Action | Do they convert? | Pricing, friction, or a missing trust signal |

**Section-level dwell on the homepage is the highest-value diagnostic we have.** It tells us exactly
which of the 20 sections is the leak, which is a far more actionable signal than an aggregate bounce
rate.

---

## 5. Experimentation

- **Method:** edge middleware assigns a variant to a cookie, the server renders the assigned variant.
  Zero flicker, zero CLS, no client-side swap. This matters — client-side A/B tools are a primary
  cause of the layout shift `12-` forbids.
- **Discipline:** one experiment per surface at a time; a stated hypothesis before launch; a minimum
  sample size computed up front; a maximum run time; a pre-committed decision rule. No peeking-and-
  stopping.
- **Never test:** anything that would make a claim less accurate, a dark pattern, a fake-urgency
  variant, or a price the billing system won't honour.
- **First experiments, in order:** (1) hero headline A/B/C from `01` §9; (2) primary CTA copy
  ("Start free" vs "Try it free"); (3) whether §6 appears before or after the cluster section;
  (4) ROI teaser placement; (5) pricing default (monthly vs annual).

---

## 6. Privacy & consent

- A concise, honest cookie/consent notice — only if the chosen analytics actually requires one under
  the applicable regime. If we run genuinely cookieless analytics, **we don't show a banner**, and we
  say why on the privacy page. Not showing a consent wall you don't need is a small, real courtesy
  and a differentiator.
- Consent state via the existing `/api/consent` route; declining is one click and is respected across
  the site.
- `/legal/privacy` states plainly: what's collected, why, retention, who processes it, and how to
  request deletion — mirroring the DSR capability the product itself ships.
- Do Not Track and Global Privacy Control are honoured.
- Marketing analytics data is retained 24 months, then aggregated and purged.

---

## 7. Reporting cadence

| Cadence | Contents |
|---|---|
| Weekly | Funnel stages, top entry pages, CTA performance, form errors, Core Web Vitals field data |
| Monthly | Section-level dwell map for the homepage, comparison-page traffic, content performance, experiment results |
| Quarterly | Positioning review — are the messages that convert the ones we planned in `01`? Update `01` if reality disagrees. |

That last one is the important one: the positioning document is a hypothesis, and this is where it
gets tested against evidence rather than defended.

## Completion Status

- [ ] Analytics tool selected and self-host decision made
- [ ] `lib/analytics.ts` with the typed event schema
- [ ] Events instrumented, including section-level dwell
- [ ] `web-vitals` field reporting → own endpoint
- [ ] Funnel dashboard built
- [ ] Edge-middleware experiment framework
- [ ] Privacy page + consent flow verified against actual tooling
- [ ] Reporting cadence agreed
