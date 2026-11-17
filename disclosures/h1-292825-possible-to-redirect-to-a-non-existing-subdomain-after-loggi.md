---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/open-redirect
  - env/web
substate: "resolved"
weakness: "Open Redirect"
enriched: true
date: 2017-11-25
submitted: 2017-11-24T19:06:06.369Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/ed|Ed]]"
reporter: "jackds"
source: "https://hackerone.com/reports/292825"
title: "Possible to redirect to a (non-existing) subdomain after logging in via GitHub (leaking the token)"
---
# Possible to redirect to a (non-existing) subdomain after logging in via GitHub (leaking the token)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** Ed | **Disclosed:** 2017-11-25

- Report: [https://hackerone.com/reports/292825](https://hackerone.com/reports/292825)
- CWE: Open Redirect
- Submitted: 2017-11-24T19:06:06.369Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-11-24** @edoverflow: Uhm... @jackds, did you just hack GitHub?!

{F242110}
{F242111}
- **2017-11-24** @jackds: For the record: I submitted this issue to GH now as well ;)
- **Report Resolved**
- **2017-11-24** @jackds: Confirm. Issue is "fixed".
- **Report Severity Updated**
- **2017-11-25** @jackds: Github's response: We have reviewed your report and validated your findings. After internally assessing the finding we have determined is is a known low risk issue. We may make this functionality more strict in the future, but don't have anything to announce now.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-11-26** @jackds: frog
- **Swag Awarded**
