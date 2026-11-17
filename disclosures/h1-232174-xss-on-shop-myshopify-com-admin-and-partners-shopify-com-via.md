---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2017-06-27
submitted: 2017-05-26T09:12:00.386Z
bounty_usd: 5000
votes: 88
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "bored-engineer"
source: "https://hackerone.com/reports/232174"
title: "XSS on $shop$.myshopify.com/admin/ and partners.shopify.com via whitelist bypass in SVG icon for sales channel applications"
---
# XSS on $shop$.myshopify.com/admin/ and partners.shopify.com via whitelist bypass in SVG icon for sales channel applications

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 88 | **Program:** Shopify | **Disclosed:** 2017-06-27

- Report: [https://hackerone.com/reports/232174](https://hackerone.com/reports/232174)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-05-26T09:12:00.386Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2017-06-27** @francoischagnon: Thanks again for this report. We're awarding 10x our minimum for this issue based on a couple of factors. First this XSS affected all important areas of Shopify: the partners dashboard, the admin area and our internal area accessible to employees only. Second we verified that the issue could have been used to exfiltrate merchant data if a successful attack was performed against a shopify employee. Third the complexity of the attack is low and we believe the probability of success is high.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
- **Report Vulnerability Types Updated**
