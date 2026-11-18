---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - vuln/xss
  - impact/account-takeover
  - fix/csp
  - fix/authentication-hardening
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2020-10-27
submitted: 2020-10-16T13:57:35.358Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "enigmaticjohn"
source: "https://hackerone.com/reports/1010132"
title: "Possible DOM XSS on app.hey.com"
---
# Possible DOM XSS on app.hey.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Basecamp | **Disclosed:** 2020-10-27

- Report: [https://hackerone.com/reports/1010132](https://hackerone.com/reports/1010132)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2020-10-16T13:57:35.358Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary:

Hello Team,
While testing it was observed that on https://app.hey.com/, on Search box there is a possibility of XSS. Although the payload is reflected in the DOM but the CSP blocks the execution of the script, the XSS can happen if the CSP is somehow bypassed. The Subject parameter is vulnerable.

Apart from XSS, the HTML injection attack is working pretty straight forward.

#Steps To Reproduce:
1. Go to https://app.hey.com
2. Login to your account.
3. Click on 'Write' Mail button.
4. Add the recipient as yourself.
5. In the Subject, add following payload
```
TestPayload&lt;/a&gt;&lt;a href="javascript:alert(1)"&gt;ClickHere&lt;/a&gt;
```
6. Send the mail.
7. Go to top left corner Search Box and type "**TestPayload**" 
8. You will see the mail you sent to yourself, and <a> tag will be there "ClickHere".
9. Click on it, you will see the CSP violation in the Console.
10. Below is the CSP of the page:

```
script-src 'self' https://production.haystack-assets.com stats.hey.com *.braintreegateway.com *.braintree-api.com hcaptcha.com *.hcaptcha.com; 
object-src 'none'; 
base-uri 'none'; 
form-action 'self'; 
frame-ancestors 'none'; 
report-uri https://sentry.io/api/1371426/security/?sentry_key=3a5ea420eecc45bd9e1d1c2424683f3a&sentry_environment=production&sentry_release=
```
As seen from the CSP, there might be a possibility of Host whitelists bypass.

## Impact

If attacker send such type of mail to a victim and if victim accidentally searches for the same mail then the Script will be executed leading to account takeover. This is possible only if CSP is bypassed.

## Timeline

- **2020-10-16** @enigmaticjohn: Attachments
- **Report Filed**
- **2020-10-19** @rosa: Hi @enigmaticjohn, thanks for sending this report! We'll take a look and let you know. 

Rosa
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-10-19** @enigmaticjohn: Hi team, 
Thanks for the bounty :)
- **2020-10-20** @jorgemanrubia: @enigmaticjohn this should be fixed now. I'd appreciate if you could confirm on your side.

Thanks!
- **2020-10-20** @enigmaticjohn: Hi @jorgemanrubia,
I tested it again, and can verify that the issue is no more observed.
Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
