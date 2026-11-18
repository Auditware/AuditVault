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
date: 2020-05-27
submitted: 2020-04-18T04:27:27.475Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "r00tpgp"
source: "https://hackerone.com/reports/852713"
title: "Previously Compromised PulseSSL VPN Hosts"
---
# Previously Compromised PulseSSL VPN Hosts

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-27

- Report: [https://hackerone.com/reports/852713](https://hackerone.com/reports/852713)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2020-04-18T04:27:27.475Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi again!!

Back in 2019, I had reported that a pulseSSL VPN server owned by US DoD can be compromised by a publicly available exploit. The report is #681249. As a result, the userid and passwd db was also compromised. I  found  that at least 1 userid and password combination from that compromised db can still be used. 


##PoC

Here is a screenshot of me accessing a US DoD owned website using a compromised credentials found back in 2019. I am still able to login to https://████/dana-na/auth/url_46/welcome.cgi with:

l: ███
p: █████████

███████
███████

Here is the creds from  Sep, 2019.

█████

## Impact

It is widely reported in the media that blackhat hackers around the world are still hacking fully patched PulseSSL VPN hosts because owners did not change the passwords that was compromised back in 2019. The articles that I am referring  to is at :

https://www.us-cert.gov/ncas/alerts/aa20-107a
https://thehackernews.com/2020/04/pulse-secure-vpn-vulnerability.html

##Fix
Other than patching, it is strongly advisable that the impacted organization `███`   __reset all passwords immediately__.

## Timeline

- **Report Filed**
- **2020-04-18** @r00tpgp: i'v discovered another site that might belong to the same org - `█████` with the same prob. Old creds not reset after system compromise.

███
████████
- **2020-04-20** @agent-r5: We would that ask you split these up, since they are different domains (so we do not confuse our system owners downstream). Also gives you more points here on hackerone :). Just open a another report for ██████████ and we will leave this one for █████████. If you do not want to we can (just let us know) you just wont get the credit on hackerone.
- **2020-04-20** @r00tpgp: @agent-r5  Fully agreed! Love you! Will do shortly. Thx
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
