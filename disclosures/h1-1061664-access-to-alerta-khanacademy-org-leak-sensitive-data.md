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
date: 2021-09-08
submitted: 2020-12-18T15:05:33.301Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "myominthu_sec"
source: "https://hackerone.com/reports/1061664"
title: "Access to alerta.khanacademy.org leak sensitive data "
---
# Access to alerta.khanacademy.org leak sensitive data 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Khan Academy | **Disclosed:** 2021-09-08

- Report: [https://hackerone.com/reports/1061664](https://hackerone.com/reports/1061664)
- CWE: Improper Access Control - Generic
- Submitted: 2020-12-18T15:05:33.301Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi ,
I found to access https://alerta.khanacademy.org/ using signup bypass.That leak access to sensitive data of khanacademy.org

Step To Reproduce:

1. Go to https://alerta.khanacademy.org/#/signup
2. Inspect Q and remove ng-hide

{F1121291}

3. You got Signup Form. Signup account using anythings@khanacademy.org mail.

{F1121292}

4. When you successfully signup,You access alerta.khanacademy.org without confirm email.

{F1121297}

If you not login direct .
1. Go to alerta.khanacademy.org/#/login.
2. Inspect Q and remove ng-hide

{F1121293}

3. Login with your register info.

{F1121294}

## Impact

Attacker can access alerta dashboard

Thanks,
@nightmare_msf

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-12-19** @myominthu_sec: Hi @drosile,

My Khan Academy username is nightmaremsf.

Thanks,
@nightmare_msf
- **2020-12-24** @drosile: Thanks again for your report! I've just added the badge to your account.

best,
Diana
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
