---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/ruby
substate: "resolved"
weakness: null
enriched: true
date: 2022-12-14
submitted: 2022-12-14T10:10:23.563Z
bounty_usd: 4000
votes: 15
cve: "CVE-2022-23514"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/1804128"
title: "ReDoS (Rails::Html::PermitScrubber.scrub_attribute)"
---
# ReDoS (Rails::Html::PermitScrubber.scrub_attribute)

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 15 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-12-14

- Report: [https://hackerone.com/reports/1804128](https://hackerone.com/reports/1804128)
- CWE: N/A | CVE: CVE-2022-23514
- Submitted: 2022-12-14T10:10:23.563Z

## Report summary

###Summary

Certain configurations of rails-html-sanitizer ``< 1.4.4`` use an inefficient regular expression that is susceptible to excessive backtracking when attempting to sanitize certain SVG attributes. This may lead to a denial of service through CPU resource consumption.

###Mitigation

Upgrade to rails-html-sanitizer ``>= 1.4.4.``

###Severity

The maintainers have evaluated this as High Severity 7.5 (CVSS 3.1).

###References

- [CWE - CWE-1333: Inefficient Regular Expression Complexity (4.9)](https://cwe.mitre.org/data/definitions/1333.html)
- [https://hackerone.com/reports/1684163](https://cwe.mitre.org/data/definitions/1333.html)

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
