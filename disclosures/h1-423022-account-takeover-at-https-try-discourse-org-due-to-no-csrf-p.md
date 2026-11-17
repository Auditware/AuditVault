---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2018-12-06
submitted: 2018-10-12T16:57:57.640Z
bounty_usd: null
votes: 89
cve: []
program: "[[programs/discourse|Discourse]]"
reporter: "avinash_"
source: "https://hackerone.com/reports/423022"
title: "Account takeover at https://try.discourse.org due to no CSRF protection in connecting Yahoo account"
---
# Account takeover at https://try.discourse.org due to no CSRF protection in connecting Yahoo account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 89 | **Program:** Discourse | **Disclosed:** 2018-12-06

- Report: [https://hackerone.com/reports/423022](https://hackerone.com/reports/423022)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2018-10-12T16:57:57.640Z

## Timeline

- **Report Filed**
- **2018-10-27** @avinash_: Anybody to response?
- **2018-10-31** @ktistai: Hi @avinash_ , 

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Kind regards,
@ktistai
- **Report Triaged**
- **2018-11-03** @avinash_: Hi @ktistai 

It seems fixed, On connecting yahoo account it is releasing csrf token(as state=token123). During reproducing the attack it behaving an error message as ```Sorry, there was an error authorizing your account. Perhaps you did not approve authorization?```.

Can you please check this from your end !

Best Regards
- **Report Resolved**
- **Bounty Awarded**
- **2018-11-06** @avinash_: Hi @discourse_team 

Thanks for bounty :)

Best Regards
- **Agreed On Going Public**
- **Report Became Public**
