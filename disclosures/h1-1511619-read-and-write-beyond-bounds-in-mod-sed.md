---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
substate: "resolved"
weakness: "Heap Overflow"
enriched: true
date: 2022-04-14
submitted: 2022-03-14T19:03:51.467Z
bounty_usd: null
votes: 6
cve: "CVE-2022-23943"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tdp3kel9g"
source: "https://hackerone.com/reports/1511619"
title: "Read and write beyond bounds in mod_sed"
---
# Read and write beyond bounds in mod_sed

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-04-14

- Report: [https://hackerone.com/reports/1511619](https://hackerone.com/reports/1511619)
- CWE: Heap Overflow | CVE: CVE-2022-23943
- Submitted: 2022-03-14T19:03:51.467Z

## Report summary

important: mod_sed: Read/write beyond bounds (CVE-2022-23943)

Out-of-bounds Write vulnerability in mod_sed of Apache HTTP Server allows an attacker to overwrite heap memory with possibly attacker provided data.

This issue affects Apache HTTP Server 2.4 version 2.4.52 and prior versions.

Acknowledgements: Ronald Crane (Zippenhop LLC)

Reported to security team:	2022-01-13
Update 2.4.53 released:	2022-03-14
Affects:	<=2.4.52

https://httpd.apache.org/security/vulnerabilities_24.html

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **2022-03-25** @tdp3kel9g: Greetings. I have some questions about report disclosure and POCs. What is disclosed, and to whom? Also, what do you use the POCs for? And is it necessary to submit a POC here, since the publisher already has verified the POC before issuing its CVE?
- **2022-03-25** @kunderkoffler: Hi, @tdp3kel9g! The disclosure would be a full disclosure of the report and be publicly available through the program's Hacktivity. Here's a link to a recent IBB disclosure for reference: https://hackerone.com/reports/1520931. Let me know if there are still open questions or if seeing one in the wild helps clear up the purpose.
- **2022-03-25** @tdp3kel9g: Thank you for the reference. Since everything here is slated to become public, please redact the email addresses and names cited in my POC. I did not know that those would be slated for publication.
- **2022-03-25** @kunderkoffler: Understood. Apologies for any confusion. I will get everything redacted.
- **2022-03-25** @kunderkoffler: @tdp3kel9g, Please take a look at the report when you get a chance and let me know if I've sanitized everything necessary. Thank you!
- **2022-04-02** @tdp3kel9g: Thank you! Please also redact the paragraph beginning "Also, I notice that the POC..." That should be it.
- **Report Became Public**
