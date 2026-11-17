---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-11-18
submitted: 2020-08-04T14:08:42.754Z
bounty_usd: null
votes: 50
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/950881"
title: "IDOR when editing email leads to Account Takeover on Atavist"
---
# IDOR when editing email leads to Account Takeover on Atavist

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 50 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/950881](https://hackerone.com/reports/950881)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-08-04T14:08:42.754Z

## Timeline

- **Report Filed**
- **2020-08-04** @bugra: Also, this endpoint accepts any email (even the registered emails), I think you should fix it too.
- **2020-08-05** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-08-12** @bugra: @xknown ping :)
- **2020-09-08** @xknown: Hi @bugra, sorry for the delayed reply. We deployed a patch to address this issue, can you please test if you can bypass it?
- **2020-09-08** @bugra: Hi @xknown, yes I can confirm the fix. And I couldn't find a bypass. But we can still change our email with already registered emails. I don't know if it leads to a security vulnerability because the user IDs are different but I wanted to let you know.
- **2020-09-28** @bugra: @xknown So, can you close this report? :D
- **Hacker Requested Mediation**
- **2020-11-05** @smilingquokka: Hi @bugra , the team is looking into this and will get back to you with an update as soon as we can. 

I apologize for the delay here and thank you for your patience!
- **Report Resolved**
- **Bounty Awarded**
- **2020-11-05** @xknown: Edited -- comment added in #951292.
- **2020-11-05** @bugra: Hi @xknown, thanks but this is a critical issue. And you paid the same bounty for reflected XSS (medium) on #947790. I think this is a little weird, isn't it? You paid $650-$750 on my CrowdSignal account takeover reports. Can you reconsider the bounty on this report?
- **2020-11-05** @xknown: Hi @bugra, unfortunately I can't give you the specifics about the bounty amounts, but we don't award the same amount for every affected domain.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
