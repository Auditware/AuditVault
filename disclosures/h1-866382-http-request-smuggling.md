---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "informative"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-06-04
submitted: 2020-05-05T11:39:58.197Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "dracomalfoy"
source: "https://hackerone.com/reports/866382"
title: "HTTP Request Smuggling"
---
# HTTP Request Smuggling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Brave Software | **Disclosed:** 2020-06-04

- Report: [https://hackerone.com/reports/866382](https://hackerone.com/reports/866382)
- CWE: HTTP Request Smuggling
- Submitted: 2020-05-05T11:39:58.197Z

## Timeline

- **Report Filed**
- **2020-05-06** @dracomalfoy: Furthermore, Using this vulnerability, Self XSS can be further exploited ad delivered to the victim, making this vulnerability critical.
- **Report Severity Updated**
- **2020-05-07** @jseidl: @dracomalfoy I tried to reproduce the issue with your Script (using the rockyou wordlist) and with the given request and wasn't able to get any `200`s.

Also tried changing `Connection` from `close` to `keep-alive` as in your screenshot and also adding the `X-CSRF-Token` header present in your screenshot too.

I've tried adding 500 `x` entries to the wordlist as your success was with this payload, also no dice.

Can you please give further/double check the PoC information?
- **Report Needs More Info**
- **Report New**
- **2020-05-08** @dracomalfoy: I had to change turbo intruder script. Adding it here
- **2020-05-11** @dracomalfoy: Hi team, 
Any updates on this?
- **2020-05-12** @jseidl: Hi @dracomalfoy sorry for the delay on getting back to you. Have been trying to reproduce in the past days with different wordlists. The behavior I'm getting is that after a few (<10) requests, Heroku's proxy bans me and gives me the "Too many requests".

We do not have any proxy ourselves in front of the app so what you might be dealing with Heroku's own proxy issues and not with our app itself.

I recommend you reaching out to Heroku's security team at https://www.heroku.com/policy/security and report this issue to them.
- **Report Informative**
- **2020-05-13** @dracomalfoy: It might a problem of 3rd party component but it impact your asset. It is exploitable and can cause impact on security. I know it is a issue which take efforts to reproduce.
Anyways, I respect your decision.
- **2020-05-14** @dracomalfoy: Am I allowed to write about this in my blog?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
