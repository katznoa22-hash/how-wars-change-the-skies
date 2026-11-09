# Version 4 — final academic submission development log

**AI tool:** Codex

**Date:** 2026-11-09

**Scope at initiation (historical):** Phase 1 — safe preparation and audit only. Implementation, commits, tags, pushes and dependency installation require later authorization. Version 4 is intended to become the final submission version; this audit is not a claim that final acceptance has been achieved.

**Current status:** Version 4 application release 4e73a2a528395aa939251579dfd51ca6e8089a86 is published on public GitHub main. The local branch is version-4. The user has explicitly approved a separate five-file documentation commit and normal branch-only push. Original application release/history/tags remain protected. Actual documentation commit identity and post-push outcome are established by Git metadata and final remote verification, not predicted here. The external floating-point observation remains unconfirmed.

## Exact initiating prompt

```text
We are beginning Version 4, the FINAL academic submission version of "How Wars Change the Skies".

DESIGN DIRECTION:
Midnight Navy & Champagne Gold — a premium, elegant, cinematic aviation presentation with restrained gold accents, pearl-white typography, exceptional projector readability, and polished interactive components.

CRITICAL CONTEXT:
- Version 3 is published on GitHub as v3.0.
- Version 4 must preserve the existing 10-slide presentation structure.
- Preserve the working 3D globe, camera controls, 2D fallback, route comparison, cost calculations, and airline decision simulator.
- Preserve validated datasets, formulas, assumptions, citations, and source provenance.
- The final submission may be reviewed by an AI evaluator. Prioritize verifiable correctness, accessibility, maintainability, reproducibility, documentation, and visual quality.
- Do not invent or modify facts to make the presentation more dramatic.
- Every original AI prompt and every development phase must be documented accurately.

PHASE 1 — SAFE PREPARATION AND AUDIT ONLY:
1. Inspect Git status, branches, tags, remote state, and confirm v3.0 is the expected release baseline.
2. Create and switch to a new local branch named version-4 from v3.0, only if the working tree is clean and there is no branch conflict.
3. Inspect all 10 actual slides in index.html and their related CSS, JavaScript, data, tests, and documentation.
4. Identify the precise slide order, content, interaction points, visual weaknesses, projector-readability issues, accessibility gaps, and performance risks.
5. Review README.md, PRD.md, SOURCES.md, analysis.py, existing tests, and prompt documentation to identify requirements already satisfied and gaps that need attention. Do not assume missing instructor requirements.
6. Produce a detailed, slide-by-slide Luxury redesign plan that retains the actual content and interactions.
7. Define a consistent design system: Midnight Navy, Champagne Gold, Pearl White, restrained cyan for interactive states, typography, spacing, visual hierarchy, responsive layouts, reduced-motion support, and accessible contrast.
8. Define a comprehensive verification plan covering all 10 slides, all existing interactions, 3D and 2D behavior, simulator combinations, mathematical correctness, browser errors, and projector layouts.
9. Create prompts/codex-development-v4.md. Record this exact prompt verbatim, the audit process, findings, files inspected, proposed changes, and validation plan. Never claim tests passed unless actually run.
10. Present the audit and proposed implementation plan to the user, then STOP for approval before implementing the visual redesign.

SAFETY:
- Do not change Version 3 or the v3.0 tag.
- Do not commit, tag, push, force-push, reset --hard, or delete history during Phase 1.
- Do not install new dependencies without explicit justification and approval.
- Do not add extra slides or convert the presentation into a standalone application.
- Do not replace functioning interactive features with static images.
- If anything is ambiguous or unsafe, stop and explain before proceeding.

The objective is a visually outstanding, academically credible, fully documented final Version 4 — not merely a cosmetic redesign.
```

## Safety preparation — executed

- Initial branch `version-3`; working tree clean; HEAD `ef15a06038502f249bd702255401e1f09dc738ee`.
- Local annotated `v3.0` object `dd43ea3d8b5ac7ec3fd35b2ea17791696bd2d675`, peeled commit `ef15a06038502f249bd702255401e1f09dc738ee`.
- Direct `git ls-remote` confirmed GitHub main and v3.0 match those values. No remote version-4 branch was returned. Local branches were main (Version 2, one commit behind origin/main) and version-3; no local version-4 conflict. Local main was not moved or used as the baseline.
- A guarded subprocess verified cleanliness, tag identity/type and absence of version-4, then executed `git switch -c version-4 v3.0` successfully.
- No AGENTS.md was found among project files outside ignored local state. No new dependency was installed. No additional version branch, backup, commit or tag was created.

## Audit process and inspected artifacts — Phase 1

Codex inspected the ten actual sections in index.html, its inline CSS and navigation/case-study scripts; assets/v2.css, assets/v3.css, assets/v2.js; local Three.js/OrbitControls dependency references; analysis.py; all project data JSON and the generated presentation-data.js companion; README.md, PRD.md, SOURCES.md; tests/model_checks.py and tests/browser.mjs; scripts/validate_airports.py, fetch_assets.py, correct_coordinate_import.py and upgrade_v2.py; .gitignore and .gitattributes. Existing prompt records reviewed: 01-chatgpt-conversation.md, 01-planning.md, antigravity-development.md, codex-validation.md, codex-stage-record.md, codex-release-v2.md and codex-development-v3.md. The prior browser report and representative projector screenshot were inspected as existing evidence, not new test executions.

A temporary read-only browser inspection served the unchanged project on localhost:8766 and used installed headless Chrome with a temporary profile outside the repository. It visited all ten slides at 1366×768, inspected controls/semantics, initialized the globe and captured temporary screenshots. Audit output is in the operating-system temporary directory (skies-v4-audit-1g6QPd), not a project deliverable. This was not the complete regression harness. No project server, dependency or generated model file was installed or rewritten.

### Findings and requirements traceability

- The presentation has exactly ten slides and extensive working functionality. Local assets support offline runtime and direct-file preview; citations open external websites only when requested. Preserve this architecture.
- All ten default slide contents fit the 640px available content height at the audited 1366×768 viewport. Body text was 17px, but important labels/citations were approximately 12.75–15.3px. Fitting the viewport does not establish projector readability.
- The live globe initialized successfully; its usable camera was available and renderer geometry count was 17. No uncaught exceptions or console errors/warnings were observed during this limited audit. A representative screenshot shows excessive empty horizontal canvas space relative to the globe and a crowded, small-label toolbar.
- Navigation dots have 12px-high hit boxes (active dot 28×12px). Slider input boxes measure 6px high; enlarge their interactive area while retaining the native range input. Globe buttons measure 38px high in this layout and zoom buttons about 27px wide. Aim for 44px comfortable controls where space permits and at least 24px targets, including transparent hit areas.
- Case-study buttons lack programmatic selected state. Source inspection and live browser interaction confirmed Ctrl+0 moves from slide 3 to slide 10; presentation shortcuts need modifier guards so browser shortcuts are respected. Also guard editable content and retain native form/button keyboard behavior.
- Existing strengths include inert inactive slides, focus management, a focus-contained shortcut dialog, globe keyboard controls, reduced-motion handling, camera-status explanations, missing-WebGL/library fallback and model-unavailable messages. Preserve these and test them after any edits.
- Styling is spread across roughly 1,000 lines of original inline CSS, v2.css, v3.css and many inline font overrides (85 font-size declarations counted). Runtime colors also occur in JavaScript. Avoid adding an uncontrolled override layer: introduce explicit V4 tokens and scoped presentation rules, migrating only touched conflicting declarations.
- PRD.md is an original draft/proposal, not a supplied instructor rubric. Its core ten-slide/interactive objectives are substantially implemented. Some originally proposed embellishments are simplified: slide 1 uses a stylized vector/CSS globe rather than a second 3D preview, slide 2 uses explanatory cards rather than a network explorer, slide 3 has no live status toggle, slide 4 has no event timeline, and slide 8 has static rather than selectable priorities. Do not imply these exist or implement speculative requirements. Document the final as-built mapping without erasing the historical PRD.
- Actual academic boundaries are already strong: dated legal/advisory sources, illustrative waypoint routes, generalized countries rather than FIR boundaries, explicit cost assumptions and invented simulator scores. Make these distinctions more visible without changing claims.
- Scientific constants remain unchanged: radius 6,371km; 860km/h; 7,500kg fuel/h; 0.8kg/L; 3.785411784L/USgal; $2.80/USgal default; $2,200/h other costs; 3.16kg CO2/kg fuel; 730 identical sectors/year. Haversine/waypoint segment sums and all simulator parameters remain unchanged. Generated model schema version 2 is not presentation branding and need not be renamed.
- Airport validation covers six selected airports against independent references within 5km, not certified airport reference points. Natural Earth 1:110m boundaries are generalized and not a live restrictions feed. Preserve both caveats. No verified correction requiring data changes was found.
- Dependencies are local pinned Three.js/OrbitControls r128. Retain them; no upgrade is needed for visual polish. The fetcher is not needed for this stage; its mutable airport source and historical retrieval timestamp must not be represented as freshly verified data.
- Performance is already bounded by one renderer, frame throttling, device-pixel-ratio cap and geometry disposal. Remaining risks include label layout work each frame and unnecessary hidden-map work. Measure before optimizing; no new renderer, postprocessing, heavy assets or decorative animation.
- Browser tests use Windows-specific executable discovery and write versioned evidence. Plan portable executable discovery/override and separate V4 report names so existing V3 evidence is preserved. Existing simulator checks compare views using the same engine; add independent expected calculations for stronger evidence.

## Proposed design system — not implemented

