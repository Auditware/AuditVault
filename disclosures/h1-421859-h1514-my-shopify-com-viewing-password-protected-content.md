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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi guys!

When administering a shop, the owner has the ability to preview his shop with various themes. When previewing, a unique link is generated, which the owner can share with various people without any authentication.

The generation of that unique link does not require authentication, which means any user can generate a preview link and view the contents of the shop.

Previewing isn't affected by password protection, so a user who has managed to obtain a preview link can successfully view the shop's content without knowing the password.

## Steps to Reproduce

1. Visit the following shop : https://mycorb3nikshop.myshopify.com.
2. Notice that it is protected by a password.
3. Visit https://mycorb3nikshop.myshopify.com/preview_bar and view the page's source code.
4. Search for a shopifypreview.com URL. This is the preview link generated for `mycorb3nikshop`.
5. Visit the preview URL.

You should now see the contents of the shop. Note that we've successfully viewed the content without any authentication.

{F358126}

## Impact

The impact of this bug is pretty straightforward. Because of the `/preview_bar`, the password protection is rendered useless.

Depending on the confidentiality of a shop's content, I would set the severity to either high or medium here :)

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
