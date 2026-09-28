# Tests

This directory preserves release-validation evidence for Plain Text URL Opener.

## Two separate concepts

### Regression Fixture

The canonical browser-facing test specification is the repository root `index.html` (Regression Fixture v1.3).

The fixture defines expected behavior. It is intentionally independent from userscript release versions and must not be edited merely to make a current implementation pass.

### Acceptance Reports

### Current Fixture evidence

- `acceptance/fixture-v1.3.md` — Fixture v1.3 preservation gate plus full native-mouse Chromium and Firefox validation (171 / 171 PASS in each browser).

### Current release evidence

- `acceptance/v1.0.10.md` — icon compression / metadata-only release acceptance, including exact-byte identity and cross-browser userscript-manager rendering checks.
- `acceptance/v1.0.9.md` — Chromium + Firefox integration, security, iframe, SPA, Shadow DOM, editable-control, reinjection, and bounded-performance smoke audit.

`tests/acceptance/` contains version-specific test results. These reports record what a particular release actually passed, failed, fixed, or intentionally left outside scope.

A future regression should therefore be handled as follows:

1. Keep the fixture expectation unchanged if the specification is unchanged.
2. Record the release's actual PASS/FAIL result in its acceptance report.
3. Fix the userscript if the implementation violates the fixture.
4. Change the fixture only for a confirmed fixture error or an intentional product-specification change.

## Current fixture scope

Fixture v1.3 contains 169 cases across 20 sections and covers browser-facing cases including HTTP(S), bare/www domains, Unicode/IDN, multilingual adjacency, security boundaries, malformed tokens, punctuation, existing links, ignored editable/form controls, multiple URLs in one TextNode, long TextNodes, cross-TextNode non-reconstruction, and historical regressions. v1.3 preserves all 166 Fixture v1.2 cases and expectations unchanged, and adds three regression locks for a closing parenthesis followed by further URL content, a closing parenthesis immediately before a query string, and a longer shop/tracking-style URL with multiple query parameters and a fragment.

Parser fuzzing, lifecycle/reinjection, popup safety, opener isolation, and detailed performance measurements remain separate automated acceptance layers rather than browser-fixture content.
