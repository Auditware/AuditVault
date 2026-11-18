---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/session-fixation
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
  - trigger/session-cookie
  - trigger/brute-force
substate: "resolved"
weakness: "Session Fixation"
enriched: true
body: true
date: 2021-04-20
submitted: 2021-04-05T20:10:54.701Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "gentlemenhacker"
source: "https://hackerone.com/reports/1150573"
title: "████████ portal is open to enumeration once authenticated.  Session ID's appear static.  All PII available once a valid session ID is found."
---
# ████████ portal is open to enumeration once authenticated.  Session ID's appear static.  All PII available once a valid session ID is found.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-20

- Report: [https://hackerone.com/reports/1150573](https://hackerone.com/reports/1150573)
- CWE: Session Fixation
- Submitted: 2021-04-05T20:10:54.701Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Once Authenticated to █████████ portal with valid credentials you can type in another members session id and you can see any service members data as if you were authenticated as them.

https://█████████

I did not see if there was a way to dump all session id's, but wouldn't be too surprised if it was vulnerable to this.

## References

Replacing that string above with valid session ID's let me see ██████ info

## Impact

All PII held in ██████████ portal exposed.  █████████.  
If website doesn't stop me, I could either dump the list of id's or utilize a tool to brute force a range.

## System Host(s)
█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Step 1: Authenticate to █████████ portal with valid credentials. 
Step 2:  navigate straight to this page with a valid session id
https://████████
If you have a valid session id, you can see any service members data as if you were authenticated as them.

## Suggested Mitigation/Remediation Actions
random session ids.  better authorization to data.

## Timeline

- **Report Filed**
- **2021-04-05** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2021-04-05** @gentlemenhacker: Session ID likely just primary key for the record on the db (static)
- **2021-04-06** @agent-k9: Unable to enumerate any user or information.
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2021-04-06** @agent-l8: Thanks @gentlemenhacker, good find!
- **Report Resolved**
- **2021-04-20** @gentlemenhacker: That's great news!  Can this be properly redacted and publicly disclosed?
- **2021-04-20** @agent-l8: @gentlemenhacker yep- on the comment drop down select "request disclosure" thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
