# Version 3 development log

**AI tool:** Codex

**Date started:** 2026-11-08
**Objective:** Improve the existing ten-slide academic presentation for projection, explanation and interaction through targeted changes; retain the validated scientific model and all existing features.

## Exact initiating user prompt

```text
Start Version 3 of the existing "how-wars-change-the-skies" project.

GOAL:
Upgrade the existing 10-slide interactive academic presentation to a polished, projector-ready Version 3. This must remain a presentation, not become a standalone website or app.

SAFETY FIRST:
1. Verify that the working tree is clean and v2.0 points to commit 1dd228500b5ba5708412495f1c43704468728b75.
2. Create and switch to a new branch named version-3 from the verified Version 2 commit. If it already exists, inspect it and stop rather than overwrite it.
3. Never modify, delete, or move the v2.0 tag or rewrite Git history.
4. Do not commit, push, or create a v3.0 tag without separate approval.
5. Keep the existing 10 slides, data sources, navigation, accessibility features, globe, maps, route comparisons, cost calculator, and decision simulator functional.

DOCUMENTATION — MANDATORY:
Create prompts/codex-development-v3.md. Record this exact prompt, its objective, date, each development phase, files changed, test outcomes, fixes, limitations, and any subsequent prompts verbatim. Never claim tests passed unless executed. Do not invent historical facts, data sources, or test results.

WORK IN INTERNAL PHASES:
A. Audit the existing presentation and identify the highest-impact improvements without unnecessary rewrites.
B. Improve slide design, typography, visual hierarchy, responsiveness, keyboard navigation, and projector readability.
C. Improve globe/map legends, route comparisons, animations, and explanatory labels. Preserve graceful 2D fallback.
D. Improve cost visualization and decision simulator feedback, using the existing validated model and clearly labeled illustrative assumptions.
E. Strengthen the final conclusions and source transparency while retaining the existing academic content.
F. Run airport validation, Python model tests, JavaScript syntax checks, and browser tests, including all simulator combinations. Fix regressions and rerun relevant tests.

EXECUTION RULES:
- Prefer small targeted edits over large rewrites.
- Reuse existing dependencies and assets. Do not introduce new external libraries unless essential.
- Run checks after each meaningful phase.
- Keep source data and scientific assumptions unchanged unless a verified correction is necessary; document any correction.
- Avoid adding decorative features that reduce performance.
- Do not change the slide count.
- Do not create multiple version branches or backups inside the repository.
- If a high-risk architectural change is needed, stop and request approval instead of proceeding.
- At the end, report changes by slide, test results, remaining risks, Git branch and working-tree status.

Begin by verifying Git safety, creating the version-3 branch, and documenting the prompt. Then proceed through the phases. Do not push or commit.
```

## Safety verification — executed

- `git status --short --branch`: clean main, synchronized with origin/main.
- HEAD and local main: `1dd228500b5ba5708412495f1c43704468728b75`.
- `git cat-file -t refs/tags/v2.0`: `tag` (annotated).
- `git rev-parse v2.0^{commit}`: the approved Version 2 commit.
- `git branch --list version-3`: no existing branch. A guarded Python subprocess then executed `git switch -c version-3` from the verified commit.
- No commits, pushes, new release tags, history rewrites or new backup directories are authorized. Existing ignored artifacts/backups from Version 2 are left alone.

## Phase A — source audit

Reviewed the ten slide sections, local Three.js renderer, validated model integration, styles, navigation, README, Python analysis, source provenance and browser harness. High-impact issues: small secondary text on projection; dense original inline labels; globe overlays competing with geography; no fuel/other-expense breakdown; no side-by-side strategy comparison; shortcut dialog lacked focus capture/restoration and inactive-slide focus isolation.

Executed baseline checks: `py scripts/validate_airports.py` passed all six airport checks; `py -m unittest discover -s tests -p '*checks.py'` passed six tests; syntax checks for `assets/v2.js` and `tests/browser.mjs` passed. No model/source correction was required. Existing model data deliberately retains schema version 2; presentation branding is separate.

## Phase B — design and navigation

Files changed: `index.html`, new `assets/v3.css`. Added an override stylesheet rather than rewriting the existing deck or styles. It increases body/type contrast, gives cards solid high-contrast surfaces, strengthens hierarchy and numeric alignment, improves responsive controls, and removes title-preview decorative animation. All assets/dependencies remain local and unchanged. The deck retains ten sections and existing slide IDs.

