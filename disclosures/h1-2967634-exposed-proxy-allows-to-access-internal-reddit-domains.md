---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-02-24
submitted: 2025-01-30T22:59:04.378Z
bounty_usd: 7500
votes: 296
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "la_revoltage"
source: "https://hackerone.com/reports/2967634"
title: "Exposed proxy allows to access internal reddit domains"
---
# Exposed proxy allows to access internal reddit domains

> **Severity:** High | **Bounty:** 7,500 USD | **Votes:** 296 | **Program:** Reddit | **Disclosed:** 2025-02-24

- Report: [https://hackerone.com/reports/2967634](https://hackerone.com/reports/2967634)
- CWE: Improper Access Control - Generic
- Submitted: 2025-01-30T22:59:04.378Z

## Timeline

- **Report Filed**
- **2025-01-30** @la_revoltage: From responses if proxy it is clear, that there are more endpoints which can be bruteforced, but I don't want to mess with internal infrastructure until the team reads this report
- **Report Severity Updated**
- **2025-01-31** @h1_analyst_dave: Hi @la_revoltage,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_dave
- **Report Pending Program Review**
- **2025-01-31** @la_revoltage: Note:
It is also possible to get some information about other internal services through verbose erros, like kubernetes/snooguts:
█████
██████████
- **Report Triaged**
- **2025-01-31** @les_oeufs: Erm this doesn't look good/right. Let me ask around. Confirmed it's allowing me to query my own development instances of services that shouldn't be exposed publically.
- **2025-01-31** @les_oeufs: Nice find, we fixed some configs on our side to prevent this. Double check it's no longer allowing this?
- **Report Severity Updated**
- **Bounty Awarded**
- **2025-01-31** @les_oeufs: Basically this allowed you to peer into any of our developers' development instance for various services from the public internet.  That's fun :)
- **2025-01-31** @la_revoltage: Confirming the fix, the host is no longer accessible

Thanks for the bounty!
- **Report Resolved**
- **Agreed On Going Public**
- **2025-02-19** @la_revoltage: Hi @les_oeufs,
Pinging about a possible disclose
- **Agreed On Going Public**
- **Report Became Public**
