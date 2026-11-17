---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2025-05-01
submitted: 2025-05-01T00:05:53.247Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/wakatime|WakaTime]]"
reporter: "ctrl_cipher"
source: "https://hackerone.com/reports/3120790"
title: "Session Replay Attack Allows Authentication Bypass via Captured Login Responses Allowing Bypass of 429 Too many attempts for Multiple Failed Logins"
---
# Session Replay Attack Allows Authentication Bypass via Captured Login Responses Allowing Bypass of 429 Too many attempts for Multiple Failed Logins

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** WakaTime | **Disclosed:** 2025-05-01

- Report: [https://hackerone.com/reports/3120790](https://hackerone.com/reports/3120790)
- CWE: Improper Authentication - Generic
- Submitted: 2025-05-01T00:05:53.247Z

## Timeline

- **Report Filed**
- **2025-05-01** @ctrl_cipher: This attack also bypasses the rate limit put in place at the login after too many failed login attempts as you can see I modified a 429 Too many requests response and I was logged in.
- **Report Title Updated**
- **Report Title Updated**
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-05-01** @ctrl_cipher: hello could you please remove the attachment 3.jpg it's exposing my email address.....even though it's just a testing email please redact it
- **2025-05-01** @alanhamlett: Yes, redacted image 3.
- **2025-07-10** @ctrl_cipher: Hello @alanhamlett 
>We only invalidate client-side login sessions when users change their passwords.

Seems that's not the case as I tried changing my password and reproducing the same issues with the same cookies and it was successful. 

## Steps
1.  Login and capture the redirect response as shown below:
```
HTTP/2 302 Found
Server: nginx
Date: Thu, 10 Jul 2025 16:11:30 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 207
Location: /dashboard
Cache-Control: no-cache, no-store
Set-Cookie: █████████
Vary: Cookie
Set-Cookie: █████████
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Xss-Protection: 1; mode=block
Feature-Policy: accelerometer 'none';autoplay 'self';camera 'none';fullscreen 'self';geolocation 'none';gyroscope 'none';magnetometer 'none';microphone 'none';midi 'none';payment 'self';picture-in-picture 'none';sync-xhr 'self';usb 'none';
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; frame-ancestors 'self'; script-src 'self' 'unsafe-eval' https://www.google.com/ https://www.gstatic.com/; img-src 'self' data: https://cdn.loom.com/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/ https://fonts.gstatic.com/; font-src 'self' https://fonts.googleapis.com/ https://fonts.gstatic.com/; media-src 'self' https://*.amazonaws.com; frame-src 'self' https://www.google.com/ https://www.youtube.com/ https://www.loom.com/ player.vimeo.com; object-src 'self'; connect-src 'self' https://www.google.com/ https://avatar-cdn.atlassian.com;

<!doctype html>
<html lang=en>
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to the target URL: <a href="/dashboard">/dashboard</a>. If not, click the link.
```

2. Navigate to the account settings and change your password then logout of your account.
3. Now try login with a wrong password and manipulate the response to the one above (with your initial cookies)
4. Forward all  concurring requests and observe that you are logged in to your account.

This is contrary to your previous comment that:
> "You only invalidate client-side login sessions when users change their passwords"

In light to that I think this report should be re-opened and triaged. Thanks ;p
- **2025-07-10** @ctrl_cipher: don't hesitateto ask for more info if need be...
- **2025-07-10** @alanhamlett: Are you sure you really changed your password? We do in fact invalidate login sessions after the password is changed.
- **2025-07-10** @ctrl_cipher: I can give additional poc if you want with clear evidences...
- **2025-07-10** @ctrl_cipher: {F4553419}

{F4553421}

{F4553422}

{F4553452}

{F4553456}

{F4553460}
- **2025-07-11** @ctrl_cipher: seems this is fixed now....upon retesting the session is being invalidated now after changing the password
- **2025-07-12** @alanhamlett: Nothing changed on our end... it was always being invalidated when changing your password.
- **2025-07-12** @ctrl_cipher: oh okay
