/**
 * Internal link checker.
 *
 * Crawls every route reachable from the homepage against a running server and
 * reports any internal link that does not return 200. Broken internal links are
 * a conversion bug and an SEO bug, and they are the single easiest regression to
 * ship without noticing.
 *
 * Usage: node scripts/check-links.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? 'http://localhost:3500';

const seen = new Set();
const queue = ['/'];
const problems = [];
const checked = [];

/** Links we deliberately do not follow: external hosts and product redirects. */
function isInternal(href) {
  if (!href) return false;
  if (href.startsWith('//')) return false;
  if (/^[a-z]+:/i.test(href)) return false; // http:, mailto:, tel:
  return href.startsWith('/');
}

function normalise(href) {
  const [path] = href.split('#');
  if (!path) return null;
  const clean = path.replace(/\/$/, '') || '/';
  return clean;
}

function extractLinks(html) {
  const links = [];
  const re = /href="([^"]+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    links.push(match[1]);
  }
  return links;
}

while (queue.length > 0) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  } catch (error) {
    problems.push({ path, status: 'FETCH FAILED', detail: String(error) });
    continue;
  }

  // 3xx to the product apps is expected (/signup, /login).
  if (res.status >= 300 && res.status < 400) {
    checked.push({ path, status: res.status, note: res.headers.get('location') ?? '' });
    continue;
  }

  if (res.status !== 200) {
    problems.push({ path, status: res.status });
    continue;
  }

  checked.push({ path, status: 200 });

  const html = await res.text();
  for (const href of extractLinks(html)) {
    if (!isInternal(href)) continue;
    const next = normalise(href);
    if (!next) continue;
    if (next.startsWith('/api/')) continue;
    if (!seen.has(next)) queue.push(next);
  }
}

checked.sort((a, b) => a.path.localeCompare(b.path));
for (const entry of checked) {
  const note = entry.note ? ` → ${entry.note}` : '';
  console.log(`  ${String(entry.status).padEnd(3)} ${entry.path}${note}`);
}

console.log(`\nChecked ${checked.length} internal URLs.`);

if (problems.length > 0) {
  console.error(`\n${problems.length} BROKEN:`);
  for (const problem of problems) {
    console.error(`  ${problem.status} ${problem.path} ${problem.detail ?? ''}`);
  }
  process.exit(1);
}

console.log('No broken internal links.');
