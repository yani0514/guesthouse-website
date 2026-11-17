# Verification report — GitHub Pages simplification

Verified locally on 17 November 2026 using Node 22.23.5, Chromium 159.0.8154.6 and the production build.

## Result

The website retains React, TypeScript, Vite, Tailwind, BG/EN static prerendering, the existing visual design and all 22 photographs. Deployment now uses the standard Vite base, one small URL helper and one official GitHub Pages workflow. No additional application or Python dependencies were introduced.

## Checks executed

- `npm ci`: passed; installed from the lockfile, audit reported zero vulnerabilities.
- `npm run typecheck`: passed after removing the obsolete custom-domain test branch.
- `npm run lint`: passed.
- `npm run build`: passed client build, SSR build and localized static generation.
- `npm test`: **19/19 passed**, including the original 11 tests.
- `npm run format:check`: passed. `git diff --check`: passed.
- Actual BG mobile/desktop screenshots were visually reviewed; the original typography, colors, layout and photographs are preserved.

The strict local server mounts `dist/` at `/guesthouse-website/` and returns 404 for domain-root language/assets paths and unknown URLs. Tests run against port 4173; normal preview uses port 4174. This avoids a SPA fallback masking broken URLs.

## Browser and output coverage

- Root, BG and EN Pages routes; default language, refresh, saved preference, back/forward and preserved section hashes.
- Correct canonical, Open Graph, social image, hreflang, schema, sitemap and robots URLs; no previous Sites URL in production output.
- Complete BG/EN content and metadata without JavaScript.
- All **315 image variants** return HTTP 200, all emitted CSS/JS/fonts exist, and AVIF/WebP/JPEG decode successfully. The hero loads with a real natural width.
- Desktop/mobile anchor navigation, disclosure menu, sticky layout and no horizontal overflow at 360, 390, 768, 1024 and 1440 px in both languages.
- Every gallery category, modal navigation/wraparound, Tab trap, Escape and restored trigger focus.
- Axe WCAG 2 A/AA, 2.1 A/AA and 2.2 AA coverage at five widths and inside the modal: no violations.
- Console errors, page errors, failed resource responses and non-navigation request failures are checked across normal browser flows: none in the passing run.
- Missing contact state, safe configured contact links, translation parity, provisional capacity, reduced motion and unavailable storage.
- Output contains no source originals, environment files, development reports or old-host metadata.

An expanded browser-health fixture exposed React hydration errors when a stored English preference changed deferred BG sections during hydration. The startup now uses the prerendered English URL before hydration; the regression tests pass without suppressing errors.

## Removed and retained files

Removed the temporary, uncommitted `config/deployment.mjs`, `src/deployment.d.ts` and `.env.example`. Replaced `src/lib/deployment.ts` with the smaller `src/lib/urls.ts`; removed custom globals/environment settings and generated deployment JSON. Removed unused experimental font subset assets/script and their proposed dependencies. These were unnecessary for the single GitHub Pages target.

Kept `src/entry-server.tsx`, `scripts/prerender.mjs`, the image manifest, photograph metadata, image optimization scripts and required source assets. All responsive image files remain. The compact manifest removes repeated path strings while reconstructing identical URLs.

`.openai/hosting.json` was already removed from Git in `e78eb62`; its ignored local copy and existing Sites publication were not changed. `dist/`, `.prerender/`, `node_modules/`, screenshots and generated reports remain ignored.

## Performance

Three fresh baseline/final mobile runs per language: median Performance **84 → 84 BG**, **83 → 83 EN**; Accessibility / Best Practices / SEO remain **100**. Final median LCP is **4.507 s BG / 4.660 s EN**. The 90+ target remains unmet; small timing differences are within likely measurement variation. No speed claim is based on the older 81/77 run.

Main JavaScript: 259.76 kB (81.92 kB gzip), down from 277.46 kB (83.50 kB gzip). Lightbox/Motion remains lazy. Font and hero-preload experiments were not retained. See `docs/PERFORMANCE_COMPARISON.md` for all measurements, settings, bottlenecks and the browser transport limitation.

## Deployment verification

The repository's Pages API was checked before deployment work: source is already `workflow`, branch `main`, HTTPS enforced, target `https://yani0514.github.io/guesthouse-website/`. No repository setting or existing Sites deployment needed modification.

The new `.github/workflows/deploy.yml` is the single deployment workflow. It checks/install/builds/tests before uploading only `dist/`, and deploys through the `github-pages` environment with least-privilege permissions. Local checks do not by themselves establish publication: verify the [Actions deployment run](https://github.com/yani0514/guesthouse-website/actions/workflows/deploy.yml) and public URL after pushing. The final task response records the observed remote outcome.

## Remaining limits and owner information

Phone/email/Viber, exact address/Maps destination, final capacity and pricing, kitchen access and house rules still require owner input; no fabricated values are published. See `CONTENT_REQUIRED.md`. Actual call/email delivery and personal-number Viber behavior cannot be checked without those details. Safari, Firefox, physical devices and screen readers were not tested; automated checks are not complete accessibility certification. Field Core Web Vitals and public search indexing are not claimed.
