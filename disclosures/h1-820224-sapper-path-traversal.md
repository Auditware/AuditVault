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
date: 2020-06-18
submitted: 2020-03-16T14:09:41.426Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "anvikha"
source: "https://hackerone.com/reports/820224"
title: "[sapper] Path Traversal"
---
# [sapper] Path Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/820224](https://hackerone.com/reports/820224)
- CWE: Path Traversal
- Submitted: 2020-03-16T14:09:41.426Z

## Timeline

- **Report Filed**
- **2020-03-16** @celt: Hi @anvikha,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@celt
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-14** @anvikha: Any news on this? A new version have been pushed to GitHub, with a simple commit message without any official security bulletin or announcement: I don't think this is the proper way to address a vulnerability this serious and give the appropriate credit.
Please inform me.
- **2020-06-05** @anvikha: Guys: I don't think it is cool at all that you reward a researcher with silence: no CVE, no credits; great!
- **2020-06-05** @bbe8482aecd24374d13c5de15a0a6: Hi @anvikha,

sorry, but we have many reports to triage and it takes time for us to handle all reports including the communication.

I will contact the maintainer and invite him to the report so he can check the details and start working on a patch.
- **Report Title Updated**
- **Report Title Updated**
- **External User Joined**
- **2020-06-05** @bbe8482aecd24374d13c5de15a0a6: This is fixed since sapper 0.27.11.
The commit which fixed this is https://github.com/sveltejs/sapper/commit/63ffe9043170fbed8a5d260decfdc05e4440a555

I have found also this advisory: https://www.npmjs.com/advisories/1494

I'm closing this report as resolved.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
