---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2018-04-28
submitted: 2018-02-28T03:13:44.212Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/320586"
title: "`foreman` is vulnerable to ReDoS in path"
---
# `foreman` is vulnerable to ReDoS in path

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-28

- Report: [https://hackerone.com/reports/320586](https://hackerone.com/reports/320586)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-02-28T03:13:44.212Z

## Timeline

- **Report Filed**
- **2018-02-28** @chalker: I suggest cc-ing @davisjam.
- **Report Triaged**
- **2018-04-05** @lirantal: Thanks @chalker and @davisjam,

I confirm the vulnerability and have invited maintainers from Strongloop and the foreman project to help triage and discuss the fix.
- **2018-04-24** @lirantal: @chalker @davisjam no update from the authors.
are you both ok with moving forward with the report disclosure?
- **2018-04-27** @chalker: Package looks dead and unsupported. I am fine with disclosing this if the maintainers could not be reached.
- **2018-04-28** @lirantal: Will continue with a full public disclosure
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
- **External User Joined**
