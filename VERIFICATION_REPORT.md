# Verification report — 17 November 2026

## Delivered implementation

All seven milestones are implemented: repository/assets, design system, property presentation, amenities/gallery/pricing, contacts/localization/SEO, responsive polish and verification/deployment preparation. The remaining business data and performance target are explicitly documented below.

The site is a static React/TypeScript application with complete prerendered Bulgarian and English HTML. It uses only the 22 supplied photographs and an original SVG banana-leaf/wave identity. There is no booking engine, account system, payment flow or backend API.

## Build and code checks

- `npm run build`: passed strict TypeScript, Vite client bundling, server-side prerender bundling and static language-page generation.
- `npm run lint`: passed with no warnings or errors.
- `npm run format:check`: passed.
- `npm audit --omit=dev`: zero known production dependency vulnerabilities at verification time.
- Main JavaScript: 277.46 kB (83.50 kB gzip); shared Photo/i18n chunk: 66.36 kB (22.19 kB gzip). Lightbox/Motion: 140.44 kB (47.22 kB gzip), loaded on interaction.
- CSS: 25.71 kB (6.77 kB gzip). Fonts are served locally. No third-party application requests are required.

## Browser tests

**11/11 Playwright tests passed**, Chromium 159.0.8154.6 on Windows, against the production build.

Covered:

- Bulgarian default, English switching, explicit language URLs, saved preference, browser history and localized metadata.
- Correct floor capacities, first-floor WC without a shower, indicative pricing and missing-contact handling.
- Every gallery category and all 22 underlying image assets.
- Modal opening, next/previous and wraparound navigation, Tab trapping, Escape/close controls and restored trigger focus.
- Mobile-menu opening, closing, Escape and focus return; desktop/mobile anchor navigation.
- No horizontal overflow at **360, 390, 768, 1024 and 1440 px**, in both languages.
- Complete translated HTML and metadata with JavaScript disabled.
- Reduced motion and disabled local storage.
- Translation-key parity, capacity totals, unique source images and no upscaled responsive variants.
- No page errors or failed resource responses in the checked initial flow.

The automated axe checks covered WCAG 2 A/AA, WCAG 2.1 A/AA and WCAG 2.2 AA at all five widths and inside the modal. **No violations were returned.** These automated checks are not a complete accessibility certification.

## Visual review

Inspected actual rendered screenshots of the Bulgarian desktop/mobile hero and sections, plus the English desktop layout. Checked typography, genuine photograph placement, image cropping, price prominence and mobile stacking. Screenshots and numbered original-photo contact sheets are in `docs/` locally.

Issues found and fixed during verification:

- Two small captions below the required text-contrast ratio.
- Native-dialog Tab behaviour allowing focus to leave the controls; explicit wrapping now keeps it inside.
- Accessible names that omitted the visible brand/language labels.
- A CSS specificity conflict shrinking the price figures.
- Initial font-import paths incompatible with the installed Fontsource release.
- Tailwind scanning generated reports; source discovery is now limited to application files.
- Long synchronous hydration work; separate Suspense boundaries allow section hydration to yield.

## Image results

- **22 preserved originals**, 7,998,178 bytes total; 17 landscape and 5 portrait photographs.
- All original orientations/dimensions inspected; no exact duplicate hashes.
- **105 sizes per format, 315 files total:** AVIF, WebP and progressive JPEG; 44,943,658 bytes across all alternatives. A browser loads one appropriate format and size, not the whole collection.
- Hero example: 768 px AVIF is **46,744 bytes**; 960 px WebP is 137,774 bytes. Actual format/width selection depends on viewport and pixel density.
- No upscaling, invented property images, added foliage or colour grading.
- Real exterior social image: 1200 × 630 JPEG.
- See `docs/IMAGE_INVENTORY.md`, `docs/image-inventory.json` and `docs/image-processing-summary.json`.

## Lighthouse: measured results and limits

Final retained mobile run: **17 November 2026, 17:14 Europe/Paris**. Lighthouse 13.6.0, Chromium 159, isolated Node 22.23.5, Windows host. Default mobile simulation and simulated CPU/network throttling, against the built files on a local static server with Brotli/gzip support. Text compression is prepared before requests. This is a local lab test, not a measurement of the final hosted network or real guests.

| Metric                   | Bulgarian | English |
| ------------------------ | --------: | ------: |
| Performance              |    **81** |  **77** |
| Accessibility            |   **100** | **100** |
| Best practices           |   **100** | **100** |
| SEO                      |   **100** | **100** |
| First Contentful Paint   |     1.2 s |   3.0 s |
| Largest Contentful Paint |     5.2 s |   4.8 s |
| Total Blocking Time      |     10 ms |   80 ms |
| Cumulative Layout Shift  |     0.037 |       0 |

**The 90+ mobile performance target was not achieved.** AVIF, font preload, scoped CSS generation and section hydration improved specific costs, but the simulated largest-contentful paint remains slow. Further work should focus on critical-font/image delivery and reducing initial React/i18n work, then be measured on the intended public hosting. Results varied between runs; the table reports the final retained run, not the highest scores. Full reports and machine-readable metrics are saved locally in `docs/audits/`.

## Unverified or awaiting owner input

- No phone, email, Viber number or exact address was supplied. The corresponding real-world actions cannot be verified and are not advertised with fabricated values.
- Viber launching on physical devices remains unverified. Its public bot-link documentation does not establish personal-number compatibility on every platform. Verify the owner's link before enabling it; a phone alternative is implemented.
- Capacity and price range are provisional; guest kitchen access and published house rules need confirmation.
- Physical iOS/Android devices, Safari, Firefox and screen-reader interaction have not been tested in this run.
- Public search indexing, production Core Web Vitals and CDN behaviour are not claimed. The initial Sites audience is owner-only.

## Deployment handoff

The deployable output is `dist/`, including `/bg/`, `/en/`, robots, sitemap, fonts and image assets. `.openai/hosting.json` records the existing private Site and static output. README includes local commands, content/image maintenance and generic static-host deployment instructions. The final chat response records the actual Sites publication result.
