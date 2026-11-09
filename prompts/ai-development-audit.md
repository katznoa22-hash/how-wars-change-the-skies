# AI development evidence index — Version 4

Prepared by Codex on 9 November 2026 as a retrospective, documentation-only follow-up. This index organizes existing evidence; it is not a recovered conversation transcript or proof of undocumented authorship.

## Published baseline

The application release is [`4e73a2a528395aa939251579dfd51ca6e8089a86`](https://github.com/katznoa22-hash/how-wars-change-the-skies/commit/4e73a2a528395aa939251579dfd51ca6e8089a86), **Version 4 - Final University Submission**, published on the public repository's `main` branch. Local development remains on `version-4`. [Publication verification](#publication-closeout) distinguishes this release from the subsequent documentation follow-up.

[Run the presentation](../README.md#preview-locally) · [PRD and as-built scope](../PRD.md) · [Sources and formulas](../SOURCES.md) · [Chronological V4 record](codex-development-v4.md) · [Ten screenshots](../artifacts/v4/preview.html)

## Evidence labels

| Label | Meaning and limit |
| --- | --- |
| Recorded original prompt | User text preserved in a source log as an original/exact prompt. Its presence can be checked in Git; a complete platform export is not available to independently authenticate every exchange. |
| Recorded response or action | A source record of an AI response, development action or outcome. “Faithful record” does not automatically mean a complete verbatim assistant transcript. |
| Planning or retrospective summary | A synthesis of recorded decisions/results. This index and the managerial-history section of the V4 log are summaries, not historical dialogue. |
| User-reported observation | For example, manual confirmation that globe controls worked. It is distinct from an automated measurement or an agent-observed physical test. |
| Executed verification | A documented command/environment/result or artifact. Historical runs remain historical; unperformed physical, accessibility or cross-platform tests are not implied. |
| Git-verifiable fact | Commit/tree/blob identities, ancestry and tag targets. Git proves stored snapshots and relationships, not every intermediate conversation, action or personal motive. |

## Source-record map

| Stage | Where to inspect | Evidence coverage |
| --- | --- | --- |
| Initial planning / V1 | [ChatGPT record](01-chatgpt-conversation.md), [planning note](01-planning.md), [Antigravity log](antigravity-development.md), interactions 1–8 | The ChatGPT file preserves one original user prompt and a response summary. The planning note explicitly calls itself a summary. The Antigravity log contains labelled prompt and response/action records. |
| V2 | [Codex stage record](codex-stage-record.md), interactions 9–14; [preservation record](codex-release-v2.md), interactions 15–18; [validation record](codex-validation.md) | Recorded requests, approval boundaries, implementation/correction summaries and test results. Some entries also appear in the Antigravity log; those duplicates are not additional iterations. |
| V3 | [V3 development log](codex-development-v3.md), initiating request, phases A–F, manual review, camera repair and release preparation | Recorded prompts plus implementation/test summaries. The camera repair includes actual pointer/camera measurements, separate from user-reported manual confirmation. |
| V4 | [V4 development log](codex-development-v4.md), initiating audit, cinematic directive, pre-release audit, readiness and publication approval | Recorded prompts, implementation phases, failed checks/fixes, numerical investigation, generated-image provenance and an explicitly labelled managerial-history summary. |
| Post-publication | [Closeout below](#publication-closeout), [new V4 log appendix](codex-development-v4.md#post-publication-documentation-finalization) | A retrospective record supported by Git/API verification and the conversation available in this session. It does not pretend that these results were known before the release commit. |

The original logs are retained as source records. Their earlier “do not publish” instructions and pending status describe the authorization/checkpoint at that time; later explicit release approval superseded them for V4 publication.

## User decisions and iteration

The following is an evidence-linked synthesis, not an invented interview or a claim that the student personally authored every implementation line.

| Recorded user decision | Source request | Implementation / validation evidence | What it demonstrates |
| --- | --- | --- | --- |
| Choose a globe plus airline decision exercise within an English, approximately ten-slide presentation | [Original ChatGPT prompt](01-chatgpt-conversation.md); [planning summary](01-planning.md) | [Original PRD](../PRD.md), [V1 commit](https://github.com/katznoa22-hash/how-wars-change-the-skies/commit/9a9ce56dfe23dc5f06a501c3e7582c605c540362) | Scope and central-feature selection. V1 already contained interactions; V2 improved their reliability rather than originating the concept. |
| Preserve the ten-slide structure while improving geography and quantitative credibility | [V2 stage record](codex-stage-record.md), interactions 9–10 | [Python model](../analysis.py), [generated results](../data/scenarios.json), [source audit](../SOURCES.md) | Scope control and a preference for reproducible estimates over unsupported figures. |
| Require geographic verification before swapping coordinates | [V2 stage record](codex-stage-record.md), interaction 14 | [Correction evidence](../data/coordinate-validation.json), [airport references](../data/airport-references.json), [validation utility](../scripts/validate_airports.py) | Challenging a proposed fix and requiring independent location evidence. The check is airport-vicinity validation, not certified ARP accuracy. |
| Investigate non-responsive Reset/+/− controls using actual interactions | [V3 repair prompt and results](codex-development-v3.md), “Subsequent prompt — globe camera control repair” | [Runtime camera checks](../assets/v2.js), [pointer/camera tests](../tests/browser.mjs), [recorded V4 camera measurements](../artifacts/v4/browser-results.json) | Feedback-driven debugging and testing behavior rather than merely checking handler existence. The V3 availability/reset repair and later V4 visibility-transition fix are distinct. |
| Reject gold-heavy styling and use the selected cinematic aviation direction | [Exact V4 cinematic directive](codex-development-v4.md), “Subsequent prompt — cinematic implementation directive” | [Existing cover screenshot](../artifacts/v4/v4-slide-01-projector.png), [generated-artwork provenance](../assets/hero-v4-provenance.json) | User-led visual judgment. The original reference bitmap/full selection exchange was unavailable; no additional rejected designs or motives are invented. |
| Demand independent pre-release scrutiny and preserve limitations | [V4 audit/readiness prompts](codex-development-v4.md); [historical audit](../artifacts/v4/pre-release-audit.md) | [Numerical comparator/rejection tests](../tests/model_checks.py), [ZIP expected/actual evidence](../artifacts/v4/pre-release-audit.md) | Willingness to investigate failures and disclose uncertainty. The exact external floating-point cause remains unconfirmed. |
| Control publication and stop on an unexpected verification failure | [V4 publication approval and new closeout records](codex-development-v4.md) | [Published commit](https://github.com/katznoa22-hash/how-wars-change-the-skies/commit/4e73a2a528395aa939251579dfd51ca6e8089a86), [verification method below](#publication-closeout) | Approval boundaries and investigation instead of concealing an assertion failure. |

## Python contribution and requirement boundary

The actual pipeline is airport/reference inputs → Python validation and spherical waypoint calculations → generated JSON/browser data → JavaScript presentation. [analysis.py](../analysis.py) calculates the three route baselines/detours, extra time, fuel, incremental expense and direct CO2. [presentation-data.js](../data/presentation-data.js) supplies the browser model and serializes existing country geometry; Python does not invent that geometry. Browser sliders and strategy-specific outcomes are evaluated in [assets/v2.js](../assets/v2.js) using the documented assumptions.

The original [PRD](../PRD.md), architecture section, explicitly specifies reproducible Python-generated JSON loaded by JavaScript and says Python need not execute inside the browser. The repository contains no separate instructor handout requiring a live Python service. This establishes the project's recorded architecture, not additional requirements from an unavailable rubric. The static preview server is not a live calculation backend. No backend or new functionality is introduced by this documentation update.

## Validation evidence and limits

| Evidence | Scope |
| --- | --- |
| [Python tests](../tests/model_checks.py) and [audit commands/results](../artifacts/v4/pre-release-audit.md) | Historical native runs passed 12 checks: nine model and three Git-history checks. Model-only runs in a clean source-ZIP extraction passed nine checks. The full ZIP suite reports expected Git-history errors without .git; this is not history verification. |
| [Recorded browser report](../artifacts/v4/browser-results.json) | 29 passing groups, all 48 independently checked simulator combinations, 30 default projector layouts and zero uncaught exceptions. Deliberate missing-resource/WebGL fault diagnostics are retained. These are recorded application-test results, not a browser rerun for this documentation change. |
| [Screenshot gallery](../artifacts/v4/preview.html) | Ten actual 1366×768 captures. They do not establish physical projector, hardware GPU, screen-reader, real touch-device or cross-browser validation. Some globe control labels remain 14px. |
| [Source/model audit](../SOURCES.md) and [historical pre-release report](../artifacts/v4/pre-release-audit.md) | Historical/operator-specific claims, illustrative routes, constant performance assumptions, invented scores and source-access limits remain explicit. RKSI remote content was not reconfirmed; the FAA example exceeded the reader limit. |

The numerical test comparator permits only tiny absolute differences in eight derived fields; it still rejects altered inputs, metadata/structure, non-finite values and excessive deviations. The independent external ZIP floating-point failure was not reproduced or conclusively reconciled. A controlled sequential-sum experiment demonstrates a plausible last-bit mechanism, not proof of the original external cause. Native expected/actual values and tolerance behavior are preserved in the audit. Publication success does not resolve this numerical observation.

For this documentation-only follow-up on 9 November 2026, `py -I -B -m unittest discover -s tests -p '*checks.py' -v` passed 12 tests. All 103 local link/image/anchor references across the five documents passed validation; all seven unique external URLs returned HTTP 200 to HEAD requests. HEAD reachability does not independently confirm historical source content or overcome the earlier PDF-reader size limit. All 60 tracked files outside the approved four existing documentation files remained byte-identical; the fifth approved path is this new index. No browser suite or data generator was rerun, and no application test artifact was rewritten. Detailed checks are recorded in the [V4 log](codex-development-v4.md#documentation-finalization-verification); historical browser results are not relabelled as new.

## Publication closeout

Verified read-only on 9 November 2026:

| Fact | Verified value |
| --- | --- |
| Repository | [katznoa22-hash/how-wars-change-the-skies](https://github.com/katznoa22-hash/how-wars-change-the-skies), public |
| Published target | `origin/main` |
| Local working branch | `version-4` |
| V4 commit | `4e73a2a528395aa939251579dfd51ca6e8089a86` — `Version 4 - Final University Submission` |
| Root tree | `b55274ba1efbba6658d9bd57e087b65b6136d9c1` |
| Published file comparison | All 64 files matched by path, mode and Git blob SHA; no missing, extra or differing files; recursive response was not truncated. |
| Original release delta | Exactly the approved 25 changed paths relative to V3, verified against the historical candidate list. |
| Parent | V3 commit `ef15a06038502f249bd702255401e1f09dc738ee` |
| Preserved V1/V2 history | V1 `9a9ce56dfe23dc5f06a501c3e7582c605c540362` and V2 `1dd228500b5ba5708412495f1c43704468728b75` remain ancestors. |
| Preserved tags | Annotated `v2.0` object `1e66b7c1a80c3b12f62979bed9a8e78a25962b80`; annotated `v3.0` object `dd43ea3d8b5ac7ec3fd35b2ea17791696bd2d675`, retaining their original targets. No V4 tag was created. |

The original failed assertion was:

```python
assert tree['sha'] == git('rev-parse', 'HEAD^{tree}') and not tree['truncated']
```

In the observed responses requested through `main` or the release commit SHA, the top-level `sha` was the **commit SHA** (`4e73a2a...`), while the script expected the **tree SHA** (`b55274ba...`). This mismatch alone did not establish differing files. It was not diagnosed as a caching issue.

Corrected verification read the commit record, checked its identity, obtained `commit.tree.sha`, queried that exact tree SHA, checked non-truncation, and compared complete file maps from GitHub against `git ls-tree -r` for the local release. It also checked the original 25-path delta, required documentation/runtime/screenshot paths, remote refs and ancestry. Every file comparison passed. **The publication was correct; the verification assumption was wrong.** This is independent of the unresolved external floating-point observation.

The 64-file/25-change counts describe the immutable published release. They do not assert that a later documentation working tree has the same file count. This follow-up preserves that release and all prior history; any later documentation commit/publication requires separate explicit approval.

## Missing originals and academic integrity

- A complete original ChatGPT export and all assistant responses are not present. Some later records are faithful summaries rather than full transcripts.
- The original selected hero reference bitmap and complete earlier image-selection exchange were not available locally. The retained user directive supports the described choice and gold rejection; unavailable alternatives must not be fabricated.
- Several later read-only assessment turns are not a complete verbatim repository archive. The new appendix adds specific available approval prompts, not an invented claim of full conversation coverage.
- Existing prompts, original languages, dates and historical failures remain in their source records. Do not backdate retrospective analysis, present translations as original wording, or infer personal motives from generated code.
- If genuine exports become available, identify their origin/date, review privacy, and link them without replacing original records. Instructor-specific AI-disclosure requirements must be checked against the actual assignment brief.

The material contribution evidenced here is the user's scope/design choices, corrective questions, requested verification and release control. AI assistance, generated imagery and automation are disclosed. This evidence supports a development narrative; it is not independent proof of every line's human authorship or of undocumented decisions.
