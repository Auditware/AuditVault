---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2023-06-22
submitted: 2021-01-29T02:51:18.444Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1089995"
title: "Onion-Location header allows to open arbitrary URLs including chrome:"
---
# Onion-Location header allows to open arbitrary URLs including chrome:

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1089995](https://hackerone.com/reports/1089995)
- CWE: Violation of Secure Design Principles
- Submitted: 2021-01-29T02:51:18.444Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

This [PR](https://github.com/brave/brave-core/pull/6762) introduced "Open in Tor" feature that can open .onion URLs offered through `Onion-Location` response header, but `Onion-Location` header allows to open arbitrary URLs such as `javascript:` and `chrome:`.
This behavior can be exploited as a way to bypass SOP and gain access to privileged URLs.

## Products affected: 

* Brave Nightly for OSX (1.21.28 Chromium: 88.0.4324.96 (Official Build) nightly (x86_64))

## Steps To Reproduce:

* Open https://csrf.jp/brave/onion.php
* Click "Open in Tor" button shown in the Brave's address bar
* Privileged URL `chrome://restart/` is opened, and Brave is restarted.

If a user enabled "Automatically redirect .onion sites" in the settings, `chrome://restart/` is opened automatically and Brave continues to restart endlessly.

## Supporting Material/References:

PoC code in PHP is below

   ```
<?php
header("Onion-Location: chrome://restart/");
?>
   ```

## Impact

As written in the summary, attacker can bypass SOP restrictions and gain access to privileged URLs.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-01-29** @diracdeltas: thank you for the report. will be fixed by https://github.com/brave/brave-core/pull/7747.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2021-01-30** @nishimunea: Thanks for the swift response!
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
