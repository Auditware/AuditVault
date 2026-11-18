---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/account-takeover
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-05-25
submitted: 2018-09-20T09:00:49.170Z
bounty_usd: null
votes: 244
cve: []
program: "[[programs/aaf|Alliance of American Football ]]"
reporter: "gujjuboy10x00"
source: "https://hackerone.com/reports/411690"
title: "Stored xss in address field in billing activity at https://shop.aaf.com/Order/step1/index.cfm"
---
# Stored xss in address field in billing activity at https://shop.aaf.com/Order/step1/index.cfm

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 244 | **Program:** Alliance of American Football  | **Disclosed:** 2019-05-25

- Report: [https://hackerone.com/reports/411690](https://hackerone.com/reports/411690)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-09-20T09:00:49.170Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear Team,

**Summary:** [add summary of the vulnerability]
After looking into https://shop.aaf.com/Order/step1/index.cfm i get to know that there is address field is vulnerable to stored xss which can lead to steal any user's cookie and can lead to complete account takeover

**Description:** [add more details about this vulnerability]

## Steps To Reproduce:

  1. go to https://shop.aaf.com and click on any products , tshirt
  2. add that in cart and click on proceed
  3. enter xss payload (a"><svg/onload=prompt(1)> ) in every address field and click on OK proceed
  4. xss will popup 

## Supporting Material/References:

XSS OWASP

Thanks,
Vishal

## Impact

Stored xss in address field in billing activity at https://shop.aaf.com/Order/step1/index.cfm

## Timeline

- **Report Filed**
- **Changed Scope**
- **2018-09-24** @dukefleed: Hi @gujjuboy10x00 ,

Thank you for your submission for `shop.aaf.com`. The AAF team has retired this subdomain and it is no longer accessible. As such, we will be triaging this vulnerability to the best of our ability based on the provided POC in this report. We value your participation and will be awarding bounties based on the provided content and perceived impact to AAF in good faith. We look forward to receiving your submissions on our alternate assets.

Kind regards,
@dukefleed
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
