---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-05-14
submitted: 2019-07-17T18:15:38.779Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jarvis0x1"
source: "https://hackerone.com/reports/648222"
title: "[██████████] Unauthorized access to admin panel"
---
# [██████████] Unauthorized access to admin panel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/648222](https://hackerone.com/reports/648222)
- CWE: Improper Access Control - Generic
- Submitted: 2019-07-17T18:15:38.779Z

## Timeline

- **Report Filed**
- **2019-07-17** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-07-17** @jarvis0x1: Another page with interesting information:

> https://██████████/mission.php?content=cifmcn&rcnum=
█████████
- **Report Needs More Info**
- **Report New**
- **2019-07-18** @ag3nt-j1: There's nothing wrong with reporting a test and demo site but I need to be able to replicate your findings to validate them.  If I can't validate the reports I can't process them.  We've been through this before, you know how we handle this.  If you have a valid login account for these sites please share those credentials with me so I can validate your findings.  If not you know I am going to ask you to self close these reports.  I looked through the report history on this site and I don't see any reports on authentication bypass so If you have that report number please share it with me.  I want to help you out here but you know, if I can't replicate I can't validate and can't process.
- **2019-07-18** @jarvis0x1: @ag3nt-j1 
Look, in order to validate this bug you  do not need an account.

In this report, I describe how a hacker without knowing some account can get access to private information on the site, as well as to some functionality on this site.  When a hacker goes to some pages of the site, he redirects to the authorization form, but the answer also contains some information (names, emails).

For example this link:
> https://███/personnel.php

███

### How get this page in your browser?
 Read steps-for-reproduce in report.

### How should be? 
When I go (for example to https://███████/personnel.php), I must have only redirection without any content of response. 

P.S. Let's first solve all the issues with this report, and then I will explain why the rest of my sent reports are important.

Regards!
- **2019-07-18** @jarvis0x1: Use this request:

```
GET /personnel.php HTTP/1.1
Host: ████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: ru,en-US;q=0.7,en;q=0.3
Accept-Encoding: gzip, deflate
Cookie: JSESSIONID=████; __VCAP_ID__=███████; TS01771652=██████; TS01771652031=█████; TSf7f79454027=████
Connection: close
Upgrade-Insecure-Requests: 1
Content-Length: 1

	
```

Response:
███████

In this response you can see redirection to login page. But in content you can see some users and their emails.
- **2019-07-18** @ag3nt-j1: I'm getting them to work now, I had to delete the entire "location:login.php"  not just the "login.php".  You make me tired Jarvis.  Just so you are aware, none of the data here is production, all test.  Even the users and email accounts are from the TV show 'The Office".  Will process this report as a high and the rest as mediums so the system owner will take notice.
- **2019-07-18** @jarvis0x1: I do not know where these emails come from. And I don't know if this site is production. But I know e that when the site tries to redirect the user to the authorization page, there should be no private data in the response body, or information about the site panel (only the redirect to the authorization page is answered).
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-12-04** @agent-r5: We will put it in the queue for disclosure.
- **2019-12-04** @jarvis0x1: thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
