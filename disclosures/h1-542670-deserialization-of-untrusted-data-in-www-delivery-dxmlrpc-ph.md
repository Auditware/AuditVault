---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/php
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2019-04-23
submitted: 2019-04-19T14:38:45.548Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "mbeccati"
source: "https://hackerone.com/reports/542670"
title: "Deserialization of Untrusted Data in www/delivery/dxmlrpc.php"
---
# Deserialization of Untrusted Data in www/delivery/dxmlrpc.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Revive Adserver | **Disclosed:** 2019-04-23

- Report: [https://hackerone.com/reports/542670](https://hackerone.com/reports/542670)
- CWE: Deserialization of Untrusted Data
- Submitted: 2019-04-19T14:38:45.548Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker could send a specifically crafted payload to the XML-RPC invocation script and trigger the unserialize() call on the first parameter in the "pluginExecute" RPC method.

## Impact

Such vulnerability could be used to perform various types of attacks, e.g. exploit serialize-related PHP vulnerabilities or PHP object injection.

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
