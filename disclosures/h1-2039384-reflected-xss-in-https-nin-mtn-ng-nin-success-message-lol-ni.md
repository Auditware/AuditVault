---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2024-10-05
submitted: 2023-06-26T21:02:32.073Z
bounty_usd: null
votes: 70
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "hazemhussien99"
source: "https://hackerone.com/reports/2039384"
title: "Reflected XSS in https://nin.mtn.ng/nin/success?message=lol&nin=<VULNERABLE>"
---
# Reflected XSS in https://nin.mtn.ng/nin/success?message=lol&nin=<VULNERABLE>

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 70 | **Program:** MTN Group | **Disclosed:** 2024-10-05

- Report: [https://hackerone.com/reports/2039384](https://hackerone.com/reports/2039384)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2023-06-26T21:02:32.073Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Summary:
Hello team,
Found a reflected XSS on one your domains i believe https://nin.mtn.ng/nin/success?message=msg&nin= as the nin parameter is vulnerable.
Please check the following PoC:
Run the following command from a terminal:
curl -ski "https://nin.mtn.ng/nin/success?message=lol&nin=<script>alert(1)</script>"  | grep "alert"
{F2446627}

I reported this before in report #1737682 but it was closed as resolved while still vulnerable.

## Impact

Attacker could execute js in the victim's browser.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2023-08-22** @hazemhussien99: This looks like fixed! 
{F2626282}
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
