---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-05-11
submitted: 2018-02-25T05:29:40.739Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319467"
title: "`macaddress` concatenates unsanitized input into exec() command"
---
# `macaddress` concatenates unsanitized input into exec() command

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/319467](https://hackerone.com/reports/319467)
- CWE: Command Injection - Generic
- Submitted: 2018-02-25T05:29:40.739Z

## Timeline

- **Report Filed**
- **2018-02-25** @chalker: This should have been classified as `command injection`, of course. Clicked on the wrong one :-/.
- **Report Vulnerability Types Updated**
- **2018-03-03** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-04-24** @lirantal: @chalker due to no activity from the maintainer, how do you feel about disclosing this report?
- **2018-05-11** @lirantal: @chalker ping
- **2018-05-11** @chalker: @lirantal Yes, I think we should disclose if you were unable to contact the maintainer.
Doesn't look epic to me, also last publish was 3 years ago.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
- **Changed Scope**
