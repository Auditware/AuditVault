---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/appliance
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
date: 2019-04-17
submitted: 2018-10-10T09:31:18.935Z
bounty_usd: null
votes: 195
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "filedescriptor"
source: "https://hackerone.com/reports/422043"
title: "H1514 DOMXSS on Embedded SDK via Shopify.API.setWindowLocation abusing cookie Stuffing"
---
# H1514 DOMXSS on Embedded SDK via Shopify.API.setWindowLocation abusing cookie Stuffing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 195 | **Program:** Shopify | **Disclosed:** 2019-04-17

- Report: [https://hackerone.com/reports/422043](https://hackerone.com/reports/422043)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2018-10-10T09:31:18.935Z

## Report summary

During H1-514, @filedescriptor reported an XSS issue in our Embedded App SDK that allowed for attacking legitimate apps through our platform, due to a missing protocol check on the Shopify.API.setWindowLocation. Since this issue would have allowed realistic attacks against apps using the Embedded App SDK, we decided to award $2500 for this issue. As part of the event, @filedescriptor was also awarded a bonus of $2500 for chaining multiple bugs.

## Timeline

- **Report Filed**
- **2018-10-10** @filedescriptor: Note: You need to refresh the page to see the added script reflected.
- **2018-10-10** @filedescriptor: To avoid confusion, user interaction and the modal dialog are unnecessary. They are to show the steps and what can be done (interacting with victim's admin panel) and is easier for constructing a PoC.
- **Bounty Awarded**
- **2018-10-13** @francoischagnon: Hey @filedescriptor!
Thank you for your report, and the great demonstration of impact from this bug. Since this issue allows attacking legitimate users of embedded apps, we have decided to award $2500 for this issue.
- **Report Triaged**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
