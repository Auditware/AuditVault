---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-default-credentials
  - env/web
substate: "resolved"
weakness: "Use of Default Credentials"
enriched: true
body: true
date: 2023-05-15
submitted: 2023-04-07T19:31:53.668Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "waterlord7788"
source: "https://hackerone.com/reports/1938693"
title: "Default Credentials on Kinetic Core System Console - https://█████/kinetic/app/"
---
# Default Credentials on Kinetic Core System Console - https://█████/kinetic/app/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-05-15

- Report: [https://hackerone.com/reports/1938693](https://hackerone.com/reports/1938693)
- CWE: Use of Default Credentials
- Submitted: 2023-04-07T19:31:53.668Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The Kinetic Core System Console application has weak credentials of **admin/admin**.

## References
[https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/02-Testing_for_Default_Credentials](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/02-Testing_for_Default_Credentials)

## Impact

Potential attackers could identify technologies being used underneath. This would allow for them to find potential exploits.
In addition, the application is disclosing server logs, users in the database with their emails and names, system activity, and much more.
Check the uploaded image for additional information.
This information should not be available. 
With addition of sensitive data being shown, this is a serious issue.

## System Host(s)
█████

## Affected Product(s) and Version(s)
Kinetic Core System Console - 2.1.0-SNAPSHOT

## CVE Numbers


## Steps to Reproduce
1. Browse to the [Login page](https://████/kinetic/app/).
2. Login using credentials of **admin/admin**.
3. You should now be logged into an admin account.

## Suggested Mitigation/Remediation Actions
Change admin's password to something more secure.

## Timeline

- **Report Filed**
- **2023-04-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2023-04-07** @waterlord7788: Hello!
In addition, if this is a real issue, can I try to escalate this into something more critical?
Of course, if this is allowed.
Thank you.
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2023-05-03** @waterlord7788: Hello,

Can we disclose this issue?

All the best,
WaterLord778
- **2023-05-03** @billthomas6789: hi @waterlord7788 you can request disclosure by using the drop down box where you add comment
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
