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
date: 2018-09-02
submitted: 2018-08-13T17:51:39.108Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "pontus_johnson"
source: "https://hackerone.com/reports/394294"
title: "[samsung-remote] Command injection"
---
# [samsung-remote] Command injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-02

- Report: [https://hackerone.com/reports/394294](https://hackerone.com/reports/394294)
- CWE: Command Injection - Generic
- Submitted: 2018-08-13T17:51:39.108Z

## Report summary

vulnerable_version: <1.3.5
patched_version: >=1.3.5

## Timeline

- **Report Filed**
- **2018-08-13** @dukefleed: Hello @douglas_hall ,

Thank you for the report. We are currently reviewing this and will get in touch with you once our review is complete.

Kind regards,
@dukefleed
- **Report Triaged**
- **Changed Scope**
- **Report Severity Updated**
- **2018-09-01** @lirantal: Hi @douglas_hall,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **External User Joined**
- **2018-09-02** @natalan: Thanks for reporting. This issue is fixed in samsung-remote@1.3.5
- **2018-09-02** @lirantal: Thanks @natalan 
@douglas_hall can you please confirm?
- **2018-09-02** @pontus_johnson: Hi @lirantal, @natalan,

I think the fix looks good. The IP address argument is now sanitized using the module `is-ip`.
- **2018-09-02** @lirantal: Great.
Thank you both for the quick turnaround here!

I'll go ahead with a full public disclosure and request a CVE.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
