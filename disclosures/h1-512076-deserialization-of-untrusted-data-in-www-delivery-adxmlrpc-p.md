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
submitted: 2019-03-19T14:41:33.473Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "mbeccati"
source: "https://hackerone.com/reports/512076"
title: "Deserialization of Untrusted Data in www/delivery/adxmlrpc.php"
---
# Deserialization of Untrusted Data in www/delivery/adxmlrpc.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Revive Adserver | **Disclosed:** 2019-04-23

- Report: [https://hackerone.com/reports/512076](https://hackerone.com/reports/512076)
- CWE: Deserialization of Untrusted Data
- Submitted: 2019-03-19T14:41:33.473Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker could send a specifically crafted payload to the XML-RPC invocation script and trigger the unserialize() call on the "what" parameter in the "openads.spc" RPC method.

## Impact

Such vulnerability could be used to perform various types of attacks, e.g. exploit serialize-related PHP vulnerabilities or PHP object injection.

It is possible, although unconfirmed, that the vulnerability has been used by some attackers in order to gain access to some Revive Adserver instances and deliver malware through them to third party websites.

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
