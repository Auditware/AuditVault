---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/externally-controlled-reference-to-a-resource-in-another-sph
  - env/web
substate: "resolved"
weakness: "Externally Controlled Reference to a Resource in Another Sphere"
enriched: true
body: true
date: 2021-06-26
submitted: 2021-04-29T23:47:33.652Z
bounty_usd: null
votes: 84
cve: []
program: "[[programs/zego|Zego]]"
reporter: "ian"
source: "https://hackerone.com/reports/1180697"
title: "Subdomain takeover of v.zego.com"
---
# Subdomain takeover of v.zego.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 84 | **Program:** Zego | **Disclosed:** 2021-06-26

- Report: [https://hackerone.com/reports/1180697](https://hackerone.com/reports/1180697)
- CWE: Externally Controlled Reference to a Resource in Another Sphere
- Submitted: 2021-04-29T23:47:33.652Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
v.zego.com points to an AWS EC2 instance at 52.214.138.192 that no longer exists. I was able to take control of this IP address and run my own EC2 instance. I can now serve content on this domain, obtain a TLS certificate for this domain, etc.

If any customers or servers are pointing to anything within this domain, I could serve them arbitrary/malicious content. I could also use this in case your domain whitelists your own domain for OAuth, or if there are cookies scoped to the entire domain. Usually this can have a high impact.

### PoC
```
% dig +short v.zego.com
52.214.138.192

% curl v.zego.com
<!-- hackerone.com/ian -->
```

## Impact

Subdomain takeover

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
