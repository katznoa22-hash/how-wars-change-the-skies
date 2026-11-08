# How Wars Change the Skies — Version 3 review release

An English, 10-slide educational presentation about conflict, airspace restrictions, illustrative rerouting and airline decisions. Version 2 improves geographic accuracy, data transparency and visual design while preserving navigation, case-study tabs, route selectors, globe controls, sliders and all four simulator strategies.

Version 3 refines that presentation on the `version-3` branch: larger, high-contrast projector typography; focused keyboard navigation; globe controls and legends outside the map; keyboard globe rotation/zoom; a fuel/other-operations expense breakdown; a four-response simulator comparison; and clearer final conclusions with expandable academic sources. The presentation still has exactly ten slides. Validated Version 2 model assumptions, data, source links and local dependencies are unchanged. The existing `assets/v2.js` continues to hold the shared model/rendering functions; the name does not indicate a separate presentation or a changed scientific model.

Version 2 is preserved at annotated tag `v2.0`, commit `1dd228500b5ba5708412495f1c43704468728b75`. Version 3 is identified by annotated tag `v3.0` and is a review release. **Version 4, not Version 3, will be the final submission version.** Version 4 work has not started. The exact Version 3 prompts, phases, camera-control repair, executed results, release procedure and limitations are recorded in [prompts/codex-development-v3.md](prompts/codex-development-v3.md).

## Preview locally

From the project directory, run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/** in Chrome or Edge. Stop the server with Ctrl+C. You can also open `index.html` directly: libraries and data are local and no fetch request is needed. Use a browser with WebGL for the 3D view; the 2D map is available if WebGL fails. No npm installation or internet connection is needed for the presentation. Source links open external sites when clicked.

Navigate with Previous/Next, slide dots, arrows, Space, Page Up/Down, Home/End or number keys (0 opens slide 10). Press F for fullscreen or use its button. Inputs keep their own keyboard controls. On slide 6, drag to rotate, scroll to zoom, reset the camera, pause rotation or switch to the 2D map. Slide 5 and slide 6 share the route selection. On slide 9, choose either scenario, one of four strategies and a jet fuel price; expand the assumptions disclosure.

For keyboard globe interaction, Tab to the globe on slide 6 and use **W/A/S/D** to rotate and **+/−** to zoom. Arrow keys remain slide navigation. The keyboard-shortcuts dialog captures focus and returns it when closed. Reduced-motion preferences pause automatic rotation, including changes while presenting. If WebGL is unavailable or its context is lost, the 2D map retains route selection; reload to restore 3D.

On slide 7, use the selected route's extra hours (explicitly rounded to the existing 0.1-hour slider step) or reset inputs. The stacked bar divides incremental fuel and other operating expense using the same validated calculation. On slide 9, expand “Compare responses and inspect assumptions” to view all four responses at the current scenario/price, full feedback and the invented-score assumptions. Formulas, geographic limits and academic references remain available in disclosures so the main slide can stay readable. Expanded disclosures and narrow/mobile screens intentionally allow vertical scrolling.

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
node --check tests/browser.mjs
node tests/browser.mjs
```

The browser suite requires Node 22+ with built-in WebSocket support and installed Chrome or Edge. It starts a local test server on port 8765 and a headless browser on debugging port 9222, stores an isolated profile in `.browser-profile/`, writes results/screenshots to `artifacts/`, then closes its browser and server. Do not run it concurrently with another process using those ports.

The Version 3 suite also records 30 projector-layout measurements (all ten slides at 1280×720, 1366×768 and 1920×1080), checks horizontal/vertical fit with disclosures closed, and saves `artifacts/v3-slide-01-projector.png` through `v3-slide-10-projector.png`. It checks every simulator scenario/strategy/price combination, chart totals, keyboard focus, route-hour/reset controls and actual WebGL context-loss fallback. The generated report continues to sanitize workstation paths. Projector screenshots are test evidence, not backup copies or another application.

`analysis.py` generates `data/scenarios.json` and its browser script companion, `data/presentation-data.js`. Both come from the same inputs. Independent coordinate references reject reversed or geographically incorrect airport inputs before analysis.

## Evidence, limitations and development history

See [SOURCES.md](SOURCES.md) for the slide-by-slide audit, exact formulas, source URLs, dates, licenses and coordinate verification. See [prompts/antigravity-development.md](prompts/antigravity-development.md) for the actual Antigravity history followed by the Codex stage, and [prompts/codex-validation.md](prompts/codex-validation.md) for executed checks and results.

This model is **illustrative, not operational flight planning**. Red country shading is historical geographic context, not exact FIR or restriction geometry. Routes are not verified historical flight tracks or approved safe alternatives. Airport coordinates are community dataset snapshots checked within 5 km of independent airport references, not certified ARPs. Speed, fuel burn, costs and simulator scores are assumptions. No live airspace feed, winds, aircraft performance model or full climate assessment is included. WebGL behavior varies by graphics hardware; 2D provides a fallback.

Version 1 remains at commit `9a9ce56dfe23dc5f06a501c3e7582c605c540362`, previously verified on GitHub main. Tests verify its ancestry and original HTML checksum directly from Git history, so a clone does not need local backups (a shallow clone must include Version 1 history). A byte-verified original HTML backup is also kept locally at `backups/version-1/index.html`; backups and browser profiles are ignored by Git. PRD.md remains the original requirements document. The Version 2 release is identified by the annotated `v2.0` tag; publishing requires separate approval.

`scripts/fetch_assets.py` is an explicit asset-refresh utility, not a startup dependency. It uses only the reviewed URLs, validates paths and backs up existing destinations. Do not rerun it merely to preview. `scripts/upgrade_v2.py` is the one-time migration record and refuses a second migration or a missing/invalid Version 1 backup.
