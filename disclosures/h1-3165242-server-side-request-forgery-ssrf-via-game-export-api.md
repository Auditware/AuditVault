---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2025-06-03
submitted: 2025-05-28T09:36:50.362Z
bounty_usd: null
votes: 116
cve: []
program: "[[programs/lichess|Lichess]]"
reporter: "oblivionsage"
source: "https://hackerone.com/reports/3165242"
title: "Server-Side Request Forgery (SSRF) via Game Export API"
---
# Server-Side Request Forgery (SSRF) via Game Export API

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 116 | **Program:** Lichess | **Disclosed:** 2025-06-03

- Report: [https://hackerone.com/reports/3165242](https://hackerone.com/reports/3165242)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2025-05-28T09:36:50.362Z

## Timeline

- **Report Filed**
- **2025-05-28** @oblivionsage: Just to add:
I actually found this vulnerability by looking through the official lichess-org/lila code on GitHub. That means it’s not just lichess.org that’s affected anyone running their own Lichess server or using this code (including forks and self-hosted versions) will be vulnerable too, unless they patch it.
So this issue doesn’t just impact the main site, but could affect a lot of other projects and players out there as well
- **2025-05-30** @oblivionsage: Hi team is there any update?
- **2025-06-02** @oblivionsage: Hi Lichess Team,

I hope you're doing well. I submitted a Server-Side Request Forgery vulnerability report, I wanted to check if you had a chance to review the report.I'm happy to provide any additional information or clarification if needed. The vulnerability allows making HTTP requests to arbitrary URLs including internal networks, so I wanted to ensure it gets proper attention

Thanks for your time and looking forward to hearing from you

Best regards

@oblivionsage
- **Report Resolved**
- **2025-06-02** @shrimpmode: We have precise monitoring of the usage of that feature, and fortunately it doesn't seem like it has ever been abused, so far.
- **2025-06-02** @oblivionsage: Hi @shrimpmode 

Thanks so much for the quick fix and sorry about the delay on my end too! Really appreciate you taking this seriously and removing the feature entirely - that's definitely the safest approach

Quick question: since this was a legitimate vulnerability with a public fix, would it make sense to request a CVE for it? No pressure at all, just thought it might be worth considering

Also, completely unrelated but... any chance you'd be up for a quick chess game sometime?  Would be fun to play on the platform with  main dev

Thanks again for being so responsive and professional about this

Cheers!
- **Agreed On Going Public**
- **2025-06-03** @oblivionsage: Awesome, thanks so much @shrimpmode 

CVE process  just to clarify, HackerOne doesn't automatically handle CVE requests. It's usually either:

1. The vendor (you guys) requests it from MITRE, or 
2. The researcher (me) can request it on behalf of the project

I'm happy to handle the CVE request through MITRE if you'd like - it's pretty straightforward and I've done it before. Or if you prefer to do it yourselves, that's totally fine too Either way works

For chess: My username is Halil214  Really excited to play :D
- **2025-06-03** @shrimpmode: OK, please do handle the CVE request then.
- **2025-06-03** @oblivionsage: Hi @shrimpmode ,

Just submitted the CVE request and used this report as reference, so I'll need to make it public for MITRE to see

Publishing now  thanks for everything!

@oblivionsage
- **Agreed On Going Public**
- **Report Became Public**
