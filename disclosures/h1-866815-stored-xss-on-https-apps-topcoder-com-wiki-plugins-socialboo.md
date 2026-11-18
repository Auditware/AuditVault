---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-05-12
submitted: 2020-05-05T22:12:43.388Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "meryem0x"
source: "https://hackerone.com/reports/866815"
title: "Stored XSS on https://apps.topcoder.com/wiki/plugins/socialbookmarking/updatebookmark.action"
---
# Stored XSS on https://apps.topcoder.com/wiki/plugins/socialbookmarking/updatebookmark.action

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Lab45 | **Disclosed:** 2020-05-12

- Report: [https://hackerone.com/reports/866815](https://hackerone.com/reports/866815)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-05-05T22:12:43.388Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi :) Adding javascript url causes to stored XSS when creating bookmark.

## Steps To Reproduce:

Go to https://apps.topcoder.com/wiki/plugins/socialbookmarking/updatebookmark.action . Write `javascript:alert(document.domain)` on url input and fill other areas. After create, go `https://apps.topcoder.com/wiki/display/tcwiki/<TITLE>` and when you click the title on this page, XSS will execute.

PoC:
https://apps.topcoder.com/wiki/display/tcwiki/powerpuff_hackerone_test
{F816754}

## Impact

XSS can use to steal cookies or to run arbitrary code on victim's browser.

## Timeline

- **Report Filed**
- **2020-05-06** @meryem0x: Hi :) This only works to signed-in users. Because unauthorized users cannot create bookmarks. I think there is a mistake on https://apps.topcoder.com/wiki/login.action . If you encounter an error, you can login on main site (https://accounts.topcoder.com/member) then try.
- **2020-05-06** @dwan: #
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
