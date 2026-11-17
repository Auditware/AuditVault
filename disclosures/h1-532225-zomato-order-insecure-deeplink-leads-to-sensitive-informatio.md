---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2021-09-23
submitted: 2019-04-09T01:46:13.333Z
bounty_usd: 750
votes: 114
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "shell_c0de"
source: "https://hackerone.com/reports/532225"
title: "[Zomato Order] Insecure deeplink leads to sensitive information disclosure"
---
# [Zomato Order] Insecure deeplink leads to sensitive information disclosure

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 114 | **Program:** Eternal | **Disclosed:** 2021-09-23

- Report: [https://hackerone.com/reports/532225](https://hackerone.com/reports/532225)
- CWE: N/A
- Submitted: 2019-04-09T01:46:13.333Z

## Timeline

- **Report Filed**
- **2019-04-09** @biryani-is-lob: Hi, @shell_c0de

Thanks for your submission, we are looking into this. 

Thanks 
@ehsahil-zomato
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-04-09** @shell_c0de: Hi @ehsahil-zomato ,

Where did I go wrong, why is the severity level medium?

Kind regards,
@shell_c0de
- **2019-04-09** @biryani-is-lob: Hi @shell_c0de, 

This is interesting find but since it requires user interaction it falls under medium severity. 

Also, recent changes reintroduced this bug, Internally team was aware of it, we will be fixing this up. 

The similar issue already disclosed: #328486

Thanks
@ehsahil-zomato
- **2019-04-09** @shell_c0de: @ehsahil-zomato ,

Understood, thanks for the explanation.

Kind regards,
@shell_c0de
- **Bounty Awarded**
- **2019-04-13** @shell_c0de: @ehsahil-zomato ,
Thanks!
- **2019-04-15** @shell_c0de: @ehsahil-zomato ,

Package Name: `com.application.zomato`
Version: `13.2.6`
Status: Fixed

Kind regards,
@shell_c0de
- **2019-04-16** @biryani-is-lob: Hi @shell_c0de

Thanks for confirming the fix proactively. We're making few more changes, will be releasing the newer version soon.

Thanks,
@ehsahil-zomato
- **Report Resolved**
- **2019-05-25** @shell_c0de: Hi @ehsahil-zomato ,

In which version was the bug fixed? Version 5.6.4 has not been fixed.

Kind regards,
@shell_c0de
- **2019-05-27** @prateek_0490-zomato: @shell_c0de - Our order app will be deprecated within a month, hence @ehsahil-zomato marked it as resolved.

Prateek
- **Agreed On Going Public**
- **Report Title Updated**
- **Changed Scope**
- **Report Severity Updated**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
