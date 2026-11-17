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