Navigation changes: keyboard-operable home brand, live slide indicator, `inert`/`aria-hidden` inactive slides, modal focus capture and restoration, modal Tab containment and descriptive close control. Existing arrows, numbers, fullscreen, buttons and form controls remain supported.

Executed checks: external and inline navigation JavaScript syntax passed, ten-section assertion passed, and `git diff --check` passed. Full browser regression was started; results are recorded when the run completes, not assumed here.

Phase B browser outcome: all 15 existing browser groups passed, including all 48 simulator combinations, fullscreen, direct-file preview and fallbacks.

## Phase C — globe, map and route explanation

Files changed: `index.html`, `assets/v2.js`, `assets/v3.css`. Moved the globe HUD, legend and camera controls outside the canvas using targeted markup/layout changes; retained the same renderer and route data. Added white-airport-marker legend, explicit moving-marker meaning, a synchronized distance summary, larger labels and a thicker solid detour rendered using the existing Three.js TubeGeometry (100 longitudinal segments, five radial segments per leg). No new library, route waypoint or scientific input was introduced.

Added keyboard W/A/S/D rotation and plus/minus zoom when the globe is focused, plus accessible zoom buttons. A live reduced-motion preference change pauses rotation. Actual context loss retains the 2D view and prevents switching back into a lost WebGL context until reload. Mathematical route points and data remain unchanged.

Executed checks: inline/external JavaScript syntax, ten-slide assertion and whitespace check passed. All 15 original browser groups then passed, including route geometry/resource disposal, drag/scroll/reset, scenario changes, mobile layout and 2D fallback.

## Phase D — cost breakdown and simulator feedback

Files changed: `index.html`, `assets/v2.js`, `assets/v3.css`. Added fuel/other-operations stacked expense bar and text amounts, accessible chart descriptions, reset inputs and a shortcut to reuse the selected route's extra hours (explicitly rounded to the existing slider's 0.1-hour step). The shortcut deliberately uses native Math functions so it still works if Three.js is missing.

Simulator formulas, options, price levels, reliability/retention inputs and fees are unchanged. Added a scenario/price context line, relative expense feedback, an expandable four-response comparison table, and shorter response labels. The table uses the same existing strategy values, not another model. Invented scores and zero-flying-cost exclusions remain explicit. Reduced explanation density without removing the model exclusions; full formulas and sources remain in accessible disclosures.

Executed checks: six Python tests, JavaScript syntax and whitespace checks passed. All 15 existing browser groups passed again, including every simulator combination. Dedicated bar-total and table-consistency tests were then added for Phase F.

## Phase E — conclusions and transparency

Files changed: `index.html`, `assets/v2.js`. Added the concluding statement, “Measure the detour. Explain the assumptions. Assess safety and permissions separately.” Kept all existing academic links, dates and credits in an expandable source register, with the source organizations visible before expansion. Existing conclusions retain network planning, evidence and sensitivity analysis. Model inputs and waypoints on slide 5 remain available through a disclosure, while a synchronized plain-English route takeaway is visible by default. No new historical facts or sources were introduced. External JavaScript syntax and whitespace checks passed.

## Phase F — expanded validation (completed)

Airport validation passed all six airports again. `py analysis.py` regenerated the same validated values. All six Python tests passed. JavaScript syntax checks passed. `git diff --exit-code v2.0 -- analysis.py data assets/vendor PRD.md SOURCES.md` passed: scientific assumptions, source data, historical source audit and dependencies are unchanged.

Expanded the existing browser harness to test modal focus restoration and inactive slides, native Space activation, fuel/other expense decomposition at slider extremes, route-hour/reset controls, all four comparison rows for all 48 simulator combinations, keyboard globe interaction, 1280×720 / 1366×768 / 1920×1080 projector measurements, retained academic links, actual WebGL context loss and cost controls without Three.js. Final results will be recorded after execution. Diagnostic projector screenshots use artifacts, not new backups or version branches.

### Executed visual review and regression fixes

The first expanded suite passed 21 groups with zero JavaScript exceptions, but its layout check initially covered horizontal fit and body font size only. Reviewing actual measurements and screenshots showed vertical overflow on slides 6, 7 and 9, plus slide 10 at 1280×720. This was not treated as a projector-fit success. Short screenshot waits also caught slides mid-transition; the transition was shortened to 180 ms with immediate hiding of inactive slides and screenshot waits were increased beyond the transition.

