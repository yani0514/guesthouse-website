# Performance comparison — 17 November 2026

Three runs per language on the unchanged starting build (`e78eb62`) and on the simplified GitHub Pages build. Historical 81 BG / 77 EN scores are not used as the fresh baseline.

## Controlled conditions

Lighthouse 13.6.0, Chromium 159.0.8154.6, Node 22.23.5, Windows. Default mobile emulation (412 × 823, DPR 1.75), simulated 150 ms RTT / 1638.4 Kbps throughput / 4× CPU slowdown. Same local static server and machine; browser tests and builds were idle during measurement. Baseline URLs were `/bg/` and `/en/`; final URLs add `/guesthouse-website/`.

**Transport limitation:** Node HTTP checks confirm Brotli response headers and compressed lengths (baseline HTML 7,664 bytes). This environment’s browser transport exposes `x-content-encoding-over-network: br`, removes Content-Encoding, and reports decompressed transfer sizes to Lighthouse (baseline HTML 83,985 bytes including headers). Both baseline and final use the same transport. These are comparative local lab results, not production CDN or field Core Web Vitals measurements.

## Results

| Metric (median of three) | BG baseline | BG final | EN baseline | EN final |
| ------------------------ | ----------: | -------: | ----------: | -------: |
| Performance              |          84 |       84 |          83 |       83 |
| Accessibility            |         100 |      100 |         100 |      100 |
| Best practices           |         100 |      100 |         100 |      100 |
| SEO                      |         100 |      100 |         100 |      100 |
| FCP                      |     1.206 s |  1.207 s |     1.206 s |  1.208 s |
| LCP                      |     4.581 s |  4.507 s |     4.733 s |  4.660 s |
| TBT                      |        0 ms |     0 ms |       14 ms |     0 ms |
| CLS                      |       0.037 |    0.037 |       0.000 |    0.000 |

All raw Performance scores (chronological):

- baseline, bg: 81, 84, 84.
- baseline, en: 77, 83, 83.
- final, bg: 85, 84, 84.
- final, en: 83, 82, 83.

## Findings and retained changes

- The LCP element is the real hero photograph (`.hero-visual img`), selecting the 768 px AVIF in these mobile runs: 46,744 bytes. It is already in initial HTML, eager and high priority.
- A responsive hero preload and reduced module-fetch priority were evaluated and removed: they did not show a reliable improvement. No redundant image preload remains.
- The image manifest now stores width lists and generates the same 315 URLs in the typed adapter. Main JavaScript fell from 277.46 kB to 259.76 kB (gzip 83.50 → 81.92 kB); no image file was removed. The shared Photo/i18n chunk is 66.73 kB, and the 140.44 kB Lightbox/Motion chunk remains lazy.
- Font requests were reviewed. BG uses both Cyrillic and Latin files because the Cyrillic subsets omit digits/punctuation and some labels are Latin. EN uses Latin. A partial font experiment was discarded when simplifying; no new font pipeline or dependencies remain. Existing weights, glyphs, font-display and typography are preserved.
- CSS remains about 25.83 kB (6.79 kB gzip); Lighthouse did not identify a material unused-CSS opportunity. Above-fold HTML is still statically rendered; section hydration boundaries and lazy lightbox loading are retained.

**The 90+ target is not met.** Median scores are effectively unchanged (84 BG / 83 EN). The approximately 75 ms BG and 73 ms EN median LCP reductions are small and may be run-to-run noise; they are not a claimed material speed gain. BG font-related CLS remains 0.037. The remaining local cost is initial React/i18n transfer and critical font/image delivery under Lighthouse’s simulation, amplified by this environment’s decompressed transfer accounting.

The final user request prioritizes a simple, maintainable GitHub Pages deployment. Speculative optimizations and configuration layers were removed; no redesign or additional dependencies were introduced. Raw HTML/JSON audits remain ignored in `docs/audits/` rather than being committed.
