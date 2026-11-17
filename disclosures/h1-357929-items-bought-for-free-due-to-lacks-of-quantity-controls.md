---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2018-08-31
submitted: 2018-05-26T17:13:59.486Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/reverb|Reverb.com]]"
reporter: "nadino"
source: "https://hackerone.com/reports/357929"
title: "Items bought for free due to lacks of quantity controls"
---
# Items bought for free due to lacks of quantity controls

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Reverb.com | **Disclosed:** 2018-08-31

- Report: [https://hackerone.com/reports/357929](https://hackerone.com/reports/357929)
- CWE: Business Logic Errors
- Submitted: 2018-05-26T17:13:59.486Z

## Timeline

- **Report Filed**
- **2018-05-29** @nadino: Hi, have you looked at this report? It seems to be quite a serious problem. 
Moreover, you should check on your DB whether the item is actually sent or if it is a false positive. I cannot check it since I do not have access to the database. I can tell that, according to the responses, a logic control is missing.
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2018-06-01** @nadino: Thank you for the bounty. I can confirm it is resolved
- **Agreed On Going Public**
- **Report Became Public**
