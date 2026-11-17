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
date: 2021-09-03
submitted: 2019-07-07T20:06:38.956Z
bounty_usd: null
votes: 51
cve: []
program: "[[programs/upserve|Upserve ]]"
reporter: "ctulhu"
source: "https://hackerone.com/reports/637267"
title: "Payment method token being sent to 3rd party analytics service"
---
# Payment method token being sent to 3rd party analytics service

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 51 | **Program:** Upserve  | **Disclosed:** 2021-09-03

- Report: [https://hackerone.com/reports/637267](https://hackerone.com/reports/637267)
- CWE: Business Logic Errors
- Submitted: 2019-07-07T20:06:38.956Z

## Report summary

A payment method token represents an individual payment card (credit or debit) and is unique to each merchant (i.e. one credit card will have a different token at Merchant A and Merchant B). These tokens may only be used with the merchant that generated them. 

When using Online Ordering, payment method tokens were inadvertently being sent to a 3rd party analytics service. The 3rd party service was not storing the tokens. The exposure is quite limited because to make use of the token an attacker would have had to be positioned within the 3rd party service.

Our configuration has been updated to no longer send these tokens to the service.

## Timeline

- **Report Filed**
- **2019-07-07** @ctulhu: The Generated Payment Method Token, should be only set for One Time Use Only.
- **Changed Scope**
- **Report Severity Updated**
- **Report Triaged**
- **Changed Scope**
- **2019-07-08** @ctulhu: hey @upserve-bryan is it possible to change the title too?
- **Report Title Updated**
- **2019-07-10** @ctulhu: Thanks, any updates on when will this be fixed?
- **2019-07-10** @upserve-bryan: @ctulhu release just went out moments ago if you want to validate it
- **2019-07-10** @ctulhu: great! will check now
- **2019-07-10** @ctulhu: i verify that the Payment Tokens arent being sent anymore to the 3rd party analytics.

Thank you so much for the Fast Response and Fix.
- **2019-07-11** @ctulhu: once bounty is issued, can we limited disclose this? thanks!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
