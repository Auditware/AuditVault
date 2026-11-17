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
