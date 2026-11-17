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
date: 2018-08-02
submitted: 2018-07-05T16:49:15.267Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/monero|Monero]]"
reporter: "jagerman"
source: "https://hackerone.com/reports/377592"
title: "A bug in the Monero wallet balance can enable theft from exchanges"
---
# A bug in the Monero wallet balance can enable theft from exchanges

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Monero | **Disclosed:** 2018-08-02

- Report: [https://hackerone.com/reports/377592](https://hackerone.com/reports/377592)
- CWE: Business Logic Errors
- Submitted: 2018-07-05T16:49:15.267Z

## Timeline

- **Report Filed**
- **2018-07-05** @moneromooo: Thanks. As you saw, it's been fixed already. The multiplier is in fact up to however many tx keys can fit in a tx. 0.12.3.0 will be released very soon.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-27** @jagerman: 4AwXiXiKP3c8gMkcww4PNQAMvcZ9vn1vteVPnrivJQus6ykSdfuJwZicAwPTdJjHwpMAuFQi48RTvdtXNLJ9TxtRNAFvXdr
- **2018-08-01** @luigi1111w: Sent 10 XMR: <5388617a44e293e6dae7a17699897414af6cff3b206a77ae8ecbdf7accb6c39d>
- **Swag Awarded**
- **Manually Disclosed**
