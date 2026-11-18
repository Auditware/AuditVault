---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-03-11
submitted: 2021-02-04T22:31:02.809Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "mit0z"
source: "https://hackerone.com/reports/1095830"
title: "CRXDE Lite/CRX is on ██████ exposed that leads to PII disclosure"
---
# CRXDE Lite/CRX is on ██████ exposed that leads to PII disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/1095830](https://hackerone.com/reports/1095830)
- CWE: Information Disclosure
- Submitted: 2021-02-04T22:31:02.809Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hi team ,
i found that aem is running on``` ████████ ``` and CRXDE Lite/CRX is exposed to unauthenticated user that can lead to information disclosure

POC
====
1-visit ``` https://██████//██████████ ```
2-go to query and search for admin then execute
3-go to this endpoint to retrieve the information 
```
https://████████//████████/███
```
[+]Request
```
GET //███/███ HTTP/1.1
Host: ████
Connection: close
sec-ch-ua: "Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en-XA;q=0.9,en;q=0.8
Cookie: oauth-configid=██████


```
[+]Response
```
HTTP/1.1 200 OK
Date: Thu, 04 Feb 2021 22:23:42 GMT
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Type: application/json;charset=utf-8
Content-Length: 1789
Connection: close
Set-Cookie: ███████; path=/; Httponly; Secure
Strict-Transport-Security: max-age=31536000; includeSubDomains
Set-Cookie: f5avraaaaaaaaaaaaaaaa_session_=█████████; HttpOnly; secure
Set-Cookie: █████████; Path=/

████████

```

█████████

## Impact

PII exposure

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1-visit ``` https://████████//█████████ ```
2-go to query and search for admin then execute
3-go to this endpoint to retrieve the information 
```
https://█████//███████/████
```

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-02-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-02-17** @mit0z: hi @agent-l8 
is there any update?
thanks
Martin
- **2021-02-17** @agent-l8: @mit0z not at this time, once the system owner has determined everything is fixed (could go beyond just an initial fix), they send it back to us and then we can resolve for you. Due to volume, we do not hear in-between. Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
