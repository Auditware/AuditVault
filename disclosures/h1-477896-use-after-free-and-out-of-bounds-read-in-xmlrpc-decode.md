---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-after-free
  - env/web
  - vuln/code-injection
  - vuln/dos
substate: "resolved"
weakness: "Use After Free"
enriched: true
body: true
date: 2020-11-09
submitted: 2019-01-11T10:10:08.276Z
bounty_usd: 1500
votes: 8
cve: "CVE-2019-9020"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "hanno"
source: "https://hackerone.com/reports/477896"
title: "Use after free and out of bounds read in xmlrpc_decode()"
---
# Use after free and out of bounds read in xmlrpc_decode()

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 8 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/477896](https://hackerone.com/reports/477896)
- CWE: Use After Free | CVE: CVE-2019-9020
- Submitted: 2019-01-11T10:10:08.276Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Malformed input can lead to use after free and out of bounds memory errors.

This has been fixed with the latest updates of PHP (7.1.26/7.2.14/7.3.1).

(Note: I reported those as separate bugs to PHP, but they had the same underlying bug and were fixed by the same commit. The release notes only mention "out of bounds read", but this is misleading, as a use after free error is potentially more severe.)

Bugs reported to PHP:
https://bugs.php.net/bug.php?id=77242
https://bugs.php.net/bug.php?id=77249

## Impact

If the xmlrpc functionality of PHP is used to parse untrusted input from a public API point it can potentially be used to gain code execution.

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @hanno - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **2019-03-31** @hanno: Hello, any update?
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-10** @hanno: Any update?
- **2020-02-28** @ktistai: Hi @hanno

There are no updates as of yet. As soon as we will know more, we will let you know. 

Thanks,
@ktistai
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
