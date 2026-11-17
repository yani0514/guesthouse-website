import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
const assets = await readdir('dist/assets');
const escape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
let origin;
for (const language of ['bg', 'en']) {
  const { html, seo } = await render(language);
  origin = seo.origin;
  const fontSubset = language === 'bg' ? 'cyrillic' : 'latin';
  const fonts = assets.filter(
    (file) =>
      file.endsWith('.woff2') &&
      (file.startsWith(`lora-${fontSubset}-`) || file.startsWith(`manrope-${fontSubset}-`)),
  );
  const meta = `${fonts.map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`).join('')}
<title>${escape(seo.title)}</title>
<meta name="description" content="${escape(seo.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(seo.title)}">
<meta property="og:description" content="${escape(seo.description)}">
<meta property="og:locale" content="${seo.locale}">
<meta property="og:image" content="${escape(seo.image)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(seo.title)}">
<meta name="twitter:description" content="${escape(seo.description)}">
<meta name="twitter:image" content="${escape(seo.image)}">
${seo.url ? `<meta property="og:url" content="${escape(seo.url)}"><link rel="canonical" href="${escape(seo.url)}">` : ''}
${origin ? `<link rel="alternate" hreflang="bg" href="${origin}/bg/"><link rel="alternate" hreflang="en" href="${origin}/en/"><link rel="alternate" hreflang="x-default" href="${origin}/bg/">` : ''}
<script id="property-schema" type="application/ld+json">${JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')}</script>`;
  const page = template
    .replace('lang="bg"', `lang="${language}"`)
    .replace('<!--seo-->', meta)
    .replace('<!--app-->', html);
  await mkdir(`dist/${language}`, { recursive: true });
  await writeFile(`dist/${language}/index.html`, page);
  if (language === 'bg') await writeFile('dist/index.html', page);
}
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`,
);
if (origin)
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['bg', 'en'].map((lang) => `<url><loc>${origin}/${lang}/</loc></url>`).join('')}</urlset>`,
  );
console.log('Prerendered Bulgarian and English HTML, metadata, robots.txt and sitemap.');
