---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-03-11
submitted: 2021-01-06T09:28:37.657Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1072616"
title: "Stored XSS through name / last name on https://██████████/"
---
# Stored XSS through name / last name on https://██████████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/1072616](https://hackerone.com/reports/1072616)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-01-06T09:28:37.657Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
There is stored XSS Vulnerability on https://█████/██████ by rendering unsafe input being registered on the account name and last name.

███


## Step-by-step Reproduction Instructions

1. Navigate to 
```javascript
https://█████/login/?next=/███%3Fresponse_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252F████████%252Fcgi%252Flogin.cgi%253Freturn_to%253Dhttps%25253A%25252F%25252F███████%25252Fcgi%25252Fmyaccount.cgi%26client_id%3D6G3AXPQNPXK5SVESYCB8AMCPHQQ3ENCRK8G2QNWY%26state%3DBEAEb6NGMQ7kWZwZS2pNNFv4p7JwBk86%26scope%3Dopenid%2520profile
```
2. Create your account, with your name as <IMG SRC=X ONERROR=ALERT(1)>
3. Log in and navigate to https://███/██████

## Suggested Mitigation/Remediation Actions

Sanitizing the input on the account name fields will prevent the issue.

##Best Regards
nagli

## Impact

Executing javascript on behalf of the victim

## Timeline

- **Report Filed**
- **2021-01-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2021-01-06** @agent-l8: Thanks @nagli I just used xsshunter to confirm, all good. As for ROTM, that's not our team directly that ever sends that out, they usually do it no later than the 15th though, often earlier. Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
