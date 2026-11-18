---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
  - trigger/unauthenticated
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-03-22
submitted: 2024-01-25T13:29:10.107Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "archyxsec"
source: "https://hackerone.com/reports/2334420"
title: "Improper Authentication (Login without Registration with any user) at ████"
---
# Improper Authentication (Login without Registration with any user) at ████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 67 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-03-22

- Report: [https://hackerone.com/reports/2334420](https://hackerone.com/reports/2334420)
- CWE: Improper Authentication - Generic
- Submitted: 2024-01-25T13:29:10.107Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team!

I found a security issue in ███████. An attacker could login as a any user without registration in the page and above all it can change the session of a victim and authenticate him as any user. 

The problem is at the endpoint  ██████████ which, thanks to the **signin** parameter, allows to authenticate anyone with any user.

## Impact

Authentication bypass (Login as any user without authentication)
Force a victim to change session with other user

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to ██████████
2. To check the authentication bypass go to ████:

███

As the link corresponds to a GET request you can force any user to log out and authenticate to any other account.

Additional bonus: *clientid and clientsecret are stored in the page source*

███████

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2024-01-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2024-01-25** @archyxsec: Hi Team,

Additional notes: With this bug an attacker bypass this authentication login:
███pool/sso/authenticate/l/15?u=█████&wa=wsignin1.0&wctx=███████&wtrealm=██████████

This Bug can be consider Critical or High because Authentication Bypass.

Regards,
-archyxsec
- **Report Needs More Info**
- **Report New**
- **2024-01-25** @archyxsec: Hi again @agent-p1 ,

I have also found a possible DoS via infinite loop request on this server, does your program accept DoS reports?

I have that doubt, so I can write another report for you.
Thank you very much in advance

Regards,
@archyxsec
- **Report Severity Updated**
- **Report Triaged**
- **2024-01-25** @archyxsec: Hi @agent-z1 @agent-p1 ,

I have also found a possible DoS via infinite loop request on this server, does your program accept DoS reports?
I have that doubt, so I can write another report for you.
Thank you very much in advance

Regards,
@archyxsec
- **2024-01-25** @agent-z1: Greetings @archyxsec ,

We are triaging this report as medium severity based on the authorization bypass to access the site.  The accounts provided in the login endpoint do not appear to be referencing any actual accounts stored in the systems database.  Additionally, we will be contacting the system owner in regards to the clientID and client secret being visible in the web communication during the OAuth workflow.  Depending on the configuration and privileges afforded to the application this could be a potential avenue for further exploitation or not very significant.  We will request the system owner review the public transmission of the app client secret and if it is found to be more severe we will adjust the severity of the report accordingly.

Thanks again for your support.

Regards,
The VDP Team
- **2024-01-25** @archyxsec: Hi @agent-z1 ,

Thank you for the explanation,

I have another question about reporting another issue. I found a DoS due to infinite request loop, does your program accept DoS?

Thanks in advance,
@archyxsec
- **2024-01-25** @agent-z1: Greetings @archyxsec ,

I'm sorry, I missed your DOS question earlier.  Unfortunately, we no longer accept reports related to DOS attacks.

Regards,
The VDP Team
- **2024-01-25** @archyxsec: Hi @agent-z1 ,

Perfect! thank you so much for your response!

Regards,
@archyxsec
- **2024-01-26** @archyxsec: Hi @agent-z1 ,

More updates here:

You can check that it really is an auth bypass, if you don't set a signin, when you try to access any resource like /portal/index.php it redirects you to a page to authenticate, with this bug you can bypass that authentication and access the server resources, so the severity of this bug should go up to critical/high.

Regards,
@archyxsec
- **Report Severity Updated**
- **2024-01-29** @agent-z1: Adjusting severity to High based on internal communication.
- **Report Resolved**
- **Agreed On Going Public**
- **2024-01-31** @terminalnode: @archyxsec 

No worries. This will be handled appropriately within a few business days by the team.

Regards,

The VDP Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
