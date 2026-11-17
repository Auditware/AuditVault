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
date: 2018-04-26
submitted: 2018-03-27T13:21:46.953Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330349"
title: "[angular-http-server] Server Directory Traversal"
---
# [angular-http-server] Server Directory Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-26

- Report: [https://hackerone.com/reports/330349](https://hackerone.com/reports/330349)
- CWE: Path Traversal
- Submitted: 2018-03-27T13:21:46.953Z

## Timeline

- **Report Filed**
- **2018-04-03** @tungpun: As a week passes, may I kindly know any update?
- **Report Triaged**
- **2018-04-05** @lirantal: Sorry for the delay @tungpun, I'm going to take a look at this shortly
- **2018-04-05** @lirantal: I confirm the issue is indeed present and tried to contact the author, let's wait a little while to see if there's a response.
- **2018-04-24** @lirantal: @tungpun I contacted the author again over GitHub, hope he will be able to join us.
- **External User Joined**
- **2018-04-25** @hotbelgo: Just received the invite, and fixed it 5 minutes afterwards. Thanks so much for the report
- **2018-04-25** @lirantal: thanks @hotbelgo 
@tungpun can you please review and confirm the fix at https://github.com/simonh1000/angular-http-server/issues/14#issuecomment-384396330 ?
- **2018-04-26** @tungpun: Reviewed and confirmed! The issue has been fixed!
- **Report Severity Updated**
- **2018-04-26** @lirantal: Thank you both.
I'll proceed with a full public disclosure of the report.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-05-29** @tungpun: Hi @lirantal, thanks for your help so far. Btw, could you kindly change my name in the line `Reported by: Tung Pun` (at https://nodesecurity.io/advisories/656) to `Reported by: tungpun`?
- **2018-05-29** @lirantal: I can change the source which we have access to at the Security WG for Node.js here: https://github.com/nodejs/security-wg/blob/a57a3b5be6ce54826e2fce6c993f599275793813/vuln/npm/421.json

Hopefully the advisory will be updated with the changes.

FYI we're taking the name defined in your HackerOne profile so maybe you want to change it for the future.
- **2018-05-29** @tungpun: @lirantal Thanks. I updated my HackerOne profile already.
