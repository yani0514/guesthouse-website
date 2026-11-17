# Бананов рай — Bananov Rai

A complete static guest-house website for the family property near Tsonevo Reservoir, Varna Province. Bulgarian is the default language; English has its own prerendered page. The original 22 owner photographs are the only property imagery used.

The website presents the house, three floors, amenities, a categorized keyboard-accessible gallery, indicative prices and conditional direct-contact methods. It has no reservation transactions, payments, database or application backend.

## Run locally

Use Node.js **22.19 or newer**. The GitHub workflow uses Node 22.23.5. From this directory:

```powershell
npm ci
npm run dev
```

Vite serves development at `/guesthouse-website/`, matching production. Production preview:

```powershell
npm run build
npm run preview
```

Open [the local preview](http://127.0.0.1:4174/guesthouse-website/bg/) or [English](http://127.0.0.1:4174/guesthouse-website/en/).

## Stack

React 19, strict TypeScript, Vite 8, Tailwind CSS 4, Motion, Lucide React, i18next/react-i18next, ESLint and Prettier. Manrope and Lora are self-hosted with explicit Cyrillic and Latin subsets, including proper italic display fonts. Versions are locked in `package-lock.json`.

Tailwind owns the theme tokens and component layers; a scoped source directive prevents documentation or audit reports from producing unintended utility CSS. Motion is loaded with the lightbox, keeping its animation code out of initial page loading.

## Project structure

```text
assets-source/                 All 22 untouched originals
public/images/                Responsive image formats, organized by category
public/*.svg                  Original logo variations and favicon
public/social.jpg             Social image from the real exterior photo
scripts/audit-images.py        Safe ZIP extraction, hashes and contact sheets
scripts/photo-records.json     Source prefixes, descriptive slugs and BG/EN captions
scripts/optimize-images.py     Responsive asset generation and manifest
scripts/prerender.mjs          Static language HTML and SEO generation
scripts/serve-built.mjs        Strict local static preview at the Vite base path
scripts/lighthouse.mjs         Repeatable mobile Lighthouse reports
src/components/layout/        Header, mobile navigation and footer
src/components/sections/      Hero, about, floors, amenities, pricing, contact
src/components/gallery/       Filtered gallery and lazy-loaded modal
src/components/ui/            Original brand and responsive photo primitive
src/data/property.ts          Typed business configuration
src/data/gallery.ts            Typed image manifest access
src/data/images.json           Generated image metadata
src/locales/{bg,en}.json       UI copy and metadata translations
src/lib/urls.ts               Vite-based public paths and GitHub canonical URLs
src/lib/                      Localization, SEO and validated contact helpers
.github/workflows/deploy.yml   The only deployment workflow
src/index.css                 Tokens, component styles and responsive rules
tests/website.spec.ts          Browser and data-integrity checks
docs/                         Photo inventory, screenshots and audit reports
dist/                         Generated deployment folder (not source)
```

## Update property information

Edit `src/data/property.ts` for names, provisional capacity, floor data, prices, contact details. Keep floor descriptions in both locale files consistent with the structured configuration when changing bed or bathroom arrangements.

The first floor has three sleeping places and a WC **without a shower**. The upper floors have eight places each, with a bathroom for the twin room and a shared bathroom for the two triple rooms. Bedroom photos are intentionally not attached to particular floors.

`capacityProvisional` controls the qualification beneath the floor panels. `kitchenAvailableToGuests` stays false until guest access is confirmed. The gallery can show the real kitchen without advertising guest access.

Prices come from `pricing.minIndicativePricePerPerson` and `maxIndicativePricePerPerson`. They are per person/night and indicative. There is no live price calculator.

## Add contact details

Populate optional `contact.phone`, `email`, `viber` and `facebook`. Use an international phone number including `+`, a valid email address and an official HTTPS social link. Phone and email actions use `tel:` and `mailto:`. The Viber scheme is generated as `viber://chat?number=` with a percent-encoded international number, alongside a phone alternative when configured.

**Viber is not activated or device-verified:** no number was supplied. Viber's public developer documentation primarily covers bot deep links, not guaranteed personal-number behaviour. Confirm the owner's mobile link on iOS/Android before enabling it. Actual phone/email delivery also requires the missing owner details.

Set `location.address` and `location.mapsDestination` only after verification. The directions link then uses the Google Maps directions API URL. No external map is embedded, and no unverified pin is shown.

See `CONTENT_REQUIRED.md` for the owner checklist.

## Photography workflow

Originals are retained in `assets-source/`; their SHA-256 hashes and original dimensions are in `docs/image-inventory.json`. The supplied ZIP remains untouched one directory above this project.

Python 3 and Pillow with AVIF/WebP support are needed only when regenerating photographs, not for normal installation or building:

```powershell
python -m pip install -r scripts/requirements.txt
npm run images
```

To add a photograph, copy its original into `assets-source/`, add its unique source prefix, descriptive slug, category and accurate bilingual caption to `scripts/photo-records.json`, and run the optimizer. It writes `src/data/images.json` and categorized assets automatically. Do not edit the generated manifest by hand. Replacing images with different dimensions requires regeneration and another build.

Variants never exceed the original width. AVIF is preferred, then WebP, then progressive JPEG. The hero loads eagerly with high priority; other images load lazily with reserved dimensions. The lightbox uses the same responsive manifest with full-image containment. Property colours and photographic content are not artificially changed.

## Translation and SEO

Edit matching keys in `src/locales/bg.json` and `en.json`. Image alt text and captions are bilingual fields in `scripts/photo-records.json`. The build produces complete crawlable HTML at `/guesthouse-website/bg/` and `/guesthouse-website/en/`, plus the Bulgarian `/guesthouse-website/` page. Both language routes have localized titles, descriptions, Open Graph metadata, canonical/hreflang links and conservative LodgingBusiness structured data.

Switching languages requires no reload, updates the document language and metadata, and stores a local language preference when storage is available. An explicit language URL takes priority. Browser back/forward navigation also updates the selected language. No analytics or advertising scripts are installed.

`vite.config.ts` sets `base: "/guesthouse-website/"`. The small `src/lib/urls.ts` helper uses Vite's built-in `import.meta.env.BASE_URL` and the GitHub origin `https://yani0514.github.io` for public paths, navigation and canonical URLs. The same helper is bundled for the browser and static prerendering. There are no deployment environment variables, custom globals or generated configuration files.

An explicit language URL takes priority over storage. Visiting the base page with a saved English preference replaces it with the prerendered English URL, preserving the hash and avoiding hydration mismatches.

## Verification

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm test
```

The browser suite retains the original 11 tests and adds production checks for all three routes, all 315 image variants, fonts/CSS/JavaScript, canonical/social/hreflang URLs, sitemap, hashes, refresh, console/network failures and contact validation. It includes no-JavaScript rendering, gallery keyboard controls, five viewport widths and axe accessibility coverage. Tests start the strict static server on port 4173 at `/guesthouse-website/`; domain-root and unknown routes return 404 instead of falling back to a SPA.

For repeatable performance measurement, first build. In one terminal start `node scripts/serve-built.mjs`; in another run `npm run audit:performance` with Node >=22.19. The audit server uses standard HTTP compression and runs on port 4174. Restart it after rebuilding because it caches files in memory. It is local tooling and is not deployed. The Lighthouse script uses Playwright's installed Chromium, a mobile profile and simulated network/CPU throttling. Run it while other browser tests and image processing are idle. Three runs per language are stored in ignored `docs/audits/`. `AUDIT_LABEL`, `AUDIT_RUNS` and `AUDIT_URL` are optional measurement settings, not deployment configuration. See `docs/PERFORMANCE_COMPARISON.md` for measured results and environment limitations.

On a host still running Node 22.14, the tested fallback is `npm.cmd exec --yes --package=node@22 -- node scripts/lighthouse.mjs`. This runs the audit using an isolated newer Node without changing the global installation.

See `VERIFICATION_REPORT.md` for measured results and remaining verification limits.

## GitHub Pages deployment

The only deployment target is [GitHub Pages](https://yani0514.github.io/guesthouse-website/), from branch `main` of [the repository](https://github.com/yani0514/guesthouse-website).

`.github/workflows/deploy.yml` runs on pushes to `main` and manual dispatch. It installs locked dependencies, checks types/lint/formatting, runs the full client + SSR + static prerender build, installs Chromium and runs Playwright against the production files. Only a passing build uploads `dist/` and deploys it using the official Pages Actions. The separate deployment job has Pages/OIDC write permissions; the build only has read access. The workflow serializes deployments and uses the `github-pages` environment.

One-time repository setup, if Pages is not enabled yet:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.
3. Push the verified source to `main`, or open **Actions → Verify and deploy GitHub Pages → Run workflow**.
4. Check the workflow's deploy job and environment URL before claiming publication.

The artifact contains root, `bg/index.html`, `en/index.html`, sitemap, robots, local fonts and public images. GitHub mounts that artifact under `/guesthouse-website/`; do not create another nested folder in `dist/`. No runtime server, secrets, `.env` file, Python installation or committed `dist/` is needed for deployment.

`src/entry-server.tsx` and `scripts/prerender.mjs` are required: they generate localized HTML and SEO. The source image manifest and image optimization scripts are also retained. Python/Pillow is used only to regenerate photographs, not for deployment. All 315 existing image files remain available; the compact manifest stores sizes and reconstructs their predictable URLs once in `src/data/gallery.ts`.

The obsolete `.openai/hosting.json` was already removed from Git in commit `e78eb62`. Its ignored local copy and the older hosted Site are untouched; the Pages workflow neither reads nor changes them. Build output, dependencies, prerender intermediates and generated reports remain ignored.

## Known limits

- Phone, email, exact location and final capacity/pricing require owner confirmation.
- Automated audits are not a complete WCAG certification; screen-reader and real-device testing remain useful.
- Physical iOS/Android behaviour and the final hosting network have not been measured locally.
- The static page remains readable without JavaScript; interactive filters, language controls and the modal need JavaScript.
- Original JPEGs came from the supplied archive, max 2048 px. Large displays cannot reveal detail absent from those sources.

## Official references used

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages)
- [React versions](https://react.dev/versions)
- [Vite installation and Node requirements](https://vite.dev/guide/)
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Motion React installation](https://motion.dev/docs/react-installation)
- [react-i18next hooks](https://react.i18next.com/latest/using-with-hooks)
- [Viber developer deep links](https://developers.viber.com/docs/tools/deep-links/)

The original SVG banana-leaf/wave mark was drawn for this project. The provided property photographs remain the owner's assets. Font licenses are supplied by the respective Fontsource packages (SIL Open Font License).
