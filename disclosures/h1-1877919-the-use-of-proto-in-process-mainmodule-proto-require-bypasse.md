---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
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
