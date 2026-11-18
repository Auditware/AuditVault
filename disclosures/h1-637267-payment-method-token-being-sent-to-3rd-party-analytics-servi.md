---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - impact/financial
  - impact/sensitive-data
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerability Details:

Payment Tokens can be re-used to link the Credit Card to Another Users Account.

When Linking a Credit Card, a url with Payment_method_token will be generated and then the user will be redirected to the generated url

{F523794}

Then, a Request will be Made to ```orders.upserve.com``` to Finally Link the Credit Card using the payment_method_token


{F523795}


##Reproduction Steps

1.) Create 2 Accounts on https://app.upserve.com/s/upserve-lounge-test-providence-2
 * juandelacruz@gmail.com
 * juandoe@gmail.com

2.) Add a Credit Card
 * 4834422077410033|01|2023|730  - for juandelacruz@gmail.com
 * 4834422073330870|06|2024|582 - juandoe@gmail.com

3.) While Adding the Credit Cards, Make sure to Capture all Request.

4.) Remove the Credit Card linked to the account of juandoe@gmail.com

5.) Using the payment_method_token of juandelacruz@gmail.com we will link his credit card to the account of juandoe@gmail.com

6.) Your Credit Card Will be linked to the account of juandoe@gmail.com.


I am Confused:
* The ```last_four":"3579"``` is confusing me here, it doesnt really validate the last 4 digit it just accepts what ever is on the request, you can change it to any 4 digit numbers.
*  If you Added a MasterCard Credit Card, if the card_type is set to visa, it will show as a Visa Card.


Could you Please Verify on your Endpoint? 

* "payment_method_token":"a0543b88d2ddae5d2bd5f8fe"
* ctulhu@wearehackerone.com

also

Important Details Such as Payment Method Tokens are shared thru 3rd Party Analytics. 

{F523791}

##Proof of Concept:

{F523813}

## Impact

If any attacker can access the 3rd party analytics account, they can get the payment method token of upserve users and use the tokens to link any credit cards to their account and cause a monetary impact to Upserve, a merchant, or a customer  ( creating a payment method they dont own)

* Large Scale Fraud

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
