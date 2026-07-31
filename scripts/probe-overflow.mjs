/** Ad-hoc probe: check one route for horizontal overflow across narrow widths. */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3500';
const route = process.argv[2] ?? '/';
const widths = [320, 360, 375, 390, 414, 480, 540, 640, 720, 768];

const browser = await chromium.launch();
let bad = 0;

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
  await page.waitForTimeout(200);

  const result = await page.evaluate(() => {
    const doc = document.documentElement.scrollWidth;
    const view = document.documentElement.clientWidth;
    const offenders = [];
    if (doc > view + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (getComputedStyle(el).position === 'fixed') continue;
        if (r.right > view + 1) {
          offenders.push(`<${el.tagName.toLowerCase()} class="${(el.className || '').toString().slice(0, 70)}"> R${Math.round(r.right)}`);
        }
      }
    }
    return { doc, view, offenders: offenders.slice(0, 3) };
  });

  const ok = result.doc <= result.view + 1;
  if (!ok) bad += 1;
  console.log(`  ${ok ? 'ok ' : 'BAD'} ${String(width).padStart(4)}  scroll=${result.doc} view=${result.view}`);
  for (const o of result.offenders) console.log(`        ${o}`);

  await context.close();
}

await browser.close();
console.log(bad === 0 ? `\n${route}: no overflow at any width.` : `\n${route}: ${bad} width(s) overflow.`);
process.exit(bad === 0 ? 0 : 1);
