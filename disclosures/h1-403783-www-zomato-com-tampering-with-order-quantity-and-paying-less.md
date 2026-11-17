---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2018-09-17
submitted: 2018-09-01T09:51:42.131Z
bounty_usd: null
votes: 78
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "akhil-reni"
source: "https://hackerone.com/reports/403783"
title: "[www.zomato.com] Tampering with Order Quantity and paying less amount then actual amount, leads to business loss"
---
# [www.zomato.com] Tampering with Order Quantity and paying less amount then actual amount, leads to business loss

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 78 | **Program:** Eternal | **Disclosed:** 2018-09-17

- Report: [https://hackerone.com/reports/403783](https://hackerone.com/reports/403783)
- CWE: Business Logic Errors
- Submitted: 2018-09-01T09:51:42.131Z

## Timeline

- **Report Filed**
- **2018-09-01** @prateek_0490-zomato: @akhil-reni - Thanks for your submission. Let me check and get back to you.

Cheers.
- **Report Triaged**
- **Report Title Updated**
- **2018-09-01** @akhil-reni: @prateek_0490-zomato haha! Sorry about that, was tired af fuzzing it the whole night.
- **2018-09-01** @akhil-reni: Also, please do check the same on the mobile API(s). I am kinda curious if the rounding issue goes through on the mobile app.
- **2018-09-01** @akhil-reni: Okay, one more attack vector is one can add toppings for free by tampering the quantity to 0.01(the price will go down to as low as 1 paise per topping)
- **2018-09-01** @prateek_0490-zomato: @akhil-reni - Thanks for the additional info. But it's a same root cause :)
- **Report Resolved**
- **2018-09-04** @akhil-reni: Hi @prateek_0490-zomato,

Great Job team. This seems fixed.

Have you also checked at the mobile API's level?
- **2018-09-04** @prateek_0490-zomato: Yup, API endpoint was not vulnerable, that's what my initial testing showed but if you want try and give it a shot. In case it works do file a new report :)
- **Bounty Awarded**
- **2018-09-15** @akhil-reni: Hi Prateek, lets do a limited disclosure?
- **Agreed On Going Public**
- **2018-09-16** @prateek_0490-zomato: @akhil-reni - Please wait do not click the disclosure button, just found few screenshot have your personal details, let me get that removed first.

Thanks.
- **Agreed On Going Public**
- **Report Became Public**
