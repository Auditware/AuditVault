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
