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
date: 2023-09-11
submitted: 2023-05-18T06:55:26.478Z
bounty_usd: null
votes: 57
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "trustworthy"
source: "https://hackerone.com/reports/1991376"
title: "the domain is truck-admin.eu-east-1.indriverapp.com and Enter the management system of the blasting mobile phone verification code"
---
# the domain is truck-admin.eu-east-1.indriverapp.com and Enter the management system of the blasting mobile phone verification code

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 57 | **Program:** inDrive | **Disclosed:** 2023-09-11

- Report: [https://hackerone.com/reports/1991376](https://hackerone.com/reports/1991376)
- CWE: Business Logic Errors
- Submitted: 2023-05-18T06:55:26.478Z

## Report summary

Subscribe to our telegram channel with updates https://t.me/indrive_bbp

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Find the mobile phone number of the administrator through the WHOIS information, and then send the verification code. Assuming that the verification code expires for 30 seconds or 1 minute, we can only explode the correct verification code in a short time to log in to the management system, so I choose to blast The verification code between 6000 and 7000, and sends the verification code every time it blasts, knows that the correct verification code is found, and I only exploded 8 times to find the correct verification code

## Steps To Reproduce:
  1. Find the management address through the directory scanning:https://truck-admin.eu-east-1.indriverapp.com/admin/auth
  2. Find the administrator's mobile phone number through WHOIS information:████████
  3. Send the verification code through the mobile phone number, you will receive a four -digit verification code
  4. Enter the four-digit verification code to log in and use Burpsuite to grab the package, blast the verification code and set the range of the verification code to 6000-7000, and the thread is set to 20 to ensure that the correct verification code can be blasting within 30 seconds within 30 seconds
██████████

request:
```
POST /proxy/truck/api/admin/login HTTP/2
Host: truck-admin.eu-east-1.indriverapp.com
Cookie: _gcl_au=1.1.354145541.1684380001; _ga=GA1.1.1412822094.1684380001; _ga_YBFM6LW448=GS1.1.1684382089.2.1.1684382341.58.0.0
Content-Length: 37
Sec-Ch-Ua: "Chromium";v="21", " Not;A Brand";v="99"
Accept: application/json, text/plain, */*
Content-Type: application/json
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36
Sec-Ch-Ua-Platform: "Windows"
Origin: https://truck-admin.eu-east-1.indriverapp.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://truck-admin.eu-east-1.indriverapp.com/admin/auth
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

{"phone":"██████","code":"1234"}
 ```
Burp  Settings:
█████████████
  5. Repeat 3,4 steps until the correct verification code is exploded
██████
6. Add the cookie obtained in the fifth step to the request header and access https://truck-admin.eu-east-1.indriverapp.com/admin/order,and then enter the management system
██████████
█████████

## Supporting Material/References:

  * [attachment / reference]

████
████
███

## Impact

Can get detailed information from all drivers and customers of the entire platform, including the driver's model license plate number, and customer taxi order records, taxi records include license plates/taxi position/reaching location, etc.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2023-05-18** @trustworthy: No problem!
- **Bounty Awarded**
- **2023-05-22** @majesttic: Good job, looking forward to more cool reports.
- **2023-05-22** @trustworthy: Thank you for your affirmation!
- **2023-06-12** @majesttic: Hi ██████

inDrive is going to celebrate its 10th anniversary! 
====================================
To celebrate this momentous occasion, we are launching a special promo to recognize your unmatched participation and contribution to our company's cybersecurity.

We are pleased to present you with a promo code: happy_birthday_indrive10, which will be valid from 12:00 AM (GMT+3) on June 13, 2023, until 11:59 PM (GMT+3) on July 13, 2023. This promo code gives you an additional ==$133.7*== payout for each payout vulnerability.

The promotion is only available for payout vulnerabilities, so you'll need to follow these steps and meet the following requirements to take advantage of the promo code:
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. Report the vulnerability **during the promotion period** through the HackerOne platform as usual.
2. Leave the following text in the description or in the comment in the report: `Promo code: happy_birthday_indrive10`.
3. As usual your report is verified by our team, is confirmed as a valid one, and is entitled to payout in accordance with our Bounty Program. 
4. Get the payout for the report.
5. Be awarded an additional promo payout.

**Important rules to  be mentioned:**
--------------------------------------
1. If you have submitted the report before the start of the promotion period, no additional payout can proceed. Retrieving the report and submitting it again will cause no effect as it will be recognized as a duplicate one.
2. If you submit the report during the promotion period without leaving a Promo code in the report/comment, you may still leave a comment before the payout. We’ll do our best to take it into account and increase the payment if the payout has not yet been proceeded.
3. inDrive reserves its right not to award with the additional payout in case the promo misuse is identified, e.g., leaving a comment into reports submitted before the start of the promotion period. 

We hope this promo code bonus allows you to feel our sincere gratitude for your work and support.

If you have any questions or need more information about the promotion, feel free to contact us.

***\* - The total amount of payment by promo code will be $134 since HackerOne has a restriction in the form of rounding the amount to a whole number***

Best wishes,

InDrive Security Team.
██████
- **Report Resolved**
- **2023-07-06** @trustworthy: Yes, the vulnerability has been repaired
- **Agreed On Going Public**
- **2023-08-31** @trustworthy: Sorry, I have some objections!
- **2023-09-11** @majesttic: Hey @trustworthy. 
Clarify what objections?
- **2023-09-11** @trustworthy: ███
- **2023-09-11** @majesttic: Is everything okay now?
- **2023-09-11** @trustworthy: yes,you can!
- **Manually Disclosed**