Use Midnight #07111F, deeper background #040A13, panel #101E30, Champagne Gold #D8BC83, Pearl #F4F0E8, secondary text #BEC8D2 and restrained cyan #7CCDDD for interactive focus/selection. Country-context shading can use muted rose #E69A95, explicitly labelled country context, not closures. Gold marks the principal result and illustrative detour; a dashed pearl baseline distinguishes routes without depending on color. Align CSS, 3D, 2D and legends through a small shared semantic palette; no geographic/model changes.

Read-only WCAG relative-luminance calculations for proposed solid colors: pearl/midnight 16.66:1; pearl/panel 14.78:1; secondary/panel 9.90:1; gold/panel 9.15:1; cyan/panel 9.30:1; rose/panel 7.53:1; midnight/gold 10.32:1. Pearl/gold is only 1.61:1, so filled gold buttons must use midnight text. These are proposed-token calculations, not proof of rendered accessibility compliance; opacity, compositing and focus boundaries require testing.

Retain local/system fonts: Segoe UI/system sans for body and metrics, with restrained Georgia/Cambria display accents only if legible in actual projection captures. No downloaded fonts. Use medium/semibold weight rather than thin luxury type. Proposed display range 32–48px (hero 52–72px), numeric results 30–44px, body 18–20px with responsive compact layouts, and meaningful supporting labels preferably 16–18px. Fit decisions must be tested at 720p; do not hide essential evidence to achieve large type.

Use an 8px-led spacing scale (8/12/16/24/32/48/64), restrained 12–16px card radii, subtle opaque surfaces, consistent alignment and short readable line lengths. Keep gold accents sparse; remove neon glow, excess gradients and unnecessary technical branding. Preserve the presentation header/footer and slide counter. Increase navigation/control hit areas without enlarging decorative dots. Use explicit text, line patterns, selected markers and accessible state rather than color alone. Links remain recognizable and visibly focusable.

Retain short optional transitions only; reduced-motion preference disables automatic globe/marker motion and decorative movement. Pause/resume must remain explicit and user-controllable. No parallax, new continuous animation or added external libraries. At small viewports allow deliberate slide scrolling and wrapped controls; expanded disclosures must remain reachable rather than clipped.

## Slide-by-slide redesign proposal — content and interaction preserved

| Slide | Actual content and preserved interactions | Proposed targeted redesign |
| --- | --- | --- |
| 1 — How Wars Change the Skies | Hero, illustrative LHR–HND additional distance/cost, assumptions disclaimer, Begin button. | Editorial pearl headline, single gold rule and metric pair, restrained native vector orbital motif. Keep the figures generated from the model and their illustrative status immediately adjacent. Do not introduce a second WebGL context or claim the hero is live tracking. |
| 2 — The Invisible Highways of the Sky | Great-circle baseline, sovereignty, FIR explanations, ICAO legal citation and causal chain. | Three aligned numbered panels with clear headings; compact connected sequence beneath. Increase legal-reference readability and preserve the distinction between sovereignty and FIR service boundaries. |
| 3 — What Happens When Airspace Closes? | Four operational steps, baseline/detour comparison, historical EASA citation. | Clean four-step briefing strip and strongly paired baseline/illustrative-detour panels. Improve arrow/step contrast and citation placement. Retain NOTAM/advisory distinction and historical date. |
| 4 — Two Conflicts, Global Consequences | Two selectable cases; Finnair operator-specific bypass and dated 13–14 April 2024 Middle East event. | Accessible segmented case selector with explicit selected state and coherent keyboard behavior; separate event date from retrieval date; fact/source strip and calm case card. No invented timeline, current-closure claim or industry-wide average. |
| 5 — The Flight Rerouting Challenge | Three-route selector, four metrics, zero-based comparison bars, formulas/waypoints disclosure; globe selection synchronization. | Establish a dominant distance comparison, clearly labelled units, then subordinate hours and cost. Use dashed pearl baseline/solid gold detour consistently; direct-value labels and adjacent illustrative badge. Keep details accessible and all three computed routes unchanged. |
| 6 — Explore the 3D Globe | Three routes, two context selections, rotation/pause, map toggle, reset, zoom, drag/scroll/keyboard, explanations and graceful fallback. | Allocate more useful space to the actual globe, simplify/wrap the toolbar and enlarge controls/labels. Make country context vs route geometry unmistakable. Apply identical semantic colors/line patterns to 3D/2D/legend, with high-contrast airport labels. Preserve the repaired camera and explicit disabled-state explanations; no renderer/camera rewrite. |
| 7 — The Hidden Cost of a Detour | Two sliders, route-hour transfer and reset, component cost bar, single/annual expense and direct CO2, model disclosure. | Gold fuel plus distinct patterned/labelled other-cost component, larger native slider hit areas, grouped inputs and results, clear units and incremental-cost heading. Keep 730-identical-sector and route-hour rounding explanations visible. No profit, total fare or lifecycle-emissions claims. |
| 8 — Airlines Under Pressure: The Four Dilemmas | Four managerial interpretation cards and safety/legal prerequisites. | A balanced two-by-two executive briefing layout with numbered headings, restrained iconography and one clear takeaway. Preserve all four dimensions and avoid suggesting a universal winning strategy. |
| 9 — You Are the Airline Manager | Two scenarios × four strategies × three fuel prices, outcome cards, concise/full feedback, comparison table and scoring assumptions. | Clear input-to-outcome hierarchy, larger feedback labels, explicit selected response, neutral invented-score treatment and persistent simulation disclaimer. Preserve N/A suspension reliability, cost scope, all 48 combinations and full comparison disclosure. Do not imply optimality or empirically calibrated reliability/retention. |
| 10 — The Future of Aviation Resilience | Existing synthesis statement, three recommendations, six external source links plus SOURCES.md, limitations/credits and Return to Start. | Strong editorial conclusion with three numbered recommendations, legible source-organization strip and layered source register. Retain accessible full citations, limitations and credits, visibly separate evidence, modeled results and simulated decisions. No invented authors, institution or rubric requirements. |

## Proposed implementation phases and intended files — approval required

1. Establish the scoped V4 design system and shell, then tune slides 1–4. Intended files: index.html, a scoped assets/v4.css, minimal necessary conflict cleanup in existing CSS. Preserve earlier stylesheet/history evidence. Check slide count, syntax, keyboard/focus behavior and compact layouts before continuing.
2. Refine routes/globe/cost/simulator and final synthesis (slides 5–10). Intended files: index.html, assets/v4.css, narrowly targeted assets/v2.js changes for semantic colors, accessibility announcements and keyboard modifier guards. Retain existing runtime filename if renaming has no substantive benefit. Check each meaningful interaction and 2D/WebGL fallback immediately.
3. Strengthen independent model/browser assertions and portable evidence output. Intended files: tests/model_checks.py, tests/browser.mjs, README.md, SOURCES.md only if clarifying existing provenance, and this prompt log. Do not change scientific source data or regenerate it unnecessarily. Add V3 protected-tag verification alongside existing V1/V2 history tests. Document final as-built requirements rather than silently revising the historical PRD.
4. Run complete regression/visual review, fix targeted regressions and rerun affected tests. Record exact commands, outcomes, failures and revisions. Stop for final manual review; no commit/tag/push is authorized by Phase 1 approval alone.

## Validation executed during Phase 1

- `py -B scripts/validate_airports.py`: passed for all six airports. Distances to independent references: FRA 2.972km, HEL 0.127km, LHR 0.758km, HND 1.083km, ICN 1.276km, SIN 1.130km.
- `py -B -m unittest discover -s tests -p '*checks.py'`: 7 tests passed (0.413 seconds).
- `node --check assets/v2.js` and `node --check tests/browser.mjs`: passed.
- Inline executable JavaScript extracted read-only from index.html and checked via `node --check -`: passed. Ten slide sections confirmed.
- All four manifest-pinned vendor/geography SHA-256 hashes matched the local files.
- Limited temporary Chrome audit: ten slides visited at 1366×768; default content fit; camera usable; 17 geometries; zero observed runtime exceptions or console issues. Ctrl+0 navigation collision and missing case-selection semantics reproduced. This is inspection evidence, not a full regression pass.
- Existing committed V3 browser evidence reports 25 passing browser groups, 48 simulator combinations and 30 projector checks. Those full browser tests were NOT rerun in Phase 1. No claim of V4 regression completion is made.
- A read-only extraction initially encountered PowerShell/Python console encoding failure on Unicode; rerunning with Python UTF-8 output succeeded. No presentation failure or file modification resulted.
- analysis.py generation was not executed because its main entry point writes data. Existing unit tests compared generated model values to committed JSON without rewriting it. Browser harness was not run because it writes published evidence artifacts; the temporary audit avoided that mutation.

## Required verification after implementation approval

