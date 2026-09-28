// ==UserScript==
// @name         Plain Text URL Opener
// @name:zh-TW   純文字網址雙擊開啟器
// @namespace    https://github.com/rucifa/plain-text-url-opener
// @version      1.0.6
// @description  Double-click plain-text HTTP(S) URLs to open them. Lightweight, no DOM linkification, no full-page scanning, no settings required.
// @description:zh-TW 雙擊開啟網頁中的純文字 HTTP(S) 網址。輕量、不改寫正文 DOM、不進行背景全頁掃描，也不需要設定介面。
// @match        http://*/*
// @match        https://*/*
// @license      MIT with Commons Clause License Condition v1.0
// @supportURL   https://github.com/rucifa/plain-text-url-opener/issues
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const GLOBAL_KEY = '__PLAIN_TEXT_URL_OPENER__';
    const INSTANCE_SYMBOL = Symbol.for(
        'rucifa.plain-text-url-opener.instance'
    );
    const LEGACY_GLOBAL_KEYS = ['__TEXT_LINK_UNIVERSAL_LIGHTWEIGHT__'];

    function isManagedInstance(value) {
        return Boolean(
            value &&
            typeof value === 'object' &&
            typeof value.version === 'string' &&
            value.controller &&
            typeof value.controller.abort === 'function' &&
            typeof value.cleanup === 'function'
        );
    }

    function readWindowKey(key) {
        try {
            return {
                ok: true,
                value: window[key]
            };
        }
        catch {
            return {
                ok: false,
                value: undefined
            };
        }
    }

    const primaryBefore =
        readWindowKey(INSTANCE_SYMBOL);

    /*
     * The symbol key is the primary lifecycle registry from v1.0.6 onward.
     * Never overwrite a foreign value at that key; failing closed here is
     * safer than installing listeners without a reliable cleanup handle.
     */
    if (
        !primaryBefore.ok ||
        (
            primaryBefore.value !== undefined &&
            !isManagedInstance(primaryBefore.value)
        )
    ) {
        return;
    }

    const seenInstances = new Set();

    for (
        const key of [
            INSTANCE_SYMBOL,
            GLOBAL_KEY,
            ...LEGACY_GLOBAL_KEYS
        ]
    ) {
        const entry = readWindowKey(key);

        if (
            !entry.ok ||
            !isManagedInstance(entry.value) ||
            seenInstances.has(entry.value)
        ) {
            continue;
        }

        const previous = entry.value;
        seenInstances.add(previous);

        try {
            previous.controller.abort();
        }
        catch {
            // A broken previous controller must not block the new instance.
        }

        try {
            previous.cleanup();
        }
        catch {
            // A broken previous cleanup must not block the new instance.
        }
    }

    /*
     * Delete only keys that actually point to a recognized script instance.
     * Unknown page-owned globals are left untouched.
     */
    for (
        const key of [
            INSTANCE_SYMBOL,
            GLOBAL_KEY,
            ...LEGACY_GLOBAL_KEYS
        ]
    ) {
        const entry = readWindowKey(key);

        if (
            entry.ok &&
            isManagedInstance(entry.value)
        ) {
            try {
                delete window[key];
            }
            catch {
                // The primary claim below will decide whether startup is safe.
            }
        }
    }

    const controller = new AbortController();
    const { signal } = controller;

    const CONFIG = {
        openInNewTab: true,
        shiftReversesOpenMode: true,
        altSelectOnly: true,
        enableRelativePaths: false,

        hoverUnderline: true,
        hoverStatus: true,
        hoverDelayMs: 60,

        maxWholeNodeChars: 8192,
        scanRadiusChars: 4096,

        feedbackMs: 800,
        debug: false,
    };

    const HIGHLIGHT = Object.freeze({
        hover: 'plain-text-url-opener-hover',
        warning: 'plain-text-url-opener-warning',
        success: 'plain-text-url-opener-success',
    });

    const LEGACY_HIGHLIGHT_STYLE_IDS = Object.freeze([
        'text-link-universal-highlight-style',
        'plain-text-url-opener-highlight-style',
    ]);

    const IGNORE_SELECTOR = [
        'a[href]',
        'input',
        'textarea',
        'select',
        'option',
        'button',
        'script',
        'style',
        'noscript',
        'iframe',
        'object',
        'embed',
        '[role="textbox"]'
    ].join(',');

    /*
     * Bare domains intentionally use a conservative TLD list.
     * Explicit http(s):// URLs and www.* URLs do not depend on this list.
     */
    const COMMON_TLDS = new Set([
        'com','org','net','edu','gov','mil','int',
        'io','ai','app','dev','co','me','tv','xyz',
        'site','online','store','shop','tech','cloud',
        'info','biz','name','pro','mobi','travel',
        'blog','news','live','world','link','website',
        'space','digital','agency','solutions','services',
        'company','email','social','media','design',
        'studio','today','life','work','games','game',
        'finance','market','markets','academy','network','systems'
    ]);

    /*
     * Delegated country-code and internationalized TLD snapshots used only
     * for scheme-less domain validation. Source: IANA Root Zone Database.
     * Explicit http(s):// URLs remain independent of these allow-lists.
     */
    const COUNTRY_CODE_TLDS = new Set(
        'ac ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cd cf cg ch ci ck cl cm cn co cr cu cv cw cx cy cz de dj dk dm do dz ec ee eg er es et eu fi fj fk fm fo fr ga gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu id ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr ss st su sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug uk us uy uz va vc ve vg vi vn vu wf ws ye yt za zm zw'.split(' ')
    );

    const IDN_TLDS = new Set(
        'xn--11b4c3d xn--1ck2e1b xn--1qqw23a xn--2scrj9c xn--30rr7y xn--3bst00m xn--3ds443g xn--3e0b707e xn--3hcrj9c xn--3pxu8k xn--42c2d9a xn--45br5cyl xn--45brj9c xn--45q11c xn--4dbrk0ce xn--4gbrim xn--54b7fta0cc xn--55qw42g xn--55qx5d xn--5su34j936bgsg xn--5tzm5g xn--6frz82g xn--6qq986b3xl xn--80adxhks xn--80ao21a xn--80aqecdr1a xn--80asehdb xn--80aswg xn--8y0a063a xn--90a3ac xn--90ae xn--90ais xn--9dbq2a xn--9et52u xn--9krt00a xn--b4w605ferd xn--bck1b9a5dre4c xn--c1avg xn--c2br7g xn--cck2b3b xn--cckwcxetd xn--cg4bki xn--clchc0ea0b2g2a9gcd xn--czr694b xn--czrs0t xn--czru2d xn--d1acj3b xn--d1alf xn--e1a4c xn--eckvdtc9d xn--efvy88h xn--fct429k xn--fhbei xn--fiq228c5hs xn--fiq64b xn--fiqs8s xn--fiqz9s xn--fjq720a xn--flw351e xn--fpcrj9c3d xn--fzc2c9e2c xn--fzys8d69uvgm xn--g2xx48c xn--gckr3f0f xn--gecrj9c xn--gk3at1e xn--h2breg3eve xn--h2brj9c xn--h2brj9c8c xn--hxt814e xn--i1b6b1a6a2e xn--imr513n xn--io0a7i xn--j1aef xn--j1amh xn--j6w193g xn--jlq480n2rg xn--jvr189m xn--kcrx77d1x4a xn--kprw13d xn--kpry57d xn--kput3i xn--l1acc xn--lgbbat1ad8j xn--mgb9awbf xn--mgba3a3ejt xn--mgba3a4f16a xn--mgba7c0bbn0a xn--mgbaam7a8h xn--mgbab2bd xn--mgbah1a3hjkrd xn--mgbai9azgqp6j xn--mgbayh7gpa xn--mgbbh1a xn--mgbbh1a71e xn--mgbc0a9azcg xn--mgbca7dzdo xn--mgbcpq6gpa1a xn--mgberp4a5d4ar xn--mgbgu82a xn--mgbi4ecexp xn--mgbpl2fh xn--mgbt3dhd xn--mgbtx2b xn--mgbx4cd0ab xn--mix891f xn--mk1bu44c xn--mxtq1m xn--ngbc5azd xn--ngbe9e0a xn--ngbrx xn--node xn--nqv7f xn--nqv7fs00ema xn--nyqy26a xn--o3cw4h xn--ogbpf8fl xn--otu796d xn--p1acf xn--p1ai xn--pgbs0dh xn--pssy2u xn--q7ce6a xn--q9jyb4c xn--qcka1pmc xn--qxa6a xn--qxam xn--rhqv96g xn--rovu88b xn--rvc1e0am3e xn--s9brj9c xn--ses554g xn--t60b56a xn--tckwe xn--tiq49xqyj xn--unup4y xn--vermgensberater-ctb xn--vermgensberatung-pwb xn--vhquv xn--vuq861b xn--w4r85el8fhu5dnra xn--w4rs40l xn--wgbh1c xn--wgbl6a xn--xhq521b xn--xkc2al3hye2a xn--xkc2dl3a5ee0h xn--y9a3aq xn--yfro4i67o xn--ygbi2ammx xn--zfr164b'.split(' ')
    );

    const CJK_RE =
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;


    /*
     * Schemes that this userscript intentionally does not handle.
     * A nested http(s) substring inside one of these tokens must not be
     * rescued as an independent URL.
     */
    const UNSUPPORTED_OUTER_SCHEMES = new Set([
        'about',
        'blob',
        'chrome',
        'chrome-extension',
        'data',
        'file',
        'ftp',
        'javascript',
        'mailto'
    ]);

    const TRIM_PAIRS = new Map([
        [')', '('],
        [']', '['],
        ['}', '{'],
        ['）', '（'],
        ['］', '［'],
        ['｝', '｛']
    ]);

    const TRIM_DELIMITERS = new Set([
        ...TRIM_PAIRS.keys(),
        ...TRIM_PAIRS.values()
    ]);

    const URL_TOKEN_SEPARATOR_RE =
        /[\s<>"'`\u3000\uFF02\uFF07\uFF1C\uFF1E\uFF40]/u;

    const SCAN_TRAILING_PUNCTUATION_RE =
        /^[)\]}）］｝。，、；：！？!?;:,\."'”’」』】》〉〕]+$/u;

    /*
     * Bare-domain label count is capped.
     * Together with the hostname-length check below, this avoids pathological
     * backtracking on strings such as a.a.a.a.a.a.... while remaining well
     * above realistic DNS hostnames.
     *
     * 126 repeated labels + final TLD = at most 127 labels total.
     */
    const URL_PATTERNS = [
        {
            priority: 7,
            kind: 'scheme',
            regex: /https?:\/\/[^\s<>"'`\u3000]+/giu
        },
        {
            priority: 7,
            kind: 'missing-scheme',
            regex: /ttps?:\/\/[^\s<>"'`\u3000]+/giu
        },
        {
            priority: 7,
            kind: 'defanged',
            regex: /h(?:xx|\*\*|\+\+)p(?:s)?:\/\/[^\s<>"'`\u3000]+/giu
        },
        {
            priority: 4,
            kind: 'www',
            regex: /www\d*\.[^\s<>"'`\u3000]+/giu
        },
        {
            priority: 2,
            kind: 'bare',
            regex: /(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})\.){1,126}[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})(?:[\/:?#][^\s<>"'`\u3000]*)?/giu
        }
    ];

    if (CONFIG.enableRelativePaths) {
        URL_PATTERNS.splice(
            3,
            0,
            {
                priority: 5,
                kind: 'relative',
                regex: /\.\.?\/[A-Za-z0-9._~!$&'()*+,;=:@%\/?#-]+/gu
            }
        );
    }

    const MAX_CACHED_SCAN_WINDOWS = 4;
    const nodeCache = new WeakMap();

    let hoverTimer = 0;
    let feedbackTimer = 0;
    let pendingPointerEvent = null;
    let hoverState = null;
    let uiHost = null;
    let uiPanel = null;
    let highlightStyle = null;
    let panelVisible = false;

    const instance = {
        owner: 'Plain Text URL Opener',
        version: '1.0.6',
        controller,
        cleanup
    };

    let primaryClaimed = false;

    try {
        Object.defineProperty(
            window,
            INSTANCE_SYMBOL,
            {
                value: instance,
                writable: true,
                configurable: true
            }
        );

        primaryClaimed =
            window[INSTANCE_SYMBOL] === instance;
    }
    catch {
        // Registration failure is handled below before listeners are added.
    }

    if (!primaryClaimed) {
        controller.abort();
        return;
    }

    /*
     * Keep the historical string key as an optional compatibility mirror.
     * A page-owned collision must not break the primary symbol registry.
     */
    const mirrorBefore = readWindowKey(GLOBAL_KEY);

    if (
        mirrorBefore.ok &&
        (
            mirrorBefore.value === undefined ||
            isManagedInstance(mirrorBefore.value)
        )
    ) {
        try {
            window[GLOBAL_KEY] = instance;
        }
        catch {
            // The symbol registry remains authoritative.
        }
    }

    // ================================================================
    // General helpers
    // ================================================================

    const log = (...args) => {
        if (CONFIG.debug) {
            console.log('[Plain Text URL Opener]', ...args);
        }
    };

    function addEvent(target, type, listener, options = {}) {
        target.addEventListener(type, listener, {
            ...options,
            signal
        });
    }

    // ================================================================
    // Full-width ASCII → ASCII
    // 1 character → 1 character, so DOM offsets remain identical.
    // ================================================================

    function normalizeWidth(text) {
        let result = '';

        for (const ch of text) {
            const code = ch.charCodeAt(0);

            if (code >= 0xFF01 && code <= 0xFF5E) {
                result += String.fromCharCode(code - 0xFEE0);
            }
            else if (code === 0x3000) {
                result += ' ';
            }
            else if (code === 0x301C || code === 0xFFE3) {
                result += '~';
            }
            else {
                result += ch;
            }
        }

        return result;
    }

    function isIgnoredElement(element) {
        return (
            element instanceof Element &&
            (
                element.isContentEditable ||
                !!element.closest(IGNORE_SELECTOR)
            )
        );
    }

    // ================================================================
    // Pointer position → Text Node
    // ================================================================

    function getCaretFromPoint(x, y) {
        if (typeof document.caretPositionFromPoint === 'function') {
            const pos = document.caretPositionFromPoint(x, y);

            if (pos) {
                return {
                    node: pos.offsetNode,
                    offset: pos.offset
                };
            }
        }

        if (typeof document.caretRangeFromPoint === 'function') {
            const range = document.caretRangeFromPoint(x, y);

            if (range) {
                return {
                    node: range.startContainer,
                    offset: range.startOffset
                };
            }
        }

        return null;
    }

    function resolveTextPoint(node, offset) {
        if (!node) {
            return null;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            return {
                node,
                offset: Math.max(0, Math.min(offset, node.nodeValue.length))
            };
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }

        const child =
            node.childNodes[offset] ||
            node.childNodes[Math.max(0, offset - 1)];

        if (!child) {
            return null;
        }

        if (child.nodeType === Node.TEXT_NODE) {
            return {
                node: child,
                offset: 0
            };
        }

        const walker = document.createTreeWalker(
            child,
            NodeFilter.SHOW_TEXT
        );

        const textNode = walker.nextNode();

        return textNode
            ? {
                node: textNode,
                offset: 0
            }
            : null;
    }

    // ================================================================
    // URL parser
    // ================================================================

    function quickLooksLikeURL(text) {
        return (
            text.includes('.') ||
            text.includes('/') ||
            text.includes(':') ||
            /(?:www|ttp|hxxp|h\*\*p|h\+\+p)/i.test(text)
        );
    }

    function trimCandidate(value) {
        let text = value
            .replace(/^[\s("'“‘「『【《〈〔［｛]+/u, '')
            .replace(/[。，、；：！？!?;:,]+$/u, '');

        const counts = new Map();

        for (const ch of text) {
            if (TRIM_DELIMITERS.has(ch)) {
                counts.set(
                    ch,
                    (counts.get(ch) || 0) + 1
                );
            }
        }

        let end = text.length;

        while (end > 0) {
            const close = text[end - 1];
            const open = TRIM_PAIRS.get(close);

            if (
                !open ||
                (counts.get(close) || 0) <=
                    (counts.get(open) || 0)
            ) {
                break;
            }

            counts.set(
                close,
                counts.get(close) - 1
            );

            end--;
        }

        if (end !== text.length) {
            text = text.slice(0, end);
        }

        return text
            .replace(/["'”’」』】》〉〕]+$/u, '')
            .replace(/[。，、；：！？!?;:,]+$/u, '')
            .replace(/\.+$/u, '');
    }

    function trimLikelyAdjacentCJKProse(raw, kind) {
        if (
            ![
                'scheme',
                'missing-scheme',
                'www',
                'bare'
            ].includes(kind)
        ) {
            return raw;
        }

        let authorityStart = -1;
        let authorityEnd = -1;
        let labelStart = -1;
        let labelHasCJK = false;

        if (
            ['scheme', 'missing-scheme'].includes(kind)
        ) {
            const marker = raw.indexOf('://');

            if (marker >= 0) {
                authorityStart = marker + 3;

                const tail = raw.slice(authorityStart);
                const boundary = tail.search(/[/?#]/u);

                authorityEnd =
                    boundary < 0
                        ? raw.length
                        : authorityStart + boundary;

                labelStart = authorityStart;
            }
        }
        else if (
            ['www', 'bare'].includes(kind)
        ) {
            authorityStart = 0;

            const boundary = raw.search(/[/?#]/u);

            authorityEnd =
                boundary < 0
                    ? raw.length
                    : boundary;

            labelStart = 0;
        }

        let index = 0;

        while (index < raw.length) {
            const codePoint = raw.codePointAt(index);
            const char = String.fromCodePoint(codePoint);
            const inAuthority =
                authorityStart >= 0 &&
                index >= authorityStart &&
                index < authorityEnd;

            if (inAuthority) {
                if (char === '.' || char === '@') {
                    labelStart = index + char.length;
                    labelHasCJK = false;
                    index += char.length;
                    continue;
                }

                if (CJK_RE.test(char)) {
                    /*
                     * Preserve CJK when it starts an explicit hostname label,
                     * e.g. https://www.例え.jp/ or https://example.みんな/.
                     * Later CJK in that same label is preserved as well.
                     *
                     * Keep the long-standing prose rule for a mixed ASCII+CJK
                     * label such as https://example.com中文: it still ends at
                     * .com rather than silently becoming a different IDN host.
                     */
                    if (
                        index === labelStart ||
                        labelHasCJK
                    ) {
                        labelHasCJK = true;
                        index += char.length;
                        continue;
                    }
                }
            }

            if (CJK_RE.test(char)) {
                const prefix = raw.slice(0, index);
                const previous = prefix.at(-1);

                /*
                 * Preserve obvious Unicode URL structures such as:
                 * /wiki/臺灣
                 * ?q=台灣
                 *
                 * But treat:
                 * example.com中文
                 * example.com:8080中文
                 * as URL + adjacent prose.
                 */
                if (
                    !previous ||
                    !/[A-Za-z0-9_.-]/.test(previous)
                ) {
                    return raw;
                }

                if (!/(?:\/|\.|=|&|#|\?)/.test(prefix)) {
                    return raw;
                }

                return raw.slice(0, index);
            }

            index += char.length;
        }

        return raw;
    }

    function hasPlausibleAdjacentDomainBoundary(
        raw,
        index,
        kind
    ) {
        let hostEnd = index;
        let portStart = hostEnd;
        let portDigits = 0;

        while (
            portStart > 0 &&
            portDigits < 5
        ) {
            const code = raw.charCodeAt(
                portStart - 1
            );

            if (code < 48 || code > 57) {
                break;
            }

            portStart--;
            portDigits++;
        }

        if (
            portDigits > 0 &&
            portStart > 0 &&
            raw[portStart - 1] === ':'
        ) {
            hostEnd = portStart - 1;
        }

        let labelStart = hostEnd;
        let labelLength = 0;

        while (
            labelStart > 0 &&
            labelLength <= 63
        ) {
            const char = raw[labelStart - 1];

            if (char === '.') {
                break;
            }

            if (!/[A-Za-z0-9-]/.test(char)) {
                return false;
            }

            labelStart--;
            labelLength++;
        }

        if (
            labelLength < 1 ||
            labelLength > 63 ||
            labelStart <= 0 ||
            raw[labelStart - 1] !== '.'
        ) {
            return false;
        }

        const tld = raw
            .slice(labelStart, hostEnd)
            .toLowerCase();

        if (
            COMMON_TLDS.has(tld) ||
            COUNTRY_CODE_TLDS.has(tld) ||
            IDN_TLDS.has(tld)
        ) {
            return true;
        }

        return (
            kind === 'www' &&
            /^[a-z]{3,63}$/i.test(tld)
        );
    }

    function trimLikelyAdjacentNonLatinProse(
        raw,
        kind
    ) {
        if (!['bare', 'www'].includes(kind)) {
            return raw;
        }

        /*
         * Preserve every complete scheme-less hostname that already
         * validates, including Unicode / IDN hostnames.
         */
        if (isLikelySchemeLessDomain(raw, kind)) {
            return raw;
        }

        const boundary = raw.search(/[/?#]/u);
        const authorityEnd =
            boundary < 0
                ? raw.length
                : boundary;

        let index = 0;

        while (index < authorityEnd) {
            const codePoint = raw.codePointAt(index);
            const char = String.fromCodePoint(codePoint);
            const previous =
                index > 0
                    ? raw[index - 1]
                    : '';

            /*
             * The v1.0.5 fallback validated every non-Latin transition.
             * An adversarial 8 KB token could therefore trigger thousands
             * of URL constructions on the main thread.
             *
             * First perform a bounded ASCII-TLD check around the boundary.
             * Full URL/IDNA validation is only needed when the prefix can
             * plausibly end in a supported TLD (or the historical broad
             * www.* suffix rule). This preserves examples such as:
             *   example.comРусский  -> example.com
             *   example.com:8080中文 -> handled by the CJK path
             * while keeping pathological work effectively linear.
             */
            if (
                codePoint > 0x7F &&
                /\p{L}/u.test(char) &&
                !/\p{Script=Latin}/u.test(char) &&
                /[A-Za-z0-9]/.test(previous) &&
                hasPlausibleAdjacentDomainBoundary(
                    raw,
                    index,
                    kind
                )
            ) {
                const prefix = raw.slice(0, index);

                if (
                    isLikelySchemeLessDomain(
                        prefix,
                        kind
                    )
                ) {
                    return prefix;
                }
            }

            index += char.length;
        }

        return raw;
    }

    const repairMissingH = value =>
        value
            .replace(/^ttp:\/\//i, 'http://')
            .replace(/^ttps:\/\//i, 'https://');

    const restoreDefangedURL = value =>
        value
            .replace(/^h(?:xx|\*\*|\+\+)p:\/\//i, 'http://')
            .replace(/^h(?:xx|\*\*|\+\+)ps:\/\//i, 'https://');

    function hostWithoutPort(value) {
        return value
            .split(/[\/?#]/, 1)[0]
            .replace(/:\d{1,5}$/, '');
    }

    function isLikelySchemeLessDomain(value, kind) {
        const host = hostWithoutPort(value);

        if (!host) {
            return false;
        }

        let url;

        try {
            url = new URL('https://' + host);
        }
        catch {
            return false;
        }

        const asciiHost = url.hostname.toLowerCase();

        /*
         * DNS hostnames are limited to 253 visible characters
         * (excluding a possible trailing root dot).
         */
        if (
            !asciiHost ||
            asciiHost.length > 253
        ) {
            return false;
        }

        const labels = asciiHost.split('.');

        if (
            labels.length < 2 ||
            labels.length > 127
        ) {
            return false;
        }

        if (
            labels.some(
                label =>
                    !label ||
                    label.length > 63
            )
        ) {
            return false;
        }

        const tld = labels.at(-1);

        if (
            COMMON_TLDS.has(tld) ||
            COUNTRY_CODE_TLDS.has(tld) ||
            IDN_TLDS.has(tld)
        ) {
            return true;
        }

        /*
         * A leading www. is a strong URL signal. Preserve the historical
         * broad behavior for ASCII TLDs of length >= 3, while rejecting
         * arbitrary two-letter suffixes such as .js or .ts.
         */
        return (
            kind === 'www' &&
            /^[a-z]{3,63}$/i.test(tld)
        );
    }

    function describeURL(url) {
        return {
            idn: url.hostname.includes('xn--'),
            userInfo: Boolean(url.username || url.password)
        };
    }

    function normalizeURL(raw, kind) {
        let value = trimCandidate(
            normalizeWidth(raw.trim())
        );

        value = trimLikelyAdjacentCJKProse(
            value,
            kind
        );

        value = trimLikelyAdjacentNonLatinProse(
            value,
            kind
        );

        if (!value) {
            return null;
        }

        // ------------------------------------------------------------
        // Defanged URL
        // ------------------------------------------------------------

        if (kind === 'defanged') {
            try {
                const url = new URL(
                    restoreDefangedURL(value)
                );

                if (!['http:', 'https:'].includes(url.protocol)) {
                    return null;
                }

                return {
                    blocked: true,
                    reason: 'defanged',
                    original: value,
                    url: url.href,
                    ...describeURL(url)
                };
            }
            catch {
                return null;
            }
        }

        value = repairMissingH(value);

        // ------------------------------------------------------------
        // Relative paths
        // ------------------------------------------------------------

        if (
            CONFIG.enableRelativePaths &&
            (
                value.startsWith('./') ||
                value.startsWith('../')
            )
        ) {
            try {
                const url = new URL(
                    value,
                    document.baseURI
                );

                return {
                    blocked: false,
                    reason: null,
                    original: value,
                    url: url.href,
                    ...describeURL(url)
                };
            }
            catch {
                return null;
            }
        }

        // ------------------------------------------------------------
        // www.example.com
        // ------------------------------------------------------------

        if (/^www\d*\./i.test(value)) {
            if (!isLikelySchemeLessDomain(value, 'www')) {
                return null;
            }

            value = 'https://' + value;
        }

        // ------------------------------------------------------------
        // Bare domain
        // ------------------------------------------------------------

        else if (kind === 'bare') {
            if (!isLikelySchemeLessDomain(value, 'bare')) {
                return null;
            }

            value = 'https://' + value;
        }

        try {
            const url = new URL(value);

            if (!['http:', 'https:'].includes(url.protocol)) {
                return null;
            }

            const description = describeURL(url);

            /*
             * Scheme-less User Info is too ambiguous and too easy to
             * confuse with e-mail / identifier-like text.
             *
             * Reject:
             *   www.example.com@evil.org
             *   example.com:80@evil.org
             *
             * Still allow explicit:
             *   https://example.com@evil.org/
             * and show a warning for it.
             */
            if (
                ['bare', 'www'].includes(kind) &&
                description.userInfo
            ) {
                return null;
            }

            return {
                blocked: false,
                reason: null,
                original: raw,
                url: url.href,
                ...description
            };
        }
        catch {
            return null;
        }
    }

    function hasSchemeLikeTokenPrefix(
        text,
        start
    ) {
        const marker = text.lastIndexOf(
            '://',
            start
        );

        if (marker < 1) {
            return false;
        }

        const between = text.slice(
            marker + 3,
            start
        );

        if (/[\s<>"'`\u3000]/u.test(between)) {
            return false;
        }

        let schemeStart = marker - 1;

        while (
            schemeStart >= 0 &&
            /[A-Za-z0-9+.-]/.test(text[schemeStart])
        ) {
            schemeStart--;
        }

        const scheme = text.slice(
            schemeStart + 1,
            marker
        );

        return /^[A-Za-z][A-Za-z0-9+.-]*$/.test(scheme);
    }

    function hasUnsupportedOuterSchemePrefix(
        text,
        start
    ) {
        if (start <= 0) {
            return false;
        }

        let tokenStart = start - 1;

        while (
            tokenStart >= 0 &&
            !URL_TOKEN_SEPARATOR_RE.test(text[tokenStart])
        ) {
            tokenStart--;
        }

        const prefix = text.slice(
            tokenStart + 1,
            start
        );

        const match = prefix.match(
            /^([A-Za-z][A-Za-z0-9+.-]*):/u
        );

        return Boolean(
            match &&
            UNSUPPORTED_OUTER_SCHEMES.has(
                match[1].toLowerCase()
            )
        );
    }

    function hasInvalidDomainBoundary(
        text,
        start,
        end,
        kind,
        hasSchemeMarker
    ) {
        const left =
            start > 0
                ? text[start - 1]
                : '';

        const left2 =
            start > 1
                ? text[start - 2]
                : '';

        const right =
            end < text.length
                ? text[end]
                : '';

        const right2 =
            end + 1 < text.length
                ? text[end + 1]
                : '';

        /*
         * Avoid domains embedded inside e-mail / identifier-like text.
         */
        if (
            /[@_]/.test(left) ||
            /[@_-]/.test(right)
        ) {
            return true;
        }

        /*
         * Prevent a bounded bare-domain match from starting or ending
         * inside a larger malformed ASCII hostname-like token.
         *
         * Keep the existing bare-domain punctuation behavior, e.g.:
         *   -example.com
         */
        if (
            kind === 'bare' &&
            (
                /[A-Za-z0-9]/.test(left) ||
                (
                    (left === '-' || left === '.') &&
                    /[A-Za-z0-9-]/.test(left2)
                )
            )
        ) {
            return true;
        }

        if (
            /[A-Za-z0-9]/.test(right) ||
            (
                right === '.' &&
                /[A-Za-z0-9-]/.test(right2)
            )
        ) {
            return true;
        }

        /*
         * Do not rescue a later bare/www fragment from inside the same
         * non-whitespace scheme-like token after an earlier parse fails.
         *
         * Example:
         *   https://trusted.com%40evil.org
         * must not fall back to:
         *   https://40evil.org/
         */
        if (
            hasSchemeMarker &&
            hasSchemeLikeTokenPrefix(text, start)
        ) {
            return true;
        }

        /*
         * Do not rescue a bare/www candidate from inside another
         * scheme-like string such as:
         *
         *   abchttps://example.com
         *   ftp://example.com
         *
         * The explicit HTTP(S) candidate is handled separately.
         */
        if (left === '/') {
            return true;
        }

        if (kind === 'www') {
            /* abcwww.example.com */
            if (/[A-Za-z0-9_-]/.test(left)) {
                return true;
            }

            /*
             * foo.www.example.com
             * Prefer the complete hostname rather than a nested www candidate.
             */
            if (
                left === '.' &&
                /[A-Za-z0-9-]/.test(left2)
            ) {
                return true;
            }
        }

        return false;
    }

    function hasInvalidSchemeLeftBoundary(
        text,
        start
    ) {
        if (start <= 0) {
            return false;
        }

        /*
         * Reject embedded ASCII identifiers such as:
         *   abchttps://example.com
         *   foohttp://example.com
         *
         * Keep natural-language adjacency such as:
         *   中文https://example.com
         */
        return /[A-Za-z0-9_]/.test(
            text[start - 1]
        );
    }

    function hasInvalidMissingSchemeBoundary(
        text,
        start
    ) {
        if (start <= 0) {
            return false;
        }

        /*
         * Prevent:
         *   https://example.com
         * from also producing:
         *   ttps://example.com
         */
        return /[A-Za-z0-9_]/.test(
            text[start - 1]
        );
    }

    function buildCandidates(
        text,
        baseOffset = 0
    ) {
        if (!text) {
            return [];
        }

        const normalized = normalizeWidth(text);

        if (!quickLooksLikeURL(normalized)) {
            return [];
        }

        const hasSchemeMarker = normalized.includes('://');
        const candidates = [];
        const seen = new Set();

        for (const spec of URL_PATTERNS) {
            spec.regex.lastIndex = 0;

            let match;

            while (
                (match = spec.regex.exec(normalized)) !== null
            ) {
                if (
                    spec.kind === 'missing-scheme' &&
                    hasInvalidMissingSchemeBoundary(
                        normalized,
                        match.index
                    )
                ) {
                    continue;
                }

                if (
                    ['scheme', 'defanged'].includes(spec.kind) &&
                    hasInvalidSchemeLeftBoundary(
                        normalized,
                        match.index
                    )
                ) {
                    continue;
                }

                if (
                    ['scheme', 'missing-scheme'].includes(
                        spec.kind
                    ) &&
                    hasUnsupportedOuterSchemePrefix(
                        normalized,
                        match.index
                    )
                ) {
                    continue;
                }

                let trimmed = trimCandidate(match[0]);

                trimmed = trimLikelyAdjacentCJKProse(
                    trimmed,
                    spec.kind
                );

                trimmed = trimLikelyAdjacentNonLatinProse(
                    trimmed,
                    spec.kind
                );

                if (!trimmed) {
                    continue;
                }

                const localStart = match.index;
                const localEnd = localStart + trimmed.length;

                if (
                    ['bare', 'www'].includes(spec.kind) &&
                    hasInvalidDomainBoundary(
                        normalized,
                        localStart,
                        localEnd,
                        spec.kind,
                        hasSchemeMarker
                    )
                ) {
                    continue;
                }

                if (
                    ['bare', 'www'].includes(spec.kind) &&
                    !isLikelySchemeLessDomain(
                        trimmed,
                        spec.kind
                    )
                ) {
                    continue;
                }

                const resolved = normalizeURL(
                    trimmed,
                    spec.kind
                );

                if (!resolved) {
                    continue;
                }

                const start = baseOffset + localStart;
                const end = start + trimmed.length;

                const key =
                    `${start}:${end}:${resolved.blocked}:${resolved.url}`;

                if (seen.has(key)) {
                    continue;
                }

                seen.add(key);

                candidates.push({
                    raw: trimmed,
                    start,
                    end,
                    priority: spec.priority,
                    kind: spec.kind,
                    ...resolved
                });
            }
        }

        return candidates;
    }

    // ================================================================
    // Bounded scanning + cache
    // ================================================================

    function getScanWindow(
        node,
        start,
        end = start
    ) {
        const text = node.nodeValue || '';

        if (
            text.length <=
            CONFIG.maxWholeNodeChars
        ) {
            return {
                text,
                baseOffset: 0
            };
        }

        const centerStart = Math.max(
            0,
            Math.min(start, text.length)
        );

        const centerEnd = Math.max(
            centerStart,
            Math.min(end, text.length)
        );

        const from = Math.max(
            0,
            centerStart - CONFIG.scanRadiusChars
        );

        const to = Math.min(
            text.length,
            centerEnd + CONFIG.scanRadiusChars
        );

        return {
            text: text.slice(from, to),
            baseOffset: from
        };
    }

    function isCandidateClippedByScanWindow(
        candidate,
        fullText,
        windowed
    ) {
        const localStart =
            candidate.start - windowed.baseOffset;

        const localEnd =
            candidate.end - windowed.baseOffset;

        const windowEnd =
            windowed.baseOffset + windowed.text.length;

        const leftClipped =
            windowed.baseOffset > 0 &&
            !URL_TOKEN_SEPARATOR_RE.test(
                fullText[windowed.baseOffset - 1]
            ) &&
            !URL_TOKEN_SEPARATOR_RE.test(
                windowed.text.slice(0, localStart)
            );

        const rightRemainder =
            windowed.text.slice(localEnd);

        const rightBoundaryChar =
            windowEnd < fullText.length
                ? fullText[windowEnd]
                : '';

        const rightBoundaryText =
            rightRemainder + rightBoundaryChar;

        const rightClipped =
            windowEnd < fullText.length &&
            !URL_TOKEN_SEPARATOR_RE.test(
                rightBoundaryChar
            ) &&
            !URL_TOKEN_SEPARATOR_RE.test(
                rightRemainder
            ) &&
            !SCAN_TRAILING_PUNCTUATION_RE.test(
                rightBoundaryText
            );

        return leftClipped || rightClipped;
    }

    function getCandidatesForNode(
        node,
        start,
        end = start
    ) {
        if (
            !node ||
            node.nodeType !== Node.TEXT_NODE
        ) {
            return [];
        }

        const fullText = node.nodeValue || '';

        if (
            fullText.length <=
            CONFIG.maxWholeNodeChars
        ) {
            const cached = nodeCache.get(node);

            if (
                cached &&
                cached.text === fullText
            ) {
                return cached.candidates;
            }

            const candidates = buildCandidates(
                fullText,
                0
            );

            nodeCache.set(
                node,
                {
                    text: fullText,
                    candidates
                }
            );

            return candidates;
        }

        const windowed = getScanWindow(
            node,
            start,
            end
        );

        let cached = nodeCache.get(node);

        if (
            !cached ||
            cached.text !== fullText ||
            !(cached.windows instanceof Map)
        ) {
            cached = {
                text: fullText,
                windows: new Map()
            };

            nodeCache.set(
                node,
                cached
            );
        }

        const windowKey =
            `${windowed.baseOffset}:${windowed.text.length}`;

        const cachedWindow =
            cached.windows.get(windowKey);

        if (
            cachedWindow &&
            cachedWindow.text === windowed.text
        ) {
            /* Refresh insertion order so the small map acts as an LRU. */
            cached.windows.delete(windowKey);
            cached.windows.set(
                windowKey,
                cachedWindow
            );

            return cachedWindow.candidates;
        }

        const candidates = buildCandidates(
            windowed.text,
            windowed.baseOffset
        )
            .filter(
                candidate =>
                    !isCandidateClippedByScanWindow(
                        candidate,
                        fullText,
                        windowed
                    )
            );

        cached.windows.set(
            windowKey,
            {
                text: windowed.text,
                candidates
            }
        );

        while (
            cached.windows.size >
            MAX_CACHED_SCAN_WINDOWS
        ) {
            const oldestKey =
                cached.windows.keys().next().value;

            cached.windows.delete(oldestKey);
        }

        return candidates;
    }

    function bestCandidate(candidates) {
        if (!candidates.length) {
            return null;
        }

        candidates.sort(
            (a, b) =>
                b.priority - a.priority ||
                (b.end - b.start) -
                (a.end - a.start)
        );

        return candidates[0];
    }

    const DOM_SPLIT_CONTEXT_LIMIT = 256;

    function nextSiblingText(
        node,
        limit = DOM_SPLIT_CONTEXT_LIMIT
    ) {
        let sibling = node.nextSibling;
        let result = '';

        while (
            sibling &&
            result.length < limit
        ) {
            const text =
                sibling.nodeType === Node.TEXT_NODE
                    ? sibling.nodeValue || ''
                    : sibling.nodeType === Node.ELEMENT_NODE
                        ? sibling.textContent || ''
                        : '';

            if (text) {
                result += text.slice(
                    0,
                    limit - result.length
                );
            }

            sibling = sibling.nextSibling;
        }

        return result;
    }

    function isCandidateSplitAcrossSibling(
        node,
        candidate
    ) {
        if (
            !node ||
            node.nodeType !== Node.TEXT_NODE ||
            !candidate
        ) {
            return false;
        }

        const nodeText = node.nodeValue || '';
        const trailing = nodeText.slice(
            candidate.end
        );

        /*
         * A whitespace / quote-like token separator already terminates the
         * current URL before the DOM boundary, so a later sibling cannot be
         * part of the same token.
         */
        if (
            trailing &&
            URL_TOKEN_SEPARATOR_RE.test(
                trailing
            )
        ) {
            return false;
        }

        const continuation =
            nextSiblingText(node);

        if (!continuation) {
            return false;
        }

        /*
         * Do not defeat bounded scanning by reparsing an arbitrarily long
         * non-separator tail just to inspect the following sibling. Once the
         * ambiguous tail itself exceeds our small DOM-boundary context budget,
         * fail closed: Cross-TextNode reconstruction is unsupported, so
         * suppressing the possibly truncated prefix is safer than performing
         * unbounded main-thread work.
         */
        if (
            trailing.length >
            DOM_SPLIT_CONTEXT_LIMIT
        ) {
            return true;
        }

        /*
         * Cross-TextNode reconstruction remains intentionally unsupported.
         * We only use a small read-only sibling context to answer one
         * conservative question: would the parser see a strictly longer URL
         * if the adjacent DOM text were contiguous?
         *
         * If yes, opening the current candidate would open a truncated prefix
         * of a URL split by markup. Suppress it instead. We never navigate to
         * the reconstructed candidate.
         */
        const localNodeEnd =
            nodeText.length - candidate.start;

        const context =
            nodeText.slice(candidate.start) +
            continuation;

        return buildCandidates(context).some(
            item =>
                item.start === 0 &&
                item.end > localNodeEnd
        );
    }

    function findURLAtOffset(
        node,
        offset
    ) {
        return bestCandidate(
            getCandidatesForNode(
                node,
                offset
            )
                .filter(
                    item =>
                        offset >= item.start &&
                        offset < item.end
                )
        );
    }

    function findURLOverRange(
        node,
        start,
        end
    ) {
        return bestCandidate(
            getCandidatesForNode(
                node,
                start,
                end
            )
                .filter(
                    item =>
                        item.start < end &&
                        start < item.end
                )
        );
    }

    function createRange(
        node,
        start,
        end
    ) {
        if (
            !node ||
            node.nodeType !== Node.TEXT_NODE
        ) {
            return null;
        }

        const length = node.nodeValue.length;
        const range = document.createRange();

        range.setStart(
            node,
            Math.max(0, Math.min(start, length))
        );

        range.setEnd(
            node,
            Math.max(0, Math.min(end, length))
        );

        return range;
    }

    // ================================================================
    // UI
    // ================================================================

    function cleanupLegacyUI() {
        /*
         * Never remove a page element by ID alone. Only clean artifacts whose
         * element type / content identifies them as an older script-owned UI.
         */
        const legacyHost = document.getElementById(
            'plain-text-url-opener-ui-host'
        );

        if (
            legacyHost?.localName ===
                'plain-text-url-opener-ui'
        ) {
            legacyHost.remove();
        }

        for (const id of LEGACY_HIGHLIGHT_STYLE_IDS) {
            const style = document.getElementById(id);
            const css = style?.textContent || '';

            if (
                style?.localName === 'style' &&
                (
                    css.includes(
                        'plain-text-url-opener-hover'
                    ) ||
                    css.includes(
                        'text-link-universal'
                    )
                )
            ) {
                style.remove();
            }
        }
    }

    function ensureUI() {
        if (
            uiHost?.isConnected &&
            uiPanel
        ) {
            return uiPanel;
        }

        const host = document.createElement(
            'plain-text-url-opener-ui'
        );

        host.dataset.plainTextUrlOpenerOwned =
            'ui-host';

        host.style.cssText = `
            all: initial !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
        `;

        const root = host.attachShadow({
            mode: 'open'
        });

        const style = document.createElement(
            'style'
        );

        style.textContent = `
            :host {
                all: initial !important;
                pointer-events: none !important;
            }

            #panel {
                display: none;
                position: fixed;
                z-index: 2147483647;

                left: 12px;
                bottom: 10px;

                max-width:
                    min(
                        760px,
                        calc(100vw - 24px)
                    );

                box-sizing: border-box;
                padding: 6px 9px;
                border: 0;
                border-radius: 6px;

                background:
                    rgba(
                        28,
                        28,
                        28,
                        .94
                    );

                color: white;

                font:
                    12px/1.4
                    system-ui,
                    sans-serif;

                font-weight: 400;
                text-align: left;
                text-decoration: none;

                box-shadow:
                    0 2px 10px
                    rgba(
                        0,
                        0,
                        0,
                        .25
                    );

                pointer-events: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #panel.visible {
                display: block;
            }

            #panel.warning {
                background:
                    rgba(
                        92,
                        66,
                        14,
                        .96
                    );
            }
        `;

        const panel = document.createElement(
            'div'
        );

        panel.id = 'panel';
        panel.setAttribute('role', 'status');
        panel.setAttribute('aria-live', 'polite');

        root.append(
            style,
            panel
        );

        document.documentElement.appendChild(
            host
        );

        uiHost = host;
        uiPanel = panel;

        return panel;
    }

    function ensureHighlightStyle() {
        if (highlightStyle?.isConnected) {
            return;
        }

        const style = document.createElement(
            'style'
        );

        style.dataset.plainTextUrlOpenerOwned =
            'highlight-style';

        style.textContent = `
            ::highlight(${HIGHLIGHT.hover}) {
                text-decoration-line: underline;
                text-decoration-style: solid;
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;

                background-color:
                    rgba(
                        70,
                        140,
                        255,
                        .08
                    );
            }

            ::highlight(${HIGHLIGHT.warning}) {
                text-decoration-line: underline;
                text-decoration-style: wavy;
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;

                background-color:
                    rgba(
                        230,
                        170,
                        30,
                        .12
                    );
            }

            ::highlight(${HIGHLIGHT.success}) {
                text-decoration-line: underline;
                text-decoration-style: solid;
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;

                background-color:
                    rgba(
                        70,
                        180,
                        110,
                        .14
                    );
            }
        `;

        (
            document.head ||
            document.documentElement
        ).appendChild(style);

        highlightStyle = style;
    }

    function setHighlight(
        name,
        range
    ) {
        if (range) {
            ensureHighlightStyle();
        }

        if (
            !window.CSS?.highlights ||
            typeof window.Highlight !== 'function'
        ) {
            return;
        }

        if (!range) {
            CSS.highlights.delete(name);
            return;
        }

        CSS.highlights.set(
            name,
            new Highlight(
                range.cloneRange()
            )
        );
    }

    function clearHighlights() {
        for (
            const name
            of Object.values(HIGHLIGHT)
        ) {
            setHighlight(
                name,
                null
            );
        }
    }

    function showPanel(
        text,
        warning = false,
        force = false
    ) {
        if (
            !CONFIG.hoverStatus &&
            !force
        ) {
            return;
        }

        const panel = ensureUI();

        panel.textContent = text;

        panel.classList.toggle(
            'warning',
            warning
        );

        panel.classList.add('visible');

        panelVisible = true;
    }

    function hidePanel() {
        if (uiPanel) {
            uiPanel.classList.remove(
                'visible',
                'warning'
            );

            uiPanel.textContent = '';
        }

        panelVisible = false;
    }

    function resetHoverState() {
        hoverState = null;
        pendingPointerEvent = null;
    }

    function cancelFeedback() {
        if (!feedbackTimer) {
            return;
        }

        clearTimeout(feedbackTimer);
        feedbackTimer = 0;

        setHighlight(
            HIGHLIGHT.success,
            null
        );

        setHighlight(
            HIGHLIGHT.warning,
            null
        );
    }

    function clearHover() {
        resetHoverState();

        setHighlight(
            HIGHLIGHT.hover,
            null
        );

        if (!feedbackTimer) {
            setHighlight(
                HIGHLIGHT.warning,
                null
            );

            hidePanel();
        }
    }

    function clearUI() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = 0;
        }

        resetHoverState();
        cancelFeedback();
        clearHighlights();
        hidePanel();
    }

    function hasActiveUI() {
        return Boolean(
            hoverTimer ||
            feedbackTimer ||
            pendingPointerEvent ||
            hoverState ||
            panelVisible
        );
    }

    function showFeedback(
        range,
        text,
        warning = false
    ) {
        cancelFeedback();
        clearHighlights();

        hoverState = null;
        pendingPointerEvent = null;

        const highlightName =
            warning
                ? HIGHLIGHT.warning
                : HIGHLIGHT.success;

        setHighlight(
            highlightName,
            range
        );

        showPanel(
            text,
            warning,
            true
        );

        feedbackTimer = setTimeout(
            () => {
                feedbackTimer = 0;

                setHighlight(
                    highlightName,
                    null
                );

                hidePanel();
            },
            CONFIG.feedbackMs
        );
    }

    function statusTextFor(candidate) {
        if (
            candidate.blocked &&
            candidate.reason === 'defanged'
        ) {
            return (
                `⚠ Defanged URL — blocked: ${candidate.original}`
            );
        }

        if (candidate.userInfo) {
            try {
                return (
                    `⚠ 網址包含 User Info → ${new URL(candidate.url).host}`
                );
            }
            catch {
                return (
                    `⚠ 網址包含 User Info → ${candidate.url}`
                );
            }
        }

        if (candidate.idn) {
            return (
                `⚠ IDN 網域 → ${candidate.url}`
            );
        }

        return (
            `Plain Text URL → ${candidate.url}`
        );
    }

    function candidateIsWarning(candidate) {
        return Boolean(
            candidate.blocked ||
            candidate.userInfo ||
            candidate.idn
        );
    }

    // ================================================================
    // Hover
    // ================================================================

    function processHover(event) {
        const target =
            event.target instanceof Element
                ? event.target
                : event.target?.parentElement;

        if (
            !target ||
            isIgnoredElement(target)
        ) {
            clearHover();
            return;
        }

        cancelFeedback();

        const caret = getCaretFromPoint(
            event.clientX,
            event.clientY
        );

        const point = resolveTextPoint(
            caret?.node,
            caret?.offset ?? 0
        );

        if (
            !point ||
            isIgnoredElement(point.node.parentElement)
        ) {
            clearHover();
            return;
        }

        const detected = findURLAtOffset(
            point.node,
            point.offset
        );

        if (
            detected &&
            isCandidateSplitAcrossSibling(
                point.node,
                detected
            )
        ) {
            clearHover();
            return;
        }

        if (!detected) {
            clearHover();
            return;
        }

        const key =
            `${detected.start}:${detected.end}:${detected.blocked}:${detected.url}`;

        if (
            hoverState?.node === point.node &&
            hoverState?.key === key
        ) {
            return;
        }

        const range = createRange(
            point.node,
            detected.start,
            detected.end
        );

        if (!range) {
            clearHover();
            return;
        }

        hoverState = {
            node: point.node,
            key
        };

        if (CONFIG.hoverUnderline) {
            setHighlight(
                HIGHLIGHT.hover,
                null
            );

            setHighlight(
                HIGHLIGHT.warning,
                null
            );

            setHighlight(
                candidateIsWarning(detected)
                    ? HIGHLIGHT.warning
                    : HIGHLIGHT.hover,
                range
            );
        }

        showPanel(
            statusTextFor(detected),
            candidateIsWarning(detected)
        );
    }

    addEvent(
        document,
        'pointermove',
        event => {
            pendingPointerEvent = event;

            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }

            hoverTimer = setTimeout(
                () => {
                    hoverTimer = 0;

                    const pending =
                        pendingPointerEvent;

                    pendingPointerEvent = null;

                    if (pending) {
                        processHover(pending);
                    }
                },
                CONFIG.hoverDelayMs
            );
        },
        {
            passive: true
        }
    );

    // ================================================================
    // UI / SPA cleanup
    // ================================================================

    addEvent(
        document,
        'pointerleave',
        clearUI,
        {
            passive: true
        }
    );

    addEvent(
        window,
        'blur',
        clearUI,
        {
            passive: true
        }
    );

    addEvent(
        document,
        'visibilitychange',
        () => {
            if (document.hidden) {
                clearUI();
            }
        },
        {
            passive: true
        }
    );

    addEvent(
        document,
        'scroll',
        () => {
            if (hasActiveUI()) {
                clearUI();
            }
        },
        {
            passive: true,
            capture: true
        }
    );

    addEvent(
        window,
        'popstate',
        clearUI,
        {
            passive: true
        }
    );

    addEvent(
        window,
        'hashchange',
        clearUI,
        {
            passive: true
        }
    );

    if (
        window.navigation &&
        typeof window.navigation.addEventListener === 'function'
    ) {
        addEvent(
            window.navigation,
            'navigate',
            clearUI
        );
    }

    // ================================================================
    // Open URL
    // ================================================================

    function openNewTabSafely(url) {
        const opened = window.open(
            'about:blank',
            '_blank'
        );

        if (!opened) {
            return false;
        }

        try {
            opened.opener = null;
            opened.location.replace(url);
            return true;
        }
        catch {
            try {
                opened.location.href = url;
                return true;
            }
            catch {
                try {
                    opened.close();
                }
                catch {
                    // Ignore cleanup failure.
                }

                return false;
            }
        }
    }

    // ================================================================
    // Double click
    // ================================================================

    addEvent(
        document,
        'dblclick',
        event => {
            if (event.button !== 0) {
                return;
            }

            const target =
                event.target instanceof Element
                    ? event.target
                    : event.target?.parentElement;

            if (
                !target ||
                isIgnoredElement(target)
            ) {
                return;
            }

            const selection = getSelection();

            if (
                !selection ||
                selection.rangeCount === 0 ||
                selection.isCollapsed
            ) {
                return;
            }

            const nativeRange =
                selection.getRangeAt(0);

            /*
             * Lightweight rule:
             * complete URL must remain inside one TextNode.
             */
            if (
                nativeRange.startContainer.nodeType !==
                    Node.TEXT_NODE ||
                nativeRange.startContainer !==
                    nativeRange.endContainer
            ) {
                return;
            }

            const textNode =
                nativeRange.startContainer;

            if (isIgnoredElement(textNode.parentElement)) {
                return;
            }

            const detected = findURLOverRange(
                textNode,
                nativeRange.startOffset,
                nativeRange.endOffset
            );

            if (
                detected &&
                isCandidateSplitAcrossSibling(
                    textNode,
                    detected
                )
            ) {
                return;
            }

            if (!detected) {
                log(
                    'No URL around:',
                    selection.toString()
                );

                return;
            }

            const range = createRange(
                textNode,
                detected.start,
                detected.end
            );

            if (!range) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = 0;
            }

            pendingPointerEvent = null;
            hoverState = null;

            selection.removeAllRanges();

            selection.addRange(
                range.cloneRange()
            );

            // --------------------------------------------------------
            // Defanged URL
            // --------------------------------------------------------

            if (detected.blocked) {
                showFeedback(
                    range,
                    '⚠ Defanged URL blocked — not opened automatically',
                    true
                );

                return;
            }

            // --------------------------------------------------------
            // Alt + double-click
            // --------------------------------------------------------

            if (
                CONFIG.altSelectOnly &&
                event.altKey
            ) {
                showFeedback(
                    range,
                    'Plain Text URL — URL selected'
                );

                return;
            }

            // --------------------------------------------------------
            // Open mode
            // --------------------------------------------------------

            let newTab =
                CONFIG.openInNewTab;

            if (
                CONFIG.shiftReversesOpenMode &&
                event.shiftKey
            ) {
                newTab = !newTab;
            }

            if (!newTab) {
                location.assign(
                    detected.url
                );

                return;
            }

            // --------------------------------------------------------
            // New tab
            // --------------------------------------------------------

            if (
                !openNewTabSafely(
                    detected.url
                )
            ) {
                showFeedback(
                    range,
                    '⚠ 瀏覽器阻擋了新分頁',
                    true
                );

                return;
            }

            if (
                !document.hidden &&
                document.hasFocus()
            ) {
                const warning = Boolean(
                    detected.userInfo ||
                    detected.idn
                );

                const message =
                    detected.userInfo
                        ? `⚠ URL with User Info opened → ${detected.url}`
                        : detected.idn
                            ? `⚠ IDN URL opened → ${detected.url}`
                            : `Opened → ${detected.url}`;

                showFeedback(
                    range,
                    message,
                    warning
                );
            }
        },
        {
            capture: true
        }
    );

    // ================================================================
    // Lifecycle cleanup
    // ================================================================

    function cleanup() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }

        if (feedbackTimer) {
            clearTimeout(feedbackTimer);
        }

        hoverTimer = 0;
        feedbackTimer = 0;
        pendingPointerEvent = null;
        hoverState = null;

        clearHighlights();
        hidePanel();

        uiHost?.remove();
        highlightStyle?.remove();

        uiHost = null;
        uiPanel = null;
        highlightStyle = null;
    }

    cleanupLegacyUI();

    log(
        'Plain Text URL Opener v1.0.6 Stable loaded'
    );
})();
