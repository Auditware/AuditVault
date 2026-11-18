---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2022-04-20
submitted: 2020-12-16T01:22:05.424Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "takester"
source: "https://hackerone.com/reports/1059758"
title: "Full account takeover in ███████ due lack of rate limiting in forgot password"
---
# Full account takeover in ███████ due lack of rate limiting in forgot password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-04-20

- Report: [https://hackerone.com/reports/1059758](https://hackerone.com/reports/1059758)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2020-12-16T01:22:05.424Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Steps:
1. Visit the link https://www.██████/██████████and enter the valid ████████.
2. You will be redirect to the page where it will ask you to fill your ████████ and ████████ that you get in your mail.
3. Enter the wrong ███ and intercept the request.
4. Then bruteforce the ███.(You can use burp intruder)
5. After valid ████████ it will aks you to create new password

##Request that I intercept
POST ███ HTTP/1.1
Host: www.███████
Connection: close
Content-Length: 197
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Origin: https://www.███████
Upgrade-Insecure-Requests: 1
DNT: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://www.█████████/█████████
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,mr-IN;q=0.8,mr;q=0.7,hi;q=0.6
Cookie: [value]

██████████&██████=[████████]

## Impact

An attacker can takeover victim account if he has valid email related to the victim.

## Timeline

- **Report Filed**
- **2020-12-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for ████ing the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