1. Git/data integrity: retain ten ordered slide sections, baseline tag objects/commits and V1–V3 ancestry; compare source data, formulas, citations and asset hashes to v3.0. Require intentional file list, no secrets/profiles/caches/backups, no new external dependencies/network assets.
2. Model: rerun airport reference validation and seven existing Python checks plus added V3 protection and independent simulator/cost expectations. Check all three route sums, Haversine boundaries, unit conversions, slider endpoints/default/reset, route-hour rounding, annual multiplication and direct CO2. No merely self-comparing views as the sole mathematical oracle.
3. Syntax/runtime: check runtime JS, test harness and all executable inline scripts. Capture uncaught errors, console errors, failed local asset requests and unwanted external runtime requests; distinguish expected deliberately injected fallback failures.
4. Navigation/accessibility: every slide via buttons/dots/arrows/Space/Page/Home/End/numbers; safe Ctrl/Meta/Alt shortcuts and editable controls; fullscreen; shortcut modal focus trap/Escape/restore; inert inactive slides; case selected state; focus visibility; keyboard-only forms and canvas; dynamic output announcements; no reliance on color. Check actual composited contrast and target boxes. Manual screen-reader checks must be reported honestly if unavailable.
5. Globe/map: all three routes, both contexts, 3D/2D selection synchronization; drag/keyboard rotation, native pointer +/− with measured camera-distance change, reset pose after zoom/rotation, wheel, pause/resume, resize and repeated navigation. Missing Three/OrbitControls, WebGL failure/context loss and explicit 2D mode must preserve usable map/calculator and accessible disabled camera explanations. Check renderer/geometry stability and no unexpected auto-motion with reduced-motion preference.
6. Simulator: execute all 2×4×3 = 48 combinations; compare expense against independent expected formulas/fixtures, preserve scenario scores/retention and N/A reliability, table/selected-card consistency, monotonic fuel-sensitive costs, disclosures and keyboard selection. Invented scores must be visibly identified in every state.
7. Visual/layout: all ten slides at 1280×720, 1366×768 and 1920×1080 (30 projector cases), plus desktop/mobile and browser zoom/reflow. Inspect default and expanded disclosures, longest feedback, full source register, focus outlines, slider bounds and wrapped globe controls; require no accidental horizontal overflow/clipped controls. Retain readable scroll access when expansion intentionally exceeds slide height. Save clearly V4-labelled artifacts without replacing V3 evidence.
8. Performance/reproducibility: verify offline/file preview, localhost preview, no new dependencies, portable browser discovery or explicit BROWSER_PATH, clean-environment instructions and full-history requirement for Git preservation tests. Compare frame responsiveness, render/geometry counts and hidden-slide behavior with baseline before any optimization. A physical projector, assistive technology, other browsers and hardware GPU performance require manual review; headless software WebGL cannot establish those results.

## Phase 1 completion and approval boundary

No visual redesign, model/data change, dependency installation, commit, tag or push was performed. Only this audit/prompt document was created on the new version-4 branch. Implementation remains proposed and awaits explicit user approval. The next development phase must append subsequent user prompts verbatim, actual actions, changed files, executed test results, fixes and limitations. Final submission readiness cannot be declared until implementation, regression checks and manual review are complete.

## Subsequent prompt — cinematic implementation directive (2026-11-09)

```text
VERSION 4 — FINAL CINEMATIC AVIATION LUXURY IMPLEMENTATION DIRECTIVE

PROJECT: How Wars Change the Skies
STATUS: Version 3 was published as v3.0. Version 4 is the final academic submission candidate.
WORKING BRANCH: version-4
OBJECTIVE: Deliver an exceptionally polished, credible, interactive 10-slide academic presentation that withstands close scrutiny by human and AI reviewers.

THIS PROMPT SUPERSEDES ALL PREVIOUS VERSION 4 VISUAL DESIGN INSTRUCTIONS WHERE THEY CONFLICT.
In particular, CANCEL the earlier Midnight Navy & Champagne Gold design direction. Gold is NOT a branding/accent color in the final design. Do not use gold borders, gold buttons, gold headline gradients, decorative gold arcs, or metallic gold framing. Natural warm city lights and illuminated flight routes in Earth imagery are acceptable as realistic scene lighting, not as gold UI styling.

IMPORTANT REFERENCE:
The user has selected a specific reference image for Slide 1 in the conversation. It shows:
- A cinematic deep-navy sky and atmospheric clouds.
- A very large luminous Earth, mainly on the right, showing Europe, Africa and the Middle East.
- Realistic warm city lights and curved flight paths.
- A large commercial aircraft at the upper right and a small white aircraft silhouette with a dotted path near the upper left.
- A very large, elegant WHITE serif headline on the left: "How Wars Change the Skies".
- A white/light-gray subtitle: "The Impact of Geopolitical Conflicts on Global Aviation".
- A restrained CYAN vertical accent next to the subtitle.
- A premium BLUE/CYAN "Start Presentation" button.
- Restrained RED conflict highlights on parts of the globe only.
- Balanced cinematic lighting and generous negative space.
This user-selected reference, not later gold-heavy variations, is the visual north star. If the actual image file is available to Codex, inspect it. If not, follow this detailed description and do not claim pixel-level fidelity.

DESIGN SYSTEM — MODERN CINEMATIC AVIATION LUXURY:
- Primary background: deep midnight navy (#07111F or a carefully tuned equivalent).
- Secondary surfaces: layered dark blue/slate (#101E30 or equivalent).
- Primary text: pearl white (#F4F6F8).
- Secondary text: cool pale blue-gray (#BEC8D2).
- Interactive accent: refined cyan/ice blue (#7CCDDD or equivalent), adjusted to meet contrast requirements.
- Conflict/risk accent: restrained deep red/coral, used ONLY where the semantics indicate risk, restricted airspace, disruption, or danger.
- Neutral route colors must remain distinguishable without relying solely on color.
- Avoid decorative gold and excessive neon, glowing outlines, gradients, heavy glassmorphism, clutter, generic dashboard styling, and flashy animations.
- Aim for a luxury international aviation / editorial documentary presentation, not a gaming interface, marketing landing page, or generic SaaS dashboard.
- Use sophisticated typographic hierarchy, elegant serif display headings where appropriate, legible sans-serif body text, consistent spacing, and restrained motion.
- Preserve clear focus states, readable labels, sufficient contrast, and reduced-motion support.
- Use local/system fonts where possible; avoid unnecessary external dependencies.

MANDATORY WORKFLOW AND SAFETY:
1. Verify the current branch is version-4 and that its history descends from the immutable v3.0 release.
2. Inspect the current working tree and identify any Version 4 work already performed. Do NOT overwrite or discard useful work. If unexpected changes exist, inspect and reconcile them.
3. Treat the documented Version 4 audit and slide-by-slide plan as the technical baseline, but apply this new design direction wherever it supersedes the old gold palette.
4. Preserve the original 10-slide structure and actual academic content. Do not add, delete, merge, or reorder slides without explicit user approval.
5. Preserve Version 1 history, v2.0, v3.0, all previous release records, and validated source/data files.
6. Do not force-push, reset --hard, rewrite Git history, or delete previous releases.
7. Do not commit, tag, push, or publish Version 4 until the user has manually previewed and approved the final result.
8. Do not install new dependencies or fetch unverified assets without justification and approval.
9. Never invent facts, statistics, routes, citations, sources, historical dates, airline decisions, or numerical results.
10. Do not change validated model formulas or assumptions merely to improve visual presentation.
11. Clearly distinguish illustrative scenarios, modeled estimates, documented historical events, and verified factual claims.

SLIDE-BY-SLIDE IMPLEMENTATION:

SLIDE 1 — HOW WARS CHANGE THE SKIES:
Build the strongest visual slide in the deck, closely following the user-selected reference described above.
- Premium 16:9 cinematic composition with Earth dominating the right half.
- Large white editorial serif title on the left, with accurate line breaks and no overlap.
- Exact subtitle: "The Impact of Geopolitical Conflicts on Global Aviation".
- Aircraft imagery and atmospheric lighting must feel realistic and professionally integrated.
- Cyan/blue Start Presentation button must be a REAL accessible control that navigates to Slide 2.
- Preserve the existing Begin/Start interaction and keyboard navigation.
- Red markings should remain localized to illustrative conflict regions and must not imply precise geopolitical boundaries unless sourced.
- Decorative flight paths must be explicitly illustrative when they do not correspond to validated routes.
- Do not place essential text inside a raster background image. Render title, subtitle, and button as selectable, responsive HTML text and an actual button/link.
- If using an image background, ensure it is locally available, appropriately licensed or generated, performant, optimized, and does not contain duplicated embedded text.
- Test at projector and laptop sizes for legibility and clipping.
- Avoid giant gold ornaments, gold frames, or excessive red.

SLIDE 2 — THE INVISIBLE HIGHWAYS OF THE SKY:
- Three aligned explanatory panels with excellent hierarchy and projector readability.
- Clearly distinguish sovereign airspace, great-circle routes, and Flight Information Regions (FIRs).
- Preserve factual and legal nuance; do not oversimplify the relationships.
- Use refined aviation diagrams and restrained cyan emphasis.

SLIDE 3 — WHAT HAPPENS WHEN AIRSPACE CLOSES?:
- Create a clear four-step operational narrative.
- Strengthen baseline-versus-detour comparison.
- Preserve historical dates, NOTAM/advisory distinctions, and existing citations.
- Use red only for actual risk/restriction semantics, not decorative emphasis.

SLIDE 4 — TWO CONFLICTS, GLOBAL CONSEQUENCES:
- Improve the case-study selector with visible and programmatic selected state.
- Make event dates, source retrieval dates, and historical qualifications easy to distinguish.
- Preserve operator-specific and historical nuances.
- Verify every case button changes the correct content and is keyboard accessible.

SLIDE 5 — THE FLIGHT REROUTING CHALLENGE:
- Make distance, route, and detour comparisons immediately understandable.
- Preserve all three validated routes, route calculations, and synchronization with the globe.
- Clearly label units, assumptions, and route types.
- Use consistent line styles and readable legends; do not depend on color alone.

SLIDE 6 — EXPLORE THE 3D GLOBE:
- Give the globe more useful visual space; reduce crowded control panels.
- Preserve working 3D camera rotation, zoom +/-, Reset Camera, drag interactions, keyboard support, and 2D fallback.
- Preserve accurate airport labels, route visibility, legends, and interaction feedback.
- Controls must have clear enabled/disabled states and accessible explanations in 2D mode or when WebGL is unavailable.
- Do not replace the functional globe with a static illustration.
- Test actual pointer clicks, camera state changes, fallback states, and context-loss behavior.

SLIDE 7 — THE HIDDEN COST OF A DETOUR:
- Improve input/result hierarchy and slider target sizes.
- Clearly label fuel, time, distance, operating cost, annualized assumptions, and model limitations where present.
- Preserve existing formulas, units, rounding rules, and direct-CO2 limitations.
- Independently verify calculations against known expected numerical results, not only against the same implementation engine.

SLIDE 8 — AIRLINES UNDER PRESSURE:
- Create a balanced four-card executive briefing.
- Distinguish operational, financial, passenger, and safety/legal consequences according to existing content.
- Preserve managerial interpretations, safety prerequisites, and regulatory caveats.
- Keep text concise but academically meaningful.

SLIDE 9 — YOU ARE THE AIRLINE MANAGER:
- Redesign as an elegant decision exercise, not a cluttered dashboard.
- Improve option selection, result feedback, comparison details, and readability.
- Make clear that invented scores are illustrative, not real airline metrics.
- Preserve all 48 existing simulator combinations and verify each.
- Support mouse, touch, and keyboard operation.

SLIDE 10 — THE FUTURE OF AVIATION RESILIENCE:
- Strong concluding message and three clear recommendations.
- Preserve citations, source register, limitations, credits, and Return to Start behavior.
- Ensure sources are genuinely traceable and readable, without inventing new references.
- Finish with the same restrained cinematic visual identity as Slide 1.

GLOBAL UX AND ACCESSIBILITY:
- Maintain exactly 10 slides and clear presentation navigation.
- Fix the documented Ctrl+0 issue so it does not incorrectly navigate to Slide 10.
- Check navigation dots, buttons, sliders, tabs/selectors, tooltips, and focus order.
- Ensure keyboard operability, visible focus, accessible names, state semantics, and no keyboard traps.
- Support reduced motion, adequate color contrast, and non-color indicators.
- Avoid horizontal overflow, clipped headings, overlapping content, tiny citations, and unreadable footnotes.
- Treat 1366x768 projector display as a critical target and also validate additional desktop/mobile sizes.
- Prefer readable text over ornamental density. If necessary, restructure a slide's internal layout without changing its meaning or slide count.
- Keep the presentation functional without network access after required local assets are available.

ARCHITECTURE AND MAINTAINABILITY:
- Consolidate or rationalize the scattered inline CSS, existing stylesheets, and JS-embedded colors carefully.
- Use consistent design tokens and component classes without breaking functionality.
- Keep changes scoped, maintainable, and explainable.
- Preserve existing asset integrity and data provenance.
- Avoid adding large dependencies for purely visual effects.
- Optimize imagery and animation performance.
- Ensure graceful fallback if advanced visual effects cannot run.

VERIFICATION — REQUIRED AFTER IMPLEMENTATION:
A. Run all existing Python/model tests and record actual counts and results.
B. Run the complete browser regression suite, not merely historical Version 3 tests.
C. Test all 10 slides and all navigation methods.
D. Test all 48 simulator combinations and independently check expected outcomes.
E. Test all three route scenarios, calculations, synchronization, and displayed units.
F. Test globe Reset Camera, zoom +/-, drag, route selection, 2D fallback, missing Three.js, missing WebGL, and context-loss behavior as applicable.
G. Test case-study selection semantics, keyboard navigation, Ctrl+0, focus visibility, and reduced motion.
H. Run the planned 30 projector-layout checks across three resolutions and check no clipping or overflow.
I. Check browser console errors, uncaught exceptions, missing assets, and network dependencies.
J. Review accessibility and text contrast; use automated checks where possible and report manual limitations.
K. Verify the first slide visually against the user-selected reference and report any meaningful differences.
L. Check every source link, disclosure, limitation, and illustrative label for accuracy.
M. Preserve previous baseline evidence while distinguishing newly executed tests from historical results.
N. Do not claim physical GPU, projector, screen-reader, or cross-browser validation unless actually performed.

DOCUMENTATION — NON-NEGOTIABLE:
- Maintain prompts/codex-development-v4.md as the comprehensive development log.
- Record THIS EXACT PROMPT verbatim, including the explicit reversal of the previous gold design decision.
- Preserve all prior Version 4 prompts and the audit; append changes instead of rewriting history.
- Record every implementation phase, design decision, changed file, asset provenance, commands, tests, failures, fixes, reruns, and unresolved limitations.
- Update README.md, PRD.md, and other relevant documentation so final descriptions match the actual implemented presentation, while preserving historical planning context where appropriate.
- Document AI assistance transparently, including generated visual assets and their illustrative nature.
- Never fabricate tests, citations, approvals, or results.
- Ensure Git history and documentation clearly show progression from Versions 1 through 4.

FINAL DELIVERY BEFORE RELEASE:
1. Complete the visual and functional implementation on the local version-4 branch.
2. Produce an actual slide-by-slide preview or screenshots of all 10 slides.
3. Provide a concise comparison against Version 3 and the approved visual reference.
4. Report test results with exact counts, commands, failures, fixes, and limitations.
5. List changed files and any remaining issues.
6. Explain how the user can preview the presentation locally.
7. STOP and wait for explicit user approval before any commit, tag, push, or final publication.

QUALITY BAR:
Think like a demanding independent AI reviewer evaluating correctness, visual coherence, academic integrity, source transparency, reproducibility, usability, accessibility, and Git/documentation discipline. Small details matter. Favor verified quality over exaggerated claims or superficial visual effects.

Proceed with implementation and testing now, while preserving all prior releases.
```

