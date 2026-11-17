---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2023-07-20
submitted: 2023-04-26T17:50:54.899Z
bounty_usd: null
votes: 6
cve: "CVE-2023-30587"
program: "[[programs/nodejs|Node.js]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/1962701"
title: "Process-based permissions can be bypassed with the 'inspector' module.  "
---
# Process-based permissions can be bypassed with the "inspector" module.  

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js | **Disclosed:** 2023-07-20

- Report: [https://hackerone.com/reports/1962701](https://hackerone.com/reports/1962701)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-30587
- Submitted: 2023-04-26T17:50:54.899Z

## Timeline

- **Report Filed**
- **2023-04-27** @mhdawson: Thank you for the report, the team will evaluate over the next few days.
- **2023-04-27** @mhdawson: @mattaustin in terms of:

>In my opinion inspector should be allowed when process level permissions are being enforced.

I think you might have missed a "not" as I'm thinking you meant to suggest that you should not have access to the inspector by default if permissions are enabled.
- **2023-04-27** @mattaustin: Oops, that is correct. it should have said:  "In my opinion inspector should **not** be allowed "
- **2023-05-01** @rafaelgss: I agree that inspector should not be allowed when using the permission model. However, I'm not sure if we should consider it a vulnerability once the constraints defined https://nodejs.org/api/cli.html#--experimental-permission does not mention the inspector protocol.
- **Report Triaged**
- **2023-05-07** @mattaustin: Thanks for the update.
- **Cve Id Added**
- **2023-06-14** @rafaelgss: Hi @mattaustin! Would you like to be credited in the release notes? If yes, which name would you like us to use?

Example:

Thanks, to mattaustin for reporting this vulnerability.
- **2023-06-15** @mattaustin: mattaustin is good i use that for H1 and twitter.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
