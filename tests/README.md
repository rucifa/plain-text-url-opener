# Tests

This directory preserves release-validation evidence for Plain Text URL Opener.

## Two separate concepts

### Regression Fixture

The canonical browser-facing test specification is the repository root `index.html` (Regression Fixture v1.4).

The fixture defines expected behavior. It is intentionally independent from userscript release versions and must not be edited merely to make a current implementation pass.

### Acceptance Reports

### Current Fixture evidence

- `acceptance/fixture-v1.4.md` — Fixture v1.4 specification / preservation gate for Defanged URL override interactions, including the v1.0.11 Reproduce result.
- `acceptance/fixture-v1.3.md` — Fixture v1.3 preservation gate plus full native-mouse Chromium and Firefox validation (171 / 171 PASS in each browser).

### Current release evidence

- `acceptance/v1.0.12.md` — Defanged URL explicit override implementation, Firefox Ctrl-double-click compatibility, full Fixture v1.4 cross-browser regression, and modifier security probes.
- `acceptance/v1.0.11.md` — bounded Cross-TextNode safety / popup isolation hardening acceptance with fresh Chromium 140 + Firefox 141 full-fixture validation.
- `acceptance/v1.0.10.md` — icon compression / metadata-only release acceptance, including exact-byte identity and cross-browser userscript-manager rendering checks.
- `acceptance/v1.0.9.md` — Chromium + Firefox integration, security, iframe, SPA, Shadow DOM, editable-control, reinjection, and bounded-performance smoke audit.

`tests/acceptance/` contains version-specific test results. These reports record what a particular release actually passed, failed, fixed, or intentionally left outside scope.

A future regression should therefore be handled as follows:

1. Keep the fixture expectation unchanged if the specification is unchanged.
2. Record the release's actual PASS/FAIL result in its acceptance report.
3. Fix the userscript if the implementation violates the fixture.
4. Change the fixture only for a confirmed fixture error or an intentional product-specification change.

## Current fixture scope

Fixture v1.4 contains 176 cases across 20 sections and defines 178 expected browser interactions. It preserves all 169 Fixture v1.3 cases and expected results unchanged, then adds seven Defanged URL interaction specifications: four supported defang syntaxes under Ctrl + Shift + double-click, one User Info revalidation case, and two single-modifier negative controls. v1.0.12 implements the specified override and passes all 178 expected interactions on Chromium 140 and Firefox 141 while leaving the Fixture expectations unchanged.

Parser fuzzing, lifecycle/reinjection, popup safety, opener isolation, and detailed performance measurements remain separate automated acceptance layers rather than browser-fixture content.
