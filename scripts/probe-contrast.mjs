/** Ad-hoc probe: ask axe exactly which colours it measured on a page. */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = 'http://localhost:3500';
const routes = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await page.addScriptTag({ content: AXE });
  const result = await page.evaluate(async () =>
    // @ts-ignore
    window.axe.run(document, { runOnly: ['color-contrast'] }),
  );
  console.log(`\n${route}`);
  for (const violation of result.violations) {
    for (const node of violation.nodes) {
      console.log(`  ${node.target.join(' ')}`);
      for (const check of node.any) {
        const d = check.data ?? {};
        console.log(
          `    fg=${d.fgColor} bg=${d.bgColor} ratio=${d.contrastRatio} expected=${d.expectedContrastRatio} size=${d.fontSize} weight=${d.fontWeight}`,
        );
      }
    }
  }
  if (result.violations.length === 0) console.log('  clean');
}

await browser.close();