### Phase 2 — authorization, safety and design reversal

Codex verified branch version-4, HEAD and peeled v3.0 ef15a06038502f249bd702255401e1f09dc738ee, with only the Phase 1 log untracked. The previous audit and gold proposal above are historical; this directive supersedes the gold design. No release operations are authorized. No actual reference bitmap was available among project assets; composition follows the user’s written description, not a pixel comparison. The imagegen skill was read and its built-in tool used to generate a text-free hero illustration; no downloaded third-party asset or dependency was introduced.

### Phase 3 — cinematic shell and preserved interactions (implementation)

Changed index.html, assets/v2.js, new assets/v4.css, new assets/hero-v4.jpg and hero-v4-provenance.json. The active enhancement stylesheet consolidates the accessibility/cartography foundation and established V3 responsive layout; original v2.css/v3.css remain unchanged as historical release files. V4 tokens supersede warm UI colors. CSS route tokens are consumed by the existing JS renderer for identical 3D/2D/legend styling. Retained the shared runtime filename to avoid unnecessary restructuring.

Slide 1 now uses text-free generated artwork behind real serif HTML text, the exact requested subtitle and a native Start Presentation button. Existing generated hero figures remain labelled illustrative. The background generation used the built-in imagegen tool after reading the imagegen skill; exact generation prompt is recorded in assets/hero-v4-provenance.json. Original generated PNG was inspected and converted with installed System.Drawing JPEG encoder at quality 88, same 1672×941 dimensions, producing 197,684 bytes. No external asset URL or new library was used. City lights/paths are artistic scene lighting; no UI gold is intended. Original bitmap remains outside the project in the tool’s generated-image directory.

Case selection uses native toggle buttons with aria-pressed/aria-controls and hidden inactive panels. Ctrl/Meta/Alt, composing input and editable content are excluded from presentation shortcuts; globe shortcuts also respect modifiers. Navigation dots use larger transparent targets; sliders have larger native interactive areas; strategy cards retain keyboard operation and gain non-color selected markers. Pause also stops the moving route illustration. Formulas, data files, scientific constants, source URLs and slide order remain unchanged.

### Phase 4 — regression expansion and initial failures

Changed tests/browser.mjs, tests/model_checks.py and .gitignore. New browser evidence is written only under artifacts/v4, preserving committed V3 reports/screenshots. Browser discovery supports BROWSER_PATH and common installed platform paths. Added independent spherical-law-of-cosines route-hour expectations and independent scalar cost/score expectations for all 48 simulator combinations, case/button state, modified shortcuts, native touch/keyboard input, focus/targets/token contrast, hero content and expanded disclosures. Console and failed network requests are collected with test phase labels; deliberately blocked resources and WebGL faults must be distinguished from normal-mode failures.

Executed py -B scripts/validate_airports.py: all six reference distances passed unchanged. Executed py -B -m unittest discover -s tests -p '*checks.py': 9 tests passed, including V1/V2/V3 history and validated baseline-file integrity. node --check assets/v2.js and extracted inline JavaScript checks passed; ten sections confirmed. These are actual executions, not inherited V3 results.

First full browser attempt passed the initial 12 groups including all simulator combinations, then failed the added native Start-button hit test after leaving the globe. A first visibility/pointer-isolation adjustment did not resolve the failure on rerun; further hit-test diagnostics were added rather than claiming success. Results below will record the confirmed cause and final reruns. No test assertion was weakened to ignore an intercepted button.

### Confirmed transition cause, test-event fix and layout revisions

