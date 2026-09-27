<div align="center">

# Plain Text URL Opener

**純文字網址雙擊開啟器**

Plain Text URL Opener 是一個 **userscript（使用者腳本）**，需要搭配
[Violentmonkey](https://violentmonkey.github.io/)、[Tampermonkey](https://www.tampermonkey.net/) 等 userscript 管理器使用。

安裝後，只要在網頁上的**純文字網址直接雙擊**，就能開啟網址；不會把整個網頁的文字改寫成超連結，也不會在背景持續掃描整個頁面。

**[開啟測試頁](https://rucifa.github.io/plain-text-url-opener/)**

**繁體中文** · [English](./README.en.md)

</div>

---

## 安裝

Plain Text URL Opener 是一個 **userscript（使用者腳本）**。第一次使用時，需要先在瀏覽器安裝 userscript 管理器，再安裝本腳本。

### 1. 安裝 userscript 管理器

你可以選擇常見的 userscript 管理器，例如：

| Userscript 管理器 | 說明 | 官方連結 |
|---|---|---|
| **Violentmonkey** | 常見的開源 userscript 管理器 | https://violentmonkey.github.io/ |
| **Tampermonkey** | 常見的跨瀏覽器 userscript 管理器；中文社群有時俗稱「油猴」 | https://www.tampermonkey.net/ |
| **Greasemonkey** | Firefox 上歷史悠久的 userscript 管理器 | https://addons.mozilla.org/firefox/addon/greasemonkey/ |

> Tampermonkey 與 Greasemonkey 是不同的專案；中文社群雖常把 Tampermonkey 稱為「油猴」，但兩者不要混為同一個擴充套件。

Plain Text URL Opener 使用 `@grant none`，不依賴特定管理器提供的 GM API。不過目前專案尚未對所有「瀏覽器 × userscript 管理器」組合進行完整相容性驗證，因此上表列的是常見選擇，不代表所有組合都已完整測試。

### 2. 安裝 Plain Text URL Opener

安裝 userscript 管理器後，開啟下面的腳本：

**[安裝 `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)**

正常情況下，userscript 管理器會自動開啟安裝畫面。如果沒有自動攔截 Raw URL，也可以把上面的網址手動匯入管理器。

### GitHub Releases

正式 Stable 版本會在 [GitHub Releases](https://github.com/rucifa/plain-text-url-opener/releases) 以同一個檔名提供：

`plain-text-url-opener.user.js`

如果你希望固定使用某個特定版本，建議從對應的 Release 下載這個 `.user.js` 檔案。GitHub 自動產生的 `Source code (zip)` / `Source code (tar.gz)` 主要用於原始碼封存，不是一般使用者的主要安裝方式。

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

| 功能 / 設計取向 | **Plain Text URL Opener** | **[Text Link](https://addons.mozilla.org/firefox/addon/text-link/)** | **[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus)** |
|---|:---:|:---:|:---:|
| 雙擊純文字網址直接開啟 | ✅ | ✅ | ❌ |
| 不先把正文改寫成連結 | ✅ | ✅ | ❌ |
| 將文字網址轉成真正 `<a>` 連結 | ❌ | ❌ | ✅ |
| Unicode / 多位元網址處理 | ✅ | ✅ | ✅ |
| 跨文字節點（TextNode）重建完整網址 | ❌ 刻意不支援 | ✅ | ⚠️ README 未明確承諾 |
| 網頁後來新增的文字內容 | ✅ 互動時即時辨識 | ⚠️ 實作方式不同 | ✅ 支援動態內容 |
| 自訂規則 | ❌ | — | ✅ |
| 白名單 / 黑名單 | ❌ | — | ✅ |
| Userscript 形式 | ✅ | ❌ | ✅ |
| Firefox 擴充套件 | ❌ | ✅ | ✅ |
| 公開測試頁 / 固定測試案例 | ✅ | ✅ | ✅ |

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

- Firefox Add-ons: https://addons.mozilla.org/firefox/addon/text-link/
- 歷史文件 / testcase: https://piro.sakura.ne.jp/xul/textlink/index.html.en

### Linkify Plus Plus

[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) 採用另一條路線：它會**偵測文字網址並轉成真正的連結**，並提供 dynamic content、Unicode、自訂規則、whitelist / blacklist、圖片嵌入與多種觸發方式。

如果你希望網頁上的純文字網址在頁面中直接變成可點擊連結，Linkify Plus Plus 的功能範圍會比本專案更完整；Plain Text URL Opener 則刻意避免 DOM linkification。

### 參考與致謝

Plain Text URL Opener 的設計與測試方法曾參考上述兩個相關專案的公開說明與測試案例；其中 [Text Link](https://addons.mozilla.org/firefox/addon/text-link/) 的歷史 testcase 是本專案建立固定回歸測試思維的重要參考之一，[Linkify Plus Plus](https://github.com/eight04/linkify-plus-plus) 則提供了另一種「將純文字網址直接轉成可點擊連結」的設計對照。

本 repo 的實作為獨立撰寫；除非 repo 內另有明確註記，否則未直接納入上述專案的原始碼。

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
- IPv6 網址
- 國際化網域名稱（IDN / Punycode）
- 含中文等 Unicode 文字的網址路徑、查詢參數與 `#` 片段
- 常見標點與括號邊界
- 部分缺少開頭 `h` 的 `ttp://` / `ttps://`
- 安全化／去活化網址（例如 `hxxps://`）可辨識，但不會自動開啟
- 同一段文字中存在多個網址

### ⛔ 刻意不支援 / 保守處理

- 跨文字節點（TextNode）重建完整網址
- 裸 IPv4
- 預設相對路徑
- 廣泛的非 HTTP(S) 網址協定
- 完整的網域後綴清單（Public Suffix List）
- 封閉式 Shadow DOM 內、腳本本來就無法存取的內容
- 部分省略 `http://` / `https://` 的國際化網域仍採保守辨識策略

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

## 版本與測試

目前正式版本：**v1.0.5**

v1.0.5 強化了省略 `http://` / `https://` 的國際化網域辨識、檔名與網域尾碼判斷、長文字中的網址邊界處理，也修復了網址緊接多語系文字時可能辨識失敗的問題。

### 這個版本有沒有完整測過？

有。目前的**公開測試頁 v1.1 有 160 個固定測試案例**，涵蓋一般網址、國際化網域、中文與其他 Unicode 文字、標點符號、長文字、安全性邊界，以及過去曾經發生過的錯誤。

v1.0.5 已通過完整自動測試與實際 Chromium 瀏覽器操作測試。

- [開啟公開測試頁](https://rucifa.github.io/plain-text-url-opener/)
- [查看 v1.0.5 版本測試報告](./tests/acceptance/v1.0.5.md)
- [查看版本變更紀錄](./CHANGELOG.md)

<details>
<summary>查看較技術性的測試資料</summary>

- URL 解析測試：**150 / 150 PASS**
- Chromium 瀏覽器實際操作：**162 / 162 PASS**
- 不支援協定的安全性測試：**10 / 10 PASS**
- 隨機差異測試：**10,000 cases，0 個非預期差異**
- 效能回歸檢查：**PASS**

完整細節請見 [v1.0.5 版本測試報告](./tests/acceptance/v1.0.5.md)。

</details>

### 公開測試頁

Repo 根目錄的 [`index.html`](./index.html) 是固定的**公開測試頁 v1.1**。它用來定義「每種文字應不應該被辨識成網址、應該得到什麼結果」。

測試頁的預期結果獨立於目前腳本版本：如果新版腳本做錯了，應該修正腳本，而不是為了讓新版通過就改掉測試答案。

**Live 測試頁：** https://rucifa.github.io/plain-text-url-opener/

---

## 測試與品質原則

每次功能修改原則上遵循：

1. 先重現明確且可重現的問題／回歸錯誤。
2. 採用最小修正。
3. 執行固定回歸測試、瀏覽器實際操作測試與必要的效能檢查。
4. 只有發現真實程式錯誤、測試案例本身有誤，或產品規格正式變更時，才修改固定測試案例。

---

## License

Plain Text URL Opener 採用 **MIT License + Commons Clause License Condition v1.0**。

你可以依完整 License 條款使用、修改與重新散布軟體，但 Commons Clause 不授權將本軟體本身，或其主要價值實質來自本軟體功能的付費產品／服務，作為 `Sell` 的標的。

完整條款：[`LICENSE`](./LICENSE)

由於包含商業販售限制，本專案屬於 **source-available**，不是 OSI 定義下的 open source。