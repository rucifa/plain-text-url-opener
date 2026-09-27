# Plain Text URL Opener

[English](./README.md) | [繁體中文](./README.zh-TW.md)

A lightweight userscript for opening plain-text HTTP(S) URLs by double-clicking them.

**Traditional Chinese name:** 純文字網址雙擊開啟器

## Design goals

- Event-driven; no background full-page scanning
- No DOM linkification
- No settings UI
- `@grant none`
- Final navigation is HTTP/HTTPS only
- Existing native links and editable/form controls are ignored
- Defanged URLs are detected but blocked from automatic opening
- Regression behavior is locked by a fixed browser fixture

## Usage

Install the userscript in a compatible userscript manager. Then double-click a supported plain-text URL on a web page.

Default interaction:

- Double-click: open the detected URL in a new tab
- Shift + double-click: reverse the open mode and use the current tab
- Alt + double-click: select the detected URL without opening it

## Current stable version

**v1.0.3 Stable**

Source: [`plain-text-url-opener.user.js`](./plain-text-url-opener.user.js)

Latest acceptance report: [`tests/acceptance/v1.0.3.md`](./tests/acceptance/v1.0.3.md)

## Regression fixture

The repository root [`index.html`](./index.html) is **Regression Fixture v1**.

The fixture is a fixed test specification: it defines inputs and expected results independently of any particular userscript version. Script changes must be tested against the fixture; the fixture is not automatically changed to match the current implementation.

When GitHub Pages is enabled from `main / (root)`, the fixture is intended to be available at:

`https://rucifa.github.io/plain-text-url-opener/`

## Intentional limitations

The following are currently outside the supported scope:

- Cross-TextNode URL reconstruction
- Bare IPv4 addresses
- Relative paths by default
- Broad non-HTTP(S) URI schemes
- Full Public Suffix List embedding
- Inaccessible content inside closed Shadow DOM
- Some scheme-less IDN forms remain intentionally conservative

These are design limitations, not automatic bug candidates.

## Validation philosophy

Changes should follow:

1. Reproduce a concrete bug or regression.
2. Apply the smallest behavior-preserving fix.
3. Run deterministic regression tests, browser interaction tests, and relevant performance checks.
4. Add a permanent regression case only when a real bug or an intentional specification change justifies it.

Historical acceptance reports are preserved under [`tests/acceptance/`](./tests/acceptance/).

## Background and acknowledgements

Plain Text URL Opener was informed by long-standing tools that solve related plain-text URL problems, especially:

- **Text Link** by Piro — its double-click-to-open workflow, its emphasis on handling URI text without rewriting page appearance, and its public testcase corpus were important references during design and regression testing.
- **Linkify Plus Plus** by eight04 — a broader linkification userscript/extension that detects text URLs and converts them into links, with support for dynamic content, Unicode, and custom rules. Its approach helped clarify the intentionally narrower scope of Plain Text URL Opener: event-driven detection without DOM linkification or background full-page processing.

This repository's implementation is independently written. No source code from those projects is incorporated unless explicitly stated in the repository.

Related projects:

- Text Link: https://addons.mozilla.org/firefox/addon/text-link/
- Text Link historical documentation/testcases: https://piro.sakura.ne.jp/xul/textlink/index.html.en
- Linkify Plus Plus: https://github.com/eight04/linkify-plus-plus

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## License

No license has been selected yet. Until a license is explicitly added, the repository should not be assumed to grant reuse, modification, or redistribution rights beyond those provided by applicable law and platform terms.
