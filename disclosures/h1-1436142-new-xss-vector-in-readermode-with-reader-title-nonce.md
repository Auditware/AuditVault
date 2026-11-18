---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2023-06-22
submitted: 2021-12-26T06:59:17.690Z
bounty_usd: null
votes: 72
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1436142"
title: "New XSS vector in ReaderMode with %READER-TITLE-NONCE%"
---
# New XSS vector in ReaderMode with %READER-TITLE-NONCE%

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 72 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1436142](https://hackerone.com/reports/1436142)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2021-12-26T06:59:17.690Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Previously, script execution in ReaderMode pages was prohibited by CSP. However, three months ago, [this commit](https://github.com/brave/brave-ios/pull/4209/files#diff-eaeef15a290e9e5e9bcaae784f18d874f8c932dfa3de416a5820eccd6b2d8cfbR54) partially relaxed the CSP and scripts with `nonce-%READER-TITLE-NONCE%` are now allowed to be executed. This relaxation of the CSP rule can be exploited for XSS attacks on ReaderMode pages.

Here, the attack vector is `%READER-CREDITS%` which is also [included in the ReaderMode HTML template](https://github.com/brave/brave-ios/blob/6f667506228eeff77daf4df7c9dddae22eb0ad1b/Client/Frontend/Reader/Reader.html#L18). The `%READER-CREDITS%` is replaced with the value of the `<meta name="author">` tag in the original page, but then the HTML tags are not escaped. So, when the following meta tag is embedded in the original page and the page is displayed in ReaderMode, [this Swift code](https://github.com/brave/brave-ios/blob/6f667506228eeff77daf4df7c9dddae22eb0ad1b/Client/Frontend/Reader/ReaderModeUtils.swift#L30)  replaces `%READER-TITLE-NONCE%` with the correct nonce value.
```
<meta name="author" content="Evil &lt;script nonce=%READER-TITLE-NONCE%&gt;alert(document.location);&lt;/script&gt;!--">
```

As a result, the malicious script will be executed on a page `http://localhost:6571/reader-mode?uri={uri}&uuidkey={value}`.
In Brave, all readalized pages are hosted on `http://localhost:6571`. Therefore, through this XSS, any cross-origin pages, that has been converted to ReaderMode, can be stolen by embedding an iframe and reading out them. Also, please find that the `uuidkey` is included in the URL query string. By obtaining this key, the attacker can gain access to Brave's privileged pages.

## Products affected: 

 * Brave iOS 1.31.1 and higher (including the latest Nightly)

## Steps To Reproduce:

 * Show https://csrf.jp/2021/brave/author_xss.php
 * Push reader mode button on the address bar
 * An alert dialog is shown

## Supporting Material/References:

 * See the screenshot of the alert dialog when the bug is reproduced.

## Impact

* Any cross-origin pages, that has been converted to ReaderMode, can be stolen
* Attacker can gain access to Brave's privileged pages

## Timeline

- **Report Filed**
- **2021-12-26** @diracdeltas: thanks, we are investigating
- **2021-12-26** @diracdeltas: great find. i think https://github.com/brave/brave-ios/pull/4773 should fix this but i will need iOS team to help test that it doesn't break anything. it is a holiday here but i will try to ping them tomorrow.
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
