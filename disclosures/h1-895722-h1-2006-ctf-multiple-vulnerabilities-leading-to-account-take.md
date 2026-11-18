---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-07-06
submitted: 2020-06-10T23:42:09.687Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "kapytein"
source: "https://hackerone.com/reports/895722"
title: "[h1-2006 CTF] Multiple vulnerabilities leading to account takeover and two-factor authentication bypass allows to send pending bounty payments"
---
# [h1-2006 CTF] Multiple vulnerabilities leading to account takeover and two-factor authentication bypass allows to send pending bounty payments

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** h1-ctf | **Disclosed:** 2020-07-06

- Report: [https://hackerone.com/reports/895722](https://hackerone.com/reports/895722)
- CWE: N/A
- Submitted: 2020-06-10T23:42:09.687Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

First things first, the flag of the CTF challenge.

{F863095}

### Write-Up

I've published my write-up at https://kapytein.nl/texts/2020-06-10-h1-2006-ctf-writeup-2cf34abd3ed/, in order to avoid a lengthy report 😅. 

### TL;DR

1) 2FA bypass as we control both values on the comparison. 
2) SSRF to `software.bountypay.h1ctf.com` to discover a BountyPay Android application.
3) Solve Android challenges using deeplinks. Use leaked Authorization token for `api.bountypay.h1ctf.com`.
4) Leaked staff ID on the badge of [Sandra](https://twitter.com/SandraA76708114) allows access to `staff.bountypay.h1ctf.com` via a `POST /api/staff` call on `api.bountypay.h1ctf.com`.
5) Privilege escalation using GET CSRF.
6) 2FA bypass via a CSS injection.

Thank you for organizing this challenge!

## Impact

This allows an attacker to process bounty payments of customers.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-06-11** @nahamsec: Hello,

I wanted to personally thank you for participating in the #h12006 2020 CTF, I hope you enjoyed the challenge! We received tons of great submission and it definitely made our decision a lot harder than we excepted. Unfortunately, since we only have a limited number of invites available, your write up was not selected for this event. We appreciate your hard work and we hope to see you participate in our next CTF!

We will send you a request to publicly disclose your submissions next week, so please hold on to your writeups, we'll make sure to let you know when you can publish them on your site!

If you were one of the first 10 people to submit a write-up,  look out for some private invite in the next few days!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
