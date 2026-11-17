---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
  - stack/node
substate: "resolved"
weakness: "Heap Overflow"
enriched: true
date: 2020-02-13
submitted: 2018-04-10T15:22:13.135Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "jzebor"
source: "https://hackerone.com/reports/335495"
title: "Out of order TLS handshake / application data messages lead to segmentation fault"
---
# Out of order TLS handshake / application data messages lead to segmentation fault

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js | **Disclosed:** 2020-02-13

- Report: [https://hackerone.com/reports/335495](https://hackerone.com/reports/335495)
- CWE: Heap Overflow
- Submitted: 2018-04-10T15:22:13.135Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-05-01** @jzebor: James, hope you are doing well. I just found out from my company HR team that I will be unable to accept any cash bounty for this bug. While it's not my favorite decision, I understand and accept the reasoning.

This bug report is free and does not request any cash bounty.

Take care,
Jordan
- **2018-05-24** @jzebor: James, hope you are doing well. Can you please let me know the disclosure timeline for this issue and #335533 ? It's been roughly a month since I've heard from you. 

Let me know,

Thanks
Jordan
- **2018-05-24** @jasnell: My sorry for the delay. We have the fixes ready to go (and have for a few weeks) but we had a delay on coordinating the release for the Node.js 8.x release line. I'm still not 100% certain when the release is scheduled for but I *will* follow up and get this figured out.

I did want to follow up with you and ask if you had a chance to clarify if you were able to receive the bounty on these reports?
- **2018-05-24** @jasnell: Ok, I'm going to push for the release to go out week after next. We need to publish an announcement giving folks a heads up that a security release is coming... those usually go out a week in advance of the actual disclosure and release.
- **2018-05-24** @jzebor: Re: Bounty -- See my message from May 1st. I cannot accept the bounty. This one is free.

Thanks and take care.
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
