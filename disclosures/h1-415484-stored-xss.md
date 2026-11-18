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
body: true
date: 2018-11-07
submitted: 2018-09-27T22:44:43.839Z
bounty_usd: 1000
votes: 52
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "dr_dragon"
source: "https://hackerone.com/reports/415484"
title: "Stored xss"
---
# Stored xss

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 52 | **Program:** Shopify | **Disclosed:** 2018-11-07

- Report: [https://hackerone.com/reports/415484](https://hackerone.com/reports/415484)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-09-27T22:44:43.839Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description :
WAF cut html tages but when put <!--> before tages we can bypass it :) .

#Step to reproduce :
1-Open your store account
2-Navigate to https://xxx.myshopify.com/admin/settings/general
3-Put your street address xss payload (xss"><!--><svg/onload=alert(document.domain)>)
4-Go to https://xxx.myshopify.com/admin/dashboards/live
5-XSS alert message

## Impact

XSS attack

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **2018-09-28** @dr_dragon: It's fixed now 
nice work
- **2018-10-04** @dr_dragon: Any update ?
- **2018-10-08** @dr_dragon: @jack_mccracken @shopify 
Any updates ?
Regards
- **2018-10-11** @dr_dragon: @clayton @francoischagnon @shopify-peteryaworski
- **2018-10-14** @dr_dragon: it’s fixed since 16 days ago and i don not known why you take all this time to reward my report !!!?
- **Bounty Awarded**
- **2018-10-15** @dr_dragon: Thanks for the bounty .
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
