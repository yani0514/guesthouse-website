import { test, expect } from './fixtures';
import { readFileSync, readdirSync } from 'node:fs';
import { base, siteUrl, localUrl, publicUrl } from './deployment';
import { images } from '../src/data/gallery';
import { contactLinks } from '../src/lib/contact';

for (const route of ['', 'bg/', 'en/']) {
  test(`production route /${route} assets, metadata and anchors`, async ({ page }) => {
    const language = route === 'en/' ? 'en' : 'bg';
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    const response = await page.goto(`./${route}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${siteUrl}${language}/`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${siteUrl}${language}/`,
    );
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]'])
      await expect(page.locator(selector)).toHaveAttribute('content', `${siteUrl}social.jpg`);
    for (const lang of ['bg', 'en', 'x-default'])
      await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute(
        'href',
        `${siteUrl}${lang === 'en' ? 'en' : 'bg'}/`,
      );
    const schema = JSON.parse((await page.locator('#property-schema').textContent())!);
    expect(schema.url).toBe(`${siteUrl}${language}/`);
    expect(schema.image).toBe(`${siteUrl}social.jpg`);
    expect(schema).not.toHaveProperty('address');
    const hero = page.locator('.hero-visual img');
    await expect(hero).toBeVisible();
    await expect
      .poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(await hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(
      `${base}images/house/house-summer-balconies-`,
    );
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() =>
      Array.from(document.fonts)
        .filter((font) => font.status === 'loaded')
        .map((font) => font.family),
    );
    expect(fonts.some((font) => font.includes('Manrope'))).toBe(true);
    expect(fonts.some((font) => font.includes('Lora'))).toBe(true);
    for (const href of await page
      .locator('a[href^="#"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')!)))
      await expect(page.locator(href)).toHaveCount(1);
    expect(requests.every((url) => url.startsWith(localUrl))).toBe(true);
    expect(await page.content()).not.toContain('chatgpt.site');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  });
}

test('language hashes survive switch, history, refresh and saved preference', async ({ page }) => {
  await page.goto('bg/#gallery');
  await page.getByRole('button', { name: 'EN — English', exact: true }).click();
  await expect(page).toHaveURL(`${localUrl}en/#gallery`);
  await page.goBack();
  await expect(page).toHaveURL(`${localUrl}bg/#gallery`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
  await page.goForward();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveURL(`${localUrl}en/#gallery`);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('./#contact');
  await expect(page).toHaveURL(`${localUrl}en/#contact`);
  await page.goto('bg/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
});

test('every image variant, CSS, JavaScript, font and public identity asset exists', async ({
  request,
}) => {
  const paths = images.flatMap((image) => image.variants.flatMap((v) => [v.avif, v.webp, v.jpeg]));
  expect(paths).toHaveLength(315);
  paths.push(...readdirSync('dist/assets').map((file) => `/assets/${file}`));
  paths.push('/favicon.svg', '/social.jpg');
  for (let i = 0; i < paths.length; i += 8) {
    await Promise.all(
      paths.slice(i, i + 8).map(async (path) => {
        const response = await request.get(publicUrl(path));
        expect(response.status(), path).toBe(200);
        expect((await response.body()).length, path).toBeGreaterThan(0);
        expect(response.headers()['content-type'], path).not.toContain('text/html');
        await response.dispose();
      }),
    );
  }
});

test('AVIF, WebP and JPEG fallbacks decode in the browser', async ({ page }) => {
  await page.goto('bg/');
  const image = images.find((image) => image.id === 'house-summer-balconies')!;
  for (const format of ['avif', 'webp', 'jpeg'] as const) {
    const width = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      return img.naturalWidth;
    }, publicUrl(image.variants[0][format]));
    expect(width).toBe(image.variants[0].width);
  }
});

test('sitemap, robots, strict mount and clean deployment output', async ({ request }) => {
  const sitemap = await request.get(publicUrl('/sitemap.xml'));
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])).toEqual([
    `${siteUrl}bg/`,
    `${siteUrl}en/`,
  ]);
  expect(await (await request.get(publicUrl('/robots.txt'))).text()).toContain(
    `Sitemap: ${siteUrl}sitemap.xml`,
  );
  expect((await request.get(publicUrl('/missing-page/'))).status()).toBe(404);
  for (const path of ['/bg/', '/en/', '/images/missing.jpg', '/assets/missing.js'])
    expect((await request.get(`http://127.0.0.1:4173${path}`)).status()).toBe(404);
  const files = readdirSync('dist', { recursive: true, encoding: 'utf8' });
  expect(
    files.some((file) =>
      /(^|[/\\])(?:docs|tests|node_modules|assets-source|\.openai|\.env)([/\\]|$)/.test(file),
    ),
  ).toBe(false);
  for (const file of files.filter((file) => /\.(?:html|js|css|xml|txt)$/.test(file))) {
    const content = readFileSync(`dist/${file}`, 'utf8');
    expect(content, file).not.toMatch(/chatgpt\.site|stefanpenchev/);
  }
});

test('contact configuration validates and safely encodes actionable links', () => {
  const links = contactLinks(
    {
      phone: '+1 (202) 555-0123',
      viber: '+1 202 555 0123',
      email: 'owner+enquiries@example.com',
      facebook: 'https://www.facebook.com/example',
    },
    'Example & Test',
  );
  expect(links.tel).toBe('tel:+12025550123');
  expect(links.viber).toBe('viber://chat?number=%2B12025550123');
  expect(links.mailto).toBe('mailto:owner%2Benquiries@example.com');
  expect(new URL(links.maps!).searchParams.get('destination')).toBe('Example & Test');
  for (const facebook of [
    'javascript:alert(1)',
    'https://facebook.com.evil.example/',
    'https://user:pass@facebook.com/',
    'http://facebook.com/',
  ])
    expect(contactLinks({ facebook }).facebook).toBeUndefined();
  expect(
    contactLinks({ phone: 'unknown', email: 'a@example.com\r\nBcc:other@example.com' }).tel,
  ).toBeUndefined();
  expect(contactLinks({ email: 'a@example.com?subject=test' }).mailto).toBeUndefined();
  expect(contactLinks({})).toEqual({
    phone: undefined,
    tel: undefined,
    email: undefined,
    mailto: undefined,
    viber: undefined,
    facebook: undefined,
    maps: undefined,
  });
});
