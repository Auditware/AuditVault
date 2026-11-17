---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
date: 2020-10-10
submitted: 2019-01-12T00:41:08.110Z
bounty_usd: 1500
votes: 16
cve: "CVE-2016-10166"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/478367"
title: "efree() on uninitialized Heap data in imagescale leads to use-after-free"
---
# efree() on uninitialized Heap data in imagescale leads to use-after-free

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 16 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-10

- Report: [https://hackerone.com/reports/478367](https://hackerone.com/reports/478367)
- CWE: Use After Free | CVE: CVE-2016-10166
- Submitted: 2019-01-12T00:41:08.110Z

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @simonscannell - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **Report Triaged**
- **Report Severity Updated**
- **2019-05-19** @simonscannell: Hi @tuxedo, thank you for triaging!
- **2019-05-28** @simonscannell: Oh btw, something I only realized now: This vulnerability exists in the upstream PHP source code. PHP installations that rely on the actual libgd are vulnerable to another UAF vulnerability in the same function that was introduced as a patch for this vulnerability, which we discovered by fixing this one.
- **2019-10-08** @simonscannell: I saw a couple of the IBB programs recently resolving and disclosing bugs. Does that mean PHP bugs will get handled soon? Thanks!
- **Hacker Requested Mediation**
- **2020-01-21** @simonscannell: I saw that the password was changed on the PHP bug report. Did this come from you guys?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-10** @simonscannell: Thank you so much!
- **Agreed On Going Public**
- **Report Became Public**
