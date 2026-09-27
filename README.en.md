<div align="center">

# Plain Text URL Opener

**Double-click plain-text URLs to open them.**

No DOM linkification, no background full-page scanning, and no settings UI required.

[繁體中文](./README.md) · **English** · [Regression Fixture](https://rucifa.github.io/plain-text-url-opener/)

</div>

---

## What does this script do?

Some webpages, forums, documents, and internal systems display URLs as **plain text** rather than clickable links.

Plain Text URL Opener lets you act on the URL directly without selecting the whole string, copying it, and pasting it into the address bar.

### Main features

- ✅ **Double-click a plain-text URL to open it**
- ✅ Opens in a **new tab** by default
- ✅ `Shift + double-click`: use the current tab instead
- ✅ `Alt + double-click`: select the full URL without opening it
- ✅ Supports ordinary `http://` / `https://`, `www.`, conservative bare domains, IDNs, and Unicode paths / queries
- ✅ Ignores existing `<a href>` links, buttons, form controls, and editable content
- ✅ Detects defanged URLs but **does not automatically open them**
- ✅ `@grant none`
- ✅ No settings UI
- ✅ No background full-page scanning
- ✅ Does not rewrite text URLs into `<a>` elements

### Examples

| Text on the page | Behavior |
|---|---|
| `https://example.com/path` | Double-click to open |
| `www.example.com` | Double-click to open |
| `example.com` | Detected under the conservative bare-domain policy |
| `https://www.例え.jp/` | IDN supported |
| `https://example.com/wiki/臺灣` | Unicode path preserved |
| `hxxps://example.com` | Detected, but not automatically opened |

---

## How is it different from Text Link / Linkify Plus Plus?

These tools solve related problems, but they make **different design choices**. This is not a ranking; it is a quick way to see which approach fits your workflow.

| Feature / design choice | **Plain Text URL Opener** | **Text Link** | **Linkify Plus Plus** |
|---|:---:|:---:|:---:|
| Double-click plain-text URL to open directly | ✅ | ✅ | ❌ |
| Works without first rewriting page text into links | ✅ | ✅ | ❌ |
| Converts text URLs into real `<a>` links | ❌ | ❌ | ✅ |
| Unicode / multibyte URL handling | ✅ | ✅ | ✅ |
| Reconstruct URLs split across TextNodes | ❌ intentionally unsupported | ✅ | ⚠️ not explicitly promised in README |
| Newly inserted text content | ✅ detected at interaction time | ⚠️ different implementation model | ✅ dynamic content support |
| Custom rules | ❌ | — | ✅ |
| Whitelist / blacklist | ❌ | — | ✅ |
| Userscript distribution | ✅ | ❌ | ✅ |
| Firefox extension | ❌ | ✅ | ✅ |
| Public test page / testcase corpus | ✅ fixed fixture | ✅ | ✅ |

> `❌` does not mean “worse”; it means that capability is **not the design direction chosen by that tool**.  
> `⚠️` means the feature or implementation differs enough that a simple yes/no comparison would be misleading.  
> `—` means the public documentation does not make that item a primary comparison point, so no assumption is made here.

### Plain Text URL Opener's focus

If what you want is simply:

> **“See a plain-text URL → double-click → open it.”**

and you prefer:

- no page-layout changes
- no background whole-page scanning
- no large configuration surface
- no permanent linkification of all detected URLs
- a small, single-file, event-driven userscript with a fixed regression fixture

then Plain Text URL Opener is intentionally designed around that narrower use case.

### Text Link

[Piro's Text Link](https://addons.mozilla.org/firefox/addon/text-link/) is a long-running Firefox extension built around the same core interaction: **double-click a plain-text URI to open it**. It explicitly supports URIs split across multiple TextNodes and multibyte URI text, while avoiding page rewriting.

Its historical testcase corpus was also an important reference when this project established its regression-testing approach.

- Firefox Add-ons: https://addons.mozilla.org/firefox/addon/text-link/
- Historical documentation / testcases: https://piro.sakura.ne.jp/xul/textlink/index.html.en

### Linkify Plus Plus

[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) takes a different approach: it **detects text URLs and converts them into real links**. It supports dynamic content, Unicode, custom rules, whitelist / blacklist controls, image embedding, and multiple trigger methods.

If you want plain-text URLs to become clickable links directly inside the page, Linkify Plus Plus offers a broader feature set. Plain Text URL Opener intentionally avoids DOM linkification.

---

## Installation

Plain Text URL Opener is a **userscript**. If you have not used userscripts before, install a userscript manager in your browser first, then install the script itself.

### 1. Install a userscript manager

Common options include:

| Userscript manager | Notes | Official link |
|---|---|---|
| **Violentmonkey** | Popular open-source userscript manager | https://violentmonkey.github.io/ |
| **Tampermonkey** | Popular cross-browser userscript manager | https://www.tampermonkey.net/ |
| **Greasemonkey** | Long-running userscript manager for Firefox | https://addons.mozilla.org/firefox/addon/greasemonkey/ |

Plain Text URL Opener uses `@grant none` and does not depend on manager-specific GM APIs. However, the project has not yet completed exhaustive validation across every browser × userscript-manager combination, so the table lists common options rather than claiming full compatibility for every combination.

### 2. Install Plain Text URL Opener

After installing a userscript manager, open the script below:

**[Install `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)**

Normally, your userscript manager should open its installation screen automatically. If it does not intercept the Raw URL, import that URL manually in the manager.

### GitHub Releases

Stable versions are intended to be published on [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases) using the same primary asset name:

`plain-text-url-opener.user.js`

If you want to stay on a specific version, download the `.user.js` asset from that release. GitHub's automatically generated `Source code (zip)` / `Source code (tar.gz)` archives are mainly for source-code snapshots and are not the primary installation files for regular users.

### Source

[`plain-text-url-opener.user.js`](./plain-text-url-opener.user.js)

---

## Controls

| Action | Result |
|---|---|
| Double-click | Open the detected URL in a new tab |
| `Shift + double-click` | Reverse the open mode and use the current tab |
| `Alt + double-click` | Select the full URL without opening it |

---

## Current support scope

### ✅ Supported

- Explicit `http://` / `https://` URLs
- `www.` URLs
- Bare domains under a conservative TLD policy
- Explicit IPv4 URLs
- IPv6 URLs
- IDN / Punycode
- Unicode path / query / fragment
- Common punctuation and bracket boundaries
- Some missing-leading-`h` forms such as `ttp://` / `ttps://`
- Defanged URL detection without automatic opening
- Multiple URLs inside one TextNode

### ⛔ Intentionally unsupported / conservative

- Cross-TextNode URL reconstruction
- Bare IPv4
- Relative paths by default
- Broad non-HTTP(S) URI schemes
- A full embedded Public Suffix List
- Inaccessible content inside closed Shadow DOM
- Some scheme-less IDN forms remain deliberately conservative

These are current product boundaries and should not automatically be treated as bugs.

---

## Why not just turn every URL into a link?

Because this project deliberately chooses another approach:

- **Do not rewrite the page's text DOM**
- **Do not continuously observe the whole page**
- **Do not perform background full-page linkification**
- Parse nearby text lazily only when the user interacts with it

The goal is not to replace full-featured linkifiers. It is to make the “double-click a plain-text URL” workflow reliable while keeping the execution surface and behavior small.

---

## Version and validation

Current stable version: **v1.0.4**

v1.0.4 is a publication-metadata release. URL parsing, DOM handling, and interaction behavior are inherited unchanged from the validated v1.0.3 implementation.

- Latest Acceptance Report: [`tests/acceptance/v1.0.4.md`](./tests/acceptance/v1.0.4.md)
- Historical Acceptance Reports: [`tests/acceptance/`](./tests/acceptance/)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)

### Regression Fixture

The repository root [`index.html`](./index.html) is **Regression Fixture v1**.

The fixture is versioned independently from userscript releases. Script changes are validated against the fixture; the fixture is not rewritten merely to make a new script release pass.

**Live Fixture:** https://rucifa.github.io/plain-text-url-opener/

---

## Validation philosophy

Behavior changes should generally follow this sequence:

1. Reproduce a concrete bug / regression.
2. Apply the smallest fix.
3. Run deterministic regression tests, browser interaction tests, and relevant performance checks.
4. Change permanent regression cases only for a real bug, a confirmed fixture error, or an intentional product-specification change.

---

## Background and acknowledgements

Plain Text URL Opener's design and regression work were informed by publicly documented behavior and testcase ideas from related tools, especially:

- **Text Link** — Piro
- **Linkify Plus Plus** — eight04

This repository's implementation is independently written. No source code from those projects is incorporated unless explicitly stated in this repository.

---

## License

Plain Text URL Opener is licensed under the **MIT License with the Commons Clause License Condition v1.0**.

Under the full License terms, you may use, modify, and redistribute the software, but the Commons Clause does not grant the right to `Sell` the software or a paid product/service whose value derives entirely or substantially from the Software's functionality.

Full terms: [`LICENSE`](./LICENSE)

Because the license includes a commercial-sale restriction, this project is **source-available**, not OSI-defined open source.