Targeted fixes retained all content: route selection moved into the globe HUD, contextual route details moved into its disclosure, cost breakdown moved to the assumptions column, and full simulator prose/comparison/assumptions were consolidated into one disclosure while a concise selected-response summary stays visible. Scientific values and scoring inputs were not changed.

The subsequent stricter run failed five vertical-fit measurements (globe at 1280×720 and 1920×1080; cost at 1280×720 and 1366×768; simulator at 1280×720). Further targeted changes removed a redundant HUD caption, aligned the calculator with the assumptions column, retained payload discussion in the exclusions disclosure, and compacted projector strategy controls while keeping 44-pixel minimum card targets. Relevant browser checks were rerun after these fixes; the actual final result is recorded below once complete.

Files also updated: README.md documents Version 3 controls, projector sizes, retained Version 2 data and local-only branch status. `.gitignore` explicitly permits the ten reviewed Version 3 projector screenshots while continuing to ignore transient diagnostics, profiles, caches and old local backups. No new dependency downloads, branch copies or backup directories were created.

The next strict run found only a three-pixel 720p globe overflow; a four-pixel reduction in grid spacing resolved it and all 21 groups passed. Final visual review then enlarged primary step explanations and calculator labels to the 17-pixel projector body size. That change exposed a seven-pixel 720p cost overflow, so slider-group spacing was reduced without shrinking text. The full browser suite was rerun after this last CSS change; its final result is recorded below only after completion.

Added a seventh Python test to protect the exact annotated `v2.0` tag object (`1e66b7c1a80c3b12f62979bed9a8e78a25962b80`), its approved commit and Version 2 ancestry. The executed seven-test suite passed. This test reads Git only; it does not change tags or history.

## Files changed in Version 3

- `index.html`: small navigation/accessibility changes, globe layout, cost chart markup, comparison disclosure and conclusions; existing ten section IDs retained.
- `assets/v3.css` (new): projector typography, contrast, responsive presentation layouts, compact control spacing and preserved reduced-motion styling.
- `assets/v2.js`: targeted visualization/feedback extensions to the existing shared runtime; validated constants, routes and strategy values unchanged.
- `tests/browser.mjs`: expanded to test new controls and projector fit; sanitized report gains layout measurements.
- `tests/model_checks.py`: adds protected Version 2 tag/history regression check.
- `README.md`, `.gitignore`, this log: controls, preview/test instructions, artifact allowlist and actual prompt/phase documentation.
- `artifacts/browser-results.json`, existing three screenshots and ten `v3-slide-??-projector.png` screenshots: generated results and presentation evidence.

Unchanged from `v2.0`: `analysis.py`, every file in `data/`, vendored dependencies and license, PRD.md, SOURCES.md and previous prompt logs. Exact external academic URL sets also match Version 2. Existing ignored backup/profile directories were not duplicated or moved.

## Changes by slide

| Slide | Actual change |
|---|---|
| 1 | Stronger title/metric hierarchy, high-contrast cards, quieter preview without decorative rotation, Version 3 branding. |
| 2 | Larger explanatory text and clearer card hierarchy; original legal references and definitions retained. |
| 3 | Larger step explanations, clearer timeline and baseline/detour distinction; notices/source content retained. |
| 4 | More readable case-study tabs, text and evidence labels; both historical cases and dates retained. |
| 5 | Plain-English route delta, synchronized chart description, thicker distance bars and expandable inputs/waypoints. |
| 6 | Separate control/legend rail, selected-route picker in HUD, larger labels, thicker detour, keyboard controls and context-loss fallback. |
| 7 | Fuel/other-expense bar, explicit component amounts, route-hour/reset controls, larger labels and retained payload/formula/source details. |
| 8 | Higher-contrast managerial comparison cards and clearer hierarchy; original academic interpretation retained. |
| 9 | Scenario/price context, concise selected-response feedback, relative expense explanation, expandable four-option comparison and full assumptions. |
| 10 | Actionable concluding statement, numbered recommendations, visible evidence organizations and expandable original academic references. |

## Limitations and review scope

