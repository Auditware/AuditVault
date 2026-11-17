---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-04-01
submitted: 2020-02-14T17:37:31.543Z
bounty_usd: null
votes: 894
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "ngalog"
source: "https://hackerone.com/reports/796808"
title: "[Part II] Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation"
---
# [Part II] Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 894 | **Program:** Shopify | **Disclosed:** 2020-04-01

- Report: [https://hackerone.com/reports/796808](https://hackerone.com/reports/796808)
- CWE: N/A
- Submitted: 2020-02-14T17:37:31.543Z

## Report summary

On February 14th, while verifying the fix for https://hackerone.com/reports/791775, @ngalog identified another bug allowing someone to verify an email address they did not own. The bug could have given access to a small subset of Shopify user accounts the user did not own. 

Our team immediately disabled the impacted functionality and deployed a permanent fix two hours later.

## Timeline

- **Report Filed**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
