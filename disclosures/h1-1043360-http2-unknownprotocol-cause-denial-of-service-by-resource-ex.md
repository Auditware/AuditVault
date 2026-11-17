---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2021-03-15
submitted: 2020-11-25T11:06:27.818Z
bounty_usd: null
votes: 3
cve: "CVE-2021-22883"
program: "[[programs/nodejs|Node.js]]"
reporter: "omicronenergy"
source: "https://hackerone.com/reports/1043360"
title: "HTTP2 'unknownProtocol' cause Denial of Service by resource exhaustion"
---
# HTTP2 'unknownProtocol' cause Denial of Service by resource exhaustion

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js | **Disclosed:** 2021-03-15

- Report: [https://hackerone.com/reports/1043360](https://hackerone.com/reports/1043360)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2021-22883
- Submitted: 2020-11-25T11:06:27.818Z

## Timeline

- **Report Filed**
- **2020-12-01** @jasnell: Thank you for the report. Looks like we can confirm this one @mcollina @mhdawson .. unfortunately I don't have the time immediately available to work on it.
- **Report Triaged**
- **External User Joined**
- **2021-01-11** @omicronenergy: Hi - may I ask for an update? Are there any plans?
- **2021-01-12** @mhdawson: @omicronenergy this is a very well written and comprehensive report. We don't yet have a volunteer to help investigate/get changes landed yet so there are no plans/timing that we can report yet.
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
