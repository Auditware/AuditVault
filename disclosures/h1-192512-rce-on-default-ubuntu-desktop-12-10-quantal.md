---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - os/linux
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-11-12
submitted: 2016-12-19T19:08:28.034Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "donnchac"
source: "https://hackerone.com/reports/192512"
title: "RCE on default Ubuntu Desktop >= 12.10 Quantal"
---
# RCE on default Ubuntu Desktop >= 12.10 Quantal

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-11-12

- Report: [https://hackerone.com/reports/192512](https://hackerone.com/reports/192512)
- CWE: Command Injection - Generic
- Submitted: 2016-12-19T19:08:28.034Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I recently reported a number of vulnerabilities in Canonical's Apport crash report software. These bugs provided RCE on a default install of Ubuntu Desktop >= 12.10 upon opening a malicious file. I reported the issues to the Apport maintainers and we coordinate the disclosure of these issues. 

Is the Internet Bug Bounty interested in providing bounties for RCE bugs affecting default Ubuntu installations? I have included a link to the Launchpad ticket and my blog post describing the issues in detail. Please let me know if this is something that you are interested in. I am happy to provide any further information that you require. 

https://bugs.launchpad.net/bugs/1648806
https://donncha.is/2016/12/compromising-ubuntu-desktop/

## Timeline

- **Report Filed**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
