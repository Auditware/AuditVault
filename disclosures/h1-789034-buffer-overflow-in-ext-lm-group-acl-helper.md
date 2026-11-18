---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
  - vuln/dos
  - fix/input-validation
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2021-07-28
submitted: 2020-02-04T21:58:53.101Z
bounty_usd: null
votes: 18
cve: "CVE-2020-8517"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "aaron_costello"
source: "https://hackerone.com/reports/789034"
title: "Buffer Overflow in ext_lm_group_acl helper"
---
# Buffer Overflow in ext_lm_group_acl helper

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-07-28

- Report: [https://hackerone.com/reports/789034](https://hackerone.com/reports/789034)
- CWE: Classic Buffer Overflow | CVE: CVE-2020-8517
- Submitted: 2020-02-04T21:58:53.101Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Due to incorrect buffer management ext_lm_group_acl is vulnerable to a denial of service attack when processing NTLM Authentication credentials. This problem is limited to installations using the
ext_lm_group_acl binary.

## Affected Versions

Squid 2.x -> 2.7.STABLE9
Squid 3.x -> 3.5.28
Squid 4.x -> 4.9

## Severity 

Due to incorrect input validation the NTLM authentication credentials parser in ext_lm_group_acl may write to memory outside the credentials buffer. On systems with memory access protections this can result in the helper process being terminated unexpectedly. Resulting in the Squid process also terminating and a denial of service for all clients using the proxy.

## Supporting Material/References:

Advisory : http://www.squid-cache.org/Advisories/SQUID-2020_3.txt

## Remediation

An official patch is available from the Squid archives for both Squid 3.5 and Squid 4. 

## Timeline

2019-11-11 : I reported the issue
2019-11-18 : I made a PR on GitHub with a fix
2019-11-22 :  Fix was merged

## Impact

See 'Severity' section of report.

## Timeline

- **Report Filed**
- **2020-02-05** @bluetooth_headset: Hi @aaron_costello,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bluetooth_headset
- **Report Triaged**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
