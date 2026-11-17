import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolveConfig } from 'vite';
const { base } = await resolveConfig({}, 'build');
await mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch();
for (const [language, width] of [
  ['bg', 1440],
  ['bg', 390],
  ['en', 1440],
]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:4174${base}${language}/`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.hero img').evaluate((image) => image.decode());
  await page.screenshot({ path: `docs/screenshots/${language}-${width}-hero.png` });
  for (const section of ['about', 'accommodation', 'amenities', 'prices', 'contact']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await page
      .locator(`#${section} img`)
      .evaluateAll((images) => Promise.all(images.map((image) => image.decode().catch(() => {}))));
    await page
      .locator(`#${section}`)
      .screenshot({ path: `docs/screenshots/${language}-${width}-${section}.png` });
  }
  await page.close();
}
await browser.close();
console.log('Captured desktop and mobile BG/EN visual review images.');
