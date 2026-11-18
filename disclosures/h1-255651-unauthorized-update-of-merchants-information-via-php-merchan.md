---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/php
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2017-09-19
submitted: 2017-08-02T00:18:29.320Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "adibou"
source: "https://hackerone.com/reports/255651"
title: "Unauthorized update of merchants' information via /php/merchant_details.php"
---
# Unauthorized update of merchants' information via /php/merchant_details.php

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Eternal | **Disclosed:** 2017-09-19

- Report: [https://hackerone.com/reports/255651](https://hackerone.com/reports/255651)
- CWE: Improper Access Control - Generic
- Submitted: 2017-08-02T00:18:29.320Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello!

I discovered an interesting file : 
`https://www.zomato.com/php/merchant_details.php`

If I add in post content :
`action=update-merchant&merchant_id=95292&type=1&email=update@hotmail.fr&contact=update@hotmail.fr&name=update`

With the report #255648, I was able to create a merchant, I should use this merchant to provide a screenshot like in a real situation.


I'm also able to change :
`address, pincode, city, email, phone tan_number, bank account name, company_id, payu_id, contact, restaurants` and more...


An attacker would change the mail to receive confidential mails it may can be leading to an merchant takeover if you use the mail to bound it with the account of the user. I couldn't try this scenario due to your rules about users data.

Do you have a test merchant_id i can play with to test that before you resolve the report?

Screenshot : updatehttp.png

If you have any questions...
nbsp

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
