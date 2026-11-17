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
date: 2019-04-25
submitted: 2018-10-11T07:10:09.324Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/aaf|Alliance of American Football ]]"
reporter: "gujjuboy10x00"
source: "https://hackerone.com/reports/422331"
title: "attacker can book unlimited tickets in free at https://aaf.com/checkout/order-received/21237/?key=wc_order_5bbef48fa35b2"
---
# attacker can book unlimited tickets in free at https://aaf.com/checkout/order-received/21237/?key=wc_order_5bbef48fa35b2

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Alliance of American Football  | **Disclosed:** 2019-04-25

- Report: [https://hackerone.com/reports/422331](https://hackerone.com/reports/422331)
- CWE: Business Logic Errors
- Submitted: 2018-10-11T07:10:09.324Z

## Report summary

Hi Team,

After looking into ticket booking at https://aaf.com/checkout/XXXXXX request , i tried to change value of ticket in burp request , but there is proper validation , so it was not possible to buy ticket by changing amount of ticket.
after looking request carefully , i saw that user can buy 3-seats-3 only from UI level , what if i changed from 3-seats-3 to 10-seats-10 ,  and change money amount from 23$ to 0$ and i was able to forward that request , success.
same way attacker can buy unlimited ticker in 0$ 
my suggestion is to think out of box and dig each and every request completely without just  doing normal known test cases.

Team is very cool and reply very quick and fixed this issue by changing complete architecture of this product.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-11-28** @gujjuboy10x00: Dear @aaf ,

i can see this looks , booking of unlimited ticket and can sold out with huge price as attacker (still high or critical can be more than 1500$ -3000$) , can you please check about rewards again?
- **2018-11-28** @ccbrown_aaf: We found this to fall into the "high" severity range, which is documented on our program page as rewarding $500-$1500. We have people looking at all of the orders, so this issue would have been unlikely to actually result in free tickets being delivered. Thus the reward is on the lower end of the "high" severity range.
- **2018-11-28** @gujjuboy10x00: Ok @ccbrown_aaf , 

Thanks for quick info , can i have bonus bounty for this amazing bug?
- **Changed Scope**
- **2019-01-28** @gujjuboy10x00: This is fixed now @ccbrown_aaf
- **Report Resolved**
- **2019-01-31** @gujjuboy10x00: Dear @ccbrown_aaf ,

I wrote little info about this bug in sort , can we disclose it limited , if its in your policy?
Limited disclosure only :)
- **Agreed On Going Public**
- **Report Became Public**
