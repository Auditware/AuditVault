---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/csrf
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2023-06-22
submitted: 2023-01-01T08:55:37.266Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1819668"
title: "Brave News feeds can open arbitrary chrome: URLs"
---
# Brave News feeds can open arbitrary chrome: URLs

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1819668](https://hackerone.com/reports/1819668)
- CWE: Privilege Escalation
- Submitted: 2023-01-01T08:55:37.266Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
URL link in Brave News feeds can open arbitrary chrome: URLs.
This behavior can be exploited as a way to bypass SOP and gain access to privileged URLs.

## Products affected: 

 * 1.46.144 Chromium: 108.0.5359.128 (Official Build) （x86_64）

## Steps To Reproduce:

 * Open new tab and click customize button
 * Follow https://csrf.jp/brave/rss_chrome.php as a RSS feed of Brave News
 * Reload the tab
 * RSS feeed that name is "Access chrome: URLs" is shown on Brave News
 * Click the feed
 * `chrome://settings/resetProfileSettings?origin=userclick` is opened on the tab

## Supporting Material/References:

  * See the demonstration movie I attached

## Impact

Bypass SOP and gain access to privileged URLs.

## Timeline

- **Report Filed**
- **2023-01-01** @diracdeltas: Thanks, we are looking into it.
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
