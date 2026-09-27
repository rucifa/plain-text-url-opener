<div align="center">

# Plain Text URL Opener

**純文字網址雙擊開啟器**

雙擊網頁上的純文字 HTTP(S) 網址，直接開啟。  
不改寫正文 DOM、不做背景全頁掃描、不需要設定介面。

**繁體中文** · [English](./README.en.md) · [Regression Fixture](https://rucifa.github.io/plain-text-url-opener/)

</div>

---

## 這個腳本可以做什麼？

有些網頁、論壇、文件或系統畫面會顯示網址，但它只是**純文字**，不是可以直接點擊的連結。

Plain Text URL Opener 讓你直接在網址文字上操作，不需要先完整選取、複製，再貼到網址列。

### 主要功能

- ✅ **雙擊純文字網址直接開啟**
- ✅ 預設在**新分頁**開啟
- ✅ `Shift + 雙擊`：改用目前分頁開啟
- ✅ `Alt + 雙擊`：只選取完整網址，不開啟
- ✅ 支援一般 `http://` / `https://`、`www.`、常見裸網域、IDN 與 Unicode 路徑／查詢字串
- ✅ 既有 `<a href>`、按鈕、輸入框、文字區域與可編輯內容會被忽略
- ✅ 可辨識 defanged URL，但**不會自動開啟**
- ✅ `@grant none`
- ✅ 不需要設定介面
- ✅ 不使用背景全頁掃描
- ✅ 不把正文中的網址改寫成 `<a>`

### 簡單範例

| 網頁中的文字 | 行為 |
|---|---|
| `https://example.com/path` | 雙擊即可開啟 |
| `www.example.com` | 雙擊即可開啟 |
| `example.com` | 依保守裸網域規則辨識 |
| `https://www.例え.jp/` | 支援 IDN |
| `https://example.com/wiki/臺灣` | 保留 Unicode 路徑 |
| `hxxps://example.com` | 可辨識，但不自動開啟 |

---

## 與 Text Link / Linkify Plus Plus 有什麼不同？

這三個工具處理的問題相近，但**設計方向不同**。下面不是優劣排名，而是幫助你快速判斷哪一種方式比較適合自己。

| 功能 / 設計取向 | **Plain Text URL Opener** | **Text Link** | **Linkify Plus Plus** |
|---|:---:|:---:|:---:|
| 雙擊純文字網址直接開啟 | ✅ | ✅ | ❌ |
| 不先把正文改寫成連結 | ✅ | ✅ | ❌ |
| 將文字網址轉成真正 `<a>` 連結 | ❌ | ❌ | ✅ |
| Unicode / 多位元網址處理 | ✅ | ✅ | ✅ |
| 跨 TextNode 重建完整網址 | ❌ 刻意不支援 | ✅ | ⚠️ README 未明確承諾 |
| 新出現的文字內容 | ✅ 互動時即時辨識 | ⚠️ 實作方式不同 | ✅ 支援 dynamic content |
| 自訂規則 | ❌ | — | ✅ |
| Whitelist / blacklist | ❌ | — | ✅ |
| Userscript 形式 | ✅ | ❌ | ✅ |
| Firefox 擴充套件 | ❌ | ✅ | ✅ |
| 公開測試頁 / testcase | ✅ 固定 Fixture | ✅ | ✅ |

> `❌` 不代表功能較差，而是代表該功能**不是這個工具選擇的設計方向**。  
> `⚠️` 代表功能或實作方式與另外兩者不同，不適合用單一勾叉直接等同比較。  
> `—` 代表官方公開說明中不是主要比較重點，因此不在這裡做推定。

### Plain Text URL Opener 的定位

如果你想要的是：

> **「看到純文字網址 → 雙擊 → 開啟」**

而且希望：

- 不改變原網頁排版
- 不在背景掃描整個頁面
- 不需要大量設定
- 不把所有網址永久轉成超連結
- 腳本本身維持單檔、事件驅動、可驗證

那 Plain Text URL Opener 就是針對這個較窄、較簡單的使用情境設計。

### Text Link

[Piro 的 Text Link](https://addons.mozilla.org/firefox/addon/text-link/) 是這類工具中歷史悠久的 Firefox 擴充套件。它同樣主打**雙擊純文字 URI 直接開啟**，並明確支援跨多個 TextNode 的 URI、多位元文字 URI，而且不需要把頁面文字改寫成連結。

Text Link 的歷史 testcase 也是本專案建立 regression 思維時的重要參考之一。

- Firefox Add-ons: https://addons.mozilla.org/firefox/addon/text-link/
- 歷史文件 / testcase: https://piro.sakura.ne.jp/xul/textlink/index.html.en

### Linkify Plus Plus

[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) 採用另一條路線：它會**偵測文字網址並轉成真正的連結**，並提供 dynamic content、Unicode、自訂規則、whitelist / blacklist、圖片嵌入與多種觸發方式。

如果你希望網頁上的純文字網址在頁面中直接變成可點擊連結，Linkify Plus Plus 的功能範圍會比本專案更完整；Plain Text URL Opener 則刻意避免 DOM linkification。

---

## 安裝

需要相容的 userscript 管理器。

### 直接安裝

**[安裝 `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)**

如果 userscript 管理器沒有自動攔截 Raw URL，請在管理器中手動匯入該網址。

### 原始碼

[`plain-text-url-opener.user.js`](./plain-text-url-opener.user.js)

---

## 操作方式

| 操作 | 結果 |
|---|---|
| 雙擊 | 在新分頁開啟偵測到的網址 |
| `Shift + 雙擊` | 反轉開啟模式，使用目前分頁 |
| `Alt + 雙擊` | 只選取完整網址，不開啟 |

---

## 目前支援範圍

### ✅ 支援

- 明確 `http://` / `https://` 網址
- `www.` 網址
- 依保守 TLD 規則辨識的裸網域
- 明確 IPv4 URL
- IPv6 URL
- IDN / Punycode
- Unicode path / query / fragment
- 常見標點與括號邊界
- 部分缺少開頭 `h` 的 `ttp://` / `ttps://`
- Defanged URL 偵測，但禁止自動開啟
- 同一 TextNode 中存在多個 URL

### ⛔ 刻意不支援 / 保守處理

- 跨 TextNode 重建完整 URL
- 裸 IPv4
- 預設相對路徑
- 廣泛的非 HTTP(S) URI scheme
- 完整 Public Suffix List
- closed Shadow DOM 內無法存取的內容
- 部分 scheme-less IDN 維持保守辨識策略

這些是目前的產品邊界，不應自動視為 bug。

---

## 為什麼不直接把所有網址變成連結？

因為本專案刻意選擇另一個方向：

- **不修改正文 DOM**
- **不長時間監看整頁變化**
- **不做背景全頁 linkification**
- 只有在滑鼠互動時才對附近文字做 lazy parsing

目的不是取代功能完整的 linkifier，而是把「雙擊純文字網址」這件事情做到足夠可靠，同時維持較小的執行面積與較單純的行為。

---

## 版本與驗證

目前 Stable 版本：**v1.0.4**

v1.0.4 是 publication metadata release；URL parser、DOM handling 與使用者互動行為沿用已驗證的 v1.0.3。

- 最新 Acceptance Report：[`tests/acceptance/v1.0.4.md`](./tests/acceptance/v1.0.4.md)
- 歷史 Acceptance Reports：[`tests/acceptance/`](./tests/acceptance/)
- Changelog：[`CHANGELOG.md`](./CHANGELOG.md)

### Regression Fixture

Repo 根目錄的 [`index.html`](./index.html) 是 **Regression Fixture v1**。

Fixture 是獨立於 userscript release version 的固定測試規格。腳本修改後要拿新版腳本去接受 Fixture 驗證，而不是修改 Fixture 讓新版腳本通過。

**Live Fixture：** https://rucifa.github.io/plain-text-url-opener/

---

## 驗證原則

每次功能修改原則上遵循：

1. 先重現明確且可重現的 bug / regression。
2. 採用最小修正。
3. 執行 deterministic regression、瀏覽器互動測試與必要效能檢查。
4. 只有發現真實 bug、Fixture 錯誤或產品規格正式變更時，才修改永久 regression case。

---

## 背景與致謝

Plain Text URL Opener 的設計與 regression 測試曾參考相關工具的公開行為與 testcase，尤其包括：

- **Text Link** — Piro
- **Linkify Plus Plus** — eight04

本 repo 的實作為獨立撰寫；除非 repo 內另有明確註記，否則未直接納入上述專案的原始碼。

---

## License

Plain Text URL Opener 採用 **MIT License + Commons Clause License Condition v1.0**。

你可以依完整 License 條款使用、修改與重新散布軟體，但 Commons Clause 不授權將本軟體本身，或其主要價值實質來自本軟體功能的付費產品／服務，作為 `Sell` 的標的。

完整條款：[`LICENSE`](./LICENSE)

由於包含商業販售限制，本專案屬於 **source-available**，不是 OSI 定義下的 open source。
