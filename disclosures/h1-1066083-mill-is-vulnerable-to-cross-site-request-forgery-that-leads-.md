---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - impact/account-takeover
  - trigger/low-priv-user
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2021-01-25
submitted: 2020-12-25T00:50:55.138Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "m4xp0w3r"
source: "https://hackerone.com/reports/1066083"
title: "███████mill is vulnerable to cross site request forgery that leads to full account take over."
---
# ███████mill is vulnerable to cross site request forgery that leads to full account take over.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-25

- Report: [https://hackerone.com/reports/1066083](https://hackerone.com/reports/1066083)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2020-12-25T00:50:55.138Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The form within the "My Account" page in ███████mil fails to verify the CSRF token used when an user makes changes such as changing the password and other details. For example, an attacker can change the user's email address, full name, phone number, etc. In this way the attacker can gain full control over the user's account. 

**Note**
In order to get a valid CSRF token you will need to create an account and make any change in "My account" after this you can grab the value of the ██████████ token and use it in your CSRF attack.
**Description:**
Cross-site request forgery (also known as CSRF) is a web security vulnerability that allows an attacker to induce users to perform actions that they do not intend to perform. It allows an attacker to partly circumvent the same origin policy, which is designed to prevent different websites from interfering with each other.
## Impact
Attackers can take over accounts.
## Step-by-step Reproduction Instructions

1. Host the attached proof of concept in your server and change the desired values.
2. While authenticated visit the attacker's website that hosts the CSRF poc
3. On a different browser or incognito session log in with the new email address and password

## Impact

Attackers can take control over any user account.

## Timeline

- **Report Filed**
- **2020-12-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **2020-12-25** @m4xp0w3r: Can you update the Severity to high? I forgot to put it, sorry.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2021-01-04** @m4xp0w3r: Awesome! Happy new year!
- **2021-01-04** @m4xp0w3r: Can you guys disclose this report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
