---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-10-17
submitted: 2021-08-21T06:46:42.331Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "mr_sparrow"
source: "https://hackerone.com/reports/1314172"
title: "Otp  bypass in verifying nin"
---
# Otp  bypass in verifying nin

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** MTN Group | **Disclosed:** 2022-10-17

- Report: [https://hackerone.com/reports/1314172](https://hackerone.com/reports/1314172)
- CWE: Improper Authentication - Generic
- Submitted: 2021-08-21T06:46:42.331Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

while conducting my research in your website I found that while verifying NIN number it send the otp to the enterd mobile number that can be bypassed.

## Steps To Reproduce:

1) Go to https://nin.mtnonline.com/nin/
2) click submit nin.Now it will redirect to another page https://nin.mtnonline.com/nin/
3) It asks for mobile number and National Identity Number [NIN].
4) Enter the mobile and NIN number and click Next.It will send the otp to the mobile number.
5) Enter any 6 digit code and click verify and capture the request in bupsuite and click action and select "Do intercept and response to the request"
6) Now change the response status to success.
------>Now successfully verified mobile number.

## Impact

The attacker can able to verify NIN with any number.


Note: I had attached the poc video below please take a look.


Regards,
@aaruthra.

## Timeline

- **Report Filed**
- **2021-08-21** @mr_sparrow: poc video
- **Report Triaged**
- **2021-09-19** @mr_sparrow: @kendad0122 Thanks for the response.
- **2021-09-20** @kdrmtn: Good day business is asking for info to remediate this:
Kindly assist with the details of the caller to this incident, as more details are required to aid analysis. i.e mobile number used for the test.
- **2021-09-20** @mr_sparrow: Hi @kendad0122 

The mobile number used for test is 08545484555.This number is obtained from temporary mobile number site.

Thanks
- **2021-09-21** @kdrmtn: Thank you
- **2022-02-05** @mr_sparrow: @kendad0122 any update?
- **Report Resolved**
- **Agreed On Going Public**
- **2022-09-17** @mr_sparrow: can you mention my name in hall of fame?
- **Report Became Public**
