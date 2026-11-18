---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2021-02-18
submitted: 2020-05-03T17:56:05.173Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/865354"
title: "Arbitrary file upload and stored XSS via ███ support request"
---
# Arbitrary file upload and stored XSS via ███ support request

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/865354](https://hackerone.com/reports/865354)
- CWE: Violation of Secure Design Principles
- Submitted: 2020-05-03T17:56:05.173Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A malicious user can upload files of any type when submitting a support request. 

## Impact
This would allow the attacker to upload malicious executable files as well as `.html` or `.svg` files which would allow the attacker to execute malicious code on behalf of the ████ customer support representative.

## Step-by-step Reproduction Instructions

1. Browse to████████ and create an account or sign in if you already have an account.
2. Click `█████ Faculty/Staff IT Support`.
█████████
3. Click `██████ Support`
██████████
4. Complete the form and upload a file of your choice. Click Submit.
█████████
5. You will see that your request has been created, and your files are readily available for download.
█████████
6. If the customer support representative downloads the executable, their machine could be compromised. This is unlikely, however what is more likely is for the representative to open a malicious `.svg` (or `.xls`/`.doc`/etc.) file.
██████████
7. Opening the `.svg` file in a browser would fire the XSS.
███████
8. Instead of the `alert(XSS)` payload, an attacker could use `window.location` to redirect the user to a malicious website. They could also craft a fake login page that would appear to be the `████████` login page. Once the unsuspecting user submits their credentials, the malicious page would redirect the user to the real login page and the users credentials would be stored on the attackers machine.

## Suggested Mitigation/Remediation Actions
Whitelist allowed file types for upload (`.pdf`, `.jpg`, etc) as needed.

## Impact

This would allow the attacker to upload malicious executable files as well as `.html` or `.svg` files which would allow the attacker to execute malicious code on behalf of the █████ customer support representative.

## Timeline

- **Report Filed**
- **2020-05-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-05-03** @z32: Just an update, it appears this also effects the other form submissions as well:

### ████████ IT Request
███████

### ██████████ CIS Support
██████

### Office 365 Support
██████████

### Surface HUB Support
██████████

I assume this will effect all of the forms in the other categories within the service catalog as well, but do not want to continue to generate requests.
- **2020-05-04** @z32: It looks like I got some hits on my weblog from this as well, not sure if this was a blind stored XSS firing from one of the form fields or if it was rendered as a hyperlink and someone clicked it. One of the hits look like it was from slackbot..
█████
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
