---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-06-22
submitted: 2022-08-14T05:32:52.278Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1668723"
title: "Security token and handler name leak from window.braveBlockRequests"
---
# Security token and handler name leak from window.braveBlockRequests

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1668723](https://hackerone.com/reports/1668723)
- CWE: Information Disclosure
- Submitted: 2022-08-14T05:32:52.278Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Brave for iOS protects privileged JS to native bridges by using random JavaScript handler names and security tokens.
However, by altering [window.braveBlockRequests](https://github.com/brave/brave-ios/blob/08fb4b0ca43625d706b96158267f0b8da6f63250/Client/Frontend/UserContent/UserScripts/RequestBlocking.js#L6) property from scripts on the web page, these secret values can be stolen.

To be specific, `braveBlockRequests` property is set after the execution of the script on the page. Thus, by setting the malicious property as an immutable property from the page beforehand as shown below, it is possible to prevent overwriting by the legitimate property.
```
Object.defineProperty(window, "braveBlockRequests", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(args) { window.args = args } // Steal handler name and token here
});
```

## Products affected: 

* Brave for iOS Version 1.41.1 (22.7.27.20) with the default settings

## Steps To Reproduce:

* Open https://csrf.jp/2022/brave_token_leak.php
* Push "Attack" button in the page
* Secret handler name and security token is shown on the page

## Supporting Material/References:

* Attached is a movie file that demonstrate the above steps to reproduce.

## Impact

The impact depends on which bridge is abused. As further features are implemented in the Brave, its potential risk tends to be increased.

## Timeline

- **Report Filed**
- **2022-08-14** @diracdeltas: Thanks for the report. We were aware of this in theory but lacked a working PoC. Will take a look.
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
