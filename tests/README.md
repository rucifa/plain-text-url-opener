# Tests

This directory preserves release-validation evidence for Plain Text URL Opener.

## Two separate concepts

### Regression Fixture

The canonical browser-facing test specification is the repository root `index.html` (Regression Fixture v1.1).

The fixture defines expected behavior. It is intentionally independent from userscript release versions and must not be edited merely to make a current implementation pass.

### Acceptance Reports

`tests/acceptance/` contains version-specific test results. These reports record what a particular release actually passed, failed, fixed, or intentionally left outside scope.

A future regression should therefore be handled as follows:

1. Keep the fixture expectation unchanged if the specification is unchanged.
2. Record the release's actual PASS/FAIL result in its acceptance report.
3. Fix the userscript if the implementation violates the fixture.
4. Change the fixture only for a confirmed fixture error or an intentional product-specification change.

## Current fixture scope

Fixture v1.1 covers browser-facing cases including HTTP(S), bare/www domains, Unicode/IDN, multilingual adjacency, security boundaries, malformed tokens, punctuation, existing links, ignored editable/form controls, multiple URLs in one TextNode, long TextNodes, cross-TextNode non-reconstruction, and historical regressions.

Parser fuzzing, lifecycle/reinjection, popup safety, opener isolation, and detailed performance measurements remain separate automated acceptance layers rather than browser-fixture content.
