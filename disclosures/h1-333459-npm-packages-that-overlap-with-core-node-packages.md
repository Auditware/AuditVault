---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/phishing
  - env/web
  - stack/node
substate: "informative"
weakness: "Phishing"
enriched: true
date: 2018-06-16
submitted: 2018-04-04T16:09:43.640Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mlucool"
source: "https://hackerone.com/reports/333459"
title: "npm packages that overlap with core node packages"
---
# npm packages that overlap with core node packages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-16

- Report: [https://hackerone.com/reports/333459](https://hackerone.com/reports/333459)
- CWE: Phishing
- Submitted: 2018-04-04T16:09:43.640Z

## Timeline

- **Report Filed**
- **2018-04-04** @cjihrig: Thanks for the report. Unfortunately, both of the issues you report here (postinstall scripts, and overlapping package names) are outside of our control, and completely in npm's hands.
- **Report Triaged**
- **2018-06-16** @lirantal: Appreciate your report @mlucool 
I'll close it for informative reasons, thanks!
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
