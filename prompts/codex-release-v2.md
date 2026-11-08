# Version 2 preservation — Codex

AI tool: **Codex**. Date: 8 November 2026. Scope: validate and preserve Version 2 locally; pushing requires separate explicit approval. No Version 3 work is authorized.

## Interaction 15 — Start the preview

Exact user prompt:

```text
py -m http.server 8000 --bind 127.0.0.1
```

Codex started the requested local preview server and verified HTTP 200 from `http://127.0.0.1:8000/`. No project files or Git history were changed by that action.

## Interaction 16 — Inspect Git state

Exact user prompt:

```text
git status --short
git branch --show-current
git remote -v
```

Codex executed the three read-only commands and reported main, the configured `katznoa22-hash/how-wars-change-the-skies` GitHub origin, and the modified/untracked Version 2 files. It stated that Version 2 was uncommitted. No commit or push was executed.

## Interaction 17 — Requested preservation review

Exact user prompt:

```text
We are ready to preserve Version 2 in GitHub before starting Version 3.

1. Verify that Version 1 is preserved in the existing Git history or tags.
2. Review .gitignore and inspect untracked files, especially artifacts/, for generated files, secrets, and unnecessary large files.
3. Confirm that all Version 2 presentation files, source data, tests, sources, and prompt documentation are ready to be committed.
4. Stage only the appropriate project files and create a commit with message: "Version 2 - interactive aviation presentation completed".
5. Create an annotated tag v2.0 pointing to this commit, only if it does not already exist.
6. Show the commit hash, staged/committed file summary, and tag status.
7. Ask for my explicit approval BEFORE pushing the commit and tag to GitHub.

Do not start Version 3. Do not rewrite history, force-push, delete Version 1, or overwrite an existing tag. If anything unexpected appears, stop and explain.
```

Actual actions and response:

- Read Git status/history, ignore rules, file inventory/sizes, tests, browser report and documentation.
- Confirmed Version 1 at `9a9ce56dfe23dc5f06a501c3e7582c605c540362`; direct `git ls-remote` confirmed GitHub main still pointed there. No local or remote `v2.0` tag existed.
- Found four reviewed artifact files: three presentation screenshots and a 2.6 KB browser report, approximately 1 MB combined. Largest project asset was approximately 905 KB. No obvious secrets were found by the credential-pattern scan; this is not a guarantee that every possible secret format was recognized.
- Confirmed browser profiles, Python caches and local backups were ignored.
- Found an unexpected readiness issue: the original-backup test read an ignored local file, so a fresh clone would lack the required backup. The report also recorded local workstation paths.
- Stopped as requested, explained both issues and proposed verifying Version 1 through Git history and sanitizing the report. Nothing was staged, committed, tagged or pushed in that turn.

## Interaction 18 — Approved fixes and local release

Exact user prompt:

```text
Yes, proceed with the proposed fixes.

1. Update the test to verify Version 1 through Git history without changing Version 1.
2. Sanitize local workstation paths in the browser report without removing meaningful test results.
3. Rerun all relevant validation tests.
4. Verify that the prompt documentation is included and up to date.
5. Stage only appropriate project files and create the Version 2 commit.
6. Create the annotated v2.0 tag pointing to that commit.
7. Report the test results, commit hash, and tag status.

Do NOT push to GitHub yet. Wait for my separate approval before any push. Do not start Version 3.
```

Actual fixes:

- Replaced the ignored-backup dependency with `git merge-base --is-ancestor` and `git show` against the fixed Version 1 commit, plus the original HTML SHA-256 check. This reads history without changing it.
- Added recursive report sanitization in the browser harness, replacing project-directory and file-URL prefixes with `<project>` and recording only the browser executable name. Results, errors and request paths remain available for review.
- Restricted artifacts to the reviewed browser report and three documentation screenshots. Backups, profiles, bytecode and transient browser diagnostics stay excluded.
- Updated README release guidance and documented that a shallow clone must include Version 1 history for the preservation test.
- Added `.gitattributes` after Git's Windows line-ending warnings: vendored downloads and geographic source bytes are preserved exactly so their manifest digests remain valid after checkout; PNGs are binary.

Validation results and the exact local preservation outcome are recorded in the following release-review entry in `antigravity-development.md`, the browser report, the Version 2 Git commit and its annotated tag. This prompt record is prepared before committing; the commit and tag identifiers are obtained from Git after creation rather than fabricated in advance. No push is authorized or performed by this stage.
