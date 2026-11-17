---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-02-14
submitted: 2020-11-20T17:01:25.283Z
bounty_usd: null
votes: 52
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "hundredpercent"
source: "https://hackerone.com/reports/1039750"
title: "Stored XSS in Intense Debate comment system"
---
# Stored XSS in Intense Debate comment system

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 52 | **Program:** Automattic | **Disclosed:** 2021-02-14

- Report: [https://hackerone.com/reports/1039750](https://hackerone.com/reports/1039750)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-11-20T17:01:25.283Z

## Timeline

- **Report Filed**
- **2020-11-20** @hundredpercent: Hey Team ,
The xss also can be used for attacking admins at : **www.intensedebate.com/commenthistory/{{-blog-id--}}/{{--comment-id--}}**

{F1087903}

and this is a high impact issue cause it can be used to extract data from the administrator panel beside attacking the blog
- **2020-11-20** @hundredpercent: The users can post images even when it's not enabled , so you can avoid the 1st and the 2nd steps of reproduce ,

Best,
- **2020-11-23** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-11-26** @hundredpercent: Thank you @xknown ,
- **2020-12-16** @jgcaruso: Hi @sodium_ , we've deployed a fix for this. Please try it again.
- **2020-12-16** @hundredpercent: Hi @jgcaruso ,

The fix is working well , when adding other attributes to the img tag will be removed and it will save the src attribute only

Thanks
- **Report Resolved**
- **Bounty Awarded**
- **2021-01-11** @hundredpercent: Thank you @xknown and everyone envolved,

Wish that was helpfull
- **Agreed On Going Public**
- **2021-01-19** @hundredpercent: @xknown is there any update regarding the disclosure,

And thanks
- **2021-01-26** @hundredpercent: @xknown is there any update regarding the disclosure,
- **Report Became Public**
