---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2019-03-26
submitted: 2018-03-09T19:33:21.827Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/pingidentity|Ping Identity]]"
reporter: "rijalrojan"
source: "https://hackerone.com/reports/323975"
title: "CSRF in Inviting users"
---
# CSRF in Inviting users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Ping Identity | **Disclosed:** 2019-03-26

- Report: [https://hackerone.com/reports/323975](https://hackerone.com/reports/323975)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2018-03-09T19:33:21.827Z

## Timeline

- **Report Filed**
- **2018-03-10** @bagofchips: Hey @uranium238,

Thanks for the report. We'll be looking into it and get back to you shortly.

Regards,
@bagofchips
- **Report Triaged**
- **2018-03-10** @rijalrojan: Sounds good. Thanks @bagofchips
- **2018-03-12** @rijalrojan: By the way, I forgot to give reasoning on why it was marked Critical:

When a user is added, they can use the SSO platform to easily login to any internal application of a company. This can be exploited easily and has a major impact on company's integrity so the CVSS reflects that.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
