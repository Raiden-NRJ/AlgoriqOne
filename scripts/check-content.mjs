/**
 * Content and accessibility guard.
 *
 * Runs against a live server and enforces the rules this site is built on. It
 * is not a substitute for axe or a screen-reader pass — it catches the classes
 * of regression that are cheap to detect and expensive to ship:
 *
 *   1. Fabricated proof: certification, customer or testimonial claims we have
 *      not earned (website/CLAUDE.md rules 1 and 2). This is the important one.
 *   2. Banned marketing vocabulary (docs/01 §6).
 *   3. Exactly one <h1> per page, and no skipped heading levels.
 *   4. A unique, present, correctly-sized <title> and meta description.
 *   5. Images with a missing or empty alt attribute.
 *
 * Usage: node scripts/check-content.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://localhost:3500';

const ROUTES = [
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
];

/**
 * Claims we must never make. Phrased as regexes because the failure mode is
 * someone writing "SOC 2 compliant" in a hurry, not someone pasting this exact
 * string.
 */
const FORBIDDEN = [
  { re: /SOC\s*2[\s-]*(certified|compliant)/i, why: 'We are SOC 2-ready, not certified. docs/07 §1.' },
  { re: /ISO\s*27001[\s-]*(certified|compliant)/i, why: 'No ISO certification exists.' },
  { re: /HIPAA[\s-]*(certified|compliant)/i, why: 'No HIPAA claim is supportable.' },
  { re: /\bGDPR[\s-]*compliant\b/i, why: 'Say "GDPR DSR flows implemented", not "compliant".' },
  { re: /trusted by [\d,]+\+? (companies|customers|teams)/i, why: 'We have no customer count to cite.' },
  { re: /\b\d{2,}[,\d]*\+? (happy )?(customers|companies) (use|trust|rely)/i, why: 'Invented customer count.' },
  { re: /\b99\.9\d*%\s*(uptime\s*)?SLA\b/i, why: 'No contractual SLA is legally approved. docs/07 §1.' },
  { re: /average customer sees/i, why: 'We have no customer data to average.' },
  { re: /download (it )?(on|from) the app store/i, why: 'There is no native app. docs/00 §7.' },
  { re: /\bnative (ios|android) app\b/i, why: 'There is no native app.' },
];

const BANNED_WORDS = [
  'leverage',
  'seamless',
  'seamlessly',
  'revolutionary',
  'game-changing',
  'cutting-edge',
  'best-in-class',
  'synergy',
  'supercharge',
  'world-class',
  'next-generation',
];

const failures = [];
const warnings = [];
const titles = new Map();

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route}`);
  if (res.status !== 200) {
    failures.push(`${route}: HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();
  const text = stripTags(html);

  // 1. Fabricated proof.
  for (const rule of FORBIDDEN) {
    const match = text.match(rule.re);
    if (match) failures.push(`${route}: forbidden claim "${match[0]}" — ${rule.why}`);
  }

  // 2. Banned vocabulary.
  for (const word of BANNED_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    if (re.test(text)) warnings.push(`${route}: banned word "${word}" (docs/01 §6)`);
  }

  // 3. Headings.
  const headings = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const h1Count = headings.filter((level) => level === 1).length;
  if (h1Count !== 1) failures.push(`${route}: expected exactly one <h1>, found ${h1Count}`);

  let previous = 0;
  for (const level of headings) {
    if (previous && level > previous + 1) {
      warnings.push(`${route}: heading jumps from h${previous} to h${level}`);
    }
    previous = level;
  }

  // 4. Metadata.
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';

  if (!title) failures.push(`${route}: missing <title>`);
  else {
    if (title.length > 70) warnings.push(`${route}: title is ${title.length} chars (aim ≤ 60)`);
    if (titles.has(title)) failures.push(`${route}: duplicate title, also on ${titles.get(title)}`);
    else titles.set(title, route);
  }

  if (!description) failures.push(`${route}: missing meta description`);
  else if (description.length > 165) {
    warnings.push(`${route}: description is ${description.length} chars (aim ≤ 155)`);
  }

  // 5. Images without alt.
  const images = [...html.matchAll(/<img\b[^>]*>/g)];
  for (const [tag] of images) {
    if (!/\balt=/.test(tag)) failures.push(`${route}: <img> without an alt attribute`);
  }
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} FAILURE(S):`);
  for (const failure of failures) console.error(`  x ${failure}`);
  process.exit(1);
}

console.log(`\nChecked ${ROUTES.length} routes. No content or accessibility failures.`);
