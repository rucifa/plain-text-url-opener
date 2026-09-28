<p align="right"><strong>繁體中文</strong> · <a href="./CHANGELOG.en.md">English</a></p>

# 變更紀錄

Plain Text URL Opener 的重要發布變更皆記錄於此。

Regression Fixture 有自己獨立的版本線，不應僅為了讓某個 userscript 版本通過測試而修改。

## [1.0.11] - 2026-09-28

### 效能與安全強化

- 將跨 TextNode 截斷網址的安全檢查改為真正有界：同一 TextNode 的尾端只探查固定範圍，兄弟 DOM 文字讀取最多保留 256 個字元並限制最多走訪 512 個節點；超過預算時保守 fail closed。
- 移除先取得完整 sibling `textContent` 與完整 same-node tail 的非固定成本路徑，避免極端 DOM／超長文字讓互動成本隨整體內容大小成長。
- 新分頁開啟時若 `opener = null` 隔離失敗，現在會關閉空白 popup 並中止導覽，不再沿 fallback 路徑繼續開啟網址。

### 驗證

- Regression Fixture 維持 **v1.3 / 169 cases**；既有 expected result **0 個修改**。
- Chromium 140：**171 / 171 PASS**；Firefox 141：**171 / 171 PASS**，皆以 native double-click interaction 重新驗證。
- 額外 adversarial probe 驗證 10,000,000 字 same-node tail 與 10,000-node sibling subtree 的 bounded safety behavior，並驗證 opener isolation failure 會 fail closed。
- 稽核期間曾評估 ASCII + CJK 混合 path/query/fragment；完整 Regression 證明既有 Fixture 已將無明確分隔符的 CJK 規定為相鄰正文的保守消歧義，因此未變更既有 Spec、Fixture 或 parser 行為。

## [1.0.10] - 2026-09-28

### 圖示最佳化

- 使用已驗證的 compression level 9 候選重新編碼正式 64×64 RGBA 圖示，在維持相同解碼後影像與透明背景的前提下，將 PNG 由 16,516 bytes 降至 5,697 bytes。
- 以完全相同的 5,697-byte PNG 重新產生 userscript 內嵌的 `@icon` data URI。
- Firefox + Violentmonkey 與 Chromium 系瀏覽器 + Violentmonkey 的手動安裝／顯示驗證皆通過。

### 文件

- README 的版本／測試區塊改為聚焦目前 Stable baseline 與驗證狀態，不再重複 CHANGELOG 與 GitHub Releases 已保存的逐版本歷史。

### 行為

- parser、URL matching、DOM、UI、導覽、cache、安全邊界、效能與事件處理行為皆未變更。
- Regression Fixture v1.2 維持 166 cases 不變。
- v1.0.9 → v1.0.10 在正規化後的 runtime identity，除了版本識別與 `@icon` metadata 外，必須維持不變。

## [1.0.9] - 2026-09-28

### Firefox 圖示相容性

- 將正式 64×64 icon 替換為已直接在 Firefox 實測可正常顯示的 RGBA 非壓縮 PNG。
- 以完全相同、已通過 Firefox 驗證的 PNG bytes 重新產生 userscript `@icon` data URI。
- 相容性結果確認後，移除暫時使用的 RGB PNG／非壓縮 RGBA PNG／JPEG A/B 診斷資產。

### 行為

- parser、URL matching、DOM、UI、導覽、cache、安全邊界與事件處理行為皆未變更。
- Regression Fixture v1.2 維持 166 cases 不變。
- 行為驗證沿用已完整驗收通過的 v1.0.6 implementation；v1.0.9 只變更 icon 編碼／發布 metadata。

## [1.0.8] - 2026-09-28

### 圖示相容性

- 將官方 64×64 PNG 直接以 `data:image/png;base64,...` URI 形式內嵌到標準 userscript `@icon` metadata。
- 避開 userscript manager 使用的遠端 icon 抓取／圖片解碼路徑，提升 Firefox + Violentmonkey 的一致性，同時維持 Chromium 行為。
- 在 repository 中保留 `assets/icon-64.png` 與 `assets/icon-128.png`，供專案與發布用途使用。

### 行為

- parser、URL matching、DOM、UI、導覽、cache、安全邊界與事件處理行為皆未變更。
- Regression Fixture v1.2 維持 166 cases 不變。
- 行為驗證沿用已完整驗收通過的 v1.0.6 implementation；v1.0.8 只變更 icon 傳遞方式／發布 metadata。

## [1.0.7] - 2026-09-28

### 品牌識別／metadata

- 新增供 userscript manager 使用的 Plain Text URL Opener 官方 icon 資產。
- 新增標準 userscript `@icon` metadata，指向 repository 內託管的 64×64 PNG。
- userscript metadata、runtime instance version 與 load log 由 `1.0.6` 更新為 `1.0.7`。

