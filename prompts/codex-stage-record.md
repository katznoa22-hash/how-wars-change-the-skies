# Codex stage — exact prompts and actual development record

Date: 8 November 2026. AI tool: **Codex**. This companion preserves the exact prompts for this stage; the chronological summary is appended to `antigravity-development.md`. Earlier Antigravity records are retained unchanged. No user prompts, executions or successful tests are invented.

## Interaction 9 — Inspection and proposed Version 2 plan

### Exact user prompt

```text
Please inspect the existing "How Wars Change the Skies" project, including index.html, README.md, PRD.md, and all files in the prompts folder.

Verify that Version 1 is committed and pushed to the GitHub main branch. Review the existing presentation and the previously documented improvement plan.

Prepare a concise implementation plan for Version 2 – Visual and Data Improvements, focusing on the 3D globe, geographical accuracy, visual design, and data reliability.

Preserve the existing 10-slide structure and all working interactive features. Continue documenting our actual prompts, actions, and results in prompts/antigravity-development.md, clearly identifying Codex as the tool used for this stage.

Do not modify any files, create commits, or push changes yet. First report your findings and proposed plan, and wait for my approval.
```

### Faithful response and actual actions

Codex read index.html, README.md, PRD.md and all three existing prompt files. It identified inaccurate procedural continents, hazard spheres, Bézier routes, hardcoded distances, unsupported numerical claims, missing Python analysis and an unused simulator scenario input. It proposed six implementation areas: baseline preservation, geographic accuracy, meaningful overlays, visual refinement, reproducible data and validation/documentation. It explicitly stated that the review was source-only, with no browser execution.

`git status` showed a clean main branch. Direct `git ls-remote origin refs/heads/main`, after sandbox network failure and approved retry, returned `9a9ce56dfe23dc5f06a501c3e7582c605c540362`, matching local HEAD and commit title `Version 1 - Initial Interactive Presentation`. No project files were modified during the inspection; this log was deferred to the approved implementation stage.

## Interaction 10 — Approval to implement

### Exact user prompt

```text
I approve the proposed Version 2 implementation plan for "How Wars Change the Skies."

Please proceed with implementing Version 2 according to the six proposed improvement areas.

Important requirements:

1. Preserve the existing 10-slide structure and all working interactive features.
2. Improve the visual quality, geographic accuracy, and reliability of the data.
3. Use credible sources and clearly distinguish verified facts from estimates and simulated scenarios.
4. Keep the presentation entirely in English.
5. Preserve Version 1 in Git history and do not overwrite or remove its existing commit.
6. Document the actual AI prompts, development actions, testing results, and revisions in the prompts folder. Clearly identify Codex as the AI tool used during this stage.
7. Test the completed Version 2 and report any remaining limitations.
8. Do not create a Git commit or push changes to GitHub without my explicit approval.

Once Version 2 is implemented, provide a summary of the improvements and instructions for previewing the updated presentation locally.

Please begin implementing Version 2 now.
```

### Faithful response and actual actions

Codex stated it would preserve all 10 slides and controls and implement locally without commits or pushes. It inspected the available environment, confirmed Python/Node and installed browsers, and found no Playwright/Selenium package. It reviewed primary references from ICAO, EASA and Finnair plus Natural Earth licensing and created `scripts/fetch_assets.py`.

An execution request for the downloader was issued before the next pause arrived. Later inspection found only the script, no downloaded outputs and no running Python process. A large subsequent patch request was interrupted; later file inspection determined which files actually existed before resuming. No interrupted request was treated as proof of successful execution.

## Interaction 11 — Download review pause

### Exact user prompt

```text
Before running the script, please show me the complete list of download URLs and destination files used by scripts/fetch_assets.py. Confirm that the sources are trustworthy and that the script only downloads project assets without executing downloaded code or modifying unrelated files. Do not run the script until I approve.
```

### Faithful response and actual actions

Codex acknowledged that a run had already been issued prematurely, inspected the script and process/file state, and did not rerun it. It listed every URL and output, explained that Three.js was official and version-tagged, Natural Earth was project-maintained/public-domain, and airport-codes was a mutable community dataset. It disclosed overwrite behavior, partial-download risk and that recorded hashes were not independently verified expected hashes. It confirmed the script stores JavaScript without executing it; previewing the presentation executes it in the browser.

Reviewed URLs and destinations:

1. `https://raw.githubusercontent.com/mrdoob/three.js/r128/build/three.min.js` → `assets/vendor/three.min.js`
2. `https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/js/controls/OrbitControls.js` → `assets/vendor/OrbitControls.js`
3. `https://raw.githubusercontent.com/mrdoob/three.js/r128/LICENSE` → `assets/vendor/THREE-LICENSE.txt`
4. `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson` → `data/countries.geojson`
5. `https://raw.githubusercontent.com/datasets/airport-codes/main/data/airport-codes.csv` → parsed in memory, six records written to `data/airports.json`.

Additional generated output: `data/asset-manifest.json`.

## Interaction 12 — Approved downloads with safeguards

### Exact user prompt

```text
I approve proceeding with the asset downloads for Version 2, using only the reviewed URLs and destination files. Before running the script, back up any existing destination files and verify that all download paths remain within the project directory. Continue implementing Version 2 according to the approved plan, preserve all 10 slides and existing interactive features, and document the actual development process. Do not commit or push anything to GitHub without my explicit approval.
```

### Faithful response and actual actions

