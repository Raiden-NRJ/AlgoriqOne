# Homepage Visual Prompts — Nano Banana Generation Brief

**Purpose:** ready-to-paste prompts for generating the first round of photography/video for the
homepage, plus the reasoning behind the direction. Review the images this produces before anything
gets wired into the site — nothing here is final until you say so.

---

## 1. What the competition actually does

Quick look at two well-known players before writing prompts, so we're not guessing:

- **Kantata** (PSA — our closest direct competitor per `01-brand-and-positioning.md`): hero is
  typography over an abstract mint/teal gradient mesh, no photography at all. Further down the page
  it drops in **real product screenshots** (an actual Gantt/kanban view) inside a browser-style frame
  on a colored card. No stock photos of people anywhere above the fold.
- **HubSpot**: the opposite bet — a full-bleed **documentary-style photo** of a real, diverse
  go-to-market team mid-conversation in a warm, plant-filled office, shallow depth of field, natural
  light, bold serif headline in white over a dark gradient scrim, orange CTA buttons.

Two legitimate directions, and they don't mix well. Kantata's approach protects claims (a real
screenshot is exactly what it says it is); HubSpot's approach sells the *feeling* of the team culture
buying into the product.

## 2. The direction I'd recommend for Algoryq One, and the one hard rule

Algoryq One's whole brand voice is "we show mechanisms, not adjectives" (see security section copy,
the honest device-frame captions, the gated logo/testimonial sections). A fake product screenshot
would work against that — CLAUDE.md rule 3 is "claims trace to code," and an AI-generated dashboard
that doesn't match the real UI is a claim the code can't back up. **The existing CSS-built mockups
stay** — they're accurate today; a generated image of "a dashboard" would be a step down in honesty,
not up.

Where generated photography earns its place is showing the **work the software is for** — the deal
call, the delivery kickoff, the invoice getting signed off — never the software's screen itself.
That's the HubSpot lane, tuned to Algoryq's blue instead of HubSpot's orange, and cast as the
"deal → delivery → cash" chain rather than generic "teamwork."

**The one hard rule:** nobody in these images is a real Algoryq One customer, employee, or named
person. Treat every figure as anonymous stock talent — same as a stock photo library would. Never
caption a generated photo with a company name, a person's name, or a title implying it's a real
account (that would be the same fabrication problem as a fake testimonial, just in image form). If a
laptop or monitor appears in frame, keep its screen **blurred, angled away, or showing only the
Algoryq One mark** — never a fabricated dashboard.

---

## 3. Prompts

Paste these into Nano Banana as-is, or use them as a starting point. Each includes placement, aspect
ratio, and a negative prompt. Brand blue reference: `oklch` hue 259 — described below as "a clean,
saturated cobalt/indigo blue," since Nano Banana won't take oklch directly.

### 3.1 — Hero, secondary/alternate visual (optional companion to the existing diagram)

> A candid documentary-style photograph of two professional services colleagues — one mid-30s
> woman, one man in his 40s, both dressed in smart-casual business attire — reviewing a project
> timeline together at a standing desk in a bright, modern agency office. Large windows, soft
> natural daylight, shallow depth of field, warm neutral tones with cobalt-blue accents in the
> furniture or signage. A laptop is open on the desk between them but its screen is angled away from
> camera / out of focus. Documentary/editorial photography style, Kodak Portra color grade, no
> harsh flash, candid unposed expressions, shot on 50mm lens. 16:9, landscape.
> **Negative prompt:** no visible dashboard or app UI on any screen, no readable logos or brand
> marks other than a plain laptop lid, no text overlays, no stock-photo clichés (thumbs up,
> high-five, pointing at screen while smiling at camera), no more than two people in frame.

### 3.2 — Chain section, stage 1 "Deal" vignette

> A close-up documentary photograph of a salesperson on a video call at a clean desk, headset on,
> genuine mid-conversation expression, laptop screen softly blurred/bokeh in foreground, small
> potted plant and coffee cup nearby, cobalt-blue accent lighting from a desk lamp. Natural window
> light, editorial photography, warm neutral palette. 4:3.
> **Negative prompt:** no readable screen content, no visible company names, no branded merchandise,
> no exaggerated smiling-at-camera stock pose.