### 行為

- parser、URL matching、DOM、UI、導覽、cache、安全邊界與事件處理行為皆未變更。
- Regression Fixture v1.2 維持 166 cases 不變。
- 行為驗證沿用已完整驗收通過的 v1.0.6 implementation；v1.0.7 只變更品牌識別／發布 metadata。

## [1.0.6] - 2026-09-28

### 修正

- 限制 non-Latin adjacency parser 路徑，避免病態的 8 KB 無 scheme token 在 main thread 觸發數千次重複 URL／TLD 驗證。
- 阻止不支援的 outer scheme 將巢狀 missing-h 形式重新救回，例如 `javascript:ttps://example.com/x`。
- 在 host、path、query、fragment 與 `www.` 跨 TextNode 切分情境中，進一步抑制 truncated-prefix 誤開啟，同時維持 Cross-TextNode reconstruction 為刻意不支援。
- 保留剛好重複使用內部 ID 的頁面自有 DOM node；cleanup 現在只移除可驗證為腳本自身建立的 artifact。
- 使用以 Symbol 為主的 lifecycle registry，強化 reinjection，避免歷史 string global 發生惡意或意外碰撞。
- 對極長 TextNode 同一區域的重複掃描加入 bounded exact-window cache，包含 mutation invalidation 與小型 LRU 上限。
- 限制 Cross-TextNode sibling safety check，避免 guard 本身重新解析任意長度的 TextNode tail。

### Regression Fixture v1.2

- 在相同 20 個 section 中，將瀏覽器 Fixture 由 160 cases 擴充至 166 cases。
- 原有 160 個 testcase row 與 expected result 全部維持不變。
- 新增五個 Cross-TextNode truncated-prefix regression（`host`、`path`、`query`、`fragment`、`www`）以及一個 unsupported outer-scheme + `ttps://` regression。

### 驗證

- Targeted parser regression：30 / 30 PASS。
- Full Fixture parser regression：151 / 151 PASS；另外 15 個 DOM-only case 由 browser interaction 覆蓋。
- Full Fixture Chromium regression：Fixture v1.2 全部 166 cases 共 168 / 168 PASS。
- Unsupported outer-scheme probes：10 / 10 PASS。
- v1.0.5 → v1.0.6 parser differential：100,000 cases，0 unexpected differences；7,171 個 intentional differences 僅限 unsupported outer-scheme + missing-h suppression。
- Strict parser/fuzz：131,995 checks；100,000 fuzz cases；0 crashes。
- Final runner 上 pathological parser median：bare 4.516 ms；`www.` 8.741 ms。
- Exact-window cache 與 Cross-TextNode long-tail boundedness gates：PASS。
- P0/P1 closure：PASS，沒有 high- 或 medium-severity findings。
- 官方 IANA snapshot 驗證：country-code 248 / 248、delegated IDN 151 / 151、0 missing / 0 extra。
- 完整驗收證據：`tests/acceptance/v1.0.6.md`。

## [1.0.5] - 2026-09-27

### 修正

- 拒絕任意兩字母 pseudo-TLD／filename false positive，例如 `script.js`、`bundle.ts`、`example.zz`；同時在既有保守 scheme-less policy 下，保留 `.md`、`.py`、`.sh` 等真實 delegated ccTLD。
- 修正真實互動中的 `perf-closers` regression：合法 URL 後接非常長的 closing punctuation 時，原本可能因 bounded-scan clipping 而被錯誤抑制。
- 保留 bare／`www.` 網域後緊接 non-Latin prose 的歷史多語 adjacency 行為，包含 Cyrillic、Greek、Thai、Arabic、Hebrew 與 Devanagari 文字。

### 新增／變更行為

- 使用瀏覽器 URL／IDNA normalization 新增 scheme-less IDN 支援，包括 `例え.jp`、`www.例え.jp`、`пример.рф`、`www.example.みんな`、`example.台灣`。
- 將尾端 `!` 定義為可移除 URL punctuation，同時保留 path 與 query 內部的 `!`。
- Cross-TextNode URL reconstruction 維持刻意不支援，並繼續只允許 HTTP(S) 開啟行為。

### Regression Fixture v1.1

- 在既有 20 個 section 中，將瀏覽器 Fixture 由 131 cases 擴充至 160 cases。
- v1.1 唯一刻意修改的既有 expected result 是 `www-idn-japanese` 與 `bare-idn-cyrillic`；其餘舊 expected result 仍維持獨立 regression 標準。
- 新增 delegated ccTLD ambiguity、pseudo-TLD／filename negative、Punycode delegation、unsupported outer scheme、bounded-scan clipping、performance closers 與相關 security boundary 的明確覆蓋。

