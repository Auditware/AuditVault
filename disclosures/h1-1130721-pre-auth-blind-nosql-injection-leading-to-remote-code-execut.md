---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2021-05-18
submitted: 2021-03-19T14:59:53.943Z
bounty_usd: null
votes: 20
cve: "CVE-2021-22911"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "sonarsource"
source: "https://hackerone.com/reports/1130721"
title: "Pre-Auth Blind NoSQL Injection leading to Remote Code Execution"
---
# Pre-Auth Blind NoSQL Injection leading to Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Rocket.Chat | **Disclosed:** 2021-05-18

- Report: [https://hackerone.com/reports/1130721](https://hackerone.com/reports/1130721)
- CWE: N/A | CVE: CVE-2021-22911
- Submitted: 2021-03-19T14:59:53.943Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2021-04-16** @sonarsource: Hi @markus-rocketchat 

The fix looks good!
We would like to assign a CVE for this vulnerability, should we handle it or do you want to do it?

Kind regards
- **2021-04-19** @markus-rocketchat: thank you for your feedback!

about CVE: both ways would work for us, We just would like to ask to maintain a responsible disclosure timeline for at least 30 days since the fix went live. If you want us to request the CVE, please request a disclosure of the report and the CVE will be published together with the report after the responsible disclosure.
- **Agreed On Going Public**
- **2021-05-18** @markus-rocketchat: Hi @sonarsource 
I removed the script from the report and will disclose
- **Agreed On Going Public**
- **Report Became Public**
