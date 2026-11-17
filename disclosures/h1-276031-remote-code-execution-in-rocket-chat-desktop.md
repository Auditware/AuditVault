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
date: 2018-09-18
submitted: 2017-10-10T06:22:44.191Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/276031"
title: "Remote Code Execution in Rocket.Chat Desktop"
---
# Remote Code Execution in Rocket.Chat Desktop

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Rocket.Chat | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/276031](https://hackerone.com/reports/276031)
- CWE: Code Injection
- Submitted: 2017-10-10T06:22:44.191Z

## Timeline

- **Report Filed**
- **2017-10-10** @rodrigok: Thanks @mattaustin 
I'm working to fix the issue ASAP.
- **Report Triaged**
- **2017-10-11** @mattaustin: This looks like it should solve it. I think replacing with tokens until then end is a much better way to go. I think it is still worth looking at the on load event as well to mitigate the risk from any other XSS
- **Swag Awarded**
- **2017-10-13** @mattaustin: sure its: matt@m-austin.com  Thanks!!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
