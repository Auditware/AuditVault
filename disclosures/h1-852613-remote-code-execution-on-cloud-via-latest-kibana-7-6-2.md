---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/cloud
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-07-28
submitted: 2020-04-17T22:49:58.303Z
bounty_usd: 10000
votes: 22
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "alexbrasetvik"
source: "https://hackerone.com/reports/852613"
title: "Remote Code Execution on Cloud via latest Kibana 7.6.2"
---
# Remote Code Execution on Cloud via latest Kibana 7.6.2

> **Severity:** Critical | **Bounty:** 10,000 USD | **Votes:** 22 | **Program:** Elastic | **Disclosed:** 2020-07-28

- Report: [https://hackerone.com/reports/852613](https://hackerone.com/reports/852613)
- CWE: Privilege Escalation
- Submitted: 2020-04-17T22:49:58.303Z

## Timeline

- **Report Filed**
- **2020-04-17** @alexbrasetvik: The account I used has user_id 1710521131 and email "█████". 

The Kibana is https://02fde216d8bd4831b1976b87404aedf9.eu-central-1.aws.cloud.es.io and ES is at https://da78cc790f1b4066adb86c340f7bb014.eu-central-1.aws.cloud.es.io

No other clusters or accounts were involved. I have not run any other shell commands than the provided `whoami | curl …`
- **2020-04-17** @kovyrin: Damn, @alexbrasetvik, you are unstoppable! Seriously impressive find! 💪🏻
- **2020-04-19** @nochnoidozor: Hi @alexbrasetvik,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **2020-04-19** @douglas_day: Hey @alexbrasetvik,

Great find! And thanks for the well put together video PoC. It's useful for troglodytes like myself :)

I have indeed verified this, and I'll be putting this through the necessary steps tomorrow morning. Hang tight until then!
- **Report Triaged**
- **2020-04-20** @alexbrasetvik: Thanks for the quick update :)
- **Bounty Awarded**
- **2020-04-20** @alexbrasetvik: Wow, thanks a lot for the bounty and bonus :)

Happy to retest when you're ready. :)
- **2020-04-20** @anthony_meehan: Well deserved. Find more prototype pollution :)

-Tony
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-07-28** @douglas_day: done :)
