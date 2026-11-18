---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2018-05-11
submitted: 2018-03-03T23:35:58.959Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/321687"
title: "`base64url` allocates uninitialized Buffers when number is passed in input on Node.js 4.x and below"
---
# `base64url` allocates uninitialized Buffers when number is passed in input on Node.js 4.x and below

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/321687](https://hackerone.com/reports/321687)
- CWE: Out-of-bounds Read
- Submitted: 2018-03-03T23:35:58.959Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report an uninitialized Buffer allocation issue in `base64url`.
It allows to extract sensitive data from uninitialized memory or to cause a DoS by passing in a large number, in setups where typed user input can be passed (e.g. from JSON), on Node.js 4.x and lower.

# Module

**module name:** `base64url`
**version:** 2.0.0
**npm page:** `https://www.npmjs.com/package/base64url`

## Module Description

> Converting to, and from, base64url

## Module Stats

182 924 downloads in the last day
1 097 142 downloads in the last week
4 601 176 downloads in the last month

# Vulnerability

## Vulnerability Description

The problem arises when a number is passed in, e.g. from user-submitted JSON-encoded data.
The API should not propagate the already-bad Buffer issue further.

On Node.js 4.x and below (4.x is still supported), this exposes uninitialized memory, which could contain sensitive data. This can be also used to cause a DoS by consuming the memory when large numbers are passed on input.

## Steps To Reproduce:

`console.log(require('base64url').encode(1000))`  (note uninitialized memory in output)
`require('base64url').encode(1e8)` (note memory usage and time)

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- Arch Linux Current
- Node.js 4.8.7

# Wrap up

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository:  N

I tried to contact the maintainer over email, first time on 2017-03-02, last time on 2018-02-18, but did not receive a reply.

## Impact

Sensitive uninitialized memory exposure
Denail of Service
This issue affects only setups using Node.js 4.x (still supported) or lower.

## Timeline

- **Report Filed**
- **2018-04-08** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-24** @lirantal: Tried to ping author on twitter
- **2018-05-11** @lirantal: @chalker no reply from author.
shall we continue with disclosing?
- **2018-05-11** @chalker: Yes, please. I too failed to contact the maintainer previously.

There is a drop-in replacement afaik, so the fix should be trivial for users.

I think that ~simultaneous disclosure on h1, nswg db and the GitHub repo issue/pr would be ideal here.
Perhaps I will prepare a PR to the authors repo after a PR to nswg db is opened.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
