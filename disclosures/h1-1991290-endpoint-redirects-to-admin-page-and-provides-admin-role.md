---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-07-19
submitted: 2023-05-18T00:11:05.535Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "bulldawg"
source: "https://hackerone.com/reports/1991290"
title: "Endpoint Redirects to Admin Page and Provides Admin role"
---
# Endpoint Redirects to Admin Page and Provides Admin role

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/1991290](https://hackerone.com/reports/1991290)
- CWE: Improper Access Control - Generic
- Submitted: 2023-05-18T00:11:05.535Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
By navigating to https://████████.mil/apexcrrel/f?p=165:56, the user will automatically be redirected to the web application admin portal with Admin access.

**Description:**
There is a web application running at the following URL:

https://█████.mil/apexcrrel/f?p=165:1::::::

████

For context, this is a web application running on a Oracle Apex Express platform. The '165' in the 'p' parameter in the URL is a unique identifier for the web application. The '1' following the '165' represents the page that the user is viewing. 

The page '56' can be used to automatically obtain administrator access to this application. 

Here we can see that we can't access the 45th page (https://████.mil/apexcrrel/f?p=165:45) because we are not an Admin.

███████

However, navigating to the 56th page (https://██████████.mil/apexcrrel/f?p=165:56) automatically redirects to the 45th page but provides a valid admin session. 

█████████

We can also see that we have the ability to manage users, including admin users.

██████████

As a note, I found this due to the application at https://████.mil/apexcrrel/f?p=164:5::::::
This is a separate web application, given that the unique identifier is now 164. 

On this page there is a 'Go To Admin' button. When clicking this, it calls the /apexcrrel/DISDI_PORTAL_DEV.login_admin endpoint. This redirects the user to the 56th page, breaking the access control and providing Admin access.

███████

## Impact

This is a critical severity bug that impacts confidentiality, integrity, and availability. 

Confidentiality: An attacker can obtain first names, last names, email addresses, and filenames of uploaded files.
Integrity: An attacker can upload files, edit documents, and edit user roles
Availability: An attacker could remove all users, including admins, making it difficult for users to use the application.

## System Host(s)
█████.mil

## Affected Product(s) and Version(s)
Oracle Apex Express

## CVE Numbers


## Steps to Reproduce
1. To verify that you do not have any valid sessions to view the admin pages, visit https://██████.mil/apexcrrel/f?p=165:45
2. Now, navigate to https://█████████.mil/apexcrrel/f?p=165:56
3. You now have admin access to the application.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2023-05-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Informative**
- **2023-05-22** @bulldawg: Hello,

I am requesting to reopen this report. The report you referred to (#1991214) has been closed and I validated that the bug in that report has been remediated. However, the bug mentioned in this report was not fixed when that was remediated. The bug mentioned in this report is still present.

Please let me know whether I need to create a new report submission or if you can just reopen this report.
- **2023-05-22** @agent-j5: Greetings @bulldawg can you try to do it from a new browser or after clearing history. I am unable to replicate the issue from a different browser than I tested it the first time.  If I use chrome as I did in the first test it does let me log in making me think it is using a cached session. If you clear your history and SSL state does it still work?  Does it load from an incognito window?  When I try all of those things I get a Insufficient privileges message.  Let me know what results you get, but as of now from these findings I am not able to reopen.  Thank you for supporting the DoD.
- **2023-05-22** @agent-j5: Greetings @bulldawg Never mind may  have been a hiccup, it is working for me now
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
