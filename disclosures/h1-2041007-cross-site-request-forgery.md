---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2023-11-05
submitted: 2023-06-28T07:05:46.405Z
bounty_usd: null
votes: 111
cve: []
program: "[[programs/owncloud|ownCloud]]"
reporter: "pascal_geuter"
source: "https://hackerone.com/reports/2041007"
title: "Cross-Site Request Forgery "
---
# Cross-Site Request Forgery 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 111 | **Program:** ownCloud | **Disclosed:** 2023-11-05

- Report: [https://hackerone.com/reports/2041007](https://hackerone.com/reports/2041007)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2023-06-28T07:05:46.405Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The application does not throw a CrossSiteRequestForgeryException, if the request does not contain the requesttoken header.

Steps to reproduce 
- run the docker image "owncloud/server:10.12.2" , redis and mariadb with docker-compose
-  log in the application as an admin user
- insert your cookies in

```bash
curl 'http://localhost:8080/settings/users/users' \
  -H 'Accept: */*' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Cookie: oc_sessionPassphrase=<placeholder1>; oclt1tejv3yd=<placeholder2>' \
  -H 'Origin: http://abc:8080' \
  --data-raw 'username=new_admin&groups%5B%5D=admin&password=a&email=test%40mail.com' \
  --compressed
```

and run it.
- Login in the application with the username `new_admin` and the passwort `a`

To add an admin user is only an example. Most if not all requests does not require an CSRF token.

I think the cause of this vulnerability is the second condition of https://github.com/owncloud/core/blob/master/lib/private/AppFramework/Middleware/Security/SecurityMiddleware.php#L145, because the the value of `$this->request->getHeader("Authorization")` is an empty string and not null, if there are no `Authorization` header.

## Impact

Under the requirement, that the sameSite value of the cookies are set to `lax` or `none`, an attacker can create a website and if the victim surfs to this website cross site requests with the cookies of the victim are possible. Depending on the role/groups of the victim, the attacker can create an admin account with known username and passwort or share files with an other (possible attacker controlled) user and possible other actions.

## Timeline

- **Report Filed**
- **2023-06-28** @ownCloud: Thanks a lot for reporting this potential issue back to us. We take security very seriously and would appreciate if you would not share any information about this bug until we have determined a potential patch.
 
Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster.
- **Report Triaged**
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-07-26** @pascal_geuter: Hello all, in accordance with our [responsible disclosure policy](https://cirosec.de/cirosec-responsible-disclosure-policy/), we are now seeking to obtain a CVE for this vulnerability. As my employer, cirosec, is a CNA and is therefore able to issue CVEs, we are in a position to offer to issue a CVE. Should you wish to issue a CVE yourself, we would be fine with this as well.
