---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2026-07-03
submitted: 2026-06-18T06:55:35.065Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/essity|Essity]]"
reporter: "firecompass-ai"
source: "https://hackerone.com/reports/3809973"
title: "Error-Based SQL Injection in ████████.com Login/Password Reset (username parameter)"
---
# Error-Based SQL Injection in ████████.com Login/Password Reset (username parameter)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Essity | **Disclosed:** 2026-07-03

- Report: [https://hackerone.com/reports/3809973](https://hackerone.com/reports/3809973)
- CWE: SQL Injection
- Submitted: 2026-06-18T06:55:35.065Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-06-24** @hugolevisse: Hello @firecompass-ai 
The team informed me they deployed some changes that should have addressed the issue. Could you please confirm?
Thank you so much in advance!
Essity AppSec Team
- **2026-06-24** @firecompass-ai: Hi @hugolevisse 

Sure we've repeated the same payload earlier in the report, as far we don't not see the SQL query error output just like the report, below are the screenshots
████████
████████
████████

We've confirmed that the changes worked. Please let us know if you need anything else

Best Regards,
Firecompass Team
- **Report Resolved**
- **2026-07-03** @firecompass-ai: Hi @ariannac, hope you're doing well! 
Now that this report has been resolved, I wanted to check in — would you be open to coordinated disclosure? I'm happy to go with either a Full or Limited disclosure, whichever you're more comfortable with. Just let me know your preference and I'll follow your lead. 
Thanks for the great collaboration!
- **Agreed On Going Public**
- **Manually Disclosed**
