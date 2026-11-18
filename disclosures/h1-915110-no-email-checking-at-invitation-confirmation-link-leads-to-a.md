---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-11-18
submitted: 2020-07-04T01:36:04.584Z
bounty_usd: null
votes: 63
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/915110"
title: "No Email Checking at Invitation Confirmation Link leads to Account Takeover without User Interaction at CrowdSignal"
---
# No Email Checking at Invitation Confirmation Link leads to Account Takeover without User Interaction at CrowdSignal

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 63 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/915110](https://hackerone.com/reports/915110)
- CWE: Improper Access Control - Generic
- Submitted: 2020-07-04T01:36:04.584Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team,
When you have a team account, you can invite users to your team from https://app.crowdsignal.com/users/list-users.php
If you invite a user, you will see this :
{F893386}
As you can see, there is confirmation link and we can see it from our dashboard.
And if you invite existing email in website, you can see the confirmation link again. And in this link, there is no e-mail check, when you click to confirmation link, you will log-in to victim's account without any error, credentials.

## Steps To Reproduce:

  1. Go to https://app.crowdsignal.com/users/list-users.php with your team account
  1. Invite an existing email (write victim's email)
  1. And click to confirmation link with your account
  1. You will log-in to victim's account directly

## PoC video :
{F893388}

## Impact

Account Takeover without user interaction

Thanks,
Bugra

## Timeline

- **Report Filed**
- **2020-07-04** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-07-07** @donncha: The problem should be fixed now. The confirmation link is replaced with a button to resend the confirmation email (it's rate limited), and any confirmation links must be clicked by a user with the same email address as the person who was invited.
Can you give it a spin please?
- **2020-07-07** @bugra: Hi @donncha, I can confirm the fix. I can't see the confirmation link anymore, and if I click it with another email address I see `This invite is not for you!` error. I couldn't find a bypass. Great!
- **Report Resolved**
- **Bounty Awarded**
- **2020-07-09** @bugra: Hi @xknown, thank you so much for the bounty and bonus. If it's possible, can I request public disclosure for my all reports after all bugs are resolved?
- **2020-07-09** @xknown: > If it's possible, can I request public disclosure for my all reports after all bugs are resolved?

Sure :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