Hit-test diagnostics showed Start was enabled and its section was active/non-inert, but the button's computed visibility was hidden; elementsFromPoint returned its parent copy container. Legacy transition:all on descendants animated inherited visibility after slide changes. Inactive-slide pointer isolation alone was insufficient. Scoped descendant transitions now include only background/border/text colors, and inactive slides are hidden/non-interactive immediately. Native Start and case pointer clicks passed the following run. Native Enter testing also required CDP's carriage-return text field to emit the browser's normal Enter keypress; adding key-up alone did not suffice. The application retains native button behavior, with no custom synthetic click replacing it.

The next complete run reached all native camera assertions (all three routes: distance 38 → 32.3 with + → 37.145 with − → 38 on Reset; rotated-position reset error 0), then found five default projector overflows: slides 6/7/9 at 1280×720, slide 6 at 1366×768 and slide 6 at 1920×1080. Assertions were retained. Compact card spacing, shorter equivalent cost subtitle, feedback line-height and globe allocation were revised; no formula or data change. Source-only emoji cost markers were replaced with neutral numbered labels. Slide 2 gained small native SVG schematic diagrams, which do not purport to show real FIR/border geometry. Hero background anchoring was adjusted to retain the upper-right aircraft.

### External source checks (separate from offline regression)

Codex opened the existing six external source-register URLs using the web tool: ICAO Chicago Convention PDF, Finnair advisory, EASA 14 April 2024 notice, ICAO CORSIA FAQ, Natural Earth terms, and GitHub airport-codes. All returned readable content; Natural Earth first returned an error and succeeded on retry. Relevant content was inspected for operator-specific bypass, dated NOTAM expiry, 3.16 fuel conversion and public-domain geography. Existing facts/source URLs were retained; Finnair's mutable page is still labelled with the original retrieval date, not silently re-dated.

Additional existing reference links opened successfully: Natural Earth v5.1.2 repository, Three.js r128 repository, NATS Heathrow chart, JMA Haneda publication, Fraport airport-venue location, CAAS Changi historical AIP, Fintraffic Helsinki historical AIP and Israel LLBG example AIP. The historical Korean RKSI AIP URL timed out twice through the web tool, so current remote availability/content could not be reconfirmed. The FAA JFK example PDF was rejected by the reader because it is approximately 39.5MB, not reported as a broken URL. Neither example changes the six-airport dataset. These are honest source-access limitations; no reference coordinates or validated source files were changed to conceal them. No new assets were fetched from these sources.

### Phase 5 — final responsive fixes and complete rerun

A subsequent run reduced the five projector overflows to two small 720p overflows (slide 6 +4px, slide 7 +8px). The globe was then arranged in a desktop CSS control rail beside the actual canvas, with a larger useful Earth drawing area and full-width legend; responsive mobile ordering remains intact. Calculator padding was tightened without reducing native input targets or changing scientific inputs. All 30 projector cases passed the following run. That run then exposed mobile slide 5 horizontal overflow: the long native route selector could not shrink within its flex row. The consolidated stylesheet had omitted the old mobile selector/footer exceptions. An explicit route-selection component now stacks on small screens, constrains the select to the slide, hides the nonessential keyboard hint and uses two footer rows with larger navigation-dot targets. Brand chrome also simplifies on mobile. A labelled strategy-choice group replaces an unassociated label. No validation assertion or viewport was removed.

Final complete command `node tests/browser.mjs` exited 0: **29/29 browser groups passed**. This includes **all 48 simulator combinations with independent expected expenses and explicit reliability/retention fixtures**, all three routes and synchronization, native Start/case/touch/keyboard/range interactions, Ctrl/Meta/Alt shortcut guards, modal focus/native button behavior, actual camera pointer clicks and pose checks, 2D mode, missing OrbitControls/Three.js/model, WebGL initialization failure and actual context loss, direct-file preview, no external runtime requests, desktop/mobile widths, reduced motion and expanded disclosure reflow (1366×768, 390×844 and 683×384). The latter is viewport-based reflow coverage, not a claim of a separately executed browser zoom command.

**30/30 default projector-layout cases passed**: ten slides at each of 1280×720, 1366×768 and 1920×1080, no measured horizontal overflow or default vertical scrolling beyond the existing 2px tolerance. Expanded disclosures and mobile slides intentionally permit reachable vertical scrolling. Ten actual 1366×768 screenshots were generated and visually inspected. A local static screenshot gallery, artifacts/v4/preview.html, links each full-size capture and the actual interactive deck. Screenshots show test-run selections (e.g. HEL–ICN and paused rotation), not all combinations or an operational flight state.

The final report contains zero uncaught JavaScript exceptions. Normal-mode console/network checks passed with no unexpected warnings/errors or missing assets. The report intentionally retains **one console error** from the deliberately denied WebGL-context test and **two inspector-blocked resource requests** from missing OrbitControls/model tests. These are fault-injection evidence, not concealed as a zero-console report. Shared solid-token contrast ratios passed: pearl/navy 17.48:1, pearl/panel 15.50:1, secondary/navy 11.16:1, secondary/panel 9.90:1, cyan/navy 10.49:1, cyan/panel 9.30:1; navy text on cyan also passed. Focus outline and ≥24px navigation-dot target boxes were checked. This is not a full automated WCAG audit of all composited pixels.

Final independent checks executed again:

- `py -B scripts/validate_airports.py`: all six airports passed, unchanged distances listed in Phase 1.
- `py -B -m unittest discover -s tests -p '*checks.py'`: **9/9 passed**, final run 1.744 seconds. Covers seven original tests plus V3 protected tag/files and independent known cost/annual/CO2 references. The asset-preservation test also includes the local MIT license bytes.
- `node --check assets/v2.js`, `node --check tests/browser.mjs`, and read-only extracted inline scripts through `node --check -`: passed.
- Four manifest SHA-256 hashes matched. Exact slide IDs/order remain slide-0 through slide-9.
- A separate comparison confirmed all previously tracked V3 artifacts are byte-identical; the six original external presentation source URLs are unchanged.
- `git diff --check`: no whitespace errors; Git emitted only its configured LF-to-CRLF notice for SOURCES.md. A filename-only private-key/GitHub-token/AWS-key pattern scan returned no matches (rg exit 1 means no match, not a test failure). This is a bounded scan, not a guarantee against every possible secret format.

### Phase 6 — documentation, provenance and manual-review handoff

README.md now describes the V4 candidate, retained release lineage, preview/test instructions, browser executable override, local runtime, generated-image provenance and limitations. PRD.md preserves the entire historical draft and appends a ten-slide as-built mapping rather than inventing instructor criteria. SOURCES.md preserves its original source/model audit and appends visual provenance and evidence-status distinctions. This log preserves the initial audit, cancelled gold plan and both original V4 prompts, including the explicit reversal. The exact generated-image prompt is in assets/hero-v4-provenance.json, alongside its SHA-256 ee090fe797975357c1f3779ff2de6d317f35627e0a72766f9f956a3031869bf9.

Changed tracked files: .gitignore; index.html; assets/v2.js; tests/browser.mjs; tests/model_checks.py; README.md; PRD.md; SOURCES.md. New intended files: assets/v4.css; assets/hero-v4.jpg; assets/hero-v4-provenance.json; prompts/codex-development-v4.md; artifacts/v4/browser-results.json; artifacts/v4/preview.html; artifacts/v4/v4-slide-01-projector.png through v4-slide-10-projector.png. No analysis.py, validated data, vendored dependency, existing release documentation or previous evidence was modified. No package installation or asset downloader was run. Ignored transient browser diagnostics/profile are not intended release files.

Visual comparison: V3's sans-serif/neon-blue/amber component treatment is replaced with editorial white serif headings, navy/blue-gray surfaces, restrained cyan interaction and pearl/ice-blue route line styles. Slide 1 now has a generated cinematic Earth/aircraft background while all essential text and control remain HTML. Compared with the written reference, it retains Europe/Africa/Middle East on the right, atmospheric clouds, warm city lights/paths, large upper-right jet, small upper-left plane/path, white headline and cyan subtitle rule/button. The exact original image was unavailable, so no pixel-level fidelity is claimed. Title is broken over two lines; model/evidence caption and persistent navigation intentionally remain for academic transparency. Hero artwork is not a verified geography layer. Slides 2–10 retain their actual academic content, sources and interactions, with briefing diagrams, consistent comparison styles, larger control targets, the globe rail, cost composition and clearer simulator feedback.

The existing http://127.0.0.1:8000/ preview was reused after an HTTP check confirmed it serves the V4 stylesheet/project. No additional server or branch was created. Review the interactive presentation there and all ten captures at http://127.0.0.1:8000/artifacts/v4/preview.html. If the server later stops, run `py -m http.server 8000 --bind 127.0.0.1` from the project directory.

Remaining limitations: manual approval is pending. No physical projector, hardware-GPU benchmark, screen reader, real touch device or cross-browser run was performed; touch events were emulated in installed headless Chrome with software WebGL. Browser executable discovery is portable in code but other platforms were not executed. Solid-token contrast and screenshot inspection do not certify full WCAG compliance. The historical RKSI source timed out; the large FAA example PDF exceeded the web reader limit. Model limitations remain spherical Earth, illustrative waypoints/constant performance/cost inputs, no live restrictions/FIR geometry/safety assessment and invented simulator scores. No critical automated failure remains in the final rerun.

Final Git safety: version-4 remains at HEAD ef15a06038502f249bd702255401e1f09dc738ee with local uncommitted changes. Protected v2.0 and v3.0 objects/peeled commits match the verified releases; V1 ancestry/checksum tests pass. Nothing was staged, committed, tagged, pushed or published. Stop here for user manual preview and explicit release approval.

### Final navigation coverage review

