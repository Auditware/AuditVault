---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2023-06-28
submitted: 2023-04-24T11:40:24.169Z
bounty_usd: null
votes: 73
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "spongebhav"
source: "https://hackerone.com/reports/1960107"
title: "Rider can forcefully get passenger's order accepted resulting in multiple impacts including PII reveal  and more mentioned in the report."
---
# Rider can forcefully get passenger's order accepted resulting in multiple impacts including PII reveal  and more mentioned in the report.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 73 | **Program:** inDrive | **Disclosed:** 2023-06-28

- Report: [https://hackerone.com/reports/1960107](https://hackerone.com/reports/1960107)
- CWE: Improper Access Control - Generic
- Submitted: 2023-04-24T11:40:24.169Z

## Report summary

A vulnerability was found in a customer order flow that allowed a driver to accept an order on behalf of a passenger. This vulnerability allowed the driver to set the ride price by force bypassing the built-in ride price calculation algorithm, where the passenger and the driver negotiate the fare based on their preferences.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2023-04-25** @spongebhav: Also, apologies, the video and sound may mismatch due to 3 videos put in one. I am not a good editor that's for sure :P
- **Report Triaged**
- **Bounty Awarded**
- **2023-05-02** @ttffdd_indriver: Nice finding! Very great job, thanks
- **2023-05-02** @spongebhav: Hello @ttffdd_indriver 

> Nice finding! Very great job, thanks

Thank you so much for the bounty and for the compliments.

I was wondering, since it was a chain consisting of ***two*** different vulnerabilities, and impact affected both ***PII*** and ***financial***.

Does it qualify for a single award or there is a bonus bounty award for such cases where multiple vulns are reported as one to increase impact?

I wanted to know your take on this.

Please let me know your final ruling on this report.

Thank you again. :D
@spongebhav
- **2023-05-02** @majesttic: Hi @spongebhav! 

The vulnerable request is `/api/setTenderStatus`, which allows the driver to accept an offer for a passenger. This breaks the logic of the application and reveals information about the passenger. 

The `/api/driverrequest` is not vulnerable, you can offer a price higher, lower or accept the passenger's price. The passenger then decides which offer to accept. This method is not vulnerable.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
