---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2018-08-28
submitted: 2018-05-13T01:14:32.363Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/valve|Valve]]"
reporter: "chippy"
source: "https://hackerone.com/reports/351016"
title: "Malformed Skybox .TGA in Half-Life (GoldSRC) leads to Access Violation"
---
# Malformed Skybox .TGA in Half-Life (GoldSRC) leads to Access Violation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Valve | **Disclosed:** 2018-08-28

- Report: [https://hackerone.com/reports/351016](https://hackerone.com/reports/351016)
- CWE: Classic Buffer Overflow
- Submitted: 2018-05-13T01:14:32.363Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-07-14** @chippy: Hello, may I kindly have an update on this?
- **2018-07-14** @eyeq: Hi @chippy,

Thanks again for the report, we're still looking into this and will respond in this ticket as soon as we have an update. Apologies for any inconvenience.

Kind regards,
@EyeQ
- **2018-07-19** @mikela: Hi @chippy, sorry for the delay in responding to this issue. I've looked closely into this report and believe that, while it is definitely a vector for crashing the clients of connected players, it isn't very likely or potentially even possible to turn this issue into a viable remote code exploit. This is still a danger to users and is a valid buffer overflow, but due to the likelihood of being able to focus this into a targeted attack I believe the appropriate severity for this issue to be high rather than critical.

I would be happy to update the severity back to critical if you are able to provide a test case that shows you are able to modify a user's process in an intentional way utilizing this exploit.

Thank you for the detailed submission!
- **Report Severity Updated**
- **2018-07-26** @chippy: Hello @mikela , appreciate the follow up! We are in agreement, after expanding on our research we've audited the vulnerability thoroughly and could not expand upon the original PoC. More than fair to close this one out as "High", more bugs to follow. Thanks as always!
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