Before handoff, Codex identified that the complete passing browser run exercised some navigation methods indirectly. Only tests/browser.mjs was strengthened: all number keys 1–9 (in addition to 0), Space on the slide background, native pointer Return to Start, and actual F-key enter/exit fullscreen are now asserted within the existing groups. This does not add or alter presentation behavior, source data or group counts. node --check tests/browser.mjs passed. A further complete node tests/browser.mjs run was started to execute these additional assertions; its actual result is appended below. This targeted test expansion closes a stated user requirement rather than merely repeating an unchanged suite.

Final navigation-strengthened rerun completed with exit 0: **29/29 browser groups, all 48 simulator combinations and all 30 projector layouts passed again**. Actual F-key fullscreen, all numeric shortcuts, background Space and native Return to Start passed. Final report still has zero uncaught exceptions and only the deliberately injected WebGL console error/two blocked requests. Ten screenshots were refreshed; their names/gallery links remain stable. No presentation code changed after the prior passing run. Final state remains uncommitted on version-4, with no staged files or release operations. Await manual review.

## Original pre-release audit prompt — 9 November 2026

```text
FINAL VERSION 4 PRE-RELEASE AUDIT — DO NOT PUBLISH YET

An independent review of the exported project ZIP found:
- All 10 slide sections and 10 projector screenshots exist.
- The attached browser-results.json reports 29 passing browser groups, 48 simulator combinations and 30 layout checks.
- JavaScript syntax checks pass.
- The Version 4 prompt log, README, PRD, SOURCES and hero image provenance exist.
- Running Python unittest on an extracted ZIP outside Git produced 5 passes, 1 floating-point reproducibility comparison failure, and 3 Git-history errors because .git was absent.

Please perform the following on the ORIGINAL local version-4 Git working tree:

1. Verify branch, clean release ancestry, v1/v2/v3 history, and that v3.0 remains unchanged.
2. Run all 9 Python tests in the original environment and investigate the exact floating-point discrepancy. Determine whether this is platform-dependent rounding. Do not change validated data or formulas to conceal the issue. If a tolerance-based comparison is scientifically appropriate, document and test it carefully.
3. Rerun all browser tests and all 48 simulator combinations, 30 projector layouts, globe controls, 2D fallback, keyboard interactions and source disclosure.
4. Check all 10 slides visually for projector text readability, small citations, clipping and contrast.
5. Confirm every local asset required by the presentation is tracked or will be included in the release.
6. Review source links, citation traceability, historical dates, illustrative claims, and model limitations. Explicitly identify links not independently verified.
7. Check that README, PRD, SOURCES and prompts/codex-development-v4.md match the actual final state and contain the exact AI prompts and fixes.
8. Check .gitignore and staged-file candidates for privacy, browser profiles, caches, backups, temporary files and accidental personal data.
9. Provide a precise PASS/FAIL release checklist, test commands and results, remaining limitations and the exact files proposed for Git commit.
10. Append this exact prompt and all findings/fixes to prompts/codex-development-v4.md.

Do not commit, tag, push, or publish until I explicitly approve the final release. Do not start Version 5 or redesign the slides.
```

### Pre-release audit: initial findings

Codex verified version-4 at unchanged HEAD/v3.0 commit ef15a06038502f249bd702255401e1f09dc738ee. Working tree contains the intended uncommitted V4 files; it is not clean, and no clean-tree claim is made. Annotated v2.0/v3.0 objects match prior records. Ran the original nine Python tests before any test changes: 9/9 passed (1.501 seconds). Python 3.13.2, MSC v.1942, Windows 11 AMD64. A recursive exact comparison of generate() and data/scenarios.json found zero differing values locally. Only this Python interpreter was listed by py -0p. No exported ZIP or independent traceback was available in the project. Asked for the exact reviewer assertion diff and Python/OS details; platform rounding is a plausible hypothesis, not a confirmed diagnosis of unseen output. Git-history tests inherently require .git and full history/tags; a source ZIP cannot establish release ancestry.

### Pre-release investigation, fixes and results (Codex)

The original strict tests passed unchanged. A controlled sequential-sum experiment reproduced last-bit differences in all three detour sums, with downstream differences of 2–10 ULP in some derived values. Official Python 3.13 documentation confirms float summation changed in Python 3.12; platform math functions can also vary. This is a demonstrated portability mechanism, not a definitive match to the unprovided reviewer traceback. The original local environment still has zero generated/stored differences. No second interpreter/platform was installed or run.

Changed only tests/model_checks.py for the numeric fix: derived-only absolute budgets (rel_tol=0), exact non-derived input/schema checks, three new regression tests, and separate ModelChecks/GitHistoryChecks classes. Default discovery runs all twelve and skips none. The explicit ModelChecks command runs nine model tests without pretending to verify history in a ZIP. Rejection coverage includes 24 excessive derived-field changes, NaN/infinities/string/bool values, changed assumptions/coordinates/waypoint names and missing route/field structure. Last-bit and controlled sequential-sum acceptance and unchanged displayed rounding are tested. analysis.py and every validated source/data file remain unchanged and protected by Git-baseline tests.

Original command: py -B -m unittest discover -s tests -p '*checks.py' -v → 9/9 in 1.501s. Hardened final command → 12/12 in 1.263s. py -B tests/model_checks.py ModelChecks -v → 9/9 in 0.035s. The final model-only test revision was copied with its minimal existing model inputs into a verified operating-system temporary directory without .git and passed nine tests again; only that temporary copy was cleaned up. This was not the user's original exported ZIP or another OS. py -B scripts/validate_airports.py → all six unchanged location checks pass. Both node --check commands and read-only inline JS checks passed. node tests/browser.mjs → fresh 29/29, 48 simulator combinations, 30 layouts, zero uncaught exceptions; deliberately denied WebGL and two inspector-blocked resources remain visible in the report. No browser/runtime code was changed during this audit.

Reviewed all ten fresh screenshots and ran a temporary read-only CDP font-size audit using the existing transport. Source notes generally measure 16–17px at 1366×768, body 17px; globe control labels are 14px, country labels 15px, hero artwork caption 15px, case buttons 15.64px and several categories/evidence badges 14.45px. These small-label limitations are recorded, not hidden by the passing body-font/layout assertions. No redesign or CSS change was made. The temporary audit script was removed after verifying its path stayed in the temporary directory; the browser/server were closed. Physical projector, screen-reader, hardware GPU and cross-browser testing remain unperformed.

Every HTML/CSS local reference was enumerated: all files exist and none are ignored. Four manifest hashes and the hero hash matched. Direct git ls-remote reconfirmed remote main, annotated v2.0/v3.0 objects and peeled release commits. The original V1 checksum/ancestry and V2/V3 protected files pass tests. Previous tracked artifacts remain byte-identical. No staged files. A bounded candidate scan found no actual credentials, email addresses or personal workstation paths; a broad /home/ pattern matched the documented Home keyboard shortcut, a false positive. Ignored profile/cache/backup/failure diagnostics remain excluded.

README, PRD and SOURCES gained appendices explaining current twelve-test count, explicit nine-test ZIP subset, exact versus tolerant contracts and source/readability limits. Historical prompts/results were preserved. .gitignore gained only the audit-report evidence exception for artifacts/v4/pre-release-audit.md. The audit checklist below records every source status and all 25 proposed commit files; it was verified against the actual tracked-diff plus untracked/non-ignored list. No blanket staging or release operation occurred.

### Pre-release report and exact candidate list (recorded at audit close)

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


## Exact release-readiness prompt — 9 November 2026

```text
FINAL VERSION 4 RELEASE READINESS — MINIMAL CHANGES ONLY

We are preparing the final academic submission. Do not redesign or start Version 5.

1. Review prompts/codex-development-v4.md and the existing ChatGPT conversation documentation. Ensure the actual managerial decision-making across V1–V4 is accurately documented:
- V1: initial concept and scope.
- V2: interactive globe, routes, quantitative analysis and simulator.
- V3: usability, projector readability, discovery and correction of non-responsive globe controls.
- V4: user-led selection of the cinematic aviation hero design, rejection of unsuitable alternatives, luxury blue/cyan visual identity without decorative gold, and independent pre-release audit.
Distinguish verified prompt transcripts from summaries. Do not invent exact historical prompts or claim undocumented decisions are verbatim.

2. Investigate the unresolved independent ZIP floating-point test discrepancy. Run the model tests in a clean extracted source-only environment and report exact Python version, OS, commands, expected and actual values, and tolerance behavior. If the original external failure cannot be reproduced, state that clearly; do not claim it was fully reconciled.

3. Verify that README.md prominently explains the four-version development journey, includes working screenshot links, describes Python's real contribution, documents how to run the presentation, and links to PRD, SOURCES and prompt logs.

4. Verify all 10 slides and essential assets remain intact. Rerun affected tests after any changes. Preserve all original datasets, formulas, citations, prior tags and history.

5. Inspect the exact proposed commit contents for privacy: exclude browser profiles, caches, backups, temporary files and personal information.

6. Update the V4 development log with this exact prompt, the actual actions, evidence, fixes, remaining limitations and release readiness.

7. Provide a final concise PASS/FAIL report, listing any blockers and exact proposed commit files.

STOP BEFORE git add, commit, tag or push. Wait for explicit approval. Do not start another redesign.
```

### Evidence-led managerial history review (summary, not a reconstructed transcript)

