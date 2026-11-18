---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/network
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2020-07-30
submitted: 2020-04-20T10:53:00.503Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "r00tpgp"
source: "https://hackerone.com/reports/854049"
title: "PulseSSL VPN Site with Compromised Creds @ ████"
---
# PulseSSL VPN Site with Compromised Creds @ ████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-30

- Report: [https://hackerone.com/reports/854049](https://hackerone.com/reports/854049)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2020-04-20T10:53:00.503Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear US DoD,

Back in 2019, I had reported that a pulseSSL VPN server owned by US DoD can be compromised by a publicly available exploit. The report is████████. As a result, the userid and passwd db was also compromised. I found that at least 1 userid and password combination from that compromised db can still be used.

##PoC

Here is a screenshot of me accessing a US DoD owned website using a compromised credentials found back in 2019. I am still able to login to https://████/dana-na/auth/url_3/welcome.cgi with:

l: █████████
p:  █████

█████

Here is the screenshot of the credentials that was dump back in 2019:

████

## Impact

It is widely reported in the media that blackhat hackers around the world are still hacking fully patched PulseSSL VPN hosts because owners did not change the passwords that was compromised back in 2019. The articles that I am referring to is at :

https://www.us-cert.gov/ncas/alerts/aa20-107a
https://thehackernews.com/2020/04/pulse-secure-vpn-vulnerability.html

##Fix
Other than patching, it is strongly advisable that the impacted organization `█████████` reset all passwords immediately.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-20** @agent-l8: added to the queue. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
