---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2025-01-24
submitted: 2022-05-03T01:51:43.148Z
bounty_usd: null
votes: 69
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hxhbrofessor"
source: "https://hackerone.com/reports/1556950"
title: "Exposure of Private Personal Information to an Unauthorized Actor - PII  and soldier data (mos, schools, and speciality training)"
---
# Exposure of Private Personal Information to an Unauthorized Actor - PII  and soldier data (mos, schools, and speciality training)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 69 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2025-01-24

- Report: [https://hackerone.com/reports/1556950](https://hackerone.com/reports/1556950)
- CWE: Violation of Secure Design Principles
- Submitted: 2022-05-03T01:51:43.148Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Authenticated users on `https://█████████/SelfService/home/selfservice` can view other ████████'s data by following the page site for `My ███ Data` and start manipulating URL requests to view the following tabs: 
* Personnel
* Active Duty Tours
* ADOS
* Assignments
* ATRRS
* Data Discrepancies
* DJMS-RC Pay File Records
* DJMS-RC Pay Voucher
* Drill Attendance
* Education/Training
* Gains/Losses
* GI Bill Programs

Tester primarily focused on Personnel, ATRRS, and Education/Training tabs. 

## References

* CWE-359: Exposure of Private Personal Information to an Unauthorized Actor
* CWE-200 - Information Disclosure
* CWE-284 - Improper Access Control

## Contributers

- badlifeguard
- theonetruepengu

## Impact

The information displayed in Personnel, ATRRS, and Education/Training tabs shows a soldier's Last 4 of an SSN, Home of Record, MOS (Job title), and schools. Due to heightened tensions in today's GEO-Political climate, the availability of this information can be dangerous and potentially put a soldier's life at risk: scenario, insider threat working with an adversarial country to retrieve data.

## System Host(s)
████████, ██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
* Authenticate to https://█████████/SelfService/home/selfservice with burpsuite
* Turn Intercept off
* Go to the bottome of the page and click on `My █████████ Data`
* On Burp, click proxy
** HTTP History
** Scroll to the last GET request with message 200
** URL should be `https://█████████/SelfService/Home/dynamicdata/section/██████████/██████████%20TPU/61/124948002`
** Right click over the message and send to `Intruder`
* Intruder Set up
** Clear all variables in Postions Tab
** in the get request highlight the `2` in `GET /SelfService/Home/dynamicdata/section/███████/████%20TPU/61/124948002` and on the right hand side of Intruder click `add variable`
** Payload Tab 
*** Payload Set > Payload Type > select numbers
*** Payload Options [Numbers] > From: 1 > To: 9 > Step: 1
** Options Tab
*** Grep Exact > add > refetch response > in the search box: search `Primary MOS` this will display a succesful record found.

Additional URLs  to manipulate utilizing the same steps above are:

```bash
Personnel
https://█████/SelfService/Home/dynamicdata/section/██████/███████%20TPU/61/124948002

ATTRS
https://██████████/SelfService/Home/dynamicdata/section/█████████/█████████%20TPU/444/124948002

Education/Training
https://████████/SelfService/Home/dynamicdata/section/█████/████%20TPU/2001/124948002

```

## Suggested Mitigation/Remediation Actions
Correct permissions on access to these URLs. Authenticated users should be checked against their own ID and data.

## Timeline

- **Report Filed**
- **2022-05-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2022-05-03** @hxhbrofessor: Initial Get request for my user.
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-05-11** @agent-kj7: Good morning @hxhbrofessor 

We are not able to authenticate to confirm if the ticket has been mitigated due to lack of privileges. Would you be willing to take a quick look at your ticket to confirm that it has been mitigated. We apologize for the inconvenience. 

Thank you

@agent-kj7
- **Report Needs More Info**
- **2022-05-24** @agent-bk1: Would you be able to confirm if this ticket has been mitigated? We apologize for any inconvenience, we lack the authentication to determine if it has been mitigated.
- **Report New**
- **Report Needs More Info**
- **Report Resolved**
- **Agreed On Going Public**
- **2025-01-13** @hxhbrofessor: I wanted to follow up with an update on this. Thanks in advanced.
- **2025-01-13** @agent-p1: Greetings, 
We are currently in the process of reviewing your disclosure request. Please be patient as we make our decision. 

Regards,
The VDP Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
