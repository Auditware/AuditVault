---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2021-01-01
submitted: 2020-11-28T12:47:00.517Z
bounty_usd: null
votes: 137
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "fuzzme"
source: "https://hackerone.com/reports/1046084"
title: "SQL Injection Union Based"
---
# SQL Injection Union Based

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 137 | **Program:** Automattic | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/1046084](https://hackerone.com/reports/1046084)
- CWE: N/A
- Submitted: 2020-11-28T12:47:00.517Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Hello, 

I have found a SQL Injection Union Based on `https://intensedebate.com/commenthistory/$YourSiteId `
The `$YourSiteId` into the url is vulnerable to SQL Injection.

## Steps to reproduce

1.  Logging into `https://intensedebate.com`

2. After create your own site on `https://intensedebate.com/install` and follow all steps

3. Now you need to know your site id, to get then you need go to `https://intensedebate.com/user-dashboard` and you can see on the right side of the page your site list, choice your site and click to the link `Overview`.
You will be redirected to `https://intensedebate.com/dash/$YourSiteId`.

4. Now you have your site id,  go to the vulnerable URL with your site id `https://intensedebate.com/commenthistory/$YourSiteId`.
 
5. Now Trigger the SQL Injection with this following link `https://intensedebate.com/commenthistory/$YourSiteId%20union%20select%201,2,@@VERSION%23` (!) You need to do this with your own site id (!)

6. Now you can see `10.1.32-MariaDB` on the page.

## POC 

@@VERSION

{F1096977}

current_user()

{F1096976}

Video POC

## IMPORTANT
Can you see my comment into [#1044698](https://hackerone.com/reports/1044698) ??
 And I no longer want to put all SQL Injection issues on into my initial report [#1042746](https://hackerone.com/reports/1042746), because i don't win any reputations 

Thank you,

Fuzzme.

## Impact

Full database access holding private user information and Reflected Cross-Site-Scripting

## Timeline

- **Report Filed**
- **2020-11-30** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-12-03** @fuzzme: Hello @xknown,  thank you again for your quick reply.
I have tested the endpoint and the vulnerability it's patched.
About my other ticket I'd be very grateful if you could reopen it :)

Thanks,

Fuzzme.
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-04** @fuzzme: Hi @xknown, thank you for the bounty.
- **Agreed On Going Public**
- **2020-12-21** @fuzzme: @xknown, @Automattic update ?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
