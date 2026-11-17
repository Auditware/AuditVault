---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2018-05-13
submitted: 2018-04-27T19:35:19.912Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ronperris"
source: "https://hackerone.com/reports/344069"
title: "The react-marked-markdown module allows XSS injection in href values."
---
# The react-marked-markdown module allows XSS injection in href values.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-13

- Report: [https://hackerone.com/reports/344069](https://hackerone.com/reports/344069)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-04-27T19:35:19.912Z

## Timeline

- **Report Filed**
- **2018-05-05** @vdeturckheim: Thanks for reporting this. Someone will look at this report shortly.
- **Report Triaged**
- **2018-05-06** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **2018-05-11** @lirantal: @ronperris since you already disclosed the vulnerability and the author haven't responded I think we can continue with public disclosure.
- **2018-05-12** @ronperris: @lirantal Thanks for the all the help on this one!
- **2018-05-13** @lirantal: Pleasure! Thank you for submitting the report
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
