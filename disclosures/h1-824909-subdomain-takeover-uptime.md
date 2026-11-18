---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/xss
  - vuln/authentication-bypass
  - vuln/subdomain-takeover
  - trigger/social-engineering
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-05-05
submitted: 2020-03-19T21:29:44.357Z
bounty_usd: 100
votes: 14
cve: []
program: "[[programs/btfs|BTFS]]"
reporter: "ahmed_alwardani"
source: "https://hackerone.com/reports/824909"
title: "Subdomain Takeover uptime"
---
# Subdomain Takeover uptime

> **Severity:** High | **Bounty:** 100 USD | **Votes:** 14 | **Program:** BTFS | **Disclosed:** 2020-05-05

- Report: [https://hackerone.com/reports/824909](https://hackerone.com/reports/824909)
- CWE: Privilege Escalation
- Submitted: 2020-03-19T21:29:44.357Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team:

i can't report it to the company so i hope to accept it as a valid bug , i found subdomain takeover in your subdomain ```uptime.btfs.io``` , i found this subdomain pointed to uptimerobot and not claimed so i signedup in uptimerobot and claimed it.

POC:
------

1 - open https://uptime.btfs.io/
2 - you need a password to login ```A123456789```
3 - {F753695}

## Impact

- Subdomain takeover can be abused to do several things like :
Malware distribution
Phishing / Spear phishing
XSS
Authentication bypass
Legitimate mail sending and receiving on behalf of ford subdomain

## Timeline

- **Report Filed**
- **2020-03-19** @taiyangc: Hi @sniper302 Thanks for the report. Could you elaborate how the takeover was done? Was it an uptimerobot policy that any unclaimed site can directly be re-assigned without any verification? Or did you figure out a password or vulnerable email somewhere?
- **2020-03-20** @ahmed_alwardani: Hey @taiyangc  Yes it an uptimerobot policy that any unclaimed site can directly be re-assigned without any verification.
I found that this subdomain pointed to uptimerobot and has an error ```not found``` so I go to quickly to signup and claim your subdomain.
- **2020-03-25** @taiyangc: Hi @sniper302 thank you for this valid report. Nobody likes a subdomain takeover. We would like to award you a low severity bounty of $100 because 1) we never advertised this site to any external users 2) no actual impact on our network. Thank you for taking your time and submitting this discovery, we have taken this subdomain offline as we discontinued using uptimerobot.
- **Bounty Awarded**
- **Report Resolved**
- **2020-03-25** @ahmed_alwardani: Thanks @taiyangc for the fast response and bounty
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
