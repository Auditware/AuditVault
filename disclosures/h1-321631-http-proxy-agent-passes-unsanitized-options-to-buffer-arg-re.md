---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2018-04-05
submitted: 2018-03-03T19:07:43.490Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/321631"
title: "`http-proxy-agent` passes unsanitized options to Buffer(arg), resulting in DoS and uninitialized memory leak"
---
# `http-proxy-agent` passes unsanitized options to Buffer(arg), resulting in DoS and uninitialized memory leak

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-05

- Report: [https://hackerone.com/reports/321631](https://hackerone.com/reports/321631)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-03-03T19:07:43.490Z

## Report summary

Unguarded `Buffer(arg)` in `auth` option, which can leak data or cause DoS if typed user input (e.g. from JSON) ends up there.
Resolved in `http-proxy-agent@2.1.0` by switching to `Buffer.from(arg)` (new Buffer API).

## Timeline

- **Report Filed**
- **2018-03-03** @chalker: @lirantal the author is the same as in `https-proxy-agent`.
- **2018-03-03** @lirantal: Thanks. Inviting Nathan to this report too.
- **2018-03-03** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
- **Report Triaged**
- **2018-03-03** @lirantal: I requested a CVE to be assigned for this report.
- **External User Joined**
- **2018-03-03** @nrajlich: I had a feeling it would be the same case for more of these modules. Thanks for looking into it.
- **2018-03-03** @nrajlich: LGTY?

```diff
diff --git a/index.js b/index.js
index 4bc9704..f90a529 100644
--- a/index.js
+++ b/index.js
@@ -75,9 +75,11 @@ HttpProxyAgent.prototype.callback = function connect (req, opts, fn) {
   req.path = absolute;

   // inject the `Proxy-Authorization` header if necessary
-  var auth = proxy.auth;
-  if (auth) {
-    req.setHeader('Proxy-Authorization', 'Basic ' + new Buffer(auth).toString('base64'));
+  if (proxy.auth) {
+    req.setHeader(
+      'Proxy-Authorization',
+      'Basic ' + Buffer.from(proxy.auth).toString('base64')
+    );
   }

   // create a socket connection to the proxy server
```
- **2018-03-03** @chalker: Yes, LGTM. Style changes are unrelated, but the actual switch from `new Buffer` to `Buffer.from` fixes the issue here.

Works on Node.js versions newer or equal to 4.5.0 without a polyfill. If you (for some reason) need support for older versions — install a polyfill or let me know, I will provide a feature-detection patch with type guards. I recommend to just use `Buffer.from` as in the patch above, though, given that 4.x will be out of support in about two months, download numbers for 4.x and the fact that probably only a small part of those downloads is for versions below 4.5.
- **2018-03-03** @chalker: Thanks for confirming the patch!
- **2018-03-03** @nrajlich: Indeed, let's not worry about backwards compatability in this case (same as `https-proxy-agent`).
- **2018-03-03** @nrajlich: `http-proxy-agent@2.1.0` published.
- **2018-03-05** @chalker: @lirantal seems resolved to me. Disclosure — similar as with #319532.
- **2018-03-05** @chalker: @nrajlich Updating `proxy-agent` deps would be also useful, btw, atm that modules requires old versions of `http-proxy-agent@^1.0.0` and `https-proxy-agent@^1.0.0`. See https://github.com/TooTallNate/node-proxy-agent/issues/17
- **2018-03-05** @lirantal: I'm waiting for a CVE to be assigned.

@nrajlich I will release a full public disclosure within 2 weeks time as we did with the other report unless you tell me differently.
- **Report Resolved**
- **Report Severity Updated**
- **Report Severity Updated**
- **2018-03-05** @chalker: @lirantal Severity of #321631 and #319532 should be equal, I guess. Not sure equal to *what*, but equal =).

I don't see the current CVSS vector, could you share it?
- **2018-03-05** @lirantal: Yep.

No easy way to get it from the system but it's scored at 8.2 with NKNNULNH
- **Changed Scope**
- **Agreed On Going Public**
- **Report Became Public**
