---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-01-25
submitted: 2020-12-13T20:07:48.475Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "raywando"
source: "https://hackerone.com/reports/1058015"
title: "Full account takeover on https://████████.mil"
---
# Full account takeover on https://████████.mil

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 24 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-25

- Report: [https://hackerone.com/reports/1058015](https://hackerone.com/reports/1058015)
- CWE: Improper Access Control - Generic
- Submitted: 2020-12-13T20:07:48.475Z

## Timeline

- **Report Filed**
- **2020-12-13** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-12-14** @raywando: Hi @s52,

Thank you for your response!

Can you please let me know what makes it medium in severity? I'm wondering since it is a full unrestricted account takeover.

Thanks!
Regards.
- **2020-12-14** @raywando: I can also try to collect .mil email accounts (which are everywhere, including the ones that are in the application) that probably have high privileges in the app and automate the process of changing the password of every registered email but I don't think I should change any data including their passwords. So I believe the severity is higher than medium.

Please let me know if I missed something here.
Thanks.
- **2020-12-30** @raywando: Hi @s52, 

I have a question, is it ok to make a write-up of the bug after it's fixed? I will of course share it here first for your review.

Thanks.
- **Report Resolved**
- **2021-01-21** @raywando: Hi @s52,

Thanks for the response,

Is the severity final here? I believe it is supposed to be high, do you disagree?

Also, I'm gonna do i write-up, anything i should keep in mind while doing so?

Regards.
- **Report Severity Updated**
- **2021-01-21** @agent-l8: @raywando you can request to disclose the report, after it has been fully disclosed (usually takes about a week) you can write about it, noting things that we redacted such as the URL :) until it is disclosed, you cannot do a write up. Thank you!
- **Agreed On Going Public**
- **2021-01-21** @agent-l8: @raywando other then what we are required to redact, we do not do limited disclosure or redact comments, if you want to proceed, you can leave it here- if you do not, you can cancel the disclosure request. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
