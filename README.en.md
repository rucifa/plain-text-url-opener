<p align="right"><a href="./README.md">繁體中文</a> · <strong>English</strong></p>

<div align="center">

# Plain Text URL Opener

**Double-click plain-text URLs to open them.**

</div>

Plain Text URL Opener is a **userscript**. It requires a userscript manager such as [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/).

Once installed, double-click a **plain-text URL** on a webpage to open it. The script does not rewrite the whole page into links or continuously scan the page in the background.

> 🧪 **Want to see how it works first?** [Open public test page v1.2 (166 fixed cases)](https://rucifa.github.io/plain-text-url-opener/?v=1.2)

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

| Feature / design choice | **Plain Text URL Opener** | **[Text Link](https://addons.mozilla.org/firefox/addon/text-link/)** | **[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus)** |
|---|:---:|:---:|:---:|
| Double-click plain-text URL to open directly | ✅ | ✅ | ❌ |
| Works without first rewriting page text into links | ✅ | ✅ | ❌ |
| Converts text URLs into real `<a>` links | ❌ | ❌ | ✅ |
| Unicode / multibyte URL handling | ✅ | ✅ | ✅ |
| Reconstruct URLs split across text nodes (TextNodes) | ❌ intentionally unsupported | ✅ | ⚠️ not explicitly promised in README |
| Newly inserted text content | ✅ detected at interaction time | ⚠️ different implementation model | ✅ dynamic content support |
| Custom rules | ❌ | — | ✅ |
| Whitelist / blacklist | ❌ | — | ✅ |
| Userscript distribution | ✅ | ❌ | ✅ |
| Firefox extension | ❌ | ✅ | ✅ |
| Public test page / fixed test cases | ✅ | ✅ | ✅ |

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

- Firefox Add-ons: https://addons.mozilla.org/firefox/addon/text-link/
- Historical documentation / testcases: https://piro.sakura.ne.jp/xul/textlink/index.html.en

### Linkify Plus Plus

[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) takes a different approach: it **detects text URLs and converts them into real links**. It supports dynamic content, Unicode, custom rules, whitelist / blacklist controls, image embedding, and multiple trigger methods.

If you want plain-text URLs to become clickable links directly inside the page, Linkify Plus Plus offers a broader feature set. Plain Text URL Opener intentionally avoids DOM linkification.

### References and acknowledgements

Plain Text URL Opener's design and testing approach were informed by the public documentation and test cases of the two related projects above. [Text Link](https://addons.mozilla.org/firefox/addon/text-link/)'s historical testcase corpus was an important reference for this project's fixed-regression-testing approach, while [Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) provides a useful contrast through its linkification-oriented design.

This repository's implementation is independently written. No source code from those projects is incorporated unless explicitly stated in this repository.

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
- Plain-text URLs inside Shadow DOM are not guaranteed to behave identically across browsers; closed Shadow DOM especially depends on browser event and Selection behavior
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

## Version and testing

Current stable version: **v1.0.10**

v1.0.10 is the current Stable baseline. This release only optimizes the official icon PNG compression and userscript `@icon` metadata: the 64×64 RGBA PNG is reduced from **16,516 bytes** to **5,697 bytes**, with successful installation/render checks on Firefox + Violentmonkey and Chromium-family browsers + Violentmonkey. URL detection, DOM interaction, navigation, security boundaries, and performance logic are unchanged.

| Item | Status |
|---|---|
| Regression Fixture | **v1.3 / 169 cases** |
| v1.0.10 icon / metadata acceptance | **PASS** |
| v1.0.9 Integration Audit | **PASS** |
| Full core behavioral acceptance baseline | **v1.0.6** |
| Firefox / Chromium family | ✅ Real-browser and userscript-manager icon checks completed |

For detailed release history, see the [CHANGELOG](./CHANGELOG.md) and [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases).

For complete validation evidence, see the [Acceptance Reports](./tests/acceptance/), or open the [public Regression Fixture v1.3](https://rucifa.github.io/plain-text-url-opener/?v=1.3).

---

## Testing and quality principles

Behavior changes should generally follow this sequence:

1. Reproduce a concrete bug or regression.
2. Apply the smallest fix.
3. Run fixed regression tests, real browser interaction tests, and relevant performance checks.
4. Change fixed test cases only when the test itself is wrong or the product specification intentionally changes.

---

## License

Plain Text URL Opener is licensed under the **MIT License with the Commons Clause License Condition v1.0**.

Under the full License terms, you may use, modify, and redistribute the software, but the Commons Clause does not grant the right to `Sell` the software or a paid product/service whose value derives entirely or substantially from the Software's functionality.

Full terms: [`LICENSE`](./LICENSE)

Because the license includes a commercial-sale restriction, this project is **source-available**, not OSI-defined open source.