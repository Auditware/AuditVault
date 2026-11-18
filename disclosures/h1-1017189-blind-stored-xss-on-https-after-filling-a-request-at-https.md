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
submitted: 2020-10-23T17:05:28.639Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1017189"
title: "Blind Stored XSS on https://█████████ after filling a request at https://█████"
---
# Blind Stored XSS on https://█████████ after filling a request at https://█████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/1017189](https://hackerone.com/reports/1017189)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-10-23T17:05:28.639Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

When you submit a request at https://██████████, the content is being sent to the administrators of the application, and you will be presented with your request status at https://████

The Description field at the request status page is prone to stored xss and blind stored XSS injection, because there is no sanitization on the input being inserted.

As for now this is self (because the link is for the account), i'm 100% sure that when an administrator will check the request his details will get sent to my email, and i have a xss payload stored on my user.

████████

## Step-by-step Reproduction Instructions

1. Register to https://██████████ / login to my account (████)
2. Navigate to https://███
3. Craft your XSS payload on the description window
4. Submit your request
5. Navigate to https://█████████
6. The javascript will execute.

## Suggested Mitigation/Remediation Actions
Sanitizing the input being inserted into the description window field.

##Best regards
nagli

## Impact

Stored blind XSS  on the pac.whs.mil website which could lead to administrator credentials being leaked.

## Timeline

- **Report Filed**
- **2020-10-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2021-01-21** @nagli: Finally it got triggered, 3 month later :-)

████
- **2021-01-21** @agent-l8: lol it was me- the system owner had a question about something so i logged into your account haha
- **2021-01-21** @nagli: @agent-l8 
Ya, it was weird as it was a normal portal :D
Saw the mysterious severity change 2 weeks ago so I assumed it could be you, really cool :-D
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
