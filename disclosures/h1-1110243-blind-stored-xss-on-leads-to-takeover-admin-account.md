---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-03-11
submitted: 2021-02-24T15:52:45.485Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hemantsolo"
source: "https://hackerone.com/reports/1110243"
title: "Blind Stored XSS on ███████  leads to takeover admin account"
---
# Blind Stored XSS on ███████  leads to takeover admin account

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/1110243](https://hackerone.com/reports/1110243)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-02-24T15:52:45.485Z

## Timeline

- **Report Filed**
- **2021-02-24** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2021-02-24** @hemantsolo: Hello Team,
Also using the cookie I got access to the Admin panel.
POC: Screenshot Attached.
- **Report Title Updated**
- **2021-02-24** @agent-l8: @hemantsolo you actually logged into the app as admin based on the xss response? Can you provide the request you used so we can confirm?
- **2021-02-24** @hemantsolo: Hello @agent-l8 
The cookie is expired now but a few minutes ago I have made one you can see that one, I guess that will help.

This is the below cookie I have used:
██████████


Thanks,
Hemant Patidar
- **Report Severity Updated**
- **Report Triaged**
- **2021-03-09** @agent-j5: System owner is stating this is fixed, I know with the blind xss tickets it can take a while to get a payload back.  I have sent 2 different updates with the payload and no response from xss hunter.  I was just curious if you are still getting anything from your xss?  I don't want to close this out as resolved if you are still seeing the issue.
- **Report Needs More Info**
- **Report Resolved**
- **2021-03-10** @hemantsolo: Hello @agent-j5,
I confirm that this bug has been fixed now, As I executed my payload 17 hrs ago but till now didn't get executed.

Thanks,
Hemant Patidar
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
