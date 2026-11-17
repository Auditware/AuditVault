---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/weak-password-recovery-mechanism-for-forgotten-password
  - env/web
substate: "resolved"
weakness: "Weak Password Recovery Mechanism for Forgotten Password"
enriched: true
date: 2018-09-19
submitted: 2018-04-03T15:53:55.674Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/bohemia|BOHEMIA INTERACTIVE a.s.]]"
reporter: "europa"
source: "https://hackerone.com/reports/332632"
title: "(Possible) staff account takeover via reset token bruteforce at helpdesk.bistudio.com"
---
# (Possible) staff account takeover via reset token bruteforce at helpdesk.bistudio.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** BOHEMIA INTERACTIVE a.s. | **Disclosed:** 2018-09-19

- Report: [https://hackerone.com/reports/332632](https://hackerone.com/reports/332632)
- CWE: Weak Password Recovery Mechanism for Forgotten Password
- Submitted: 2018-04-03T15:53:55.674Z

## Timeline

- **Report Filed**
- **2018-04-04** @rvn: Thanks for the report, we will check it out.
- **Report Triaged**
- **Bounty Awarded**
- **2018-04-04** @europa: Glad I was able to blindly help!
Thanks for the reward, I remain available for further testing
Cheers!
- **Report Resolved**
- **2018-04-05** @europa: First of all, thank you again for the highest reward!

I just tested and it's still "working":
* the ReCAPTCHA value isn't  checked in the flow, the X-XSRF-TOKEN header can be omitted and the flow will still go through
* the `/api/system/email-account/password` API endpoint isn't rate-limited, allowing me to send as many requests as I want (I tried with 1,000)
Has the fix been deployed in production already?
- **2018-04-05** @rvn: Captcha isn't that necessary anymore as now you have a fix amount of tries before the account gets locked. Sending further requests is possible but will not have any effect. There is a side issue related to this that is being fixed right now but overall it should be resolved
- **2018-04-05** @europa: Alrighty, should be good as long as it's not used to purposely lock staff accounts. Cheers!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
