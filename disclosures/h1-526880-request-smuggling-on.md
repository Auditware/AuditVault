---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2019-10-08
submitted: 2019-04-04T14:55:55.466Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "albinowax"
source: "https://hackerone.com/reports/526880"
title: "Request smuggling on ████████"
---
# Request smuggling on ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/526880](https://hackerone.com/reports/526880)
- CWE: HTTP Request Smuggling
- Submitted: 2019-04-04T14:55:55.466Z

## Report summary

I've posted a full writeup over at https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn

## Timeline

- **Report Filed**
- **2019-04-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2019-06-27** @ag3nt-j1: @albinowax I'm working with the system owner to try and resolve the issue reported.  Do you have anything on hand that might help these folks remediate this?
- **2019-06-28** @albinowax: You could make the frontend reject or nomalise requests if a header contains `\n`. Or make it respect the RFC and treat `\n` as a valid header ending.

Or you could make the backend reject requests that specify both a `Content-Length` and `Transfer-Encoding: chunked`. When it rejects them, it should also close the connection.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
