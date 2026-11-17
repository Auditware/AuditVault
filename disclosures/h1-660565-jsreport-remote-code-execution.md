---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/remote-file-inclusion
  - env/web
  - stack/node
substate: "resolved"
weakness: "Remote File Inclusion"
enriched: true
date: 2020-02-07
submitted: 2019-07-26T05:00:15.970Z
bounty_usd: null
votes: 8
cve: "CVE-2020-8128"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ermilov"
source: "https://hackerone.com/reports/660565"
title: "[jsreport] Remote Code Execution"
---
# [jsreport] Remote Code Execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-07

- Report: [https://hackerone.com/reports/660565](https://hackerone.com/reports/660565)
- CWE: Remote File Inclusion | CVE: CVE-2020-8128
- Submitted: 2019-07-26T05:00:15.970Z

## Timeline

- **Report Filed**
- **2019-07-29** @ktistai: Hi @inkz 

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Needs More Info**
- **Report New**
- **2019-07-30** @ermilov: @ktistai btw, I contacted the author of the module and he released the patch for script-manager
https://github.com/pofider/node-script-manager/commit/ac645ab2e58785324c467e0583d7f277a7aa07b3
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **External User Joined**
- **2020-02-03** @pofider: I believe this was fixed at the same time as https://hackerone.com/reports/660563.

The idea of the fix was that the scripts manager workers only accept requests with security hash that only the scripts manager knows and include in them.

The fix was already released to the users.
- **External User Removed**
- **2020-02-04** @marcinhoppe: @ermilov @ktistai can you confirm this vulnerability has been fixed properly? Then I could proceed with disclosure. Thanks!
- **2020-02-04** @ermilov: @marcinhoppe ok, I'll check it soon.
- **2020-02-06** @marcinhoppe: @ermilov were you able to verify if the issue was fixed, too?
- **2020-02-06** @ermilov: @marcinhoppe Yes, I verify that the issue is no longer present in the new version of the `jsreport`.
Sorry for the delay again.
- **2020-02-07** @marcinhoppe: Thanks. I will disclose this vulnerability now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Agreed On Going Public**
- **Manually Disclosed**
