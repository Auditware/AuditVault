---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-01-08
submitted: 2020-12-03T03:40:59.324Z
bounty_usd: null
votes: 5
cve: "CVE-2020-29594"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "fabianfreyer"
source: "https://hackerone.com/reports/1049375"
title: "SAML authentication bypass through unauthenticated `addSamlProvider` Meteor Call"
---
# SAML authentication bypass through unauthenticated `addSamlProvider` Meteor Call

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Rocket.Chat | **Disclosed:** 2021-01-08

- Report: [https://hackerone.com/reports/1049375](https://hackerone.com/reports/1049375)
- CWE: Improper Access Control - Generic | CVE: CVE-2020-29594
- Submitted: 2020-12-03T03:40:59.324Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-12-05** @fabianfreyer: I've reviewed the following releases and can confirm they fix this issue:
* 0.74.4
* 1.3.4
* 2.4.13
* 3.7.3
* 3.8.3
* 3.9.1

An indicator of compromise would be the presence of settings such as `SAML_custom_..._cert_cert`.

From my side, this can be closed & disclosed.
- **Report Resolved**
- **Cve Id Added**
- **Agreed On Going Public**
- **Report Became Public**
