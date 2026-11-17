---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2017-11-06
submitted: 2017-06-23T21:39:36.043Z
bounty_usd: 1024
votes: 75
cve: []
program: "[[programs/discourse|Discourse]]"
reporter: "mishre"
source: "https://hackerone.com/reports/242765"
title: "Any user with invite capabilities can take-over any account on Discourse"
---
# Any user with invite capabilities can take-over any account on Discourse

> **Severity:** Critical | **Bounty:** 1,024 USD | **Votes:** 75 | **Program:** Discourse | **Disclosed:** 2017-11-06

- Report: [https://hackerone.com/reports/242765](https://hackerone.com/reports/242765)
- CWE: N/A
- Submitted: 2017-06-23T21:39:36.043Z

## Timeline

- **Report Filed**
- **2017-06-24** @asuka: Thanks for reporting @mishre, I confirmed this vulnerability and I'm escalating this to the Discourse team. Cheers!
- **2017-06-28** @mishre: Hey, 
Was this triaged? Seems like a pretty serious issue.
- **2017-06-28** @asuka: Hey @mishre,

We're still looking into this and we'll get back to you as soon as we have an update.

Cheers
- **2017-07-06** @mishre: Hey, still no updates regarding this?
- **2017-07-07** @discourse_user: sorry, we are going to look at this asap
- **2017-07-08** @discourse_user: We have confirmed and fixed the issue. The disposable invite feature (meant to only be available via API) was insecure and so we have removed it.

https://github.com/discourse/discourse/commit/f1a6449e4be0efe4a11fba75729d9499924b5602
- **2017-07-08** @mishre: Hey,
Seems fixed now. Great job!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2017-07-09** @discourse_user: It will need to wait 90 days due to the severity of the report. @asuka can you set that date via a scheduler?
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **2017-08-01** @discourse_user: not quite, this has step by step repro. So I need to block disclosure for 90 days as previously requested. If opening and asking for more info is the only way I can figure out to do it, then that's how it has to be done..
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
