---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-02-18
submitted: 2020-06-21T02:32:24.925Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/904064"
title: "Dashboard sharing enables code injection into ████ emails"
---
# Dashboard sharing enables code injection into ████ emails

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/904064](https://hackerone.com/reports/904064)
- CWE: Code Injection
- Submitted: 2020-06-21T02:32:24.925Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An attacker is able to share their dashboard with other █████████ users. When sharing their dashboard, the message is not fully sanitized for HTML characters before sending to the recipient. This allows the attacker to craft a believable spearphishing e-mail coming from an e-mail address owned by the ███████.

## Step-by-step Reproduction Instructions

1. Create an account or sign into ██████.
2. Browse to ███████/█████
3. Create a dashboard by clicking the dropdown menu and selecting `New Dashboard`.
████
4. Once you create the dashboard, go back to ███/██████ and select the dashboard you created.
5. You should see a `share` icon in the top right. Click this and click `Add groups and users`.
███
6. If you start typing in the `To:` field, a list of names should populate. Select the name of an account you own.
█████████
7. Check the `Send an email invitation box`. Populate the `Message` field with your spearphishing attempt (this can contain various HTML elements) and click `Share`.
██████
8. The victim will receive an e-mail from ██████████ with the injected HTML. As you can see below, the `<img>` tag did not work correctly but the other formatting seemed to work fine. This allows the adversary to get very creative..
██████████
*Note: the message above says "...shared with you by unagi unagi.", however an attacker could simply sign up with a first/last name of "████████" or something similar to make this more believable.*

## Suggested Mitigation/Remediation Actions
Sanitize all HTML tags prior to sending the e-mail to the recipient.

## Impact

An adversary could conduct a spearphishing campaign from an ██████ mail server - the scale of effects would be dependent on the creativity of the attacker and the gullibility of the victim.

## Timeline

- **Report Filed**
- **2020-06-21** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
