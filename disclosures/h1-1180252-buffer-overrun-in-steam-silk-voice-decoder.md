---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2021-09-13
submitted: 2021-04-29T18:33:33.502Z
bounty_usd: 7500
votes: 196
cve: []
program: "[[programs/valve|Valve]]"
reporter: "slidybat"
source: "https://hackerone.com/reports/1180252"
title: "Buffer overrun in Steam SILK voice decoder"
---
# Buffer overrun in Steam SILK voice decoder

> **Severity:** Critical | **Bounty:** 7,500 USD | **Votes:** 196 | **Program:** Valve | **Disclosed:** 2021-09-13

- Report: [https://hackerone.com/reports/1180252](https://hackerone.com/reports/1180252)
- CWE: Classic Buffer Overflow
- Submitted: 2021-04-29T18:33:33.502Z

## Timeline

- **Report Filed**
- **2021-05-03** @ktistai: Hi @slidybat,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@ktistai
- **Report Needs More Info**
- **Report New**
- **2021-05-10** @ktistai: @slidybat , I've sent this to the team as my RDP does not have audio so I cannot trigger this. I was trying to find a fix but it's too far fetched and was taking too long.
- **Report Triaged**
- **2021-05-15** @mikela: Hi @slidybat, thanks for the excellent report! I've added a fix for this to the Steam beta version released earlier today (https://steamcommunity.com/groups/SteamClientBeta/announcements/detail/5211206153165966952) if you'd like to check that out to verify that the issue is fixed.
- **2021-05-15** @slidybat: Hi @mikela,

I can confirm that this is fixed in the latest Steam beta release.

Thanks.
- **2021-06-28** @slidybat: Hi @mikela,

Given that this has been fixed, can we get this marked as resolved?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
