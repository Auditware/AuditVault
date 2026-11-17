---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2018-07-12
submitted: 2018-04-26T20:55:17.826Z
bounty_usd: null
votes: 11
cve: "CVE-2018-16483"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "patrickrbc"
source: "https://hackerone.com/reports/343626"
title: "Privilege escalation allows any user to add an administrator"
---
# Privilege escalation allows any user to add an administrator

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-12

- Report: [https://hackerone.com/reports/343626](https://hackerone.com/reports/343626)
- CWE: Privilege Escalation | CVE: CVE-2018-16483
- Submitted: 2018-04-26T20:55:17.826Z

## Timeline

- **Report Filed**
- **2018-05-08** @dagonza: Hi @patrickrbc . Thanks for this comprehensive report. I will be validating it in the next few hours and coming back to it.
- **Report Triaged**
- **2018-05-08** @dagonza: I can confirm this vulnerability. I will contact the owner of the package and invite him to the report.
- **2018-05-28** @patrickrbc: Any updates?
- **2018-05-29** @dagonza: I have contacted again the owner of the package again. We need to wait for his reply or 45 days that is our SLA but the vuln is confirmed.
- **External User Joined**
- **2018-05-30** @mrvautin: Thanks for posting this vuln. I've pushed a fix to NPM and Github.
- **2018-05-31** @lirantal: @mrvautin there's another vulnerability report that we opened, can you please join it: https://hackerone.com/reports/343726  and provide a fix for that as well?
- **2018-06-01** @mrvautin: Can you invite me again I cannot access that vuln?
- **2018-06-01** @lirantal: Sure just did, check your inbox/spam folder.
- **2018-06-01** @patrickrbc: I confirm that I can no longer reproduce this vulnerability.
- **2018-06-04** @patrickrbc: @lirantal resolve?
- **2018-06-04** @lirantal: Yep.
@dagonza will follow-up on this.
- **2018-06-04** @dagonza: Yes. I will follow up in few hours. Thanks.
- **2018-06-06** @dagonza: I can confirm it has been resolved. Thanks!
- **Report Resolved**
- **2018-06-07** @patrickrbc: Thank you. Is it possible to do a full disclosure and set scope to express-cart?
- **2018-06-11** @dagonza: Yes. I am doing it shortly (I think I will be able today).
- **Changed Scope**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Became Public**
