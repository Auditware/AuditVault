---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2018-08-09
submitted: 2018-07-30T22:20:33.463Z
bounty_usd: null
votes: 91
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "0xpatrik"
source: "https://hackerone.com/reports/388622"
title: "Subdomain takeover on wfmnarptpc.starbucks.com"
---
# Subdomain takeover on wfmnarptpc.starbucks.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 91 | **Program:** Starbucks | **Disclosed:** 2018-08-09

- Report: [https://hackerone.com/reports/388622](https://hackerone.com/reports/388622)
- CWE: Privilege Escalation
- Submitted: 2018-07-30T22:20:33.463Z

## Report summary

Subdomain takeover possible on one of Starbucks's subdomain. The subdomain pointed to Microsoft Azure Traffic Manager which was no longer registered under Azure.

Detailed write-up: https://0xpatrik.com/subdomain-takeover-starbucks-ii/

## Timeline

- **Report Filed**
- **2018-07-31** @thefrog: Hi,

Thank you for your submission. We have received your report.

Best regards,
@thefrog

Security Analyst
**HackerOne**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-08-07** @0xpatrik: Can we disclose this?
- **2018-08-09** @ristretto: Hi @0xpatrik, We will disclose the report, Can you please release the "s00149tmppcrpt" traffic manager account that you have claimed?

Thanks!
@ristretto
- **2018-08-09** @0xpatrik: I released that last week.
- **2018-08-09** @ristretto: Ok, Thanks for confirming!

@ristretto
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
