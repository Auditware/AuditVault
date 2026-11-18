---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-10-04
submitted: 2019-04-20T18:59:34.866Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/544334"
title: "[Critical] Possibility to takeover any user account #2 without interaction on the https://██████████"
---
# [Critical] Possibility to takeover any user account #2 without interaction on the https://██████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/544334](https://hackerone.com/reports/544334)
- CWE: Privilege Escalation
- Submitted: 2019-04-20T18:59:34.866Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. This time I discovered a way to tekeover any user's account via unsafe password reset.
This time it's much easier than #1 way in the #543678 report.
When users requests the password reset, the next link is come to the email:
```
https://█████/resetpassword.aspx?ru=[user_id]&op=[token]
```
The [user_id] is numeric, always same for same emaill, and incremental for every new user.
The [token] parameter is random and used to protect the link from hijacking.
But, I discovered that Reset password endpoint accepts empty token!

So all the attacker needs, it's to initiate password reset for the victim's email, and request the
```
https://██████████/resetpassword.aspx?ru=[user_id]&op=
```
Since `[user_id]` is numeric and static for same account, it can be easily guessed by the attacker.

##POC
1) Go to the https://█████/ForgotPassword.aspx
2) Initiate reset password for the `██████` (it's my test account)
3) Use this link:
```
https://███/resetpassword.aspx?ru=7655&op=
```
where 7655 - it's my user numeric ID (as we know, it's incremental, and be easily guessed for other accounts).
██████████
4) Set the new password and confirm it. You can set something as `111111111aA!!!!` to pass the password requirements.
5) You will be logged into my organization as admin.

##Suggested fix
Fix the `op` tooken validation - it should be checked properly.

## Impact

Severity: Critical
Immediate account Individual/Cprporate account takeover via password reset. Attacker needs to know only email.

## Timeline

- **Report Filed**
- **2019-04-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
