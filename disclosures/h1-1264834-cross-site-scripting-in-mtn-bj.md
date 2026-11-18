---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss
  - trigger/file-upload
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-08-06
submitted: 2021-07-16T00:56:05.571Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "alimanshester"
source: "https://hackerone.com/reports/1264834"
title: "cross site scripting in : mtn.bj"
---
# cross site scripting in : mtn.bj

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** MTN Group | **Disclosed:** 2022-08-06

- Report: [https://hackerone.com/reports/1264834](https://hackerone.com/reports/1264834)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2021-07-16T00:56:05.571Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Xss vulnerability in mtn.bj  in file name 

## Steps To Reproduce:


  1.Go to : 
https://www.mtn.bj/business/ressources/formulaires/plan-de-localisation-de-compte/?next=https://www.mtn.bj/business/ressources/formulaires/formulaire-de-souscription/
  2 - fill all inputs with any data 
3 - in file upload upload a file with payload file name such as : "><img src=x onerror=alert(document.cookie);.jpg

4-the payload will executed in the page .

## Supporting Material/References:
1 - video showing poc 
2 - screen shot

## Impact

execute malicious java script in user browser

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-08-24** @kdrmtn: Good day tester the investigating team asked what remediation steps do you recommend them to take to resolve this issue
- **2021-08-24** @alimanshester: Hello team . 
The file name reflected in the page just stop reflecting of the file name in the page .
Thank you
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
