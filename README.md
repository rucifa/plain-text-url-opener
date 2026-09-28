<p align="right"><strong>繁體中文</strong> · <a href="./README.en.md">English</a></p>

<div align="center">

# Plain Text URL Opener

**純文字網址雙擊開啟器**

</div>

Plain Text URL Opener 是一個輕量的 **userscript（使用者腳本）**。安裝後，只要在網頁上的**純文字網址直接雙擊**，就能開啟網址；不會把整頁文字改寫成超連結，也不會在背景持續掃描整個頁面。

> 🧪 **想先看看它怎麼運作？** [開啟公開測試頁 v1.4（176 個測試案例）](https://rucifa.github.io/plain-text-url-opener/?v=1.4)

---

## 安裝

第一次使用 userscript 時，請先安裝 userscript 管理器，再安裝本腳本。

### 1. 安裝 userscript 管理器

常見選擇包括：

| Userscript 管理器 | 說明 | 官方連結 |
|---|---|---|
| **Violentmonkey** | 常見的開源 userscript 管理器 | https://violentmonkey.github.io/ |
| **Tampermonkey** | 常見的跨瀏覽器 userscript 管理器 | https://www.tampermonkey.net/ |
| **Greasemonkey** | Firefox 上歷史悠久的 userscript 管理器 | https://addons.mozilla.org/firefox/addon/greasemonkey/ |

> Tampermonkey 與 Greasemonkey 是不同的專案；中文社群雖常把 Tampermonkey 稱為「油猴」，但兩者不是同一個擴充套件。

Plain Text URL Opener 使用 `@grant none`，不依賴特定管理器提供的 GM API。不過目前尚未對所有「瀏覽器 × userscript 管理器」組合完成完整相容性驗證，因此上表是常見選擇，不代表所有組合皆已完整測試。

### 2. 安裝 Plain Text URL Opener

**[安裝 `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)**

正常情況下，userscript 管理器會自動開啟安裝畫面；如果沒有自動攔截 Raw URL，也可以把網址手動匯入管理器。

### 固定使用特定版本

正式 Stable 版本會在 [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases) 提供同名的 `plain-text-url-opener.user.js`。如果你希望固定使用某個版本，建議從對應 Release 安裝該 `.user.js` 檔案。

GitHub 自動產生的 `Source code (zip)` / `Source code (tar.gz)` 主要是原始碼封存，不是一般使用者的主要安裝檔。

---

## 功能與操作

Plain Text URL Opener 解決的情境很單純：有些網頁、論壇、文件或系統畫面會顯示網址，但它只是**純文字**，不能直接點擊。

### 主要功能

- ✅ **雙擊純文字網址直接開啟**
- ✅ 預設在**新分頁**開啟
- ✅ `Shift + 雙擊`：改在**目前分頁**開啟
- ✅ `Alt + 雙擊`：只選取完整網址，不開啟
- ✅ 支援一般 `http://` / `https://`、`www.`、常見裸網域、IDN 與 Unicode 路徑／查詢字串
- ✅ 既有 `<a href>`、按鈕、輸入框、文字區域與可編輯內容會被忽略
- ✅ 可辨識 defanged URL；普通雙擊維持封鎖，`Ctrl + Shift + 雙擊` 可在重新驗證後明確開啟
- ✅ `@grant none`，不需要設定介面
- ✅ 不使用背景全頁掃描，也不會把正文網址改寫成 `<a>`

### 操作方式

| 操作 | 結果 |
|---|---|
| 雙擊 | 在新分頁開啟偵測到的網址 |
| `Shift + 雙擊` | 在目前分頁開啟 |
| `Ctrl + Shift + 雙擊`（Defanged URL） | 明確解除 Defanged block，重新驗證後以普通雙擊的模式開啟 |
| `Alt + 雙擊` | 選取完整網址，不開啟 |

### 範例

| 網頁中的文字 | 行為 |
|---|---|
| `https://example.com/path` | 雙擊即可開啟 |
| `www.example.com` | 雙擊即可開啟 |
| `example.com` | 依保守裸網域規則辨識 |
| `https://www.例え.jp/` | 支援 IDN |
| `https://example.com/wiki/臺灣` | 保留 Unicode 路徑 |
| `https://example.com/a).` | 排除句尾多餘的 `).` 後開啟 |
| `https://example.com/a)?15fdsa` | `)` 位於網址內容中時完整保留 |
| `https://shop.example.com/item?id=123&utm_source=test#reviews` | 保留 query 與 fragment |
| `hxxps://example.com` | 普通雙擊不開啟；`Ctrl + Shift + 雙擊` 可明確解鎖並重新驗證 |

---

## 目前支援範圍

### ✅ 支援

- 明確 `http://` / `https://` 網址
- `www.` 網址
- 依保守 TLD 規則辨識的裸網域
- 明確 IPv4 URL
- IPv6 網址
- 國際化網域名稱（IDN / Punycode）
- 含中文等 Unicode 文字的 path、query 與 `#` fragment
- 常見標點與括號邊界
- 部分缺少開頭 `h` 的 `ttp://` / `ttps://`
- 安全化／去活化網址（例如 `hxxps://`）可辨識；普通雙擊維持封鎖，`Ctrl + Shift + 雙擊` 可明確解鎖後重新驗證
- 同一段文字中存在多個網址

### ⛔ 刻意不支援 / 保守處理

- 跨文字節點（TextNode）重建完整網址
- 裸 IPv4
- 預設相對路徑
- 廣泛的非 HTTP(S) 網址協定
- 完整內嵌 Public Suffix List
- Shadow DOM 內的純文字網址不保證跨瀏覽器一致支援
- 部分省略 `http://` / `https://` 的國際化網域仍採保守辨識策略

這些是目前的產品邊界，不應自動視為 bug。

---

## 設計取向與相關工具

Plain Text URL Opener 專注於：

> **「看到純文字網址 → 雙擊 → 開啟」**

它刻意不修改正文 DOM、不把網址永久轉成連結、不持續監看整個頁面；只有在使用者互動時才解析附近文字。目標不是取代功能完整的 linkifier，而是把這個單一工作流程做到可靠、簡單且可驗證。

### 與 Text Link / Linkify Plus Plus 的差異

| 功能 / 設計取向 | **Plain Text URL Opener** | **[Text Link](https://addons.mozilla.org/firefox/addon/text-link/)** | **[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus)** |
|---|:---:|:---:|:---:|
| 雙擊純文字網址直接開啟 | ✅ | ✅ | ❌ |
| 不先把正文改寫成連結 | ✅ | ✅ | ❌ |
| 將文字網址轉成真正 `<a>` 連結 | ❌ | ❌ | ✅ |
| Unicode / 多位元網址處理 | ✅ | ✅ | ✅ |
| 跨 TextNode 重建完整網址 | ❌ 刻意不支援 | ✅ | ⚠️ README 未明確承諾 |
| 新增的動態文字內容 | ✅ 互動時即時辨識 | ⚠️ 實作方式不同 | ✅ |
| 自訂規則 / 白名單 / 黑名單 | ❌ | — | ✅ |

`❌` 在這裡代表設計取向不同，不代表功能較差；`⚠️` 則表示實作方式不適合直接用單一勾叉比較。

### 參考與致謝

本專案的設計與測試方法曾參考 [Text Link](https://addons.mozilla.org/firefox/addon/text-link/) 的公開說明與歷史 testcase，以及 [Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) 的公開文件。Plain Text URL Opener 的實作為獨立撰寫；除非 repo 內另有明確註記，否則未直接納入上述專案的原始碼。

---

## 版本與驗證

目前 Stable runtime：**Plain Text URL Opener v1.0.12**；最新 Regression Fixture：**v1.4**。

| 項目 | 狀態 |
|---|---|
| Stable version | **v1.0.12** |
| Regression Fixture | **v1.4 / 176 cases** |
| Chromium 實際瀏覽器互動（v1.0.12 + Fixture v1.4） | **178 / 178 PASS** |
| Firefox 實際瀏覽器互動（v1.0.12 + Fixture v1.4） | **178 / 178 PASS** |
| Userscript 實裝 / 圖示驗證 | **Firefox + Violentmonkey、Chromium 系 + Violentmonkey** |

> Fixture v1.4 包含 **176 個 testcase / 178 個預期 interaction**。它完整保留 v1.3 的 169 個既有 testcase 與 expected result，新增 7 個 Defanged URL override interaction 規格。普通雙擊仍對 Defanged URL fail closed；`Ctrl + Shift + 雙擊` 只解除 Defanged block，修復後重新走一般 HTTP(S)／安全驗證，且開啟模式與普通雙擊相同。v1.0.12 已在 Chromium 140 與 Firefox 141 完整通過 **178 / 178** 實際瀏覽器互動。

Fixture v1.4 已在 Chromium 140 與 Firefox 141 以 native mouse interaction 完整驗證；userscript 實裝與圖示顯示另已在 Firefox + Violentmonkey 與 Chromium 系瀏覽器 + Violentmonkey 確認。完整 v1.0.12 驗證證據請參閱 `tests/acceptance/v1.0.12.md`。

後續只有在發現新的實際邊界、回歸風險或明確規格需求時才新增 testcase；**不以增加案例數本身為目標**。

詳細版本變更請參閱 [CHANGELOG](./CHANGELOG.md) 與 [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases)。完整測試證據請參閱 [Acceptance Reports](./tests/acceptance/)；也可以直接開啟 [公開 Regression Fixture v1.4](https://rucifa.github.io/plain-text-url-opener/?v=1.4)。

---

## 測試與品質原則

- 行為變更必須先有可重現問題或明確規格需求。
- 優先採用最小修正，並重新執行固定 regression 與必要的實際瀏覽器測試。
- Fixture 是獨立測試規格，不會只為了讓目前實作通過而修改 expected result。

---

## License

Plain Text URL Opener 採用 **MIT License + Commons Clause License Condition v1.0**。

你可以依完整 License 條款使用、修改與重新散布軟體，但 Commons Clause 不授權將本軟體本身，或其主要價值實質來自本軟體功能的付費產品／服務，作為 `Sell` 的標的。

完整條款：[`LICENSE`](./LICENSE)

由於包含商業販售限制，本專案屬於 **source-available**，不是 OSI 定義下的 open source。
