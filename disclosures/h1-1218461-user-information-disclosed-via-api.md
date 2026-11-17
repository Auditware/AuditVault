---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2022-10-19
submitted: 2021-06-06T08:07:33.006Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "toormund"
source: "https://hackerone.com/reports/1218461"
title: "User information disclosed via API"
---
# User information disclosed via API

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. General Services Administration | **Disclosed:** 2022-10-19

- Report: [https://hackerone.com/reports/1218461](https://hackerone.com/reports/1218461)
- CWE: Information Disclosure
- Submitted: 2021-06-06T08:07:33.006Z

## Timeline

- **Report Filed**
- **2021-06-07** @h1_analyst_chanel: Hi @toormund,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chinch1lla
- **Report Triaged**
- **2021-06-07** @issamy11: @toormund Thank you for your report. Our team is currently looking into it and we will follow up with questions if applicable.
- **2021-07-03** @toormund: Hi @issamy11, just wanted to circle back and say that I think it might be worth checking to make sure a user could not make a PUT request and change other user statuses. I saw the PII so just stopped where I was but making different API requests would be the next thing I would try to do if I were a malicious actor.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
