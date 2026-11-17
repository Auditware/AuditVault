---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2019-12-13
submitted: 2018-02-25T06:14:22.741Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319473"
title: "[open] concatenation of unsanitized input into exec() command"
---
# [open] concatenation of unsanitized input into exec() command

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-13

- Report: [https://hackerone.com/reports/319473](https://hackerone.com/reports/319473)
- CWE: Command Injection - Generic
- Submitted: 2018-02-25T06:14:22.741Z

## Timeline

- **Report Filed**
- **2018-03-03** @chalker: This one is pretty bad imo.
- **2018-03-03** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-04-24** @lirantal: @chalker no response from the author.
how do we feel about disclosing the vulnerability? I also see that the "homepage" for the npm package leads to a github repo with a deprecation notice.
- **2018-04-29** @chalker: Last commit in 2014. If attempts to contact the authors failed, I suppose disclosure is justified.
- **2018-04-29** @chalker: Give me a few days to take a look at packages depending on it, though.
- **2018-05-12** @chalker: @lirantal I suppose this can be disclosed.
- **Report Severity Updated**
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **Report Title Updated**
