---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/subdomain-takeover
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-05-14
submitted: 2021-05-14T06:14:10.099Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "ian"
source: "https://hackerone.com/reports/1197013"
title: "Subdomain takeover of ████.jitsi.net"
---
# Subdomain takeover of ████.jitsi.net

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** 8x8 | **Disclosed:** 2021-05-14

- Report: [https://hackerone.com/reports/1197013](https://hackerone.com/reports/1197013)
- CWE: Privilege Escalation
- Submitted: 2021-05-14T06:14:10.099Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
█████.jitsi.net points to an AWS EC2 instance at 18.195.93.116 that no longer exists. I was able to take control of this IP address and run my own EC2 instance. I can now serve content on this domain, obtain a TLS certificate for this domain, etc.

If any customers or servers are pointing to anything within this domain, I could serve them arbitrary/malicious content. I could also use this in case your domain whitelists your own domain for OAuth, or if there are cookies scoped to the entire domain. Usually this can have a high impact.

```
% dig +short ██████.jitsi.net
18.195.93.116

% curl ██████████.jitsi.net
<!-- hackerone.com/ian -->
```

## Impact

Subdomain takeover

## Timeline

- **Report Filed**
- **2021-05-14** @42x42: Hey @ian,
Thanks for your submission. Your report is currently being reviewed and the triage team will get back to you once there is additional information to share.
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **Reassigned To Team**
- **Not Eligible For Bounty**
