/**
 * Real browser audit: every route, every breakpoint.
 *
 * Checks that grep cannot:
 *   1. Horizontal overflow — the page body must never scroll sideways, and no
 *      single element may exceed the viewport width (docs/13 §5).
 *   2. axe-core violations at serious or critical impact, in a real DOM.
 *   3. Tap-target size on touch widths (WCAG 2.2 AA: 24×24 CSS px minimum).
 *   4. Text that would be smaller than 12px on any screen.
 *   5. Console errors during load.
 *
 * Usage:
 *   node scripts/audit.mjs                 # all routes, all viewports
 *   node scripts/audit.mjs --quick         # all routes, 3 key viewports
 *   node scripts/audit.mjs --shots         # also write screenshots
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3500';
const QUICK = process.argv.includes('--quick');
const SHOTS = process.argv.includes('--shots');

/** AUDIT_ROUTES=/,/pricing narrows the run while iterating on a fix. */
const ROUTE_OVERRIDE = process.env.AUDIT_ROUTES?.split(',').filter(Boolean);

const ALL_ROUTES = [
  '/',
  '/demo',
  '/pricing',
  '/roi',
  '/faq',
  '/solutions',
  '/security',
  '/security/permissions',
  '/security/compliance',
  '/security/infrastructure',
  '/developers',
  '/developers/api',
  '/developers/webhooks',
  '/developers/integrations',
  '/product/revenue',
  '/product/delivery',
  '/product/people',
  '/product/service',
  '/product/intelligence',
  '/platform/architecture',
  '/platform/customization',
  '/platform/workflows',
  '/platform/ai',
  '/platform/mobile',
  '/platform/white-label',
  '/solutions/professional-services',
  '/solutions/agencies',
  '/solutions/technology',
  '/solutions/by-role/sales',
  '/solutions/by-role/delivery',
  '/solutions/by-role/hr',
  '/solutions/by-role/it',
  '/solutions/by-role/finance',
  '/resources/blog',
  '/resources/guides',
  '/resources/changelog',
  '/company/about',
  '/company/careers',
  '/company/contact',
  '/legal/privacy',
  '/legal/terms',
  '/legal/accessibility',
  '/not-a-real-page',
];

const ROUTES = ROUTE_OVERRIDE ?? ALL_ROUTES;

/** docs/13 §5 responsive matrix, plus a short landscape-phone case. */
const ALL_VIEWPORTS = [
  { name: '320', width: 320, height: 640, touch: true },
  { name: '375', width: 375, height: 667, touch: true },
  { name: '390', width: 390, height: 844, touch: true },
  { name: '414', width: 414, height: 896, touch: true },
  { name: '480', width: 480, height: 800, touch: true },
  { name: '640', width: 640, height: 800, touch: true },
  { name: '768', width: 768, height: 1024, touch: true },
  { name: '844x390-landscape', width: 844, height: 390, touch: true },
  { name: '1024', width: 1024, height: 768, touch: false },
  { name: '1280', width: 1280, height: 800, touch: false },
  { name: '1440', width: 1440, height: 900, touch: false },
  { name: '1728', width: 1728, height: 1000, touch: false },
  { name: '2560', width: 2560, height: 1400, touch: false },
];

const VIEWPORTS = QUICK
  ? ALL_VIEWPORTS.filter((v) => ['390', '768', '1440'].includes(v.name))
  : ALL_VIEWPORTS;

const findings = [];
const seenAxe = new Set();

function record(kind, route, viewport, detail) {
  findings.push({ kind, route, viewport, detail });
}

if (SHOTS) mkdirSync('audit-shots', { recursive: true });

