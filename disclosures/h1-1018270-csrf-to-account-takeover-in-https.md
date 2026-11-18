---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2020-11-09
submitted: 2020-10-25T11:12:36.008Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "i_hack_everyone"
source: "https://hackerone.com/reports/1018270"
title: "CSRF to account takeover in https://█████/"
---
# CSRF to account takeover in https://█████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/1018270](https://hackerone.com/reports/1018270)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2020-10-25T11:12:36.008Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi DoD team,
I found a CSRF to account takeover in https://███████/

## NOTE:
Try to open the site in firefox because chrome sometimes is not allowing to open the site.

## Summary:
There is no protection against CSRF in changing email which lead to CSRF to account takeover on  https://██████/.

## Step-by-step Reproduction Instructions
## I have made a video POC in which I have shown the account takeover clearly Please do watch for better understanding
1. Login as victim and check your infos in the account details
2. Open the CSRF malicious file which I have attached (csrf_POC.html)
3. Now the email is different (you can also change your name and other fields as well)
4. Now you can simply takeover the account
5. All you have to do is click on reset password on main page and enter the email you used to trick the victim and you will get instructions to reset the password. And you can successfully takeover the account

## Suggested Mitigation/Remediation Actions
Use captchas and CSRF-tokens for be sure that the victim is changing the datas knowing that.

## Impact

It is a critical issue as i was able to takeover anyone account using this attack. This vulnerability is high/critical because I was able to perform account takeover

## Timeline

- **Report Filed**
- **2020-10-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-27** @i_hack_everyone: Thanks @agent-l8
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
