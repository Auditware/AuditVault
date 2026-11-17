---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
  - stack/apache
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
date: 2024-07-13
submitted: 2024-07-03T07:00:15.635Z
bounty_usd: 4920
votes: 51
cve: "CVE-2024-38474"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "orange"
source: "https://hackerone.com/reports/2585381"
title: "important: Apache HTTP Server weakness with encoded question marks in backreferences (CVE-2024-38474)"
---
# important: Apache HTTP Server weakness with encoded question marks in backreferences (CVE-2024-38474)

> **Severity:** High | **Bounty:** 4,920 USD | **Votes:** 51 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-07-13

- Report: [https://hackerone.com/reports/2585381](https://hackerone.com/reports/2585381)
- CWE: Improper Input Validation | CVE: CVE-2024-38474
- Submitted: 2024-07-03T07:00:15.635Z

## Report summary

###important: Apache HTTP Server weakness with encoded question marks in backreferences (CVE-2024-38474)

Substitution encoding issue in mod_rewrite in Apache HTTP Server 2.4.59 and earlier allows attacker to execute scripts in directories permitted by the configuration but not directly reachable by any URL or source disclosure of scripts meant to only to be executed as CGI.

Users are recommended to upgrade to version 2.4.60, which fixes this issue.

Some RewriteRules that capture and substitute unsafely will now fail unless rewrite flag "UnsafeAllow3F" is specified.

Acknowledgements: finder: Orange Tsai (@orange_8361) from DEVCORE

Reported to security team:	2024-04-01
fixed by r1918561 in 2.4.x:	2024-07-01
Update 2.4.60 released:	2024-07-01
Affects: 2.4.0 through 2.4.59

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