const browser = await chromium.launch();
let checks = 0;

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));

  for (const route of ROUTES) {
    consoleErrors.length = 0;
    // 'load' rather than 'networkidle': the reveal observers keep a rAF loop
    // alive on some pages, so networkidle never settles and the run hangs.
    await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 20000 });

    /*
     * Scroll the whole page before measuring anything.
     *
     * Entrance reveals start at opacity: 0 until their IntersectionObserver
     * fires. Auditing without scrolling measures below-fold content in its
     * pre-animation state, where axe correctly reports every text node as
     * failing contrast — 21 phantom violations in the first run. Scrolling
     * through triggers every observer so we audit the state a visitor sees.
     */
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      window.scrollTo(0, 0);
    });
    /*
     * Let entrance transitions settle so measurements are of the final layout.
     *
     * 2600ms, not the 600ms this used to be. `Reveal` resolves via three paths
     * (src/components/site/reveal.tsx) and the slowest is a **2000ms failsafe**
     * — so any block whose observer did not fire during the fast scroll above
     * is still at opacity 0 at 600ms, and its `--duration-rise` (480ms)
     * transition has not even started. axe then samples a half-faded element,
     * blends it against its background and reports a *serious* color-contrast
     * violation on a token pair that passes by arithmetic.
     *
     * That made this run non-deterministic in the worst way: the finding moved
     * between viewports run to run (375 in one pass, 320 in the next, class
     * `.reveal` vs `.reveal-in`), and it surfaced only when a layout change
     * shifted the scroll geometry — it was latent here long before it fired.
     * A gate that reports a real-looking a11y failure depending on timing
     * trains you to ignore it, which is worse than no gate.
     *
     * 2000 (failsafe) + 480 (rise) + headroom. Verified: with a 4s settle the
     * homepage reports 0 colour-contrast violations at 320 in both motion
     * modes, with the previously-flagged eyebrow measured at opacity 1.
     */
    await page.waitForTimeout(2600);
    checks += 1;

    // ── 1. Horizontal overflow ──────────────────────────────────────────
    /*
     * Two distinct failures, and the second is the dangerous one:
     *
     *   a) The document scrolls sideways — obvious, caught by scrollWidth.
     *   b) Content extends past the viewport but an ancestor with
     *      overflow: hidden clips it. scrollWidth stays correct while text is
     *      silently cut off mid-word. This shipped once and was only caught by
     *      looking at a screenshot, so it is now checked directly: any text
     *      element whose right edge is past the viewport is reported whether or
     *      not the document scrolls.
     */
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = document.documentElement.clientWidth;
      const past = [];

      const describe = (el, rect) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') ?? '').slice(0, 80),
        right: Math.round(rect.right),
        left: Math.round(rect.left),
        text: (el.textContent ?? '').trim().slice(0, 40),
      });

      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const style = getComputedStyle(el);
        if (style.position === 'fixed') continue;
        // Elements inside a deliberate horizontal scroller are allowed to be
        // wider than the viewport — that is what the scroller is for.
        if (el.parentElement && el.closest('[class*="overflow-x-auto"]')) continue;

        /*
         * Decorative, textless layers are allowed to overscan.
         *
         * This check is about *content* being silently cut off — it earned its
         * place by catching a <pre> whose min-content width dragged a column
         * past the viewport where an overflow:hidden ancestor clipped the text
         * mid-word. A background video deliberately scaled 1.02 so an 8px
         * parallax translate never exposes a bare edge is the opposite case:
         * the overscan is the feature, and there is nothing to read.
         *
         * Kept deliberately narrow — the element must be aria-hidden AND carry
         * no text. A <pre> full of code can never qualify, so the bug this
         * check was written for is still caught.
         */
        const decorative =
          (el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]')) &&
          !(el.textContent ?? '').trim();
        if (decorative) continue;

        if (rect.right > viewWidth + 1 || rect.left < -1) past.push(describe(el, rect));
      }

      return { docWidth, viewWidth, past: past.slice(0, 4), pastCount: past.length };
    });

    if (overflow.docWidth > overflow.viewWidth + 1) {
      record(
        'overflow',
        route,
        viewport.name,
        `document scrolls: scrollWidth ${overflow.docWidth} > client ${overflow.viewWidth}. ` +
          overflow.past.map((o) => `<${o.tag} class="${o.cls}"> R${o.right}`).join(' | '),
      );
    } else if (overflow.pastCount > 0) {
      record(
        'clipped-overflow',
        route,
        viewport.name,
        `${overflow.pastCount} element(s) extend past the viewport but are clipped by an ancestor — ` +
          `content is cut off, not scrollable. ` +
          overflow.past
            .map((o) => `<${o.tag} class="${o.cls}"> R${o.right} "${o.text}"`)
            .join(' | '),
      );
    }

    // ── 2. axe-core ─────────────────────────────────────────────────────
    await page.addScriptTag({ content: AXE_SOURCE });
    const axeResult = await page.evaluate(async () => {
      // @ts-ignore - injected
      return await window.axe.run(document, {
        resultTypes: ['violations'],
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      });
    });

    for (const violation of axeResult.violations) {
      if (violation.impact !== 'serious' && violation.impact !== 'critical') continue;
      const key = `${route}|${violation.id}`;
      if (seenAxe.has(key)) continue;
      seenAxe.add(key);
      const target = violation.nodes[0]?.target?.join(' ') ?? '';
      record(
        'axe',
        route,
        viewport.name,
        `[${violation.impact}] ${violation.id}: ${violation.help} — ${target}`,
      );
    }

    // ── 3. Tap targets (touch widths only) ──────────────────────────────
    if (viewport.touch) {
      const small = await page.evaluate(() => {
        const out = [];
        const selector = 'a, button, input, select, textarea, summary, [role="button"], [role="tab"]';
        for (const el of document.querySelectorAll(selector)) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const style = getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') continue;
          // Skip-links and other sr-only controls are 1×1 until focused, at
          // which point they become full-size. Measuring them unfocused is
          // measuring the wrong state.
          if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
          // Inline links inside a paragraph are exempt under WCAG 2.2 2.5.8.
          const inFlow = el.tagName === 'A' && el.closest('p, li, figcaption, summary');
          if (inFlow) continue;
          if (rect.width < 24 || rect.height < 24) {
            out.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent ?? '').trim().slice(0, 30),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            });
          }
        }
        return out.slice(0, 4);
      });
      for (const target of small) {
        record(
          'tap-target',
          route,
          viewport.name,
          `<${target.tag}> "${target.text}" is ${target.w}x${target.h} (min 24x24)`,
        );
      }
    }

    // ── 4. Tiny text ────────────────────────────────────────────────────
    // Content must be ≥12px. Decorative interface illustrations are exempt and
    // are marked aria-hidden with a text alternative — the same treatment a
    // screenshot gets, since that is what they are.
    const tiny = await page.evaluate(() => {
      const out = new Set();
      for (const el of document.querySelectorAll('body *')) {
        if (!el.textContent?.trim()) continue;
        if (el.children.length > 0) continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size && size < 11.5) out.add(`${el.tagName.toLowerCase()} @ ${size}px`);
      }
      return [...out].slice(0, 3);
    });
    for (const item of tiny) record('tiny-text', route, viewport.name, item);

    // ── 5. Console errors ───────────────────────────────────────────────
    // The 404 route legitimately produces a 404 network entry.
    const isExpected404 = route === '/not-a-real-page';
    for (const error of consoleErrors.slice(0, 2)) {
      if (isExpected404 && /status of 404/.test(error)) continue;
      record('console', route, viewport.name, error.slice(0, 160));
    }

    if (SHOTS && ['/', '/product/delivery', '/security', '/pricing'].includes(route)) {
      const slug = route === '/' ? 'home' : route.replace(/\//g, '-').slice(1);
      await page.screenshot({
        path: `audit-shots/${slug}-${viewport.name}.png`,
        fullPage: false,
      });
    }
  }

  await context.close();
  process.stdout.write(`  viewport ${viewport.name} done\n`);
}

await browser.close();

// ── Report ────────────────────────────────────────────────────────────────
console.log(`\n${checks} page loads checked across ${VIEWPORTS.length} viewports.\n`);

if (findings.length === 0) {
  console.log('No findings. Every route is clean at every tested width.');
  process.exit(0);
}

const byKind = new Map();
for (const finding of findings) {
  if (!byKind.has(finding.kind)) byKind.set(finding.kind, []);
  byKind.get(finding.kind).push(finding);
}

for (const [kind, list] of byKind) {
  console.log(`\n${kind.toUpperCase()} — ${list.length}`);
  // Collapse identical detail across viewports so the report stays readable.
  const grouped = new Map();
  for (const finding of list) {
    const key = `${finding.route}|${finding.detail}`;
    if (!grouped.has(key)) grouped.set(key, { ...finding, viewports: [] });
    grouped.get(key).viewports.push(finding.viewport);
  }
  for (const entry of grouped.values()) {
    console.log(`  ${entry.route}  [${entry.viewports.join(', ')}]`);
    console.log(`     ${entry.detail}`);
  }
}

console.log(`\n${findings.length} total findings.`);
process.exit(1);
