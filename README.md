# AppianWay — website

Angular 22 site for AppianWay, a quantitative trading firm. Brand assets come from
`../AppianWay-Brand-Kit` (copied into `public/brand`, favicons into `public/`).

```bash
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/appianway
npm test           # unit tests (Vitest)
```

## Design concept — "the road of probabilities"

The firm is named for the Via Appia, Rome's first great road. The site treats it as a
road: every section is a numbered milestone (`M·P III`), the header's hairline fills
like distance travelled, and the paving texture is generated from fitted polygonal
stones. Quant visuals carry the content:

| Where | Visual | File |
| --- | --- | --- |
| Home hero | 10,000 zero-drift random walks + one drifting "edge" path, ±2σ cone, live density, hover probe | `src/app/viz/path-field.ts` |
| Home / Approach | Vitruvius' four road layers mapped to Execution → Strategy → Research → Infrastructure | `src/app/viz/road-section.ts` |
| Home / Approach | Time-series decomposition: observed = signal + structure + noise | `src/app/viz/signal-decomp.ts` |
| Technology | Simulated limit order book, mid trace and tape | `src/app/viz/order-book.ts` |
| Technology | Log-normal tick-to-trade latency histogram with p50/p99/p99.9 | `src/app/viz/latency-histogram.ts` |

All data is synthetic, generated in the browser from seeded RNGs and labelled as such.

## Structure

```
src/app/
  layout/   header (nav, market clocks, scroll road), footer (disclaimer)
  pages/    home, approach, technology, careers, contact, not-found  (lazy routes)
  shared/   milestone label, tick glyph, reveal-on-scroll, page hero, paving band …
  viz/      canvas/SVG visualisations + seeded random & paving generators
  data/     roles.ts — open positions
```

Brand rules followed: Onyx/Graphite grounds, Fog for rules and secondary text, Mist
for light sections, Signal Blue as an accent on dark grounds only (light sections
remap `--accent` to Onyx). Roboto for text, Roboto Mono for figures and labels.

## Before launch — placeholders to replace

- `data/roles.ts` — open roles, locations
- `pages/contact` — Lagos office street address, email inboxes (`*@appianway.com`); add offices as the firm expands
- Market coverage (`pages/approach`), stack (`pages/technology`), benefits (`pages/careers`)
- Disclosures / privacy copy — have compliance review
- Contact form opens the visitor's mail client; swap `Contact.submit()` for an API call when a backend exists
