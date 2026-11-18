---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2017-07-12
submitted: 2017-04-18T21:08:41.575Z
bounty_usd: null
votes: 3
cve: "CVE-2017-9462"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "claudijd"
source: "https://hackerone.com/reports/222020"
title: "Mercurial can be tricked into granting authorized users access to the Python debugger"
---
# Mercurial can be tricked into granting authorized users access to the Python debugger

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Internet Bug Bounty | **Disclosed:** 2017-07-12

- Report: [https://hackerone.com/reports/222020](https://hackerone.com/reports/222020)
- CWE: Code Injection | CVE: CVE-2017-9462
- Submitted: 2017-04-18T21:08:41.575Z

## Report summary

### Mercurial 4.1.3 (2017-4-18)

- `hg serve --stdio` could be tricked into granting authorized users access to the Python debugger. Thanks to Jonathan Claudius of Mozilla for reporting this issue. This issue is only a security issue for repositories served using --stdio, which includes ssh but *not* http.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I reported this bug privately to Mercurial and they produced an out of band release to fix the bug here:

https://www.mercurial-scm.org/wiki/WhatsNew#Mercurial_4.1.3_.282017-4-18.29

I produced a very detailed proof of concept with a Metasploit exploit module, which can be seen publicly here:

https://github.com/rapid7/metasploit-framework/pull/8263

The TLDR is that many services which host Mercurial servers often write their own hg-ssh wrapper or heavily customize the hg-ssh wrapper.  If the customized wrapped does not explicitly validate user input to the repo attribute, an attacker can supply a string of "--debugger", which causes the internal hg binary to drop to a Pdb shell, which allows arbitrary Python code execution.

I'm submitting to this program because I believe source code management software like git and mercurial is considered critical infrastructure for the Internet.

## Timeline

- **Report Filed**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Resolved**
- **2017-07-12** @claudijd: @arice can we make this public?
- **Agreed On Going Public**
- **Manually Disclosed**
