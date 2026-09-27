# Changelog

All notable release changes to Plain Text URL Opener are documented here.

The Regression Fixture has its own version line and should not be changed merely to make a userscript release pass.

## [1.0.5] - 2026-09-27

### Fixed

- Reject arbitrary two-letter pseudo-TLD / filename false positives such as `script.js`, `bundle.ts`, and `example.zz` while preserving real delegated ccTLDs such as `.md`, `.py`, and `.sh` under the existing conservative scheme-less policy.
- Fix the real-interaction `perf-closers` regression where a valid URL followed by a very long run of closing punctuation could be suppressed by bounded-scan clipping.
- Preserve the historical multilingual-adjacency behavior for bare / `www.` domains followed immediately by non-Latin prose, including Cyrillic, Greek, Thai, Arabic, Hebrew, and Devanagari text.

### Added / changed behavior

- Add scheme-less IDN support using browser URL / IDNA normalization, including `例え.jp`, `www.例え.jp`, `пример.рф`, `www.example.みんな`, and `example.台灣`.
- Define trailing `!` as removable URL punctuation while preserving internal `!` in paths and queries.
- Keep cross-TextNode URL reconstruction intentionally unsupported and retain HTTP(S)-only opening behavior.

### Regression Fixture v1.1

- Expand the browser-facing fixture from 131 to 160 cases across the existing 20 sections.
- The only pre-existing expectations intentionally changed for v1.1 are `www-idn-japanese` and `bare-idn-cyrillic`; all other prior expectations remain independent regression standards.
- Add explicit coverage for delegated ccTLD ambiguity, pseudo-TLD / filename negatives, Punycode delegation, unsupported outer schemes, bounded-scan clipping, performance closers, and related security boundaries.

### Validation

- Targeted parser regression: 30 / 30 PASS.
- Targeted Chromium interaction: 10 / 10 PASS.
- Full Fixture parser regression: 150 / 150 PASS; 10 DOM-only cases covered by browser interaction.
- Full Fixture Chromium regression: 162 / 162 PASS across all 160 fixture cases.
- Unsupported outer-scheme security probes: 10 / 10 PASS.
- Differential fuzz: 10,000 cases, 0 unexpected differences; 1,114 intentional differences limited to the restored non-Latin adjacency family.
- Performance gate: PASS; normal ~8 KB one-domain parsing remains sub-millisecond on the GitHub Actions runner and stress cases remain millisecond-scale.
- Official IANA snapshot verification (2026-09-27): 248 / 248 two-letter delegated TLDs and 151 / 151 delegated IDN TLDs, with 0 missing / 0 extra.
- Full acceptance evidence: `tests/acceptance/v1.0.5.md`.

## [1.0.4] - 2026-09-27

### Publication metadata

- Changed `@namespace` from `plain-text-url-opener` to `https://github.com/rucifa/plain-text-url-opener` for a stable, project-specific identity before public distribution.
- Added `@license MIT with Commons Clause License Condition v1.0`.
- Added `@supportURL https://github.com/rucifa/plain-text-url-opener/issues`.
- Updated userscript metadata version, runtime version, and load log from `1.0.3` to `1.0.4`.

### Behavior

- No parser, URL-matching, DOM, UI, navigation, or event-handling behavior changed.
- Regression Fixture v1 is unchanged.

### Validation

- Exact v1.0.3 → v1.0.4 diff contains only publication metadata and version-identification changes.
- JavaScript syntax check: PASS.
- Static architecture constraints remain unchanged: no `MutationObserver`, `setInterval`, `requestAnimationFrame`, `eval`, `new Function`, `innerHTML`, or GM API dependency.
- GitHub artifact matches the validated local v1.0.4 candidate by Git blob SHA: `5fe03abf8b2fd5b05c674ba34b324e921ea9a317`.
- v1.0.4 SHA-256: `4d85ccb106c13701427bed9ed05d6fcb32ff812a9f22fa62484757db8952cbe3`.

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

## Fixture v1.1

Regression Fixture v1.1 is maintained independently from the userscript release version. It is a fixed browser-facing test specification. Changes to fixture expectations require either a confirmed fixture error or an intentional product-specification change, not merely a change in current script behavior.
