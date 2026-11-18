---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-10-01
submitted: 2018-03-26T04:04:28.168Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/reverb|Reverb.com]]"
reporter: "sandeep_hodkasia"
source: "https://hackerone.com/reports/329862"
title: "Stored xss in shop name @ lp.reverb.com"
---
# Stored xss in shop name @ lp.reverb.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Reverb.com | **Disclosed:** 2018-10-01

- Report: [https://hackerone.com/reports/329862](https://hackerone.com/reports/329862)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-03-26T04:04:28.168Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hello team,

There is a stored xss in lp.reverb.com.
Attacker can inject malicious script into server while adding shop name as `lll"></script><script>alert('xss');</script>`.
Exploit: https://lp.reverb.com/shops/faniyos-boutique/listings

Steps to reproduce:
1. Navogate to https://reverb.com/my/lp_shop/edit
2. Change your lp shop name to this: lll"></script><script>alert('xss')</script>
3. Save the changes.
4. View your lp shop.

Fix:
Sanitise the given input in the backend and encode the special characters.

Thanks,
Sandeep

## Impact

Attack can save malicious script directly into the server. Malicious script can be used to gain users session.

The hacker selected the **Cross-site Scripting (XSS) - Stored** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
https://lp.reverb.com/shops/faniyos-boutique/listings

**Verified**
Yes

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Triaged**
- **Bounty Awarded**
- **2018-03-26** @sandeep_hodkasia: Thanks for the bounty :)
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