- Headless installed Chrome / software WebGL and emulated viewports were executed; physical projector, manual assistive-technology certification, touchscreen and other-browser verification were not performed.
- Fit checks refer to default slides with disclosures closed at the measured resolutions. Expanded academic details and narrow/mobile layouts intentionally scroll vertically.
- The 3D moving marker has no operational timing meaning. Geographic context remains generalized country geometry, not precise FIR or live closure boundaries. WebGL context loss falls back to 2D; reload restores 3D.
- Original spherical/constant-speed/constant-fuel model, airport-coordinate tolerances and all invented reliability/retention assumptions remain unchanged. No verified operational flight planning or new historical research is claimed.
- No new external dependency, architecture, source dataset or decorative animation was introduced. Final work remains local and uncommitted until separate approval.

## Final executed results — 2026-11-08

| Check | Actual result |
|---|---|
| `py scripts/validate_airports.py` | All six airport checks passed; original 0.127–2.972 km reference separations retained. |
| `py analysis.py` | Same three scenario outputs regenerated; no diff in data or assumptions against v2.0. |
| `py -m unittest discover -s tests -p '*checks.py'` | **7 tests passed**, including exact protected Version 2 tag object/commit and Version 1 history/HTML checksum. |
| `node --check assets/v2.js` | Passed. |
| `node --check tests/browser.mjs` | Passed. |
| Inline navigation script, checked with `node --check -` | Passed; ten slide sections verified. |
| Final `node tests/browser.mjs` after typography/spacing fixes | **21 groups passed**, zero JavaScript exceptions. |
| Projector layout matrix | **30/30 default slide/resolution combinations passed** at 1280×720, 1366×768 and 1920×1080; no horizontal overflow. Vertical checks allow 2 pixels for rounding; maximum final measured excess was 1 pixel of scroll extent, with primary content visible. |
| Simulator matrix | Both scenarios × four responses × three prices: all **48 combinations** exercised; comparison rows and selected expense match. |
| Calculator checks | Fuel and other-operation component values/totals checked at slider extremes; route-hour shortcut, explicit rounding and reset passed; direct CO₂ check retained. |
| Accessibility/navigation checks | Native Space activation advances once; dialog focus/Tab/Escape restoration, nine inert slides, keyboard globe rotation/zoom and reduced-motion preference passed. |
| Reliability checks | Fullscreen, direct-file preview, missing model, missing Three.js and actual WebGL context-loss → 2D route selection passed. No external runtime requests. |
| Source/data integrity | `git diff --exit-code v2.0 -- analysis.py data assets/vendor PRD.md SOURCES.md` passed; same academic URL set and all four asset-manifest hashes verified. |
| `git diff --check` | Passed. Git printed normal Windows line-ending notices, not whitespace errors. |

Final visual inspection included the actual generated projector screenshots for all slide designs, with follow-up inspection of final cost/simulator/mobile globe captures. The report at `artifacts/browser-results.json` retains all 21 results and all 30 layout measurements; workstation paths remain sanitized. Source register/formula/assumption disclosures are intentionally expandable and may scroll when opened. No physical projector or broader browser certification is implied.

Final Git safety: branch `version-3`; HEAD remains `1dd228500b5ba5708412495f1c43704468728b75`; annotated `v2.0` still resolves to that commit and its tag-object hash remains `1e66b7c1a80c3b12f62979bed9a8e78a25962b80`. Working tree contains only unstaged Version 3 changes and new presentation evidence/documentation. No Version 3 commit, push or `v3.0` tag was created. No subsequent user prompts were received during this implementation.

## Subsequent prompt — manual review

Recorded on the next authorized documentation update, as requested. AI tool: Codex. Date: 2026-11-08.

```text
Version 3 implementation and automated tests are complete. Do not make any further code changes, commits, tags, or pushes. Start or reuse the local preview server at http://127.0.0.1:8000/ and provide the link so I can manually review all 10 slides. Keep the version-3 branch and all changes intact. Record this manual-review request in prompts/codex-development-v3.md when documentation is next updated.
```

Actual action/result: Codex reused the existing preview server, verified HTTP 200 at `http://127.0.0.1:8000/`, confirmed `version-3` and existing changes, and provided the review link. No code/documentation edits, commits, tags or pushes were performed in that turn. Recording this request was deferred until this subsequently authorized documentation update.

## Subsequent prompt — globe camera control repair

AI tool: Codex. Date: 2026-11-08. Objective: reproduce actual button behavior, diagnose initialization/interaction/camera state, and apply a minimal fix without changing validated data or Git history.

