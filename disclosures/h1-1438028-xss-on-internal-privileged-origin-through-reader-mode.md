---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss
  - vuln/csrf
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2023-06-22
submitted: 2021-12-30T07:48:37.001Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1438028"
title: "XSS on internal: privileged origin through reader mode"
---
# XSS on internal: privileged origin through reader mode

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1438028](https://hackerone.com/reports/1438028)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2021-12-30T07:48:37.001Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Brave iOS has two weaknesses described below. By combining them, XSS can be achieved on the privileged origin `internal://local`.

1. Exposure of uuidKey through REFERER header
Reader mode in Brave has two HTML templates, [Reader.html](https://github.com/brave/brave-ios/blob/development/Client/Frontend/Reader/Reader.html) and [ReaderViewLoading.html](https://github.com/brave/brave-ios/blob/development/Client/Frontend/Reader/ReaderViewLoading.html). The former template defines [<meta name="referrer" content="never">](https://github.com/brave/brave-ios/blob/development/Client/Frontend/Reader/Reader.html#L10) header for preventing referrer leakage, but the latter template [does not](https://github.com/brave/brave-ios/blob/development/Client/Frontend/Reader/ReaderViewLoading.html#L8). Therefore, by opening an external page through `ReaderViewLoading.html`, the `uuidKey` contained in the Reader mode page URL is leaked.

2. XSS in SessionRestoreHandler
SessionRestoreHandler is used to restore a previously used tab, but [it does not validate an URL to be restored](https://github.com/brave/brave-ios/blob/83eb41ac922d7bd18fd311e0a4279e02cdd8e190/Client/Frontend/Browser/SessionRestoreHandler.swift#L34). Therefore, if a javascript: URL is provided, the code is executed on the `internal:` domain.

Note that the first vulnerability is not reproduced on iOS 15 because WKWebView's referrer policy has been changed to hostname only. However, according to [Apple's report in June 2021](https://developer.apple.com/support/app-store/), more than 90% of users were using iOS 14.

## Products affected: 

* Brave iOS 1.32.3 and higher (include the latest Nightly) on iOS 14.x and below

## Steps To Reproduce:

* Visit https://csrf.jp/brave/reader_uuid_leakage.php
* Open the page in Reader mode
* Long tap a hyperlink in the page and choose "Open in New Private Tab"
* Wait for several seconds and tap "Load original page"
* uuidKey in the reader mode URL is stolen through REFERER header
* Click an exploit URL in the page, then XSS is triggered on `internal://local`

## Supporting Material/References:

* xss_on_internal_origin_through_reader_mode.mov: video of the attack against the vulnerabilities
* reader_uuid_leakage.php: server-side exploit code

## Impact

* Attacker can elevate privileges to `internal:` origin

## Timeline

- **Report Filed**
- **2022-01-03** @diracdeltas: Thanks for the report. @justbrandont looked at this and has a PR for a fix. he wrote:

```
1st Issue (Referrer):
The web-link they have shared doesn’t do anything and doesn’t execute anything on internal://local on iOS 14 or 15 (I am testing on both). However, I do see the meta tag missing and have fixed it.
2nd Issue: I cannot reproduce that second XSS in SessionRestoreHandler at all.
FF has the exact same code: https://github.com/mozilla-mobile/firefox-ios/blob/0dab728a700df53fe5b9883d697a13a[…]ient/Frontend/InternalSchemeHandler/SessionRestoreHandler.swift
In fact, we are validating it but in:
guard let _url = request.url, let url = InternalURL(_url) else { return nil }

// Handle the 'url='query param
if let urlParam = url.extractedUrlParam {
    return generateResponseThatRedirects(toUrl: urlParam)
}
The constructor of InternalURL(_url) calls InternalURL.isValid and checks if the URL is actually internal:// scheme.
So you can never actually execute javascript:// scheme here. It does so by doing:
return isWebServerUrl || InternalURL.scheme == url.scheme
which will return false if javascript:// scheme is passed.
Additionally, in our WKNavigationDelegate we have:
if url.isBookmarklet {
    decisionHandler(.cancel, preferences)
    return
}
Which cancels all javascript:// on the webView. javascript:// can only be executed from a bookmark and only when the user explicitly executes it by tapping on it, so it can’t actually happen during session restore at all, and cannot ever happen due to a redirect or a location.href change or location.replace or anything.
Also, you can’t do much with access to internal:// anymore as it’s not a hosted page on GCDWebServer. It’s all handled by WKURLSchemeHandler now and only allows explicit pages to be loaded. 
```

https://github.com/brave/brave-ios/pull/4785
- **2022-01-03** @nishimunea: @diracdeltas Thank you for your quick response. Your colleague was unable to reproduce the second XSS issue so I also tried again, but it even now reproduces on the latest Nightly, as attached in the video in the previous report. Is it possible for you to check again? For the second issue, I added logs to identify the part where the cause is, but there might be another part which is vulnerable...
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
