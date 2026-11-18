---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/ssrf
  - impact/rce
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-05-12
submitted: 2020-05-06T12:15:53.497Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "meryem0x"
source: "https://hackerone.com/reports/867133"
title: "Stored XSS on https://apps.topcoder.com/wiki/pages/editpage.action"
---
# Stored XSS on https://apps.topcoder.com/wiki/pages/editpage.action

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Lab45 | **Disclosed:** 2020-05-12

- Report: [https://hackerone.com/reports/867133](https://hackerone.com/reports/867133)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-05-06T12:15:53.497Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi :) There is a stored XSS on wiki pages and it executes when editing page.

## Steps To Reproduce:
After I submitted #867125, i realized that the vote macro causes stored XSS on wiki edit page. 
A user can edit wiki pages on https://apps.topcoder.com/wiki/pages/editpage.action?pageId=. Users can insert macros to pages. Vote macro is vulnerable to XSS. 

Go to a wiki page, edit it and type

```
{vote:What is your favorite vulnerability?}
RCE
SSRF
XSS"><img src=X onerror=alert(document.domain)>
{vote}
```
and save it. When an other user edit this page, XSS will execute.

PoC:
https://apps.topcoder.com/wiki/pages/editpage.action?pageId=165871793
{F817588}

Note: This only works to signed-in users. Because unauthorized users cannot edit pages. I think there is a mistake on https://apps.topcoder.com/wiki/login.action now. If you encounter an error, you can login on main site (https://accounts.topcoder.com/member) then try.

## Impact

XSS can use to steal cookies or to run arbitrary code on victim's browser.

## Timeline

- **Report Filed**
- **2020-05-06** @meryem0x: Hi :) This payload works on rich text tab as shown in the screenshot. Rich text tab is disabled on Chrome. It works on Firefox
- **2020-05-07** @bugseeker: Hi @powerpuff,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bugseeker
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