```text
Fix the non-responsive globe camera controls in Version 3.

The user reports that Reset Camera, Zoom In (+), and Zoom Out (-) do not work.

I inspected the project:
- index.html calls resetGlobeCamera() and zoomGlobe().
- assets/v2.js defines these functions.
- zoomGlobe() silently returns when camera, controls, or WebGL are unavailable, or when mapMode is active.
- assets/v3.css changes the globe controls layout.

TASK:
1. Reproduce the issue in the actual Version 3 presentation using browser interaction tests.
2. Diagnose the root cause, including WebGL initialization, mapMode, event handlers, overlays, CSS pointer interception, and camera state.
3. Fix the issue with minimal targeted changes. Preserve all 10 slides, existing calculations, source data, and the 2D fallback.
4. Ensure + visibly zooms in, - visibly zooms out, and Reset Camera restores the default camera after rotation or zoom.
5. If 3D is unavailable, disable the relevant controls and show a clear accessible explanation instead of allowing silent no-op clicks.
6. Add automated tests that click all three buttons and verify actual camera distance/position changes, not just the existence of handlers.
7. Run the existing Python, JavaScript, browser, simulator, and projector-layout tests. Report actual results and any limitations.
8. Append this exact prompt, root cause, changed files, fixes, and test outcomes to prompts/codex-development-v3.md.

Work only on branch version-3. Do not commit, push, create tags, or modify v2.0. Stop and ask before any risky architectural changes.
```

Safety rechecked before repair: branch is `version-3`; HEAD and peeled `v2.0` still equal the approved Version 2 commit. Existing uncommitted Version 3 work is preserved.

### Reproduction and diagnosis — executed

Added real CDP pointer clicks for Reset/+/−, hit-testing with `document.elementFromPoint`, camera-distance and post-drag reset-position measurements for all three route presets, and a missing-OrbitControls initialization check. These load the actual index.html and local assets in Chrome, not mocks of the camera functions. Tests are executed before changing application code; failures and fixes will be recorded below when observed.

Before application changes, the first actual-pointer run reproduced Reset failure on LHR–HND: initial distance 38; Zoom In changed it to 32.3; Zoom Out changed it to 37.145; Reset restored radius 38 but failed to restore position after a drag. After 350 ms the reset pose was approximately `[17.2261, 28.7794, -17.8609]`, about **8.84488 scene units** from the recorded initial pose. Thus healthy-3D zoom already worked in the tested environment; the blanket report that zoom never responds was not reproduced with all libraries/WebGL available.

A second pre-fix run intentionally blocked OrbitControls.js. It observed `mapMode=false`, `globeInitialized=true`, no controls object, all three camera buttons enabled, and an empty explanatory status. This reproduced the faulty availability state behind silent `zoomGlobe()` returns. Separately, Reset was not included in the old map-mode disabling selector. These are distinct initialization/availability defects, not a reason to disable working 3D.

Root causes:

1. Reset used OrbitControls' original saved state, created before a useful default camera pose had been saved, then placed the camera without clearing the pending damped rotation. Subsequent updates applied that residual rotation to the supposed default.
2. Successful initialization did not require an OrbitControls instance. Missing controls could therefore leave a visible static 3D globe with enabled no-op zoom buttons. Button enablement was only updated on map switches and did not consistently cover Reset, initialization errors or readiness.
3. No persistent CSS overlay interception was found: actual healthy-button hit-tests resolved to the buttons and clicks changed camera state. One new test initially queried hit-testing immediately after a slide transition/reload and failed on Pause Rotation; inspection showed a valid control panel. The helper was corrected to wait 220 ms, beyond the presentation's 180 ms transition, before hit-testing and dispatching pointer input. No CSS workaround was added for this test-timing issue.

### Minimal repair

Application files changed in this repair: **index.html** and **assets/v2.js**. Test changes: **tests/browser.mjs**. Documentation: this file, including the deferred manual-review prompt above. Browser execution refreshed the existing test report and screenshot evidence. Pre-existing Version 3 changes were retained; assets/v3.css, the scientific model, source data and dependencies were not changed by this repair.