Codex reviewed 01-chatgpt-conversation.md, 01-planning.md, the original Antigravity log, codex-stage-record.md, codex-development-v3.md and this V4 log. The original records are preserved. The November 5 ChatGPT file contains one original Hebrew user prompt selecting the interactive 3D globe plus decision simulator and requesting an English PRD; its AI-response paragraph is a summary, not a full assistant transcript. 01-planning.md explicitly identifies itself as a summary. Fenced original-user-prompt sections in the later stage logs are the recorded transcripts; surrounding actions/findings are development summaries. No missing prompt or retrospective decision below is presented as verbatim. This audit can establish what those records contain, not independently authenticate an unavailable complete ChatGPT export.

- **V1 — concept and scope:** the user selected the combined globe/decision exercise; planning set an English presentation of about ten slides with historical and hypothetical material. Antigravity recorded initial implementation; Python calculations were planned but the later V2 audit found missing reproducible Python analysis and hardcoded values. V1 already had interactive elements; V2 did not invent their concept.
- **V2 — technical and evidential maturation:** the user required preserving the ten slides/interactions while improving geography and data reliability. Codex replaced inaccurate/procedural geography and unsupported figures with sourced local geometry, checked airport inputs, reproducible Python routes/cost/CO2 and a meaningful scenario-dependent simulator. Approval gates for downloads, original backups, coordinate order and publication are documented. Claims are based on the recorded requests/actions, not invented dialogue.
- **V3 — usability and feedback:** the user prioritized projection, keyboard access, globe/map legends, cost composition and simulator feedback. The reported non-responsive Reset/+/− controls triggered actual pointer/camera measurements, availability/fallback checks and a targeted reset/damping/control-state repair. The V3 log distinguishes that issue from test-transition timing; V4 later found a separate inherited-visibility transition problem. Manual confirmation of repaired controls is reported in the user’s release context, not independently fabricated as an agent-observed physical test.
- **V4 — user-led visual judgment and independent scrutiny:** the first audit proposed navy/gold. The subsequent exact user directive explicitly cancelled gold, referred to a selected cinematic Earth/aircraft reference and rejected gold-heavy alternatives, and required blue/cyan luxury styling. That directive is the evidence for the decision; the original reference bitmap and a complete earlier image-selection conversation were not available locally. Do not invent names/images/prompts for other unsuitable alternatives or claim that the image-selection conversation itself was captured verbatim. Codex followed the supplied reference description and logged generated-artwork provenance. The independent ZIP review then led to the original-environment rerun, narrow numeric-test hardening, explicit ZIP-vs-Git validation instructions and documented unresolved external diagnostics.

Managerial responsibility remains visible: the user chose scope/design, reported defects, challenged assumptions and controlled release approval; AI implemented and tested within those constraints. This is a historical synthesis of the retained evidence, not a claim of undocumented instructor requirements or decisions.

### Fresh source-ZIP extraction and exact numerical evidence

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

## Exact final V4 publication approval

```text
I explicitly approve the final Version 4 publication.

Please:

1. Stage only the exact 25 files that passed the final safety review.
2. Create a commit named "Version 4 - Final University Submission".
3. Preserve the full V1, V2 and V3 history.
4. Publish the approved V4 commit to origin/main using a normal, non-force push.
5. Do not overwrite remote changes, rewrite history, or delete branches.
6. Verify that GitHub main now contains the final V4 files.
7. Confirm the final commit hash, public repository URL, and clean Git status.

If any unexpected conflict or error occurs, stop and ask for approval.

Respond in English only.
```

### Authorized release preflight — executed before commit

AI tool: Codex. Verified version-4 at ef15a06038502f249bd702255401e1f09dc738ee, an empty Git index and the exact 25-file approved candidate list matching all tracked changes and non-ignored untracked files. Verified V1 ancestry and immutable v2.0/v3.0 tag objects/targets. Direct git ls-remote showed origin/main still at ef15a06038502f249bd702255401e1f09dc738ee, with unchanged V2/V3 tags. Origin is https://github.com/katznoa22-hash/how-wars-change-the-skies.git; the preceding safety audit confirmed public visibility and main as default branch. No unexpected conflict or remote movement was found.

This record is written before staging/committing. Next authorized actions are: stage only the reviewed 25 paths (including this log), verify exact staged names and whitespace, create one commit titled Version 4 - Final University Submission, recheck remote main, perform a normal non-force branch-only push to origin/main with automatic tag following disabled, then verify the remote commit/tree and clean local status. No new tag, history rewrite or branch deletion is requested. Actual commit identity and post-push results will be reported from Git/GitHub after execution, not fabricated in this pre-commit record. Prior test results and unresolved external floating-point/source-access/manual-review limitations remain preserved above. No design, functionality, formula or dataset change is part of publication.

## Post-publication documentation finalization

Date: 9 November 2026. AI tool: Codex. This appendix is a retrospective closeout plus the newly authorized documentation work, not a claim that post-push results were recorded before the release. Specific user prompts below are copied from the conversation available in this session; they are not a complete platform export or a reconstruction of missing dialogue. Original prompt blocks and prior entries above remain unchanged. Only the current-status front matter was corrected; its superseded wording is preserved here as historical status, not a user prompt:

> **Current status:** Local Version 4 release candidate on version-4, awaiting explicit approval before staging/commit/tag/push. Implementation and audits are recorded chronologically below. The independent external floating-point failure remains unconfirmed; native and fresh ZIP-extraction model checks pass. This status does not supersede preserved historical prompts or claim publication.

### Recorded user approval for the read-only publication investigation

```text
Yes, I approve a read-only investigation of the post-publication file-tree verification discrepancy.

Please:
1. Identify the exact assertion that failed and explain why.
2. Compare the local Version 4 commit and file tree against GitHub's main branch.
3. Verify that all 25 approved changes were published correctly.
4. Confirm that the README, PRD, Python files, Three.js assets, screenshots, and prompt documentation are available.
5. Confirm that the repository remains public and that V1–V3 history is preserved.
6. Report whether the discrepancy is a verification-script issue or an actual publication problem.

Do not modify any files, create commits, push, or change Git history.

Respond in English only, with a clear PASS/FAIL summary.
```

### Retrospective publication closeout — verified evidence

Version 4 was committed as 4e73a2a528395aa939251579dfd51ca6e8089a86 (Version 4 - Final University Submission) and successfully published through a normal non-force branch-only update to origin/main. Its parent is the V3 release ef15a06038502f249bd702255401e1f09dc738ee. V1/V2 remain ancestors; annotated v2.0/v3.0 objects and targets are unchanged. No V4 tag was created. The publication approval/preflight above was written before the commit; this later closeout supplies the actual outcome.

