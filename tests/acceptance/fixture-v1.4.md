# Regression Fixture v1.4 — Acceptance Report

## Decision

**GO — Fixture specification update accepted. Runtime implementation intentionally remains unchanged in this step.**

This report records an intentional product-specification change separately from the Stable userscript implementation.

## Canonical baseline

- baseline `main`: `00ec869599fa21279c1d7cfbf95fd7f4add8166f`
- Stable userscript at Reproduce time: **v1.0.11**
- previous Fixture: **v1.3 / 169 cases / 171 interactions**

## Fixture v1.4 artifact

- path: `index.html`
- version: **v1.4**
- cases: **176**
- expected browser interactions: **178**
- Git blob SHA: `e6691159267bb47a9f1644bf2570c49775a9cb77`
- SHA-256: `08ca17d239b10e1c11f1c37333017448a046144a9ccdb8394b919e3ad71be791`
- existing v1.3 expected-result changes: **0**

## Specification change

Defanged URLs remain parser-recognized and blocked by default.

1. **Ordinary double-click:** a Defanged URL remains fail closed and must not navigate.
2. **Ctrl + Shift + double-click:** this is an explicit user override for the `defanged` block only.
3. The restored URL must still pass the normal HTTP(S) validation path before navigation is allowed.
4. Existing warnings / safety properties discovered after restoration are not bypassed. In particular, User Info remains visible as a warning.
5. `Ctrl` alone and `Shift` alone do not grant the override.
6. The override chord does **not** choose a different open mode. After authorization, navigation must use the same open mode as ordinary double-click. In the current product configuration, ordinary double-click opens a new tab; the `Shift` inside `Ctrl + Shift + double-click` is part of the authorization gesture and must not trigger the normal Shift open-mode reversal.

The override is intentionally narrow. It is not a generic "force open blocked content" mechanism.

## New regression cases

| Case | Input / gesture | Expected interaction |
|---|---|---|
| `security-override-01` | `hxxp://example.com` + Ctrl+Shift double-click | navigate to `http://example.com/` |
| `security-override-02` | `hxxps://example.com` + Ctrl+Shift double-click | navigate to `https://example.com/` |
| `security-override-03` | `h**ps://example.com` + Ctrl+Shift double-click | navigate to `https://example.com/` |
| `security-override-04` | `h++p://example.com` + Ctrl+Shift double-click | navigate to `http://example.com/` |
| `security-override-05` | `hxxps://google.com@evil.example/` + Ctrl+Shift double-click | navigate after normal revalidation; User Info warning remains |
| `security-override-06` | `hxxps://example.com` + Ctrl-only double-click | remain blocked |
| `security-override-07` | `hxxps://example.com` + Shift-only double-click | remain blocked |

The existing `security-01` through `security-04` cases remain unchanged and continue to specify ordinary-double-click blocking. The five positive override rows additionally require the same open-mode behavior as ordinary double-click; no extra testcase is needed because this is a clarification of the interaction expectation, not a new URL-recognition case.

## Machine-readable interaction metadata

Fixture v1.4 adds interaction-layer metadata only to the seven new rows:

- `data-interaction="ctrl-shift-double-click"`
- `data-interaction="ctrl-double-click"`
- `data-interaction="shift-double-click"`
- `data-expect-navigation="true|false"`
- `data-expect-open-mode="same-as-ordinary-double-click"` on the five positive override rows
- `data-expect-post-warning="none|user-info|defanged"`

`data-expect-blocked="true"` remains true on all seven rows because that field describes the parser candidate before an interaction override. The new navigation fields describe the separate interaction layer.

## Reproduce result against Stable v1.0.11

A fresh Chromium native-mouse targeted run was executed before any runtime change:

- five Ctrl+Shift positive override cases: **5 / 5 reproduced as not implemented** (no navigation)
- Ctrl-only negative control: **PASS — remained blocked**
- Shift-only negative control: **PASS — remained blocked**
- Fixture structural validation: **PASS — 176 unique case IDs**

This is the intended Reproduce state: Fixture v1.4 defines the new specification first, while Stable v1.0.11 still implements the previous behavior.

## Scope boundary

This acceptance does **not** claim that v1.0.11 passes Fixture v1.4. No userscript runtime code, userscript version, tag, or GitHub Release is changed by this Fixture-only step.

The next Implementation phase should use these five positive override interactions as the regression target, then rerun the complete browser suite before any runtime release.
