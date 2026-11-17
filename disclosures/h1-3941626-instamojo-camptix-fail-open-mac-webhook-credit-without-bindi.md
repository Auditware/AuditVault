---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-11-05
submitted: 2026-08-15T04:52:27.098Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "0xbs0d27"
source: "https://hackerone.com/reports/3941626"
title: "Instamojo CampTix: fail-open MAC + webhook Credit without binding payment to order"
---
# Instamojo CampTix: fail-open MAC + webhook Credit without binding payment to order

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** WordPress | **Disclosed:** 2026-11-05

- Report: [https://hackerone.com/reports/3941626](https://hackerone.com/reports/3941626)
- CWE: Improper Access Control - Generic
- Submitted: 2026-08-15T04:52:27.098Z

## Report summary

Instamojo payment addon never tied an Instamojo payment to a specific ticket order (unlike Razorpay in the same plugin).
An attacker could get tickets marked “pending” or “paid” without a matching payment—e.g. bad webhook signatures still advanced status, or a real payment for one order could complete another.

## Timeline

- **Report Filed**
- **Report Resolved**
- **2026-08-27** @0xbs0d27: Thanks for resolving. Could you clarify why this was closed without a bounty?
- **2026-08-27** @bornull: @0xbs0d27, this shows as resolved because it is resolved, on the technical side :) 

The next step after the resolution is the bounty admin review. You should hear from them soon.
- **Bounty Awarded**
- **2026-11-05** @0xbs0d27: Hi @bornull and team — thank you again for resolving this and for the bounty; really appreciated.

This has been Resolved since August, and I wanted to ask gently: if it works for you, would you mind approving public disclosure so it can show up in Hacktivity, similar to your other WordCamp/meta reports?

I’ve added a short Hacker summary for the public view — happy to tweak anything if you’d like changes before approving.

Thanks so much, and thanks again for your work on this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
