---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
  - stack/node
  - vuln/csrf
  - vuln/dos
  - fix/patch-upstream
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2018-05-12
submitted: 2018-03-03T23:51:59.031Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/321692"
title: "`base64-url` below 2.0 allocates uninitialized Buffers when number is passed in input"
---
# `base64-url` below 2.0 allocates uninitialized Buffers when number is passed in input

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-12

- Report: [https://hackerone.com/reports/321692](https://hackerone.com/reports/321692)
- CWE: Out-of-bounds Read
- Submitted: 2018-03-03T23:51:59.031Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report an uninitialized Buffer allocation issue in `base64-url`.
It allows to extract sensitive data from uninitialized memory or to cause a DoS by passing in a large number, in setups where typed user input can be passed (e.g. from JSON).

# Module

**module name:** `base64-url`
**version:** 1.3.3
**npm page:** `https://www.npmjs.com/package/base64-url`

## Module Description

> Base64 encode, decode, escape and unescape for URL applications.

## Module Stats

48 047 downloads in the last day
311 047 downloads in the last week
1 374 420 downloads in the last month

# Vulnerability

## Vulnerability Description

The problem arises when a number is passed in, e.g. from user-submitted JSON-encoded data.
The API should not propagate the already-bad Buffer issue further.

On Node.js 6.x and below, this exposes uninitialized memory, which could contain sensitive data.

This can be also used to cause a DoS on any Node.js version by consuming the memory when large numbers are passed on input.

## Steps To Reproduce:

`console.log(require('base64-url').encode(1000))` (Node.js 6.x and lower — note uninitialized memory in output)

`require('base64-url').encode(1e8)` (any Node.js verision — note memory usage and time)

## Supporting Material/References:

- OS: Arch Linux current
- Node.js 6.13.0
- Node.js 9.5.0

# Wrap up

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository: N

I contacted the author on 2017-03-02.
I did not receive a reply, but on 2017-08-17 a semver-major version 2.0.0 was released with a fix.

I want a CVE assigned to this issue, also I would prefer the fix to be backported to 1.x branch — a lot of modules still depend 1.x as of 2018-02-26.

Top-10 apps `@latest` versions of which install affected `base64-url@1` through their deps chains:
```
664945  react-native
346288  metro-bundler
83764   hubot
81089   sails
51724   phonegap
45522   csrf-tokens
28326   hubot-mock-adapter
25778   mock-hubot
23712   connect-phonegap
18808   nodedata
```

In total, there are about 2460 such apps in the npm registry, to my knowledge.

## Impact

Sensitive uninitialized memory exposure on Node.js 6.x or lower
Denail of Service on any Node.js version

## Timeline

- **Report Filed**
- **2018-03-12** @vdeturckheim: @chalker do you want me to contact the maintainer here?
- **Report Triaged**
- **2018-03-12** @chalker: @vdeturckheim Yes, I would like to delegate it. I already tried contacting the maintainer earlier (and I wasn't the only one) and received no reply.
- **2018-04-08** @vdeturckheim: I tried to contact him with a last resort method (through a tweet)
- **2018-05-11** @chalker: Perhaps we should just dislose this now?
- **2018-05-11** @chalker: Ah, a remainder that this was silently fixed in 2.0 without a reply or a changelog entry, so the disclosure should be non-harmful.
- **2018-05-12** @chalker: /cc @lirantal, perhaps?
- **Report Severity Updated**
- **2018-05-12** @lirantal: Sure np
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
