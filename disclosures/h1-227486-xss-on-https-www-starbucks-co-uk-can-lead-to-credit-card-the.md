---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2018-05-22
submitted: 2017-05-10T13:28:32.386Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/227486"
title: "XSS on https://www.starbucks.co.uk (can lead to credit card theft) (/shop/paymentmethod)"
---
# XSS on https://www.starbucks.co.uk (can lead to credit card theft) (/shop/paymentmethod)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Starbucks | **Disclosed:** 2018-05-22

- Report: [https://hackerone.com/reports/227486](https://hackerone.com/reports/227486)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-05-10T13:28:32.386Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2017-05-10** @sharpie: Thanks for sending this in! We are currently reviewing this submission and we'll notify you once we have more information to share with you.
- **Report Triaged**
- **2017-06-02** @bayotop: Hi,

Any updates? In the recently disclosed issue https://hackerone.com/reports/177472 you state that you typically try to award bounties at triage, or shortly after. Is this entry different or is the decision delayed for another reason? Thanks.
- **Report Resolved**
- **Bounty Awarded**
- **2017-06-06** @bayotop: Hi @siren, 

I am not able to reproduce anymore as the WAF will redirect requests containing ```%u0022``` (404). I am also happy to see that the "Add to Basket" option is now protected against CSRF.

However, I am not quite able to verify whether the ```"``` character is correctly encoded in the initial injection point. If not, future bypasses might be discovered making this exploitable again.

The bounty is much appreciated. Thanks.
- **2017-06-06** @siren: Thanks for confirming @bayotop!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
