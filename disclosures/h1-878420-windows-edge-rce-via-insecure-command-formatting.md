---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-08-24
submitted: 2020-05-19T22:34:12.863Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/878420"
title: "[windows-edge] RCE via insecure command formatting"
---
# [windows-edge] RCE via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-24

- Report: [https://hackerone.com/reports/878420](https://hackerone.com/reports/878420)
- CWE: Code Injection
- Submitted: 2020-05-19T22:34:12.863Z

## Timeline

- **Report Filed**
- **2020-05-19** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-07-25** @bbe8482aecd24374d13c5de15a0a6: Hi @mik317,

it seems this is already fixed by the latest release and this commit: https://github.com/eugeneware/windows-edge/commit/20ce41e1111d05533d9b4f6e2da274c13b278e0d

Which seems to be the result of https://github.com/eugeneware/windows-edge/issues/2

So it seems this is already resolved. Can you confirm this?
- **2020-07-25** @mik317: Hi @danielruf :),
I reported initially the issue here, and then on Huntr.
They opened the issue on the original repo and another of our members (`69`) reported a good fix which has been merged inside the original repo :).

Can we then close thus as `Resolved` this report? Will a CVE be assigned or it's a different case from the other issues?

Thanks a lot :),
Mik
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-26** @mik317: Awesome :),
thanks a lot for your help :)

Cheers,
Mik
- **Report Became Public**
