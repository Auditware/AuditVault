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
date: 2018-04-02
submitted: 2018-02-25T12:56:44.574Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319532"
title: "`https-proxy-agent` passes unsanitized options to Buffer(arg), resulting in DoS and uninitialized memory leak"
---
# `https-proxy-agent` passes unsanitized options to Buffer(arg), resulting in DoS and uninitialized memory leak

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-02

- Report: [https://hackerone.com/reports/319532](https://hackerone.com/reports/319532)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-02-25T12:56:44.574Z

## Report summary

Unguarded `Buffer(arg)` in `auth` option, which can leak data or cause DoS if typed user input (e.g. from JSON) ends up there.
Resolved in `https-proxy-agent@2.2.0` by switching to `Buffer.from(arg)` (new Buffer API).

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **2018-03-03** @lirantal: @chalker since it's been a few days with no response from the maintainers I want to reach out through a generic security issue on the report and ask them to join the conversation.
- **2018-03-03** @chalker: @lirantal by my experience, pinging people over twitter often helps.
- **External User Joined**
- **2018-03-03** @lirantal: It's really hard locating people's contact details, whether that's an e-mail or twitter user.
I sent an invite to another e-mail address associated with Nathan's account, let's see if it works otherwise I'll open an issue.
- **2018-03-03** @chalker: nathan@tootallnate.net n@n8.io https://twitter.com/TooTallNate — those are high-confidence, so should be safe.

*nathan@tootallnate.net is listed in that specific package, n@n8.io — on github, tootallnate.net redirects to n8.io, github links to n8.io, n8.io links to https://twitter.com/TooTallNate*

I tried to DM him over Twitter.
- **2018-03-03** @nrajlich: Hey there, thanks for the report.

```diff
diff --git a/index.js b/index.js
index 6998578..4e00712 100644
--- a/index.js
+++ b/index.js
@@ -204,7 +204,7 @@ HttpsProxyAgent.prototype.callback = function connect(req, opts, fn) {
   var headers = Object.assign({}, proxy.headers);
   if (proxy.auth) {
     headers['Proxy-Authorization'] =
-      'Basic ' + new Buffer(proxy.auth).toString('base64');
+      'Basic ' + Buffer.from(proxy.auth).toString('base64');
   }

   // the Host header should only include the port
```

How does this look to you guys?
- **2018-03-03** @lirantal: Hey Nathan, thanks for jumping in.
- **2018-03-03** @chalker: @nrajlich That should fix the issue.
Note that without polyfills, it will change the supported Node.js version range — `Buffer.from` is present in Node.js `>=4.5.0 <5.0.0 | >=5.10.0`.

I wouldn't care about it, though — 5.x. is long dead, 4.5.0 is also quite old, and the whole 4.x branch will be out of support in about two months. So yes, the change looks good to me.
- **2018-03-03** @nrajlich: Ok `https-proxy-agent@2.2.0` has been published with the above patch applied. Let me know if you guys need anything else.
- **2018-03-03** @chalker: @nrajlich Also see the other report, similar to this one ;-)
- **2018-03-03** @chalker: @nrajlich Btw — thanks for confiming the patch here before doing the release!
- **2018-03-03** @lirantal: @chalker @nrajlich let's wait a week or two for the new version to be consumed by clients before we release the report. makes sense?
and are you both ok with a full public disclosure?
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-03** @chalker: @lirantal I'm ok with public disclosure of this report. And any other (after the fix is released) unless stated otherwise). A week (or two) looks fine to me.
- **Report Severity Updated**
- **Report Became Public**
