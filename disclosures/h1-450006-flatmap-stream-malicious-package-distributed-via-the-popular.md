---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/embedded-malicious-code
  - env/appliance
  - stack/node
  - impact/rce
substate: "resolved"
weakness: "Embedded Malicious Code"
enriched: true
body: true
date: 2018-11-26
submitted: 2018-11-26T18:28:49.050Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "danny_grander"
source: "https://hackerone.com/reports/450006"
title: "flatmap-stream malicious package (distributed via the popular events-stream)"
---
# flatmap-stream malicious package (distributed via the popular events-stream)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Node.js third-party modules | **Disclosed:** 2018-11-26

- Report: [https://hackerone.com/reports/450006](https://hackerone.com/reports/450006)
- CWE: Embedded Malicious Code
- Submitted: 2018-11-26T18:28:49.050Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a case of malicious package (flat-stream) that made it's way into many other npm packages. One such popular package is `event-stream` (user dominictarr transferred the ownership of an npm module to another user because he wasn't actively maintaining it. That user then added malicious dependency to the package)

See discussion here: 
https://github.com/dominictarr/event-stream/issues/116

# Module

**module name:**  flatmap-stream
**version:** [MODULE VERSION]
**npm page:** `https://www.npmjs.com/package/flatmap-stream` (removed from npm by now)

## Module Description

It is not yet clear what the malicious code was doing. 
See discussion here: https://github.com/dominictarr/event-stream/issues/116#issuecomment-441737695

## Module Stats

> Replace stats below with numbers from npm’s module page:

flatmap-stream is not popular, but event-stream is very popular (1,996,440 downloads per week)

## Impact

RCE

## Timeline

- **Report Filed**
- **2018-11-26** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Vulnerability Types Updated**
- **Report Vulnerability Types Updated**
- **Report Title Updated**
- **2018-11-26** @danny_grander: malicious code functionality: https://github.com/dominictarr/event-stream/issues/116#issuecomment-441759047
- **2018-11-26** @dagonza: Thanks for the report. I will take care of this.
- **Report Triaged**
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Changed Scope**
- **Manually Disclosed**
