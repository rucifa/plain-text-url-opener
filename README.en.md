<p align="right"><a href="./README.md">繁體中文</a> · <strong>English</strong></p>

<div align="center">

# Plain Text URL Opener

**Double-click plain-text URLs to open them.**

</div>

Plain Text URL Opener is a lightweight **userscript**. Once installed, double-click a **plain-text URL** on a webpage to open it. The script does not rewrite the whole page into links or continuously scan the page in the background.

> 🧪 **Want to see how it works first?** [Open public test page v1.3 (169 fixed cases)](https://rucifa.github.io/plain-text-url-opener/?v=1.3)

---

## Installation

If you have not used userscripts before, install a userscript manager first, then install Plain Text URL Opener.

### 1. Install a userscript manager

Common options include:

| Userscript manager | Notes | Official link |
|---|---|---|
| **Violentmonkey** | Popular open-source userscript manager | https://violentmonkey.github.io/ |
| **Tampermonkey** | Popular cross-browser userscript manager | https://www.tampermonkey.net/ |
| **Greasemonkey** | Long-running userscript manager for Firefox | https://addons.mozilla.org/firefox/addon/greasemonkey/ |

Plain Text URL Opener uses `@grant none` and does not depend on manager-specific GM APIs. However, the project has not completed exhaustive validation across every browser × userscript-manager combination, so the table lists common choices rather than claiming full compatibility for every combination.

### 2. Install Plain Text URL Opener

**[Install `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)**

Normally, your userscript manager should open its installation screen automatically. If it does not intercept the Raw URL, import that URL manually in the manager.

### Pin a specific version

Stable versions are published on [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases) using the same `plain-text-url-opener.user.js` asset name. If you want to stay on a specific version, install the `.user.js` file from that release.

GitHub's automatically generated `Source code (zip)` / `Source code (tar.gz)` archives are mainly source snapshots, not the primary installation files for regular users.

---

## Features and controls

Plain Text URL Opener solves a simple problem: some webpages, forums, documents, and internal systems display URLs as **plain text** rather than clickable links.

### Main features

- ✅ **Double-click a plain-text URL to open it**
- ✅ Opens in a **new tab** by default
- ✅ `Shift + double-click`: open in the **current tab**
- ✅ `Alt + double-click`: select the full URL without opening it
- ✅ Supports ordinary `http://` / `https://`, `www.`, conservative bare domains, IDNs, and Unicode paths / queries
- ✅ Ignores existing `<a href>` links, buttons, form controls, and editable content
- ✅ Detects defanged URLs but **does not automatically open them**
- ✅ `@grant none` and no settings UI
- ✅ No background full-page scanning and no DOM linkification

### Controls

| Action | Result |
|---|---|
| Double-click | Open the detected URL in a new tab |
| `Shift + double-click` | Open in the current tab |
| `Alt + double-click` | Select the full URL without opening it |

### Examples

| Text on the page | Behavior |
|---|---|
| `https://example.com/path` | Double-click to open |
| `www.example.com` | Double-click to open |
| `example.com` | Detected under the conservative bare-domain policy |
| `https://www.例え.jp/` | IDN supported |
| `https://example.com/wiki/臺灣` | Unicode path preserved |
| `https://example.com/a).` | Extra trailing `).` is excluded |
| `https://example.com/a)?15fdsa` | `)` is preserved when it remains part of the URL |
| `https://shop.example.com/item?id=123&utm_source=test#reviews` | Query and fragment are preserved |
| `hxxps://example.com` | Detected, but not automatically opened |

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
- Plain-text URLs inside Shadow DOM are not guaranteed to behave identically across browsers
- Some scheme-less IDN forms remain deliberately conservative

These are current product boundaries and should not automatically be treated as bugs.

---

## Design focus and related tools

Plain Text URL Opener is intentionally focused on:

> **“See a plain-text URL → double-click → open it.”**

It does not rewrite page text, permanently convert URLs into links, or continuously observe the whole page. Nearby text is parsed only when the user interacts with it. The goal is not to replace full-featured linkifiers, but to make this one workflow reliable, simple, and verifiable.

### How it differs from Text Link / Linkify Plus Plus

| Feature / design choice | **Plain Text URL Opener** | **[Text Link](https://addons.mozilla.org/firefox/addon/text-link/)** | **[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus)** |
|---|:---:|:---:|:---:|
| Double-click plain-text URL to open directly | ✅ | ✅ | ❌ |
| Works without first rewriting page text into links | ✅ | ✅ | ❌ |
| Converts text URLs into real `<a>` links | ❌ | ❌ | ✅ |
| Unicode / multibyte URL handling | ✅ | ✅ | ✅ |
| Reconstruct URLs split across TextNodes | ❌ intentionally unsupported | ✅ | ⚠️ not explicitly promised in README |
| Newly inserted text content | ✅ detected at interaction time | ⚠️ different implementation model | ✅ |
| Custom rules / whitelist / blacklist | ❌ | — | ✅ |

Here, `❌` means a different design choice rather than “worse”; `⚠️` means the implementation is not suitable for a simple yes/no comparison.

### References and acknowledgements

This project's design and testing approach were informed by the public documentation and historical testcases of [Text Link](https://addons.mozilla.org/firefox/addon/text-link/) and the public documentation of [Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus). Plain Text URL Opener is independently implemented; no source code from those projects is incorporated unless explicitly stated in this repository.

---

## Version and validation

Current Stable baseline: **Plain Text URL Opener v1.0.11 + Regression Fixture v1.3**.

| Item | Status |
|---|---|
| Stable version | **v1.0.11** |
| Regression Fixture | **v1.3 / 169 cases** |
| Chromium real-browser interaction | **171 / 171 PASS** |
| Firefox real-browser interaction | **171 / 171 PASS** |
| Userscript installation / icon rendering | **Firefox + Violentmonkey, Chromium family + Violentmonkey** |

> Fixture v1.3 contains **169 testcases**. Two of those testcases contain two independently actionable URLs, so the complete real-browser run performs **171 interactions**.

The full Fixture was validated with native mouse interaction on Chromium 140 and Firefox 141. Userscript installation and icon rendering were separately confirmed on Firefox + Violentmonkey and Chromium-family browsers + Violentmonkey. This does not claim exhaustive validation of every browser × userscript-manager combination.

Future testcases are added only when a new real-world boundary, regression risk, or explicit specification need is identified; **the project does not increase Fixture size merely to increase the case count**.

For detailed release history, see the [CHANGELOG](./CHANGELOG.en.md) and [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases). For complete validation evidence, see the [Acceptance Reports](./tests/acceptance/), or open the [public Regression Fixture v1.3](https://rucifa.github.io/plain-text-url-opener/?v=1.3).

---

## Testing and quality principles

- Behavioral changes should start from a reproducible problem or an explicit specification need.
- Prefer the smallest fix, then rerun fixed regressions and the relevant real-browser checks.
- The Fixture is an independent test specification; expected results are not changed merely to make the current implementation pass.

---

## License

Plain Text URL Opener is licensed under the **MIT License with the Commons Clause License Condition v1.0**.

Under the full License terms, you may use, modify, and redistribute the software, but the Commons Clause does not grant the right to `Sell` the software or a paid product/service whose value derives entirely or substantially from the Software's functionality.

Full terms: [`LICENSE`](./LICENSE)

Because the license includes a commercial-sale restriction, this project is **source-available**, not OSI-defined open source.
