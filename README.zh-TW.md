# Plain Text URL Opener

[English](./README.md) | [繁體中文](./README.zh-TW.md)

一個輕量、事件驅動的 userscript，讓使用者可以直接雙擊網頁中的純文字 HTTP(S) 網址並開啟。

**繁體中文名稱：純文字網址雙擊開啟器**

## 設計目標

- 事件驅動，不進行背景全頁掃描
- 不把純文字網址改寫成 `<a>` 連結
- 不提供設定介面
- `@grant none`
- 最終只允許 HTTP / HTTPS 導航
- 既有原生連結與可編輯／表單控制項一律忽略
- Defanged URL 可以辨識，但不自動開啟
- 以固定 Regression Fixture 鎖定回歸行為

## 安裝

需要相容的 userscript 管理器。

**直接安裝：** [安裝 `plain-text-url-opener.user.js`](https://raw.githubusercontent.com/rucifa/plain-text-url-opener/main/plain-text-url-opener.user.js)

如果 userscript 管理器沒有自動攔截 Raw URL，請在管理器內手動匯入這個網址。

## 使用方式

安裝後，在網頁上直接雙擊支援的純文字網址即可。

預設操作：

- 雙擊：在新分頁開啟偵測到的網址
- Shift + 雙擊：反轉開啟模式，改用目前分頁
- Alt + 雙擊：只選取完整網址，不開啟

## 目前 Stable 版本

**v1.0.4 Stable**

v1.0.4 是「發布 metadata 整理版」。實際執行行為與 v1.0.3 相同；本版只新增永久 namespace、授權 metadata、support URL，並同步版本識別字串。

原始碼：[`plain-text-url-opener.user.js`](./plain-text-url-opener.user.js)

最新驗收報告：[`tests/acceptance/v1.0.4.md`](./tests/acceptance/v1.0.4.md)

## Regression Fixture

Repo 根目錄的 [`index.html`](./index.html) 是 **Regression Fixture v1**。

Fixture 是固定的測試規格：它獨立定義 testcase 的輸入與預期結果，不綁定任何特定 userscript 版本。每次修改腳本，都應拿腳本去接受 Fixture 驗證；不能因為腳本目前怎麼執行，就回頭修改 Fixture 讓它通過。

GitHub Pages 已設定由 `main / (root)` 發布。

**線上 Fixture：** https://rucifa.github.io/plain-text-url-opener/

## 刻意保留的功能邊界

目前下列項目不在支援範圍內：

- 跨 TextNode 重建完整網址
- 裸 IPv4 位址
- 預設啟用相對路徑
- 廣泛的非 HTTP(S) URI scheme
- 完整 Public Suffix List 內嵌
- closed Shadow DOM 內無法存取的內容
- 部分 scheme-less IDN 維持保守辨識策略

這些屬於既定設計限制，不應自動視為 bug。

## 驗證原則

每次修改原則上應遵循：

1. 先重現明確、可重現的 bug 或 regression。
2. 採用最小、可驗證的修正。
3. 執行 deterministic regression、瀏覽器互動測試與必要的效能檢查。
4. 只有在發現真實 bug，或產品規格正式改變時，才新增永久 regression case。

歷史 Acceptance Report 保存在 [`tests/acceptance/`](./tests/acceptance/)。

## 背景與致謝

Plain Text URL Opener 的設計過程參考過一些長期處理「純文字網址」問題的工具，主要包括：

- **Text Link**（Piro）— 「直接雙擊純文字 URI 開啟」的操作方式、不改寫網頁外觀的設計理念，以及公開 testcase，都曾作為本專案設計與 regression 測試的重要參考。
- **Linkify Plus Plus**（eight04）— 一套更廣泛的 linkification userscript／extension，會把偵測到的文字網址轉成真正連結，並支援 dynamic content、Unicode 與 custom rules。它的作法也幫助本專案更明確地界定相反方向的設計：Plain Text URL Opener 不改寫 DOM，也不進行背景全頁 linkification。

本 repo 的實作為獨立撰寫；除非 repo 內有明確註記，否則並未直接納入上述專案的原始碼。

相關專案：

- Text Link: https://addons.mozilla.org/firefox/addon/text-link/
- Text Link 歷史文件／testcases: https://piro.sakura.ne.jp/xul/textlink/index.html.en
- Linkify Plus Plus: https://github.com/eight04/linkify-plus-plus

## Changelog

請見 [`CHANGELOG.md`](./CHANGELOG.md)。

## License

Plain Text URL Opener 採用 **MIT License + Commons Clause License Condition v1.0**。

你可以使用、修改與重新散布這個軟體，但不得依 Commons Clause 對「這個軟體本身」進行販售。

完整條款請見 [`LICENSE`](./LICENSE)。

由於包含商業販售限制，本專案屬於 source-available，而不是 OSI 定義下的 open source。
