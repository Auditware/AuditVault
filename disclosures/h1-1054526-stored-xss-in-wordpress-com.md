---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-02-17
submitted: 2020-12-09T02:09:07.615Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ucuping"
source: "https://hackerone.com/reports/1054526"
title: "Stored XSS in wordpress.com"
---
# Stored XSS in wordpress.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** Automattic | **Disclosed:** 2021-02-17

- Report: [https://hackerone.com/reports/1054526](https://hackerone.com/reports/1054526)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-12-09T02:09:07.615Z

## Timeline

- **2020-12-09** @ucuping: In addition, the attacker must first register his account with crowdsignal, then connect wordpress to crowdsignal by entering feedback then entering the polling settings section, and entering the attacker's account to connect wordpress with crowdsignal and also checking the Allow the other users of your section. blog to use your Crowdsignal account. Only Authors, Editor or Admin users can access this data. Then click Link Account, then Activate Multi User Access, once activated, the victim will be able to see the Custom Style made by the attacker that has been entered in the script.
- **Report Filed**
- **2020-12-09** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-12-09** @ucuping: Thanks for the acknowledgement.
- **2020-12-10** @ucuping: Hi,
Is there update?
- **2020-12-13** @ucuping: Any update?
- **2020-12-15** @ucuping: @xknown
- **Bounty Awarded**
- **2020-12-16** @ucuping: Thank you for the bounty
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
