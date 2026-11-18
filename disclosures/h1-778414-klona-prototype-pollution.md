---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - stack/node
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-01-23
submitted: 2020-01-20T17:03:43.298Z
bounty_usd: null
votes: 7
cve: "CVE-2020-8125"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/778414"
title: "[klona] Prototype pollution"
---
# [klona] Prototype pollution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-23

- Report: [https://hackerone.com/reports/778414](https://hackerone.com/reports/778414)
- CWE: N/A | CVE: CVE-2020-8125
- Submitted: 2020-01-20T17:03:43.298Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Prototype pollution in klona
It allows adding arbitrary property to Prototype while deep cloning an object

# Module

**module name:** klona
**version:** <1.1.1
**npm page:** `https://www.npmjs.com/package/klona`

## Module Description

A tiny (366B) and fast utility to "deep clone" Objects, Arrays, Dates, RegExps, and more!

## Module Stats

356 weekly downloads

# Vulnerability

## Vulnerability Description

See: https://snyk.io/vuln/SNYK-JS-LODASH-450202

## Steps To Reproduce:

Described here: https://github.com/lukeed/klona/pull/11/files

Note:
This vulnerability was reported directly to owner here https://github.com/lukeed/klona/pull/11 on 10/01/2020.
Fix published in v1.1.1 on 15/01/2020

# Wrap up

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository: Y

> Hunter's comments and funny memes goes here

{F690469}

## Impact

Denial of Service and possible Remote code execution by overriding object's property methods like `toString`

## Timeline

- **Report Filed**
- **2020-01-21** @nochnoidozor: Hi @skyn3t,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Needs More Info**
- **Report New**
- **2020-01-23** @marcinhoppe: @skyn3t given that the vulnerability has been already fixed and released, is it OK with you to disclose it right away?
- **2020-01-23** @skyn3t: Sure, sounds good to me
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
