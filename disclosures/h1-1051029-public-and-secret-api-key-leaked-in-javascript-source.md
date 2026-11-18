---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-01-19
submitted: 2020-12-05T06:38:02.571Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/top_echelon_software|Top Echelon Software]]"
reporter: "lmhu"
source: "https://hackerone.com/reports/1051029"
title: "Public and secret api key leaked in JavaScript source"
---
# Public and secret api key leaked in JavaScript source

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Top Echelon Software | **Disclosed:** 2021-01-19

- Report: [https://hackerone.com/reports/1051029](https://hackerone.com/reports/1051029)
- CWE: Improper Access Control - Generic
- Submitted: 2020-12-05T06:38:02.571Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary: [Summary the vulnerabilities]**
I am surfing on the bb3jobboard.topechelon.com website. I found a sensitive data including authentication key written in public accessible javascript file.

**URL Vulnerability**
  * https://bb3jobboard.topechelon.com/#!/search?page=1

###Steps To Reproduce:
  * Open bb3jobboard.topechelon.com and add payloads javascript-fuzz
  * Directory sensitive is ``//job_board.js//`` parse this json files using jsonparseronline
  * and look response bytes In response you can see Sensitive ApiKey Disclosure
  * Sensitive Information has been leaked on this source page job_board.js
  * Open your network browser , this javascript source has high files can leads to (DoS)

**Proof On Concept**
```javascript
}]), angular.module("jb").config(["lkGoogleSettingsProvider", function(e) {
    e.configure({
        apiKey: "██████████",
        clientId: "██████t.apps.googleusercontent.com",
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        features: ["MULTISELECT_DISABLED"]
    })
}]), angular.module("jb.factories").factory("BoardSettingsFactory", ["railsResourceFactory", "PathToResourceRoute", function(e, t) {
    var n = e({
        url: t.convert(JBRoutes.jobBoardBoardSettingsPath),
        name: "boardSettings"
    });
```
**Screenshots Proof**
████

## Impact

Information disclosure

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-17** @lmhu: can we disclosed here ? i waiting for disclosed 1month ago.
- **Agreed On Going Public**
- **Report Became Public**
