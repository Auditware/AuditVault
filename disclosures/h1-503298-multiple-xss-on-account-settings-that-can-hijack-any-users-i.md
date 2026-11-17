---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2019-04-01
submitted: 2019-02-28T12:27:15.103Z
bounty_usd: 700
votes: 73
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "giddsec"
source: "https://hackerone.com/reports/503298"
title: "Multiple XSS on account settings that can hijack any users in the company. "
---
# Multiple XSS on account settings that can hijack any users in the company. 

> **Severity:** Critical | **Bounty:** 700 USD | **Votes:** 73 | **Program:** X / xAI | **Disclosed:** 2019-04-01

- Report: [https://hackerone.com/reports/503298](https://hackerone.com/reports/503298)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-02-28T12:27:15.103Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-03-01** @jknguyen: Just noting here that these vulnerable fields were originally reported in #485736, but were marked as a duplicate in favor of #485748. Since the fix for #485748 did not encompass these additional vulnerable fields, we are accepting this new report.
- **2019-03-01** @giddsec: Thanks for the triage! @jknguyen,
As of almost every input in **account settings** is vulnerable to XSS, which can result to different impacts, especially it targets the users of MoPub.
- **2019-03-01** @giddsec: As mentioned in report #485736.

- These fields: {Name, Address, Phone Number, User Settings, Rewarded Video Settings, Company Information}
are only accessible by the account owner, and not by any other MoPub users.

Not at all, these fields are still accessible for other users invited by the administrator. so the XSS can still be triggered on the other end. 

And also a member can inject a malicious payload on **currency** that can trigger on administrator's end.
- **2019-03-04** @giddsec: Hello @jknguyen, Is this still eligible for a bounty? Thanks!
- **2019-03-06** @giddsec: I think it's already fixed, can you update the status here?
- **2019-03-12** @giddsec: Hello @jknguyen, any updates?
- **Bounty Awarded**
- **2019-03-13** @giddsec: Thanks for the bounty! :)
- **Report Resolved**
- **2019-03-22** @giddsec: Hello @jknguyen, can we publicly disclose this? Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
