---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - vuln/cors-misconfig
  - vuln/dos
  - impact/account-takeover
  - trigger/cors-origin
  - trigger/brute-force
substate: "informative"
weakness: null
enriched: true
body: true
date: 2025-05-15
submitted: 2025-04-09T14:25:04.801Z
bounty_usd: null
votes: 74
cve: []
program: "[[programs/lichess|Lichess]]"
reporter: "hajjaj0x"
source: "https://hackerone.com/reports/3085889"
title: "Weak Rate Limiting Controls in the (LOGIN) page Expose System to Brute Force and DoS Attacks"
---
# Weak Rate Limiting Controls in the (LOGIN) page Expose System to Brute Force and DoS Attacks

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Lichess | **Disclosed:** 2025-05-15

- Report: [https://hackerone.com/reports/3085889](https://hackerone.com/reports/3085889)
- CWE: N/A
- Submitted: 2025-04-09T14:25:04.801Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

The login page lacks proper rate limiting, allowing an attacker to easily perform a brute-force attack. This vulnerability enables the attacker to systematically try different username and password combinations until they successfully compromise any account, which poses a significant security risk.

## Steps To Reproduce:

1.    Navigate to the login page.

2. Attempt login with any valid credentials.

 3.  Capture the request using a proxy tool (e.g., Burp Suite).

  +  Modify the captured request by deleting the token parameter and the cookies to make the request look like this:
====================================================================
POST /login HTTP/2
Host: lichess.org
Content-Length: 343
Cache-Control: max-age=0
Sec-Ch-Ua-Platform: "Linux"
X-Requested-With: XMLHttpRequest
Accept-Language: en-US,en;q=0.9
Sec-Ch-Ua: "Not?A_Brand";v="99", "Chromium";v="130"
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryc5GZocBapliqt011
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.70 Safari/537.36
Accept: */*
Origin: https://lichess.org
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://lichess.org/login
Accept-Encoding: gzip, deflate, br
Priority: u=1, i

------WebKitFormBoundaryc5GZocBapliqt011
Content-Disposition: form-data; name="username"

§username§
------WebKitFormBoundaryc5GZocBapliqt011
Content-Disposition: form-data; name="password"

§password§
------WebKitFormBoundaryc5GZocBapliqt011
Content-Disposition: form-data; name="remember"

true
------WebKitFormBoundaryc5GZocBapliqt011-- 
=================================================================================

5.    Send the request to Burp's Intruder, adding a username wordlist for the "username" field and a password wordlist for the "password" field. Run the attack with the cluster bomb payload type.

    +   The wordlists should be large and realistic, matching common usernames and passwords (this will prevent rate-limiting issues caused by a smaller wordlist).

       + A smaller wordlist will cause the app to respond with 429 Too Many Requests due to insufficient time between attempts.

6.    Launch the attack, and you should eventually find a valid pair of credentials (response code 200 OK).

      + Ensure auto encoding is turned off in Burp Suite, as the credentials in the request are in plaintext.

     +   Note: The valid username will match many incorrect password attempts before the correct password is found and the app will not even feel that or make any reaction

Cause of the Vulnerability:

The vulnerability exists because the rate-limiting mechanism only checks for excessive requests to individual usernames. It does not account for multiple requests being sent to different usernames, allowing an attacker to bypass the rate-limiting by targeting a range of usernames. This creates an opportunity for a brute-force attack across a large set of accounts.

## Supporting Material/References:
{F4234333}
{F4234390}
{F4234544}

  * [attachment / reference]

## Impact

This vulnerability can lead to account takeover, privilege escalation, and the theft of sensitive user data.

## Timeline

- **Report Filed**
- **Report Informative**
- **2025-04-14** @hajjaj0x: That’s incorrect. As you can see in the images, I sent over 260 requests using different usernames and did not receive a single 429 status code. The rate limit does exist, but it can be bypassed simply by avoiding repeated requests for the same username in a short period. Instead, use a large, varied username list—just like you would in a real-world scenario—and structure the attack so that the victim's username is tested in a way that avoids detection.

Test it yourself, my guy.

Also, if you check the image labeled F4234390, you’ll see I was actually able to brute force the correct password—it returned a 200 OK response, confirming it was the valid one, and even when the password or the username is wrong it gives 401 no authentication just like any login attempt so where is that rate limit then ??
- **2025-04-14** @hajjaj0x: reopen the report body !!
- **Report Reopened**
- **2025-04-14** @hajjaj0x: have u taken a look :) ??
- **2025-04-14** @shrimpmode: So here's the relevant ratelimiting code for login attempts in Lichess:

- https://github.com/lichess-org/lila/blob/master/app/controllers/Auth.scala#L479-L494
- https://github.com/lichess-org/lila/blob/master/modules/security/src/main/PasswordHasher.scala


It's a bit complex, as it takes into account several factors, such as
- limits by account and by IP address
- trustworthiness of the source IP address based on IP2Proxy: https://blog.ip2location.com/knowledge-base/what-are-the-proxy-types-supported-in-ip2proxy/
- higher rate limiter cost for login attempts on the same account using multiple IP addresses
- higher rate limiter cost for entering a wrong password
- lower cost for nginx whitelists

In the best case of normal use, with no proxy/VPN detected, no multiple IPs per account and no wrong password,
the rate limiters allow up to 200 successful logins per IP and per 10 minutes. That upper limit will never be
reached in the case of an attack where the best case scenario doesn't happen.

That limit may seem high, but is necessary to allow school classes, club events, and OTB tournaments where a lot
of chess players log in from the same place at the same time.

Tomorrow I'll find the time to try and replicate a brute-force attack, to verify that the limits do work as intended.
- **2025-04-14** @hajjaj0x: Thanks for the clarification. However, I still think that an attacker can keep using the same method I would, even if they hit a 429 rate limit. They could simply restart the attack, excluding the usernames and passwords they've already tried, and use different wordlists until they reach the next 200-request limit—just like you mentioned.(btw i can make it reach more than 1000 request with this method)

Even then, they can just pause for a few minutes and restart the attack again. The main issue is that the attacker's IP never gets blocked. So what's the point of a rate limit if someone can literally stop the connection and try again without any real consequence?

+ I never encountered any 429 (Too Many Requests) responses during my testing.

+ I understand that the IP can get blocked, but that typically only happens with standard brute-force techniques. My method seems to bypass that restriction entirely.

+ I didn’t even rotate my IP or use any bypass headers—if I had, I believe the rate limit would have been even more lenient.
- **2025-04-14** @hajjaj0x: I will work on further exploitation of this bug .
- **2025-04-19** @hajjaj0x: Hi team 
any updates  ?? :)
- **Report Informative**
- **2025-04-30** @hajjaj0x: Hi team 
can we disclose the report, perhaps someone could work on further exploitation in the future .
- **Agreed On Going Public**
- **2025-05-05** @hajjaj0x: Hi team
can we disclose the report
- **Agreed On Going Public**
- **Report Became Public**
