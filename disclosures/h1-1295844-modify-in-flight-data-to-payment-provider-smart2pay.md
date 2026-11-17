---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2021-08-10
submitted: 2021-08-09T13:18:20.444Z
bounty_usd: 7500
votes: 443
cve: []
program: "[[programs/valve|Valve]]"
reporter: "drbrix"
source: "https://hackerone.com/reports/1295844"
title: "Modify in-flight data to payment provider Smart2Pay"
---
# Modify in-flight data to payment provider Smart2Pay

> **Severity:** Critical | **Bounty:** 7,500 USD | **Votes:** 443 | **Program:** Valve | **Disclosed:** 2021-08-10

- Report: [https://hackerone.com/reports/1295844](https://hackerone.com/reports/1295844)
- CWE: Business Logic Errors
- Submitted: 2021-08-09T13:18:20.444Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2021-08-10** @jonp: We are deploying a fix to our production systems now. Can you please retest and let us know what you find? Thank you. We'll follow up with bounty/severity soon.
- **2021-08-10** @drbrix: Hi!
Im a little sick rigth now :(
I will retest as soon as I will abe to.
- **2021-08-10** @drbrix: Hi,

Payment flow wasnt changed and its still possible to modify amount. However idk how verifying payment looks like on the server side. I made payment and I didnt get any wallet balance. But before it took few hours/days to process payment, so I cant tell if its fixed or not. I will let you know if/when i will get my payment confirmed.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-08-10** @drbrix: Wow, thanks for bounty!
- **Agreed On Going Public**
- **Report Became Public**
