---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2019-05-22
submitted: 2018-10-09T23:29:59.524Z
bounty_usd: 3000
votes: 192
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "corb3nik"
source: "https://hackerone.com/reports/421859"
title: "H1514 [*.(my)shopify.com] - Viewing Password Protected Content"
---
# H1514 [*.(my)shopify.com] - Viewing Password Protected Content

> **Severity:** Critical | **Bounty:** 3,000 USD | **Votes:** 192 | **Program:** Shopify | **Disclosed:** 2019-05-22

- Report: [https://hackerone.com/reports/421859](https://hackerone.com/reports/421859)
- CWE: Improper Authentication - Generic
- Submitted: 2018-10-09T23:29:59.524Z

## Report summary

[@corb3nik](/corb3nik) discovered a vulnerability on the theme preview feature that 
could have allowed a malicious user to bypass the storefront password protection for 
any store by accessing the `/preview_bar` endpoint and fetching the preview domain of 
a store; giving them access to any information displayed in the storefront area.

## Timeline

- **Report Filed**
- **2018-10-09** @corb3nik: Also, I believe this issue will affect both password protected content on shopify.com and on myshopify.com.
- **Bounty Awarded**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
