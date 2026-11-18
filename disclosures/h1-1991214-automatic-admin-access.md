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
submitted: 2023-05-17T20:38:38.340Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "bulldawg"
source: "https://hackerone.com/reports/1991214"
title: "Automatic Admin Access"
---
# Automatic Admin Access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/1991214](https://hackerone.com/reports/1991214)
- CWE: Improper Access Control - Generic
- Submitted: 2023-05-17T20:38:38.340Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

URL: https://█████████.mil/apexcrrel/f?p=150:1:23467499301323::NO:::

When visiting the following URL, the user is automatically signed into a user with administrative access. 

███

This user is allowed to:
1. Create new submissions, allowing file uploads

████████

2. See all submissions going back to 2012

██████████

3. Manage users - add, delete, and link users. This user could also add the Administrator role to a user. 

███

████

4. Send spam emails to all users

█████████

5. Access admin tools like publishing data and removing publications

██████████

I did not test all functionality provided by this access as I did not want to damage the integrity of the data on the web application.

Please let me know if you would like me to test adding/deleting users, creating submissions and testing file upload vulnerabilities, etc. This would also allow me to demonstrate the severity of this vulnerability as well as find new vulnerabilities in the application. For example, with permission I would like to test the file upload functionality for vulnerabilities.

## Impact

This is a critical vulnerability. This impacts the integrity, confidentiality, and availability of the application. 

Integrity: Unauthorized users can upload arbitrary data, publish data, and delete publications.
Confidentiality: This exposes names, emails, and submissions.
Availability: This administrative user can delete other user accounts, denying them access.

## System Host(s)
███████.mil

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Visiting URL: https://███.mil/apexcrrel/f?p=150:24:23467499301323::NO:::
2. View active user in top right corner: "ben auto log user". This user is an administrator.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2023-05-17** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2023-05-30** @agent-p1: Greetings!
@bulldawg  Because of this report  and your other admin role submission you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2023-05-30** @bulldawg: Thank you so much! My name is Nick Verhelle, feel free to put it on the certificate. Also, my twitter handle is @Verhelle_Nick. 

Once again, thank you!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