- Added one shared usable-camera check: initialization, camera, controls, renderer and a live WebGL context must all be available, and camera actions require 3D view.
- Missing Three.js or OrbitControls and failed WebGL initialization now retain the 2D map, disable camera buttons and explain the condition in the live status. Context loss updates the same state. In 2D mode the explanation tells the user how to return to 3D; an impossible return to 3D is disabled until reload.
- Reset, Zoom In and Zoom Out start disabled until ready; all share `data-globe-only` and `aria-describedby="globeStatus"`. The status uses polite, atomic live announcements. Guarded function calls refresh the explanation rather than returning silently.
- Reset temporarily suspends auto-rotation and damping, flushes accumulated control deltas, installs the route/aspect-specific default position, target and zoom, updates/saves the correct control state, then restores the user's rotation/damping settings.
- Zoom changes distance relative to the orbit target within the existing limits, updates OrbitControls and refreshes availability state. No formula, route or scenario value was changed.

### Repair validation — executed

Final full browser run: **25 groups passed**, **zero JavaScript exceptions**, including all 48 scenario/response/fuel-price combinations and all 30 default projector-layout measurements. Seven Python tests, six airport checks, both external JavaScript syntax checks, inline navigation syntax and the ten-slide assertion passed. `py analysis.py` regenerated the original outputs; the model/data/vendor/PRD/source-audit diff against v2.0 remained empty.

New pointer-click regression results, with auto-rotation paused to make pose comparisons deterministic:

| Route | Default radius | After + click | After − click | After Reset | Post-drag reset-position error |
|---|---:|---:|---:|---:|---:|
| LHR–HND | 38 | 32.3 | 37.145 | 38 | 0 |
| FRA–SIN | 38 | 32.3 | 37.145 | 38 | 0 |
| HEL–ICN | 38 | 32.3 | 37.145 | 38 | 0 |

These tests dispatch actual mouse press/release events at hit-tested button centers; they do not invoke the three camera handlers directly. They also perform a real pointer drag before Reset and compare the resulting vector, not merely the camera's radius. Per-route before/after measurements are retained in the sanitized browser report's `cameraChecks` field.

Additional executed checks: all three buttons disabled and described in 2D; real disabled-button clicks leave the hidden camera unchanged; returning to 3D re-enables working controls; missing OrbitControls produces an explained 2D fallback; deliberately unavailable WebGL initialization leaves a working route-selectable 2D map and disabled buttons; actual WebGL context loss disables the controls; missing Three.js disables them while the calculator remains functional.

Limitations: healthy interaction was tested in installed headless Chrome with software WebGL. Missing-library and WebGL-initialization failures were deliberately induced; they do not identify the manual reviewer's physical GPU/browser condition. No persistent CSS interception was observed after transition settling, so no claim is made that every possible external browser overlay was reproduced. The final preview needs a page reload to load the changed JavaScript. No architectural change, commit, push or tag operation was made.

## Prompt chronology

The initiating request, manual-review request, camera-repair request and release request are retained verbatim in this document in chronological order. Earlier no-commit/no-push statements describe the authorization in force at those earlier stages; the following explicit release approval supersedes them for Version 3 only.

## Subsequent prompt — Version 3 release

AI tool: **Codex**. Date: **2026-11-08**. Objective: audit, validate and publish Version 3 safely, retaining all ten slides and previous history. **Version 3 is a review release; Version 4 will be the final submission version. No Version 4 implementation is authorized.**

### Exact release prompt

```text
Release Version 3 to GitHub safely.

Context:
- Version 3 is implemented on the local version-3 branch.
- The user manually verified that the globe Reset Camera, +, and - buttons now work.
- Codex previously reported 7 passing Python tests, 25 browser test groups, 48 simulator combinations, and 30 projector-layout checks.
- All 10 slides must remain intact.
- Version 4 will be the final submission version, NOT Version 3.

Tasks:
1. Confirm the current branch is version-3 and inspect git status, diff, and changed files.
2. Verify no secrets, browser profiles, caches, backups, or unrelated temporary files are staged. Respect .gitignore.
3. Verify the complete original AI prompts, Version 3 development phases, fixes, test outcomes, and release steps are documented in prompts/codex-development-v3.md.
4. Re-run the appropriate tests and stop if any critical test fails.
5. Stage only intended Version 3 project and documentation files.
6. Create one clear Version 3 release commit.
7. Create annotated tag v3.0 pointing to that commit.
8. Safely publish the Version 3 release to GitHub without force-pushing, preserving the full histories and tags for Versions 1 and 2.
9. Verify remote main and remote tag v3.0 point to the release commit, and v2.0 remains unchanged.
10. Report commit SHA, remote branch, tag, test results, and any warnings.

Important:
- Do not start Version 4 yet.
- Do not rewrite or delete any previous history or tags.
- If the remote branch has diverged, stop and ask instead of force-pushing.
- Document the exact release prompt and release actions in prompts/codex-development-v3.md before committing.
- If a critical issue is discovered, stop and report it rather than publishing a broken release.
```

