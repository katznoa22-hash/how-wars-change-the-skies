# Version 4 pre-release audit — 9 November 2026

Tool: Codex. Scope: original local version-4 Git working tree. No redesign, runtime/model change, commit, tag, push or publication was performed during this audit. Audit changes are limited to tests/model_checks.py, documentation, .gitignore (audit evidence allow-list), this report and refreshed browser evidence.

## Release verdict

The local technical checks pass. **Hold publication:** user release approval is absent, and the precise independent ZIP traceback/environment has not been supplied. A concrete last-bit summation mechanism is reproduced below, but the exact external failure cannot honestly be declared reconciled. External source and physical-review limitations remain disclosed.

| Gate | PASS / FAIL | Evidence / scope |
| --- | --- | --- |
| Correct branch and release ancestry | PASS | version-4, HEAD ef15a06038502f249bd702255401e1f09dc738ee; V1/V2/V3 ancestry and original V1 HTML checksum pass. |
| Immutable release tags | PASS | v2.0 object 1e66b7c1a80c3b12f62979bed9a8e78a25962b80 → 1dd228500b5ba5708412495f1c43704468728b75; v3.0 object dd43ea3d8b5ac7ec3fd35b2ea17791696bd2d675 → ef15a06038502f249bd702255401e1f09dc738ee. Direct ls-remote confirms remote main/v2/v3 unchanged. |
| Clean baseline/history and empty index | PASS | No history divergence from v3.0 and no staged files. Working tree is intentionally dirty with listed V4 candidates; it is NOT a clean working tree. |
| Original nine tests before fixes | PASS | 9/9 in 1.501s, original Python 3.13.2 / Windows 11 AMD64 environment, exact generated/stored comparison had zero differences. |
| Hardened Python suite | PASS | 12/12, final run 1.263s: nine model checks plus three strict Git checks. No skipped tests. |
| Explicit model-only ZIP path | PASS | Nine model-only tests pass locally and in a temporary source-only directory without .git. No claim of Git-history verification from a ZIP. |
| Numerical comparison guard tests | PASS | Last-bit and sequential-sum differences accepted; 24 out-of-budget route-field changes, non-finite/non-numeric values and altered inputs/structure rejected. Displayed rounded results unchanged in summation control. |
| Exact independent ZIP discrepancy reconciled | FAIL — pending evidence | Reviewer traceback/differing values/Python/OS absent; requested from user. Only one local Python build available; no cross-platform run claimed. |
| Browser and simulator regression | PASS | Fresh 29/29 groups, all 48 independent expected-cost/score combinations, three routes/synchronization, source disclosure and all navigation methods. |
| Globe and graceful fallback | PASS | Actual pointer +/−/Reset, rotation/keyboard/wheel, both view modes, missing dependencies/model, denied WebGL and actual context loss. Reset pose error 0 on all routes. |
| Projector layout automation | PASS | 30/30: ten slides × 1280×720 / 1366×768 / 1920×1080, zero default overflow beyond the existing 2px tolerance. |
| On-screen visual/source-text inspection | PASS, with limits | All ten fresh 1366×768 captures inspected; no clipped headings or essential text seen. Body 17px, source notes generally 16–17px; smaller labels are listed below. Physical readability is not certified. |
| Contrast/focus and accessibility regression | PASS, with limits | Six text/background token ratios ≥9.30:1; navy-on-cyan button contrast passes; focus, target sizes, selected state, keyboard and reduced-motion assertions pass. No full WCAG/screen-reader certification. |
| Runtime exceptions / assets / network | PASS | Zero uncaught exceptions; zero unexpected normal-mode console/asset errors; no external runtime dependency. One deliberate WebGL error and two inspector-blocked resources retained in report. |
| Required local assets included in candidate | PASS | Every HTML/CSS local reference resolves; dependencies/data already tracked; hero-v4.jpg and v4.css explicitly included below. Four manifest hashes and hero digest match. |
| Source/claim transparency | PASS, with limits | Six presentation sources readable; historical/operator-specific/model/simulation qualifications retained. RKSI/FAA access limitations explicitly disclosed. No new validated facts or dates invented. |
| Documentation/privacy/release scope | PASS | README, PRD addendum, SOURCES, exact three V4 prompts/log and visual provenance reviewed/updated; no personal workstation path, secret, cache/profile/backup in candidates. Bounded scan, not a guarantee against all secret formats. |
| Release authorization | FAIL — intentionally held | No explicit final release approval. Nothing staged or published. |

