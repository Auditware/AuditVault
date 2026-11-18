---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-12-02
submitted: 2019-10-04T22:46:23.104Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pirateducky"
source: "https://hackerone.com/reports/708019"
title: "Information disclousure by clicking on the link shown in http://████████/"
---
# Information disclousure by clicking on the link shown in http://████████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-12-02

- Report: [https://hackerone.com/reports/708019](https://hackerone.com/reports/708019)
- CWE: Information Disclosure
- Submitted: 2019-10-04T22:46:23.104Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Looking at some subdomains using `aquatone` I noticed ` http://█████/` I clicked it and then started navigating the page, if I go to this link: `https://█████████/██████████wireframes/admin/round12/tsp_0-awarded.html` it is completely valid and shows some information that I'm unsure it should be online, it also shows me logged in as a user `Pat` and `Janelle`

## Impact

Information disclosure

## Step-by-step Reproduction Instructions

1. Navigate to ` http://████/`
2. Click `Main Index Page` 
3. Click ` Office & TSP` or use this link `https://███████/██████index-admin.html#` 

## Suggested Mitigation/Remediation Actions

If this is sensitive data - it should be restricted to only people who need to access it no the whole internet, there are certain action where it prompts for a password.

Thanks - 

If this is somehow *supposed* to be up I would like to self-close as to not affect my current profile

## Impact

Information disclosure, possibly a dev environment left open but unsure.

## Timeline

- **Report Filed**
- **2019-10-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-10-04** @pirateducky: https://████████/█████████wireframes/TSP/round6/tsp_5-enter-pickup.html
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-10-11** @pirateducky: thanks! requested disclosure
- **Agreed On Going Public**
- **Report Became Public**
