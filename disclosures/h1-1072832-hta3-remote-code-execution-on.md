---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2023-05-15
submitted: 2021-01-06T16:22:19.668Z
bounty_usd: null
votes: 104
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cdl"
source: "https://hackerone.com/reports/1072832"
title: "[hta3] Remote Code Execution on ████"
---
# [hta3] Remote Code Execution on ████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 104 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-05-15

- Report: [https://hackerone.com/reports/1072832](https://hackerone.com/reports/1072832)
- CWE: Code Injection
- Submitted: 2021-01-06T16:22:19.668Z

## Timeline

- **Report Filed**
- **2021-01-07** @bluetooth_headset: Hi @cdl,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@bluetooth_headset
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2021-01-21** @shu0n: Hey @cdl,

We believe we've fixed the issue. Would you be willing to give this site another poke based on this report to see what you see? I'm most interested in the RCE. 

Let me know, thanks.
@shu0n
- **2021-01-21** @cdl: Hey @shu0n, sure I can. I've got some homework at the moment, but I'll take a look in a bit, thanks!
- **2021-01-21** @shu0n: Hey @cdl. Much obliged!
- **2021-01-21** @cdl: Hi @shu0n, 

I haven't been able to bypass the validation of the`rdReportName` parameter yet so this looks better, however, I recommend also adding validation to the `rdExportFilename` parameter so people can't write to aspx, asp, etc. files.

Furthermore, an attacker can use `../` in this parameter to write files outside of the folder it was intended to be written to, ex: `rdExportFilename=../../test.aspx` => `██████████/RServer/test.aspx`. This allows an attacker to overwrite other aspx files which could cause a DoS
- **2021-01-21** @cdl: @shu0n, if I stumble across other issues on this host, am I allowed to report them to this program?
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
