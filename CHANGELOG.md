# Changelog

All notable behavior changes to Plain Text URL Opener are documented here.

The Regression Fixture has its own version line and should not be changed merely to make a userscript release pass.

## [1.0.3] - 2026-09-27

### Fixed

- Preserve valid CJK IDN hostname labels in explicit HTTP(S) URLs, including `https://www.例え.jp/` and `https://example.みんな/`.
- Reject nested HTTP(S) candidates inside unsupported outer schemes such as `blob:`, `data:`, `javascript:`, `file:`, `ftp:`, and `mailto:`.
- Suppress known truncated-prefix openings when a URL is split across DOM TextNodes; cross-TextNode reconstruction itself remains intentionally unsupported.

### Validation

- Static / architecture: 14 / 14 PASS
- Targeted parser + security + fixture regression: 82 / 82 PASS
- Chromium interaction / lifecycle: 34 / 34 PASS
- Differential fuzz: 10,000 cases, 0 unexpected differences

## [1.0.2] - 2026-09-27

### Fixed

- Replaced quadratic unmatched-closing-delimiter trimming with a linear counting approach.
- Hardened bare-domain boundaries against partial matches inside malformed hostname-like tokens.
- Added scan-window clipping protection for TextNodes larger than 8,192 characters, preferring false negatives over wrong-target navigation.

### Validation

- Deterministic acceptance: 119 / 119 PASS
- 200,000 randomized delimiter-equivalence inputs
- 200,000 parser differential-fuzz inputs with no new candidate shapes or mutated surviving candidates

## [1.0.1] - 2026-09-27

### Fixed

- Re-check the resolved caret/Selection TextNode against ignored elements so existing native `<a href>` links are not processed when the event target differs from the actual TextNode.

### Validation

- Final acceptance: 67 / 67 PASS

## [1.0.0] - 2026-09-27

### Fixed before stable release

- Prevent bare/www fallback from recovering a later domain fragment inside the same malformed scheme-like token, including `%40`, `|`, and `^` regressions.

### Validation

- Final acceptance: 59 / 59 PASS

## Fixture v1

Regression Fixture v1 is maintained independently from the userscript release version. It is a fixed browser-facing test specification. Changes to fixture expectations require either a confirmed fixture error or an intentional product-specification change, not merely a change in current script behavior.
