---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2019-07-06
submitted: 2018-06-11T22:02:17.892Z
bounty_usd: null
votes: 167
cve: []
program: "[[programs/upserve|Upserve ]]"
reporter: "fuzz"
source: "https://hackerone.com/reports/364843"
title: "OLO Total price manipulation using negative quantities"
---
# OLO Total price manipulation using negative quantities

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 167 | **Program:** Upserve  | **Disclosed:** 2019-07-06

- Report: [https://hackerone.com/reports/364843](https://hackerone.com/reports/364843)
- CWE: Business Logic Errors
- Submitted: 2018-06-11T22:02:17.892Z

## Report summary

The total amount of an order could be modified by including an item with a negative quantity.

## Timeline

- **2018-06-11** @fuzz: Added an attachment containing the PoC code in Python.
- **Report Filed**
- **2018-06-12** @upserve-bryan: Hey @fuzz I saw the order come in on this, so this certainly appears valid, but I'll double check the PoC just to make sure we can repro it. Also, I don't know if you kept good records, but I saw you submit another order `upserve-hacker-cafe-27072` where the item price came in a $0.01 but the payment was $13.20. If you know how to repro that, that could be a second bug.
- **Report Triaged**
- **2018-06-12** @upserve-bryan: PoC validated @fuzz. There is also a second bug exposed by your PoC where the system will accept an order without the delivery fee element as long as it is factored into the total. This results in an out of balance check. That's a much lower impact bug, but we'll factor it into the reward here.
- **2018-06-12** @fuzz: Hi @upserve-bryan, the item price of $0.01 is due to manipulating the price key in the items array. I can also also set other values such as taxes to 0. The total has to be calculated correctly though, including fees and taxes otherwise the API returns an error.

I just submitted `upserve-hacker-cafe-999999` which should demonstrate this again.

I can see the response JSON from the consumer_info endpoint that your database is storing the modified price, but I'm not sure what kind of impact that would have on your systems (possibly your analytics platforms, if those values are taken into consideration).

The script that sends the modified item price, as well as a screenshot of the order history object are attached.

Cheers,
Matt
- **2018-06-12** @upserve-bryan: Thanks @fuzz. The order comes in out of balance, so the restaurant has to resolve that before they can close the check. There definitely could be some impact there depending on how the restaurant decides to proceed. It all traces back to the same root cause which is how we're validating the order total. Good find.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
