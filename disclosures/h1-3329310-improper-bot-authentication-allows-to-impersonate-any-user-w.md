---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2025-11-21
submitted: 2025-09-06T15:24:38.403Z
bounty_usd: 2000
votes: 128
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "stackered"
source: "https://hackerone.com/reports/3329310"
title: "Improper bot-authentication allows to impersonate any user when sending messages in a room"
---
# Improper bot-authentication allows to impersonate any user when sending messages in a room

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 128 | **Program:** Basecamp | **Disclosed:** 2025-11-21

- Report: [https://hackerone.com/reports/3329310](https://hackerone.com/reports/3329310)
- CWE: Improper Authentication - Generic
- Submitted: 2025-09-06T15:24:38.403Z

## Timeline

- **Report Filed**
- **2025-09-09** @jacopo-beschi: Thanks! I confirm the validity of the report.

I'll provide you with a bounty soon.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **2025-09-10** @jacopo-beschi: Just a quick update: we’ll be removing bounties from Campfire, as the project is now open source and we no longer have funding for them. I’m discussing with the team how best to handle the existing reports.
I’ll keep you posted.
- **Bounty Awarded**
- **2025-09-10** @jacopo-beschi: Hi, I just provided you with a bounty of 2000$: We decided to provide bounty to existing Campfire reports but we'll no longer provide bounties to that assets.

We just released a fix in [release 1.1.8](https://github.com/basecamp/chatinabox/releases/tag/v1.1.8). Can you confirm you can no longer reproduce it? 

Thanks
- **Report Triaged**
- **2025-09-10** @stackered: Hi, thanks for the bounty !

I cannot access the link you provided to verify. I get a 404 error.
- **2025-09-11** @jacopo-beschi: Sorry, I just pushed the fix [to the OSS repo](https://github.com/basecamp/once-campfire), can you verify it now?

Thanks
- **2025-09-11** @stackered: Hi, I confirm that I cannot reproduce the issue after the patch.
- **2025-09-11** @jacopo-beschi: Great, thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
