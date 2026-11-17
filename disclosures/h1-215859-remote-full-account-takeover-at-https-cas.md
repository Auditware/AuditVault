---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/reliance-on-cookies-without-validation-and-integrity-checkin
  - env/web
substate: "resolved"
weakness: "Reliance on Cookies without Validation and Integrity Checking in a Security Decision"
enriched: true
date: 2019-10-04
submitted: 2017-03-24T14:49:40.993Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "karimrahal"
source: "https://hackerone.com/reports/215859"
title: "[REMOTE] Full Account Takeover At https://██████████████/CAS/"
---
# [REMOTE] Full Account Takeover At https://██████████████/CAS/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/215859](https://hackerone.com/reports/215859)
- CWE: Reliance on Cookies without Validation and Integrity Checking in a Security Decision
- Submitted: 2017-03-24T14:49:40.993Z

## Timeline

- **Report Filed**
- **2017-03-24** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **2017-04-04** @dc34: Upon assessing the impact of the vulnerability to their overall mission, the System owners have downgraded this to a high risk and we are adjusting the severity accordingly
- **2017-05-13** @karimrahal: Any update?
- **2017-06-30** @bwluebberthill: Greetings @karimrahal,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-06-30** @karimrahal: Hello!

I can happily confirm that this vulnerability has been successfully patched.
A stronger cryptography is now being used to generate the user id.

Thank You,
Karim Rahal
- **Report Resolved**
- **Agreed On Going Public**
- **2017-08-16** @karimrahal: Can this be publicly / partially disclosed on h1 please?
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