### 驗證

- Targeted parser regression：30 / 30 PASS。
- Targeted Chromium interaction：10 / 10 PASS。
- Full Fixture parser regression：150 / 150 PASS；另外 10 個 DOM-only case 由 browser interaction 覆蓋。
- Full Fixture Chromium regression：全部 160 fixture cases 共 162 / 162 PASS。
- Unsupported outer-scheme security probes：10 / 10 PASS。
- Differential fuzz：10,000 cases，0 unexpected differences；1,114 個 intentional differences 僅限已恢復的 non-Latin adjacency family。
- Performance gate：PASS；GitHub Actions runner 上，一般約 8 KB、含單一 domain 的解析仍低於 1 ms，stress case 仍維持毫秒等級。
- 官方 IANA snapshot 驗證（2026-09-27）：248 / 248 個 two-letter delegated TLD、151 / 151 個 delegated IDN TLD，0 missing / 0 extra。
- 完整驗收證據：`tests/acceptance/v1.0.5.md`。

## [1.0.4] - 2026-09-27

### 發布 metadata

- 公開發布前，將 `@namespace` 由 `plain-text-url-opener` 改為 `https://github.com/rucifa/plain-text-url-opener`，建立穩定且專案專屬的 identity。
- 新增 `@license MIT with Commons Clause License Condition v1.0`。
- 新增 `@supportURL https://github.com/rucifa/plain-text-url-opener/issues`。
- userscript metadata version、runtime version 與 load log 由 `1.0.3` 更新為 `1.0.4`。

### 行為

- parser、URL matching、DOM、UI、導覽與事件處理行為皆未變更。
- Regression Fixture v1 維持不變。

### 驗證

- v1.0.3 → v1.0.4 exact diff 僅包含發布 metadata 與版本識別變更。
- JavaScript syntax check：PASS。
- Static architecture constraints 維持不變：不使用 `MutationObserver`、`setInterval`、`requestAnimationFrame`、`eval`、`new Function`、`innerHTML`，也不依賴 GM API。
- GitHub artifact 與已驗證的本地 v1.0.4 candidate，其 Git blob SHA 完全一致：`5fe03abf8b2fd5b05c674ba34b324e921ea9a317`。
- v1.0.4 SHA-256：`4d85ccb106c13701427bed9ed05d6fcb32ff812a9f22fa62484757db8952cbe3`。

## [1.0.3] - 2026-09-27

### 修正

- 在明確 HTTP(S) URL 中保留合法 CJK IDN hostname label，包括 `https://www.例え.jp/` 與 `https://example.みんな/`。
- 拒絕不支援的 outer scheme 內巢狀 HTTP(S) candidate，例如 `blob:`、`data:`、`javascript:`、`file:`、`ftp:`、`mailto:`。
- URL 跨 DOM TextNode 切分時，抑制已知的 truncated-prefix 誤開啟；Cross-TextNode reconstruction 本身仍維持刻意不支援。

### 驗證

- Static / architecture：14 / 14 PASS
- Targeted parser + security + fixture regression：82 / 82 PASS
- Chromium interaction / lifecycle：34 / 34 PASS
- Differential fuzz：10,000 cases，0 unexpected differences

## [1.0.2] - 2026-09-27

### 修正

- 將 unmatched-closing-delimiter 的二次方 trimming 改為線性 counting approach。
- 強化 bare-domain boundary，避免在 malformed hostname-like token 內發生 partial match。
- 對大於 8,192 字元的 TextNode 加入 scan-window clipping protection；寧可出現 false negative，也不要導覽到錯誤 target。

### 驗證

- Deterministic acceptance：119 / 119 PASS
- 200,000 個 randomized delimiter-equivalence inputs
- 200,000 個 parser differential-fuzz inputs，沒有新的 candidate shape，也沒有 surviving candidate 被異常改寫

## [1.0.1] - 2026-09-27

### 修正

- 針對已解析出的 caret／Selection TextNode 再次檢查 ignored element，避免 event target 與實際 TextNode 不同時，既有原生 `<a href>` link 被腳本處理。

### 驗證

- Final acceptance：67 / 67 PASS

## [1.0.0] - 2026-09-27

### Stable 發布前修正

- 防止 bare/www fallback 在同一個 malformed scheme-like token 內重新抓取較後方的 domain fragment，涵蓋 `%40`、`|`、`^` regression。

### 驗證

- Final acceptance：59 / 59 PASS

## Fixture v1.1

Regression Fixture v1.1 與 userscript release version 分開維護。它是一份固定、面向瀏覽器的測試規格。只有確認 Fixture 本身有錯，或產品規格刻意變更時，才應修改 Fixture expected result；不能僅因目前腳本行為發生變化就跟著修改。
