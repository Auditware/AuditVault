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
date: 2018-03-07
submitted: 2018-01-25T20:00:51.494Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3714"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309124"
title: "[node-srv] Path Traversal allows to read arbitrary files from remote server"
---
# [node-srv] Path Traversal allows to read arbitrary files from remote server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-07

- Report: [https://hackerone.com/reports/309124](https://hackerone.com/reports/309124)
- CWE: Path Traversal | CVE: CVE-2018-3714
- Submitted: 2018-01-25T20:00:51.494Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Report Severity Updated**
- **Report Severity Updated**
- **Cve Id Added**
- **2018-01-26** @bl4de: Hi @lirantal ,

Thank you for verifying my report.

I haven't contacted project maintainer as my intention was to keep the whole process consistent through the program. Also I didn't want to open issue on its GitHub repository to not cause any security issues to this module users before it will be fixed and patch will be available.

Regards,
bl4de
- **Report Severity Updated**
- **External User Joined**
- **2018-02-05** @nim579: Hi @bl4de ,
FIxed in version `v2.1.1`.
See [commit](https://github.com/nim579/node-srv/commit/15be996c0520ac6e4dee0cf0808fc7e72effd2a2) in package repo.

Thanks for report!
- **2018-02-05** @bl4de: Hi @nim579 ,

Thank you for resolving this :)
Looks great to me, I can't reproduce the issue anymore.

Regards,
bl4de
- **Report Severity Updated**
- **2018-02-05** @lirantal: Great! Thank you both for the quick response.

Are you both ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged (you can read more on the policy here: https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **Report Resolved**
- **Agreed On Going Public**
- **2018-02-05** @bl4de: Yes, I'm fine with public disclosure.
- **2018-02-05** @nim579: Ok, public it
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Became Public**
