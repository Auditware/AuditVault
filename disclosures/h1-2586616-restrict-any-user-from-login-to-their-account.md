---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-07-19
submitted: 2024-07-04T17:06:48.432Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "prakhar0x01"
source: "https://hackerone.com/reports/2586616"
title: "Restrict any user from Login to their account"
---
# Restrict any user from Login to their account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/2586616](https://hackerone.com/reports/2586616)
- CWE: Improper Authentication - Generic
- Submitted: 2024-07-04T17:06:48.432Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hii Triager,

I found that an attacker can change their email address to the victim's(existing user) email and restrict the victim from accessing their account.

Vulnerable Domain: `www.██████████.mil`

User-A: Attacker
User-B: Victim 

Both User-A & User-B are registered user & have their separate accounts on `www.███.mil`

## Step To Reproduce
1 - Login to Attacker's account, User-A (attacker@email.com)
2 - Login to Victim's Account, User-B (victim@email.com)
3 - In the Attacker's account, Navigate to `Update Profile`  section.
4- Change the Attacker's email to `victim@email.com`. You can successfully takeover the victim email. (not victim account)
5 - Now, Try to login as victim account(with victim email & password) , Application will Return `Invalid Credentials`

## References
████

## Impact

1 -Restric any user from accessing their account.
2 - Improper Authentication on change email fuctionality.

## System Host(s)
www.██████.mil

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1 - Login to Attacker's account, User-A (attacker@email.com)
2 - Login to Victim's Account, User-B (victim@email.com)
3 - In the Attacker's account, Navigate to `Update Profile`  section.
4- Change the Attacker's email to `victim@email.com`. You can successfully takeover the victim email. (not victim account)
5 - Now, Try to login as victim account(with victim email & password) , Application will Return `Invalid Credentials`

## Suggested Mitigation/Remediation Actions
1 - Set proper authentication on the `Update Profile` functionality

## Timeline

- **Report Filed**
- **2024-07-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
