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
date: 2018-04-19
submitted: 2018-03-29T01:18:13.084Z
bounty_usd: null
votes: 15
cve: "CVE-2018-3746"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/330957"
title: "[pdfinfojs] Command Injection on filename parameter"
---
# [pdfinfojs] Command Injection on filename parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-19

- Report: [https://hackerone.com/reports/330957](https://hackerone.com/reports/330957)
- CWE: Command Injection - Generic | CVE: CVE-2018-3746
- Submitted: 2018-03-29T01:18:13.084Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Changed Scope**
- **External User Joined**
- **2018-04-13** @iapain: @marcinhoppe @caioluders Thanks for reporting this issue. Now this lib is no longer dependent on shelljs, it uses built-in `child_process` module, whic
- **2018-04-13** @iapain: Fixed in v0.4.1
- **2018-04-13** @caioluders: I confirm that the vulnerability is fixed.
- **2018-04-17** @marcinhoppe: I requested a CVE number for this vulnerability from HackerOne.
- **2018-04-18** @marcinhoppe: @caioluders @iapain As we now have the fix available, I am going to make a public disclosure of the issue by the end of the week. If you have any objections, just let me know.
- **2018-04-18** @caioluders: @marcinhoppe All good for me.
- **2018-04-18** @iapain: @marcinhoppe Same here! Please go ahead. Kudos to @caioluders for discovering it.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Manually Disclosed**
- **Cve Id Added**
