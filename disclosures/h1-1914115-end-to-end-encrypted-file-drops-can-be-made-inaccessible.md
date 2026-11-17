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
date: 2023-06-22
submitted: 2023-03-21T20:28:56.615Z
bounty_usd: 400
votes: 43
cve: "CVE-2023-35173"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rullzer"
source: "https://hackerone.com/reports/1914115"
title: "End-to-end encrypted file-drops can be made inaccessible"
---
# End-to-end encrypted file-drops can be made inaccessible

> **Severity:** High | **Bounty:** 400 USD | **Votes:** 43 | **Program:** Nextcloud | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1914115](https://hackerone.com/reports/1914115)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-35173
- Submitted: 2023-03-21T20:28:56.615Z

## Report summary

Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-x7c7-v5r3-mg37

## Timeline

- **Report Filed**
- **2023-03-21** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2023-03-21** @rullzer: Maybe to add some more context the bug comes from 

https://github.com/nextcloud/end_to_end_encryption/blob/master/lib/Controller/MetaDataController.php#L201

The way the arrays are merged there is the wrong way around. However it still is bad practice to send the whole metadata file to just random people that visit a url.
- **Report Triaged**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Resolved**
- **2023-06-21** @nickvergessen: Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-x7c7-v5r3-mg37
- **Agreed On Going Public**
- **Cve Id Added**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
