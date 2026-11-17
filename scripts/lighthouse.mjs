import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const label = process.env.AUDIT_LABEL ?? 'final';
if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Use a simple audit label.');
const baseUrl = process.env.AUDIT_URL ?? 'http://127.0.0.1:4174/guesthouse-website/';
const runs = Number(process.env.AUDIT_RUNS ?? 3);
await mkdir('docs/audits', { recursive: true });
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless', '--disable-gpu', '--no-first-run'],
});
try {
  const results = [];
  for (let run = 1; run <= runs; run++) {
    for (const language of ['bg', 'en']) {
      const { lhr, report } = await lighthouse(new URL(`${language}/`, baseUrl).href, {
        port: chrome.port,
        output: 'html',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });
      await writeFile(`docs/audits/${label}-${language}-${run}.html`, report);
      await writeFile(`docs/audits/${label}-${language}-${run}.json`, JSON.stringify(lhr));
      const result = {
        run,
        language,
        lighthouseVersion: lhr.lighthouseVersion,
        fetchTime: lhr.fetchTime,
        environment: lhr.environment,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
            'speed-index',
          ].map((id) => [
            id,
            { value: lhr.audits[id].numericValue, display: lhr.audits[id].displayValue },
          ]),
        ),
        findings: Object.values(lhr.audits)
          .filter(
            (audit) =>
              audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative',
          )
          .map((audit) => ({ id: audit.id, title: audit.title, value: audit.displayValue })),
      };
      results.push(result);
      console.log(
        JSON.stringify({ run, language, scores: result.scores, metrics: result.metrics }),
      );
    }
  }
  await writeFile(`docs/audits/${label}-summary.json`, JSON.stringify(results, null, 2));
} finally {
  await chrome.kill();
}
