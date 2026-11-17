---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - stack/php
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2019-05-21
submitted: 2019-05-10T12:35:35.004Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "paulos__"
source: "https://hackerone.com/reports/576504"
title: "Authentication Bypass by abusing Insecure crypto tokens in /lib/OA/Dal/PasswordRecovery.php:"
---
# Authentication Bypass by abusing Insecure crypto tokens in /lib/OA/Dal/PasswordRecovery.php:

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Revive Adserver | **Disclosed:** 2019-05-21

- Report: [https://hackerone.com/reports/576504](https://hackerone.com/reports/576504)
- CWE: Improper Authentication - Generic
- Submitted: 2019-05-10T12:35:35.004Z

## Timeline

- **Report Filed**
- **2019-05-10** @erikgeurts: Dear Paulos_,

Thanks for your detailed and well researched report. We're going to study this carefully and will get back to you with our findings shortly.

On behalf of the Revive Adserver team, Erik Geurts
- **Report Triaged**
- **2019-05-10** @paulos__: Hi @erikgeurts @mbeccati ,

Thank you. I appreciate the quick response, please let me know if I can be of any help. :)
- **2019-05-16** @paulos__: Hello, I was wondering if you have an update or ETA on this
- **2019-05-16** @mbeccati: Hi paulos_, sure. Here's the patch for you to test. We're still discussing a release date, but a potential candidate is currently Tue 21st.
- **2019-05-16** @paulos__: Hi @mbeccati -- It looks great! 

Thanks,
- **Report Resolved**
- **2019-05-20** @paulos__: @mbeccati I wanted to say thanks for the nice feedback and also wanted to add `random_bytes()` is a PHP 7 function and if you have backwards compatibility in your application that might cause problems. :)
- **2019-05-20** @mbeccati: Thank you. 4.2.x is PHP7+ only, so no problem with that.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
