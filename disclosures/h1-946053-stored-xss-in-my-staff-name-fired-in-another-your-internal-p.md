---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-07-29
submitted: 2020-07-28T22:03:33.958Z
bounty_usd: null
votes: 326
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "fatihsvml"
source: "https://hackerone.com/reports/946053"
title: "Stored XSS in my staff name fired in another your internal panel"
---
# Stored XSS in my staff name fired in another your internal panel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 326 | **Program:** Shopify | **Disclosed:** 2020-07-29

- Report: [https://hackerone.com/reports/946053](https://hackerone.com/reports/946053)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-07-28T22:03:33.958Z

## Report summary

Several years ago, @cyber__sec placed a cross-site scripting payload in the name of a staff member on his test shop. This payload recently executed in our internal administration panel, alerting us to a cross-site scripting bug. Because @cyber__sec's payload triggered the bug, we asked him to submit a report.

We awarded the maximum bounty under our Cross-site scripting category because the payload executed in our internal administrator panel, resulting in a high security impact.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi all,

I had lots of tests for bug bounty in my test store "trstore-3.myshopify.com" (created about 4 years ago) and then one of your developers noticed that a stored cross-site scripting payload in my staff name fired in another your internal panel. 

I have attached the email sent to me by your collegue  and I'd like to get a award and I am very happy.

Thanks alot.

## Impact

Stored XSS

## Timeline

- **Report Filed**
- **2020-07-28** @api_omxkrcbisma84ewyjjuq9lnuon: Hi cyber__sec, thanks for your report. Can you confirm what, if any, tools or scanners you used at the time of your testing?
- **2020-07-29** @fatihsvml: Hi,
I did not use any automatized web security scanner tools (accunetix, netsparker etc). I wrote all xss scripts manually. I just used only burp suite for monitoring posting requests.

Thanks,
- **Report Resolved**
- **Report Severity Updated**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2020-07-29** @fatihsvml: Thanks a lot for amazing award.. :))
- **Agreed On Going Public**
- **Report Became Public**
