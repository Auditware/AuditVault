---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
  - stack/node
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
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
