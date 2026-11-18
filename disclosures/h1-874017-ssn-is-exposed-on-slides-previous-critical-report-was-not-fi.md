---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2020-06-11
submitted: 2020-05-14T09:20:06.307Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pvm"
source: "https://hackerone.com/reports/874017"
title: "SSN is exposed on slides, previous critical report was not fixed in an appropriate way"
---
# SSN is exposed on slides, previous critical report was not fixed in an appropriate way

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-06-11

- Report: [https://hackerone.com/reports/874017](https://hackerone.com/reports/874017)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2020-05-14T09:20:06.307Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
SSN is exposed on slides, previous critical report was not fixed in an appropriate way

**Description:**
1. SSN is exposed on a screenshot. Slide 13th. SSN is covered by an olive/green rectangle which is moveable. The image itself was not updated. 
██████wp-content/uploads/2018/12/████████

2. The issue was previously submitted and was not fixed in an appropriate way.
https://hackerone.com/reports/█████████

3. The file is easy to find by the file name.
https://duckduckgo.com/?q=%22███%22&t=hj&ia=web

## Impact
Critical
███████ is a real person (officer) according to  ██████████

## Step-by-step Reproduction Instructions
1. Download the file ████████wp-content/uploads/2018/12/█████
2. Navigate to slide 13
3. Move the olive rectangle which covers SSN

## Product, Version, and Configuration (If applicable)
N/A

## Suggested Mitigation/Remediation Actions
Blur/remove/cover the SSN on the image and replace the image on the slides.

## Impact

PII leakage. Name and SSN.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
