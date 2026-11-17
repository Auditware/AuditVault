---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
date: 2021-08-16
submitted: 2020-10-05T13:36:29.292Z
bounty_usd: null
votes: 157
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "s1r1u5"
source: "https://hackerone.com/reports/998398"
title: "Prototype Pollution leads to XSS on https://blog.swiftype.com/#__proto__[asd]=alert(document.domain)"
---
# Prototype Pollution leads to XSS on https://blog.swiftype.com/#__proto__[asd]=alert(document.domain)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 157 | **Program:** Elastic | **Disclosed:** 2021-08-16

- Report: [https://hackerone.com/reports/998398](https://hackerone.com/reports/998398)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2020-10-05T13:36:29.292Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-10-07** @s1r1u5: wow, thats great @douglas_day 
Thanks,
s1r1us
- **Bounty Awarded**
- **2020-10-18** @s1r1u5: Hi @douglas_day ,

It seems fixed, can I publish it here https://github.com/BlackFan/client-side-prototype-pollution/?

Thanks and regards,
s1r1us
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
