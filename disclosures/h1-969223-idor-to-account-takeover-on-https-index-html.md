---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - impact/account-takeover
  - trigger/admin-required
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-09-29
submitted: 2020-08-27T19:24:05.465Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/969223"
title: "IDOR to Account Takeover on https://████/index.html"
---
# IDOR to Account Takeover on https://████/index.html

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-29

- Report: [https://hackerone.com/reports/969223](https://hackerone.com/reports/969223)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-08-27T19:24:05.465Z

## Report summary

More details about the report could be found at my blogpost:
https://naglinagli.github.io/DoD_IDOR/ 

I would like to thank the DoD for a quick triage and resolution regarding the issue.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team!

**Summary:**

I found when you wish to update your profile on https://███████/ after your login through https://██████████/signIn/signIn.html website due to an IDOR.

This IDOR gives you the opportunity to change the origin email for the registered account by changing the ID parameter on the following request, i assume that if i would do it on the id=1 i would takeover the admin account, this is due to not requiring the OLD password to make an email change, aswell as no restriction to make POST actions on different account IDS.


**Description:**

IDOR chained to full Account Takeover on ██████ domain.

Account
## Step-by-step Reproduction Instructions

1. Register an account at https://█████████/signIn/CreateAccount.html (Attacker)
2. Login to your account and go the https://███████/signIn/account page
3. Click on the "update" button located at thetop middle, and capture the request on BURP
4. Now change the ID parameter on the request to the victims, change the email, and you successfully have managed to switch his email.

Request:

███


Video PoC:

█████

## Suggested Mitigation/Remediation Actions

1. Implementing email request change based on OLD password input
2. Returning 403/401 when user account attempts to change another user ID settings.

## Disclaimer

as you might notice the domain is https://██████/signIn/signIn.html when you sign in (.mil site), and it redirects you afterwards to https://██████████/ with the Compromised account, therefore i considered this In Scope.

Best Regards,
Nagli

## Impact

Issuing the malicious request on the victim account ID will lead to account takeover by replacing the email of the victim with the email of the attacker, and requesting a new password using the Forgot password option.

## Timeline

- **Report Filed**
- **2020-08-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-09-16** @nagli: @agent-l8 
I assume my report is resolved?
███████ redirects to google atm
and https://███████/signIn/signIn.html returns 404.
- **2020-09-16** @agent-l8: They are actively working it- once we hear back from the system owner as fixed, we will update w/resolved.
- **2020-09-17** @nagli: Thanks.
- **Report Resolved**
- **2020-09-25** @nagli: Would like to request disclosure, thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2020-11-17** @ag3nt-j1: I think it's fair and will go ahead and raise this to a critical finding.
- **Report Severity Updated**
