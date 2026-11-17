---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2019-06-24
submitted: 2018-08-31T12:48:47.276Z
bounty_usd: null
votes: 824
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "fransrosen"
source: "https://hackerone.com/reports/403417"
title: "Remote Code Execution on www.semrush.com/my_reports on Logo upload"
---
# Remote Code Execution on www.semrush.com/my_reports on Logo upload

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 824 | **Program:** Semrush | **Disclosed:** 2019-06-24

- Report: [https://hackerone.com/reports/403417](https://hackerone.com/reports/403417)
- CWE: Command Injection - Generic
- Submitted: 2018-08-31T12:48:47.276Z

## Timeline

- **Report Filed**
- **2018-08-31** @slowstock: Thanks for the report, we will investigate this.
- **2018-08-31** @security_semrush: Hello Frans, it's Andrey Leonov (https://4lemon.ru/2017-01-17_facebook_imagetragick_remote_code_execution.html).
Shame on my head =)

Nice catch!

We are investigating this issue.
- **2018-08-31** @fransrosen: OMG! HUGE FAN! <3
This is amazing, the circle of life :D
- **2018-08-31** @security_semrush: {F340512}
"baseball-bat of goodness"
I'm going to the appropriate team =)
- **2018-08-31** @fransrosen: LOL
- **Report Triaged**
- **Bounty Awarded**
- **2018-08-31** @fransrosen: Wow, thank you very very much! And what an impressive speed, amazing!
- **2018-08-31** @slowstock: Could you please check the hotfix?
- **2018-08-31** @fransrosen: Confirmed, I was not able to get it to trigger now, only:

```
"err":["corruptedImage"]
```

Tried some ways around it but no luck. You are amazingly fast! Great job!
- **2018-09-20** @security_semrush: Hello Frans,

We are waiting for balance prepayment. But remember about bonus:)

Meanwhile, I want to ask you would it be interesting you if we provide you with promo-code which allows the testing paid function of our service?
- **2018-09-20** @fransrosen: Hey!
Absolutely, I would love to try :)
- **Bounty Awarded**
- **2018-09-21** @fransrosen: Thank you very much!
- **2018-09-21** @security_semrush: http://www.semrush.com/product/promo/accept.html?promo=██████████
Please use this one to make accounts. If you feel that some functionality does not work or restricted - fell free to contact us.
And do not share this promo-code with anyone.
- **2018-09-21** @fransrosen: Thanks a lot! Will have some friday evening fun :D
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
