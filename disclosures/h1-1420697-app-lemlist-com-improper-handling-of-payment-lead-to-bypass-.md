---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - impact/sensitive-data
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2022-05-17
submitted: 2021-12-09T00:18:16.843Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/lemlist|lemlist]]"
reporter: "omarelfarsaoui"
source: "https://hackerone.com/reports/1420697"
title: "[app.lemlist.com] Improper handling of payment lead to bypass payment"
---
# [app.lemlist.com] Improper handling of payment lead to bypass payment

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** lemlist | **Disclosed:** 2022-05-17

- Report: [https://hackerone.com/reports/1420697](https://hackerone.com/reports/1420697)
- CWE: Business Logic Errors
- Submitted: 2021-12-09T00:18:16.843Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello Team,
I truly hope it treats you awesomely on your side of the screen :)

due to improper handling of payment methods, an attacker can easily bypass the payment and benefit from a paid plan.

## Steps To Reproduce:

1. Log to your account
1. Go to the billing page
1. Fill in the address tab
1. Go to the next tab `Payment Card` 
1. ==Now the interesting step Make sure you don't have any money on your credit card==
1.  Chose `Email outreach` and wait until you get a notification that the payment is failed
1.  Next  increase the number of seats for example 50 
1. Again you will get a notification that the payment is failed
1. Now Cancel the subscription
1. Now I can use the paid features without paying anything.

# POC
{{F1538593}}

## Impact

I think the impact is pretty obvious, an attacker can use paid plans without paying anything.

if you need more info feel free to ping me 

best Regards
@omarelfarsaoui

## Timeline

- **Report Filed**
- **2021-12-13** @omarelfarsaoui: Hi team
any update here !
- **Report Triaged**
- **Report Resolved**
- **2021-12-19** @omarelfarsaoui: Hello, 

Can you please stop sending me this email, or ignore my email in the dashboard. And keep my account active 
{F1551737}
- **2021-12-20** @alban75: Hello,

Sorry, it's not easy to change a paying profile back to free trial
Free trial only last for 14 days anyway, so you would have only 4 days left
Stripe only trigger 4 mail about payment, so you should not receive more mail
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
