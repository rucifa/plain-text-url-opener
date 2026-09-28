# Tests

This directory preserves release-validation evidence for Plain Text URL Opener.

## Two separate concepts

### Regression Fixture

The canonical browser-facing test specification is the repository root `index.html` (Regression Fixture v1.2).

The fixture defines expected behavior. It is intentionally independent from userscript release versions and must not be edited merely to make a current implementation pass.

### Acceptance Reports

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

Fixture v1.2 contains 166 cases across 20 sections and covers browser-facing cases including HTTP(S), bare/www domains, Unicode/IDN, multilingual adjacency, security boundaries, malformed tokens, punctuation, existing links, ignored editable/form controls, multiple URLs in one TextNode, long TextNodes, cross-TextNode non-reconstruction, and historical regressions. v1.2 adds six regression locks for Cross-TextNode truncated-prefix suppression and unsupported outer-scheme + missing-h handling without changing any of the prior 160 expectations.

Parser fuzzing, lifecycle/reinjection, popup safety, opener isolation, and detailed performance measurements remain separate automated acceptance layers rather than browser-fixture content.
