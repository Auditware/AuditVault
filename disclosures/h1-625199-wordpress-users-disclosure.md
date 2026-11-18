---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/wordpress
substate: "duplicate"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-07-01
submitted: 2019-06-22T00:04:42.696Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "abay"
source: "https://hackerone.com/reports/625199"
title: "Wordpress Users Disclosure"
---
# Wordpress Users Disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Nextcloud | **Disclosed:** 2019-07-01

- Report: [https://hackerone.com/reports/625199](https://hackerone.com/reports/625199)
- CWE: Information Disclosure
- Submitted: 2019-06-22T00:04:42.696Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Information**
Using REST API, we can see all the WordPress users/author with some of their information.

**Step to Reproduce**
You can get user info by entering below url in your browser: 
https://nextcloud.com/wp-json/wp/v2/users

Reference: [#356047](https://hackerone.com/reports/356047)

## Impact

Authors : LTR , LTREditor can be created scenario of doing bruteforce attacks to this users.

## Timeline

- **Report Filed**
- **2019-06-22** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Duplicate**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
