---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
  - vuln/info-disclosure
  - impact/account-takeover
  - impact/sensitive-data
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2022-02-14
submitted: 2020-12-18T16:52:24.839Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "takester"
source: "https://hackerone.com/reports/1061736"
title: "Unauthorized access to PII leads to MASS account Takeover"
---
# Unauthorized access to PII leads to MASS account Takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-02-14

- Report: [https://hackerone.com/reports/1061736](https://hackerone.com/reports/1061736)
- CWE: Business Logic Errors
- Submitted: 2020-12-18T16:52:24.839Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi, I hope you doing well
I found a critical endpoint which disclosed the personal information which can use to takeover any account present on https://██████████
#Steps:
1. Visit the link https://www.████████/███████    you will get my details,  including first name and last name, mobile number and email_address related to the account.
2. Go to the forgot password link present at https://www.███████/ click on it.
3. Enter the mail address later you will be taken to another page which will ask you to enter mail address and pin
4. After entering mail address enter the pin as "████" as █████████ is at the endpoint.
5. It will validate and will ask you to change the password of that account.

###Note:  To get email list and pin list just decrease the number at the endpoint 
for example https://www.████████/███will give you another mail_address and pin will be ██████████

## Impact

An attacker can able to takeover any account that is present on that side.

## Timeline

- **Report Filed**
- **2020-12-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
