---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2019-10-07
submitted: 2019-09-16T07:54:32.084Z
bounty_usd: null
votes: 8
cve: "CVE-2019-15596"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "zxdrrr"
source: "https://hackerone.com/reports/695416"
title: "Path traversal using symlink"
---
# Path traversal using symlink

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-10-07

- Report: [https://hackerone.com/reports/695416](https://hackerone.com/reports/695416)
- CWE: Path Traversal | CVE: CVE-2019-15596
- Submitted: 2019-09-16T07:54:32.084Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-09-17** @nochnoidozor: Hi @0xche,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **2019-09-17** @beagle: -
- **Report Triaged**
- **Report Informative**
- **Report Reopened**
- **Report Triaged**
- **2019-09-24** @zxdrrr: Do you patch this vulnerability?!
- **2019-09-24** @octetcloud: @oxche Who is the "you" that question was directed at? Neither H1 staff nor the security-wg have the ability to fix vulnerabilities in packages, see https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md#correction-follow-up

This package has almost zero usage, and no information in the package contents that allows a maintainer to be contacted.
- **2019-10-07** @lirantal: Agree with Sam about being unable to contact the maintainer - nothing in the package JSON, virtually zero downloads and no GitHub repo to search for contact address. Will go ahead with public disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **2019-12-10** @zxdrrr: Thanks @lirantal. Can a CVE be assigned for the same?
- **2019-12-13** @lirantal: yes @zxdrrr I have requested it.
- **2019-12-16** @zxdrrr: Thanks.
can you add @opera20r to participants?
