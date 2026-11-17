# Production audit — GitHub Pages

Inspected on 17 November 2026, starting at `e78eb62` on `main`, matching `origin/main`. The only previous change since the initial implementation was removal of the tracked Sites manifest. There was no deployment workflow or AGENTS.md.

## Problems found and corrections

| Finding                                                                                   | Correction                                                                                                                                                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite, image URLs, language routes and font preloads assumed domain-root hosting.          | Set the standard Vite `base` to `/guesthouse-website/`; use a small `src/lib/urls.ts` helper based on `import.meta.env.BASE_URL`.                                         |
| Canonical, social, sitemap and schema URLs used the old Sites host.                       | The helper combines the Vite base with `https://yani0514.github.io`; SSR and client SEO use the same code.                                                                |
| No GitHub Pages workflow; preview tests could mask subdirectory failures.                 | One official Actions workflow checks/builds/tests/uploads/deploys. A strict local server reads the standard Vite config and returns 404 outside its base.                 |
| Saved language changed while deferred sections were hydrating, producing React error 418. | The base page replaces its URL with the existing prerendered English page before hydration when English is saved. Hashes survive. Explicit language URLs take precedence. |
| Contact values could produce malformed or unsafe links.                                   | Validate international phone/email/Facebook inputs and encode Viber/Maps parameters; keep owner fields empty until supplied.                                              |
| Repeated image paths inflated the initial JavaScript.                                     | Store source metadata and width lists, then reconstruct the existing variant URLs in the typed gallery adapter. Preserve all 22 photographs and 315 files.                |
| Performance reports were historical.                                                      | Capture three fresh baseline and final runs per language; document the browser transport limitation and remaining LCP cost.                                               |

## Simplified architecture

`vite.config.ts base → import.meta.env.BASE_URL → src/lib/urls.ts → photos / navigation / SEO → entry-server.tsx → prerender.mjs → dist → deploy.yml`

- Removed the uncommitted `config/deployment.mjs`, `src/deployment.d.ts` and `.env.example`. They duplicated standard Vite configuration for hosting flexibility that is no longer requested.
- Replaced `src/lib/deployment.ts` with `src/lib/urls.ts`; no injected globals, custom deployment environment variables or generated deployment JSON remain.
- Removed the unused experimental font-subsetting script/assets and its proposed Python dependencies. Original fonts, CSS and typography remain unchanged.
- Kept the required static prerender entry/script, image manifest, original optimization scripts, React/TypeScript/Vite/Tailwind stack and layout.
- No new dependencies, backend, router, analytics, remote fonts or booking service.

## Repository and deployment boundaries

`.openai/hosting.json` was already removed from tracking in `e78eb62`. Its ignored local copy remains untouched. No workflow references it, and the older Sites publication is not changed or deleted.

Only `dist/` is uploaded by the single Pages workflow. Dependencies, build output, prerender intermediates, source originals, local environment files, screenshots and audit/test reports are ignored. Tests inspect the output for accidental development files and old production host references.

The workflow uses pinned official Action revisions, Node 22.23.5, read-only build permissions and a separate Pages/OIDC deployment job. The `pages` concurrency group prevents overlapping deployments. No force push or history rewriting is used.

Read `VERIFICATION_REPORT.md` for final checks and `PERFORMANCE_COMPARISON.md` for measurements. Missing business data remains listed in `CONTENT_REQUIRED.md`.
