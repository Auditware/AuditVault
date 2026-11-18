---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
  - trigger/social-engineering
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-06-30
submitted: 2020-06-23T16:04:24.378Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/trycourier|Courier]]"
reporter: "vaalici"
source: "https://hackerone.com/reports/906226"
title: "disable test send feature if user's email address isn't verified"
---
# disable test send feature if user's email address isn't verified

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Courier | **Disclosed:** 2020-06-30

- Report: [https://hackerone.com/reports/906226](https://hackerone.com/reports/906226)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-06-23T16:04:24.378Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
There is no mechanism to limit the request in places while send the preview email

## Steps To Reproduce:
There is a weak account registration process, which allow user to register and login without any email confirmation.
L'say say for example that i'm the user A that want to send a phishing email or perform DOS against a targeted user

  1. Registration process by using the victim email address
  2. Craft the email example 
  3. Proced with the sent to me functionality to try the email send
  4. Intercept the request with a Proxy (Burp)
  5. Resend the request any times you want 

## Supporting Material/References:

CWE-400: Uncontrolled Resource Consumption
https://cwe.mitre.org/data/definitions/400.html

Below i have attached the evidence for the POC

## Impact

The most common result of resource exhaustion is denial of service.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Report Reopened**
- **2020-06-23** @vaalici: HI,
sorry but i desagree with you. I can spam thousands and more email to a target flooding his mail box.
Moreover if i do simple multi thread script i can easly put the server in starvation, consuming all the resources.
The POC of the DOS is not possible due to the target limitation but the lack of a captcha on the request or a rate limit in place are clear sign of the problem.

Here you can find the same problem "https://hackerone.com/reports/17321" where it has been detected has vulnerability by hackerone team. The scenario is the same.
If you want you can give me an email and i can show you that i can flood your mail box trough the target API.

Let me know if you need more details please

@vaalici
- **2020-06-23** @vaalici: You can see also this one:
https://hackerone.com/reports/145458

@vaalici
- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
