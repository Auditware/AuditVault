---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2020-06-30
submitted: 2020-05-23T04:57:34.672Z
bounty_usd: null
votes: 78
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "cdl"
source: "https://hackerone.com/reports/881115"
title: "Cross-Site Scripting (XSS) on www.starbucks.com | .co.uk login pages"
---
# Cross-Site Scripting (XSS) on www.starbucks.com | .co.uk login pages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 78 | **Program:** Starbucks | **Disclosed:** 2020-06-30

- Report: [https://hackerone.com/reports/881115](https://hackerone.com/reports/881115)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2020-05-23T04:57:34.672Z

## Report summary

cdl and hunt4p1zza discovered a vulnerability within how ASP.Net handles the URI to perform reflected cross site scripting (XSS).
@cdl and @hunt4p1zza — thank you for reporting this vulnerability and for confirming the resolution.

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2020-05-25** @h1_analyst_decimo: Thank you for your submission @cdl,

This appears to be a valid finding. The information you have provided here will be forwarded onto the team. You will receive updates when, and if, there will be any to share. Please note that the status and severity are subject to change.

Cheers,
@still
- **Report Triaged**
- **2020-05-26** @nitrobr3w: @cdl, Our internal confirmed that the issue is resolved, can you please help verify the fix ?
- **Bounty Awarded**
- **Bounty Awarded**
- **2020-05-26** @cdl: Hi @nitrobr3w,

I can confirm this issue is now fixed. Thank you!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-06-17** @agedsumatra: Hello @cdl - We are reviewing this report for disclosure consideration. 

In one of your screenshots, it shows:
Corben Leo
Your Avatar photo
ineedcoffee username

Would you like us to redact this image? If so, we'll redact this comment appropriately as well.

Additionally, the breakdown between yourself and @hunt4p1zza as a collaborator. Would you like us to address you both in a potential disclosure or refer to you as we already have done throughout this report? 

Thank you.
- **2020-06-17** @cdl: Hi @agedsumatra,

No need to redact anything thus far and you can refer to us both in the potential disclosure.

Thanks
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
