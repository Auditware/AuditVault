---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/cloud
  - stack/docker
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-06-06
submitted: 2018-05-04T00:33:58.671Z
bounty_usd: null
votes: 83
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "thehackerish"
source: "https://hackerone.com/reports/347296"
title: "Docker Registry HTTP API v2 exposed in HTTP without authentication leads to docker images dumping and poisoning"
---
# Docker Registry HTTP API v2 exposed in HTTP without authentication leads to docker images dumping and poisoning

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 83 | **Program:** Semmle | **Disclosed:** 2020-06-06

- Report: [https://hackerone.com/reports/347296](https://hackerone.com/reports/347296)
- CWE: Improper Access Control - Generic
- Submitted: 2018-05-04T00:33:58.671Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-05-04** @thehackerish: Thank you for your fast feedback and for the bounty. The only reason for my pivoting was that RCE on the build was accepted behaviour. But I tried to escape from it as mentioned in your policy.
Once again, thank you for your prompt collaboration. You're doing a great job!

Can I blog about it without mentioning anything about you?
- **2018-05-04** @thehackerish: I also noticed you have a whitelist that limits users from installing arbitrary packages on the sandbox. Can I report a way to bypass it? Actually, I used the same bypass to install packages that helped me find the exposed Docker Registry Api.
- **Report Resolved**
- **2018-05-08** @jmdh: @hackerish as the attack is fairly specific to what we're doing we would like to review a draft of a blog post before you publish it. Would this work for you? Feel free to email this to us at bug-bounty@semmle.com.
- **2018-05-08** @thehackerish: @jmdh thank you very much for your feedback. I will start working on it whenever I have time. I'll let you have a look at it when it is ready.
- **Agreed On Going Public**
- **Report Became Public**
