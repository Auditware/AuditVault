---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/network
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2021-06-17
submitted: 2021-01-12T13:44:50.530Z
bounty_usd: null
votes: 280
cve: "CVE-2021-22917"
program: "[[programs/brave|Brave Software]]"
reporter: "newfunction"
source: "https://hackerone.com/reports/1077022"
title: "Brave Browser Tor Window leaks user's real IP to the external DNS server"
---
# Brave Browser Tor Window leaks user's real IP to the external DNS server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 280 | **Program:** Brave Software | **Disclosed:** 2021-06-17

- Report: [https://hackerone.com/reports/1077022](https://hackerone.com/reports/1077022)
- CWE: Information Disclosure | CVE: CVE-2021-22917
- Submitted: 2021-01-12T13:44:50.530Z

## Timeline

- **Report Filed**
- **2021-01-12** @diracdeltas: we are aware of this issue to some extent (https://github.com/brave/brave-browser/issues/4257), but this might be worse than we thought. will look into it.
- **Report Triaged**
- **2021-01-13** @newfunction: @diracdeltas Thank you for investigating this! No. I used the default settings, and the setting "Preload pages for faster browsing and searching" is disabled.
- **2021-01-13** @newfunction: This issue is probably different from Issue 4257. I may be wrong, but this issue seems to be a recent regression (I don't know how long though), because when I reported #561250 in May 2019, I don't recall I observed this DNS leakage issue.
- **2021-01-27** @newfunction: @diracdeltas Hi! Is there any update about this issue? Thank you!
- **2021-01-27** @diracdeltas: @anthonytseng has just figured out the cause of this issue and is working on a fix
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2021-02-05** @newfunction: Thank you for fixing it!
- **2021-02-19** @diracdeltas: just an update for when this report is publicly disclosed:

* https://github.com/brave/brave-browser/issues/4257 is actually unrelated. the issue is to add better DNS leak testing for Tor, but we weren't specifically aware of any leaks at the time.
* this DNS leak was caused by https://github.com/brave/brave-core/pull/6640, which got released in 1.17
* we initially fixed in nightly (1.22) but are uplifting to 1.20.x right now
- **Bounty Awarded**
- **2021-02-20** @newfunction: @diracdeltas Thank you for the bounty and the update!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
