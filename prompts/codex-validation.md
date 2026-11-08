# Version 2 validation — Codex

Date: 8 November 2026. Tests below were actually executed. No commit or push was performed.

## Environment and scope

Windows; Python 3.13 launcher; Node v26.12.1; installed Google Chrome in headless mode with software WebGL (SwiftShader). No Playwright, Selenium, npm package or browser download was needed. The Node harness uses built-in HTTP, WebSocket and Chrome DevTools Protocol support. Live source links were reviewed with the web tool; the browser presentation itself made no external runtime requests.

Version 1 remains at Git HEAD `9a9ce56dfe23dc5f06a501c3e7582c605c540362`, previously directly verified on GitHub main. The original HTML backup SHA-256 is `317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e`. Original airport import is separately backed up; no backup was overwritten by the coordinate correction.

## Executed commands and results

| Command | Actual result |
|---|---|
| `py scripts/correct_coordinate_import.py` | Six records independently confirmed reversed, then corrected. Refuses ambiguous cases; leaves already-valid records unchanged. Original import backed up first. |
| `py scripts/validate_airports.py` | All six corrected records within 5 km of independent published airport locations: FRA 2.972, HEL 0.127, LHR 0.758, HND 1.083, ICN 1.276, SIN 1.130 km. |
| `py analysis.py` | Generated scenario JSON and browser companion from corrected inputs; no network needed. |
| `py -m unittest discover -s tests -p '*checks.py'` | Six tests passed: known spherical distances/symmetry; independently referenced airport locations; rejection of each reversed airport record; reproducibility and units; cost behavior; byte-verified Version 1 backup. |
| `node --check assets/v2.js` | Passed syntax check. |
| `node --check tests/browser.mjs` | Passed syntax check. |
| `node tests/browser.mjs` | Completed run: 15 groups passed, zero unexpected JavaScript exceptions. Machine-readable latest result: `artifacts/browser-results.json`. |
| `git diff --check` | Passed; no whitespace errors. |
| `git rev-parse HEAD` | Still `9a9ce56dfe23dc5f06a501c3e7582c605c540362`. |

## Corrected model outputs

Model estimates, not verified flight tracks or actual airline costs. Default cost assumes $2.80/US gallon and the documented constant fuel/operations model.

| Route | Baseline | Hypothetical detour | Extra time | Extra cost |
|---|---:|---:|---:|---:|
| LHR–HND | 9,591.9 km | 12,433.9 km | 3.30 h | $30,186 |
| FRA–SIN | 10,280.2 km | 11,528.9 km | 1.45 h | $13,263 |
| HEL–ICN | 7,032.1 km | 11,055.5 km | 4.68 h | $42,735 |

## Browser checks actually executed

1. Exactly 10 slide sections, local model initialization and computed hero values.
2. All navigation dots, previous/next, keyboard arrows and deck boundaries.
3. Both case-study tabs, shortcut modal and Escape behavior.
4. Fullscreen entry using a user gesture and exit.
5. All three route selections agree with generated data and the comparison chart.
6. Both cost controls update results; two extra hours produce 47.4 tonnes of direct combustion CO₂ from the same fuel mass used for cost.
7. Both simulator scenarios × four strategies × three fuel prices (48 combinations); scenario costs differ; suspension punctuality is N/A.
8. WebGL creation, 2048×1024 geographic texture, spherical coordinates, all route points above the globe surface, airport markers and bounded geometry allocation after repeated scenario changes.
9. Mouse drag and scroll zoom, reset, pause control state and 2D map toggle.
10. All 10 slides at 1440×1000 and 390×844; no page or slide horizontal overflow; Previous and Next remain inside the viewport; default camera fits Earth at narrow aspect ratios.
11. Reduced-motion preference starts with auto-rotation paused.
12. No external runtime resources requested by the presentation.
13. Direct `file:///.../index.html` preview loads data and initializes WebGL.
14. Intentionally blocked model file produces a visible missing-data message while navigation continues.
15. Missing Three.js produces explanatory fallback text and a 2D map.

