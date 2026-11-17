---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2023-02-15
submitted: 2022-02-20T06:51:49.026Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "emperor"
source: "https://hackerone.com/reports/1486310"
title: "admin.8x8.vc: Member users with no permission can integrate email to connect calendar via GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?.."
---
# admin.8x8.vc: Member users with no permission can integrate email to connect calendar via GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?..

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** 8x8 | **Disclosed:** 2023-02-15

- Report: [https://hackerone.com/reports/1486310](https://hackerone.com/reports/1486310)
- CWE: Improper Access Control - Generic
- Submitted: 2022-02-20T06:51:49.026Z

## Timeline

- **Report Filed**
- **2022-02-20** @42x42: Hey @emperor,
Thanks for your submission. Your report is currently being reviewed and the triage team will get back to you once there is additional information to share.

I'm gonna have a look at all the reports combined on Monday. Thank you for your understanding.
- **2022-02-20** @emperor: @42x42 No worries at all. Thanks for the update!!

Best,
Emperor
- **2022-02-21** @42x42: Pretty neat finding!
- **Report Triaged**
- **2022-02-21** @emperor: @42x42 Thank you so much!!

Best,
- **Bounty Awarded**
- **2022-02-25** @emperor: Thank you very much for the reward! <3

Cheers,
Emperor
- **2022-02-28** @42x42: Hey @emperor,
This one should also be resolved now. Could you kindly confirm?
- **2022-02-28** @emperor: Heya! @42x42 I can confirm this is fixed. 

Short summary:
Sending the request to GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?successRedirectUrl=https%3A%2F%2Fadmin.8x8.vc%2F%23%2Frooms%2Fadd HTTP/2 using above bug will now throw "HTTP/2 403 Forbidden" error for the same

Use ███

Thank you for the quick fix.

Cheers,
Emperor
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
