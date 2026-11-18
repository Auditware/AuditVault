---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/node
  - vuln/sql-injection
  - impact/sensitive-data
  - trigger/social-engineering
  - fix/input-validation
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2018-09-10
submitted: 2018-08-20T20:07:16.367Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "becojo"
source: "https://hackerone.com/reports/397445"
title: "[express-cart] Customer and admin email enumeration through MongoDB injection"
---
# [express-cart] Customer and admin email enumeration through MongoDB injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-10

- Report: [https://hackerone.com/reports/397445](https://hackerone.com/reports/397445)
- CWE: SQL Injection
- Submitted: 2018-08-20T20:07:16.367Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report an injection in express-cart
It allows to enumerate the email address of the customers and the administrators.

# Module

**module name:** express-cart
**version:** 1.1.7
**npm page:** `https://www.npmjs.com/package/express-cart`

## Module Description

expressCart is a fully functional shopping cart built in Node.js (Express, MongoDB) with Stripe, PayPal and Authorize.net payments.

## Module Stats

31 downloads in the last week

# Vulnerability

## Vulnerability Description

The vulnerability is caused by the lack of user input sanitization in the login handlers. In both cases, the customer login and the admin login, parameters from the JSON body are sent directly into the MongoDB query which allows to insert operators. These operators can be used to extract the value of the field blindly in the same manner of a blind SQL injection. In this case, the `$regex` operator is used to guess each character of the token from the start. 

## Steps To Reproduce:

Use MongoDB `$regex` operator to test if each characters of the emails in the database.

The provided Python script exploits the customer login to find all the customer emails in the database. Some recursion is used to make sure all of the fields

The attached screenshot is the customer list currently in my database. The output of the script is the following:

```
$ python exploit.py 
alan.k@example.com
alice.r@hotmail.com
ben76543@gmail.com
bob@test.com
```

## Patch

Ensure the parameters are indeed strings before doing a MongoDB request. There are multiple ways this could be achieved. Using `toString` on the parameters is good enough. 
 
```
db.customers.findOne({email: req.body.loginEmail}, (err, customer) => { // eslint-disable-line
```
becomes
```
db.customers.findOne({email: req.body.loginEmail.toString()}, (err, customer) => { // eslint-disable-line
```

While a user can still trigger an exception by replacing `toString` with something else than a function, it effectively mitigates the vulnerability.

## Supporting Material/References:

- OS: Ubuntu 16.04.3 LTS
- Node.js version: 8.11.1 
- For the script: Python 2.7.12 and the requests package

# Wrap up
- I contacted the maintainer to let them know: No
- I opened an issue in the related repository: No

## Impact

Administrator emails could be used for phishing attemps and spam. Customers emails could be used by an adversary to deliver spam, steal customers and more. In this GDPR era, leaking customer emails is not very desirable.

## Timeline

- **Report Filed**
- **2018-08-20** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2018-08-22** @dagonza: Thanks for reporting it! I will have a look and come back to you.
- **2018-08-30** @dagonza: @mrvautin I have invited you to this report as it is quite related to your work on #343726. I can confirm the vulnerability (after few tries as I am not too familiar with Mongo). Thanks
- **External User Joined**
- **2018-08-31** @mrvautin: Thanks for reporting. This vuln has been fixed in the latest version.
- **2018-08-31** @mrvautin: https://github.com/mrvautin/expressCart/commit/b2234ef4f28225bb42f74bf6cf33759048aba518
- **2018-08-31** @becojo: The fix works 👍
- **2018-09-10** @dagonza: I can confirm it. Thanks everyone for the quick response on this one. I will close the report.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
