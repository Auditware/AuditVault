---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-06-27
submitted: 2020-06-19T10:29:37.243Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ahihi"
source: "https://hackerone.com/reports/902739"
title: "bunyan - RCE via insecure command formatting"
---
# bunyan - RCE via insecure command formatting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Node.js third-party modules | **Disclosed:** 2020-06-27

- Report: [https://hackerone.com/reports/902739](https://hackerone.com/reports/902739)
- CWE: Code Injection
- Submitted: 2020-06-19T10:29:37.243Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report RCE in bunyan
It allows arbitrary commands remotely inside the victim's PC

# Module

**module name:** bunyan
**version:** 1.8.12
**npm page:** `https://www.npmjs.com/package/bunyan`

## Module Description

> Bunyan is a simple and fast JSON logging library for node.js services:

## Module Stats

[920,196] weekly downloads

# Vulnerability

## Vulnerability Description

> The issue occurs because a user input is formatted inside a command that will be executed without any check. https://github.com/trentm/node-bunyan/blob/master/bin/bunyan#L1224

## Steps To Reproduce:

> Run the following command
npm install bunyan
./node_modules/bunyan/bin/bunyan -p "S'11;touch hacked ;'"
> Recheck the files: now hacked has been created
## Patch

> Check input before command

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- [OPERATING SYSTEM VERSION]: Ubuntu 18.04
- [NODEJS VERSION]: v8.10.0
- [NPM VERSION]: 3.5.2

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y/N] N 
- I opened an issue in the related repository: [Y/N] N

## Impact

RCE on bunyan.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-06-20** @mcollina: Thanks for reporting this. From looking at the intended usage of that functionality it seems that it is supposed to be used only by powerusers and admins, and it should not support unsanitized/unprotected input. I concur that adding a small security notice about its usage would be useful.

I have contacted the maintainer to confirm.
- **2020-06-22** @mcollina: I've invited Trent, the maintainer of Bunyan.
- **External User Joined**
- **2020-06-23** @trentm: Here is a proposed change to fix that:

```
diff --git a/bin/bunyan b/bin/bunyan
index 178f493..c1a8f61 100755
--- a/bin/bunyan
+++ b/bin/bunyan
@@ -1221,7 +1221,12 @@ function processPids(opts, stylize, callback) {
                 // own search.
                 regex = '[' + regex[0] + ']' + regex.slice(1);
             }
-            exec(format('ps -A -o pid,command | grep \'%s\'', regex),
+            var cmd = format('ps -A -o pid,command | grep \'%s\'',
+                regex.replace(/\\/g, '\\\\')
+                    // JSSTYLED
+                    .replace(/'/g, "'\\''"));
+            _selfTrace('exec cmd: %j', cmd);
+            exec(cmd,
                 function (pidsErr, stdout, stderr) {
                     if (pidsErr) {
                         warn('bunyan: error getting PIDs for "%s": %s\n%s\n%s',
```

Some minor testing:

```
% bunyan -p "S'11;touch hacked ;'"
bunyan: error: no matching PIDs found for "S'11;touch hacked ;'"

% BUNYAN_SELF_TRACE=1 bunyan -p "S'11;touch hacked ;'"
[bunyan self-trace] exec cmd: "ps -A -o pid,command | grep '[S]'\\''11;touch hacked ;'\\'''"
bunyan: error: no matching PIDs found for "S'11;touch hacked ;'"
[bunyan self-trace] cleanupAndExit(2, undefined)
[bunyan self-trace] process.exit(2)

% BUNYAN_SELF_TRACE=1 bunyan -p "S'11;touch hacked ;'\\"
[bunyan self-trace] exec cmd: "ps -A -o pid,command | grep '[S]'\\''11;touch hacked ;'\\''\\\\'"
bunyan: error: no matching PIDs found for "S'11;touch hacked ;'\"
[bunyan self-trace] cleanupAndExit(2, undefined)
[bunyan self-trace] process.exit(2)
```

Does that look reasonable to you @ahihi?  Thanks for the report.
- **2020-06-23** @trentm: I would also add some comments to that before committing, to explain what it is doing.
- **2020-06-23** @ahihi: LGTM, thanks for fast response.
- **2020-06-24** @trentm: bunyan@1.8.3 (https://github.com/trentm/node-bunyan/blob/1.x/CHANGES.md#1813) and bunyan@2.0.3 (https://github.com/trentm/node-bunyan/blob/master/CHANGES.md#203-beta) have been published with a fix. Thanks for the report.

@mcollina Thanks very much for inviting me to this. Are you able to close this now (if that is the next stage)?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
