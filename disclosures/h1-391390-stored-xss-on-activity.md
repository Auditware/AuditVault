---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/account-takeover
  - impact/credential-theft
  - trigger/admin-required
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-08-14
submitted: 2018-08-07T17:31:29.764Z
bounty_usd: 2000
votes: 55
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "shazadsadiq"
source: "https://hackerone.com/reports/391390"
title: "Stored XSS on activity"
---
# Stored XSS on activity

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 55 | **Program:** Shopify | **Disclosed:** 2018-08-14

- Report: [https://hackerone.com/reports/391390](https://hackerone.com/reports/391390)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-08-07T17:31:29.764Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi security team members,

#Description
I found a store xss on the activity which allows an attacker to steal admin account cookies.

#Step to reproduce
1-Create store
2- Add a member in a store
3- Member can choose any name 
4- So change the any member name with hunter"><svg/onload=alert(2)>
5- Now on admain account make changes 
6- That will create activity with attacker malicious payload

#POC
Please see the below image
{F329469}
Let me know if more information is needed to my end.
Best Regards,
Shahzad

## Impact

An attacker(staff member) can takeover admin account.

## Timeline

- **Report Filed**
- **2018-08-07** @shazadsadiq: Just after reporting I got alert which says make sure XSS should be affected by other users. I believe if an admin will allow other members with some limited access than he/she can take over complete account after changing his/her name with the malicious payload.
Let me know if you need more proof.
- **Report Triaged**
- **2018-08-08** @shazadsadiq: Hi Hackerjuan,
Thanks for the update! I would like to add some more observation.
There is no need of admin to make any changes. A member just can exploit it by changing the name of his/her account. Then on admin activity, this will be written as `malioious_payload changed this.`
Where `malioious_payload` is the XSS payload, which will be executed on the admin page. Also when admin will login to his/her account, his first interaction will be with XSS execution.
Thanks
Shahzad
- **2018-08-08** @shazadsadiq: Hi team members,
The customer account has the same form as staff. So if you evaluate the severity of this one, I would ask to see if customer name renders on admin page when customers place an order or do any other activities. I am learning the different feature of Shopify as I never used it before and new on this program.
The original finding POC video, I am attaching with this comment. 
{F329953}
Best Regards,
Shahzad
- **Report Resolved**
- **2018-08-10** @shazadsadiq: Yes, Hackerjuan,
I am not able to execute XSS on admin site. Now the special character is sanitized.
- **Report Title Updated**
- **Bounty Awarded**
- **2018-08-14** @shazadsadiq: Thank you so much !!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
