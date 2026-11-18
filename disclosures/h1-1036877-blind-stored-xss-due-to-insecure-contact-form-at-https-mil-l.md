---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/privilege-escalation
  - trigger/admin-required
  - trigger/session-cookie
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-01-25
submitted: 2020-11-17T16:35:52.709Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "ahmedelmalky"
source: "https://hackerone.com/reports/1036877"
title: "Blind stored XSS due to insecure contact form at https://█████.mil leads to leakage of session token and "
---
# Blind stored XSS due to insecure contact form at https://█████.mil leads to leakage of session token and 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-25

- Report: [https://hackerone.com/reports/1036877](https://hackerone.com/reports/1036877)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-11-17T16:35:52.709Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Summary:
I have discovered a blind stored cross site scripting vulnerability due to an insecure Contact form available here  https://███████.mil/  This form does not properly sanitize user input allowing for the insertion and submission of dangerous characters such as angle brackets. I was able to submit a blind xss payload through the form which was triggered in backend /admin panel.
##Steps To Reproduce:
1-Browse to the page at https://██████.mil/and fill out the contact form submitting your blind XSS payload in First name , Last name, Company and description field.
2-Submit the form and have and admin access the information.
3-This will trigger XSS in the admin panel and a notification to the XSS hunter service with details of the event.

##Supporting Material/References:
(the screenshot )[██████████]

The IP address that triggered the XSS payload is  ████████ 

Xss hunter Report █████████

## Impact

An attacker is able to access critical information from the admin panel. The XSS reveals the administrator’s IP address, backend application service, titles of mail chimp customer and internal subscription emails, admin session cookies.
An attacker can exploit the above cookies to access the admin panel.

## Timeline

- **Report Filed**
- **2020-11-17** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Needs More Info**
- **Report New**
- **2020-11-18** @ahmedelmalky: Any update 
What do you need more sir ?
I gave you all the report and the time when fired the payload .
The contact form and the hole site stop working after firing the payload and it gives me 403
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
