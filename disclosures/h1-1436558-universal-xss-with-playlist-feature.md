---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
  - vuln/csrf
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2023-06-22
submitted: 2021-12-27T10:44:49.676Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1436558"
title: "Universal XSS with Playlist feature"
---
# Universal XSS with Playlist feature

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1436558](https://hackerone.com/reports/1436558)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-12-27T10:44:49.676Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Brave iOS has three weaknesses described below. By combining them, Universal XSS can be achieved.

1. Exposure of UserScriptManager.securityToken
[Playlist.js](https://github.com/brave/brave-ios/blob/fdff99ca3997816322015fe5efcd63490193b88d/Client/Frontend/UserContent/UserScripts/Playlist.js#L353) embeds the exact value of the `$<notifyNode>` into `HTMLVideoElement.prototype.setAttribute`. By reading the value, an attacker can retrieve the hidden security token.

2. Exposure of UserScriptManager.messageHandlerToken
Also, [WindowRenderHelper.js](https://github.com/brave/brave-ios/blob/83eb41ac922d7bd18fd311e0a4279e02cdd8e190/Client/Frontend/UserContent/UserScripts/WindowRenderHelper.js#L12) embeds the exact value of the `$<handler>` into `W{securityToken}.postMessage`. By reading the value, an attacker can retrieve the hidden message handler token.

3. UXSS in PlaylistHelper through nodeTag
[PlaylistHelper.swift](https://github.com/brave/brave-ios/blob/83eb41ac922d7bd18fd311e0a4279e02cdd8e190/Client/Frontend/Browser/PlaylistHelper.swift#L228) concatenates strings to build a JavaScript code and executes it on the mainframe of a WebView. Then, `nodeTag` given from a webpage is directly included in the code. So, if the `nodeTag`, named as `tagId` in JS world, passed from the page contained `');alert(document.location);//`, unintended `alert()` is executed on the mainframe.

## Products affected: 

 * Brave iOS 1.32.3 and higher (include the latest Nightly)

## Steps To Reproduce:

 * Visit the Google page: https://sites.google.com/view/nishimunea-brave-uxss1/page
* This page contains a cross origin malicious page https://csrf.jp/brave/playlist.php in an iframe
* The iframe exploits the above three weaknesses to send a message to playlistHelper
* Push `Add to Brave Playlist` and `Open` button in the setting menu
* An alert dialog is appear on the sites.google.com

## Supporting Material/References:

  * Demonstration movie is attached

## Impact

* Universal XSS on the arbitrary domains

## Timeline

- **Report Filed**
- **2021-12-28** @diracdeltas: candidate fix: https://github.com/brave/brave-ios/pull/4776/files

also note we are moving to native sandboxing which will hopefully prevent most of these issues: https://github.com/brave/brave-ios/pull/4753
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
