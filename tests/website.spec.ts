import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { property } from '../src/data/property';
import { images, categories } from '../src/data/gallery';

test('Bulgarian facts, real assets and conditional contacts', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
  await expect(page.locator('h1')).toHaveText('Вашият рай край язовир Цонево');
  await expect(page.locator('.floor')).toHaveCount(3);
  await expect(page.locator('.floor').first()).toContainText('1 WC без душ');
  await expect(page.locator('.guest-label')).toHaveText([
    'Около 3 гости',
    'Около 8 гости',
    'Около 8 гости',
  ]);
  await expect(page.locator('.price-value')).toHaveText(
    `${property.pricing.minIndicativePricePerPerson}–${property.pricing.maxIndicativePricePerPerson}€`,
  );
  await expect(
    page.locator('a[href^="tel:"], a[href^="mailto:"], a[href^="viber:"], a[href*="maps/dir"]'),
  ).toHaveCount(0);
  await expect(page.locator('.contact-pending')).toBeVisible();
  for (const id of ['home', 'about', 'accommodation', 'amenities', 'gallery', 'prices', 'contact'])
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const image of images) {
    const response = await page.request.get(image.variants[0].webp);
    expect(response.status()).toBe(200);
  }
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('language switch, persistence, history and localized metadata', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN — English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Your little paradise');
  await expect(page).toHaveTitle('Bananov Rai | Guest House near Tsonevo Reservoir');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${property.siteUrl}/en/`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_GB');
  expect(await page.evaluate(() => localStorage.getItem('bananov-rai-language'))).toBe('en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'BG — Български', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
  await page.goBack();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('all gallery categories, lightbox navigation, trap, Escape and focus restoration', async ({
  page,
}) => {
  await page.goto('/en/');
  const labels = ['All', 'The house', 'Rooms', 'Mehana', 'Pool & garden', 'Amenities'];
  for (let index = 0; index < categories.length; index++) {
    await page
      .locator('.gallery-filters')
      .getByRole('button', { name: labels[index], exact: true })
      .click();
    await expect(page.locator('.gallery-item')).toHaveCount(
      categories[index] === 'all'
        ? images.length
        : images.filter((image) => image.category === categories[index]).length,
    );
  }
  await page.locator('.gallery-filters').getByRole('button', { name: 'All', exact: true }).click();
  const trigger = page.locator('.gallery-item').first();
  await trigger.click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Photo 1 of 22');
  await page.keyboard.press('ArrowRight');
  await expect(modal).toContainText('Photo 2 of 22');
  await page.keyboard.press('ArrowLeft');
  await expect(modal).toContainText('Photo 1 of 22');
  await page.keyboard.press('ArrowLeft');
  await expect(modal).toContainText('Photo 22 of 22');
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(
      true,
    );
  }
  const audit = await new AxeBuilder({ page })
    .include('dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('button', { name: 'Close photo', exact: true }).click();
  await expect(trigger).toBeFocused();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive navigation and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/bg/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width < 1200) {
      const toggle = page.getByRole('button', { name: 'Отворете менюто' });
      await toggle.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toBeFocused();
      await toggle.click();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Цени', exact: true }).click();
      await expect(page.locator('#mobile-menu')).toBeHidden();
      await expect(page).toHaveURL(/#prices$/);
    } else {
      await page.locator('.desktop-nav').getByRole('link', { name: 'Цени', exact: true }).click();
      await expect(page).toHaveURL(/#prices$/);
    }
    await page.locator('#prices').scrollIntoViewIfNeeded();
    await expect(page.locator('#prices h2')).toBeInViewport();
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.goto('/en/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({ path: `docs/screenshots/en-${width}.png`, fullPage: true });
  });
}

test('static translated content and metadata without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [lang, text] of [
    ['bg', 'Вашият рай'],
    ['en', 'Your little paradise'],
  ]) {
    await page.goto(`http://127.0.0.1:4173/${lang}/`);
    await expect(page.locator('h1')).toContainText(text);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('link[hreflang="bg"]')).toHaveCount(1);
    expect(
      JSON.parse((await page.locator('#property-schema').textContent()) ?? '{}')['@type'],
    ).toBe('LodgingBusiness');
  }
  await context.close();
});

test('translation parity, provisional capacity and source integrity', () => {
  const bg = JSON.parse(readFileSync('src/locales/bg.json', 'utf8'));
  const en = JSON.parse(readFileSync('src/locales/en.json', 'utf8'));
  function keys(object: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(object)
      .flatMap(([key, value]) =>
        typeof value === 'object' && value !== null
          ? keys(value as Record<string, unknown>, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )
      .sort();
  }
  expect(keys(bg)).toEqual(keys(en));
  expect(property.floors.reduce((sum, floor) => sum + floor.capacity, 0)).toBe(property.capacity);
  expect(new Set(images.map((image) => image.source)).size).toBe(22);
  for (const image of images)
    for (const variant of image.variants) expect(variant.width).toBeLessThanOrEqual(image.width);
});

test('reduced motion and unavailable storage', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new Error('Storage unavailable');
      },
    });
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/bg/');
  await page.getByRole('button', { name: 'EN — English', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Your little paradise');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  await context.close();
});
