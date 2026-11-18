---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: none
date: 2024-02-15
submitted: 2023-10-30T21:18:51.757Z
bounty_usd: null
votes: 13
cve: "CVE-2024-22019"
program: "[[programs/nodejs|Node.js]]"
reporter: "bart"
source: "https://hackerone.com/reports/2233486"
title: "http: Reading unprocessed HTTP request with unbounded chunk extension allows DoS attacks"
---
# http: Reading unprocessed HTTP request with unbounded chunk extension allows DoS attacks

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Node.js | **Disclosed:** 2024-02-15

- Report: [https://hackerone.com/reports/2233486](https://hackerone.com/reports/2233486)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-22019
- Submitted: 2023-10-30T21:18:51.757Z

## Timeline

- **Report Filed**
- **2023-10-31** @bart: 
- **2023-11-01** @vdeturckheim: 
- **Report Triaged**
- **External User Joined**
- **2023-11-02** @shogun_panda: 
- **2023-11-03** @mcollina: 
- **2023-12-07** @bart: 
- **2023-12-20** @bart: 
- **2023-12-25** @tniessen: 
- **2024-01-15** @bart: 
- **2024-01-15** @mcollina: 
- **2024-01-15** @bart: 
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-02-16** @bart: 
