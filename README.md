# How Wars Change the Skies — Version 2

An English, 10-slide educational presentation about conflict, airspace restrictions, illustrative rerouting and airline decisions. Version 2 improves geographic accuracy, data transparency and visual design while preserving navigation, case-study tabs, route selectors, globe controls, sliders and all four simulator strategies.

## Preview locally

From the project directory, run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/** in Chrome or Edge. Stop the server with Ctrl+C. You can also open `index.html` directly: libraries and data are local and no fetch request is needed. Use a browser with WebGL for the 3D view; the 2D map is available if WebGL fails. No npm installation or internet connection is needed for the presentation. Source links open external sites when clicked.

Navigate with Previous/Next, slide dots, arrows, Space, Page Up/Down, Home/End or number keys (0 opens slide 10). Press F for fullscreen or use its button. Inputs keep their own keyboard controls. On slide 6, drag to rotate, scroll to zoom, reset the camera, pause rotation or switch to the 2D map. Slide 5 and slide 6 share the route selection. On slide 9, choose either scenario, one of four strategies and a jet fuel price; expand the assumptions disclosure.

## What changed

- Accurate Natural Earth country geometry renders a detailed cartographic Earth texture, visible country boundaries and dated scenario context. Airport markers, labels, dashed baseline paths, solid detours and an animated route marker support geographic reading.
- Great-circle interpolation follows spherical geometry; illustrative detours use the same waypoints as Python distance calculations. The optional 2D map shows the same data.
- Cost and CO₂ use one fuel-mass assumption with explicit US-gallon conversion. Historical facts link to sources; calculated estimates and invented simulator scores are labeled separately.
- Simulator scenario selection changes outcomes. Suspension punctuality is N/A, and all strategies disclose assumptions without claiming safety or profitability.
- Local libraries remove CDN dependence. Responsive layouts, keyboard focus, keyboard-operable strategy cards, accessible dot buttons and reduced-motion defaults improve presentation access.

## Reproduce calculations and run checks

Preview screenshots: [3D globe](artifacts/globe-desktop.png), [2D map](artifacts/map-desktop.png), [mobile layout](artifacts/globe-mobile.png).

Python uses only its standard library. Downloaded assets and generated data are already included.

```powershell
py scripts/validate_airports.py
py analysis.py
py -m unittest discover -s tests -p '*checks.py'
node --check assets/v2.js
node tests/browser.mjs
```

The browser suite requires Node 22+ with built-in WebSocket support and installed Chrome or Edge. It starts a local test server on port 8765 and a headless browser on debugging port 9222, stores an isolated profile in `.browser-profile/`, writes results/screenshots to `artifacts/`, then closes its browser and server. Do not run it concurrently with another process using those ports.

`analysis.py` generates `data/scenarios.json` and its browser script companion, `data/presentation-data.js`. Both come from the same inputs. Independent coordinate references reject reversed or geographically incorrect airport inputs before analysis.

## Evidence, limitations and development history

See [SOURCES.md](SOURCES.md) for the slide-by-slide audit, exact formulas, source URLs, dates, licenses and coordinate verification. See [prompts/antigravity-development.md](prompts/antigravity-development.md) for the actual Antigravity history followed by the Codex stage, and [prompts/codex-validation.md](prompts/codex-validation.md) for executed checks and results.

This model is **illustrative, not operational flight planning**. Red country shading is historical geographic context, not exact FIR or restriction geometry. Routes are not verified historical flight tracks or approved safe alternatives. Airport coordinates are community dataset snapshots checked within 5 km of independent airport references, not certified ARPs. Speed, fuel burn, costs and simulator scores are assumptions. No live airspace feed, winds, aircraft performance model or full climate assessment is included. WebGL behavior varies by graphics hardware; 2D provides a fallback.

Version 1 remains at commit `9a9ce56dfe23dc5f06a501c3e7582c605c540362`, previously verified on GitHub main. Tests verify its ancestry and original HTML checksum directly from Git history, so a clone does not need local backups (a shallow clone must include Version 1 history). A byte-verified original HTML backup is also kept locally at `backups/version-1/index.html`; backups and browser profiles are ignored by Git. PRD.md remains the original requirements document. The Version 2 release is identified by the annotated `v2.0` tag; publishing requires separate approval.

`scripts/fetch_assets.py` is an explicit asset-refresh utility, not a startup dependency. It uses only the reviewed URLs, validates paths and backs up existing destinations. Do not rerun it merely to preview. `scripts/upgrade_v2.py` is the one-time migration record and refuses a second migration or a missing/invalid Version 1 backup.
