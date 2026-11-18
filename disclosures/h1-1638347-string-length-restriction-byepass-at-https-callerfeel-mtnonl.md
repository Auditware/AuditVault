---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2022-09-07
submitted: 2022-07-15T17:47:12.116Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "aliyugombe"
source: "https://hackerone.com/reports/1638347"
title: "String length restriction byepass at https://callerfeel.mtnonline.com/profile/feedback.html"
---
# String length restriction byepass at https://callerfeel.mtnonline.com/profile/feedback.html

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** MTN Group | **Disclosed:** 2022-09-07

- Report: [https://hackerone.com/reports/1638347](https://hackerone.com/reports/1638347)
- CWE: Violation of Secure Design Principles
- Submitted: 2022-07-15T17:47:12.116Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi, hope you are well :)

I found that the attacker can bye pass the lenght restriction of user name at the feedback form

## Steps To Reproduce:
{F1823237}

## Impact

Attacker can make the receiver page to delay and can cause application level dos

##Mitigation:
Restrict the lenght of the string in backend too not only front end 

Best regards
@aliyugombe

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
