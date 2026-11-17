# Бананов рай — Bananov Rai

A complete static guest-house website for the family property near Tsonevo Reservoir, Varna Province. Bulgarian is the default language; English has its own prerendered page. The original 22 owner photographs are the only property imagery used.

The website presents the house, three floors, amenities, a categorized keyboard-accessible gallery, indicative prices and conditional direct-contact methods. It has no reservation transactions, payments, database or application backend.

## Run locally

Use Node.js **22.19 or newer** for all tooling (the application build also passed on the installed Node 22.14). From this directory:

```powershell
npm ci
npm run dev
```

Vite prints the development URL. Production preview:

```powershell
npm run build
npm run preview
```

Open [the local preview](http://127.0.0.1:4173/bg/) or [English](http://127.0.0.1:4173/en/).

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
scripts/serve-built.mjs        Compressed static server for local performance audits
scripts/lighthouse.mjs         Repeatable mobile Lighthouse reports
src/components/layout/        Header, mobile navigation and footer
src/components/sections/      Hero, about, floors, amenities, pricing, contact
src/components/gallery/       Filtered gallery and lazy-loaded modal
src/components/ui/            Original brand and responsive photo primitive
src/data/property.ts          Typed business configuration
src/data/gallery.ts            Typed image manifest access
src/data/images.json           Generated image metadata
src/locales/{bg,en}.json       UI copy and metadata translations
src/lib/                      Localization and SEO helpers
src/index.css                 Tokens, component styles and responsive rules
tests/website.spec.ts          Browser and data-integrity checks
docs/                         Photo inventory, screenshots and audit reports
dist/                         Generated deployment folder (not source)
```

## Update property information

Edit `src/data/property.ts` for names, provisional capacity, floor data, prices, contact details and the site origin. Keep floor descriptions in both locale files consistent with the structured configuration when changing bed or bathroom arrangements.

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

Edit matching keys in `src/locales/bg.json` and `en.json`. Image alt text and captions are bilingual fields in `scripts/photo-records.json`. The build produces complete crawlable HTML at `/bg/` and `/en/`, plus a Bulgarian root page. Both language routes have localized titles, descriptions, Open Graph metadata, canonical/hreflang links and conservative LodgingBusiness structured data.

Switching languages requires no reload, updates the document language and metadata, and stores a local language preference when storage is available. An explicit language URL takes priority. Browser back/forward navigation also updates the selected language. No analytics or advertising scripts are installed.

Set `property.siteUrl` to the final HTTPS origin before deploying to a different host, then rebuild. This also updates the sitemap, canonical URLs, social-image URLs and structured-data URLs. The current origin is the private Sites destination recorded in `.openai/hosting.json`; it is not a claim of public search indexing.

## Verification

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm test
```

The browser suite checks both languages, persistence/history, static no-JavaScript content, all gallery categories, modal keyboard controls and focus, pricing, missing contacts, five viewport widths, reduced motion, unavailable storage and axe accessibility rules. It uses the built site on port 4173.

For repeatable performance measurement, first build. In one terminal start `node scripts/serve-built.mjs`; in another run `node scripts/lighthouse.mjs` with Node >=22.19. The audit server uses standard HTTP compression and runs on port 4174. Restart it after rebuilding because it caches files in memory. It is local tooling and is not deployed. The Lighthouse script uses Playwright's installed Chromium, a mobile profile and simulated network/CPU throttling. Run it while other browser tests and image processing are idle. Results are stored in `docs/audits/`.

On a host still running Node 22.14, the tested fallback is `npm.cmd exec --yes --package=node@22 -- node scripts/lighthouse.mjs`. This runs the audit using an isolated newer Node without changing the global installation.

See `VERIFICATION_REPORT.md` for measured results and remaining verification limits.

## Deploy

Run `npm ci` and `npm run build`; upload the **contents of `dist/`** to any static host. Serve directory index files for `/bg/` and `/en/`; enable HTTPS, Brotli/gzip for text assets and appropriate caching. No Node server or Python runtime is required in production. Do not upload source originals, tests, audit reports or `node_modules` as public assets.

For Sites, `.openai/hosting.json` identifies the existing project and `dist` output. Reuse that project ID, sync the exact source, build and save/deploy the corresponding version. The initial audience is owner-only. Public promotion requires a deliberate audience change and the missing contact details.

## Known limits

- Phone, email, exact location and final capacity/pricing require owner confirmation.
- Automated audits are not a complete WCAG certification; screen-reader and real-device testing remain useful.
- Physical iOS/Android behaviour and the final hosting network have not been measured locally.
- The static page remains readable without JavaScript; interactive filters, language controls and the modal need JavaScript.
- Original JPEGs came from the supplied archive, max 2048 px. Large displays cannot reveal detail absent from those sources.

## Official references used

- [React versions](https://react.dev/versions)
- [Vite installation and Node requirements](https://vite.dev/guide/)
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Motion React installation](https://motion.dev/docs/react-installation)
- [react-i18next hooks](https://react.i18next.com/latest/using-with-hooks)
- [Viber developer deep links](https://developers.viber.com/docs/tools/deep-links/)

The original SVG banana-leaf/wave mark was drawn for this project. The provided property photographs remain the owner's assets. Font licenses are supplied by the respective Fontsource packages (SIL Open Font License).
