---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
substate: "not-applicable"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
date: 2026-08-26
submitted: 2026-08-25T09:45:17.856Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "k4rasu_s4ma"
source: "https://hackerone.com/reports/3955945"
title: " curl_share TOCTOU > RCE via Curl_llist _dtor Function Pointer Hijack"
---
#  curl_share TOCTOU > RCE via Curl_llist _dtor Function Pointer Hijack

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2026-08-26

- Report: [https://hackerone.com/reports/3955945](https://hackerone.com/reports/3955945)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2026-08-25T09:45:17.856Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-08-25** @bagder: From the documentation:

> "It is not supported to share cookies between multiple concurrent threads."

So, this is not expected to work.
- **2026-08-25** @k4rasu_s4ma: Hi there dear cURL team,

Thanks a lot for quick response! But I tested on my side on local machine and the RCE works and able to create on my local machine `tmp/rce-proof-curl` file.

I also reported you via mail the detailed document where you can see all necessary steps or proof that shows successful RCE with this vector.

Lets together understand what the issue here
- **2026-08-25** @bagder: This is a known and documented limitation of the share API. It is not a vulnerability. 

If you feel like improving the code to make this feature possible in the future, we will welcome your help.
- **2026-08-25** @k4rasu_s4ma: I understand that this is share API flow, but this flow open the door for TOCTOU attack vector and show how to leverage it to RCE, so from security perspective it able to be fixed to avoid attack vector from this kind of flow. Like I mentioned in report fix recommendation:
`The critical change: set share->cookies = NULL while the lock is still held, then release the lock, then call Curl_cookie_cleanup(). Any racing thread that acquires the lock between the NULL assignment and the unlock will see NULL and will not create a dangling pointer.`
- **2026-08-25** @k4rasu_s4ma: Also if you have documentation pointing to this kind of statement can you please share it, because it is normal if any feature flow can be abused to leverage attack vector  like shown in this submission issue.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2026-08-26** @k4rasu_s4ma: Alright, thanks a lot for quick response and resolution in anyway.

I'm agreed with disclosing, also just to clarify with you, do you feel okay if I will public the exploit for this vulnerability? Just for community to have vision about how this attack vector can be exploited just with one exploit run.

Best, k4rasu_s4ma
- **2026-08-26** @bagder: **IT IS NOT A VULNERABILITY**

So there cannot be an "exploit" of it. You can publish whatever you want.
- **2026-08-26** @k4rasu_s4ma: Alright alright, I will share it and public so every community ones able to see it. 

Also just for you in further cases. If attack vector works and there is runable PoC that show that RCE successfully works and THERE IS ABILITY to enable share cookies that means that is vector,  because this ability exist from curl functionality. So my vector not "theoretical" vector, I show clearly how to exploit it and gain RCE.

But anyway, I respect your opinion and decision and have no any troubles with closed report, just want to check with you if you ok if I share every details and working runable exploit  for this attack vector about TOCTOU vulnerability leading to RCE.
- **Comments Closed**
- **2026-08-26** @bagder: You are hereby banned from this project.
- **2026-08-27** @jimfuller2024: the operative snippet in docs

'Cookie data is shared across the easy handles using this shared object. Note that this does not activate an easy handle's cookie handling. You can do that separately by using CURLOPT_COOKIEFILE for example.

It is not supported to share cookies between multiple concurrent threads. '