The original verification assertion compared the top-level sha from a tree response requested through main with git rev-parse HEAD^{tree}. In the observed ref-based response, that top-level value was commit SHA 4e73a2a528395aa939251579dfd51ca6e8089a86, whereas the actual tree SHA is b55274ba1efbba6658d9bd57e087b65b6136d9c1. The initial assertion failure was not proof of a publication problem and was not established to be a cache issue. After user-approved read-only investigation, the corrected method read commit.tree.sha, queried that exact tree SHA, checked non-truncation and compared complete path/mode/blob-SHA maps. All 64 release files matched, with no extra, missing or differing files; exactly the approved 25 paths changed relative to V3. Required README/PRD/Python/Three.js/screenshots/prompts were explicitly present. GitHub main and public visibility were confirmed. See the [publication evidence index](ai-development-audit.md#publication-closeout).

Those Git/API facts were independently rechecked before editing this documentation follow-up on 9 November 2026: main still pointed to the release, the public GitHub tree matched local Git for all 64 files, ancestry/tags matched and the initial working tree/index were clean. The 64-file/25-change counts describe the immutable application release, not the later documentation working tree. This verified publication issue is resolved; the separate external floating-point report remains unconfirmed and was not declared fixed.

### Exact documentation-finalization directive

```text
Thank you for the strict evidence-based assessment.

I approve a narrowly scoped, documentation-only finalization of Version 4, with the goal of maximizing university evaluation quality, accuracy, transparency, and traceability.

Please implement the following improvements:

**1. Correct outdated publication-status statements**

- Update current-status wording in README.md, PRD.md, and relevant V4 documentation.
- Clearly state that Version 4 was successfully published to GitHub main.
- Preserve historical pre-release statements as historical records, without rewriting their original meaning.
- Use the verified release commit: `4e73a2a528395aa939251579dfd51ca6e8089a86`.

**2. Add a verified post-publication closeout**

- Document the successful publication, final commit, branch, and verification results.
- Explain the original GitHub tree-verification assertion failure and its corrected verification.
- Clearly distinguish the verification-script issue from an actual publication failure.
- Record that all 64 repository files matched by path, mode, and blob hash, and that exactly 25 approved files were included in the V4 release.
- Preserve the V1–V3 history and V2/V3 tags.

**3. Improve AI-development documentation**

- Create a concise, professional evidence index covering the documented development stages.
- Link major prompts, implementation decisions, corrections, testing evidence, and results to their existing source records.
- Clearly distinguish original prompts, recorded responses, summaries, and retrospective analysis.
- Never invent missing conversations, assistant responses, dates, decisions, or evidence.
- Identify missing original records transparently.

**4. Strengthen evidence of student decision-making**

- Connect important design decisions to actual recorded prompts and implementation evidence.
- Highlight scope control, numerical validation, visual-design decisions, testing, and iterative improvement.
- Avoid unsupported claims about personal contributions or motivations.

**5. Improve evaluator-facing readability**

- Make the README easy to navigate for a university evaluator.
- Provide concise links to the presentation, Python analysis, tests, screenshots, and AI-development evidence.
- Embed existing screenshots only if they materially improve clarity.
- Preserve the distinction between historical tests and current verification.

**6. Preserve scientific accuracy**

- Keep existing numerical limitations and unresolved external floating-point observations accurately described.
- Do not claim that unresolved issues were conclusively fixed.
- Do not add live Python execution, a backend, or unnecessary new functionality.

**Strict safety constraints**

- Do not modify application functionality, formulas, datasets, JavaScript, Python, tests, or screenshots.
- Do not rewrite Git history, amend the published V4 commit, reset branches, delete tags, or force-push.
- Preserve all original historical prompt records.
- Make only justified documentation changes.
- Before editing, show the exact proposed file list and a concise change plan.
- After editing, run appropriate documentation and Git integrity checks.
- Present a final diff summary and verification results.
- Do not commit or push anything until I explicitly approve the final changes.

Please begin with the proposed file list and change plan, then wait for approval.

Respond in English only.
```

### Proposed scope and approval boundary (action summary)

Codex proposed exactly README.md, PRD.md, prompts/codex-development-v4.md, artifacts/v4/pre-release-audit.md and new prompts/ai-development-audit.md, then waited. The proposal was a plan, not an implementation or extra release approval. Existing screenshots would be referenced only, with no image modification. Current-status corrections would be separate from preserved historical findings.

### Exact five-file scope approval

```text
I approve the proposed exact five-file documentation-only scope.

Please proceed with the improvements as planned.

Additional requirements:
- Preserve original historical prompts and conversation records without rewriting them.
- Clearly distinguish original evidence from retrospective summaries.
- Ensure all new factual claims are supported by existing records or verified Git evidence.
- Preserve the published V4 commit and all previous release history.
- Do not modify application code, tests, datasets, formulas, or screenshots.
- Validate all documentation links and references.
- After completing the edits, provide the exact changed-file list, diff summary, verification results, and any remaining limitations.

IMPORTANT: Do not commit or push yet. Stop after completing and verifying the local documentation changes, and wait for my explicit approval.

Respond in English only.
```

### Documentation edits — actual actions

- README.md now identifies published V4, adds evaluator navigation and direct analysis/test/evidence links, and embeds the existing cover and functional-globe captures to distinguish illustrative artwork from the real interactive feature. The default check block no longer includes optional data regeneration; the existing warning that analysis.py main rewrites outputs remains. Historical test counts remain labelled, not rewritten.
- PRD.md preserves its original draft and updates only current as-built release status plus an appended post-publication documentation note.
- prompts/codex-development-v4.md corrects current status and appends this exact-prompt/closeout record. Superseded status is preserved above; no original historical prompt or conversation record was edited.
- artifacts/v4/pre-release-audit.md adds a historical-record notice and a post-publication note around the entire unchanged original audit body. Its original hold findings and 25-file candidate list are preserved as historical evidence.
- New prompts/ai-development-audit.md provides a concise evidence taxonomy, stage/source map, user-decision register, Python architecture boundary, historical-validation register, verified publication closeout and explicit missing-record limitations. It is labelled retrospective analysis and does not claim complete raw conversation coverage or unsupported personal motives/authorship.

No application, stylesheet, model, data, Python/JavaScript/test, screenshot, dependency or Git reference was changed. No live Python/backend was added. Scientific/source limitations and the unresolved exact external floating-point cause are retained. Validation results will be appended only after execution.

### Documentation finalization verification

Executed on 9 November 2026 after the five-file draft:

- `py -I -B -m unittest discover -s tests -p '*checks.py' -v`: 12/12 passed in 1.279 seconds. This is a fresh read-only Python/history run, not the old nine-test result. No Python/test source changed.
- Local Markdown target and heading-anchor validation: all 103 link/image/anchor references across the five files passed. Existing cover/globe PNGs were embedded by reference only.
- HTTP HEAD validation: seven unique external URLs returned 200, including GitHub repository/commit links, the two Python documentation URLs, historical RKSI URL and FAA PDF URL. This establishes current reachability only. No new source-content verification, downloaded replacement asset or claim that historical access limitations never occurred is made; the FAA reader-size limitation and unreconfirmed historical content remain documented.
- Historical preservation checks: original PRD draft prefix unchanged; complete original pre-release audit body retained contiguously; original V4 log entries retained as a prefix except the approved current-status correction; superseded front matter archived verbatim; all original fenced prompt text retained. Other original prompt/conversation files are untouched.
- SHA-256 comparison against the clean pre-edit 64-file snapshot: exactly README.md, PRD.md, prompts/codex-development-v4.md and artifacts/v4/pre-release-audit.md changed among tracked files. All other 60 tracked files, including application/style/Python/JavaScript/test/data/screenshot/vendor and earlier prompt records, remain byte-identical. Only new prompts/ai-development-audit.md was added.
- Fresh pre-edit Git/GitHub verification: published main and local HEAD equal 4e73a2a528395aa939251579dfd51ca6e8089a86; correct root tree b55274ba1efbba6658d9bd57e087b65b6136d9c1; complete 64-file path/mode/blob-SHA maps match; original release delta is 25 paths; public visibility, V1 ancestry and V2/V3 tag identities/targets confirmed. These are release facts, not claims that this local five-file follow-up was published.
- `git diff --check`: passed with no whitespace errors. No application/browser suite, generator, migration or downloader was run for documentation-only changes; the 29-group/48-combination/30-layout browser report remains historical and byte-identical.

Remaining limitations: no complete raw conversation export or original selected reference bitmap was recovered; the index explicitly labels summaries/user reports and unavailable evidence. The external floating-point failure remains unconfirmed despite passing native/ZIP model checks; it is separate from the resolved publication verification assumption. Physical projector, hardware GPU, assistive-technology, actual touch-device and cross-browser validation remain unperformed as previously disclosed. No institutional rubric beyond available records was invented. No commit, staging, push, tag, history rewrite or release change is authorized or performed for this follow-up. Final local scope/diff and integrity checks are reported to the user for explicit approval.

## Final documentation publication approval

These original user prompts are copied from the available conversation. They authorize only the approved five-file documentation commit and normal branch-only publication; the earlier pending-approval checkpoints remain historical records.

### Exact documentation publication approval

```text
I approve the final documentation-only commit and push procedure exactly as proposed.

Please proceed under these strict conditions:

1. Confirm that local HEAD and remote main still point to the original published V4 commit `4e73a2a528395aa939251579dfd51ca6e8089a86` before making changes.
2. Stage only the five approved documentation paths.
3. Verify the staged diff and run `git diff --cached --check`.
4. Create one new documentation commit with the proposed message: `Docs - finalize Version 4 submission evidence`.
5. Push normally to `origin/main`, without force-pushing or pushing tags.
6. Verify the new remote commit, all five published documentation files, unchanged application files, preserved V1–V4 history and tags, and clean local working tree.
7. Report the final commit SHA, publication status, and any remaining limitations.

Stop immediately and ask for approval if any unexpected change, conflict, or verification failure occurs.

Do not modify application code, datasets, formulas, tests, screenshots, dependencies, or historical Git records.
```

### Exact additional safety-check request

```text
Before proceeding, please add two safety checks:

1. Verify that the exact current-status sentence being replaced occurs exactly once in `prompts/codex-development-v4.md`. Stop if it does not.
2. After the replacement, verify that exactly the five previously approved documentation paths are modified, with no staged or unrelated changes.

Then proceed with the approved documentation-only commit and normal non-force push, provided all previously agreed safety checks pass.

Do not modify application code, datasets, tests, screenshots, historical commits, or tags. Do not amend or force-push.

After publication, verify the remote commit and report its exact SHA, the five published files, and the final Git status.
```

### Guarded publication preflight — executed before staging

The previous interrupted edit had not executed: the old exact current-status text occurred once, the new text occurred zero times and no publication-approval appendix existed. Before editing, Codex confirmed local version-4 HEAD and remote main at the original V4 application commit 4e73a2a528395aa939251579dfd51ca6e8089a86, an empty index and exactly the approved five documentation paths. Annotated V2/V3 tag objects matched the protected releases. The exact old current-status occurrence count was checked again immediately before replacement and required to equal one; the replacement itself was checked to remove that active text and introduce exactly one new current-status entry. The old wording is preserved below only as historical metadata, not as a second active status or user prompt:

> **Current status:** Version 4 was successfully published to public GitHub main at 4e73a2a528395aa939251579dfd51ca6e8089a86. The local branch is version-4. This approved five-file documentation-only follow-up is being prepared locally; no further commit or push is authorized. Historical pre-release prompts/results below retain their original checkpoint meaning. The external floating-point observation remains unconfirmed.

Only the existing V4 log was edited at this checkpoint, to record authorization and these checks. Immediate post-edit assertions require the exact five approved documentation paths, no staged/unrelated changes and unchanged protected-file hashes. The 64-file application release and its original 25-path delta remain immutable; this documentation follow-up adds one evidence index and modifies four existing documentation files. No code, data, tests, screenshots, dependencies, commit history or tag was edited.

Next authorized actions are a no-tags fetch/recheck, explicit staging of only README.md, PRD.md, prompts/codex-development-v4.md, artifacts/v4/pre-release-audit.md and prompts/ai-development-audit.md, exact staged-diff/whitespace checks, one commit titled Docs - finalize Version 4 submission evidence, a final remote-main check, and a normal branch-only push with automatic tag following disabled. Unexpected movement/failure requires stopping. This pre-commit record does not predict a commit hash or claim publication/verification before execution; actual results are established by Git metadata and reported after remote verification. The prior scientific, source-content, evidence-coverage and manual-testing limitations remain disclosed.
