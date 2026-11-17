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
