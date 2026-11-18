---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/phishing
  - env/web
substate: "informative"
weakness: "Phishing"
enriched: true
body: true
date: 2023-01-02
submitted: 2017-10-09T21:58:07.986Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "soulhunter"
source: "https://hackerone.com/reports/275960"
title: "Address Bar Spoofing on TOR Browser"
---
# Address Bar Spoofing on TOR Browser

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Tor | **Disclosed:** 2023-01-02

- Report: [https://hackerone.com/reports/275960](https://hackerone.com/reports/275960)
- CWE: Phishing
- Submitted: 2017-10-09T21:58:07.986Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi TOR team,

I would like to report a security bug in your browser:

Step 1: Goto http://www.ոokia.com/(http://jsbin.com/wuyikedaxi/1/edit?html,output)
Step 2: Observe that address bar points to http://www.ոokia.com/ which actually to be pointing to http://xn--okia-zgf.com, however browser displays www.ոokia.com/

Actual results:

Address bar points to a spoofed domain http://www.ոokia.com/. Address bar fails to parse character "ո"(U+0578 Armenian Small Letter). Several other characters from Armenian family lead to the same effect. 

Expected results:

TORbrowser should have resolved the domain to real http://xn--okia-zgf.com.  On chrome, internet explorer and firefox it resolves to xn--okia-zgf.com.

## Timeline

- **Report Filed**
- **2017-10-10** @geko: I just tested it on a clean Firefox 52.4.0esr and I get the same behavior as with Tor Browser which is ESR-based. So, it seems to me that this bug is at least not confined to Tor Browser and is affecting Firefox as well. Did you test with a Firefox 52.4.0esr? (FWIW I tested this on Linux)
- **2017-10-11** @soulhunter: Hi Geko,

This bug is fixed in beta 57.0, Chrome is still affected. 

regards,
Rafay
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
