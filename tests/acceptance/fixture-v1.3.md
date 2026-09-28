# Regression Fixture v1.3 Acceptance Report

## Scope

Fixture v1.3 is a **regression-coverage expansion only**. It does not modify the Plain Text URL Opener userscript runtime or any prior testcase expectation.

Fixture version: **v1.3**  
Total cases: **169 across 20 sections**  
Userscript under test: **v1.0.10**

## Added cases

Fixture v1.3 preserves all 166 Fixture v1.2 cases and expectations unchanged, then adds three cases:

1. `punct-close-suffix` — `https://example.com/a).84841` must remain a complete URL; the internal `)` must not be trimmed.
2. `punct-close-query` — `https://example.com/a)?15fdsa` must preserve the closing parenthesis immediately before the query string.
3. `long-shop-query` — a longer shop/tracking-style HTTPS URL must preserve its path, multiple query parameters, `&`, `=`, and fragment.

The existing `http-08` case already covers the complementary sentence-ending behavior: `https://example.com/a).` resolves to `https://example.com/a`.

## Preservation gate

- Remove the three new v1.3 rows and normalize the visible Fixture version/count labels back to v1.2.
- Result compared byte-for-byte with the previous `main` Fixture v1.2.
- **PASS — all prior 166 testcase DOM structures and expected results are unchanged.**
- `plain-text-url-opener.user.js`: **unchanged**.

## Real-browser native interaction validation

The complete Fixture was exercised using native mouse double-click interaction. The harness clicks inside the expected URL token, lets the browser create the native selection/double-click event, and observes the actual userscript navigation result. Multi-URL rows are exercised once per independent URL.

- Chromium: **171 / 171 PASS** across all 169 Fixture cases.
- Firefox: **171 / 171 PASS** across all 169 Fixture cases.
- New v1.3 cases: **3 / 3 PASS in both browsers**.
- No unexpected opens in negative / ignored / blocked cases.

## Classification

- Runtime bug fix: **No**.
- Product-specification change: **No**.
- Existing Fixture expectation change: **No**.
- Regression coverage expansion: **Yes**.

## Result

**PASS — Regression Fixture v1.3 is accepted as the new canonical browser-facing regression specification.**
