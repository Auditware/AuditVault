---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-02-12
submitted: 2020-02-08T18:40:32.664Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/endless_group|Endless Group]]"
reporter: "codermak"
source: "https://hackerone.com/reports/791293"
title: "Modify Host Header which is sent to email"
---
# Modify Host Header which is sent to email

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Endless Group | **Disclosed:** 2020-02-12

- Report: [https://hackerone.com/reports/791293](https://hackerone.com/reports/791293)
- CWE: Code Injection
- Submitted: 2020-02-08T18:40:32.664Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Modify host header and include the fake website in password reset email.  Password reset mail is taking source domain from request header host, which can be modified using burp suite and the modified link is sent to the victims email

## Steps To Reproduce:

  1. Go to  https://da.theendlessweb.com:2222/
  2. Start burp suite
  3. Enter username and click on Send me a Link
  4. Intercep the request and modify the URL to some other custom url
  5. Forward the modified request
  6. Password reset email will be sent.
  7. Check your email and you will see the new url (which was configured in step 4) in the email.

## Supporting Material/References:

  * Snapshots in attachment

## Impact

With this, attacker can make any victim to visit their custom website and can affect the victim in many ways

## Timeline

- **Report Filed**
- **Report Resolved**
- **2020-02-09** @codermak: Great. Thanks.

I have verified this and its not reproducible now
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
