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
date: 2020-11-29
submitted: 2020-05-24T11:57:12.726Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bilk0h"
source: "https://hackerone.com/reports/881713"
title: "[last-commit-log] Command Injection"
---
# [last-commit-log] Command Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-11-29

- Report: [https://hackerone.com/reports/881713](https://hackerone.com/reports/881713)
- CWE: Command Injection - Generic
- Submitted: 2020-05-24T11:57:12.726Z

## Timeline

- **Report Filed**
- **2020-05-24** @nochnoidozor: Hi @bilk0h,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **Report Severity Updated**
- **2020-05-28** @bilk0h: Thank you. I just would like to add that the patch I suggested in the write up is not adequate. It can be easily circumvented by escaping adding escaped double quotes a la: 
`export GIT_DIR=".\" ;touch xxx;\""`
- **2020-05-31** @nochnoidozor: HI @bilk0h - Thanks for the additional information.

Best,
@nochnoidozor
- **2020-08-09** @bbe8482aecd24374d13c5de15a0a6: I think `child_process.execFile`makes more sense here.
- **2020-08-31** @bilk0h: Hey. Would like to know where we are on the timeline. One hundred and eighty days need to elapse before I can disclose, correct?
- **2020-09-06** @bbe8482aecd24374d13c5de15a0a6: @bilk0h I'm not sure where the 180 days are mentioned but I see only 45 days mentioned at https://hackerone.com/nodejs-ecosystem?type=team

Afaik so far we did not pick up this report. I have sent an email to the maintainer regarding the findings.
- **2020-10-29** @bilk0h: Any response from maintainer?

@danielruf By not picked up, do you mean this will not be disclosed on hackerone?
- **2020-10-30** @bbe8482aecd24374d13c5de15a0a6: So far no response from the maintainer so we will continue with the disclosure process.
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
