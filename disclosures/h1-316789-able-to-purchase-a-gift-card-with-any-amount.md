---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2018-07-20
submitted: 2018-02-16T13:52:09.837Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "qwacsawd"
source: "https://hackerone.com/reports/316789"
title: "Able to purchase a gift card with any amount"
---
# Able to purchase a gift card with any amount

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Starbucks | **Disclosed:** 2018-07-20

- Report: [https://hackerone.com/reports/316789](https://hackerone.com/reports/316789)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2018-02-16T13:52:09.837Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description**
There is a vulnerability in card.starbucks.com.sg that allows an attacker to modify the purchasing value of a starbucks gift card such that he is paying the minimum amount for the maximum value of the gift card.

**Attack Summary**
An attacker is able to pay $0.01 for a $100 gift card and gift the card to himself thus allowing him to use the card.

**Steps to Reproduce**
1)Visit https://card.starbucks.com.sg/egift/cards.php?cat=Singapore%20Exclusive
2)Fill in the relevant values, set the emails to your starbucks account email and the input value to $300 at the start
3)Use a web proxy to monitor the web traffic and click on the check out button.
4)Change the original values of the request from 
txtAmount=300&amount=300&txtCustomAmount=300 to txtAmount=0.1&amount=0.1&txtCustomAmount=0.1 and submit the request
5)An encoded string of the value 0.1 will be displayed in the following request as vpc_Amount=XcfYhTj%2BHFIY5c9n8sSCzqDFAxXGgXXoZgF0VVUBvjM%3D, where =XcfYhTj%2BHFIY5c9n8sSCzqDFAxXGgXXoZgF0VVUBvjM%3D is the value 0.1
5)Copy that string and drop the entire request
7)Repeat step 1 to 4, this time change ONLY the value in the variable "amount" so the request would look like this:
txtAmount=300&amount=300&txtCustomAmount=300 to txtAmount=300&amount=0.1&txtCustomAmount=300
8)Proceed to click on the check out button and you will be brought from https://card.starbucks.com.sg/egift/checkout.php to https://card.starbucks.com.sg/egift/payment.php where the vpc_Amount is showed in the request. Change the original vpc_Amount value to the copied string XcfYhTj%2BHFIY5c9n8sSCzqDFAxXGgXXoZgF0VVUBvjM%3D
9)Proceed on to submit the request and you will be brought over to the payment page by either visa/mastercard
10)Continue payment as per usual and you will be paying $0.1 for a $300 starbucks card.
11)Since the recipient email is the attacker's email he checks his email to redeem the card and adds it into his starbucks account.
12)The attacker now has a $300 starbucks gift card that he only paid $0.1 for.

## Impact

By abusing this function, an attacker could gain unlimited values for his starbucks card.

## Timeline

- **2018-02-16** @qwacsawd: I have attached a POC video just in case my instruction are unclear, hope it is useful!
- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-02-18** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-02-23** @qwacsawd: Hi,
I have verified that the card purchase is a fully functional gift card through the Starbucks SIngapore app. No other illicit actions have been done to the account or the card.
- **Report Triaged**
- **Report Severity Updated**
- **2018-03-01** @qwacsawd: Thank you for your reply, but would this happen to fall under "Some unique issue types not related to the domains listed below, such as reports of subdomain takeovers, may also be eligible for reward.", base on the impact of the attack?
- **2018-06-28** @qwacsawd: Hi hackerone,

The issue appears to be fixed, is there an update on this?

Thank you
- **Report Resolved**
- **Not Eligible For Bounty**
- **2018-07-10** @qwacsawd: Thank you so much!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
- **2018-12-22** @qwacsawd: Should I be eligible for bounty now that this is in scope?
