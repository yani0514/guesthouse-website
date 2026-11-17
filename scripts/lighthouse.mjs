import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/audits', { recursive: true });
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless', '--disable-gpu', '--no-first-run'],
});
try {
  const results = [];
  for (const language of ['bg', 'en']) {
    const { lhr, report } = await lighthouse(`http://127.0.0.1:4174/${language}/`, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    await writeFile(`docs/audits/lighthouse-${language}.html`, report);
    const result = {
      language,
      lighthouseVersion: lhr.lighthouseVersion,
      fetchTime: lhr.fetchTime,
      environment: lhr.environment,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
          'speed-index',
        ].map((id) => [id, lhr.audits[id].displayValue]),
      ),
      findings: Object.values(lhr.audits)
        .filter(
          (audit) =>
            audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative',
        )
        .map((audit) => ({ id: audit.id, title: audit.title, value: audit.displayValue })),
    };
    results.push(result);
    console.log(JSON.stringify(result, null, 2));
  }
  await writeFile('docs/audits/lighthouse-summary.json', JSON.stringify(results, null, 2));
} finally {
  await chrome.kill();
}
