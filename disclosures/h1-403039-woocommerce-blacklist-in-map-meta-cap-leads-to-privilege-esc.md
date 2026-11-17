---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-12-19
submitted: 2018-08-30T14:33:31.173Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/403039"
title: "WooCommerce Blacklist in 'map_meta_cap' leads to Privilege Escalation of Shopmanagers"
---
# WooCommerce Blacklist in 'map_meta_cap' leads to Privilege Escalation of Shopmanagers

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Automattic | **Disclosed:** 2019-12-19

- Report: [https://hackerone.com/reports/403039](https://hackerone.com/reports/403039)
- CWE: Privilege Escalation
- Submitted: 2018-08-30T14:33:31.173Z

## Timeline

- **Report Filed**
- **2018-08-31** @vortfu: Thanks for the report, I've forwarded it on to the WC team for review.
- **2018-09-11** @claudiulodro: Hi Simon,

Thanks for the report. This appears to be a valid issue. We'll have a patch for it in a few weeks for WooCommerce 3.4.6.

Thanks,
Claudiu
- **2018-10-12** @claudiulodro: Hi Simon,

This was another one patched in [WC 3.4.6](https://woocommerce.wordpress.com/2018/10/11/woocommerce-3-4-6-security-fix-release-notes/), released yesterday. You can see in the article we've implemented a whitelist, so Shop Managers will only be able to edit Customers or whitelisted roles from extensions. Thanks for all your help!

Claudiu
- **2018-10-14** @simonscannell: Hi Claudiu,

The patch does seem to work. Thank you very much. :)
- **Report Resolved**
- **Bounty Awarded**
- **2018-10-23** @simonscannell: Thank you very much! Was a pleasure working with you.
- **Agreed On Going Public**
- **Report Became Public**