## Floating-point investigation and targeted test fix

The original native generate() result equals committed data/scenarios.json exactly. The unseen independent report cannot be diagnosed from a pass/fail count alone. However, the old assertEqual on all derived binary floats is demonstrably too strict for numerical portability. Python's official documentation records a float summation change in 3.12; its math module also wraps platform C functions:

- [Python 3.13 sum documentation](https://docs.python.org/3.13/library/functions.html#sum)
- [Python math documentation](https://docs.python.org/3.13/library/math.html)

Controlled experiment: replace only analysis.sum in memory using unittest.mock.patch with a sequential `start += value` loop, then run unchanged generate(). This is not a claim to have executed Python 3.11 or Linux. All three detour sums move by one last-bit step (1.8189894035458565e-12 km). Subtraction/division propagate it into other fields. Examples:

| Output | Stored | Sequential summation | Delta |
| --- | ---: | ---: | ---: |
| LHR–HND detour km | 12433.875845962299 | 12433.8758459623 | +1.8189894035458565e-12 |
| LHR–HND extra hours | 3.304604316727533 | 3.304604316727535 | +2.220446049250313e-15 |
| LHR–HND extra USD | 30185.962242065183 | 30185.962242065205 | +2.1827872842550278e-11 |
| FRA–SIN detour km | 11528.909328385662 | 11528.90932838566 | −1.8189894035458565e-12 |
| HEL–ICN detour km | 11055.49785889791 | 11055.497858897912 | +1.8189894035458565e-12 |

The fix changes only a test comparator. Exact matching remains mandatory for coordinates, waypoints, assumptions, strings, route keys, schema and metadata. Only the eight derived fields use math.isclose with **rel_tol=0** and explicit absolute budgets:

| Fields | Absolute budget | Meaning |
| --- | ---: | --- |
| directKm, detourKm, extraKm | 1e-9 km | 1 micrometre |
| extraPercent | 1e-11 percentage points | Not a relative percentage tolerance |
| extraHours | 1e-12 h | 3.6 nanoseconds |
| extraCostUSD | 1e-7 USD | Far below one cent |
| extraFuelKg, extraCO2Kg | 1e-7 kg | 0.1 milligram |

These are numerical comparison budgets, not scientific uncertainty. They are far below displayed precision and the community-coordinate/model uncertainty. No JSON, analysis.py formula, model assumption or runtime calculation was changed. Git-history tests still compare original validated files exactly. Three added regression tests verify permissible perturbations and rejection of substantive changes, invalid outputs and input/schema changes. Default discovery still runs GitHistoryChecks; the explicit ModelChecks target is a documented ZIP-only subset.

## Commands and actual results

```powershell
# Original pre-fix environment: 9 passed; final hardened suite: 12 passed
py -B -m unittest discover -s tests -p '*checks.py' -v
# Final model-only command: 9 passed; also executed in a temporary non-Git copy
py -B tests/model_checks.py ModelChecks -v
# Six airport-reference checks passed
py -B scripts/validate_airports.py
# Both passed; executable inline scripts also extracted read-only and checked
node --check assets/v2.js
node --check tests/browser.mjs
# Fresh complete run: 29 groups, 48 combinations, 30 layouts passed
node tests/browser.mjs
# No whitespace errors (configured LF-to-CRLF notice for SOURCES.md only)
git diff --check
```

Additional executed read-only checks: exact generated/stored float diff, sequential-sum control, four asset-manifest hashes and hero hash, HTML/CSS local-reference enumeration, previous V3 artifact-byte comparison, source-page reads, file-only privacy patterns, ignored-path checks, Git tag/ancestry/hash checks and git ls-remote. analysis.py main and fetch_assets.py were not run; no data regeneration/download was needed. No external dependencies installed. Node v26.12.1, installed Chrome with software WebGL. Python 3.13.2 AMD64; no second Python/OS build executed.

## Visual review, all ten slides

| Slide | On-screen result / residual concern |
| --- | --- |
| 1 | Selectable title/subtitle and native Start button clear; hero artwork disclosure visible. Artwork caption is 15px, category 14.45px. Reference bitmap unavailable; no pixel-match claim. |
| 2 | Three aligned concept panels/diagrams and legal source link readable; source note 16px, evidence badge 14.45px. |
| 3 | Four-step narrative and baseline/detour comparison fit; body/source text 16–17px. Historical EASA date remains visible. |
| 4 | Case buttons/content/citation fit; source 16px, case buttons 15.64px and badge 14.45px. Event/retrieval dates distinguished. |
| 5 | Three-route selector, metric labels, zero-origin bars and disclosure fit. Sources/disclosure summary 16px. Mobile selector overflow remains fixed. |
| 6 | Functional globe and side-rail controls fit; airport labels 16px, country labels 15px, control labels 14px, legend/summary 16px. Small control text is a real residual projection risk despite larger hit boxes. |
| 7 | Cost sliders, component chart and one-flight/annual/direct-CO2 results readable and fit; source summary 16px. |
| 8 | Four briefing cards and interpretation warning readable; no clipped content seen. |
| 9 | Selected response and invented-score warnings readable; feedback/disclosure fit. Expanded table reflow tested, not all feedback states visually captured. |
| 10 | Conclusion/recommendations/source register/limitations fit; source text 16px, Return button about 14.96px, category 14.45px. |

A temporary read-only CDP text-size audit confirmed the sizes above at 1366×768 using the established browser transport, then closed its browser/server and removed only its verified temporary script. No product CSS was changed. Presentation chrome/categories/badges and globe controls retain some sub-16px text; the 17px body-size assertion alone does not prove physical projector readability. No physical projector, screen reader, actual touch device, hardware GPU or other browser/platform was tested. Expanded disclosures/mobile intentionally scroll vertically. Contrast assertions cover solid tokens; full composited/image-pixel contrast was not certified.

## Sources, dates and claims

All six external source-register URLs were reopened successfully: ICAO Chicago Convention; Finnair bypass advisory; EASA 14 April 2024 notice; ICAO CORSIA FAQ; Natural Earth terms; GitHub airport-codes. NATS chart text explicitly confirms its stored ARP; JMA Haneda, Fraport venue, CAAS Changi, Fintraffic Helsinki, Natural Earth v5.1.2, Three.js r128 and Israel LLBG example were readable. Existing URLs and source dates remain unchanged. External availability checks are not live operational clearance or archival guarantees.

**Not independently reconfirmed in this audit:** [historical Korean RKSI AIP](https://aim.koca.go.kr/eaipPub/Package/2021-04-08/html/eAIP/KR-AD-2.RKSI-en-GB.html) timed out; [FAA JFK example PDF](https://www.faa.gov/Air_traffic/Publications/media/2024-03-21_AIP_Basic_dtd_3-21-24.pdf) exceeded the reader size limit (~39.5MB). This does not establish either URL is broken. Raw asset URLs were not refetched; manifest digests verify local consistency, not independently authenticated remote content. The hero is generated illustration, not satellite data or an exact geopolitical map. Local airport tests use stored references and cannot prove current source-site availability.

The April 2024 closures remain explicitly historical, with expiry on 14 April; the Finnair example is operator-specific and retains its 8 November 2026 retrieval date. Waypoint routes are illustrative, cost/CO2 are model estimates, reliability/retention are invented scores, red country fills are context rather than FIR/closure geometry. No live restrictions, winds, certified performance, safety/legal approval, revenue/profit or total climate model is claimed. No source was changed to hide a failed verification.

## Runtime asset and privacy review

Required HTML/CSS local references exist and are not ignored: assets/vendor/three.min.js; assets/vendor/OrbitControls.js; data/presentation-data.js; assets/v2.js; assets/v4.css; assets/hero-v4.jpg; linked SOURCES.md. All except the new stylesheet/hero are already tracked. The local MIT license, validated JSON and geographic inputs are already tracked and retained. Four pinned hashes and hero SHA-256 ee090fe797975357c1f3779ff2de6d317f35627e0a72766f9f956a3031869bf9 matched. Existing assets/v2.css and v3.css remain tracked historical files but are not active runtime stylesheets.

Ignored and excluded: .browser-profile/, __pycache__/, *.pyc, backups/, transient browser-failure captures and other artifact diagnostics. The existing prior artifacts are byte-identical. Scan of candidate text for private-key/token/AWS-key patterns, workstation paths and email-like values found no actual secret/personal path; one broad /home/ pattern matched the documented Home keyboard shortcut and was a false positive. Screenshots show presentation chrome only, not personal browser UI. This is a bounded audit, not a guarantee against every possible secret. No files were staged and no blanket git add was used.

## Exact proposed commit files (25; not staged)

```text
.gitignore
PRD.md
README.md
SOURCES.md
artifacts/v4/browser-results.json
artifacts/v4/pre-release-audit.md
artifacts/v4/preview.html
artifacts/v4/v4-slide-01-projector.png
artifacts/v4/v4-slide-02-projector.png
artifacts/v4/v4-slide-03-projector.png
artifacts/v4/v4-slide-04-projector.png
artifacts/v4/v4-slide-05-projector.png
artifacts/v4/v4-slide-06-projector.png
artifacts/v4/v4-slide-07-projector.png
artifacts/v4/v4-slide-08-projector.png
artifacts/v4/v4-slide-09-projector.png
artifacts/v4/v4-slide-10-projector.png
assets/hero-v4-provenance.json
assets/hero-v4.jpg
assets/v2.js
assets/v4.css
index.html
prompts/codex-development-v4.md
tests/browser.mjs
tests/model_checks.py
```

No data or vendor files need staging because they are unchanged and already tracked. The list is the intended V4 delta against v3.0, including this audit record; it does not imply authorization to commit. No .git directory, export ZIP, local backup/profile/cache, transient screenshot or new dependency belongs in the commit.

Documentation retains the original PRD/planning context and previous prompt records. README explains the new 12-test total and explicit nine-test ZIP subset; PRD and SOURCES append current audit scope/caveats; prompts/codex-development-v4.md includes the exact pre-release prompt and actual actions/results. Publication remains held for explicit user approval and any additional evidence the reviewer supplies.

## Minimal-change release-readiness follow-up — 9 November 2026

Codex created a ZIP of the current tracked and intended non-ignored source files in a verified temporary directory, extracted it into a fresh directory outside Git, verified no Git repository was discoverable, and used isolated Python mode (`-I`) without installing dependencies. This is a newly created export of the current local candidate, not the unavailable independent reviewer’s original ZIP. Temporary export/extraction files were cleaned up only within the verified temporary root.

Commands executed in the extraction:

```powershell
py -I -B tests/model_checks.py ModelChecks -v
py -I -B -m unittest discover -s tests -p '*checks.py' -v
```

Results: model-only command passed 9/9, exit 0. Default discovery ran 12 tests: nine model passes and exactly three expected Git-history errors, exit 1, because .git is absent. These errors were not hidden or relabelled as passes. An isolated inline diagnostic loaded the extracted analysis.py and test comparator, checked exact native equality, then patched only in-memory summation for the controlled rounding experiment. The original external floating-point failure did not reproduce; its exact cause remains unconfirmed without the original values/Python/OS. No second OS or interpreter build was run.

Exact environment and numerical evidence (all eight derived fields for all three routes):

```json
{
  "python": "3.13.2 (tags/v3.13.2:4f8bb39, Feb  4 2025, 15:23:48) [MSC v.1942 64 bit (AMD64)]",
  "os": "Windows-11-10.0.26200-SP0",
  "machine": "AMD64",
  "isolated": 1,
  "strictNativeEquality": true,
  "nativeBehavior": "accepted",
  "sequentialBehavior": "accepted",
  "excessBehavior": "rejected",
  "alteredInputBehavior": "rejected",
  "excessExpected": 12433.875845962299,
  "excessActual": 12433.8758459723,
  "values": [
    {
      "route": "lhr-hnd",
      "field": "directKm",
      "expected": 9591.91613357662,
      "actual": 9591.91613357662,
      "delta": 0.0,
      "sequential": 9591.91613357662,
      "sequentialDelta": 0.0,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "lhr-hnd",
      "field": "detourKm",
      "expected": 12433.875845962299,
      "actual": 12433.875845962299,
      "delta": 0.0,
      "sequential": 12433.8758459623,
      "sequentialDelta": 1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "lhr-hnd",
      "field": "extraKm",
      "expected": 2841.9597123856784,
      "actual": 2841.9597123856784,
      "delta": 0.0,
      "sequential": 2841.95971238568,
      "sequentialDelta": 1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "lhr-hnd",
      "field": "extraPercent",
      "expected": 29.628696423203323,
      "actual": 29.628696423203323,
      "delta": 0.0,
      "sequential": 29.628696423203337,
      "sequentialDelta": 1.4210854715202004e-14,
      "absoluteTolerance": 1e-11
    },
    {
      "route": "lhr-hnd",
      "field": "extraHours",
      "expected": 3.304604316727533,
      "actual": 3.304604316727533,
      "delta": 0.0,
      "sequential": 3.304604316727535,
      "sequentialDelta": 2.220446049250313e-15,
      "absoluteTolerance": 1e-12
    },
    {
      "route": "lhr-hnd",
      "field": "extraCostUSD",
      "expected": 30185.962242065183,
      "actual": 30185.962242065183,
      "delta": 0.0,
      "sequential": 30185.962242065205,
      "sequentialDelta": 2.1827872842550278e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "lhr-hnd",
      "field": "extraFuelKg",
      "expected": 24784.532375456496,
      "actual": 24784.532375456496,
      "delta": 0.0,
      "sequential": 24784.532375456514,
      "sequentialDelta": 1.8189894035458565e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "lhr-hnd",
      "field": "extraCO2Kg",
      "expected": 78319.12230644253,
      "actual": 78319.12230644253,
      "delta": 0.0,
      "sequential": 78319.12230644259,
      "sequentialDelta": 5.820766091346741e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "fra-sin",
      "field": "directKm",
      "expected": 10280.1888371662,
      "actual": 10280.1888371662,
      "delta": 0.0,
      "sequential": 10280.1888371662,
      "sequentialDelta": 0.0,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "fra-sin",
      "field": "detourKm",
      "expected": 11528.909328385662,
      "actual": 11528.909328385662,
      "delta": 0.0,
      "sequential": 11528.90932838566,
      "sequentialDelta": -1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "fra-sin",
      "field": "extraKm",
      "expected": 1248.720491219461,
      "actual": 1248.720491219461,
      "delta": 0.0,
      "sequential": 1248.7204912194593,
      "sequentialDelta": -1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "fra-sin",
      "field": "extraPercent",
      "expected": 12.146863360183945,
      "actual": 12.146863360183945,
      "delta": 0.0,
      "sequential": 12.146863360183927,
      "sequentialDelta": -1.7763568394002505e-14,
      "absoluteTolerance": 1e-11
    },
    {
      "route": "fra-sin",
      "field": "extraHours",
      "expected": 1.4520005711854198,
      "actual": 1.4520005711854198,
      "delta": 0.0,
      "sequential": 1.4520005711854178,
      "sequentialDelta": -1.9984014443252818e-15,
      "absoluteTolerance": 1e-12
    },
    {
      "route": "fra-sin",
      "field": "extraCostUSD",
      "expected": 13263.322993133395,
      "actual": 13263.322993133395,
      "delta": 0.0,
      "sequential": 13263.322993133377,
      "sequentialDelta": -1.8189894035458565e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "fra-sin",
      "field": "extraFuelKg",
      "expected": 10890.004283890648,
      "actual": 10890.004283890648,
      "delta": 0.0,
      "sequential": 10890.004283890634,
      "sequentialDelta": -1.4551915228366852e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "fra-sin",
      "field": "extraCO2Kg",
      "expected": 34412.41353709445,
      "actual": 34412.41353709445,
      "delta": 0.0,
      "sequential": 34412.413537094406,
      "sequentialDelta": -4.3655745685100555e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "hel-icn",
      "field": "directKm",
      "expected": 7032.05109677715,
      "actual": 7032.05109677715,
      "delta": 0.0,
      "sequential": 7032.05109677715,
      "sequentialDelta": 0.0,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "hel-icn",
      "field": "detourKm",
      "expected": 11055.49785889791,
      "actual": 11055.49785889791,
      "delta": 0.0,
      "sequential": 11055.497858897912,
      "sequentialDelta": 1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "hel-icn",
      "field": "extraKm",
      "expected": 4023.4467621207605,
      "actual": 4023.4467621207605,
      "delta": 0.0,
      "sequential": 4023.4467621207623,
      "sequentialDelta": 1.8189894035458565e-12,
      "absoluteTolerance": 1e-09
    },
    {
      "route": "hel-icn",
      "field": "extraPercent",
      "expected": 57.21583513471257,
      "actual": 57.21583513471257,
      "delta": 0.0,
      "sequential": 57.21583513471259,
      "sequentialDelta": 2.1316282072803006e-14,
      "absoluteTolerance": 1e-11
    },
    {
      "route": "hel-icn",
      "field": "extraHours",
      "expected": 4.6784264675822795,
      "actual": 4.6784264675822795,
      "delta": 0.0,
      "sequential": 4.678426467582281,
      "sequentialDelta": 1.7763568394002505e-15,
      "absoluteTolerance": 1e-12
    },
    {
      "route": "hel-icn",
      "field": "extraCostUSD",
      "expected": 42735.16317456321,
      "actual": 42735.16317456321,
      "delta": 0.0,
      "sequential": 42735.163174563226,
      "sequentialDelta": 1.4551915228366852e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "hel-icn",
      "field": "extraFuelKg",
      "expected": 35088.1985068671,
      "actual": 35088.1985068671,
      "delta": 0.0,
      "sequential": 35088.19850686711,
      "sequentialDelta": 1.4551915228366852e-11,
      "absoluteTolerance": 1e-07
    },
    {
      "route": "hel-icn",
      "field": "extraCO2Kg",
      "expected": 110878.70728170003,
      "actual": 110878.70728170003,
      "delta": 0.0,
      "sequential": 110878.70728170009,
      "sequentialDelta": 5.820766091346741e-11,
      "absoluteTolerance": 1e-07
    }
  ]
}
```

### Minimal-change readiness closeout (Codex, 9 November 2026)

Files changed during this request only: README.md, prompts/codex-development-v4.md and artifacts/v4/pre-release-audit.md. No runtime, CSS, test, data, formula, citation, screenshot or Git-reference change was made. The V4 log opening is now explicitly labelled historical scope plus current candidate status; original prompts and historical results remain preserved. README now prominently maps V1–V4 to original transcript/summary evidence, links directly to cover/globe images and the ten-slide gallery, links PRD/SOURCES/logs, explains Python's offline quantitative role and cautions that optional regeneration writes files.

Executed after the documentation changes: py -I -B -m unittest discover -s tests -p '*checks.py' -v → 12/12 passed in 1.321s. Fresh actual source-ZIP extraction under isolated Python → nine model tests passed in 0.049s; default discovery in that non-Git tree returned the three expected history errors, not a float mismatch. The numerical JSON above records exact Python/OS, all expected/actual derived fields, tolerances and acceptance/rejection. Native deltas are all zero; the original external failure is not reproduced or fully reconciled. No new formula/tolerance change was needed in this request.

All 27 local README Markdown references (15 unique files) resolve. Ten ordered slide sections, ten captures, local HTML/CSS assets, four pinned hashes and hero hash verified. The unchanged browser report still contains 29 passing groups/48 simulator combinations/30 layouts; the browser suite was not unnecessarily rerun for documentation-only changes. Its prior executed results remain labelled as prior audit evidence, not new tests in this stage.

The exact 25-file proposed commit list in the audit report was matched against git diff plus untracked/non-ignored paths. No proposed file is ignored; no profile/cache/backup/temp/Git directory is included. Bounded secret and workstation-path scans found no actual matches; the Home/End shortcut text was a known false positive. Projector PNGs contain no text/Exif metadata chunks. No staging occurred. Temporary ZIP and extracted tree were outside the repository and cleaned only within a resolved, verified temporary root.

PASS: documentary traceability with clear transcript/summary labels; original 12-test Git validation; nine extracted model tests; expected/actual/tolerance evidence; README links and Python explanation; ten slides/assets; exact candidate/privacy scope; preservation of datasets/formulas/releases. FAIL/open: exact external reviewer discrepancy cannot be confirmed without its traceback/environment; final release approval is absent. Known prior source-access, small-label and physical/cross-browser/screen-reader limitations remain disclosed. Branch remains version-4 at ef15a06038502f249bd702255401e1f09dc738ee. Stop before git add/commit/tag/push; no Version 5 or redesign was started.