### Pre-release inspection — executed

- Confirmed `version-3`, with HEAD still at the protected Version 2 commit and the intended unstaged Version 3 changes. Inspected status, diff summary, ignore rules, attributes and existing prompt records; the index was empty.
- Direct remote inspection showed main at `1dd228500b5ba5708412495f1c43704468728b75`; annotated `v2.0` object remained `1e66b7c1a80c3b12f62979bed9a8e78a25962b80`, peeled to the same Version 2 commit. No local or remote `v3.0` existed.
- Retain the existing tag and Version 1 ancestry. Stage only explicit presentation/runtime/style, tests, README, this development log, ignore-rule adjustment and reviewed screenshot/report paths. Exclude `.browser-profile/`, bytecode/caches, `backups/`, the old ignored local release-check clone and transient browser diagnostics.
- User-reported manual verification of Reset/+/− is recorded above as user-provided evidence; it is distinct from Codex's automated pointer-click tests.

### Authorized release operations

This section is written **before committing**. Validation results and the staged audit are appended after actual execution and before the release commit. It does not invent a commit hash or claim a push before it happens.

1. Fetch/check origin/main and stop on unexpected movement/divergence or failed validation.
2. Create exactly one release commit on `version-3`, titled `Version 3 - projector-ready interactive aviation presentation`.
3. Create annotated `v3.0` at that commit only while absent; never replace an existing tag.
4. Recheck that remote main is an ancestor of the release, and publish only `refs/heads/version-3:refs/heads/main` and `refs/tags/v3.0:refs/tags/v3.0` using a normal, atomic push with automatic extra-tag following disabled. No force push or history rewrite.
5. Verify main, the peeled v3.0 commit and the unchanged v2.0 object/target directly with `git ls-remote`. Commit/tag objects and the final conversation report record the resulting identifiers after creation. Keep the local working branch `version-3`; do not start Version 4.

### Release validation and file audit — executed before committing

- Refreshed origin/main with `git fetch --no-tags origin refs/heads/main:refs/remotes/origin/main`; it still equaled the approved Version 2 baseline. Version 1 remained an ancestor. No divergence was found.
- `py scripts/validate_airports.py`: all six airports passed. `py -m unittest discover -s tests -p '*checks.py'`: **7 passed**. Both external JavaScript syntax checks and the inline-navigation syntax check passed; exactly **10 slides** remain.
- Fresh `node tests/browser.mjs`: **25 groups passed**, zero JavaScript exceptions; every one of the **48 simulator combinations** and **30 projector-layout measurements** passed. Actual camera-button click cases for all three routes again produced distance 38 → 32.3 (+) → 37.145 (−) → 38 (Reset), with zero post-drag reset-position error.
- Re-read the changed runtime/test diff, Version 3 stylesheet, README, prompt records and untracked inventory. All **22** candidate paths are intended Version 3 presentation/runtime/style, tests, documentation, ignore rules and reviewed evidence. Combined size is about 2.7 MB; no individual candidate exceeds 2 MB. The artifact set contains only the sanitized report, the three existing screenshots and ten numbered projector screenshots.
- Credential-pattern scan found no private-key blocks, AWS access-key IDs, GitHub tokens or OpenAI-style API keys in candidate text. No secrets were otherwise identified in the reviewed files; this is not a guarantee against every possible secret format.
- Confirmed exclusion of browser profiles, caches/bytecode, backups, the old local release-check clone and transient failure screenshots. Confirmed unchanged `analysis.py`, `data/`, `assets/vendor/`, PRD.md and SOURCES.md against v2.0, and verified every vendor/geography manifest digest.
- `git diff --check` passed. Git emitted routine Windows LF/CRLF notices; vendored bytes remain protected by the existing attributes. Remaining presentation limitations are the previously documented headless-Chrome/software-WebGL scope and intentional scrolling for expanded disclosures/mobile layouts, not critical release failures.

At this documentation checkpoint, commit/tag/push are the next authorized operations, not claimed completed actions. This exact prompt, actual review, fresh test results and intended safe publication procedure are included in the release snapshot before committing. Git's immutable commit/tag metadata and the final response provide the actual resulting commit SHA and post-push verification without requiring a second documentation-only release commit.
