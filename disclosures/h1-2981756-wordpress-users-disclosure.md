---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/wordpress
substate: "informative"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2025-02-12
submitted: 2025-02-08T08:21:02.067Z
bounty_usd: null
votes: 69
cve: []
program: "[[programs/autodesk|Autodesk]]"
reporter: "karimtantawy"
source: "https://hackerone.com/reports/2981756"
title: "Wordpress users Disclosure"
---
# Wordpress users Disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 69 | **Program:** Autodesk | **Disclosed:** 2025-02-12

- Report: [https://hackerone.com/reports/2981756](https://hackerone.com/reports/2981756)
- CWE: Information Disclosure
- Submitted: 2025-02-08T08:21:02.067Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

we can see all the WordPress users/author with some of their information. Which can even be Personal information of employees/author. The file author-sitemap.xml at:https://www.payapps.com/author-sitemap.xml is enabled and this give the attacker many users names and emails like:

{F4036174}

## Impact

Malicious people could collect the usernames disclosed (and the admin user) and be focused throughout BF attack (as the usernames are now known), making it less harder to penetrate your systems.

## Timeline

- **Report Filed**
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