### 3.3 — Chain section, stage 2 "Delivery" vignette

> A small delivery team (three people, mixed age and gender) standing around a whiteboard covered in
> sticky notes and a rough project timeline sketch, mid-discussion, one person gesturing at the
> board. Modern office, daylight, documentary photography style, cobalt-blue sticky notes mixed in
> with neutral tones. 4:3.
> **Negative prompt:** no legible text on the whiteboard, no visible logos, no posed group-photo eye
> contact with camera.

### 3.4 — Chain section, stage 3 "Cash" vignette

> A close-up of hands signing off on a printed invoice/approval sheet next to an open laptop (screen
> blurred), soft daylight from the side, minimal modern desk setup, cobalt-blue folder or pen as a
> color accent. Documentary/editorial still-life photography, shallow depth of field. 4:3.
> **Negative prompt:** no visible numbers, currency symbols, or dollar amounts that could be read as
> a real figure; no legible screen content; no company branding.

### 3.5 — Devices section, supporting lifestyle shot (phone-in-hand)

> A photograph of a hand holding a smartphone at a construction/consulting job site (hard hat resting
> nearby, or a client meeting room — pick one), phone screen turned slightly away from camera or
> softly out of focus, natural outdoor or office daylight, documentary photography, cobalt-blue
> accent in clothing or an object in frame. Vertical 3:4, tight crop.
> **Negative prompt:** no visible app UI, no readable text, no faces required — hands/environment
> only is fine.

### 3.6 — Solutions › Agencies industry page, hero support image

> A creative/digital agency team (four people, diverse ages and genders) in a casual critique
> session around a large monitor showing abstract blurred shapes (not real UI), laughing naturally,
> exposed-brick or plant-filled agency office aesthetic, warm daylight, documentary photography,
> cobalt-blue accent object (a chair, a mug, a folder). 16:9.
> **Negative prompt:** no legible screen content, no visible logos or brand names on clothing/signage,
> no staged eye contact with camera.

### 3.7 — Solutions › Technology industry page, hero support image

> A small software/technology company team working in an open-plan office, one person at a standing
> desk with dual monitors (screens blurred/angled away), another on a call, natural light, modern
> minimalist office with cobalt-blue accent lighting or furniture. Documentary photography, candid,
> not posed. 16:9.
> **Negative prompt:** no visible code or UI on any screen, no readable logos, no clichéd "typing
> fast" hand-blur effect.

### 3.8 — Company / About page, office environment (no team claim)

> An empty, well-lit modern office interior — a meeting room with a whiteboard, plants, and cobalt-
> blue accent furniture, mid-morning light through large windows. Architectural/interior photography
> style, no people in frame. 16:9.
> **Negative prompt:** no people, no visible logos or signage, no screens showing content.

*(This one deliberately has no people — it's a safe "our environment" shot that can't be mistaken for
a claim about staff headcount or a real office address unless you confirm it should match a real
location.)*

---

## 4. Video (if you want it for the hero)

A short, silent, looping background video is the lower-risk video option: 6–10 seconds, same
documentary style as 3.1, subtle motion only (hands moving, hair/plant leaves moving slightly in a
breeze, no camera pans that reveal more of a screen). Muted, autoplay, loop, with a static poster
frame fallback for `prefers-reduced-motion` — that's already a rule on this site (CLAUDE.md rule 5).
I'd hold off generating video until we've picked a still direction from the above, since the same
honesty and file-weight questions apply, just harder to fix after the fact.

---

## 5. Once you've generated a batch

Send me the files (or drop them in the folder) and tell me which prompt each one answers. I'll:

1. Run them through `next/image` with proper `sizes`/`priority` so they don't blow the Lighthouse
   budget (rule 4).
2. Decide per-section whether the photo replaces, sits beside, or sits behind the existing CSS
   mockup — the mockups stay because they're accurate; the photos add the human context around them.
3. Update `10-visual-assets-and-devices.md` to record the decision, since right now it says the hero
   is deliberately screenshot-free.
