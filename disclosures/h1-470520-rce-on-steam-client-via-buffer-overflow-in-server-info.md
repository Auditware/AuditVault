---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2019-03-15
submitted: 2018-12-21T08:51:43.941Z
bounty_usd: null
votes: 1289
cve: []
program: "[[programs/valve|Valve]]"
reporter: "vinnievan"
source: "https://hackerone.com/reports/470520"
title: "RCE on Steam Client via buffer overflow in Server Info"
---
# RCE on Steam Client via buffer overflow in Server Info

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1289 | **Program:** Valve | **Disclosed:** 2019-03-15

- Report: [https://hackerone.com/reports/470520](https://hackerone.com/reports/470520)
- CWE: Classic Buffer Overflow
- Submitted: 2018-12-21T08:51:43.941Z

## Timeline

- **Report Filed**
- **2018-12-21** @vinnievan: This bug was found by me and André Baptista (0xacb). Please share bounty 50/50 between us, because I can not add any collaborator. 

Thank you!
- **2018-12-21** @h1_analyst_leon: Hey @vinnievan - Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.
- **Report Severity Updated**
- **Report Triaged**
- **2018-12-21** @vinnievan: Ok great!
- **External User Joined**
- **2019-01-07** @vinnievan: Any updates yet?
- **2019-01-22** @vinnievan: @tuxedo Is there something wrong with the forward to Steam? Because it is a bit strange to have no response for a month now.
- **2019-01-22** @h1_analyst_leon: Hi @vinnievan - This report is still being looked at. You will be updated when there is additional information to share. Thanks for your patience!
- **2019-02-09** @jonp: Hi guys,

First - sorry for the delay in getting to this on our side. It was a process failure that we are working to remediate going forward.

Secondly, thank you for the excellent reproduction and clear statement of the vulnerability. We have a fix prepared for testing, and will be shipping it to our beta channel soon. At that time I'll be updating this bug with the bounty and resolution.

Again - thanks for the thoughtful analysis and sample exploit server. It is appreciated.
- **2019-02-09** @0xacb: Hey @jonp! Thanks for the update
- **Bounty Awarded**
- **2019-02-18** @0xacb: Thank you so much for the bounty!!

We just tested the Steam Beta channel with the new `serverbrowser` library and we confirm the fix:
**Windows:** fixed
**OSX:** fixed
**Linux:** fixed
- **2019-02-19** @vinnievan: Thanks for the bounty!
This really encourage us to search for other vulnerabilities. 

I was wondering how long the bug was present in the source code.
Are you willing to provide this information? (if you have this info)
- **2019-02-25** @0xacb: Hey @jonp,

We confirm that this vulnerability is now patched in the normal channel (latest update Feb 19)
We would like request public disclosure after you mark it as resolved.

Best regards,
André
- **Report Resolved**
- **Agreed On Going Public**
- **2019-03-15** @jonp: @vinnievan - that's an interesting question! One component of this bug is a flaw in a UI element that dates back more than six years - but was not vulnerable because all the call paths were safe. The fix was applied across all these layers, and it's worth pointing out we ran a scan for similar dangerous patterns - and didn't find any.
- **Agreed On Going Public**
- **Report Became Public**
