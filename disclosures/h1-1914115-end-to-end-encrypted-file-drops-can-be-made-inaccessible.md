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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Assume a filedrop that is send to 2 people, USER and ATTACKER

1. user uploads their E2EE encrypted fileA into the filedrop
2. All goes well
3. Now ATTACKER comes along and wants mess up the upload from USER
4. They obtain the metadatafile
5. They modify the entry in the filedrop list that USER created
6. They upload their new metadatafile
7. Unlock it
8. FileA is now not able to be decoded at all anymore.

## Impact

The CIA model (Confidentiality, integrity and availability) is here very easy to break. An attacker can almost trivially in this case break the availability.
Note that due to the nature of providing the metadatafile an attacker can trivially know if there are other filedrop files.

To solve
1. Do not provide the metadata file to the user in file drop at all
2. Only send back the new entry (which they can create without the metadatafile)
3. Append the new entry in the backend code.

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