Screenshots captured and visually inspected: `artifacts/globe-desktop.png`, `artifacts/map-desktop.png`, `artifacts/globe-mobile.png`.

## Failures and revisions retained in the record

- Initial airport importer used longitude/latitude order for a latitude/longitude field. First unit run rejected it; independent geographic references confirmed each reversal before any correction was actually applied. Analysis is now blocked by invalid airport locations.
- Initial expected hourly cost test constant was inaccurate by approximately $0.04. It was corrected to the explicit unit-conversion result, $9,134.5163744 per modeled hour at $2.80/US gallon.
- One patch request failed because its expected old test constant had already changed. File inspection confirmed no partial patch had applied; the revised patch was then applied.
- Initial mobile screenshot revealed crowded overlays and Next outside the viewport despite a passing root-overflow check. CSS and specific button-bounds assertions corrected this. A later screenshot showed the desktop camera distance clipped the globe at narrow aspect ratios; camera fitting now uses horizontal field of view and is checked.
- Adding fullscreen exposed a fixed-coordinate zoom test failure. The harness now restores the emulated viewport after fullscreen and aims input at the actual canvas bounds. The subsequent zoom check passed.
- Final screenshot review prompted airport-label edge clamping and country-label collision spacing. The browser regression suite was rerun after this change.
- No failed check was represented as a successful run. Interrupted requests were checked against actual file/process state before resuming.
- A final read-only audit command hit a PowerShell quoting error before execution. It was rewritten without the problematic quoted regex and rerun successfully: original prompt-history prefix preserved, exactly 10 sections, 15 browser groups passing, zero JavaScript exceptions, and clean `git diff --check`.

## Remaining limitations

- Tested in headless Chrome with software WebGL, not a manual cross-browser/hardware, touchscreen or screen-reader certification. Browser fullscreen and graphics support may vary. Mobile slide contents intentionally scroll vertically.
- Natural Earth boundaries are generalized country context, not exact FIR/restricted-airspace geometry. Small adjoining country labels are omitted where needed for legibility. No live airspace feed.
- Airport inputs are geographically checked community coordinates, not certified ARP precision. Independent references use different points within airports, including an airport venue at FRA. TLV/JFK were researched as examples but are not in the six-airport dataset and were not changed.
- Constant-speed, constant-fuel spherical model; illustrative waypoints; no weather, winds, certified aircraft performance, crew legality, permissions, revenue, lifecycle emissions or non-CO₂ effects.
- Simulator reliability and retention scores are invented teaching inputs and explicitly labeled. No strategy establishes flight safety or business profitability.
- No satellite imagery or licensed FIR dataset was downloaded. An accurate cartographic texture and optional 2D map use the approved local geographic data.

## Local release readiness follow-up — Codex

Following the explicit preservation approval recorded in `codex-release-v2.md`, the tests were rerun after removing the local-backup dependency and adding report sanitization. All six Python tests and all 15 browser groups passed, with zero JavaScript exceptions. JavaScript syntax checks and `git diff --check` passed. The regenerated report retains all meaningful results and requests but replaces local project paths with `<project>`; the browser field is now only `chrome.exe`.

The preservation test now reads Version 1 from Git and verifies that its commit is an ancestor of HEAD and its HTML has the original checksum. The earlier backup-based test described above is a historical result; local backups are no longer required to run the tests. Version 1 files and history were not changed. Four vendor/geography asset digests match the manifest. The reviewed artifacts are exactly three presentation screenshots plus the sanitized browser report, approximately 1 MB combined; no individual project file exceeds 1 MB. No obvious credentials were found in the project scan; browser profiles, caches, local backups and unreviewed artifact diagnostics are excluded.

This follow-up was prepared before the authorized local commit/tag operation. Commit and annotated-tag targets are verified from Git afterward and reported in the conversation. Pushing remains separately gated by the user's explicit instruction. No Version 3 work is included.
