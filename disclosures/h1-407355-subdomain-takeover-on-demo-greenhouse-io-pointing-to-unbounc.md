---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/phishing
  - env/web
substate: "resolved"
weakness: "Phishing"
enriched: true
date: 2020-03-05
submitted: 2018-09-08T00:08:11.421Z
bounty_usd: null
votes: 76
cve: []
program: "[[programs/greenhouse|Greenhouse.io]]"
reporter: "ninadmathpati"
source: "https://hackerone.com/reports/407355"
title: "Subdomain Takeover on demo.greenhouse.io pointing to unbouncepages"
---
# Subdomain Takeover on demo.greenhouse.io pointing to unbouncepages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 76 | **Program:** Greenhouse.io | **Disclosed:** 2020-03-05

- Report: [https://hackerone.com/reports/407355](https://hackerone.com/reports/407355)
- CWE: Phishing
- Submitted: 2018-09-08T00:08:11.421Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2018-09-13** @ninadmathpati: Hello @rongutierrez i guess the impact of vulnerability is clear so why do i get less than what another reporter got eg:- https://hackerone.com/reports/38007  As of me i guess you should rethink of my bounty decision as this is a higher impact vulnerability.

Thank you 
Hacker2202
- **2018-09-17** @ninadmathpati: Hello sir,
Any update on bounty?
- **2018-09-19** @ninadmathpati: Hello sir,

Any update?
- **2018-09-19** @rongutierrez: Hi @hacker2202, 

The report you referenced was against a higher profile domain of than this one and also included a working proof of concept. We consider 'demo.greenhouse.io' to be a lower profile domain. In the past we have only rewarded $100 on low profile domains and when a PoC is not included. We decided to provide you with a $500 so its in between the two previous bounties. 

Also, when researching unbounce's security controls there appears like they would perform domain ownership verification if the domain was previously deleted. 

Reference - https://documentation.unbounce.com/hc/en-us/articles/360000851786

Hope this helps clear up on how we decided on the bounty amount.
- **2018-09-21** @ninadmathpati: Okay no worries, thanks for the bounty.
- **Agreed On Going Public**
- **Report Became Public**
