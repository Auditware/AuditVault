---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-09-15
submitted: 2020-06-28T13:09:26.941Z
bounty_usd: null
votes: 559
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "say_ch33se"
source: "https://hackerone.com/reports/910300"
title: "Email Confirmation Bypass in your-store.myshopify.com which leads to privilege escalation"
---
# Email Confirmation Bypass in your-store.myshopify.com which leads to privilege escalation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 559 | **Program:** Shopify | **Disclosed:** 2020-09-15

- Report: [https://hackerone.com/reports/910300](https://hackerone.com/reports/910300)
- CWE: Privilege Escalation
- Submitted: 2020-06-28T13:09:26.941Z

## Report summary

On June 28th, @say_ch33se reported that it was possible to bypass Shopify's email verification for legacy accounts. Doing so would have allowed a user to access accounts they did not own. 

Our team immediately deployed a change to address this issue. Additionally, we have removed the ability to verify email addresses for legacy accounts. A code to confirm email ownership at the time of merging from a legacy account is now required.

## Timeline

- **Report Filed**
- **2020-06-29** @jenn-shopify: Hi @say_ch33se,
Thank you for your report! We have validated this and shipped a mitigation. You should no longer be able to reproduce this issue. Our team is out of office today, but we will get back to you tomorrow with an update.
- **2020-06-29** @say_ch33se: Wow, you're fast. I did re-check and it definitely doesn't work anymore
- **Report Triaged**
- **Bounty Awarded**
- **2020-06-30** @say_ch33se: Hey Shopify, thank you for the bounty! I'm amazed with your fast response and professionalism! I will definitely keep searching for more bugs
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
