---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-10-13
submitted: 2021-09-16T07:36:39.522Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fdeleite"
source: "https://hackerone.com/reports/1341133"
title: "Subdomain takeover [​████████]"
---
# Subdomain takeover [​████████]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-10-13

- Report: [https://hackerone.com/reports/1341133](https://hackerone.com/reports/1341133)
- CWE: Privilege Escalation
- Submitted: 2021-09-16T07:36:39.522Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The subdomain `███████` was pointing to an Azure Cloud App domain (araz-sp.centralus.cloudapp.azure.com), but that endpoint was not registered.

## Impact

It's extremely vulnerable to attacks as a malicious user could create any web page with any content and host it on the vulnerable domain. This would allow them to post malicious content which would be mistaken for a valid site. 

They could perform several attacks like:
 - Cookie Stealing
 - Phishing campaigns. 
 - Bypass Content-Security Policies and CORS.

 
## Recommendations for fix

* Remove the affected DNS record if not used 
 

### Supporting Material/References:

 - https://0xpatrik.com/subdomain-takeover/
 - https://hackerone.com/reports/661751

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Just go to 

http://████████ 

You will see a blank page, but checking the source code you will see proof of the take over. 

```
<html>  
<!-- poc by deleite --> 
 </html>
```

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-09-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2021-09-16** @fdeleite: Thank you @agent-0g. 

Thank you to all members of DoD Vulnerability Disclosure Program.

This is by far the best VDP to work on.
- **Report Resolved**
- **Agreed On Going Public**
- **2021-10-06** @agent-l8: Adding to the disclosure queue
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
