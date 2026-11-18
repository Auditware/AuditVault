---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
  - stack/apache
  - vuln/code-injection
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2024-07-13
submitted: 2024-07-03T07:09:25.062Z
bounty_usd: 4920
votes: 30
cve: "CVE-2024-38475"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "orange"
source: "https://hackerone.com/reports/2585378"
title: "important: Apache HTTP Server weakness in mod_rewrite when first segment of substitution matches filesystem path. (CVE-2024-38475)"
---
# important: Apache HTTP Server weakness in mod_rewrite when first segment of substitution matches filesystem path. (CVE-2024-38475)

> **Severity:** High | **Bounty:** 4,920 USD | **Votes:** 30 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-07-13

- Report: [https://hackerone.com/reports/2585378](https://hackerone.com/reports/2585378)
- CWE: Improper Input Validation | CVE: CVE-2024-38475
- Submitted: 2024-07-03T07:09:25.062Z

## Report summary

###important: Apache HTTP Server weakness in mod_rewrite when first segment of substitution matches filesystem path. (CVE-2024-38475)

Improper escaping of output in mod_rewrite in Apache HTTP Server 2.4.59 and earlier allows an attacker to map URLs to filesystem locations that are permitted to be served by the server but are not intentionally/directly reachable by any URL, resulting in code execution or source code disclosure.

Substitutions in server context that use a backreferences or variables as the first segment of the substitution are affected. Some unsafe RewiteRules will be broken by this change and the rewrite flag "UnsafePrefixStat" can be used to opt back in once ensuring the substitution is appropriately constrained.

Acknowledgements: finder: Orange Tsai (@orange_8361) from DEVCORE

Reported to security team: 2024-04-01
fixed by r1918561 in 2.4.x: 2024-07-01
Update 2.4.60 released: 2024-07-01
Affects: 2.4.0 through 2.4.59

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I reported this vulnerability through the official Apache HTTP Server security email on April 1, 2024, and received a fix along with a CVE number on July 1, 2024. You can check detailed information from there:
> https://httpd.apache.org/security/vulnerabilities_24.html

## Impact

Improper escaping of output in mod_rewrite in Apache HTTP Server 2.4.59 and earlier allows an attacker to map URLs to filesystem locations that are permitted to be served by the server but are not intentionally/directly reachable by any URL, resulting in code execution or source code disclosure.

Substitutions in server context that use a backreferences or variables as the first segment of the substitution are affected. Some unsafe RewiteRules will be broken by this change and the rewrite flag "UnsafePrefixStat" can be used to opt back in once ensuring the substitution is appropriately constrained.

## Timeline

- **Draft Started**
- **Report Filed**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
