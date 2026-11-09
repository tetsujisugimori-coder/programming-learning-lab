# PR #4 focus repair / 2026-11-09

## Fixed inputs and before evidence
- Repository: tetsujisugimori-coder/programming-learning-lab; Issue #3; Draft PR #4.
- Baseline HEAD: 34422bf6736a16435247c8898214fb0c07429555.
- Baseline tree: 001e0973fbc8062fde0ed94c0c3077265bab9eb1.
- Latest fetched main: c0eb74888a8878a27c220669b3ac0af394290496. No repo AGENTS.md or repo .agents skills were present.
- Additional review: https://github.com/tetsujisugimori-coder/programming-learning-lab/pull/4#pullrequestreview-5824636141

Real-browser reproduction used the unmodified baseline production bundle, Playwright 1.56.1, Chromium 141.0.7390.37 and WebKit 26.0 on Linux, viewport 375 x 950. These local supplemental versions are distinct from the pinned 1.58.2 CI runner. `before/direct-reproduction.json`, images and traces show four actual runs: each requested Python focus while an ancestor was hidden. Chromium settled on BODY; WebKit could retain the hidden Wasm H2 when returning to chapters. The direct probe wraps focus for observation but invokes the original method. It does not make hidden elements focusable.

The first system Chromium attempt failed before page execution (socket EPERM). The pinned browser download returned invalid ZIP bytes. Those failures are retained and are NOT passes. Existing locally available matched browser binaries provided the actual reproduction.

## Cause and repair
Two independently registered hashchange listeners had an implicit order: main.ts focused Python first, then wasm-learning.ts restored the top-level Python nodes. Entering or navigating within Wasm also ran unnecessary Python navigation.

main.ts now owns the only hashchange listener. It calls the Wasm route function first to terminate any current Worker and set course visibility. A true result means Wasm handled its own section/focus; otherwise Python resolves its route and focuses its now-visible destination. This is an explicit call sequence, not registration-order timing or a timeout. Both course DOM trees, inputs, session maps, and Worker identity guards remain intact. pagehide cleanup and the active-course skip-link handling remain in the Wasm module.

## Regression contract
The added browser suite checks lesson/chapter return, section changes, repeated round trips, Back/Forward, Python node identity and inputs/read records, Wasm edited WAT/memo/read records, actual Worker termination on navigation, keyboard-only course navigation, skip links and the #main history case. A focus-call audit fails on any nonrendered target, in addition to checking document.activeElement and visibility. Six added scenarios run in all 16 existing projects. Existing nine scenarios and their clipboard skips are retained. Evidence destinations are separated to avoid overwriting the previous Stage 1 evidence.

## Reproduction commands
- npm ci
- npm run check
- node tools/verify-python.mjs
- npx playwright install --with-deps chromium webkit
- E2E_EVIDENCE_ROOT=docs/evidence/wasm-focus-20261109/new-run FOCUS_EVIDENCE_DIR=docs/evidence/wasm-focus-20261109/new-run/focus npm run test:e2e

For the old-code negative control, check out baseline 34422bf in a separate worktree, copy the new focus-navigation.spec.ts without changing baseline src, build baseline, and run `--grep 'focus return'`. Do not compare against a build made after the source change. Local-only reproduction script references preinstalled browser paths; substitute installed matching binaries, do not assume those /tmp paths exist on another machine.

Physical iPhone Safari, physical keyboard, and VoiceOver are NOT_TESTED. Browser automation and instrumented Worker termination do not establish assistive-technology acceptance or a complete resource-safety guarantee. No merge, Draft removal, or deployment is performed.

## Measured negative controls and pilot
The same two new focus-return assertions failed in all 16 projects on the baseline bundle: **0 PASS / 32 FAIL / 0 SKIP**. All 32 per-trial focus-call logs and full Playwright report are in before-evidence.zip, with four direct-run screenshots/traces. SHA256 ledger is before-sha256.json. The archive retains the initial launch/download failures separately.

The first corrected-code pilot passed the four functional paths and #main history path on both engines (10 passes). Two keyboard-test setup failures were test defects: a deep-link initial hash sets the browser's tab starting point near the article, not the skip link; a broad course-bar selector matched hidden Wasm navigation too. The test now starts keyboard traversal at the unhashed document and scopes the Python course-bar selector. Both keyboard-only cases then passed without product changes or skipped assertions. These pilot failures remain local raw evidence and are documented here; final whole-matrix results and independent review are reported separately after exact-HEAD CI.

## Independent review correction before final acceptance
An independent reviewer found that Back to a previous #main skip-link history entry still restored visibility without reliably focusing main (BODY fallback). The initial sixth test only excluded hidden focus and could miss this. It now requires #main itself to be focused immediately after Back. The single router explicitly focuses main after visibility restoration for a focus-requesting #main transition. Initial-load focus remains unchanged. This residual P2 and its detector weakness were fixed rather than accepted as passing.
