---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-inherently-dangerous-function
  - env/web
substate: "resolved"
weakness: "Use of Inherently Dangerous Function"
enriched: true
date: 2017-08-31
submitted: 2017-08-03T03:33:55.679Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/255991"
title: "URL Spoof / Brave Shield Bypass"
---
# URL Spoof / Brave Shield Bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Brave Software | **Disclosed:** 2017-08-31

- Report: [https://hackerone.com/reports/255991](https://hackerone.com/reports/255991)
- CWE: Use of Inherently Dangerous Function
- Submitted: 2017-08-03T03:33:55.679Z

## Timeline

- **Report Filed**
- **2017-08-03** @asuka: Thanks for reporting! We're looking into this and will get back to you shortly.
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2017-08-09** @mattaustin: This could effectively bypasses all advertised security features the "shield" provides

This includes: 
*   HTTPS Everywhere
*   Block Phishing / Malware
*   Block Scripts (will break many sites)
*   Fingerprinting Protection (may break some sites)

and can bypass Flash Player exceptions if enabled..

It looks like it could also be used to confuse "brave payments". 

Could you provide a bit more detail as to why this was lowered to a medium?
- **2017-08-09** @diracdeltas: I lowered it because we were already aware that the discrepancy between Node and Chromium's URL parsers was a security risk and had an open issue for it (https://github.com/brave/browser-laptop/issues/6098). However, you're right that this doesn't really impact the severity of the issue, so I will change it back to 'high'. I can't change the reward though, sorry about that.
- **Report Severity Updated**
- **2017-08-09** @mattaustin: Thats a little disappointing, however if guys are considering this a "duplicate" thats fine. 

As a 8 month old issue (that some how suddenly became a priority) and on a public bug tracker I assume there are no issues with disclosure?
- **2017-08-10** @diracdeltas: @mattaustin No issues with disclosure, though we would prefer to wait 2 weeks until most people have upgraded.
- **Report Resolved**
- **2017-08-10** @mattaustin: According to the "dupe" the issue has been known for 8 month. That seems more than a reasonable amount of time for a fix and update.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