Codex added resolved-path validation for all six outputs and backups before network access. The executed downloader printed all six validated absolute project paths and `No existing destination files; no backup needed.` It completed the approved downloads. Recorded sizes included Three.js 603,445 bytes, OrbitControls 26,375 bytes, license 1,081 bytes and country geometry 838,726 bytes. Asset SHA-256 values were recorded in the manifest.

Codex added `analysis.py`, `assets/v2.js`, `assets/v2.css` and the reviewable one-time HTML migration utility. The design used local Natural Earth geometry to render an accurate cartographic texture rather than downloading an additional unreviewed raster image. It retained Three.js r128 and all original navigation/tab handlers while replacing the old data/globe engines. An upgrade command was issued, but the next inspection established that index.html still matched Version 1 and generated scenarios were absent; the command had not completed the migration.

## Interaction 13 — Verified Version 1 HTML backup

### Exact user prompt

```text
Before running the upgrade script, please confirm that a backup of the original Version 1 index.html exists and that the migration script preserves all 10 slides and existing interactive features. If no backup exists, create one first. Then proceed with the upgrade and validation commands. Do not commit or push any changes to GitHub.
```

### Faithful response and actual actions

Codex disclosed the previously issued upgrade command, checked actual state, and found no modification to index.html. It created `backups/version-1/index.html` directly from the preserved Git commit and verified byte equality with the still-original index.html. SHA-256: `317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e`. The migration was changed to refuse execution without that verified backup and to refuse applying twice.

The migration then executed successfully and reported 10 slides preserved. It revised unsupported statistics, added dated citations, synchronized globe and analytical route data, and retained the navigation, shortcuts, fullscreen, tabs, selectors, sliders and four strategy choices. The initial analysis output was implausibly large. The first unit run had two failures: reversed airport coordinates and an inaccurate expected cost test constant (0.0406 dollars off). Codex fixed the importer/test constant and issued a correction command, but the next pause inspection established the dataset remained reversed and no correction backup existed. Thus the announced correction had not yet actually occurred; this record corrects the premature progress statement.

## Interaction 14 — Independent geographic verification before correction

### Exact user prompt

```text
Before swapping latitude and longitude for every airport, verify the current coordinates against known airport locations (for example, TLV, JFK, and LHR).

Only apply the swap if the coordinates are confirmed to be reversed. Preserve the original backup and validate the corrected coordinates against real-world airport locations, not just numerical ranges.

Then rerun the analysis, unit tests, and browser tests. Report the results and any remaining failures.
```

### Faithful response and actual actions

Codex checked the actual dataset and confirmed that only FRA, HEL, LHR, HND, ICN and SIN were included. It did not claim to correct absent TLV/JFK records. It researched published locations from NATS, JMA, CAAS, Fintraffic, Korean AIP and Fraport, and reviewed TLV/JFK geographic examples in Israeli and FAA material. Exact URLs and comparison points are stored in `data/airport-references.json` and SOURCES.md. The Fraport reference is an airport venue rather than ARP, explicitly disclosed. The Korean reference is an older AIP location; these checks establish airport vicinity rather than current operational precision.

Codex implemented a conditional correction: leave already-valid records unchanged; swap only when the original fails and the candidate is within 5 km of the independent airport location; otherwise refuse. All six actual records met that condition. It preserved the original import in `backups/coordinate-import/airports.json` without overwriting the Version 1 backup. Before/after values, source references and measured distances are recorded in `data/coordinate-validation.json`.

Corrected separations: FRA 2.972 km, HEL 0.127 km, LHR 0.758 km, HND 1.083 km, ICN 1.276 km and SIN 1.130 km. Regenerated baselines: LHR–HND 9,591.9 km, FRA–SIN 10,280.2 km and HEL–ICN 7,032.1 km. The executed six-test Python suite passed. Node syntax checks passed.

The first executed browser suite passed 13 groups: initialization; navigation; tabs/modal; route consistency; sliders; 48 simulator combinations; WebGL/texture/geometry/resource cleanup; drag/zoom/reset/2D; desktop/mobile page overflow; reduced motion; no external runtime requests; missing-model error; and missing-Three.js fallback. Actual screenshots were captured and inspected. Screenshot review then revealed crowded mobile globe overlays and a footer Next button outside the viewport, which the original page-overflow check did not detect. Codex revised CSS and added explicit navigation-button bounds checks, then reran the suite. See `codex-validation.md` for final executed results and limitations.

### Files and boundaries for the stage

Version 2 changes index.html and README.md and adds local assets, generated/source data, analysis, download/migration/validation utilities, tests, source audit, screenshots/results and Codex documentation. PRD.md and the earlier planning/conversation files remain unchanged. The Version 1 commit is preserved. No Git commit or push was executed during this stage. No npm packages or browser binaries were downloaded for tests; the test harness uses Node built-ins and the installed browser.


### Final Codex validation follow-up

The expanded Chrome suite passed 15 groups with zero JavaScript exceptions; six Python tests passed. Fullscreen, direct-file preview, missing-data fallback and desktop/mobile navigation bounds were executed. Screenshot review led to narrow-aspect camera fitting, label edge clamping and collision spacing. A fullscreen-related fixed-coordinate zoom test failure was corrected by restoring the viewport and aiming at actual canvas bounds. See prompts/codex-validation.md and artifacts/browser-results.json for the executed results and remaining limitations. No commit or push was performed.
