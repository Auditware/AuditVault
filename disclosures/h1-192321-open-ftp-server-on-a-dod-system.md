---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/file-and-directory-information-exposure
  - env/web
substate: "resolved"
weakness: "File and Directory Information Exposure"
enriched: true
date: 2019-10-08
submitted: 2016-12-19T02:56:31.487Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/192321"
title: "Open FTP server on a DoD system"
---
# Open FTP server on a DoD system

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/192321](https://hackerone.com/reports/192321)
- CWE: File and Directory Information Exposure
- Submitted: 2016-12-19T02:56:31.487Z

## Report summary

An open FTP panel was discovered which allowed any attackers to connect and upload their files. Initial probing discovered it was still being used by multiple people confirming this was still in use.

## Timeline

- **Report Filed**
- **2016-12-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2017-02-07** @latyzenhaus: Greetings,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you can confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request to confirm the vulnerability has been resolved. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-02-07** @alyssa_herrera: Yes it's been successfully resolved I'm no longer able to access the ftp panel
- **Report Resolved**
- **Agreed On Going Public**
- **2017-02-10** @alyssa_herrera: Can we publicly disclose this one. Change the Title to Exposed FTP Panel on a navy website or something to that effect
- **Report Title Updated**
- **Report Title Updated**
- **Report Reopened**
- **2017-02-16** @departmentofdefense_2: Hey @latyzenhaus, can you take a look at this? Technically this is an FTP issues, not web, and therefore may be out of scope. but if not, the service is still listening and responding to anonymous logins.
- **2017-02-16** @alyssa_herrera: It's in read only mode now,  can't access, modify or delete   or create new files.  But it's open again.  Before it was allowing files to be accessed and it modify dates on the file indicated it was still being used currently. I would consider this web in the same way you consider ssh access to a website subdomain
- **2017-05-08** @alyssa_herrera: Any update on this ?
- **2017-05-08** @mqoliver: @psychomantis waiting for the system owner to fix this vulnerability. When they do, we will contact you to validate the fix.
- **Report Triaged**
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **2018-06-26** @ag3nt-j1: @alyssa_herrera, just wanted to let you know that they system owner has stated to us that this system is working as designed, despite debating this over the last month or two with them.  I agree with you that this is an issue but I am going to need to close this out as resolved at this point.  Thanks for supporting the DoD Vulnerability Disclosure Program!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
