---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/cloud
  - stack/kubernetes
  - stack/nginx
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2021-12-04
submitted: 2021-07-01T22:51:28.226Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "libio"
source: "https://hackerone.com/reports/1249583"
title: "Authenticated kubernetes principal with restricted permissions can retrieve ingress-nginx serviceaccount token and secrets across all namespaces"
---
# Authenticated kubernetes principal with restricted permissions can retrieve ingress-nginx serviceaccount token and secrets across all namespaces

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** Kubernetes | **Disclosed:** 2021-12-04

- Report: [https://hackerone.com/reports/1249583](https://hackerone.com/reports/1249583)
- CWE: Privilege Escalation
- Submitted: 2021-07-01T22:51:28.226Z

## Timeline

- **Report Filed**
- **2021-07-02** @h1_analyst_leon: Hi @libio,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@tuxedo
- **Report Severity Updated**
- **2021-07-30** @libio: Hi @tuxedo ,

It's been quite some time since there's been any activity on my report. Do you happen to have an update?

Kind regards,
Mitch
- **2021-08-07** @h1_analyst_leon: Hi @libio,

Sorry for the delay! We are still looking into this report and will update you when we have additional information to share. Thanks for your patience!
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-09-27** @libio: Thank you for the reward! was wondering if there was any more information that could be shared? For example is a CVE going to be assigned? Also I was wondering if and when a security advisory will be published? Thanks in advance.
- **2021-10-07** @cjcullen: Thanks for following up. A CVE will be issued for this. We are coordinating with Kubernetes distributors now, and you can expect a public announcement in the coming weeks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
