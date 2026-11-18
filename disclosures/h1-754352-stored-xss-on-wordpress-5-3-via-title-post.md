---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "not-applicable"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-12-10
submitted: 2019-12-09T13:22:18.762Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "muhammaddaffa"
source: "https://hackerone.com/reports/754352"
title: "Stored XSS on Wordpress 5.3 via Title Post"
---
# Stored XSS on Wordpress 5.3 via Title Post

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** WordPress | **Disclosed:** 2019-12-10

- Report: [https://hackerone.com/reports/754352](https://hackerone.com/reports/754352)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-12-09T13:22:18.762Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have identified a WordPress security vulnerability , a Stored XSS vulnerability that affects latest version of WordPress (5.3)

POC:
1) Login to wordpress website
2) Make a post with title payload xss like example <script>alert(document.domain);</script>
3) Publish then open the post, XSS Will trigger

## Impact

Can stealing cookie user

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2019-12-10** @muhammaddaffa: Hmm ok, can we disclose this?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
