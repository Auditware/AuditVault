---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-04-01
submitted: 2019-08-21T19:18:14.807Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rcejules"
source: "https://hackerone.com/reports/678727"
title: "potential RCE and XSS via file upload requiring user account and default settings"
---
# potential RCE and XSS via file upload requiring user account and default settings

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Nextcloud | **Disclosed:** 2020-04-01

- Report: [https://hackerone.com/reports/678727](https://hackerone.com/reports/678727)
- CWE: Code Injection
- Submitted: 2019-08-21T19:18:14.807Z

## Timeline

- **Report Filed**
- **2019-08-21** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Needs More Info**
- **Report New**
- **2019-08-23** @rcejules: example Conf File
- **2019-08-23** @nickvergessen: Right, thanks for the pointer, we will fix this as a hardening with https://github.com/nextcloud/server/pull/16846
- **Report Triaged**
- **Swag Awarded**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-11-27** @rcejules: Thanks Nick for the quick fix. I am a big fan of Nextcloud. Since there was no bounty, I assume it was not eligible is that correct?
- **2019-11-27** @nickvergessen: Yeah, sorry. See the message from Aug 23rd
> Nextcloud has decided that this report is not eligible for a bounty.
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
