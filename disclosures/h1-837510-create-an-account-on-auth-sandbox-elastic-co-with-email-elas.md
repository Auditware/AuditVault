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
date: 2020-12-28
submitted: 2020-04-02T19:00:10.940Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "superman85"
source: "https://hackerone.com/reports/837510"
title: "Create an account on auth-sandbox.elastic.co with email @elastic.co or any other @domain.com"
---
# Create an account on auth-sandbox.elastic.co with email @elastic.co or any other @domain.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Elastic | **Disclosed:** 2020-12-28

- Report: [https://hackerone.com/reports/837510](https://hackerone.com/reports/837510)
- CWE: Improper Access Control - Generic
- Submitted: 2020-04-02T19:00:10.940Z

## Timeline

- **Report Filed**
- **2020-04-02** @superman85: I have created new account info@elastic.co and recorded a video PoC
{F771098}
For quick triage process, I can provide 2 accounts with @elastic.co for you. Feel free to ask
- **2020-04-03** @superman85: If this report is valid, is it eligible for Cloud Promotion and Achivement bounties :D I think via `adminconsole` with `Sudo` permisson we can do more things but I have not tried
- **Report Triaged**
- **2020-04-03** @superman85: @lugtag Can I explore `adminconsole` dashboard to find out what I can do with Elastic Cloud Instances? Please ask Elastic Team if I can able to do that.

Thanks,
- **2020-04-03** @douglas_day: Hey @superman85 ,

Please do not explore the `adminconsole` dashboard. Our team is evaluating the implications/severity and will update you today.

Thanks!
- **2020-04-03** @superman85: @douglas_day Thanks for your information. I did not touch anything.
- **2020-04-03** @douglas_day: I believe you :) We're investigating internally at the moment and I will try my best to award your bounty today.
- **Bounty Awarded**
- **2020-04-03** @superman85: @douglas_day @the_arch_angel Thank you so much for the bounty. I am OK with your decision and Bounties.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
