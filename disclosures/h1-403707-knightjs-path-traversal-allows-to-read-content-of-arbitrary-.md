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
date: 2018-11-02
submitted: 2018-09-01T03:44:25.065Z
bounty_usd: null
votes: 8
cve: "CVE-2018-16475"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "abdilahrf_"
source: "https://hackerone.com/reports/403707"
title: "[knightjs] Path Traversal allows to read content of arbitrary files"
---
# [knightjs] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2018-11-02

- Report: [https://hackerone.com/reports/403707](https://hackerone.com/reports/403707)
- CWE: Path Traversal | CVE: CVE-2018-16475
- Submitted: 2018-09-01T03:44:25.065Z

## Timeline

- **Report Filed**
- **2018-09-01** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **Report Severity Updated**
- **2018-09-10** @lirantal: Thanks @abdilahrf_ 

I reached out to the maintainer to join the conversation here.
- **Changed Scope**
- **2018-10-12** @abdilahrf_: seems the author is not coming to this report, should we disclose this ?
- **2018-10-13** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository:  https://github.com/skyang/knight/issues/2
- **2018-11-02** @lirantal: I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I reached out to the maintainer via the github issue as well as sent an invite the package maintainer to this issue yet with no response.

I will move forward with disclosing the vulnerability.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2026-08-28** @abdilahrf_: Hi, this report is currently in my pending bounty tabs. Could you please mark this report as ineligible for a bounty so that my pending bounty tabs can be cleared?
