---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/xss
  - vuln/authentication-bypass
  - trigger/social-engineering
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2018-10-07
submitted: 2018-08-10T15:15:07.563Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/snapchat|Snapchat]]"
reporter: "malcolmx"
source: "https://hackerone.com/reports/392785"
title: "Domain Takeover in [obviousengine.com] a snapchat acquisitions"
---
# Domain Takeover in [obviousengine.com] a snapchat acquisitions

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Snapchat | **Disclosed:** 2018-10-07

- Report: [https://hackerone.com/reports/392785](https://hackerone.com/reports/392785)
- CWE: Privilege Escalation
- Submitted: 2018-08-10T15:15:07.563Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

##Summary
while searching in snapchat acquisitions i found  ` obviousengine ` moe information here https://www.crunchbase.com/organization/obvious-engineering#section-overview
and i found that it's pointing to Github page so i claimed it 

##POC
- when i visit it was look like 

{F331040}

- i successfully takeover it 

{F331041}

## Impact

Domain takeover is abused for several purposes:

* Malware distribution
* Phishing / Spear phishing
* XSS
* Authentication bypass
* ...

Thanks

## Timeline

- **Report Filed**
- **2018-08-10** @bugtriage-josh: Thank you for your report.

We're looking into this and will keep you updated when we have additional information.
- **2018-08-12** @malcolmx: @bugtriage-josh @snapchat 

another prove you can edit the index page from here https://github.com/eldeebxboy/obviousengine.com
- **Report Triaged**
- **2018-08-15** @malcolmx: Hi @cgrayson 

should i delete the CNAME from repository if you want to use it again?
- **2018-08-17** @malcolmx: @cgrayson @snapchat
- **2018-08-20** @malcolmx: @cgrayson @snapchat
any updates?

Regards
- **2018-08-22** @malcolmx: @cgrayson @snapchat
any updates?

Regards
- **2018-08-27** @malcolmx: @cgrayson @snapchat 

any response?
- **2018-08-28** @malcolmx: @cgrayson @snapchat @bugtriage-josh 

should i delete the CNAME from repository if you want to use it again?
- **2018-08-28** @malcolmx: @cgrayson @snapchat 

why no response guys?
- **2018-08-28** @michael_xu: @malcolmx thanks for your extra patience. We're waiting on an internal response at the moment, but we'll double check that process for this bug.
- **Report Resolved**
- **2018-08-29** @malcolmx: Hi @michael_xu @snapchat 

you guys paid many times for the issue on your acquisitions before, please see 
- 
- https://hackerone.com/reports/314594
- https://hackerone.com/reports/114134
- **2018-08-29** @michael_xu: @malcolmx 

When a report is out-of-scope, we may reward a bounty at our discretion based on impact. Unfortunately, obviousengine.com has very weak ties back to Snap and doesn't appear to have been the primary public facing website for that company.

While we appreciate your work, understand that setting the scope is our way of guiding researchers towards impactful bugs in real business areas. Routinely paying out a bounty for low impact, out-of-scope bugs distracts researchers and incentivizes going after any low-hanging fruit that's even slightly related to Snap. We don't want this.

Therefore, we made the tough decision to not pay a bounty for this report. We're doing our best to be disciplined about our scoping, in order to ensure its effectiveness long-term.

Thank you for your understanding! Best of luck in the future!
- **2018-08-29** @malcolmx: @michael_xu 

i undersatnd this , However pay to one and not for other on the same bug is unfair, i just looked to the public reports and started working like other however all my time gone for nothing this really unfair
- **2018-08-29** @michael_xu: @malcolmx I understand your frustration. The best way to guarantee a bounty is to select a target that is in scope. Again, paying a bounty for out-of-scope reports is the exception and not the norm.

Thanks!
- **2018-08-29** @malcolmx: @michael_xu 

i hope you guys take another look here and appreciate time and efforts here

Thanks
- **2018-08-30** @malcolmx: @michael_xu @snapchat 

BY the way the vulnerability still not fixed yet
- **Hacker Requested Mediation**
- **2018-09-04** @michael_xu: @malcolmx an internal team is handling the issue. We understand the problem and how to reclaim the domain, but it isn’t the highest priority at the moment.

Thank you for your patience.
- **2018-09-04** @michael_xu: @malcolmx as a side note: you published a medium article about the issue while the discussion was still active. The report has not been publicly disclosed. Please do not do this in the future. It also makes your write up request redundant.

Thanks,
Michael
- **2018-09-04** @malcolmx: @michael_xu 

1. you shouldn't close my report as resolved since the bug is still not fixd
2. i deleted the article and commented to you

Thanks
- **Comments Closed**
- **Agreed On Going Public**
- **Not Eligible For Bounty**
- **Report Became Public**
