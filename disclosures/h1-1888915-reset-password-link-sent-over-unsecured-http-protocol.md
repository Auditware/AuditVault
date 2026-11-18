---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/network
  - trigger/one-click
  - trigger/victim-interaction
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-05-10
submitted: 2023-02-28T10:37:19.662Z
bounty_usd: 750
votes: 440
cve: []
program: "[[programs/mattermost|Mattermost]]"
reporter: "uchihaluckycs"
source: "https://hackerone.com/reports/1888915"
title: "Reset password link sent over unsecured http protocol"
---
# Reset password link sent over unsecured http protocol

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 440 | **Program:** Mattermost | **Disclosed:** 2023-05-10

- Report: [https://hackerone.com/reports/1888915](https://hackerone.com/reports/1888915)
- CWE: Improper Access Control - Generic
- Submitted: 2023-02-28T10:37:19.662Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
After creating the workspace, if victim clicks on forgot password then reset password link has been generated and sent over mail and that password link is unsecured http protocol.

## Steps To Reproduce:

  1. Signup to a workspace
  2. Navigate to https://h1-\*your-own-instance\*.cloud.mattermost.com/reset_password and enter signup email
  3. Check email, you will get reset passwork link. {F2201387}
  4. Copy that link paste in notepad and observe the protocol. {F2201388}

## Mitigation:
Generate reset password link with secured https protocol.

## Impact

If the victim opens the reset password link and forgot to update the password, anyone from intermediate computers through network or sniffer can reset the password.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2023-03-06** @osku_mattermost: Thank you for your report. We will investigate the issue as soon as possible and shall let you know if we need any more information. Once validated, we will let you know and triage the issue.  

Best regards and happy hunting!
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-03-18** @uchihaluckycs: Thanks for the bounty
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-09-24** @uchihaluckycs: Am I eligible for the swag?
- **Swag Awarded**
- **2023-09-29** @uchihaluckycs: Thanks for the swag
