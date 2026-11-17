---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2018-04-25
submitted: 2018-04-20T09:12:33.738Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/341044"
title: "[cloudcmd] Stored XSS in the filename when directories listing"
---
# [cloudcmd] Stored XSS in the filename when directories listing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-25

- Report: [https://hackerone.com/reports/341044](https://hackerone.com/reports/341044)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-04-20T09:12:33.738Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Triaged**
- **2018-04-23** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-04-23** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **External User Joined**
- **2018-04-23** @coderaiser: Thank you for report. Fixed with [23f4d47](https://github.com/coderaiser/cloudcmd/commit/23f4d4702cd3d473977285f26ea2ae7206b45f38). Landed in [v9.1.6](https://github.com/coderaiser/cloudcmd/releases/tag/v9.1.6).
- **2018-04-24** @lirantal: @coderaiser thank you for the quick reply! are you ok with me disclosing the report as soon we as confirm?

@tungpun can you please confirm the fix?
- **2018-04-25** @tungpun: I confirm that the issue has been fixed! I can't reproduce the PoC anymore.
- **2018-04-25** @coderaiser: @lirantal yes, I'm ok.
- **2018-04-25** @lirantal: Awesome thank you guys!
I'm proceeding with a full public disclosure
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-04-25** @tungpun: @lirantal May I kindly know if this one is valid for a CVE according to the program’s policy?
- **2018-04-25** @lirantal: @tungpun of course it does. all the reports get a CVE but at the moment we're facing some issues and bottlenecks with assigning them so to not delay the report itself we're disclosing them as usual and will retroactively update a CVE (this might take some time but will eventually happen)
- **2019-05-15** @tungpun: Hi @lirantal ,
Thanks for your support! However, 1 year passes, may I kindly know any update?
- **2019-06-19** @tungpun: Hi all, may I kindly know any update on my reports on this program?
