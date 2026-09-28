# Changelog

All notable release changes to Plain Text URL Opener are documented here.

The Regression Fixture has its own version line and should not be changed merely to make a userscript release pass.

## [1.0.10] - 2026-09-28

### Icon optimization

- Re-encode the production 64×64 RGBA icon using the verified compression-level-9 candidate, reducing the PNG from 16,516 bytes to 5,697 bytes while preserving the same decoded image and transparency.
- Regenerate the embedded userscript `@icon` data URI from the exact same 5,697-byte PNG.
- Manual installation / rendering checks passed on Firefox + Violentmonkey and Chromium-family browsers + Violentmonkey.

### Documentation

- Refocus the README version/testing section on the current Stable baseline and validation status instead of duplicating per-release history already maintained in CHANGELOG and GitHub Releases.

### Behavior

- No parser, URL-matching, DOM, UI, navigation, cache, security-boundary, performance, or event-handling behavior changed.
- Regression Fixture v1.2 remains unchanged at 166 cases.
- v1.0.9 → v1.0.10 normalized runtime identity is required to remain unchanged apart from version identity and `@icon` metadata.

## [1.0.9] - 2026-09-28

### Firefox icon compatibility

- Replace the production 64×64 icon with the RGBA uncompressed PNG that was directly verified to render correctly in Firefox.
- Regenerate the userscript `@icon` data URI from the exact same Firefox-verified PNG bytes.
- Remove the temporary RGB PNG / uncompressed RGBA PNG / JPEG A/B diagnostic assets after the compatibility result was confirmed.

### Behavior

- No parser, URL-matching, DOM, UI, navigation, cache, security-boundary, or event-handling behavior changed.
- Regression Fixture v1.2 remains unchanged at 166 cases.
- Behavioral validation is inherited from the fully accepted v1.0.6 implementation; v1.0.9 changes only icon encoding / publication metadata.

## [1.0.8] - 2026-09-28

### Icon compatibility

- Embed the official 64×64 PNG directly in the standard userscript `@icon` metadata as a `data:image/png;base64,...` URI.
- Avoid the remote-icon fetch / image-decoding path used by userscript managers, improving consistency on Firefox + Violentmonkey while preserving Chromium behavior.
- Keep `assets/icon-64.png` and `assets/icon-128.png` in the repository for project and distribution use.

### Behavior

- No parser, URL-matching, DOM, UI, navigation, cache, security-boundary, or event-handling behavior changed.
- Regression Fixture v1.2 remains unchanged at 166 cases.
- Behavioral validation is inherited from the fully accepted v1.0.6 implementation; v1.0.8 changes icon delivery / publication metadata only.

## [1.0.7] - 2026-09-28

### Branding / metadata

- Add the official Plain Text URL Opener icon asset for userscript managers.
- Add the standard userscript `@icon` metadata entry, pointing to the repository-hosted 64×64 PNG.
- Update userscript metadata, runtime instance version, and load log from `1.0.6` to `1.0.7`.

### Behavior

- No parser, URL-matching, DOM, UI, navigation, cache, security-boundary, or event-handling behavior changed.
- Regression Fixture v1.2 remains unchanged at 166 cases.
- Behavioral validation is inherited from the fully accepted v1.0.6 implementation; v1.0.7 changes branding / publication metadata only.

## [1.0.6] - 2026-09-28

### Fixed

- Bound the non-Latin adjacency parser path so pathological 8 KB scheme-less tokens no longer trigger thousands of repeated URL / TLD validations on the main thread.
- Block unsupported outer schemes from rescuing nested missing-h forms such as `javascript:ttps://example.com/x`.
- Suppress additional Cross-TextNode truncated-prefix openings across host, path, query, fragment, and `www.` splits while keeping Cross-TextNode reconstruction intentionally unsupported.
- Preserve page-owned DOM nodes that happen to reuse internal IDs; cleanup now removes only verifiable script-owned artifacts.
- Harden reinjection against hostile or accidental collisions on the historical string global by using a symbol-backed primary lifecycle registry.
- Add bounded exact-window caching for repeated scans of the same region in very long TextNodes, with mutation invalidation and a small LRU limit.
- Bound Cross-TextNode sibling safety checks so the guard itself cannot re-parse an arbitrarily long TextNode tail.

### Regression Fixture v1.2

- Expand the browser-facing fixture from 160 to 166 cases across the same 20 sections.
- Preserve all prior 160 testcase rows and expectations unchanged.
- Add five Cross-TextNode truncated-prefix regressions (`host`, `path`, `query`, `fragment`, `www`) and one unsupported outer-scheme + `ttps://` regression.

### Validation

- Targeted parser regression: 30 / 30 PASS.
- Full Fixture parser regression: 151 / 151 PASS; 15 DOM-only cases covered by browser interaction.
- Full Fixture Chromium regression: 168 / 168 PASS across all 166 Fixture v1.2 cases.
- Unsupported outer-scheme probes: 10 / 10 PASS.
- v1.0.5 → v1.0.6 parser differential: 100,000 cases, 0 unexpected differences; 7,171 intentional differences limited to unsupported outer-scheme + missing-h suppression.
- Strict parser/fuzz: 131,995 checks; 100,000 fuzz cases; 0 crashes.
- Pathological parser medians on the final runner: bare 4.516 ms; `www.` 8.741 ms.
- Exact-window cache and Cross-TextNode long-tail boundedness gates: PASS.
- P0/P1 closure: PASS with no high- or medium-severity findings.
- Official IANA snapshot verification: country-code 248 / 248, delegated IDN 151 / 151, 0 missing / 0 extra.
- Full acceptance evidence: `tests/acceptance/v1.0.6.md`.

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
