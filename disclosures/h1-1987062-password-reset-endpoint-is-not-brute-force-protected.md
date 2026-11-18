---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2023-07-21
submitted: 2023-05-13T19:17:02.646Z
bounty_usd: 500
votes: 46
cve: "CVE-2023-35172"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rullzer"
source: "https://hackerone.com/reports/1987062"
title: "Password reset endpoint is not brute force protected"
---
# Password reset endpoint is not brute force protected

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 46 | **Program:** Nextcloud | **Disclosed:** 2023-07-21

- Report: [https://hackerone.com/reports/1987062](https://hackerone.com/reports/1987062)
- CWE: Improper Restriction of Authentication Attempts | CVE: CVE-2023-35172
- Submitted: 2023-05-13T19:17:02.646Z

## Report summary

Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-mjf5-p765-qmr6

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Oversight of https://github.com/nextcloud/security-advisories/security/advisories/GHSA-v243-x6jc-42mp (https://hackerone.com/reports/1841665, but I can't judge the content there as it is not yet public).

In any case. The whole lostpassword flow is now annotated with bruteforce protection. Except the endpoint that actually matters. https://github.com/nextcloud/server/blob/master/core/Controller/LostController.php#L226-L229

An attacker can still happily try to brute force the token. Without getting throttled.

## Impact

The lostpassword flow is without actual bruteforce protection.

## Timeline

- **Report Filed**
- **2023-05-13** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **Report Resolved**
- **2023-05-15** @rullzer: Still the usual ;)
- **Bounty Awarded**
- **Report Title Updated**
- **Report Title Updated**
- **2023-06-21** @nickvergessen: Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-mjf5-p765-qmr6
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Cve Id Added**
- **Report Became Public**
