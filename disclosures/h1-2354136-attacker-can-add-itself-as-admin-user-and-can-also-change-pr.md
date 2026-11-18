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
date: 2024-03-22
submitted: 2024-02-04T10:04:12.901Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "dishant_singh"
source: "https://hackerone.com/reports/2354136"
title: "Attacker can Add itself as admin user and can also change privileges of Existing Users [█████████]"
---
# Attacker can Add itself as admin user and can also change privileges of Existing Users [█████████]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 48 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-03-22

- Report: [https://hackerone.com/reports/2354136](https://hackerone.com/reports/2354136)
- CWE: Improper Authentication - Generic
- Submitted: 2024-02-04T10:04:12.901Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there,
i have found a vulnerability on you [domain](████). After directory bruteforcing i found an directory without having any kind of protection and authentication. so an attacker can add new user to the site As **Admin** and an attacker can also change privilege of the users without any authentication. for further read steps to reproducue.

## Impact

The attacker can add itself as admin user and can also change user privileges without any authentication. this can lead to huge impact the entire site can be compromised.

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Visit ████████:1:0:::::  you will see the website is asking to login 
2. Now change the **1 to 9** or directly visit this [url](██████████:::::).
3. Navigate to `Add New User`
4. enter email  address, First name, Last name and choose agency to Non-Agency.
5. Click on `add new user`
6. check mail inbox you will recieve the username and password for the admin account you just created. 
7. Login with the creds you just got in you email.



**NOTE: I CREATED 2 ACCOUNTS WHILE TESTING THIS ISSUE I HAVE PROVIED CREDS FOR THE BOTH ACCOUNT IN POC MAKE SURE TO CHECK THEM AS WELL**

## Suggested Mitigation/Remediation Actions
the website should have proper authentication for the url ████████::::: so that can any unauthorized user cannot add user or change the privileges of the existing users.

## Timeline

- **Report Filed**
- **2024-02-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **2024-02-04** @dishant_singh: Hi there, 
i have found one more url on same domain vulnerable to same vulnerability 

visit: █████::::::

here an attacker can change privileges of the other users an also can add itself as admin.

thanks,
Dishant Singh
- **Report Severity Updated**
- **Report Triaged**
- **2024-02-06** @dishant_singh: hi there,
i can see that the vulnerability is fixed now impressive work by internal team.

Regards, 
Dishant.
- **Report Resolved**
- **Agreed On Going Public**
- **2024-02-10** @dishant_singh: Hy there,
Can you disclose this issue publicly as it is resolved now.

Regards, 
Dishant Singh
- **2024-02-22** @dishant_singh: Hy there 
can you verify if this can be issued a CVE if yes then can you help ?

Regards 
Dishant
- **2024-02-22** @agent-p1: Greetings @dishant_singh ,

We are currently deciding on the disclosure part of this report, please give us more time to route through appropriate channels. Secondly, please go to https://www.cve.org/About/Process and follow the steps required through the appropriate vendor. 

Regards,
The VDP Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
