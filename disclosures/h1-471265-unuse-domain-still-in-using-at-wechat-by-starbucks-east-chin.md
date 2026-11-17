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
date: 2019-01-22
submitted: 2018-12-22T18:27:37.298Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "k3mlol"
source: "https://hackerone.com/reports/471265"
title: "unuse domain still in using at wechat by Starbucks East China"
---
# unuse domain still in using at wechat by Starbucks East China

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Starbucks | **Disclosed:** 2019-01-22

- Report: [https://hackerone.com/reports/471265](https://hackerone.com/reports/471265)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-22T18:27:37.298Z

## Timeline

- **Report Filed**
- **2018-12-22** @k3mlol: I tell some background: **wechat** is the top 1 IM  tool in China, billions users. Wechat offer two main service for company, help company connect the consumer. one is  **wechat offical account**, other is **mini programs**.

 in 2019, I will take some  time to test the wechat service which offer by Starbucks China.

Merry Christmas.
- **2018-12-24** @lollipup: Hi @k3m,

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Kind regards,
@lollipup
- **Report Needs More Info**
- **Report New**
- **2018-12-24** @k3mlol: my burp result
- **2018-12-25** @k3mlol: @lollipup it seem to verify the cookie. I had wrote a python script help you to Triaged, I had refresh the cookie.
- **2018-12-27** @k3mlol: @lollipup hey, I ad refresh a cookie for you:
``` html
PHPSESSID=70ubsnm9lomiqumit5e0mq5sti1dpuka
```
- **Report Needs More Info**
- **Report New**
- **2019-01-02** @k3mlol: @lollipup, it's time to register a wechat account hahaha.
- **Report Triaged**
- **2019-01-05** @k3mlol: @nitrobr3w ok, maybe you need to bug down this domain name
- **2019-01-08** @nitrobr3w: @k3m, Can you please verify if the issue still exists ?
- **2019-01-08** @k3mlol: @nitrobr3w plz, wait a min
- **2019-01-08** @k3mlol: @nitrobr3w Yes, it's fixed. nice work
- **Bounty Awarded**
- **Report Resolved**
- **2019-01-10** @k3mlol: @nitrobr3w thx, daqi 666
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
